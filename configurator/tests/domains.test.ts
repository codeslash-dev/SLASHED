/**
 * Unit tests for src/lib/domains.ts — the runtime that routes each token to the
 * panel (domain) it appears under. This is the single classifier shared by the
 * sidebar badge, the category Reset, the command palette, Home counts and the
 * All-tokens list, so if it drifts a knob can land in the wrong panel (or a
 * phantom one). It is now metadata-driven (framework `namespace`), sharing
 * src/data/domain-map.json with the build-time curation guard.
 */
import { describe, test, expect } from 'vitest';
import {
  domainOf, classifyKnown, inferNamespace, DOMAINS, FALLBACK_DOMAIN,
} from '../src/lib/domains';
import apiIndex from '../src/data/api-index.generated.json';
import type { ApiIndex } from '../src/types';

describe('domainOf', () => {
  test.each([
    ['--sf-color-primary', 'colors'],
    ['--sf-font-body', 'typography'],
    ['--sf-space-m', 'spacing'],
    ['--sf-radius-l', 'borders'],
    ['--sf-shadow-m', 'shadows'],
    ['--sf-motion-scale', 'motion'],
    ['--sf-container-wide', 'layout'],
    ['--sf-btn-padding-block', 'components'],
    ['--sf-blur-m', 'effects'],
    // Namespace-driven fixes for the old substring collisions:
    ['--sf-drop-shadow-m', 'effects'],   // was "shadows" via the "shadow" fragment
    ['--sf-focus-ring-color', 'misc'],   // was "colors" via the "color" fragment
    ['--sf-transition-fast', 'motion'],  // was "misc" (no pattern)
    ['--sf-box-padding', 'layout'],      // was "misc"
  ])('%s → %s', (name, expected) => {
    expect(domainOf(name)).toBe(expected);
  });

  test('an unrecognised name falls back to "misc"', () => {
    expect(domainOf('--sf-totally-unknown-xyz')).toBe(FALLBACK_DOMAIN);
  });

  test('misc-namespace tokens resolve to "misc" explicitly (not via fallback)', () => {
    expect(domainOf('--sf-z-modal')).toBe('misc');
    expect(domainOf('--sf-focus-ring-width')).toBe('misc');
    expect(classifyKnown('--sf-z-modal')).toBe('misc');
  });

  test('per-token exceptions override their namespace default', () => {
    // `content` defaults to spacing, but these two are genuinely elsewhere.
    expect(domainOf('--sf-content-gap')).toBe('spacing');
    expect(domainOf('--sf-content-width')).toBe('layout');
    expect(domainOf('--sf-content-intrinsic-size')).toBe('macros');
    // `scroll` defaults to motion.
    expect(domainOf('--sf-scroll-timeline-range-start')).toBe('motion');
    expect(domainOf('--sf-scroll-shadow-size')).toBe('macros');
  });

  test('never returns a domain key that is absent from DOMAINS', () => {
    const keys = new Set<string>(DOMAINS);
    for (const n of ['--sf-color-x', '--sf-unknown', '--sf-z-base', '--sf-btn-y']) {
      expect(keys.has(domainOf(n))).toBe(true);
    }
  });

  test('classifyKnown returns null only for unknown namespaces', () => {
    expect(classifyKnown('--sf-space-m')).toBe('spacing');
    expect(classifyKnown('--sf-totally-unknown-xyz')).toBeNull();
  });
});

describe('inferNamespace', () => {
  test('extracts the segment after --sf-', () => {
    expect(inferNamespace('--sf-focus-ring-color')).toBe('focus');
    expect(inferNamespace('--sf-text-display-scale')).toBe('text');
    expect(inferNamespace('--sf-h1-size')).toBe('h1');
  });
});

describe('real catalogue', () => {
  const tokens = ((apiIndex as ApiIndex).tokens ?? []);

  test('every shipping token classifies into a known domain (no fall-through)', () => {
    const orphans = tokens.filter((t) => classifyKnown(t.name) === null).map((t) => t.name);
    expect(orphans, `namespaces missing from domain-map.json: ${orphans.join(', ')}`).toEqual([]);
  });

  test('name inference agrees with the framework-authored namespace for every token', () => {
    for (const t of tokens) {
      if (t.namespace) expect(inferNamespace(t.name)).toBe(t.namespace);
    }
  });
});
