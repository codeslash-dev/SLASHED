/**
 * Tests for the override-CSS generator + parser (src/lib/codec.ts).
 *
 * The generator is the user-visible export payload: it must round-trip through
 * parseCSS so a user can paste a previously-generated stylesheet and recover
 * the same overrides. sanitizeValue must also resist injection.
 */
import { describe, test, expect } from 'vitest';
import { generateCSS, parseCSS, sanitizeValue } from '../src/lib/codec';

describe('sanitizeValue', () => {
  test('strips structural characters', () => {
    expect(sanitizeValue('1rem; } body { color: red')).toBe('1rem body color: red');
  });

  test('drops comment blocks', () => {
    expect(sanitizeValue('1rem /* sneaky */ 2rem')).toBe('1rem 2rem');
  });

  test('collapses whitespace', () => {
    expect(sanitizeValue('  1rem   2rem\t3rem  ')).toBe('1rem 2rem 3rem');
  });

  test('returns empty for null / undefined / blank', () => {
    expect(sanitizeValue(null)).toBe('');
    expect(sanitizeValue(undefined)).toBe('');
    expect(sanitizeValue('   ')).toBe('');
  });

  test('keeps oklch() and clamp() intact', () => {
    expect(sanitizeValue('oklch(0.7 0.1 200)')).toBe('oklch(0.7 0.1 200)');
    expect(sanitizeValue('clamp(1rem, 4vw, 2rem)')).toBe('clamp(1rem, 4vw, 2rem)');
  });
});

describe('generateCSS', () => {
  test('produces @layer block by default', () => {
    const css = generateCSS({ '--sf-text-scale': '1.1' });
    expect(css).toContain('@layer slashed.overrides');
    expect(css).toContain(':root');
    expect(css).toContain('--sf-text-scale: 1.1;');
  });

  test('mode:root produces :root block without @layer', () => {
    const css = generateCSS({ '--sf-text-scale': '1.1' }, { mode: 'root', banner: false });
    expect(css).not.toContain('@layer');
    expect(css).toContain(':root');
    expect(css).toContain('--sf-text-scale: 1.1;');
  });

  test('banner:true adds a comment header', () => {
    const css = generateCSS({ '--sf-text-scale': '1.1' }, { banner: true });
    expect(css).toMatch(/\/\* SLASHED override tokens/);
  });

  test('banner:false omits comment header', () => {
    const css = generateCSS({ '--sf-text-scale': '1.1' }, { banner: false });
    expect(css).not.toMatch(/\/\* SLASHED/);
  });

  test('returns empty string for empty map', () => {
    expect(generateCSS({})).toBe('');
  });

  test('tokens are sorted alphabetically', () => {
    const css = generateCSS(
      { '--sf-z': 'z', '--sf-a': 'a', '--sf-m': 'm' },
      { mode: 'root', banner: false }
    );
    const lines = css.split('\n').filter(l => l.includes('--sf-'));
    expect(lines[0]).toContain('--sf-a');
    expect(lines[1]).toContain('--sf-m');
    expect(lines[2]).toContain('--sf-z');
  });
});

describe('parseCSS', () => {
  test('parses a valid override block', () => {
    const css = `@layer slashed.overrides {\n  :root {\n    --sf-text-scale: 1.1;\n    --sf-radius-scale: 1.5;\n  }\n}`;
    const result = parseCSS(css);
    expect(result['--sf-text-scale']).toBe('1.1');
    expect(result['--sf-radius-scale']).toBe('1.5');
  });

  test('round-trips through generateCSS', () => {
    const overrides = { '--sf-text-scale': '1.1', '--sf-radius-scale': '1.5' };
    const css = generateCSS(overrides, { mode: 'layer', banner: false });
    const parsed = parseCSS(css);
    expect(parsed).toEqual(overrides);
  });

  test('ignores non-sf custom properties', () => {
    const css = ':root { --not-sf: red; --sf-color-primary: blue; }';
    const result = parseCSS(css);
    expect(result['--not-sf']).toBeUndefined();
    expect(result['--sf-color-primary']).toBe('blue');
  });

  test('handles values with parentheses (e.g. oklch, clamp)', () => {
    const css = ':root { --sf-color-primary: oklch(0.7 0.1 200 / 0.5); }';
    const result = parseCSS(css);
    expect(result['--sf-color-primary']).toBe('oklch(0.7 0.1 200 / 0.5)');
  });

  test('returns empty object for empty string', () => {
    expect(parseCSS('')).toEqual({});
  });
});
