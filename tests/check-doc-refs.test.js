/**
 * Negative tests for scripts/check-doc-refs.js — the gate that keeps every
 * hand-written doc from referencing a token/class that is not live API.
 *
 * These build a fixture tree (SLASHED_ROOT) with a known live set (registry +
 * CSS declaration + api-index class), then assert: a doc that names only live
 * API passes; a dead token or dead class fails with file:line; an allowlisted
 * dead name passes; a whole-doc-excluded genre (migration.md) is ignored; and a
 * BEM modifier on a live base class is accepted.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-doc-refs.js');
const tmpDirs = [];

/**
 * @param {Record<string,string>} docs  relPath → markdown body
 * @param {object|null} allowlist        ref-allowlist.json contents, or null
 */
function buildFixture(docs, allowlist = null) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-docrefs-'));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, 'core'));
  fs.mkdirSync(path.join(dir, 'optional'));
  fs.mkdirSync(path.join(dir, 'docs'));

  // Live tokens: one registry name + one CSS-declared name.
  fs.writeFileSync(
    path.join(dir, 'token-registry.json'),
    JSON.stringify({ tokens: [{ name: '--sf-color-text' }] }),
  );
  fs.writeFileSync(path.join(dir, 'core', 'tokens.css'), ':root { --sf-space-m: 1rem; }\n');
  // Live classes: one base class in the api-index.
  fs.writeFileSync(
    path.join(dir, 'docs', 'api-index.json'),
    JSON.stringify({ entries: [{ type: 'class', name: 'sf-btn', selector: '.sf-btn' }] }),
  );
  fs.writeFileSync(
    path.join(dir, 'docs', 'token-index.json'),
    JSON.stringify({ _meta: { counts: { tokens: 2 } } }),
  );
  if (allowlist) {
    fs.writeFileSync(path.join(dir, 'docs', 'ref-allowlist.json'), JSON.stringify(allowlist));
  }
  for (const [rel, body] of Object.entries(docs)) {
    fs.mkdirSync(path.join(dir, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), body);
  }
  return dir;
}

function runGate(dir) {
  return spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

describe('check-doc-refs failure cases', () => {
  test('passes when a doc names only live tokens and classes', () => {
    const r = runGate(buildFixture({
      'docs/theming.md': 'Use `--sf-color-text`, `--sf-space-m`, and `.sf-btn`.\n',
    }));
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
  });

  test('fails on a dead token reference, reporting file:line', () => {
    const r = runGate(buildFixture({
      'docs/theming.md': 'line one\nUse the removed `--sf-ghost-token` here.\n',
    }));
    assert.equal(r.status, 1, 'expected exit 1 for a dead token');
    assert.match(r.stderr, /docs\/theming\.md:2\s+token: --sf-ghost-token/);
  });

  test('fails on a dead class reference', () => {
    const r = runGate(buildFixture({
      'docs/theming.md': 'Apply `.sf-ghost-widget` to the element.\n',
    }));
    assert.equal(r.status, 1, 'expected exit 1 for a dead class');
    assert.match(r.stderr, /class: sf-ghost-widget/);
  });

  test('allowlisted dead names pass', () => {
    const r = runGate(buildFixture(
      { 'docs/theming.md': 'Historical `--sf-ghost-token` and example `.sf-modal`.\n' },
      { 'docs/theming.md': { '--sf-ghost-token': 'historical', 'sf-modal': 'not shipped' } },
    ));
    assert.equal(r.status, 0, `allowlisted names should pass:\n${r.stderr}`);
  });

  test('migration.md (historical genre) is excluded wholesale', () => {
    const r = runGate(buildFixture({
      'docs/migration.md': 'Renamed `--sf-old-name` to `--sf-color-text`.\n',
    }));
    assert.equal(r.status, 0, `migration.md must be skipped:\n${r.stderr}`);
  });

  test('a BEM modifier on a live base class is accepted', () => {
    const r = runGate(buildFixture({
      'docs/components.md': 'Use `.sf-btn--primary` for the CTA.\n',
    }));
    assert.equal(r.status, 0, `modifier on live base should pass:\n${r.stderr}`);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
