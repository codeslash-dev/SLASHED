/**
 * Apply BEM classes to a subtree in one pass.
 *
 * Four modes:
 *   add      — attach new BEM classes (keep any existing classes)
 *   rename   — detach old classes, create new ones seeded with old settings
 *   replace  — detach old classes, create new ones with empty settings
 *   modifier — keep existing classes, append a --modifier class
 *
 * @module apply
 */

import { slugify } from './slugify.js';
import * as api from './bricks-api.js';

/**
 * @param {object} opts
 * @param {string} opts.rootId
 * @param {Array<{id:string, name:string, modifier:string, include:boolean}>} opts.rows
 * @param {'add'|'rename'|'replace'|'modifier'} opts.mode
 * @param {boolean} opts.syncLabels
 * @returns {{ok:true, count:number} | {ok:false, error:string}}
 */
export function applyToSubtree({ rootId, rows, mode, syncLabels }) {
  const blockRow = rows.find(r => r.id === rootId);
  if (!blockRow) return { ok: false, error: 'Root row missing.' };

  const blockName = slugify(blockRow.name);
  if (!blockName) return { ok: false, error: 'Block name is empty.' };

  const globalClasses = api.getGlobalClasses();
  let count = 0;

  try {
  for (const row of rows) {
    if (!row.include) continue;

    const isRoot = row.id === rootId;
    const el = api.findElement(row.id);
    if (!el) continue;

    // Build class name
    let baseClass;
    if (isRoot) {
      baseClass = blockName;
    } else {
      const elemSlug = slugify(row.name);
      if (!elemSlug) continue;
      baseClass = `${blockName}__${elemSlug}`;
    }

    // Apply modifier suffix when in modifier mode
    let finalClass = baseClass;
    if (mode === 'modifier' && row.modifier) {
      const modSlug = slugify(row.modifier);
      if (!modSlug) continue;
      finalClass = `${baseClass}--${modSlug}`;
    }

    // Read current classes on this element
    const currentIds = readClassIds(el.settings);

    // Determine seed settings for the new class (rename copies from first old)
    let seed = {};
    if (mode === 'rename' && currentIds.length > 0) {
      const firstOld = globalClasses.find(c => c && c.id === currentIds[0]);
      if (firstOld && firstOld.settings) {
        seed = JSON.parse(JSON.stringify(firstOld.settings));
      }
    }

    // Create or find the target global class
    const newClassId = api.upsertGlobalClass(finalClass, seed);

    // Build the new class list for this element
    let nextIds;
    switch (mode) {
      case 'add':
      case 'modifier':
        // Keep existing, append new (avoid duplicates)
        nextIds = currentIds.includes(newClassId) ? currentIds : [...currentIds, newClassId];
        break;
      case 'rename':
      case 'replace':
        // Replace all old classes with just the new one
        nextIds = [newClassId];
        break;
      default:
        nextIds = [newClassId];
    }

    api.setElementClasses(row.id, nextIds);

    // Sync label if enabled (skip for modifier mode — label reflects identity, not state)
    if (syncLabels && mode !== 'modifier') {
      const label = labelFromClass(finalClass, blockName);
      if (label) api.setElementLabel(row.id, label);
    }

    count++;
  }
  } catch (err) {
    return { ok: false, error: `Operation failed mid-apply: ${err.message}` };
  }

  if (count === 0) {
    return { ok: false, error: 'No elements were modified. The subtree may have changed.' };
  }

  return { ok: true, count };
}

/** Read _cssGlobalClasses as a flat array of string ids. */
function readClassIds(settings) {
  const raw = settings?._cssGlobalClasses;
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : Object.values(raw);
  return arr.filter(id => typeof id === 'string' && id.length > 0);
}

/** Title-case the element part of a class name for the structure label. */
function labelFromClass(className, blockName) {
  let s = className;
  if (s === blockName) return titleCase(blockName.replace(/-/g, ' '));
  if (s.startsWith(blockName + '__')) s = s.slice(blockName.length + 2);
  s = s.replace(/--.+$/, '');
  return titleCase(s.replace(/-/g, ' '));
}

function titleCase(s) {
  return s.replace(/(^|\s)([a-z])/g, (_, sp, ch) => sp + ch.toUpperCase());
}
