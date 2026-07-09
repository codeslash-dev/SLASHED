#!/usr/bin/env node
// Analysis B: verify declared sync contracts character-by-character (whitespace-normalized).
'use strict';
const fs = require('fs');
const X = JSON.parse(fs.readFileSync(__dirname + '/results/extract.json', 'utf8'));
const norm = s => s.replace(/\s+/g, ' ').trim();

// Map token -> defs
const byTok = new Map();
for (const d of X.defs) { if (!byTok.has(d.prop)) byTok.set(d.prop, []); byTok.get(d.prop).push(d); }

// B1: layout.css .sf-fluid-cq > * re-derivations must equal :root twins in tokens.css
console.log('== B1: .sf-fluid-cq re-derivations vs core/tokens.css :root ==');
let b1bad = 0, b1ok = 0;
for (const d of X.defs.filter(d => d.file === 'core/layout.css' && d.selector.includes('.sf-fluid-cq'))) {
  const noCond = a => !/^@(media|container|supports)/.test(a);
  if (d.prop === '--sf-fluid-width') continue; // intentional CQ redefinition (100cqi)
  const roots = (byTok.get(d.prop) || []).filter(r => r.file === 'core/tokens.css' && /:root/.test(r.selector) && r.atCtx.every(noCond));
  if (!roots.length) { console.log('NO ROOT TWIN:', d.prop, `${d.file}:${d.line}`); b1bad++; continue; }
  const match = roots.some(r => norm(r.value) === norm(d.value));
  if (!match) { console.log('MISMATCH:', d.prop, `${d.file}:${d.line}`, '\n  cq :', norm(d.value).slice(0, 200), '\n  root:', norm(roots[0].value).slice(0, 200)); b1bad++; }
  else b1ok++;
}
console.log(`ok=${b1ok} bad=${b1bad}`);

// B2: themes.css:80 — palette formula copies (find the block around line 80) — compare
// the [data-theme] / dark redefinitions flagged "keep in sync" with tokens.css versions.
console.log('\n== B2: themes.css defs with sync contracts vs tokens.css ==');
// find tokens defined in themes.css whose token also has a def in tokens.css; compare values where the comment says same formula.
// Mechanical approach: for every token defined in BOTH themes.css and tokens.css, print pairs that differ contextually — we inspect targeted ones:
for (const tok of ['--sf-color-code-bg', '--sf-color-code-text']) {
  for (const d of (byTok.get(tok) || [])) console.log(tok, '|', `${d.file}:${d.line}`, '|', d.selector.slice(0, 50), '| at:', d.atCtx.join('>').slice(0, 60), '|', norm(d.value).slice(0, 120));
  console.log('---');
}
// B3: utilities.css heading mirrors vs base.css h1-h6
console.log('\n== B3: utilities .sf-h* vs base.css h1-h6 ==');
const base = X.decls.filter(d => d.file === 'core/base.css' && /^h[1-6]/.test(d.selector));
const util = X.decls.filter(d => d.file === 'optional/utilities.css' && /\.sf-h[1-6]/.test(d.selector));
console.log('base decls:', base.length, 'util decls:', util.length);
for (const u of util) {
  console.log('UTIL', `${u.file}:${u.line}`, u.selector.replace(/\s+/g, ' ').slice(0, 60), '|', u.prop, ':', norm(u.value));
}
for (const b of base) console.log('BASE', `${b.file}:${b.line}`, b.selector.replace(/\s+/g, ' ').slice(0, 60), '|', b.prop, ':', norm(b.value));
