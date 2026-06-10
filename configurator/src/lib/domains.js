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
 * Quick-knob definitions per domain.
 *
 * A "knob" is a single token whose value cascades through many other tokens
 * (e.g. `--sf-space-scale=1` drives 45 spacing tokens). Surfacing these as
 * dedicated sliders at the top of each panel is the headline DX win — one
 * drag, dozens of derived values move.
 *
 * The `driving` count is the number of tokens that reference this knob in
 * the active framework catalogue (measured against api-index.generated.json).
 *
 * Schema is consumed by QuickKnobs.svelte unchanged.
 *
 * @type {Record<string, Array<{name:string,label:string,help?:string,default:number,min:number,max:number,step:number,unit?:string,driving?:number}>>}
 */
export const KNOBS_BY_DOMAIN = {
  colors: [
    { name: '--sf-contrast-bias',      label: '--sf-contrast-bias',      default: 0,    min: -1,  max: 1,   step: 0.05, driving: 3, help: 'Shifts the lightness threshold used by text-on-color pairing toward darker (negative) or lighter (positive) text.' },
    { name: '--sf-contrast-threshold', label: '--sf-contrast-threshold', default: 0.6,  min: 0,   max: 1,   step: 0.01,            help: 'OKLCH lightness above which a swatch is considered "light" (and gets dark text), below which dark swatches get light text.' },
    { name: '--sf-focus-ring-width',   label: '--sf-focus-ring-width',   default: 2,    min: 0,   max: 6,   step: 0.5,  unit: 'px', help: 'Thickness of the focus ring on every interactive element.' },
  ],
  typography: [
    { name: '--sf-text-scale',         label: '--sf-text-scale',         default: 1,    min: 0.5, max: 2,   step: 0.05,             help: 'Multiplier applied to the entire fluid text ramp (--sf-text-2xs … --sf-text-2xl).' },
    { name: '--sf-text-display-scale', label: '--sf-text-display-scale', default: 1,    min: 0.5, max: 2,   step: 0.05,             help: 'Multiplier applied to the display ramp (--sf-text-display-s|m|l).' },
  ],
  spacing: [
    { name: '--sf-space-scale',        label: '--sf-space-scale',        default: 1,    min: 0.5, max: 2,   step: 0.05, driving: 45, help: 'Multiplier applied to every fluid spacing step.' },
    { name: '--sf-section-scale',      label: '--sf-section-scale',      default: 1,    min: 0.5, max: 2,   step: 0.05,            help: 'Multiplier applied to section paddings only.' },
  ],
  borders: [
    { name: '--sf-radius-scale',       label: '--sf-radius-scale',       default: 1,    min: 0,   max: 2,   step: 0.05, driving: 8, help: 'Multiplier applied to every radius step (set to 0 for sharp brutalist corners).' },
  ],
  shadows: [
    { name: '--sf-shadow-strength',    label: '--sf-shadow-strength',    default: 0.08, min: 0,   max: 1,   step: 0.01, driving: 14, help: 'Opacity multiplier applied to every shadow. The default already lifts in dark mode via --sf-is-dark.' },
  ],
  motion: [
    { name: '--sf-motion-scale',       label: '--sf-motion-scale',       default: 1,    min: 0,   max: 2,   step: 0.05, driving: 13, help: 'Speed multiplier on every duration. Set to 0 to effectively disable motion (matches prefers-reduced-motion).' },
  ],
  effects: [
    { name: '--sf-state-pending-opacity', label: '--sf-state-pending-opacity', default: 0.6, min: 0, max: 1, step: 0.05, help: 'Opacity applied to elements while their async/pending state class is active.' },
  ],
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
    id: 'themes',
    label: 'Themes',
    icon: '🎭',
    blurb: 'One-click preset looks plus your saved override slots.',
    tool: 'themes',
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
