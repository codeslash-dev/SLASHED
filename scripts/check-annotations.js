#!/usr/bin/env node
/**
 * CI gate (#582 D2): keep docs/token-annotations.json prose honest against the
 * tokens' real declared values.
 *
 * token-annotations.json is the hand-authored source of every token
 * description; api-index.{json,md} are generated from it. Nothing previously
 * compared the prose to the value, so an annotation could claim "~50ms" for a
 * 100ms token or "~36px" for a 40px one (the B1/B2 findings in #582).
 *
 * Heuristics (deliberately conservative — hard-fail only on the unambiguous
 * cases, warn on the rest, per #582 D2):
 *   - HARD FAIL: an annotation stating "~N ms" whose token resolves to a
 *     concrete millisecond literal ≠ N.
 *   - HARD FAIL: an annotation stating "~N px" whose token resolves to a
 *     SIMPLE length (a bare `rem`/`px` value, optionally one var() alias deep)
 *     ≠ N (±1px for rem rounding). Fluid clamp()/calc() values are
 *     unresolvable here and skipped — their "~px" is a reference hint, not a
 *     literal.
 *   - WARN: an annotation asserting the token is the "default for <controls>"
 *     while no shipped rule consumes it.
 *
 * Run:
 *   node scripts/check-annotations.js
 *   npm run check:annotations
 */

import fs from 'node:fs';
import path from 'node:path';
import { stripComments, readValue } from './lib/parse.js';
import { TOKEN_FILES } from './registry-sources.js';

const _root = process.env.SLASHED_ROOT?.trim();
const ROOT = _root ? path.resolve(_root) : path.resolve(import.meta.dirname, '..');
const ANNOTATIONS = path.join(ROOT, 'docs', 'token-annotations.json');

const PX_PER_REM = 16;   // SLASHED's :root font-size baseline
const PX_TOLERANCE = 1;  // absorb rem→px rounding (e.g. 0.6875rem = 11px)

// ── Declared values + @property initial-values ───────────────────────────────
const declaredValue = new Map();
const initialValue = new Map();
for (const rel of TOKEN_FILES) {
  const css = stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  const re = /(--sf-[a-z0-9_-]+)\s*:/g;
  let m;
  while ((m = re.exec(css))) {
    declaredValue.set(m[1], readValue(css, re.lastIndex - 1)); // last declaration wins
  }
  for (const mm of css.matchAll(/@property\s+(--sf-[a-z0-9_-]+)\s*\{[^}]*initial-value:\s*([^;}]+)[;}]/g)) {
    initialValue.set(mm[1], mm[2].trim());
  }
}

// Framework consumption corpus (for the "default for X" warning).
let corpus = '';
for (const dir of ['core', 'optional']) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter((f) => f.endsWith('.css'))) {
    corpus += '\n' + stripComments(fs.readFileSync(path.join(abs, f), 'utf8'));
  }
}
const isConsumed = (name) => {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`var\\(\\s*${esc}[\\s,)]`).test(corpus);
};

/** Resolve a token to its base value, following at most a chain of pure var() aliases. */
function baseValue(name, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  let v = declaredValue.get(name) ?? initialValue.get(name);
  if (v == null) return null;
  v = v.trim();
  const alias = v.match(/^var\(\s*(--sf-[a-z0-9_-]+)\s*(?:,[^)]*)?\)$/);
  if (alias) return baseValue(alias[1], seen);
  return v;
}

/**
 * Milliseconds if the base value is a single concrete ms literal, else null.
 * Accepts a bare `Nms` or the framework's scaled form `calc(Nms * var(--sf-motion-scale))`
 * (the annotation quotes the unscaled base). Anchored end-to-end so compound
 * expressions such as `calc(100ms + 200ms)` resolve to null rather than silently
 * yielding the first literal — matching how resolvePx rejects non-literal lengths.
 */
function resolveMs(name) {
  const v = baseValue(name);
  if (v == null) return null;
  let m = v.match(/^(-?[\d.]+)\s*ms$/);
  if (m) return Number(m[1]);
  m = v.match(/^calc\(\s*(-?[\d.]+)\s*ms\s*\*\s*var\(\s*--sf-motion-scale\s*\)\s*\)$/);
  return m ? Number(m[1]) : null;
}

/** Pixels if the base value is a simple bare rem/px length, else null. */
function resolvePx(name) {
  const v = baseValue(name);
  if (v == null) return null;
  let m = v.match(/^(-?[\d.]+)rem$/);
  if (m) return Number(m[1]) * PX_PER_REM;
  m = v.match(/^(-?[\d.]+)px$/);
  if (m) return Number(m[1]);
  return null;
}

const annotations = JSON.parse(fs.readFileSync(ANNOTATIONS, 'utf8')).tokens ?? {};

const errors = [];
const warnings = [];

for (const [name, note] of Object.entries(annotations)) {
  if (typeof note !== 'string' || !name.startsWith('--sf-')) continue;

  const ms = note.match(/~\s*([\d.]+)\s*ms/i);
  if (ms) {
    const actual = resolveMs(name);
    if (actual != null && Math.abs(actual - Number(ms[1])) > 0.5) {
      errors.push(`${name}: annotation says ~${ms[1]}ms but the token resolves to ${actual}ms.`);
    }
  }

  const px = note.match(/~\s*([\d.]+)\s*px/i);
  if (px) {
    const actual = resolvePx(name);
    if (actual != null && Math.abs(actual - Number(px[1])) > PX_TOLERANCE) {
      errors.push(`${name}: annotation says ~${px[1]}px but the token resolves to ${actual}px (${baseValue(name)}).`);
    }
  }

  if (/\bdefault (?:size )?for\b.*\b(button|input|field|control)/i.test(note) && !isConsumed(name)) {
    warnings.push(`${name}: annotation claims it's the default for controls, but no shipped rule consumes it.`);
  }
}

if (warnings.length) {
  console.warn(`check:annotations WARNING — ${warnings.length} prose claim(s) worth reviewing:`);
  for (const w of warnings) console.warn(`  ${w}`);
}

if (errors.length) {
  console.error('check:annotations FAILED — annotation prose disagrees with the token value:');
  for (const e of errors) console.error(`  ${e}`);
  console.error('\nFix: correct the ~N ms/px figure in docs/token-annotations.json (then run npm run docs:api).');
  process.exit(1);
}

console.log('check:annotations OK — every resolvable ~ms/~px figure matches its token value.');
