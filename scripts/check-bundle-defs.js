#!/usr/bin/env node
/**
 * CI gate (#582 D6): every no-fallback token consumption in a bundle must have
 * its definition ship in that same bundle.
 *
 * The existing tests check flat cascade ORDERING, not whether a bundle actually
 * contains a definition for every token it reads. A `var(--sf-x)` with no
 * fallback in a bundle that never declares --sf-x resolves to the guaranteed-
 * invalid/initial value — a silent breakage that only shows up at runtime in
 * that specific bundle. This gate reads bundle.config.json, concatenates each
 * bundle's sources, and fails if any bundle consumes a token (without a
 * fallback) that it never declares (`@property --sf-x` or `--sf-x:`).
 *
 * Fallback consumptions — `var(--sf-x, <default>)` — are intentionally NOT
 * checked: the fallback is the safety net (that's the hook-token pattern,
 * scripts/hook-tokens.js). Only bare `var(--sf-x)` needs a guaranteed def.
 *
 * Run:
 *   node scripts/check-bundle-defs.js
 *   npm run check:bundle-defs
 */

import fs from 'node:fs';
import path from 'node:path';
import { stripComments } from './lib/parse.js';

const _root = process.env.SLASHED_ROOT?.trim();
const ROOT = _root ? path.resolve(_root) : path.resolve(import.meta.dirname, '..');
const CONFIG = path.join(ROOT, 'bundle.config.json');

const { bundles } = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));

const failures = [];
for (const bundle of bundles) {
  let css = '';
  for (const rel of bundle.files) {
    css += '\n' + stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  }

  const declared = new Set();
  for (const m of css.matchAll(/@property\s+(--sf-[a-z0-9_-]+)/g)) declared.add(m[1]);
  for (const m of css.matchAll(/(--sf-[a-z0-9_-]+)\s*:/g)) declared.add(m[1]);

  // Bare consumption only: var(--sf-x) with no comma/fallback.
  const missing = new Set();
  for (const m of css.matchAll(/var\(\s*(--sf-[a-z0-9_-]+)\s*\)/g)) {
    if (!declared.has(m[1])) missing.add(m[1]);
  }

  if (missing.size) {
    failures.push(`${path.basename(bundle.output)}: consumes but never defines ${[...missing].sort().join(', ')}`);
  }
}

if (failures.length) {
  console.error('check:bundle-defs FAILED — a bundle reads a token it never ships a definition for:');
  for (const f of failures) console.error(`  ${f}`);
  console.error('\nFix: add the token\'s source file to that bundle in bundle.config.json, or give the consumer a fallback.');
  process.exit(1);
}

console.log(`check:bundle-defs OK — all ${bundles.length} bundles define every token they consume without a fallback.`);
