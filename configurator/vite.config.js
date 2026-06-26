import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const pkg = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')
);

export default defineConfig({
  base: './',
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  define: {
    __SLASHED_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    port: 5180,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
    fs: {
      allow: ['..'],
    },
  },
});
