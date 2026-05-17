#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'bundle.config.json');

function resolveInsideRoot(relativePath) {
  const resolved = path.resolve(ROOT, relativePath);
  const rootWithSep = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
  if (resolved !== ROOT && !resolved.startsWith(rootWithSep)) {
    throw new Error(`Path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  return JSON.parse(raw);
}

function bundle() {
  const { files, output } = loadConfig();
  const outputPath = resolveInsideRoot(output);
  const header = `/* ${path.basename(output)} — bundled */\n`;

  const parts = files.map((file) => {
    const filePath = resolveInsideRoot(file);
    const content = fs.readFileSync(filePath, 'utf8');
    return `/* ─── ${file} ─── */\n${content.trimEnd()}`;
  });

  const result = header + '\n' + parts.join('\n\n') + '\n';

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, result, 'utf8');

  console.log(`[bundle] → ${output} (${files.length} files)`);
}

function watch() {
  try {
    bundle();
  } catch (err) {
    console.error(`[watch] Initial bundle failed: ${err.message}`);
  }

  const watchDir = path.join(ROOT, 'core');
  let watchedFiles = [];
  try {
    watchedFiles = loadConfig().files.map((f) => path.basename(f));
  } catch (err) {
    console.error(`[watch] Failed to load config: ${err.message}`);
  }

  let debounceTimer = null;
  const rebuild = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      try {
        bundle();
      } catch (err) {
        console.error(`[watch] Bundle failed: ${err.message}`);
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
    if (event === 'change' || event === 'rename') {
      console.log('[watch] bundle.config.json changed');
      try {
        watchedFiles = loadConfig().files.map((f) => path.basename(f));
      } catch (err) {
        console.error(`[watch] Invalid config: ${err.message}`);
      }
      rebuild();
    }
  });
}

const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

if (isWatch) {
  watch();
} else {
  try {
    bundle();
  } catch (err) {
    console.error(`[error] ${err.message}`);
    process.exit(1);
  }
}
