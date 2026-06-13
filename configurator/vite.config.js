import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Read the framework's package.json for the version stamp. Using the file
// directly (rather than package.json imports) keeps this compatible with both
// ESM and CJS Vite configs, and avoids assert{type:'json'} compat issues.
const pkg = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')
);

/**
 * Build config for the standalone SLASHED configurator.
 *
 * This is a fully self-contained static SPA — no backend, no runtime
 * dependency on SLASHED itself. The token catalogue is baked in at build
 * time from src/data/api-index.generated.json (produced by
 * scripts/sync-api.mjs from the framework's docs/api-index.json).
 *
 * `base: './'` keeps every asset reference relative so the built site in
 * dist/ can be hosted from any sub-path (GitHub Pages project site, a CDN
 * folder, file://, etc.) without reconfiguration.
 *
 * `__SLASHED_VERSION__` is injected at build time from the root package.json
 * so the version pill in the header is always exactly the version that was
 * built — no separate sync step needed, no off-by-one after releases.
 */
export default defineConfig({
  base: './',
  plugins: [svelte()],
  define: {
    __SLASHED_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    port: 5180,
  },
});
