#!/usr/bin/env node
/**
 * Generates optional/tokens.sizes-extended.css
 *
 * Bridge variables: a clamp() that starts at step A's max value (wide viewport)
 * and arrives at step B's min value (narrow viewport), spanning the full
 * fluid range between two non-adjacent scale steps.
 *
 * Generative engine (mirrors core/tokens.css): every endpoint is derived at
 * runtime from the fluid-engine input scalars, so overriding any of them on
 * :root recalibrates the bridges too — no regeneration needed.
 *
 *   step coefficient(min) = base_min * pow(ratio_min, N)
 *   step coefficient(max) = base_max * pow(ratio_max, N)
 *   slope = (A_maxCoeff - B_minCoeff) / (max_vw - min_vw)        [unitless]
 *   bridge = clamp(B_min, slope * (100vw - min_vw*1rem) + B_min, A_max)
 *
 * where N is the step exponent relative to the `m` step (m = 0):
 *   2xs=-3  xs=-2  s=-1  m=0  l=1  xl=2  2xl=3  3xl=4  4xl=5
 *
 * Inputs (core/tokens.css):
 *   --sf-fluid-min-vw / --sf-fluid-max-vw       viewport range (rem, unitless)
 *   --sf-space-ratio-{min,max} / --sf-space-base-{min,max}
 *   --sf-text-ratio-{min,max}  / --sf-text-base-{min,max}
 *
 * Requires CSS pow() (Chrome 125+, Safari 15.4, Firefox 118+).
 */

// Step names in ascending order; exponent N = index - 3 (so `m` = 0).
const STEP_NAMES = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'];
const expOf = (name) => STEP_NAMES.indexOf(name) - 3;

const SPACE_VARS = {
  baseMin:  '--sf-space-base-min',
  baseMax:  '--sf-space-base-max',
  ratioMin: '--sf-space-ratio-min',
  ratioMax: '--sf-space-ratio-max',
  scale:    '--sf-space-scale',
};

const TEXT_VARS = {
  baseMin:  '--sf-text-base-min',
  baseMax:  '--sf-text-base-max',
  ratioMin: '--sf-text-ratio-min',
  ratioMax: '--sf-text-ratio-max',
  scale:    null, // text bridges intentionally omit the scale multiplier
};

// Per-text-size sub-property defaults.
// Convention mirrors the existing --sf-h{1-6}-* token pattern.
// Typographic rationale:
//   • Small text (2xs–s): relaxed leading — needs room to breathe
//   • Body text (m–l):    normal leading — standard reading rhythm
//   • Large text (xl–4xl): progressively tighter — optically correct at display sizes
//   • letter-spacing: tight for large headlines (optical correction), normal elsewhere
//   • max-width: constrain prose-sized text; none for display/headline sizes
const TEXT_SIZE_PROPS = [
  { name: '2xs', lineHeight: 'var(--sf-leading-relaxed)', fontWeight: 'var(--sf-font-weight-body)', letterSpacing: 'var(--sf-tracking-normal)', maxWidth: '55ch' },
  { name: 'xs',  lineHeight: 'var(--sf-leading-relaxed)', fontWeight: 'var(--sf-font-weight-body)', letterSpacing: 'var(--sf-tracking-normal)', maxWidth: '60ch' },
  { name: 's',   lineHeight: 'var(--sf-leading-relaxed)', fontWeight: 'var(--sf-font-weight-body)', letterSpacing: 'var(--sf-tracking-normal)', maxWidth: '65ch' },
  { name: 'm',   lineHeight: 'var(--sf-leading-normal)',  fontWeight: 'var(--sf-font-weight-body)', letterSpacing: 'var(--sf-tracking-normal)', maxWidth: '65ch' },
  { name: 'l',   lineHeight: 'var(--sf-leading-normal)',  fontWeight: 'var(--sf-font-weight-body)', letterSpacing: 'var(--sf-tracking-normal)', maxWidth: 'none' },
  { name: 'xl',  lineHeight: 'var(--sf-leading-snug)',    fontWeight: 'var(--sf-font-weight-body)', letterSpacing: 'var(--sf-tracking-normal)', maxWidth: 'none' },
  { name: '2xl', lineHeight: 'var(--sf-leading-snug)',    fontWeight: 'var(--sf-font-weight-heading)', letterSpacing: 'var(--sf-tracking-normal)', maxWidth: 'none' },
  { name: '3xl', lineHeight: 'var(--sf-leading-tight)',   fontWeight: 'var(--sf-font-weight-heading)', letterSpacing: 'var(--sf-tracking-tight)',  maxWidth: 'none' },
  { name: '4xl', lineHeight: 'var(--sf-leading-tight)',   fontWeight: 'var(--sf-font-weight-heading)', letterSpacing: 'var(--sf-tracking-tight)',  maxWidth: 'none' },
];

// -------------------------------------------------------------------
// Helpers — generative CSS expressions over the fluid-engine inputs
// -------------------------------------------------------------------

// Unitless coefficient: base * pow(ratio, N)  (pow term omitted when N === 0)
function minCoeff(v, n) {
  return n === 0 ? `var(${v.baseMin})` : `var(${v.baseMin}) * pow(var(${v.ratioMin}), ${n})`;
}
function maxCoeff(v, n) {
  return n === 0 ? `var(${v.baseMax})` : `var(${v.baseMax}) * pow(var(${v.ratioMax}), ${n})`;
}

