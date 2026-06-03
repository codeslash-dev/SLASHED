#!/usr/bin/env node
/**
 * Ensures all generated/compiled artifacts are in sync with their sources.
 *
 * Modes:
 *   --fix    (pre-commit) Run only the builds whose sources are staged, then
 *            stage the outputs. Skips gitignored outputs silently.
 *   --check  (CI) Run every build unconditionally, then assert git diff is
 *            clean for each output. Exits non-zero on any staleness.
 *
 * To register a new build artifact, add an entry to scripts/artifacts.json.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artifacts = JSON.parse(readFileSync(resolve(root, 'scripts/artifacts.json'), 'utf8'));
const mode = process.argv.includes('--check') ? 'check' : 'fix';

function run(cmd, cwd = root) {
  execSync(cmd, { cwd, stdio: 'inherit', shell: true });
}

function git(args) {
  return execSync(`git ${args}`, { cwd: root, encoding: 'utf8' });
}

function isTracked(path) {
  try { git(`ls-files --error-unmatch ${path}`); return true; } catch { return false; }
}

if (mode === 'fix') {
  const staged = new Set(git('diff --cached --name-only --diff-filter=ACM').trim().split('\n').filter(Boolean));

  for (const artifact of artifacts) {
    const triggered = artifact.srcGlobs.some(glob => [...staged].some(f => f.startsWith(glob)));
    if (!triggered) continue;

    console.log(`[artifacts] ${artifact.name} sources changed — rebuilding…`);
    run(artifact.cmd, artifact.cwd ? resolve(root, artifact.cwd) : root);

    for (const out of artifact.outputs) {
      if (isTracked(out)) run(`git add ${out}`);
    }
  }
} else {
  let failed = false;

  for (const artifact of artifacts) {
    console.log(`[artifacts] Checking ${artifact.name}…`);
    run(artifact.cmd, artifact.cwd ? resolve(root, artifact.cwd) : root);

    for (const out of artifact.outputs) {
      try {
        git(`diff --exit-code ${out}`);
      } catch {
        console.error(`::error::${out} is stale — rebuild ${artifact.name} and commit`);
        failed = true;
      }
    }
  }

  if (failed) process.exit(1);
}
