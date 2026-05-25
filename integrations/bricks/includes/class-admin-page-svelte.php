<?php
/**
 * Svelte-based admin page (POC).
 *
 * Lives alongside the legacy jQuery admin page so both can be compared
 * side-by-side. PHP still owns capability checks, nonces, sanitization,
 * and option storage; this class just registers a second submenu and
 * mounts a Svelte SPA into a single div on it.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Admin_Page_Svelte
 *
 * Adds a "Tokens (v2)" submenu under SLASHED that boots the Svelte app
 * built from integrations/bricks/admin-app/.
 *
 * Responsibilities split with the SPA:
 *
 *   PHP (this class)                 Svelte (admin-app/)
 *   --------------------------------|--------------------------------
 *   register_submenu                | render UI
 *   capability check                | reactive state + dirty tracking
 *   enqueue built bundle            | live preview
 *   wp_localize_script hydration    | optimistic save / error toasts
 *   REST endpoint (REST controller) | calls REST endpoint
 *   sanitize + option write         | -
 *
 * The mount point is just <div id="slashed-admin-app"></div>; everything
 * inside it is owned by Svelte. This is the cleanest line to draw - WP
 * keeps doing the WordPress-correct things, the SPA owns the inside of
 * one div.
 */
class Slashed_Bricks_Admin_Page_Svelte {

	/**
	 * Submenu slug. Must be unique across the WP admin.
	 */
	const PAGE_SLUG = 'slashed-bricks-svelte';

	/**
	 * Hook suffix returned by add_submenu_page(). Captured at registration
	 * time and compared in enqueue_assets() so we never accidentally load
	 * the SPA bundle on other admin screens. WordPress mangles the parent
	 * slug into the hook name in ways that vary across versions; relying
	 * on the value WP itself returned avoids brittle string assembly.
	 *
	 * @var string
	 */
	private $hook_suffix = '';

	/**
	 * Reference to the legacy admin page; reused for defaults, settings,
	 * and tab metadata so both UIs render the same data.
	 *
	 * @var Slashed_Bricks_Admin_Page
	 */
	private $admin_page;

	/**
	 * Constructor.
	 *
	 * @param Slashed_Bricks_Admin_Page $admin_page Legacy admin page instance.
	 */
	public function __construct( Slashed_Bricks_Admin_Page $admin_page ) {
		$this->admin_page = $admin_page;
		add_action( 'admin_menu', array( $this, 'register_submenu' ), 20 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Register the submenu under the existing SLASHED top-level page.
	 *
	 * Priority 20 so the parent page (registered in
	 * Slashed_Bricks_Admin_Page::register_menu at default priority) has
	 * already been added when we attach to it.
	 */
	public function register_submenu() {
		$this->hook_suffix = (string) add_submenu_page(
			'slashed-bricks',
			__( 'SLASHED Tokens (v2)', 'slashed-bricks' ),
			__( 'Tokens (v2)', 'slashed-bricks' ),
			'manage_options',
			self::PAGE_SLUG,
			array( $this, 'render_page' )
		);
	}

	/**
	 * Enqueue the built Svelte bundle on this page only.
	 *
	 * The bundle is fully self-contained: no jQuery dependency, no
	 * wp-color-picker, no other admin libraries. Cache-busting uses
	 * filemtime() on the built artifact so a fresh `npm run build`
	 * invalidates browser caches without manual version bumps.
	 *
	 * @param string $hook_suffix Current admin page hook suffix.
	 */
	public function enqueue_assets( $hook_suffix ) {
		// Only fire on our submenu. We compare against the value returned
		// by add_submenu_page() at registration time rather than building
		// the string ourselves - WP's hook-name conventions for submenus
		// have changed across versions.
		if ( '' === $this->hook_suffix || $hook_suffix !== $this->hook_suffix ) {
			return;
		}

		$plugin_url  = plugin_dir_url( dirname( __FILE__ ) );
		$plugin_path = plugin_dir_path( dirname( __FILE__ ) );

		$js_path  = $plugin_path . 'assets/admin-app/app.js';
		$css_path = $plugin_path . 'assets/admin-app/app.css';

		// Defensive: if the build artefact is missing, surface an admin
		// notice rather than silently shipping a broken page.
		if ( ! file_exists( $js_path ) ) {
			add_action( 'admin_notices', array( $this, 'render_missing_bundle_notice' ) );
			return;
		}

		$js_version  = (string) filemtime( $js_path );
		$css_version = file_exists( $css_path ) ? (string) filemtime( $css_path ) : $js_version;

		wp_enqueue_style(
			'slashed-bricks-admin-app',
			$plugin_url . 'assets/admin-app/app.css',
			array(),
			$css_version
		);

		wp_enqueue_script(
			'slashed-bricks-admin-app',
			$plugin_url . 'assets/admin-app/app.js',
			array(),
			$js_version,
			true
		);

		// Modules need type=module on the <script> tag.
		add_filter( 'script_loader_tag', array( $this, 'mark_as_module' ), 10, 3 );

		// Hydration payload. Mirrors the structure the Svelte app expects
		// in window.slashedBricksApp - see admin-app/index.html for the
		// dev-time equivalent.
		wp_localize_script(
			'slashed-bricks-admin-app',
			'slashedBricksApp',
			array(
				'rest'     => array(
					'url'   => esc_url_raw( rest_url( Slashed_Bricks_REST_Controller::NAMESPACE ) ),
					'nonce' => wp_create_nonce( 'wp_rest' ),
				),
				'tabs'     => $this->admin_page->get_tabs(),
				'defaults' => Slashed_Bricks_Token_Defaults::get_all(),
				'settings' => $this->admin_page->get_settings(),
			)
		);
	}

	/**
	 * Tag the SPA bundle as a JS module so import statements work.
	 *
	 * Vite emits ES modules; WordPress' default <script> tag has no
	 * type attribute, which would prevent the import-graph from loading.
	 * Filter narrowed by handle so this never affects other scripts.
	 *
	 * @param string $tag    Generated script tag.
	 * @param string $handle Script handle.
	 * @param string $src    Script src URL.
	 * @return string
	 */
	public function mark_as_module( $tag, $handle, $src ) {
		if ( 'slashed-bricks-admin-app' !== $handle ) {
			return $tag;
		}
		// Replace the opening <script ...> with one that includes type=module.
		// Preserve any existing attributes (id, src, defer added by WP, etc).
		return str_replace( '<script ', '<script type="module" ', $tag );
	}

	/**
	 * Render the page shell. The Svelte app takes over inside
	 * #slashed-admin-app once main.js runs.
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap">
			<div id="slashed-admin-app">
				<noscript>
					<div class="notice notice-warning">
						<p>
							<?php esc_html_e( 'This settings page requires JavaScript. The legacy form (still fully functional, no JS required) is available under SLASHED &rarr; SLASHED.', 'slashed-bricks' ); ?>
						</p>
					</div>
				</noscript>
				<p style="color:#50575e; padding: 24px 0;">
					<?php esc_html_e( 'Loading SLASHED admin SPA…', 'slashed-bricks' ); ?>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Admin notice rendered when the built bundle is missing.
	 *
	 * Helps developers who clone the repo without running the admin-app
	 * build step understand why the page is empty.
	 */
	public function render_missing_bundle_notice() {
		echo '<div class="notice notice-error"><p>';
		esc_html_e( 'SLASHED admin SPA bundle is missing. Run `npm install && npm run build` inside integrations/bricks/admin-app/ to build it.', 'slashed-bricks' );
		echo '</p></div>';
	}
}
