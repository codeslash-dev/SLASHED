#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const CORE_FILES = [
  'core/layers.css',
  'core/tokens.css',
  'core/tokens.layout.css',
  'core/reset.css',
  'core/base.css',
  'core/layout.css',
  'core/states.css',
  'core/accessibility.css',
  'core/print.css',
];

const OUTPUT = path.join(ROOT, 'dist', 'slashed-essential.css');

function bundle() {
  const timestamp = new Date().toISOString();
  const header = `/* slashed-essential.css — bundled ${timestamp} */\n`;

  const parts = CORE_FILES.map((file) => {
    const filePath = path.join(ROOT, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return `/* ─── ${file} ─── */\n${content.trimEnd()}`;
  });

  const output = header + '\n' + parts.join('\n\n') + '\n';

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, output, 'utf8');

  console.log(`[bundle] → ${path.relative(ROOT, OUTPUT)}`);
}

function watch() {
  bundle();

  const watchDir = path.join(ROOT, 'core');
  const watchedFiles = new Set(CORE_FILES.map((f) => path.basename(f)));

  console.log('[watch] Watching core/ for changes…');

  fs.watch(watchDir, (event, filename) => {
    if (filename && watchedFiles.has(filename)) {
      console.log(`[watch] ${event}: core/${filename}`);
      bundle();
    }
  });
}

const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

if (isWatch) {
  watch();
} else {
  bundle();
}
