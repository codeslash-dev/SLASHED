/**
 * Tests for the portable theme file: the format contract
 * (scripts/lib/theme-file.js) and the migration CLI (scripts/migrate-theme.js).
 *
 * The properties that matter here are the ones a user's data depends on:
 * a theme file must round-trip byte for byte, migration must be idempotent, and
 * nothing the tool does not understand may be silently discarded.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  THEME_SCHEMA_VERSION,
  validateThemeFile,
  parseThemeFile,
  migrateOverrides,
  serializeThemeFile,
} from '../scripts/lib/theme-file.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const CLI = path.join(ROOT, 'scripts', 'migrate-theme.js');

const tmpDirs = [];
function tmpFile(contents, name = 'x.slashed-theme.json') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-theme-'));
  tmpDirs.push(dir);
  const file = path.join(dir, name);
  fs.writeFileSync(file, contents);
  return file;
}
after(() => {
  for (const dir of tmpDirs) fs.rmSync(dir, { recursive: true, force: true });
});

const RENAMES = { '--sf-color-error': '--sf-color-danger', '--sf-z-top': '--sf-z-toast' };
const REMOVALS = { '--sf-opacity-25': 'Use --sf-opacity-muted.' };

describe('validateThemeFile', () => {
  const ok = {
    schemaVersion: 1,
    overrides: { '--sf-color-primary-source-light': '#3b5bdb' },
  };

  test('accepts a minimal well-formed file', () => {
    const { theme, errors } = validateThemeFile(ok);
    assert.deepEqual(errors, []);
    assert.equal(theme.overrides['--sf-color-primary-source-light'], '#3b5bdb');
    assert.equal(theme.name, null);
  });

  test('rejects a non-object', () => {
    for (const bad of [null, [], 'x', 42]) {
      assert.equal(validateThemeFile(bad).theme, null);
    }
  });

  test('rejects a missing or non-integer schemaVersion', () => {
    assert.equal(validateThemeFile({ overrides: {} }).theme, null);
    assert.equal(validateThemeFile({ schemaVersion: '1', overrides: {} }).theme, null);
  });

  test('refuses a schemaVersion from the future rather than guessing', () => {
    const { theme, errors } = validateThemeFile({
      schemaVersion: THEME_SCHEMA_VERSION + 1,
      overrides: {},
    });
    assert.equal(theme, null);
    assert.match(errors[0], /newer than this SLASHED understands/);
  });

  test('rejects a key that is not an --sf-* token', () => {
    const { theme, errors } = validateThemeFile({
      schemaVersion: 1,
      overrides: { 'color-primary': 'red' },
    });
    assert.equal(theme, null);
    assert.match(errors[0], /well-formed/);
  });

  test('rejects a value that could break out of the declaration', () => {
    for (const bad of ['red; background: url(evil)', 'red }', '/* x */ red']) {
      const { theme, errors } = validateThemeFile({
        schemaVersion: 1,
        overrides: { '--sf-color-primary': bad },
      });
      assert.equal(theme, null, `expected rejection of ${JSON.stringify(bad)}`);
      assert.match(errors[0], /CSS-breaking/);
    }
  });

  test('rejects an empty or whitespace-only value', () => {
    // Regression (PR #671 review): these used to trim to "" and be accepted as
    // an active override, so generateCSS() emitted `--sf-x: ;` — a broken
    // declaration shadowing the real token with nothing.
    for (const bad of ['', '   ', '\t\n']) {
      const { theme, errors } = validateThemeFile({
        schemaVersion: 1,
        overrides: { '--sf-color-primary': bad },
      });
      assert.equal(theme, null, `expected rejection of ${JSON.stringify(bad)}`);
      assert.match(errors[0], /value is empty/);
    }
  });

  test('rejects control characters in a value', () => {
    const { theme, errors } = validateThemeFile({
      schemaVersion: 1,
      overrides: { '--sf-color-primary': 'red\u001b[2Jwiped' },
    });
    assert.equal(theme, null);
    assert.match(errors[0], /control characters/);
  });

  test('rejects control characters in the theme name', () => {
    const { theme, errors } = validateThemeFile({
      schemaVersion: 1,
      name: 'Acme\u001b[31m',
      overrides: { '--sf-radius-m': '10px' },
    });
    assert.equal(theme, null);
    assert.match(errors.join(' '), /`name` contains control characters/);
  });

  test('parseThemeFile reports malformed JSON without throwing', () => {
    const { theme, errors } = parseThemeFile('{ not json');
    assert.equal(theme, null);
    assert.match(errors[0], /not valid JSON/);
  });
});

