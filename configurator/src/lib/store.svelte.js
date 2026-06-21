/**
 * Centralized reactive state for the configurator (Svelte 5 runes).
 *
 * Module-level `$state` in a `.svelte.js` file is reactive across every
 * component that imports it, so the override map, the live filters, and the
 * derived CSS output all stay in sync without prop-drilling or an event bus.
 *
 * The non-reactive ALGORITHMS (history, bulk patch, theme apply) live in
 * the runes-free `./historyOps.js` so they can be tested under `node --test`
 * without a Svelte compile pass.
 */
import { allTokens, tokenByName } from './model.js';
import { sanitizeValue } from './css.js';
import { sanitisePreset, loadSavedThemes, persistSavedThemes, slugify } from './themes.js';
import { sanitiseUiState, UI_STORAGE_KEY } from './uiState.js';
import { readShareFromHash, buildShareUrl } from './share.js';
import * as ops from './historyOps.js';

const STORAGE_KEY = 'slashed-configurator/overrides/v1';
const HISTORY_LIMIT = 50;

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

/** UI state: active domain tab, basic/advanced mode, search, filters, preview. */
const savedUi = loadUiState();
export const ui = $state({
  /**
   * Active domain tab id (see lib/domains.js): 'typography' | 'colors' | …
   * `'home'` is the synthetic Basic-mode landing screen (setup checklist).
   */
  domain: savedUi.domain ?? 'home',
  /** Global complexity mode: 'basic' shows curated essentials, 'advanced' all. */
  mode: savedUi.mode ?? 'basic',
  /** Free-text filter, applied to advanced lists. */
  query: '',
  /** Show the api-index INTERNAL tier (one or two implementation tokens). */
  showInternal: false,
  /** Restrict the advanced list to tokens with an active override. */
  onlyModified: false,
  /**
   * Usage filter for the advanced full-catalogue list.
   * 'all'       — show every token (configure + consume)
   * 'configure' — show only knob tokens (literal values you SET in :root)
   * 'consume'   — show only consumption tokens (derived values you READ in component CSS)
   */
  usageFilter: 'all',
  /** Theme used by the live preview / WCAG probes. */
  previewTheme: 'light',
  /** Motion mode in the preview only — 'normal' or 'reduced' (forces --sf-motion-scale: 0 on the stage). */
  previewMotion: 'normal',
  /**
   * Preview viewport width preset. `'fluid'` lets the stage fill the pane;
   * a numeric pixel string constrains it (320 / 768 / 1024 / 1440 are the
   * common breakpoints the framework's fluid scale was tuned around).
   */
  previewWidth: 'fluid',
  /** Output framing: 'layer' wraps in @layer slashed.overrides, 'root' is bare :root. */
  outputMode: savedUi.outputMode ?? 'layer',
  /** Theme for the configurator chrome itself: 'dark' (default) or 'light'. */
  uiTheme: savedUi.uiTheme ?? 'dark',
  /** Sidebar collapse — for narrow viewports / a focus-mode. */
  sidebarOpen: true,
  /**
   * Right-hand preview pane visible. Initialised from the current viewport so
   * the mobile slide-over never flashes open on first paint (the App.svelte
   * effect only handles subsequent viewport changes).
   */
  previewOpen: typeof window === 'undefined' || !window.matchMedia('(max-width: 1100px)').matches,
  /**
   * Output drawer (override CSS export) expanded. Same viewport-aware
   * initialisation pattern: phones start collapsed so the main area is usable.
   */
  outputOpen: typeof window === 'undefined' || !window.matchMedia('(max-width: 600px)').matches,
});

/**
 * Undo/redo stack. Each entry is a JSON snapshot of the override map taken
 * BEFORE the next mutation; popping the stack reverts to that snapshot.
 *
 * Capped at HISTORY_LIMIT to keep memory bounded — pre-PR oldest entries
 * silently drop off the back.
 *
 * @type {{ past: string[], future: string[] }}
 */
export const history = $state({ past: [], future: [] });

/** Custom themes saved by the user (named slots in localStorage). */
export const savedThemes = $state(loadSavedThemes());

// ───────────────────────────── persistence ────────────────────────────────

/**
 * Load the persisted UI preferences (mode / domain / output format),
 * validated against the live taxonomy. Persisting happens in App.svelte
 * via an $effect over the same three fields.
 * @returns {{ mode?: string, domain?: string, outputMode?: string }}
 */
function loadUiState() {
  if (typeof localStorage === 'undefined') return {};
  try {
    return sanitiseUiState(localStorage.getItem(UI_STORAGE_KEY));
  } catch {
    return {};
  }
}

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

/** Persist the current overrides; flips `storage.ok` if blocked. */
function persist() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    storage.ok = true;
  } catch {
    storage.ok = false;
  }
}

// ── Wiring: a stable bag passed to every historyOps.* call. The runes are
// transparent (the proxy delegates to a plain object), so `historyOps` mutates
// `overrides` and `history` in place and Svelte sees the changes. `_dragSnap`
// is the lazy pre-drag snapshot for the dragSet/endDrag transient flow.
const opsState = {
  get overrides() { return overrides; },
  get history()   { return history; },
  limit: HISTORY_LIMIT,
  sanitize: sanitizeValue,
  isKnown: (name) => tokenByName.has(name),
  persist,
  _dragSnap: null,
};

// ───────────────────────────── history (undo/redo) ─────────────────────────

/** Step backwards: restore the most recent past snapshot. */
export function undo() { return ops.undoStep(opsState); }
/** Step forwards: re-apply the most recent redo snapshot. */
export function redo() { return ops.redoStep(opsState); }

// ───────────────────────────── override mutations ─────────────────────────

