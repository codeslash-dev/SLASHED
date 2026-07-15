// @ts-check
// Bundle-size regression guard. Fails if a built bundle's gzip size exceeds
// its budget — catches accidental bloat. Budgets are deliberately loose
// headroom over current sizes, tightened as the framework stabilises.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = path.resolve(import.meta.dirname, '..', 'dist');

// gzip kB budgets per minified bundle.
// Updated after adding core/tokens.color-fallbacks.css (Tier-1 sRGB fallbacks),
// which adds ~1.5–2kB gzip to each bundle containing color tokens.
// full.min.css bumped 22 → 22.1 after renaming .sf-bento--compact/--tall to
// --row-compact/--row-tall (disambiguates from the child modifier
// .sf-bento-tall) — full.min.css was already at the 22kB edge, and the few
// extra bytes tipped it over.
const BUDGETS = {
  'slashed.optimal.min.css': 22,
  'slashed.full.min.css': 22.1,
};

for (const [file, budgetKb] of Object.entries(BUDGETS)) {
  test(`bundle size: ${file} ≤ ${budgetKb}kB gzip`, () => {
    const buf = fs.readFileSync(path.join(DIST, file));
    const gzipKb = zlib.gzipSync(buf, { level: 9 }).length / 1024;
    expect(gzipKb).toBeLessThanOrEqual(budgetKb);
  });
}
