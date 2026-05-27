import { defineConfig } from 'vitest/config';

/**
 * Vitest config for reBEMer pure modules.
 *
 * Scope is limited to the pure side of the codebase (slugify, bem, plan
 * builder, policy, ids). The Vue/DOM-touching modules (bricks-api.js,
 * Svelte components) are exercised manually inside the builder until a
 * Playwright harness is added.
 *
 * Environment is `node` because every covered module is pure and runs
 * without a DOM. crypto.randomUUID is available in Node 19+; tests that
 * need it stub it explicitly so they pass on older runtimes too.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.js'],
    globals: false,
    reporters: 'default',
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.js'],
      exclude: ['src/lib/bricks-api.js'],
    },
  },
});
