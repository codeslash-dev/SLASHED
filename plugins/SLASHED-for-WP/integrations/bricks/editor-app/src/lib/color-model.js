/**
 * Color System model — pure, DOM-free, unit-tested.
 *
 * Turns the flat inventory localised by class-rebemer-enqueue.php
 * (`colorPanel.variables` + `colorPanel.light` / `colorPanel.dark` hex maps)
 * into the ordered, grouped model the ColorPanel renders.
 *
 * Why a model layer:
 *   - The inventory is a flat list of ~275 `--sf-color-*` names with no
 *     inherent grouping. Rendering it raw would be a wall of swatches.
 *   - The framework organises colour by *family* (the six brand families and
 *     five status families) and, within each, by *kind*: a base swatch, a
 *     numeric tint/shade scale (50–950), translucent alpha steps (a5–a95),
 *     and named semantic aliases (hover, subtle, …). Everything that isn't a
 *     family token (text, bg, border, link, …) collects into one "Semantic"
 *     group. This mirrors `class-colors.php`'s server-side grouping so the
 *     two stay conceptually aligned.
 *   - Each swatch carries BOTH its light and dark hex so the panel can show
 *     the adaptive pair at a glance — the differentiator over a single-mode
 *     palette browser.
 *
 * Everything here is data-shaping only; no Bricks, no DOM. The DOM/Bricks
 * glue lives in the Svelte components and bricks-api.js.
 *
 * @module color-model
 */

const PREFIX = '--sf-color-';

/** Brand families, in canonical display order. */
export const BRAND_FAMILIES = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];

/** Status families, in canonical display order. */
export const STATUS_FAMILIES = ['success', 'warning', 'error', 'info', 'danger'];

/** Numeric scale steps, light → dark. */
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** Alpha steps, most → least transparent. */
const ALPHA_STEPS = ['a5', 'a10', 'a20', 'a30', 'a40', 'a50', 'a60', 'a70', 'a80', 'a90', 'a95'];

/** Named semantic aliases, ordered light → dark → translucent. */
const ALIAS_ORDER = [
  'superlight', 'xlight', 'lighter', 'darker', 'xdark', 'superdark',
  'hover', 'active', 'strong', 'subtle', 'muted', 'ghost',
];

/**
 * Preferred ordering for the catch-all "Semantic" group. Tokens whose key
 * starts with one of these prefixes sort in this order; anything else falls
 * to the end, alphabetically. Keeps the most-reached-for page tokens (text,
 * surfaces, borders, links) at the top.
 */
const SEMANTIC_PREFIX_ORDER = [
  'text', 'heading', 'bg', 'surface', 'well', 'raised', 'overlay', 'inverse',
  'border', 'link', 'code', 'selection', 'mark', 'dim',
];

const SET = (arr) => new Set(arr);
const ALL_FAMILIES = SET([...BRAND_FAMILIES, ...STATUS_FAMILIES]);

/**
 * Classify a single `--sf-color-*` variable.
 *
 * Pure. Returns the structured descriptor used to bucket the token into its
 * family + section, or null for anything that isn't a colour token we render
 * (e.g. `--sf-color-scheme`, or a `-light` source duplicate of its base).
 *
 * @param {string} varName e.g. "--sf-color-primary-50" or "--sf-color-text--muted".
 * @returns {{ family: string, kind: 'base'|'scale'|'alpha'|'alias'|'semantic', step: (number|string|null), key: string } | null}
 */
export function classifyVar(varName) {
  if (typeof varName !== 'string' || varName.indexOf(PREFIX) !== 0) return null;

  const key = varName.slice(PREFIX.length);
  if (!key) return null;

  // Non-colour token that shares the namespace.
  if (key === 'scheme') return null;

  const firstDash = key.indexOf('-');
  const family = firstDash === -1 ? key : key.slice(0, firstDash);

  if (!ALL_FAMILIES.has(family)) {
    // Everything that isn't a brand/status family is a page-level semantic
    // token (text, bg, border, link, …).
    return { family: 'semantic', kind: 'semantic', step: null, key };
  }

  const suffix = firstDash === -1 ? '' : key.slice(firstDash + 1);

  if (suffix === '') {
    return { family, kind: 'base', step: null, key };
  }

  // The `-light` source token duplicates the base swatch — skip to avoid a
  // visual dupe (the base swatch already represents the resolved colour).
  if (suffix === 'light') return null;

  if (/^[0-9]+$/.test(suffix)) {
    return { family, kind: 'scale', step: Number(suffix), key };
  }
  if (/^a[0-9]+$/.test(suffix)) {
    return { family, kind: 'alpha', step: suffix, key };
  }
  return { family, kind: 'alias', step: suffix, key };
}

