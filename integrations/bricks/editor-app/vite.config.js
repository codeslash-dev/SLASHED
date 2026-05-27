import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

/**
 * Build config for the reBEMer editor bundle.
 *
 * Output goes into the plugin's assets/editor-app/ directory with stable
 * filenames (no hashes), matching the admin-app convention. The PHP
 * enqueue side references app.js / app.css directly and uses filemtime()
 * for cache-busting.
 *
 * The bundle is fully self-contained: no externals, no CDN imports, no
 * dynamic chunks. The editor surface is small enough that code-splitting
 * would add operational complexity without measurable gain.
 *
 * Why no `define: { 'process.env.NODE_ENV': ... }` block: Vite's default
 * production build inlines NODE_ENV correctly, and the editor bundle
 * does not consume NODE_ENV at runtime.
 */
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: resolve(__dirname, '../assets/editor-app'),
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.js'),
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'app-[name].js',
        assetFileNames: (info) => {
          if (info.name && info.name.endsWith('.css')) return 'app.css';
          return 'app-[name][extname]';
        },
      },
    },
  },
  // Standalone dev server for component-level work outside the builder.
  // The real integration runs inside the Bricks builder DOM, but this
  // lets us iterate on the panel UI quickly with a mock Bricks state.
  server: {
    port: 5174,
  },
});
