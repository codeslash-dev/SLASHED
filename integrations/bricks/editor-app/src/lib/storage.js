/**
 * Validated localStorage prefs for the reBEMer panel.
 *
 * Schema-validates on read and write so a tampered or stale value
 * cannot silently change behavior — any malformed prefs fall back to
 * defaults. Failures of localStorage itself (Safari private mode,
 * quota errors) are swallowed because losing a UI preference is
 * always preferable to crashing the panel.
 *
 * @module storage
 */

const KEY = 'slashed.rebemer.prefs';

const VALID_MODES = new Set(['add', 'rename', 'replace', 'modifier', 'migrate']);

/**
 * @typedef {Object} Prefs
 * @property {boolean} syncLabels
 * @property {boolean} showModifiers
 * @property {'add'|'rename'|'replace'|'modifier'|'migrate'} lastMode
 */

/** @returns {Prefs} */
export function defaultPrefs() {
  return { syncLabels: true, showModifiers: false, lastMode: 'add' };
}

function validate(raw) {
  const def = defaultPrefs();
  if (!raw || typeof raw !== 'object') return def;
  return {
    syncLabels: typeof raw.syncLabels === 'boolean' ? raw.syncLabels : def.syncLabels,
    showModifiers:
      typeof raw.showModifiers === 'boolean' ? raw.showModifiers : def.showModifiers,
    lastMode:
      typeof raw.lastMode === 'string' && VALID_MODES.has(raw.lastMode)
        ? raw.lastMode
        : def.lastMode,
  };
}

/** @returns {Prefs} */
export function getPrefs() {
  try {
    const ls = globalThis.localStorage;
    if (!ls) return defaultPrefs();
    const raw = ls.getItem(KEY);
    if (!raw) return defaultPrefs();
    return validate(JSON.parse(raw));
  } catch {
    return defaultPrefs();
  }
}

/** @param {Prefs} prefs */
export function setPrefs(prefs) {
  try {
    const ls = globalThis.localStorage;
    if (!ls) return;
    ls.setItem(KEY, JSON.stringify(validate(prefs)));
  } catch {
    /* swallow: losing a UI pref beats crashing */
  }
}
