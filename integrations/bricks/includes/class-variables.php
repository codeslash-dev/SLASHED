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
            'bg', 'surface', 'well', 'raised', 'overlay', 'inverse',
            'border', 'border--subtle', 'border--strong',
            'link', 'link--hover', 'link--active', 'link--visited',
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
        $sizes = array( '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl' );
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
        $sizes = array( '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl' );
        $vars  = array();

        foreach ( $sizes as $size ) {
            $vars[] = '--sf-text-' . $size;
        }

        $vars[] = '--sf-font-sans';
        $vars[] = '--sf-font-serif';
        $vars[] = '--sf-font-mono';
        $vars[] = '--sf-font-weight-normal';
        $vars[] = '--sf-font-weight-medium';
        $vars[] = '--sf-font-weight-semibold';
        $vars[] = '--sf-font-weight-bold';
        $vars[] = '--sf-leading-tight';
        $vars[] = '--sf-leading-snug';
        $vars[] = '--sf-leading-normal';
        $vars[] = '--sf-leading-relaxed';
        $vars[] = '--sf-leading-loose';
        $vars[] = '--sf-tracking-tight';
        $vars[] = '--sf-tracking-normal';
        $vars[] = '--sf-tracking-wide';

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
            '--sf-radius-xs',
            '--sf-radius-s',
            '--sf-radius-m',
            '--sf-radius-l',
            '--sf-radius-xl',
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
            '--sf-shadow-xs',
            '--sf-shadow-s',
            '--sf-shadow-m',
            '--sf-shadow-l',
            '--sf-shadow-xl',
        );
    }

    /**
     * Get motion/transition-related CSS variables.
     *
     * @return array
     */
    private function get_motion_variables() {
        return array(
            '--sf-duration-fast',
            '--sf-duration-normal',
            '--sf-duration-slow',
            '--sf-ease-in',
            '--sf-ease-out',
            '--sf-ease-in-out',
            '--sf-transition-fast',
            '--sf-transition-normal',
            '--sf-transition-slow',
        );
    }

    /**
     * Get z-index CSS variables.
     *
     * @return array
     */
    private function get_z_index_variables() {
        return array(
            '--sf-z-base',
            '--sf-z-dropdown',
            '--sf-z-sticky',
            '--sf-z-fixed',
            '--sf-z-modal',
            '--sf-z-popover',
            '--sf-z-tooltip',
            '--sf-z-toast',
        );
    }
}
