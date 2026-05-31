<?php
/**
 * Plugin Name: SLASHED for Bricks
 * Plugin URI: https://github.com/codeslash-dev/SLASHED
 * Description: Integrates the SLASHED cascade-layer CSS framework with Bricks Builder - providing CSS variables, utility classes, and color palette synchronization.
 * Version: 0.4.18
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
 *
 * Defined via plugin_dir_path(__FILE__) so paths are correct whether this
 * file is loaded standalone or included by the unified slashed.php. The
 * !defined() guard exists solely to prevent redefinition errors when both
 * the standalone Bricks plugin and the unified SLASHED plugin are active.
 */
if ( ! defined( 'SLASHED_BRICKS_VERSION' ) ) {
    define( 'SLASHED_BRICKS_VERSION', '0.4.18' );
    define( 'SLASHED_BRICKS_PATH', plugin_dir_path( __FILE__ ) );
    define( 'SLASHED_BRICKS_URL', plugin_dir_url( __FILE__ ) );
    define( 'SLASHED_BRICKS_CSS_REF', 'v0.4.18' );
    define( 'SLASHED_BRICKS_DIST_SHA', 'be9ac0789180158c8ad86d5743020ef2272a063c' );
}

/**
 * Token Store is loaded early so slashed_bricks_get_css_bundle() can call
 * Slashed_Bricks_Token_Store::get_plugin_settings() at any point, even
 * before the rest of the admin/data classes are initialised.
 */
require_once SLASHED_BRICKS_PATH . 'includes/class-token-store.php';

/**
 * Get the configured CSS bundle variant.
 *
 * Delegates to the shared Slashed_CSS_Loader when running under the unified
 * plugin; falls back to the Bricks token store in standalone mode.
 *
 * @return string One of 'essential', 'optimal', 'full'.
 */
