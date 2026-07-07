#!/usr/bin/env node
/**
 * Drift-check between CSS macro selectors and docs/macros.md.
 *
 * Reports:
 *   - .sf-* classes present in source CSS but absent from docs
 *   - .sf-* class names mentioned in docs but absent from CSS
 *
 * Exits 1 if any drift is found.
 *
 * Usage:
 *   node scripts/check-macro-catalog.js
 */

import fs   from 'node:fs';
import path from 'node:path';
import { stripComments, stripStrings } from './lib/parse.js';

const ROOT = path.resolve(import.meta.dirname, '..');

// Source files that define the macro layer
const CSS_SOURCES = [
  'core/macros.css',
  'core/motion.css',
];

// Classes present in macro CSS but documented outside docs/macros.md
// (layout primitives cross-referenced in comments, BEM elements, motion aliases).
const SKIP_IN_CSS = new Set([
  '.sf-card', '.sf-cluster', '.sf-frame', '.sf-grid',
  '.sf-reel', '.sf-section', '.sf-stack',
  '.sf-scrim__content',
  '.sf-fade-in', '.sf-fade-out', '.sf-scale-up', '.sf-scale-down',
  '.sf-slide-in-up', '.sf-slide-in-down', '.sf-slide-in-left', '.sf-slide-in-right',
  '.sf-color-pulse',
]);

// Classes mentioned in macros.md as cross-references but NOT expected to be
// defined in the macro CSS sources (they live in layout CSS, documented elsewhere).
const SKIP_IN_DOCS = new Set([
  '.sf-frame', '.sf-reel', '.sf-bg-layer',
  // Defined in core/states.css (outside the macro sources above); macros.md
  // only cross-references it from .sf-no-tap-highlight.
  '.sf-is-active',
]);

// ── 1. Collect classes from CSS ───────────────────────────────────────────────

const cssClasses = new Set();
for (const rel of CSS_SOURCES) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.error(`[check:macros] Missing source file: ${rel}`);
    process.exit(1);
  }
  const raw  = fs.readFileSync(abs, 'utf8');
  const text = stripStrings(stripComments(raw));
  for (const [match] of text.matchAll(/\.sf-[\w-]+/g)) cssClasses.add(match);
}

for (const cls of SKIP_IN_CSS) cssClasses.delete(cls);

// ── 2. Collect class names from docs/macros.md ────────────────────────────────

const docsPath = path.join(ROOT, 'docs', 'macros.md');
if (!fs.existsSync(docsPath)) {
  console.error('[check:macros] docs/macros.md not found');
  process.exit(1);
}
const docsText = fs.readFileSync(docsPath, 'utf8');

const docsClasses = new Set();
const unmatchedWildcards = [];

// Single pass: match every `.sf-...` token and check if a `*` follows it.
const SF_CLASS_RE = /\.(sf-[\w-]+)(\*)?/g;
for (const [, name, glob] of docsText.matchAll(SF_CLASS_RE)) {
  if (glob) {
    // Wildcard: `.sf-entrance--*` — expand against CSS classes
    const prefix = `.${name}`;
    let matched = false;
    for (const cls of cssClasses) {
      if (cls.startsWith(prefix)) { docsClasses.add(cls); matched = true; }
    }
    if (!matched) unmatchedWildcards.push(`${prefix}*`);
  } else {
    docsClasses.add(`.${name}`);
  }
}

for (const cls of SKIP_IN_DOCS) docsClasses.delete(cls);

// ── 3. Compare ────────────────────────────────────────────────────────────────

const inCssOnly  = [...cssClasses].filter(c => !docsClasses.has(c)).sort();
const inDocsOnly = [...docsClasses].filter(c => !cssClasses.has(c)).sort();

let ok = true;

if (unmatchedWildcards.length > 0) {
  ok = false;
  console.error('[check:macros] Wildcards in docs/macros.md with no matching source classes:');
  for (const w of unmatchedWildcards) console.error(`  ${w}`);
}

if (inCssOnly.length > 0) {
  ok = false;
  console.error('[check:macros] In CSS but NOT documented in docs/macros.md:');
  for (const c of inCssOnly) console.error(`  ${c}`);
}

if (inDocsOnly.length > 0) {
  ok = false;
  console.error('[check:macros] In docs/macros.md but NOT in source CSS:');
  for (const c of inDocsOnly) console.error(`  ${c}`);
}

if (ok) {
  console.log(`[check:macros] OK — ${cssClasses.size} macro classes, all documented.`);
} else {
  process.exit(1);
}
