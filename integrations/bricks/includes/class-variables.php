<?php
/**
 * Variable registration for Bricks Builder pickers and code editor.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Slashed_Bricks_Variables
 *
 * Registers SLASHED CSS custom properties with Bricks Builder for variable
 * pickers and code editor autocomplete.
 *
 * The variable list is derived from the active CSS bundle via
 * Slashed_Bricks_Inventory, so anything declared in the framework is
 * picked up automatically - no hand-curated list to fall behind a release.
 *
 * Bricks 1.9.2+ also auto-detects custom properties from stylesheets
 * loaded into the editor iframe; this class adds organized category labels
 * (via bricks/builder/i18n) and code editor autocomplete entries (via
 * bricks/code/get_code_signatures) on top of that.
 */
class Slashed_Bricks_Variables {

    /**
     * Constructor. Register hooks.
     */
    public function __construct() {
        add_filter( 'bricks/builder/i18n', array( $this, 'register_variable_groups' ) );
        add_filter( 'bricks/code/get_code_signatures', array( $this, 'register_code_signatures' ) );
    }

    /**
     * Get all SLASHED CSS variables organized by category.
     *
     * Sourced from the inventory and grouped by prefix family. The shape
     * matches the previous hand-curated version so existing filters
     * keep working.
     *
     * @return array<string, string[]> Associative array of category => variable names.
     */
    public function get_variables() {
        $variables = Slashed_Bricks_Inventory::get_variables_by_category();

        /**
         * Filter the registered CSS variables.
         *
         * @param array $variables Associative array of category => variable names.
         */
        return apply_filters( 'slashed_bricks/registered_variables', $variables );
    }

    /**
     * Register variable group labels with Bricks i18n.
     *
     * @param array $i18n Existing i18n strings.
     * @return array Modified i18n strings.
     */
    public function register_variable_groups( $i18n ) {
        if ( ! is_array( $i18n ) ) {
            $i18n = array();
        }

        foreach ( $this->get_variables() as $category => $vars ) {
            $i18n[ 'slashed_' . sanitize_key( $category ) ] = 'SLASHED ' . $category;
        }

        return $i18n;
    }

    /**
     * Register variables for code editor autocomplete.
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
