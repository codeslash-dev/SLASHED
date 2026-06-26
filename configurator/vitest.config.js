import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const pkg = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')
);

export default defineConfig({
  plugins: [
    svelte({
      dynamicCompileOptions({ filename }) {
        if (filename.includes('node_modules')) return { runes: undefined };
      },
    }),
  ],
  define: {
    __SLASHED_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, '.') },
    conditions: ['browser'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{js,ts}', 'tests-components/**/*.test.{js,ts}'],
    setupFiles: ['./tests-components/setup.js'],
  },
});
