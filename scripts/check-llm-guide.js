#!/usr/bin/env node
/**
 * CI gate: docs/llm-guide.md must stay in sync with the live token registry.
 *
 * Check 1 (hard fail): every --sf-* name mentioned in the guide must exist in
 * token-registry.json as a live (non-removed) token. A stale reference means
 * the guide documents a renamed or deleted token.
 *
 * Check 2 (warning): PUBLIC and PUBLIC-ADVANCED *knob* tokens absent from the
 * guide are reported so authors know what coverage gaps exist. This is a
 * warning, not a failure — the guide is intentionally curated, not exhaustive.
 *
 * Run:
 *   node scripts/check-llm-guide.js          # check only
 *   npm run check:llm-guide                  # same via npm
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GUIDE = path.join(ROOT, 'docs', 'llm-guide.md');
const REGISTRY = path.join(ROOT, 'token-registry.json');
const API_INDEX = path.join(ROOT, 'docs', 'api-index.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`check:llm-guide FAILED: cannot read ${file} (${err.message})`);
    process.exit(1);
  }
}

if (!fs.existsSync(GUIDE)) {
  console.error('check:llm-guide FAILED: docs/llm-guide.md not found.');
  process.exit(1);
}

const guideText = fs.readFileSync(GUIDE, 'utf8');
const registry = readJson(REGISTRY);
const apiIndex = readJson(API_INDEX);

// Live token names (not flagged removed).
const liveTokens = new Set(
  registry.tokens.filter((t) => !t.removed).map((t) => t.name),
);

// PUBLIC + PUBLIC-ADVANCED knob tokens — the ones most likely to need docs.
const publicKnobs = new Set(
  (Array.isArray(apiIndex.entries) ? apiIndex.entries : [])
    .filter((e) => e.type === 'token' && e.role === 'knob' &&
      (e.tier === 'PUBLIC' || e.tier === 'PUBLIC-ADVANCED'))
    .map((e) => e.name),
);

// Extract every --sf-* token name from the guide. Exclude bare prefixes (names
// that end with a hyphen) — those are explanatory glob-like patterns in prose,
// not actual token references (e.g. "--sf-color-text--on-{family}").
const TOKEN_RE = /--sf-[a-z0-9_-]+/g;
const guideRefs = new Set(
  [...guideText.matchAll(TOKEN_RE)]
    .map((m) => m[0])
    .filter((name) => !name.endsWith('-')),
);

// ── Check 1: stale references ────────────────────────────────────────────────
const stale = [...guideRefs].filter((name) => !liveTokens.has(name)).sort();

// ── Check 2: undocumented PUBLIC knob tokens (warning only) ──────────────────
const undocumented = [...publicKnobs].filter((name) => !guideRefs.has(name)).sort();

// ── Report ───────────────────────────────────────────────────────────────────
let failed = false;

if (stale.length > 0) {
  failed = true;
  console.error('check:llm-guide FAILED — guide references tokens not in the live registry:');
  for (const name of stale) console.error(`  stale: ${name}`);
  console.error(
    '\nFix: either update the guide to use the current token name, ' +
    'or remove the reference if the token was deleted.',
  );
}

if (undocumented.length > 0) {
  console.warn(
    `\ncheck:llm-guide WARNING — ${undocumented.length} PUBLIC/PUBLIC-ADVANCED knob token(s) ` +
    'not mentioned in docs/llm-guide.md:',
  );
  for (const name of undocumented) console.warn(`  undocumented: ${name}`);
  console.warn('\nThese may or may not need guide entries — review and add as appropriate.');
}

if (failed) {
  process.exit(1);
}

console.log(
  `check:llm-guide OK — ${guideRefs.size} token refs validated, ` +
  `${undocumented.length} undocumented PUBLIC knobs (warning only).`,
);
