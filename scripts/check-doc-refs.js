#!/usr/bin/env node
/**
 * CI gate: hand-written docs must not reference dead API names.
 *
 * check-artifacts.js already guarantees the GENERATED docs (api-index.md,
 * classes.md, token-index.md, tokens.md) are regenerated from source, so those
 * can never drift. The hand-written narrative docs had no such guard — only
 * docs/llm-guide.md's token references were validated (by check-llm-guide.js),
 * and nothing validated class references anywhere. That is exactly how a rename
 * or removal of a token/class could leave a stale mention sitting in
 * architecture.md, components.md, theming.md, … indefinitely.
 *
 * This gate walks every hand-written doc and fails if it references a `--sf-*`
 * token or `.sf-*` class that is not LIVE (see scripts/lib/live-api.js) AND not
 * recorded in docs/ref-allowlist.json. The allowlist is for deliberately
 * non-live mentions — names a removed token for a migration note, an
 * illustrative instance token, an example of a component the framework
 * intentionally does NOT ship, etc. Every allowlist entry carries a reason.
 *
 * Run:
 *   node scripts/check-doc-refs.js       # check only
 *   npm run check:doc-refs               # same via npm
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  buildLiveTokens,
  buildLiveClasses,
  isLiveClass,
  TOKEN_REF_RE,
  CLASS_REF_RE,
} from './lib/live-api.js';

const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');

// Docs excluded from the live-reference scan, each for a genre reason:
//   - generated: check-artifacts.js already regenerates them from source, so
//     they cannot drift and scanning them is redundant.
//   - historical: migration.md exists specifically to name the OLD tokens/
//     classes a release removed — validating it against the LIVE set is
//     category-inappropriate (its whole "Before" column is dead by design).
//   - forward-looking: roadmap.md describes PLANNED, not-yet-shipped API.
//   - policy: names no API at all.
// Every doc that describes CURRENT API (architecture, components, layout,
// motion, states, theming, macros, llm-guide, user-manual, README, CONTRIBUTING)
// stays in scope; deliberate one-off non-live mentions there go in the allowlist.
const EXCLUDED_DOCS = new Map([
  ['docs/api-index.md', 'generated (check-artifacts)'],
  ['docs/classes.md', 'generated (check-artifacts)'],
  ['docs/token-index.md', 'generated (check-artifacts)'],
  ['docs/tokens.md', 'generated (check-artifacts)'],
  ['docs/source-comment-policy.md', 'policy doc — names no API'],
  ['docs/migration.md', 'historical — documents removed API by design'],
  ['docs/roadmap.md', 'forward-looking — documents planned/unshipped API'],
]);

function discoverDocs() {
  const docs = [];
  for (const dir of ['docs', 'user-manual']) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).filter((f) => f.endsWith('.md'))) {
      docs.push(`${dir}/${f}`);
    }
  }
  for (const f of ['README.md', 'CONTRIBUTING.md']) {
    if (fs.existsSync(path.join(ROOT, f))) docs.push(f);
  }
  return docs.filter((rel) => !EXCLUDED_DOCS.has(rel)).sort();
}

function loadAllowlist() {
  const file = path.join(ROOT, 'docs', 'ref-allowlist.json');
  if (!fs.existsSync(file)) return {};
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  // Shape: { "<relPath>": { "<name>": "<reason>", … }, … }. Ignore the _meta
  // key so the file can carry a self-describing header.
  const out = {};
  for (const [rel, names] of Object.entries(parsed)) {
    if (rel === '_meta') continue;
    out[rel] = new Set(Object.keys(names));
  }
  return out;
}

const liveTokens = buildLiveTokens(ROOT);
const liveClasses = buildLiveClasses(ROOT);
const allow = loadAllowlist();
const docs = discoverDocs();

const findings = [];
for (const rel of docs) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const allowed = allow[rel] || new Set();
  text.split('\n').forEach((line, i) => {
    const lineNo = i + 1;
    for (const m of line.matchAll(TOKEN_REF_RE)) {
      const name = m[0];
      // Bare prefixes (trailing hyphen) are glob-like prose, not references.
      if (name.endsWith('-')) continue;
      if (liveTokens.has(name) || allowed.has(name)) continue;
      findings.push({ rel, lineNo, name, kind: 'token' });
    }
    for (const m of line.matchAll(CLASS_REF_RE)) {
      const name = m[0].slice(1); // drop leading dot
      if (name.endsWith('-')) continue;
      if (isLiveClass(name, liveClasses) || allowed.has(name)) continue;
      findings.push({ rel, lineNo, name, kind: 'class' });
    }
  });
}

if (findings.length > 0) {
  console.error(
    `check:doc-refs FAILED — ${findings.length} reference(s) to names that are ` +
    'neither live API nor allowlisted:',
  );
  for (const f of findings) {
    console.error(`  ${f.rel}:${f.lineNo}  ${f.kind}: ${f.name}`);
  }
  console.error(
    '\nFix: update the doc to the current name, remove the stale reference, or — ' +
    'if the mention is deliberate (removed-by-design, historical, illustrative) — ' +
    'add it to docs/ref-allowlist.json with a reason.',
  );
  process.exit(1);
}

const tokenAllow = Object.values(allow).reduce((n, s) => n + s.size, 0);
console.log(
  `check:doc-refs OK — ${docs.length} hand-written docs scanned, ` +
  `all --sf-*/.sf- references live or allowlisted (${tokenAllow} allowlisted).`,
);
