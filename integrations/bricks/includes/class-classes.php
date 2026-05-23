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
 * Registers SLASHED utility and layout classes with Bricks Builder
 * for autocomplete and the global classes panel.
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
        $classes = $this->get_classes();

        if ( ! isset( $control_options['globalClassesLocked'] ) ) {
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
     * @return array Array of class entries.
     */
    public function get_classes() {
        $classes = array();

        // Layout classes.
        $layout = $this->get_layout_classes();
        foreach ( $layout as $class_name ) {
            $classes[] = array(
                'id'       => $class_name,
                'name'     => $class_name,
                'settings' => array( 'locked' => true ),
                'category' => 'SLASHED Layout',
            );
        }

        // State classes.
        $states = $this->get_state_classes();
        foreach ( $states as $class_name ) {
            $classes[] = array(
                'id'       => $class_name,
                'name'     => $class_name,
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

    /**
     * Get all SLASHED layout classes.
     *
     * @return array
     */
    private function get_layout_classes() {
        return array(
            // Section.
            'sf-section',
            'sf-section--s',
            'sf-section--m',
            'sf-section--l',
            'sf-section--xl',
            'sf-section-group',

            // Divider.
            'sf-divider',
            'sf-divider--vertical',

            // Container.
            'sf-container',
            'sf-container--narrow',
            'sf-container--prose',
            'sf-container--wide',
            'sf-container--full',

            // Stack.
            'sf-stack',
            'sf-stack--2xs',
            'sf-stack--xs',
            'sf-stack--s',
            'sf-stack--m',
            'sf-stack--l',
            'sf-stack--xl',
            'sf-stack--2xl',
            'sf-stack--3xl',
            'sf-stack--center',
            'sf-stack--end',
            'sf-stack--stretch',

            // Box.
            'sf-box',

            // Center.
            'sf-center',
            'sf-center--intrinsic',

            // Cluster.
            'sf-cluster',
            'sf-cluster--2xs',
            'sf-cluster--xs',
            'sf-cluster--s',
            'sf-cluster--m',
            'sf-cluster--l',
            'sf-cluster--xl',
            'sf-cluster--no-wrap',
            'sf-cluster--center',
            'sf-cluster--end',
            'sf-cluster--between',

            // Sidebar.
            'sf-sidebar',
            'sf-sidebar--right',
            'sf-sidebar--narrow',
            'sf-sidebar--wide',

            // Switcher.
            'sf-switcher',
            'sf-switcher--no-wrap',
            'sf-switcher--vertical',

            // Grid.
            'sf-grid',
            'sf-grid--fit',
            'sf-grid--xs',
            'sf-grid--s',
            'sf-grid--m',
            'sf-grid--l',
            'sf-grid--xl',
            'sf-grid--dense',
            'sf-grid-1',
            'sf-grid-2',
            'sf-grid-3',
            'sf-grid-4',
            'sf-grid-6',
            'sf-grid-1-2',
            'sf-grid-2-1',
            'sf-grid-1-3',
            'sf-grid-3-1',

            // Icon.
            'sf-icon',
            'sf-icon--xs',
            'sf-icon--s',
            'sf-icon--m',
            'sf-icon--l',
            'sf-icon--xl',

            // Cover.
            'sf-cover',
            'sf-cover__center',
            'sf-cover--min',
            'sf-cover--max',
            'sf-cover--padding-s',
            'sf-cover--padding-l',

            // Frame.
            'sf-frame',
            'sf-frame--square',
            'sf-frame--video',
            'sf-frame--cinema',
            'sf-frame--portrait',
            'sf-frame--4-3',
            'sf-frame--3-2',
            'sf-frame--golden',

            // Reel.
            'sf-reel',

            // Imposter.
            'sf-imposter',
            'sf-imposter--fixed',
            'sf-imposter--contain',

            // Alternate.
            'sf-alternate',

            // Pancake.
            'sf-pancake',

            // Bento.
            'sf-bento',
            'sf-bento--2',
            'sf-bento--4',
            'sf-bento--compact',
            'sf-bento--tall',

            // Subgrid.
            'sf-subgrid',
            'sf-subgrid-rows',

            // Prose.
            'sf-prose',
            'sf-not-prose',

            // Content Grid.
            'sf-content-grid',
            'sf-breakout',
            'sf-full-bleed',
        );
    }

    /**
     * Get all SLASHED state classes.
     *
     * @return array
     */
    private function get_state_classes() {
        return array(
            // Visibility.
            'is-hidden',
            'is-invisible',
            'is-visible',

            // Interactivity.
            'is-disabled',
            'is-readonly',

            // Loading.
            'is-loading',
            'is-busy',
            'is-pending',
            'is-skeleton',

            // Active.
            'is-active',
            'is-selected',
            'is-current',
            'is-highlighted',
            'is-pressed',

            // Disclosure.
            'is-open',
            'is-collapsed',
            'is-expanded',

            // Validation.
            'is-valid',
            'is-invalid',
            'is-warning',
            'is-success',
            'is-error',
            'is-info',
            'is-danger',

            // Position.
            'is-sticky',
            'is-pinned',
            'is-fixed',
            'is-fullscreen',
            'is-resizable',

            // Overflow.
            'is-clipped',
            'is-scrollable',
            'is-truncated',

            // Drag.
            'is-dragging',
            'is-drop-target',
            'is-draggable',

            // Overlay.
            'is-overlay',

            // Focus.
            'is-clickable',
            'is-unselectable',
            'is-focused',

            // Empty.
            'is-empty',
        );
    }
}
