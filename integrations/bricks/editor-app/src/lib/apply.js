/**
 * Apply BEM classes to a subtree in one pass.
 *
 * Five modes:
 *   add      — attach new BEM classes (keep any existing classes).
 *   rename   — detach old classes, create new ones seeded with old settings.
 *   replace  — detach old classes, create new ones with empty settings.
 *   modifier — keep existing classes, append a `--modifier` class.
 *   migrate  — keep existing classes, lift allowlisted element-settings
 *              keys (padding, color, etc.) up into a new global class
 *              and remove them from the element.
 *
 * Sibling auto-numbering
 * ----------------------
 * Two rows under the same block can resolve to the same final class
 * name (e.g. two `image` rows both producing `card__image`). A pre-pass
 * detects in-plan collisions and appends `-1`, `-2`, … in document
 * order to disambiguate. The pre-pass respects row provenance:
 *   - `suggestedFrom: 'user'` rows are treated as authoritative and
 *     never auto-numbered. Two user-typed rows colliding is a hard
 *     validation error.
 *   - `suggestedFrom: 'element-type' | 'fallback'` rows accept the
 *     numeric suffix in document order.
 *
 * Skip toggle
 * -----------
 * Rows with `include: false` are excluded from operations *and* from
 * the collision tally — a skipped row never claims a number. This
 * lets the user open the panel on a 12-element subtree, uncheck two
 * rows they don't want to touch, and apply the rest atomically without
 * leaving the panel.
 *
 * @module apply
 */

import { slugify } from './slugify.js';
import { MIGRATE_ALLOWLIST } from './migrate-keys.js';
import * as api from './bricks-api.js';

const VALID_MODES = new Set(['add', 'rename', 'replace', 'modifier', 'migrate']);

/**
 * @typedef {Object} Row
 * @property {string} id - Bricks element id.
 * @property {number} depth - 0 = root, > 0 = descendant.
 * @property {string} name - Slugifiable label (block name for root, element
 *   label otherwise).
 * @property {string} modifier - Slugifiable modifier (only used when
 *   mode is 'modifier').
 * @property {boolean} include - When false the row is skipped (no mutations,
 *   no collision tally, no preflight).
 * @property {'user'|'element-type'|'fallback'|'auto-number'} [suggestedFrom]
 * @property {string[]} [migrateKeys] - element-settings keys to lift into
 *   the new class on a 'migrate' apply. Already filtered by the
 *   allowlist by the caller; we re-filter here as a defense-in-depth
 *   guard against tampering.
 */

/**
 * @param {object} opts
 * @param {string} opts.rootId
 * @param {Row[]} opts.rows
 * @param {'add'|'rename'|'replace'|'modifier'|'migrate'} opts.mode
 * @param {boolean} opts.syncLabels
 * @returns {{ok:true, count:number} | {ok:false, error:string}}
 */
