/**
 * Token catalogue model — pure transforms over the synced api-index data.
 *
 * No Svelte runes here: this module just shapes the baked-in
 * api-index.generated.json into the structures the UI walks (categories ->
 * groups -> tokens) and infers an edit control per token. Keeping it
 * rune-free means it is trivially unit-testable and re-usable.
 */
import data from '../data/api-index.generated.json';

/** Sync metadata (framework version, generated timestamp, counts). */
export const sync = data._sync ?? {};

/** Every token row from the synced catalogue. */
export const allTokens = Array.isArray(data.tokens) ? data.tokens : [];

/** Fast lookup: token name -> row. */
export const tokenByName = new Map(allTokens.map((t) => [t.name, t]));

/** Default value lookup: token name -> declared default value (string). */
export const defaultsByName = new Map(
  allTokens.map((t) => [t.name, t.value ?? ''])
);

/** Tiers present in the catalogue, ordered most- to least-public. */
export const TIER_ORDER = ['PUBLIC', 'PUBLIC-ADVANCED', 'INTERNAL'];

const COLOR_VALUE_RE =
  /(^|\b)(oklch|oklab|lch|lab|rgb|rgba|hsl|hsla|color|color-mix|light-dark)\s*\(|#[0-9a-fA-F]{3,8}\b|\b(transparent|currentColor)\b/;

const LENGTH_VALUE_RE =
  /^-?\d*\.?\d+(px|rem|em|ch|ex|vh|vw|vmin|vmax|%|s|ms|deg|turn|fr|dvh|dvw)$/;

const NUMBER_VALUE_RE = /^-?\d+(\.\d+)?$/;

const HEX_RE = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/**
 * Decide whether a token represents a color.
 * @param {object} token
 * @returns {boolean}
 */
export function isColorToken(token) {
  if (!token) return false;
  if (token.syntax && /<color>/.test(token.syntax)) return true;
  if (token.namespace === 'color') return true;
  const v = (token.value || '').trim();
  return COLOR_VALUE_RE.test(v);
}

/**
 * Infer the best edit control for a token from its declared default value.
 *
 * @param {object} token
 * @returns {{ control: 'color'|'number'|'length'|'text', unit: string, hexable: boolean }}
 *   control  - which editor component to render
 *   unit     - trailing unit for 'length' values (e.g. "px", "rem"), else ''
 *   hexable  - true when the default is a plain hex and a native <input type=color> fits
 */
export function inferControl(token) {
  const v = (token.value || '').trim();

  if (isColorToken(token)) {
    return { control: 'color', unit: '', hexable: HEX_RE.test(v) };
  }
  if (NUMBER_VALUE_RE.test(v)) {
    return { control: 'number', unit: '', hexable: false };
  }
  const lenMatch = LENGTH_VALUE_RE.exec(v);
  if (lenMatch) {
    return { control: 'length', unit: lenMatch[1], hexable: false };
  }
  return { control: 'text', unit: '', hexable: false };
}

/**
 * Group tokens into category -> [{ group, tokens[] }], preserving alphabetical
 * token order and producing a deterministic category/group ordering.
 *
 * @param {object[]} tokens token rows (already filtered for the current view)
 * @returns {Array<{ category: string, count: number, groups: Array<{ name: string, tokens: object[] }> }>}
 */
export function groupTokens(tokens) {
  /** @type {Map<string, Map<string, object[]>>} */
  const cats = new Map();
  for (const t of tokens) {
    const cat = t.category || 'Other';
    const grp = t.group || 'General';
    if (!cats.has(cat)) cats.set(cat, new Map());
    const groups = cats.get(cat);
    if (!groups.has(grp)) groups.set(grp, []);
    groups.get(grp).push(t);
  }

  const result = [];
  for (const [category, groups] of cats) {
    const groupList = [];
    let count = 0;
    for (const [name, list] of groups) {
      groupList.push({ name, tokens: list });
      count += list.length;
    }
    groupList.sort((a, b) => a.name.localeCompare(b.name));
    result.push({ category, count, groups: groupList });
  }
  // Order categories by the canonical CATEGORY_ORDER, then alphabetically.
  result.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a.category);
    const ib = CATEGORY_ORDER.indexOf(b.category);
    if (ia !== -1 || ib !== -1) {
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
    return a.category.localeCompare(b.category);
  });
  return result;
}

/** Preferred display order for the known token categories. */
export const CATEGORY_ORDER = [
  'Core tokens',
  'Layout tokens',
  'Macro tokens',
  'Palette tokens',
  'Sizes-extended tokens',
  'Component tokens',
  'Color fallback (legacy HSL)',
];

/**
 * Match a token against a free-text query (name, description, group, value).
 * @param {object} token
 * @param {string} query lower-cased query
 * @returns {boolean}
 */
export function matchesQuery(token, query) {
  if (!query) return true;
  const haystack = `${token.name} ${token.description} ${token.group} ${token.value} ${token.namespace}`.toLowerCase();
  return haystack.includes(query);
}
