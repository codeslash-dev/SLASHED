<?php
/**
 * CSS enqueue logic for frontend and Bricks editor iframe.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Slashed_Bricks_Enqueue
 *
 * Handles loading the SLASHED CSS bundle on the frontend
 * and within the Bricks Builder editor iframe.
 */
class Slashed_Bricks_Enqueue {

    /**
     * Constructor. Register hooks.
     */
    public function __construct() {
        // Frontend and editor iframe both fire wp_enqueue_scripts.
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_styles' ) );

        // Enqueue in the Bricks editor panel (admin side) for variable detection.
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_editor_styles' ) );
    }

    /**
     * Enqueue SLASHED CSS on the frontend and in the Bricks editor iframe.
     *
     * When Bricks renders its builder iframe, it fires wp_enqueue_scripts
     * within that context, so this single hook covers both cases.
     */
    public function enqueue_frontend_styles() {
        $css_url = slashed_bricks_get_css_url();

        wp_enqueue_style(
            'slashed-framework',
            $css_url,
            array(),
            SLASHED_BRICKS_VERSION
        );
    }

    /**
     * Enqueue editor-specific styles in the Bricks admin panel.
     *
     * Only loads on Bricks builder pages for panel styling.
     */
    public function enqueue_editor_styles() {
        if ( ! function_exists( 'bricks_is_builder_main' ) ) {
            return;
        }

        if ( ! bricks_is_builder_main() ) {
            return;
        }

        $editor_css = SLASHED_BRICKS_URL . 'assets/editor.css';

        wp_enqueue_style(
            'slashed-bricks-editor',
            $editor_css,
            array(),
            SLASHED_BRICKS_VERSION
        );
    }
}
