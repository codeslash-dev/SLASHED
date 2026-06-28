/**
 * Fast drift detector: asserts the committed api-index.generated.json and
 * token-registry.generated.json exactly match what sync-api.mjs would produce
 * from the current docs/api-index.json and token-registry.json.
 *
 * This gives a targeted signal when the token catalogue has drifted without
 * waiting for the full check-artifacts.js --check rebuild+gitdiff cycle.
 * The WP plugin vendors these generated files; a mismatch here means the
 * embedded configurator is serving a stale or mismatched token surface.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import crypto from 'node:crypto';

const FRAMEWORK_ROOT = resolve(import.meta.dirname, '../..');
const GENERATED_DATA = resolve(import.meta.dirname, '../src/data');

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

/** Mirror the projectToken function from configurator/scripts/sync-api.mjs. */
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

describe('catalogue projection', () => {
  const apiIndexPath = resolve(FRAMEWORK_ROOT, 'docs', 'api-index.json');
  const generatedPath = resolve(GENERATED_DATA, 'api-index.generated.json');
  const registryPath = resolve(FRAMEWORK_ROOT, 'token-registry.json');
  const generatedRegistryPath = resolve(GENERATED_DATA, 'token-registry.generated.json');

  test('docs/api-index.json is present (docs have been built)', () => {
    expect(existsSync(apiIndexPath)).toBe(true);
  });

  test('tokensHash in api-index.generated.json matches re-derived projection from docs/api-index.json', () => {
    const raw = readJson(apiIndexPath);
    const generated = readJson(generatedPath);

    const annotationsPath = resolve(FRAMEWORK_ROOT, 'docs', 'token-annotations.json');
    let notes = {}, groupDescs = {};
    try {
      const ann = readJson(annotationsPath);
      notes = ann.tokens ?? {};
      groupDescs = ann._groups ?? {};
    } catch { /* annotations are optional */ }

    const tokens = (Array.isArray(raw.entries) ? raw.entries : [])
      .filter(e => e && e.type === 'token')
      .map(e => projectToken(e, notes, groupDescs))
      .sort((a, b) => a.name.localeCompare(b.name));

    const expectedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(tokens))
      .digest('hex')
      .slice(0, 12);

    expect(generated._sync.tokensHash).toBe(expectedHash);
  });

  test('token-registry.generated.json content matches root token-registry.json', () => {
    // sync-api.mjs copies token-registry.json verbatim (re-serialised with
    // JSON.stringify + newline). Compare normalised JSON to tolerate whitespace
    // differences between the source and a re-serialised copy.
    const normalize = text => JSON.stringify(JSON.parse(text), null, 2) + '\n';
    const sourceText = readFileSync(registryPath, 'utf8');
    const generatedText = readFileSync(generatedRegistryPath, 'utf8');
    expect(normalize(generatedText)).toBe(normalize(sourceText));
  });
});
