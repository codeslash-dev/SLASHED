#!/usr/bin/env node
/* Generates core/tokens.color-fallbacks.css from core/tokens.css.
   Run: npm run gen:fallbacks
   GENERATED output — do NOT edit the output file by hand. */

import fs   from 'node:fs';
import path from 'node:path';
import { parse, oklab, rgb, toGamut, formatHex } from 'culori';

const ROOT    = path.resolve(import.meta.dirname, '..');
const TOKENS  = path.join(ROOT, 'core/tokens.css');
const OUTPUT  = path.join(ROOT, 'core/tokens.color-fallbacks.css');

const BRAND_KEYS   = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
const STATUS_KEYS  = ['success', 'warning', 'error', 'info', 'danger'];
const ALL_FAMILIES = [...BRAND_KEYS, ...STATUS_KEYS];

// ─── helpers ──────────────────────────────────────────────────────────────────

function clamp(lo, v, hi) { return Math.min(hi, Math.max(lo, v)); }

function o(l, c, h) { return { mode: 'oklch', l, c, h }; }

// Shorten hex when each pair is a double digit (e.g. #88ddff → #8df)
function shortenHex(h) {
  if (/^#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/i.test(h)) {
    return '#' + h[1] + h[3] + h[5];
  }
  return h;
}

// OKLCH → sRGB hex (gamut-maps if necessary, shortens where possible)
function hex(color) {
  return shortenHex(formatHex(toGamut('rgb')(color)));
}

// OKLCH → rgb(.../..) string for alpha tokens (modern CSS notation)
function rgba(color, alpha) {
  const c = toGamut('rgb')({ ...color, alpha });
  const r = Math.round(Math.min(1, Math.max(0, c.r ?? 0)) * 255);
  const g = Math.round(Math.min(1, Math.max(0, c.g ?? 0)) * 255);
  const b = Math.round(Math.min(1, Math.max(0, c.b ?? 0)) * 255);
  return `rgb(${r} ${g} ${b} / ${alpha.toFixed(2)})`;
}

// OKLab mix: pctA % of colorA, (100-pctA) % of colorB
function mixOklab(colorA, colorB, pctA) {
  const a = oklab(colorA);
  const b = oklab(colorB);
  const t = pctA / 100;
  return { mode: 'oklab', l: a.l * t + b.l * (1 - t), a: a.a * t + b.a * (1 - t), b: a.b * t + b.b * (1 - t) };
}

// ─── formulas ─────────────────────────────────────────────────────────────────

