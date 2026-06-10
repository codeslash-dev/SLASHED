/**
 * Domain taxonomy for the tabbed configurator.
 *
 * Splits the full token catalogue into the user-facing domains (Typography,
 * Spacing, Colors, …) the UI tabs render, and curates a small set of "basic"
 * essentials per domain — the handful of tokens a typical user always needs.
 * Advanced mode then exposes the FULL domain catalogue plus the generators and
 * knobs. This mirrors the WordPress plugin's tab layout (ColorTab / TypographyTab
 * / SpacingTab / LayoutsTab / WcagTab …) so the two tools stay at feature parity.
 *
 * Pure data + a classifier; no Svelte/DOM so it is trivially unit-testable.
 */

/**
 * Ordered domain → name-pattern rules. First match wins, so more specific
 * patterns (e.g. text-shadow → shadows) must precede the broader ones
 * (text-* → typography). Anything unmatched falls through to the `more`
 * domain, so NO token is ever hidden.
 *
 * @type {Array<{ id:string, test:RegExp }>}
 */
const RULES = [
  // Shadows first — claim *-shadow-* before typography claims --sf-text-*.
  // `(.*-)?shadow` already covers drop-shadow / text-shadow / scroll-shadow.
  { id: 'shadows', test: /^--sf-(.*-)?shadow|^--sf-.*glow/ },
  // Borders, radii, strokes, dividers, outlines.
  { id: 'borders', test: /^--sf-(border|radius|stroke|divider|outline)/ },
  // Typography (text, fonts, line-height, tracking, prose, headings, display).
  { id: 'typography', test: /^--sf-(text|font|leading|tracking|prose|h[1-6]-|heading|display|code|optical|line-height|body|line-clamp|truncate)/ },
  // Spacing & fluid scale engine.
  { id: 'spacing', test: /^--sf-(space|gap|section|fluid|flow|gutter|content-gap|component-pad)/ },
  // Colors (brand/status sources, resolved colors, links, focus, gradients,
  // palette-mix knobs, contrast biases…).
  { id: 'colors', test: /^--sf-(color|palette|primary|secondary|tertiary|action|neutral|base|success|warning|error|info|danger|link|focus|gradient|scrim|mask|contrast|lumlocker|current|selection|caret|surface)/ },
  // Motion & effects (animation, transition, easing, blur, opacity, scroll).
  { id: 'motion', test: /^--sf-(duration|ease|transition|animation|motion|scroll|blur|opacity|backdrop|will-change)/ },
  // Layout primitives (grid/flex helpers, containers, sizes, z-index, icons…).
  { id: 'layout', test: /^--sf-(grid|col|cluster|stack|reel|sidebar|switcher|cover|frame|bento|center|box|imposter|breakout|content|equal|object|aspect|ratio|safe|sticky|header|icon|touch|z|container|size|alternate|divide|field)/ },
];

/**
 * Classify a token into a domain id.
 * @param {{name:string}} token
 * @returns {string} domain id (falls back to 'more')
 */
export function domainOf(token) {
  const name = token?.name || '';
  for (const rule of RULES) {
    if (rule.test.test(name)) return rule.id;
  }
  return 'more';
}

/**
 * Domain definitions, in tab order. `essentials` lists the curated "basic"
 * token names (rendered as editor rows); names absent from the active
 * catalogue are simply skipped by the UI. `generators` flags which scale
 * generator ramps to surface, and `tool` marks non-token tool tabs (WCAG).
 *
 * @type {Array<{
 *   id:string, label:string, blurb:string,
 *   essentials?:string[], basicGenerators?:string[], advancedGenerators?:string[],
 *   tool?:string
 * }>}
 */
export const DOMAINS = [
  {
    id: 'typography',
    label: 'Typography',
    blurb: 'Font families and the fluid type scale.',
    essentials: [
      '--sf-font-body',
      '--sf-font-heading',
      '--sf-font-display',
      '--sf-font-mono',
      '--sf-text-base-min',
      '--sf-text-base-max',
    ],
    advancedGenerators: ['type', 'display'],
  },
  {
    id: 'spacing',
    label: 'Spacing',
    blurb: 'The space scale that drives every gap and padding.',
    essentials: ['--sf-space-scale'],
    basicGenerators: ['space'],
  },
  {
    id: 'colors',
    label: 'Colors',
    blurb: 'Brand & status source colors — everything else derives from these.',
    essentials: [
      '--sf-color-primary-light',
      '--sf-color-secondary-light',
      '--sf-color-tertiary-light',
      '--sf-color-action-light',
      '--sf-color-neutral-light',
      '--sf-color-base-light',
    ],
  },
  {
    id: 'wcag',
    label: 'WCAG',
    blurb: 'Contrast checker, matrix and accessible-palette generator.',
    tool: 'wcag',
  },
  {
    id: 'layout',
    label: 'Layout',
    blurb: 'Containers, grids and structural layout primitives.',
    essentials: [
      '--sf-container-narrow',
      '--sf-container-default',
      '--sf-container-wide',
      '--sf-container-prose',
    ],
  },
  {
    id: 'borders',
    label: 'Borders',
    blurb: 'Corner radius, border widths, strokes and dividers.',
    essentials: [
      '--sf-radius-s',
      '--sf-radius-m',
      '--sf-radius-l',
      '--sf-radius-full',
      '--sf-border-width-1',
      '--sf-color-border',
    ],
  },
  {
    id: 'shadows',
    label: 'Shadows',
    blurb: 'Elevation shadow presets and shadow strength.',
    essentials: ['--sf-shadow-s', '--sf-shadow-m', '--sf-shadow-l'],
  },
  {
    id: 'motion',
    label: 'Motion',
    blurb: 'Durations, easing, transitions and effects.',
    essentials: ['--sf-duration-fast', '--sf-duration-normal', '--sf-duration-slow'],
  },
  {
    id: 'more',
    label: 'More',
    blurb: 'Everything else in the catalogue.',
  },
];

/** Quick id → definition lookup. */
export const DOMAIN_BY_ID = new Map(DOMAINS.map((d) => [d.id, d]));
