<?php
/**
 * Color resolver: computes hex fallback values for SLASHED color swatches.
 *
 * Converts oklch() source colors to hex approximations and computes the
 * full color scale (50-950, alpha steps, semantic aliases) for each family.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Color_Resolver
 *
 * Pure resolver. Accepts parsed color_values from the CSS parser and returns
 * a flat map of --sf-color-* variable names to hex color strings suitable
 * for the Bricks color picker swatch preview.
 *
 * Note: The hex values produced here are intentional approximations for the
 * builder panel swatch preview, not pixel-perfect replicas of browser-rendered
 * color-mix(). The oklch-to-hex conversion is accurate, but the scale mixing
 * uses a simplified linear interpolation in sRGB gamma space rather than the
 * perceptually uniform OKLab space that CSS color-mix() uses. This trade-off
 * keeps the implementation dependency-free and fast while providing visually
 * adequate swatches for the color picker UI.
 */
class Slashed_Bricks_Color_Resolver {

	/**
	 * Default oklch source values for each color family (light mode).
	 *
	 * @var array<string, string>
	 */
	private static $default_sources = array(
		'primary'   => 'oklch(0.45 0.20 264)',
		'secondary' => 'oklch(0.25 0.03 260)',
		'tertiary'  => 'oklch(0.48 0.14 310)',
		'action'    => 'oklch(0.60 0.16 210)',
		'neutral'   => 'oklch(0.45 0.02 260)',
		'base'      => 'oklch(0.98 0.005 260)',
		'success'   => 'oklch(0.48 0.17 150)',
		'warning'   => 'oklch(0.75 0.17 80)',
		'error'     => 'oklch(0.62 0.20 35)',
		'info'      => 'oklch(0.48 0.15 240)',
		'danger'    => 'oklch(0.48 0.24 12)',
	);

	/**
	 * Light step percentages: step => mix percentage of base color with --sf-color-base.
	 *
	 * @var array<int, float>
	 */
	private static $light_steps = array(
		50  => 0.04,
		100 => 0.08,
		200 => 0.20,
		300 => 0.40,
		400 => 0.65,
	);

	/**
	 * Dark step percentages: step => mix percentage of base color with text color.
	 *
	 * @var array<int, float>
	 */
	private static $dark_steps = array(
		600 => 0.82,
		700 => 0.62,
		800 => 0.38,
		900 => 0.18,
		950 => 0.08,
	);

	/**
	 * Alpha step percentages.
	 *
	 * @var array<string, float>
	 */
	private static $alpha_steps = array(
		'a5'  => 0.05,
		'a10' => 0.10,
		'a20' => 0.20,
		'a30' => 0.30,
		'a40' => 0.40,
		'a50' => 0.50,
		'a60' => 0.60,
		'a70' => 0.70,
		'a80' => 0.80,
		'a90' => 0.90,
		'a95' => 0.95,
	);

	/**
	 * Semantic alias mappings: alias => target step.
	 *
	 * @var array<string, string>
	 */
	private static $semantic_aliases = array(
		'superlight' => '50',
		'xlight'     => '200',
		'lighter'    => '400',
		'darker'     => '600',
		'xdark'      => '800',
		'superdark'  => '950',
		'hover'      => '600',
		'active'     => '800',
		'subtle'     => 'a10',
		'muted'      => 'a30',
		'ghost'      => 'a5',
	);

