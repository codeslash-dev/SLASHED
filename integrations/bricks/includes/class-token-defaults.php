<?php
/**
 * Token default values for the SLASHED framework.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Token_Defaults
 *
 * Provides factory default values for all editable design tokens,
 * organized by section for use in the admin settings page.
 */
class Slashed_Bricks_Token_Defaults {

	/**
	 * Get all default token values organized by section.
	 *
	 * @return array Associative array keyed by section slug.
	 */
	public static function get_all() {
		return array(
			'colors'     => self::get_colors(),
			'typography' => self::get_typography(),
			'spacing'    => self::get_spacing(),
			'radius'     => self::get_radius(),
			'shadows'    => self::get_shadows(),
			'motion'     => self::get_motion(),
			'zindex'     => self::get_zindex(),
		);
	}

	/**
	 * Get defaults for a specific section.
	 *
	 * @param string $section Section slug.
	 * @return array Section defaults or empty array.
	 */
	public static function get_section( $section ) {
		$all = self::get_all();
		return isset( $all[ $section ] ) ? $all[ $section ] : array();
	}

	/**
	 * Get color token defaults.
	 *
	 * @return array
	 */
	public static function get_colors() {
		return array(
			'brand' => array(
				'primary'   => 'oklch(0.45 0.20 264)',
				'secondary' => 'oklch(0.25 0.03 260)',
				'tertiary'  => 'oklch(0.48 0.14 310)',
				'action'    => 'oklch(0.60 0.16 210)',
				'neutral'   => 'oklch(0.45 0.02 260)',
				'base'      => 'oklch(0.98 0.005 260)',
			),
			'status' => array(
				'success' => 'oklch(0.48 0.17 150)',
				'warning' => 'oklch(0.75 0.17 80)',
				'error'   => 'oklch(0.62 0.20 35)',
				'info'    => 'oklch(0.48 0.15 240)',
				'danger'  => 'oklch(0.48 0.24 12)',
			),
		);
	}

	/**
	 * Get typography token defaults.
	 *
	 * @return array
	 */
	public static function get_typography() {
		return array(
			'font_families' => array(
				'body'      => 'system-ui, sans-serif',
				'heading'   => 'system-ui, sans-serif',
				'mono'      => 'ui-monospace, monospace',
				'display'   => 'system-ui, sans-serif',
				'humanist'  => 'system-ui, sans-serif',
				'geometric' => 'system-ui, sans-serif',
				'slab'      => 'system-ui, sans-serif',
			),
			'font_sizes' => array(
				'2xs'       => array( 'min' => 0.51, 'max' => 0.53 ),
				'xs'        => array( 'min' => 0.64, 'max' => 0.70 ),
				's'         => array( 'min' => 0.80, 'max' => 0.94 ),
				'm'         => array( 'min' => 1.00, 'max' => 1.25 ),
				'l'         => array( 'min' => 1.25, 'max' => 1.67 ),
				'xl'        => array( 'min' => 1.56, 'max' => 2.22 ),
				'2xl'       => array( 'min' => 1.95, 'max' => 2.96 ),
				'3xl'       => array( 'min' => 2.44, 'max' => 3.95 ),
				'4xl'       => array( 'min' => 3.05, 'max' => 5.26 ),
				'display-s' => array( 'min' => 2.40, 'max' => 3.00 ),
				'display-m' => array( 'min' => 3.00, 'max' => 4.00 ),
				'display-l' => array( 'min' => 3.75, 'max' => 5.33 ),
			),
			'scale_multipliers' => array(
				'text_scale'         => 1,
				'text_display_scale' => 1,
			),
		);
	}

	/**
	 * Get spacing token defaults.
	 *
	 * @return array
	 */
	public static function get_spacing() {
		return array(
			'space_scale'    => 1,
			'gutter'         => 'var(--sf-space-l)',
			'gap'            => 'var(--sf-space-m)',
			'content_gap'    => 'var(--sf-space-s)',
			'component_pad'  => 'var(--sf-space-m)',
			'section_pad'    => 'var(--sf-section-pad--m)',
		);
	}

	/**
	 * Get radius token defaults.
	 *
	 * @return array
	 */
	public static function get_radius() {
		return array(
			'radius_scale' => 1,
		);
	}

	/**
	 * Get shadow token defaults.
	 *
	 * @return array
	 */
	public static function get_shadows() {
		return array(
			'shadow_strength' => 0.08,
		);
	}

	/**
	 * Get motion token defaults.
	 *
	 * @return array
	 */
	public static function get_motion() {
		return array(
			'motion_scale' => 1,
			'durations'    => array(
				'instant' => 100,
				'fast'    => 150,
				'normal'  => 250,
				'slow'    => 400,
				'slower'  => 600,
			),
		);
	}

	/**
	 * Get z-index token defaults.
	 *
	 * @return array
	 */
	public static function get_zindex() {
		return array(
			'below'  => -1,
			'base'   => 0,
			'raised' => 1,
			'low'    => 10,
			'mid'    => 100,
			'high'   => 500,
			'top'    => 900,
			'max'    => 9999,
		);
	}
}
