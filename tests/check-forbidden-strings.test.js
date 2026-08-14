/**
 * Negative tests for scripts/check-forbidden-strings.js.
 *
 * A gate that has never been observed to fail is indistinguishable from a gate
 * that cannot fail. Each test below plants exactly one violation in a fixture
 * tree (SLASHED_ROOT), and asserts the gate reports it and — under --check —
 * exits non-zero. The passing-fixture test guards the opposite failure mode: a
 * rule so broad it fires on legitimate source.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-forbidden-strings.js');

const tmpDirs = [];

/**
 * Build a minimal fixture tree. Every file is optional; omitted ones are
 * written with clean, rule-satisfying content so a test can plant a single
 * violation without the others interfering.
 * @param {{ [relPath: string]: string }} files
 */
function buildFixture(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-forbidden-'));
  tmpDirs.push(dir);

  const defaults = {
    // Excluded from hardcoded-color by design — proves the exclusion works.
    'core/tokens.css': ':root { --sf-color-primary: #3b5bdb; }\n',
    'core/base.css': 'body { color: var(--sf-color-text); }\n',
    'optional/forms.css': 'input { border: 1px solid var(--sf-color-border); }\n',
    'dist/slashed.optimal.css': '/*! SLASHED v0.0.0 */\n:root { --sf-x: 1; }\n',
    'configurator/src/lib/thing.ts': 'export const x = 1;\n',
  };

  for (const [rel, content] of Object.entries({ ...defaults, ...files })) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  return dir;
}

function runGate(dir, args = []) {
  return spawnSync(process.execPath, [GATE, ...args], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

after(() => {
  for (const dir of tmpDirs) fs.rmSync(dir, { recursive: true, force: true });
});

describe('check-forbidden-strings', () => {
  test('passes on a clean fixture', () => {
    const r = runGate(buildFixture(), ['--check']);
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
    assert.match(r.stdout, /check:forbidden-strings OK/);
  });

  test('does not flag colour literals inside the token source files', () => {
    // core/tokens.css in the default fixture is full of hex; it must stay silent.
    const r = runGate(buildFixture(), ['--check']);
    assert.equal(r.status, 0, `token source files must be exempt:\n${r.stderr}`);
  });

  test('flags a hardcoded hex colour in a non-token CSS file', () => {
    const dir = buildFixture({
      'core/macros.css': '.sf-prose { color: #3b5bdb; }\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 1, 'expected a non-zero exit');
    assert.match(r.stderr, /hardcoded-color/);
    assert.match(r.stderr, /core\/macros\.css:1/);
    assert.match(r.stderr, /#3b5bdb/);
  });

  test('flags a hardcoded rgb() colour', () => {
    const dir = buildFixture({
      'optional/utilities.css': '.sf-x { background: rgba(0, 0, 0, 0.5); }\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /optional\/utilities\.css:1/);
  });

  test('ignores a colour literal that appears only inside a comment', () => {
    const dir = buildFixture({
      'core/macros.css': '/* was #3b5bdb before tokenising, and issue #496 */\n.sf-x { color: var(--sf-color-primary); }\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 0, `comments must be masked:\n${r.stderr}`);
  });

  test('reports the original line number despite comment masking', () => {
    const dir = buildFixture({
      'core/macros.css': '/* banner\n   spanning\n   lines */\n.sf-x { color: #abc; }\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 1);
    // The violation is on line 4 of the original file; a non-offset-preserving
    // comment strip would report line 1 or 2 here.
    assert.match(r.stderr, /core\/macros\.css:4/);
  });

  test('flags a direct modern colour literal', () => {
    for (const decl of [
      'color: oklch(0.6 0.25 30)',
      'color: oklab(0.5 0.1 0.1)',
      'color: lch(50% 40 30)',
      'color: lab(50% 40 30)',
      'color: hwb(120 10% 20%)',
      'color: color(display-p3 1 0 0)',
    ]) {
      const dir = buildFixture({ 'core/macros.css': `.sf-x { ${decl}; }\n` });
      const r = runGate(dir, ['--check']);
      assert.equal(r.status, 1, `expected ${decl} to be flagged`);
      assert.match(r.stderr, /hardcoded-color/);
    }
  });

  test('does not flag relative-colour derivations, which are the token architecture', () => {
    for (const decl of [
      'color: oklch(from var(--sf-color-primary) l c h)',
      'color: oklch(var(--sf-l) var(--sf-c) var(--sf-h))',
      'color: color-mix(in oklab, red, blue)',
    ]) {
      const dir = buildFixture({ 'core/macros.css': `.sf-x { ${decl}; }\n` });
      const r = runGate(dir, ['--check']);
      assert.equal(r.status, 0, `${decl} must be allowed:\n${r.stderr}`);
    }
  });

  test('flags a protocol-relative external URL in a bundle', () => {
    const dir = buildFixture({
      'dist/slashed.optimal.css': '@import url(//fonts.example.com/style.css);\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 1, 'a //host reference still causes a network request');
    assert.match(r.stderr, /external-url/);
    assert.match(r.stderr, /fonts\.example\.com/);
  });

  test('flags an external URL in a shipped bundle', () => {
    const dir = buildFixture({
      'dist/slashed.optimal.css': "@import url(https://fonts.googleapis.com/css2?family=Inter);\n",
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /external-url/);
    assert.match(r.stderr, /fonts\.googleapis\.com/);
  });

  test('allows the inline-SVG XML namespace in a bundle', () => {
    const dir = buildFixture({
      'dist/slashed.optimal.css':
        ".sf-x { background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>'); }\n",
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 0, `namespace URI must be allowed:\n${r.stderr}`);
  });

  test('flags a console.log left in configurator source', () => {
    const dir = buildFixture({
      'configurator/src/lib/thing.ts': 'export function f() { console.log("hi"); }\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /debug-statement/);
  });

  test('does not flag console.warn in configurator source', () => {
    const dir = buildFixture({
      'configurator/src/lib/thing.ts': 'export function f() { console.warn("real diagnostic"); }\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 0, `console.warn is legitimate:\n${r.stderr}`);
  });

  test('without --check, reports the violation but exits 0', () => {
    const dir = buildFixture({
      'core/macros.css': '.sf-x { color: #3b5bdb; }\n',
    });
    const r = runGate(dir);
    assert.equal(r.status, 0, 'report-only mode must not fail the shell');
    assert.match(r.stderr, /hardcoded-color/);
  });

  test('an allowed match does not blanket-approve other matches in the same file', () => {
    // core/base.css has a real ALLOW entry for `#fff`. A different literal in
    // that same file must still fail — this is the key property of keying the
    // allowlist by matched text rather than by path.
    const dir = buildFixture({
      'core/base.css': 'body { color: var(--sf-color-bg, #fff); border-color: #3b5bdb; }\n',
    });
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 1, 'a second, unexcepted literal must still fail');
    assert.match(r.stderr, /#3b5bdb/);
    assert.doesNotMatch(r.stderr, /#fff/);
  });

  test('tolerates a missing target directory', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-forbidden-empty-'));
    tmpDirs.push(dir);
    const r = runGate(dir, ['--check']);
    assert.equal(r.status, 0, `an unbuilt tree must not crash the gate:\n${r.stderr}`);
  });
});
