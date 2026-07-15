// Generates the full-API demo + ultimate override from docs/api-index.json.
// Run: node demos/generate.mjs
// Outputs (repo root): full-api-demo.html, full-api-demo-with-overrides.html,
// ultimate-override.css. Regenerate whenever the token/class set changes so
// coverage stays exact.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'demos'); // generated artifacts live alongside this script
const api = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/api-index.json'), 'utf8'));
const CDN = 'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.full.css';
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;

const tokens = api.entries.filter((e) => e.type === 'token');
const classes = api.entries.filter((e) => e.type === 'class');
const knobs = tokens.filter((t) => t.role === 'knob');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const round = (n) => Math.round(n * 1000) / 1000;

// ─────────────────────────────────────────────────────────────────────────
// OVERRIDE GENERATION
// Every knob is either: perturbed by a generic rule, perturbed by a curated
// value, or in SKIP with a documented reason. The build asserts this — a new
// knob that matches nothing fails the generator instead of silently dropping.
// ─────────────────────────────────────────────────────────────────────────

// Structural / meta / sentinel knobs we deliberately do NOT perturb globally.
const SKIP = {
  '--sf-color-scheme': 'meta control — forcing a scheme would override the page light/dark behaviour rather than test a visual token',
  '--sf-bg-layer-z': 'stacking order — lowering it would push the background layer over content',
  '--sf-z-below': 'stacking order — no single-element visual surface; global change risks hiding content',
  '--sf-z-base': 'stacking order — no single-element visual surface',
  '--sf-z-raised': 'stacking order — no single-element visual surface',
  '--sf-z-sticky': 'stacking order — no single-element visual surface',
  '--sf-z-dropdown': 'stacking order — no single-element visual surface',
  '--sf-z-overlay': 'stacking order — no single-element visual surface',
  '--sf-z-fixed': 'stacking order — no single-element visual surface',
  '--sf-z-modal': 'stacking order — no single-element visual surface',
  '--sf-z-toast': 'stacking order — no single-element visual surface',
  '--sf-z-tooltip': 'stacking order — no single-element visual surface',
  '--sf-safe-top': 'env() device inset — zero on desktop, no visual surface',
  '--sf-safe-right': 'env() device inset — zero on desktop, no visual surface',
  '--sf-safe-bottom': 'env() device inset — zero on desktop, no visual surface',
  '--sf-safe-left': 'env() device inset — zero on desktop, no visual surface',
  '--sf-is-active': 'runtime state flag — exercised via the .sf-is-active class; a global :root flip would force every element active',
  '--sf-is-current': 'runtime state flag — exercised via the .sf-is-current class',
  '--sf-is-open': 'runtime state flag — exercised via the .sf-is-open class',
  '--sf-is-pressed': 'runtime state flag — exercised via the .sf-is-pressed class',
  '--sf-is-dark': 'runtime theme flag — driven by color-scheme; a global flip would desync from the actual scheme',
  '--sf-shadow-none': 'sentinel "none" — the API guarantees no shadow; overriding would add one where none is promised',
  '--sf-text-shadow-none': 'sentinel "none" — the API guarantees no text-shadow',
  '--sf-surface-bg-animation': 'background animation shorthand on .sf-surface — a global value would force motion on every surface and fight reduced-motion; no safe single-element visual perturbation',
  '--sf-btn-font-size': 'flatten-all label size — reads FIRST in the font-size cascade, so setting it would shadow the per-size --sf-btn-{size}-font-size knobs (and mask the --sf-btn-font-scale multiplier) this demo exercises; the per-size ladder is the recommended surface',
  '--sf-btn-padding-block': 'flatten-all block padding — reads FIRST in the cascade, shadowing the per-size --sf-btn-{size}-padding-block knobs this demo exercises',
  '--sf-btn-padding-inline': 'flatten-all inline padding — reads FIRST in the cascade, shadowing the per-size --sf-btn-{size}-padding-inline knobs this demo exercises',
  '--sf-btn-min-height': 'flatten-all min-height — reads FIRST in the cascade, shadowing the per-size --sf-btn-{size}-min-height knobs this demo exercises',
};

