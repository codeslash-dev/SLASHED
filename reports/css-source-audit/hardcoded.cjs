#!/usr/bin/env node
// Find hardcoded literal values in consumer (non-token) files for properties
// that the token system covers — dead-knob candidates.
'use strict';
const fs = require('fs');
const X = JSON.parse(fs.readFileSync(__dirname + '/results/extract.json', 'utf8'));
const TOKEN_FILES = new Set(['core/tokens.css', 'core/tokens.layout.css', 'core/tokens.macros.css', 'optional/tokens.components.css']);
const EXAMPLES = new Set(['optional/config-example.css', 'optional/overrides-example.css', 'optional/theme-example.css']);
const COVERED = /^(padding|margin|gap|border-radius|font-size|line-height|box-shadow|transition|animation|z-index|font-family|font-weight|letter-spacing|column-gap|row-gap|inset|width|height|min-height|min-width|max-width|duration)/;

const hits = [];
for (const d of X.decls) {
  if (TOKEN_FILES.has(d.file) || EXAMPLES.has(d.file)) continue;
  if (d.prop.startsWith('--')) continue;
  if (!COVERED.test(d.prop)) continue;
  const v = d.value.replace(/!important/, '').trim();
  if (/var\(/.test(v)) continue;                     // uses tokens somewhere
  if (/^(0|none|auto|inherit|initial|unset|normal|transparent|currentcolor|100%|50%|1|0px|0 auto|contents)$/i.test(v)) continue;
  if (/^[0-9.]+(em|ch|ex|%)?$/.test(v) && parseFloat(v) <= 2 && !/px|rem/.test(v)) continue; // small unitless/em tweaks
  if (d.atCtx.some(a => /forced-colors|print|prefers-contrast/.test(a))) { hits.push({ ...d, note: 'a11y/print ctx' }); continue; }
  hits.push(d);
}
for (const h of hits) console.log(`${h.file}:${h.line} | ${h.selector.slice(0, 60)} | ${h.prop}: ${h.value.slice(0, 70)}${h.note ? ' [' + h.note + ']' : ''}`);
console.log('total:', hits.length);
