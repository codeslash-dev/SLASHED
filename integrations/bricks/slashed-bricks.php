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
 * Resolves the path to dist/slashed.optimal.css relative to the plugin,
 * or allows override via the 'slashed_bricks/css_bundle_url' filter.
 *
 * @return string URL to the CSS bundle.
 */
function slashed_bricks_get_css_url() {
    $default_url = SLASHED_BRICKS_URL . '../../dist/slashed.optimal.css';

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

    if ( 'bricks' === strtolower( $theme->get( 'Name' ) ) || 'bricks' === strtolower( $theme->get_template() ) ) {
        return true;
    }

    if ( defined( 'BRICKS_VERSION' ) ) {
        return true;
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
