/**
 * Curated inline live-preview specs, one per token domain.
 *
 * The Colors panel earned an inline "Semantic roles" preview (ColorAssignments)
 * so you see your edits land without leaving the editing panel. This module
 * extends that idea to every other token domain: each entry names the handful
 * of framework tokens worth showing in a compact, domain-shaped preview
 * (radius corners, elevation cards, gradient tiles, motion bars, a type
 * specimen, spacing bars, proportional container widths + aspect/sizing tiles,
 * blur/opacity/scrim samples).
 *
 * DomainPreview.svelte renders these inside a scoped stage carrying the full
 * framework cascade + the user's overrides (via buildPreviewDeclarations), so
 * every `var(--sf-*)` sample resolves live — exactly like the big Preview pane,
 * but focused on the domain you're editing.
 *
 * Curation is hand-picked (a human decides "show radius-m here"), so it is the
 * one place a framework rename could silently render a dead sample. Every token
 * named below is pinned by tests/domainPreviews.test.js against the baked
 * catalogue — a vanished token fails CI instead of rendering blank.
 *
 * Pure data; no Svelte/DOM, trivially unit-testable.
 *
 * @typedef {{ token: string, label: string }} PreviewItem
 * @typedef {{ kind: string, blurb: string, groups: Array<{ section?: string, items: PreviewItem[] }> }} PreviewSpec
 * @type {Record<string, PreviewSpec>}
 */
export const DOMAIN_PREVIEWS = {
  typography: {
    kind: 'type',
    blurb: 'Your fonts and fluid sizes, rendered live.',
    groups: [
      {
        section: 'Type scale',
        items: [
          { token: '--sf-text-2xl', label: '2xl' },
          { token: '--sf-text-xl', label: 'xl' },
          { token: '--sf-text-l', label: 'l' },
          { token: '--sf-text-m', label: 'm' },
          { token: '--sf-text-s', label: 's' },
          { token: '--sf-text-xs', label: 'xs' },
        ],
      },
      {
        section: 'Font stacks',
        items: [
          { token: '--sf-font-heading', label: 'Heading' },
          { token: '--sf-font-body', label: 'Body' },
          { token: '--sf-font-mono', label: 'Mono' },
        ],
      },
      {
        section: 'Specimen',
        items: [
          { token: '--sf-h2-size', label: 'Heading size' },
          { token: '--sf-leading-normal', label: 'Body leading' },
        ],
      },
    ],
  },

  spacing: {
    kind: 'space',
    blurb: 'Every fluid spacing step at the current viewport.',
    groups: [
      {
        items: [
          { token: '--sf-space-2xs', label: '2xs' },
          { token: '--sf-space-xs', label: 'xs' },
          { token: '--sf-space-s', label: 's' },
          { token: '--sf-space-m', label: 'm' },
          { token: '--sf-space-l', label: 'l' },
          { token: '--sf-space-xl', label: 'xl' },
          { token: '--sf-space-2xl', label: '2xl' },
        ],
      },
    ],
  },

  layout: {
    kind: 'layout',
    blurb: 'Container widths, aspect ratios and sizing anchors.',
    groups: [
      {
        section: 'Container widths',
        items: [
          { token: '--sf-container-narrow', label: 'Narrow' },
          { token: '--sf-container-prose', label: 'Prose' },
          { token: '--sf-container-default', label: 'Default' },
          { token: '--sf-container-wide', label: 'Wide' },
        ],
      },
      {
        section: 'Aspect ratios',
        items: [
          { token: '--sf-ratio-square', label: 'square' },
          { token: '--sf-ratio-video', label: 'video' },
          { token: '--sf-ratio-golden', label: 'golden' },
          { token: '--sf-ratio-portrait', label: 'portrait' },
        ],
      },
      {
        section: 'Sizing',
        items: [
          { token: '--sf-header-height', label: 'header' },
          { token: '--sf-touch-target', label: 'touch' },
          { token: '--sf-icon-m', label: 'icon m' },
        ],
      },
    ],
  },

  gradients: {
    kind: 'gradient',
    blurb: 'Brand and surface gradient shorthands.',
    groups: [
      {
        section: 'Brand',
        items: [
          { token: '--sf-gradient-primary', label: 'primary' },
          { token: '--sf-gradient-secondary', label: 'secondary' },
          { token: '--sf-gradient-tertiary', label: 'tertiary' },
          { token: '--sf-gradient-brand', label: 'brand' },
          { token: '--sf-gradient-surface', label: 'surface' },
        ],
      },
      {
        section: 'Fades',
        items: [
          { token: '--sf-gradient-fade--t', label: 'fade ↑' },
          { token: '--sf-gradient-fade--b', label: 'fade ↓' },
        ],
      },
    ],
  },

  borders: {
    kind: 'radius',
    blurb: 'Corner radius steps and stroke widths.',
    groups: [
      {
        section: 'Corner radius',
        items: [
          { token: '--sf-radius-s', label: 's' },
          { token: '--sf-radius-m', label: 'm' },
          { token: '--sf-radius-l', label: 'l' },
          { token: '--sf-radius-xl', label: 'xl' },
          { token: '--sf-radius-full', label: 'full' },
        ],
      },
      {
        section: 'Strokes',
        items: [
          { token: '--sf-border-width-1', label: 'width 1' },
          { token: '--sf-border-width-2', label: 'width 2' },
          { token: '--sf-divider-width', label: 'divider' },
        ],
      },
    ],
  },

  shadows: {
    kind: 'shadow',
    blurb: 'Elevation ramp on real surfaces.',
    groups: [
      {
        items: [
          { token: '--sf-shadow-s', label: 's' },
          { token: '--sf-shadow-m', label: 'm' },
          { token: '--sf-shadow-l', label: 'l' },
          { token: '--sf-shadow-xl', label: 'xl' },
          { token: '--sf-shadow-glow', label: 'glow' },
        ],
      },
    ],
  },

  motion: {
    kind: 'motion',
    blurb: 'Durations and easings — the bars replay on every edit.',
    groups: [
      {
        section: 'Durations',
        items: [
          { token: '--sf-duration-instant', label: 'instant' },
          { token: '--sf-duration-fast', label: 'fast' },
          { token: '--sf-duration-normal', label: 'normal' },
          { token: '--sf-duration-slow', label: 'slow' },
        ],
      },
      {
        section: 'Easings',
        items: [
          { token: '--sf-ease-out', label: 'out' },
          { token: '--sf-ease-in', label: 'in' },
          { token: '--sf-ease-in-out', label: 'in-out' },
          { token: '--sf-ease-spring', label: 'spring' },
        ],
      },
    ],
  },

  effects: {
    kind: 'effect',
    blurb: 'Blur, opacity states and the scrim gradient.',
    groups: [
      {
        section: 'Blur',
        items: [{ token: '--sf-blur', label: 'blur' }],
      },
      {
        section: 'Opacity',
        items: [
          { token: '--sf-opacity-muted', label: 'muted' },
          { token: '--sf-opacity-disabled', label: 'disabled' },
        ],
      },
      {
        section: 'Scrim',
        items: [{ token: '--sf-scrim-gradient', label: 'scrim' }],
      },
    ],
  },
};

/**
 * Flattened list of every token referenced by any preview spec — the surface
 * pinned by the tripwire test.
 * @returns {string[]}
 */
export function allPreviewTokens() {
  const out = [];
  for (const spec of Object.values(DOMAIN_PREVIEWS)) {
    for (const g of spec.groups) {
      for (const it of g.items) out.push(it.token);
    }
  }
  return out;
}
