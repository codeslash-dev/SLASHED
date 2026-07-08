import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'bundle.config.json'), 'utf8'));

function readText(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function declaredLayerOrder() {
  const css = readText('core/layers.css');
  const match = css.match(/^@layer\s+([\s\S]*?);/m);
  assert.ok(match, 'core/layers.css must declare the canonical @layer order');

  return match[1]
    .split(',')
    .map((layer) => layer.trim())
    .filter(Boolean);
}

const LAYER_ORDER = declaredLayerOrder();

function sourceLayer(file) {
  if (file === 'core/layers.css') return null;
  const match = readText(file).match(/^@layer\s+([\w.-]+)\s*\{/m);
  assert.ok(match, `${file} must declare a wrapped @layer block`);
  return match[1];
}

function comparableOutput(output) {
  return output.replace('.flat.css', '.css');
}

function sortedValues(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe('flat bundle source order', () => {
  for (const bundle of config.bundles.filter((entry) => entry.flat)) {
    test(`${bundle.output} contains the same sources as its layered counterpart`, () => {
      const layered = config.bundles.find((entry) => entry.output === comparableOutput(bundle.output));
      assert.ok(layered, `${bundle.output} must have a matching layered bundle`);
      assert.deepEqual(sortedValues(bundle.files), sortedValues(layered.files));
    });

    test(`${bundle.output} follows the unlayered cascade order`, () => {
      const indexes = bundle.files
        .map(sourceLayer)
        .filter(Boolean)
        .map((layer) => {
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
