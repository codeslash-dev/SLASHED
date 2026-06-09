#!/usr/bin/env node
// Promote the ## Unreleased section to a versioned heading on release.
// Usage: node scripts/changelog-release.js v0.6.0
//
// If ## Unreleased has hand-written content, it is kept as-is.
// If ## Unreleased is empty, content is auto-generated from conventional
// commits since the previous git tag.
// After promotion, a fresh ## Unreleased placeholder is re-inserted so
// the next development cycle has somewhere to write.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const tag = process.argv[2];
if (!tag) {
  console.error('Usage: changelog-release.js <version-tag>  (e.g. v0.6.0)');
  process.exit(1);
}

const version = tag.replace(/^v/, '');
const date = new Date().toISOString().slice(0, 10);
const changelogPath = path.resolve(import.meta.dirname, '..', 'CHANGELOG.md');

// Only these types produce changelog entries (plus breaking changes of any type).
const SECTION_LABELS = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance Improvements',
  revert: 'Reverts',
};

function commitsSinceLastTag(currentTag) {
  try {
    const allTags = execSync('git tag --sort=-version:refname', { encoding: 'utf8' })
      .trim().split('\n').filter(Boolean);
    const idx = allTags.indexOf(currentTag);
    const prevTag = idx !== -1 && idx + 1 < allTags.length ? allTags[idx + 1] : null;
    const range = prevTag ? `${prevTag}..HEAD` : 'HEAD';

    return execSync(`git log ${range} --no-merges --pretty=format:"%s"`, { encoding: 'utf8' })
      .trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function parseSubject(subject) {
  const m = subject.match(/^(\w+)(\([^)]*\))?(!)?:\s+(.+)$/);
  if (!m) return null;
  const [, type, scopeRaw, bang, desc] = m;
  const scope = scopeRaw ? scopeRaw.slice(1, -1) : null;
  const breaking = bang === '!';
  const prM = desc.match(/\(#(\d+)\)$/);
  const pr = prM ? prM[1] : null;
  const description = desc.replace(/\s*\(#\d+\)$/, '').trim();
  return { type, scope, breaking, description, pr };
}

function formatLine({ scope, description, pr }) {
  return `- ${scope ? `**${scope}:** ` : ''}${description}${pr ? ` (#${pr})` : ''}`;
}

function generateContent(currentTag) {
  const subjects = commitsSinceLastTag(currentTag);
  const sections = Object.fromEntries(
    ['breaking', ...Object.keys(SECTION_LABELS)].map(k => [k, []])
  );

  for (const subject of subjects) {
    const c = parseSubject(subject);
    if (!c) continue;
    if (c.breaking) sections.breaking.push(c);
    else if (c.type in SECTION_LABELS) sections[c.type].push(c);
  }

  const parts = [];
  if (sections.breaking.length) {
    parts.push('### Breaking Changes', ...sections.breaking.map(formatLine), '');
  }
  for (const [type, label] of Object.entries(SECTION_LABELS)) {
    if (sections[type].length) {
      parts.push(`### ${label}`, ...sections[type].map(formatLine), '');
    }
  }

  return parts.join('\n').trimEnd();
}

// --- Manipulate CHANGELOG ---

const lines = fs.readFileSync(changelogPath, 'utf8').split('\n');
const unreleasedIdx = lines.findIndex(l => /^## Unreleased\s*$/.test(l));

if (unreleasedIdx === -1) {
  console.log('No ## Unreleased section — nothing to promote.');
} else {
  const nextIdx = lines.findIndex((l, i) => i > unreleasedIdx && /^## /.test(l));
  const sectionEnd = nextIdx !== -1 ? nextIdx : lines.length;
  const existingContent = lines.slice(unreleasedIdx + 1, sectionEnd).join('\n').trim();

  const body = existingContent || generateContent(tag);
  const newSection = [`## [${version}] - ${date}`, ''];
  if (body) newSection.push(...body.split('\n'), '');

  lines.splice(unreleasedIdx, sectionEnd - unreleasedIdx, ...newSection);

  const src = existingContent ? 'hand-written content preserved' : 'auto-generated from commits';
  console.log(`CHANGELOG.md: promoted ## Unreleased → ## [${version}] - ${date} (${src})`);
}

// Re-insert ## Unreleased placeholder before the first versioned section.
const firstVersionedIdx = lines.findIndex(l => /^## \[/.test(l));
if (firstVersionedIdx !== -1) {
  lines.splice(firstVersionedIdx, 0, '## Unreleased', '');
}

fs.writeFileSync(changelogPath, lines.join('\n'), 'utf8');
