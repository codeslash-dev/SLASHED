<?php
/**
 * Persistence layer for SLASHED Bricks token & plugin settings.
 *
 * Owns the option names and read/write paths used by every admin
 * surface (legacy form, Svelte SPA, REST controller). Centralising
 * this in one tiny class means the rest of the codebase never names
 * `get_option('slashed_bricks_tokens')` directly: changing the
 * underlying option, splitting it, or swapping in a CMB2 / Custom
 * Tables backend later only touches this file.
 *
 * Constants are intentionally exported as public so they remain
 * stable references for external code (filters, MU plugins). The
 * legacy class-admin-page.php keeps its own OPTION_NAME /
 * SETTINGS_OPTION_NAME constants pointing at these so any third
 * party that hard-coded the old class name keeps working through
 * one more release cycle (see PR 4 for removal).
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Token_Store
 *
 * Stateless wrapper around the two `wp_options` rows the plugin owns.
 * Every method is `static` because there is exactly one such store
 * per WordPress install — no need for an instance.
 */
class Slashed_Bricks_Token_Store {

	/**
	 * Option name for storing token overrides (per-section maps).
	 *
	 * Shape: `array<string, array<string,string>>` keyed by section
	 * slug ("colors", "typography"...) then by token key.
	 */
	const OPTION_NAME = 'slashed_bricks_tokens';

	/**
	 * Option name for plugin-level behavioural settings (currently
	 * just `html_font_size`). Kept separate from token overrides so
	 * "Reset all tokens" doesn't wipe non-token preferences.
	 */
	const SETTINGS_OPTION_NAME = 'slashed_bricks_settings';

	/**
	 * Allowed values for the css_bundle plugin setting.
	 * Single source of truth used by URL resolution and REST validation.
	 */
	const ALLOWED_CSS_BUNDLES = array( 'essential', 'optimal', 'full' );

	/**
	 * Read all token overrides.
	 *
	 * Always returns an array even when the option is missing or
	 * corrupt, so callers can blindly do `$settings[$section] ?? []`
	 * without null-checking the top level.
	 *
	 * @return array
	 */
	public static function get_settings() {
		$settings = get_option( self::OPTION_NAME, array() );
		return is_array( $settings ) ? $settings : array();
	}

	/**
	 * Persist the full token overrides map.
	 *
	 * @param array $settings Full settings map. Caller is responsible
	 *                        for sanitisation; pass values through
	 *                        Slashed_Bricks_Token_Sanitizer first.
	 */
	public static function update_settings( array $settings ) {
		update_option( self::OPTION_NAME, $settings );
	}

	/**
	 * Update a single section in-place.
	 *
	 * Convenience wrapper that merges one section into the existing
	 * map and writes the result back. Mirrors what the REST controller
	 * and the legacy form handler did inline.
	 *
	 * @param string $section          Section slug ("colors" etc.).
	 * @param array  $sanitized_values Already-sanitized values for the section.
	 * @return array The full settings map post-write.
	 */
	public static function update_section( $section, array $sanitized_values ) {
		$all             = self::get_settings();
		$all[ $section ] = $sanitized_values;
		self::update_settings( $all );
		return $all;
	}

	/**
	 * Drop overrides for one section so PHP defaults take over again.
	 *
	 * @param string $section Section slug.
	 * @return array Settings map post-delete.
	 */
	public static function delete_section( $section ) {
		$all = self::get_settings();
		unset( $all[ $section ] );
		self::update_settings( $all );
		return $all;
	}

	/**
	 * Drop the entire override option ("Reset all").
	 */
	public static function delete_settings() {
		delete_option( self::OPTION_NAME );
	}

	/**
	 * Default values for plugin settings.
	 * Merged with stored settings so new keys are always present.
	 */
	const PLUGIN_SETTING_DEFAULTS = array(
		'html_font_size'    => '',
		'css_bundle'        => 'optimal',
		'show_class_hints'  => false,
	);

	/**
	 * Read non-token plugin settings (e.g. html_font_size override).
	 * Always returns a complete map including defaults for missing keys.
	 *
	 * @return array
	 */
	public static function get_plugin_settings() {
		$stored = get_option( self::SETTINGS_OPTION_NAME, array() );
		$stored = is_array( $stored ) ? $stored : array();
		return array_merge( self::PLUGIN_SETTING_DEFAULTS, $stored );
	}

	/**
	 * Persist plugin settings.
	 *
	 * @param array $settings Plugin settings map.
	 */
	public static function update_plugin_settings( array $settings ) {
		update_option( self::SETTINGS_OPTION_NAME, $settings );
	}
}
