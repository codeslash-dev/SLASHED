<?php
/**
 * Enqueue logic for the reBEMer editor bundle.
 *
 * Loads only inside the Bricks builder main panel (NOT on the frontend
 * and NOT in the canvas iframe), and only for users who can actually
 * use the builder. Matches the existing Slashed_Bricks_Admin_Page_Svelte
 * pattern: stable filenames + filemtime() cache-bust + a script_loader_tag
 * filter to add type="module" because Vite emits ES modules.
 *
 * Hydration goes into a single `window.slashedReBEMer` object that the
 * editor app reads from policy.js, reserved-names.js, i18n.js and the
 * preflight/REST helpers. The shape is:
 *
 *   {
 *     rest: { url, nonce },
 *     currentPostId: number,
 *     policy: { ... see Slashed_Bricks_ReBEMer_Policy::defaults() },
 *     reservedClassNames: string[],
 *     i18n: { key: localizedString },
 *     version: string,
 *   }
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_ReBEMer_Enqueue
 */
class Slashed_Bricks_ReBEMer_Enqueue {

	const SCRIPT_HANDLE = 'slashed-bricks-rebemer';
	const STYLE_HANDLE  = 'slashed-bricks-rebemer';
	const ASSET_BASE    = 'assets/editor-app/';
	const JS_GLOBAL     = 'slashedReBEMer';

	public function __construct() {
		// Bricks fires wp_enqueue_scripts in three contexts; we want only
		// the builder main panel. The bricks_is_builder_main() guard in
		// enqueue() narrows to that. Priority 9999 ensures we run after
		// Bricks itself so any of its scripts our module relies on are
		// already registered.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ), 9999 );
		add_filter( 'script_loader_tag', array( $this, 'mark_as_module' ), 10, 3 );
	}


	/**
	 * The hot path. Skips quickly when context is wrong; otherwise
	 * enqueues the bundle and hydrates window.slashedReBEMer.
	 */
	public function enqueue() {
		if ( ! function_exists( 'bricks_is_builder_main' ) || ! bricks_is_builder_main() ) {
			return;
		}

		// Defense in depth: builder-main context is already a strong gate
		// (Bricks won't render the panel for unauthorised users), but we
		// also assert the cap explicitly so a misconfigured site can't
		// leak the bundle to a low-privilege account.
		if ( ! current_user_can( 'bricks_full_access' ) && ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$plugin_url  = SLASHED_BRICKS_URL;
		$plugin_path = SLASHED_BRICKS_PATH;

		$js_path  = $plugin_path . self::ASSET_BASE . 'app.js';
		$css_path = $plugin_path . self::ASSET_BASE . 'app.css';

		if ( ! file_exists( $js_path ) ) {
			// Bundle missing — the editor-app build hasn't run yet. Show
			// a builder-side console hint via inline script so the next
			// developer knows where to look.
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-warning"><p>';
					esc_html_e( 'reBEMer editor bundle is missing. Run `npm install && npm run build` inside integrations/bricks/editor-app/.', 'slashed-bricks' );
					echo '</p></div>';
				}
			);
			return;
		}

		$js_ver  = (string) filemtime( $js_path );
		$css_ver = file_exists( $css_path ) ? (string) filemtime( $css_path ) : SLASHED_BRICKS_VERSION;

		wp_enqueue_style( self::STYLE_HANDLE, $plugin_url . self::ASSET_BASE . 'app.css', array(), $css_ver );
		wp_enqueue_script( self::SCRIPT_HANDLE, $plugin_url . self::ASSET_BASE . 'app.js', array(), $js_ver, true );

