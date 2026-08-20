/**
 * Unit tests for src/lib/importOverrides.ts — the single, validated import
 * pipeline that replaced the two silent, inconsistent header-import paths.
 * Pins that CSS and JSON behave the same, values are sanitised, bad keys/values
 * are reported (not silently dropped), and renamed tokens are migrated.
 */
import { describe, test, expect } from 'vitest';
import { parseImport, summarizeImport } from '../src/lib/importOverrides';

const LIVE = new Set([
  '--sf-color-primary', '--sf-space-m', '--sf-radius-l',
  '--sf-color-primary-source-light', // migration target
]);

describe('parseImport — JSON', () => {
  test('accepts a flat name→value map', () => {
    const r = parseImport('{"--sf-color-primary":"red","--sf-space-m":"2rem"}', 'x.json', LIVE);
    expect(r.overrides).toEqual({ '--sf-color-primary': 'red', '--sf-space-m': '2rem' });
    expect(r.report.format).toBe('json');
    expect(r.report.accepted).toBe(2);
  });
  test('accepts a theme-file { tokens } shape', () => {
    const r = parseImport('{"schemaVersion":1,"tokens":{"--sf-space-m":"3rem"}}', 't.json', LIVE);
    expect(r.overrides).toEqual({ '--sf-space-m': '3rem' });
  });
  test('accepts exported theme-file { overrides } and reports invalid values', () => {
    const r = parseImport('{"schemaVersion":1,"overrides":{"--sf-space-m":"3rem","--sf-radius-l":4}}', 'theme.json', LIVE);
    expect(r.overrides).toEqual({ '--sf-space-m': '3rem' });
    expect(r.report.invalid).toEqual(['--sf-radius-l']);
  });
  test('repairs CSS-breaking values but rejects bad keys and empty-after-sanitise ones', () => {
    // "1rem; }" sanitises to "1rem" (kept); ";;" sanitises to "" (rejected);
    // a non --sf key is rejected.
    const r = parseImport('{"notatoken":"x","--sf-space-m":";;","--sf-color-primary":"1rem; }","--sf-radius-l":"8px"}', 'x.json', LIVE);
    expect(r.overrides).toEqual({ '--sf-color-primary': '1rem', '--sf-radius-l': '8px' });
    expect(r.report.invalid.sort()).toEqual(['--sf-space-m', 'notatoken']);
  });
  test('malformed JSON is reported, not thrown', () => {
    const r = parseImport('{ not json', 'x.json', LIVE);
    expect(r.report.malformed).toBe(true);
    expect(r.report.accepted).toBe(0);
  });
});

describe('parseImport — CSS', () => {
  test('parses declarations and merges consistently with JSON', () => {
    const css = ':root{ --sf-color-primary: blue; --sf-radius-l: 12px; }';
    const r = parseImport(css, 'overrides.css', LIVE);
    expect(r.overrides).toEqual({ '--sf-color-primary': 'blue', '--sf-radius-l': '12px' });
    expect(r.report.format).toBe('css');
  });
  test('a CSS file with no --sf tokens is reported empty', () => {
    const r = parseImport('body { color: red; }', 'x.css', LIVE);
    expect(r.report.accepted).toBe(0);
  });
});

describe('parseImport — migration & unknown', () => {
  test('migrates a renamed token to its current name', () => {
    const r = parseImport('{"--sf-color-primary-light":"red"}', 'x.json', LIVE);
    expect(r.overrides['--sf-color-primary-source-light']).toBe('red');
    expect(r.report.renamed).toBe(1);
  });
  test('keeps but flags a token not in this build', () => {
    const r = parseImport('{"--sf-made-up-token":"1px"}', 'x.json', LIVE);
    expect(r.overrides['--sf-made-up-token']).toBe('1px');
    expect(r.report.unknown).toBe(1);
  });
});

describe('summarizeImport', () => {
  test('summarises a mixed result', () => {
    const msg = summarizeImport({ format: 'json', accepted: 3, renamed: 1, removed: 0, unknown: 1, invalid: ['x'], collisions: 0, malformed: false });
    expect(msg).toContain('Imported 3 tokens');
    expect(msg).toContain('1 migrated');
    expect(msg).toContain('1 unknown');
    expect(msg).toContain('1 skipped');
  });
  test('reports malformed and empty distinctly', () => {
    expect(summarizeImport({ format: 'css', accepted: 0, renamed: 0, removed: 0, unknown: 0, invalid: [], collisions: 0, malformed: true })).toMatch(/failed/i);
    expect(summarizeImport({ format: 'css', accepted: 0, renamed: 0, removed: 0, unknown: 0, invalid: [], collisions: 0, malformed: false })).toMatch(/Nothing imported/i);
  });
});
