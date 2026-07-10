#!/usr/bin/env node
/*
 * Regenerate the framework CSS bundles (dist/*.css) before the configurator is
 * built or dev-served.
 *
 * WHY: the live-preview iframe bakes `dist/slashed.full.css` via a `?raw`
 * import (see PreviewPanel.svelte), while the rest of the app renders buttons
 * from source (`main.ts` imports core/ + optional/ directly). If dist/ is stale
 * the two diverge — the Controls live preview scales correctly while the
 * Components preview gallery shows a FLAT button size scale (every XS…XL button
 * the same height). This script removes that divergence by rebuilding dist/
 * from the same source the app uses, so the baked bundle is never stale.
 *
 * In the WordPress plugin build the framework is vendored (no scripts/ or
 * bundle.config.json alongside the vendored CSS), so this is a deliberate no-op
 * there and the vendored dist/ is used as-is.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// configurator/scripts/ -> configurator/ -> framework root (the @framework-css
// alias target, i.e. '..' from configurator/).
const frameworkRoot = path.resolve(import.meta.dirname, '..', '..');
const bundleScript = path.join(frameworkRoot, 'scripts', 'bundle.js');
const bundleConfig = path.join(frameworkRoot, 'bundle.config.json');

if (existsSync(bundleScript) && existsSync(bundleConfig)) {
  console.log('[ensure-framework-dist] rebuilding framework dist/ from source…');
  execFileSync('node', [bundleScript], { stdio: 'inherit' });
} else {
  console.log('[ensure-framework-dist] framework source not present (vendored build) — using existing dist/.');
}
