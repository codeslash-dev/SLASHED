<?php
/**
 * REST endpoint: list fonts registered in Bricks Builder.
 *
 * Returns fonts that Bricks already knows how to serve (custom uploaded,
 * Adobe Fonts) so the SLASHED typography tab can show a "Bricks fonts"
 * dropdown rather than requiring users to type family names by hand.
 *
 * SLASHED never loads fonts itself — Bricks owns that pipeline, including
 * any "serve locally" / GDPR configuration the user has chosen.
 *
 * Route
 * -----
 *   GET /wp-json/slashed/v1/bricks-fonts
 *   Auth: manage_options (same gate as every other SLASHED endpoint)
 *
 * Response shape
 * --------------
 *   { "fonts": [ { "family": "Inter", "label": "Inter", "source": "custom" }, … ] }
 *
 * `source` is informational only — the SPA uses it to group/badge fonts.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Slashed_Bricks_Fonts_REST {

	const NAMESPACE = 'slashed/v1';

	public function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/bricks-fonts',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_fonts' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);
	}

	public function check_permissions() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Build the font list from known Bricks option names.
	 *
	 * Bricks does not publish a PHP API for its font registry, so we probe
	 * the WP options it is known to use. Unrecognised shapes are skipped
	 * gracefully — the SPA falls back to the Manual text input.
	 */
	public function get_fonts( WP_REST_Request $request ) {
		$fonts = array();

		// ── Custom fonts uploaded via Bricks > Settings > Custom Fonts ──
		$custom = get_option( 'bricks_custom_fonts', array() );
		if ( is_array( $custom ) ) {
			foreach ( $custom as $font ) {
				if ( ! is_array( $font ) ) {
					continue;
				}
				// Bricks schema variants across versions:
				//   font_family — explicit CSS family name (most reliable)
				//   family      — alternative key used in some versions
				//   title       — display name; doubles as the CSS family name
				//                 for fonts downloaded via Bricks' local-Google-
				//                 Fonts feature (no separate font_family key).
				$family = $font['font_family'] ?? $font['family'] ?? $font['title'] ?? $font['name'] ?? null;
				$label  = $font['title'] ?? $font['name'] ?? $family;
				if ( ! $family || ! is_string( $family ) ) {
					continue;
				}
				$fonts[] = array(
					'family' => sanitize_text_field( $family ),
					'label'  => sanitize_text_field( is_string( $label ) ? $label : $family ),
					'source' => 'custom',
				);
			}
		}

		// ── Google Fonts added via Bricks > Settings > Google Fonts ────
		$google = get_option( 'bricks_google_fonts', array() );
		if ( is_array( $google ) ) {
			foreach ( $google as $font ) {
				if ( ! is_array( $font ) ) {
					continue;
				}
				// Bricks stores the family name in 'family'; 'name' and
				// 'title' are display labels used in schema variants.
				$family = $font['family'] ?? $font['font_family'] ?? $font['name'] ?? $font['title'] ?? null;
				if ( ! $family || ! is_string( $family ) ) {
					continue;
				}
				$fonts[] = array(
					'family' => sanitize_text_field( $family ),
					'label'  => sanitize_text_field( $font['name'] ?? $family ),
					'source' => 'google',
				);
			}
		}

		// ── Adobe Fonts (Typekit) configured in Bricks ──────────────────
		$adobe = get_option( 'bricks_adobe_fonts', array() );
		if ( is_array( $adobe ) && ! empty( $adobe['fonts'] ) && is_array( $adobe['fonts'] ) ) {
			foreach ( $adobe['fonts'] as $font ) {
				if ( ! is_array( $font ) ) {
					continue;
				}
				$family = $font['font_family'] ?? $font['family'] ?? null;
				$label  = $font['label'] ?? $font['name'] ?? $family;
				if ( ! $family || ! is_string( $family ) ) {
					continue;
				}
				$fonts[] = array(
					'family' => sanitize_text_field( $family ),
					'label'  => sanitize_text_field( is_string( $label ) ? $label : $family ),
					'source' => 'adobe',
				);
			}
		}

		// Deduplicate by family name (case-insensitive) keeping first entry.
		$seen   = array();
		$unique = array();
		foreach ( $fonts as $font ) {
			$key = strtolower( $font['family'] );
			if ( ! isset( $seen[ $key ] ) ) {
				$seen[ $key ] = true;
				$unique[]     = $font;
			}
		}

		return rest_ensure_response( array( 'fonts' => $unique ) );
	}
}
