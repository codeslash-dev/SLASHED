/**
 * Centralized reactive state for the admin SPA.
 *
 * Svelte 5 runes ($state) make module-level state reactive when the
 * file ends in .svelte.js. Components that read `tokens.colors.brand_primary`
 * automatically re-render when it changes, and the live-preview derived
 * CSS recomputes for free.
 *
 * Hydrated once at module load from window.slashedBricksApp. The shape
 * mirrors the `slashed_bricks_tokens` wp_option exactly:
 *
 *   tokens.<section>.<key> = string
 *
 * For colors, the merged key (e.g. `brand_primary`) holds whichever of
 * hex / raw the user last set - same as PHP's sanitize_color_section
 * already produces. The ColorRow component owns the hex/raw split locally
 * so the store stays a flat key-value map.
 */

const bootstrap = typeof window !== 'undefined' && window.slashedBricksApp
  ? window.slashedBricksApp
  : { defaults: {}, settings: {}, tabs: {}, rest: { url: '', nonce: '' } };

/** Read-only metadata: factory defaults, available tabs, REST handshake. */
export const meta = {
  defaults: bootstrap.defaults || {},
  tabs: bootstrap.tabs || {},
  rest: bootstrap.rest || { url: '', nonce: '' },
};

/** Reactive token state. Mutating any nested key triggers re-renders. */
export const tokens = $state(structuredClone(bootstrap.settings || {}));

/** Reactive UI state: active tab, dirty flag, save status, last error. */
export const ui = $state({
  activeTab: firstTabSlug(meta.tabs) || 'colors',
  dirty: false,
  saving: false,
  lastSavedAt: null,
  error: '',
});

function firstTabSlug(tabs) {
  for (const slug in tabs) return slug;
  return null;
}

/**
 * Mark the form dirty. Called from any component on input.
 * Idempotent; cheap to call on every keystroke.
 */
export function markDirty() {
  ui.dirty = true;
  ui.error = '';
}

/**
 * Drop a section's local overrides so PHP defaults take over again
 * the next time the page is loaded or saved.
 *
 * Does NOT mark dirty — callers own the dirty/clean transition so the
 * reset handler can set dirty=false immediately after without a flicker.
 */
export function clearSection(section) {
  if (tokens[section]) {
    delete tokens[section];
  }
}
