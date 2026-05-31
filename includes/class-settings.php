<?php
/**
 * Unified settings store.
 *
 * @package SLASHED
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Settings
 *
 * Manages the `slashed_settings` option, which controls which builder
 * integrations are active. Each integration owns its own option for
 * builder-specific configuration (token overrides, bundle choice, etc.).
 *
 * Default: all known integrations enabled. Users opt-out of integrations
 * they do not use via the SLASHED settings page.
 */
class Slashed_Settings {

	const OPTION_KEY = 'slashed_settings';

	/**
	 * Integrations shipped with this version.
	 *
	 * @var string[]
	 */
	const KNOWN_INTEGRATIONS = array( 'bricks', 'gutenberg' );

	/**
	 * Read settings from the database, applying defaults.
	 *
	 * @return array{integrations: array<string, bool>}
	 */
	public static function get() {
		$stored = get_option( self::OPTION_KEY, array() );
		if ( ! is_array( $stored ) ) {
			$stored = array();
		}

		return array(
			'integrations' => self::get_integrations( $stored ),
		);
	}

	/**
	 * Whether a given integration is enabled.
	 *
	 * Defaults to true so a fresh install activates every integration;
	 * users explicitly disable what they do not need.
	 *
	 * @param string $integration Integration slug (e.g. 'bricks', 'gutenberg').
	 * @return bool
	 */
	public static function is_enabled( $integration ) {
		$settings = self::get();
		$flags    = $settings['integrations'];
		// Unknown integrations default to false (future-compat: a new integration
		// added in a later release should not silently activate on upgrade).
		if ( ! in_array( $integration, self::KNOWN_INTEGRATIONS, true ) ) {
			return false;
		}
		return isset( $flags[ $integration ] ) ? (bool) $flags[ $integration ] : true;
	}

	/**
	 * Persist new settings values.
	 *
	 * Only known, sanitized keys are written. Unrecognised keys are silently
	 * dropped to prevent arbitrary data from landing in the option.
	 *
	 * @param array $data Raw submitted data (e.g. from $_POST).
	 * @return bool True if the value was updated, false if unchanged or invalid.
	 */
	public static function save( array $data ) {
		$integrations = array();
		foreach ( self::KNOWN_INTEGRATIONS as $slug ) {
			$integrations[ $slug ] = ! empty( $data['integrations'][ $slug ] );
		}

		return update_option( self::OPTION_KEY, array( 'integrations' => $integrations ) );
	}

	/**
	 * @param array $stored Raw stored option value.
	 * @return array<string, bool>
	 */
	private static function get_integrations( array $stored ) {
		$flags = isset( $stored['integrations'] ) && is_array( $stored['integrations'] )
			? $stored['integrations']
			: array();

		$result = array();
		foreach ( self::KNOWN_INTEGRATIONS as $slug ) {
			// Default true: new installs run all integrations until turned off.
			$result[ $slug ] = isset( $flags[ $slug ] ) ? (bool) $flags[ $slug ] : true;
		}
		return $result;
	}
}
