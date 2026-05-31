<?php
/**
 * Svelte-based admin page.
 *
 * Registers the top-level "SLASHED" admin menu and mounts the Svelte SPA
 * built from integrations/bricks/admin-app/ into a single div.
 *
 * Responsibilities split with the SPA:
 *
 *   PHP (this class)                 Svelte (admin-app/)
 *   --------------------------------|--------------------------------
 *   register_menu                   | render UI
 *   capability check                | reactive state + dirty tracking
 *   enqueue built bundle            | live preview
 *   wp_localize_script hydration    | optimistic save / error toasts
 *   REST endpoint (REST controller) | calls REST endpoint
 *   sanitize + option write         | -
 *
 * The mount point is just <div id="slashed-admin-app"></div>; everything
 * inside it is owned by Svelte.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Admin_Page_Svelte
 */
class Slashed_Bricks_Admin_Page_Svelte {

	/**
	 * Top-level menu slug.
	 */
	const PAGE_SLUG = 'slashed-bricks';

	/**
	 * Hook suffix returned by add_menu_page(). Captured at registration
	 * time and compared in enqueue_assets() so we never accidentally load
	 * the SPA bundle on other admin screens.
	 *
	 * @var string
	 */
	private $hook_suffix = '';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Register the SLASHED admin menu.
	 *
	 * Standalone plugin: registers a top-level "SLASHED" menu.
	 * Unified plugin (SLASHED_VERSION defined): registers as a sub-page
	 * under the top-level "SLASHED" menu owned by slashed.php so only one
	 * SLASHED item appears in the sidebar.
	 */
	public function register_menu() {
		if ( defined( 'SLASHED_VERSION' ) ) {
			$this->hook_suffix = (string) add_submenu_page(
				'slashed',
				__( 'Bricks Tokens', 'slashed-bricks' ),
				__( 'Bricks Tokens', 'slashed-bricks' ),
				'manage_options',
				self::PAGE_SLUG,
				array( $this, 'render_page' )
			);
		} else {
			$this->hook_suffix = (string) add_menu_page(
				__( 'SLASHED Settings', 'slashed-bricks' ),
				__( 'SLASHED', 'slashed-bricks' ),
				'manage_options',
				self::PAGE_SLUG,
				array( $this, 'render_page' ),
				'dashicons-art',
				59
			);
		}
	}

	/**
	 * Enqueue the built Svelte bundle on this page only.
	 *
	 * Compares against the value returned by add_menu_page() at registration
	 * time rather than assembling the hook name ourselves — WP's hook-name
	 * conventions have changed across versions, so trusting the return value
	 * is the only safe approach.
	 *
	 * @param string $hook_suffix Current admin page hook suffix.
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( '' === $this->hook_suffix || $hook_suffix !== $this->hook_suffix ) {
			return;
		}

		$plugin_url  = plugin_dir_url( dirname( __FILE__ ) );
		$plugin_path = plugin_dir_path( dirname( __FILE__ ) );

		$js_path  = $plugin_path . 'assets/admin-app/app.js';
		$css_path = $plugin_path . 'assets/admin-app/app.css';

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

		wp_localize_script(
			'slashed-bricks-admin-app',
			'slashedBricksApp',
			array(
				'rest'           => array(
					'url'   => esc_url_raw( rest_url( Slashed_Bricks_REST_Controller::NAMESPACE ) ),
					'nonce' => wp_create_nonce( 'wp_rest' ),
				),
				'tabs'           => Slashed_Bricks_Tab_Registry::get_all(),
				'defaults'       => Slashed_Bricks_Token_Defaults::get_all(),
				'settings'       => Slashed_Bricks_Token_Store::get_settings(),
				'pluginSettings' => Slashed_Bricks_Token_Store::get_plugin_settings(),
				'inventory'      => Slashed_Bricks_Inventory::get(),
				'classHints'     => self::get_class_hints(),
				'versions'       => array(
					'plugin'    => SLASHED_BRICKS_VERSION,
					'framework' => SLASHED_BRICKS_CSS_REF,
				),
			)
		);
	}

	/**
	 * Load the class hints map from the bundled JSON file.
	 *
	 * Returns the full map (className → { description, category }) so the
	 * admin SPA and editor app can show tooltips without a REST round-trip.
	 * Falls back to an empty array if the file is missing (e.g. mid-build).
	 *
	 * @return array
	 */
	public static function get_class_hints() {
		$path = SLASHED_BRICKS_PATH . '../../data/classes-hints.json';
		if ( ! file_exists( $path ) ) {
			return array();
		}
		$json = file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( false === $json ) {
			return array();
		}
		$data = json_decode( $json, true );
		return is_array( $data ) ? $data : array();
	}

	/**
	 * Tag the SPA bundle as a JS module so import statements work.
	 *
	 * Vite emits ES modules; WordPress' default <script> tag has no type
	 * attribute, which would prevent the import graph from resolving. The
	 * regex uses limit 1 so only the opening tag is touched, not any inline
	 * script content that might contain `<script>` as a literal string.
	 * Filter is narrowed by handle so it never affects other enqueued scripts.
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
		return preg_replace( '/<script(\b[^>]*)>/', '<script type="module"$1>', $tag, 1 );
	}

	/**
	 * Render the page shell. The Svelte app takes over inside #slashed-admin-app.
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
							<?php esc_html_e( 'This settings page requires JavaScript to be enabled in your browser.', 'slashed-bricks' ); ?>
						</p>
					</div>
				</noscript>
				<p style="color:#50575e; padding: 24px 0;">
					<?php esc_html_e( 'Loading SLASHED settings…', 'slashed-bricks' ); ?>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Admin notice rendered when the built bundle is missing.
	 *
	 * Helps developers who clone the repo without running the admin-app
	 * build step understand why the page is blank.
	 */
	public function render_missing_bundle_notice() {
		echo '<div class="notice notice-error"><p>';
		esc_html_e( 'SLASHED admin SPA bundle is missing. Run `npm install && npm run build` inside integrations/bricks/admin-app/ to build it.', 'slashed-bricks' );
		echo '</p></div>';
	}
}