describe('migrateOverrides', () => {
  test('rewrites a renamed token, preserving its value', () => {
    const r = migrateOverrides({ '--sf-color-error': '#e03131' }, { renames: RENAMES, removals: REMOVALS });
    assert.deepEqual(r.overrides, { '--sf-color-danger': '#e03131' });
    assert.deepEqual(r.renamed, [{ from: '--sf-color-error', to: '--sf-color-danger' }]);
  });

  test('drops a removed token and surfaces its reason', () => {
    const r = migrateOverrides({ '--sf-opacity-25': '0.25' }, { renames: RENAMES, removals: REMOVALS });
    assert.deepEqual(r.overrides, {});
    assert.equal(r.removed[0].name, '--sf-opacity-25');
    assert.match(r.removed[0].reason, /opacity-muted/);
  });

  test('keeps an unrecognised token instead of discarding it', () => {
    const live = new Set(['--sf-color-danger']);
    const r = migrateOverrides({ '--sf-from-the-future': '1rem' }, { renames: RENAMES, removals: REMOVALS, live });
    assert.deepEqual(r.overrides, { '--sf-from-the-future': '1rem' });
    assert.deepEqual(r.unknown, ['--sf-from-the-future']);
  });

  test('a live token is passed through without being reported unknown', () => {
    const live = new Set(['--sf-radius-m']);
    const r = migrateOverrides({ '--sf-radius-m': '10px' }, { renames: RENAMES, removals: REMOVALS, live });
    assert.deepEqual(r.overrides, { '--sf-radius-m': '10px' });
    assert.deepEqual(r.unknown, []);
  });

  test('when both old and new names are set, the current name wins', () => {
    const r = migrateOverrides(
      { '--sf-color-error': '#old', '--sf-color-danger': '#new' },
      { renames: RENAMES, removals: REMOVALS },
    );
    assert.deepEqual(r.overrides, { '--sf-color-danger': '#new' });
    assert.equal(r.collisions.length, 1);
    assert.equal(r.collisions[0].kept, '#new');
    assert.deepEqual(r.renamed, []);
  });

  test('reports a collision when two old names resolve to one target', () => {
    // Reachable with the real map: --sf-color-danger-light and
    // --sf-color-error-source-light both land on --sf-color-danger-source-light.
    // Without a collision record the later key would silently overwrite the
    // earlier one — the exact data loss this function promises never to do.
    const renames = {
      '--sf-color-danger-light': '--sf-color-danger-source-light',
      '--sf-color-error-source-light': '--sf-color-danger-source-light',
    };
    const r = migrateOverrides(
      { '--sf-color-danger-light': '#aaa', '--sf-color-error-source-light': '#bbb' },
      { renames, removals: {} },
    );
    // Sorted order: --sf-color-danger-light claims the target first.
    assert.deepEqual(r.overrides, { '--sf-color-danger-source-light': '#aaa' });
    assert.deepEqual(r.renamed, [
      { from: '--sf-color-danger-light', to: '--sf-color-danger-source-light' },
    ]);
    assert.equal(r.collisions.length, 1);
    assert.equal(r.collisions[0].from, '--sf-color-error-source-light');
    assert.equal(r.collisions[0].kept, '#aaa');
  });

  test('is idempotent — migrating an already-migrated set changes nothing', () => {
    const once = migrateOverrides({ '--sf-color-error': '#e03131' }, { renames: RENAMES, removals: REMOVALS });
    const twice = migrateOverrides(once.overrides, { renames: RENAMES, removals: REMOVALS });
    assert.deepEqual(twice.overrides, once.overrides);
    assert.equal(twice.renamed.length, 0);
    assert.equal(twice.removed.length, 0);
  });

  test('output keys are sorted regardless of input order', () => {
    const r = migrateOverrides(
      { '--sf-z-index': '1', '--sf-a-token': '2', '--sf-m-token': '3' },
      { renames: {}, removals: {} },
    );
    assert.deepEqual(Object.keys(r.overrides), ['--sf-a-token', '--sf-m-token', '--sf-z-index']);
  });
});

