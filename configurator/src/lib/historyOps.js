/**
 * Pure-JS algorithms for the override store.
 *
 * Splitting the logic out of `store.svelte.js` (which is wrapped in Svelte 5
 * `$state` runes that only exist inside the Svelte compile pipeline) lets the
 * same code be unit-tested under `node --test` against plain object stores.
 *
 * Each function takes the live `overrides` and `history` objects by
 * reference and mutates them in place. The store layer sets up the runes,
 * provides a `persist()` callback, and calls into here.
 *
 *   • `setOne(state, name, value)` — single-token edit
 *   • `clearOne(state, name)` — drop a single override
 *   • `clearEvery(state)` — drop every override (one history step)
 *   • `replaceAll(state, map, isKnown)` — full replacement (CSS import)
 *   • `patchMany(state, patch, isKnown)` — bulk edit (one history step)
 *   • `applyThemeToState(state, presetMap)` — wipe + replace (one step)
 *   • `undoStep(state)` / `redoStep(state)` — walk the history stack
 *
 * `state` shape: `{ overrides, history: { past, future }, sanitize, persist, isKnown, limit }`.
 */

/**
 * Build a snapshot of the current overrides (stable JSON for compare + size cap).
 * @param {Record<string,string>} overrides
 */
export function snapshot(overrides) {
  return JSON.stringify(overrides);
}

/**
 * Restore a snapshot into the live override map (in place, so the proxy stays
 * the same object identity).
 * @param {Record<string,string>} overrides
 * @param {string} snap
 */
export function restore(overrides, snap) {
  let next = {};
  try { next = JSON.parse(snap) || {}; } catch { /* ignore */ }
  for (const k of Object.keys(overrides)) delete overrides[k];
  for (const [k, v] of Object.entries(next)) overrides[k] = v;
}

/**
 * Push a checkpoint onto the past stack; drops the redo branch.
 * @param {{ overrides:Record<string,string>, history:{past:string[],future:string[]}, limit:number }} s
 */
export function checkpoint(s) {
  const snap = snapshot(s.overrides);
  // Don't store no-ops (back-to-back identical snapshots).
  if (s.history.past.length && s.history.past[s.history.past.length - 1] === snap) return;
  s.history.past.push(snap);
  if (s.history.past.length > s.limit) s.history.past.shift();
  if (s.history.future.length) s.history.future.length = 0;
}

/** Undo one step. Returns true if anything was undone. */
export function undoStep(s) {
  if (!s.history.past.length) return false;
  const current = snapshot(s.overrides);
  const prev = s.history.past.pop();
  s.history.future.push(current);
  if (s.history.future.length > s.limit) s.history.future.shift();
  restore(s.overrides, prev);
  s.persist?.();
  return true;
}

/** Redo one step. Returns true if anything was redone. */
export function redoStep(s) {
  if (!s.history.future.length) return false;
  const current = snapshot(s.overrides);
  const next = s.history.future.pop();
  s.history.past.push(current);
  if (s.history.past.length > s.limit) s.history.past.shift();
  restore(s.overrides, next);
  s.persist?.();
  return true;
}

/**
 * Set or clear a single token override. An empty/whitespace value (after
 * sanitisation) clears it.
 *
 * @param {{ overrides:Record<string,string>, history:any, limit:number, sanitize:(v:string)=>string, persist?:()=>void }} s
 * @param {string} name
 * @param {string} value
 */
export function setOne(s, name, value) {
  const safe = s.sanitize(value);
  if (safe === '') {
    if (!(name in s.overrides)) return false;
    checkpoint(s);
    delete s.overrides[name];
  } else {
    if (s.overrides[name] === safe) return false; // no-op
    checkpoint(s);
    s.overrides[name] = safe;
  }
  s.persist?.();
  return true;
}

/** Drop a single override. */
export function clearOne(s, name) {
  if (!(name in s.overrides)) return false;
  checkpoint(s);
  delete s.overrides[name];
  s.persist?.();
  return true;
}

/** Drop every override (one history step). */
export function clearEvery(s) {
  if (!Object.keys(s.overrides).length) return false;
  checkpoint(s);
  for (const k of Object.keys(s.overrides)) delete s.overrides[k];
  s.persist?.();
  return true;
}

/**
 * Replace the entire override set (used by CSS import). Unknown token names
 * (rejected by `isKnown`) are dropped so a stale paste can't poison the
 * catalogue.
 *
 * @returns {{ applied: number, skipped: string[] }}
 */
export function replaceAll(s, map) {
  checkpoint(s);
  for (const k of Object.keys(s.overrides)) delete s.overrides[k];
  let applied = 0;
  const skipped = [];
  for (const [name, value] of Object.entries(map || {})) {
    const safe = s.sanitize(value);
    if (s.isKnown(name) && safe !== '') {
      s.overrides[name] = safe;
      applied += 1;
    } else {
      skipped.push(name);
    }
  }
  s.persist?.();
  return { applied, skipped };
}

/**
 * Bulk-set many tokens in a SINGLE history step. Pass `null` (or an empty
 * string) as a value to clear that token.
 *
 * Returns the count of tokens that actually changed; if nothing changed,
 * the history is left untouched.
 *
 * @param {Record<string, string|null>} patch
 */
export function patchMany(s, patch) {
  if (!patch) return 0;
  let changed = 0;
  const planned = [];
  for (const [name, raw] of Object.entries(patch)) {
    if (!s.isKnown(name)) continue;
    const safe = raw == null ? '' : s.sanitize(raw);
    const had = name in s.overrides;
    if (safe === '' && !had) continue;
    if (safe !== '' && s.overrides[name] === safe) continue;
    planned.push({ name, safe });
    changed += 1;
  }
  if (!changed) return 0;
  checkpoint(s);
  for (const { name, safe } of planned) {
    if (safe === '') delete s.overrides[name];
    else s.overrides[name] = safe;
  }
  s.persist?.();
  return changed;
}

/**
 * Wipe the override store and replace it with the (already sanitised) preset
 * map, in a single history step.
 *
 * @param {Record<string,string>} sanitisedMap output of themes.sanitisePreset()
 */
export function applyThemeToState(s, sanitisedMap) {
  checkpoint(s);
  for (const k of Object.keys(s.overrides)) delete s.overrides[k];
  for (const [k, v] of Object.entries(sanitisedMap || {})) s.overrides[k] = v;
  s.persist?.();
}
