<?php
/**
 * Unified SLASHED admin page.
 *
 * @package SLASHED
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Slashed_Admin
 *
 * Registers the top-level "SLASHED" menu and renders the integration
 * toggle page. Builder-specific settings pages (e.g. Bricks token
 * overrides) appear as sub-pages when their integration is active.
 */
class Slashed_Admin {

	const PAGE_SLUG  = 'slashed';
	const NONCE_KEY  = 'slashed_settings_save';
	const NONCE_ACTION = 'slashed_save_settings';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_post_slashed_save_settings', array( $this, 'handle_save' ) );
	}

	public function register_menu() {
		add_menu_page(
			__( 'SLASHED', 'slashed' ),
			__( 'SLASHED', 'slashed' ),
			'manage_options',
			self::PAGE_SLUG,
			array( $this, 'render_page' ),
			'dashicons-art',
			59
		);
	}

	/**
	 * Handle the settings form POST.
	 * Redirects back to the settings page with a status flag.
	 */
	public function handle_save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Insufficient permissions.', 'slashed' ) );
		}

		check_admin_referer( self::NONCE_ACTION, self::NONCE_KEY );

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified above via check_admin_referer.
		$raw_integrations = isset( $_POST['integrations'] ) && is_array( $_POST['integrations'] )
			? array_map( 'sanitize_key', $_POST['integrations'] )
			: array();

		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$raw_bundle = isset( $_POST['css_bundle'] ) ? sanitize_key( $_POST['css_bundle'] ) : 'optimal';

		$data = array(
			'css_bundle'   => in_array( $raw_bundle, Slashed_Settings::ALLOWED_BUNDLES, true ) ? $raw_bundle : 'optimal',
			'integrations' => array(),
		);
		foreach ( Slashed_Settings::KNOWN_INTEGRATIONS as $slug ) {
			$data['integrations'][ $slug ] = array_key_exists( $slug, $raw_integrations );
		}

		Slashed_Settings::save( $data );

		wp_safe_redirect(
			add_query_arg( 'slashed_saved', '1', admin_url( 'admin.php?page=' . self::PAGE_SLUG ) )
		);
		exit;
	}

	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$settings     = Slashed_Settings::get();
		$integrations = $settings['integrations'];
		$css_bundle   = $settings['css_bundle'];
		$saved        = ! empty( $_GET['slashed_saved'] ); // phpcs:ignore WordPress.Security.NonceVerification
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'SLASHED', 'slashed' ); ?> <span style="font-weight:400;font-size:13px;color:#999;"><?php echo esc_html( SLASHED_VERSION ); ?></span></h1>

			<?php if ( $saved ) : ?>
				<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Settings saved.', 'slashed' ); ?></p></div>
			<?php endif; ?>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="slashed_save_settings">
				<?php wp_nonce_field( self::NONCE_ACTION, self::NONCE_KEY ); ?>

				<h2 style="margin-top:1.5em;"><?php esc_html_e( 'CSS framework', 'slashed' ); ?></h2>
				<p class="description">
					<?php esc_html_e( 'The SLASHED framework CSS loads automatically on your site — no page builder required. Choose the smallest bundle that covers your needs.', 'slashed' ); ?>
					&nbsp;<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . \Slashed_Token_Page::PAGE_SLUG ) ); ?>"><?php esc_html_e( 'Customize design tokens →', 'slashed' ); ?></a>
				</p>

				<table class="form-table" role="presentation">
					<?php
					$bundles = array(
						'essential' => __( 'Essential — core layer only: tokens, reset, layout, states, motion', 'slashed' ),
						'optimal'   => __( 'Optimal — + color palette, forms, legacy support (recommended)', 'slashed' ),
						'full'      => __( 'Full — + components + utilities', 'slashed' ),
					);
					foreach ( $bundles as $value => $label ) :
						?>
						<tr>
							<th scope="row" style="padding-top:6px;padding-bottom:6px;">
								<label for="bundle-<?php echo esc_attr( $value ); ?>"><?php echo esc_html( $label ); ?></label>
							</th>
							<td style="padding-top:6px;padding-bottom:6px;">
								<input type="radio" id="bundle-<?php echo esc_attr( $value ); ?>"
									name="css_bundle" value="<?php echo esc_attr( $value ); ?>"
									<?php checked( $css_bundle, $value ); ?>>
							</td>
						</tr>
					<?php endforeach; ?>
				</table>

				<h2><?php esc_html_e( 'Builder integrations', 'slashed' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Optional deeper integration with your page builder. Adds builder-specific features on top of the core CSS delivery.', 'slashed' ); ?></p>

				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><?php esc_html_e( 'Bricks Builder', 'slashed' ); ?></th>
						<td>
							<label>
								<input type="checkbox" name="integrations[bricks]"
									<?php checked( $integrations['bricks'] ); ?>>
								<?php esc_html_e( 'Enable', 'slashed' ); ?>
							</label>
							<p class="description">
							<?php
							if ( defined( 'BRICKS_VERSION' ) ) {
								printf(
									/* translators: %s: Bricks version */
									esc_html__( 'Bricks %s detected.', 'slashed' ),
									esc_html( BRICKS_VERSION )
								);
							} else {
								esc_html_e( 'Bricks Builder not detected.', 'slashed' );
							}
							?>
							<?php esc_html_e( 'Injects CSS variables into Global Variables, syncs the color palette, and enables the reBEMer class manager.', 'slashed' ); ?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Gutenberg / Block Editor', 'slashed' ); ?></th>
						<td>
							<label>
								<input type="checkbox" name="integrations[gutenberg]"
									<?php checked( $integrations['gutenberg'] ); ?>>
								<?php esc_html_e( 'Enable', 'slashed' ); ?>
							</label>
							<p class="description"><?php esc_html_e( 'Syncs SLASHED colors with the block editor palette and bridges the editor dark-mode toggle.', 'slashed' ); ?></p>
						</td>
					</tr>
				</table>

				<?php submit_button( __( 'Save settings', 'slashed' ) ); ?>
			</form>

			<hr>
			<p style="color:#999;font-size:12px;">
				<?php
				printf(
					/* translators: %s: CSS ref tag */
					esc_html__( 'Framework: %s &middot; CSS dist SHA: %s', 'slashed' ),
					esc_html( SLASHED_CSS_REF ),
					'<code>' . esc_html( substr( SLASHED_DIST_SHA, 0, 8 ) ) . '</code>'
				);
				?>
			</p>
		</div>
		<?php
	}
}
