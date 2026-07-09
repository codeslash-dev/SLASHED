#!/usr/bin/env node
/**
 * CI gate (#582 D4): lock down the hand-maintained "keep in sync" mirrors that
 * only a "do NOT edit independently" comment currently protects. Three families:
 *
 *   A. @property ↔ :root char-for-char mirrors. Engines without @property read
 *      the plain :root value, so it must equal the registered initial-value
 *      exactly. Covers the -source-light colour registrations and the fluid
 *      scale engine's <number> scalars (core/tokens.css).
 *
 *   B. Container-query re-derivations. .sf-fluid-cq > * (core/layout.css)
 *      re-declares every fluid --sf-text-* / --sf-space-* / --sf-text-display-*
 *      formula so it re-resolves against 100cqi. Each formula must be identical
 *      to the token's declaration in core/tokens.css (both read
 *      var(--sf-fluid-width)); only --sf-fluid-width itself differs by design.
 *
 *   C. SL-001 dark-source derivation. The -source-dark @property initial-values
 *      (core/tokens.css) are hand-computed from the matching -source-light value
 *      via the oklch clamp() formula declared in core/themes.css. This re-runs
 *      that formula on the light value and checks the registered dark literal
 *      matches (numerically).
 *
 * Run:
 *   node scripts/check-mirrors.js
 *   npm run check:mirrors
 */

import fs from 'node:fs';
import path from 'node:path';
import { stripComments, readValue } from './lib/parse.js';

const _root = process.env.SLASHED_ROOT?.trim();
const ROOT = _root ? path.resolve(_root) : path.resolve(import.meta.dirname, '..');
const read = (rel) => stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

const tokensCss = read('core/tokens.css');
const layoutCss = read('core/layout.css');
const themesCss = read('core/themes.css');

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const errors = [];

// ── Parse helpers ────────────────────────────────────────────────────────────

/** name → @property initial-value (raw string) */
function propertyInitials(css) {
  const map = new Map();
  for (const m of css.matchAll(/@property\s+(--sf-[a-z0-9_-]+)\s*\{([^}]*)\}/g)) {
    const im = m[2].match(/initial-value:\s*([^;}]+)/);
    if (im) map.set(m[1], norm(im[1]));
  }
  return map;
}

/** name → @property syntax descriptor */
function propertySyntax(css) {
  const map = new Map();
  for (const m of css.matchAll(/@property\s+(--sf-[a-z0-9_-]+)\s*\{([^}]*)\}/g)) {
    const sm = m[2].match(/syntax:\s*"([^"]*)"/);
    if (sm) map.set(m[1], sm[1]);
  }
  return map;
}

/** Collect the last `--name: value` declaration for each token across the file. */
function allDeclarations(css) {
  const map = new Map();
  const re = /(--sf-[a-z0-9_-]+)\s*:/g;
  let m;
  while ((m = re.exec(css))) {
    map.set(m[1], norm(readValue(css, re.lastIndex - 1)));
  }
  return map;
}

/** Collect declarations inside the first rule whose selector matches `selectorRe`. */
function declarationsInRule(css, selectorRe) {
  const start = css.search(selectorRe);
  if (start === -1) return new Map();
  const open = css.indexOf('{', start);
  let depth = 0, end = open;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  const body = css.slice(open + 1, end);
  const map = new Map();
  const re = /(--sf-[a-z0-9_-]+)\s*:/g;
  let m;
  while ((m = re.exec(body))) {
    map.set(m[1], norm(readValue(body, re.lastIndex - 1)));
  }
  return map;
}

const initials = propertyInitials(tokensCss);
const syntaxes = propertySyntax(tokensCss);
const rootDecls = allDeclarations(tokensCss);

