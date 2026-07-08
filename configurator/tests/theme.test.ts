/**
 * Unit tests for src/lib/theme.svelte.ts — the Studio chrome light/dark store.
 *
 * Why this matters: this module is imported by 8 components and owns the
 * persisted studio theme + the `dark` class binding Tailwind's `dark:` variant
 * keys off. It had no unit coverage — a regression in persistence or the root
 * toggle would flip the whole studio's appearance. jsdom provides localStorage;
 * matchMedia is intentionally absent, so the module's typeof-guards are also
 * exercised here.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { themeState, setTheme, toggleTheme, forceTheme, bindThemeRoot } from '../src/lib/theme.svelte';

const STORAGE_KEY = 'slashed-studio-theme';

beforeEach(() => {
  localStorage.clear();
});

describe('setTheme', () => {
  test('updates the reactive state and persists the choice', () => {
    setTheme('dark');
    expect(themeState.value).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');

    setTheme('light');
    expect(themeState.value).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });
});

describe('toggleTheme', () => {
  test('flips between light and dark', () => {
    setTheme('light');
    toggleTheme();
    expect(themeState.value).toBe('dark');
    toggleTheme();
    expect(themeState.value).toBe('light');
  });
});

describe('bindThemeRoot', () => {
  test('applies/removes the `dark` class to reflect the current theme', () => {
    const el = document.createElement('div');
    setTheme('dark');
    bindThemeRoot(el);
    expect(el.classList.contains('dark')).toBe(true);

    setTheme('light');
    expect(el.classList.contains('dark')).toBe(false);

    setTheme('dark');
    expect(el.classList.contains('dark')).toBe(true);
  });
});

describe('forceTheme', () => {
  test('sets the in-memory theme WITHOUT persisting it', () => {
    localStorage.clear();
    forceTheme('dark');
    expect(themeState.value).toBe('dark');
    // The whole point of forceTheme: no storage write, so an embedding host can
    // pin appearance without clobbering the user's own saved preference.
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
