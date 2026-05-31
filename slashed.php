<?php
/**
 * Plugin Name: SLASHED
 * Plugin URI: https://github.com/codeslash-dev/SLASHED
 * Description: SLASHED cascade-layer CSS framework for WordPress. Activate integrations per builder from the settings page (Bricks, Gutenberg — more coming).
 * Version: 0.4.18
 * Author: SLASHED
 * Author URI: https://github.com/codeslash-dev/SLASHED
 * License: MIT
 * Requires PHP: 7.4
 * Requires at least: 6.4
 * Text Domain: slashed
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ─── Canonical constants ──────────────────────────────────────────────────────

define( 'SLASHED_VERSION',  '0.4.18' );
define( 'SLASHED_PATH',     plugin_dir_path( __FILE__ ) );
define( 'SLASHED_URL',      plugin_dir_url( __FILE__ ) );

/**
 * Semver tag — version comparison / update detection only.
 * CDN URLs use the dist-branch SHA below (immutable).
 */
define( 'SLASHED_CSS_REF',  'v0.4.18' );

/**
 * HEAD commit SHA of the `dist` branch at the time of the last release.
 * jsDelivr treats commit SHAs as immutable (cached forever).
 * Updated automatically by the version-sync workflow on every release.
 *
 * Integration plugin files that define their own SLASHED_{BUILDER}_DIST_SHA
 * should mirror this value. They are intentionally kept in sync rather than
 * pointing here (via a constant reference) so each integration file remains
 * self-contained and distributable as a standalone plugin.
 */
define( 'SLASHED_DIST_SHA', 'be9ac0789180158c8ad86d5743020ef2272a063c' );

// ─── Shared infrastructure ────────────────────────────────────────────────────

require_once SLASHED_PATH . 'includes/class-settings.php';
require_once SLASHED_PATH . 'includes/class-css-loader.php';

// ─── Token infrastructure (global — shared by all integrations) ───────────────

require_once SLASHED_PATH . 'includes/class-token-store.php';
require_once SLASHED_PATH . 'includes/class-token-sanitizer.php';
require_once SLASHED_PATH . 'includes/class-token-defaults.php';
require_once SLASHED_PATH . 'includes/class-tab-registry.php';
require_once SLASHED_PATH . 'includes/class-css-generator.php';
require_once SLASHED_PATH . 'includes/class-rest-controller.php';

// Token REST routes live under slashed/v1, independent of any builder.
add_action( 'rest_api_init', function () {
	( new Slashed_REST_Controller() )->register_routes();
} );

// Inject token override CSS after whichever integration enqueued slashed-framework.
function slashed_inject_token_overrides() {
	if ( wp_style_is( 'slashed-framework', 'enqueued' ) && Slashed_CSS_Generator::has_overrides() ) {
		wp_add_inline_style( 'slashed-framework', Slashed_CSS_Generator::get_override_css() );
	}
}
add_action( 'wp_enqueue_scripts', 'slashed_inject_token_overrides', 20 );
add_action( 'enqueue_block_editor_assets', 'slashed_inject_token_overrides', 20 );

// ─── Unified admin page ───────────────────────────────────────────────────────

if ( is_admin() ) {
	require_once SLASHED_PATH . 'includes/class-admin.php';
	require_once SLASHED_PATH . 'includes/class-token-page.php';
	add_action( 'plugins_loaded', function () {
		new Slashed_Admin();
		new Slashed_Token_Page();
	} );
}

// ─── Integration bootstraps ───────────────────────────────────────────────────
//
// Each integration's entry point defines its own SLASHED_{BUILDER}_* constants
// via plugin_dir_path(__FILE__) — correct whether loaded standalone or from here.
// The !defined() guards inside those files prevent redefinition errors if both
// the standalone plugin and this one are somehow active simultaneously.

if ( Slashed_Settings::is_enabled( 'bricks' ) ) {
	require_once SLASHED_PATH . 'integrations/bricks/slashed-bricks.php';
}

if ( Slashed_Settings::is_enabled( 'gutenberg' ) ) {
	require_once SLASHED_PATH . 'integrations/gutenberg/slashed-gutenberg.php';
}

// ─── Activation / deactivation ───────────────────────────────────────────────

register_activation_hook( __FILE__, '__return_true' );

register_deactivation_hook( __FILE__, function () {
	$timestamp = wp_next_scheduled( 'slashed_bricks_version_check' );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, 'slashed_bricks_version_check' );
	}
} );