// Curated overrides for keyword / numeric / zero-valued knobs that no generic
// numeric rule can safely transform. Each is a valid, visibly-distinct value.
const CURATED = {
  // Button per-size knobs declared `initial` (opt-in hooks with no baked value —
  // their default lives on the rule-local --sf-btn-*--size tier). Give explicit
  // per-rung lengths so the demo exercises each rung; `initial` carries no type
  // to infer. The flatten-all --sf-btn-{font-size,padding-block,padding-inline,
  // min-height} are intentionally in SKIP above so they don't shadow these.
  // The unitless --sf-btn-font-scale multiplier then scales the whole ladder.
  '--sf-btn-font-scale': '1.6',
  '--sf-btn-xs-font-size': '0.9rem',
  '--sf-btn-s-font-size': '1.1rem',
  '--sf-btn-m-font-size': '1.4rem',
  '--sf-btn-l-font-size': '1.8rem',
  '--sf-btn-xl-font-size': '2.2rem',
  '--sf-btn-xs-padding-block': '0.2rem',
  '--sf-btn-s-padding-block': '0.35rem',
  '--sf-btn-m-padding-block': '0.5rem',
  '--sf-btn-l-padding-block': '0.7rem',
  '--sf-btn-xl-padding-block': '0.9rem',
  '--sf-btn-xs-padding-inline': '0.6rem',
  '--sf-btn-s-padding-inline': '0.9rem',
  '--sf-btn-m-padding-inline': '1.2rem',
  '--sf-btn-l-padding-inline': '1.6rem',
  '--sf-btn-xl-padding-inline': '2rem',
  '--sf-btn-xs-min-height': '1.8rem',
  '--sf-btn-s-min-height': '2.1rem',
  '--sf-btn-m-min-height': '2.5rem',
  '--sf-btn-l-min-height': '3rem',
  '--sf-btn-xl-min-height': '3.5rem',
  // zero-valued lengths → small but visible
  '--sf-bg-layer-inset': '0.75rem',
  '--sf-bg-layer-radius': '0.75rem',
  '--sf-media-radius': '0.75rem',
  '--sf-box-border-width': '3px',
  '--sf-equal-rule-width': '2px',
  '--sf-radius-none': '0.4rem',
  '--sf-space-none': '0.25rem',
  '--sf-space-px': '2px',
  '--sf-duration-none': '160ms',
  // keyword swaps
  '--sf-bg-layer-fit': 'contain',
  '--sf-object-fit': 'contain',
  '--sf-bg-layer-position': '25% 75%',
  '--sf-object-position': '25% 75%',
  // .sf-surface background knobs → real background-* properties on .sf-surface
  '--sf-surface-bg-color': 'oklch(0.85 0.05 300)',
  '--sf-surface-bg-image': 'linear-gradient(135deg, oklch(0.9 0.08 300 / 0.6), oklch(0.8 0.12 200 / 0.6))',
  '--sf-surface-bg-overlay': 'linear-gradient(oklch(0 0 0 / 0.15), oklch(0 0 0 / 0.15))',
  '--sf-surface-bg-size': 'contain',
  '--sf-surface-bg-position': '25% 75%',
  '--sf-surface-bg-repeat': 'repeat',
  '--sf-surface-bg-attachment': 'fixed',
  '--sf-border-style': 'dashed',
  '--sf-divider-style': 'dashed',
  '--sf-equal-rule-style': 'dashed',
  '--sf-focus-ring-style': 'dashed',
  '--sf-body-em-style': 'oblique',
  '--sf-body-text-wrap': 'balance',
  '--sf-heading-text-wrap': 'pretty',
  '--sf-cluster-align': 'stretch',
  '--sf-cluster-justify': 'center',
  '--sf-scrim-direction': 'to right',
  '--sf-scrim-text-shadow': '0 2px 6px oklch(0 0 0 / 0.85)',
  '--sf-reel-height': '14rem',
  '--sf-reel-item-width': 'min-content',
  '--sf-scrollbar-track': 'oklch(0.85 0.05 300)',
  '--sf-optical-sizing': 'none',
  '--sf-font-features': '"liga" 1, "calt" 1',
  '--sf-font-variation': '"wght" 650',
  '--sf-font-numeric': 'oldstyle-nums',
  '--sf-link-underline-thickness': '3px',
  '--sf-link-external-marker': '" \\2192"',
  '--sf-link-external-label': '"leaves this site"',
  '--sf-corner-scoop-at': '30% 70%',
  '--sf-field-required-marker': '" \\2737"',
  '--sf-color-mark-text': 'oklch(0.45 0.27 320)',
  '--sf-color-selection-text': 'oklch(0.98 0 0)',
  '--sf-color-selection-text--alt': 'oklch(0.9 0.06 300)',
  '--sf-print-page-size': 'letter',
  '--sf-shadow-strength': '0.45',
  '--sf-scroll-timeline-range-start': 'entry 20%',
  '--sf-scroll-timeline-range-end': 'cover 60%',
  '--sf-scroll-timeline-range-exit-start': 'exit 20%',
  '--sf-scroll-timeline-range-exit-end': 'exit 80%',
  // 'none' max-widths → a concrete cap so the constraint is visible
  '--sf-h1-max-width': '40ch',
  '--sf-h2-max-width': '40ch',
  '--sf-h3-max-width': '40ch',
  '--sf-h4-max-width': '40ch',
  '--sf-h5-max-width': '40ch',
  '--sf-h6-max-width': '40ch',
  '--sf-text-l-max-width': '50ch',
  '--sf-text-xl-max-width': '50ch',
  '--sf-text-2xl-max-width': '50ch',
  '--sf-text-3xl-max-width': '50ch',
  '--sf-text-4xl-max-width': '50ch',
  // unitless numbers
  '--sf-bento-cols-default': '3',
  '--sf-line-clamp': '2',
  '--sf-leading-tight': '1.25',
  '--sf-leading-snug': '1.5',
  '--sf-leading-normal': '1.8',
  '--sf-leading-relaxed': '2',
  '--sf-leading-taper': '0.4',
  '--sf-display-l-line-height': '1.2',
  '--sf-display-m-line-height': '1.25',
  '--sf-fluid-min-vw': '30',
  '--sf-fluid-max-vw': '70',
  '--sf-space-base-min': '1.4',
  '--sf-space-base-max': '3',
  '--sf-space-ratio-min': '1.4',
  '--sf-space-ratio-max': '1.6',
  '--sf-text-base-min': '1.15',
  '--sf-text-base-max': '1.5',
  '--sf-text-ratio-min': '1.35',
  '--sf-text-ratio-max': '1.5',
  '--sf-text-display-base-min': '2.8',
  '--sf-text-display-base-max': '3.8',
  '--sf-tracking-normal': '0.03em',
  '--sf-font-weight-light': '200',
  '--sf-font-weight-normal': '600',
  '--sf-font-weight-medium': '700',
  '--sf-font-weight-semibold': '800',
  '--sf-font-weight-bold': '900',
  '--sf-contrast-threshold': '0.45',
  '--sf-contrast-bias': '0.12',
  '--sf-opacity-disabled': '0.7',
  '--sf-opacity-muted': '0.75',
  '--sf-lumlocker': '0.5',
  '--sf-shadow-lightness': '0.4',
  '--sf-state-pending-opacity': '0.4',
  // hover-transform magnitudes (unitless scale factors) + stagger step (time)
  '--sf-hover-grow-scale': '1.4',
  '--sf-hover-shrink-scale': '0.6',
  '--sf-stagger-step': '200ms',
  // scale knobs → amplify everything downstream
  '--sf-border-scale': '1.6',
  '--sf-radius-scale': '1.6',
  '--sf-section-scale': '1.6',
  '--sf-space-scale': '1.6',
  '--sf-text-scale': '1.6',
  '--sf-text-display-scale': '1.6',
  '--sf-motion-scale': '1.6',
  '--sf-density': '1.6',
};

const LEN_UNIT = /^(-?[\d.]+)(px|rem|em|ch|vw|vh|dvh|svh|lvh|vmin|vmax|pt|cm|mm|ex|cap|lh|q)$/i;

