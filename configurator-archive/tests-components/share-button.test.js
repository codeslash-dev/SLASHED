/**
 * Component test for the header Share-link affordance (Workstream 2).
 *
 * Verifies the button is gated on having something to share, and that a
 * successful copy writes a URL whose fragment round-trips back to the active
 * overrides.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import Header from '../src/components/Header.svelte';
import { setOverride, clearAll } from '../src/lib/store.svelte.js';
import { readShareFromHash } from '../src/lib/share.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const realToken = data.tokens.find((t) => t.role === 'knob')?.name ?? data.tokens[0].name;

beforeEach(() => {
  clearAll();
});

describe('Share link button', () => {
  test('is disabled until there is a customised token', async () => {
    const { getByLabelText } = render(Header);
    const btn = getByLabelText('Copy shareable configuration link');
    expect(btn).toBeDisabled();

    setOverride(realToken, '2rem');
    await tick();
    expect(btn).toBeEnabled();
  });

  test('copies a URL whose fragment restores the current config', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    navigator.clipboard.writeText = writeText;

    setOverride(realToken, '2rem');
    const { getByLabelText } = render(Header);
    const btn = getByLabelText('Copy shareable configuration link');

    await fireEvent.click(btn);
    expect(writeText).toHaveBeenCalledOnce();

    const copied = writeText.mock.calls[0][0];
    const hash = new URL(copied).hash;
    expect(readShareFromHash(hash)).toEqual({ [realToken]: '2rem' });
  });
});
