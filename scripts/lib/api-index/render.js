/**
 * Rendering half of scripts/gen-api-index.js (SL-006): builds the Markdown
 * companion from the SAME assembled data ./extract.js produces, so the two
 * views (docs/api-index.json and docs/api-index.md) can never drift. This is
 * a relocation, not a rewrite — no logic changed from the original file.
 */

/**
 * Escape a value for a Markdown table cell: backslash first (so we don't
 * re-escape our own escapes), then the pipe column-separator.
 * @param {*} v cell value
 * @returns {string} escaped text
 */
export const escCell = v => String(v ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|');

/**
 * Group entries by their `category` field, returned as category-sorted
 * `[category, entries]` pairs for the Markdown tables.
 * @param {Array<object>} entries rows
 * @returns {Array<[string, object[]]>}
 */
export function groupByCategory(entries) {
  const map = new Map();
  for (const e of entries) {
    if (!map.has(e.category)) map.set(e.category, []);
    map.get(e.category).push(e);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * Render the human-readable Markdown companion from the same assembled data as
 * the JSON, so the two views can never drift.
 * @param {object} data assembled entries + count breakdowns
 * @returns {string} Markdown document
 */
export function buildMarkdown({ entries, tokenEntries, classEntries, tierCounts, typeCounts }) {
  let md = `# API index

> **Generated** from source by \`scripts/gen-api-index.js\` —
> run \`npm run docs:api\` to refresh. Do not edit by hand.

A single browseable catalogue of every public SLASHED element — design
**tokens** and **classes** — with stability tier, category, bundle membership
and a short description. The machine-readable companion (with all columns) is
[api-index.json](api-index.json); for the flat name list see
[registry.json](registry.json); for the tier contract see
[architecture.md](architecture.md).

**${entries.length} elements** — ${typeCounts.token || 0} tokens, ${typeCounts.class || 0} classes.

| Tier | Count | Meaning |
|---|---|---|
| PUBLIC | ${tierCounts.PUBLIC || 0} | Everyday surface. SemVer-stable. |
| PUBLIC-ADVANCED | ${tierCounts['PUBLIC-ADVANCED'] || 0} | Same SemVer guarantee; niche/powerful. |
| INTERNAL | ${tierCounts.INTERNAL || 0} | Implementation detail; may change without a major bump. |

`;

  // Tokens
  md += `## Tokens (${tokenEntries.length})\n\n`;
  for (const [category, list] of groupByCategory(tokenEntries)) {
    md += `### ${category} (${list.length})\n\n`;
    md += '| Token | Tier | Role | Namespace | Default | Description |\n|---|---|---|---|---|---|\n';
    for (const e of list) {
      md += `| \`${e.name}\` | ${e.tier} | ${e.role || '—'} | ${e.namespace || '—'} | \`${escCell(e.value)}\` | ${escCell(e.description)} |\n`;
    }
    md += '\n';
  }

  // Classes
  md += `## Classes (${classEntries.length})\n\n`;
  for (const [category, list] of groupByCategory(classEntries)) {
    md += `### ${category} (${list.length})\n\n`;
    md += '| Class | Tier | Kind | Group | Description |\n|---|---|---|---|---|\n';
    for (const e of list) {
      md += `| \`${e.selector}\` | ${e.tier} | ${e.kind} | ${escCell(e.group) || '—'} | ${escCell(e.description)} |\n`;
    }
    md += '\n';
  }

  return md;
}
