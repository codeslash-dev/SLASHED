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
 *   node scripts/audit.js              — write docs/registry.json
 *   node scripts/audit.js --check      — validate (exit 1 if stale or wrong)
 *   node scripts/audit.js --unused     — report tokens declared but never consumed
 *                                        by the framework itself (warnings only)
 */

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const { TOKEN_FILES, CLASS_FILES } = require('./registry-sources');

// All framework source files — token files + class files + everything else
// in core/ and optional/ — used for the unused-token cross-reference.
const ALL_SOURCE_FILES = [
  ...fs.readdirSync(path.join(ROOT, 'core')).filter(f => f.endsWith('.css')).map(f => `core/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'optional')).filter(f => f.endsWith('.css')).map(f => `optional/${f}`),
];

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

// ── Unprefixed class extraction ──────────────────────────────────────────────
// Finds class selectors that are NOT .sf-* or .is-* (accessibility helpers,
// print utilities, theme utilities, etc.)

function extractUnprefixedClasses() {
  const names = new Set();
  const re = /\.([a-z][\w-]*)/g;
  for (const rel of CLASS_FILES) {
    let css = stripStrings(stripComments(readFile(rel)));
    // Strip @layer declarations so dotted layer names aren't matched as classes
    css = css.replace(/@layer\s+[^{;]+[{;]/g, '');
    for (const m of css.matchAll(re)) {
      const name = m[1];
      // Skip sf- and is- prefixed (already tracked separately)
      if (name.startsWith('sf-') || name.startsWith('is-')) continue;
      names.add(name);
    }
  }
  return [...names].sort();
}

// ── Unused token detection ───────────────────────────────────────────────────
// Cross-references declared tokens against all framework source files.
// A token is "unused by the framework" when it never appears as var(--sf-name)
// in any source file. This is a WARNING, not an error — many tokens are
// intentionally public API knobs consumed by consumers, not by the framework.
//
// Exceptions (never flagged as unused):
//   - Tokens declared via @property (typed registrations; their usage is the
//     registration itself, not a var() call)
//   - Tokens consumed only as fallback values inside other var() calls
//     (e.g. var(--sf-foo, var(--sf-bar)) — --sf-bar is a valid public default)

function findUnusedTokens(tokens) {
  // Build the full text corpus of all source files combined.
  const corpus = ALL_SOURCE_FILES.map(rel => {
    try { return stripComments(readFile(rel)); } catch (err) {
      console.warn(`[audit] warning: could not read ${rel} for unused-token check: ${err.message}`);
      return '';
    }
  }).join('\n');

  // Collect @property-registered names — these are never flagged.
  const propertyRegistered = new Set();
  for (const rel of TOKEN_FILES) {
    const css = stripComments(readFile(rel));
    for (const m of css.matchAll(/@property\s+(--sf-[\w-]+)/g)) {
      propertyRegistered.add(m[1]);
    }
  }

  // For each declared token, check whether var(--sf-name) appears anywhere.
  const unused = [];
  for (const name of tokens) {
    if (propertyRegistered.has(name)) continue;
    // Match var(--sf-name) with optional whitespace — covers var( --sf-foo )
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`var\\(\\s*${escaped}[\\s,)]`);
    if (!pattern.test(corpus)) {
      unused.push(name);
    }
  }
  return unused;
}

const tokens           = extractTokens();
const sfClasses        = extractClasses('sf-');
const isClasses        = extractClasses('is-');
const unprefixedClasses = extractUnprefixedClasses();

const registry = {
  _meta: {
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
  unprefixed_classes: unprefixedClasses,
};

const OUT = path.join(ROOT, 'docs', 'registry.json');

if (process.argv.includes('--unused')) {
  const unused = findUnusedTokens(tokens);
  if (unused.length === 0) {
    console.log('[audit] unused-tokens: none — all declared tokens are consumed by the framework.');
  } else {
    console.log(`[audit] unused-tokens: ${unused.length} token(s) declared but not consumed by the framework.`);
    console.log('        These may be intentional public API knobs for consumers.');
    for (const name of unused) console.log(`  ${name}`);
  }
  process.exit(0);
}

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
  diff('unprefixed-class', unprefixedClasses, stored.unprefixed_classes || []);

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