function darkBrand(src) {
  return o(clamp(0.65, 0.95 - src.l * 0.5, 0.88), src.c * 0.9, src.h);
}
function darkBase(src) {
  return o(clamp(0.16, 1.18 - src.l, 0.24), src.c * 0.5, src.h);
}
function textLight(neutral) {
  return o(clamp(0.05, neutral.l - 0.4, 0.35), neutral.c, neutral.h);
}
function textSecondaryLight(neutral) {
  return o(clamp(0.15, neutral.l - 0.25, 0.45), neutral.c, neutral.h);
}
function textPlaceholderLight(neutral) {
  return o(clamp(0.45, neutral.l + 0.15, 0.75), neutral.c, neutral.h);
}
function textDisabledLight(neutral) {
  return o(clamp(0.55, neutral.l + 0.25, 0.82), neutral.c, neutral.h);
}
function textInverseLight(neutral) {
  return o(clamp(0.85, neutral.l + 0.4, 0.98), neutral.c, neutral.h);
}
function textDark(neutralDark) {
  return o(clamp(0.70, neutralDark.l + 0.25, 1), neutralDark.c, neutralDark.h);
}
function textSecondaryDark(neutralDark) {
  return o(clamp(0.55, neutralDark.l + 0.1, 0.90), neutralDark.c, neutralDark.h);
}
function textPlaceholderDark(neutralDark) {
  return o(clamp(0.35, neutralDark.l - 0.1, 0.65), neutralDark.c, neutralDark.h);
}
function textDisabledDark(neutralDark) {
  return o(clamp(0.25, neutralDark.l - 0.2, 0.55), neutralDark.c, neutralDark.h);
}
function textInverseDark(neutralDark) {
  return o(clamp(0.05, neutralDark.l - 0.4, 0.35), neutralDark.c, neutralDark.h);
}
function borderLight(neutral) {
  return o(clamp(0.70, neutral.l + 0.35, 0.95), 0.005, neutral.h);
}
function borderSubtleLight(neutral) {
  return o(clamp(0.75, neutral.l + 0.4, 0.97), 0.005, neutral.h);
}
function borderStrongLight(neutral) {
  return o(clamp(0.55, neutral.l + 0.1, 0.85), 0.02, neutral.h);
}
function borderDark(neutralDark) {
  return o(clamp(0.25, neutralDark.l - 0.3, 0.55), 0.005, neutralDark.h);
}
function borderSubtleDark(neutralDark) {
  return o(clamp(0.20, neutralDark.l - 0.38, 0.45), 0.005, neutralDark.h);
}
function borderStrongDark(neutralDark) {
  return o(clamp(0.38, neutralDark.l - 0.1, 0.65), 0.02, neutralDark.h);
}
function linkLight(action) {
  return o(clamp(0, Math.min(action.l - 0.07, 0.48), 1), action.c, action.h);
}
function linkHoverLight(action) {
  return o(clamp(0, Math.min(action.l - 0.15, 0.40), 1), action.c, action.h);
}
function linkActiveLight(action) {
  return o(clamp(0, Math.min(action.l - 0.21, 0.34), 1), action.c, action.h);
}
function linkDark(actionDark) {
  return o(clamp(0.68, actionDark.l, 1), actionDark.c, actionDark.h);
}
function linkHoverDark(actionDark) {
  return o(clamp(0, Math.max(actionDark.l + 0.10, 0.68), 1), actionDark.c, actionDark.h);
}
function linkActiveDark(actionDark) {
  return o(clamp(0, Math.max(actionDark.l + 0.15, 0.74), 1), actionDark.c, actionDark.h);
}
function textOnColor(color, threshold = 0.6) {
  const l = clamp(0.1, Math.sign(threshold - color.l) * 999, 0.95);
  return o(l, 0, 0);
}
function statusStrongLight(statusLight, delta) {
  return o(statusLight.l + delta, statusLight.c, statusLight.h);
}
function statusStrongDark(statusDark, delta) {
  return o(clamp(0.70, statusDark.l + delta, 1), statusDark.c, statusDark.h);
}

// ─── parser ───────────────────────────────────────────────────────────────────

function parseOklch(str) {
  const c = parse(str.trim());
  if (!c) throw new Error(`[gen-fallbacks] Failed to parse color: "${str}"`);
  return c;
}

function parseSourceTokens(css) {
  const src = {};
  const expected = [...BRAND_KEYS, ...STATUS_KEYS];

  for (const m of css.matchAll(/@property\s+(--sf-color-([\w]+)-light)\s*\{([^}]*)\}/g)) {
    const key = m[2];
    if (!expected.includes(key)) continue;
    const iv = /initial-value\s*:\s*([^;]+);/.exec(m[3]);
    if (!iv || !iv[1].trim()) {
      throw new Error(`[gen-fallbacks] Missing or empty initial-value for --sf-color-${key}-light`);
    }
    src[key] = parseOklch(iv[1]);
  }

  for (const key of expected) {
    if (!src[key]) throw new Error(`[gen-fallbacks] Source token --sf-color-${key}-light not found`);
  }
  return src;
}

// ─── computation ──────────────────────────────────────────────────────────────

