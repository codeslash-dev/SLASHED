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
 * Registers SLASHED CSS custom properties with Bricks Builder
 * for variable pickers and code editor autocomplete.
 *
 * Bricks 1.9.2+ automatically detects CSS custom properties from stylesheets
 * loaded in the editor iframe. This class provides additional organization
 * (category labels via i18n) and code editor autocomplete (via code signatures).
 * The primary variable picker population happens through CSS loading in
 * class-enqueue.php.
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
     * @return array Associative array of category => variables.
     */
    public function get_variables() {
        $variables = array(
            'Colors'     => $this->get_color_variables(),
            'Spacing'    => $this->get_spacing_variables(),
            'Typography' => $this->get_typography_variables(),
            'Layout'     => $this->get_layout_variables(),
            'Radius'     => $this->get_radius_variables(),
            'Shadows'    => $this->get_shadow_variables(),
            'Motion'     => $this->get_motion_variables(),
            'Z-Index'    => $this->get_z_index_variables(),
        );

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
        $variables = $this->get_variables();

        foreach ( $variables as $category => $vars ) {
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
        $variables = $this->get_variables();

        $css_vars = array();
        foreach ( $variables as $category => $vars ) {
            foreach ( $vars as $var ) {
                $css_vars[] = array(
                    'label'  => $var,
                    'detail' => 'SLASHED ' . $category,
                    'type'   => 'variable',
                );
            }
        }

        if ( ! isset( $signatures['css'] ) ) {
            $signatures['css'] = array();
        }

        $signatures['css']['slashed_variables'] = $css_vars;

        return $signatures;
    }

    /**
     * Get color-related CSS variables.
     *
     * @return array
     */
    private function get_color_variables() {
        $colors = array();
        $brands = array( 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base' );
        $status = array( 'success', 'warning', 'error', 'info', 'danger' );

        // Brand colors - base + scale.
        foreach ( $brands as $brand ) {
            $colors[] = '--sf-color-' . $brand;
            foreach ( array( '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950' ) as $step ) {
                $colors[] = '--sf-color-' . $brand . '-' . $step;
            }

            // Functional aliases.
            $colors[] = '--sf-color-' . $brand . '-hover';
            $colors[] = '--sf-color-' . $brand . '-active';
            $colors[] = '--sf-color-' . $brand . '-subtle';
            $colors[] = '--sf-color-' . $brand . '-muted';
            $colors[] = '--sf-color-' . $brand . '-ghost';

            // Shade aliases.
            $colors[] = '--sf-color-' . $brand . '-superlight';
            $colors[] = '--sf-color-' . $brand . '-xlight';
            $colors[] = '--sf-color-' . $brand . '-lighter';
            $colors[] = '--sf-color-' . $brand . '-darker';
            $colors[] = '--sf-color-' . $brand . '-xdark';
            $colors[] = '--sf-color-' . $brand . '-superdark';
        }

        // Status colors.
        foreach ( $status as $s ) {
            $colors[] = '--sf-color-' . $s;
            $colors[] = '--sf-color-' . $s . '-subtle';
            $colors[] = '--sf-color-' . $s . '-strong';
            $colors[] = '--sf-color-' . $s . '-muted';
        }

        // Semantic colors.
        $semantic = array(
            'text', 'text--secondary', 'text--muted', 'heading',
            'text--placeholder', 'text--disabled', 'text--inverse',
            'text--on-primary', 'text--on-secondary', 'text--on-tertiary',
            'text--on-action', 'text--on-neutral', 'text--on-base',
            'bg', 'surface', 'well', 'raised', 'overlay', 'inverse',
            'bg--hover', 'bg--active', 'bg--selected', 'bg--focus', 'bg--disabled',
            'border', 'border--subtle', 'border--strong',
            'border--focus', 'border--disabled', 'border--translucent',
            'link', 'link--hover', 'link--active', 'link--visited',
            'link--underline', 'link--disabled',
            'code-bg', 'code-text',
            'selection-bg', 'mark-bg', 'dim',
        );
        foreach ( $semantic as $s ) {
            $colors[] = '--sf-color-' . $s;
        }

        return $colors;
    }

    /**
     * Get spacing-related CSS variables.
     *
     * @return array
     */
    private function get_spacing_variables() {
        $sizes = array( 'none', 'px', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl' );
        $vars  = array();

        foreach ( $sizes as $size ) {
            $vars[] = '--sf-space-' . $size;
        }

        $vars[] = '--sf-gap';
        $vars[] = '--sf-content-gap';
        $vars[] = '--sf-component-pad';
        $vars[] = '--sf-space-gutter';
        $vars[] = '--sf-section-pad';

        return $vars;
    }

    /**
     * Get typography-related CSS variables.
     *
     * @return array
     */
    private function get_typography_variables() {
        $sizes = array( '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl' );
        $vars  = array();

        foreach ( $sizes as $size ) {
            $vars[] = '--sf-text-' . $size;
        }

        // Display sizes.
        $vars[] = '--sf-text-display-s';
        $vars[] = '--sf-text-display-m';
        $vars[] = '--sf-text-display-l';

        // Font families.
        $vars[] = '--sf-font-body';
        $vars[] = '--sf-font-heading';
        $vars[] = '--sf-font-mono';
        $vars[] = '--sf-font-display';
        $vars[] = '--sf-font-humanist';
        $vars[] = '--sf-font-geometric';
        $vars[] = '--sf-font-slab';

        // Font weights.
        $vars[] = '--sf-font-weight-thin';
        $vars[] = '--sf-font-weight-extralight';
        $vars[] = '--sf-font-weight-light';
        $vars[] = '--sf-font-weight-normal';
        $vars[] = '--sf-font-weight-medium';
        $vars[] = '--sf-font-weight-semibold';
        $vars[] = '--sf-font-weight-bold';
        $vars[] = '--sf-font-weight-extrabold';
        $vars[] = '--sf-font-weight-black';

        // Leading.
        $vars[] = '--sf-leading-tight';
        $vars[] = '--sf-leading-snug';
        $vars[] = '--sf-leading-normal';
        $vars[] = '--sf-leading-relaxed';

        // Tracking.
        $vars[] = '--sf-tracking-tight';
        $vars[] = '--sf-tracking-normal';
        $vars[] = '--sf-tracking-wide';
        $vars[] = '--sf-tracking-wider';
        $vars[] = '--sf-tracking-widest';

        return $vars;
    }

    /**
     * Get layout-related CSS variables.
     *
     * @return array
     */
    private function get_layout_variables() {
        return array(
            '--sf-container-narrow',
            '--sf-container-default',
            '--sf-container-wide',
            '--sf-container-full',
            '--sf-stack-gap',
            '--sf-cluster-gap',
            '--sf-cluster-align',
            '--sf-cluster-justify',
            '--sf-sidebar-gap',
            '--sf-sidebar-min-width',
            '--sf-sidebar-width-default',
            '--sf-switcher-threshold',
            '--sf-switcher-gap',
            '--sf-grid-min',
            '--sf-grid-gap',
            '--sf-cover-min-height',
            '--sf-cover-padding',
            '--sf-frame-ratio',
            '--sf-reel-item-width',
            '--sf-reel-gap',
            '--sf-reel-height',
            '--sf-imposter-margin',
            '--sf-bento-gap',
            '--sf-breakout-width',
            '--sf-content-width',
            '--sf-prose-paragraph',
            '--sf-box-padding',
            '--sf-box-border-width',
            '--sf-box-border-color',
            '--sf-center-max',
            '--sf-center-gutter',
        );
    }

    /**
     * Get radius-related CSS variables.
     *
     * @return array
     */
    private function get_radius_variables() {
        return array(
            '--sf-radius-none',
            '--sf-radius-xs',
            '--sf-radius-s',
            '--sf-radius-m',
            '--sf-radius-l',
            '--sf-radius-xl',
            '--sf-radius-2xl',
            '--sf-radius-3xl',
            '--sf-radius-4xl',
            '--sf-radius-full',
        );
    }

    /**
     * Get shadow-related CSS variables.
     *
     * @return array
     */
    private function get_shadow_variables() {
        return array(
            '--sf-shadow-none',
            '--sf-shadow-xs',
            '--sf-shadow-s',
            '--sf-shadow-m',
            '--sf-shadow-l',
            '--sf-shadow-xl',
            '--sf-shadow-2xl',
            '--sf-shadow-inner',
        );
    }

    /**
     * Get motion/transition-related CSS variables.
     *
     * @return array
     */
    private function get_motion_variables() {
        return array(
            // Durations.
            '--sf-duration-none',
            '--sf-duration-instant',
            '--sf-duration-fast',
            '--sf-duration-normal',
            '--sf-duration-slow',
            '--sf-duration-slower',

            // Easings.
            '--sf-ease-linear',
            '--sf-ease-out',
            '--sf-ease-in',
            '--sf-ease-in-out',
            '--sf-ease-spring',
            '--sf-ease-elastic',
            '--sf-ease-bounce',
            '--sf-ease-overshoot',

            // Transitions.
            '--sf-transition-all',
            '--sf-transition-colors',
            '--sf-transition-transform',
            '--sf-transition-opacity',
            '--sf-transition-shadow',
            '--sf-transition-fast',
            '--sf-transition-slow',
            '--sf-transition-enter',
            '--sf-transition-exit',
        );
    }

    /**
     * Get z-index CSS variables.
     *
     * @return array
     */
    private function get_z_index_variables() {
        return array(
            '--sf-z-below',
            '--sf-z-base',
            '--sf-z-raised',
            '--sf-z-low',
            '--sf-z-mid',
            '--sf-z-high',
            '--sf-z-top',
            '--sf-z-max',
        );
    }
}
