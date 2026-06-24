/**
 * Lightweight fold-state persistence.
 *
 * Stores open/closed state for every collapsible section across the
 * configurator, keyed by a caller-supplied string (e.g. "typography:gradients"
 * or "generator:type"). State survives page reloads; only the initial value
 * per key is read — subsequent writes are done via setFold().
 *
 * Deliberately outside the Svelte $state system so it can be imported
 * from both .svelte and .js files without a compile pass.
 */
const FOLD_KEY = 'slashed-configurator/fold/v1';

let _state = {};

if (typeof localStorage !== 'undefined') {
  try {
    const raw = localStorage.getItem(FOLD_KEY);
    if (raw) { const parsed = JSON.parse(raw); if (parsed && typeof parsed === 'object') _state = parsed; }
  } catch { /* ignore */ }
}

function _persist() {
  try { localStorage.setItem(FOLD_KEY, JSON.stringify(_state)); } catch { /* ignore */ }
}

/**
 * Read the persisted open state for a section.
 * @param {string} key     Unique section identifier.
 * @param {boolean} [def]  Returned when no stored value exists (default false).
 * @returns {boolean}
 */
export function getFold(key, def = false) {
  return key in _state ? Boolean(_state[key]) : def;
}

/**
 * Persist the open state for a section and update the in-memory cache.
 * @param {string}  key
 * @param {boolean} open
 */
export function setFold(key, open) {
  _state[key] = open;
  _persist();
}
