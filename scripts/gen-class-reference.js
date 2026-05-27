#!/usr/bin/env node
/**
 * Generates docs/classes.md from CSS source files.
 * Run: npm run docs:classes
 *
 * The reference is derived from source so it never drifts.
 */

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const { CLASS_FILES } = require('./registry-sources');

const FILE_META = {
  'core/layout.css':        { title: 'Layout primitives',    prefix: 'sf-' },
  'core/macros.css':        { title: 'Macro classes',         prefix: 'sf-' },
  'core/states.css':        { title: 'State classes',         prefix: 'is-' },
  'core/accessibility.css': { title: 'Accessibility',         prefix: 'sf-' },
  'core/motion.css':        { title: 'Motion / entrances',    prefix: 'sf-' },
  'core/print.css':         { title: 'Print utilities',       prefix: ''    },
  'optional/forms.css':     { title: 'Forms',                 prefix: 'sf-' },
  'optional/components.css':{ title: 'Components',            prefix: 'sf-' },
  'optional/theme-example.css': { title: 'Theme example',     prefix: ''    },
};

const SOURCES = CLASS_FILES.map(f => ({
  file:   f,
  title:  `${FILE_META[f].title} (\`${f}\`)`,
  prefix: FILE_META[f].prefix,
}));

function extract(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    throw new Error(`[docs:classes] Missing canonical class source file: ${abs}`);
  }
  const css = fs.readFileSync(abs, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')     // strip block comments
    .replace(/"[^"]*"|'[^']*'/g, '""');   // strip string literals
  const names = new Set();
  for (const m of css.matchAll(/\.((sf|is)-[\w-]+)/g)) names.add(m[1]);
  return [...names].sort();
}

let out = `# Class reference

> **Generated** from source by \`scripts/gen-class-reference.js\` —
> run \`npm run docs:classes\` to refresh. Do not edit by hand.

Every \`.sf-*\` layout/macro class and \`.is-*\` state class.
See [architecture.md](architecture.md) for layer order and naming conventions.

`;

let totalSf = 0;
let totalIs = 0;
const sections = [];

for (const { file, title } of SOURCES) {
  const names = extract(file);
  if (!names.length) continue;
  const sf = names.filter(n => n.startsWith('sf-'));
  const is = names.filter(n => n.startsWith('is-'));
  totalSf += sf.length;
  totalIs += is.length;
  sections.push({ title, names });
}

out = out.replace('Every', `**${totalSf} .sf-classes, ${totalIs} .is-classes.** Every`);

for (const { title, names } of sections) {
  out += `## ${title}\n\n`;
  out += `${names.length} classes.\n\n`;
  out += '| Class |\n|---|\n';
  for (const name of names) out += `| \`.${name}\` |\n`;
  out += '\n';
}

const OUT = path.join(ROOT, 'docs', 'classes.md');
fs.writeFileSync(OUT, out, 'utf8');
console.log(`[docs] → docs/classes.md (${totalSf} .sf-classes, ${totalIs} .is-classes)`);
