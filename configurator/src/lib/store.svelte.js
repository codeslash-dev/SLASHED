/**
 * Centralized reactive state for the configurator (Svelte 5 runes).
 *
 * Module-level `$state` in a `.svelte.js` file is reactive across every
 * component that imports it, so the override map, the live filters, and the
 * derived CSS output all stay in sync without prop-drilling or an event bus.
 */
import { allTokens, tokenByName } from './model.js';
import { sanitizeValue } from './css.js';

const STORAGE_KEY = 'slashed-configurator/overrides/v1';

/**
 * Override map: token name -> user value (string). Only customised tokens
 * live here; an absent key means "use the framework default".
 * @type {Record<string, string>}
 */
export const overrides = $state(loadOverrides());

/**
 * Persistence health. `ok` flips to false if a localStorage write fails
 * (quota exceeded, private mode, blocked storage) so the UI can warn the user
 * their work isn't being saved.
 */
export const storage = $state({ ok: true });

/** UI state: search, active category, tier visibility, preview theme. */
export const ui = $state({
  /** Active top-level view: 'tokens' | 'a11y' | 'scales'. */
  view: 'tokens',
  query: '',
  activeCategory: '',
  showAdvanced: true,
  showInternal: false,
  onlyModified: false,
  previewTheme: 'light',
  /** Output framing: 'layer' wraps in @layer slashed.overrides, 'root' is bare :root. */
  outputMode: 'layer',
});

/**
 * Load persisted overrides from localStorage, ignoring malformed data.
 * @returns {Record<string, string>}
 */
function loadOverrides() {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      // Drop keys that are no longer in the (possibly newly-synced) catalogue.
      const clean = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (tokenByName.has(k) && typeof v === 'string') {
          const safe = sanitizeValue(v);
          if (safe !== '') clean[k] = safe;
        }
      }
      return clean;
    }
  } catch {
    /* ignore */
  }
  return {};
}

/**
 * Persist the current overrides. Called after every mutation; cheap enough at
 * this scale and keeps a refresh from losing work.
 */
function persist() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    storage.ok = true;
  } catch {
    // Quota / privacy-mode / blocked storage: keep working in-memory but let
    // the UI surface that persistence is off.
    storage.ok = false;
  }
}

/**
 * Set (or clear) a single token override. An empty/whitespace value removes
 * the override so the framework default takes over again.
 * @param {string} name token custom-property name
 * @param {string} value new value
 */
export function setOverride(name, value) {
  const safe = sanitizeValue(value);
  if (safe === '') {
    delete overrides[name];
  } else {
    overrides[name] = safe;
  }
  persist();
}

/**
 * Remove a single override.
 * @param {string} name
 */
export function clearOverride(name) {
  delete overrides[name];
  persist();
}

/** Remove every override. */
export function clearAll() {
  for (const key of Object.keys(overrides)) delete overrides[key];
  persist();
}

/**
 * Replace the entire override set (used by CSS import). Unknown token names
 * are dropped so a stale paste can't poison the catalogue.
 * @param {Record<string, string>} map token name -> value
 * @returns {{ applied: number, skipped: string[] }}
 */
export function replaceOverrides(map) {
  clearAll();
  let applied = 0;
  const skipped = [];
  for (const [name, value] of Object.entries(map || {})) {
    const safe = sanitizeValue(value);
    if (tokenByName.has(name) && safe !== '') {
      overrides[name] = safe;
      applied += 1;
    } else {
      skipped.push(name);
    }
  }
  persist();
  return { applied, skipped };
}

/** Count of active overrides (non-reactive helper for one-off reads). */
export function overrideCount() {
  return Object.keys(overrides).length;
}

/** All token names (handy for components that need the catalogue length). */
export const tokenCount = allTokens.length;
