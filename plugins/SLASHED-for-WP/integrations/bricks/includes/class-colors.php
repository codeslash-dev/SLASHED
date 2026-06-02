<?php
/**
 * Color palette synchronization for Bricks Builder.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Slashed_Bricks_Colors
 *
 * Registers SLASHED color tokens with Bricks Builder as a set of separate,
 * named color palettes that appear under the "Color palettes" dropdown of
 * the Bricks color picker (Color Manager) — distinct from the site's global
 * colors.
 *
 * Strategy
 * --------
 * Bricks stores color palettes in the wp_options row `bricks_color_palette`
 * as an array of `{id, name, colors:[{id,name,hex}]}` palette-group objects.
 * We treat SLASHED palettes as managed/virtual:
 *
 *   1. On every read of the option (option_bricks_color_palette /
 *      default_option_bricks_color_palette) we inject our palette groups.
 *      The plugin is registered early (plugins_loaded) so our filters are
 *      in place before Bricks' Database::__construct() reads the option.
 *   2. On every write (pre_update_option_bricks_color_palette) we strip
 *      our palettes back out so the DB never persists them. The integration
 *      remains the single source of truth — bumping the framework or
 *      changing the active bundle automatically updates what Bricks shows,
 *      without leaving stale rows behind on the site.
 *
 * The bricks/builder/color_palette filter is intentionally not used here:
 * per the Bricks forum that filter cannot assign names — "id and name are
 * generated after it is applied" — making it unsuitable for Color Manager
 * integration.
 *
 * Each color swatch references the framework variable via var(--sf-color-X).
 * The SLASHED bundle loaded in the editor iframe resolves the var() reference
 * so swatches track the live theme including dark mode and token overrides.
 *
 * Note: the 'raw' field is included alongside 'hex' for forward
 * compatibility with Bricks 1.9.2+, which prefers 'raw' when present.
 */
class Slashed_Bricks_Colors {

    /**
     * Prefix used on every palette and color id this integration injects.
     * Used to identify our entries when stripping on save.
     */
    const PALETTE_ID_PREFIX = 'slashed-';

    /**
     * Brand family slugs in canonical display order.
     *
     * @var string[]
     */
    private static $brands = array( 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'surface' );

    /**
     * Status family slugs.
     *
     * @var string[]
     */
    private static $statuses = array( 'success', 'warning', 'error', 'info', 'danger' );

    /**
     * Constructor. Register hooks.
     */
    public function __construct() {
        // Inject SLASHED named palette groups when Bricks reads the palette
        // option. This populates the Color Manager dropdown with organized,
        // labeled palettes (Primary, Secondary, …) rather than anonymous
        // swatches. The bricks/builder/color_palette filter is intentionally
        // not used here: per the Bricks forum that filter cannot assign names
        // — "id and name are generated after it is applied" — making it
        // unsuitable for Color Manager integration.
        //
        // Run late so any other plugin's additions are preserved.
        add_filter( 'option_bricks_color_palette', array( $this, 'inject_palettes' ), 20 );
        add_filter( 'default_option_bricks_color_palette', array( $this, 'inject_palettes' ), 20 );

        // Strip SLASHED palettes before they are persisted back to the DB.
        // pre_update_option_* signature is ($value, $old_value, $option).
        add_filter( 'pre_update_option_bricks_color_palette', array( $this, 'strip_palettes' ), 10, 1 );
    }

    /**
     * Inject SLASHED palettes into the Bricks palette list.
     *
     * Idempotent: any existing SLASHED-prefixed palettes are removed first
     * so multiple read passes don't create duplicates.
     *
     * @param mixed $palettes Existing value of bricks_color_palette option.
     * @return array
     */
    public function inject_palettes( $palettes ) {
        if ( ! is_array( $palettes ) ) {
            $palettes = array();
        }

        $palettes = $this->strip_palettes( $palettes );

        if ( ! $this->should_inject_palettes() ) {
            return $palettes;
        }

        foreach ( $this->build_palettes() as $palette ) {
            $palettes[] = $palette;
        }

        return $palettes;
    }

