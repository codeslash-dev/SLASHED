import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Mirror vite.config.js so components compile and resolve identically under test
// (notably the build-time __SLASHED_VERSION__ define that model.js reads).
const pkg = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')
);

/**
 * Vitest config for component tests (jsdom + @testing-library/svelte).
 *
 * These complement — they do not replace — the runes-free logic tests under
 * `tests/` (run with `node --test`). Component specs live in `tests-components/`
 * so the two runners never pick up each other's files.
 */
export default defineConfig({
  plugins: [
    svelte({
      // The project forces `runes: true` globally (svelte.config.js), but
      // @testing-library/svelte's wrapper component is legacy (`export let`).
      // Auto-detect runes for node_modules deps so that wrapper still compiles,
      // while app code keeps the explicit runes mode.
      dynamicCompileOptions({ filename }) {
        if (filename.includes('node_modules')) return { runes: undefined };
      },
    }),
  ],
  define: {
    __SLASHED_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    // Compile Svelte for the browser/client so component code (not SSR) runs.
    conditions: ['browser'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests-components/**/*.test.js'],
    setupFiles: ['./tests-components/setup.js'],
  },
});
