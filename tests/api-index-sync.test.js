/**
 * API-index sync regression.
 *
 * Asserts docs/api-index.json stays consistent with the authoritative
 * docs/registry.json (the single source of truth for the public surface) and
 * that every row is internally well-formed. If the generators ever drift apart
 * — different token/class counts, missing columns, bad enum values — this fails.
 *
 * Relies on a prior `npm run build` / `npm run docs` (which `pretest` runs) to
 * regenerate both files from source; it then compares the on-disk artifacts.
 *
 * Run: node --test tests/api-index-sync.test.js
 */
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs   from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'docs', 'registry.json');
const INDEX_PATH    = path.join(ROOT, 'docs', 'api-index.json');

const TIERS = new Set(['PUBLIC', 'PUBLIC-ADVANCED', 'INTERNAL']);
const TYPES = new Set(['token', 'class']);

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// Regenerate from source if either artifact is missing, so the test is
// runnable standalone (not only after `pretest`).
function ensureArtifacts() {
  if (fs.existsSync(REGISTRY_PATH) && fs.existsSync(INDEX_PATH)) return;
  execFileSync('node', ['scripts/audit.js'], { cwd: ROOT, stdio: 'ignore' });
  execFileSync('node', ['scripts/gen-api-index.js'], { cwd: ROOT, stdio: 'ignore' });
}

describe('api-index.json ⇄ registry.json sync', () => {
  let registry, index, entries, tokens, classes;

  before(() => {
    ensureArtifacts();
    registry = readJSON(REGISTRY_PATH);
    index    = readJSON(INDEX_PATH);
    entries  = index.entries;
    tokens   = entries.filter(e => e.type === 'token');
    classes  = entries.filter(e => e.type === 'class');
  });

  test('both artifacts present and shaped', () => {
    assert.ok(Array.isArray(entries), 'api-index.entries must be an array');
    assert.ok(index._meta && index._meta.counts, 'api-index._meta.counts missing');
    assert.ok(Array.isArray(registry.tokens), 'registry.tokens missing');
  });

  // ── Token parity ─────────────────────────────────────────────────────────
  // registry.tokens is the canonical public token surface; api-index token
  // rows minus the legacy fallback-only channels must equal it, name-for-name.
  test('token names match registry (excluding fallback-only channels)', () => {
    const indexTokenNames = new Set(
      tokens.filter(t => !t.fallbackOnly).map(t => t.name)
    );
    const registryTokens = new Set(registry.tokens);

    const missing = [...registryTokens].filter(n => !indexTokenNames.has(n));
    const extra   = [...indexTokenNames].filter(n => !registryTokens.has(n));

    assert.deepEqual(missing, [], `tokens in registry but missing from api-index: ${missing.join(', ')}`);
    assert.deepEqual(extra, [],   `tokens in api-index but not in registry: ${extra.join(', ')}`);
  });

  test('fallback-only tokens are NOT in the registry surface', () => {
    const registryTokens = new Set(registry.tokens);
    const leaked = tokens.filter(t => t.fallbackOnly && registryTokens.has(t.name)).map(t => t.name);
    assert.deepEqual(leaked, [], `fallback-only tokens must not appear in registry: ${leaked.join(', ')}`);
  });

  // ── Class parity ─────────────────────────────────────────────────────────
  test('.sf- / .sf-is- / unprefixed class names match registry', () => {
    const sf  = classes.filter(c => c.prefix === 'sf').map(c => c.name).sort();
    const is  = classes.filter(c => c.prefix === 'sf-is').map(c => c.name).sort();
    const un  = classes.filter(c => c.prefix === '').map(c => c.name).sort();

    assert.deepEqual(sf, [...registry.sf_classes].sort(), '.sf- classes diverge from registry');
    assert.deepEqual(is, [...registry.is_classes].sort(), '.sf-is- classes diverge from registry');
    assert.deepEqual(un, [...(registry.unprefixed_classes || [])].sort(), 'unprefixed classes diverge from registry');
  });

  // ── _meta counts consistency ───────────────────────────────────────────────
  test('_meta.counts agree with the entries and the registry', () => {
    const c = index._meta.counts;
    assert.equal(c.total, entries.length, 'counts.total != entries.length');
    assert.equal(c.tokens, tokens.length, 'counts.tokens != token rows');
    assert.equal(c.classes, classes.length, 'counts.classes != class rows');
    assert.equal(c.sf_classes, registry._meta.counts.sf_classes, 'sf_classes count drift');
    assert.equal(c.is_classes, registry._meta.counts.is_classes, 'is_classes count drift');
    assert.equal(
      c.tokens,
      registry._meta.counts.tokens,
      'token count in api-index != registry token count'
    );

    const byTypeSum = Object.values(c.by_type).reduce((a, b) => a + b, 0);
    assert.equal(byTypeSum, c.total, 'by_type does not sum to total');

    const byTierSum = Object.values(c.by_tier).reduce((a, b) => a + b, 0);
    assert.equal(byTierSum, c.total, 'by_tier does not sum to total');
  });

  // ── Row well-formedness ────────────────────────────────────────────────────
  test('every row has valid common columns', () => {
    for (const e of entries) {
      assert.ok(e.name, `row missing name: ${JSON.stringify(e)}`);
      assert.ok(TYPES.has(e.type), `bad type for ${e.name}: ${e.type}`);
      assert.ok(TIERS.has(e.tier), `bad tier for ${e.name}: ${e.tier}`);
      assert.ok(e.category, `${e.name} missing category`);
      assert.ok(Array.isArray(e.sourceFiles) && e.sourceFiles.length, `${e.name} missing sourceFiles`);
      assert.ok(Array.isArray(e.bundles), `${e.name} missing bundles array`);
    }
  });

  test('token rows have token-specific columns', () => {
    for (const e of tokens) {
      assert.ok(e.name.startsWith('--sf-'), `token name not --sf-*: ${e.name}`);
      assert.ok('value' in e, `${e.name} missing value`);
      assert.ok('registered' in e && typeof e.registered === 'boolean', `${e.name} bad registered`);
      assert.equal(e.animatable, e.registered, `${e.name} animatable should equal registered`);
      if (e.aliasOf !== null) {
        assert.ok(e.aliasOf.startsWith('--sf-'), `${e.name} aliasOf not a token: ${e.aliasOf}`);
      }
    }
  });

  test('class rows have class-specific columns', () => {
    for (const e of classes) {
      assert.equal(e.selector, `.${e.name}`, `${e.name} selector mismatch`);
      assert.ok(['sf', 'sf-is', ''].includes(e.prefix), `${e.name} bad prefix: ${e.prefix}`);
      assert.ok(typeof e.isVariant === 'boolean', `${e.name} bad isVariant`);
      if (e.isVariant) {
        assert.ok(e.baseClass && e.name.startsWith(e.baseClass), `${e.name} bad baseClass: ${e.baseClass}`);
      }
    }
  });

  test('no duplicate names within a type', () => {
    for (const [type, list] of [['token', tokens], ['class', classes]]) {
      const seen = new Set();
      const dupes = [];
      for (const e of list) {
        if (seen.has(e.name)) dupes.push(e.name);
        seen.add(e.name);
      }
      assert.deepEqual(dupes, [], `duplicate ${type} rows: ${dupes.join(', ')}`);
    }
  });
});
