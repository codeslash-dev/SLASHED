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
	 * Constructor. Register hooks.
	 */
	public function __construct() {
		$this->tabs = array(
			'colors'     => 'Colors',
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
	 * Sanitize a section's input values.
	 *
	 * @param string $section Section slug.
	 * @param array  $data    Raw form data.
	 * @return array Sanitized data.
	 */
	private function sanitize_section( $section, $data ) {
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
	 * @param array $settings Saved settings for this tab.
	 */
	private function render_tab_colors( $settings ) {
		$defaults = Slashed_Bricks_Token_Defaults::get_colors();

		echo '<h2>' . esc_html__( 'Brand Colors', 'slashed-bricks' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Source color tokens in oklch() format. These generate the full color scale.', 'slashed-bricks' ) . '</p>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults['brand'] as $name => $default ) {
			$field_name = 'slashed_tokens[brand_' . $name . ']';
			$value      = isset( $settings[ 'brand_' . $name ] ) ? $settings[ 'brand_' . $name ] : '';
			echo '<tr>';
			echo '<th scope="row"><label for="brand_' . esc_attr( $name ) . '">' . esc_html( ucfirst( $name ) ) . '</label></th>';
			echo '<td>';
			echo '<input type="text" id="brand_' . esc_attr( $name ) . '" name="' . esc_attr( $field_name ) . '" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $default ) . '" class="regular-text slashed-color-field">';
			echo '<p class="description"><code>--sf-color-' . esc_html( $name ) . '-light</code></p>';
			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';

		echo '<h2>' . esc_html__( 'Status Colors', 'slashed-bricks' ) . '</h2>';
		echo '<table class="form-table"><tbody>';

		foreach ( $defaults['status'] as $name => $default ) {
			$field_name = 'slashed_tokens[status_' . $name . ']';
			$value      = isset( $settings[ 'status_' . $name ] ) ? $settings[ 'status_' . $name ] : '';
			echo '<tr>';
			echo '<th scope="row"><label for="status_' . esc_attr( $name ) . '">' . esc_html( ucfirst( $name ) ) . '</label></th>';
			echo '<td>';
			echo '<input type="text" id="status_' . esc_attr( $name ) . '" name="' . esc_attr( $field_name ) . '" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $default ) . '" class="regular-text slashed-color-field">';
			echo '<p class="description"><code>--sf-color-' . esc_html( $name ) . '-light</code></p>';
			echo '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';
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