export function applyToSubtree({ rootId, rows, mode, syncLabels }) {
  if (!VALID_MODES.has(mode)) {
    return { ok: false, error: `Invalid mode: ${mode}` };
  }

  const blockRow = rows.find(r => r.id === rootId);
  if (!blockRow) return { ok: false, error: 'Root row missing.' };

  const blockName = slugify(blockRow.name);
  if (!blockName) return { ok: false, error: 'Block name is empty.' };

  // 1. Build per-row operations with intended (pre-numbering) class names.
  const ops = [];
  for (const row of rows) {
    if (!row.include) continue;
    const isRoot = row.id === rootId;

    let baseClass;
    if (isRoot) {
      baseClass = blockName;
    } else {
      const elemSlug = slugify(row.name);
      if (!elemSlug) continue;
      baseClass = `${blockName}__${elemSlug}`;
    }

    let finalClass = baseClass;
    if (mode === 'modifier') {
      const modSlug = slugify(row.modifier);
      if (!modSlug) continue;
      finalClass = `${baseClass}--${modSlug}`;
    }

    ops.push({
      row,
      isRoot,
      finalClass,
      suggestedFrom: row.suggestedFrom || 'user',
    });
  }

  if (ops.length === 0) {
    return { ok: false, error: 'No rows to apply. Include at least one row.' };
  }

  // 2. Sibling auto-numbering (in-plan collision resolver).
  const numberingResult = applyAutoNumbering(ops);
  if (!numberingResult.ok) return numberingResult;

  // 3. Apply each op against live state.
  let count = 0;
  try {
    const globalClasses = api.getGlobalClasses();

    for (const op of ops) {
      const el = api.findElement(op.row.id);
      if (!el) continue;

      const currentIds = readClassIds(el.settings);

      // Determine seed settings for the new class.
      let seed = {};
      if (mode === 'rename' && currentIds.length > 0) {
        const firstOld = globalClasses.find(c => c && c.id === currentIds[0]);
        if (firstOld && firstOld.settings) {
          seed = JSON.parse(JSON.stringify(firstOld.settings));
        }
      } else if (mode === 'migrate') {
        seed = collectMigrateSeed(el.settings, op.row.migrateKeys);
      }

      const newClassId = api.upsertGlobalClass(op.finalClass, seed);

      // Build the new class list for this element.
      let nextIds;
      switch (mode) {
        case 'add':
        case 'modifier':
        case 'migrate':
          nextIds = currentIds.includes(newClassId)
            ? currentIds
            : [...currentIds, newClassId];
          break;
        case 'rename':
        case 'replace':
          nextIds = [newClassId];
          break;
      }

      api.setElementClasses(op.row.id, nextIds);

      // For 'migrate', remove the lifted keys from the element settings.
      // Done AFTER setElementClasses so a thrown setElementClasses can't
      // leave the element in a half-stripped state.
      if (mode === 'migrate') {
        removeMigratedKeys(el.settings, op.row.migrateKeys);
      }

      // Sync label if enabled (skip for modifier — label reflects identity).
      if (syncLabels && mode !== 'modifier') {
        const label = labelFromClass(op.finalClass, blockName);
        if (label) api.setElementLabel(op.row.id, label);
      }

      count++;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Operation failed mid-apply: ${message}` };
  }

  if (count === 0) {
    return { ok: false, error: 'No elements were modified. The subtree may have changed.' };
  }

  return { ok: true, count };
}


/**
 * Detect intra-plan collisions and assign `-1`, `-2`, … suffixes.
 *
 * Rules:
 *   - Single-element groups: no change.
 *   - Multi-element group with > 1 user-typed entries: hard error (the
 *     user has explicitly typed the same name twice; we won't silently
 *     mangle it).
 *   - Multi-element group with ≤ 1 user-typed entries: any
 *     non-user entries get sequential `-1`, `-2`, … in document order.
 *     A user-typed entry, if present, keeps its bare name.
 *   - Modifier-mode operations are NOT auto-numbered: the modifier
 *     suffix already disambiguates ('block__title--lg' vs '--sm'),
 *     and adding a numeric suffix to a modifier produces names that
 *     read poorly ('block__title--lg-2').
 *
 * Mutates ops[].finalClass in place. Returns a result object.
 *
 * @param {Array<{row:Row, finalClass:string, suggestedFrom:string}>} ops
 * @returns {{ok:true} | {ok:false, error:string}}
 */
function applyAutoNumbering(ops) {
  const groups = new Map();
  for (const op of ops) {
    // Skip modifier-suffixed names from the collision tally — see rule
    // above. We still detect duplicates among them, just don't number.
    const list = groups.get(op.finalClass) || [];
    list.push(op);
    groups.set(op.finalClass, list);
  }

  for (const [name, group] of groups) {
    if (group.length === 1) continue;

    const userTyped = group.filter(o => o.suggestedFrom === 'user');
    if (userTyped.length > 1) {
      return {
        ok: false,
        error: `"${name}" is used by ${userTyped.length} rows. Edit one to make it unique.`,
      };
    }

    // Modifier-mode duplicates can't be auto-numbered cleanly. Surface
    // as an error rather than producing 'block__title--lg-2'.
    if (name.includes('--')) {
      return {
        ok: false,
        error: `"${name}" is used by ${group.length} rows. Modifier names must be unique within a plan.`,
      };
    }

    let n = 1;
    for (const op of group) {
      if (op.suggestedFrom === 'user') continue;
      op.finalClass = `${name}-${n++}`;
      op.suggestedFrom = 'auto-number';
    }
  }

  return { ok: true };
}


/**
 * Build the seed settings for a 'migrate' op: a deep clone of the
 * subset of the element's settings that the row marked for migration
 * AND that are still on the migration allowlist.
 *
 * Re-filtering against the allowlist here is intentional defense-in-
 * depth: the panel UI populates `row.migrateKeys` from the allowlist,
 * but a tampered DOM (e.g. dev-tools editing) could send arbitrary
 * keys. Allowlist re-check guarantees we never lift unknown keys.
 *
 * @param {object} elementSettings
 * @param {string[]|undefined} requestedKeys
 * @returns {object}
 */
function collectMigrateSeed(elementSettings, requestedKeys) {
  if (!elementSettings || !Array.isArray(requestedKeys)) return {};
  const seed = {};
  for (const key of requestedKeys) {
    if (!MIGRATE_ALLOWLIST.has(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(elementSettings, key)) continue;
    seed[key] = JSON.parse(JSON.stringify(elementSettings[key]));
  }
  return seed;
}

/**
 * Strip the migrated keys from the element-settings blob in place.
 *
 * @param {object} elementSettings
 * @param {string[]|undefined} keys
 */
function removeMigratedKeys(elementSettings, keys) {
  if (!elementSettings || !Array.isArray(keys)) return;
  for (const key of keys) {
    if (!MIGRATE_ALLOWLIST.has(key)) continue;
    if (Object.prototype.hasOwnProperty.call(elementSettings, key)) {
      delete elementSettings[key];
    }
  }
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