	/**
	 * Resolve color values into a hex map for all --sf-color-* variables.
	 *
	 * @param array $color_values Associative array from the CSS parser.
	 * @return array<string, string> Map of variable name to hex string.
	 */
	public static function resolve( $color_values ) {
		$hex_map = array();

		// Determine source oklch values for each family.
		$sources = self::resolve_sources( $color_values );

		// Approximate hex for base and text mixing targets.
		$base_hex = self::oklch_to_hex( 0.98, 0.005, 260.0 );
		$text_hex = '#1c1c2e';

		$base_rgb = self::hex_to_rgb( $base_hex );
		$text_rgb = self::hex_to_rgb( $text_hex );

		$families = array_keys( self::$default_sources );

		foreach ( $families as $family ) {
			if ( ! isset( $sources[ $family ] ) ) {
				continue;
			}

			$oklch      = $sources[ $family ];
			$family_hex = self::oklch_to_hex( $oklch[0], $oklch[1], $oklch[2] );
			$family_rgb = self::hex_to_rgb( $family_hex );

			// The base (500 step) is the direct conversion.
			$hex_map[ '--sf-color-' . $family ] = $family_hex;
			$hex_map[ '--sf-color-' . $family . '-500' ] = $family_hex;

			// Light steps (50-400): mix base color with base-light (#fafafa-ish).
			foreach ( self::$light_steps as $step => $pct ) {
				$mixed = self::mix_rgb( $family_rgb, $base_rgb, $pct );
				$hex_map[ '--sf-color-' . $family . '-' . $step ] = self::rgb_to_hex( $mixed );
			}

			// Dark steps (600-950): mix base color with text color.
			foreach ( self::$dark_steps as $step => $pct ) {
				$mixed = self::mix_rgb( $family_rgb, $text_rgb, $pct );
				$hex_map[ '--sf-color-' . $family . '-' . $step ] = self::rgb_to_hex( $mixed );
			}

			// Alpha steps: approximate by mixing with white.
			$white_rgb = array( 255, 255, 255 );
			foreach ( self::$alpha_steps as $suffix => $pct ) {
				$mixed = self::mix_rgb( $family_rgb, $white_rgb, $pct );
				$hex_map[ '--sf-color-' . $family . '-' . $suffix ] = self::rgb_to_hex( $mixed );
			}

			// Semantic aliases: map to their computed step values.
			foreach ( self::$semantic_aliases as $alias => $target ) {
				$target_key = '--sf-color-' . $family . '-' . $target;
				if ( isset( $hex_map[ $target_key ] ) ) {
					$hex_map[ '--sf-color-' . $family . '-' . $alias ] = $hex_map[ $target_key ];
				}
			}
		}

		// Semantic tokens with reasonable defaults.
		$hex_map = self::resolve_semantic_tokens( $hex_map, $sources );

		return $hex_map;
	}

	/**
	 * Resolve source oklch values from parsed color_values.
	 *
	 * Looks for @property initial-value declarations matching the pattern
	 * --sf-color-{family}-light with oklch() values.
	 *
	 * @param array $color_values Parsed color variable values.
	 * @return array<string, array{0:float, 1:float, 2:float}> Family => [L, C, H].
	 */
	private static function resolve_sources( $color_values ) {
		$sources = array();

		foreach ( self::$default_sources as $family => $default_oklch ) {
			$var_name = '--sf-color-' . $family . '-light';
			$oklch_str = $default_oklch;

			if ( isset( $color_values[ $var_name ] ) ) {
				$parsed = self::parse_oklch( $color_values[ $var_name ] );
				if ( null !== $parsed ) {
					$sources[ $family ] = $parsed;
					continue;
				}

				// Fallback: try parsing as hex color.
				$parsed = self::hex_to_oklch( $color_values[ $var_name ] );
				if ( null !== $parsed ) {
					$sources[ $family ] = $parsed;
					continue;
				}
			}

			// Fall back to default.
			$parsed = self::parse_oklch( $oklch_str );
			if ( null !== $parsed ) {
				$sources[ $family ] = $parsed;
			}
		}

		return $sources;
	}

	/**
	 * Resolve semantic tokens (text, bg, surface, etc.) with reasonable defaults.
	 *
	 * @param array $hex_map Existing hex map to extend.
	 * @param array $sources Resolved family sources.
	 * @return array<string, string> Extended hex map.
	 */
	private static function resolve_semantic_tokens( $hex_map, $sources ) {
		// --sf-color-text: dark neutral approximate.
		$hex_map['--sf-color-text'] = '#1c1c2e';

		// --sf-color-bg: very light, almost white.
		$hex_map['--sf-color-bg'] = '#fcfcfd';

		// --sf-color-surface: same as base.
		if ( isset( $hex_map['--sf-color-base'] ) ) {
			$hex_map['--sf-color-surface'] = $hex_map['--sf-color-base'];
		} else {
			$hex_map['--sf-color-surface'] = '#fafafa';
		}

		// Text variants.
		$hex_map['--sf-color-text--secondary']   = '#4a4a5e';
		$hex_map['--sf-color-text--muted']       = '#6e6e82';
		$hex_map['--sf-color-text--placeholder'] = '#9e9eb2';
		$hex_map['--sf-color-text--disabled']    = '#b4b4c4';
		$hex_map['--sf-color-text--inverse']     = '#fafafa';

		// Border defaults.
		$hex_map['--sf-color-border']       = '#d4d4de';
		$hex_map['--sf-color-border--muted'] = '#e8e8f0';

		return $hex_map;
	}

