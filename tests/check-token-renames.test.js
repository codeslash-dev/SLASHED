/**
 * Negative tests for scripts/check-token-renames.js.
 *
 * The rename map's value is entirely in its truthfulness — a stale entry does
 * not merely fail to help, it actively migrates a user onto a dead token. Each
 * test plants one violation in a fixture tree (SLASHED_ROOT) and asserts the
 * gate refuses it.
 *
 * The fixture supplies both inputs live-api.js unions: token-registry.json and
 * the core/ + optional/ CSS declarations.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-token-renames.js');

const tmpDirs = [];
after(() => {
  for (const dir of tmpDirs) fs.rmSync(dir, { recursive: true, force: true });
});

/**
 * @param {object} map            contents of docs/token-renames.json
 * @param {string[]} liveTokens   tokens that should count as live
 */
function buildFixture(map, liveTokens = ['--sf-color-danger', '--sf-z-toast']) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-renames-'));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'core'), { recursive: true });

  fs.writeFileSync(path.join(dir, 'docs', 'token-renames.json'), JSON.stringify(map, null, 2));
  fs.writeFileSync(
    path.join(dir, 'token-registry.json'),
    JSON.stringify({
      _meta: { nextId: liveTokens.length },
      tokens: liveTokens.map((name, id) => ({ id, name })),
    }),
  );
  // live-api.js also unions in tokens DECLARED in core/ + optional/ CSS.
  fs.writeFileSync(
    path.join(dir, 'core', 'tokens.css'),
    `:root {\n${liveTokens.map((t) => `  ${t}: red;`).join('\n')}\n}\n`,
  );
  return dir;
}

const runGate = (dir) =>
  spawnSync(process.execPath, [GATE], { encoding: 'utf8', env: { ...process.env, SLASHED_ROOT: dir } });

describe('check-token-renames', () => {
  test('passes on a truthful map', () => {
    const dir = buildFixture({
      renames: { '--sf-color-error': '--sf-color-danger' },
      removals: { '--sf-opacity-25': 'Use --sf-opacity-muted.' },
    });
    const r = runGate(dir);
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
    assert.match(r.stdout, /check:token-renames OK/);
  });

  test('fails when a rename target is not live', () => {
    const dir = buildFixture({ renames: { '--sf-color-error': '--sf-color-gone' }, removals: {} });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /points at a token that is not live/);
  });

  test('fails on a rename chain, naming the resolved destination', () => {
    const dir = buildFixture({
      renames: {
        '--sf-color-error': '--sf-color-middle',
        '--sf-color-middle': '--sf-color-danger',
      },
      removals: {},
    });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /points at another rename key/);
    assert.match(r.stderr, /--sf-color-danger/);
  });

  test('fails when an old name is still live', () => {
    // --sf-color-danger is live, so claiming it was renamed away is a lie.
    const dir = buildFixture({ renames: { '--sf-color-danger': '--sf-z-toast' }, removals: {} });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /is still LIVE/);
  });

  test('fails when a removed token is still live', () => {
    const dir = buildFixture({ renames: {}, removals: { '--sf-color-danger': 'gone' } });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /must not be reported to users as removed/);
  });

  test('fails when a token is both renamed and removed', () => {
    const dir = buildFixture({
      renames: { '--sf-color-error': '--sf-color-danger' },
      removals: { '--sf-color-error': 'gone' },
    });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /BOTH renames and removals/);
  });

  test('fails on a self-referential rename', () => {
    const dir = buildFixture({ renames: { '--sf-color-danger': '--sf-color-danger' }, removals: {} });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /maps to itself/);
  });

  test('fails on a malformed token name', () => {
    const dir = buildFixture({ renames: { 'color-error': '--sf-color-danger' }, removals: {} });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /well-formed/);
  });

  test('fails when a removal carries no reason', () => {
    const dir = buildFixture({ renames: {}, removals: { '--sf-opacity-25': '   ' } });
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /no reason/);
  });

  test('fails on malformed JSON rather than throwing', () => {
    const dir = buildFixture({ renames: {}, removals: {} });
    fs.writeFileSync(path.join(dir, 'docs', 'token-renames.json'), '{ not json');
    const r = runGate(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /not valid JSON/);
  });
});
