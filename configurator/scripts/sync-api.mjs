#!/usr/bin/env node
/**
 * Auto-sync the configurator's token catalogue from the framework API index.
 *
 * The SLASHED framework generates `docs/api-index.json` from its CSS source
 * (via `npm run docs:api` -> scripts/gen-api-index.js). That file is the
 * single, machine-readable source of truth for every public token and class.
 *
 * This script reads that index plus the framework's package version and emits
 * a slimmed, configurator-shaped catalogue at:
 *
 *     configurator/src/data/api-index.generated.json
 *
 * It runs automatically on `predev` and `prebuild` (see package.json) and is
 * also wired into the framework's own `docs` pipeline, so the configurator can
 * never drift from the framework's API: whenever a token is added, renamed,
 * retiered, or re-valued in the CSS and the docs are regenerated, the panel
 * picks it up on the next build with zero manual edits.
 *
 * Only `type: "token"` entries are kept (classes are not configurable knobs).
 * Every tier is retained (PUBLIC / PUBLIC-ADVANCED / INTERNAL) so the UI can
 * decide what to show; the default UI surfaces PUBLIC + PUBLIC-ADVANCED.
 *
 * Usage:
 *   node scripts/sync-api.mjs            # read ../../docs/api-index.json
 *   node scripts/sync-api.mjs <path>     # read an explicit api-index.json
 */

import fs from 'node:fs';
import path from 'node:path';

const HERE = import.meta.dirname;
const CONFIGURATOR_ROOT = path.resolve(HERE, '..');
// configurator/ lives at the framework repo root, so ../ from here is the
// framework root that holds docs/ and package.json.
const FRAMEWORK_ROOT = path.resolve(CONFIGURATOR_ROOT, '..');

const SOURCE =
  process.argv[2] ||
  path.join(FRAMEWORK_ROOT, 'docs', 'api-index.json');

const OUT_DIR = path.join(CONFIGURATOR_ROOT, 'src', 'data');
const OUT = path.join(OUT_DIR, 'api-index.generated.json');

/**
 * Read the framework's package version, used only as a display/sync stamp.
 * Falls back to an empty string when the file is unavailable.
 * @returns {string}
 */
function readFrameworkVersion() {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(FRAMEWORK_ROOT, 'package.json'), 'utf8')
    );
    return typeof pkg.version === 'string' ? pkg.version : '';
  } catch {
    return '';
  }
}

/**
 * The configurator only needs a subset of each token's columns. Project the
 * rich api-index row down to that subset so the baked-in JSON stays small.
 * @param {object} e api-index token entry
 * @returns {object} configurator token row
 */
function projectToken(e) {
  return {
    name: e.name,
    tier: e.tier,
    namespace: e.namespace || null,
    category: e.category || 'Other',
    group: e.group || '',
    description: e.description || '',
    value: e.value ?? null,
    aliasOf: e.aliasOf ?? null,
    registered: !!e.registered,
    syntax: e.syntax ?? null,
    fallbackOnly: !!e.fallbackOnly,
    optional: !!e.optional,
    layer: e.layer || null,
    bundles: Array.isArray(e.bundles) ? e.bundles : [],
  };
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(
      `[configurator:sync] Source API index not found: ${SOURCE}\n` +
        `Run \`npm run docs:api\` in the framework root first, or pass an ` +
        `explicit path: node scripts/sync-api.mjs <api-index.json>.`
    );
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
  const entries = Array.isArray(raw.entries) ? raw.entries : [];

  const tokens = entries
    .filter((e) => e && e.type === 'token')
    .map(projectToken)
    // Stable alphabetical order for deterministic diffs.
    .sort((a, b) => a.name.localeCompare(b.name));

  const byTier = {};
  const byCategory = {};
  for (const t of tokens) {
    byTier[t.tier] = (byTier[t.tier] || 0) + 1;
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  }

  const out = {
    _sync: {
      generatedBy: 'configurator/scripts/sync-api.mjs',
      source: path.relative(FRAMEWORK_ROOT, SOURCE).split(path.sep).join('/'),
      generatedAt: new Date().toISOString(),
      frameworkVersion: readFrameworkVersion(),
      // Pass through the upstream bundle list so the UI can offer bundle
      // filtering without re-deriving it.
      bundles: raw?._meta?.bundles || [],
      counts: {
        tokens: tokens.length,
        byTier,
        byCategory,
      },
    },
    tokens,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');

  console.log(
    `[configurator:sync] ${path.relative(FRAMEWORK_ROOT, OUT)} ← ` +
      `${out._sync.source} (${tokens.length} tokens, framework ` +
      `${out._sync.frameworkVersion || 'unknown'})`
  );
}

main();
