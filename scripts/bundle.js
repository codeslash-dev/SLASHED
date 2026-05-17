#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'bundle.config.json');

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  return JSON.parse(raw);
}

function bundle() {
  const { files, output } = loadConfig();
  const outputPath = path.join(ROOT, output);
  const timestamp = new Date().toISOString();
  const header = `/* ${path.basename(output)} — bundled ${timestamp} */\n`;

  const parts = files.map((file) => {
    const filePath = path.join(ROOT, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return `/* ─── ${file} ─── */\n${content.trimEnd()}`;
  });

  const result = header + '\n' + parts.join('\n\n') + '\n';

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, result, 'utf8');

  console.log(`[bundle] → ${output} (${files.length} files)`);
}

function watch() {
  bundle();

  const watchDir = path.join(ROOT, 'core');

  console.log('[watch] Watching core/ and bundle.config.json for changes…');

  // Watch core/ directory — rebuild when any listed file changes
  fs.watch(watchDir, (event, filename) => {
    if (!filename) return;
    const { files } = loadConfig();
    const listed = files.map((f) => path.basename(f));
    if (listed.includes(filename)) {
      console.log(`[watch] ${event}: core/${filename}`);
      bundle();
    }
  });

  // Watch config — rebuild immediately when file list changes
  fs.watch(CONFIG_PATH, (event) => {
    if (event === 'change') {
      console.log('[watch] bundle.config.json changed');
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
