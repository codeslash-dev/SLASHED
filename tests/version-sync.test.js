/**
 * Positive tests for scripts/version-sync.js — the *writer* half of the version
 * contract. check-version-sync.test.js proves the checker fails on drift; this
 * proves the propagator actually realigns every downstream artifact from the
 * package.json source of truth.
 *
 * The gap this closes: we had a tested checker but an untested writer. A broken
 * writer + working checker means `npm run version-sync` silently no-ops and the
 * drift is only caught at release time. These tests run the writer against a
 * throwaway fixture (SLASHED_ROOT) and assert every target file is rewritten.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const WRITER = path.join(ROOT, 'scripts', 'version-sync.js');

const tmpDirs = [];

/**
 * Build a fixture where package.json is the target version but every downstream
 * artifact still carries `oldVersion` — i.e. a tree that needs syncing.
 */
function buildFixture(target = '2.0.0', oldVersion = '1.2.3') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-write-'));
  tmpDirs.push(dir);

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ version: target }, null, 2) + '\n');

  fs.mkdirSync(path.join(dir, 'docs'));
  fs.writeFileSync(
    path.join(dir, 'docs', 'roadmap.md'),
    `# Roadmap\n\nCurrent version: **${oldVersion}**\n\nMore text.\n`,
  );

  fs.mkdirSync(path.join(dir, 'configurator'));
  fs.writeFileSync(
    path.join(dir, 'configurator', 'package.json'),
    JSON.stringify({ name: 'slashed-configurator', version: oldVersion }, null, 2) + '\n',
  );
  fs.writeFileSync(
    path.join(dir, 'configurator', 'package-lock.json'),
    JSON.stringify({ version: oldVersion, packages: { '': { version: oldVersion } } }, null, 2) + '\n',
  );

  return dir;
}

function runWriter(dir) {
  return spawnSync(process.execPath, [WRITER], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

describe('version-sync writer', () => {
  test('propagates package.json version to every downstream artifact', () => {
    const dir = buildFixture('2.0.0', '1.2.3');
    const r = runWriter(dir);
    assert.equal(r.status, 0, `writer exited non-zero:\n${r.stderr}`);

    const roadmap = fs.readFileSync(path.join(dir, 'docs', 'roadmap.md'), 'utf8');
    assert.match(roadmap, /Current version: \*\*2\.0\.0\*\*/, 'roadmap.md not updated');
    assert.doesNotMatch(roadmap, /1\.2\.3/, 'roadmap.md still contains the old version');

    assert.equal(readJson(path.join(dir, 'configurator', 'package.json')).version, '2.0.0');

    const lock = readJson(path.join(dir, 'configurator', 'package-lock.json'));
    assert.equal(lock.version, '2.0.0', 'configurator lock root version not updated');
    assert.equal(lock.packages[''].version, '2.0.0', 'configurator lock packages[""] not updated');
  });

  test('after syncing, the checker passes on the same tree (writer ↔ checker agree)', () => {
    const dir = buildFixture('3.4.5', '0.0.1');
    // Root lock must exist for the checker (the writer does not create it).
    fs.writeFileSync(
      path.join(dir, 'package-lock.json'),
      JSON.stringify({ version: '3.4.5', packages: { '': { version: '3.4.5' } } }),
    );
    assert.equal(runWriter(dir).status, 0);

    const checker = path.join(ROOT, 'scripts', 'check-version-sync.js');
    const c = spawnSync(process.execPath, [checker], {
      encoding: 'utf8',
      env: { ...process.env, SLASHED_ROOT: dir },
    });
    assert.equal(c.status, 0, `checker rejected the writer's output:\n${c.stderr}`);
  });

  test('preserves a pre-release suffix (e.g. 0.5.0-beta5)', () => {
    const dir = buildFixture('0.5.0-beta5', '0.4.0');
    assert.equal(runWriter(dir).status, 0);
    assert.match(
      fs.readFileSync(path.join(dir, 'docs', 'roadmap.md'), 'utf8'),
      /Current version: \*\*0\.5\.0-beta5\*\*/,
    );
    assert.equal(readJson(path.join(dir, 'configurator', 'package.json')).version, '0.5.0-beta5');
  });

  test('is idempotent — a second run reports nothing left to change', () => {
    const dir = buildFixture('2.0.0', '1.0.0');
    assert.equal(runWriter(dir).status, 0);
    const second = runWriter(dir);
    assert.equal(second.status, 0);
    assert.match(second.stdout, /already up to date/, 'second run should be a no-op');
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
