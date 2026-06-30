/**
 * Color documentation semantics regression.
 *
 * The API index shown in docs and the configurator is generated from
 * docs/token-annotations.json. These assertions pin the role-level color
 * descriptions that are easy to accidentally regress because the names
 * "base", "surface", "primary", and "action" sound similar but represent
 * different parts of the token graph.
 *
 * Run: node --test tests/color-docs.test.js
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ANNOTATIONS_PATH = path.join(ROOT, 'docs', 'token-annotations.json');
const API_INDEX_PATH = path.join(ROOT, 'docs', 'api-index.json');

const annotations = JSON.parse(fs.readFileSync(ANNOTATIONS_PATH, 'utf8')).tokens;
const apiEntries = JSON.parse(fs.readFileSync(API_INDEX_PATH, 'utf8')).entries;

function apiDescription(name) {
  const entry = apiEntries.find(e => e.type === 'token' && e.name === name);
  assert.ok(entry, `${name} missing from docs/api-index.json`);
  return entry.description;
}

describe('color token documentation semantics', () => {
  test('base color is documented as a surface foundation, not an interactive role', () => {
    const description = annotations['--sf-color-base'];

    assert.match(description, /base surface/i);
    assert.match(description, /not an interactive\/brand role/i);
    assert.doesNotMatch(description, /secondary interactive/i);
    assert.equal(apiDescription('--sf-color-base'), description);
  });

  test('surface color is documented as the default surface alias, not the elevated level', () => {
    const description = annotations['--sf-color-surface'];

    assert.match(description, /alias of --sf-color-base/i);
    assert.match(description, /--sf-color-raised/i);
    assert.doesNotMatch(description, /^Elevated surface color/i);
    assert.equal(apiDescription('--sf-color-surface'), description);
  });

  test('primary and action are documented as separate roles by default', () => {
    const description = annotations['--sf-color-primary'];

    assert.match(description, /independent from --sf-color-action by default/i);
    assert.doesNotMatch(description, /aliased from the action role/i);
    assert.equal(apiDescription('--sf-color-primary'), description);
  });
});