function slashed_bricks_get_css_bundle() {
    if ( class_exists( 'Slashed_CSS_Loader' ) ) {
        return Slashed_CSS_Loader::get_bundle();
    }
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
 * Delegates to the shared Slashed_CSS_Loader when running under the unified
 * plugin, then applies the per-integration filter. In standalone mode, builds
 * the URL directly from SLASHED_BRICKS_DIST_SHA with a local-file fallback.
 *
 * Use the 'slashed_bricks/css_bundle_url' filter to override.
 *
 * @return string URL to the CSS bundle.
 */
function slashed_bricks_get_css_url() {
    if ( class_exists( 'Slashed_CSS_Loader' ) ) {
        return apply_filters( 'slashed_bricks/css_bundle_url', Slashed_CSS_Loader::get_url() );
    }

    // Standalone fallback.
    $bundle      = slashed_bricks_get_css_bundle();
    $filename    = 'slashed.' . $bundle . '.css';
    $default_url = sprintf(
        'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@%s/%s',
        SLASHED_BRICKS_DIST_SHA,
        $filename
    );

    $repo_path = SLASHED_BRICKS_PATH . '../../dist/' . $filename;
    if ( file_exists( $repo_path ) ) {
        $default_url = SLASHED_BRICKS_URL . '../../dist/' . $filename;
    } elseif ( file_exists( SLASHED_BRICKS_PATH . 'dist/' . $filename ) ) {
        $default_url = SLASHED_BRICKS_URL . 'dist/' . $filename;
    }

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
    require_once SLASHED_BRICKS_PATH . 'includes/class-fonts-rest.php';

    ( new Slashed_Bricks_REST_Controller() )->register_routes();
    ( new Slashed_Bricks_ReBEMer_REST() )->register_routes();
    ( new Slashed_Bricks_Fonts_REST() )->register_routes();
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

    require_once SLASHED_BRICKS_PATH . 'includes/class-admin-page-svelte.php';
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
// Only register hooks against the standalone plugin file; when running under
// the unified slashed.php the root plugin handles activation/deactivation.
if ( ! defined( 'SLASHED_VERSION' ) ) {
    register_activation_hook( __FILE__, 'slashed_bricks_activation_check' );
}

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

// ─── Stale inventory / version detection ────────────────────────────────────

/**
 * Register a daily cron event to check for a newer framework release.
 * Fires once on plugin load; wp_schedule_event is a no-op if already scheduled.
 */
function slashed_bricks_schedule_version_check() {
	if ( ! wp_next_scheduled( 'slashed_bricks_version_check' ) ) {
		wp_schedule_event( time(), 'daily', 'slashed_bricks_version_check' );
	}
}
add_action( 'wp_loaded', 'slashed_bricks_schedule_version_check' );

/**
 * Cron callback: fetch the latest GitHub release tag and cache it.
 * Uses the jsDelivr package metadata API (no auth, generous rate limit).
 */
function slashed_bricks_run_version_check() {
	$url      = 'https://data.jsdelivr.com/v1/packages/gh/codeslash-dev/SLASHED';
	$response = wp_remote_get(
		$url,
		array(
			'timeout'    => 10,
			'user-agent' => 'SLASHED-Bricks/' . SLASHED_BRICKS_VERSION . '; WordPress/' . get_bloginfo( 'version' ),
		)
	);

	if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
		return;
	}

	$body = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( ! is_array( $body ) || empty( $body['versions'] ) || ! is_array( $body['versions'] ) ) {
		return;
	}

	// Versions are returned newest-first. Find the latest semver entry (X.Y.Z or vX.Y.Z).
	$latest = null;
	foreach ( $body['versions'] as $entry ) {
		$ver = isset( $entry['version'] ) ? ltrim( (string) $entry['version'], 'v' ) : '';
		if ( preg_match( '/^\d+\.\d+\.\d+$/', $ver ) ) {
			$latest = 'v' . $ver;
			break;
		}
	}

	if ( ! $latest ) {
		return;
	}

	set_transient( 'slashed_bricks_latest_version', $latest, DAY_IN_SECONDS * 2 );
}
add_action( 'slashed_bricks_version_check', 'slashed_bricks_run_version_check' );

/**
 * Add a SLASHED widget to the WP Dashboard when the installed framework
 * version is behind the latest released tag.
 */
function slashed_bricks_dashboard_setup() {
	$latest  = get_transient( 'slashed_bricks_latest_version' );
	$current = ltrim( SLASHED_BRICKS_CSS_REF, 'v' );

	if ( ! $latest || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Trim leading 'v' for version_compare.
	$latest_clean = ltrim( $latest, 'v' );

	if ( version_compare( $latest_clean, $current, '<=' ) ) {
		return; // Up to date — no widget needed.
	}

	wp_add_dashboard_widget(
		'slashed_bricks_update_notice',
		'SLASHED Framework Update Available',
		'slashed_bricks_dashboard_widget_cb'
	);
}
add_action( 'wp_dashboard_setup', 'slashed_bricks_dashboard_setup' );

/**
 * Unschedule the version-check cron on plugin deactivation so no orphaned
 * scheduled tasks remain after the plugin is turned off.
 */
function slashed_bricks_deactivation_cleanup() {
	$timestamp = wp_next_scheduled( 'slashed_bricks_version_check' );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, 'slashed_bricks_version_check' );
	}
}
if ( ! defined( 'SLASHED_VERSION' ) ) {
    register_deactivation_hook( __FILE__, 'slashed_bricks_deactivation_cleanup' );
}

/**
 * Dashboard widget content: informs the user a newer framework version exists.
 */
function slashed_bricks_dashboard_widget_cb() {
	$latest  = get_transient( 'slashed_bricks_latest_version' );
	$current = SLASHED_BRICKS_CSS_REF;
	printf(
		'<p>A newer SLASHED framework release is available: <strong>%s</strong> (you are on %s).</p>
		<p>Update the plugin to load the latest CSS bundle and token inventory.</p>',
		esc_html( $latest ),
		esc_html( $current )
	);
}