describe('serializeThemeFile', () => {
  test('round-trips through parseThemeFile unchanged', () => {
    const overrides = { '--sf-color-primary-source-light': '#3b5bdb', '--sf-radius-m': '10px' };
    const text = serializeThemeFile({ overrides, name: 'Acme', slashedVersion: '0.7.31' });
    const { theme, errors } = parseThemeFile(text);
    assert.deepEqual(errors, []);
    assert.deepEqual(theme.overrides, overrides);
    assert.equal(theme.name, 'Acme');
    assert.equal(theme.slashedVersion, '0.7.31');
  });

  test('is byte-stable — re-serialising produces an identical string', () => {
    const a = serializeThemeFile({ overrides: { '--sf-b': '2', '--sf-a': '1' }, name: 'X' });
    const b = serializeThemeFile({ overrides: { '--sf-a': '1', '--sf-b': '2' }, name: 'X' });
    assert.equal(a, b, 'key order in the input must not affect the output');
    assert.match(a, /\n$/, 'must end with a newline');
  });

  test('omits optional fields rather than writing nulls', () => {
    const text = serializeThemeFile({ overrides: {} });
    assert.doesNotMatch(text, /"name"/);
    assert.doesNotMatch(text, /"slashedVersion"/);
    assert.match(text, /"schemaVersion": 1/);
  });
});

describe('migrate-theme CLI', () => {
  const run = (args) => spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', cwd: ROOT });

  const legacyTheme = JSON.stringify(
    {
      schemaVersion: 1,
      slashedVersion: '0.6.10',
      name: 'Acme',
      overrides: { '--sf-color-primary-light': '#3b5bdb', '--sf-color-error': '#e03131' },
    },
    null,
    2,
  );

  test('report-only mode exits 1 when migration is needed, without touching the file', () => {
    const file = tmpFile(legacyTheme);
    const before = fs.readFileSync(file, 'utf8');
    const r = run([file]);
    assert.equal(r.status, 1, r.stderr);
    assert.match(r.stdout, /renamed\s+--sf-color-primary-light → --sf-color-primary-source-light/);
    assert.equal(fs.readFileSync(file, 'utf8'), before, 'report-only must not write');
  });

  test('--write applies the migration and then exits 0 on a re-run', () => {
    const file = tmpFile(legacyTheme);
    assert.equal(run([file, '--write']).status, 0);

    const migrated = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.ok(migrated.overrides['--sf-color-primary-source-light']);
    assert.ok(migrated.overrides['--sf-color-danger']);
    assert.equal(migrated.overrides['--sf-color-primary-light'], undefined);

    const second = run([file]);
    assert.equal(second.status, 0, 'a migrated file needs no further work');
    assert.match(second.stdout, /nothing to migrate/);
  });

  test('exits 1 with a readable message on an invalid file', () => {
    const r = run([tmpFile('{ "schemaVersion": 99, "overrides": {} }')]);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /invalid theme file/);
    assert.match(r.stderr, /newer than this SLASHED understands/);
  });

  test('refuses a file carrying terminal control sequences', () => {
    const file = tmpFile(
      JSON.stringify({
        schemaVersion: 1,
        name: 'Acme',
        overrides: { '--sf-color-primary': 'red\u001b[2J' },
      }),
    );
    const r = run([file]);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /control characters/);
    assert.ok(!r.stderr.includes('\u001b[2J'), 'must not echo the raw escape sequence');
    assert.ok(!r.stdout.includes('\u001b[2J'), 'must not echo the raw escape sequence');
  });

  test('exits 1 when the file does not exist', () => {
    const r = run(['/nonexistent/theme.json']);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /file not found/);
  });

  test('exits 1 with usage when given no file', () => {
    const r = run([]);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Usage:/);
  });
});