	/**
	 * Parse an oklch() string into L, C, H components.
	 *
	 * Handles formats like:
	 *   oklch(0.45 0.20 264)
	 *   oklch(0.45 0.20 264deg)
	 *
	 * @param string $str The oklch() function string.
	 * @return array{0:float, 1:float, 2:float}|null [L, C, H] or null on failure.
	 */
	private static function parse_oklch( $str ) {
		$str = trim( $str );
		if ( ! preg_match( '/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:deg)?\s*\)/i', $str, $m ) ) {
			return null;
		}
		return array( (float) $m[1], (float) $m[2], (float) $m[3] );
	}

	/**
	 * Convert oklch values to a hex color string.
	 *
	 * Conversion path: oklch -> OKLab -> LMS -> linear sRGB -> sRGB -> hex.
	 *
	 * @param float $l Lightness (0-1).
	 * @param float $c Chroma (0-0.4+).
	 * @param float $h Hue in degrees (0-360).
	 * @return string Hex color string (#rrggbb).
	 */
	private static function oklch_to_hex( $l, $c, $h ) {
		// Convert to OKLab.
		$h_rad = $h * M_PI / 180.0;
		$ok_a  = $c * cos( $h_rad );
		$ok_b  = $c * sin( $h_rad );

		// OKLab -> LMS (cube roots).
		$l_ = $l + 0.3963377774 * $ok_a + 0.2158037573 * $ok_b;
		$m_ = $l - 0.1055613458 * $ok_a - 0.0638541728 * $ok_b;
		$s_ = $l - 0.0894841775 * $ok_a - 1.2914855480 * $ok_b;

		// Cube to get LMS.
		$lms_l = $l_ * $l_ * $l_;
		$lms_m = $m_ * $m_ * $m_;
		$lms_s = $s_ * $s_ * $s_;

		// LMS -> linear sRGB.
		$r_lin = +4.0767416621 * $lms_l - 3.3077115913 * $lms_m + 0.2309699292 * $lms_s;
		$g_lin = -1.2684380046 * $lms_l + 2.6097574011 * $lms_m - 0.3413193965 * $lms_s;
		$b_lin = -0.0041960863 * $lms_l + 0.7081600000 * $lms_m + 0.2920793163 * $lms_s;

		// Linear sRGB -> sRGB (gamma correction).
		$r = self::linear_to_srgb( $r_lin );
		$g = self::linear_to_srgb( $g_lin );
		$b = self::linear_to_srgb( $b_lin );

		// Clamp and convert to 0-255.
		$r = (int) round( max( 0.0, min( 1.0, $r ) ) * 255 );
		$g = (int) round( max( 0.0, min( 1.0, $g ) ) * 255 );
		$b = (int) round( max( 0.0, min( 1.0, $b ) ) * 255 );

		return sprintf( '#%02x%02x%02x', $r, $g, $b );
	}

	/**
	 * Apply sRGB gamma transfer function (linear to sRGB).
	 *
	 * @param float $c Linear channel value.
	 * @return float sRGB channel value (0-1 range, may exceed before clamping).
	 */
	private static function linear_to_srgb( $c ) {
		if ( $c <= 0.0031308 ) {
			return 12.92 * $c;
		}
		return 1.055 * pow( $c, 1.0 / 2.4 ) - 0.055;
	}

	/**
	 * Apply inverse sRGB gamma transfer function (sRGB to linear).
	 *
	 * @param float $c sRGB channel value (0-1).
	 * @return float Linear channel value.
	 */
	private static function srgb_to_linear( $c ) {
		if ( $c <= 0.04045 ) {
			return $c / 12.92;
		}
		return pow( ( $c + 0.055 ) / 1.055, 2.4 );
	}

	/**
	 * Cube root that handles negative values.
	 *
	 * The intermediate LMS space used in this OKLab formulation can produce
	 * negative values for saturated colors, so a sign-preserving cube root
	 * is required.
	 *
	 * @param float $x Value to take cube root of.
	 * @return float Cube root of x.
	 */
	private static function safe_cbrt( $x ) {
		if ( $x >= 0 ) {
			return pow( $x, 1.0 / 3.0 );
		}
		return -pow( -$x, 1.0 / 3.0 );
	}

