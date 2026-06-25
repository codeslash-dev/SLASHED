/**
 * Component smoke tests for the redesigned Studio editors.
 *
 * These are intentionally structural: jsdom cannot evaluate the framework's
 * relative-color CSS, but it can verify that each studio mounts, exposes its
 * primary preview surface, and renders the curated control rows users need.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import TypographyStudio from '../src/components/editors/TypographyStudio.svelte';
import ColorStudio from '../src/components/editors/ColorStudio.svelte';
import SpacingStudio from '../src/components/editors/SpacingStudio.svelte';
import LayoutStudio from '../src/components/editors/LayoutStudio.svelte';
import ShapeStudio from '../src/components/editors/ShapeStudio.svelte';
import ShadowStudio from '../src/components/editors/ShadowStudio.svelte';
import MotionStudio from '../src/components/editors/MotionStudio.svelte';
import EffectsStudio from '../src/components/editors/EffectsStudio.svelte';
import FriendlyControl from '../src/components/FriendlyControl.svelte';
import { tokenByName } from '../src/lib/model.js';
import { clearAll, overrides, ui } from '../src/lib/store.svelte.js';

beforeEach(() => {
  clearAll();
  ui.showTokens = false;
});

const STUDIOS = [
  ['Typography Studio', TypographyStudio, ['The quick brown fox', 'Fluid scale']],
  ['Color Studio', ColorStudio, ['Source pairs', 'Role map', 'Auto-derived pair', 'Contrast & palette tuning']],
  ['Spacing Studio', SpacingStudio, ['Space map', 'Stack rhythm', 'Input gap', 'Global scale']],
  ['Layout Studio', LayoutStudio, ['Container map', 'Responsive grid', 'Reading width', 'Sticky offset']],
  ['Shape Studio', ShapeStudio, ['Radius system', 'Focus ring', 'Focused action']],
  ['Shadow Studio', ShadowStudio, ['Elevation strength', 'Box shadows', 'Media card glow']],
  ['Motion Studio', MotionStudio, ['Speed scale', 'Easing curves', 'fast']],
  ['Effects Studio', EffectsStudio, ['Glass & blur', 'Opacity states', 'Readable media card']],
];

describe('visual studios', () => {
  for (const [name, Component, expectedText] of STUDIOS) {
    test(`${name} mounts with preview and curated controls`, () => {
      const { container, getByText, getAllByText } = render(Component);
      expect(container.querySelector('.studio')).toBeTruthy();
      expect(getByText(name)).toBeInTheDocument();
      for (const text of expectedText) {
        expect(getAllByText(text).length).toBeGreaterThan(0);
      }
    });
  }

  test('Typography Studio switches scopes and renders active panel controls', async () => {
    ui.showTokens = true;
    const { getByRole, getByText, getAllByText } = render(TypographyStudio);
    await fireEvent.click(getByRole('tab', { name: 'Headings' }));
    expect(getAllByText('Heading aliases, line-height, tracking and max-width constraints.').length).toBeGreaterThan(0);
    expect(getByText('--sf-h1-size')).toBeInTheDocument();
  });



  test('Studio token names follow the global show/hide token setting', async () => {
    const { queryByText, getByText } = render(TypographyStudio);

    expect(queryByText('--sf-font-body')).not.toBeInTheDocument();

    ui.showTokens = true;
    await tick();
    expect(getByText('--sf-font-body')).toBeInTheDocument();

    ui.showTokens = false;
    await tick();
    expect(queryByText('--sf-font-body')).not.toBeInTheDocument();
  });

  test('FriendlyControl can still reveal raw token info locally', async () => {
    const token = tokenByName.get('--sf-heading-text-wrap');
    const { getByRole, getByText, queryByText } = render(FriendlyControl, { props: { token } });

    expect(queryByText('--sf-heading-text-wrap')).not.toBeInTheDocument();
    await fireEvent.click(getByRole('button', { name: 'Show token' }));
    expect(getByText('--sf-heading-text-wrap')).toBeInTheDocument();
  });

  test('FriendlyControl renders schema select controls and writes overrides', async () => {
    const token = tokenByName.get('--sf-heading-text-wrap');
    const { getByLabelText } = render(FriendlyControl, { props: { token, showToken: true } });
    const select = getByLabelText('--sf-heading-text-wrap');

    expect(select.tagName).toBe('SELECT');
    await fireEvent.change(select, { target: { value: 'pretty' } });
    await tick();
    expect(overrides['--sf-heading-text-wrap']).toBe('pretty');
  });
});
