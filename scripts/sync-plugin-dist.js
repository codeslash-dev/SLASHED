#!/usr/bin/env node
// Copies the local-delivery CSS bundles (essential, optimal, full) from the
// root dist/ build output into the WordPress plugin's bundled dist/.
//
// The plugin ships these files so sites can load SLASHED without a CDN
// (see Slashed_CSS_Loader / "local-first delivery"). They must always match
// the bundles built from the current core/optional sources, so this runs as
// part of `npm run build` and is registered in scripts/artifacts.json —
// `node scripts/check-artifacts.js --check` fails CI if they ever drift.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'dist');
const DEST_DIR = path.join(ROOT, 'plugins/SLASHED-for-WP/dist');

const BUNDLES = ['essential', 'optimal', 'full'];

fs.mkdirSync(DEST_DIR, { recursive: true });

for (const bundle of BUNDLES) {
  const filename = `slashed.${bundle}.css`;
  fs.copyFileSync(path.join(SRC_DIR, filename), path.join(DEST_DIR, filename));
  console.log(`[sync-plugin-dist] → plugins/SLASHED-for-WP/dist/${filename}`);
}
