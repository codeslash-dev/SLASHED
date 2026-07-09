#!/usr/bin/env node
// Classify unconsumed tokens against token-index, and diff source vs registries both ways.
'use strict';
const fs = require('fs');
const ROOT = process.env.SLASHED_ROOT || require('path').resolve(__dirname, '../..');
const A = require('./results/analyzeA.json');
const X = require('./results/extract.json');
const idx = require(ROOT + '/docs/token-index.json').tokens;
const reg = require(ROOT + '/token-registry.json').tokens;
const api = require(ROOT + '/docs/api-index.json');
const guide = fs.readFileSync(ROOT + '/docs/llm-guide.md', 'utf8');

const EXAMPLES = new Set(['optional/config-example.css', 'optional/overrides-example.css', 'optional/theme-example.css']);
const definedFw = new Set(X.defs.filter(d => !EXAMPLES.has(d.file)).map(d => d.prop));
const usedFw = new Set(X.usages.filter(u => !EXAMPLES.has(u.file)).map(u => u.token));

const regNames = new Set(reg.map(t => t.name));
const idxNames = new Set(Object.keys(idx));

// 1) classification of unconsumed
const rows = [];
for (const u of A.unconsumed) {
  const t = u.token;
  const inIdx = idxNames.has(t);
  const tier = inIdx ? idx[t].tier : null;
  const inGuide = guide.includes(t);
  rows.push({ token: t, tier: tier || 'NOT-IN-INDEX', inRegistry: regNames.has(t), inGuide, def: u.defs[0] });
}
const notInIndex = rows.filter(r => r.tier === 'NOT-IN-INDEX');
console.log('unconsumed total:', rows.length);
console.log('unconsumed & NOT in token-index:', notInIndex.length);
for (const r of notInIndex) console.log(' ', r.token, '| reg:', r.inRegistry, '| guide:', r.inGuide, '|', r.def);

// 2) tokens defined in source but missing from token-index (any consumption status)
const srcOnly = [...definedFw].filter(t => !idxNames.has(t));
console.log('\ndefined in source, missing from token-index:', srcOnly.length);
for (const t of srcOnly) {
  const d = X.defs.find(d => d.prop === t);
  console.log(' ', t, '|', `${d.file}:${d.line}`, '| guide:', guide.includes(t), '| registry:', regNames.has(t));
}
// 3) index entries not defined in source
const idxOnly = [...idxNames].filter(t => !definedFw.has(t));
console.log('\nin token-index, not defined in source:', idxOnly.length, idxOnly.join(', '));
// registry vs source
const regOnly = [...regNames].filter(t => !definedFw.has(t));
console.log('in token-registry, not defined in source:', regOnly.length, regOnly.join(', '));
const srcNotReg = [...definedFw].filter(t => !regNames.has(t));
console.log('defined in source, not in token-registry:', srcNotReg.length);

// 4) used-with-fallback hooks visibility
for (const h of ['--sf-color-code-block-bg', '--sf-color-code-block-text', '--sf-overlap-host-pad', '--sf-color-code-text', '--sf-current-font-weight']) {
  console.log('hook', h, '| index:', idxNames.has(h), '| registry:', regNames.has(h), '| guide:', guide.includes(h));
}
// 5) guide tokens not in source (check:llm-guide covers this — verify)
const guideTokens = new Set((guide.match(/--sf-[-\w]+/g) || []));
const guideOnly = [...guideTokens].filter(t => !definedFw.has(t));
console.log('\nguide tokens not defined in source:', guideOnly.length, guideOnly.join(', '));
fs.writeFileSync(__dirname + '/results/classify.json', JSON.stringify({ rows, notInIndex, srcOnly, idxOnly, guideOnly }, null, 1));
