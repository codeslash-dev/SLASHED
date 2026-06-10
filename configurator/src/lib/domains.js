/**
 * Domain taxonomy for the categorised configurator.
 *
 * Splits the full token catalogue (~840 tokens) into the user-facing domains
 * the UI navigates (Colors, Typography, Spacing, Layout, Borders, Shadows,
 * Motion, Effects, …). Each domain ships a small curated set of "basic"
 * essentials — the handful of tokens a typical user always touches — plus
 * optional in-place generators (modular type / display / space scale, etc.).
 * Advanced mode then exposes the FULL catalogue for that domain so nothing is
 * ever out of reach.
 *
 * Classification is deterministic: each domain owns a list of token-name
 * prefixes/regexes plus a list of namespaces, evaluated in the order the
 * domains are declared. The first domain whose patterns match wins. Domains
 * are ordered most-specific-first (Shadows before Borders before Typography…)
 * so that compound names like `--sf-text-shadow-l` land in Shadows, not
 * Typography. A small explicit OVERRIDES map handles the awkward stragglers
 * that cleanly belong to a different domain than their name suggests.
 *
 * Pure data + a classifier; no Svelte/DOM, so it is trivially unit-testable.
 */

/** Tokens whose ideal domain doesn't fall out of name patterns alone. */
const OVERRIDES = {
  // Body-text aliases live in typography even though `--sf-color-body` etc.
  // would otherwise be plucked by colors first.
  '--sf-current-font-weight': 'typography',
  // The internal dark-mode flag is misc state, not a color.
  '--sf-is-dark': 'misc',
};

/**
 * Domain definitions, in tab order.
 *
 *   id            - kebab-cased identifier (used by ui.domain)
 *   label         - display label
 *   icon          - single emoji shown in the tab and section header
 *   blurb         - one-line summary shown above the panel
 *   tool          - non-token tool slot: 'wcag' renders the WCAG panel
 *   essentials    - curated "basic" token names (rendered as editor rows in
 *                   basic + advanced); names absent from the active catalogue
 *                   are skipped silently
 *   basicGenerators / advancedGenerators
 *                 - which scale generator ramps to surface (one of
 *                   'type' | 'display' | 'space')
 *   namespaces    - api-index `namespace` values that belong to this domain
 *   patterns      - additional token-name regexes that map into this domain
 *
 * @type {Array<{
 *   id: string, label: string, icon: string, blurb: string,
 *   tool?: string,
 *   essentials?: string[],
 *   basicGenerators?: string[], advancedGenerators?: string[],
 *   namespaces?: string[], patterns?: RegExp[]
 * }>}
 */
