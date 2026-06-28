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
import crypto from 'node:crypto';

const HERE = import.meta.dirname;
const CONFIGURATOR_ROOT = path.resolve(HERE, '..');
// configurator/ lives at the framework repo root, so ../ from here is the
// framework root that holds docs/ and package.json.
const FRAMEWORK_ROOT = path.resolve(CONFIGURATOR_ROOT, '..');

const SOURCE =
  process.argv[2] ||
  path.join(FRAMEWORK_ROOT, 'docs', 'api-index.json');

const ANNOTATIONS_FILE = path.join(FRAMEWORK_ROOT, 'docs', 'token-annotations.json');
const BUNDLE_CONFIG_FILE = path.join(FRAMEWORK_ROOT, 'bundle.config.json');
const REGISTRY_FILE = path.join(FRAMEWORK_ROOT, 'token-registry.json');

const OUT_DIR = path.join(CONFIGURATOR_ROOT, 'src', 'data');
const OUT = path.join(OUT_DIR, 'api-index.generated.json');
const CLASSES_OUT = path.join(OUT_DIR, 'classes.generated.json');
const BUNDLES_OUT = path.join(OUT_DIR, 'bundles.generated.json');
const REGISTRY_OUT = path.join(OUT_DIR, 'token-registry.generated.json');

// jsDelivr serves the published dist branch (see .github/workflows/publish-dist.yml)
// at the repo root, so a bundle's minified file is <CDN_BASE>/slashed.<id>.min.css.
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist';


/**
 * Read the optional token-annotations.json overlay. Returns null if the file
 * is missing or unreadable (annotations are optional, not required).
 * @returns {{ _groups?: object, tokens?: object } | null}
 */
