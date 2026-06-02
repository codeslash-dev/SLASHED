<?php
/**
 * Generates CSS override declarations from saved SLASHED design tokens.
 *
 * Reads the 'slashed_tokens' option and produces a CSS string wrapped in
 * @layer slashed.overrides { :root { ... } } containing only non-empty
 * customized values. Framework defaults are untouched when no override is set.
 *
 * @package SLASHED
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_CSS_Generator
 */
class Slashed_CSS_Generator {

	const VIEWPORT_MIN = 22.5;
	const VIEWPORT_MAX = 95;

	/** @var string|null */
	private static $cache = null;

	/**
	 * Check whether any token overrides exist.
	 *
	 * @return bool
	 */
	public static function has_overrides() {
		$settings = Slashed_Token_Store::get_settings();

		if ( ! is_array( $settings ) || empty( $settings ) ) {
			return false;
		}

		foreach ( $settings as $values ) {
			if ( ! is_array( $values ) ) {
				continue;
			}
			foreach ( $values as $value ) {
				if ( is_array( $value ) ) {
					foreach ( $value as $v ) {
						if ( '' !== $v && null !== $v ) {
							return true;
						}
					}
				} elseif ( '' !== $value && null !== $value ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Get the full override CSS string.
	 *
	 * @return string CSS output, or empty string when no overrides are set.
	 */
	public static function get_override_css() {
		if ( null !== self::$cache ) {
			return self::$cache;
		}

		$settings = Slashed_Token_Store::get_settings();

		if ( empty( $settings ) ) {
			self::$cache = '';
			return self::$cache;
		}

		$declarations = array();

		if ( ! empty( $settings['colors'] ) && is_array( $settings['colors'] ) ) {
			$declarations = array_merge( $declarations, self::generate_color_declarations( $settings['colors'] ) );
		}
		if ( ! empty( $settings['typography'] ) && is_array( $settings['typography'] ) ) {
			$declarations = array_merge( $declarations, self::generate_typography_declarations( $settings['typography'] ) );
		}
		if ( ! empty( $settings['spacing'] ) && is_array( $settings['spacing'] ) ) {
			$declarations = array_merge( $declarations, self::generate_spacing_declarations( $settings['spacing'] ) );
		}
		if ( ! empty( $settings['radius'] ) && is_array( $settings['radius'] ) ) {
			$declarations = array_merge( $declarations, self::generate_radius_declarations( $settings['radius'] ) );
		}
		if ( ! empty( $settings['shadows'] ) && is_array( $settings['shadows'] ) ) {
			$declarations = array_merge( $declarations, self::generate_shadow_declarations( $settings['shadows'] ) );
		}
		if ( ! empty( $settings['motion'] ) && is_array( $settings['motion'] ) ) {
			$declarations = array_merge( $declarations, self::generate_motion_declarations( $settings['motion'] ) );
		}
		if ( ! empty( $settings['zindex'] ) && is_array( $settings['zindex'] ) ) {
			$declarations = array_merge( $declarations, self::generate_zindex_declarations( $settings['zindex'] ) );
		}
		if ( ! empty( $settings['contrast'] ) && is_array( $settings['contrast'] ) ) {
			$declarations = array_merge( $declarations, self::generate_contrast_declarations( $settings['contrast'] ) );
		}
		if ( ! empty( $settings['layouts'] ) && is_array( $settings['layouts'] ) ) {
			$declarations = array_merge( $declarations, self::generate_layout_declarations( $settings['layouts'] ) );
		}

		if ( empty( $declarations ) ) {
			self::$cache = '';
			return self::$cache;
		}

		$css = "@layer slashed.overrides {\n\t:root {\n";
		foreach ( $declarations as $declaration ) {
			$css .= "\t\t" . $declaration . "\n";
		}
		$css .= "\t}\n}";

		/** @filter slashed/override_css The generated token override CSS string. */
		self::$cache = apply_filters( 'slashed/override_css', $css );

		return self::$cache;
	}

	private static function generate_color_declarations( $settings ) {
		$declarations  = array();
		$brand_colors  = array( 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'surface' );
		$status_colors = array( 'success', 'warning', 'error', 'info', 'danger' );

		foreach ( $brand_colors as $color ) {
			$value = self::valid_color( $settings[ 'brand_' . $color ] ?? '' );
			if ( false !== $value ) {
				$declarations[] = '--sf-color-' . $color . '-light: ' . $value . ';';
			}
		}
		foreach ( $status_colors as $color ) {
			$value = self::valid_color( $settings[ 'status_' . $color ] ?? '' );
			if ( false !== $value ) {
				$declarations[] = '--sf-color-' . $color . '-light: ' . $value . ';';
			}
		}

		$dark_enabled = ! isset( $settings['dark_overrides_enabled'] )
			|| '0' !== $settings['dark_overrides_enabled'];

		if ( $dark_enabled ) {
			foreach ( $brand_colors as $color ) {
				$value = self::valid_color( $settings[ 'brand_dark_' . $color ] ?? '' );
				if ( false !== $value ) {
					$declarations[] = '--sf-color-' . $color . '-dark: ' . $value . ';';
				}
			}
			foreach ( $status_colors as $color ) {
				$value = self::valid_color( $settings[ 'status_dark_' . $color ] ?? '' );
				if ( false !== $value ) {
					$declarations[] = '--sf-color-' . $color . '-dark: ' . $value . ';';
				}
			}
		}

		return $declarations;
	}

	private static function generate_typography_declarations( $settings ) {
		$declarations = array();
		$font_stacks  = array( 'body', 'heading', 'mono', 'display', 'humanist', 'geometric', 'slab' );

		foreach ( $font_stacks as $name ) {
			$value = self::valid_font_family( $settings[ 'font_' . $name ] ?? '' );
			if ( false !== $value ) {
				$declarations[] = '--sf-font-' . $name . ': ' . $value . ';';
			}
		}

		if ( isset( $settings['text_scale'] ) && is_numeric( $settings['text_scale'] ) ) {
			$declarations[] = '--sf-text-scale: ' . self::format_float( $settings['text_scale'] ) . ';';
		}
		if ( isset( $settings['text_display_scale'] ) && is_numeric( $settings['text_display_scale'] ) ) {
			$declarations[] = '--sf-text-display-scale: ' . self::format_float( $settings['text_display_scale'] ) . ';';
		}

		$sizes = array( '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', 'display-s', 'display-m', 'display-l' );
		foreach ( $sizes as $size ) {
			$min_val = $settings[ 'size_' . $size . '_min' ] ?? '';
			$max_val = $settings[ 'size_' . $size . '_max' ] ?? '';
			if ( '' !== $min_val && '' !== $max_val ) {
				$clamp = self::build_clamp( (float) $min_val, (float) $max_val );
				if ( $clamp ) {
					$declarations[] = '--sf-text-' . $size . ': ' . $clamp . ';';
				}
			}
		}

		return $declarations;
	}

	private static function build_clamp( $min, $max ) {
		if ( $min <= 0 || $max <= 0 ) {
			return false;
		}
		$slope = ( $max - $min ) / ( self::VIEWPORT_MAX - self::VIEWPORT_MIN );
		return 'clamp(' . round( $min, 4 ) . 'rem, calc(' . round( $slope, 6 ) . ' * (100vw - ' . self::VIEWPORT_MIN . 'rem) + ' . round( $min, 4 ) . 'rem), ' . round( $max, 4 ) . 'rem)';
	}

	private static function generate_spacing_declarations( $settings ) {
		$declarations = array();

		if ( isset( $settings['space_scale'] ) && is_numeric( $settings['space_scale'] ) ) {
			$declarations[] = '--sf-space-scale: ' . self::format_float( $settings['space_scale'] ) . ';';
		}

		$steps = array( '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl' );
		foreach ( $steps as $step ) {
			$min_val = $settings[ 'space_' . $step . '_min' ] ?? '';
			$max_val = $settings[ 'space_' . $step . '_max' ] ?? '';
			if ( '' !== $min_val && '' !== $max_val ) {
				$clamp = self::build_clamp( (float) $min_val, (float) $max_val );
				if ( $clamp ) {
					$declarations[] = '--sf-space-' . $step . ': calc(' . $clamp . ' * var(--sf-space-scale));';
				}
			}
		}

		$aliases = array(
			'gutter'        => '--sf-space-gutter',
			'gap'           => '--sf-gap',
			'content_gap'   => '--sf-content-gap',
			'component_pad' => '--sf-component-pad',
			'section_pad'   => '--sf-section-pad',
		);
		foreach ( $aliases as $key => $property ) {
			$value = self::valid_dimension( $settings[ $key ] ?? '' );
			if ( false !== $value ) {
				$declarations[] = $property . ': ' . $value . ';';
			}
		}

		return $declarations;
	}

	private static function generate_radius_declarations( $settings ) {
		$declarations = array();
		if ( isset( $settings['radius_scale'] ) && is_numeric( $settings['radius_scale'] ) ) {
			$declarations[] = '--sf-radius-scale: ' . self::format_float( $settings['radius_scale'] ) . ';';
		}
		return $declarations;
	}

	private static function generate_shadow_declarations( $settings ) {
		$declarations = array();
		if ( isset( $settings['shadow_strength'] ) && is_numeric( $settings['shadow_strength'] ) ) {
			$declarations[] = '--sf-shadow-strength: calc(' . self::format_float( $settings['shadow_strength'] ) . ' + var(--sf-is-dark) * 0.17);';
		}
		$glow = self::valid_color( $settings['glow_color'] ?? '' );
		if ( false !== $glow ) {
			$declarations[] = '--sf-shadow-glow-color: ' . $glow . ';';
		}
		return $declarations;
	}

	private static function generate_motion_declarations( $settings ) {
		$declarations = array();
		if ( isset( $settings['motion_scale'] ) && is_numeric( $settings['motion_scale'] ) ) {
			$declarations[] = '--sf-motion-scale: ' . self::format_float( $settings['motion_scale'] ) . ';';
		}
		$durations = array( 'instant', 'fast', 'normal', 'slow', 'slower' );
		foreach ( $durations as $name ) {
			if ( isset( $settings[ 'duration_' . $name ] ) && is_numeric( $settings[ 'duration_' . $name ] ) ) {
				$declarations[] = '--sf-duration-' . $name . ': calc(' . self::format_float( $settings[ 'duration_' . $name ] ) . 'ms * var(--sf-motion-scale));';
			}
		}
		return $declarations;
	}

	private static function generate_zindex_declarations( $settings ) {
		$declarations = array();
		foreach ( array( 'below', 'base', 'raised', 'low', 'mid', 'high', 'top', 'max' ) as $name ) {
			if ( isset( $settings[ $name ] ) && '' !== $settings[ $name ] ) {
				$declarations[] = '--sf-z-' . $name . ': ' . (int) $settings[ $name ] . ';';
			}
		}
		return $declarations;
	}

	private static function generate_contrast_declarations( $settings ) {
		$declarations = array();

		$numerics = array(
			'contrast_bias'      => '--sf-contrast-bias',
			'contrast_threshold' => '--sf-contrast-threshold',
			'opacity_disabled'   => '--sf-opacity-disabled',
		);
		foreach ( $numerics as $key => $property ) {
			if ( isset( $settings[ $key ] ) && '' !== $settings[ $key ] ) {
				$declarations[] = $property . ': ' . self::format_float( $settings[ $key ] ) . ';';
			}
		}

		$pixel_metrics = array(
			'focus_ring_width'  => '--sf-focus-ring-width',
			'focus_ring_offset' => '--sf-focus-ring-offset',
		);
		foreach ( $pixel_metrics as $key => $property ) {
			if ( isset( $settings[ $key ] ) && '' !== $settings[ $key ] ) {
				$declarations[] = $property . ': ' . self::format_float( $settings[ $key ] ) . 'px;';
			}
		}

		if ( isset( $settings['focus_ring_style'] ) && '' !== $settings['focus_ring_style'] ) {
			$style   = (string) $settings['focus_ring_style'];
			$allowed = array( 'solid', 'dashed', 'dotted', 'double', 'none' );
			if ( in_array( $style, $allowed, true ) ) {
				$declarations[] = '--sf-focus-ring-style: ' . $style . ';';
			}
		}

		return $declarations;
	}

	private static function generate_layout_declarations( $settings ) {
		$declarations = array();
		$map          = array(
			'container_narrow'   => '--sf-container-narrow',
			'container_prose'    => '--sf-container-prose',
			'container_default'  => '--sf-container-default',
			'container_wide'     => '--sf-container-wide',
			'grid_min'           => '--sf-grid-min',
			'grid_min_xs'        => '--sf-grid-min-xs',
			'grid_min_s'         => '--sf-grid-min-s',
			'grid_min_l'         => '--sf-grid-min-l',
			'grid_min_xl'        => '--sf-grid-min-xl',
			'grid_min_2xl'       => '--sf-grid-min-2xl',
			'switcher_threshold' => '--sf-switcher-threshold',
			'bento_cols'         => '--sf-bento-cols-default',
			'bento_row_default'  => '--sf-bento-row-default',
			'bento_row_compact'  => '--sf-bento-row-compact',
			'bento_row_tall'     => '--sf-bento-row-tall',
			'content_width'      => '--sf-content-width',
			'breakout_width'     => '--sf-breakout-width',
			'sidebar_width'      => '--sf-sidebar-width',
			'sidebar_min_width'  => '--sf-sidebar-min-width',
			'cover_min_height'   => '--sf-cover-min-height',
			'cover_padding'      => '--sf-cover-padding',
			'frame_ratio'        => '--sf-frame-ratio',
			'reel_item_width'    => '--sf-reel-item-width',
			'reel_height'        => '--sf-reel-height',
			'imposter_margin'    => '--sf-imposter-margin',
			'equal_cols'         => '--sf-equal-cols',
		);
		// bento_cols / equal_cols are plain integers; everything else is a
		// length, ratio, or math expression — all covered by valid_dimension.
		foreach ( $map as $key => $property ) {
			$value = self::valid_dimension( $settings[ $key ] ?? '' );
			if ( false !== $value ) {
				$declarations[] = $property . ': ' . $value . ';';
			}
		}
		return $declarations;
	}

	/**
	 * Defence-in-depth guard: reject values that have no business inside a
	 * token value, regardless of type. Blocks url()/image-set() (external
	 * fetch + referrer leak), at-rules, CSS comments, HTML, backslash escapes
	 * (which could smuggle a stripped delimiter such as `}` back in via `\7d`),
	 * and control characters. The blacklist in Slashed_Token_Sanitizer already
	 * strips `{ } < > @ ;`; this is the second layer at emission time.
	 *
	 * @param string $value Candidate value.
	 * @return bool True when safe to emit.
	 */
	private static function is_css_safe( $value ) {
		$v = (string) $value;
		if ( '' === $v ) {
			return false;
		}
		if ( preg_match( '/[\x00-\x1F\x7F]/', $v ) ) {
			return false;
		}
		if ( preg_match( '#url\s*\(|image-set\s*\(|@|/\*|\*/|</|\\\\#i', $v ) ) {
			return false;
		}
		return self::balanced_parens( $v );
	}

	/**
	 * Verify parentheses are balanced and never close below zero — stops a
	 * value like `1) ; } html{` from prematurely closing a function context.
	 *
	 * @param string $value Candidate value.
	 * @return bool
	 */
	private static function balanced_parens( $value ) {
		$depth = 0;
		$len   = strlen( $value );
		for ( $i = 0; $i < $len; $i++ ) {
			$ch = $value[ $i ];
			if ( '(' === $ch ) {
				$depth++;
			} elseif ( ')' === $ch ) {
				$depth--;
				if ( $depth < 0 ) {
					return false;
				}
			}
		}
		return 0 === $depth;
	}

	/**
	 * Validate a CSS color value: hex, named keyword, a known colour function,
	 * or a var()/color-mix()/light-dark() reference. Returns the trimmed value
	 * when valid, or false to skip emission (framework default then applies).
	 *
	 * @param mixed $value Raw color input.
	 * @return string|false
	 */
	private static function valid_color( $value ) {
		$v = trim( (string) $value );
		if ( ! self::is_css_safe( $v ) ) {
			return false;
		}
		// Hex literal.
		if ( preg_match( '/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i', $v ) ) {
			return $v;
		}
		// Functional notation: rgb/hsl/hwb/lab/lch/oklab/oklch/color/color-mix/
		// light-dark/var. Restrict the body to a safe charset (digits, units,
		// punctuation used by colour syntax) so nothing unexpected slips in.
		if ( preg_match( '/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark|var)\s*\(/i', $v )
			&& preg_match( '#^[a-z0-9\s.,%()/_\#-]+$#i', $v ) ) {
			return $v;
		}
		// Bare keyword: named colour, currentColor, transparent, inherit, etc.
		if ( preg_match( '/^[a-z][a-z0-9-]*$/i', $v ) ) {
			return $v;
		}
		return false;
	}

	/**
	 * Validate a CSS dimension / length / ratio: a number with optional unit,
	 * an aspect ratio (`16 / 9`), or a calc()/clamp()/min()/max()/var()
	 * expression. Returns the trimmed value when valid, false otherwise.
	 *
	 * @param mixed $value Raw dimension input.
	 * @return string|false
	 */
	private static function valid_dimension( $value ) {
		$v = trim( (string) $value );
		if ( ! self::is_css_safe( $v ) ) {
			return false;
		}
		$units = 'px|rem|em|%|vw|vh|vmin|vmax|vi|vb|ch|ex|fr|deg|s|ms|dvh|svh|lvh|dvw|svw|lvw|cqi|cqb|cqw|cqh';
		if ( preg_match( '/^-?(\d+\.?\d*|\.\d+)(' . $units . ')?$/i', $v ) ) {
			return $v;
		}
		// Aspect ratio, e.g. "16 / 9".
		if ( preg_match( '#^\d+(\.\d+)?\s*/\s*\d+(\.\d+)?$#', $v ) ) {
			return $v;
		}
		// Math functions with a restricted charset.
		if ( preg_match( '/^(calc|clamp|min|max|var)\s*\(/i', $v )
			&& preg_match( '#^[a-z0-9\s.,%()/_*+-]+$#i', $v ) ) {
			return $v;
		}
		return false;
	}

	/**
	 * Validate a font-family value: a list of family names (letters, digits,
	 * spaces, hyphens, commas, quotes) or a single var() reference. Returns the
	 * trimmed value when valid, false otherwise.
	 *
	 * @param mixed $value Raw font input.
	 * @return string|false
	 */
	private static function valid_font_family( $value ) {
		$v = trim( (string) $value );
		if ( ! self::is_css_safe( $v ) ) {
			return false;
		}
		if ( preg_match( '/^var\s*\(\s*--[a-z0-9-]+\s*\)$/i', $v ) ) {
			return $v;
		}
		if ( preg_match( '/^[a-z0-9 ,"\'-]+$/i', $v ) ) {
			return $v;
		}
		return false;
	}

	/**
	 * Locale-safe float formatter.
	 *
	 * @param mixed $value Raw numeric input.
	 * @return string
	 */
	private static function format_float( $value ) {
		$num = (float) $value;
		$out = rtrim( rtrim( number_format( $num, 6, '.', '' ), '0' ), '.' );
		return '' === $out ? '0' : $out;
	}
}
