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
 * sanitization, tab whitelisting and option storage are delegated to
 * the dedicated helper classes (Token_Store, Token_Sanitizer,
 * Tab_Registry) so every admin surface persists data identically.
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
 *   POST /wp-json/slashed-bricks/v1/tokens/validate
 *     Body: { section: string, values: object }
 *     Runs the sanitizer and returns { section, sanitized, changed } without
 *     persisting anything. Used by the admin SPA for inline validation feedback.
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
	 * Constructor — intentionally empty.
	 *
	 * Route registration is handled by the caller
	 * (slashed_bricks_rest_routes_init in slashed-bricks.php) which
	 * invokes register_routes() directly inside a rest_api_init hook.
	 * This keeps the class stateless and avoids redundant add_action()
	 * calls that would fire too late when the controller is instantiated
	 * during the already-running rest_api_init action.
	 */
	public function __construct() {
		// No-op. Routes are registered externally via rest_api_init hook.
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
			'/tokens/validate',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'validate_section' ),
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
			'/tokens/export',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'export_tokens' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/tokens/import',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'import_tokens' ),
				'permission_callback' => array( $this, 'check_permissions' ),
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
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => function( $value ) {
								return in_array( (string) $value, array( '', '100', '62.5' ), true );
							},
						),
						'css_bundle'       => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => function( $value ) {
								return in_array( (string) $value, Slashed_Bricks_Token_Store::ALLOWED_CSS_BUNDLES, true );
							},
						),
						'show_class_hints' => array(
							'type'     => 'boolean',
							'required' => false,
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

		// Reuse the shared sanitizer so every admin surface persists
		// data identically.
		$sanitized = Slashed_Bricks_Token_Sanitizer::sanitize_section( $section, $values );

		Slashed_Bricks_Token_Store::update_section( $section, $sanitized );

		return rest_ensure_response(
			array(
				'section' => $section,
				'values'  => $sanitized,
			)
		);
	}

	/**
	 * Validate a section's values without persisting them.
	 *
	 * Runs values through the same sanitizer as save_section() and returns
	 * the normalized output plus a map of fields that were changed, so the
	 * SPA can highlight corrections inline before the user saves.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function validate_section( WP_REST_Request $request ) {
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

		$sanitized = Slashed_Bricks_Token_Sanitizer::sanitize_section( $section, $values );

		// Compute which fields were normalised so the SPA can surface them.
		$changed = array();
		foreach ( $sanitized as $key => $clean ) {
			$raw = isset( $values[ $key ] ) ? (string) $values[ $key ] : '';
			if ( $raw !== $clean ) {
				$changed[ $key ] = array(
					'original'  => $raw,
					'sanitized' => $clean,
				);
			}
		}

		return rest_ensure_response(
			array(
				'section'   => $section,
				'sanitized' => $sanitized,
				'changed'   => $changed,
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
			Slashed_Bricks_Token_Store::delete_settings();
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

		$all = Slashed_Bricks_Token_Store::delete_section( $section );

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
		return rest_ensure_response( Slashed_Bricks_Token_Store::get_plugin_settings() );
	}

	/**
	 * Save plugin settings via REST (partial update — only provided fields are written).
	 *
	 * validate_callback on each arg ensures values are already sane by the
	 * time this handler runs; we just merge present fields into the stored map.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response
	 */
	public function save_settings( WP_REST_Request $request ) {
		$html_font_size    = $request->get_param( 'html_font_size' );
		$css_bundle        = $request->get_param( 'css_bundle' );
		$show_class_hints  = $request->get_param( 'show_class_hints' );

		if ( null === $html_font_size && null === $css_bundle && null === $show_class_hints ) {
			return rest_ensure_response( Slashed_Bricks_Token_Store::get_plugin_settings() );
		}

		$settings = Slashed_Bricks_Token_Store::get_plugin_settings();

		if ( null !== $html_font_size ) {
			$settings['html_font_size'] = (string) $html_font_size;
		}

		if ( null !== $css_bundle ) {
			$settings['css_bundle'] = (string) $css_bundle;
		}

		if ( null !== $show_class_hints ) {
			$settings['show_class_hints'] = (bool) $show_class_hints;
		}

		Slashed_Bricks_Token_Store::update_plugin_settings( $settings );

		return rest_ensure_response( $settings );
	}

	/**
	 * Export all token overrides and plugin settings as a portable JSON package.
	 *
	 * The response is a self-describing envelope callers can save to a file
	 * and later POST to /tokens/import on a different site. Only overrides
	 * are included — framework defaults are not repeated because the target
	 * site already has them via the CSS bundle.
	 *
	 * @return WP_REST_Response
	 */
	public function export_tokens() {
		return rest_ensure_response(
			array(
				'schema_version'  => '1',
				'plugin_version'  => SLASHED_BRICKS_VERSION,
				'exported_at'     => gmdate( 'c' ),
				'tokens'          => Slashed_Bricks_Token_Store::get_settings(),
				'plugin_settings' => Slashed_Bricks_Token_Store::get_plugin_settings(),
			)
		);
	}

	/**
	 * Import token overrides from a portable JSON package.
	 *
	 * Accepts the envelope produced by export_tokens(). Each section is
	 * run through the standard sanitizer before it is written, so the
	 * same validation rules that protect the per-section save endpoint
	 * apply here too. Unknown sections (e.g. from a newer plugin version)
	 * are silently skipped so forward-compatible exports don't fail.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function import_tokens( WP_REST_Request $request ) {
		$body = $request->get_json_params();

		if ( ! is_array( $body ) || ! isset( $body['tokens'] ) || ! is_array( $body['tokens'] ) ) {
			return new WP_Error(
				'slashed_bricks_invalid_import',
				__( 'Invalid import payload. Expected a SLASHED token export file.', 'slashed-bricks' ),
				array( 'status' => 400 )
			);
		}

		$all      = Slashed_Bricks_Token_Store::get_settings();
		$imported = 0;

		foreach ( $body['tokens'] as $section => $values ) {
			if ( ! Slashed_Bricks_Tab_Registry::is_token_tab( $section ) ) {
				continue;
			}
			if ( ! is_array( $values ) ) {
				continue;
			}
			$sanitized = Slashed_Bricks_Token_Sanitizer::sanitize_section( $section, $values );
			if ( ! empty( $sanitized ) ) {
				$all[ $section ] = $sanitized;
				++$imported;
			} else {
				unset( $all[ $section ] );
			}
		}

		Slashed_Bricks_Token_Store::update_settings( $all );

		// Restore plugin-level settings (bundle, font-size) when present and valid.
		$settings_imported = false;
		if ( isset( $body['plugin_settings'] ) && is_array( $body['plugin_settings'] ) ) {
			$raw      = $body['plugin_settings'];
			$existing = Slashed_Bricks_Token_Store::get_plugin_settings();

			if ( isset( $raw['css_bundle'] )
				&& in_array( (string) $raw['css_bundle'], Slashed_Bricks_Token_Store::ALLOWED_CSS_BUNDLES, true )
			) {
				$existing['css_bundle'] = (string) $raw['css_bundle'];
				$settings_imported = true;
			}

			if ( isset( $raw['html_font_size'] )
				&& in_array( (string) $raw['html_font_size'], array( '', '100', '62.5' ), true )
			) {
				$existing['html_font_size'] = (string) $raw['html_font_size'];
				$settings_imported = true;
			}

			if ( $settings_imported ) {
				Slashed_Bricks_Token_Store::update_plugin_settings( $existing );
			}
		}

		return rest_ensure_response(
			array(
				'imported'          => $imported,
				'settings_imported' => $settings_imported,
				'tokens'            => Slashed_Bricks_Token_Store::get_settings(),
				'plugin_settings'   => Slashed_Bricks_Token_Store::get_plugin_settings(),
			)
		);
	}

	/**
	 * Whitelist sections against the token-tab registry.
	 *
	 * Only token tabs (colors, contrast, typography, ...) are accepted
	 * here — view tabs (variables, classes, ...) never persist anything
	 * to the option, so attempting to save or reset them would be a
	 * no-op at best and stale-data at worst.
	 *
	 * @param string $section Section slug.
	 * @return bool
	 */
	private function is_known_section( $section ) {
		return Slashed_Bricks_Tab_Registry::is_token_tab( $section );
	}
}
