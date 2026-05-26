#!/usr/bin/env node
/**
 * Canonical source-of-truth for SLASHED's public API surface.
 *
 * Writes docs/registry.json with exact counts and lists of:
 *   - design tokens  (--sf-*): parsed from token source files
 *   - layout classes (.sf-*): parsed from CSS source files
 *   - state classes  (.is-*): parsed from CSS source files
 *
 * This is the one authoritative parser. All other counts must match it.
 *
 * Parsing contract (no exceptions):
 *   1. Block comments stripped first, before any pattern matching
 *   2. CSS string literals stripped before class matching
 *   3. @property registrations counted from comment-stripped text
 *   4. Custom-property declarations (--sf-name:) counted from comment-stripped text
 *   5. Results deduplicated across all files via a single global Set
 *   6. Source files only — never dist
 *
 * Usage:
 *   node scripts/audit.js           — write docs/registry.json
 *   node scripts/audit.js --check   — validate (exit 1 if stale or wrong)
 */

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const { TOKEN_FILES, CLASS_FILES } = require('./registry-sources');

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function stripStrings(css) {
  // Prevent matching class names that appear inside CSS string values
  return css.replace(/"[^"]*"|'[^']*'/g, '""');
}

function readFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    throw new Error(`[audit] Missing canonical source file: ${rel}`);
  }
  return fs.readFileSync(abs, 'utf8');
}

// ── Token extraction ─────────────────────────────────────────────────────────
// Counts only from TOKEN_FILES, never from dist or class files.
// Both @property registrations and :root/:selector declarations are counted.
// A name appearing in both forms is counted exactly once (Set).

function extractTokens() {
  const names = new Set();
  for (const rel of TOKEN_FILES) {
    const css = stripComments(readFile(rel));
    for (const m of css.matchAll(/@property\s+(--sf-[\w-]+)/g))  names.add(m[1]);
    for (const m of css.matchAll(/(--sf-[\w-]+)\s*:/g))          names.add(m[1]);
  }
  return [...names].sort();
}

// ── Class extraction ─────────────────────────────────────────────────────────
// Counts only from CLASS_FILES.
// Matches class selectors: .sf-name or .is-name. Strips both comments and
// string literals first so content:"…" values don't produce false positives.

function extractClasses(prefix) {
  const names = new Set();
  const re = new RegExp(`\\.(${prefix}[\\w-]+)`, 'g');
  for (const rel of CLASS_FILES) {
    const css = stripStrings(stripComments(readFile(rel)));
    for (const m of css.matchAll(re)) names.add(m[1]);
  }
  return [...names].sort();
}

// ── Main ─────────────────────────────────────────────────────────────────────

const tokens    = extractTokens();
const sfClasses = extractClasses('sf-');
const isClasses = extractClasses('is-');

const registry = {
  _meta: {
    generated_at:  new Date().toISOString(),
    token_sources: TOKEN_FILES,
    class_sources: CLASS_FILES,
    counts: {
      tokens:     tokens.length,
      sf_classes: sfClasses.length,
      is_classes: isClasses.length,
    },
  },
  tokens,
  sf_classes: sfClasses,
  is_classes: isClasses,
};

const OUT = path.join(ROOT, 'docs', 'registry.json');

if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUT)) {
    console.error('[audit] docs/registry.json not found — run: node scripts/audit.js');
    process.exit(1);
  }

  const stored = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const errors = [];

  function diff(label, current, stored) {
    const added   = current.filter(n => !stored.includes(n));
    const removed = stored.filter(n => !current.includes(n));
    if (added.length)   errors.push(`${label} added:   ${added.join(', ')}`);
    if (removed.length) errors.push(`${label} removed: ${removed.join(', ')}`);
  }

  diff('token',    tokens,    stored.tokens);
  diff('sf-class', sfClasses, stored.sf_classes);
  diff('is-class', isClasses, stored.is_classes);

  if (errors.length) {
    console.error('[audit] registry.json is stale — run: node scripts/audit.js');
    for (const e of errors) console.error(' ', e);
    process.exit(1);
  }

  console.log(
    `[audit] OK — ${tokens.length} tokens, ` +
    `${sfClasses.length} .sf-classes, ${isClasses.length} .is-classes`
  );
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n');
  console.log(
    `[audit] → docs/registry.json` +
    ` (${tokens.length} tokens,` +
    ` ${sfClasses.length} .sf-classes,` +
    ` ${isClasses.length} .is-classes)`
  );
}
