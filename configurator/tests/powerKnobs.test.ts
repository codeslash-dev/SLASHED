/**
 * Contract tests for src/lib/powerKnobs.ts — the curated "power knob" scalars
 * (contrast bias, text/space/radius scales, shadow strength, motion scale…)
 * surfaced as high-leverage sliders.
 *
 * Why this matters: each knob's {min, default, max, step} is fed straight into
 * a range input, and some carry an encode/decode pair that rewrites the value
 * into a calc() expression on the way to CSS and back. A default outside its
 * own range, a zero/negative step, or a non-round-tripping codec would produce
 * a broken or un-resettable control. None of this was covered.
 */
import { describe, test, expect } from 'vitest';
import { KNOBS_BY_DOMAIN } from '../src/lib/powerKnobs';

const ALL = Object.values(KNOBS_BY_DOMAIN).flat();

describe('KNOBS_BY_DOMAIN structure', () => {
  test('is non-empty and every knob targets a distinct --sf-* token', () => {
    expect(ALL.length).toBeGreaterThan(0);
    const names = ALL.map((k) => k.name);
    for (const n of names) expect(n).toMatch(/^--sf-[a-z0-9-]+$/);
    expect(new Set(names).size).toBe(names.length);
  });

  test('every knob has a human label and help text', () => {
    for (const k of ALL) {
      expect(k.label, k.name).toBeTruthy();
      expect(k.help, k.name).toBeTruthy();
    }
  });
});

describe('range invariants', () => {
  test.each(ALL.map((k) => [k.name, k] as const))('%s: min ≤ default ≤ max, step > 0', (_n, k) => {
    expect(k.min).toBeLessThanOrEqual(k.default);
    expect(k.default).toBeLessThanOrEqual(k.max);
    expect(k.max).toBeGreaterThan(k.min);
    expect(k.step).toBeGreaterThan(0);
    // The slider must be able to reach the default from min in whole steps
    // (float tolerance) — otherwise "reset to default" lands off-grid.
    const stepsFromMin = (k.default - k.min) / k.step;
    expect(Math.abs(stepsFromMin - Math.round(stepsFromMin))).toBeLessThan(1e-6);
  });
});

describe('encode/decode round-trip (knobs that carry a codec)', () => {
  const coded = ALL.filter((k) => typeof k.encode === 'function' && typeof k.decode === 'function');

  test('at least one knob exercises the codec path (shadow strength)', () => {
    expect(coded.some((k) => k.name === '--sf-shadow-strength')).toBe(true);
  });

  test.each(coded.map((k) => [k.name, k] as const))(
    '%s: decode(encode(v)) recovers v across the range',
    (_n, k) => {
      for (let v = k.min; v <= k.max + 1e-9; v += k.step) {
        const round = Math.round(v * 1000) / 1000;
        const encoded = k.encode!(round);
        expect(typeof encoded).toBe('string');
        expect(k.decode!(encoded)).toBeCloseTo(round, 5);
      }
    },
  );

  test('shadow decode returns NaN on an unparseable value (defensive fallback)', () => {
    const shadow = coded.find((k) => k.name === '--sf-shadow-strength')!;
    expect(Number.isNaN(shadow.decode!('not-a-calc'))).toBe(true);
  });
});
