<?php
/**
 * Class registration for Bricks Builder autocomplete.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Slashed_Bricks_Classes
 *
 * Registers SLASHED utility, layout, and state classes with Bricks Builder
 * for autocomplete and the global classes panel.
 *
 * The class list is derived from the active CSS bundle via
 * Slashed_Bricks_Inventory, so every selector the framework actually ships
 * shows up in the Bricks class picker - no hand-curated list to drift out
 * of sync with releases.
 */
class Slashed_Bricks_Classes {

    /**
     * Constructor. Register hooks.
     */
    public function __construct() {
        add_filter( 'bricks/setup/control_options', array( $this, 'register_global_classes' ) );
    }

    /**
     * Register SLASHED classes as locked global classes in Bricks.
     *
     * @param array $control_options Existing control options.
     * @return array Modified control options.
     */
    public function register_global_classes( $control_options ) {
        if ( ! is_array( $control_options ) ) {
            $control_options = array();
        }

        $classes = $this->get_classes();

        if ( ! isset( $control_options['globalClassesLocked'] ) || ! is_array( $control_options['globalClassesLocked'] ) ) {
            $control_options['globalClassesLocked'] = array();
        }

        foreach ( $classes as $class_entry ) {
            $control_options['globalClassesLocked'][] = $class_entry;
        }

        return $control_options;
    }

    /**
     * Get all SLASHED classes formatted for Bricks.
     *
     * Layout (.sf-*) classes are tagged "SLASHED Layout"; state (.is-*)
     * classes are tagged "SLASHED State".
     *
     * @return array Array of class entries.
     */
    public function get_classes() {
        $classes = array();

        foreach ( Slashed_Bricks_Inventory::get_sf_classes() as $name ) {
            $classes[] = array(
                'id'       => $name,
                'name'     => $name,
                'settings' => array( 'locked' => true ),
                'category' => 'SLASHED Layout',
            );
        }

        foreach ( Slashed_Bricks_Inventory::get_is_classes() as $name ) {
            $classes[] = array(
                'id'       => $name,
                'name'     => $name,
                'settings' => array( 'locked' => true ),
                'category' => 'SLASHED State',
            );
        }

        /**
         * Filter the registered classes before passing to Bricks.
         *
         * @param array $classes Array of class entry arrays.
         */
        return apply_filters( 'slashed_bricks/registered_classes', $classes );
    }
}
