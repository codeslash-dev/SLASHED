<?php
/**
 * REST endpoints for reBEMer.
 *
 * Two routes under the existing slashed-bricks/v1 namespace:
 *
 *   POST /rebemer/preflight  — read-only, idempotent, side-effect-free.
 *     Given a proposed plan, returns reference counts for each old class
 *     id (within the current post; cross-post counting is a v1.1
 *     candidate), name collisions against existing global classes, and
 *     a defense-in-depth reserved-name check.
 *
 *   GET  /rebemer/policy     — returns the active naming policy.
 *
 * Permission gate is `bricks_full_access || manage_options` so builder
 * users can call it without needing admin rights, while admins can
 * still read it from any context. Auth is the standard wp_rest nonce.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_ReBEMer_REST
 */
class Slashed_Bricks_ReBEMer_REST {

	const ROUTE_BASE = '/rebemer';

	/** Hard size caps to keep the endpoint cheap and DoS-resistant. */
	const MAX_SUBTREE_IDS = 5000;
	const MAX_OPERATIONS  = 5000;

	/**
	 * Stateless. Routes are registered externally on rest_api_init,
	 * matching the existing Slashed_Bricks_REST_Controller pattern.
	 */
	public function __construct() {}

	/**
	 * Register both routes.
	 */
	public function register_routes() {
		register_rest_route(
			Slashed_Bricks_REST_Controller::NAMESPACE,
			self::ROUTE_BASE . '/preflight',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'preflight' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		register_rest_route(
			Slashed_Bricks_REST_Controller::NAMESPACE,
			self::ROUTE_BASE . '/policy',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_policy' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);
	}


	/**
	 * Permission gate for both routes. Builder access first because
	 * that's the actual user-facing context; manage_options as a
	 * fallback so admins can call from elsewhere (e.g. a future CLI).
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return current_user_can( 'bricks_full_access' ) || current_user_can( 'manage_options' );
	}

	/**
	 * GET /rebemer/policy — returns the current active policy.
	 *
	 * @return WP_REST_Response
	 */
	public function get_policy() {
		return rest_ensure_response( Slashed_Bricks_ReBEMer_Policy::get() );
	}

	/**
	 * POST /rebemer/preflight — see class docblock for contract.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function preflight( WP_REST_Request $request ) {
		$body = $request->get_json_params();
		if ( ! is_array( $body ) ) {
			return new WP_Error( 'rebemer_invalid_body', __( 'Body must be a JSON object.', 'slashed-bricks' ), array( 'status' => 400 ) );
		}

		$root_id          = isset( $body['rootId'] ) && is_string( $body['rootId'] ) ? sanitize_key( $body['rootId'] ) : '';
		$current_post_id  = isset( $body['currentPostId'] ) ? absint( $body['currentPostId'] ) : 0;
		$subtree_ids_raw  = isset( $body['subtreeElementIds'] ) && is_array( $body['subtreeElementIds'] ) ? $body['subtreeElementIds'] : array();
		$operations_raw   = isset( $body['operations'] ) && is_array( $body['operations'] ) ? $body['operations'] : array();

		if ( count( $subtree_ids_raw ) > self::MAX_SUBTREE_IDS || count( $operations_raw ) > self::MAX_OPERATIONS ) {
			return new WP_Error( 'rebemer_too_large', __( 'Plan exceeds size limits.', 'slashed-bricks' ), array( 'status' => 400 ) );
		}

		$subtree_ids = array();
		foreach ( $subtree_ids_raw as $id ) {
			if ( is_string( $id ) && '' !== $id ) {
				$subtree_ids[] = sanitize_key( $id );
			}
		}


		$operations = array();
		foreach ( $operations_raw as $op ) {
			if ( ! is_array( $op ) ) {
				continue;
			}
			$operations[] = array(
				'elementId'      => isset( $op['elementId'] ) && is_string( $op['elementId'] ) ? sanitize_key( $op['elementId'] ) : '',
				'oldClassIds'    => isset( $op['oldClassIds'] ) && is_array( $op['oldClassIds'] ) ? array_values( array_filter( $op['oldClassIds'], 'is_string' ) ) : array(),
				'finalClassName' => isset( $op['finalClassName'] ) && is_string( $op['finalClassName'] ) ? $op['finalClassName'] : '',
			);
		}

		$global_classes = $this->read_global_classes();
		$ref_counts     = $this->count_references( $subtree_ids, $operations, $current_post_id, $global_classes );
		$collisions     = $this->detect_name_collisions( $operations, $global_classes );
		$reserved_hits  = $this->detect_reserved_hits( $operations );

		return rest_ensure_response(
			array(
				'referenceCounts' => (object) $ref_counts,
				'nameCollisions'  => $collisions,
				'reservedHits'    => $reserved_hits,
			)
		);
	}

	/**
	 * Read bricks_global_classes WITHOUT triggering our SLASHED-injected
	 * entries — the option_bricks_global_classes filter would otherwise
	 * fold our managed entries in, which we don't want for ref counting.
	 * remove_all_filters() temporarily on this key, restore after.
	 *
	 * Practical compromise: just call get_option() and let SLASHED
	 * entries through. They have unique sf-/is- prefixed ids so they
	 * never collide with user-created classes; ref counting against
	 * them will return 0 because they're not used anywhere except via
	 * filter injection.
	 *
	 * @return array
	 */
	private function read_global_classes() {
		$raw = get_option( 'bricks_global_classes', array() );
		return is_array( $raw ) ? $raw : array();
	}


	/**
	 * Count how many elements OUTSIDE the current subtree still use
	 * each old class id, scoped to the current post for v1. Cross-post
	 * scanning is deferred — it would mean a WP_Query over every Bricks
	 * post type with serialized-content searching, which is too expensive
	 * to do synchronously.
	 *
	 * @param array $subtree_ids
	 * @param array $operations
	 * @param int   $current_post_id
	 * @param array $global_classes
	 * @return array<string, array{name:string, outsideSubtreeOnPage:int, otherPosts:int}>
	 */
	private function count_references( $subtree_ids, $operations, $current_post_id, $global_classes ) {
		$watched = array();
		foreach ( $operations as $op ) {
			foreach ( $op['oldClassIds'] as $cid ) {
				if ( is_string( $cid ) && '' !== $cid ) {
					$watched[ $cid ] = true;
				}
			}
		}
		if ( empty( $watched ) ) {
			return array();
		}

		$id_to_name = array();
		foreach ( $global_classes as $c ) {
			if ( is_array( $c ) && isset( $c['id'] ) && isset( $watched[ $c['id'] ] ) ) {
				$id_to_name[ $c['id'] ] = isset( $c['name'] ) ? (string) $c['name'] : '';
			}
		}

		$subtree_set    = array_flip( $subtree_ids );
		$outside_counts = array_fill_keys( array_keys( $watched ), 0 );

		if ( $current_post_id > 0 ) {
			$meta_keys = array( '_bricks_page_content_2', '_bricks_header_content', '_bricks_footer_content' );
			foreach ( $meta_keys as $meta_key ) {
				$tree = get_post_meta( $current_post_id, $meta_key, true );
				if ( ! is_array( $tree ) ) {
					continue;
				}
				$this->scan_tree_for_classes( $tree, $subtree_set, $watched, $outside_counts );
			}
		}


		$result = array();
		foreach ( $watched as $cid => $_ ) {
			$result[ $cid ] = array(
				'name'                 => isset( $id_to_name[ $cid ] ) ? $id_to_name[ $cid ] : '',
				'outsideSubtreeOnPage' => isset( $outside_counts[ $cid ] ) ? (int) $outside_counts[ $cid ] : 0,
				'otherPosts'           => 0, // v1.1 candidate.
			);
		}
		ksort( $result );
		return $result;
	}

	/**
	 * Walk a Bricks element tree and tally references to watched class ids.
	 *
	 * @param array $tree
	 * @param array $subtree_set     [id => true]
	 * @param array $watched         [classId => true]
	 * @param array $outside_counts  classId => running count, mutated
	 */
	private function scan_tree_for_classes( $tree, $subtree_set, $watched, &$outside_counts ) {
		foreach ( $tree as $el ) {
			if ( ! is_array( $el ) || ! isset( $el['id'] ) || ! is_string( $el['id'] ) ) {
				continue;
			}
			if ( isset( $subtree_set[ $el['id'] ] ) ) {
				continue;
			}
			$css = isset( $el['settings']['_cssGlobalClasses'] ) ? $el['settings']['_cssGlobalClasses'] : array();
			if ( ! is_array( $css ) ) {
				continue;
			}
			foreach ( $css as $cid ) {
				if ( is_string( $cid ) && isset( $watched[ $cid ] ) ) {
					$outside_counts[ $cid ]++;
				}
			}
		}
	}


	/**
	 * Find every operation whose final class name already exists as a
	 * global class — the client will warn or fold into the existing
	 * class on apply.
	 *
	 * @param array $operations
	 * @param array $global_classes
	 * @return array
	 */
	private function detect_name_collisions( $operations, $global_classes ) {
		$by_name = array();
		foreach ( $global_classes as $c ) {
			if ( is_array( $c ) && isset( $c['name'] ) && is_string( $c['name'] ) && '' !== $c['name'] ) {
				$by_name[ $c['name'] ] = isset( $c['id'] ) ? (string) $c['id'] : '';
			}
		}
		$out = array();
		foreach ( $operations as $op ) {
			$name = $op['finalClassName'];
			if ( '' === $name ) {
				continue;
			}
			if ( isset( $by_name[ $name ] ) ) {
				$out[] = array(
					'finalClassName'  => $name,
					'existingClassId' => $by_name[ $name ],
					'match'           => 'byName',
				);
			}
		}
		return $out;
	}

	/**
	 * Defense in depth: even though the client validated names, the
	 * server checks them again so a tampered client can't bypass the
	 * reserved-name guard.
	 *
	 * @param array $operations
	 * @return array
	 */
	private function detect_reserved_hits( $operations ) {
		$policy = Slashed_Bricks_ReBEMer_Policy::get();
		$out    = array();
		foreach ( $operations as $op ) {
			$name = $op['finalClassName'];
			if ( '' === $name ) {
				continue;
			}
			$reason = Slashed_Bricks_ReBEMer_Policy::classify_reserved( $name, $policy );
			if ( null !== $reason ) {
				$out[] = array(
					'finalClassName' => $name,
					'reason'         => $reason,
				);
			}
		}
		return $out;
	}
}