// ── A. @property ↔ :root char-for-char mirrors ───────────────────────────────
// -source-light colours + fluid <number> scalars: both are declared plainly on
// :root with a value identical to the registered initial-value.
const mirrorNames = [...initials.keys()].filter(
  (n) => /^--sf-color-.*-source-light$/.test(n) || syntaxes.get(n) === '<number>',
);
let mirrorChecked = 0;
for (const name of mirrorNames) {
  const init = initials.get(name);
  const root = rootDecls.get(name);
  if (root === undefined) {
    errors.push(`A: ${name} is @property-registered but has no plain :root mirror.`);
    continue;
  }
  mirrorChecked++;
  if (init !== root) {
    errors.push(`A: ${name} :root mirror "${root}" ≠ @property initial-value "${init}".`);
  }
}

// ── B. Container-query re-derivations ────────────────────────────────────────
const cqDecls = declarationsInRule(layoutCss, /\.sf-fluid-cq\s*>\s*\*/);
let cqChecked = 0;
for (const [name, cqValue] of cqDecls) {
  if (name === '--sf-fluid-width') continue; // intentionally 100cqi, not the vw default
  const base = rootDecls.get(name);
  if (base === undefined) {
    errors.push(`B: .sf-fluid-cq re-declares ${name} but core/tokens.css never declares it.`);
    continue;
  }
  cqChecked++;
  if (cqValue !== base) {
    errors.push(`B: .sf-fluid-cq ${name} formula drifted from core/tokens.css.\n      cq:     ${cqValue}\n      tokens: ${base}`);
  }
}

// ── C. SL-001 dark-source derivation ─────────────────────────────────────────
// Evaluate a clamp()/calc() expression of a single variable (l or c).
function evalExpr(expr, varName, value) {
  let e = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), `(${value})`);
  // clamp(min, val, max) → _clamp(min, val, max)
  e = e.replace(/\bclamp\(/g, '_clamp(').replace(/\bcalc\(/g, '(');
  // eslint-disable-next-line no-new-func
  const fn = new Function('_clamp', `return ${e};`);
  return fn((min, val, max) => Math.min(Math.max(val, min), max));
}
function parseOklch(str) {
  const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  return m ? { l: +m[1], c: +m[2], h: +m[3] } : null;
}

let slChecked = 0;
// themes.css: --sf-color-X-source-dark: oklch(from var(--sf-color-X-source-light) <Lexpr> <Cexpr> h);
const DARK_RE = /(--sf-color-[a-z0-9-]+-source-dark)\s*:\s*oklch\(from var\(--sf-color-([a-z0-9-]+)-source-light\)\s+(.+?)\s+h\)\s*;/g;
for (const m of themesCss.matchAll(DARK_RE)) {
  const darkName = m[1];
  const light = parseOklch(initials.get(`--sf-color-${m[2]}-source-light`) ?? '');
  const darkLit = parseOklch(initials.get(darkName) ?? '');
  if (!light || !darkLit) continue;

  // Split "<Lexpr> <Cexpr>" at the space between the two top-level terms.
  const terms = m[3];
  let depth = 0, split = -1;
  for (let i = 0; i < terms.length; i++) {
    if (terms[i] === '(') depth++;
    else if (terms[i] === ')') depth--;
    else if (terms[i] === ' ' && depth === 0) { split = i; break; }
  }
  const lExpr = terms.slice(0, split);
  const cExpr = terms.slice(split + 1);

  const expectedL = evalExpr(lExpr, 'l', light.l);
  const expectedC = evalExpr(cExpr, 'c', light.c);
  slChecked++;
  if (Math.abs(expectedL - darkLit.l) > 1e-6 || Math.abs(expectedC - darkLit.c) > 1e-6 || light.h !== darkLit.h) {
    errors.push(
      `C: ${darkName} registered oklch(${darkLit.l} ${darkLit.c} ${darkLit.h}) ` +
      `≠ SL-001 derivation oklch(${+expectedL.toFixed(6)} ${+expectedC.toFixed(6)} ${light.h}).`,
    );
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error('check:mirrors FAILED:');
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `check:mirrors OK — ${mirrorChecked} @property↔:root mirrors, ` +
  `${cqChecked} container-query re-derivations, ${slChecked} SL-001 dark derivations verified.`,
);
