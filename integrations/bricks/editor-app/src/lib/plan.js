/**
 * Plan builder and transactional executor.
 *
 * `buildPlan` is a PURE function: given the subtree snapshot, mode,
 * user inputs, policy, and the current global-classes list it returns
 * a fully-serializable {@link Plan}. It performs no I/O and mutates
 * nothing — making it trivially unit-testable and safely sendable to
 * the preflight REST endpoint as JSON.
 *
 * `applyPlan` is IMPURE: it commits a plan to Bricks state via the
 * {@link module:bricks-api} seam and rolls back on throw. Each
 * operation is idempotent so a plan can be safely re-applied to the
 * post-state with no further effect.
 *
 * @module plan
 */

import { defaultPolicy } from './policy.js';
import { isReserved } from './reserved-names.js';
import { slugify } from './slugify.js';
import {
  validateName,
  buildModifierName,
} from './bem.js';

/**
 * Bricks element-setting keys that reBEMer's "Migrate ID styles" mode
 * is allowed to move into a class. Allowlist (not denylist) so unknown
 * keys are NEVER migrated — when Bricks introduces a new style key
 * the safe default is "leave it alone" rather than "treat as style".
 *
 * Mirrored in PHP as Slashed_Bricks_ReBEMer_Policy::style_keys() and
 * filterable via slashed_bricks/rebemer_style_keys for advanced users.
 */
export const STYLE_KEYS_ALLOWLIST = Object.freeze(
  new Set([
    // Layout / sizing
    '_width', '_height', '_minWidth', '_minHeight', '_maxWidth', '_maxHeight',
    '_padding', '_margin', '_gap',
    '_display', '_position', '_top', '_right', '_bottom', '_left',
    '_alignItems', '_justifyContent', '_alignSelf', '_order',
    '_flexDirection', '_flexWrap', '_flexGrow', '_flexShrink',
    '_gridTemplateColumns', '_gridTemplateRows', '_gridGap',
    '_gridColumnGap', '_gridRowGap', '_overflow',
    // Typography
    '_typography', '_fontFamily', '_fontSize', '_fontWeight', '_lineHeight',
    '_letterSpacing', '_textAlign', '_textTransform', '_textDecoration',
    '_color',
    // Background / border / shadow / filters
    '_background', '_backgroundColor', '_backgroundImage',
    '_border', '_borderRadius', '_boxShadow', '_textShadow',
    '_opacity', '_filter', '_backdropFilter',
    // Transform / transition / animation / misc
    '_transform', '_transformOrigin', '_transition', '_animation',
    '_cursor', '_visibility', '_pointerEvents', '_zIndex',
  ])
);


/**
 * @typedef {Object} ClassUpsert
 * @property {string} name
 * @property {Object} seedSettings
 * @property {boolean} preferExisting
 *
 * @typedef {Object} Operation
 * @property {string} elementId
 * @property {'block'|'element'} role
 * @property {string} finalClassName
 * @property {string[]} oldClassIds  detach from this element on apply
 * @property {string[]} keepClassIds preserve on this element on apply
 * @property {ClassUpsert} upsert
 * @property {{from:'element-settings', keys:string[]} | null} migrateFrom
 * @property {string | null} newLabel
 *
 * @typedef {Object} Plan
 * @property {'add'|'rename'|'replace'|'modifier'|'migrate'} mode
 * @property {string} rootId
 * @property {string} blockName
 * @property {Operation[]} operations
 * @property {import('./policy.js').Policy} policy
 *
 * @typedef {Object} BuildPlanInput
 * @property {string} rootId
 * @property {Array<{id:string, depth:number, label?:string, settings?:object}>} subtree
 *   Root element + descendants in DOM order, depth relative to root.
 * @property {'add'|'rename'|'replace'|'modifier'|'migrate'} mode
 * @property {Array<{id:string, name:string, modifier:string, include:boolean}>} rows
 * @property {import('./policy.js').Policy} [policy]
 * @property {Array<{id:string, name:string, settings?:object}>} [existingClasses]
 * @property {boolean} [syncLabels]
 *
 * @typedef {{rowId:string, code:string}} BuildError
 */

/**
 * Read the live class ids attached to an element. Bricks has stored
 * `_cssGlobalClasses` as both an array and an object historically;
 * Object.values handles both shapes.
 */
