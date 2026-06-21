#!/usr/bin/env node
/**
 * Generate / update token-registry.json — the permanent, append-only map of
 * design-token name → 16-bit numeric id.
 *
 * The id is the wire identity of a token in the configurator's shareable config
 * code (see configurator/src/lib/codec.js). Unlike the token *name*, an id is
 * never reassigned and never reused: this is what lets a code minted today keep
 * decoding in every future build (added tokens get fresh ids, removed tokens
 * keep their id flagged `removed`, so old codes never collide with new tokens).
 *
 * Source of truth for the live token set is docs/api-index.json (the same
 * machine-readable catalogue scripts/gen-api-index.js emits and the
 * configurator syncs from). This generator only ever:
 *   - APPENDS a new entry (next free id) for a catalogue token not yet in the
 *     registry, and
 *   - FLAGS `removed: true` on a registry entry whose token has left the
 *     catalogue.
 * It never deletes an entry or changes an existing id↔name pairing — those
 * invariants are enforced in CI by scripts/check-token-registry.js.
 *
 * Run: npm run gen:registry   (also wired into `npm run docs`).
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'docs', 'api-index.json');
const OUT = path.join(ROOT, 'token-registry.json');

// Ids are serialised as a 2-byte (uint16) field in the wire codec
// (configurator/src/lib/codec.js). Once nextId would exceed this, a freshly
// assigned id would be truncated on encode and alias an existing token, so we
// refuse to mint it. 65536 ids is far beyond the framework's token count; this
// guard exists purely to fail loudly rather than corrupt links if that ever
// changes (e.g. a new id namespace).
const MAX_ID = 0xffff;

/**
 * Read the existing registry, or seed an empty one on first run.
 * @returns {{ _meta: { generatedBy: string, nextId: number }, tokens: Array<{id:number,name:string,removed?:boolean}> }}
 */
function readRegistry() {
  if (!fs.existsSync(OUT)) {
    return { _meta: { generatedBy: 'scripts/gen-token-registry.js', nextId: 0 }, tokens: [] };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    parsed._meta ??= { generatedBy: 'scripts/gen-token-registry.js', nextId: 0 };
    parsed.tokens ??= [];
    return parsed;
  } catch (err) {
    console.error(`[docs:registry] ${OUT} is not valid JSON (${err.message}).`);
    process.exit(1);
  }
}

/**
 * Read the live token-name set from docs/api-index.json.
 * @returns {Set<string>}
 */
function readCatalogueTokens() {
  if (!fs.existsSync(SOURCE)) {
    console.error(
      `[docs:registry] Source API index not found: ${SOURCE}\n` +
        `Run \`npm run docs:api\` first.`
    );
    process.exit(1);
  }
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
  } catch (err) {
    console.error(`[docs:registry] ${SOURCE} is not valid JSON (${err.message}).`);
    process.exit(1);
  }
  const entries = Array.isArray(raw.entries) ? raw.entries : [];
  const names = entries.filter((e) => e && e.type === 'token').map((e) => e.name);
  if (names.length === 0) {
    console.error(
      `[docs:registry] No \`type: "token"\` entries found in ${SOURCE} — ` +
        `refusing to flag every token removed.`
    );
    process.exit(1);
  }
  return new Set(names);
}

function main() {
  const registry = readRegistry();
  const catalogue = readCatalogueTokens();
  const known = new Map(registry.tokens.map((t) => [t.name, t]));

  let appended = 0;
  let flaggedRemoved = 0;
  let revived = 0;

  // APPEND: catalogue tokens with no registry entry get the next free id, in
  // the catalogue's stable (alphabetical) order for deterministic first runs.
  for (const name of [...catalogue].sort((a, b) => a.localeCompare(b))) {
    const entry = known.get(name);
    if (!entry) {
      if (registry._meta.nextId > MAX_ID) {
        console.error(
          `[docs:registry] id space exhausted: nextId ${registry._meta.nextId} exceeds ` +
            `the uint16 wire limit (${MAX_ID}). Cannot mint an id for "${name}" without ` +
            `corrupting existing share links. The codec needs a wider id field.`
        );
        process.exit(1);
      }
      registry.tokens.push({ id: registry._meta.nextId++, name });
      appended++;
    } else if (entry.removed) {
      // Token came back — clear the flag, keep its original id.
      delete entry.removed;
      revived++;
    }
  }

  // FLAG: registry tokens no longer in the catalogue are marked removed (id and
  // name retained forever so old codes can never be misread).
  for (const entry of registry.tokens) {
    if (!catalogue.has(entry.name) && !entry.removed) {
      entry.removed = true;
      flaggedRemoved++;
    }
  }

  // Stable on-disk order: by id (= creation order). nextId stays monotonic.
  registry.tokens.sort((a, b) => a.id - b.id);

  fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n', 'utf8');

  console.log(
    `[docs:registry] token-registry.json — ${registry.tokens.length} ids ` +
      `(+${appended} new, ${flaggedRemoved} removed, ${revived} revived; nextId=${registry._meta.nextId})`
  );
}

main();
