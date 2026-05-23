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
 * Note: The 'raw' color type (used instead of 'hex' for var() references)
 * requires Bricks 1.9.2+. Older versions may not render swatches correctly.
 */
class Slashed_Bricks_Colors {

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
        $colors = $this->get_colors();

        if ( ! isset( $control_options['globalColors'] ) ) {
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
        $colors     = array();
        $categories = $this->get_color_categories();

        /**
         * Filter which color categories to include.
         *
         * @param array $categories Associative array of category => color definitions.
         */
        $categories = apply_filters( 'slashed_bricks/color_categories', $categories );

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
     * Get color categories with their color definitions.
     *
     * @return array
     */
    private function get_color_categories() {
        $categories = array();

        // Brand colors with palette scales.
        $brands = array( 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base' );
        $scale  = array( '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950' );

        foreach ( $brands as $brand ) {
            $category_name = 'SLASHED ' . ucfirst( $brand );
            $brand_colors  = array();

            // Base color.
            $brand_colors[] = array(
                'id'    => 'sf-' . $brand,
                'name'  => 'SF ' . ucfirst( $brand ),
                'color' => array( 'raw' => 'var(--sf-color-' . $brand . ')' ),
            );

            // Scale colors.
            foreach ( $scale as $step ) {
                $brand_colors[] = array(
                    'id'    => 'sf-' . $brand . '-' . $step,
                    'name'  => 'SF ' . ucfirst( $brand ) . ' ' . $step,
                    'color' => array( 'raw' => 'var(--sf-color-' . $brand . '-' . $step . ')' ),
                );
            }

            $categories[ $category_name ] = $brand_colors;
        }

        // Status colors.
        $status_colors = array();
        $statuses      = array( 'success', 'warning', 'error', 'info', 'danger' );

        foreach ( $statuses as $status ) {
            $status_colors[] = array(
                'id'    => 'sf-' . $status,
                'name'  => 'SF ' . ucfirst( $status ),
                'color' => array( 'raw' => 'var(--sf-color-' . $status . ')' ),
            );
        }

        $categories['SLASHED Status'] = $status_colors;

        // Semantic colors.
        $semantic_colors = array();
        $semantic_map    = array(
            'text'            => 'Text',
            'text--secondary' => 'Text Secondary',
            'text--muted'     => 'Text Muted',
            'heading'         => 'Heading',
            'bg'              => 'Background',
            'surface'         => 'Surface',
            'well'            => 'Well',
            'raised'          => 'Raised',
            'overlay'         => 'Overlay',
            'inverse'         => 'Inverse',
            'border'          => 'Border',
            'border--subtle'  => 'Border Subtle',
            'border--strong'  => 'Border Strong',
            'link'            => 'Link',
            'link--hover'     => 'Link Hover',
            'link--active'    => 'Link Active',
            'link--visited'   => 'Link Visited',
        );

        foreach ( $semantic_map as $token => $label ) {
            $semantic_colors[] = array(
                'id'    => 'sf-' . str_replace( '--', '-', $token ),
                'name'  => 'SF ' . $label,
                'color' => array( 'raw' => 'var(--sf-color-' . $token . ')' ),
            );
        }

        $categories['SLASHED Semantic'] = $semantic_colors;

        return $categories;
    }
}
