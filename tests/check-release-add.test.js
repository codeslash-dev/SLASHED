/**
 * Negative tests for scripts/check-release-add-list.js — the gate that keeps the
 * release workflow's `git add` in step with the files version-sync.js writes.
 *
 * The real regression this guards: version-sync writes docs/llm-guide.md, but
 * the sync-main job's `git add` once omitted it, so every release silently
 * discarded the bumped header. These build a minimal release.yml fixture and
 * assert the gate passes when the add-list is complete and fails (naming the
 * gap) when a version-synced file is dropped.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { VERSION_SYNCED_FILES } from '../scripts/version-synced-files.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-release-add-list.js');
const tmpDirs = [];

function buildFixture(addList) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-reladd-'));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, '.github', 'workflows'), { recursive: true });
  const yaml = [
    'jobs:',
    '  build:',
    '    steps:',
    '      - run: npm run build',
    '  sync-main:',
    '    steps:',
    '      - name: Commit',
    '        run: |',
    `          git add ${addList} package.json`,
    '          git commit -m "chore: sync"',
    '  after:',
    '    steps:',
    '      - run: echo done',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, '.github', 'workflows', 'release.yml'), yaml);
  return dir;
}

function runGate(dir) {
  return spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

describe('check-release-add-list failure cases', () => {
  test('passes when the git-add lists every version-synced file', () => {
    const r = runGate(buildFixture(VERSION_SYNCED_FILES.join(' ')));
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
  });

  test('fails and names the file when one is dropped from the git-add', () => {
    const [dropped, ...rest] = VERSION_SYNCED_FILES;
    const r = runGate(buildFixture(rest.join(' ')));
    assert.equal(r.status, 1, 'expected exit 1 when a synced file is unstaged');
    assert.match(r.stderr, new RegExp(dropped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  test('fails when the sync-main job has no git add at all', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-reladd-'));
    tmpDirs.push(dir);
    fs.mkdirSync(path.join(dir, '.github', 'workflows'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.github', 'workflows', 'release.yml'),
      'jobs:\n  sync-main:\n    steps:\n      - run: echo nothing\n',
    );
    const r = runGate(dir);
    assert.equal(r.status, 1, 'expected exit 1 when no git add exists');
    assert.match(r.stderr, /no `git add`/);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
