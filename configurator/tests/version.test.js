/**
 * Asserts that the version injected into the configurator build matches the
 * root package.json version, and that StudioHeader renders it correctly.
 *
 * vitest.config.js injects __SLASHED_VERSION__ from the root package.json
 * (same define as vite.config.js). This test proves that injection works and
 * that the component's version pill reads from the right global.
 *
 * The WP plugin re-wires __SLASHED_VERSION__ to window.__SLASHED_FW_VERSION__,
 * so any rename of this global in the vendored source would silently blank the
 * pill in both contexts.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/svelte';
import StudioHeader from '../src/components/shell/StudioHeader.svelte';

const rootPkg = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../package.json'), 'utf8')
);

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

describe('version pill', () => {
  test('__SLASHED_VERSION__ is injected and equals root package.json version', () => {
    // vitest.config.js injects this from the root package.json via `define`.
    // Failing here means the injection is broken or the config has drifted.
    expect(typeof __SLASHED_VERSION__).toBe('string');
    expect(__SLASHED_VERSION__).toBe(rootPkg.version);
  });

  test('StudioHeader renders v{version} in the header', () => {
    render(StudioHeader, { props: baseProps });
    expect(screen.getByText(`v${rootPkg.version}`)).toBeTruthy();
  });
});