export const DOMAINS = [
  {
    id: 'colors',
    label: 'Colors',
    icon: '🎨',
    blurb: 'Brand & status sources, semantic surfaces, links, focus, gradients, palette mix.',
    namespaces: [
      'color', 'palette', 'gradient',
      'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base',
      'success', 'warning', 'error', 'info', 'danger',
      'link',
      'focus', 'caret', 'scrollbar',
      'contrast', 'lumlocker', 'surface',
    ],
    patterns: [
      /^--sf-color-/,
      /^--sf-(primary|secondary|tertiary|action|neutral|base)-[hsl]$/,
      /^--sf-(success|warning|error|info|danger)-[hsl]$/,
      /^--sf-link-/,
      /^--sf-focus-/,
      /^--sf-scrollbar-/,
      /^--sf-caret-/,
      /^--sf-gradient-/,
      /^--sf-palette-/,
      /^--sf-(contrast|lumlocker|surface)-?/,
    ],
    essentials: [
      '--sf-color-base-light',
      '--sf-color-neutral-light',
      '--sf-color-primary-light',
      '--sf-color-secondary-light',
      '--sf-color-tertiary-light',
      '--sf-color-action-light',
      '--sf-color-success-light',
      '--sf-color-warning-light',
      '--sf-color-error-light',
      '--sf-color-info-light',
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: '🔤',
    blurb: 'Font families, fluid type ramp, headings, prose and inline text behaviour.',
    namespaces: [
      'font', 'text', 'leading', 'tracking', 'prose',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'heading', 'display',
      'body', 'code',
      'optical', 'current',
    ],
    patterns: [
      /^--sf-font-/,
      /^--sf-text-(?!shadow)/, // text-2xl, text-base-min, text-display-l (NOT text-shadow-*)
      /^--sf-leading-/,
      /^--sf-tracking-/,
      /^--sf-prose-/,
      /^--sf-h[1-6]-/,
      /^--sf-heading-/,
      /^--sf-display-/,
      /^--sf-body-/,           // body-color/font/em-style/strong-weight/etc.
      /^--sf-code-/,
      /^--sf-line-clamp$/,
      /^--sf-truncate-/,
      /^--sf-optical-/,
      /^--sf-current-/,
    ],
    essentials: [
      '--sf-font-body',
      '--sf-font-heading',
      '--sf-font-display',
      '--sf-font-mono',
      '--sf-text-base-min',
      '--sf-text-base-max',
      '--sf-leading-normal',
      '--sf-tracking-normal',
    ],
    advancedGenerators: ['type', 'display'],
  },
  {
    id: 'spacing',
    label: 'Spacing',
    icon: '📏',
    blurb: 'Fluid spacing scale, gaps, section padding and content rhythm.',
    namespaces: ['space', 'gap', 'section', 'fluid', 'flow', 'gutter', 'component'],
    patterns: [
      /^--sf-space-/,
      /^--sf-gap(\b|[-_])/,
      /^--sf-section-/,
      /^--sf-fluid-/,
      /^--sf-flow-/,
      /^--sf-component-pad/,
      /^--sf-content-(gap|width|intrinsic)/,
    ],
    essentials: [
      '--sf-space-m',
      '--sf-space-content',
      '--sf-section-pad',
      '--sf-component-pad',
    ],
    basicGenerators: ['space'],
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: '🧱',
    blurb: 'Containers, grids, layout primitives, icons, ratios and z-index.',
    namespaces: [
      'container', 'grid', 'col', 'cluster', 'stack', 'reel', 'sidebar',
      'switcher', 'cover', 'frame', 'bento', 'center', 'box', 'imposter',
      'breakout', 'equal', 'object', 'aspect', 'ratio', 'safe', 'sticky',
      'header', 'icon', 'touch', 'z', 'size', 'alternate', 'divide',
      'field',
    ],
    patterns: [
      /^--sf-container-/,
      /^--sf-grid-/,
      /^--sf-col-/,
      /^--sf-cluster-/,
      /^--sf-stack-/,
      /^--sf-reel-/,
      /^--sf-sidebar-/,
      /^--sf-switcher-/,
      /^--sf-cover-/,
      /^--sf-frame-/,
      /^--sf-bento-/,
      /^--sf-center-/,
      /^--sf-box-/,
      /^--sf-imposter-/,
      /^--sf-breakout-/,
      /^--sf-content-(?!gap|width|intrinsic)/, // anything content-* not in spacing
      /^--sf-equal-/,
      /^--sf-object-/,
      /^--sf-aspect$/,
      /^--sf-ratio-/,
      /^--sf-safe-/,
      /^--sf-sticky-/,
      /^--sf-header-/,
      /^--sf-icon-/,
      /^--sf-touch-/,
      /^--sf-z-/,
      /^--sf-size-/,
      /^--sf-alternate-/,
      /^--sf-field-/,
    ],
    essentials: [
      '--sf-container-narrow',
      '--sf-container-default',
      '--sf-container-wide',
      '--sf-container-prose',
      '--sf-touch-target',
      '--sf-header-height',
    ],
  },
  {
    id: 'borders',
    label: 'Borders',
    icon: '⬜',
    blurb: 'Corner radius, border widths, strokes and dividers.',
    namespaces: ['border', 'radius', 'stroke', 'divider', 'outline'],
    patterns: [
      /^--sf-border(\b|[-_])/,
      /^--sf-radius-/,
      /^--sf-stroke-/,
      /^--sf-divider-/,
      /^--sf-outline-/,
    ],
    essentials: [
      '--sf-radius-s',
      '--sf-radius-m',
      '--sf-radius-l',
      '--sf-radius-full',
      '--sf-border-width-1',
      '--sf-divider-width',
    ],
  },
  {
    id: 'shadows',
    label: 'Shadows',
    icon: '🌒',
    blurb: 'Elevation shadow ramp, drop / text / scroll shadows and glow.',
    // Order MATTERS — these patterns run before typography/colors so that
    // `--sf-text-shadow-*` and `--sf-shadow-color` end up here.
    patterns: [
      /^--sf-shadow(\b|[-_])/,
      /^--sf-text-shadow/,
      /^--sf-drop-shadow/,
      /^--sf-scroll-shadow/,
      /-glow(\b|[-_])/,        // shadow-glow, shadow-glow-color, etc.
    ],
    essentials: [
      '--sf-shadow-s',
      '--sf-shadow-m',
      '--sf-shadow-l',
      '--sf-shadow-xl',
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    icon: '🎞️',
    blurb: 'Durations, easings, transition and animation presets.',
    namespaces: ['duration', 'ease', 'transition', 'animation', 'motion', 'scroll'],
    patterns: [
      /^--sf-duration-/,
      /^--sf-ease-/,
      /^--sf-transition-/,
      /^--sf-animation-/,
      /^--sf-motion-/,
      /^--sf-scroll-(?!shadow)/,    // scroll-timeline-*, scroll-driven knobs
    ],
    essentials: [
      '--sf-duration-fast',
      '--sf-duration-normal',
      '--sf-duration-slow',
      '--sf-ease-in',
      '--sf-ease-out',
      '--sf-ease-in-out',
      '--sf-motion-scale',
    ],
  },
  {
    id: 'effects',
    label: 'Effects',
    icon: '✨',
    blurb: 'Blur, opacity, scrim, mask and other compositing effects.',
    namespaces: ['blur', 'opacity', 'scrim', 'mask', 'state'],
    patterns: [
      /^--sf-blur-/,
      /^--sf-opacity-/,
      /^--sf-scrim-/,
      /^--sf-mask-/,
      /^--sf-state-/,
    ],
    essentials: [
      '--sf-opacity-50',
      '--sf-blur-m',
      '--sf-state-pending-opacity',
    ],
  },
  {
    id: 'wcag',
    label: 'WCAG',
    icon: '🧪',
    blurb: 'Contrast checker, text-on-background matrix and accessible-palette generator.',
    tool: 'wcag',
  },
  {
    id: 'misc',
    label: 'Misc',
    icon: '🧩',
    blurb: 'Print, interaction-state flags, fluid scale slots and other stragglers.',
    namespaces: ['print', 'is'],
    patterns: [
      /^--sf-print-/,
      /^--sf-is-/,
    ],
  },
];

/** Quick id -> definition lookup. */
export const DOMAIN_BY_ID = new Map(DOMAINS.map((d) => [d.id, d]));

/**
 * Classify a token into a domain id.
 *
 * Order:
 *   1. explicit OVERRIDES (per-token escape hatch);
 *   2. NAME-PATTERN pass across every domain in declaration order — the first
 *      domain whose patterns match wins. Patterns are evaluated before
 *      namespaces so a compound name like `--sf-text-shadow-l` (namespace
 *      `text`) lands in Shadows, not Typography;
 *   3. NAMESPACE pass as a fallback — covers tokens whose namespace alone is
 *      a clean classifier and saves us from listing every prefix twice.
 *
 * Falls back to `'misc'` so NO token is ever invisible.
 *
 * @param {{name?:string, namespace?:string|null}} token
 * @returns {string} domain id
 */
export function domainOf(token) {
  if (!token) return 'misc';
  const name = token.name || '';
  if (OVERRIDES[name]) return OVERRIDES[name];

  // Pass 1: name-pattern match (the more specific signal).
  for (const d of DOMAINS) {
    if (d.tool) continue;
    if (d.patterns?.some((re) => re.test(name))) return d.id;
  }

  // Pass 2: namespace match (the broader fallback).
  const ns = token.namespace || '';
  for (const d of DOMAINS) {
    if (d.tool) continue;
    if (d.namespaces?.includes(ns)) return d.id;
  }
  return 'misc';
}
