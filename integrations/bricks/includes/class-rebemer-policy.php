<?php
/**
 * Naming policy + reserved-name source of truth for reBEMer.
 *
 * The defaults here MUST stay in lock-step with the JS side
 * (editor-app/src/lib/policy.js). The two are validated against each
 * other indirectly by Vitest in policy.test.js: any drift in the
 * regex source strings or default values would break the round-trip
 * between the localized PHP payload and the Svelte panel.
 *
 * Reserved-name list is built from data/inventory.json (sf_classes +
 * is_classes), so as the SLASHED framework grows new utility classes,
 * the reBEMer guard learns about them automatically on the next
 * `npm run docs` build.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_ReBEMer_Policy
 */
class Slashed_Bricks_ReBEMer_Policy {

	const ASCII_NAME_RE   = '^[a-z][a-z0-9]*(-[a-z0-9]+)*$';
	const UNICODE_NAME_RE = '^[\\p{Ll}\\p{Lo}][\\p{Ll}\\p{Lo}\\p{N}]*(-[\\p{Ll}\\p{Lo}\\p{N}]+)*$';

	const FLAVORS = array( 'two-dash', 'single-dash' );

	const CSS_KEYWORDS = array( 'auto', 'inherit', 'initial', 'unset', 'revert', 'revert-layer', 'none', 'currentcolor' );

	/** @var array|null Cached reserved-exact list. */
	private static $cached_reserved = null;

	/**
	 * The factory defaults. Keep this in sync with policy.js.
	 *
	 * @return array
	 */
	public static function defaults() {
		return array(
			'flavor'           => 'two-dash',
			'allowUnicode'     => false,
			'maxDepth'         => 6,
			'reservedPrefixes' => array( 'sf-', 'is-' ),
			'reservedExact'    => self::reserved_exact(),
			'blockNameRe'      => self::ASCII_NAME_RE,
			'elementNameRe'    => self::ASCII_NAME_RE,
			'modifierNameRe'   => self::ASCII_NAME_RE,
		);
	}


	/**
	 * Get the active policy. Filters first, sanitizes against the
	 * default shape, returns. The result is what gets serialized into
	 * window.slashedReBEMer.policy.
	 *
	 * @return array
	 */
	public static function get() {
		$defaults = self::defaults();

		/**
		 * Filter the reBEMer policy. Themes/plugins can override any
		 * field; missing or malformed fields fall back to defaults.
		 *
		 * @param array $policy The default policy.
		 */
		$filtered = apply_filters( 'slashed_bricks/rebemer_policy', $defaults );

		return self::sanitize( $filtered, $defaults );
	}

	/**
	 * The reserved-exact list, sourced from data/inventory.json.
	 * Cached per-request after the first call.
	 *
	 * @return array
	 */
	public static function reserved_exact() {
		if ( null !== self::$cached_reserved ) {
			return self::$cached_reserved;
		}

		$path = SLASHED_BRICKS_PATH . 'data/inventory.json';
		if ( ! file_exists( $path ) ) {
			self::$cached_reserved = array();
			return self::$cached_reserved;
		}

		$raw  = @file_get_contents( $path );
		$json = json_decode( (string) $raw, true );
		if ( ! is_array( $json ) ) {
			self::$cached_reserved = array();
			return self::$cached_reserved;
		}

		$names = array();
		foreach ( array( 'sf_classes', 'is_classes' ) as $bucket ) {
			if ( isset( $json[ $bucket ] ) && is_array( $json[ $bucket ] ) ) {
				foreach ( $json[ $bucket ] as $name ) {
					if ( is_string( $name ) && '' !== $name ) {
						$names[] = $name;
					}
				}
			}
		}


		$names = array_values( array_unique( $names ) );

		/**
		 * Filter the reBEMer reserved-exact class names.
		 *
		 * @param array $names The reserved-exact list.
		 */
		self::$cached_reserved = apply_filters( 'slashed_bricks/rebemer_reserved_names', $names );
		return self::$cached_reserved;
	}

	/**
	 * Whether `$name` is reserved per the active policy. Mirrors the
	 * client-side `isReserved()` so the preflight endpoint catches a
	 * tampered client.
	 *
	 * @param string $name
	 * @param array  $policy
	 * @return string|null One of 'cssKeyword'|'reservedExact'|'reservedPrefix' or null.
	 */
	public static function classify_reserved( $name, $policy = null ) {
		if ( ! is_string( $name ) || '' === $name ) {
			return null;
		}
		if ( in_array( $name, self::CSS_KEYWORDS, true ) ) {
			return 'cssKeyword';
		}
		if ( null === $policy ) {
			$policy = self::get();
		}
		$exact = isset( $policy['reservedExact'] ) && is_array( $policy['reservedExact'] ) ? $policy['reservedExact'] : array();
		if ( in_array( $name, $exact, true ) ) {
			return 'reservedExact';
		}
		$prefixes = isset( $policy['reservedPrefixes'] ) && is_array( $policy['reservedPrefixes'] ) ? $policy['reservedPrefixes'] : array();
		foreach ( $prefixes as $p ) {
			if ( is_string( $p ) && '' !== $p && 0 === strpos( $name, $p ) ) {
				return 'reservedPrefix';
			}
		}
		return null;
	}


	/**
	 * Sanitize a filtered policy against the defaults. Any malformed
	 * field falls back to the default; the function never trusts a
	 * filter author to have produced a sound shape.
	 *
	 * @param mixed $raw
	 * @param array $defaults
	 * @return array
	 */
	private static function sanitize( $raw, $defaults ) {
		if ( ! is_array( $raw ) ) {
			return $defaults;
		}

		$out = $defaults;

		if ( isset( $raw['flavor'] ) && in_array( $raw['flavor'], self::FLAVORS, true ) ) {
			$out['flavor'] = $raw['flavor'];
		}

		if ( isset( $raw['allowUnicode'] ) ) {
			$out['allowUnicode'] = (bool) $raw['allowUnicode'];
		}

		if ( isset( $raw['maxDepth'] ) && is_int( $raw['maxDepth'] ) && $raw['maxDepth'] >= 0 ) {
			$out['maxDepth'] = $raw['maxDepth'];
		}

		if ( isset( $raw['reservedPrefixes'] ) && is_array( $raw['reservedPrefixes'] ) ) {
			$out['reservedPrefixes'] = array_values( array_filter( $raw['reservedPrefixes'], function ( $s ) {
				return is_string( $s ) && '' !== $s;
			} ) );
		}

		if ( isset( $raw['reservedExact'] ) && is_array( $raw['reservedExact'] ) ) {
			$out['reservedExact'] = array_values( array_filter( $raw['reservedExact'], function ( $s ) {
				return is_string( $s ) && '' !== $s;
			} ) );
		}

		// If allowUnicode flips on without an explicit regex override,
		// switch the default regex source to the Unicode-aware variant.
		$re_fallback = $out['allowUnicode'] ? self::UNICODE_NAME_RE : self::ASCII_NAME_RE;
		foreach ( array( 'blockNameRe', 'elementNameRe', 'modifierNameRe' ) as $key ) {
			if ( isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) && '' !== $raw[ $key ] && false !== @preg_match( '/' . $raw[ $key ] . '/u', '' ) ) {
				$out[ $key ] = $raw[ $key ];
			} else {
				$out[ $key ] = $re_fallback;
			}
		}

		return $out;
	}
}
