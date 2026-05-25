<?php
/**
 * Admin settings page for SLASHED token customization.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Bricks_Admin_Page
 *
 * Registers the SLASHED admin menu and renders a tabbed settings interface
 * for customizing design token values. Settings are stored in a single
 * wp_option 'slashed_bricks_tokens'.
 */
class Slashed_Bricks_Admin_Page {

	/**
	 * Option name for storing token overrides.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'slashed_bricks_tokens';

	/**
	 * Nonce action string.
	 *
	 * @var string
	 */
	const NONCE_ACTION = 'slashed_bricks_save_tokens';

	/**
	 * Available tabs configuration.
	 *
	 * @var array
	 */
	private $tabs = array();

	/**
	 * Option name for storing plugin-level settings (separate from token overrides).
	 *
	 * @var string
	 */
	const SETTINGS_OPTION_NAME = 'slashed_bricks_settings';

	/**
	 * Nonce action for saving plugin settings.
	 *
	 * @var string
	 */
	const SETTINGS_NONCE_ACTION = 'slashed_bricks_save_settings';

	/**
	 * Constructor. Register hooks.
	 */
	public function __construct() {
		$this->tabs = array(
			'colors'     => 'Colors',
			'contrast'   => 'Contrast',
			'typography' => 'Typography',
			'spacing'    => 'Spacing',
			'radius'     => 'Radius',
			'shadows'    => 'Shadows',
			'motion'     => 'Motion',
			'zindex'     => 'Z-Index',
		);

		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'admin_post_slashed_bricks_save', array( $this, 'handle_save' ) );
		add_action( 'admin_post_slashed_bricks_save_settings', array( $this, 'handle_save_settings' ) );
	}

	/**
	 * Register the top-level admin menu page.
	 */
	public function register_menu() {
		add_menu_page(
			__( 'SLASHED Settings', 'slashed-bricks' ),
			__( 'SLASHED', 'slashed-bricks' ),
			'manage_options',
			'slashed-bricks',
			array( $this, 'render_page' ),
			'dashicons-art',
			59
		);
	}

	/**
	 * Enqueue admin CSS and JS assets on the SLASHED settings page only.
	 *
	 * @param string $hook_suffix The current admin page hook suffix.
	 */
	public function enqueue_admin_assets( $hook_suffix ) {
		if ( 'toplevel_page_slashed-bricks' !== $hook_suffix ) {
			return;
		}

		$plugin_url = plugin_dir_url( dirname( __FILE__ ) );
		$plugin_dir = plugin_dir_path( dirname( __FILE__ ) );

		// Enqueue WordPress color picker.
		wp_enqueue_style( 'wp-color-picker' );

		// Enqueue admin page styles.
		wp_enqueue_style(
			'slashed-bricks-admin',
			$plugin_url . 'assets/admin-page.css',
			array( 'wp-color-picker' ),
			filemtime( $plugin_dir . 'assets/admin-page.css' )
		);

		// Enqueue admin page scripts.
		wp_enqueue_script(
			'slashed-bricks-admin-js',
			$plugin_url . 'assets/admin-page.js',
			array( 'jquery', 'wp-color-picker' ),
			filemtime( $plugin_dir . 'assets/admin-page.js' ),
			true
		);

		// Pass token data to JavaScript for live preview generation.
		wp_localize_script(
			'slashed-bricks-admin-js',
			'slashedBricksAdmin',
			array(
				'defaults' => Slashed_Bricks_Token_Defaults::get_all(),
				'settings' => $this->get_settings(),
			)
		);
	}

	/**
	 * Get saved token values.
	 *
	 * @return array
	 */
	public function get_settings() {
		$settings = get_option( self::OPTION_NAME, array() );
		return is_array( $settings ) ? $settings : array();
	}

	/**
	 * Get all factory default values.
	 *
	 * @return array
	 */
	public function get_defaults() {
		return Slashed_Bricks_Token_Defaults::get_all();
	}

	/**
	 * Handle form submission for saving settings.
	 */
	public function handle_save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Unauthorized access.', 'slashed-bricks' ) );
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ), self::NONCE_ACTION ) ) {
			wp_die( esc_html__( 'Security check failed.', 'slashed-bricks' ) );
		}

		// Handle reset all.
		if ( ! empty( $_POST['reset_all'] ) ) {
			delete_option( self::OPTION_NAME );
			wp_safe_redirect( admin_url( 'admin.php?page=slashed-bricks&message=reset' ) );
			exit;
		}

		// Handle reset section.
		if ( ! empty( $_POST['reset_section'] ) ) {
			$section = sanitize_key( wp_unslash( $_POST['reset_section'] ) );
			if ( ! isset( $this->tabs[ $section ] ) ) {
				wp_safe_redirect( admin_url( 'admin.php?page=slashed-bricks&message=error' ) );
				exit;
			}
			$settings = $this->get_settings();
			unset( $settings[ $section ] );
			update_option( self::OPTION_NAME, $settings );
			wp_safe_redirect( admin_url( 'admin.php?page=slashed-bricks&tab=' . $section . '&message=reset_section' ) );
			exit;
		}

		// Save settings.
		$active_tab = isset( $_POST['active_tab'] ) ? sanitize_key( wp_unslash( $_POST['active_tab'] ) ) : 'colors';
		if ( ! isset( $this->tabs[ $active_tab ] ) ) {
			$active_tab = 'colors';
		}
		$settings   = $this->get_settings();
		$section    = isset( $_POST['slashed_tokens'] ) ? wp_unslash( $_POST['slashed_tokens'] ) : array();

		if ( is_array( $section ) ) {
			$settings[ $active_tab ] = $this->sanitize_section( $active_tab, $section );
		}

		update_option( self::OPTION_NAME, $settings );
		wp_safe_redirect( admin_url( 'admin.php?page=slashed-bricks&tab=' . $active_tab . '&message=saved' ) );
		exit;
	}

	/**
	 * Handle form submission for saving plugin settings.
	 */
	public function handle_save_settings() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Unauthorized access.', 'slashed-bricks' ) );
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ), self::SETTINGS_NONCE_ACTION ) ) {
			wp_die( esc_html__( 'Security check failed.', 'slashed-bricks' ) );
		}

		$html_font_size = isset( $_POST['html_font_size'] ) ? sanitize_text_field( wp_unslash( $_POST['html_font_size'] ) ) : '';

		// Only allow known values.
		$allowed = array( '', '100', '62.5' );
		if ( ! in_array( $html_font_size, $allowed, true ) ) {
			$html_font_size = '';
		}

		$settings = get_option( self::SETTINGS_OPTION_NAME, array() );
		if ( ! is_array( $settings ) ) {
			$settings = array();
		}

		$settings['html_font_size'] = $html_font_size;
		update_option( self::SETTINGS_OPTION_NAME, $settings );

		wp_safe_redirect( admin_url( 'admin.php?page=slashed-bricks&message=settings_saved' ) );
		exit;
	}

	/**
	 * Get plugin settings (non-token behavioral settings).
	 *
	 * @return array
	 */
	public function get_plugin_settings() {
		$settings = get_option( self::SETTINGS_OPTION_NAME, array() );
		return is_array( $settings ) ? $settings : array();
	}

	/**
	 * Public proxy to sanitize_section() for callers outside this class
	 * (e.g. the REST controller used by the Svelte admin page).
	 *
	 * Keeping the underlying method private preserves the existing
	 * encapsulation of the legacy form handler while still letting both
	 * UIs share one sanitization path - critical so saves through either
	 * surface produce identical option contents.
	 *
	 * @param string $section Section slug.
	 * @param array  $data    Raw form data.
	 * @return array Sanitized data.
	 */
	public function sanitize_section_public( $section, $data ) {
		return $this->sanitize_section( $section, is_array( $data ) ? $data : array() );
	}

	/**
	 * Public read-only accessor for the registered tab map.
	 *
	 * Used by the REST controller to validate incoming section slugs
	 * against the same whitelist the legacy form enforces.
	 *
	 * @return array<string,string>
	 */
	public function get_tabs() {
		return $this->tabs;
	}

	/**
	 * Sanitize a section's input values.
	 *
	 * @param string $section Section slug.
	 * @param array  $data    Raw form data.
	 * @return array Sanitized data.
	 */
	private function sanitize_section( $section, $data ) {
		// Colors get a specialised merger because each token has two paired
		// inputs in the form (HEX picker + raw advanced) that resolve to a
		// single stored value.
		if ( 'colors' === $section ) {
			return $this->sanitize_color_section( $data );
		}

		$sanitized = array();

		foreach ( $data as $key => $value ) {
			$key = sanitize_key( $key );
			if ( is_array( $value ) ) {
				$sanitized[ $key ] = array_map(
					function ( $v ) {
						return $this->sanitize_css_value( sanitize_text_field( $v ) );
					},
					$value
				);
			} else {
				$sanitized[ $key ] = $this->sanitize_css_value( sanitize_text_field( $value ) );
			}
		}

		return $sanitized;
	}

	/**
	 * Merge paired HEX/raw color inputs into a single stored value per token.
	 *
	 * The Colors tab renders two inputs per color: a HEX picker (suffix
	 * "_hex") and an Advanced raw input (suffix "_raw") that accepts any
	 * CSS color string (oklch, rgb, hsl, etc.). The raw value wins when
	 * non-empty; otherwise the HEX value is used. The merged result is
	 * stored under the base key (e.g. "brand_primary"), preserving the
	 * storage shape the CSS generator already expects.
	 *
	 * Legacy direct writes (key without suffix) are still accepted, so
	 * imports or pre-upgrade saved values keep working.
	 *
	 * @param array $data Raw form data for the colors section.
	 * @return array Sanitized color settings keyed by base token name.
	 */
	private function sanitize_color_section( $data ) {
		$grouped = array();

		foreach ( $data as $key => $value ) {
			$key = (string) $key;
			if ( '' === $key || ! is_string( $value ) ) {
				continue;
			}

			$clean_value = $this->sanitize_css_value( sanitize_text_field( $value ) );
			$clean_value = trim( $clean_value );

			if ( $this->key_has_suffix( $key, '_hex' ) ) {
				$base = sanitize_key( substr( $key, 0, -4 ) );
				if ( '' !== $base ) {
					$grouped[ $base ]['hex'] = $clean_value;
				}
			} elseif ( $this->key_has_suffix( $key, '_raw' ) ) {
				$base = sanitize_key( substr( $key, 0, -4 ) );
				if ( '' !== $base ) {
					$grouped[ $base ]['raw'] = $clean_value;
				}
			} else {
				$base = sanitize_key( $key );
				if ( '' !== $base ) {
					$grouped[ $base ]['direct'] = $clean_value;
				}
			}
		}

		$sanitized = array();
		foreach ( $grouped as $base => $parts ) {
			if ( ! empty( $parts['raw'] ) ) {
				$sanitized[ $base ] = $parts['raw'];
			} elseif ( ! empty( $parts['hex'] ) ) {
				$sanitized[ $base ] = $parts['hex'];
			} elseif ( isset( $parts['direct'] ) && '' !== $parts['direct'] ) {
				$sanitized[ $base ] = $parts['direct'];
			}
			// All-empty rows are omitted so the framework default applies.
		}

		return $sanitized;
	}

	/**
	 * Polyfill for str_ends_with() since the plugin supports PHP 7.4.
	 *
	 * @param string $haystack Subject string.
	 * @param string $needle   Suffix to test for.
	 * @return bool
	 */
	private function key_has_suffix( $haystack, $needle ) {
		$nl = strlen( $needle );
		if ( $nl === 0 ) {
			return true;
		}
		$hl = strlen( $haystack );
		if ( $hl < $nl ) {
			return false;
		}
		return substr( $haystack, -$nl ) === $needle;
	}

	/**
	 * Determine whether a stored value looks like a HEX color.
	 *
	 * Accepts 3, 4, 6, and 8-digit forms. Anything else (oklch, rgb, hsl,
	 * named color, var()...) is treated as a raw advanced value so the
	 * UI starts in the Advanced input and won't truncate it via the
	 * HEX-only color picker.
	 *
	 * @param string $value Stored color value.
	 * @return bool
	 */
	private function is_hex_color( $value ) {
		return is_string( $value )
			&& 1 === preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', trim( $value ) );
	}

	/**
	 * Sanitize a value for safe use in CSS declarations.
	 *
	 * Strips characters that could escape a CSS declaration context or inject
	 * at-rules. This prevents stored values from breaking out of the
	 * :root { ... } block when interpolated into generated CSS.
	 *
	 * @param string $value The value to sanitize.
	 * @return string Sanitized value with dangerous characters removed.
	 */
	private function sanitize_css_value( $value ) {
		return str_replace( array( '{', '}', '<', '>', '@', ';' ), '', $value );
	}

	/**
	 * Render the admin settings page.
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$active_tab = isset( $_GET['tab'] ) ? sanitize_key( wp_unslash( $_GET['tab'] ) ) : 'colors';
		if ( ! isset( $this->tabs[ $active_tab ] ) ) {
			$active_tab = 'colors';
		}

		$settings = $this->get_settings();
		$message  = isset( $_GET['message'] ) ? sanitize_key( wp_unslash( $_GET['message'] ) ) : '';

		?>
		<div class="wrap slashed-admin-tabs">
			<h1 class="slashed-admin-header">
				<?php esc_html_e( 'SLASHED Design Tokens', 'slashed-bricks' ); ?>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline;">
					<input type="hidden" name="action" value="slashed_bricks_save">
					<input type="hidden" name="reset_all" value="1">
					<?php wp_nonce_field( self::NONCE_ACTION ); ?>
					<button type="submit" class="page-title-action slashed-reset-all-btn" onclick="return confirm('<?php esc_attr_e( 'Reset all settings to defaults?', 'slashed-bricks' ); ?>');">
						<?php esc_html_e( 'Reset All', 'slashed-bricks' ); ?>
					</button>
				</form>
			</h1>

			<?php $this->render_notices( $message ); ?>

			<nav class="nav-tab-wrapper">
				<?php foreach ( $this->tabs as $slug => $label ) : ?>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=slashed-bricks&tab=' . $slug ) ); ?>"
					   class="nav-tab <?php echo $active_tab === $slug ? 'nav-tab-active' : ''; ?>">
						<?php echo esc_html( $label ); ?>
					</a>
				<?php endforeach; ?>
			</nav>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="slashed_bricks_save">
				<input type="hidden" name="active_tab" value="<?php echo esc_attr( $active_tab ); ?>">
				<?php wp_nonce_field( self::NONCE_ACTION ); ?>

				<div class="slashed-tab-content">
					<?php
					$method = 'render_tab_' . str_replace( '-', '_', $active_tab );
					if ( method_exists( $this, $method ) ) {
						$tab_settings = isset( $settings[ $active_tab ] ) ? $settings[ $active_tab ] : array();
						$this->$method( $tab_settings );
					}
					?>
				</div>

				<?php submit_button( __( 'Save Changes', 'slashed-bricks' ) ); ?>

				<hr>
				<input type="hidden" name="reset_section" value="">
				<button type="submit" class="button button-link-delete slashed-reset-btn"
						onclick="this.form.querySelector('[name=reset_section]').value='<?php echo esc_attr( $active_tab ); ?>'; return confirm('<?php esc_attr_e( 'Reset this section to defaults?', 'slashed-bricks' ); ?>');">
					<?php printf( esc_html__( 'Reset %s Section', 'slashed-bricks' ), esc_html( $this->tabs[ $active_tab ] ) ); ?>
				</button>
			</form>

			<div class="slashed-plugin-settings">
				<h2><?php esc_html_e( 'Plugin Settings', 'slashed-bricks' ); ?></h2>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
					<input type="hidden" name="action" value="slashed_bricks_save_settings">
					<?php wp_nonce_field( self::SETTINGS_NONCE_ACTION ); ?>
					<?php $plugin_settings = $this->get_plugin_settings(); ?>
					<table class="form-table"><tbody>
						<tr>
							<th scope="row"><label for="html_font_size"><?php esc_html_e( 'HTML Font Size', 'slashed-bricks' ); ?></label></th>
							<td>
								<select id="html_font_size" name="html_font_size">
									<option value="" <?php selected( isset( $plugin_settings['html_font_size'] ) ? $plugin_settings['html_font_size'] : '', '' ); ?>><?php esc_html_e( 'Default (don\'t override)', 'slashed-bricks' ); ?></option>
									<option value="100" <?php selected( isset( $plugin_settings['html_font_size'] ) ? $plugin_settings['html_font_size'] : '', '100' ); ?>><?php esc_html_e( 'Force 100%', 'slashed-bricks' ); ?></option>
									<option value="62.5" <?php selected( isset( $plugin_settings['html_font_size'] ) ? $plugin_settings['html_font_size'] : '', '62.5' ); ?>><?php esc_html_e( 'Force 62.5%', 'slashed-bricks' ); ?></option>
								</select>
								<p class="description"><?php esc_html_e( 'Override the HTML root font-size. Use this if Bricks forces a font-size you don\'t want.', 'slashed-bricks' ); ?></p>
							</td>
						</tr>
					</tbody></table>
					<?php submit_button( __( 'Save Plugin Settings', 'slashed-bricks' ) ); ?>
				</form>
			</div>

			<?php $this->render_live_preview(); ?>
		</div>
		<?php
	}

	/**
	 * Render admin notices based on message parameter.
	 *
	 * @param string $message Message type.
	 */
	private function render_notices( $message ) {
		if ( 'saved' === $message ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved.', 'slashed-bricks' ) . '</p></div>';
		} elseif ( 'settings_saved' === $message ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Plugin settings saved.', 'slashed-bricks' ) . '</p></div>';
		} elseif ( 'reset' === $message ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'All settings reset to defaults.', 'slashed-bricks' ) . '</p></div>';
		} elseif ( 'reset_section' === $message ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Section reset to defaults.', 'slashed-bricks' ) . '</p></div>';
		}
	}

	/**
	 * Render the live preview panel.
	 *
	 * Displays sample HTML elements styled with current token values
	 * that update in real-time as the user adjusts controls via JS.
	 */
	private function render_live_preview() {
		$defaults = Slashed_Bricks_Token_Defaults::get_colors();
		?>
		<div class="slashed-preview-panel">
			<style id="slashed-live-preview"></style>

			<h3 class="preview-heading" style="font-family: var(--sf-font-heading, system-ui, sans-serif);">
				<?php esc_html_e( 'The quick brown fox jumps over the lazy dog', 'slashed-bricks' ); ?>
			</h3>

			<p class="preview-text" style="font-family: var(--sf-font-body, system-ui, sans-serif);">
				<?php esc_html_e( 'This is a preview of your design token configuration. Adjust values above and see changes reflected here in real time. Typography, colors, spacing, and other tokens will update as you modify them.', 'slashed-bricks' ); ?>
			</p>

			<div class="preview-colors">
				<div class="preview-color-swatch" style="background: var(--sf-color-primary-light, <?php echo esc_attr( $defaults['brand']['primary'] ); ?>);" title="Primary"></div>
				<div class="preview-color-swatch" style="background: var(--sf-color-secondary-light, <?php echo esc_attr( $defaults['brand']['secondary'] ); ?>);" title="Secondary"></div>
				<div class="preview-color-swatch" style="background: var(--sf-color-tertiary-light, <?php echo esc_attr( $defaults['brand']['tertiary'] ); ?>);" title="Tertiary"></div>
				<div class="preview-color-swatch" style="background: var(--sf-color-action-light, <?php echo esc_attr( $defaults['brand']['action'] ); ?>);" title="Action"></div>
				<div class="preview-color-swatch" style="background: var(--sf-color-neutral-light, <?php echo esc_attr( $defaults['brand']['neutral'] ); ?>);" title="Neutral"></div>
				<div class="preview-color-swatch" style="background: var(--sf-color-base-light, <?php echo esc_attr( $defaults['brand']['base'] ); ?>);" title="Base"></div>
			</div>

			<div>
				<span class="preview-button" style="background: var(--sf-color-primary-light, <?php echo esc_attr( $defaults['brand']['primary'] ); ?>);">
					<?php esc_html_e( 'Primary Button', 'slashed-bricks' ); ?>
				</span>
				<span class="preview-button" style="background: var(--sf-color-action-light, <?php echo esc_attr( $defaults['brand']['action'] ); ?>);">
					<?php esc_html_e( 'Action Button', 'slashed-bricks' ); ?>
				</span>
			</div>

			<div class="preview-spacing">
				<div class="preview-spacing-box" style="width: 20px; height: 20px;" title="XS"></div>
				<div class="preview-spacing-box" style="width: 30px; height: 30px;" title="S"></div>
				<div class="preview-spacing-box" style="width: 44px; height: 44px;" title="M"></div>
				<div class="preview-spacing-box" style="width: 60px; height: 60px;" title="L"></div>
				<div class="preview-spacing-box" style="width: 80px; height: 80px;" title="XL"></div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render the Colors tab.
	 *
	 * Each color exposes two paired inputs:
	 *   - A HEX picker (real WP color picker) - the primary path.
	 *   - An "Advanced (raw value)" input that accepts any CSS color
	 *     string (oklch, rgb, hsl, var(), ...) - used when the user
	 *     wants to keep an authoring format the picker can't represent.
	 *
	 * The active mode is auto-detected on render: if the saved value
	 * is a HEX literal we start in HEX mode; if it's anything else
	 * (oklch, named, etc.) we start in Advanced mode.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_colors( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_colors();

		echo '<h2>' . esc_html__( 'Brand Colors', 'slashed-bricks' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Pick a color via the HEX picker, or switch to "Advanced" to paste an oklch() / rgb() / any other CSS color value. Whatever you save is fed straight into the framework as the source of the brand scale.', 'slashed-bricks' ) . '</p>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults['brand'] as $name => $default_oklch ) {
			$base_key   = 'brand_' . $name;
			$saved      = isset( $settings[ $base_key ] ) ? (string) $settings[ $base_key ] : '';
			$hex_default_hint = isset( $defaults['brand_hex_hints'][ $name ] ) ? $defaults['brand_hex_hints'][ $name ] : '';
			$this->render_color_row(
				$base_key,
				ucfirst( $name ),
				$saved,
				$hex_default_hint,
				$default_oklch,
				'--sf-color-' . $name . '-light'
			);
		}

		echo '</tbody></table>';

		echo '<h2>' . esc_html__( 'Status Colors', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults['status'] as $name => $default_oklch ) {
			$base_key   = 'status_' . $name;
			$saved      = isset( $settings[ $base_key ] ) ? (string) $settings[ $base_key ] : '';
			$hex_default_hint = isset( $defaults['status_hex_hints'][ $name ] ) ? $defaults['status_hex_hints'][ $name ] : '';
			$this->render_color_row(
				$base_key,
				ucfirst( $name ),
				$saved,
				$hex_default_hint,
				$default_oklch,
				'--sf-color-' . $name . '-light'
			);
		}

		echo '</tbody></table>';
	}

	/**
	 * Render a single color row with paired HEX and Advanced inputs.
	 *
	 * @param string $base_key      Stored token key (e.g. "brand_primary").
	 * @param string $label         Display label (e.g. "Primary").
	 * @param string $saved         Currently saved value (any CSS color string, or empty).
	 * @param string $hex_hint      HEX placeholder shown when nothing is saved.
	 * @param string $oklch_hint    OKLCH placeholder shown in the Advanced input.
	 * @param string $css_var       Underlying CSS custom property name (informational only).
	 */
	private function render_color_row( $base_key, $label, $saved, $hex_hint, $oklch_hint, $css_var ) {
		$is_hex      = $this->is_hex_color( $saved );
		$start_mode  = ( $is_hex || '' === $saved ) ? 'hex' : 'raw';
		$hex_value   = $is_hex ? $saved : '';
		$raw_value   = $is_hex ? '' : $saved;
		$row_id      = 'slashed-color-row-' . $base_key;

		?>
		<tr>
			<th scope="row">
				<label for="<?php echo esc_attr( $base_key . '_hex' ); ?>"><?php echo esc_html( $label ); ?></label>
			</th>
			<td>
				<div class="slashed-color-row" id="<?php echo esc_attr( $row_id ); ?>" data-base="<?php echo esc_attr( $base_key ); ?>" data-mode="<?php echo esc_attr( $start_mode ); ?>">

					<div class="slashed-color-input slashed-color-input--hex" <?php echo 'hex' === $start_mode ? '' : 'hidden'; ?>>
						<input
							type="text"
							id="<?php echo esc_attr( $base_key . '_hex' ); ?>"
							name="slashed_tokens[<?php echo esc_attr( $base_key ); ?>_hex]"
							value="<?php echo esc_attr( $hex_value ); ?>"
							class="slashed-color-hex"
							data-default-color="<?php echo esc_attr( $hex_hint ); ?>"
							data-base="<?php echo esc_attr( $base_key ); ?>"
						>
					</div>

					<div class="slashed-color-input slashed-color-input--raw" <?php echo 'raw' === $start_mode ? '' : 'hidden'; ?>>
						<input
							type="text"
							id="<?php echo esc_attr( $base_key . '_raw' ); ?>"
							name="slashed_tokens[<?php echo esc_attr( $base_key ); ?>_raw]"
							value="<?php echo esc_attr( $raw_value ); ?>"
							placeholder="<?php echo esc_attr( $oklch_hint ); ?>"
							class="regular-text slashed-color-raw"
							spellcheck="false"
							data-base="<?php echo esc_attr( $base_key ); ?>"
						>
					</div>

					<button
						type="button"
						class="button-link slashed-color-toggle"
						data-row="<?php echo esc_attr( $row_id ); ?>"
						aria-controls="<?php echo esc_attr( $row_id ); ?>"
					>
						<span class="slashed-color-toggle__label-hex"><?php esc_html_e( 'Advanced (oklch / raw)', 'slashed-bricks' ); ?></span>
						<span class="slashed-color-toggle__label-raw"><?php esc_html_e( 'Use HEX picker', 'slashed-bricks' ); ?></span>
					</button>

					<p class="description"><code><?php echo esc_html( $css_var ); ?></code></p>
				</div>
			</td>
		</tr>
		<?php
	}

	/**
	 * Render the Contrast tab.
	 *
	 * Houses cross-cutting visual fine-tuning knobs that don't fit
	 * inside any of the typed token sections (typography, spacing,
	 * radius, etc). Each control writes one CSS custom property:
	 *
	 *   - --sf-contrast-bias        (-0.2 to +0.2)
	 *   - --sf-contrast-threshold   (0 to 1)
	 *   - --sf-opacity-disabled     (0 to 1)
	 *   - --sf-focus-ring-width     (px)
	 *   - --sf-focus-ring-offset    (px)
	 *   - --sf-focus-ring-style     (solid / dashed / dotted / double / none)
	 *
	 * Per-section scale multipliers (text_scale, space_scale, etc) keep
	 * their own tabs since they belong with their token family. This
	 * keeps each setting in exactly one place - no duplicate sources of
	 * truth, no surprising overrides.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_contrast( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_contrast();

		echo '<h2>' . esc_html__( 'Contrast', 'slashed-bricks' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Fine-tune how the framework derives shades and picks readable text colors against your brand colors.', 'slashed-bricks' ) . '</p>';
		echo '<table class="form-table"><tbody>';

		$this->render_range_field(
			$settings,
			'contrast_bias',
			__( 'Contrast bias', 'slashed-bricks' ),
			__( 'Shifts every derived shade up (positive) or down (negative). Useful to brighten or dim the entire scale without re-picking source colors.', 'slashed-bricks' ),
			-0.2,
			0.2,
			0.01,
			$defaults['contrast_bias'],
			'--sf-contrast-bias'
		);

		$this->render_range_field(
			$settings,
			'contrast_threshold',
			__( 'Contrast threshold', 'slashed-bricks' ),
			__( 'Lightness threshold used to pick text-on-color (white vs. black). Lower values prefer dark text on more colors; higher values prefer white text.', 'slashed-bricks' ),
			0,
			1,
			0.01,
			$defaults['contrast_threshold'],
			'--sf-contrast-threshold'
		);

		echo '</tbody></table>';

		echo '<h2>' . esc_html__( 'Opacity', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		$this->render_range_field(
			$settings,
			'opacity_disabled',
			__( 'Disabled opacity', 'slashed-bricks' ),
			__( 'Opacity applied to disabled UI elements (buttons, inputs, links).', 'slashed-bricks' ),
			0,
			1,
			0.01,
			$defaults['opacity_disabled'],
			'--sf-opacity-disabled'
		);

		echo '</tbody></table>';

		echo '<h2>' . esc_html__( 'Focus ring', 'slashed-bricks' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Visual indicator drawn around keyboard-focused elements. Lower the offset to tighten the ring, raise it to give the element more breathing room.', 'slashed-bricks' ) . '</p>';
		echo '<table class="form-table"><tbody>';

		$this->render_range_field(
			$settings,
			'focus_ring_width',
			__( 'Ring width', 'slashed-bricks' ),
			'',
			0,
			8,
			0.5,
			$defaults['focus_ring_width'],
			'--sf-focus-ring-width',
			'px'
		);

		$this->render_range_field(
			$settings,
			'focus_ring_offset',
			__( 'Ring offset', 'slashed-bricks' ),
			'',
			0,
			8,
			0.5,
			$defaults['focus_ring_offset'],
			'--sf-focus-ring-offset',
			'px'
		);

		// Focus ring style is a small enum, so render a select instead of a slider.
		$style_value   = isset( $settings['focus_ring_style'] ) ? (string) $settings['focus_ring_style'] : '';
		$style_default = $defaults['focus_ring_style'];
		$style_options = array( 'solid', 'dashed', 'dotted', 'double', 'none' );
		echo '<tr>';
		echo '<th scope="row"><label for="focus_ring_style">' . esc_html__( 'Ring style', 'slashed-bricks' ) . '</label></th>';
		echo '<td>';
		echo '<select id="focus_ring_style" name="slashed_tokens[focus_ring_style]">';
		echo '<option value="">' . esc_html( sprintf( /* translators: %s: default style name. */ __( 'Default (%s)', 'slashed-bricks' ), $style_default ) ) . '</option>';
		foreach ( $style_options as $opt ) {
			$selected = selected( $style_value, $opt, false );
			echo '<option value="' . esc_attr( $opt ) . '" ' . $selected . '>' . esc_html( $opt ) . '</option>';
		}
		echo '</select>';
		echo '<p class="description"><code>--sf-focus-ring-style</code></p>';
		echo '</td>';
		echo '</tr>';

		echo '</tbody></table>';
	}

	/**
	 * Render a paired range + number input that share a sync id.
	 *
	 * Markup matches what initRangeSync() in admin-page.js looks for:
	 * .slashed-range-input and .slashed-number-input sharing data-sync.
	 *
	 * Only the number input carries the form `name`, so submission is
	 * unambiguous regardless of which control the user touched last.
	 *
	 * @param array       $settings    Saved settings for the section.
	 * @param string      $key         Token key (also used as data-sync id).
	 * @param string      $label       Field label.
	 * @param string      $description Help text shown beneath the inputs.
	 * @param float|int   $min         Minimum allowed value.
	 * @param float|int   $max         Maximum allowed value.
	 * @param float       $step        Step granularity.
	 * @param float|int   $default     Factory default (used as placeholder).
	 * @param string      $css_var     Underlying CSS custom property (informational only).
	 * @param string      $unit        Optional unit label rendered after the inputs (e.g. 'px').
	 */
	private function render_range_field( $settings, $key, $label, $description, $min, $max, $step, $default, $css_var, $unit = '' ) {
		$value      = isset( $settings[ $key ] ) ? $settings[ $key ] : '';
		$slider_val = '' !== $value ? $value : $default;

		echo '<tr>';
		echo '<th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $label ) . '</label></th>';
		echo '<td>';
		echo '<div class="slashed-range-group">';

		printf(
			'<input type="range" class="slashed-range-input" data-sync="%1$s" min="%2$s" max="%3$s" step="%4$s" value="%5$s" aria-hidden="true" tabindex="-1">',
			esc_attr( $key ),
			esc_attr( (string) $min ),
			esc_attr( (string) $max ),
			esc_attr( (string) $step ),
			esc_attr( (string) $slider_val )
		);

		printf(
			'<input type="number" id="%1$s" class="slashed-number-input" data-sync="%1$s" name="slashed_tokens[%1$s]" min="%2$s" max="%3$s" step="%4$s" value="%5$s" placeholder="%6$s">',
			esc_attr( $key ),
			esc_attr( (string) $min ),
			esc_attr( (string) $max ),
			esc_attr( (string) $step ),
			esc_attr( (string) $value ),
			esc_attr( (string) $default )
		);

		if ( '' !== $unit ) {
			echo '<span class="slashed-range-unit">' . esc_html( $unit ) . '</span>';
		}

		echo '</div>';

		if ( '' !== $description ) {
			echo '<p class="description">' . esc_html( $description ) . '</p>';
		}
		echo '<p class="description"><code>' . esc_html( $css_var ) . '</code></p>';
		echo '</td>';
		echo '</tr>';
	}

	/**
	 * Render the Typography tab.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_typography( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_typography();

		// Font families.
		echo '<h2>' . esc_html__( 'Font Families', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults['font_families'] as $name => $default ) {
			$field_name = 'slashed_tokens[font_' . $name . ']';
			$value      = isset( $settings[ 'font_' . $name ] ) ? $settings[ 'font_' . $name ] : '';
			echo '<tr>';
			echo '<th scope="row"><label for="font_' . esc_attr( $name ) . '">' . esc_html( ucfirst( $name ) ) . '</label></th>';
			echo '<td>';
			echo '<input type="text" id="font_' . esc_attr( $name ) . '" name="' . esc_attr( $field_name ) . '" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $default ) . '" class="large-text">';
			echo '<p class="description"><code>--sf-font-' . esc_html( $name ) . '</code></p>';
			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';

		// Font sizes.
		echo '<h2>' . esc_html__( 'Font Size Scale', 'slashed-bricks' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Min and max values in rem for fluid type scaling via clamp().', 'slashed-bricks' ) . '</p>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults['font_sizes'] as $name => $size_defaults ) {
			$min_field = 'slashed_tokens[size_' . $name . '_min]';
			$max_field = 'slashed_tokens[size_' . $name . '_max]';
			$min_value = isset( $settings[ 'size_' . $name . '_min' ] ) ? $settings[ 'size_' . $name . '_min' ] : '';
			$max_value = isset( $settings[ 'size_' . $name . '_max' ] ) ? $settings[ 'size_' . $name . '_max' ] : '';
			echo '<tr>';
			echo '<th scope="row"><label>' . esc_html( $name ) . '</label></th>';
			echo '<td>';
			echo '<label>' . esc_html__( 'Min:', 'slashed-bricks' ) . ' ';
			echo '<input type="number" name="' . esc_attr( $min_field ) . '" value="' . esc_attr( $min_value ) . '" placeholder="' . esc_attr( $size_defaults['min'] ) . '" step="0.01" min="0" style="width:80px;"></label> ';
			echo '<label>' . esc_html__( 'Max:', 'slashed-bricks' ) . ' ';
			echo '<input type="number" name="' . esc_attr( $max_field ) . '" value="' . esc_attr( $max_value ) . '" placeholder="' . esc_attr( $size_defaults['max'] ) . '" step="0.01" min="0" style="width:80px;"></label>';
			echo '<p class="description"><code>--sf-text-' . esc_html( $name ) . '</code></p>';
			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';

		// Scale multipliers.
		echo '<h2>' . esc_html__( 'Scale Multipliers', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		$text_scale_value    = isset( $settings['text_scale'] ) ? $settings['text_scale'] : '';
		$display_scale_value = isset( $settings['text_display_scale'] ) ? $settings['text_display_scale'] : '';

		echo '<tr>';
		echo '<th scope="row"><label for="text_scale">' . esc_html__( 'Text Scale', 'slashed-bricks' ) . '</label></th>';
		echo '<td>';
		echo '<input type="number" id="text_scale" name="slashed_tokens[text_scale]" value="' . esc_attr( $text_scale_value ) . '" placeholder="1" step="0.05" min="0">';
		echo '<p class="description"><code>--sf-text-scale</code></p>';
		echo '</td>';
		echo '</tr>';

		echo '<tr>';
		echo '<th scope="row"><label for="text_display_scale">' . esc_html__( 'Display Scale', 'slashed-bricks' ) . '</label></th>';
		echo '<td>';
		echo '<input type="number" id="text_display_scale" name="slashed_tokens[text_display_scale]" value="' . esc_attr( $display_scale_value ) . '" placeholder="1" step="0.05" min="0">';
		echo '<p class="description"><code>--sf-text-display-scale</code></p>';
		echo '</td>';
		echo '</tr>';

		echo '</tbody></table>';
	}

	/**
	 * Render the Spacing tab.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_spacing( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_spacing();

		echo '<h2>' . esc_html__( 'Spacing', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		// Scale multiplier.
		$scale_value = isset( $settings['space_scale'] ) ? $settings['space_scale'] : '';
		echo '<tr>';
		echo '<th scope="row"><label for="space_scale">' . esc_html__( 'Space Scale', 'slashed-bricks' ) . '</label></th>';
		echo '<td>';
		echo '<input type="number" id="space_scale" name="slashed_tokens[space_scale]" value="' . esc_attr( $scale_value ) . '" placeholder="' . esc_attr( $defaults['space_scale'] ) . '" step="0.05" min="0">';
		echo '<p class="description"><code>--sf-space-scale</code></p>';
		echo '</td>';
		echo '</tr>';

		// Spacing aliases.
		$aliases = array(
			'gutter'        => array( 'label' => 'Gutter', 'var' => '--sf-space-gutter' ),
			'gap'           => array( 'label' => 'Gap', 'var' => '--sf-gap' ),
			'content_gap'   => array( 'label' => 'Content Gap', 'var' => '--sf-content-gap' ),
			'component_pad' => array( 'label' => 'Component Pad', 'var' => '--sf-component-pad' ),
			'section_pad'   => array( 'label' => 'Section Pad', 'var' => '--sf-section-pad' ),
		);

		foreach ( $aliases as $key => $config ) {
			$value   = isset( $settings[ $key ] ) ? $settings[ $key ] : '';
			$default = isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
			echo '<tr>';
			echo '<th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $config['label'] ) . '</label></th>';
			echo '<td>';
			echo '<input type="text" id="' . esc_attr( $key ) . '" name="slashed_tokens[' . esc_attr( $key ) . ']" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $default ) . '" class="regular-text">';
			echo '<p class="description"><code>' . esc_html( $config['var'] ) . '</code></p>';
			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';
	}

	/**
	 * Render the Radius tab.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_radius( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_radius();

		echo '<h2>' . esc_html__( 'Radius', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		$value = isset( $settings['radius_scale'] ) ? $settings['radius_scale'] : '';
		echo '<tr>';
		echo '<th scope="row"><label for="radius_scale">' . esc_html__( 'Radius Scale', 'slashed-bricks' ) . '</label></th>';
		echo '<td>';
		echo '<input type="number" id="radius_scale" name="slashed_tokens[radius_scale]" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $defaults['radius_scale'] ) . '" step="0.1" min="0">';
		echo '<p class="description"><code>--sf-radius-scale</code></p>';
		echo '</td>';
		echo '</tr>';

		echo '</tbody></table>';
	}

	/**
	 * Render the Shadows tab.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_shadows( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_shadows();

		echo '<h2>' . esc_html__( 'Shadows', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		$value = isset( $settings['shadow_strength'] ) ? $settings['shadow_strength'] : '';
		echo '<tr>';
		echo '<th scope="row"><label for="shadow_strength">' . esc_html__( 'Shadow Strength', 'slashed-bricks' ) . '</label></th>';
		echo '<td>';
		echo '<input type="number" id="shadow_strength" name="slashed_tokens[shadow_strength]" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $defaults['shadow_strength'] ) . '" step="0.01" min="0" max="1">';
		echo '<p class="description">' . esc_html__( 'Base opacity value for shadow layers (0-1).', 'slashed-bricks' ) . '</p>';
		echo '</td>';
		echo '</tr>';

		echo '</tbody></table>';
	}

	/**
	 * Render the Motion tab.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_motion( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_motion();

		echo '<h2>' . esc_html__( 'Motion', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		// Scale multiplier.
		$scale_value = isset( $settings['motion_scale'] ) ? $settings['motion_scale'] : '';
		echo '<tr>';
		echo '<th scope="row"><label for="motion_scale">' . esc_html__( 'Motion Scale', 'slashed-bricks' ) . '</label></th>';
		echo '<td>';
		echo '<input type="number" id="motion_scale" name="slashed_tokens[motion_scale]" value="' . esc_attr( $scale_value ) . '" placeholder="' . esc_attr( $defaults['motion_scale'] ) . '" step="0.1" min="0">';
		echo '<p class="description"><code>--sf-motion-scale</code></p>';
		echo '</td>';
		echo '</tr>';

		echo '</tbody></table>';

		// Duration values.
		echo '<h2>' . esc_html__( 'Duration Values', 'slashed-bricks' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Base duration values in milliseconds.', 'slashed-bricks' ) . '</p>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults['durations'] as $name => $default ) {
			$value = isset( $settings[ 'duration_' . $name ] ) ? $settings[ 'duration_' . $name ] : '';
			echo '<tr>';
			echo '<th scope="row"><label for="duration_' . esc_attr( $name ) . '">' . esc_html( ucfirst( $name ) ) . '</label></th>';
			echo '<td>';
			echo '<input type="number" id="duration_' . esc_attr( $name ) . '" name="slashed_tokens[duration_' . esc_attr( $name ) . ']" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $default ) . '" min="0" step="10">';
			echo '<span class="description"> ms</span>';
			echo '<p class="description"><code>--sf-duration-' . esc_html( $name ) . '</code></p>';
			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';
	}

	/**
	 * Render the Z-Index tab.
	 *
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_zindex( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_zindex();

		echo '<h2>' . esc_html__( 'Z-Index', 'slashed-bricks' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Z-index layer values for stacking context management.', 'slashed-bricks' ) . '</p>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults as $name => $default ) {
			$value = isset( $settings[ $name ] ) ? $settings[ $name ] : '';
			echo '<tr>';
			echo '<th scope="row"><label for="z_' . esc_attr( $name ) . '">' . esc_html( ucfirst( $name ) ) . '</label></th>';
			echo '<td>';
			echo '<input type="number" id="z_' . esc_attr( $name ) . '" name="slashed_tokens[' . esc_attr( $name ) . ']" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $default ) . '" step="1">';
			echo '<p class="description"><code>--sf-z-' . esc_html( $name ) . '</code></p>';
			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';
	}
}
