/**
 * Basic data-integrity smoke tests.
 * Verify that the generated data files are present and well-formed.
 */
import { describe, test, expect } from 'vitest';
import apiIndex from '../src/data/api-index.generated.json';
import tokenRegistry from '../src/data/token-registry.generated.json';
import bundles from '../src/data/bundles.generated.json';

describe('api-index.generated.json', () => {
  test('has a non-empty tokens array', () => {
    expect(Array.isArray(apiIndex.tokens)).toBe(true);
    expect(apiIndex.tokens.length).toBeGreaterThan(100);
  });

  test('every token has a name, tier, and role', () => {
    for (const t of apiIndex.tokens) {
      expect(typeof t.name).toBe('string');
      expect(t.name.startsWith('--sf-')).toBe(true);
      expect(t.tier).toBeTruthy();
      expect(t.role).toBeTruthy();
    }
  });

  test('token names are unique', () => {
    const names = apiIndex.tokens.map(t => t.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('token-registry.generated.json', () => {
  test('has a non-empty tokens array', () => {
    expect(Array.isArray(tokenRegistry.tokens)).toBe(true);
    expect(tokenRegistry.tokens.length).toBeGreaterThan(100);
  });

  test('every entry has a numeric id and a name', () => {
    for (const t of tokenRegistry.tokens) {
      expect(typeof t.id).toBe('number');
      expect(Number.isInteger(t.id)).toBe(true);
      expect(t.id).toBeGreaterThanOrEqual(0);
      expect(typeof t.name).toBe('string');
    }
  });

  test('ids are unique', () => {
    const ids = tokenRegistry.tokens.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('bundles.generated.json', () => {
  test('has a non-empty bundles array', () => {
    expect(Array.isArray(bundles.bundles)).toBe(true);
    expect(bundles.bundles.length).toBeGreaterThan(0);
  });
});
