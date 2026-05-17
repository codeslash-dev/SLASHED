#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'bundle.config.json');

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[error] Failed to load ${CONFIG_PATH}: ${err.message}`);
    process.exit(1);
  }
}

function bundle() {
  const { files, output } = loadConfig();
  const outputPath = path.join(ROOT, output);
  const timestamp = new Date().toISOString();
  const header = `/* ${path.basename(output)} — bundled ${timestamp} */\n`;

  let parts;
  try {
    parts = files.map((file) => {
      const filePath = path.join(ROOT, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return `/* ─── ${file} ─── */\n${content.trimEnd()}`;
    });
  } catch (err) {
    console.error(`[error] Failed to read source file: ${err.message}`);
    throw err;
  }

  const result = header + '\n' + parts.join('\n\n') + '\n';

  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result, 'utf8');
  } catch (err) {
    console.error(`[error] Failed to write ${outputPath}: ${err.message}`);
    throw err;
  }

  console.log(`[bundle] → ${output} (${files.length} files)`);
}

function watch() {
  bundle();

  const watchDir = path.join(ROOT, 'core');
  let watchedFiles = loadConfig().files.map((f) => path.basename(f));
  let debounceTimer = null;

  const rebuild = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      try {
        bundle();
      } catch {
        // error already logged in bundle(); keep watching
      }
    }, 100);
  };

  console.log('[watch] Watching core/ and bundle.config.json for changes…');

  fs.watch(watchDir, (event, filename) => {
    if (!filename) return;
    if (watchedFiles.includes(filename)) {
      console.log(`[watch] ${event}: core/${filename}`);
      rebuild();
    }
  });

  fs.watch(CONFIG_PATH, (event) => {
    if (event === 'change') {
      console.log('[watch] bundle.config.json changed');
      watchedFiles = loadConfig().files.map((f) => path.basename(f));
      rebuild();
    }
  });
}

const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

if (isWatch) {
  watch();
} else {
  bundle();
}
