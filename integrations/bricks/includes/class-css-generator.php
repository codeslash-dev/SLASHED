<?php
/**
 * CSS override generator for SLASHED design tokens.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_CSS_Generator
 *
 * Reads saved token overrides from the 'slashed_bricks_tokens' option and
 * generates a CSS string wrapped in @layer slashed.overrides { :root { ... } }
 * containing only non-empty customized values.
 */
class Slashed_Bricks_CSS_Generator {

	/**
	 * Option name for stored token overrides.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'slashed_bricks_tokens';

	/**
	 * Viewport min width in rem for fluid type calculations.
	 *
	 * @var float
	 */
	const VIEWPORT_MIN = 22.5;

	/**
	 * Viewport max width in rem for fluid type calculations.
	 *
	 * @var float
	 */
	const VIEWPORT_MAX = 95;

	/**
	 * Cached CSS output.
	 *
	 * @var string|null
	 */
	private static $cache = null;

	/**
	 * Check whether any token overrides exist.
	 *
	 * @return bool
	 */
	public static function has_overrides() {
		$settings = get_option( self::OPTION_NAME, array() );

		if ( ! is_array( $settings ) || empty( $settings ) ) {
			return false;
		}

		// Check if at least one section has a non-empty value.
		foreach ( $settings as $section => $values ) {
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
	 * @return string CSS output or empty string if no overrides.
	 */
	public static function get_override_css() {
		if ( null !== self::$cache ) {
			return self::$cache;
		}

		$settings = get_option( self::OPTION_NAME, array() );

		if ( ! is_array( $settings ) || empty( $settings ) ) {
			self::$cache = '';
			return self::$cache;
		}

		$declarations = array();

		// Process each section.
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

		if ( empty( $declarations ) ) {
			self::$cache = '';
			return self::$cache;
		}

		$css = "@layer slashed.overrides {\n\t:root {\n";
		foreach ( $declarations as $declaration ) {
			$css .= "\t\t" . $declaration . "\n";
		}
		$css .= "\t}\n}";

		/**
		 * Filter the generated override CSS.
		 *
		 * @param string $css The generated CSS string.
		 */
		self::$cache = apply_filters( 'slashed_bricks/override_css', $css );

		return self::$cache;
	}

	/**
	 * Generate CSS declarations for color tokens.
	 *
	 * @param array $settings Color section settings.
	 * @return array CSS declaration strings.
	 */
	private static function generate_color_declarations( $settings ) {
		$declarations = array();

		// Brand colors: brand_primary -> --sf-color-primary-light.
		$brand_colors = array( 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base' );
		foreach ( $brand_colors as $color ) {
			$key = 'brand_' . $color;
			if ( ! empty( $settings[ $key ] ) ) {
				$declarations[] = '--sf-color-' . $color . '-light: ' . $settings[ $key ] . ';';
			}
		}

		// Status colors: status_success -> --sf-color-success-light.
		$status_colors = array( 'success', 'warning', 'error', 'info', 'danger' );
		foreach ( $status_colors as $color ) {
			$key = 'status_' . $color;
			if ( ! empty( $settings[ $key ] ) ) {
				$declarations[] = '--sf-color-' . $color . '-light: ' . $settings[ $key ] . ';';
			}
		}

		return $declarations;
	}

	/**
	 * Generate CSS declarations for typography tokens.
	 *
	 * @param array $settings Typography section settings.
	 * @return array CSS declaration strings.
	 */
	private static function generate_typography_declarations( $settings ) {
		$declarations = array();

		// Font families: font_body -> --sf-font-body.
		$font_stacks = array( 'body', 'heading', 'mono', 'display', 'humanist', 'geometric', 'slab' );
		foreach ( $font_stacks as $name ) {
			$key = 'font_' . $name;
			if ( ! empty( $settings[ $key ] ) ) {
				$declarations[] = '--sf-font-' . $name . ': ' . $settings[ $key ] . ';';
			}
		}

		// Scale multipliers.
		if ( isset( $settings['text_scale'] ) && '' !== $settings['text_scale'] ) {
			$declarations[] = '--sf-text-scale: ' . $settings['text_scale'] . ';';
		}
		if ( isset( $settings['text_display_scale'] ) && '' !== $settings['text_display_scale'] ) {
			$declarations[] = '--sf-text-display-scale: ' . $settings['text_display_scale'] . ';';
		}

		// Font sizes: size_X_min + size_X_max -> --sf-text-X with clamp().
		$sizes = array( '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', 'display-s', 'display-m', 'display-l' );
		foreach ( $sizes as $size ) {
			$min_key = 'size_' . $size . '_min';
			$max_key = 'size_' . $size . '_max';

			$min_val = isset( $settings[ $min_key ] ) ? $settings[ $min_key ] : '';
			$max_val = isset( $settings[ $max_key ] ) ? $settings[ $max_key ] : '';

			// Only generate if both min and max are provided.
			if ( '' !== $min_val && '' !== $max_val ) {
				$clamp = self::build_clamp( (float) $min_val, (float) $max_val );
				if ( $clamp ) {
					$declarations[] = '--sf-text-' . $size . ': ' . $clamp . ';';
				}
			}
		}

		return $declarations;
	}

	/**
	 * Build a clamp() expression for fluid type scaling.
	 *
	 * Formula: clamp(min_rem, calc(slope * (100vw - 22.5rem) + min_rem), max_rem)
	 * where slope = (max - min) / (95 - 22.5)
	 *
	 * @param float $min Minimum size in rem (unitless number).
	 * @param float $max Maximum size in rem (unitless number).
	 * @return string|false The clamp() expression or false on invalid input.
	 */
	private static function build_clamp( $min, $max ) {
		if ( $min <= 0 || $max <= 0 ) {
			return false;
		}

		$viewport_range = self::VIEWPORT_MAX - self::VIEWPORT_MIN;
		$slope          = ( $max - $min ) / $viewport_range;

		// Round to reasonable precision.
		$slope_rounded = round( $slope, 6 );
		$min_rounded   = round( $min, 4 );
		$max_rounded   = round( $max, 4 );

		return 'clamp(' . $min_rounded . 'rem, calc(' . $slope_rounded . ' * (100vw - ' . self::VIEWPORT_MIN . 'rem) + ' . $min_rounded . 'rem), ' . $max_rounded . 'rem)';
	}

	/**
	 * Generate CSS declarations for spacing tokens.
	 *
	 * @param array $settings Spacing section settings.
	 * @return array CSS declaration strings.
	 */
	private static function generate_spacing_declarations( $settings ) {
		$declarations = array();

		if ( isset( $settings['space_scale'] ) && '' !== $settings['space_scale'] ) {
			$declarations[] = '--sf-space-scale: ' . $settings['space_scale'] . ';';
		}

		$aliases = array(
			'gutter'        => '--sf-space-gutter',
			'gap'           => '--sf-gap',
			'content_gap'   => '--sf-content-gap',
			'component_pad' => '--sf-component-pad',
			'section_pad'   => '--sf-section-pad',
		);

		foreach ( $aliases as $key => $property ) {
			if ( ! empty( $settings[ $key ] ) ) {
				$declarations[] = $property . ': ' . $settings[ $key ] . ';';
			}
		}

		return $declarations;
	}

	/**
	 * Generate CSS declarations for radius tokens.
	 *
	 * @param array $settings Radius section settings.
	 * @return array CSS declaration strings.
	 */
	private static function generate_radius_declarations( $settings ) {
		$declarations = array();

		if ( isset( $settings['radius_scale'] ) && '' !== $settings['radius_scale'] ) {
			$declarations[] = '--sf-radius-scale: ' . $settings['radius_scale'] . ';';
		}

		return $declarations;
	}

	/**
	 * Generate CSS declarations for shadow tokens.
	 *
	 * @param array $settings Shadows section settings.
	 * @return array CSS declaration strings.
	 */
	private static function generate_shadow_declarations( $settings ) {
		$declarations = array();

		if ( isset( $settings['shadow_strength'] ) && '' !== $settings['shadow_strength'] ) {
			$declarations[] = '--sf-shadow-strength: calc(' . $settings['shadow_strength'] . ' + var(--sf-is-dark) * 0.17);';
		}

		return $declarations;
	}

	/**
	 * Generate CSS declarations for motion tokens.
	 *
	 * @param array $settings Motion section settings.
	 * @return array CSS declaration strings.
	 */
	private static function generate_motion_declarations( $settings ) {
		$declarations = array();

		if ( isset( $settings['motion_scale'] ) && '' !== $settings['motion_scale'] ) {
			$declarations[] = '--sf-motion-scale: ' . $settings['motion_scale'] . ';';
		}

		// Duration values: duration_instant -> --sf-duration-instant: calc(Xms * var(--sf-motion-scale));
		$durations = array( 'instant', 'fast', 'normal', 'slow', 'slower' );
		foreach ( $durations as $name ) {
			$key = 'duration_' . $name;
			if ( isset( $settings[ $key ] ) && '' !== $settings[ $key ] ) {
				$declarations[] = '--sf-duration-' . $name . ': calc(' . $settings[ $key ] . 'ms * var(--sf-motion-scale));';
			}
		}

		return $declarations;
	}

	/**
	 * Generate CSS declarations for z-index tokens.
	 *
	 * @param array $settings Z-index section settings.
	 * @return array CSS declaration strings.
	 */
	private static function generate_zindex_declarations( $settings ) {
		$declarations = array();

		$levels = array( 'below', 'base', 'raised', 'low', 'mid', 'high', 'top', 'max' );
		foreach ( $levels as $name ) {
			if ( isset( $settings[ $name ] ) && '' !== $settings[ $name ] ) {
				$declarations[] = '--sf-z-' . $name . ': ' . (int) $settings[ $name ] . ';';
			}
		}

		return $declarations;
	}
}
