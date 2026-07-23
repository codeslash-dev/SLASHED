/**
 * Negative tests for scripts/check-version-sync.js.
 *
 * Proves the version checker actually *fails* when version fields drift.
 * The pass path is already exercised by CI on the committed, in-sync tree.
 *
 * Strategy: build a minimal fixture directory with a well-formed version
 * tree, then mutate one field at a time and assert the checker exits non-zero
 * with a message describing the specific mismatch.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CHECKER = path.join(ROOT, 'scripts', 'check-version-sync.js');

const tmpDirs = [];

/**
 * Build a minimal directory tree matching what check-version-sync.js reads.
 */
function buildFixture(version = '1.2.3') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-vsync-'));
  tmpDirs.push(dir);

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ version }));

  const lockStub = { version, packages: { '': { version } } };
  fs.writeFileSync(path.join(dir, 'package-lock.json'), JSON.stringify(lockStub));

  fs.mkdirSync(path.join(dir, 'docs'));
  fs.writeFileSync(path.join(dir, 'docs', 'roadmap.md'), `Current version: **${version}**\n`);
  fs.writeFileSync(path.join(dir, 'docs', 'llm-guide.md'), `> Version: **${version}** · Tokens: **1**\n`);
  fs.writeFileSync(path.join(dir, 'llms.txt'), `# SLASHED v${version}\n`);

  fs.mkdirSync(path.join(dir, 'configurator'));
  fs.writeFileSync(path.join(dir, 'configurator', 'package.json'), JSON.stringify({ version }));

  const configLock = { version, packages: { '': { version } } };
  fs.writeFileSync(path.join(dir, 'configurator', 'package-lock.json'), JSON.stringify(configLock));

  return dir;
}

/**
 * Run the checker script against `dir` via the SLASHED_ROOT env var override.
 * Returns the spawnSync result { status, stdout, stderr }.
 */
function runChecker(dir) {
  return spawnSync(process.execPath, [CHECKER], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

describe('check-version-sync failure cases', () => {
  test('passes on a well-formed fixture', () => {
    const dir = buildFixture();
    const r = runChecker(dir);
    assert.equal(r.status, 0, `expected exit 0 on valid fixture:\n${r.stderr}`);
  });

  test('fails when package-lock.json root version differs', () => {
    const dir = buildFixture();
    const lock = JSON.parse(fs.readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
    lock.version = '9.9.9';
    fs.writeFileSync(path.join(dir, 'package-lock.json'), JSON.stringify(lock));
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for mismatched package-lock.json root version');
    assert.ok(r.stderr.includes('package-lock.json version'), r.stderr);
  });

  test('fails when package-lock.json packages[""] version differs', () => {
    const dir = buildFixture();
    const lock = JSON.parse(fs.readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
    lock.packages[''].version = '9.9.9';
    fs.writeFileSync(path.join(dir, 'package-lock.json'), JSON.stringify(lock));
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for mismatched packages[""] version');
    assert.ok(r.stderr.includes('package-lock.json packages'), r.stderr);
  });

  test('fails when docs/roadmap.md version differs', () => {
    const dir = buildFixture();
    fs.writeFileSync(path.join(dir, 'docs', 'roadmap.md'), 'Current version: **9.9.9**\n');
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for mismatched roadmap.md');
    assert.ok(r.stderr.includes('roadmap.md version'), r.stderr);
  });

  test('fails when docs/roadmap.md has no "Current version" line', () => {
    const dir = buildFixture();
    fs.writeFileSync(path.join(dir, 'docs', 'roadmap.md'), '# Roadmap\n\nNo version here.\n');
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for missing roadmap version line');
    assert.ok(r.stderr.includes('"Current version"'), r.stderr);
  });

  test('fails when docs/llm-guide.md version differs', () => {
    const dir = buildFixture();
    fs.writeFileSync(path.join(dir, 'docs', 'llm-guide.md'), '> Version: **9.9.9** · Tokens: **1**\n');
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for mismatched llm-guide.md');
    assert.ok(r.stderr.includes('llm-guide.md version'), r.stderr);
  });

  test('fails when docs/llm-guide.md has no "Version" header', () => {
    const dir = buildFixture();
    fs.writeFileSync(path.join(dir, 'docs', 'llm-guide.md'), '# LLM Guide\n\nNo version here.\n');
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for missing llm-guide version line');
    assert.ok(r.stderr.includes('"Version"'), r.stderr);
  });

  test('fails when llms.txt version differs', () => {
    const dir = buildFixture();
    fs.writeFileSync(path.join(dir, 'llms.txt'), '# SLASHED v9.9.9\n');
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for mismatched llms.txt');
    assert.ok(r.stderr.includes('llms.txt version'), r.stderr);
  });

  test('fails when llms.txt has no "# SLASHED vX.Y.Z" header', () => {
    const dir = buildFixture();
    fs.writeFileSync(path.join(dir, 'llms.txt'), '# SLASHED\n\nNo version here.\n');
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for missing llms.txt header');
    assert.ok(r.stderr.includes('llms.txt'), r.stderr);
  });

  test('rejects an llms.txt where the version appears only inline in prose, not as the heading', () => {
    const dir = buildFixture();
    // Correct version, but only mid-line in prose — the line-anchored check must
    // not accept it as the heading (would otherwise mask a missing header).
    fs.writeFileSync(
      path.join(dir, 'llms.txt'),
      '# SLASHED\n\nSee # SLASHED v1.2.3 in the changelog for details.\n',
    );
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 when the version is only inline prose');
    assert.ok(r.stderr.includes('llms.txt'), r.stderr);
  });

  test('fails when configurator/package.json version differs', () => {
    const dir = buildFixture();
    fs.writeFileSync(
      path.join(dir, 'configurator', 'package.json'),
      JSON.stringify({ version: '9.9.9' })
    );
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for mismatched configurator/package.json');
    assert.ok(r.stderr.includes('configurator/package.json version'), r.stderr);
  });

  test('fails when configurator/package-lock.json version differs', () => {
    const dir = buildFixture();
    const lock = JSON.parse(fs.readFileSync(path.join(dir, 'configurator', 'package-lock.json'), 'utf8'));
    lock.version = '9.9.9';
    fs.writeFileSync(path.join(dir, 'configurator', 'package-lock.json'), JSON.stringify(lock));
    const r = runChecker(dir);
    assert.equal(r.status, 1, 'expected exit 1 for mismatched configurator/package-lock.json');
    assert.ok(r.stderr.includes('configurator/package-lock.json version'), r.stderr);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
