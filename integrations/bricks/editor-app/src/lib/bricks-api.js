/**
 * Single seam to Bricks Builder internals.
 *
 * Every reach into __vue_app__ lives here. If Bricks restructures
 * internals in a future release, this is the only file that changes.
 *
 * @module bricks-api
 */

const APP_SELECTOR = '[data-v-app]';
const AREAS = ['header', 'content', 'footer'];

let _state = null;

/**
 * Generate a unique 8-char hex id that doesn't collide with existing ids.
 */
function newId(existingIds) {
  const set = existingIds instanceof Set ? existingIds : new Set(existingIds || []);
  for (let i = 0; i < 16; i++) {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
    if (!set.has(id)) return id;
  }
  throw new Error('rebemer: id collision exhausted');
}

/** Probe for the Bricks Vue app. Returns true on success. */
export function probe() {
  if (typeof document === 'undefined') return false;
  const app = document.querySelector(APP_SELECTOR);
  const candidate = app?.__vue_app__?.config?.globalProperties?.$_state;
  if (!candidate || typeof candidate !== 'object' || !Array.isArray(candidate.globalClasses)) {
    _state = null;
    return false;
  }
  _state = candidate;
  return true;
}

export function isReady() { return _state !== null; }

export function findElement(id) {
  if (!_state || !id) return null;
  for (const area of AREAS) {
    const list = _state[area];
    if (!Array.isArray(list)) continue;
    const found = list.find(el => el && el.id === id);
    if (found) return found;
  }
  return null;
}

/**
 * Build flat subtree array: [{id, depth, label, name, settings}, ...].
 *
 * `name` here is the Bricks element type slug (e.g. 'heading', 'image',
 * 'section') — the same field the Bricks builder uses to look up
 * which element class to instantiate. We expose it so the editor app
 * can pre-fill row names from element type via `lib/element-types.js`.
 */
export function getSubtree(rootId) {
  const root = findElement(rootId);
  if (!root) return [];
  const out = [{
    id: root.id,
    depth: 0,
    label: root.label,
    name: root.name,
    settings: root.settings,
  }];
  walk(root, 1, out);
  return out;
}

function walk(node, depth, out) {
  if (!node || !Array.isArray(node.children)) return;
  for (const childId of node.children) {
    const child = findElement(childId);
    if (!child) continue;
    out.push({
      id: child.id,
      depth,
      label: child.label,
      name: child.name,
      settings: child.settings,
    });
    walk(child, depth + 1, out);
  }
}

export function getGlobalClasses() {
  return _state ? _state.globalClasses : [];
}

/**
 * Find existing class by name or create a new one. Returns class id.
 * Never overwrites an existing class's settings.
 */
export function upsertGlobalClass(name, seedSettings) {
  if (!_state) throw new Error('rebemer: not ready');
  const list = _state.globalClasses;
  const existing = list.find(c => c && c.name === name);
  if (existing) return existing.id;

  const knownIds = new Set(list.map(c => c?.id).filter(Boolean));
  const id = newId(knownIds);
  list.push({ id, name, settings: seedSettings || {} });
  return id;
}

/** Replace element's _cssGlobalClasses in-place (keeps Vue reactivity). */
export function setElementClasses(id, classIds) {
  const el = findElement(id);
  if (!el) return;
  if (!el.settings) el.settings = {};
  const next = Array.isArray(classIds) ? classIds : [];
  if (Array.isArray(el.settings._cssGlobalClasses)) {
    el.settings._cssGlobalClasses.splice(0, el.settings._cssGlobalClasses.length, ...next);
  } else {
    el.settings._cssGlobalClasses = [...next];
  }
}

/** Set element label (shown in structure panel). */
export function setElementLabel(id, label) {
  const el = findElement(id);
  if (el) el.label = label;
}
