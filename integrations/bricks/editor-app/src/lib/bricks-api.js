/**
 * The single seam to Bricks Builder internals.
 *
 * Every reach into __vue_app__ or any other private Bricks surface
 * lives in this file. If Bricks restructures internals in a future
 * release, this is the only file that should need editing — every
 * other reBEMer module talks to Bricks through the contract this
 * module exports.
 *
 * Contract (consumed by plan.applyPlan and App.svelte):
 *   probe()                                  → boolean
 *   isReady()                                → boolean
 *   findElement(id)                          → element | null
 *   getSubtree(rootId)                       → Array<{id, depth, label, settings}>
 *   getGlobalClasses()                       → Array
 *   upsertGlobalClass({name, seedSettings})  → classId
 *   setElementClasses(id, classIds)          → void
 *   setElementLabel(id, label)               → void
 *   mutateElementSettings(id, fn)            → void
 *   snapshot(operations)                     → opaque snapshot
 *   restore(snapshot)                        → void
 *   getApi()                                 → bound contract object
 *
 * @module bricks-api
 */

import { newClassId } from './ids.js';

const APP_SELECTOR = '[data-v-app]';
const ELEMENT_AREAS = Object.freeze(['header', 'content', 'footer']);

let _state = null;

/**
 * Probe for the Bricks Vue app + state. Returns true on success, false
 * when the expected shape is missing — in which case callers MUST
 * refuse to inject UI rather than mutating an unknown structure.
 *
 * Re-callable: a later probe() that succeeds replaces an earlier null.
 *
 * @returns {boolean}
 */
export function probe() {
  if (typeof document === 'undefined') return false;
  const app = document.querySelector(APP_SELECTOR);
  const candidate = app && app.__vue_app__ && app.__vue_app__.config
    ? app.__vue_app__.config.globalProperties && app.__vue_app__.config.globalProperties.$_state
    : null;

  if (!candidate || typeof candidate !== 'object') {
    _state = null;
    return false;
  }

  // Sanity-check the surface we depend on. Bricks may rename internals
  // in a future major; failing here is the breadcrumb that tells us so.
  if (!Array.isArray(candidate.globalClasses)) {
    _state = null;
    return false;
  }

  _state = candidate;
  return true;
}

/** @returns {boolean} */
export function isReady() {
  return _state !== null;
}

/** @returns {object|null} */
export function getState() {
  return _state;
}

/** @returns {Array} */
export function getGlobalClasses() {
  return _state ? _state.globalClasses : [];
}

/**
 * @param {string} id
 * @returns {object|null}
 */
export function findElement(id) {
  if (!_state || typeof id !== 'string' || id.length === 0) return null;
  for (const area of ELEMENT_AREAS) {
    const list = _state[area];
    if (!Array.isArray(list)) continue;
    const found = list.find((el) => el && el.id === id);
    if (found) return found;
  }
  return null;
}

/**
 * Build the [{id, depth, label, settings}, ...] subtree array that
 * plan.buildPlan consumes. Depth is 0 for the root, +1 per step down.
 *
 * @param {string} rootId
 * @returns {Array<{id:string, depth:number, label:string|undefined, settings:object|undefined}>}
 */
export function getSubtree(rootId) {
  const root = findElement(rootId);
  if (!root) return [];
  const out = [{ id: root.id, depth: 0, label: root.label, settings: root.settings }];
  walk(root, 1, out);
  return out;
}


function walk(node, depth, out) {
  if (!node || !Array.isArray(node.children)) return;
  for (const childId of node.children) {
    const child = findElement(childId);
    if (!child) continue;
    out.push({ id: child.id, depth, label: child.label, settings: child.settings });
    walk(child, depth + 1, out);
  }
}

/**
 * Find an existing global class by name, or create a new one when no
 * match is found. Returns the class id either way. Settings on an
 * existing match are NEVER overwritten — that is the whole point of
 * preferExisting=true; same-name collisions are surfaced separately
 * by the preflight endpoint so the user is warned in advance.
 *
 * @param {{name:string, seedSettings?:object, preferExisting?:boolean}} upsert
 * @returns {string} classId
 */