function readClassIds(settings) {
  const raw = settings && settings._cssGlobalClasses;
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : Object.values(raw);
  return arr.filter((id) => typeof id === 'string' && id.length > 0);
}

function deepClone(v) {
  if (v === null || typeof v !== 'object') return v;
  if (typeof structuredClone === 'function') return structuredClone(v);
  return JSON.parse(JSON.stringify(v));
}


/**
 * Title-case the part of a class name following its block prefix; the
 * result is what gets written into element.label when syncLabels is on.
 * Modifier suffixes (`--mod`) are stripped — labels reflect identity,
 * not state.
 */
function labelFromClass(className, blockName) {
  let s = className;
  if (s === blockName) {
    return titleCase(blockName.replace(/-/g, ' '));
  }
  if (s.startsWith(blockName + '__')) s = s.slice(blockName.length + 2);
  s = s.replace(/--.+$/, '');
  return titleCase(s.replace(/-/g, ' '));
}

function titleCase(s) {
  return s.replace(/(^|\s)([\p{Ll}\p{Lo}])/gu, (_, sp, ch) => sp + ch.toUpperCase());
}

/**
 * Build a transactional plan from inputs. Pure: no I/O, no mutation.
 *
 * @param {BuildPlanInput} input
 * @returns {{ok:true, plan:Plan} | {ok:false, errors:BuildError[]}}
 */
export function buildPlan(input) {
  const policy = input.policy || defaultPolicy();
  const existingClasses = Array.isArray(input.existingClasses) ? input.existingClasses : [];
  const syncLabels = input.syncLabels !== false;
  const rowsById = new Map((input.rows || []).map((r) => [r.id, r]));

  // Resolve block name from the root row. We slugify + validate
  // directly (rather than going through buildBlockName) so the
  // specific failure code (empty / invalid_chars / reserved) is
  // surfaced to the UI instead of a generic "invalid_block_name".
  const rootRow = rowsById.get(input.rootId);
  if (!rootRow) {
    return { ok: false, errors: [{ rowId: input.rootId, code: 'missing_root_row' }] };
  }
  const blockName = slugify(rootRow.name, policy);
  const blockValid = validateName(blockName, 'block', policy);
  if (!blockValid.ok) {
    return { ok: false, errors: [{ rowId: input.rootId, code: blockValid.code }] };
  }

  // Enforce maxDepth (0 = unlimited).
  if (policy.maxDepth > 0) {
    const tooDeep = input.subtree.find((el) => el.depth > policy.maxDepth);
    if (tooDeep) return { ok: false, errors: [{ rowId: tooDeep.id, code: 'max_depth_exceeded' }] };
  }


  const operations = [];
  const errors = [];
  const proposedNames = new Set();

  for (const subEl of input.subtree) {
    const row = rowsById.get(subEl.id);
    if (!row || !row.include) continue;

    const isRoot = subEl.id === input.rootId;

    // Compose the base class name (block or block__element).
    let baseClass;
    if (isRoot) {
      baseClass = blockName;
    } else {
      const elemSlug = slugify(row.name, policy);
      const elemValid = validateName(elemSlug, 'element', policy);
      if (!elemValid.ok) {
        errors.push({ rowId: row.id, code: elemValid.code });
        continue;
      }
      baseClass = `${blockName}__${elemSlug}`;
    }

    // Apply modifier when in modifier mode and the row carried one.
    let finalClassName = baseClass;
    if (input.mode === 'modifier' && row.modifier) {
      finalClassName = buildModifierName(baseClass, row.modifier, policy);
      if (!finalClassName) {
        errors.push({ rowId: row.id, code: 'invalid_modifier' });
        continue;
      }
    }

    // Reserved-name check on the final composed name (defense in depth:
    // server-side preflight will repeat this).
    const reserved = isReserved(finalClassName, policy);
    if (reserved.reserved) {
      errors.push({ rowId: row.id, code: 'reserved' });
      continue;
    }

    // Duplicate-within-plan check: two rows resolving to the same name
    // would race on apply.
    if (proposedNames.has(finalClassName)) {
      errors.push({ rowId: row.id, code: 'duplicate_in_plan' });
      continue;
    }
    proposedNames.add(finalClassName);


    const currentClassIds = readClassIds(subEl.settings);

    let oldClassIds = [];
    let keepClassIds = [];
    let migrateFrom = null;
    let seedSettings = {};

    switch (input.mode) {
      case 'add':
        // Subtree had no classes (or user accepts adding alongside).
        oldClassIds = [];
        keepClassIds = currentClassIds;
        break;

      case 'rename': {
        // Detach all old classes from this element. Globally they stay
        // alive — Bricks owns global deletion. Seed the new class with
        // the first old class' settings so styles carry over.
        oldClassIds = currentClassIds;
        keepClassIds = [];
        if (currentClassIds.length > 0) {
          const firstOld = existingClasses.find((c) => c.id === currentClassIds[0]);
          if (firstOld && firstOld.settings) seedSettings = deepClone(firstOld.settings);
        }
        break;
      }

      case 'replace':
        // Detach old classes; the new class starts with empty settings.
        oldClassIds = currentClassIds;
        keepClassIds = [];
        break;

      case 'modifier':
        // Additive: keep base classes, append a --modifier class.
        oldClassIds = [];
        keepClassIds = currentClassIds;
        break;

      case 'migrate': {
        // Move element-settings keys (only those on the allowlist) into
        // the new class's settings. The element's other settings are
        // preserved verbatim.
        oldClassIds = [];
        keepClassIds = currentClassIds;
        const keys = [];
        if (subEl.settings && typeof subEl.settings === 'object') {
          for (const key of Object.keys(subEl.settings)) {
            if (STYLE_KEYS_ALLOWLIST.has(key)) {
              keys.push(key);
              seedSettings[key] = deepClone(subEl.settings[key]);
            }
          }
        }
        migrateFrom = keys.length > 0 ? { from: 'element-settings', keys } : null;
        break;
      }

      default:
        errors.push({ rowId: row.id, code: 'invalid_mode' });
        continue;
    }


    const newLabel =
      syncLabels && input.mode !== 'modifier'
        ? labelFromClass(finalClassName, blockName)
        : null;

    operations.push({
      elementId: subEl.id,
      role: isRoot ? 'block' : 'element',
      finalClassName,
      oldClassIds,
      keepClassIds,
      upsert: {
        name: finalClassName,
        seedSettings,
        // Always prefer attaching to an existing global class with the
        // same name. Same-name collisions are surfaced by preflight as
        // nameCollisions so the user is warned before apply.
        preferExisting: true,
      },
      migrateFrom,
      newLabel,
    });
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    plan: {
      mode: input.mode,
      rootId: input.rootId,
      blockName,
      operations,
      policy,
    },
  };
}