function readAnnotations() {
  if (!fs.existsSync(ANNOTATIONS_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(ANNOTATIONS_FILE, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * The configurator only needs a subset of each token's columns. Project the
 * rich api-index row down to that subset so the baked-in JSON stays small.
 *
 * @param {object} e api-index token entry
 * @param {object} notes map of token name → per-token note from annotations
 * @param {object} groupDescs map of "category | group" → group description override
 * @returns {object} configurator token row
 */
function projectToken(e, notes, groupDescs) {
  const groupKey = `${e.category || 'Other'} | ${e.group || ''}`;
  return {
    name: e.name,
    tier: e.tier,
    role: e.role || null,
    namespace: e.namespace || null,
    category: e.category || 'Other',
    group: e.group || '',
    description: groupDescs[groupKey] || e.description || '',
    note: notes[e.name] || '',
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

/**
 * Read and parse the api-index JSON, failing with the same actionable message
 * as the missing-file case when the contents are malformed (rather than
 * dumping a raw stack trace).
 * @param {string} file
 * @returns {object}
 */
function readIndex(file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    console.error(
      `[configurator:sync] Could not read ${file}: ${err.message}`
    );
    process.exit(1);
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(
      `[configurator:sync] ${file} is not valid JSON (${err.message}).\n` +
        `Re-generate it with \`npm run docs:api\` in the framework root.`
    );
    process.exit(1);
  }
}

/**
 * Derive the bundle manifest the configurator's bundle picker consumes from the
 * framework's `bundle.config.json` — the same file the build uses — so the
 * picker can never drift from what actually ships. Only the *logical* bundles
 * are emitted (the `.flat` no-`@layer` variants are an output detail, not a user
 * choice). Per-bundle module composition is structural and comes from here;
 * the human "what each optional module adds" prose lives configurator-side in
 * src/lib/bundles.js (the same data/curation split as basics.js).
 *
 * @returns {{ bundles: object[], cdnBase: string }}
 */
function buildBundleManifest() {
  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(BUNDLE_CONFIG_FILE, 'utf8'));
  } catch (err) {
    console.error(
      `[configurator:sync] Could not read ${BUNDLE_CONFIG_FILE}: ${err.message}\n` +
        `The bundle picker needs it — is this running from the framework repo?`
    );
    process.exit(1);
  }

  const all = Array.isArray(cfg.bundles) ? cfg.bundles : [];
  const bundles = all
    // Skip the flattened (no-@layer) variants — same modules, output detail only.
    .filter((b) => !b.flat && typeof b.output === 'string')
    .map((b) => {
      const id = b.output.replace(/^badges\//, '').replace(/^slashed\./, '').replace(/\.css$/, '');
      const files = Array.isArray(b.files) ? b.files : [];
      const optionalModules = files.filter((f) => f.startsWith('optional/'));
      return {
        id,
        output: b.output.replace(/^badges\//, ''),
        min: b.output.replace(/^badges\//, '').replace(/\.css$/, '.min.css'),
        cdn: `${CDN_BASE}/${b.output.replace(/^badges\//, '').replace(/\.css$/, '.min.css')}`,
        fileCount: files.length,
        optionalModules,
      };
    })
    // Smallest → largest footprint, so the picker can present a natural ramp and
    // recommend the leanest bundle that covers a config.
    .sort((a, b) => a.fileCount - b.fileCount);

  if (bundles.length === 0) {
    console.error(
      `[configurator:sync] No bundles found in ${BUNDLE_CONFIG_FILE} — refusing ` +
        `to write an empty bundle manifest.`
    );
    process.exit(1);
  }
  return { bundles, cdnBase: CDN_BASE };
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

  const raw = readIndex(SOURCE);
  const entries = Array.isArray(raw.entries) ? raw.entries : [];

  const annotations = readAnnotations();
  const notes = annotations?.tokens ?? {};
  const groupDescs = annotations?._groups ?? {};

  const tokens = entries
    .filter((e) => e && e.type === 'token')
    .map((e) => projectToken(e, notes, groupDescs))
    // Stable alphabetical order for deterministic diffs.
    .sort((a, b) => a.name.localeCompare(b.name));

  // A zero (or collapsed) token set almost always means the upstream schema
  // changed (e.g. `entries` renamed) rather than a framework with no tokens.
  // Fail loudly so the break surfaces at build time, not in production.
  if (tokens.length === 0) {
    console.error(
      `[configurator:sync] No \`type: "token"\` entries found in ${SOURCE}.\n` +
        `The api-index schema may have changed — refusing to write an empty ` +
        `catalogue.`
    );
    process.exit(1);
  }

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
      // frameworkVersion is intentionally NOT stored here. It is injected at
      // Vite build time (vite.config.js `define.__SLASHED_VERSION__`) from the
      // root package.json, so it always matches the build and never needs a
      // separate sync step.
      // Content hash of the projected catalogue. Unlike a wall-clock stamp it
      // only changes when the tokens themselves change, so re-running the sync
      // produces no diff unless the framework API actually moved.
      tokensHash: crypto
        .createHash('sha256')
        .update(JSON.stringify(tokens))
        .digest('hex')
        .slice(0, 12),
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
      `${out._sync.source} (${tokens.length} tokens)`
  );

  // Class catalogue for the cheatsheet — project class entries from api-index.
  const classes = entries
    .filter((e) => e && e.type === 'class' && e.tier !== 'INTERNAL')
    .map((e) => ({
      name: e.name,
      selector: e.selector || `.${e.name}`,
      kind: e.kind || '',
      category: e.category || 'Other',
      group: e.group || '',
      description: e.description || '',
      optional: !!e.optional,
      layer: e.layer || null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (classes.length === 0) {
    console.error(
      `[configurator:sync] No \`type: "class"\` entries found in ${SOURCE}.\n` +
        `The api-index schema may have changed — refusing to write an empty ` +
        `catalogue.`
    );
    process.exit(1);
  }

  const classesOut = {
    _sync: { generatedBy: 'configurator/scripts/sync-api.mjs', source: out._sync.source },
    classes,
  };
  fs.writeFileSync(CLASSES_OUT, JSON.stringify(classesOut, null, 2) + '\n', 'utf8');
  console.log(
    `[configurator:sync] ${path.relative(FRAMEWORK_ROOT, CLASSES_OUT)} ← ` +
      `${out._sync.source} (${classes.length} classes)`
  );

  // Bundle manifest for the picker — derived from bundle.config.json.
  const manifest = buildBundleManifest();
  const bundlesOut = {
    _sync: {
      generatedBy: 'configurator/scripts/sync-api.mjs',
      source: path.relative(FRAMEWORK_ROOT, BUNDLE_CONFIG_FILE).split(path.sep).join('/'),
      cdnBase: manifest.cdnBase,
    },
    bundles: manifest.bundles,
  };
  fs.writeFileSync(BUNDLES_OUT, JSON.stringify(bundlesOut, null, 2) + '\n', 'utf8');
  console.log(
    `[configurator:sync] ${path.relative(FRAMEWORK_ROOT, BUNDLES_OUT)} ← ` +
      `${bundlesOut._sync.source} (${manifest.bundles.length} bundles)`
  );

  // Token id registry for the shareable config codec (src/lib/codec.js). Copied
  // verbatim so the configurator imports it the same way model.js imports the
  // api-index — and so the runtime can never drift from the committed registry.
  syncRegistry();
}

/**
 * Copy token-registry.json → src/data/token-registry.generated.json. The
 * registry is the canonical, append-only id map maintained by
 * scripts/gen-token-registry.js; this is just a build-time mirror.
 */
function syncRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) {
    console.error(
      `[configurator:sync] token-registry.json not found at ${REGISTRY_FILE}\n` +
        `Run \`npm run gen:registry\` in the framework root first.`
    );
    process.exit(1);
  }
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
  } catch (err) {
    console.error(`[configurator:sync] ${REGISTRY_FILE} is not valid JSON (${err.message}).`);
    process.exit(1);
  }
  const tokenCount = Array.isArray(registry.tokens) ? registry.tokens.length : 0;
  if (tokenCount === 0) {
    console.error(`[configurator:sync] token-registry.json has no tokens — refusing to write an empty registry.`);
    process.exit(1);
  }
  fs.writeFileSync(REGISTRY_OUT, JSON.stringify(registry, null, 2) + '\n', 'utf8');
  console.log(
    `[configurator:sync] ${path.relative(FRAMEWORK_ROOT, REGISTRY_OUT)} ← ` +
      `token-registry.json (${tokenCount} ids)`
  );
}

main();