export function upsertGlobalClass(upsert) {
  if (!_state) throw new Error('rebemer:not_ready');
  if (!upsert || typeof upsert.name !== 'string' || upsert.name.length === 0) {
    throw new Error('rebemer:invalid_upsert');
  }

  const list = _state.globalClasses;
  const existing = list.find((c) => c && c.name === upsert.name);
  if (existing) return existing.id;

  const knownIds = new Set(list.map((c) => (c && c.id) || '').filter(Boolean));
  const id = newClassId(knownIds);
  const seed = upsert.seedSettings && typeof upsert.seedSettings === 'object'
    ? clone(upsert.seedSettings)
    : {};
  list.push({ id, name: upsert.name, settings: seed });
  return id;
}

/**
 * Replace the element's _cssGlobalClasses list with the given ids.
 * In-place splice is preferred for array-shaped storage so Vue's
 * reactive proxy keeps tracking the same reference.
 */
export function setElementClasses(id, classIds) {
  const el = findElement(id);
  if (!el) throw new Error(`rebemer:element_missing:${id}`);
  if (!el.settings) el.settings = {};
  const next = Array.isArray(classIds) ? classIds.slice() : [];
  if (Array.isArray(el.settings._cssGlobalClasses)) {
    el.settings._cssGlobalClasses.splice(0, el.settings._cssGlobalClasses.length, ...next);
  } else {
    el.settings._cssGlobalClasses = next;
  }
}


/** Set element.label. Used by plan when syncLabels is enabled. */
export function setElementLabel(id, label) {
  const el = findElement(id);
  if (!el) throw new Error(`rebemer:element_missing:${id}`);
  el.label = label;
}

/**
 * Run an arbitrary mutator against an element's settings object,
 * giving plan.js a single primitive to delete migrated keys without
 * each caller re-finding the element.
 *
 * @param {string} id
 * @param {(settings: object) => void} fn
 */
export function mutateElementSettings(id, fn) {
  const el = findElement(id);
  if (!el) throw new Error(`rebemer:element_missing:${id}`);
  if (!el.settings) el.settings = {};
  fn(el.settings);
}

/**
 * Capture a snapshot covering every element that the given operations
 * will touch, plus the full globalClasses array (so any newly-created
 * classes can be reverted by re-asserting the original list).
 *
 * @param {Array<{elementId:string}>} operations
 * @returns {{globalClasses:Array, elements:Array<{id:string, settings:object, label:any}>}}
 */
export function snapshot(operations) {
  if (!_state) throw new Error('rebemer:not_ready');
  const elemSnaps = [];
  for (const op of operations || []) {
    const el = findElement(op && op.elementId);
    if (!el) continue;
    elemSnaps.push({
      id: el.id,
      settings: clone(el.settings || {}),
      label: el.label,
    });
  }
  return {
    globalClasses: clone(_state.globalClasses),
    elements: elemSnaps,
  };
}


/**
 * Restore from a snapshot. Done in-place where possible: array splice
 * for globalClasses keeps Vue's reactive proxy on the same reference,
 * and reassigning element.settings/label is sufficient because Bricks
 * tracks those via the parent element's reactive proxy.
 *
 * @param {{globalClasses:Array, elements:Array}} snap
 */
export function restore(snap) {
  if (!_state || !snap) return;

  if (Array.isArray(snap.globalClasses)) {
    _state.globalClasses.splice(0, _state.globalClasses.length, ...snap.globalClasses);
  }

  if (Array.isArray(snap.elements)) {
    for (const s of snap.elements) {
      const el = findElement(s.id);
      if (!el) continue;
      el.settings = s.settings;
      el.label = s.label;
    }
  }
}

/**
 * Get a contract object bound to the current state. Pass this to
 * plan.applyPlan so callers don't have to import every primitive
 * individually.
 */
export function getApi() {
  return {
    findElement,
    getSubtree,
    getGlobalClasses,
    upsertGlobalClass,
    setElementClasses,
    setElementLabel,
    mutateElementSettings,
    snapshot,
    restore,
  };
}

function clone(v) {
  if (typeof structuredClone === 'function') return structuredClone(v);
  return JSON.parse(JSON.stringify(v));
}

/**
 * Test-only helper: install a fake state so unit tests can exercise
 * the seam without a real Bricks builder. Not exported in production
 * builds — Vite tree-shakes this when the import is unused.
 *
 * @param {object|null} fakeState
 */
export function __setStateForTests(fakeState) {
  _state = fakeState || null;
}
