import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'bundle.config.json'), 'utf8'));

const LAYER_ORDER = [
  'slashed.tokens',
  'slashed.reset',
  'slashed.base',
  'slashed.forms',
  'slashed.layout',
  'slashed.components',
  'slashed.macros',
  'slashed.utilities',
  'slashed.states',
  'slashed.themes',
  'slashed.motion',
  'slashed.accessibility',
  'slashed.print',
  'slashed.legacy',
  'slashed.overrides',
];

function sourceLayer(file) {
  if (file === 'core/layers.css') return null;
  const css = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const match = css.match(/^@layer\s+([\w.-]+)\s*\{/m);
  assert.ok(match, `${file} must declare a wrapped @layer block`);
  return match[1];
}

describe('flat bundle source order', () => {
  for (const bundle of config.bundles.filter((entry) => entry.flat)) {
    test(`${bundle.output} follows the unlayered cascade order`, () => {
      const layers = bundle.files.map(sourceLayer).filter(Boolean);
      const indexes = layers.map((layer) => {
        const index = LAYER_ORDER.indexOf(layer);
        assert.notEqual(index, -1, `${bundle.output}: unknown layer ${layer}`);
        return index;
      });

      assert.deepEqual(
        indexes,
        indexes.toSorted((a, b) => a - b),
        `${bundle.output} must order files by core/layers.css before layers are stripped`,
      );
    });
  }
});
