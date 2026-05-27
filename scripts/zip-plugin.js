#!/usr/bin/env node

/**
 * Packages the SLASHED for Bricks WordPress plugin into a distributable zip.
 *
 * Output: dist/slashed-bricks.zip
 *
 * The zip contains a single top-level directory `slashed-bricks/` (matching
 * WordPress plugin slug conventions) with:
 *   - slashed-bricks.php (main bootstrap)
 *   - includes/           (PHP classes)
 *   - assets/             (pre-built admin/editor JS+CSS)
 *   - data/               (fallback inventory.json)
 *   - README.md
 *
 * Source directories (admin-app/, editor-app/) are excluded — they are dev
 * sources whose built output already lives in assets/.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PLUGIN_DIR = path.join(ROOT, 'integrations', 'bricks');
const OUTPUT = path.join(ROOT, 'dist', 'slashed-bricks.zip');

// Directories/files to include (relative to integrations/bricks/).
const INCLUDE = [
  'slashed-bricks.php',
  'README.md',
  'includes',
  'assets',
  'data',
];

// Build a temporary staging directory, zip it, then clean up.
const STAGE = path.join(ROOT, '.tmp-plugin-stage');
const STAGE_PLUGIN = path.join(STAGE, 'slashed-bricks');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function clean(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function main() {
  // Ensure dist/ exists.
  fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });

  // Clean previous staging area.
  clean(STAGE);
  fs.mkdirSync(STAGE_PLUGIN, { recursive: true });

  // Copy selected entries into the staging directory.
  for (const entry of INCLUDE) {
    const src = path.join(PLUGIN_DIR, entry);
    const dest = path.join(STAGE_PLUGIN, entry);
    if (!fs.existsSync(src)) {
      console.warn(`[zip-plugin] warning: ${entry} not found, skipping`);
      continue;
    }
    copyRecursive(src, dest);
  }

  // Remove any existing zip to avoid appending.
  if (fs.existsSync(OUTPUT)) {
    fs.unlinkSync(OUTPUT);
  }

  // Create the zip. Use the system `zip` command (available on all CI
  // runners and most dev machines). Fall back to a tar-based approach if
  // zip is missing (unlikely on Linux/macOS).
  try {
    execSync('which zip', { stdio: 'ignore' });
    execSync(`zip -r "${OUTPUT}" slashed-bricks`, {
      cwd: STAGE,
      stdio: 'pipe',
    });
  } catch {
    // Fallback: use tar to create a zip-compatible archive is not reliable,
    // so we use Node's built-in zlib with a minimal zip implementation.
    createZipFromDir(STAGE_PLUGIN, OUTPUT, 'slashed-bricks');
  }

  // Report.
  const stat = fs.statSync(OUTPUT);
  const kb = (stat.size / 1024).toFixed(1);
  console.log(`[zip-plugin] \u2192 dist/slashed-bricks.zip (${kb} kB)`);

  // Clean up staging.
  clean(STAGE);
}

/**
 * Minimal zip creator using Node.js built-ins (no external dependencies).
 * Handles files and directories with DEFLATE compression.
 */
function createZipFromDir(sourceDir, outputPath, rootName) {
  const zlib = require('zlib');
  const files = [];

  function walk(dir, rel) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const entryRel = rel ? `${rel}/${entry}` : entry;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        files.push({ path: `${rootName}/${entryRel}/`, isDir: true });
        walk(full, entryRel);
      } else {
        files.push({
          path: `${rootName}/${entryRel}`,
          isDir: false,
          data: fs.readFileSync(full),
        });
      }
    }
  }

  // Add root directory entry.
  files.unshift({ path: `${rootName}/`, isDir: true });
  walk(sourceDir, '');

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.path, 'utf8');
    const uncompressed = file.isDir ? Buffer.alloc(0) : file.data;
    const compressed = file.isDir
      ? Buffer.alloc(0)
      : zlib.deflateRawSync(uncompressed, { level: 9 });
    const crc = crc32(uncompressed);

    // Local file header.
    const local = Buffer.alloc(30 + nameBuf.length);
    local.writeUInt32LE(0x04034b50, 0); // signature
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(file.isDir ? 0 : 8, 8); // compression (DEFLATE)
    local.writeUInt16LE(0, 10); // mod time
    local.writeUInt16LE(0, 12); // mod date
    local.writeUInt32LE(crc, 14); // crc-32
    local.writeUInt32LE(compressed.length, 18); // compressed size
    local.writeUInt32LE(uncompressed.length, 22); // uncompressed size
    local.writeUInt16LE(nameBuf.length, 26); // file name length
    local.writeUInt16LE(0, 28); // extra field length
    nameBuf.copy(local, 30);

    localHeaders.push(Buffer.concat([local, compressed]));

    // Central directory header.
    const central = Buffer.alloc(46 + nameBuf.length);
    central.writeUInt32LE(0x02014b50, 0); // signature
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6); // version needed
    central.writeUInt16LE(0, 8); // flags
    central.writeUInt16LE(file.isDir ? 0 : 8, 10); // compression
    central.writeUInt16LE(0, 12); // mod time
    central.writeUInt16LE(0, 14); // mod date
    central.writeUInt32LE(crc, 16); // crc-32
    central.writeUInt32LE(compressed.length, 20); // compressed size
    central.writeUInt32LE(uncompressed.length, 24); // uncompressed size
    central.writeUInt16LE(nameBuf.length, 28); // file name length
    central.writeUInt16LE(0, 30); // extra field length
    central.writeUInt16LE(0, 32); // file comment length
    central.writeUInt16LE(0, 34); // disk number start
    central.writeUInt16LE(0, 36); // internal file attributes
    central.writeUInt32LE(file.isDir ? 0x10 : 0, 38); // external file attributes
    central.writeUInt32LE(offset, 42); // relative offset of local header
    nameBuf.copy(central, 46);

    centralHeaders.push(central);
    offset += local.length + compressed.length;
  }

  const centralDirBuf = Buffer.concat(centralHeaders);
  const centralDirOffset = offset;

  // End of central directory record.
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk with central dir
  eocd.writeUInt16LE(files.length, 8); // entries on this disk
  eocd.writeUInt16LE(files.length, 10); // total entries
  eocd.writeUInt32LE(centralDirBuf.length, 12); // central dir size
  eocd.writeUInt32LE(centralDirOffset, 16); // central dir offset
  eocd.writeUInt16LE(0, 20); // comment length

  const zipBuf = Buffer.concat([...localHeaders, centralDirBuf, eocd]);
  fs.writeFileSync(outputPath, zipBuf);
}

/**
 * CRC-32 (ISO 3720) implementation.
 */
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

main();
