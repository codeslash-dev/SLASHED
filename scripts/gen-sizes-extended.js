#!/usr/bin/env node
/**
 * Generates optional/tokens.sizes-extended.css
 *
 * Bridge variables: a clamp() that starts at step A's max value (wide viewport)
 * and arrives at step B's min value (narrow viewport), spanning the full
 * fluid range between two non-adjacent scale steps.
 *
 * Formula:  clamp(B_min, slope * (100vw - VP_MIN) + B_min, A_max)
 * where:    slope = (A_max - B_min) / VP_RANGE
 *           VP_MIN   = 22.5rem (360px — narrowest supported viewport)
 *           VP_RANGE = 67.5rem (90rem max − 22.5rem min)
 */

const VP_MIN   = 22.5;
const VP_RANGE = 67.5;

// -------------------------------------------------------------------
// Source values extracted from core/tokens.css.
// SYNC REQUIRED: if the spacing or text scale changes in core/tokens.css,
// update SPACE_STEPS (mirrors the core --sf-space-{size} scale values)
// and TEXT_STEPS (mirrors the core --sf-text-{size} scale values) here,
// then re-run `node scripts/gen-sizes-extended.js`
// to regenerate optional/tokens.sizes-extended.css.
// -------------------------------------------------------------------

const SPACE_STEPS = [
  { name: '2xs', min: 0.51, max: 0.84 },
  { name: 'xs',  min: 0.64, max: 1.13 },
  { name: 's',   min: 0.80, max: 1.50 },
  { name: 'm',   min: 1.00, max: 2.00 },
  { name: 'l',   min: 1.25, max: 2.67 },
  { name: 'xl',  min: 1.56, max: 3.55 },
  { name: '2xl', min: 1.95, max: 4.74 },
  { name: '3xl', min: 2.44, max: 6.31 },
  { name: '4xl', min: 3.05, max: 8.42 },
];

const TEXT_STEPS = [
  { name: '2xs', min: 0.51, max: 0.53 },
  { name: 'xs',  min: 0.64, max: 0.70 },
  { name: 's',   min: 0.80, max: 0.94 },
  { name: 'm',   min: 1.00, max: 1.25 },
  { name: 'l',   min: 1.25, max: 1.67 },
  { name: 'xl',  min: 1.56, max: 2.22 },
  { name: '2xl', min: 1.95, max: 2.96 },
  { name: '3xl', min: 2.44, max: 3.95 },
  { name: '4xl', min: 3.05, max: 5.26 },
];

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
// Helpers
// -------------------------------------------------------------------

function rem(n) {
  const s = n.toString();
  return s.includes('.') ? s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '') + 'rem' : s + 'rem';
}

function slope(maxA, minB) {
  return ((maxA - minB) / VP_RANGE).toPrecision(15).replace(/\.?0+$/, '');
}

function spaceBridge(a, b) {
  const s = slope(a.max, b.min);
  return `calc(clamp(${rem(b.min)}, calc(${s} * (100vw - ${VP_MIN}rem) + ${rem(b.min)}), ${rem(a.max)}) * var(--sf-space-scale))`;
}

function textBridge(a, b) {
  const s = slope(a.max, b.min);
  return `clamp(${rem(b.min)}, calc(${s} * (100vw - ${VP_MIN}rem) + ${rem(b.min)}), ${rem(a.max)})`;
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
   Optional module. Extends the core spacing and typography scales
   with two additions:

   1. BRIDGE VARIABLES — fluid clamp() values that span between two
      non-adjacent scale steps. Where --sf-space-l compresses within
      its own range, --sf-space-l-to-m starts at l's max value on
      wide viewports and arrives at m's min on narrow viewports —
      a larger range of motion for contexts that need it.

   2. PER-TEXT-SIZE SUB-PROPERTIES — individual override knobs for
      line-height, font-weight, letter-spacing, and max-width on
      each text size step. The defaults encode typographic convention
      (large text = tight leading; small text = relaxed leading) but
      every value is a token authors can override.

   Load after core/tokens.css:
     @import "optional/tokens.sizes-extended.css";

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

for (let i = SPACE_STEPS.length - 1; i >= 1; i--) {
  const a = SPACE_STEPS[i];
  lines.push('');
  for (let j = i - 1; j >= 0; j--) {
    const b = SPACE_STEPS[j];
    const tokenName = `--sf-space-${a.name}-to-${b.name}:`;
    lines.push(`    ${padName(tokenName, 28)} ${spaceBridge(a, b)};`);
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
       base text tokens are defined in core/tokens.css.
       ---------------------------------------------------------- */`);

for (let i = TEXT_STEPS.length - 1; i >= 1; i--) {
  const a = TEXT_STEPS[i];
  lines.push('');
  for (let j = i - 1; j >= 0; j--) {
    const b = TEXT_STEPS[j];
    const tokenName = `--sf-text-${a.name}-to-${b.name}:`;
    lines.push(`    ${padName(tokenName, 26)} ${textBridge(a, b)};`);
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

       Consumed by base styles — apply like:
         .my-element { font-size: var(--sf-text-xl); }
         and these tokens are available to set its sub-properties.
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
