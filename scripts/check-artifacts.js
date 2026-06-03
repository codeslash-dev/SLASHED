#!/usr/bin/env node
/**
 * Ensures all generated/compiled artifacts are in sync with their sources.
 *
 * Modes:
 *   --fix    (pre-commit) Run only the builds whose sources are staged, then
 *            stage the outputs. Skips untracked outputs silently.
 *   --check  (CI) Run every build unconditionally, then assert git diff is
 *            clean for each output. Exits non-zero on any staleness.
 *
 * To register a new build artifact, add an entry to scripts/artifacts.json.
 */

'use strict';

const { execSync, execFileSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const root = resolve(__dirname, '..');
const artifacts = JSON.parse(readFileSync(resolve(root, 'scripts/artifacts.json'), 'utf8'));
const mode = process.argv.includes('--check') ? 'check' : 'fix';

function run(cmd, cwd) {
  execSync(cmd, { cwd: cwd || root, stdio: 'inherit', shell: true });
}

function gitFile(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

function isTracked(path) {
  try { gitFile('ls-files', '--error-unmatch', path); return true; } catch { return false; }
}

if (mode === 'fix') {
  const staged = new Set(
    gitFile('diff', '--cached', '--name-only', '--diff-filter=ACM')
      .trim().split('\n').filter(Boolean)
  );

  for (const artifact of artifacts) {
    const triggered = artifact.srcPrefixes.some(prefix => [...staged].some(f => f.startsWith(prefix)));
    if (!triggered) continue;

    console.log(`[artifacts] ${artifact.name} sources changed — rebuilding…`);
    run(artifact.buildCmd, artifact.cwd ? resolve(root, artifact.cwd) : root);

    for (const out of artifact.outputs) {
      if (isTracked(out)) gitFile('add', out);
    }
  }
} else {
  let failed = false;

  for (const artifact of artifacts) {
    console.log(`[artifacts] Checking ${artifact.name}…`);
    // In CI, run the full install+build; locally (--fix) only buildCmd is used.
    const cmd = artifact.installCmd
      ? `${artifact.installCmd} && ${artifact.buildCmd}`
      : artifact.buildCmd;
    run(cmd, artifact.cwd ? resolve(root, artifact.cwd) : root);

    for (const out of artifact.outputs) {
      try {
        gitFile('diff', '--exit-code', '--', out);
      } catch {
        console.error(`::error::${out} is stale — rebuild ${artifact.name} and commit`);
        failed = true;
      }
    }
  }

  if (failed) process.exit(1);
}
