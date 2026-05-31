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
 * Adds Bricks-specific inline rules on top of the globally-registered
 * `slashed-framework` handle (registered by Slashed_Core_Enqueue).
 */
class Slashed_Bricks_Enqueue {

    public function __construct() {
        add_action( 'wp_head',            array( $this, 'inject_layer_order' ), 1 );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_styles' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_editor_styles' ) );
    }

    /**
     * Establish @layer cascade order before any stylesheet loads.
     *
     * Bricks declares its own @layer bricks (with sublayers bricks.reset,
     * bricks.gutenberg, bricks.icons). Because SLASHED ships as a plugin and
     * Bricks ships as the active theme, WordPress outputs SLASHED's stylesheet
     * first — which means @layer slashed is declared first and therefore has
     * LOWER cascade priority than @layer bricks (later declarations win).
     * The result: every Bricks-layer rule silently beats every slashed-layer
     * rule, regardless of specificity.
     *
     * Injecting `@layer bricks, slashed` at wp_head priority 1 — before any
     * stylesheet is output (priority 8) — establishes the desired order: bricks
     * at position N, slashed at position N+1. When each stylesheet later
     * declares its own sublayers they slot into the already-reserved position,
     * so @layer slashed outranks @layer bricks across the board.
     *
     * Skipped in the builder-panel context (same guard as enqueue_frontend).
     */
    public function inject_layer_order() {
        if ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) {
            return;
        }
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static CSS, no user data.
        echo "<style>@layer bricks,slashed;</style>\n";
    }

    /**
     * Add Bricks-specific inline CSS on the frontend and canvas iframe.
     *
     * `slashed-framework` is registered globally by Slashed_Core_Enqueue.
     * This method adds the dark-mode bridge that maps Bricks' data-brx-theme
     * attribute to SLASHED's colour-scheme / --sf-is-dark system.
     * The builder-panel context is skipped for the same reason the global
     * enqueue skips it (see Slashed_Core_Enqueue::enqueue_frontend).
     */
    public function enqueue_frontend_styles() {
        if ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) {
            return;
        }

        // Bridge Bricks' dark mode toggle (data-brx-theme attribute) to SLASHED's theme system.
        wp_add_inline_style(
            'slashed-framework',
            '@layer slashed.themes{[data-brx-theme="light"]{color-scheme:light;--sf-is-dark:0}[data-brx-theme="dark"]{color-scheme:dark;--sf-is-dark:1}}'
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
