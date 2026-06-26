/**
 * Bundle / module picker model.
 *
 * Structural data (which logical bundles exist, their module composition, CDN
 * paths) is auto-synced from the framework's `bundle.config.json` into
 * `data/bundles.generated.json` by scripts/sync-api.mjs — so the picker can
 * never drift from what actually ships. The *prose* (what each bundle and each
 * optional module is for) is curated here, the same data/curation split used by
 * basics.js. New bundles or modules appear automatically; only their blurbs
 * need a one-line addition here.
 */
import manifest from '../data/bundles.generated.json' with { type: 'json' };
import { tokenByName } from './model.js';

/** Bundles, smallest → largest footprint (as emitted by the sync). */
export const BUNDLES_RAW = Array.isArray(manifest.bundles) ? manifest.bundles : [];
export const CDN_BASE = manifest?._sync?.cdnBase ?? '';

/** The sensible default for most projects. */
export const DEFAULT_BUNDLE_ID = 'optimal';

/** Per-bundle copy. Falls back to a humanised id for any future bundle. */
const BUNDLE_META = {
  optimal: {
    label: 'Optimal',
    tagline: 'Core + classless form styling. Recommended default for most projects.',
  },
  'optimal-components': {
    label: 'Optimal + Components',
    tagline: 'Optimal plus ready-made component classes (.sf-button, .sf-card…).',
  },
  'optimal-utilities': {
    label: 'Optimal + Utilities',
    tagline: 'Optimal plus the utility classes (truncate, line-clamp, aspect…).',
  },
  full: {
    label: 'Full',
    tagline: 'Everything — forms, components and utilities.',
  },
};

/** What each optional module adds, keyed by its source path. */
const MODULE_META = {
  'optional/forms.css': 'Classless styling for native form controls (input, select, checkbox…)',
  'optional/tokens.components.css': 'Tokens that drive the optional component classes',
  'optional/components.css': 'Ready-made component classes (.sf-button, .sf-card, .sf-badge…)',
  'optional/utilities.css': 'Utility classes (.sf-truncate, .sf-line-clamp-*, .sf-aspect-*…)',
  'optional/legacy.css': 'Back-compat shims for renamed/removed APIs — safe during migration',
};

/** Humanise a bundle id when no explicit label is curated. */
function humanise(id) {
  return id.replace(/[-.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Enriched bundle list the UI renders: manifest fields + curated label/tagline
 * + a friendly feature list derived from the optional modules.
 */
export const BUNDLES = BUNDLES_RAW.map((b) => {
  const meta = BUNDLE_META[b.id] ?? { label: humanise(b.id), tagline: '' };
  return {
    ...b,
    label: meta.label,
    tagline: meta.tagline,
    features: (b.optionalModules ?? []).map((m) => ({
      module: m,
      blurb: MODULE_META[m] ?? m.replace(/^optional\//, '').replace(/\.css$/, ''),
    })),
  };
});

/** Bundle order by footprint (ids), smallest first. */
export const BUNDLE_ORDER = BUNDLES.map((b) => b.id);

/** Look up an enriched bundle by id. */
export function bundleById(id) {
  return BUNDLES.find((b) => b.id === id) ?? null;
}

/**
 * Recommend the leanest bundle that includes every token the user has
 * overridden. Core tokens belong to every bundle, so a core-only config
 * recommends Optimal; touching a component/utility token narrows the
 * choice automatically. An unknown token (no bundle membership) falls back to
 * the full superset so the config can't silently lose a token at runtime.
 *
 * @param {Record<string, string>} overrides
 * @returns {string} a bundle id
 */
export function recommendBundle(overrides) {
  const names = Object.keys(overrides || {});
  if (names.length === 0) return DEFAULT_BUNDLE_ID;

  /** @type {Set<string> | null} */
  let candidates = null;
  for (const name of names) {
    const tok = tokenByName.get(name);
    const member = Array.isArray(tok?.bundles) ? tok.bundles : [];
    if (member.length === 0) return 'full';
    const set = new Set(member);
    candidates = candidates ? new Set([...candidates].filter((x) => set.has(x))) : set;
    if (candidates.size === 0) return 'full';
  }
  // BUNDLES is sorted smallest → largest, so the first match is the leanest.
  for (const b of BUNDLES) if (candidates.has(b.id)) return b.id;
  return 'full';
}

/**
 * Embed snippets for a bundle: an HTML <link> and a CSS @import. The override
 * CSS (the configurator's other export) layers on top via @layer
 * slashed.overrides, so load order is: framework bundle first, overrides after.
 *
 * @param {{ cdn: string }} bundle
 * @returns {{ link: string, import: string }}
 */
export function embedSnippets(bundle) {
  const cdn = bundle?.cdn ?? '';
  return {
    link: `<link rel="stylesheet" href="${cdn}">`,
    import: `@import "${cdn}";`,
  };
}
