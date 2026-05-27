import { describe, it, expect } from 'vitest';
import { slugify, slugifyOrThrow } from '../slugify.js';
import { readPolicy, defaultPolicy } from '../policy.js';

describe('slugify (default ASCII policy)', () => {
  const policy = defaultPolicy();

  it('lowercases and kebab-cases ASCII input', () => {
    expect(slugify('Card Title 1', policy)).toBe('card-title-1');
  });

  it('strips diacritics via NFKD normalization', () => {
    expect(slugify('Über Schön', policy)).toBe('uber-schon');
    expect(slugify('café-au-lait', policy)).toBe('cafe-au-lait');
  });

  it('drops non-decomposable non-ASCII characters', () => {
    // ß has no NFKD decomposition; it gets dropped, not transliterated.
    expect(slugify('Straße', policy)).toBe('strae');
  });

  it('collapses runs of separators and trims edges', () => {
    expect(slugify('  ---hello---world---  ', policy)).toBe('hello-world');
    expect(slugify('a   b___c', policy)).toBe('a-b-c');
  });

  it('returns "" for empty / whitespace-only / separator-only input', () => {
    expect(slugify('', policy)).toBe('');
    expect(slugify('   ', policy)).toBe('');
    expect(slugify('***', policy)).toBe('');
  });

  it('handles null / undefined defensively', () => {
    expect(slugify(null, policy)).toBe('');
    expect(slugify(undefined, policy)).toBe('');
  });
});

describe('slugify (Unicode policy)', () => {
  const policy = readPolicy({ allowUnicode: true });

  it('preserves non-ASCII letters', () => {
    expect(slugify('Über Schön', policy)).toBe('über-schön');
    expect(slugify('日本語', policy)).toBe('日本語');
  });
});

describe('slugifyOrThrow', () => {
  it('throws on empty result', () => {
    expect(() => slugifyOrThrow('***')).toThrow(/slugify_empty/);
  });
  it('returns slug otherwise', () => {
    expect(slugifyOrThrow('Hello World')).toBe('hello-world');
  });
});
