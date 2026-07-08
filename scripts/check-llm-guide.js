#!/usr/bin/env node
/**
 * CI gate: docs/llm-guide.md must stay in sync with the live token set.
 *
 * Check 1 (hard fail): every --sf-* name mentioned in the guide must exist as
 * a live token. The live set is the union of:
 *   a) token-registry.json (non-removed entries) — the catalogued public API
 *   b) --sf-* custom property declarations in core/ and optional/ CSS files —
 *      catches scoped override hooks (e.g. --sf-field-border-color) that are
 *      actively used in the framework but not yet catalogued in the registry.
 *
 * Check 2 (warning): PUBLIC and PUBLIC-ADVANCED *knob* tokens absent from the
 * guide are reported so authors know what coverage gaps exist. This is a
 * warning, not a failure — the guide is intentionally curated, not exhaustive.
 *
 * Note on shorthand notation: the guide uses compact forms like
 * "--sf-animation-fade-in / -fade-out". Only the first fully-prefixed name in
 * each group is validated by Check 1. Shorthand suffixes (/ -foo) are not
 * individually checked — authors must verify those manually when renaming tokens.
 *
 * Run:
 *   node scripts/check-llm-guide.js          # check only
 *   npm run check:llm-guide                  # same via npm
 */

import fs from 'node:fs';
import path from 'node:path';

// SLASHED_ROOT lets negative tests run the gate against a fixture tree. An
// empty/whitespace value counts as unset; a relative override is resolved to
// absolute so path.join below never targets the process CWD.
const ROOT = process.env.SLASHED_ROOT?.trim()
  ? path.resolve(process.env.SLASHED_ROOT)
  : path.resolve(import.meta.dirname, '..');
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

// Live set a): token-registry.json (non-removed entries).
const liveTokens = new Set(
  registry.tokens.filter((t) => !t.removed).map((t) => t.name),
);

// Live set b): any --sf-* declared as a custom property in CSS source files.
// Matches "  --sf-foo:" (declaration) and "--sf-foo," / "--sf-foo)" in
// comment-listed token inventories in tokens.css headers.
const CSS_DECL_RE = /--sf-[a-z0-9_-]+(?=\s*[:,)])/g;
const cssDirs = [path.join(ROOT, 'core'), path.join(ROOT, 'optional')];
for (const dir of cssDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.css'))) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    for (const m of text.matchAll(CSS_DECL_RE)) liveTokens.add(m[0]);
  }
}

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
