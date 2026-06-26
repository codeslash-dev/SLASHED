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
import studioFrameSource from '../src/components/editors/StudioFrame.svelte?raw';
import { tokenByName } from '../src/lib/model.js';
import { clearAll, overrides, ui } from '../src/lib/store.svelte.js';

beforeEach(() => {
  clearAll();
  ui.showTokens = false;
});

const STUDIOS = [
  ['Typography Studio', TypographyStudio, ['The quick brown fox', 'Headings', 'Text', 'Fonts', 'Scale', 'Advanced']],
  ['Color Studio', ColorStudio, ['Main colors', 'Semantic colors', 'Gradients', 'Shade curve', 'Contrast', 'Primary']],
  ['Spacing Studio', SpacingStudio, ['Space map', 'Stack rhythm', 'Input gap', 'Global scale']],
  ['Layout Studio', LayoutStudio, ['Container map', 'Responsive grid', 'Reading width', 'Sticky offset']],
  ['Shape Studio', ShapeStudio, ['Radius system', 'Focus ring', 'Focused action']],
  ['Shadow Studio', ShadowStudio, ['Elevation', 'Text & media', 'Media card glow']],
  ['Motion Studio', MotionStudio, ['Durations', 'Easing', 'fast']],
  ['Effects Studio', EffectsStudio, ['Glass', 'Opacity', 'Readable media card']],
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
    }, 10000);
  }


  test('Studio frame keeps the main container from clipping control panels', () => {
    const { container } = render(ColorStudio);
    const studio = container.querySelector('.studio');
    const colorDetails = container.querySelector('.color-item');
    const { container: controlsContainer } = render(EffectsStudio);
    const controlPanel = controlsContainer.querySelector('.control-section');

    expect(studio).toBeTruthy();
    expect(studioFrameSource).toMatch(/\.studio\s*\{[^}]*overflow:\s*visible;/s);
    expect(studioFrameSource).not.toMatch(/\.studio\s*\{[^}]*overflow:\s*(hidden|clip);/s);
    expect(['hidden', 'clip']).not.toContain(getComputedStyle(controlPanel).overflow);
    expect(['hidden', 'clip']).not.toContain(getComputedStyle(colorDetails).overflow);
  });

  test('Typography Studio switches scopes and renders active panel controls', async () => {
    ui.showTokens = true;
    const { getByRole, getByText, getAllByText } = render(TypographyStudio);
    await fireEvent.click(getByRole('tab', { name: 'Headings' }));
    expect(getAllByText('Framework-style controls for h1–h6 aliases, rhythm, tracking and wrapping.').length).toBeGreaterThan(0);
    expect(getByText('--sf-h1-size')).toBeInTheDocument();
  });



  test('Studio token names follow the global show/hide token setting', async () => {
    const { queryByText, getByText } = render(TypographyStudio);

    expect(queryByText('--sf-heading-font-family')).not.toBeInTheDocument();

    ui.showTokens = true;
    await tick();
    expect(getByText('--sf-heading-font-family')).toBeInTheDocument();

    ui.showTokens = false;
    await tick();
    expect(queryByText('--sf-heading-font-family')).not.toBeInTheDocument();
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
