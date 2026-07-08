/**
 * Negative tests for scripts/check-macro-catalog.js.
 *
 * The gap this closes: check:macros is a CI gate with no test proving it can
 * still detect drift. If its regex or skip-lists silently rot, CI keeps passing
 * while docs/macros.md and the macro CSS diverge. These build a minimal fixture
 * (SLASHED_ROOT), assert it passes, then introduce each drift class and assert
 * a non-zero exit with the expected message.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-macro-catalog.js');

const tmpDirs = [];

function buildFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-macros-'));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, 'core'));
  fs.mkdirSync(path.join(dir, 'docs'));
  fs.writeFileSync(path.join(dir, 'core', 'macros.css'), `@layer slashed.macros {\n  .sf-prose { max-inline-size: 65ch; }\n}\n`);
  fs.writeFileSync(path.join(dir, 'core', 'motion.css'), `@layer slashed.motion {\n  /* no exposed classes here */\n}\n`);
  fs.writeFileSync(path.join(dir, 'docs', 'macros.md'), `# Macros\n\n- \`.sf-prose\` — readable measure.\n`);
  return dir;
}

function runGate(dir) {
  return spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

describe('check-macro-catalog failure cases', () => {
  test('passes on an in-sync fixture', () => {
    const r = runGate(buildFixture());
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
  });

  test('fails when a class exists in CSS but is undocumented', () => {
    const dir = buildFixture();
    fs.appendFileSync(path.join(dir, 'core', 'macros.css'), `\n.sf-brandnew { display: grid; }\n`);
    const r = runGate(dir);
    assert.equal(r.status, 1, 'expected exit 1 for undocumented CSS class');
    assert.match(r.stderr, /NOT documented/);
    assert.match(r.stderr, /sf-brandnew/);
  });

  test('fails when docs reference a class absent from source CSS', () => {
    const dir = buildFixture();
    fs.appendFileSync(path.join(dir, 'docs', 'macros.md'), `\n- \`.sf-phantom\` — does not exist.\n`);
    const r = runGate(dir);
    assert.equal(r.status, 1, 'expected exit 1 for phantom documented class');
    assert.match(r.stderr, /NOT in source CSS/);
    assert.match(r.stderr, /sf-phantom/);
  });

  test('an empty SLASHED_ROOT is treated as unset (falls back to the real repo root)', () => {
    // Guards the hardened root resolution: '' must not become path.join('', …)
    // relative to CWD. Running the read-only gate against the real repo passes.
    const r = spawnSync(process.execPath, [GATE], {
      encoding: 'utf8',
      env: { ...process.env, SLASHED_ROOT: '   ' },
    });
    assert.equal(r.status, 0, `empty SLASHED_ROOT should fall back to repo root:\n${r.stderr}`);
  });

  test('a whitespace-padded SLASHED_ROOT is trimmed before resolving (not a wrong dir)', () => {
    // The truthiness check and path.resolve must use the SAME trimmed value —
    // otherwise "  <dir>  " passes the check but resolves to a padded path.
    const dir = buildFixture();
    const r = spawnSync(process.execPath, [GATE], {
      encoding: 'utf8',
      env: { ...process.env, SLASHED_ROOT: `  ${dir}  ` },
    });
    assert.equal(r.status, 0, `padded SLASHED_ROOT should resolve to the fixture:\n${r.stderr}`);
  });

  test('fails when a required source file is missing', () => {
    const dir = buildFixture();
    fs.rmSync(path.join(dir, 'core', 'motion.css'));
    const r = runGate(dir);
    assert.equal(r.status, 1, 'expected exit 1 for missing source file');
    assert.match(r.stderr, /Missing source file/);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
