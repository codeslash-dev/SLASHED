/**
 * Tests for previewResolver.svelte.ts — resolves real, browser-computed
 * colors from the live preview iframe, with a per-version cache cleared on
 * every bumpPreviewVersion() call (see PreviewPanel.svelte's SL-020
 * rAF-coalesced effects, which are the production callers of that clear).
 *
 * Uses a real <iframe> rather than document.implementation.createHTMLDocument():
 * jsdom's getComputedStyle only resolves colors on documents that have a
 * defaultView, which a detached document lacks but an iframe's contentDocument
 * has — matching how PreviewPanel.svelte registers a real iframe in production.
 *
 * jsdom doesn't implement CSS custom-property substitution or color functions
 * (var()/oklch()/color-mix()), so fixtures use plain, jsdom-resolvable values
 * (keyword/hex colors) — these tests exercise the resolver's caching/
 * invalidation/theme-scoping logic, not real CSS cascade computation (the
 * browser's job, already trusted).
 */
import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  previewVersion,
  registerPreviewDoc,
  getActiveTheme,
  bumpPreviewVersion,
  resolveColor,
  resolveColorForTheme,
  resolveRgb,
  resolveBackground,
} from '../src/lib/previewResolver.svelte';

// Tracks every <iframe> created by makePreviewDoc() so afterEach can remove
// them — registerPreviewDoc() only tears down the resolver's own internal
// probe elements, not the fixtures this file appends to document.body.
let createdIframes = [];

function makePreviewDoc(theme = 'light') {
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  createdIframes.push(iframe);
  const doc = iframe.contentDocument;
  doc.documentElement.setAttribute('data-theme', theme);
  return doc;
}

afterEach(() => {
  registerPreviewDoc(null);
  createdIframes.forEach((iframe) => iframe.remove());
  createdIframes = [];
});

describe('registerPreviewDoc / getActiveTheme', () => {
  test('bumps previewVersion when registering a new document', () => {
    const before = previewVersion.value;
    registerPreviewDoc(makePreviewDoc());
    expect(previewVersion.value).toBeGreaterThan(before);
  });

  test('bumps previewVersion again when re-registering the same document', () => {
    const doc = makePreviewDoc();
    registerPreviewDoc(doc);
    const before = previewVersion.value;
    registerPreviewDoc(doc);
    expect(previewVersion.value).toBeGreaterThan(before);
  });

  test('getActiveTheme reflects the registered document\'s data-theme attribute', () => {
    registerPreviewDoc(makePreviewDoc('dark'));
    expect(getActiveTheme()).toBe('dark');
    registerPreviewDoc(makePreviewDoc('light'));
    expect(getActiveTheme()).toBe('light');
  });

  test('getActiveTheme defaults to light when data-theme is absent', () => {
    const doc = makePreviewDoc();
    doc.documentElement.removeAttribute('data-theme');
    registerPreviewDoc(doc);
    expect(getActiveTheme()).toBe('light');
  });
});

describe('resolveColor', () => {
  test('returns "" when no preview document is registered', () => {
    registerPreviewDoc(null);
    expect(resolveColor('red')).toBe('');
  });

  test('resolves a CSS color as painted by the preview document', () => {
    registerPreviewDoc(makePreviewDoc());
    expect(resolveColor('red')).toBe('rgb(255, 0, 0)');
  });

  test('caches resolved values — a repeated call does not recompute getComputedStyle', () => {
    const doc = makePreviewDoc();
    registerPreviewDoc(doc);
    const spy = vi.spyOn(doc.defaultView, 'getComputedStyle');
    const first = resolveColor('#00ff00');
    const callsAfterFirst = spy.mock.calls.length;
    const second = resolveColor('#00ff00');
    expect(second).toBe(first);
    expect(spy.mock.calls.length).toBe(callsAfterFirst);
    spy.mockRestore();
  });

  // Closes the loop on SL-020: PreviewPanel.svelte's rAF-coalesced effects
  // rely on bumpPreviewVersion() reliably invalidating the cache every time
  // it runs, however rarely (once per frame) it now gets called.
  test('bumpPreviewVersion() invalidates the cache — a cached expression is recomputed after bumping', () => {
    const doc = makePreviewDoc();
    registerPreviewDoc(doc);
    const spy = vi.spyOn(doc.defaultView, 'getComputedStyle');
    resolveColor('blue');
    const callsBeforeBump = spy.mock.calls.length;
    bumpPreviewVersion();
    resolveColor('blue');
    expect(spy.mock.calls.length).toBeGreaterThan(callsBeforeBump);
    spy.mockRestore();
  });

  test('bumpPreviewVersion can be called repeatedly without throwing (pure counter, no reactive loop)', () => {
    registerPreviewDoc(makePreviewDoc());
    const before = previewVersion.value;
    expect(() => {
      for (let i = 0; i < 50; i++) bumpPreviewVersion();
    }).not.toThrow();
    expect(previewVersion.value).toBe(before + 50);
  });
});