function computeAll(src) {
  // Resolved light
  const rLight = {};
  for (const k of BRAND_KEYS.filter(k => k !== 'base')) rLight[k] = src[k];
  rLight.base = src.base;
  for (const k of STATUS_KEYS) rLight[k] = src[k];

  // Resolved dark
  const rDark = {};
  for (const k of BRAND_KEYS.filter(k => k !== 'base')) rDark[k] = darkBrand(src[k]);
  rDark.base = darkBase(src.base);
  for (const k of STATUS_KEYS) rDark[k] = darkBrand(src[k]);

  const nL = rLight.neutral; // neutral light
  const nD = rDark.neutral;  // neutral dark

  // ── surfaces (derived, light only) ────────────────────────────────────────
  const surfLight = {
    bg:      o(Math.min(1, src.base.l + 0.02), src.base.c, src.base.h),
    inset:   o(Math.max(0, src.base.l - 0.02), src.base.c, src.base.h),
    raised:  o(Math.min(1, src.base.l + 0.04), src.base.c, src.base.h),
    overlay: src.base, // alpha applied when emitting
    inverse: o(clamp(0, 1 - src.base.l, 1), src.base.c, src.base.h),
  };

  // ── text ──────────────────────────────────────────────────────────────────
  const txtL = textLight(nL);
  const textLight_ = {
    text:        txtL,
    secondary:   textSecondaryLight(nL),
    placeholder: textPlaceholderLight(nL),
    disabled:    textDisabledLight(nL),
    inverse:     textInverseLight(nL),
    heading:     txtL,
  };
  const textDark_ = {
    text:        textDark(nD),
    secondary:   textSecondaryDark(nD),
    placeholder: textPlaceholderDark(nD),
    disabled:    textDisabledDark(nD),
    inverse:     textInverseDark(nD),
    heading:     textDark(nD),
  };

  // code-bg = inset, code-text = sign formula on code-bg
  const codeBg = surfLight.inset;
  const codeText = textOnColor(codeBg);

  // ── borders ───────────────────────────────────────────────────────────────
  const borderL = borderLight(nL);
  const borderSL = borderSubtleLight(nL);
  const borL = { border: borderL, subtle: borderSL, strong: borderStrongLight(nL) };
  const borD = {
    border: borderDark(nD),
    subtle: borderSubtleDark(nD),
    strong: borderStrongDark(nD),
  };

  // border--disabled derived from border--subtle (c forced to 0)
  const borderDisabledLight = o(borderSL.l, 0, borderSL.h);

  // ── links ─────────────────────────────────────────────────────────────────
  const aL = rLight.action;
  const aD = rDark.action;
  const lnkL = {
    link:    linkLight(aL),
    hover:   linkHoverLight(aL),
    active:  linkActiveLight(aL),
    visited: o(linkLight(aL).l, aL.c, aL.h + 60),
  };
  const lnkD = {
    link:    linkDark(aD),
    hover:   linkHoverDark(aD),
    active:  linkActiveDark(aD),
    visited: o(linkDark(aD).l, aD.c, aD.h + 60),
  };

  // ── selection ─────────────────────────────────────────────────────────────
  // light: action-light / 0.28
  const selBgLight = src.action; // alpha applied at emit
  // dark: clamp(0.62, 0.93 - action-light.l * 0.4, 0.78) / 0.55
  const selBgDark = o(clamp(0.62, 0.93 - src.action.l * 0.4, 0.78), src.action.c, src.action.h);

  // ── status-strong ─────────────────────────────────────────────────────────
  const statusStrongL = {
    success: statusStrongLight(src.success, -0.15),
    warning: statusStrongLight(src.warning, -0.25),
    error:   statusStrongLight(src.error,   -0.10),
    info:    statusStrongLight(src.info,    -0.10),
    danger:  statusStrongLight(src.danger,  -0.10),
  };
  const statusStrongD = {
    success: statusStrongDark(rDark.success, 0.15),
    warning: statusStrongDark(rDark.warning, 0.05),
    error:   statusStrongDark(rDark.error,   0.15),
    info:    statusStrongDark(rDark.info,    0.15),
    danger:  statusStrongDark(rDark.danger,  0.15),
  };

  // ── text-on-color ─────────────────────────────────────────────────────────
  const textOn = {};
  for (const k of [...BRAND_KEYS.filter(k => k !== 'base'), ...STATUS_KEYS]) {
    textOn[k] = textOnColor(rLight[k]);
  }

  // ── shade ramps ───────────────────────────────────────────────────────────
  const TINT_PCTS  = [4, 20, 65];  // toward surface
  const SHADE_PCTS = [82, 38, 8];  // toward text
  const SHADE_NAMES = ['superlight', 'xlight', 'lighter', 'darker', 'xdark', 'superdark'];

  const shades = {};
  const surfaceColor = rLight.base; // surface = base in light mode
  const textColor    = textLight_.text;

  for (const k of BRAND_KEYS.filter(k => k !== 'base')) {
    const col = rLight[k];
    shades[k] = {
      superlight: mixOklab(col, surfaceColor, TINT_PCTS[0]),
      xlight:     mixOklab(col, surfaceColor, TINT_PCTS[1]),
      lighter:    mixOklab(col, surfaceColor, TINT_PCTS[2]),
      darker:     mixOklab(col, textColor,    SHADE_PCTS[0]),
      xdark:      mixOklab(col, textColor,    SHADE_PCTS[1]),
      superdark:  mixOklab(col, textColor,    SHADE_PCTS[2]),
    };
  }
  // base family — inverted: tints use (text into base), shades use (base into text)
  shades.base = {
    superlight: mixOklab(textColor,       surfaceColor, TINT_PCTS[0]),
    xlight:     mixOklab(textColor,       surfaceColor, TINT_PCTS[1]),
    lighter:    mixOklab(textColor,       surfaceColor, TINT_PCTS[2]),
    darker:     mixOklab(rLight.base,     textColor,    SHADE_PCTS[0]),
    xdark:      mixOklab(rLight.base,     textColor,    SHADE_PCTS[1]),
    superdark:  mixOklab(rLight.base,     textColor,    SHADE_PCTS[2]),
  };
  for (const k of STATUS_KEYS) {
    const col = rLight[k];
    shades[k] = {
      superlight: mixOklab(col, surfaceColor, TINT_PCTS[0]),
      xlight:     mixOklab(col, surfaceColor, TINT_PCTS[1]),
      lighter:    mixOklab(col, surfaceColor, TINT_PCTS[2]),
      darker:     mixOklab(col, textColor,    SHADE_PCTS[0]),
      xdark:      mixOklab(col, textColor,    SHADE_PCTS[1]),
      superdark:  mixOklab(col, textColor,    SHADE_PCTS[2]),
    };
  }

  // ── shadow ────────────────────────────────────────────────────────────────
  // shadow-color = oklch(from neutral 0.15 c h) — fixed lightness 0.15
  const shadowColor = o(0.15, nL.c, nL.h);
  const STR = 0.08; // light mode strength
  function shadowAlpha(mult) { return Math.min(0.7, Math.max(0, STR * mult)); }
  function shadowStop(geom, mult) {
    return `${geom} ${rgba(shadowColor, shadowAlpha(mult))}`;
  }

  const shadows = {
    'shadow-color':  hex(shadowColor),
    'shadow-none':   'none',
    'shadow-xs':     shadowStop('0 1px 2px 0', 0.5),
    'shadow-s':      [shadowStop('0 1px 2px 0', 0.5), shadowStop('0 2px 6px 0', 1)].join(',\n                 '),
    'shadow-m':      [shadowStop('0 1px 3px 0', 0.5), shadowStop('0 4px 12px 0', 2)].join(',\n                 '),
    'shadow-l':      [shadowStop('0 2px 4px 0', 0.5), shadowStop('0 8px 24px 0', 3), shadowStop('0 16px 48px 0', 2)].join(',\n                 '),
    'shadow-xl':     [shadowStop('0 2px 8px 0', 0.5), shadowStop('0 12px 36px 0', 3.5), shadowStop('0 24px 72px 0', 2.5)].join(',\n                 '),
    'shadow-2xl':    [shadowStop('0 4px 12px 0', 0.6), shadowStop('0 20px 60px 0', 4), shadowStop('0 40px 100px -8px', 5)].join(',\n                 '),
    'shadow-inner':  `inset ${shadowStop('0 2px 4px 0', 2)}`,
    'text-shadow-none': 'none',
    'text-shadow-s': shadowStop('0 1px 2px', 1.5),
    'text-shadow-m': shadowStop('0 2px 4px', 2),
    'text-shadow-l': shadowStop('0 4px 8px', 2.5),
    'drop-shadow-s': `drop-shadow(${shadowStop('0 1px 2px', 1.5)})`,
    'drop-shadow-m': `drop-shadow(${shadowStop('0 4px 6px', 2)})`,
    'drop-shadow-l': `drop-shadow(${shadowStop('0 8px 16px', 2.5)})`,
    'shadow-glow':   `0 0 15px 2px ${rgba(rLight.primary, shadowAlpha(2))}`,
  };

  // ── gradients ─────────────────────────────────────────────────────────────
  function gradStop(color, deltaL, deltaH = 0) {
    const c2 = o(Math.max(0, Math.min(1, color.l + deltaL)), color.c, (color.h ?? 0) + deltaH);
    return hex(c2);
  }
  const gradients = {
    'gradient-primary':   `linear-gradient(135deg, ${hex(rLight.primary)}, ${gradStop(rLight.primary, -0.08)})`,
    'gradient-secondary': `linear-gradient(135deg, ${hex(rLight.secondary)}, ${gradStop(rLight.secondary, -0.08)})`,
    'gradient-tertiary':  `linear-gradient(135deg, ${hex(rLight.tertiary)}, ${gradStop(rLight.tertiary, -0.08)})`,
    'gradient-brand':     `linear-gradient(135deg, ${hex(rLight.primary)}, ${gradStop(rLight.primary, 0, 30)})`,
    'gradient-surface':   `linear-gradient(180deg, ${hex(rLight.base)}, ${hex(surfLight.bg)})`,
    'gradient-fade--r':   `linear-gradient(to right, transparent, ${hex(surfLight.bg)})`,
    'gradient-fade--l':   `linear-gradient(to left, transparent, ${hex(surfLight.bg)})`,
    'gradient-fade--t':   `linear-gradient(to top, transparent, ${hex(surfLight.bg)})`,
    'gradient-fade--b':   `linear-gradient(to bottom, transparent, ${hex(surfLight.bg)})`,
  };

  return {
    rLight, rDark, surfLight, textLight_, textDark_,
    codeBg, codeText, borL, borD, borderDisabledLight,
    lnkL, lnkD, selBgLight, selBgDark,
    statusStrongL, statusStrongD, textOn,
    shades, shadows, gradients,
    // convenience
    neutralLight: nL, neutralDark: nD,
    actionLight: aL, actionDark: aD,
  };
}

