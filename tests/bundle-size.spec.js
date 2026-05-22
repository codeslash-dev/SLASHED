// @ts-check
// Bundle-size regression guard. Fails if a built bundle's gzip size exceeds
// its budget — catches accidental bloat. Budgets are deliberately loose
// headroom over current sizes, tightened as the framework stabilises.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIST = path.resolve(__dirname, '..', 'dist');

// gzip kB budgets per minified bundle.
const BUDGETS = {
  'slashed.essential.min.css': 15,
  'slashed.optimal.min.css': 18,
  'slashed.full.min.css': 20,
};

for (const [file, budgetKb] of Object.entries(BUDGETS)) {
  test(`bundle size: ${file} ≤ ${budgetKb}kB gzip`, () => {
    const buf = fs.readFileSync(path.join(DIST, file));
    const gzipKb = zlib.gzipSync(buf, { level: 9 }).length / 1024;
    expect(gzipKb).toBeLessThanOrEqual(budgetKb);
  });
}
