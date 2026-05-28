/**
 * Map Bricks element types to BEM-friendly element labels.
 *
 * Used by `BemPanel` to pre-fill descendant row names so the panel is
 * usable on first open without typing every name. The provenance of
 * the suggestion is tracked on each `row.suggestedFrom` so the UI can:
 *   - render suggestions as muted/italic until the user touches the input,
 *   - participate in sibling auto-numbering (suggested names get `-1`, `-2`
 *     while user-typed names stay as-typed and surface a duplicate error).
 *
 * The mapping is intentionally conservative: only well-known element
 * types map to a label, and "container-y" element types (section,
 * container, block, div) deliberately fall through to the generic
 * `fallback` so users don't end up with `card__container` everywhere.
 *
 * @module element-types
 */

/**
 * Bricks element type → BEM element label.
 *
 * Keys are the Bricks `element.name` values (NOT user-facing labels —
 * those live in `element.label`). Add to this map as new Bricks element
 * types ship; unknown types fall through to the caller-supplied fallback.
 *
 * Kept as a plain object (not a Set/Map) so the mapping is easy to
 * filter from PHP via `wp_localize_script` payloads in a future
 * iteration.
 *
 * @type {Record<string, string>}
 */
export const ELEMENT_TYPE_LABEL_MAP = Object.freeze({
  // Typography
  heading: 'heading',
  'text-basic': 'text',
  text: 'text',
  'text-link': 'link',
  code: 'code',
  // Media
  image: 'image',
  icon: 'icon',
  'icon-box': 'icon',
  video: 'video',
  audio: 'audio',
  svg: 'svg',
  logo: 'logo',
  shape: 'shape',
  // Interactive
  button: 'button',
  'button-group': 'buttons',
  'nav-nested': 'nav',
  'nav-menu': 'nav',
  list: 'list',
  // Compound
  accordion: 'accordion',
  tabs: 'tabs',
  slider: 'slider',
  carousel: 'carousel',
  countdown: 'countdown',
  counter: 'counter',
  testimonials: 'testimonials',
  pricing: 'pricing',
  team: 'team',
  // Forms
  form: 'form',
  // Loops / dynamic
  posts: 'posts',
  template: 'item',
  // Layout containers — deliberately NOT mapped so they fall back
  // to the caller-supplied `fallback` (typically 'item').
  // section / container / block / div remain unmapped.
});

/**
 * Element types that are layout containers and should never seed a
 * named element label automatically. Listed explicitly so callers can
 * detect "this is a wrapper, suggest 'item' or skip" without juggling
 * the mapping table directly.
 *
 * @type {ReadonlySet<string>}
 */
export const LAYOUT_CONTAINER_TYPES = new Set([
  'section', 'container', 'block', 'div',
]);

/**
 * Suggest a BEM element label for a Bricks element type.
 *
 * Pure function — no dependencies on policy, DOM, or Bricks state.
 *
 * @param {string|undefined|null} elementType - Bricks `element.name`.
 * @param {string} [fallback='item'] - Label to use when the type is unknown
 *   or a layout container. Caller controls the fallback so block- vs
 *   element-context can differ (block uses 'block', element uses 'item').
 * @returns {string}
 */
export function suggestElementName(elementType, fallback = 'item') {
  if (!elementType || typeof elementType !== 'string') return fallback;
  if (LAYOUT_CONTAINER_TYPES.has(elementType)) return fallback;
  const mapped = ELEMENT_TYPE_LABEL_MAP[elementType];
  return mapped || fallback;
}

/**
 * Whether a Bricks element type is a generic layout container.
 *
 * Useful when deciding whether to mark a row's seed name as
 * `'fallback'` (low confidence, user almost certainly wants to rename)
 * vs `'element-type'` (high confidence — the type told us exactly
 * what to call it).
 *
 * @param {string|undefined|null} elementType
 * @returns {boolean}
 */
export function isLayoutContainer(elementType) {
  return typeof elementType === 'string' && LAYOUT_CONTAINER_TYPES.has(elementType);
}
