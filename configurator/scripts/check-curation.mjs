#!/usr/bin/env node
/**
 * Future-proofing tripwire.
 *
 * The configurator auto-syncs every framework token, so new tokens are always
 * *reachable*. But a new knob whose name matches none of the domain patterns in
 * src/lib/domains.js falls through to the catch-all "misc" bucket — reachable,
 * but not where a user would look for it. As the framework grows this is how the
 * panel silently degrades.
 *
 * This check flags any PUBLIC / PUBLIC-ADVANCED knob token that no domain
 * classifies explicitly (it only reaches 'misc' as the fallback). Run it after a
 * framework sync; a hit means "add a name pattern / namespace to domains.js" (or
 * add the token to ALLOWLIST below if 'misc' really is its home, e.g. print).
 *
 * Usage:  node scripts/check-curation.mjs        # exits 1 on any orphan
 * It is also asserted by tests/curation.test.js so CI catches it either way.
 */
import data from '../src/data/api-index.generated.json' with { type: 'json' };
import { DOMAINS } from '../src/lib/domains.js';

/**
 * Tokens that legitimately live in the Misc domain (matched by its own
 * print/is patterns is fine; this is only for any future exceptions).
 * @type {Set<string>}
 */
const ALLOWLIST = new Set([]);

/**
 * Does ANY domain match this token via an explicit pattern or namespace?
 * Mirrors domainOf() but reports "explicitly matched" vs "fell back to misc".
 * @param {{name:string, namespace?:string|null}} token
 * @returns {boolean}
 */
function isExplicitlyClassified(token) {
  const name = token.name || '';
  const ns = token.namespace || '';
  for (const d of DOMAINS) {
    if (d.tool) continue;
    if (d.patterns?.some((re) => re.test(name))) return true;
    if (ns && d.namespaces?.includes(ns)) return true;
  }
  return false;
}

/**
 * @returns {string[]} names of PUBLIC(-ADVANCED) knob tokens that no domain
 *   classifies (they would only appear in the Misc fallback bucket).
 */
export function findUncategorisedKnobs() {
  return data.tokens
    .filter((t) => (t.tier === 'PUBLIC' || t.tier === 'PUBLIC-ADVANCED') && t.role === 'knob')
    .filter((t) => !ALLOWLIST.has(t.name))
    .filter((t) => !isExplicitlyClassified(t))
    .map((t) => t.name)
    .sort();
}

// Run as a CLI when invoked directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const orphans = findUncategorisedKnobs();
  if (orphans.length) {
    console.error(
      `[configurator:curation] ${orphans.length} knob token(s) match no domain ` +
        `pattern and would only appear in the Misc bucket:\n` +
        orphans.map((n) => `  - ${n}`).join('\n') +
        `\n\nAdd a name pattern / namespace to src/lib/domains.js (or, if Misc is ` +
        `truly correct, allowlist it in scripts/check-curation.mjs).`
    );
    process.exit(1);
  }
  console.log('[configurator:curation] OK — every public knob has a home domain.');
}