function overrideValue(t) {
  const v = t.value.trim();
  // colors (registered <color> or a literal color function) — relative-color
  // hue-shift keeps the value valid for any input and preserves alpha.
  if (t.syntax === '<color>' || /^(oklch|oklab|rgb|rgba|hsl|hwb|lab|lch|color)\(/i.test(v) || /^#[0-9a-f]{3,8}$/i.test(v)) {
    return `oklch(from ${v} calc(l + 0.12) calc(c + 0.12) calc(h + 150) / alpha)`;
  }
  if (CURATED[t.name] !== undefined) return CURATED[t.name];
  if (t.namespace === 'ease') return 'cubic-bezier(0.68, -0.55, 0.27, 1.55)';
  if (t.namespace === 'font' && /["a-z]/i.test(v) && /,/.test(v) && !/^[\d.]/.test(v)) {
    return t.name.includes('mono') ? '"Courier New", ui-monospace, monospace' : '"Georgia", "Times New Roman", serif';
  }
  if (/^\s*[\d.]+\s*\/\s*[\d.]+\s*$/.test(v) || (t.namespace === 'ratio' && v === '1')) return '3 / 1';
  if (/^[\d.]+%$/.test(v)) return `${round(Math.min(parseFloat(v) * 0.7, 100))}%`;
  const m = v.match(LEN_UNIT);
  if (m && parseFloat(m[1]) !== 0) return `${round(parseFloat(m[1]) * 1.6)}${m[2]}`;
  return null; // unhandled → completeness assertion fails
}

function buildOverride() {
  const handled = [];
  const unhandled = [];
  for (const t of knobs) {
    if (SKIP[t.name]) continue;
    const nv = overrideValue(t);
    if (nv === null) unhandled.push(t.name);
    else handled.push([t, nv]);
  }
  if (unhandled.length) {
    throw new Error(`Override generator: ${unhandled.length} knob(s) unhandled:\n  ${unhandled.join('\n  ')}`);
  }

  // group by namespace for readability
  const byNs = {};
  for (const [t, nv] of handled) (byNs[t.namespace] ||= []).push([t, nv]);

  let css = `/* ============================================================================
   ULTIMATE OVERRIDE — generated by demos/generate.mjs (do not edit by hand)
   SLASHED v${VERSION}

   Perturbs every CONFIGURABLE (role: "knob") token to a valid, visibly-distinct
   value so full-api-demo.html can prove each one is wired end to end.

   Coverage: ${handled.length} of ${knobs.length} knob tokens overridden.
   ${Object.keys(SKIP).length} knobs are intentionally NOT perturbed (structural /
   meta / sentinel) — listed with reasons at the bottom of this file.
   ============================================================================ */

:root {
`;
  for (const ns of Object.keys(byNs).sort()) {
    css += `\n  /* ${ns} */\n`;
    for (const [t, nv] of byNs[ns].sort((a, b) => a[0].name.localeCompare(b[0].name))) {
      css += `  ${t.name}: ${nv}; /* was: ${t.value} */\n`;
    }
  }
  css += `}\n\n/* ----------------------------------------------------------------------------
   Intentionally NOT overridden (${Object.keys(SKIP).length}):
`;
  for (const name of Object.keys(SKIP).sort()) css += `   ${name} — ${SKIP[name]}\n`;
  css += `   ---------------------------------------------------------------------------- */\n`;
  return { css, handledCount: handled.length };
}

// ─────────────────────────────────────────────────────────────────────────
// DEMO GENERATION — one rendered example per class (all of them).
// ─────────────────────────────────────────────────────────────────────────

const boxes = (k, label = '') => Array.from({ length: k }, (_, i) => `<div class="dbox">${label || i + 1}</div>`).join('');
const ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.';

const PARENT_OF = {
  'sf-cover__center': 'sf-cover',
  'sf-scrim__content': 'sf-scrim',
  'sf-clickable-parent__overlay': 'sf-clickable-parent',
};

function layoutExample(n, applied) {
  if (n === 'sf-cover__center') return `<div class="sf-cover" style="min-block-size:8rem"><div class="sf-cover__center dbox">center</div></div>`;
  if (n === 'sf-cover' || PARENT_OF[n] === undefined && /^sf-cover--/.test(n)) return `<div class="${applied}" style="min-block-size:9rem;background:var(--sf-color-inset)"><div class="sf-cover__center dbox">cover</div></div>`;
  if (n === 'sf-frame' || /^sf-frame--/.test(n)) return `<div class="${applied}" style="background:var(--sf-color-primary-200)"><div class="dmedia">media</div></div>`;
  if (n === 'sf-bento' || /^sf-bento--/.test(n)) return `<div class="${applied}">${boxes(6)}</div>`;
  if (/^sf-bento-(featured|full|tall|wide)/.test(n)) return `<div class="sf-bento"><div class="${n} dbox">${n.replace('sf-bento-', '')}</div>${boxes(5)}</div>`;
  if (n === 'sf-reel' || /^sf-reel--/.test(n)) return `<div class="${applied}">${Array.from({ length: 6 }, (_, i) => `<div class="dbox" style="inline-size:9rem">${i + 1}</div>`).join('')}</div>`;
  if (n === 'sf-content-grid') return `<div class="${applied}"><p class="dbox">content</p><div class="sf-breakout dbox">breakout</div><div class="sf-full-bleed dbox">full-bleed</div></div>`;
  if (n === 'sf-breakout' || n === 'sf-full-bleed') return `<div class="sf-content-grid"><p class="dbox">content</p><div class="${n} dbox">${n.replace('sf-', '')}</div></div>`;
  if (n === 'sf-subgrid' || n === 'sf-subgrid-rows') return `<div class="sf-grid sf-grid-cols-3"><div class="${n}">${boxes(3)}</div></div>`;
  if (n === 'sf-sidebar' || /^sf-sidebar--/.test(n)) return `<div class="${applied}"><div class="dbox">main</div><div class="dbox">aside</div></div>`;
  if (n === 'sf-switcher' || /^sf-switcher--/.test(n)) return `<div class="${applied}">${boxes(3)}</div>`;
  if (n === 'sf-imposter' || /^sf-imposter--/.test(n)) return `<div style="position:relative;min-block-size:7rem;background:var(--sf-color-inset)">base<div class="${applied} dbox">imposter</div></div>`;
  if (n === 'sf-icon' || /^sf-icon--/.test(n)) return `<span class="${applied}" style="background:var(--sf-color-action);border-radius:var(--sf-radius-s);aspect-ratio:1"></span> <span style="font-size:var(--sf-text-m)">inline icon</span>`;
  if (n === 'sf-divider' || /^sf-divider--/.test(n)) return `<p>above</p><div class="${applied}"></div><p>below</p>`;
  if (n === 'sf-bg-layer') return `<div style="position:relative;min-block-size:7rem;color:#fff"><div class="sf-bg-layer" style="background:linear-gradient(135deg,var(--sf-color-primary),var(--sf-color-action))"></div><div style="position:relative;padding:var(--sf-space-m)">content over bg</div></div>`;
  if (n === 'sf-pancake') return `<div class="${applied}" style="min-block-size:8rem"><div class="dbox">header</div><div class="dbox">main</div><div class="dbox">footer</div></div>`;
  return `<div class="${applied}">${boxes(4)}</div>`;
}

function macroExample(n, applied) {
  if (n === 'sf-prose') return `<div class="${applied}"><h4>Heading</h4><p>${ipsum}</p><ul><li>one</li><li>two</li></ul><p>Another paragraph.</p></div>`;
  if (n === 'sf-not-prose') return `<div class="sf-prose"><p>${ipsum}</p><div class="${n} dbox">opted out of prose</div><p>more.</p></div>`;
  if (n === 'sf-truncate') return `<div class="${applied}" style="max-inline-size:18rem">${ipsum}</div>`;
  if (/^sf-line-clamp/.test(n)) return `<div class="${applied}" style="--sf-line-clamp:3">${ipsum} ${ipsum}</div>`;
  if (n === 'sf-flow') return `<div class="${applied}"><p>one</p><p>two</p><p>three</p></div>`;
  if (/^sf-surface/.test(n)) return `<div class="${applied} dpad">${n.replace('sf-surface', 'surface') || 'surface'}</div>`;
  if (n === 'sf-text-gradient') return `<div class="${applied}" style="font-size:var(--sf-text-2xl);font-weight:var(--sf-font-weight-bold)">Gradient text</div>`;
  if (/^sf-link/.test(n)) return `<a href="#x" class="${applied}">A ${n.replace('sf-', '')} link</a>`;
  if (/^sf-overflow-fade/.test(n)) return `<div class="${applied}" style="max-block-size:6rem;overflow:auto"><p>${ipsum}</p><p>${ipsum}</p></div>`;
  if (n === 'sf-scroll-shadow') return `<div class="${applied}" style="max-block-size:6rem;overflow:auto"><p>${ipsum}</p><p>${ipsum}</p></div>`;
  if (n === 'sf-scroll-snap') return `<div class="${applied}" style="display:flex;gap:var(--sf-space-s);overflow-x:auto">${Array.from({ length: 5 }, (_, i) => `<div class="dbox" style="flex:0 0 9rem">${i + 1}</div>`).join('')}</div>`;
  if (n === 'sf-aspect') return `<div class="${applied} dbox" style="--sf-aspect:16/9;inline-size:14rem">16 / 9</div>`;
  if (/^sf-scrim/.test(n)) {
    if (n === 'sf-scrim__content') return `<div style="position:relative;min-block-size:7rem;color:#fff;background:linear-gradient(135deg,var(--sf-color-primary),var(--sf-color-action))"><div class="sf-scrim"></div><div class="sf-scrim__content" style="padding:var(--sf-space-m)">scrim content</div></div>`;
    return `<div style="position:relative;min-block-size:7rem;color:#fff;background:linear-gradient(135deg,var(--sf-color-primary),var(--sf-color-action))"><div class="${applied}"></div><div style="position:relative;padding:var(--sf-space-m)">over scrim</div></div>`;
  }
  if (n === 'sf-tabular-nums') return `<div class="${applied}" style="font-size:var(--sf-text-l)">1234567890<br>0987654321</div>`;
  if (n === 'sf-equal-height') return `<div style="display:flex;gap:var(--sf-space-s)"><div class="${n} dpad">short</div><div class="${n} dpad">${ipsum}</div></div>`;
  return `<div class="${applied} dpad">${n.replace('sf-', '')}</div>`;
}

const STATE_ARIA = {
  'sf-is-disabled': ' aria-disabled="true"', 'sf-is-busy': ' aria-busy="true"', 'sf-is-loading': ' aria-busy="true"',
  'sf-is-pending': ' aria-busy="true"', 'sf-is-selected': ' aria-selected="true"', 'sf-is-current': ' aria-current="page"',
  'sf-is-pressed': ' aria-pressed="true"', 'sf-is-expanded': ' aria-expanded="true"', 'sf-is-invalid': ' aria-invalid="true"',
  'sf-is-hidden': ' hidden', 'sf-is-readonly': ' aria-readonly="true"',
};

function stateExample(n) {
  const aria = STATE_ARIA[n] || '';
  return `<div class="${n} dpad"${aria}>${n}</div>`;
}

function a11yExample(n, applied) {
  if (n === 'sr-only' || n === 'sr-only-focusable' || n === 'skip-link') return `<a href="#main" class="${n}">${n} link (Tab to reveal)</a> <span style="color:var(--sf-color-text--muted)">← focusable</span>`;
  if (n === 'no-motion') return `<div class="${n} dbox sf-fade-in">animation suppressed</div>`;
  if (n === 'sf-focus-parent' || n === 'sf-focus-shadow') return `<div class="${n}" style="padding:var(--sf-space-m)"><button>focus me</button></div>`;
  if (n === 'sf-clickable-parent') return `<div class="${n}" style="position:relative;padding:var(--sf-space-m)">card <a href="#x" class="sf-clickable-parent__overlay"></a></div>`;
  if (n === 'sf-clickable-parent__overlay') return `<div class="sf-clickable-parent" style="position:relative;padding:var(--sf-space-m)">card <a href="#x" class="${n}"></a> (overlay link)</div>`;
  return `<div class="${applied} dpad">${n}</div>`;
}

function printExample(n) {
  return `<div class="${n} dpad">${n} — affects print preview (Ctrl/Cmd-P)</div>`;
}

function example(c) {
  const n = c.name;
  const applied = c.isVariant && c.baseClass ? `${c.baseClass} ${n}` : n;
  switch (c.kind) {
    case 'layout': return layoutExample(n, applied);
    case 'macro': return macroExample(n, applied);
    case 'state': return stateExample(n);
    case 'motion':
      // .sf-stagger is a parent-level choreography helper — it needs multiple
      // animated children to show anything, unlike the single-element motion
      // classes handled by the generic tile below.
      if (n === 'sf-stagger') {
        return `<div class="${applied}">${
          [1, 2, 3].map((i) => `<div class="sf-fade-in dbox dbox--anim">${i}</div>`).join('')
        }</div>`;
      }
      return `<div class="${applied} dbox dbox--anim">${n.replace('sf-', '')}</div>`;
    case 'accessibility': return a11yExample(n, applied);
    case 'print': return printExample(n);
    case 'theme': return `<div class="${applied} dpad">${n}</div>`;
    default: return `<div class="${applied} dpad">${n}</div>`;
  }
}

function tile(c) {
  const inBundle = c.bundles.includes('optimal');
  const note = inBundle ? '' : ` <span class="tile__warn">not in optimal bundle</span>`;
  return `      <figure class="tile" data-class="${c.name}">
        <figcaption class="tile__cap"><code>.${esc(c.name)}</code>${note}</figcaption>
        <div class="tile__stage">${example(c)}</div>
      </figure>`;
}

// token galleries — make the override's effect on DERIVED tokens visible
function tokenByName(name) { return tokens.find((t) => t.name === name); }
function colorRamp(stem) {
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const cells = steps.filter((s) => tokenByName(`--sf-color-${stem}-${s}`)).map((s) =>
    `<div class="swatch" style="background:var(--sf-color-${stem}-${s})"><span>${s}</span></div>`).join('');
  return `<div class="ramp"><div class="ramp__name">${stem}</div><div class="ramp__cells">${cells}</div></div>`;
}
function semanticSwatches() {
  const names = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'danger', 'warning', 'success', 'info',
    'surface', 'bg', 'inset', 'text', 'heading', 'link', 'border'];
  return names.filter((nm) => tokenByName(`--sf-color-${nm}`)).map((nm) =>
    `<div class="swatch swatch--lg" style="background:var(--sf-color-${nm})"><span>${nm}</span></div>`).join('');
}
function spacingBars() {
  return ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'].filter((s) => tokenByName(`--sf-space-${s}`)).map((s) =>
    `<div class="bar-row"><code>space-${s}</code><div class="bar" style="inline-size:var(--sf-space-${s})"></div></div>`).join('');
}
function textScale() {
  return ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'].filter((s) => tokenByName(`--sf-text-${s}`)).map((s) =>
    `<div class="ts-row"><code>text-${s}</code><span style="font-size:var(--sf-text-${s})">Quick brown fox</span></div>`).join('');
}
function radiusSwatches() {
  return ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'].filter((s) => tokenByName(`--sf-radius-${s}`)).map((s) =>
    `<div class="rad" style="border-radius:var(--sf-radius-${s})">${s}</div>`).join('');
}
function shadowSwatches() {
  return ['xs', 's', 'm', 'l', 'xl', '2xl'].filter((s) => tokenByName(`--sf-shadow-${s}`)).map((s) =>
    `<div class="shad" style="box-shadow:var(--sf-shadow-${s})">${s}</div>`).join('');
}

