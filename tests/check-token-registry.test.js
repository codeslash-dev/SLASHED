/**
 * Negative tests for scripts/check-token-registry.js.
 *
 * The gap this closes: check:registry guards the "ids are permanent + unique +
 * bounded" contract the shareable config codec depends on, but nothing proved
 * it still fails on a violation. Run against a fixture with no git baseline
 * (SLASHED_ROOT points at /tmp), invariants 1–2 are vacuous, but the id guards
 * (duplicate, uint16 ceiling, nextId > maxId) and the catalogue-registration
 * check still run — so we can assert each one bites.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-token-registry.js');

const tmpDirs = [];

function buildFixture(registry, apiIndex) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-registry-'));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'));
  const reg = registry ?? {
    _meta: { nextId: 3 },
    tokens: [
      { id: 1, name: '--sf-a' },
      { id: 2, name: '--sf-b' },
    ],
  };
  const api = apiIndex ?? {
    entries: [
      { type: 'token', name: '--sf-a' },
      { type: 'token', name: '--sf-b' },
    ],
  };
  fs.writeFileSync(path.join(dir, 'token-registry.json'), JSON.stringify(reg, null, 2));
  fs.writeFileSync(path.join(dir, 'docs', 'api-index.json'), JSON.stringify(api, null, 2));
  return dir;
}

function runGate(dir) {
  return spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

describe('check-token-registry failure cases', () => {
  test('passes on a well-formed fixture', () => {
    const r = runGate(buildFixture());
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
  });

  test('fails on a duplicate id', () => {
    const dir = buildFixture({
      _meta: { nextId: 3 },
      tokens: [{ id: 1, name: '--sf-a' }, { id: 1, name: '--sf-b' }],
    }, { entries: [{ type: 'token', name: '--sf-a' }, { type: 'token', name: '--sf-b' }] });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /duplicate id/);
  });

  test('fails when nextId is not strictly greater than the max id', () => {
    const dir = buildFixture({
      _meta: { nextId: 2 }, // maxId is 2 → must be > 2
      tokens: [{ id: 1, name: '--sf-a' }, { id: 2, name: '--sf-b' }],
    });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /must be greater than the max id/);
  });

  test('fails when an id exceeds the uint16 wire ceiling', () => {
    const dir = buildFixture({
      _meta: { nextId: 70000 },
      tokens: [{ id: 65536, name: '--sf-a' }, { id: 2, name: '--sf-b' }],
    });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /uint16 wire limit/);
  });

  test('fails when a catalogue token has no active registry entry', () => {
    const dir = buildFixture(undefined, {
      entries: [
        { type: 'token', name: '--sf-a' },
        { type: 'token', name: '--sf-b' },
        { type: 'token', name: '--sf-c' }, // present in catalogue, absent from registry
      ],
    });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /--sf-c.*no active registry entry/s);
  });

  test('a `removed` registry entry does NOT satisfy a live catalogue token', () => {
    const dir = buildFixture({
      _meta: { nextId: 3 },
      tokens: [{ id: 1, name: '--sf-a' }, { id: 2, name: '--sf-b', removed: true }],
    });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /--sf-b.*no active registry entry/s);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
