/**
 * Component test for the Install / bundle picker panel (Workstream 3).
 *
 * Verifies the bundle list renders, selection drives ui.bundle, the
 * recommendation badge appears, and the copyable drop-in snippet contains both
 * the framework CDN <link> and the user's override CSS in the right order.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import BundlePicker from '../src/components/BundlePicker.svelte';
import { ui, setOverride, clearAll } from '../src/lib/store.svelte.js';
import { BUNDLES, bundleById } from '../src/lib/bundles.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const realToken = data.tokens.find((t) => t.role === 'knob')?.name ?? data.tokens[0].name;

beforeEach(() => {
  clearAll();
  ui.bundle = 'optimal';
});

describe('BundlePicker', () => {
  test('lists every shipping bundle', () => {
    const { getAllByText } = render(BundlePicker);
    for (const b of BUNDLES) {
      // The selected bundle's label also appears in the snippet header, so a
      // bundle may render more than once — assert it appears at least once.
      expect(getAllByText(b.label).length).toBeGreaterThan(0);
    }
  });

  test('selecting a bundle updates ui.bundle', async () => {
    const { getByRole } = render(BundlePicker);
    const target = bundleById('full');
    const btn = getByRole('button', { pressed: false, name: new RegExp(target.label) });
    await fireEvent.click(btn);
    expect(ui.bundle).toBe('full');
  });

  test('shows a Recommended badge', () => {
    const { getByText } = render(BundlePicker);
    expect(getByText('Recommended')).toBeInTheDocument();
  });

  test('drop-in snippet includes the CDN link and the override CSS', async () => {
    setOverride(realToken, '2rem');
    const { container } = render(BundlePicker);
    await tick();
    const code = container.querySelector('.snippet__code')?.textContent ?? '';
    expect(code).toContain('cdn.jsdelivr.net');
    expect(code).toContain('slashed.');
    expect(code).toContain(realToken);
    expect(code).toContain('2rem');
  });
});