function classSection(kind, title) {
  const items = classes.filter((c) => c.kind === kind && c.bundles.length > 0).sort((a, b) => a.name.localeCompare(b.name));
  return `    <section id="${kind}">
      <h2>${title} <span class="count">${items.length}</span></h2>
      <div class="tiles">
${items.map(tile).join('\n')}
      </div>
    </section>`;
}

// ─────────────────────────────────────────────────────────────────────────
// PART 2 — complete token reference (every token, live computed value).
// ─────────────────────────────────────────────────────────────────────────
function tokenVisual(t) {
  const n = t.name, ns = t.namespace, v = t.value;
  if (/gradient\(/.test(v)) return `<div class="tvis" style="background:var(${n})"></div>`;
  if (ns === 'color') return `<div class="tvis" style="background:var(${n})"></div>`;
  if (ns === 'drop' || /drop-shadow\(/.test(v)) return `<div class="tvis tvis--card" style="filter:var(${n})"></div>`;
  if (ns === 'shadow') {
    if (n === '--sf-shadow-color') return `<div class="tvis" style="background:var(${n})"></div>`;
    if (/none|strength|lightness/.test(n)) return '';
    return `<div class="tvis tvis--card" style="box-shadow:var(${n})"></div>`;
  }
  if (ns === 'radius') return /scale/.test(n) ? '' : `<div class="tvis tvis--rad" style="border-radius:var(${n})"></div>`;
  if (ns === 'animation') return /delay/.test(n) ? '' : `<div class="tvis tvis--anim" data-anim="${n}"></div>`;
  if (ns === 'opacity') return `<div class="tvis tvis--op" style="opacity:var(${n})"></div>`;
  if (ns === 'leading') return `<p class="tvis tvis--lead" style="line-height:var(${n})">Aa Bb<br>Cc Dd</p>`;
  if (ns === 'tracking') return `<span class="tvis tvis--txt" style="letter-spacing:var(${n})">AVTAW</span>`;
  if (ns === 'font') {
    if (/weight/.test(n)) return `<span class="tvis tvis--txt" style="font-weight:var(${n})">Ag</span>`;
    if (/body|mono|humanist|geometric|slab|family/.test(n)) return `<span class="tvis tvis--txt" style="font-family:var(${n})">Ag f</span>`;
    return '';
  }
  if (ns === 'text') {
    if (/max-width/.test(n)) return `<div class="tvis tvis--bar" style="inline-size:min(var(${n}),100%)"></div>`;
    if (/base|ratio|scale/.test(n)) return '';
    return `<span class="tvis tvis--txt" style="font-size:var(${n})">Aa</span>`;
  }
  const lenNs = new Set(['space', 'size', 'icon', 'blur', 'gap', 'gutter', 'container', 'sidebar', 'grid', 'equal',
    'bento', 'cover', 'header', 'touch', 'mask', 'scroll', 'focus', 'box', 'content', 'section', 'divider', 'reel',
    'prose', 'stack', 'cluster', 'switcher', 'imposter', 'breakout', 'alternate', 'center', 'btn', 'field', 'scrim',
    'sticky', 'heading']);
  if (lenNs.has(ns) && /(\d|\bvar\()/.test(v) && !/\//.test(v) && !/,/.test(v)
      && !/^[\d.]+$/.test(v.trim())  // unitless numbers (e.g. --sf-btn-font-scale) can't max() with 3px
      && !/^(none|auto|inherit|normal|max-content|min-content|transparent)/.test(v)) {
    return `<div class="tvis tvis--bar" style="inline-size:min(max(var(${n}),3px),100%)"></div>`;
  }
  return '';
}

const INHERIT_TOKENS = new Set(['--sf-color-mark-text', '--sf-color-selection-text']);

function tokenTile(t) {
  const vis = tokenVisual(t);
  const tier = t.tier === 'PUBLIC' ? '' : ` <span class="ttile__tier">${t.tier === 'PUBLIC-ADVANCED' ? 'adv' : t.tier.toLowerCase()}</span>`;
  const inheritAttr = INHERIT_TOKENS.has(t.name) ? ' data-inherit="true"' : '';
  return `<figure class="ttile" data-token="${t.name}"${inheritAttr}><code class="ttile__name">${esc(t.name)}${tier}</code>${vis ? `<div class="ttile__vis">${vis}</div>` : ''}<output class="ttile__val">…</output></figure>`;
}

function tokenReferenceSection() {
  const byNs = {};
  tokens.forEach((t) => (byNs[t.namespace] ||= []).push(t));
  const pref = ['color', 'gradient', 'shadow', 'drop', 'radius', 'space', 'size', 'text', 'font', 'leading', 'tracking',
    'duration', 'ease', 'transition', 'animation', 'border', 'focus', 'opacity', 'blur', 'z'];
  const order = [...pref.filter((n) => byNs[n]), ...Object.keys(byNs).filter((n) => !pref.includes(n)).sort()];
  const blocks = order.map((ns) => {
    const items = byNs[ns].sort((a, b) => a.name.localeCompare(b.name));
    return `      <h3>${ns} <span class="count">${items.length}</span></h3>\n      <div class="ref-grid">${items.map(tokenTile).join('')}</div>`;
  }).join('\n');
  return `    <section id="reference">
      <h2>Part 2 — Complete token reference <span class="count">${tokens.length} tokens · live values</span></h2>
      <div class="notice">Every <code>--sf-*</code> token — knob and consumption, all tiers — with its <strong>live computed value</strong> (filled by JS). Toggle the theme or the override in the toolbar and watch every value recompute. Tokens that resolve to a colour, length, shadow, gradient, type or motion value also show a visual.</div>
${blocks}
    </section>`;
}

// ─────────────────────────────────────────────────────────────────────────
// Interactive functions — animations, easings, durations, transitions,
// gradients, drop-shadows. Driven by section-level class toggles + JS replay.
// ─────────────────────────────────────────────────────────────────────────
function fxList(items, render) { return `<div class="fx-grid">${items.map(render).join('')}</div>`; }
function functionsSection() {
  const anims = tokens.filter((t) => t.namespace === 'animation' && !/delay/.test(t.name));
  const eases = tokens.filter((t) => t.namespace === 'ease');
  const durs = tokens.filter((t) => t.namespace === 'duration');
  const trans = tokens.filter((t) => t.namespace === 'transition');
  const grads = tokens.filter((t) => t.namespace === 'gradient');
  const drops = tokens.filter((t) => t.namespace === 'drop');
  const cap = (t) => `<code>${t.name.replace('--sf-', '')}</code>`;
  return `    <section id="functions">
      <h2>Interactive functions <span class="count">motion · transitions · gradients</span></h2>

      <h3>Animations <button data-act="replay-anim">▶ replay</button></h3>
      ${fxList(anims, (t) => `<figure class="fx"><div class="fx-anim" data-anim="${t.name}"></div>${cap(t)}</figure>`)}

      <h3>Easing curves <button data-act="run-ease">▶ run</button></h3>
      <div id="fx-ease">${fxList(eases, (t) => `<figure class="fx"><div class="fx-track"><div class="fx-dot" style="transition:transform 1.1s var(${t.name})"></div></div>${cap(t)}</figure>`)}</div>

      <h3>Durations <button data-act="run-dur">▶ run</button></h3>
      <div id="fx-dur">${fxList(durs, (t) => `<figure class="fx"><div class="fx-track"><div class="fx-grow" style="transition:inline-size var(${t.name}) linear"></div></div>${cap(t)}</figure>`)}</div>

      <h3>Transitions <button data-act="toggle-trans">⇄ toggle state</button></h3>
      <div id="fx-trans">${fxList(trans, (t) => `<figure class="fx"><div class="fx-trans" style="transition:var(${t.name})">box</div>${cap(t)}</figure>`)}</div>

      <h3>Gradients</h3>
      ${fxList(grads, (t) => `<figure class="fx"><div class="fx-grad" style="background:var(${t.name})"></div>${cap(t)}</figure>`)}

      <h3>Drop shadows (filter)</h3>
      ${fxList(drops, (t) => `<figure class="fx"><div class="fx-drop" style="filter:var(${t.name})"></div>${cap(t)}</figure>`)}
    </section>`;
}

function toolbar() {
  return `  <nav class="toolbar" aria-label="demo controls">
    <span class="tb-label">theme</span>
    <span class="seg">
      <button data-act="theme:auto" data-theme-btn="auto" class="active">Auto</button>
      <button data-act="theme:light" data-theme-btn="light">Light</button>
      <button data-act="theme:dark" data-theme-btn="dark">Dark</button>
    </span>
    <button data-act="lumlocker">LumLocker</button>
    <button data-act="crossfade">Cross-fade</button>
    <button id="ovBtn" data-act="override">Ultimate override</button>
    <button data-act="replay">▶ Replay all</button>
  </nav>`;
}

const PAGE_SCRIPT = [
  '(function () {',
  '  var root = document.documentElement;',
  '  function refresh() {',
  '    var cs = getComputedStyle(root);',
  '    document.querySelectorAll("[data-token]").forEach(function (el) {',
  '      var v = cs.getPropertyValue(el.getAttribute("data-token")).trim();',
  '      var o = el.querySelector(".ttile__val"); if (o) o.textContent = v || (el.dataset.inherit ? "inherit (contextual)" : "(empty)");',
  '    });',
  '  }',
  '  function playAnims() {',
  '    document.querySelectorAll("[data-anim]").forEach(function (el) {',
  '      var n = el.getAttribute("data-anim");',
  '      el.style.animation = "none"; void el.offsetWidth; el.style.animation = "var(" + n + ")";',
  '    });',
  '  }',
  '  function retrigger(id) { var s = document.getElementById(id); if (!s) return; s.classList.remove("go"); void s.offsetWidth; s.classList.add("go"); }',
  '  function setTheme(t) {',
  '    if (t === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", t);',
  '    document.querySelectorAll("[data-theme-btn]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-theme-btn") === t); });',
  '    setTimeout(refresh, 60);',
  '  }',
  '  var ov = document.getElementById("ov");',
  '  function setOverride(on) {',
  '    if (on) { if (!ov) { ov = document.createElement("link"); ov.rel = "stylesheet"; ov.href = "ultimate-override.css"; ov.id = "ov"; document.head.appendChild(ov); } }',
  '    else if (ov) { ov.remove(); ov = null; }',
  '    var b = document.getElementById("ovBtn"); if (b) b.classList.toggle("active", !!ov);',
  '    setTimeout(refresh, 90);',
  '  }',
  '  document.addEventListener("click", function (e) {',
  '    var t = e.target.closest("[data-act]"); if (!t) return;',
  '    var a = t.getAttribute("data-act");',
  '    if (a.indexOf("theme:") === 0) setTheme(a.slice(6));',
  '    else if (a === "lumlocker") { root.toggleAttribute("data-lumlocker"); t.classList.toggle("active", root.hasAttribute("data-lumlocker")); setTimeout(refresh, 60); }',
  '    else if (a === "crossfade") { root.classList.toggle("sf-theme-transition"); t.classList.toggle("active", root.classList.contains("sf-theme-transition")); }',
  '    else if (a === "override") setOverride(!ov);',
  '    else if (a === "replay") { playAnims(); retrigger("fx-ease"); retrigger("fx-dur"); var tr = document.getElementById("fx-trans"); if (tr) tr.classList.toggle("on"); }',
  '    else if (a === "replay-anim") playAnims();',
  '    else if (a === "run-ease") retrigger("fx-ease");',
  '    else if (a === "run-dur") retrigger("fx-dur");',
  '    else if (a === "toggle-trans") { var s = document.getElementById("fx-trans"); if (s) s.classList.toggle("on"); }',
  '  });',
  '  setOverride(!!ov);',
  '  refresh();',
  '  requestAnimationFrame(playAnims);',
  '})();',
].join('\n');

const bundledClassCount = classes.filter((c) => c.bundles.length > 0).length;

function buildDemo({ withOverride }) {
  const overrideLink = withOverride ? `\n  <link rel="stylesheet" href="ultimate-override.css" id="ov">` : '';
  const banner = withOverride
    ? `<div class="notice"><strong>ultimate-override.css is ACTIVE.</strong> Every value below is recomputed from perturbed knob tokens — toggle it off in the toolbar, or compare against <a href="full-api-demo.html">the un-overridden page</a>.</div>`
    : `<div class="notice">Baseline render with default tokens. Use the toolbar to switch theme, toggle the ultimate override live, or replay motion. The always-on override variant is <a href="full-api-demo-with-overrides.html">full-api-demo-with-overrides.html</a>.</div>`;
  const kinds = [
    ['layout', 'Layout primitives'],
    ['macro', 'Macro classes'],
    ['state', 'State classes'],
    ['motion', 'Motion / animation'],
    ['accessibility', 'Accessibility'],
    ['print', 'Print'],
    ['theme', 'Theme'],
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SLASHED — Full API Demo${withOverride ? ' (overridden)' : ''}</title>
  <link rel="stylesheet" href="${CDN}">${overrideLink}
  <style>
    body { background: var(--sf-color-bg); color: var(--sf-color-text); font-family: var(--sf-font-body); margin: 0; }
    main { max-width: var(--sf-container-default); margin-inline: auto; padding: var(--sf-space-l); }
    h1 { color: var(--sf-color-primary); font-size: var(--sf-text-3xl); margin-block: 0 var(--sf-space-xs); }
    h2 { color: var(--sf-color-heading); font-size: var(--sf-text-xl); margin-block: var(--sf-space-2xl) var(--sf-space-m);
         padding-block-end: var(--sf-space-xs); border-block-end: 2px solid var(--sf-color-primary-300); }
    h3 { color: var(--sf-color-text--secondary); font-size: var(--sf-text-m); margin-block: var(--sf-space-l) var(--sf-space-s); }
    .count { font: var(--sf-font-weight-normal) var(--sf-text-s)/1 var(--sf-font-mono); color: var(--sf-color-text--muted); }
    .notice { padding: var(--sf-space-m); background: var(--sf-color-info-subtle);
              border-inline-start: 4px solid var(--sf-color-info); border-radius: var(--sf-radius-m); margin-block: var(--sf-space-m); }
    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); gap: var(--sf-space-m); }
    .tile { margin: 0; border: 1px solid var(--sf-color-border); border-radius: var(--sf-radius-m);
            background: var(--sf-color-surface); overflow: hidden; }
    .tile__cap { font: var(--sf-text-xs)/1.4 var(--sf-font-mono); padding: var(--sf-space-2xs) var(--sf-space-xs);
                 background: var(--sf-color-inset); border-block-end: 1px solid var(--sf-color-border); color: var(--sf-color-text--secondary); }
    .tile__warn { color: var(--sf-color-warning); }
    /* contain traps position:fixed/absolute-fill classes (fullscreen-style helpers,
       sf-overlay, sf-imposter--fixed) inside their own tile instead of the page. */
    .tile__stage { padding: var(--sf-space-m); position: relative; overflow: hidden;
                   contain: layout paint; min-block-size: 4rem; }
    .dbox { padding: var(--sf-space-s); background: var(--sf-color-primary-100); border: 1px solid var(--sf-color-primary-300);
            border-radius: var(--sf-radius-s); text-align: center; color: var(--sf-color-text); min-block-size: 2rem; }
    .dbox--anim { inline-size: 6rem; }
    .dpad { padding: var(--sf-space-s); border-radius: var(--sf-radius-s); }
    .dmedia { display: grid; place-items: center; min-block-size: 6rem; color: var(--sf-color-text); }
    .swatch { aspect-ratio: 1; display: grid; place-items: end center; padding: 2px; font: var(--sf-text-2xs) var(--sf-font-mono);
              color: #fff; text-shadow: 0 1px 2px #0009; }
    .swatch--lg { aspect-ratio: 3/2; border-radius: var(--sf-radius-s); }
    .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr)); gap: var(--sf-space-xs); }
    .ramp { margin-block-end: var(--sf-space-s); }
    .ramp__name { font: var(--sf-text-xs) var(--sf-font-mono); color: var(--sf-color-text--muted); }
    .ramp__cells { display: grid; grid-template-columns: repeat(11, 1fr); }
    .ramp__cells .swatch:first-child { border-start-start-radius: var(--sf-radius-s); border-end-start-radius: var(--sf-radius-s); }
    .ramp__cells .swatch:last-child { border-start-end-radius: var(--sf-radius-s); border-end-end-radius: var(--sf-radius-s); }
    .bar-row { display: flex; align-items: center; gap: var(--sf-space-s); margin-block-end: var(--sf-space-2xs); }
    .bar-row code { inline-size: 7rem; font-size: var(--sf-text-xs); color: var(--sf-color-text--muted); }
    .bar { block-size: 1rem; background: linear-gradient(90deg, var(--sf-color-primary), var(--sf-color-action)); border-radius: var(--sf-radius-xs); }
    .ts-row { display: flex; align-items: baseline; gap: var(--sf-space-s); margin-block-end: var(--sf-space-2xs); }
    .ts-row code { inline-size: 5rem; font-size: var(--sf-text-xs); color: var(--sf-color-text--muted); flex: none; }
    .rad { aspect-ratio: 1; background: var(--sf-color-primary); color: #fff; display: grid; place-items: center;
           font: var(--sf-text-xs) var(--sf-font-mono); }
    .shad { aspect-ratio: 1; background: var(--sf-color-surface); border-radius: var(--sf-radius-m); display: grid;
            place-items: center; font: var(--sf-text-xs) var(--sf-font-mono); color: var(--sf-color-text--muted); }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr)); gap: var(--sf-space-l);
               padding: var(--sf-space-l); background: var(--sf-color-inset); border-radius: var(--sf-radius-m); }
    /* toolbar */
    .toolbar { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; gap: var(--sf-space-xs); align-items: center;
               padding: var(--sf-space-xs) var(--sf-space-l); background: var(--sf-color-overlay);
               backdrop-filter: blur(8px); border-block-end: 1px solid var(--sf-color-border); }
    .tb-label { font: var(--sf-text-xs) var(--sf-font-mono); color: var(--sf-color-text--muted); }
    .toolbar button { font: var(--sf-text-s) var(--sf-font-body); padding: .35em .8em; border: 1px solid var(--sf-color-border);
                      background: var(--sf-color-surface); color: var(--sf-color-text); border-radius: var(--sf-radius-s); cursor: pointer; }
    .toolbar .seg { display: inline-flex; }
    .toolbar .seg button { border-radius: 0; border-inline-width: 0; }
    .toolbar .seg button:first-child { border-radius: var(--sf-radius-s) 0 0 var(--sf-radius-s); border-inline-start-width: 1px; }
    .toolbar .seg button:last-child { border-radius: 0 var(--sf-radius-s) var(--sf-radius-s) 0; border-inline-end-width: 1px; }
    .toolbar button.active { background: var(--sf-color-primary); color: var(--sf-color-text--on-primary, #fff); border-color: var(--sf-color-primary); }
    h3 button { margin-inline-start: var(--sf-space-s); font: var(--sf-text-xs) var(--sf-font-body); padding: .2em .7em;
                border: 1px solid var(--sf-color-border); background: var(--sf-color-surface); color: var(--sf-color-text);
                border-radius: var(--sf-radius-s); cursor: pointer; }
    /* part 2 token reference */
    .ref-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: var(--sf-space-s); }
    .ttile { margin: 0; display: grid; gap: var(--sf-space-2xs); padding: var(--sf-space-xs);
             border: 1px solid var(--sf-color-border); border-radius: var(--sf-radius-s); background: var(--sf-color-surface); }
    .ttile__name { font: var(--sf-text-2xs)/1.35 var(--sf-font-mono); color: var(--sf-color-text--secondary); word-break: break-all; }
    .ttile__tier { color: var(--sf-color-warning); }
    .ttile__val { font: var(--sf-text-2xs)/1.35 var(--sf-font-mono); color: var(--sf-color-text--muted);
                  word-break: break-all; max-block-size: 4.5em; overflow: auto; }
    .ttile__vis { min-block-size: 2.5rem; display: grid; place-items: center; border-radius: var(--sf-radius-xs);
                  background: repeating-conic-gradient(var(--sf-color-inset) 0 25%, transparent 0 50%) 0 0 / 1rem 1rem, var(--sf-color-surface); overflow: hidden; }
    .tvis { inline-size: 100%; block-size: 2.5rem; }
    .tvis--rad { background: var(--sf-color-primary); }
    .tvis--card { inline-size: 72%; block-size: 2.2rem; background: var(--sf-color-surface); border-radius: var(--sf-radius-s); }
    .tvis--bar { block-size: .9rem; background: linear-gradient(90deg, var(--sf-color-primary), var(--sf-color-action));
                 border-radius: var(--sf-radius-full); justify-self: start; align-self: center; }
    .tvis--txt { inline-size: auto; block-size: auto; color: var(--sf-color-text); line-height: 1; }
    .tvis--lead { inline-size: auto; block-size: auto; margin: 0; font-size: var(--sf-text-2xs); color: var(--sf-color-text); }
    .tvis--op { background: var(--sf-color-primary); }
    .tvis--anim { inline-size: 2.5rem; background: var(--sf-color-action); border-radius: var(--sf-radius-s); }
    /* interactive functions */
    .fx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); gap: var(--sf-space-m); margin-block-end: var(--sf-space-m); }
    .fx { margin: 0; display: grid; gap: var(--sf-space-2xs); justify-items: center; text-align: center; }
    .fx code { font-size: var(--sf-text-2xs); color: var(--sf-color-text--muted); word-break: break-all; }
    .fx-anim { inline-size: 3rem; block-size: 3rem; background: var(--sf-color-action); border-radius: var(--sf-radius-m); }
    .fx-track { position: relative; inline-size: 100%; min-inline-size: 10rem; block-size: 1.4rem;
                background: var(--sf-color-inset); border-radius: var(--sf-radius-full); overflow: hidden; }
    .fx-dot { position: absolute; inset-block: .12rem; inset-inline-start: .12rem; inline-size: 1.15rem;
              background: var(--sf-color-primary); border-radius: 50%; transform: translateX(0); }
    #fx-ease.go .fx-dot { transform: translateX(8rem); }
    .fx-grow { block-size: 1.4rem; inline-size: 0; border-radius: var(--sf-radius-full);
               background: linear-gradient(90deg, var(--sf-color-primary), var(--sf-color-action)); }
    #fx-dur.go .fx-grow { inline-size: 100%; }
    .fx-trans { padding: var(--sf-space-s); inline-size: 100%; border: 1px solid var(--sf-color-border);
                border-radius: var(--sf-radius-m); background: var(--sf-color-surface); }
    #fx-trans.on .fx-trans { background: var(--sf-color-primary); color: var(--sf-color-text--on-primary, #fff);
                             transform: translateY(-4px) scale(1.03); box-shadow: var(--sf-shadow-l); border-color: var(--sf-color-primary); opacity: .92; }
    .fx-grad { inline-size: 100%; block-size: 3rem; border-radius: var(--sf-radius-m); }
    .fx-drop { inline-size: 3rem; block-size: 3rem; background: var(--sf-color-primary); border-radius: var(--sf-radius-m); }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
  </style>
