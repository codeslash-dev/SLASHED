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

// ─── Canonical constants ─────────────────────────────────────────────────────

define( 'SLASHED_VERSION',   '0.4.18' );
define( 'SLASHED_PATH',      plugin_dir_path( __FILE__ ) );
define( 'SLASHED_URL',       plugin_dir_url( __FILE__ ) );

/**
 * Semver tag — version comparison / update detection only.
 * CDN URLs use the dist-branch SHA below (immutable).
 */
define( 'SLASHED_CSS_REF',   'v0.4.18' );

/**
 * HEAD commit SHA of the `dist` branch at the time of the last release.
 * jsDelivr treats commit SHAs as immutable (cached forever).
 * Updated automatically by the version-sync workflow on every release.
 */
define( 'SLASHED_DIST_SHA',  'be9ac0789180158c8ad86d5743020ef2272a063c' );

// ─── Integration path aliases ─────────────────────────────────────────────────
//
// Defined BEFORE including the integration entry points so the per-integration
// plugin files see their SLASHED_*_PATH/URL constants already set and skip
// their own define() calls (they guard with !defined checks). `__FILE__` inside
// each integration file still resolves to that file's own path, so all relative
// includes within the integration remain correct.

define( 'SLASHED_BRICKS_VERSION',   SLASHED_VERSION );
define( 'SLASHED_BRICKS_PATH',      SLASHED_PATH . 'integrations/bricks/' );
define( 'SLASHED_BRICKS_URL',       SLASHED_URL  . 'integrations/bricks/' );
define( 'SLASHED_BRICKS_CSS_REF',   SLASHED_CSS_REF );
define( 'SLASHED_BRICKS_DIST_SHA',  SLASHED_DIST_SHA );

define( 'SLASHED_GUTENBERG_VERSION',  SLASHED_VERSION );
define( 'SLASHED_GUTENBERG_PATH',     SLASHED_PATH . 'integrations/gutenberg/' );
define( 'SLASHED_GUTENBERG_URL',      SLASHED_URL  . 'integrations/gutenberg/' );
define( 'SLASHED_GUTENBERG_CSS_REF',  SLASHED_CSS_REF );
define( 'SLASHED_GUTENBERG_DIST_SHA', SLASHED_DIST_SHA );

// ─── Shared settings ──────────────────────────────────────────────────────────

require_once SLASHED_PATH . 'includes/class-settings.php';

// ─── Unified admin page ───────────────────────────────────────────────────────

if ( is_admin() ) {
	require_once SLASHED_PATH . 'includes/class-admin.php';
	add_action( 'plugins_loaded', function () {
		new Slashed_Admin();
	} );
}

// ─── Integration bootstraps ───────────────────────────────────────────────────
//
// Each integration's entry point guards its define() calls with !defined()
// checks (they see their constants already set above and skip). Their
// functions, hooks, and add_action() registrations run normally.

if ( Slashed_Settings::is_enabled( 'bricks' ) ) {
	require_once SLASHED_BRICKS_PATH . 'slashed-bricks.php';
}

if ( Slashed_Settings::is_enabled( 'gutenberg' ) ) {
	require_once SLASHED_GUTENBERG_PATH . 'slashed-gutenberg.php';
}

// ─── Activation / deactivation ────────────────────────────────────────────────

register_activation_hook( __FILE__, '__return_true' );

register_deactivation_hook( __FILE__, function () {
	// Unschedule any cron tasks registered by active integrations.
	$timestamp = wp_next_scheduled( 'slashed_bricks_version_check' );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, 'slashed_bricks_version_check' );
	}
} );
