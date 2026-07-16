/**
 * Negative tests for scripts/check-layer-order.js — the gate that keeps the
 * layer order in docs/architecture.md in step with core/layers.css.
 *
 * Guards the real drift found after cad296b reordered the source layers but the
 * doc kept the old order in both its @layer block and its Specificity ladder.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-layer-order.js');
const tmpDirs = [];

const LAYERS = ['tokens', 'reset', 'base', 'components', 'layout', 'macros'];

function buildFixture({ order = LAYERS, spec = [...LAYERS].reverse() } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-layers-'));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, 'core'));
  fs.mkdirSync(path.join(dir, 'docs'));

  fs.writeFileSync(
    path.join(dir, 'core', 'layers.css'),
    `@layer\n${LAYERS.map((l) => `  slashed.${l}`).join(',\n')};\n`,
  );

  const declBlock = '```css\n@layer\n' + order.map((l) => `  slashed.${l}`).join(',\n') + ';\n```\n';
  const specBlock =
    '```text\nunlayered CSS                highest\n' +
    spec.map((l) => `slashed.${l}`).join('\n') +
    '                             lowest\n```\n';
  fs.writeFileSync(
    path.join(dir, 'docs', 'architecture.md'),
    `# Architecture\n\n## Layer order\n\n${declBlock}\n## Specificity\n\n${specBlock}\n`,
  );
  return dir;
}

function runGate(dir) {
  return spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

describe('check-layer-order failure cases', () => {
  test('passes when the doc matches core/layers.css', () => {
    const r = runGate(buildFixture());
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
  });

  test('fails when the @layer block order drifts', () => {
    const swapped = ['tokens', 'reset', 'base', 'layout', 'components', 'macros'];
    const r = runGate(buildFixture({ order: swapped }));
    assert.equal(r.status, 1, 'expected exit 1 for a drifted @layer block');
    assert.match(r.stderr, /@layer block .* does not match/);
  });

  test('fails when the Specificity ladder is not the exact reverse', () => {
    const badSpec = ['macros', 'components', 'layout', 'base', 'reset', 'tokens'];
    const r = runGate(buildFixture({ spec: badSpec }));
    assert.equal(r.status, 1, 'expected exit 1 for a wrong specificity ladder');
    assert.match(r.stderr, /Specificity ladder .* not the reverse/);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
