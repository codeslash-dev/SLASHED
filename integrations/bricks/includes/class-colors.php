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
 * Registers SLASHED color tokens with Bricks Builder's global color palette.
 *
 * Every --sf-color-* token declared in the active bundle becomes a swatch:
 * brand families are split into per-brand categories, status tokens collect
 * under "SLASHED Status", and everything else lands in "SLASHED Semantic".
 * Each swatch references the variable via var() rather than a baked color
 * value so it adapts to runtime theming and dark mode.
 *
 * Note: the 'raw' color type (used instead of 'hex' for var() references)
 * requires Bricks 1.9.2+. Older versions may not render swatches correctly.
 */
class Slashed_Bricks_Colors {

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
        add_filter( 'bricks/setup/control_options', array( $this, 'register_global_colors' ) );
    }

    /**
     * Register SLASHED colors with Bricks global color palette.
     *
     * @param array $control_options Existing control options.
     * @return array Modified control options.
     */
    public function register_global_colors( $control_options ) {
        if ( ! is_array( $control_options ) ) {
            $control_options = array();
        }

        $colors = $this->get_colors();

        if ( ! isset( $control_options['globalColors'] ) || ! is_array( $control_options['globalColors'] ) ) {
            $control_options['globalColors'] = array();
        }

        foreach ( $colors as $color_entry ) {
            $control_options['globalColors'][] = $color_entry;
        }

        return $control_options;
    }

    /**
     * Get all SLASHED colors formatted for Bricks.
     *
     * @return array Array of color entries.
     */
    public function get_colors() {
        $categories = $this->build_categories( Slashed_Bricks_Inventory::get_color_variables() );

        /**
         * Filter which color categories to include.
         *
         * @param array $categories Associative array of category => color definitions.
         */
        $categories = apply_filters( 'slashed_bricks/color_categories', $categories );

        $colors = array();
        foreach ( $categories as $category => $category_colors ) {
            foreach ( $category_colors as $color ) {
                $color['category'] = $category;
                $colors[]          = $color;
            }
        }

        /**
         * Filter the registered colors before passing to Bricks.
         *
         * @param array $colors Array of color entry arrays.
         */
        return apply_filters( 'slashed_bricks/registered_colors', $colors );
    }

    /**
     * Build the color category structure from a flat list of --sf-color-*
     * variable names.
     *
     * @param string[] $variables Variable names like "--sf-color-primary-50".
     * @return array<string, array<int, array>> Map of category label => color entries.
     */
    private function build_categories( $variables ) {
        // Pre-seed brand buckets in canonical order so they appear first
        // in the picker even if no entries match.
        $categories = array();
        foreach ( self::$brands as $brand ) {
            $categories[ 'SLASHED ' . ucfirst( $brand ) ] = array();
        }
        $categories['SLASHED Status']   = array();
        $categories['SLASHED Semantic'] = array();

        foreach ( $variables as $var ) {
            $entry = $this->variable_to_swatch( $var );
            if ( null === $entry ) {
                continue;
            }
            $category                  = $entry['_category'];
            unset( $entry['_category'] );
            $categories[ $category ][] = $entry;
        }

        // Drop empty buckets so the Bricks UI doesn't render empty headers.
        foreach ( $categories as $cat => $entries ) {
            if ( empty( $entries ) ) {
                unset( $categories[ $cat ] );
            }
        }

        return $categories;
    }

    /**
     * Convert a single --sf-color-* variable name into a Bricks color entry,
     * tagged with the destination category.
     *
     * @param string $var Variable name including leading "--".
     * @return array|null
     */
    private function variable_to_swatch( $var ) {
        if ( 0 !== strpos( $var, '--sf-color-' ) ) {
            return null;
        }

        $key = substr( $var, strlen( '--sf-color-' ) );
        if ( '' === $key ) {
            return null;
        }

        $category = $this->category_for_key( $key );
        $label    = $this->humanize_key( $key );

        return array(
            'id'        => 'sf-color-' . $this->slugify( $key ),
            'name'      => 'SF ' . $label,
            'color'     => array( 'raw' => 'var(' . $var . ')' ),
            '_category' => $category,
        );
    }

    /**
     * Determine the category bucket for a color key (the part after
     * "--sf-color-").
     *
     * @param string $key Color key, e.g. "primary-50", "success-subtle", "text--muted".
     * @return string Category label.
     */
    private function category_for_key( $key ) {
        $first_dash = strpos( $key, '-' );
        $first      = false === $first_dash ? $key : substr( $key, 0, $first_dash );

        if ( in_array( $first, self::$brands, true ) ) {
            return 'SLASHED ' . ucfirst( $first );
        }

        if ( in_array( $first, self::$statuses, true ) ) {
            return 'SLASHED Status';
        }

        return 'SLASHED Semantic';
    }

    /**
     * Convert a color key into a human-readable label.
     *
     * Examples:
     *   "primary"          -> "Primary"
     *   "primary-50"       -> "Primary 50"
     *   "primary-a20"      -> "Primary A20"
     *   "text--secondary"  -> "Text Secondary"
     *   "bg--hover"        -> "Bg Hover"
     *
     * @param string $key Color key.
     * @return string
     */
    private function humanize_key( $key ) {
        // Collapse "--" used in semantic tokens to a single dash so the
        // resulting label reads naturally.
        $normalized = str_replace( '--', '-', $key );
        $parts      = array_filter( explode( '-', $normalized ), 'strlen' );

        $label_parts = array();
        foreach ( $parts as $part ) {
            // Keep numeric-style scale steps (50, 100, a20) uppercase-friendly.
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
     * Convert a color key into a deterministic slug suitable for use as a
     * Bricks color id. Collapses "--" to "-" so semantic keys produce
     * stable single-segment ids.
     *
     * @param string $key Color key.
     * @return string
     */
    private function slugify( $key ) {
        $normalized = str_replace( '--', '-', $key );
        // Strip any character outside [a-z0-9-].
        $normalized = preg_replace( '/[^a-zA-Z0-9-]/', '', $normalized );
        return strtolower( trim( $normalized, '-' ) );
    }
}
