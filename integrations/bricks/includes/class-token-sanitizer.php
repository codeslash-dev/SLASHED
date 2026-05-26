<?php
/**
 * Pure sanitization helpers for SLASHED Bricks token submissions.
 *
 * Stateless static functions used by the REST controller (and any
 * future admin surface) to clean up section input before it lands in
 * `slashed_bricks_tokens`. Keeping the implementation purely static
 * rules out any chance of state leaking between callers — every
 * method takes its inputs and returns its outputs, nothing more.
 *
 * Sanitization rules
 * ------------------
 *   - colors section uses `sanitize_color_section()` which merges
 *     the paired HEX picker / Advanced raw inputs (`*_hex`, `*_raw`)
 *     down to a single value per base key. Raw wins over hex when
 *     both are present.
 *   - all other sections store flat key→string maps after running
 *     each value through `sanitize_text_field()` and stripping
 *     CSS-context-breaking characters (`{}<>@;`).
 *   - hex detection is split out so the colors UI can decide which
 *     sub-input to start in (HEX picker vs Advanced raw).
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Token_Sanitizer
 *
 * Stateless: every public method takes input + returns output. No DB
 * access, no option reads — pure data transforms.
 */
class Slashed_Bricks_Token_Sanitizer {

	/**
	 * Sanitize a single section's raw input map.
	 *
	 * Public entry point used by both the legacy form handler and the
	 * REST controller. Dispatches to `sanitize_color_section()` for
	 * the colors tab and falls back to a generic flat-map sanitizer
	 * for everything else.
	 *
	 * @param string $section Section slug (e.g. "colors", "typography").
	 * @param array  $data    Raw input — must be an array; non-arrays
	 *                        are coerced to `[]` for safety.
	 * @return array Sanitized values keyed by token key.
	 */
	public static function sanitize_section( $section, $data ) {
		if ( ! is_array( $data ) ) {
			$data = array();
		}

		if ( 'colors' === $section ) {
			return self::sanitize_color_section( $data );
		}

		$sanitized = array();
		foreach ( $data as $key => $value ) {
			$key = sanitize_key( $key );
			if ( '' === $key ) {
				continue;
			}
			if ( is_array( $value ) ) {
				$sanitized[ $key ] = array_map(
					static function ( $v ) {
						return self::sanitize_css_value( sanitize_text_field( (string) $v ) );
					},
					$value
				);
			} else {
				$sanitized[ $key ] = self::sanitize_css_value( sanitize_text_field( (string) $value ) );
			}
		}
		return $sanitized;
	}

	/**
	 * Strip characters that could break out of a CSS declaration.
	 *
	 * Removes the small set of metacharacters that can escape a
	 * `:root { ... }` block or inject at-rules: `{}<>@;`. Anything
	 * else (parens, spaces, function calls, var()...) is preserved
	 * because the framework legitimately uses them.
	 *
	 * @param string $value Already text-sanitised value.
	 * @return string
	 */
	public static function sanitize_css_value( $value ) {
		return str_replace( array( '{', '}', '<', '>', '@', ';' ), '', (string) $value );
	}

	/**
	 * Detect 3 / 4 / 6 / 8-digit HEX color literals.
	 *
	 * Used by the colors renderer to decide whether to start a row in
	 * HEX-picker mode or Advanced-raw mode. Anything that is not a
	 * literal `#…` HEX falls through to Advanced so users can keep
	 * authoring formats the WP color picker can't represent
	 * (oklch / rgb / named / `var(--…)`).
	 *
	 * @param mixed $value Stored color value.
	 * @return bool
	 */
	public static function is_hex_color( $value ) {
		return is_string( $value )
			&& 1 === preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', trim( $value ) );
	}

	/**
	 * Merge paired HEX/raw color inputs into a single stored value.
	 *
	 * The Colors tab renders two inputs per color:
	 *   - `<base>_hex` — WP color picker, HEX literals only.
	 *   - `<base>_raw` — Advanced free-form CSS color value.
	 *
	 * Precedence on save: `_raw` > `_hex` > legacy direct write of
	 * the bare key (kept for forward-compatibility with imported or
	 * filter-set values). All-empty rows are omitted from the result
	 * so the framework default applies.
	 *
	 * @param array $data Raw form data for the colors section.
	 * @return array Sanitized colors keyed by base token name.
	 */
	private static function sanitize_color_section( array $data ) {
		$grouped = array();

		foreach ( $data as $key => $value ) {
			$key = (string) $key;
			if ( '' === $key || ! is_string( $value ) ) {
				continue;
			}

			$clean = trim( self::sanitize_css_value( sanitize_text_field( $value ) ) );

			if ( self::ends_with( $key, '_hex' ) ) {
				$base = sanitize_key( substr( $key, 0, -4 ) );
				if ( '' !== $base ) {
					$grouped[ $base ]['hex'] = $clean;
				}
			} elseif ( self::ends_with( $key, '_raw' ) ) {
				$base = sanitize_key( substr( $key, 0, -4 ) );
				if ( '' !== $base ) {
					$grouped[ $base ]['raw'] = $clean;
				}
			} else {
				$base = sanitize_key( $key );
				if ( '' !== $base ) {
					$grouped[ $base ]['direct'] = $clean;
				}
			}
		}

		$sanitized = array();
		foreach ( $grouped as $base => $parts ) {
			if ( ! empty( $parts['raw'] ) ) {
				$sanitized[ $base ] = $parts['raw'];
			} elseif ( ! empty( $parts['hex'] ) ) {
				$sanitized[ $base ] = $parts['hex'];
			} elseif ( isset( $parts['direct'] ) && '' !== $parts['direct'] ) {
				$sanitized[ $base ] = $parts['direct'];
			}
		}
		return $sanitized;
	}

	/**
	 * Polyfill for str_ends_with() — the plugin still supports PHP 7.4.
	 *
	 * @param string $haystack Subject string.
	 * @param string $needle   Suffix to test for.
	 * @return bool
	 */
	private static function ends_with( $haystack, $needle ) {
		$nl = strlen( $needle );
		if ( 0 === $nl ) {
			return true;
		}
		$hl = strlen( $haystack );
		if ( $hl < $nl ) {
			return false;
		}
		return substr( $haystack, -$nl ) === $needle;
	}
}
