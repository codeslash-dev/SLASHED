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
 * Registers SLASHED color tokens with Bricks Builder as a set of named color
 * palettes that appear under the Color Manager palette dropdown.
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
 *      our palettes back out so the DB never persists them. The plugin
 *      remains the single source of truth.
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
    private static $brands = array( 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base' );

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
        add_filter( 'option_bricks_color_palette', array( $this, 'inject_palettes' ), 20 );
        add_filter( 'default_option_bricks_color_palette', array( $this, 'inject_palettes' ), 20 );

        // Strip SLASHED palettes before they are persisted back to the DB.
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

        foreach ( $this->build_palettes() as $palette ) {
            $palettes[] = $palette;
        }

        return $palettes;
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
        $vars = Slashed_Bricks_Inventory::get_color_variables();

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
                $by_brand[ $brand ]
            );
        }

        if ( ! empty( $status ) ) {
            $palettes[] = $this->build_palette( 'status', 'SLASHED · Status', $status );
        }

        if ( ! empty( $semantic ) ) {
            $palettes[] = $this->build_palette( 'semantic', 'SLASHED · Semantic', $semantic );
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
     * @return array{id:string,name:string,colors:array}
     */
    private function build_palette( $palette_slug, $palette_name, $vars ) {
        return array(
            'id'     => self::PALETTE_ID_PREFIX . $palette_slug,
            'name'   => $palette_name,
            'colors' => $this->vars_to_palette_colors( $palette_slug, $vars ),
        );
    }

    /**
     * Convert a list of --sf-color-* variable names into Bricks palette
     * color entries.
     *
     * Each entry uses var(--sf-color-X) for both 'hex' (the legacy field
     * Bricks reads in older versions) and 'raw' (the preferred field in
     * Bricks 1.9.2+). The picker resolves these via the SLASHED bundle
     * loaded in the editor iframe, so swatches always reflect the live
     * theme - including dark mode and any user token overrides from the
     * SLASHED admin page.
     *
     * @param string   $palette_slug Internal slug.
     * @param string[] $vars         Variable names.
     * @return array<int, array<string,string>>
     */
    private function vars_to_palette_colors( $palette_slug, $vars ) {
        $colors = array();
        foreach ( $vars as $var ) {
            $key = substr( $var, strlen( '--sf-color-' ) );
            if ( '' === $key ) {
                continue;
            }
            $reference = 'var(' . $var . ')';
            $colors[]  = array(
                'id'   => self::PALETTE_ID_PREFIX . $palette_slug . '-' . $this->slugify( $key ),
                'name' => $this->humanize_key( $key ),
                'hex'  => $reference,
                'raw'  => $reference,
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