    /**
     * Whether to inject SLASHED palettes into the Bricks color palette.
     *
     * Bricks 2.2 introduced the Color Manager, which materializes every
     * palette color into `:root` as a static CSS variable (with an optional
     * `[data-brx-theme="dark"]` variant). That model is fundamentally at
     * odds with SLASHED's adaptive `light-dark()` tokens: injecting the
     * framework's `--sf-color-*` tokens there bakes them to fixed hex,
     * overrides the framework's own theme-aware definitions in `:root`, and
     * breaks dark/light switching (the toggle flips `color-scheme` but the
     * baked hex never changes).
     *
     * On Bricks 2.2+ we therefore skip palette injection entirely and let
     * users reach the tokens through the Variable Manager
     * (`class-variables.php`), whose empty-value entries Bricks never writes
     * to `:root`, so the framework remains the single source of truth.
     *
     * The decision is evaluated lazily inside the option filter (not in the
     * constructor) because `BRICKS_VERSION` is defined by the Bricks theme
     * after `plugins_loaded`, where these managers are instantiated.
     *
     * @return bool
     */
    private function should_inject_palettes() {
        $supports_color_manager = function_exists( 'slashed_bricks_supports_color_manager' )
            ? slashed_bricks_supports_color_manager()
            : false;

        /**
         * Filter whether SLASHED palettes are injected into the Bricks color
         * palette. Defaults to false on Bricks 2.2+ (Color Manager) to avoid
         * clobbering the framework's adaptive tokens in `:root`. Set to true
         * to force injection anyway (accepting that palette colors become
         * static hex snapshots without dark-mode adaptation).
         *
         * @param bool $inject Whether to inject the palettes.
         */
        return (bool) apply_filters( 'slashed_bricks/inject_color_palette', ! $supports_color_manager );
    }

    /**
     * Remove SLASHED-prefixed palettes from a palette array.
     *
     * Always returns a clean array, even when the option is malformed
     * (e.g. a fresh install with no row, a serialized scalar from a
     * misbehaving migration, or a corrupted value). pre_update_option_*
     * hooks must never widen the stored type from array to scalar - that
     * would break Bricks' own loader, which iterates over the option.
     *
     * @param mixed $palettes Value of bricks_color_palette option.
     * @return array
     */
    public function strip_palettes( $palettes ) {
        if ( ! is_array( $palettes ) ) {
            return array();
        }

        $kept = array();
        foreach ( $palettes as $palette ) {
            if ( is_array( $palette )
                && isset( $palette['id'] )
                && is_string( $palette['id'] )
                && 0 === strpos( $palette['id'], self::PALETTE_ID_PREFIX )
            ) {
                continue;
            }
            $kept[] = $palette;
        }

        return array_values( $kept );
    }

    /**
     * Build the SLASHED palette set from the current inventory.
     *
     * Returns one palette per brand family plus combined Status and
     * Semantic palettes - so users get a small, navigable picker rather
     * than one 275-swatch wall of color.
     *
     * @return array<int, array{id:string,name:string,colors:array}>
     */
    public function build_palettes() {
        $vars    = Slashed_Bricks_Inventory::get_color_variables();
        $hex_map = Slashed_Bricks_Inventory::get_color_hex_map();

        $by_brand = array_fill_keys( self::$brands, array() );
        $status   = array();
        $semantic = array();

        foreach ( $vars as $var ) {
            $key = substr( $var, strlen( '--sf-color-' ) );
            if ( '' === $key ) {
                continue;
            }
            $first_dash = strpos( $key, '-' );
            $first      = false === $first_dash ? $key : substr( $key, 0, $first_dash );

            if ( in_array( $first, self::$brands, true ) ) {
                $by_brand[ $first ][] = $var;
            } elseif ( in_array( $first, self::$statuses, true ) ) {
                $status[] = $var;
            } else {
                $semantic[] = $var;
            }
        }

        $palettes = array();

        foreach ( self::$brands as $brand ) {
            if ( empty( $by_brand[ $brand ] ) ) {
                continue;
            }
            $palettes[] = $this->build_palette(
                $brand,
                'SLASHED · ' . ucfirst( $brand ),
                $by_brand[ $brand ],
                $hex_map
            );
        }

        if ( ! empty( $status ) ) {
            $palettes[] = $this->build_palette( 'status', 'SLASHED · Status', $status, $hex_map );
        }

        if ( ! empty( $semantic ) ) {
            $palettes[] = $this->build_palette( 'semantic', 'SLASHED · Semantic', $semantic, $hex_map );
        }

        /**
         * Filter the SLASHED palettes before injection.
         *
         * @param array $palettes List of palette arrays.
         */
        return apply_filters( 'slashed_bricks/registered_palettes', $palettes );
    }

    /**
     * Build a single Bricks-shaped palette entry.
     *
     * @param string   $palette_slug Internal slug (used for id).
     * @param string   $palette_name Display name.
     * @param string[] $vars         Variable names (e.g. "--sf-color-primary-50").
     * @param array    $hex_map      Map of variable name to hex fallback.
     * @return array{id:string,name:string,colors:array}
     */
    private function build_palette( $palette_slug, $palette_name, $vars, $hex_map ) {
        return array(
            'id'     => self::PALETTE_ID_PREFIX . $palette_slug,
            'name'   => $palette_name,
            'colors' => $this->vars_to_palette_colors( $palette_slug, $vars, $hex_map ),
        );
    }

