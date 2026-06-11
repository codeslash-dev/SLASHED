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

const ROOT = path.resolve(import.meta.dirname, '..');

// The HSL fallback tier lives in its own file, intentionally excluded from
// TOKEN_FILES (it is not part of the modern token API surface).
const FALLBACK_FILE = 'core/tokens.color-fallbacks.css';

const FILE_TITLES = {
  'core/tokens.css':                    'Core',
  'core/tokens.layout.css':             'Layout',
  'core/tokens.macros.css':             'Macros',
  'optional/tokens.palette.css':        'Palette (optional)',
  'optional/tokens.sizes-extended.css': 'Sizes-extended (optional)',
  'optional/tokens.components.css':     'Components (optional, incomplete)',
};

// ── Tier contract — imported from scripts/token-tiers.js (single source of ───
// truth, mirrors the core/tokens.css header + docs/architecture.md). INTERNAL
// and ADVANCED are re-exported here only for any downstream importers that
// historically reached into this module.
export { INTERNAL, ADVANCED, tierOf, roleOf };

// ── Parsing (matches scripts/gen-token-reference.js contract) ─────────────────

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

// Read a custom-property value starting at its `:` index, honouring nested
// parentheses so light-dark()/oklch()/clamp() values stay intact.
function readValue(css, colonIdx) {
  let depth = 0;
  let out = '';
  for (let i = colonIdx + 1; i < css.length; i++) {
    const ch = css[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) break;
    out += ch;
  }
  return out.replace(/\s+/g, ' ').trim();
}

function readSource(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    throw new Error(`[docs:index] Missing token source file: ${rel}`);
  }
  return stripComments(fs.readFileSync(abs, 'utf8'));
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

// Names declared in the HSL fallback file (channel sources + resolved overrides).
function fallbackNames() {
  const css = readSource(FALLBACK_FILE);
  const names = new Set();
  for (const m of css.matchAll(/(--sf-[\w-]+)\s*:/g)) names.add(m[1]);
  return names;
}

// ── Build index ───────────────────────────────────────────────────────────────

const fbNames = fallbackNames();

// Per-file extraction + global dedup (last file in TOKEN_FILES order wins for value).
const perFile = TOKEN_FILES.map(file => ({ file, rows: extract(file) }));

const index = new Map(); // name -> { files:[], tier, fallback, value }
for (const { file, rows } of perFile) {
  for (const [name, value] of rows) {
    const entry = index.get(name) || {
      files: [], tier: tierOf(name), fallback: fbNames.has(name), value,
    };
    entry.files.push(file);
    entry.value = value; // last declaration wins
    index.set(name, entry);
  }
}

const names = [...index.keys()].sort((a, b) => a.localeCompare(b));

// Fallback-only tokens (declared in the HSL file but never in TOKEN_FILES) —
// e.g. the --sf-{family}-h/s/l channel sources.
const fallbackOnly = [...fbNames].filter(n => !index.has(n)).sort((a, b) => a.localeCompare(b));

// ── Counts ─────────────────────────────────────────────────────────────────────

const tierCounts = { PUBLIC: 0, 'PUBLIC-ADVANCED': 0, INTERNAL: 0 };
const roleCounts = { knob: 0, consumption: 0 };
let withFallback = 0;
for (const n of names) {
  const e = index.get(n);
  tierCounts[e.tier]++;
  roleCounts[roleOf(e.value, n)]++;
  if (e.fallback) withFallback++;
}

// ── Emit JSON ───────────────────────────────────────────────────────────────────

const jsonOut = {
  _meta: {
    generated_by: 'scripts/gen-token-index.js',
    token_sources: TOKEN_FILES,
    fallback_source: FALLBACK_FILE,
    counts: {
      tokens: names.length,
      by_tier: tierCounts,
      by_role: roleCounts,
      with_fallback: withFallback,
      fallback_only: fallbackOnly.length,
    },
  },
  tokens: Object.fromEntries(
    names.map(n => {
      const e = index.get(n);
      return [n, { tier: e.tier, role: roleOf(e.value, n), files: e.files, fallback: e.fallback, value: e.value }];
    })
  ),
  fallback_only: fallbackOnly,
};

fs.writeFileSync(
  path.join(ROOT, 'docs', 'token-index.json'),
  JSON.stringify(jsonOut, null, 2) + '\n',
  'utf8'
);

// ── Emit Markdown ─────────────────────────────────────────────────────────────

const shortFile = f => FILE_TITLES[f] || f;
// Escape for a Markdown table cell: backslash first (so we don't re-escape our
// own escapes), then the pipe column-separator. CSS values legitimately contain
// backslashes (e.g. unicode escapes like `\2026` in content tokens).
const esc = v => v.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');

let md = `# Token index

> **Generated** from source by \`scripts/gen-token-index.js\` —
> run \`npm run docs:index\` to refresh. Do not edit by hand.

A cross-reference of every \`--sf-*\` custom property by **source file**,
**stability tier**, and **legacy fallback** coverage. For just the default
values see [tokens.md](tokens.md); for the flat name list see
[registry.json](registry.json); for the tier contract and naming rules see
[architecture.md](architecture.md).

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

**${withFallback}** tokens have a legacy HSL fallback in \`${FALLBACK_FILE}\`
(for engines without \`light-dark()\` / \`oklch(from …)\`), plus
**${fallbackOnly.length}** fallback-only channel tokens listed at the end.

`;

// Tier-grouped quick lists for the non-PUBLIC tiers (small, high-signal).
md += `## INTERNAL tokens\n\n`;
md += names.filter(n => index.get(n).tier === 'INTERNAL').map(n => `- \`${n}\``).join('\n') + '\n\n';

md += `## PUBLIC-ADVANCED tokens\n\n`;
md += names.filter(n => index.get(n).tier === 'PUBLIC-ADVANCED').map(n => `- \`${n}\``).join('\n') + '\n\n';

// Full index table.
md += `## Full index\n\n`;
md += '| Token | Tier | Role | File(s) | Fallback | Default |\n|---|---|---|---|---|---|\n';
for (const n of names) {
  const e = index.get(n);
  const files = e.files.map(shortFile).join(' + ');
  const fb = e.fallback ? 'yes' : '—';
  md += `| \`${n}\` | ${e.tier} | ${roleOf(e.value, n)} | ${files} | ${fb} | \`${esc(e.value)}\` |\n`;
}
md += '\n';

// Fallback-only channel tokens.
md += `## Fallback-only tokens (\`${FALLBACK_FILE}\`)\n\n`;
md += `These ${fallbackOnly.length} tokens exist only on the legacy HSL tier — channel ` +
      `sources (\`--sf-{family}-h/s/l\`) that consumers override to rebrand on older engines. ` +
      `They are intentionally absent from the modern token API and from \`registry.json\`.\n\n`;
md += fallbackOnly.map(n => `- \`${n}\``).join('\n') + '\n';

fs.writeFileSync(path.join(ROOT, 'docs', 'token-index.md'), md, 'utf8');

console.log(
  `[docs] → docs/token-index.md + docs/token-index.json ` +
  `(${names.length} tokens: ${tierCounts.PUBLIC} public, ` +
  `${tierCounts['PUBLIC-ADVANCED']} advanced, ${tierCounts.INTERNAL} internal; ` +
  `${roleCounts.knob} knob, ${roleCounts.consumption} consumption; ` +
  `${withFallback} with fallback, ${fallbackOnly.length} fallback-only)`
);
