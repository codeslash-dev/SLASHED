/**
 * Unit tests for src/lib/colorConvert.ts — the "paste any colour, store it
 * canonical" helpers behind the colour inputs.
 *
 * The actual format conversion (hex/rgb/hsl/named → oklch/oklab) is done by the
 * browser's colour engine via the live preview iframe, so it can't run here —
 * these tests pin the pure classification and the safe pass-through / fallback
 * behaviour, which is where a regression would silently corrupt or drop a
 * user's pasted value. With no preview registered, convertColor() can't resolve,
 * so a foreign colour must fall back to the raw text rather than vanish.
 */
import { describe, test, expect } from 'vitest';
import { colorSpaceOf, normalizeColorInput } from '../src/lib/colorConvert';

describe('colorSpaceOf', () => {
  test('classifies OKLCH / OKLAB literals by their own space', () => {
    expect(colorSpaceOf('oklch(0.6 0.15 264)')).toBe('oklch');
    expect(colorSpaceOf('  OKLAB(0.7 0.1 -0.1)  ')).toBe('oklab');
  });

  test('classifies every other concrete colour literal as "other"', () => {
    for (const v of ['#ff0000', '#f00', 'rgb(255 0 0)', 'hsl(120 100% 50%)', 'red', 'rebeccapurple', 'color(display-p3 1 0 0)']) {
      expect(colorSpaceOf(v)).toBe('other');
    }
  });

  test('returns null for references and expressions we must not touch', () => {
    expect(colorSpaceOf('')).toBeNull();
    expect(colorSpaceOf('   ')).toBeNull();
    expect(colorSpaceOf('--sf-color-primary')).toBeNull();
    expect(colorSpaceOf('var(--sf-color-primary)')).toBeNull();
    expect(colorSpaceOf('oklch(from var(--sf-color-primary) l c h)')).toBeNull();
  });
});

describe('normalizeColorInput (no preview registered)', () => {
  test('passes through same-space and reference values untouched', () => {
    expect(normalizeColorInput('oklch(0.6 0.15 264)', 'oklch')).toBe('oklch(0.6 0.15 264)');
    expect(normalizeColorInput('var(--sf-color-primary)', 'oklch')).toBe('var(--sf-color-primary)');
    expect(normalizeColorInput('  oklab(0.7 0.1 -0.1)  ', 'oklab')).toBe('oklab(0.7 0.1 -0.1)');
  });

  test('keeps the raw text when a foreign colour cannot be resolved', () => {
    // Without a live preview iframe the browser engine is unavailable, so the
    // paste is preserved verbatim instead of being dropped.
    expect(normalizeColorInput('#ff0000', 'oklch')).toBe('#ff0000');
    expect(normalizeColorInput('hsl(120 100% 50%)', 'oklch')).toBe('hsl(120 100% 50%)');
  });
});
