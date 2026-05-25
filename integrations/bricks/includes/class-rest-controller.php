<?php
/**
 * REST endpoints powering the Svelte admin SPA.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_REST_Controller
 *
 * Exposes a small JSON surface so the Svelte admin page can save and
 * reset token sections without page reloads. Auth uses the standard WP
 * REST nonce (X-WP-Nonce header) plus the manage_options capability;
 * sanitization and option storage are delegated to the legacy admin
 * page class so both UIs share one source of truth.
 *
 * Routes
 * ------
 *   POST /wp-json/slashed-bricks/v1/tokens
 *     Body: { section: string, values: object }
 *     Returns the sanitized values that were persisted, so the SPA can
 *     reflect server-side normalization back into its state.
 *
 *   POST /wp-json/slashed-bricks/v1/tokens/reset
 *     Body: { section: string }       // empty string resets every section
 *     Returns the new effective settings map (post-reset).
 *
 * Why POST-only: WordPress REST nonces ride on POST headers naturally
 * via X-WP-Nonce; using POST for both write paths keeps the auth
 * model uniform and avoids URL-cache surprises.
 */
class Slashed_Bricks_REST_Controller {

	/**
	 * REST namespace and version.
	 */
	const NAMESPACE = 'slashed-bricks/v1';

	/**
	 * Reference to the admin page class so we can reuse its sanitizer
	 * and tab metadata. Kept private; the SPA never sees it.
	 *
	 * @var Slashed_Bricks_Admin_Page
	 */
	private $admin_page;

	/**
	 * Constructor.
	 *
	 * @param Slashed_Bricks_Admin_Page $admin_page Existing admin page instance whose
	 *                                              sanitization helpers we reuse.
	 */
	public function __construct( Slashed_Bricks_Admin_Page $admin_page ) {
		$this->admin_page = $admin_page;
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register the REST routes.
	 */
	public function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/tokens',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'save_section' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'section' => array(
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'sanitize_key',
					),
					'values'  => array(
						'type'                 => 'object',
						'required'             => true,
						'additionalProperties' => array(
							'type'      => 'string',
							'maxLength' => 512,
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/tokens/reset',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'reset_section' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'section' => array(
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'sanitize_key',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/settings',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'save_settings' ),
					'permission_callback' => array( $this, 'check_permissions' ),
					'args'                => array(
						'html_font_size' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => function( $value ) {
								return in_array( (string) $value, array( '', '100', '62.5' ), true );
							},
						),
					),
				),
			)
		);
	}

	/**
	 * Permission gate for both routes.
	 *
	 * Same capability the legacy admin page enforces. The X-WP-Nonce
	 * header is verified by core ahead of this callback, so we only
	 * need to assert the user role.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Persist a single section to the option, after running it through
	 * the same sanitizer the legacy form uses.
	 *
	 * Any unknown section is rejected to keep the surface tight.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function save_section( WP_REST_Request $request ) {
		$section = (string) $request->get_param( 'section' );
		$values  = $request->get_param( 'values' );

		if ( ! $this->is_known_section( $section ) ) {
			return new WP_Error(
				'slashed_bricks_unknown_section',
				/* translators: %s: section slug. */
				sprintf( __( 'Unknown section: %s', 'slashed-bricks' ), $section ),
				array( 'status' => 400 )
			);
		}

		if ( ! is_array( $values ) ) {
			$values = array();
		}

		// Reuse the legacy sanitizer so both UIs persist data identically.
		// sanitize_section is private, so call it via a public proxy on
		// the admin page class.
		$sanitized = $this->admin_page->sanitize_section_public( $section, $values );

		$all              = $this->admin_page->get_settings();
		$all[ $section ]  = $sanitized;
		update_option( Slashed_Bricks_Admin_Page::OPTION_NAME, $all );

		return rest_ensure_response(
			array(
				'section' => $section,
				'values'  => $sanitized,
			)
		);
	}

	/**
	 * Reset a section (or every section when section is empty).
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function reset_section( WP_REST_Request $request ) {
		$section = (string) $request->get_param( 'section' );

		if ( '' === $section ) {
			delete_option( Slashed_Bricks_Admin_Page::OPTION_NAME );
			return rest_ensure_response(
				array(
					'section'  => '',
					'settings' => array(),
				)
			);
		}

		if ( ! $this->is_known_section( $section ) ) {
			return new WP_Error(
				'slashed_bricks_unknown_section',
				/* translators: %s: section slug. */
				sprintf( __( 'Unknown section: %s', 'slashed-bricks' ), $section ),
				array( 'status' => 400 )
			);
		}

		$all = $this->admin_page->get_settings();
		unset( $all[ $section ] );
		update_option( Slashed_Bricks_Admin_Page::OPTION_NAME, $all );

		return rest_ensure_response(
			array(
				'section'  => $section,
				'settings' => $all,
			)
		);
	}

	/**
	 * Get plugin settings via REST.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response
	 */
	public function get_settings( WP_REST_Request $request ) {
		$settings = get_option( Slashed_Bricks_Admin_Page::SETTINGS_OPTION_NAME, array() );
		if ( ! is_array( $settings ) ) {
			$settings = array();
		}
		return rest_ensure_response( $settings );
	}

	/**
	 * Save plugin settings via REST.
	 *
	 * Validates that html_font_size is one of the allowed values before
	 * persisting to the database.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function save_settings( WP_REST_Request $request ) {
		$html_font_size = (string) $request->get_param( 'html_font_size' );

		$allowed = array( '', '100', '62.5' );
		if ( ! in_array( $html_font_size, $allowed, true ) ) {
			return new WP_Error(
				'slashed_bricks_invalid_font_size',
				__( 'Invalid html_font_size value. Allowed: empty string, "100", or "62.5".', 'slashed-bricks' ),
				array( 'status' => 400 )
			);
		}

		$settings = get_option( Slashed_Bricks_Admin_Page::SETTINGS_OPTION_NAME, array() );
		if ( ! is_array( $settings ) ) {
			$settings = array();
		}

		$settings['html_font_size'] = $html_font_size;
		update_option( Slashed_Bricks_Admin_Page::SETTINGS_OPTION_NAME, $settings );

		return rest_ensure_response( $settings );
	}

	/**
	 * Whitelist sections against the admin page's tab map.
	 *
	 * @param string $section Section slug.
	 * @return bool
	 */
	private function is_known_section( $section ) {
		$tabs = $this->admin_page->get_tabs();
		return isset( $tabs[ $section ] );
	}
}
