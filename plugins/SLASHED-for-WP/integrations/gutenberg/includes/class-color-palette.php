<?php
/**
 * Color palette synchronization for the block editor.
 *
 * @package SLASHED_Gutenberg
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Gutenberg_Color_Palette
 *
 * Registers SLASHED color tokens with the block editor's native color picker.
 *
 * Classic themes: `add_theme_support( 'editor-color-palette' )` is the
 * mechanism that populates the picker.
 *
 * Block/FSE themes: `theme.json` is the source of truth and overrides
 * `editor-color-palette`. The `wp_theme_json_data_theme` filter injects the
 * same palette into the theme.json data layer so block themes see the tokens.
 *
 * Each entry uses a `var(--sf-color-*)` reference as its value. Because
 * class-enqueue.php loads the full SLASHED bundle into the editor canvas,
 * every var() resolves live — including dark-mode variants and any user
 * token overrides. No hex values are hard-coded here.
 *
 * The `slug` values use the `slashed-` prefix so WP's generated utility
 * classes (`.has-slashed-primary-color`, `.has-slashed-primary-background-color`)
 * are clearly namespaced and predictable.
 *
 * Slugs deliberately use single dashes only — WP uses them as CSS class-name
 * segments. The CSS variable name (which may use double-dashes like
 * `--sf-color-text--secondary`) is stored separately in each entry.
 *
 * Palette groups (in picker order):
 *   Brand   — primary, secondary, tertiary, action, neutral, surface
 *   Status  — success, warning, error, info, danger
 *   Surface — bg, inset, raised, inverse
 *   Text    — text, text-secondary, text-muted
 *   Border  — border
 *   Link    — link
 */
class Slashed_Gutenberg_Color_Palette {

	public function __construct() {
		// Classic themes: add_theme_support drives the editor palette.
		add_theme_support( 'editor-color-palette', $this->build_palette() );
		// Block/FSE themes: theme.json takes precedence; inject via the data filter.
		add_filter( 'wp_theme_json_data_theme', array( $this, 'inject_theme_json_palette' ) );
	}

	/**
	 * Inject the SLASHED palette into the theme.json data for block/FSE themes.
	 *
	 * Uses WP_Theme_JSON_Data::update_with() which merges presets by slug, so
	 * the theme's own palette entries are preserved alongside ours. All SLASHED
	 * slugs are prefixed with 'slashed-' to avoid collisions.
	 *
	 * @param WP_Theme_JSON_Data $theme_json Theme JSON data object.
	 * @return WP_Theme_JSON_Data
	 */
	public function inject_theme_json_palette( $theme_json ) {
		$theme_json->update_with( array(
			'version'  => 3,
			'settings' => array(
				'color' => array(
					'palette' => $this->build_palette(),
				),
			),
		) );
		return $theme_json;
	}

	/**
	 * Build the full palette array from the token definitions.
	 *
	 * @return array[]
	 */
	private function build_palette() {
		$entries = array();

		foreach ( $this->get_definitions() as $def ) {
			$entries[] = array(
				'name'  => $def['name'],
				'slug'  => 'slashed-' . $def['slug'],
				'color' => 'var(--sf-color-' . $def['token'] . ')',
			);
		}

		return $entries;
	}

	/**
	 * Token definitions: slug (WP class-name fragment), label, CSS token suffix.
	 *
	 * `slug`  — appended to 'slashed-' for the WP color slug (single dashes only).
	 * `token` — the `--sf-color-{token}` custom property suffix (may contain --).
	 * `name`  — human-readable label shown in the color picker.
	 *
	 * @return array[]
	 */
	private function get_definitions() {
		return array(
			// Brand
			array( 'slug' => 'primary',        'token' => 'primary',        'name' => __( 'Primary',        'slashed-gutenberg' ) ),
			array( 'slug' => 'secondary',       'token' => 'secondary',      'name' => __( 'Secondary',      'slashed-gutenberg' ) ),
			array( 'slug' => 'tertiary',        'token' => 'tertiary',       'name' => __( 'Tertiary',       'slashed-gutenberg' ) ),
			array( 'slug' => 'action',          'token' => 'action',         'name' => __( 'Action',         'slashed-gutenberg' ) ),
			array( 'slug' => 'neutral',         'token' => 'neutral',        'name' => __( 'Neutral',        'slashed-gutenberg' ) ),
			array( 'slug' => 'surface',         'token' => 'surface',        'name' => __( 'Surface',        'slashed-gutenberg' ) ),
			// Status
			array( 'slug' => 'success',         'token' => 'success',        'name' => __( 'Success',        'slashed-gutenberg' ) ),
			array( 'slug' => 'warning',         'token' => 'warning',        'name' => __( 'Warning',        'slashed-gutenberg' ) ),
			array( 'slug' => 'error',           'token' => 'error',          'name' => __( 'Error',          'slashed-gutenberg' ) ),
			array( 'slug' => 'info',            'token' => 'info',           'name' => __( 'Info',           'slashed-gutenberg' ) ),
			array( 'slug' => 'danger',          'token' => 'danger',         'name' => __( 'Danger',         'slashed-gutenberg' ) ),
			// Surface
			array( 'slug' => 'bg',             'token' => 'bg',              'name' => __( 'Background',     'slashed-gutenberg' ) ),
			array( 'slug' => 'inset',          'token' => 'inset',           'name' => __( 'Inset',          'slashed-gutenberg' ) ),
			array( 'slug' => 'raised',         'token' => 'raised',          'name' => __( 'Raised',         'slashed-gutenberg' ) ),
			array( 'slug' => 'inverse',        'token' => 'inverse',         'name' => __( 'Inverse',        'slashed-gutenberg' ) ),
			// Text
			array( 'slug' => 'text',           'token' => 'text',            'name' => __( 'Text',           'slashed-gutenberg' ) ),
			array( 'slug' => 'text-secondary', 'token' => 'text--secondary', 'name' => __( 'Text Secondary', 'slashed-gutenberg' ) ),
			array( 'slug' => 'text-muted',     'token' => 'text--muted',     'name' => __( 'Text Muted',     'slashed-gutenberg' ) ),
			// Border & link
			array( 'slug' => 'border',         'token' => 'border',          'name' => __( 'Border',         'slashed-gutenberg' ) ),
			array( 'slug' => 'link',           'token' => 'link',            'name' => __( 'Link',           'slashed-gutenberg' ) ),
		);
	}
}
