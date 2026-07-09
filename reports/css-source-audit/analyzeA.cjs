#!/usr/bin/env node
// Analysis A: tokens — orphans, dead knobs, undefined-used, @property, multi-defs.
'use strict';
const fs = require('fs');
const X = JSON.parse(fs.readFileSync(__dirname + '/results/extract.json', 'utf8'));
const EXAMPLES = new Set(['optional/config-example.css', 'optional/overrides-example.css', 'optional/theme-example.css']);

const defsAll = X.defs;
const defsFw = defsAll.filter(d => !EXAMPLES.has(d.file));       // framework source
const usesFw = X.usages.filter(u => !EXAMPLES.has(u.file));

const defined = new Map(); // token -> defs[]
for (const d of defsFw) { if (!defined.has(d.prop)) defined.set(d.prop, []); defined.get(d.prop).push(d); }
const used = new Map();
for (const u of usesFw) { if (!used.has(u.token)) used.set(u.token, []); used.get(u.token).push(u); }
// tokens also "consumed" if referenced by animation shorthand? no, tokens only via var().
// tokens consumed by @property registration alone don't count as consumption.

// A1: defined but never consumed by framework
const unconsumed = [...defined.keys()].filter(t => !used.has(t));
// A2: used but never defined
const undef = [...used.keys()].filter(t => !defined.has(t));
const undefNoFallback = [];
const undefWithFallback = [];
for (const t of undef) {
  const us = used.get(t);
  const noFb = us.filter(u => !u.fallback);
  if (noFb.length) undefNoFallback.push({ token: t, sites: noFb });
  else undefWithFallback.push({ token: t, sites: us.map(u => `${u.file}:${u.line}`) });
}
// A3: @property mismatches
const registered = new Set(X.atProps.map(p => p.token));
const regNoDef = [...registered].filter(t => !defined.has(t));
const details = X.atPropDetails;
// initial-value vs actual default (definition on :root/:where(:root) etc. in tokens files)
const initialMismatch = [];
for (const [tok, det] of Object.entries(details)) {
  const iv = det['initial-value'];
  if (iv === undefined) continue;
  const rootDefs = (defined.get(tok) || []).filter(d => /:root|:where\(html\)|^html$/.test(d.selector) && d.atCtx.every(a => !a.startsWith('@media') && !a.startsWith('@container') && !a.startsWith('@supports')));
  if (!rootDefs.length) continue;
  const dv = rootDefs[0].value;
  const norm = s => s.replace(/\s+/g, ' ').trim();
  if (norm(iv) !== norm(dv)) initialMismatch.push({ token: tok, initial: iv, rootDefault: dv, at: `${det.file}:${det.line}`, defAt: `${rootDefs[0].file}:${rootDefs[0].line}` });
}
// A4: multi-definitions in same scope (same selector, same at-context, no theme/media variance)
const multi = [];
for (const [tok, ds] of defined) {
  if (ds.length < 2) continue;
  const key = d => `${d.file}|${d.selector}|${d.atCtx.join('>')}`;
  const groups = new Map();
  for (const d of ds) { const k = key(d); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(d); }
  for (const [k, g] of groups) {
    if (g.length > 1 && new Set(g.map(d => d.value.replace(/\s+/g, ' '))).size > 1) {
      multi.push({ token: tok, scope: k, defs: g.map(d => `${d.file}:${d.line} = ${d.value}`) });
    }
  }
}
// A4b: cross-file same-selector duplicate defaults with different values (no at-context)
const crossFile = [];
for (const [tok, ds] of defined) {
  const rootPlain = ds.filter(d => /:root/.test(d.selector) && d.atCtx.length === 0);
  const files = new Set(rootPlain.map(d => d.file));
  if (files.size > 1 && new Set(rootPlain.map(d => d.value.replace(/\s+/g, ' '))).size > 1) {
    crossFile.push({ token: tok, defs: rootPlain.map(d => `${d.file}:${d.line} = ${d.value}`) });
  }
}
// A1 classification helpers: scale families among unconsumed
const famOf = t => { const m = t.match(/^(.*?)-(3?x?[sl]|xx?[sl]|s|m|l|xl|xxl|\d+)$/); return m ? m[1] : null; };
const scaleGap = [];
const famAll = new Map();
for (const t of defined.keys()) { const f = famOf(t); if (f) { if (!famAll.has(f)) famAll.set(f, []); famAll.get(f).push(t); } }
for (const [f, mem] of famAll) {
  if (mem.length >= 3) {
    const un = mem.filter(t => !used.has(t));
    if (un.length && un.length < mem.length) scaleGap.push({ family: f, members: mem.length, unconsumed: un });
  }
}
// dead-knob heuristic prep: dump unconsumed with location+value for manual/scripted check
const out = {
  counts: {
    definedFw: defined.size, usedFw: used.size,
    unconsumed: unconsumed.length, undefNoFallback: undefNoFallback.length, undefWithFallback: undefWithFallback.length,
    regNoDef: regNoDef.length, initialMismatch: initialMismatch.length, multiSameScope: multi.length, crossFileConflict: crossFile.length,
  },
  unconsumed: unconsumed.map(t => ({ token: t, defs: defined.get(t).map(d => `${d.file}:${d.line} = ${d.value.slice(0, 80)}`) })),
  undefNoFallback: undefNoFallback.map(x => ({ token: x.token, sites: x.sites.map(u => `${u.file}:${u.line} (${u.prop} in ${u.selector})`) })),
  undefWithFallback,
  regNoDef, initialMismatch, multi, crossFile, scaleGap,
};
fs.writeFileSync(__dirname + '/results/analyzeA.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.counts, null, 1));
console.log('\n== UNDEF NO FALLBACK =='); for (const x of out.undefNoFallback) console.log(x.token, x.sites.join(' | '));
console.log('\n== @property registered but never defined =='); console.log(regNoDef.join(', ') || '(none)');
console.log('\n== initial-value mismatches =='); for (const x of initialMismatch) console.log(x.token, 'initial:', x.initial, 'vs root:', x.rootDefault, '@', x.at, x.defAt);
console.log('\n== same-scope multi-def conflicts =='); for (const x of multi) console.log(x.token, x.defs.join(' | '));
console.log('\n== cross-file :root conflicts =='); for (const x of crossFile) console.log(x.token, x.defs.join(' | '));
console.log('\n== scale families with unconsumed steps =='); for (const x of scaleGap) console.log(x.family, `(${x.members} members)`, 'unconsumed:', x.unconsumed.join(', '));
console.log('\n== unconsumed tokens ==', unconsumed.length); for (const x of out.unconsumed) console.log(x.token, '|', x.defs[0]);
