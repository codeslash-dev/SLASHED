import { describe, it, expect } from 'vitest';
import { defaultPolicy, readPolicy } from '../policy.js';

describe('defaultPolicy', () => {
  it('returns a frozen object with all required keys', () => {
    const p = defaultPolicy();
    expect(Object.isFrozen(p)).toBe(true);
    for (const key of [
      'flavor', 'allowUnicode', 'maxDepth',
      'reservedPrefixes', 'reservedExact',
      'blockNameRe', 'elementNameRe', 'modifierNameRe',
    ]) {
      expect(p).toHaveProperty(key);
    }
  });

  it('uses two-dash flavor and depth 6 by default', () => {
    const p = defaultPolicy();
    expect(p.flavor).toBe('two-dash');
    expect(p.maxDepth).toBe(6);
    expect(p.allowUnicode).toBe(false);
    expect(p.reservedPrefixes).toContain('sf-');
    expect(p.reservedPrefixes).toContain('is-');
  });
});

describe('readPolicy', () => {
  it('returns defaults when source is null/undefined', () => {
    expect(readPolicy(null).flavor).toBe('two-dash');
    expect(readPolicy(undefined).maxDepth).toBe(6);
  });

  it('merges partial overrides onto defaults', () => {
    const p = readPolicy({ flavor: 'single-dash', maxDepth: 3 });
    expect(p.flavor).toBe('single-dash');
    expect(p.maxDepth).toBe(3);
    expect(p.allowUnicode).toBe(false); // default preserved
  });

  it('coerces unknown flavor back to default', () => {
    expect(readPolicy({ flavor: 'triple-dash' }).flavor).toBe('two-dash');
  });

  it('rejects malformed reservedPrefixes (non-array → default)', () => {
    const p = readPolicy({ reservedPrefixes: 'sf-' });
    expect(p.reservedPrefixes).toEqual(['sf-', 'is-']);
  });

  it('switches to Unicode regex defaults when allowUnicode flips on', () => {
    const p = readPolicy({ allowUnicode: true });
    expect(p.blockNameRe).toMatch(/\\p\{Ll\}/);
  });

  it('falls back to default regex when override is invalid', () => {
    const p = readPolicy({ blockNameRe: '[unclosed' });
    expect(p.blockNameRe).toBe(defaultPolicy().blockNameRe);
  });
});
