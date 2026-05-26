<?php
/**
 * Single source of truth for SLASHED Bricks admin tabs.
 *
 * The plugin has two flavours of tabs:
 *   - "Token tabs" — sections whose values live in
 *     `slashed_bricks_tokens` (colors, contrast, typography, spacing,
 *     radius, shadows, motion, zindex). These are the only tabs that
 *     read/write the option, so they're the only ones the legacy
 *     form handler and the REST sanitizer accept as `section`.
 *   - "View tabs" — read-only inventory / documentation panels
 *     (variables, classes, bundle, hooks, cheatsheet) that exist
 *     only in the Svelte SPA. They never touch the option.
 *
 * Splitting the registry into `get_token_tabs()` vs. `get_all()` lets
 * each caller pick the right slice:
 *   - legacy form's nav and section whitelist  → token tabs only.
 *   - Svelte SPA's nav + REST section whitelist → all tabs.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Tab_Registry
 *
 * Stateless. Returning fresh arrays each call is fine — the maps are
 * tiny and `WP_DEBUG` callers benefit from being unable to mutate a
 * shared instance accidentally.
 */
class Slashed_Bricks_Tab_Registry {

	/**
	 * Tabs whose values are persisted to the tokens option.
	 *
	 * Order is the legacy nav order; do not reshuffle without also
	 * updating any docs that screenshot / list the tabs.
	 *
	 * @return array<string,string> Slug → display label.
	 */
	public static function get_token_tabs() {
		return array(
			'colors'     => 'Colors',
			'contrast'   => 'Contrast',
			'typography' => 'Typography',
			'spacing'    => 'Spacing',
			'radius'     => 'Radius',
			'shadows'    => 'Shadows',
			'motion'     => 'Motion',
			'zindex'     => 'Z-Index',
		);
	}

	/**
	 * Read-only view tabs available only in the Svelte SPA.
	 *
	 * @return array<string,string> Slug → display label.
	 */
	public static function get_view_tabs() {
		return array(
			'variables'  => 'Variables',
			'classes'    => 'Classes',
			'bundle'     => 'Bundle',
			'hooks'      => 'Hooks',
			'cheatsheet' => 'Cheatsheet',
		);
	}

	/**
	 * All tabs (token + view) in display order.
	 *
	 * @return array<string,string>
	 */
	public static function get_all() {
		return array_merge( self::get_token_tabs(), self::get_view_tabs() );
	}

	/**
	 * Whether a slug names any registered tab (token or view).
	 *
	 * @param string $slug Slug to test.
	 * @return bool
	 */
	public static function has( $slug ) {
		$all = self::get_all();
		return is_string( $slug ) && isset( $all[ $slug ] );
	}

	/**
	 * Whether a slug names a *token* tab (i.e. one that may be saved
	 * to the option). Used by the REST controller as the section
	 * whitelist for save/reset.
	 *
	 * @param string $slug Slug to test.
	 * @return bool
	 */
	public static function is_token_tab( $slug ) {
		$tokens = self::get_token_tabs();
		return is_string( $slug ) && isset( $tokens[ $slug ] );
	}
}
