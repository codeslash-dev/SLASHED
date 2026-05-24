<?php
/**
 * Inventory provider: resolves the active SLASHED CSS bundle, parses it,
 * caches the result, and exposes categorized lookups for the Variables,
 * Classes, and Colors registration classes.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Inventory
 *
 * Single source of truth for "what tokens and classes does the framework
 * actually ship?" - so the Bricks UI registry can match the loaded CSS
 * exactly, regardless of which bundle (essential / optimal / full) or
 * release version is active.
 *
 * Resolution order:
 *   1. Local CSS file (repo symlink mode or copy-installed mode) -
 *      cheapest, parsed and cached by file mtime.
 *   2. Remote CSS URL (CDN) - fetched via wp_remote_get, cached for a day.
 *   3. Built-in hardcoded fallback - keeps the plugin functional offline
 *      and on hosts that block outbound HTTP.
 *
 * Public API:
 *   - get_variables()        sorted unique --sf-* names
 *   - get_variables_by_category() map<category-label, names[]>
 *   - get_sf_classes()       sorted unique .sf-* names
 *   - get_is_classes()       sorted unique .is-* names
 *   - get_color_variables()  every --sf-color-* token
 */
class Slashed_Bricks_Inventory {

	/**
	 * Transient key prefix.
	 */
	const TRANSIENT_PREFIX = 'slashed_bricks_inv_';

	/**
	 * Transient TTL for remote-fetched bundles.
	 */
	const TRANSIENT_TTL = DAY_IN_SECONDS;

	/**
	 * Per-request cache so multiple registration classes don't each
	 * pay the resolution cost.
	 *
	 * @var array|null
	 */
	private static $cache = null;

	/**
	 * Get the full inventory, resolving and caching on first access.
	 *
	 * @return array{variables: string[], sf_classes: string[], is_classes: string[]}
	 */
	public static function get() {
		if ( null !== self::$cache ) {
			return self::$cache;
		}

		$inventory = self::resolve();

		/**
		 * Filter the resolved inventory before it's used to register
		 * variables, classes, and colors with Bricks.
		 *
		 * @param array $inventory ['variables', 'sf_classes', 'is_classes'].
		 */
		self::$cache = apply_filters( 'slashed_bricks/inventory', $inventory );

		return self::$cache;
	}

	/**
	 * Reset the per-request cache. Mostly useful for tests.
	 */
	public static function flush() {
		self::$cache = null;
	}

	/**
	 * Get the flat list of all declared --sf-* variables.
	 *
	 * @return string[]
	 */
	public static function get_variables() {
		$inv = self::get();
		return $inv['variables'];
	}

	/**
	 * Get only --sf-color-* variables.
	 *
	 * @return string[]
	 */
	public static function get_color_variables() {
		$vars = self::get_variables();
		return array_values(
			array_filter(
				$vars,
				static function ( $v ) {
					return 0 === strpos( $v, '--sf-color-' );
				}
			)
		);
	}

	/**
	 * Get .sf-* class names declared in the bundle.
	 *
	 * @return string[]
	 */
	public static function get_sf_classes() {
		$inv = self::get();
		return $inv['sf_classes'];
	}

	/**
	 * Get .is-* class names declared in the bundle.
	 *
	 * @return string[]
	 */
	public static function get_is_classes() {
		$inv = self::get();
		return $inv['is_classes'];
	}

	/**
	 * Get variables grouped by category label.
	 *
	 * Categories appear in canonical display order. Empty categories are
	 * dropped. Names within each category are sorted.
	 *
	 * @return array<string, string[]>
	 */
	public static function get_variables_by_category() {
		$grouped = array();
		foreach ( self::get_variables() as $var ) {
			$cat = self::categorize_variable( $var );
			if ( ! isset( $grouped[ $cat ] ) ) {
				$grouped[ $cat ] = array();
			}
			$grouped[ $cat ][] = $var;
		}

		$ordered = array();
		foreach ( self::category_order() as $cat ) {
			if ( ! empty( $grouped[ $cat ] ) ) {
				sort( $grouped[ $cat ] );
				$ordered[ $cat ] = $grouped[ $cat ];
			}
		}

		// Append any uncategorized buckets at the end (defensive).
		foreach ( $grouped as $cat => $list ) {
			if ( ! isset( $ordered[ $cat ] ) ) {
				sort( $list );
				$ordered[ $cat ] = $list;
			}
		}

		return $ordered;
	}

	/**
	 * Categorize a CSS variable based on its name.
	 *
	 * Matches against the first segment after "--sf-" (e.g. "color",
	 * "space", "duration"). Falls back to "Misc" for unknown families.
	 *
	 * @param string $name Full variable name including leading "--".
	 * @return string Category label (without the "SLASHED " prefix).
	 */
	public static function categorize_variable( $name ) {
		$key = $name;
		if ( 0 === strpos( $key, '--sf-' ) ) {
			$key = substr( $key, 5 );
		}

		$dash  = strpos( $key, '-' );
		$first = false === $dash ? $key : substr( $key, 0, $dash );

		$map = self::category_map();
		return isset( $map[ $first ] ) ? $map[ $first ] : 'Misc';
	}

