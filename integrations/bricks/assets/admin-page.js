/**
 * SLASHED Admin Page JavaScript
 *
 * Handles tab persistence, color picker initialization, range/number sync,
 * live preview generation, and form dirty state tracking.
 *
 * @package SLASHED_Bricks
 */

( function( $ ) {
	'use strict';

	var isDirty = false;
	var defaults = ( typeof slashedBricksAdmin !== 'undefined' ) ? slashedBricksAdmin.defaults : {};
	var settings = ( typeof slashedBricksAdmin !== 'undefined' ) ? slashedBricksAdmin.settings : {};

	/**
	 * Initialize tab persistence via URL hash.
	 */
	function initTabPersistence() {
		var hash = window.location.hash.replace( '#', '' );
		var tabs = $( '.nav-tab-wrapper .nav-tab' );

		if ( hash && tabs.length ) {
			tabs.each( function() {
				var href = $( this ).attr( 'href' );
				if ( href && href.indexOf( 'tab=' + hash ) !== -1 ) {
					window.location.href = href;
				}
			} );
		}

		// Set hash on tab click for persistence.
		tabs.on( 'click', function() {
			var href = $( this ).attr( 'href' );
			if ( href ) {
				var match = href.match( /tab=([a-z_-]+)/ );
				if ( match ) {
					window.location.hash = match[1];
				}
			}
		} );
	}

	/**
	 * Initialize the color picker on every paired HEX/Advanced color row.
	 *
	 * Each row contains:
	 *   - .slashed-color-hex   - the HEX input wired to wpColorPicker
	 *   - .slashed-color-raw   - the Advanced (oklch / any CSS color) input
	 *   - .slashed-color-toggle - swaps which one is active/visible
	 *
	 * The active mode is recorded on the row's data-mode attribute, set
	 * server-side based on the saved value's shape (HEX vs anything else).
	 */
	function initColorPickers() {
		if ( ! $.fn.wpColorPicker ) {
			return;
		}

		// Curated palette of the rough HEX equivalents of SLASHED's
		// default oklch tokens - shown as quick-pick chips in the picker
		// dropdown. Real chosen values are still written to the input.
		var palette = [
			'#4338ca', '#1e293b', '#7c3aed', '#0891b2',
			'#64748b', '#fafafa', '#16a34a', '#ca8a04',
			'#dc2626', '#2563eb'
		];

		$( '.slashed-color-hex' ).each( function() {
			var $input = $( this );

			$input.wpColorPicker( {
				palettes: palette,
				change: function() {
					// Defer one tick so wpColorPicker has finished writing
					// the new value into the underlying input, then mirror
					// the change into our dirty/preview pipeline.
					window.setTimeout( function() {
						markDirty();
						updateLivePreview();
					}, 0 );
				},
				clear: function() {
					markDirty();
					updateLivePreview();
				}
			} );
		} );

		// Toggle button: swap which input is active for a given row.
		$( document ).on( 'click', '.slashed-color-toggle', function( e ) {
			e.preventDefault();
			var $btn = $( this );
			var $row = $( '#' + $btn.data( 'row' ) );
			if ( ! $row.length ) {
				return;
			}
			var current = $row.attr( 'data-mode' ) || 'hex';
			var next    = current === 'hex' ? 'raw' : 'hex';

			$row.attr( 'data-mode', next );
			$row.find( '.slashed-color-input--hex' ).attr( 'hidden', next !== 'hex' ? true : null );
			$row.find( '.slashed-color-input--raw' ).attr( 'hidden', next !== 'raw' ? true : null );

			// Clear the inactive input so the merged save logic resolves
			// unambiguously to the user's chosen value.
			if ( next === 'hex' ) {
				var $raw = $row.find( '.slashed-color-raw' );
				if ( $raw.val() !== '' ) {
					$raw.val( '' );
				}
			} else {
				// Switching to raw: clear the picker via its API so the
				// saved hex doesn't compete with what the user types.
				var $hex = $row.find( '.slashed-color-hex' );
				if ( $hex.val() !== '' && $hex.wpColorPicker ) {
					$hex.wpColorPicker( 'color', '' );
				}
				$row.find( '.slashed-color-raw' ).trigger( 'focus' );
			}

			markDirty();
			updateLivePreview();
		} );
	}

	/**
	 * Sync range inputs with their paired number inputs.
	 * Elements are linked by matching data-sync attributes.
	 */
	function initRangeSync() {
		$( document ).on( 'input change', '.slashed-range-input', function() {
			var syncId = $( this ).data( 'sync' );
			if ( syncId ) {
				$( '.slashed-number-input[data-sync="' + syncId + '"]' ).val( $( this ).val() );
				markDirty();
				updateLivePreview();
			}
		} );

		$( document ).on( 'input change', '.slashed-number-input', function() {
			var syncId = $( this ).data( 'sync' );
			if ( syncId ) {
				$( '.slashed-range-input[data-sync="' + syncId + '"]' ).val( $( this ).val() );
				markDirty();
				updateLivePreview();
			}
		} );
	}

	/**
	 * Generate live preview CSS from current form values.
	 */
	function updateLivePreview() {
		var $style = $( '#slashed-live-preview' );
		if ( ! $style.length ) {
			return;
		}

		var declarations = [];

		// Resolve active color value per row: prefer the raw input when
		// it has content, otherwise use the HEX input. Mirrors what the
		// PHP sanitiser does on save, so the preview always matches.
		function resolveColor( baseKey ) {
			var raw = $( '#' + baseKey + '_raw' ).val();
			if ( raw && raw.length ) {
				return raw;
			}
			var hex = $( '#' + baseKey + '_hex' ).val();
			return hex && hex.length ? hex : '';
		}

		// Collect color values.
		var brandColors = [ 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base' ];
		var statusColors = [ 'success', 'warning', 'error', 'info', 'danger' ];

		brandColors.forEach( function( color ) {
			var val = resolveColor( 'brand_' + color );
			if ( val ) {
				declarations.push( '--sf-color-' + color + '-light: ' + val );
			}
		} );

		statusColors.forEach( function( color ) {
			var val = resolveColor( 'status_' + color );
			if ( val ) {
				declarations.push( '--sf-color-' + color + '-light: ' + val );
			}
		} );

		// Collect typography values.
		var fontStacks = [ 'body', 'heading', 'mono', 'display', 'humanist', 'geometric', 'slab' ];
		fontStacks.forEach( function( name ) {
			var val = $( '#font_' + name ).val();
			if ( val ) {
				declarations.push( '--sf-font-' + name + ': ' + val );
			}
		} );

		// Scale multipliers.
		var textScale = $( '#text_scale' ).val();
		if ( textScale ) {
			declarations.push( '--sf-text-scale: ' + textScale );
		}

		var displayScale = $( '#text_display_scale' ).val();
		if ( displayScale ) {
			declarations.push( '--sf-text-display-scale: ' + displayScale );
		}

		// Spacing scale.
		var spaceScale = $( '#space_scale' ).val();
		if ( spaceScale ) {
			declarations.push( '--sf-space-scale: ' + spaceScale );
		}

		// Radius scale.
		var radiusScale = $( '#radius_scale' ).val();
		if ( radiusScale ) {
			declarations.push( '--sf-radius-scale: ' + radiusScale );
		}

		// Shadow strength.
		var shadowStrength = $( '#shadow_strength' ).val();
		if ( shadowStrength ) {
			declarations.push( '--sf-shadow-strength: ' + shadowStrength );
		}

		// Motion scale.
		var motionScale = $( '#motion_scale' ).val();
		if ( motionScale ) {
			declarations.push( '--sf-motion-scale: ' + motionScale );
		}

		// Durations.
		var durations = [ 'instant', 'fast', 'normal', 'slow', 'slower' ];
		durations.forEach( function( name ) {
			var val = $( '#duration_' + name ).val();
			if ( val ) {
				declarations.push( '--sf-duration-' + name + ': calc(' + val + 'ms * var(--sf-motion-scale))' );
			}
		} );

		// Z-index.
		var zLevels = [ 'below', 'base', 'raised', 'low', 'mid', 'high', 'top', 'max' ];
		zLevels.forEach( function( name ) {
			var val = $( '#z_' + name ).val();
			if ( val ) {
				declarations.push( '--sf-z-' + name + ': ' + parseInt( val, 10 ) );
			}
		} );

		// Contrast tab knobs (numeric, no unit).
		[ 'contrast_bias', 'contrast_threshold', 'opacity_disabled' ].forEach( function( key ) {
			var val = $( '#' + key ).val();
			if ( val !== undefined && val !== '' ) {
				declarations.push( '--sf-' + key.replace( /_/g, '-' ) + ': ' + val );
			}
		} );

		// Focus ring metrics (px-suffixed).
		[ 'focus_ring_width', 'focus_ring_offset' ].forEach( function( key ) {
			var val = $( '#' + key ).val();
			if ( val !== undefined && val !== '' ) {
				declarations.push( '--sf-' + key.replace( /_/g, '-' ) + ': ' + val + 'px' );
			}
		} );

		// Focus ring style (enum).
		var ringStyle = $( '#focus_ring_style' ).val();
		if ( ringStyle ) {
			declarations.push( '--sf-focus-ring-style: ' + ringStyle );
		}

		// Build CSS string.
		var css = '';
		if ( declarations.length ) {
			css = '.slashed-preview-panel {\n';
			declarations.forEach( function( decl ) {
				css += '\t' + decl + ';\n';
			} );
			css += '}\n';
		}

		$style.text( css );
	}

	/**
	 * Mark the form as having unsaved changes.
	 */
	function markDirty() {
		if ( ! isDirty ) {
			isDirty = true;
			$( 'form' ).closest( '.wrap' ).addClass( 'slashed-form-dirty' );
		}
	}

	/**
	 * Initialize form dirty state tracking.
	 */
	function initDirtyTracking() {
		$( '.slashed-tab-content' ).on( 'input change', 'input, select, textarea', function() {
			markDirty();
			updateLivePreview();
		} );

		$( window ).on( 'beforeunload', function() {
			if ( isDirty ) {
				return 'You have unsaved changes. Are you sure you want to leave?';
			}
		} );

		// Clear dirty state on form submit (save).
		$( 'form' ).on( 'submit', function() {
			isDirty = false;
		} );
	}

	/**
	 * Enhanced reset section confirmation dialog.
	 */
	function initResetConfirmation() {
		$( document ).on( 'click', '.slashed-reset-btn', function( e ) {
			var sectionName = $( this ).data( 'section-name' ) || 'this section';
			var confirmed = window.confirm(
				'Are you sure you want to reset "' + sectionName + '" to default values?\n\nThis cannot be undone.'
			);

			if ( ! confirmed ) {
				e.preventDefault();
				return false;
			}

			isDirty = false;
		} );

		$( document ).on( 'click', '.slashed-reset-all-btn', function( e ) {
			var confirmed = window.confirm(
				'Are you sure you want to reset ALL settings to defaults?\n\nAll customizations will be lost. This cannot be undone.'
			);

			if ( ! confirmed ) {
				e.preventDefault();
				return false;
			}

			isDirty = false;
		} );
	}

	/**
	 * Initialize all admin page functionality.
	 */
	$( document ).ready( function() {
		initTabPersistence();
		initColorPickers();
		initRangeSync();
		initDirtyTracking();
		initResetConfirmation();

		// Initial preview render.
		updateLivePreview();
	} );

} )( jQuery );
