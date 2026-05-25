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
        // Frontend AND the Bricks builder canvas iframe AND the Bricks
        // builder admin chrome all fire wp_enqueue_scripts. The third one
        // is the gotcha: loading the framework CSS into the builder panel
        // would override Bricks' own UI styles (icons, colors, fonts). The
        // handler below skips that case via bricks_is_builder_main().
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_styles' ) );

        // Reserved hook for intentional builder-panel tweaks (assets/editor.css).
        // Currently a no-op stylesheet; left wired up so future panel styling
        // can be dropped in without re-plumbing the hook chain.
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_editor_styles' ) );
    }

    /**
     * Enqueue SLASHED CSS on the frontend and in the Bricks editor iframe.
     *
     * Bricks fires wp_enqueue_scripts in three contexts:
     *   1. Public frontend         - we want our CSS here.
     *   2. Builder canvas iframe   - we want our CSS here (preview rendering,
     *                                color-picker swatch resolution, etc.).
     *   3. Builder admin chrome    - we DO NOT want our CSS here; loading
     *                                resets / themes / base typography would
     *                                bleed into Bricks' own UI and visibly
     *                                change icons and colors in the toolbars.
     *
     * bricks_is_builder_main() returns true only on context (3), so the early
     * return below is the canonical Bricks pattern for "frontend + canvas, not
     * the panel" - documented in Bricks Academy under Child Theme guidance.
     */
    public function enqueue_frontend_styles() {
        if ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) {
            return;
        }

        $css_url = slashed_bricks_get_css_url();

        if ( '' === $css_url ) {
            return;
        }

        // Use file modification time for cache-busting when the CSS exists locally.
        $repo_path   = SLASHED_BRICKS_PATH . '../../dist/slashed.optimal.css';
        $local_path  = SLASHED_BRICKS_PATH . 'dist/slashed.optimal.css';

        if ( file_exists( $repo_path ) ) {
            $version = (string) filemtime( $repo_path );
        } elseif ( file_exists( $local_path ) ) {
            $version = (string) filemtime( $local_path );
        } else {
            $version = SLASHED_BRICKS_VERSION;
        }

        wp_enqueue_style(
            'slashed-framework',
            $css_url,
            array(),
            $version
        );

        // Inject token override CSS after the framework stylesheet.
        if ( Slashed_Bricks_CSS_Generator::has_overrides() ) {
            wp_add_inline_style( 'slashed-framework', Slashed_Bricks_CSS_Generator::get_override_css() );
        }

        // Inject HTML font-size override if configured.
        $plugin_settings = get_option( 'slashed_bricks_settings', array() );
        if ( is_array( $plugin_settings ) && ! empty( $plugin_settings['html_font_size'] ) ) {
            $font_size = $plugin_settings['html_font_size'];
            if ( '100' === $font_size || '62.5' === $font_size ) {
                wp_add_inline_style(
                    'slashed-framework',
                    'html { font-size: ' . $font_size . '% !important; }'
                );
            }
        }
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