// Bridge expression from step A (larger) down to step B (smaller).
function bridge(v, aName, bName) {
  const na = expOf(aName);
  const nb = expOf(bName);
  const aMax = maxCoeff(v, na);          // unitless
  const bMin = minCoeff(v, nb);          // unitless
  const slope = `(${aMax} - ${bMin}) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw))`;
  const mid = `calc(${slope} * (100vw - var(--sf-fluid-min-vw) * 1rem) + ${bMin} * 1rem)`;
  const clampExpr = `clamp(calc(${bMin} * 1rem), ${mid}, calc(${aMax} * 1rem))`;
  return v.scale ? `calc(${clampExpr} * var(${v.scale}))` : clampExpr;
}

// Pad token name to align values in columns
function padName(name, width) {
  return name.padEnd(width);
}

// -------------------------------------------------------------------
// Build output
// -------------------------------------------------------------------

const lines = [];

lines.push(`/* ============================================================
   SLASHED — optional/tokens.sizes-extended.css
   GENERATED by scripts/gen-sizes-extended.js — do not edit by hand.

   Optional module. Extends the core spacing and typography scales
   with two additions:

   1. BRIDGE VARIABLES — fluid clamp() values that span between two
      non-adjacent scale steps. Where --sf-space-l compresses within
      its own range, --sf-space-l-to-m starts at l's max value on
      wide viewports and arrives at m's min on narrow viewports —
      a larger range of motion for contexts that need it. Computed
      from the same generative fluid engine as the core scales, so
      overriding --sf-fluid-*, --sf-*-ratio-*, or --sf-*-base-*
      recalibrates these bridges automatically.

   2. PER-TEXT-SIZE SUB-PROPERTIES — individual override knobs for
      line-height, font-weight, letter-spacing, and max-width on
      each text size step. The defaults encode typographic convention
      (large text = tight leading; small text = relaxed leading) but
      every value is a token authors can override.

   Load after core/tokens.css:
     @import "optional/tokens.sizes-extended.css";

   Requires CSS pow() (Chrome 125+, Safari 15.4, Firefox 118+).

   Token families:
     --sf-space-{A}-to-{B}            spacing bridge (A > B)
     --sf-text-{A}-to-{B}             text bridge (A > B)
     --sf-text-{size}-line-height      per-size line-height
     --sf-text-{size}-font-weight      per-size font-weight
     --sf-text-{size}-letter-spacing   per-size letter-spacing
     --sf-text-{size}-max-width        per-size max-width
   ============================================================ */

@layer slashed.tokens {
  :root {`);

// -------------------------------------------------------------------
// 1. Spacing bridges
// -------------------------------------------------------------------

lines.push(`
    /* ----------------------------------------------------------
       Spacing bridges
       Full descending matrix: --sf-space-{larger}-to-{smaller}
       Each token is a fluid clamp spanning from the larger step's
       max value down to the smaller step's min value.
       Respects --sf-space-scale like all fluid spacing tokens.
       ---------------------------------------------------------- */`);

for (let i = STEP_NAMES.length - 1; i >= 1; i--) {
  const a = STEP_NAMES[i];
  lines.push('');
  for (let j = i - 1; j >= 0; j--) {
    const b = STEP_NAMES[j];
    const tokenName = `--sf-space-${a}-to-${b}:`;
    lines.push(`    ${padName(tokenName, 28)} ${bridge(SPACE_VARS, a, b)};`);
  }
}

// -------------------------------------------------------------------
// 2. Text bridges
// -------------------------------------------------------------------

lines.push(`
    /* ----------------------------------------------------------
       Text bridges
       Full descending matrix: --sf-text-{larger}-to-{smaller}
       No --sf-text-scale multiplier — consistent with how the
       base text tokens are consumed by the text-bridge contract.
       ---------------------------------------------------------- */`);

for (let i = STEP_NAMES.length - 1; i >= 1; i--) {
  const a = STEP_NAMES[i];
  lines.push('');
  for (let j = i - 1; j >= 0; j--) {
    const b = STEP_NAMES[j];
    const tokenName = `--sf-text-${a}-to-${b}:`;
    lines.push(`    ${padName(tokenName, 26)} ${bridge(TEXT_VARS, a, b)};`);
  }
}

// -------------------------------------------------------------------
// 3. Per-text-size sub-properties
// -------------------------------------------------------------------

lines.push(`
    /* ----------------------------------------------------------
       Per-text-size sub-properties
       Override knobs for each body text size step. Defaults encode
       standard typographic conventions; override any value globally
       here or locally via CSS custom property on a scoped element.

       These tokens are NOT auto-applied — they are opt-in composable
       overrides. Wire them up in your own rules:
         .my-element {
           font-size:      var(--sf-text-xl);
           line-height:    var(--sf-text-xl-line-height);
           font-weight:    var(--sf-text-xl-font-weight);
           letter-spacing: var(--sf-text-xl-letter-spacing);
           max-width:      var(--sf-text-xl-max-width);
         }
       ---------------------------------------------------------- */`);

for (const size of TEXT_SIZE_PROPS) {
  const prefix = `--sf-text-${size.name}`;
  lines.push('');
  lines.push(`    ${padName(prefix + '-line-height:', 36)}  ${size.lineHeight};`);
  lines.push(`    ${padName(prefix + '-font-weight:', 36)}  ${size.fontWeight};`);
  lines.push(`    ${padName(prefix + '-letter-spacing:', 36)}  ${size.letterSpacing};`);
  lines.push(`    ${padName(prefix + '-max-width:', 36)}  ${size.maxWidth};`);
}

lines.push(`
  }
}`);

process.stdout.write(lines.join('\n') + '\n');
