/**
 * Token stability-tier contract — the single source of truth.
 *
 * Two orthogonal axes describe every `--sf-*` token:
 *
 * 1. STABILITY TIER — the SemVer/documentation contract:
 *      PUBLIC          — everyday knobs, prominently documented. SemVer-stable.
 *      PUBLIC-ADVANCED — same SemVer guarantee, but niche/powerful.
 *      INTERNAL        — implementation detail; may change without a major bump.
 *
 *    INTERNAL and PUBLIC-ADVANCED are finite, enumerated sets (plus a small,
 *    explicitly-documented set of ADVANCED name patterns for generated token
 *    families); every other `--sf-*` token defaults to PUBLIC. If a token ever
 *    needs a tier other than PUBLIC it must be added below — nothing is guessed.
 *
 * 2. ROLE — knob vs consumption (a documentation aid, NOT a SemVer signal):
 *      knob        — an INPUT you set to configure the system (a literal
 *                    primitive value: a length, number, colour literal,
 *                    keyword, font stack, easing curve, …).
 *      consumption — a ready-to-use OUTPUT you read: a value DERIVED from other
 *                    tokens (it references `var(--sf-…)`, directly or inside
 *                    light-dark()/oklch(from …)/color-mix()).
 *
 *    Role is computed deterministically from the token's declared value — see
 *    `roleOf()`. It does not affect the stability guarantee (PUBLIC and
 *    PUBLIC-ADVANCED share the same one); it only tells consumers which tokens
 *    they are expected to SET versus READ.
 *
 * This mirrors the PUBLIC API vs INTERNAL contract declared in the
 * core/tokens.css header and docs/architecture.md.
 *
 * Imported by:
 *   scripts/gen-token-index.js
 *   scripts/gen-api-index.js
 */

const INTERNAL = new Set([
  '--sf-is-dark',
]);

const ADVANCED = new Set([
  '--sf-lumlocker',
  '--sf-contrast-bias', '--sf-contrast-threshold',
  '--sf-shadow-strength', '--sf-shadow-color', '--sf-shadow-glow-color',
  '--sf-font-features', '--sf-font-variation', '--sf-optical-sizing',
  '--sf-space-scale', '--sf-text-scale', '--sf-text-display-scale',
  '--sf-radius-scale', '--sf-motion-scale', '--sf-section-scale',
  '--sf-density',
  '--sf-leading-taper',
  '--sf-fluid-min-vw', '--sf-fluid-max-vw',
  '--sf-text-ratio-min', '--sf-text-ratio-max',
  '--sf-text-base-min', '--sf-text-base-max',
  '--sf-text-display-base-min', '--sf-text-display-base-max',
  '--sf-space-ratio-min', '--sf-space-ratio-max',
  '--sf-space-base-min', '--sf-space-base-max',
  '--sf-scroll-timeline-range-start', '--sf-scroll-timeline-range-end',
  '--sf-mask-scrim-start', '--sf-mask-scrim-end',
  '--sf-safe-top', '--sf-safe-bottom', '--sf-safe-left', '--sf-safe-right',
  '--sf-radius-outer',
  // .sf-btn flatten-all overrides — niche/powerful: once set they collapse the
  // whole --xs…xl size ladder to one value. Everyday sizing goes through the
  // proportional --sf-btn-font-scale multiplier and the per-size knobs instead.
  '--sf-btn-font-size', '--sf-btn-padding-block', '--sf-btn-padding-inline', '--sf-btn-min-height',
  '--sf-is-active', '--sf-is-current', '--sf-is-pressed', '--sf-is-open',
  '--sf-focus-ring-shadow',
  '--sf-print-page-margin', '--sf-print-page-size', '--sf-print-base-size',
]);

// ADVANCED name patterns — for GENERATED token families too large (and too
// mechanically named) to enumerate by hand, where every member shares the same
// niche/powerful character. Kept deliberately tiny and tightly anchored so a
// pattern can never accidentally capture an everyday PUBLIC token.
//
//   · Fluid pairwise interpolation bridges (removed in v0.6.0):
//     `--sf-{space|text}-{step}-to-{step}` — pattern retained so any stale
//     reference in user CSS doesn't accidentally tier-promote a future token.
const STEP = '(?:2xs|xs|s|m|l|xl|2xl|3xl|4xl)';
const ADVANCED_PATTERNS = [
  new RegExp(`^--sf-(?:space|text)-${STEP}-to-${STEP}$`),
  //   · Palette ramp lightness anchors (core/tokens.css):
  //     `--sf-palette-tint-l` / `--sf-palette-shade-l` — absolute OKLCH
  //     lightness targets the tint/shade steps pull toward, reshaping the
  //     whole numeric palette ladder at once. Niche/powerful, documented
  //     as PUBLIC-ADVANCED in the core palette section.
  /^--sf-palette-(?:tint|shade)-l$/,
];

/**
 * Stability tier of a token name.
 * @param {string} name custom-property name (e.g. "--sf-color-primary")
 * @returns {'PUBLIC'|'PUBLIC-ADVANCED'|'INTERNAL'}
 */
function tierOf(name) {
  if (INTERNAL.has(name)) return 'INTERNAL';
  if (ADVANCED.has(name)) return 'PUBLIC-ADVANCED';
  if (ADVANCED_PATTERNS.some(re => re.test(name))) return 'PUBLIC-ADVANCED';
  return 'PUBLIC';
}

// A token's value is a derived OUTPUT when it composes other tokens — i.e. it
// references `var(--sf-…)` anywhere (directly, or nested inside light-dark(),
// oklch(from …), color-mix(), calc(), clamp(), …). Anything else is a literal
// primitive INPUT.
const TOKEN_REFERENCE = /var\(\s*--sf-/;

// Explicit knob overrides — tokens whose DEFAULT value happens to reference
// another token (e.g. for automatic dark-mode adaptation) but are still
// user-settable inputs. The heuristic would mis-classify these as consumption.
const FORCED_KNOB = new Set([
  // Default wraps the scalar in calc(N + var(--sf-is-dark)*0.17) so dark mode
  // auto-boosts opacity. Users set the base scalar; the calc is the delivery
  // vehicle, not the consumed output.
  '--sf-shadow-strength',
]);

/**
 * Role of a token — whether consumers are expected to SET it (knob) or READ it
 * (consumption) — derived deterministically from its declared value.
 *
 * Orthogonal to {@link tierOf}: a token of any tier can be a knob or a
 * consumption value. Role carries no SemVer meaning; it is a documentation aid.
 *
 * @param {string|null|undefined} value the token's declared value
 * @param {string} [name] the token name (used for explicit FORCED_KNOB overrides)
 * @returns {'knob'|'consumption'}
 */
function roleOf(value, name) {
  if (name && FORCED_KNOB.has(name)) return 'knob';
  return TOKEN_REFERENCE.test(value || '') ? 'consumption' : 'knob';
}

export { INTERNAL, ADVANCED, ADVANCED_PATTERNS, FORCED_KNOB, tierOf, roleOf };