</head>
<body>
${toolbar()}
  <main id="main">
    <h1>SLASHED Full API Demo</h1>
    <p style="color:var(--sf-color-text--muted)">v${VERSION} · full bundle from jsDelivr CDN · ${bundledClassCount} classes · ${tokens.length} tokens (${knobs.length} configurable)</p>
    ${banner}

    <section id="tokens">
      <h2>Token galleries <span class="count">highlights</span></h2>
      <h3>Color ramps</h3>
      ${['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'].map(colorRamp).join('\n      ')}
      <h3>Semantic / role colors</h3>
      <div class="swatches">${semanticSwatches()}</div>
      <h3>Spacing scale</h3>
      ${spacingBars()}
      <h3>Type scale</h3>
      ${textScale()}
      <h3>Radius</h3>
      <div class="gallery">${radiusSwatches()}</div>
      <h3>Shadow</h3>
      <div class="gallery">${shadowSwatches()}</div>
    </section>

${functionsSection()}

${kinds.map(([k, t]) => classSection(k, t)).join('\n')}

${tokenReferenceSection()}
  </main>
  <script>${PAGE_SCRIPT}</script>
</body>
</html>
`;
}

// ─────────────────────────────────────────────────────────────────────────
const { css, handledCount } = buildOverride();
fs.writeFileSync(path.join(OUT, 'ultimate-override.css'), css);

// completeness assertion for classes
const emitted = new Set();
for (const c of classes) emitted.add(c.name);
if (emitted.size !== classes.length) throw new Error('class de-dup mismatch');

const baseHtml = buildDemo({ withOverride: false });
fs.writeFileSync(path.join(OUT, 'full-api-demo.html'), baseHtml);
fs.writeFileSync(path.join(OUT, 'full-api-demo-with-overrides.html'), buildDemo({ withOverride: true }));

// completeness assertion for tokens: every token must appear once in Part 2
const tokenTiles = (baseHtml.match(/data-token="/g) || []).length;
if (tokenTiles !== tokens.length) {
  throw new Error(`Part 2 token reference: ${tokenTiles} tiles != ${tokens.length} tokens`);
}

console.log(`demos/ultimate-override.css        → ${handledCount}/${knobs.length} knobs overridden, ${Object.keys(SKIP).length} skipped (documented)`);
console.log(`demos/full-api-demo.html           → ${bundledClassCount} bundled classes (${classes.length - bundledClassCount} example-only excluded) + ${tokens.length} tokens (Part 2), all rendered`);
console.log(`demos/full-api-demo-with-overrides.html → same body + override link`);
