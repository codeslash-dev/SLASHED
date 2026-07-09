#!/usr/bin/env node
// Analysis C: classes across files; variant→token-step mapping; docs vs source.
'use strict';
const fs = require('fs');
const X = JSON.parse(fs.readFileSync(__dirname + '/results/extract.json', 'utf8'));
const EXAMPLES = new Set(['optional/config-example.css', 'optional/overrides-example.css', 'optional/theme-example.css']);

// class -> set of files (from selectors)
const classFiles = new Map();
for (const s of X.selectors) {
  if (EXAMPLES.has(s.file)) continue;
  const cls = s.selector.match(/\.[a-zA-Z][-\w]*/g) || [];
  for (const c of cls) {
    if (!classFiles.has(c)) classFiles.set(c, new Map());
    const fm = classFiles.get(c);
    if (!fm.has(s.file)) fm.set(s.file, []);
    fm.get(s.file).push({ line: s.line, atCtx: s.atCtx });
  }
}
// multi-file classes
console.log('== classes defined/used in selectors of multiple files ==');
const multi = [];
for (const [c, fm] of classFiles) {
  if (fm.size > 1) multi.push({ cls: c, files: [...fm.entries()].map(([f, o]) => `${f}(${o.map(x => x.line).join(',')})`) });
}
multi.sort((a, b) => b.files.length - a.files.length);
for (const m of multi) console.log(m.cls, '->', m.files.join(' '));
console.log('total multi-file classes:', multi.length);

// variant→scale mapping: for classes like .sf-x--s/.sf-x--m find token steps used
console.log('\n== variant classes and the token steps they read ==');
const variantDecl = new Map();
for (const d of X.decls) {
  if (EXAMPLES.has(d.file)) continue;
  const m = d.selector.match(/\.((?:sf|print)[-\w]*?)--(2?x?[sl]|[sml]|xl|2xl|3xl|xs|2xs)\b/);
  if (!m) continue;
  const toks = (d.value.match(/--sf-[-\w]+/g) || []).filter(t => /-(2xs|xs|s|m|l|xl|2xl|3xl|4xl)$/.test(t));
  if (!toks.length) continue;
  const key = `${m[1]}--${m[2]}`;
  if (!variantDecl.has(key)) variantDecl.set(key, []);
  variantDecl.get(key).push({ file: d.file, line: d.line, prop: d.prop, toks });
}
for (const [k, v] of [...variantDecl.entries()].sort()) {
  console.log(k, '=>', v.map(x => `${x.prop}:${x.toks.join('+')}@${x.file}:${x.line}`).join(' | '));
}
fs.writeFileSync(__dirname + '/results/analyzeC.json', JSON.stringify({ multi, variants: [...variantDecl.entries()] }, null, 1));