// ─── CSS builder ──────────────────────────────────────────────────────────────

function prop(name, value, indent = '    ') {
  return `${indent}${name}: ${value};`;
}

function buildCSS(src, c) {
  const lines = [];

  lines.push(
    '/* SLASHED — core/tokens.color-fallbacks.css  (@layer slashed.tokens + slashed.themes)',
    '   GENERATED FROM SOURCE by scripts/gen-color-fallbacks.js',
    '   Regenerate: npm run gen:fallbacks',
    '   Do NOT edit by hand — changes will be overwritten. */',
    '',
  );

  // ── @layer slashed.tokens — light-mode sRGB defaults ──────────────────────
  lines.push('@layer slashed.tokens {', '');
  lines.push('  /* ── Unguarded sRGB defaults — light mode ───────────────────────────────── */');
  lines.push('  :root {');

  // brand + status resolved
  lines.push('');
  lines.push('    /* brand + status resolved */');
  for (const k of [...BRAND_KEYS, ...STATUS_KEYS]) {
    lines.push(prop(`--sf-color-${k}`, hex(c.rLight[k])));
  }

  // surfaces
  lines.push('');
  lines.push('    /* surfaces (derived) */');
  lines.push(prop('--sf-color-bg',      hex(c.surfLight.bg)));
  lines.push(prop('--sf-color-inset',   hex(c.surfLight.inset)));
  lines.push(prop('--sf-color-raised',  hex(c.surfLight.raised)));
  lines.push(prop('--sf-color-overlay', rgba(c.surfLight.overlay, 0.9)));
  lines.push(prop('--sf-color-inverse', hex(c.surfLight.inverse)));

  // text
  lines.push('');
  lines.push('    /* text */');
  lines.push(prop('--sf-color-text',              hex(c.textLight_.text)));
  lines.push(prop('--sf-color-text--secondary',   hex(c.textLight_.secondary)));
  lines.push(prop('--sf-color-text--placeholder', hex(c.textLight_.placeholder)));
  lines.push(prop('--sf-color-text--disabled',    hex(c.textLight_.disabled)));
  lines.push(prop('--sf-color-text--inverse',     hex(c.textLight_.inverse)));
  lines.push(prop('--sf-color-heading',           hex(c.textLight_.heading)));
  lines.push(prop('--sf-color-code-text',         hex(c.codeText)));

  // text-on-color
  lines.push('');
  lines.push('    /* text-on-color */');
  for (const k of BRAND_KEYS.filter(k => k !== 'base')) {
    lines.push(prop(`--sf-color-text--on-${k}`, hex(c.textOn[k])));
  }
  for (const k of STATUS_KEYS) {
    lines.push(prop(`--sf-color-text--on-${k}`, hex(c.textOn[k])));
  }

  // borders
  lines.push('');
  lines.push('    /* borders */');
  lines.push(prop('--sf-color-border',         hex(c.borL.border)));
  lines.push(prop('--sf-color-border--subtle',  hex(c.borL.subtle)));
  lines.push(prop('--sf-color-border--strong',  hex(c.borL.strong)));
  lines.push(prop('--sf-color-border--disabled',    rgba(c.borderDisabledLight, 0.5)));
  lines.push(prop('--sf-color-border--translucent', rgba(c.neutralLight, 0.15)));

  // links
  lines.push('');
  lines.push('    /* links */');
  lines.push(prop('--sf-color-link',           hex(c.lnkL.link)));
  lines.push(prop('--sf-color-link--hover',    hex(c.lnkL.hover)));
  lines.push(prop('--sf-color-link--active',   hex(c.lnkL.active)));
  lines.push(prop('--sf-color-link--visited',  hex(c.lnkL.visited)));
  lines.push(prop('--sf-color-link--underline', rgba(c.actionLight, 0.3)));

  // interactive states
  lines.push('');
  lines.push('    /* interactive states */');
  lines.push(prop('--sf-color-bg--hover',    rgba(c.neutralLight, 0.08)));
  lines.push(prop('--sf-color-bg--active',   rgba(c.neutralLight, 0.12)));
  lines.push(prop('--sf-color-bg--selected', rgba(c.actionLight,  0.10)));
  lines.push(prop('--sf-color-bg--focus',    rgba(c.actionLight,  0.06)));

  // selection
  lines.push('');
  lines.push('    /* selection */');
  lines.push(prop('--sf-color-selection-bg', rgba(c.selBgLight, 0.28)));

  // mark
  lines.push(prop('--sf-color-mark-bg', rgba(src.warning, 0.25)));

  // status triplets
  lines.push('');
  lines.push('    /* status triplets */');
  for (const k of STATUS_KEYS) {
    const subtleAlpha = (k === 'success' || k === 'warning') ? 0.12 : 0.10;
    lines.push(prop(`--sf-color-${k}-subtle`, rgba(c.rLight[k], subtleAlpha)));
    lines.push(prop(`--sf-color-${k}-strong`, hex(c.statusStrongL[k])));
    lines.push(prop(`--sf-color-${k}-muted`,  rgba(c.rLight[k], 0.3)));
  }

  // shade ramps
  lines.push('');
  lines.push('    /* shade ramps (color-mix fallbacks) */');
  for (const k of ALL_FAMILIES) {
    lines.push(`    /* ${k} */`);
    lines.push(prop(`--sf-color-${k}-superlight`, hex(c.shades[k].superlight)));
    lines.push(prop(`--sf-color-${k}-xlight`,     hex(c.shades[k].xlight)));
    lines.push(prop(`--sf-color-${k}-lighter`,    hex(c.shades[k].lighter)));
    lines.push(prop(`--sf-color-${k}-darker`,     hex(c.shades[k].darker)));
    lines.push(prop(`--sf-color-${k}-xdark`,      hex(c.shades[k].xdark)));
    lines.push(prop(`--sf-color-${k}-superdark`,  hex(c.shades[k].superdark)));
  }

  // alpha aliases (subtle/muted/ghost)
  // Brand families: all three; status families: ghost only (subtle/muted already in status triplets)
  lines.push('');
  lines.push('    /* alpha aliases (subtle / muted / ghost) */');
  for (const k of BRAND_KEYS) {
    lines.push(prop(`--sf-color-${k}-subtle`, rgba(c.rLight[k], 0.10)));
    lines.push(prop(`--sf-color-${k}-muted`,  rgba(c.rLight[k], 0.30)));
    lines.push(prop(`--sf-color-${k}-ghost`,  rgba(c.rLight[k], 0.05)));
  }
  for (const k of STATUS_KEYS) {
    lines.push(prop(`--sf-color-${k}-ghost`,  rgba(c.rLight[k], 0.05)));
  }

  // shadows
  lines.push('');
  lines.push('    /* shadows */');
  for (const [name, value] of Object.entries(c.shadows)) {
    lines.push(prop(`--sf-${name}`, value));
  }

  // gradients
  lines.push('');
  lines.push('    /* gradients */');
  for (const [name, value] of Object.entries(c.gradients)) {
    lines.push(prop(`--sf-${name}`, value));
  }

  lines.push('');
  lines.push('  }');
  lines.push('');
  lines.push('}');
  lines.push('');

  // ── @layer slashed.themes — ungated dark-mode sRGB (Resolved_Tokens only) ─
  lines.push('@layer slashed.themes {');
  lines.push('');
  lines.push('  /* ── Dark-mode sRGB — Resolved_Tokens (ungated, for Old_Engines) ──────── */');

  function resolvedDarkDecls(indent = '    ') {
    const d = [];
    // brand + status
    for (const k of [...BRAND_KEYS, ...STATUS_KEYS]) {
      d.push(prop(`--sf-color-${k}`, hex(c.rDark[k]), indent));
    }
    // text
    d.push(prop('--sf-color-text',              hex(c.textDark_.text),        indent));
    d.push(prop('--sf-color-text--secondary',   hex(c.textDark_.secondary),   indent));
    d.push(prop('--sf-color-text--placeholder', hex(c.textDark_.placeholder), indent));
    d.push(prop('--sf-color-text--disabled',    hex(c.textDark_.disabled),    indent));
    d.push(prop('--sf-color-text--inverse',     hex(c.textDark_.inverse),     indent));
    d.push(prop('--sf-color-heading',           hex(c.textDark_.heading),     indent));
    // borders
    d.push(prop('--sf-color-border',         hex(c.borD.border), indent));
    d.push(prop('--sf-color-border--subtle', hex(c.borD.subtle), indent));
    d.push(prop('--sf-color-border--strong', hex(c.borD.strong), indent));
    // links
    d.push(prop('--sf-color-link',          hex(c.lnkD.link),   indent));
    d.push(prop('--sf-color-link--hover',   hex(c.lnkD.hover),  indent));
    d.push(prop('--sf-color-link--active',  hex(c.lnkD.active), indent));
    d.push(prop('--sf-color-link--visited', hex(c.lnkD.visited), indent));
    // selection
    d.push(prop('--sf-color-selection-bg', rgba(c.selBgDark, 0.55), indent));
    // status-strong
    for (const k of STATUS_KEYS) {
      d.push(prop(`--sf-color-${k}-strong`, hex(c.statusStrongD[k]), indent));
    }
    return d.join('\n');
  }

  function resolvedLightDecls(indent = '    ') {
    const d = [];
    for (const k of [...BRAND_KEYS, ...STATUS_KEYS]) {
      d.push(prop(`--sf-color-${k}`, hex(c.rLight[k]), indent));
    }
    d.push(prop('--sf-color-text',              hex(c.textLight_.text),        indent));
    d.push(prop('--sf-color-text--secondary',   hex(c.textLight_.secondary),   indent));
    d.push(prop('--sf-color-text--placeholder', hex(c.textLight_.placeholder), indent));
    d.push(prop('--sf-color-text--disabled',    hex(c.textLight_.disabled),    indent));
    d.push(prop('--sf-color-text--inverse',     hex(c.textLight_.inverse),     indent));
    d.push(prop('--sf-color-heading',           hex(c.textLight_.heading),     indent));
    d.push(prop('--sf-color-border',         hex(c.borL.border), indent));
    d.push(prop('--sf-color-border--subtle', hex(c.borL.subtle), indent));
    d.push(prop('--sf-color-border--strong', hex(c.borL.strong), indent));
    d.push(prop('--sf-color-link',          hex(c.lnkL.link),   indent));
    d.push(prop('--sf-color-link--hover',   hex(c.lnkL.hover),  indent));
    d.push(prop('--sf-color-link--active',  hex(c.lnkL.active), indent));
    d.push(prop('--sf-color-link--visited', hex(c.lnkL.visited), indent));
    d.push(prop('--sf-color-selection-bg', rgba(c.selBgLight, 0.28), indent));
    for (const k of STATUS_KEYS) {
      d.push(prop(`--sf-color-${k}-strong`, hex(c.statusStrongL[k]), indent));
    }
    return d.join('\n');
  }

  lines.push('  @media (prefers-color-scheme: dark) {');
  lines.push('    :root:not([data-theme]) {');
  lines.push(resolvedDarkDecls('      '));
  lines.push('    }');
  lines.push('  }');
  lines.push('');
  lines.push('  [data-theme="light"] {');
  lines.push(resolvedLightDecls('    '));
  lines.push('  }');
  lines.push('');
  lines.push('  [data-theme="dark"] {');
  lines.push(resolvedDarkDecls('    '));
  lines.push('  }');
  lines.push('');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// ─── main ─────────────────────────────────────────────────────────────────────

function main() {
  let raw;
  try {
    raw = fs.readFileSync(TOKENS, 'utf8');
  } catch (e) {
    console.error(`[gen-fallbacks] Cannot read ${TOKENS}: ${e.message}`);
    process.exit(1);
  }

  const css = raw.replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments

  let src;
  try {
    src = parseSourceTokens(css);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  let computed;
  try {
    computed = computeAll(src);
  } catch (e) {
    console.error(`[gen-fallbacks] Computation error: ${e.message}`);
    process.exit(1);
  }

  // Build output string fully in memory before any write (atomic)
  let output;
  try {
    output = buildCSS(src, computed);
  } catch (e) {
    console.error(`[gen-fallbacks] CSS build error: ${e.message}`);
    process.exit(1);
  }

  // Validate: every source token must appear in output
  for (const k of ALL_FAMILIES) {
    if (!output.includes(`--sf-color-${k}:`)) {
      console.error(`[gen-fallbacks] BUG: missing --sf-color-${k} in output — aborting write`);
      process.exit(1);
    }
  }

  // Atomic write
  fs.writeFileSync(OUTPUT, output, 'utf8');
  console.log(`[gen-fallbacks] → ${OUTPUT.replace(ROOT + '/', '')}`);
  console.log(`[gen-fallbacks] ${output.split('\n').length} lines, ${output.length} bytes`);
}

main();
