/**
 * Component tests for the brand shade ramp added to the Colors panel.
 *
 * The framework now derives many color outputs through registered/relative
 * tokens, so the ramp must refresh the shared preview/probe cascade before it
 * measures swatches. jsdom cannot resolve OKLCH/color-mix into rgb(), so these
 * tests assert the rendered structure and the probe-host declarations instead
 * of requiring browser color serialization.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import ShadeRamp from '../src/components/ShadeRamp.svelte';
import { setOverride, clearAll, ui } from '../src/lib/store.svelte.js';

beforeEach(() => {
  clearAll();
  ui.previewTheme = 'light';
});

describe('ShadeRamp', () => {
  test('renders the six brand rows with seven swatches each', () => {
    const { container } = render(ShadeRamp);

    expect(container.querySelectorAll('.sr__row').length).toBe(6);
    expect(container.querySelectorAll('.sr__swatch').length).toBe(42);
    expect(container.textContent).toContain('Base');
    expect(container.textContent).toContain('Action');
  });

  test('refreshes the probe cascade from live overrides and preview theme', async () => {
    setOverride('--sf-color-primary-light', 'oklch(0.65 0.2 40)');
    ui.previewTheme = 'dark';

    const { container } = render(ShadeRamp);

    await waitFor(() => {
      const hostStyle = document.getElementById('cfg-contrast-host')?.getAttribute('style') ?? '';
      expect(hostStyle).toContain('color-scheme: dark');
      expect(hostStyle).toContain('--sf-is-dark: 1');
      expect(hostStyle).toContain('--sf-color-primary-light: oklch(0.65 0.2 40)');
      expect(container.textContent).toContain('dark');
    });
  });
});
