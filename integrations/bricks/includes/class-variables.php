<?php
/**
 * Code editor autocomplete for SLASHED CSS custom properties.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Slashed_Bricks_Variables
 *
 * Registers SLASHED CSS custom properties with the Bricks code editor
 * autocomplete only. Does not inject into the Variable Manager to avoid
 * namespace aliasing.
 */
class Slashed_Bricks_Variables {

    /**
     * Constructor. Register the code editor signatures filter.
     */
    public function __construct() {
        // Code editor autocomplete (Bricks 1.9.2+): lists the original
        // --sf-* names so authors typing custom CSS see the framework's
        // native namespace directly.
        add_filter( 'bricks/code/get_code_signatures', array( $this, 'register_code_signatures' ) );
    }

    // ---------------------------------------------------------------
    // Code editor autocomplete.
    // ---------------------------------------------------------------

    /**
     * Get all SLASHED CSS variables grouped by category.
     *
     * @return array<string, string[]> Map of category => variable names.
     */
    public function get_variables() {
        $variables = Slashed_Bricks_Inventory::get_variables_by_category();

        /**
         * Filter the registered CSS variables.
         *
         * @param array $variables Map of category => variable names.
         */
        return apply_filters( 'slashed_bricks/registered_variables', $variables );
    }

    /**
     * Register variables for the Bricks code editor autocomplete.
     *
     * Uses the original --sf-* names so authors writing CSS see the
     * framework's native namespace directly.
     *
     * @param array $signatures Existing code signatures.
     * @return array Modified code signatures.
     */
    public function register_code_signatures( $signatures ) {
        if ( ! is_array( $signatures ) ) {
            $signatures = array();
        }

        $css_vars = array();
        foreach ( $this->get_variables() as $category => $vars ) {
            foreach ( $vars as $var ) {
                $css_vars[] = array(
                    'label'  => $var,
                    'detail' => 'SLASHED ' . $category,
                    'type'   => 'variable',
                );
            }
        }

        if ( ! isset( $signatures['css'] ) || ! is_array( $signatures['css'] ) ) {
            $signatures['css'] = array();
        }

        $signatures['css']['slashed_variables'] = $css_vars;

        return $signatures;
    }
}