		wp_localize_script( self::SCRIPT_HANDLE, self::JS_GLOBAL, $this->build_hydration_payload() );
	}


	/**
	 * Add type="module" to our script tag so import statements work.
	 * Filter is narrowed by handle so it never affects other scripts.
	 */
	public function mark_as_module( $tag, $handle, $src ) {
		if ( self::SCRIPT_HANDLE !== $handle ) {
			return $tag;
		}
		// Insert before any existing attribute, only on the opening tag.
		return preg_replace( '/<script(\b[^>]*)>/', '<script type="module"$1>', $tag, 1 );
	}

	/**
	 * Build the hydration payload. Pulled out of enqueue() so it can
	 * be unit-introspected if a future test needs to.
	 *
	 * @return array
	 */
	private function build_hydration_payload() {
		$post_id = $this->detect_current_post_id();

		return array(
			'rest'               => array(
				'url'   => esc_url_raw( rest_url( Slashed_Bricks_REST_Controller::NAMESPACE . Slashed_Bricks_ReBEMer_REST::ROUTE_BASE . '/' ) ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			),
			'currentPostId'      => $post_id,
			'policy'             => Slashed_Bricks_ReBEMer_Policy::get(),
			'reservedClassNames' => Slashed_Bricks_ReBEMer_Policy::reserved_exact(),
			'i18n'               => $this->i18n_strings(),
			'version'            => SLASHED_BRICKS_VERSION,
		);
	}

	/**
	 * Best-effort detection of the post id Bricks is currently editing.
	 * Bricks uses a few different query parameters across its versions;
	 * we check the documented ones in order of recency.
	 *
	 * @return int 0 when none can be determined.
	 */
	private function detect_current_post_id() {
		foreach ( array( 'bricks_post_id', 'post_id', 'p', 'page_id' ) as $key ) {
			if ( isset( $_GET[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$id = absint( wp_unslash( $_GET[ $key ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( $id > 0 ) {
					return $id;
				}
			}
		}
		// Final fallback: WordPress' resolved query.
		$queried = (int) get_queried_object_id();
		return $queried > 0 ? $queried : 0;
	}


	/**
	 * The translatable-string dictionary handed to the editor app.
	 * Keys mirror the strings the JS modules pass to `__()`.
	 *
	 * @return array<string, string>
	 */
	private function i18n_strings() {
		return array(
			'rebemer.close'                       => __( 'Close', 'slashed-bricks' ),
			'rebemer.cancel'                      => __( 'Cancel', 'slashed-bricks' ),
			'rebemer.apply'                       => __( 'Apply', 'slashed-bricks' ),
			'rebemer.applying'                    => __( 'Applying…', 'slashed-bricks' ),
			'rebemer.operation'                   => __( 'Operation', 'slashed-bricks' ),
			'rebemer.elements'                    => __( 'Elements', 'slashed-bricks' ),
			'rebemer.sync_labels'                 => __( 'Sync labels', 'slashed-bricks' ),

			'rebemer.mode.add'                    => __( 'Add', 'slashed-bricks' ),
			'rebemer.mode.rename'                 => __( 'Rename', 'slashed-bricks' ),
			'rebemer.mode.replace'                => __( 'Replace', 'slashed-bricks' ),
			'rebemer.mode.modifier'               => __( 'Add modifier', 'slashed-bricks' ),
			'rebemer.mode.migrate'                => __( 'Migrate ID styles', 'slashed-bricks' ),

			'rebemer.validate.empty'              => __( 'Name required.', 'slashed-bricks' ),
			'rebemer.validate.invalid_chars'      => __( 'Use lowercase letters, digits, and hyphens.', 'slashed-bricks' ),
			'rebemer.validate.invalid_role'       => __( 'Internal: invalid role.', 'slashed-bricks' ),
			'rebemer.validate.reserved'           => __( 'Reserved name.', 'slashed-bricks' ),
			'rebemer.validate.invalid_modifier'   => __( 'Modifier is invalid.', 'slashed-bricks' ),
			'rebemer.validate.duplicate_in_plan'  => __( 'Duplicate name in this operation.', 'slashed-bricks' ),
			'rebemer.validate.max_depth_exceeded' => __( 'Subtree exceeds the maximum depth.', 'slashed-bricks' ),
			'rebemer.validate.missing_root_row'   => __( 'Root element row is missing.', 'slashed-bricks' ),
			'rebemer.validate.invalid_mode'       => __( 'Internal: invalid mode.', 'slashed-bricks' ),

			'rebemer.toast.validation_failed'     => __( 'Some rows have errors.', 'slashed-bricks' ),
			'rebemer.toast.preflight_unavailable' => __( 'Reference check unavailable; proceeding without it.', 'slashed-bricks' ),
			'rebemer.toast.apply_failed'          => __( 'Apply failed', 'slashed-bricks' ),
			'rebemer.toast.applied'               => __( 'Applied.', 'slashed-bricks' ),
			'rebemer.toast.undone'                => __( 'Undone.', 'slashed-bricks' ),
			'rebemer.toast.nothing_to_undo'       => __( 'Nothing to undo.', 'slashed-bricks' ),
		);
	}
}
