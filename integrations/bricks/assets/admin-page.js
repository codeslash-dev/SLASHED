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
	 * Initialize WordPress color pickers on .slashed-color-field inputs.
	 *
	 * Note: Since SLASHED uses oklch() color values, the WordPress color picker
	 * serves as a visual reference and inspiration palette. The actual saved value
	 * is the oklch() string entered in the text input.
	 */
	function initColorPickers() {
		if ( ! $.fn.wpColorPicker ) {
			return;
		}

		var palette = [
			'#4338ca', // primary-ish
			'#1e293b', // secondary-ish
			'#7c3aed', // tertiary-ish
			'#0891b2', // action-ish
			'#64748b', // neutral-ish
			'#16a34a', // success-ish
			'#eab308', // warning-ish
			'#dc2626'  // error-ish
		];

		$( '.slashed-color-field' ).each( function() {
			var $input = $( this );

			// Create a visual color reference picker alongside the text input.
			var $pickerEl = $( '<input type="text" class="slashed-color-picker-visual">' );
			$pickerEl.insertAfter( $input );

			$pickerEl.wpColorPicker( {
				palettes: palette,
				change: function() {
					// The color picker is for visual reference only.
					// Users should enter oklch() values in the text input.
				},
				clear: function() {}
			} );

			// Add a helper note.
			if ( ! $input.siblings( '.color-note' ).length ) {
				$input.closest( 'td' ).find( '.wp-picker-container' ).after(
					'<span class="color-note">Use oklch() values in the text field. The color picker is for visual reference only.</span>'
				);
			}
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

		// Collect color values.
		var brandColors = [ 'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base' ];
		var statusColors = [ 'success', 'warning', 'error', 'info', 'danger' ];

		brandColors.forEach( function( color ) {
			var val = $( '#brand_' + color ).val();
			if ( val ) {
				declarations.push( '--sf-color-' + color + '-light: ' + val );
			}
		} );

		statusColors.forEach( function( color ) {
			var val = $( '#status_' + color ).val();
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
