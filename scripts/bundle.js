#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'bundle.config.json');

// lightningcss is a maintainer-only dev dependency. If it's missing (e.g. a
// consumer cloned without dev deps), skip minification rather than fail.
let lightningcss = null;
try { lightningcss = require('lightningcss'); } catch { /* optional */ }

function sizeReport(buf) {
  const raw = buf.length;
  const gz = zlib.gzipSync(buf, { level: 9 }).length;
  const br = zlib.brotliCompressSync(buf).length;
  const kb = (n) => `${(n / 1024).toFixed(1)}kB`;
  return `${kb(raw)} raw · ${kb(gz)} gzip · ${kb(br)} br`;
}

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

// Accepts both the new { bundles: [...] } shape and the legacy
// single-bundle { output, files } object.
function getBundles() {
  const config = loadConfig();
  return Array.isArray(config.bundles) ? config.bundles : [config];
}

function buildOne({ files, output }) {
  const outputPath = resolveInsideRoot(output);
  const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const header = `/* SLASHED v${version} — ${path.basename(output)} */\n`;

  const parts = files.map((file) => {
    const filePath = resolveInsideRoot(file);
    const content = fs.readFileSync(filePath, 'utf8');
    // Strip local @import statements: bundling resolves them by explicit
    // file order, and a mid-file @import is invalid (ignored by browsers).
    const inlined = content.replace(/^[ \t]*@import\s+(["'])[^"']+\1\s*;[ \t]*\r?\n?/gm, '');
    return `/* ─── ${file} ─── */\n${inlined.trimEnd()}`;
  });

  const result = header + '\n' + parts.join('\n\n') + '\n';

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, result, 'utf8');

  const unminBuf = Buffer.from(result);
  console.log(`[bundle] → ${output} (${files.length} files) — ${sizeReport(unminBuf)}`);

  // Minified sibling + source map (modern CSS preserved: no `targets`, so
  // light-dark()/oklch relative colour syntax is never down-levelled).
  if (lightningcss) {
    const minPath = outputPath.replace(/\.css$/, '.min.css');
    const mapName = `${path.basename(minPath)}.map`;
    const { code, map } = lightningcss.transform({
      filename: path.basename(output),
      code: unminBuf,
      minify: true,
      sourceMap: true,
    });
    const codeWithRef = Buffer.concat([code, Buffer.from(`\n/*# sourceMappingURL=${mapName} */\n`)]);
    fs.writeFileSync(minPath, codeWithRef);
    if (map) fs.writeFileSync(`${minPath}.map`, map);
    console.log(`[bundle] → ${output.replace(/\.css$/, '.min.css')} — ${sizeReport(codeWithRef)}`);
  }
}

function bundle() {
  getBundles().forEach(buildOne);
}

function watch() {
  try {
    bundle();
  } catch (err) {
    console.error(`[watch] Initial bundle failed: ${err.message}`);
  }

  const collectWatchedPaths = () =>
    new Set(getBundles().flatMap((b) => b.files).map((f) => path.normalize(f)));

  let watchedFiles = new Set();
  try {
    watchedFiles = collectWatchedPaths();
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

  console.log('[watch] Watching core/, optional/ and bundle.config.json for changes…');

  ['core', 'optional'].forEach((dir) => {
    fs.watch(path.join(ROOT, dir), (event, filename) => {
      if (!filename) return;
      const changedPath = path.normalize(path.join(dir, String(filename)));
      if (watchedFiles.has(changedPath)) {
        console.log(`[watch] ${event}: ${dir}/${filename}`);
        rebuild();
      }
    });
  });

  fs.watch(CONFIG_PATH, (event) => {
    if (event === 'change' || event === 'rename') {
      console.log('[watch] bundle.config.json changed');
      try {
        watchedFiles = collectWatchedPaths();
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
