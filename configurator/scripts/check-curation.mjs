#!/usr/bin/env node
/**
 * Future-proofing tripwire.
 *
 * Every PUBLIC / PUBLIC-ADVANCED knob token must map to a named domain so it
 * shows up in the right panel rather than an uncategorised fallback.
 *
 * Classification is driven by src/data/domain-map.json — the same file
 * src/lib/domains.ts uses at runtime — so this guard and the app can never
 * drift. If the framework adds a token in a brand-new namespace, add that
 * namespace to domain-map.json.
 *
 * Usage:  node scripts/check-curation.mjs        # exits 1 on any orphan
 * Also asserted by tests/curation.test.js so CI catches it either way.
 */
import { pathToFileURL } from 'url';
import data from '../src/data/api-index.generated.json' with { type: 'json' };
import DOMAIN_MAP from '../src/data/domain-map.json' with { type: 'json' };

/**
 * Tokens that legitimately live outside the named domains.
 * @type {Set<string>}
 */
const ALLOWLIST = new Set([]);

const NAMESPACE_DOMAIN = DOMAIN_MAP.namespaces;
const EXCEPTIONS = DOMAIN_MAP.exceptions;

/** The `--sf-<namespace>-…` segment of a token name. */
function inferNamespace(name) {
  const m = /^--sf-([a-z0-9]+)/.exec(name || '');
  return m ? m[1] : '';
}

/**
 * Returns true when a token is explicitly classified into a domain — i.e. it
 * has a per-token exception or its (manifest-authored) namespace is mapped.
 * Mirrors src/lib/domains.ts's classifyKnown() from the same domain-map.json.
 * @param {{name:string, namespace?:string}} token
 * @returns {boolean}
 */
function isExplicitlyClassified(token) {
  const name = token.name || '';
  if (EXCEPTIONS[name]) return true;
  const ns = token.namespace || inferNamespace(name);
  return Boolean(NAMESPACE_DOMAIN[ns]);
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
        `\n\nAdd the token's namespace to src/data/domain-map.json.`
    );
    process.exit(1);
  }
  console.log('[configurator:curation] OK — every public knob has a home domain.');
}
