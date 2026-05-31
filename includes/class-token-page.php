<?php
/**
 * SLASHED token editor admin page.
 *
 * Registers the "Tokens" admin page and mounts the Svelte SPA built from
 * integrations/bricks/admin-app/. The SPA is the global token editor for
 * all SLASHED integrations — not Bricks-specific.
 *
 * @package SLASHED
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Token_Page
 */
class Slashed_Token_Page {

	/**
	 * Admin page slug.
	 */
	const PAGE_SLUG = 'slashed-tokens';

	/** @var string Hook suffix from add_*_page(), used to gate asset enqueue. */
	private $hook_suffix = '';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Register the Tokens page under the top-level SLASHED menu.
	 *
	 * In unified mode (slashed.php active): sub-page of 'slashed'.
	 * In standalone mode: own top-level menu (fallback for direct activation
	 * of an integration plugin that bundles the shared includes).
	 */
	public function register_menu() {
		if ( defined( 'SLASHED_VERSION' ) ) {
			$this->hook_suffix = (string) add_submenu_page(
				'slashed',
				__( 'Tokens', 'slashed' ),
				__( 'Tokens', 'slashed' ),
				'manage_options',
				self::PAGE_SLUG,
				array( $this, 'render_page' )
			);
		} else {
			$this->hook_suffix = (string) add_menu_page(
				__( 'SLASHED Tokens', 'slashed' ),
				__( 'SLASHED', 'slashed' ),
				'manage_options',
				self::PAGE_SLUG,
				array( $this, 'render_page' ),
				'dashicons-art',
				59
			);
		}
	}

	/**
	 * Enqueue the Svelte token editor bundle on this page only.
	 *
	 * The built assets live in integrations/bricks/assets/admin-app/ — that
	 * is where admin-app/ is built. The SPA source lives alongside Bricks
	 * integration code because it was born there; the built output can be
	 * relocated when a separate build target is warranted.
	 *
	 * @param string $hook_suffix Current admin page hook suffix.
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( '' === $this->hook_suffix || $hook_suffix !== $this->hook_suffix ) {
			return;
		}

		if ( defined( 'SLASHED_URL' ) ) {
			$plugin_url  = SLASHED_URL  . 'integrations/bricks/';
			$plugin_path = SLASHED_PATH . 'integrations/bricks/';
		} else {
			// Standalone Bricks plugin: SLASHED_BRICKS_* already point to integrations/bricks/.
			$plugin_url  = SLASHED_BRICKS_URL;
			$plugin_path = SLASHED_BRICKS_PATH;
		}

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

		add_filter( 'script_loader_tag', array( $this, 'mark_as_module' ), 10, 3 );

		wp_localize_script(
			'slashed-bricks-admin-app',
			'slashedBricksApp',
			array(
				'rest'           => array(
					'url'   => esc_url_raw( rest_url( Slashed_REST_Controller::NAMESPACE ) ),
					'nonce' => wp_create_nonce( 'wp_rest' ),
				),
				'tabs'           => Slashed_Tab_Registry::get_all(),
				'defaults'       => Slashed_Token_Defaults::get_all(),
				'settings'       => Slashed_Token_Store::get_settings(),
				'pluginSettings' => Slashed_Token_Store::get_plugin_settings(),
				'inventory'      => class_exists( 'Slashed_Bricks_Inventory' ) ? Slashed_Bricks_Inventory::get() : null,
				'classHints'     => self::get_class_hints(),
				'versions'       => array(
					'plugin'    => defined( 'SLASHED_VERSION' ) ? SLASHED_VERSION : SLASHED_BRICKS_VERSION,
					'framework' => defined( 'SLASHED_CSS_REF' ) ? SLASHED_CSS_REF : SLASHED_BRICKS_CSS_REF,
				),
			)
		);
	}

	/**
	 * Load the class hints map from the bundled JSON file.
	 *
	 * @return array
	 */
	public static function get_class_hints() {
		$path = defined( 'SLASHED_PATH' )
			? SLASHED_PATH . 'data/classes-hints.json'
			: SLASHED_BRICKS_PATH . '../../data/classes-hints.json';
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

	public function mark_as_module( $tag, $handle, $src ) {
		if ( 'slashed-bricks-admin-app' !== $handle ) {
			return $tag;
		}
		return preg_replace( '/<script(\b[^>]*)>/', '<script type="module"$1>', $tag, 1 );
	}

	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap">
			<div id="slashed-admin-app">
				<noscript>
					<div class="notice notice-warning">
						<p><?php esc_html_e( 'This settings page requires JavaScript to be enabled in your browser.', 'slashed' ); ?></p>
					</div>
				</noscript>
				<p style="color:#50575e; padding: 24px 0;">
					<?php esc_html_e( 'Loading SLASHED settings…', 'slashed' ); ?>
				</p>
			</div>
		</div>
		<?php
	}

	public function render_missing_bundle_notice() {
		echo '<div class="notice notice-error"><p>';
		esc_html_e( 'SLASHED admin SPA bundle is missing. Run `npm install && npm run build` inside integrations/bricks/admin-app/ to build it.', 'slashed' );
		echo '</p></div>';
	}
}
