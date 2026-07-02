#!/usr/bin/env node
/**
 * Generates the SLASHED token INDEX — every --sf-* custom property cross-referenced
 * by source file, stability tier (PUBLIC / PUBLIC-ADVANCED / INTERNAL) and whether a
 * legacy (HSL) fallback exists in core/tokens.color-fallbacks.css.
 *
 * Run: npm run docs:index   (or: node scripts/gen-token-index.js)
 *
 * Outputs (both generated from source, never hand-edited):
 *   docs/token-index.md    — human-readable, grouped + flat tables
 *   docs/token-index.json  — machine-readable { token: {file, tier, fallback, value} }
 *
 * Tier contract is the one declared in core/tokens.css (PUBLIC API vs INTERNAL
 * header) and docs/architecture.md. INTERNAL and PUBLIC-ADVANCED are finite,
 * enumerated sets; every other token defaults to PUBLIC. If a token ever needs a
 * tier other than PUBLIC it must be added to one of the sets below — the script
 * makes no guesses.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { TOKEN_FILES } from './registry-sources.js';
import { INTERNAL, ADVANCED, tierOf, roleOf } from './token-tiers.js';
import { stripComments, readValue, requireFile } from './lib/parse.js';

const ROOT = path.resolve(import.meta.dirname, '..');

const FILE_TITLES = {
  'core/tokens.css':                    'Core',
  'core/tokens.layout.css':             'Layout',
  'core/tokens.macros.css':             'Macros',
  'optional/tokens.components.css':     'Components (optional, incomplete)',
};

// ── Tier contract — imported from scripts/token-tiers.js (single source of ───
// truth, mirrors the core/tokens.css header + docs/architecture.md). INTERNAL
// and ADVANCED are re-exported here only for any downstream importers that
// historically reached into this module.
export { INTERNAL, ADVANCED, tierOf, roleOf };

// ── Parsing (matches scripts/gen-token-reference.js contract) ─────────────────

function readSource(rel) {
  return stripComments(requireFile(rel, ROOT, `[docs:index] Missing token source file: ${rel}`));
}

// Extract ordered [name, value] pairs (last declaration wins per file).
function extract(rel) {
  const css = readSource(rel);
  const rows = new Map();
  for (const m of css.matchAll(/@property\s+(--sf-[\w-]+)\s*\{([^}]*)\}/g)) {
    const iv = /initial-value\s*:\s*([^;]+);/.exec(m[2]);
    rows.set(m[1], iv ? `${iv[1].trim()} (registered)` : '(registered)');
  }
  const re = /(--sf-[\w-]+)\s*:/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const colon = m.index + m[0].length - 1;
    rows.set(m[1], readValue(css, colon));
  }
  return rows;
}

// ── Build index ───────────────────────────────────────────────────────────────

// Per-file extraction + global dedup (last file in TOKEN_FILES order wins for value).
const perFile = TOKEN_FILES.map(file => ({ file, rows: extract(file) }));

const index = new Map(); // name -> { files:[], tier, value }
for (const { file, rows } of perFile) {
  for (const [name, value] of rows) {
    const entry = index.get(name) || {
      files: [], tier: tierOf(name), value,
    };
    entry.files.push(file);
    entry.value = value; // last declaration wins
    index.set(name, entry);
  }
}

const names = [...index.keys()].sort((a, b) => a.localeCompare(b));

// ── Counts ─────────────────────────────────────────────────────────────────────

const tierCounts = { PUBLIC: 0, 'PUBLIC-ADVANCED': 0, INTERNAL: 0 };
const roleCounts = { knob: 0, consumption: 0 };
for (const n of names) {
  const e = index.get(n);
  tierCounts[e.tier]++;
  roleCounts[roleOf(e.value, n)]++;
}

// ── Emit JSON ───────────────────────────────────────────────────────────────────

const jsonOut = {
  _meta: {
    generated_by: 'scripts/gen-token-index.js',
    token_sources: TOKEN_FILES,
    counts: {
      tokens: names.length,
      by_tier: tierCounts,
      by_role: roleCounts,
    },
  },
  tokens: Object.fromEntries(
    names.map(n => {
      const e = index.get(n);
      return [n, { tier: e.tier, role: roleOf(e.value, n), files: e.files, value: e.value }];
    })
  ),
};

// Regression guard (SL-010/SL-012): a bad regex/tier-set change should fail
// loudly, not silently truncate the index every consumer (check:llm-guide,
// the configurator) trusts. A real token removal is legitimate but rare and
// small in number; a >20% drop is far more likely a parsing bug.
const TOKEN_INDEX_JSON = path.join(ROOT, 'docs', 'token-index.json');
if (fs.existsSync(TOKEN_INDEX_JSON)) {
  try {
    const previous = JSON.parse(fs.readFileSync(TOKEN_INDEX_JSON, 'utf8'));
    const previousCount = Object.keys(previous.tokens ?? {}).length;
    if (previousCount > 0 && names.length < previousCount * 0.8) {
      throw new Error(
        `[docs:index] refusing to write ${TOKEN_INDEX_JSON}: token count dropped from ` +
          `${previousCount} to ${names.length} (>20% shrink) — looks like a parsing regression, not an intentional change.`
      );
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.warn(`[docs:index] Failed to parse existing ${TOKEN_INDEX_JSON} for the regression check:`, err.message);
    } else {
      throw err;
    }
  }
}

fs.writeFileSync(TOKEN_INDEX_JSON, JSON.stringify(jsonOut, null, 2) + '\n', 'utf8');

// ── Emit Markdown ─────────────────────────────────────────────────────────────

const shortFile = f => FILE_TITLES[f] || f;
// Escape for a Markdown table cell: backslash first (so we don't re-escape our
// own escapes), then the pipe column-separator. CSS values legitimately contain
// backslashes (e.g. unicode escapes like `\2026` in content tokens).
const esc = v => v.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');

let md = `# Token index

> **Generated** from source by \`scripts/gen-token-index.js\` —
> run \`npm run docs:index\` to refresh. Do not edit by hand.

A cross-reference of every \`--sf-*\` custom property by **source file** and
**stability tier**. For just the default values see [tokens.md](tokens.md);
for the flat name list see [registry.json](registry.json); for the tier
contract and naming rules see [architecture.md](architecture.md).

**${names.length} tokens** (deduplicated by name across the ${TOKEN_FILES.length} token source files).

| Tier | Count | Meaning |
|---|---|---|
| PUBLIC | ${tierCounts.PUBLIC} | Everyday knobs. SemVer-stable. |
| PUBLIC-ADVANCED | ${tierCounts['PUBLIC-ADVANCED']} | Same SemVer guarantee; niche/powerful. |
| INTERNAL | ${tierCounts.INTERNAL} | Implementation detail; may change without a major bump. |

Every token also carries a **role** — an orthogonal, SemVer-neutral hint about
whether you are expected to **set** it or **read** it. It is derived from the
declared value (a value that references \`var(--sf-…)\` is a derived output):

| Role | Count | Meaning |
|---|---|---|
| knob | ${roleCounts.knob} | Input you **set** to configure the system (a literal primitive: length, number, colour literal, keyword, font stack, easing curve …). |
| consumption | ${roleCounts.consumption} | Ready-to-use output you **read**; derived from other tokens via \`var(--sf-…)\` (incl. \`light-dark()\`/\`oklch(from …)\`/\`color-mix()\`). |

`;

// Tier-grouped quick lists for the non-PUBLIC tiers (small, high-signal).
md += `## INTERNAL tokens\n\n`;
md += names.filter(n => index.get(n).tier === 'INTERNAL').map(n => `- \`${n}\``).join('\n') + '\n\n';

md += `## PUBLIC-ADVANCED tokens\n\n`;
md += names.filter(n => index.get(n).tier === 'PUBLIC-ADVANCED').map(n => `- \`${n}\``).join('\n') + '\n\n';

// Full index table.
md += `## Full index\n\n`;
md += '| Token | Tier | Role | File(s) | Default |\n|---|---|---|---|---|\n';
for (const n of names) {
  const e = index.get(n);
  const files = e.files.map(shortFile).join(' + ');
  md += `| \`${n}\` | ${e.tier} | ${roleOf(e.value, n)} | ${files} | \`${esc(e.value)}\` |\n`;
}
md += '\n';

fs.writeFileSync(path.join(ROOT, 'docs', 'token-index.md'), md, 'utf8');

console.log(
  `[docs] → docs/token-index.md + docs/token-index.json ` +
  `(${names.length} tokens: ${tierCounts.PUBLIC} public, ` +
  `${tierCounts['PUBLIC-ADVANCED']} advanced, ${tierCounts.INTERNAL} internal; ` +
  `${roleCounts.knob} knob, ${roleCounts.consumption} consumption)`
);
