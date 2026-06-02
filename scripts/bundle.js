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

// Walks src starting at openPos (which must point at '{'), respecting CSS
// comments and quoted strings, and returns the index of the matching '}'.
// Returns -1 on imbalance.
function findMatchingBrace(src, openPos) {
  let depth = 1;
  let i = openPos + 1;
  while (i < src.length) {
    const ch = src[i];
    // Block comment.
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      if (end === -1) return -1;
      i = end + 2;
      continue;
    }
    // Quoted string (CSS uses both " and ', no template literals).
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\') { i += 2; continue; }
        i++;
      }
      i++;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

// Removes SLASHED's @layer scaffolding from a single source file's contents,
// producing flat unlayered CSS suitable for environments that already manage
// the cascade themselves (e.g. a host that wraps its own defaults in a named
// layer — unlayered author CSS automatically beats anything in a layer).
//
//   1. `@layer name1, name2, … ;` declarations  → removed.
//   2. `@layer slashed.X { … }` block wrappers  → unwrapped (inner CSS kept,
//      dedented by 2 spaces for readability).
//
// Anchored to start-of-line so commented-out @layer text in file headers
// (e.g. `   @layer slashed.print` in a doc block) cannot accidentally match.
function stripLayerWrappers(content, fileLabel) {
  // 1. Strip top-level @layer declarations (no opening brace before ';').
  let out = content.replace(/^@layer\b[^{;]*;[ \t]*\r?\n?/gm, '');

  // 2. Unwrap each @layer slashed.X { … } block by walking its braces.
  // Loop until no @layer blocks remain; exits via break when header is null.
  for (;;) {
    const header = /^@layer[ \t]+[\w.\s,-]+\{/m.exec(out);
    if (!header) break;
    const start = header.index;
    const openBrace = start + header[0].length - 1;
    const closeBrace = findMatchingBrace(out, openBrace);
    if (closeBrace === -1) {
      throw new Error(`stripLayerWrappers: unbalanced @layer block in ${fileLabel}`);
    }
    const inner = out.slice(openBrace + 1, closeBrace);
    // Dedent two spaces (the standard indent inside SLASHED layer blocks)
    // and trim a single leading/trailing blank line for cleanliness.
    const dedented = inner
      .replace(/^[ \t]*\r?\n/, '')
      .replace(/^ {2}/gm, '')
      .replace(/\s+$/, '');
    const before = out.slice(0, start).replace(/[ \t]*$/, '');
    const after = out.slice(closeBrace + 1).replace(/^[ \t]*\r?\n/, '');
    out = `${before}${dedented}\n${after}`;
  }

  return out;
}

function buildOne({ files, output, flat = false }) {
  const outputPath = resolveInsideRoot(output);
  const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const flatTag = flat ? ' (flat)' : '';
  const header = `/* SLASHED v${version} — ${path.basename(output)}${flatTag} */\n`;

  const parts = files.map((file) => {
    const filePath = resolveInsideRoot(file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Strip local @import statements: bundling resolves them by explicit
    // file order, and a mid-file @import is invalid (ignored by browsers).
    content = content.replace(/^[ \t]*@import\s+(["'])[^"']+\1\s*;[ \t]*\r?\n?/gm, '');
    if (flat) content = stripLayerWrappers(content, file);
    return `/* ─── ${file} ─── */\n${content.trimEnd()}`;
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
