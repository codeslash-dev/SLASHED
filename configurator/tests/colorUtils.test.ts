/**
 * Unit tests for src/lib/colorUtils.ts — the colour maths behind every picker,
 * the WCAG panel, and the exported palette. Pure functions, no DOM.
 *
 * Why this matters: these are ~7 pure functions with zero unit coverage. A
 * silent regression (a flipped coefficient, a gamma tweak, a rounding change)
 * would corrupt EVERY resolved colour in the configurator and only surface as
 * a wrong export in a user's hands. These tests pin the contract.
 */
import { describe, test, expect } from 'vitest';
import {
  oklchToRgb,
  rgbToHex,
  getRelativeLuminance,
  getContrastRatio,
  getContrastRating,
  parseOklch,
  stringifyOklch,
} from '../src/lib/colorUtils';

describe('oklchToRgb', () => {
  test('pure white: L=1, C=0 → [255,255,255]', () => {
    expect(oklchToRgb(1, 0, 0)).toEqual([255, 255, 255]);
  });

  test('pure black: L=0, C=0 → [0,0,0]', () => {
    expect(oklchToRgb(0, 0, 0)).toEqual([0, 0, 0]);
  });

  test('output is always clamped into the [0,255] byte range', () => {
    // Sweep hues and a high chroma that pushes several hues out of sRGB gamut;
    // the function must clamp, never emit NaN or out-of-range bytes.
    for (let h = 0; h < 360; h += 15) {
      const rgb = oklchToRgb(0.6, 0.37, h);
      expect(rgb).toHaveLength(3);
      for (const ch of rgb) {
        expect(Number.isInteger(ch)).toBe(true);
        expect(ch).toBeGreaterThanOrEqual(0);
        expect(ch).toBeLessThanOrEqual(255);
      }
    }
  });

  test('a mid red hue skews the red channel highest', () => {
    const [r, g, b] = oklchToRgb(0.63, 0.25, 29); // ~ sRGB red
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  });
});

describe('rgbToHex', () => {
  test('pads single-digit channels to two hex digits', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    expect(rgbToHex(1, 2, 3)).toBe('#010203');
  });
});

describe('getRelativeLuminance', () => {
  test('white luminance is 1, black is 0', () => {
    expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 5);
    expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 5);
  });

  test('green weighs more than red weighs more than blue', () => {
    const r = getRelativeLuminance(255, 0, 0);
    const g = getRelativeLuminance(0, 255, 0);
    const b = getRelativeLuminance(0, 0, 255);
    expect(g).toBeGreaterThan(r);
    expect(r).toBeGreaterThan(b);
  });
});

describe('getContrastRatio', () => {
  test('black-on-white is the canonical 21:1', () => {
    const white = getRelativeLuminance(255, 255, 255);
    const black = getRelativeLuminance(0, 0, 0);
    expect(getContrastRatio(white, black)).toBeCloseTo(21, 1);
  });

  test('identical colours give the 1:1 floor and order does not matter', () => {
    const l = getRelativeLuminance(128, 128, 128);
    expect(getContrastRatio(l, l)).toBeCloseTo(1, 5);
    const a = getRelativeLuminance(255, 255, 255);
    const b = getRelativeLuminance(0, 0, 0);
    expect(getContrastRatio(a, b)).toBeCloseTo(getContrastRatio(b, a), 5);
  });
});

describe('getContrastRating', () => {
  test('21:1 passes every WCAG tier', () => {
    const r = getContrastRating(21);
    expect(r).toMatchObject({
      aaNormal: 'PASS', aaLarge: 'PASS', aaaNormal: 'PASS', aaaLarge: 'PASS',
    });
    expect(r.ratioText).toBe('21.00:1');
  });

  test('boundary values map to the exact spec thresholds', () => {
    // 4.5 is the AA-normal / AAA-large floor; below it both fail.
    expect(getContrastRating(4.5)).toMatchObject({ aaNormal: 'PASS', aaaLarge: 'PASS', aaaNormal: 'FAIL' });
    expect(getContrastRating(4.49)).toMatchObject({ aaNormal: 'FAIL', aaaLarge: 'FAIL' });
    // 3.0 is the AA-large floor; 7.0 is the AAA-normal floor.
    expect(getContrastRating(3.0).aaLarge).toBe('PASS');
    expect(getContrastRating(2.99).aaLarge).toBe('FAIL');
    expect(getContrastRating(7.0).aaaNormal).toBe('PASS');
  });
});

describe('parseOklch ↔ stringifyOklch', () => {
  test('parses a canonical oklch() string', () => {
    expect(parseOklch('oklch(0.7 0.15 200)')).toEqual({ l: 0.7, c: 0.15, h: 200, valid: true });
  });

  test('accepts a percentage lightness', () => {
    const p = parseOklch('oklch(70% 0.15 200)');
    expect(p.valid).toBe(true);
    expect(p.l).toBeCloseTo(0.7, 5);
  });

  test('non-oklch input returns the documented fallback with valid:false', () => {
    const p = parseOklch('#ff0000');
    expect(p.valid).toBe(false);
    expect(p).toMatchObject({ l: 0.5, c: 0.15, h: 200 });
  });

  test('stringify → parse round-trips the components', () => {
    const s = stringifyOklch(0.732, 0.123, 275);
    expect(s).toBe('oklch(0.732 0.123 275)');
    const p = parseOklch(s);
    expect(p.l).toBeCloseTo(0.732, 3);
    expect(p.c).toBeCloseTo(0.123, 3);
    expect(p.h).toBe(275);
  });
});
