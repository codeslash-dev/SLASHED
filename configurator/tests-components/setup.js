/**
 * Shared setup for component tests.
 *
 * Adds jest-dom matchers and polyfills the browser APIs jsdom omits but the
 * store/components touch during initialisation (matchMedia for viewport-aware
 * defaults; a no-op clipboard so copy affordances don't throw when unstubbed).
 */
import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof navigator !== 'undefined' && !navigator.clipboard) {
  // Writable so individual tests can spy on / override writeText.
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: async () => {} },
    configurable: true,
    writable: true,
  });
}
