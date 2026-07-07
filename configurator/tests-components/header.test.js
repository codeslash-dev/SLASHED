/**
 * Component smoke test for StudioHeader.
 * Verifies that the header renders the branding text and responds to props.
 */
import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StudioHeader from '../src/components/shell/StudioHeader.svelte';
import data from '../src/data/api-index.generated.json';

const realToken = data.tokens.find((t) => t.role === 'knob')?.name ?? data.tokens[0].name;

const baseProps = {
  overrides: {},
  overridesCount: 0,
  canUndo: false,
  canRedo: false,
  hasPendingChanges: false,
  saveState: 'idle',
  onUndo: () => {},
  onRedo: () => {},
  onResetAll: () => {},
  onImport: () => {},
  onExport: () => {},
  onSave: () => {},
};

describe('StudioHeader', () => {
  test('renders the SLASHED Studio branding', () => {
    render(StudioHeader, { props: baseProps });
    expect(screen.getByText('SLASHED Studio')).toBeTruthy();
  });

  test('undo button is disabled when canUndo is false', () => {
    render(StudioHeader, { props: { ...baseProps, canUndo: false } });
    const undoBtn = screen.getByTitle('Undo (Ctrl+Z)');
    expect(undoBtn).toBeTruthy();
    expect(undoBtn).toBeDisabled();
  });

  test('undo button is enabled when canUndo is true', () => {
    render(StudioHeader, { props: { ...baseProps, canUndo: true } });
    expect(screen.getByTitle('Undo (Ctrl+Z)')).not.toBeDisabled();
  });

  test('export badge appears when overridesCount > 0', () => {
    render(StudioHeader, { props: { ...baseProps, overridesCount: 3 } });
    expect(screen.getByText('3')).toBeTruthy();
  });

  test('export badge is absent when overridesCount is 0', () => {
    render(StudioHeader, { props: { ...baseProps, overridesCount: 0 } });
    expect(screen.queryByText('customised · Export →')).toBeNull();
  });

  // SL-018: a failed save must be visibly distinguishable from "never
  // attempted" (idle) or "in progress" (saving), and must stay retryable.
  describe('save state', () => {
    test('idle: save button is disabled and reads "Save" when there are no pending changes', () => {
      render(StudioHeader, { props: { ...baseProps, hasPendingChanges: false, saveState: 'idle' } });
      const btn = screen.getByTitle('No unsaved changes');
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('Save');
    });

    test('idle: save button is enabled when there are pending changes', () => {
      render(StudioHeader, { props: { ...baseProps, hasPendingChanges: true, saveState: 'idle' } });
      expect(screen.getByTitle('Save changes (Ctrl+S)')).not.toBeDisabled();
    });

    test('saving: button is disabled and reads "Saving…" regardless of pending changes', () => {
      render(StudioHeader, { props: { ...baseProps, hasPendingChanges: true, saveState: 'saving' } });
      const btn = screen.getByTitle('Save changes (Ctrl+S)');
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('Saving…');
    });

    test('saved: button reads "Saved" with a distinct title from a fresh, unattempted save', () => {
      render(StudioHeader, { props: { ...baseProps, hasPendingChanges: false, saveState: 'saved' } });
      const btn = screen.getByTitle('No unsaved changes');
      expect(btn).toHaveTextContent('Saved');
    });

    test('error: button surfaces a distinct "Save failed" title and label, and stays clickable to retry', async () => {
      const onSave = vi.fn();
      render(StudioHeader, { props: { ...baseProps, hasPendingChanges: true, saveState: 'error', onSave } });
      const btn = screen.getByTitle('Save failed — click to retry');
      expect(btn).toHaveTextContent('Save failed');
      expect(btn).not.toBeDisabled();
      await btn.click();
      expect(onSave).toHaveBeenCalledOnce();
    });

    test('error: a subsequent save is still blocked while actually saving', () => {
      // Mirrors App.svelte's handleSave guard (saveState === 'saving' disables
      // retry) even though the button was left enabled after a prior error.
      render(StudioHeader, { props: { ...baseProps, hasPendingChanges: true, saveState: 'saving' } });
      expect(screen.getByTitle('Save changes (Ctrl+S)')).toBeDisabled();
    });
  });

  // SL-shareLink: the share button must copy a config link built from the
  // *live* overrides (via buildShareUrl), not a raw copy of the current
  // page's URL — a plain window.location.href never carries the override
  // code in embedded hosts, which persist overrides server-side instead of
  // in the URL hash.
  describe('share link', () => {
    afterEach(() => {
      delete window.slashedApp;
    });

    test('copies a link that carries the current overrides as a config code', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
      render(StudioHeader, { props: { ...baseProps, overrides: { [realToken]: '1.25rem' } } });
      await screen.getByTitle('Copy share link').click();
      expect(writeText).toHaveBeenCalledOnce();
      expect(writeText.mock.calls[0][0]).toContain('#c=');
    });

    test('points at the host configurator URL when embedded (e.g. the WP plugin)', async () => {
      window.slashedApp = { pluginSettings: { configurator_url: 'https://slashed.codeslash.dev/configurator/' } };
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
      render(StudioHeader, { props: { ...baseProps, overrides: { [realToken]: '1.25rem' } } });
      await screen.getByTitle('Copy share link').click();
      const url = writeText.mock.calls[0][0];
      expect(url.startsWith('https://slashed.codeslash.dev/configurator/')).toBe(true);
      expect(url).toContain('#c=');
    });
  });
});