    /**
     * Convert a list of --sf-color-* variable names into Bricks palette
     * color entries.
     *
     * Each entry uses a resolved hex fallback for the 'hex' field (swatch
     * preview in the builder panel) and var(--sf-color-X) for 'raw' (the
     * actual value applied when a color is selected). This approach works
     * because the Bricks builder panel does not load the SLASHED CSS, so
     * var() references cannot resolve for preview purposes.
     *
     * @param string   $palette_slug Internal slug.
     * @param string[] $vars         Variable names.
     * @param array    $hex_map      Map of variable name to hex fallback.
     * @return array<int, array<string,string>>
     */
    private function vars_to_palette_colors( $palette_slug, $vars, $hex_map ) {
        $colors = array();
        foreach ( $vars as $var ) {
            $key = substr( $var, strlen( '--sf-color-' ) );
            if ( '' === $key ) {
                continue;
            }

            $hex_fallback = isset( $hex_map[ $var ] ) ? $hex_map[ $var ] : '#808080';

            $colors[] = array(
                'id'        => self::PALETTE_ID_PREFIX . $palette_slug . '-' . $this->slugify( $key ),
                'name'      => $this->humanize_key( $key ),
                'hex'       => $hex_fallback,
                'raw'       => 'var(' . $var . ')',
                // Bricks only enables its dark-mode toggle element when at least
                // one palette color has a dark_mode entry. SLASHED's CSS custom
                // properties resolve to their dark-mode value automatically when
                // data-brx-theme="dark" is set (bridged by the inline rule in
                // class-enqueue.php), so both modes can reference the same var().
                'dark_mode' => array(
                    'hex' => $hex_fallback,
                    'raw' => 'var(' . $var . ')',
                ),
            );
        }
        return $colors;
    }

    /**
     * Convert a color key into a human-readable label.
     *
     * Examples:
     *   "primary"          -> "Primary"
     *   "primary-50"       -> "Primary 50"
     *   "primary-a20"      -> "Primary A20"
     *   "text--secondary"  -> "Text Secondary"
     *
     * @param string $key Color key.
     * @return string
     */
    private function humanize_key( $key ) {
        $normalized = str_replace( '--', '-', $key );
        $parts      = array_filter( explode( '-', $normalized ), 'strlen' );

        $label_parts = array();
        foreach ( $parts as $part ) {
            if ( preg_match( '/^[0-9]+$/', $part ) ) {
                $label_parts[] = $part;
            } elseif ( preg_match( '/^a[0-9]+$/i', $part ) ) {
                $label_parts[] = strtoupper( $part );
            } else {
                $label_parts[] = ucfirst( $part );
            }
        }

        return implode( ' ', $label_parts );
    }

    /**
     * Convert a color key into a stable id-safe slug.
     *
     * @param string $key Color key.
     * @return string
     */
    private function slugify( $key ) {
        $normalized = str_replace( '--', '-', $key );
        $normalized = preg_replace( '/[^a-zA-Z0-9-]/', '', $normalized );
        return strtolower( trim( $normalized, '-' ) );
    }

    // ---------------------------------------------------------------
    // Backward-compatible flat color list (kept for filters/tests).
    // ---------------------------------------------------------------

    /**
     * Get every SLASHED color as a flat array.
     *
     * Mirrors the pre-palette shape so existing callers and the
     * 'slashed_bricks/registered_colors' / 'slashed_bricks/color_categories'
     * filters keep working.
     *
     * @return array<int, array<string,mixed>>
     */
    public function get_colors() {
        $palettes = $this->build_palettes();

        // Re-shape into the legacy "categories" map.
        $categories = array();
        foreach ( $palettes as $palette ) {
            $cat = $palette['name'];
            if ( ! isset( $categories[ $cat ] ) ) {
                $categories[ $cat ] = array();
            }
            foreach ( $palette['colors'] as $color ) {
                $categories[ $cat ][] = array(
                    'id'    => $color['id'],
                    'name'  => $color['name'],
                    'color' => array( 'raw' => isset( $color['raw'] ) ? $color['raw'] : $color['hex'] ),
                );
            }
        }

        /**
         * Filter which palette categories to include.
         *
         * @param array $categories Map of palette name => color entries.
         */
        $categories = apply_filters( 'slashed_bricks/color_categories', $categories );

        $colors = array();
        foreach ( $categories as $category => $entries ) {
            foreach ( $entries as $entry ) {
                $entry['category'] = $category;
                $colors[]          = $entry;
            }
        }

        /**
         * Filter the registered colors before passing to Bricks.
         *
         * @param array $colors Flat list of color entries.
         */
        return apply_filters( 'slashed_bricks/registered_colors', $colors );
    }
}