describe('resolveColorForTheme', () => {
  test('resolves via an independent probe per theme, scoped under a [data-theme] wrapper', () => {
    registerPreviewDoc(makePreviewDoc());
    expect(resolveColorForTheme('red', 'light')).toBe('rgb(255, 0, 0)');
    expect(resolveColorForTheme('blue', 'dark')).toBe('rgb(0, 0, 255)');
  });

  test('returns "" when no preview document is registered', () => {
    registerPreviewDoc(null);
    expect(resolveColorForTheme('red', 'light')).toBe('');
  });

  test('caches per theme+expression key independently of resolveColor\'s cache', () => {
    const doc = makePreviewDoc();
    registerPreviewDoc(doc);
    const spy = vi.spyOn(doc.defaultView, 'getComputedStyle');
    resolveColorForTheme('green', 'dark');
    const callsAfterFirst = spy.mock.calls.length;
    resolveColorForTheme('green', 'dark');
    expect(spy.mock.calls.length).toBe(callsAfterFirst);
    // A different theme with the same expression is a different cache key —
    // expect at least one more getComputedStyle call, not a cache hit.
    resolveColorForTheme('green', 'light');
    expect(spy.mock.calls.length).toBeGreaterThan(callsAfterFirst);
    spy.mockRestore();
  });
});

describe('resolveRgb', () => {
  test('returns null when no preview document is registered', () => {
    registerPreviewDoc(null);
    expect(resolveRgb('red')).toBeNull();
  });

  // Explicitly stubbing getContext('2d') to return null (rather than relying
  // on this sandbox's jsdom having no `canvas` npm package installed) so this
  // test asserts resolveRgb's documented contract, not an environment detail
  // that would silently start failing if a canvas backend became available.
  //
  // Spies on the preview *iframe's own* HTMLCanvasElement, not the top-level
  // test file's global one — each iframe is a separate jsdom realm with its
  // own constructors, so a canvas created via activeDoc.createElement('canvas')
  // is an instance of doc.defaultView.HTMLCanvasElement, not window.HTMLCanvasElement.
  test('degrades to null (not a throw) when no 2D canvas context is available', () => {
    const doc = makePreviewDoc();
    registerPreviewDoc(doc);
    const spy = vi.spyOn(doc.defaultView.HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(() => resolveRgb('red')).not.toThrow();
    expect(resolveRgb('red')).toBeNull();
    spy.mockRestore();
  });

  test('converts a resolved color to an [r,g,b] triple when a 2D context is available', () => {
    const doc = makePreviewDoc();
    registerPreviewDoc(doc);
    const fakeCtx = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: '',
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray([255, 0, 0, 255]) })),
    };
    const spy = vi.spyOn(doc.defaultView.HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fakeCtx);
    expect(resolveRgb('red')).toEqual([255, 0, 0]);
    spy.mockRestore();
  });
});

describe('resolveBackground', () => {
  test('returns "" when no preview document is registered', () => {
    registerPreviewDoc(null);
    expect(resolveBackground('linear-gradient(red, blue)')).toBe('');
  });

  test('returns the resolved background-image as painted by the preview', () => {
    registerPreviewDoc(makePreviewDoc());
    expect(resolveBackground('linear-gradient(red, blue)')).toContain('gradient');
  });
});
