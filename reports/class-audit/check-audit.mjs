import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import classesData from '../../configurator/src/data/classes.generated.json' with { type: 'json' };

const root = new URL('../..', import.meta.url).pathname;
const reportPath = path.join(root, 'reports/class-audit/classes-audit.json');
const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
const galleryPath = path.join(root, 'reports/class-audit/index.html');
const gallery = await fs.readFile(galleryPath, 'utf8');
const expectedClasses = classesData.classes.filter((entry) => entry.selector?.startsWith('.'));
assert.equal(report.total, expectedClasses.length, 'audit must include every generated class');
assert.equal(report.failures.length, 0, 'audit should not have selector render failures');
assert.equal(report.results.length, expectedClasses.length, 'result count should match class count');
for (const entry of report.results) {
  assert.equal(entry.matched, true, `${entry.name} should be represented in the fresh audit page`);
  if (!entry.optional) assert.equal(entry.declaredInCss, true, `${entry.selector} should be declared in dist/slashed.full.css`);
  await fs.access(path.join(root, 'reports/class-audit', entry.screenshot));
  assert.match(gallery, new RegExp(entry.screenshot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${entry.screenshot} should be linked from the gallery`);
}
assert.match(gallery, /<main class="grid">/, 'gallery should expose a browsable screenshot grid');
console.log(`Verified ${report.results.length} fresh class audit artifacts (${report.mode}).`);
