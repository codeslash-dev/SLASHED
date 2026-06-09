import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

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
 */
export default defineConfig({
  base: './',
  plugins: [svelte()],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    port: 5180,
  },
});
