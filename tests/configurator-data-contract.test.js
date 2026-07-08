/**
 * Contract test for the generated configurator data files.
 *
 * configurator/src/data/*.generated.json is emitted by
 * configurator/scripts/sync-api.mjs and *vendored into SLASHED-Plugins*. A
 * silent shape change there (a renamed/dropped column in `projectToken`, or an
 * empty catalogue) breaks the plugin with no signal at the framework boundary.
 * This pins the shape the downstream consumer relies on: required keys must be
 * present on every row, and the catalogues must be non-empty. It runs in the
 * root unit suite (node --test → CI), independent of the configurator's own
 * Vitest suite.
 *
 * Run: node --test tests/configurator-data-contract.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA = path.join(ROOT, 'configurator', 'src', 'data');

const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(DATA, rel), 'utf8'));

// The columns the configurator UI + vendored plugin read off each row. Adding a
// field is safe; renaming/removing one is a breaking change and must update the
// consumer — this list is the tripwire that forces that decision.
const TOKEN_KEYS = [
  'name', 'tier', 'role', 'namespace', 'category', 'group', 'description',
  'note', 'value', 'aliasOf', 'registered', 'syntax', 'fallbackOnly',
  'optional', 'layer', 'bundles',
];
const CLASS_KEYS = ['name', 'selector', 'kind', 'category', 'group', 'description', 'optional', 'layer'];
const BUNDLE_KEYS = ['id', 'output', 'min', 'cdn', 'fileCount', 'optionalModules'];

function assertRowShape(rows, requiredKeys, label) {
  assert.ok(Array.isArray(rows) && rows.length > 0, `${label}: expected a non-empty array`);
  for (const row of rows) {
    for (const key of requiredKeys) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(row, key),
        `${label}: row "${row.name ?? row.id ?? JSON.stringify(row)}" is missing required key "${key}"`,
      );
    }
  }
}

describe('generated configurator data honours its consumer contract', () => {
  test('api-index.generated.json: every token row has the required columns', () => {
    assertRowShape(readJson('api-index.generated.json').tokens, TOKEN_KEYS, 'tokens');
  });

  test('classes.generated.json: every class row has the required columns', () => {
    assertRowShape(readJson('classes.generated.json').classes, CLASS_KEYS, 'classes');
  });

  test('bundles.generated.json: every bundle row has the required columns', () => {
    assertRowShape(readJson('bundles.generated.json').bundles, BUNDLE_KEYS, 'bundles');
  });

  test('token-registry.generated.json is a verbatim mirror of the root registry', () => {
    const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'token-registry.json'), 'utf8'));
    const mirror = readJson('token-registry.generated.json');
    assert.deepEqual(mirror, source, 'configurator registry mirror has drifted from token-registry.json');
  });
});