/**
 * Whether a token is translucent (its swatch needs a checkerboard underlay).
 *
 * @param {{ kind: string, key: string }} info
 * @returns {boolean}
 */
function isTranslucent(info) {
  if (info.kind === 'alpha') return true;
  // Named alpha-ish aliases and semantic overlays that resolve to a
  // translucent value in the framework.
  return /(?:^|-)(?:subtle|muted|ghost|translucent|overlay|dim|underline)$/.test(info.key);
}

/**
 * Human label for a swatch, given its classification.
 *
 * @param {{ family: string, kind: string, step: (number|string|null), key: string }} info
 * @returns {string}
 */
export function swatchLabel(info) {
  switch (info.kind) {
    case 'base':
      return capitalize(info.family);
    case 'scale':
      return String(info.step);
    case 'alpha':
      return String(info.step).toUpperCase();
    case 'alias':
      return capitalize(String(info.step));
    case 'semantic':
    default:
      return humanizeKey(info.key);
  }
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * Humanize a full token key for the semantic group.
 *   "text--secondary" → "Text · Secondary"
 *   "border--subtle"  → "Border · Subtle"
 *   "bg--hover"        → "Bg · Hover"
 */
function humanizeKey(key) {
  const parts = key.split('--');
  return parts
    .map((p) => p.split('-').map(capitalize).join(' '))
    .join(' · ');
}

/**
 * Build one swatch descriptor.
 *
 * @param {string} varName
 * @param {object} info classification
 * @param {Record<string,string>} light
 * @param {Record<string,string>} dark
 * @returns {{ var: string, name: string, label: string, light: string, dark: string, alpha: boolean } | null}
 */
function buildSwatch(varName, info, light, dark) {
  const l = light[varName];
  if (typeof l !== 'string' || !l) return null; // no preview value → skip
  const d = (typeof dark[varName] === 'string' && dark[varName]) ? dark[varName] : l;
  return {
    var: varName,
    name: varName.slice(2), // drop the leading "--" for display ("sf-color-…")
    label: swatchLabel(info),
    light: l,
    dark: d,
    alpha: isTranslucent(info),
  };
}

/**
 * Section sort comparator within a family.
 */
function compareInFamily(a, b) {
  // base first, then scale (numeric), then alias (curated), then alpha.
  const rank = { base: 0, scale: 1, alias: 2, alpha: 3 };
  if (rank[a.info.kind] !== rank[b.info.kind]) return rank[a.info.kind] - rank[b.info.kind];
  if (a.info.kind === 'scale') return a.info.step - b.info.step;
  if (a.info.kind === 'alpha') return ALPHA_STEPS.indexOf(a.info.step) - ALPHA_STEPS.indexOf(b.info.step);
  if (a.info.kind === 'alias') {
    const ai = ALIAS_ORDER.indexOf(a.info.step);
    const bi = ALIAS_ORDER.indexOf(b.info.step);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  }
  return 0;
}

/**
 * Semantic group sort comparator.
 */
function compareSemantic(a, b) {
  const ai = SEMANTIC_PREFIX_ORDER.findIndex((p) => a.info.key === p || a.info.key.startsWith(p + '-'));
  const bi = SEMANTIC_PREFIX_ORDER.findIndex((p) => b.info.key === p || b.info.key.startsWith(p + '-'));
  const ar = ai === -1 ? SEMANTIC_PREFIX_ORDER.length : ai;
  const br = bi === -1 ? SEMANTIC_PREFIX_ORDER.length : bi;
  if (ar !== br) return ar - br;
  return a.info.key.localeCompare(b.info.key);
}

/**
 * Build the full grouped colour model.
 *
 * @param {string[]} variables Ordered `--sf-color-*` names from the inventory.
 * @param {Record<string,string>} light Light-mode hex map.
 * @param {Record<string,string>} dark  Dark-mode hex map.
 * @returns {{ groups: Array<{ id: string, label: string, type: 'brand'|'status'|'semantic', count: number, sections: Array<{ id: string, label: string, swatches: object[] }> }> }}
 */
export function buildColorModel(variables, light, dark) {
  const vars = Array.isArray(variables) ? variables : [];
  const lightMap = light && typeof light === 'object' ? light : {};
  const darkMap = dark && typeof dark === 'object' ? dark : {};

  // family id → { base:[], scale:[], alias:[], alpha:[] } | semantic: []
  const byFamily = new Map();
  const semantic = [];

  for (const varName of vars) {
    const info = classifyVar(varName);
    if (!info) continue;
    const swatch = buildSwatch(varName, info, lightMap, darkMap);
    if (!swatch) continue;
    const entry = { swatch, info };

    if (info.family === 'semantic') {
      semantic.push(entry);
      continue;
    }
    if (!byFamily.has(info.family)) byFamily.set(info.family, []);
    byFamily.get(info.family).push(entry);
  }

  const groups = [];

  const pushFamily = (family, type) => {
    const entries = byFamily.get(family);
    if (!entries || entries.length === 0) return;
    entries.sort(compareInFamily);

    // Split into the three rendered sections.
    const scale = entries.filter((e) => e.info.kind === 'base' || e.info.kind === 'scale');
    const alias = entries.filter((e) => e.info.kind === 'alias');
    const alpha = entries.filter((e) => e.info.kind === 'alpha');

    const sections = [];
    if (scale.length) sections.push({ id: 'scale', label: 'Shades & tints', swatches: scale.map((e) => e.swatch) });
    if (alpha.length) sections.push({ id: 'alpha', label: 'Transparent', swatches: alpha.map((e) => e.swatch) });
    if (alias.length) sections.push({ id: 'alias', label: 'Semantic', swatches: alias.map((e) => e.swatch) });

    groups.push({
      id: family,
      label: capitalize(family),
      type,
      count: entries.length,
      sections,
    });
  };

  for (const f of BRAND_FAMILIES) pushFamily(f, 'brand');
  for (const f of STATUS_FAMILIES) pushFamily(f, 'status');

  if (semantic.length) {
    semantic.sort(compareSemantic);
    groups.push({
      id: 'semantic',
      label: 'Semantic',
      type: 'semantic',
      count: semantic.length,
      sections: [{ id: 'all', label: '', swatches: semantic.map((e) => e.swatch) }],
    });
  }

  return { groups };
}

/**
 * Filter a built model by a free-text query, returning a new model whose
 * groups/sections only contain matching swatches (empty sections and groups
 * are dropped). Matches against the token name and the human label,
 * case-insensitively. An empty query returns the model unchanged.
 *
 * @param {{ groups: object[] }} model
 * @param {string} query
 * @returns {{ groups: object[] }}
 */
export function filterModel(model, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return model;
  if (!model || !Array.isArray(model.groups)) return { groups: [] };

  const groups = [];
  for (const group of model.groups) {
    const sections = [];
    for (const section of group.sections) {
      const swatches = section.swatches.filter(
        (s) => s.name.toLowerCase().includes(q) || s.label.toLowerCase().includes(q) || group.label.toLowerCase().includes(q)
      );
      if (swatches.length) sections.push({ ...section, swatches });
    }
    if (sections.length) {
      const count = sections.reduce((n, s) => n + s.swatches.length, 0);
      groups.push({ ...group, sections, count });
    }
  }
  return { groups };
}

/**
 * The CSS value applied/copied for a swatch — always the live framework
 * variable so the result tracks theme + dark mode, never a baked hex.
 *
 * @param {{ var: string }} swatch
 * @returns {string}
 */
export function swatchValue(swatch) {
  return `var(${swatch.var})`;
}

/**
 * The hex to render for a swatch given the preview mode.
 *
 * @param {{ light: string, dark: string }} swatch
 * @param {'light'|'dark'} mode
 * @returns {string}
 */
export function swatchHex(swatch, mode) {
  return mode === 'dark' ? swatch.dark : swatch.light;
}