/**
 * Set (or clear) a single token override. An empty/whitespace value removes
 * the override so the framework default takes over again.
 * @param {string} name token custom-property name
 * @param {string} value new value
 */
export function setOverride(name, value) { ops.setOne(opsState, name, value); }

/** Remove a single override. */
export function clearOverride(name) { ops.clearOne(opsState, name); }

/** Remove every override. */
export function clearAll() { ops.clearEvery(opsState); }

/**
 * Replace the entire override set (used by CSS import). Unknown token names
 * are dropped so a stale paste can't poison the catalogue.
 * @returns {{ applied: number, skipped: string[] }}
 */
export function replaceOverrides(map) { return ops.replaceAll(opsState, map); }

/**
 * Bulk-set many tokens in a single history step. Pass `null` (or empty
 * string) as a value to clear that token.
 * @param {Record<string, string|null>} patch
 */
export function patchOverrides(patch) { return ops.patchMany(opsState, patch); }

/**
 * Transient slider-drag mutation: updates the live override map (so the
 * preview / contrast badges / slider fill all follow the value in real time)
 * but does NOT push history or persist to storage. Pair with `endDrag()`.
 *
 * @param {string} name
 * @param {string|number} value
 */
export function dragSetOverride(name, value) { ops.dragSet(opsState, name, value); }

/**
 * Commit a pending slider drag: records exactly one undo entry for the whole
 * drag and persists once. Wired to the `<input type=range>` `change` event so
 * mouse releases AND keyboard commits both flush. No-op when no drag is
 * pending or when the value ended up unchanged.
 */
export function endDrag() { return ops.endDrag(opsState); }

// ───────────────────────────── theme presets ──────────────────────────────

/**
 * Apply a theme preset: WIPES current overrides and replaces them with the
 * preset's values, in a single history step.
 *
 * @param {{ overrides: Record<string,string> }} preset
 * @returns {{ applied: number, skipped: string[] }}
 */
export function applyTheme(preset) {
  const { map, applied, skipped } = sanitisePreset(preset?.overrides ?? {});
  ops.applyThemeToState(opsState, map);
  return { applied, skipped };
}

/**
 * Save the current override map as a named user theme, persist it, and add
 * it to the live `savedThemes` array. Existing slots with the same id are
 * overwritten (so saving twice with the same name is an "update").
 *
 * @param {string} name human-readable name
 * @returns {{ id: string, persisted: boolean }}
 */
export function saveCurrentTheme(name) {
  const id = slugify(name);
  const display = String(name || '').trim() || 'Untitled';
  const count = Object.keys(overrides).length;
  const theme = {
    id,
    name: display,
    icon: '⭅',
    blurb: `${count} customised token${count === 1 ? '' : 's'}`,
    overrides: { ...overrides },
  };
  const next = savedThemes.filter((t) => t.id !== id);
  next.push(theme);
  // Replace the array contents in place so the $state reactivity fires.
  savedThemes.length = 0;
  for (const t of next) savedThemes.push(t);
  const persisted = persistSavedThemes(savedThemes);
  return { id, persisted };
}

/**
 * Save an externally-provided theme object (from a JSON import) as a user
 * theme. Does NOT touch the active overrides. Returns { id, persisted }.
 *
 * @param {{ name: string, icon?: string, blurb?: string, overrides: Record<string,string> }} data
 * @returns {{ id: string, persisted: boolean }}
 */
export function saveImportedTheme(data) {
  const id = slugify(data.name);
  const theme = {
    id,
    name: String(data.name || '').trim() || 'Imported theme',
    icon: data.icon ?? '⭅',
    blurb: data.blurb ?? `${Object.keys(data.overrides ?? {}).length} imported tokens`,
    overrides: { ...(data.overrides ?? {}) },
  };
  const next = savedThemes.filter((t) => t.id !== id);
  next.push(theme);
  savedThemes.length = 0;
  for (const t of next) savedThemes.push(t);
  const persisted = persistSavedThemes(savedThemes);
  return { id, persisted };
}

/** Delete a saved theme by id. */
export function deleteSavedTheme(id) {
  const idx = savedThemes.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  savedThemes.splice(idx, 1);
  return persistSavedThemes(savedThemes);
}

// ───────────────────────────── shareable links ────────────────────────────

/**
 * Apply a configuration encoded in the current URL fragment (`#c=…`), if any.
 * Runs as a single undoable history step (via `replaceOverrides`) so a shared
 * link layers cleanly over whatever was restored from localStorage and can be
 * reverted with one Ctrl+Z. No-op (returns 0) when no link config is present.
 *
 * @returns {number} count of tokens applied from the link
 */
export function loadSharedConfig() {
  if (typeof location === 'undefined') return 0;
  const map = readShareFromHash(location.hash);
  if (Object.keys(map).length === 0) return 0;
  const { applied } = replaceOverrides(map);
  return applied;
}

/** Absolute, shareable URL that encodes the current override map. */
export function currentShareUrl() {
  return buildShareUrl(overrides);
}

// ───────────────────────────── helpers ────────────────────────────────────

/**
 * Expand the output drawer and bring it into view. Shared by the header
 * "N customised — Export CSS" pill and the Home checklist shortcut.
 */
export function openOutputDrawer() {
  ui.outputOpen = true;
  if (typeof document === 'undefined') return;
  // The drawer lives at the bottom of the shell — scroll after it expands.
  requestAnimationFrame(() => {
    document.querySelector('.out')?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  });
}

/** Count of active overrides (non-reactive helper for one-off reads). */
export function overrideCount() {
  return Object.keys(overrides).length;
}

/** All token names (handy for components that need the catalogue length). */
export const tokenCount = allTokens.length;
