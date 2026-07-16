#!/usr/bin/env node
/**
 * CI gate: docs/llm-guide.md must stay in sync with the live token set.
 *
 * Check 1 (hard fail): every --sf-* name mentioned in the guide must exist as
 * a live token. The live set is the union of:
 *   a) token-registry.json (non-removed entries) — the catalogued public API
 *   b) --sf-* custom property DECLARATIONS in core/ and optional/ CSS files —
 *      `@property --sf-x` registrations and `--sf-x:` declarations only, NOT
 *      `var(--sf-x)` consumption. Catches scoped override hooks (e.g.
 *      --sf-field-border-color) that are actively declared in the framework but
 *      not yet catalogued in the registry, without letting a guide reference a
 *      name that is *only ever consumed* slip through unnoticed (#582 D3).
 *   c) the fallback-only hook tokens (scripts/hook-tokens.js) — deliberately
 *      undeclared override hooks the guide is allowed to name (#582 D5).
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
import { buildLiveTokens } from './lib/live-api.js';

// SLASHED_ROOT lets negative tests run the gate against a fixture tree. An
// empty/whitespace value counts as unset; a relative override is resolved to
// absolute so path.join below never targets the process CWD.
const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');
const GUIDE = path.join(ROOT, 'docs', 'llm-guide.md');
const API_INDEX = path.join(ROOT, 'docs', 'api-index.json');
const TOKEN_INDEX = path.join(ROOT, 'docs', 'token-index.json');

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
const apiIndex = readJson(API_INDEX);

// Live token set (registry + declared CSS custom properties + hook tokens),
// built by the shared scripts/lib/live-api.js so this gate and check-doc-refs.js
// agree on one definition of "live".
const liveTokens = buildLiveTokens(ROOT);

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

// ── Check 3: header token count ──────────────────────────────────────────────
// The hand-maintained "> Version: **X** · Tokens: **N** · …" header used to
// drift silently — N stayed at 686 across dozens of token additions because no
// gate guarded it. Assert it equals the generated total (the same 754 that
// token-index.md/tokens.md/api-index.md headline), sourced from the token-index
// _meta so there is exactly one authority. Enforced only when token-index.json
// exists — it is a committed, check-artifacts-guarded artifact that production
// always has; minimal test fixtures omit it and legitimately skip this check.
let tokenCountError = null;
if (fs.existsSync(TOKEN_INDEX)) {
  const expectedTokenCount = readJson(TOKEN_INDEX)?._meta?.counts?.tokens;
  const headerMatch = guideText.match(/Tokens:\s*\*\*(\d+)\*\*/);
  if (typeof expectedTokenCount !== 'number') {
    tokenCountError = 'docs/token-index.json _meta.counts.tokens missing — cannot verify header';
  } else if (!headerMatch) {
    tokenCountError = 'docs/llm-guide.md: "Tokens: **N**" header field not found';
  } else if (Number(headerMatch[1]) !== expectedTokenCount) {
    tokenCountError =
      `docs/llm-guide.md header token count "${headerMatch[1]}" != live total "${expectedTokenCount}" ` +
      `(from docs/token-index.json). Update the header to Tokens: **${expectedTokenCount}**.`;
  }
}

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

if (tokenCountError) {
  failed = true;
  console.error(`check:llm-guide FAILED — ${tokenCountError}`);
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