	/**
	 * Convert a hex color string to oklch values.
	 *
	 * Conversion path: hex -> RGB -> linear sRGB -> LMS -> OKLab -> OKLch.
	 * Uses the exact inverse of the matrices in oklch_to_hex() to ensure
	 * accurate round-trip conversion.
	 *
	 * @param string $str The value to parse (expected hex like #rrggbb or #rgb).
	 * @return array{0:float, 1:float, 2:float}|null [L, C, H] or null on failure.
	 */
	private static function hex_to_oklch( $str ) {
		$str = trim( $str );
		if ( ! preg_match( '/^#([0-9a-fA-F]{3,8})$/', $str ) ) {
			return null;
		}

		$hex = ltrim( $str, '#' );
		$len = strlen( $hex );

		// Expand shorthand (#rgb -> #rrggbb, #rgba -> #rrggbbaa).
		if ( 3 === $len || 4 === $len ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		} elseif ( 6 !== $len && 8 !== $len ) {
			return null;
		}

		// Extract RGB (ignore alpha channel if present).
		$r = (int) hexdec( substr( $hex, 0, 2 ) );
		$g = (int) hexdec( substr( $hex, 2, 2 ) );
		$b = (int) hexdec( substr( $hex, 4, 2 ) );

		// RGB 0-255 -> sRGB 0-1.
		$sr = $r / 255.0;
		$sg = $g / 255.0;
		$sb = $b / 255.0;

		// sRGB -> linear RGB.
		$lr = self::srgb_to_linear( $sr );
		$lg = self::srgb_to_linear( $sg );
		$lb = self::srgb_to_linear( $sb );

		// Linear sRGB -> LMS (exact inverse of the LMS->sRGB matrix in oklch_to_hex).
		$lms_l = 0.3777469185 * $lr + 0.4250470403 * $lg + 0.1979894399 * $lb;
		$lms_m = 0.1399355608 * $lr + 0.4483836167 * $lg + 0.4133162198 * $lb;
		$lms_s = -0.3338535206 * $lr + -1.0810207718 * $lg + 2.4244673521 * $lb;

		// LMS -> cube root (LMS_). Sign-preserving for negative intermediate values.
		$l_ = self::safe_cbrt( $lms_l );
		$m_ = self::safe_cbrt( $lms_m );
		$s_ = self::safe_cbrt( $lms_s );

		// LMS_ -> OKLab (inverse of the OKLab->LMS_ matrix in oklch_to_hex).
		$ok_l = 0.2104542553 * $l_ + 0.7936177850 * $m_ + ( -0.0040720468 ) * $s_;
		$ok_a = 1.9779984951 * $l_ + ( -2.4285922050 ) * $m_ + 0.4505937099 * $s_;
		$ok_b = 0.0259040371 * $l_ + 0.7827717662 * $m_ + ( -0.8086757660 ) * $s_;

		// OKLab -> OKLch.
		$c = sqrt( $ok_a * $ok_a + $ok_b * $ok_b );
		$h = atan2( $ok_b, $ok_a ) * 180.0 / M_PI;

		// Normalize hue to 0-360.
		if ( $h < 0 ) {
			$h += 360.0;
		}

		return array( $ok_l, $c, $h );
	}

	/**
	 * Mix two RGB colors at a given ratio via linear interpolation in sRGB gamma space.
	 *
	 * This is a simplified approximation of CSS color-mix(in oklab, ...) behaviour,
	 * suitable for generating swatch preview hex values. The percentage represents
	 * how much of colorA is in the result.
	 *
	 * @param array $rgb_a First color [r, g, b] (0-255).
	 * @param array $rgb_b Second color [r, g, b] (0-255).
	 * @param float $pct   Percentage of first color (0.0 to 1.0).
	 * @return array [r, g, b] (0-255).
	 */
	private static function mix_rgb( $rgb_a, $rgb_b, $pct ) {
		$r = (int) round( $rgb_a[0] * $pct + $rgb_b[0] * ( 1.0 - $pct ) );
		$g = (int) round( $rgb_a[1] * $pct + $rgb_b[1] * ( 1.0 - $pct ) );
		$b = (int) round( $rgb_a[2] * $pct + $rgb_b[2] * ( 1.0 - $pct ) );

		return array(
			max( 0, min( 255, $r ) ),
			max( 0, min( 255, $g ) ),
			max( 0, min( 255, $b ) ),
		);
	}

	/**
	 * Convert a hex color string to RGB array.
	 *
	 * @param string $hex Hex color (#rrggbb).
	 * @return array [r, g, b] (0-255).
	 */
	private static function hex_to_rgb( $hex ) {
		$hex = ltrim( $hex, '#' );
		return array(
			(int) hexdec( substr( $hex, 0, 2 ) ),
			(int) hexdec( substr( $hex, 2, 2 ) ),
			(int) hexdec( substr( $hex, 4, 2 ) ),
		);
	}

	/**
	 * Convert an RGB array to hex string.
	 *
	 * @param array $rgb [r, g, b] (0-255).
	 * @return string Hex color (#rrggbb).
	 */
	private static function rgb_to_hex( $rgb ) {
		return sprintf( '#%02x%02x%02x', $rgb[0], $rgb[1], $rgb[2] );
	}
}
