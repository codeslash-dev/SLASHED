/**
 * Tests for the inline SVG icon set that replaced the emoji domain icons.
 *
 * Two guarantees:
 *  1. every domain's `icon` key resolves to non-empty SVG markup in
 *     lib/icons.js (a typo'd or missing key would render a blank icon);
 *  2. no emoji glyph leaks back into domains.js (the dogfooded chrome uses the
 *     stroke set exclusively).
 * Plus a render smoke test that Icon.svelte emits an <svg> with paths.
 */
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Icon from '../src/components/Icon.svelte';
import { ICON_PATHS } from '../src/lib/icons.js';
import { DOMAINS } from '../src/lib/domains.js';

describe('icon set', () => {
  test('every domain icon key resolves to non-empty SVG markup', () => {
    for (const d of DOMAINS) {
      expect(typeof d.icon, `${d.id} icon is a key string`).toBe('string');
      const markup = ICON_PATHS[d.icon];
      expect(markup, `${d.id}: icon "${d.icon}" exists in ICON_PATHS`).toBeTruthy();
      expect(markup.trim().length, `${d.id}: icon markup is non-empty`).toBeGreaterThan(0);
    }
  });

  test('the Overview "home" icon is defined', () => {
    expect(ICON_PATHS.home, 'home icon exists').toBeTruthy();
  });

  test('no emoji glyphs remain on any domain icon', () => {
    // domains.js icons must be plain ASCII keys, never emoji.
    const emoji = /\p{Extended_Pictographic}/u;
    for (const d of DOMAINS) {
      expect(emoji.test(d.icon), `${d.id} icon "${d.icon}" is not emoji`).toBe(false);
    }
  });

  test('Icon.svelte renders an <svg> with path content for a known key', () => {
    const { container } = render(Icon, { props: { name: 'palette' } });
    const svg = container.querySelector('svg.icon');
    expect(svg, 'svg rendered').toBeTruthy();
    expect(svg.getAttribute('stroke'), 'inherits color via currentColor').toBe('currentColor');
    expect(svg.innerHTML.length, 'has inner path markup').toBeGreaterThan(0);
  });

  test('Icon.svelte renders empty (no crash) for an unknown key', () => {
    const { container } = render(Icon, { props: { name: 'does-not-exist' } });
    const svg = container.querySelector('svg.icon');
    expect(svg).toBeTruthy();
    expect(svg.innerHTML.trim()).toBe('');
  });
});
