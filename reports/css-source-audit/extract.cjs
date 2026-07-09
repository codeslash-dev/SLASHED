#!/usr/bin/env node
// CSS source auditor — mechanical extraction. Comments and string literals are
// blanked (preserving newlines) before extraction so examples in comments are
// never counted as definitions/usages.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = process.env.SLASHED_ROOT || require('path').resolve(__dirname, '../..');
const FILES = [
  ...fs.readdirSync(path.join(ROOT, 'core')).filter(f => f.endsWith('.css')).map(f => 'core/' + f),
  ...fs.readdirSync(path.join(ROOT, 'optional')).filter(f => f.endsWith('.css')).map(f => 'optional/' + f),
];

// Blank comments and string literals, preserving newlines and offsets.
function stripComments(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let mode = 'code'; // code | comment | dquote | squote
  while (i < n) {
    const c = src[i], c2 = src[i + 1];
    if (mode === 'code') {
      if (c === '/' && c2 === '*') { mode = 'comment'; out += '  '; i += 2; continue; }
      if (c === '"') { mode = 'dquote'; out += c; i++; continue; }
      if (c === "'") { mode = 'squote'; out += c; i++; continue; }
      out += c; i++;
    } else if (mode === 'comment') {
      if (c === '*' && c2 === '/') { mode = 'code'; out += '  '; i += 2; continue; }
      out += (c === '\n' ? '\n' : ' '); i++;
    } else { // strings: blank content, keep quotes
      const q = mode === 'dquote' ? '"' : "'";
      if (c === '\\') { out += '  '; i += 2; continue; }
      if (c === q) { mode = 'code'; out += c; i++; continue; }
      out += (c === '\n' ? '\n' : ' '); i++;
    }
  }
  return out;
}

function lineOf(src, idx) { return src.slice(0, idx).split('\n').length; }

// Parse a stripped CSS file into declarations with selector + at-rule context.
function parseFile(file, raw) {
  const src = stripComments(raw);
  const decls = [];       // {prop, value, selector, atCtx[], line, file}
  const selectors = [];   // {selector, atCtx[], line}
  const atRules = [];     // {name, prelude, line, hasBlock}
  const stack = [];       // context stack: {type:'at'|'sel', text}
  let i = 0; const n = src.length;
  let buf = '';
  let bufStart = 0;
  while (i < n) {
    const c = src[i];
    if (c === '{') {
      const text = buf.trim();
      const line = lineOf(src, bufStart + (buf.length - buf.trimStart().length));
      if (text.startsWith('@')) {
        const m = text.match(/^@([-\w]+)\s*(.*)$/s);
        atRules.push({ name: m[1], prelude: m[2].trim(), line, hasBlock: true, file });
        stack.push({ type: 'at', text });
      } else {
        selectors.push({ selector: text, atCtx: stack.filter(s => s.type === 'at').map(s => s.text), line, file });
        stack.push({ type: 'sel', text });
      }
      buf = ''; bufStart = i + 1; i++; continue;
    }
    if (c === '}') {
      // flush trailing declaration without semicolon
      flushDecl(buf, bufStart);
      stack.pop();
      buf = ''; bufStart = i + 1; i++; continue;
    }
    if (c === ';') {
      const text = buf.trim();
      if (text.startsWith('@')) {
        const m = text.match(/^@([-\w]+)\s*(.*)$/s);
        atRules.push({ name: m[1], prelude: m[2].trim(), line: lineOf(src, bufStart), hasBlock: false, file });
      } else {
        flushDecl(buf, bufStart);
      }
      buf = ''; bufStart = i + 1; i++; continue;
    }
    buf += c; i++;
  }
  function flushDecl(text, start) {
    const t = text.trim();
    if (!t) return;
    const ci = t.indexOf(':');
    if (ci < 0) return;
    const prop = t.slice(0, ci).trim();
    const value = t.slice(ci + 1).trim();
    if (!/^[-\w]/.test(prop)) return;
    const selCtx = stack.filter(s => s.type === 'sel').map(s => s.text);
    const atCtx = stack.filter(s => s.type === 'at').map(s => s.text);
    const line = lineOf(src, start + (text.length - text.trimStart().length));
    decls.push({ prop, value, selector: selCtx[selCtx.length - 1] || (atCtx[atCtx.length - 1] || '(top)'), selCtx, atCtx, line, file });
  }
  return { decls, selectors, atRules, stripped: src };
}

const all = { files: {}, decls: [], selectors: [], atRules: [] };
for (const f of FILES) {
  const raw = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const p = parseFile(f, raw);
  all.files[f] = { stripped: p.stripped };
  all.decls.push(...p.decls);
  all.selectors.push(...p.selectors);
  all.atRules.push(...p.atRules);
}

// ---- Token definitions
const defs = all.decls.filter(d => d.prop.startsWith('--'));
// ---- var() usages across all declaration values (including in custom prop values)
const usages = []; // {token, fallback:bool, fallbackValue, file, line, prop, selector}
for (const d of all.decls) {
  // scan value for var(--x  , fallback)
  const re = /var\(\s*(--[-\w]+)/g;
  let m;
  while ((m = re.exec(d.value))) {
    // find fallback: scan to matching paren
    let depth = 1, j = re.lastIndex, fb = null;
    while (j < d.value.length && depth > 0) {
      const ch = d.value[j];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 1 && fb === null) fb = j;
      j++;
    }
    usages.push({
      token: m[1], fallback: fb !== null,
      fallbackValue: fb !== null ? d.value.slice(fb + 1, j - 1).trim() : null,
      file: d.file, line: d.line, prop: d.prop, selector: d.selector,
    });
  }
}
// also var() in at-rule preludes (e.g. @media — rare) and selectors: skip, invalid CSS anyway.

// ---- @property registrations
const atProps = all.atRules.filter(a => a.name === 'property').map(a => {
  return { token: a.prelude.trim(), file: a.file, line: a.line };
});
// @property blocks' initial-value live as decls with selector context '@property ...'? No —
// our parser records the at-rule as context; decls inside have atCtx containing '@property --x'.
const atPropDetails = {};
for (const d of all.decls) {
  const at = d.atCtx.find(t => t.startsWith('@property'));
  if (at) {
    const tok = at.replace('@property', '').trim();
    atPropDetails[tok] = atPropDetails[tok] || { file: d.file };
    atPropDetails[tok][d.prop] = d.value;
    atPropDetails[tok].line = atPropDetails[tok].line || d.line;
  }
}

// ---- keyframes
const keyframes = all.atRules.filter(a => a.name === 'keyframes').map(a => ({ name: a.prelude, file: a.file, line: a.line }));
const animRefs = [];
for (const d of all.decls) {
  if (/^(animation|animation-name)$/.test(d.prop) || (d.prop.startsWith('--') && /anim/i.test(d.prop))) {
    animRefs.push(d);
  }
}

fs.writeFileSync(__dirname + '/results/extract.json', JSON.stringify({
  defs, usages, atProps, atPropDetails, keyframes, animRefs, decls: all.decls,
  selectors: all.selectors, atRules: all.atRules.map(({ name, prelude, line, file, hasBlock }) => ({ name, prelude, line, file, hasBlock })),
}, null, 1));

console.log('files:', FILES.length);
console.log('decls:', all.decls.length, 'token defs:', defs.length, 'var() usages:', usages.length);
console.log('unique tokens defined:', new Set(defs.map(d => d.prop)).size);
console.log('unique tokens used:', new Set(usages.map(u => u.token)).size);
console.log('@property:', atProps.length, 'keyframes:', keyframes.length, 'selectors:', all.selectors.length);