/**
 * Apply a plan via the bricks-api seam, wrapped in snapshot+rollback.
 * On any throw the snapshot is restored verbatim and the original
 * error is returned in the result; on success the snapshot is
 * returned so the caller can push it onto the undo ring buffer.
 *
 * Idempotency: each operation is shaped so re-applying the same plan
 * to the post-state is a no-op (existing class is reused, classes
 * already on the element are not re-added, label is set to the same
 * string). This makes "apply twice" safe under network or UI retries.
 *
 * @param {Plan} plan
 * @param {*}    bricksApi
 * @returns {Promise<{ok:true, snapshot:object} | {ok:false, error:Error}>}
 */
export async function applyPlan(plan, bricksApi) {
  if (!plan || !Array.isArray(plan.operations)) {
    return { ok: false, error: new Error('rebemer:invalid_plan') };
  }

  // Pre-flight: every element still has to exist. Cheap to verify and
  // catches a stale plan (user deleted an element mid-edit).
  for (const op of plan.operations) {
    if (!bricksApi.findElement(op.elementId)) {
      return { ok: false, error: new Error(`rebemer:element_missing:${op.elementId}`) };
    }
  }

  const snapshot = bricksApi.snapshot(plan.operations);

  try {
    for (const op of plan.operations) {
      const classId = bricksApi.upsertGlobalClass(op.upsert);

      if (op.migrateFrom) {
        bricksApi.mutateElementSettings(op.elementId, (settings) => {
          for (const key of op.migrateFrom.keys) delete settings[key];
        });
      }

      // The kept ids may already include the new id (idempotent re-apply).
      const next = op.keepClassIds.filter((id) => id !== classId);
      next.push(classId);
      bricksApi.setElementClasses(op.elementId, next);

      if (op.newLabel !== null && op.newLabel !== undefined) {
        bricksApi.setElementLabel(op.elementId, op.newLabel);
      }
    }
    return { ok: true, snapshot };
  } catch (error) {
    bricksApi.restore(snapshot);
    return { ok: false, error };
  }
}
