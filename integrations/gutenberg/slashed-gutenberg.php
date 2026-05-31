<?php
/**
 * Plugin Name: SLASHED for Gutenberg
 * Plugin URI: https://github.com/codeslash-dev/SLASHED
 * Description: Integrates the SLASHED cascade-layer CSS framework with the WordPress block editor — CSS loading, color palette sync, and dark-mode bridging.
 * Version: 0.4.18
 * Author: SLASHED
 * Author URI: https://github.com/codeslash-dev/SLASHED
 * License: MIT
 * Requires PHP: 7.4
 * Requires at least: 6.4
 * Text Domain: slashed-gutenberg
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Constants.
 *
 * Guarded with !defined() so this file can be included by the unified
 * SLASHED plugin (slashed.php), which pre-defines these constants with
 * the correct paths relative to its own root. When loaded as a standalone
 * plugin they are not yet set and are defined here as usual.
 */
if ( ! defined( 'SLASHED_GUTENBERG_VERSION' ) ) {
	define( 'SLASHED_GUTENBERG_VERSION',  '0.4.18' );
	define( 'SLASHED_GUTENBERG_PATH',     plugin_dir_path( __FILE__ ) );
	define( 'SLASHED_GUTENBERG_URL',      plugin_dir_url( __FILE__ ) );
	define( 'SLASHED_GUTENBERG_CSS_REF',  'v0.4.18' );
	define( 'SLASHED_GUTENBERG_DIST_SHA', 'be9ac0789180158c8ad86d5743020ef2272a063c' );
}

define( 'SLASHED_GUTENBERG_ALLOWED_BUNDLES', array( 'essential', 'optimal', 'full' ) );

/**
 * Get the configured CSS bundle variant (essential / optimal / full).
 *
 * Reads from the 'slashed_gutenberg_settings' option; defaults to 'optimal'.
 *
 * @return string
 */
function slashed_gutenberg_get_css_bundle() {
	$settings = get_option( 'slashed_gutenberg_settings', array() );
	$bundle   = isset( $settings['css_bundle'] ) ? (string) $settings['css_bundle'] : 'optimal';
	if ( ! in_array( $bundle, SLASHED_GUTENBERG_ALLOWED_BUNDLES, true ) ) {
		$bundle = 'optimal';
	}
	return $bundle;
}

/**
 * Get the URL for the SLASHED CSS bundle.
 *
 * Defaults to the jsDelivr CDN pinned to the immutable dist-branch commit
 * SHA. If a local copy exists (symlink/in-repo dev mode, or copy-install),
 * the local file is preferred.
 *
 * Use the 'slashed_gutenberg/css_bundle_url' filter to override.
 *
 * @return string
 */
function slashed_gutenberg_get_css_url() {
	$bundle   = slashed_gutenberg_get_css_bundle();
	$filename = 'slashed.' . $bundle . '.css';

	$default_url = sprintf(
		'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@%s/%s',
		SLASHED_GUTENBERG_DIST_SHA,
		$filename
	);

	$repo_path = SLASHED_GUTENBERG_PATH . '../../dist/' . $filename;
	if ( file_exists( $repo_path ) ) {
		$default_url = SLASHED_GUTENBERG_URL . '../../dist/' . $filename;
	} elseif ( file_exists( SLASHED_GUTENBERG_PATH . 'dist/' . $filename ) ) {
		$default_url = SLASHED_GUTENBERG_URL . 'dist/' . $filename;
	}

	/**
	 * Filter the SLASHED CSS bundle URL used by the Gutenberg integration.
	 *
	 * @param string $url URL to the CSS bundle file.
	 */
	return apply_filters( 'slashed_gutenberg/css_bundle_url', $default_url );
}

/**
 * Bootstrap the Gutenberg integration.
 *
 * Hooked at after_setup_theme so theme support declarations (color palette)
 * land at the right time and the theme is fully loaded before we inspect
 * anything theme-related.
 */
function slashed_gutenberg_init() {
	require_once SLASHED_GUTENBERG_PATH . 'includes/class-enqueue.php';
	require_once SLASHED_GUTENBERG_PATH . 'includes/class-color-palette.php';

	new Slashed_Gutenberg_Enqueue();
	new Slashed_Gutenberg_Color_Palette();
}
add_action( 'after_setup_theme', 'slashed_gutenberg_init' );
