/**
 * Negative tests for the #582 source-CSS audit gates:
 *   check-dead-knobs.js   (D1)  check-annotations.js (D2)
 *   check-mirrors.js      (D4)  check-hook-tokens.js (D5)
 *   check-bundle-defs.js  (D6)
 *
 * Each gate is a CI tripwire, so each must be shown to still FAIL on the exact
 * defect it guards against — not just pass on the current tree. Every test
 * copies the real repo's relevant sources into a temporary SLASHED_ROOT,
 * confirms the clean copy passes, then plants one defect and asserts a non-zero
 * exit. Copying (rather than fixture-building) keeps the tests honest against
 * the real token set.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const tmpDirs = [];

// Copy the subset of the repo the gates read.
function cloneRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-audit-'));
  tmpDirs.push(dir);
  fs.cpSync(path.join(ROOT, 'core'), path.join(dir, 'core'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'optional'), path.join(dir, 'optional'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'docs'));
  for (const f of ['token-annotations.json', 'llm-guide.md']) {
    fs.copyFileSync(path.join(ROOT, 'docs', f), path.join(dir, 'docs', f));
  }
  for (const f of ['token-registry.json', 'bundle.config.json']) {
    fs.copyFileSync(path.join(ROOT, f), path.join(dir, f));
  }
  return dir;
}

function runGate(gate, dir) {
  return spawnSync(process.execPath, [path.join(ROOT, 'scripts', gate)], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

const readAnn = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'docs', 'token-annotations.json'), 'utf8'));
const writeAnn = (dir, a) => fs.writeFileSync(path.join(dir, 'docs', 'token-annotations.json'), JSON.stringify(a, null, 2));
const readCss = (dir, rel) => fs.readFileSync(path.join(dir, rel), 'utf8');
const writeCss = (dir, rel, s) => fs.writeFileSync(path.join(dir, rel), s);

describe('check-dead-knobs (D1)', () => {
  test('passes clean, fails when a wiring-claim annotation loses its consumer', () => {
    const dir = cloneRepo();
    assert.equal(runGate('check-dead-knobs.js', dir).status, 0);

    // --sf-print-page-margin claims "Maps to @page margin"; strip its only
    // consumer from print.css so the claim is now false.
    const css = readCss(dir, 'core/print.css')
      .replace('var(--sf-print-page-margin, 2cm)', '2cm');
    writeCss(dir, 'core/print.css', css);

    const r = runGate('check-dead-knobs.js', dir);
    assert.equal(r.status, 1, `expected failure:\n${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /--sf-print-page-margin/);
  });
});

describe('check-annotations (D2)', () => {
  test('passes clean, fails on a ~ms figure that disagrees with the value', () => {
    const dir = cloneRepo();
    assert.equal(runGate('check-annotations.js', dir).status, 0);

    const ann = readAnn(dir);
    ann.tokens['--sf-duration-instant'] = 'Near-instant duration (~50ms).';
    writeAnn(dir, ann);

    const r = runGate('check-annotations.js', dir);
    assert.equal(r.status, 1, `expected failure:\n${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /--sf-duration-instant/);
  });
});

describe('check-mirrors (D4)', () => {
  test('passes clean, fails when a :root mirror drifts from its @property initial-value', () => {
    const dir = cloneRepo();
    assert.equal(runGate('check-mirrors.js', dir).status, 0);

    // Edit only the :root mirror of a source-light colour, not its @property.
    const css = readCss(dir, 'core/tokens.css')
      .replace('--sf-color-primary-source-light:   oklch(0.47 0.27 264);',
               '--sf-color-primary-source-light:   oklch(0.50 0.27 264);');
    writeCss(dir, 'core/tokens.css', css);

    const r = runGate('check-mirrors.js', dir);
    assert.equal(r.status, 1, `expected failure:\n${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /--sf-color-primary-source-light/);
  });
});

describe('check-hook-tokens (D5)', () => {
  test('passes clean, fails when a new undeclared fallback hook is not listed', () => {
    const dir = cloneRepo();
    assert.equal(runGate('check-hook-tokens.js', dir).status, 0);

    // Introduce a brand-new fallback-only token nobody catalogued.
    const css = readCss(dir, 'optional/forms.css')
      .replace('border-radius: var(--sf-field-radius, var(--sf-radius-m));',
               'border-radius: var(--sf-ghost-hook, var(--sf-radius-m));');
    writeCss(dir, 'optional/forms.css', css);

    const r = runGate('check-hook-tokens.js', dir);
    assert.equal(r.status, 1, `expected failure:\n${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /--sf-ghost-hook/);
  });
});

describe('check-bundle-defs (D6)', () => {
  test('passes clean, fails when a bundle consumes a token it never defines', () => {
    const dir = cloneRepo();
    assert.equal(runGate('check-bundle-defs.js', dir).status, 0);

    // Add a bare (no-fallback) consumption of an undefined token to a file that
    // ships in every bundle.
    const css = readCss(dir, 'core/base.css') + '\n.sf-ghost { color: var(--sf-nowhere-defined); }\n';
    writeCss(dir, 'core/base.css', css);

    const r = runGate('check-bundle-defs.js', dir);
    assert.equal(r.status, 1, `expected failure:\n${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /--sf-nowhere-defined/);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
