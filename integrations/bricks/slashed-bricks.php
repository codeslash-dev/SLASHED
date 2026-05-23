<?php
/**
 * Plugin Name: SLASHED for Bricks
 * Plugin URI: https://github.com/codeslash-dev/SLASHED
 * Description: Integrates the SLASHED cascade-layer CSS framework with Bricks Builder - providing CSS variables, utility classes, and color palette synchronization.
 * Version: 1.0.0
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
define( 'SLASHED_BRICKS_VERSION', '1.0.0' );
define( 'SLASHED_BRICKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'SLASHED_BRICKS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Get the URL for the SLASHED CSS bundle.
 *
 * Resolves the path to dist/slashed.optimal.css by checking:
 * 1. Symlink/in-repo mode: ../../dist/slashed.optimal.css relative to the plugin
 * 2. Copy-install mode: dist/slashed.optimal.css within the plugin directory
 *
 * Falls back to an empty string (with a PHP notice) if neither location exists.
 * Use the 'slashed_bricks/css_bundle_url' filter to override.
 *
 * @return string URL to the CSS bundle.
 */
function slashed_bricks_get_css_url() {
    $default_url = '';

    // Check symlink/in-repo mode first (../../dist/ relative to plugin).
    $repo_path = SLASHED_BRICKS_PATH . '../../dist/slashed.optimal.css';
    if ( file_exists( $repo_path ) ) {
        $default_url = SLASHED_BRICKS_URL . '../../dist/slashed.optimal.css';
    }
    // Check copy-install mode (dist/ within the plugin directory).
    elseif ( file_exists( SLASHED_BRICKS_PATH . 'dist/slashed.optimal.css' ) ) {
        $default_url = SLASHED_BRICKS_URL . 'dist/slashed.optimal.css';
    }
    // Neither location found.
    else {
        trigger_error(
            'SLASHED for Bricks: Could not locate slashed.optimal.css. '
            . 'Copy the dist/ folder into the plugin directory, or use the '
            . "'slashed_bricks/css_bundle_url' filter to specify the URL.",
            E_USER_NOTICE
        );
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
 * Initialize the plugin.
 */
function slashed_bricks_init() {
    if ( ! slashed_bricks_is_bricks_active() ) {
        add_action( 'admin_notices', 'slashed_bricks_missing_bricks_notice' );
        return;
    }

    require_once SLASHED_BRICKS_PATH . 'includes/class-enqueue.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-variables.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-classes.php';
    require_once SLASHED_BRICKS_PATH . 'includes/class-colors.php';

    new Slashed_Bricks_Enqueue();
    new Slashed_Bricks_Variables();
    new Slashed_Bricks_Classes();
    new Slashed_Bricks_Colors();
}
add_action( 'after_setup_theme', 'slashed_bricks_init' );

/**
 * Activation check: ensure Bricks Builder 1.9.2+ is available.
 */
function slashed_bricks_activation_check() {
    if ( ! slashed_bricks_is_bricks_active() ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );
        wp_die(
            esc_html__( 'SLASHED for Bricks requires Bricks Builder 1.9.2 or higher to be installed and active.', 'slashed-bricks' ),
            'Plugin Activation Error',
            array( 'back_link' => true )
        );
    }
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
