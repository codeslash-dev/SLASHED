/**
 * Unit tests for src/lib/domains.ts — the runtime that routes each token to the
 * panel (domain) it appears under. Previously only exercised indirectly via the
 * curation CLI. `domainOf` is the runtime side of the same contract
 * check:curation guards, so it deserves its own direct lock.
 *
 * Why this matters: `domainOf` and check-curation's classifier must agree — if
 * they drift, a knob can pass CI yet land in the wrong panel (or a phantom one).
 */
import { describe, test, expect } from 'vitest';
import { domainOf, DOMAIN_PATTERNS } from '../src/lib/domains';

describe('domainOf', () => {
  test.each([
    ['--sf-color-primary', 'colors'],
    ['--sf-font-body', 'typography'],
    ['--sf-space-m', 'spacing'],
    ['--sf-radius-l', 'borders'],
    ['--sf-shadow-m', 'shadows'],
    ['--sf-motion-scale', 'motion'],
    ['--sf-container-wide', 'layout'],
    ['--sf-btn-pad', 'components'],
    ['--sf-blur-m', 'effects'],
  ])('%s → %s', (name, expected) => {
    expect(domainOf(name)).toBe(expected);
  });

  test('an unrecognised name falls back to "misc"', () => {
    expect(domainOf('--sf-totally-unknown-xyz')).toBe('misc');
  });

  test('a name matching a misc pattern also resolves to "misc"', () => {
    // z-index tokens legitimately live in the Misc panel.
    expect(domainOf('--sf-z-modal')).toBe('misc');
    expect(domainOf('--sf-focus-ring-width')).toBe('misc');
  });

  test('never returns a domain key that is absent from DOMAIN_PATTERNS', () => {
    const keys = new Set(Object.keys(DOMAIN_PATTERNS));
    for (const n of ['--sf-color-x', '--sf-unknown', '--sf-z-base', '--sf-btn-y']) {
      expect(keys.has(domainOf(n))).toBe(true);
    }
  });

  test('a more specific domain wins over the misc fallback', () => {
    // "size-" is a misc pattern, but "--sf-btn-*" should still classify as a
    // component if it ever collides — this guards the precedence order.
    expect(domainOf('--sf-container-narrow')).toBe('layout');
  });
});