	/**
	 * Display order for variable categories. Categories not in this list
	 * are appended after the canonical ones.
	 *
	 * @return string[]
	 */
	public static function category_order() {
		return array(
			'Colors',
			'Typography',
			'Spacing',
			'Sizing',
			'Layout',
			'Borders',
			'Radius',
			'Shadows',
			'Effects',
			'Motion',
			'Icons',
			'Z-Index',
			'States',
			'Focus',
			'Scroll',
			'Print',
			'Misc',
		);
	}

	/**
	 * First-segment -> category-label mapping. Drives categorize_variable().
	 *
	 * @return array<string, string>
	 */
	private static function category_map() {
		return array(
			// Colors.
			'color'       => 'Colors',
			// Typography.
			'text'        => 'Typography',
			'font'        => 'Typography',
			'leading'     => 'Typography',
			'tracking'    => 'Typography',
			'body'        => 'Typography',
			'heading'     => 'Typography',
			'h1'          => 'Typography',
			'h2'          => 'Typography',
			'h3'          => 'Typography',
			'h4'          => 'Typography',
			'h5'          => 'Typography',
			'h6'          => 'Typography',
			'prose'       => 'Typography',
			'code'        => 'Typography',
			'optical'     => 'Typography',
			'line'        => 'Typography',
			// Spacing.
			'space'       => 'Spacing',
			'gap'         => 'Spacing',
			'gutter'      => 'Spacing',
			'component'   => 'Spacing',
			'section'     => 'Spacing',
			'flow'        => 'Spacing',
			'safe'        => 'Spacing',
			'header'      => 'Spacing',
			'sticky'      => 'Spacing',
			// Sizing.
			'size'        => 'Sizing',
			'aspect'      => 'Sizing',
			'ratio'       => 'Sizing',
			'touch'       => 'Sizing',
			// Layout.
			'container'   => 'Layout',
			'stack'       => 'Layout',
			'cluster'     => 'Layout',
			'sidebar'     => 'Layout',
			'switcher'    => 'Layout',
			'grid'        => 'Layout',
			'cover'       => 'Layout',
			'frame'       => 'Layout',
			'reel'        => 'Layout',
			'imposter'    => 'Layout',
			'bento'       => 'Layout',
			'box'         => 'Layout',
			'center'      => 'Layout',
			'content'     => 'Layout',
			'breakout'    => 'Layout',
			'divider'     => 'Layout',
			'field'       => 'Layout',
			// Borders.
			'border'      => 'Borders',
			'stroke'      => 'Borders',
			// Radius.
			'radius'      => 'Radius',
			// Shadows.
			'shadow'      => 'Shadows',
			// Effects.
			'blur'        => 'Effects',
			'opacity'     => 'Effects',
			'gradient'    => 'Effects',
			'mask'        => 'Effects',
			'perspective' => 'Effects',
			'drop'        => 'Effects',
			'contrast'    => 'Effects',
			// Motion.
			'duration'    => 'Motion',
			'ease'        => 'Motion',
			'transition'  => 'Motion',
			'motion'      => 'Motion',
			'animation'   => 'Motion',
			// Icons.
			'icon'        => 'Icons',
			// Z-Index.
			'z'           => 'Z-Index',
			// States.
			'is'          => 'States',
			'current'     => 'States',
			// Focus.
			'focus'       => 'Focus',
			'caret'       => 'Focus',
			// Scroll.
			'scroll'      => 'Scroll',
			'scrollbar'   => 'Scroll',
			// Print.
			'print'       => 'Print',
			// Misc explicit assignments.
			'truncate'    => 'Misc',
		);
	}

	// ---------------------------------------------------------------
	// Resolution.
	// ---------------------------------------------------------------

	/**
	 * Resolve the active CSS bundle into a parsed inventory.
	 *
	 * @return array{variables: string[], sf_classes: string[], is_classes: string[]}
	 */
	private static function resolve() {
		// 1. Local file - cheapest, also handles offline development.
		$local_path = self::find_local_bundle_path();
		if ( '' !== $local_path ) {
			$inventory = self::parse_path_with_cache( $local_path );
			if ( ! empty( $inventory['variables'] ) ) {
				return $inventory;
			}
		}

		// 2. Remote URL (CDN). Cached as a transient.
		$url = function_exists( 'slashed_bricks_get_css_url' )
			? slashed_bricks_get_css_url()
			: '';

		if ( '' !== $url && self::is_remote_url( $url ) ) {
			$inventory = self::parse_url_with_cache( $url );
			if ( ! empty( $inventory['variables'] ) ) {
				return $inventory;
			}
		}

		// 3. Built-in fallback - keeps the plugin functional even when
		//    no CSS is reachable (hosts blocking outbound HTTP, etc).
		return self::fallback_inventory();
	}

