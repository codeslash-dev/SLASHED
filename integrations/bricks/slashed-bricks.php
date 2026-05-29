<?php
/**
 * Plugin Name: SLASHED for Bricks
 * Plugin URI: https://github.com/codeslash-dev/SLASHED
 * Description: Integrates the SLASHED cascade-layer CSS framework with Bricks Builder - providing CSS variables, utility classes, and color palette synchronization.
 * Version: 0.4.9
 * Author: SLASHED
 * Author URI: https://github.com/codeslash-dev/SLASHED
 * License: MIT
 * Requires PHP: 7.4
 * Requires at least: 6.0
 * Text Domain: slashed-bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Plugin constants.
 */
define( 'SLASHED_BRICKS_VERSION', '0.4.9' );
define( 'SLASHED_BRICKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'SLASHED_BRICKS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Immutable jsDelivr ref for the SLASHED CSS bundle.
 *
 * Pinned to a specific release tag so the served CSS cannot change outside
 * a plugin release. jsDelivr treats commit/tag refs as effectively immutable
 * (cached "forever"), whereas branch refs (e.g. @main) have a 12h cache and
 * follow the moving branch tip - which is unsafe for production use.
 *
 * When a new SLASHED framework release is published, bump this constant
 * (and verify the tag was not retagged in the upstream repo).
 *
 * Override per-site with the 'slashed_bricks/css_bundle_url' filter.
 */
define( 'SLASHED_BRICKS_CSS_REF', 'v0.4.9' );

/**
 * Token Store is loaded early so slashed_bricks_get_css_bundle() can call
 * Slashed_Bricks_Token_Store::get_plugin_settings() at any point, even
 * before the rest of the admin/data classes are initialised.
 */
require_once plugin_dir_path( __FILE__ ) . 'includes/class-token-store.php';

/**
 * Get the configured CSS bundle type (essential / optimal / full).
 *
 * Reads from plugin settings; falls back to "optimal". Used both for
 * URL resolution and for local-file version-stamp lookups.
 *
 * @return string One of 'essential', 'optimal', 'full'.
 */
function slashed_bricks_get_css_bundle() {
    $settings = Slashed_Bricks_Token_Store::get_plugin_settings();
    $bundle   = isset( $settings['css_bundle'] ) ? (string) $settings['css_bundle'] : 'optimal';
    if ( ! in_array( $bundle, Slashed_Bricks_Token_Store::ALLOWED_CSS_BUNDLES, true ) ) {
        $bundle = 'optimal';
    }
    return $bundle;
}

/**
 * Get the URL for the SLASHED CSS bundle.
 *
 * Defaults to the jsDelivr CDN pinned to an immutable release tag
 * (see SLASHED_BRICKS_CSS_REF) so the plugin works without any local
 * file setup. The specific file (essential / optimal / full) is chosen
 * from the 'css_bundle' plugin setting. If a local copy is detected
 * (symlink/in-repo mode or copy-install mode), the local file takes
 * precedence for faster loads and offline development.
 *
 * Use the 'slashed_bricks/css_bundle_url' filter to override.
 *
 * @return string URL to the CSS bundle.
 */
function slashed_bricks_get_css_url() {
    $bundle   = slashed_bricks_get_css_bundle();
    $filename = 'slashed.' . $bundle . '.css';

    // Default: jsDelivr CDN pinned to an immutable release tag.
    $default_url = sprintf(
        'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@%s/dist/%s',
        SLASHED_BRICKS_CSS_REF,
        $filename
    );

    // Prefer local file if available (symlink/in-repo mode).
    $repo_path = SLASHED_BRICKS_PATH . '../../dist/' . $filename;
    if ( file_exists( $repo_path ) ) {
        $default_url = SLASHED_BRICKS_URL . '../../dist/' . $filename;
    }
    // Check copy-install mode (dist/ within the plugin directory).
    elseif ( file_exists( SLASHED_BRICKS_PATH . 'dist/' . $filename ) ) {
        $default_url = SLASHED_BRICKS_URL . 'dist/' . $filename;
    }

    /**
     * Filter the SLASHED CSS bundle URL.
     *
     * @param string $url The URL to the CSS bundle file.
     */
    return apply_filters( 'slashed_bricks/css_bundle_url', $default_url );
}

/**
 * Check if Bricks Builder is active.
 *
 * @return bool
 */
function slashed_bricks_is_bricks_active() {
    $theme = wp_get_theme();
    $minimum_version = '1.9.2';

    if ( defined( 'BRICKS_VERSION' ) ) {
        return version_compare( (string) BRICKS_VERSION, $minimum_version, '>=' );
    }

    if ( 'bricks' === strtolower( $theme->get_template() ) ) {
        $parent = $theme->parent();
        $version = $parent ? (string) $parent->get( 'Version' ) : (string) $theme->get( 'Version' );
        return version_compare( $version, $minimum_version, '>=' );
    }

    if ( 'bricks' === strtolower( $theme->get( 'Name' ) ) ) {
        return version_compare( (string) $theme->get( 'Version' ), $minimum_version, '>=' );
    }

    return false;
}

/**
 * Initialize the admin page.
 *
 * Runs regardless of whether Bricks is active so users can configure tokens
 * before activating the theme. Bricks runtime checks are handled separately
 * in slashed_bricks_init().
 */
function slashed_bricks_admin_init() {
    require_once SLASHED_BRICKS_PATH . 'includes/class-token-defaults.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-token-sanitizer.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-tab-registry.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-rest-controller.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-admin-page-svelte.php';

    new Slashed_Bricks_Admin_Page_Svelte();

    // REST routes are registered via the dedicated rest_api_init hook
    // (slashed_bricks_rest_routes_init) so they work on both admin and
    // non-admin requests. No need to instantiate the controller here.
}
if ( is_admin() ) {
    add_action( 'plugins_loaded', 'slashed_bricks_admin_init' );
}

/**
 * Register REST routes unconditionally via rest_api_init.
 *
 * WordPress fires `rest_api_init` exclusively during REST dispatch —
 * never on normal admin or frontend requests. Hooking here guarantees
 * the routes exist regardless of `is_admin()` state and eliminates the
 * risk of dependency drift between admin and REST init paths.
 *
 * On admin requests the REST controller is ALSO instantiated inside
 * `slashed_bricks_admin_init()` (which fires earlier, at plugins_loaded).
 * That's harmless: WordPress deduplicates routes by namespace+path, and
 * `require_once` prevents re-declaration of class files. The admin path
 * keeps it so the controller is available for wp_localize_script (the
 * NAMESPACE constant) without an extra require.
 */
function slashed_bricks_rest_routes_init() {
    require_once SLASHED_BRICKS_PATH . 'includes/class-token-defaults.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-token-sanitizer.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-tab-registry.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-rest-controller.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-rebemer-rest.php';

    ( new Slashed_Bricks_REST_Controller() )->register_routes();
    ( new Slashed_Bricks_ReBEMer_REST() )->register_routes();
}
add_action( 'rest_api_init', 'slashed_bricks_rest_routes_init' );

/**
 * Data managers: early initialization at plugins_loaded.
 *
 * Bricks' Database::__construct() reads bricks_global_variables,
 * bricks_global_classes, and bricks_color_palette via get_option() during
 * theme functions.php load — which happens AFTER plugins_loaded but BEFORE
 * after_setup_theme. Registering our option filters here guarantees they are
 * in place when Bricks reads those options for the first time.
 *
 * Runs unconditionally: if Bricks is not the active theme the option filters
 * simply never fire, which is harmless.
 */
function slashed_bricks_data_init() {
    // Bail early on non-Bricks sites to avoid loading classes needlessly.
    if ( 'bricks' !== strtolower( (string) get_option( 'template', '' ) ) ) {
        return;
    }

    require_once SLASHED_BRICKS_PATH . 'includes/class-css-parser.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-color-resolver.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-inventory.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-variables.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-classes.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-colors.php';

    new Slashed_Bricks_Variables();
    new Slashed_Bricks_Classes();
    new Slashed_Bricks_Colors();
}
add_action( 'plugins_loaded', 'slashed_bricks_data_init', 20 );

/**
 * CSS enqueue: late initialization at after_setup_theme.
 *
 * Enqueue needs the theme to be active and Bricks version checks to pass.
 * Data managers (variables, classes, colors) are already initialized above.
 */
function slashed_bricks_init() {
    if ( ! slashed_bricks_is_bricks_active() ) {
        add_action( 'admin_notices', 'slashed_bricks_missing_bricks_notice' );
        return;
    }

    require_once SLASHED_BRICKS_PATH . 'includes/class-token-defaults.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-css-generator.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-css-parser.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-color-resolver.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-inventory.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-enqueue.php';

    new Slashed_Bricks_Enqueue();
}
add_action( 'after_setup_theme', 'slashed_bricks_init' );

/**
 * reBEMer: enqueue the editor bundle inside the Bricks builder main panel.
 *
 * The Enqueue class hooks itself onto wp_enqueue_scripts and gates on
 * bricks_is_builder_main(), so registering it here at after_setup_theme
 * (priority 20 to follow slashed_bricks_init) is sufficient — the actual
 * decision to enqueue happens later, per-request.
 *
 * Bails out cleanly when Bricks isn't the active theme; the missing-Bricks
 * notice from slashed_bricks_init() already covers that case.
 */
function slashed_bricks_rebemer_init() {
    if ( ! slashed_bricks_is_bricks_active() ) {
        return;
    }

    require_once SLASHED_BRICKS_PATH . 'includes/class-rebemer-enqueue.php';
    new Slashed_Bricks_ReBEMer_Enqueue();
}
add_action( 'after_setup_theme', 'slashed_bricks_rebemer_init', 20 );

/**
 * Activation check.
 */
function slashed_bricks_activation_check() {
	// Allow activation without Bricks so admin token configuration is available.
	// Runtime guards in slashed_bricks_init() handle the Bricks dependency.
}
register_activation_hook( __FILE__, 'slashed_bricks_activation_check' );

/**
 * Display admin notice when Bricks Builder is not active.
 */
function slashed_bricks_missing_bricks_notice() {
    ?>
    <div class="notice notice-error">
        <p>
            <strong>SLASHED for Bricks</strong> requires Bricks Builder to be installed and active.
        </p>
    </div>
    <?php
}
