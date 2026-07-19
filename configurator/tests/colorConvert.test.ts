/**
 * Unit tests for src/lib/colorConvert.ts — the "paste any colour, store it
 * canonical" helpers behind the colour inputs.
 *
 * The browser does the actual format conversion (via the live preview iframe),
 * so we mock the resolver to drive `convertColor`/`normalizeColorInput`
 * deterministically and pin the decision logic: what gets converted, what is
 * left untouched, cross-space handling, the compact formatting (incl. the CSS
 * `none` channel and alpha), and the raw-text fallback when the engine is
 * unavailable.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';

// The relative-colour expression the resolver is asked to compute, keyed so a
// test can hand back whatever the browser "would" serialise.
let resolveImpl: (expr: string) => string;
vi.mock('../src/lib/previewResolver.svelte', () => ({
  resolveColor: (expr: string) => resolveImpl(expr),
  resolveRgb: () => null,
  previewVersion: { value: 0 },
}));

import { colorSpaceOf, normalizeColorInput } from '../src/lib/colorConvert';

beforeEach(() => {
  // Default: engine unavailable (returns "" — as with no preview registered).
  resolveImpl = () => '';
});

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

describe('normalizeColorInput', () => {
  test('passes through same-space and reference values without touching the engine', () => {
    const spy = vi.fn(() => 'oklch(0 0 0)');
    resolveImpl = spy;
    expect(normalizeColorInput('oklch(0.6 0.15 264)', 'oklch')).toBe('oklch(0.6 0.15 264)');
    expect(normalizeColorInput('var(--sf-color-primary)', 'oklch')).toBe('var(--sf-color-primary)');
    expect(normalizeColorInput('  oklab(0.7 0.1 -0.1)  ', 'oklab')).toBe('oklab(0.7 0.1 -0.1)');
    expect(spy).not.toHaveBeenCalled();
  });

  test('converts a foreign colour to the target space', () => {
    resolveImpl = (expr) => (expr.startsWith('oklch(from') ? 'oklch(0.627966 0.257704 29.2346)' : '');
    expect(normalizeColorInput('#ff0000', 'oklch')).toBe('oklch(0.628 0.258 29.2)');
  });

  test('converts the OTHER canonical space (oklab pasted into an oklch field)', () => {
    // The regression Greptile caught: without conversion this stored oklab(…)
    // verbatim and the desk's L/C/H sliders fell back to their defaults.
    resolveImpl = (expr) => (expr.startsWith('oklch(from oklab(') ? 'oklch(0.7 0.141421 315)' : '');
    expect(normalizeColorInput('oklab(0.7 0.1 -0.1)', 'oklch')).toBe('oklch(0.7 0.141 315)');
  });

  test('handles the CSS `none` channel (achromatic → 0)', () => {
    resolveImpl = () => 'oklch(0.534 0 none)';
    expect(normalizeColorInput('white', 'oklch')).toBe('oklch(0.534 0 0)');
  });

  test('preserves alpha below 1', () => {
    resolveImpl = () => 'oklch(0.572549 0.233753 265.289 / 0.8)';
    expect(normalizeColorInput('#3366ffcc', 'oklch')).toBe('oklch(0.573 0.234 265.3 / 0.8)');
  });

  test('keeps the raw text when the colour cannot be resolved', () => {
    resolveImpl = () => ''; // engine unavailable
    expect(normalizeColorInput('#ff0000', 'oklch')).toBe('#ff0000');
    expect(normalizeColorInput('hsl(120 100% 50%)', 'oklch')).toBe('hsl(120 100% 50%)');
  });

  test('rejects a result that is not in the target space (invalid input fell back to rgb)', () => {
    resolveImpl = () => 'rgb(0, 0, 0)';
    expect(normalizeColorInput('notacolor', 'oklch')).toBe('notacolor');
  });
});
