/**
 * Component smoke test for StudioHeader.
 * Verifies that the header renders the branding text and responds to props.
 */
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StudioHeader from '../src/components/shell/StudioHeader.svelte';

const baseProps = {
  overridesCount: 0,
  canUndo: false,
  canRedo: false,
  onUndo: () => {},
  onRedo: () => {},
  onResetAll: () => {},
  onImport: () => {},
  onExport: () => {},
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
});