	/**
	 * Find a local path to the configured CSS bundle, if any.
	 *
	 * Mirrors the discovery logic in slashed_bricks_get_css_url() so the
	 * inventory always reflects the same file the frontend is loading.
	 *
	 * The 'slashed_bricks/inventory_local_path' filter is authoritative:
	 *   - return a string -> use that path (or empty if it doesn't exist)
	 *   - return false    -> skip local resolution entirely
	 *   - return null     -> use the default candidate paths
	 *
	 * @return string Absolute path, or '' when no local copy is available.
	 */
	private static function find_local_bundle_path() {
		$override = apply_filters( 'slashed_bricks/inventory_local_path', null );

		if ( false === $override ) {
			return '';
		}

		if ( is_string( $override ) ) {
			return ( '' !== $override && file_exists( $override ) ) ? $override : '';
		}

		$candidates = array(
			SLASHED_BRICKS_PATH . '../../dist/slashed.optimal.css', // repo symlink mode.
			SLASHED_BRICKS_PATH . 'dist/slashed.optimal.css',       // copy-install mode.
		);

		foreach ( $candidates as $candidate ) {
			if ( file_exists( $candidate ) ) {
				return $candidate;
			}
		}

		return '';
	}

	/**
	 * Parse a CSS file from disk, with a transient cache keyed by mtime.
	 *
	 * @param string $path Absolute path to a CSS file.
	 * @return array Inventory shape (may be empty on read failure).
	 */
	private static function parse_path_with_cache( $path ) {
		$mtime = @filemtime( $path );
		if ( false === $mtime ) {
			return Slashed_Bricks_CSS_Parser::empty_inventory();
		}

		$key    = self::TRANSIENT_PREFIX . md5( 'path:' . $path . ':' . $mtime );
		$cached = get_transient( $key );
		if ( is_array( $cached ) && isset( $cached['variables'] ) ) {
			return $cached;
		}

		$css = @file_get_contents( $path );
		if ( false === $css || '' === $css ) {
			return Slashed_Bricks_CSS_Parser::empty_inventory();
		}

		$inventory = Slashed_Bricks_CSS_Parser::parse( $css );
		set_transient( $key, $inventory, self::TRANSIENT_TTL );
		return $inventory;
	}

	/**
	 * Parse a CSS file fetched from a URL, with a transient cache keyed by URL.
	 *
	 * @param string $url HTTPS URL to a CSS file.
	 * @return array Inventory shape (may be empty on network failure).
	 */
	private static function parse_url_with_cache( $url ) {
		$key    = self::TRANSIENT_PREFIX . md5( 'url:' . $url );
		$cached = get_transient( $key );
		if ( is_array( $cached ) && isset( $cached['variables'] ) ) {
			return $cached;
		}

		if ( ! function_exists( 'wp_remote_get' ) ) {
			return Slashed_Bricks_CSS_Parser::empty_inventory();
		}

		$response = wp_remote_get(
			$url,
			array(
				'timeout'    => 10,
				'user-agent' => 'SLASHED-Bricks/' . SLASHED_BRICKS_VERSION,
			)
		);

		if ( is_wp_error( $response ) ) {
			return Slashed_Bricks_CSS_Parser::empty_inventory();
		}

		if ( 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return Slashed_Bricks_CSS_Parser::empty_inventory();
		}

		$css = wp_remote_retrieve_body( $response );
		if ( ! is_string( $css ) || '' === $css ) {
			return Slashed_Bricks_CSS_Parser::empty_inventory();
		}

		$inventory = Slashed_Bricks_CSS_Parser::parse( $css );
		set_transient( $key, $inventory, self::TRANSIENT_TTL );
		return $inventory;
	}

	/**
	 * Whether a URL points to a remote (http/https) resource.
	 *
	 * @param string $url URL to check.
	 * @return bool
	 */
	private static function is_remote_url( $url ) {
		return 0 === strpos( $url, 'http://' ) || 0 === strpos( $url, 'https://' );
	}

	/**
	 * Hardcoded fallback inventory used when neither a local file nor a
	 * remote fetch succeed. Pulled from the shipped optimal bundle of the
	 * release that this plugin version targets, so coverage is still
	 * complete even with no network or filesystem access.
	 *
	 * The list is generated from dist/slashed.optimal.css and bumped
	 * alongside SLASHED_BRICKS_CSS_REF.
	 *
	 * @return array{variables: string[], sf_classes: string[], is_classes: string[]}
	 */
	private static function fallback_inventory() {
		$path = SLASHED_BRICKS_PATH . 'data/inventory.json';
		if ( file_exists( $path ) ) {
			$json = @file_get_contents( $path );
			if ( is_string( $json ) && '' !== $json ) {
				$decoded = json_decode( $json, true );
				if ( is_array( $decoded )
					&& isset( $decoded['variables'], $decoded['sf_classes'], $decoded['is_classes'] )
				) {
					return array(
						'variables'  => array_values( $decoded['variables'] ),
						'sf_classes' => array_values( $decoded['sf_classes'] ),
						'is_classes' => array_values( $decoded['is_classes'] ),
					);
				}
			}
		}

		return Slashed_Bricks_CSS_Parser::empty_inventory();
	}
}
