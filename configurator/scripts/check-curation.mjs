#!/usr/bin/env node
/**
 * Future-proofing tripwire.
 *
 * Every PUBLIC / PUBLIC-ADVANCED knob token must map to a named domain so it
 * shows up in the right panel rather than an uncategorised fallback.
 *
 * Patterns kept in sync with src/lib/domains.ts — if you update the domain
 * patterns there, update DOMAIN_PATTERNS here as well.
 *
 * Usage:  node scripts/check-curation.mjs        # exits 1 on any orphan
 * Also asserted by tests/curation.test.js so CI catches it either way.
 */
import { pathToFileURL } from 'url';
import data from '../src/data/api-index.generated.json' with { type: 'json' };
import DOMAIN_PATTERNS from '../src/data/domain-patterns.json' with { type: 'json' };

/**
 * Tokens that legitimately live outside the named domains.
 * @type {Set<string>}
 */
const ALLOWLIST = new Set([]);

/**
 * Returns true when a token name matches any domain pattern.
 * @param {{name:string}} token
 * @returns {boolean}
 */
function isExplicitlyClassified(token) {
  const name = token.name || '';
  for (const patterns of Object.values(DOMAIN_PATTERNS)) {
    if (patterns.some(p => name.includes(p))) return true;
  }
  return false;
}

/**
 * @returns {string[]} names of PUBLIC(-ADVANCED) knob tokens with no matching domain pattern.
 */
export function findUncategorisedKnobs() {
  return data.tokens
    .filter(t => (t.tier === 'PUBLIC' || t.tier === 'PUBLIC-ADVANCED') && t.role === 'knob')
    .filter(t => !ALLOWLIST.has(t.name))
    .filter(t => !isExplicitlyClassified(t))
    .map(t => t.name)
    .sort();
}

// Run as a CLI when invoked directly.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const orphans = findUncategorisedKnobs();
  if (orphans.length) {
    console.error(
      `[configurator:curation] ${orphans.length} knob token(s) match no domain ` +
        `pattern and would only appear in an uncategorised bucket:\n` +
        orphans.map(n => `  - ${n}`).join('\n') +
        `\n\nAdd a name pattern to src/data/domain-patterns.json.`
    );
    process.exit(1);
  }
  console.log('[configurator:curation] OK — every public knob has a home domain.');
}
