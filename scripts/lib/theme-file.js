/**
 * The SLASHED theme file — a portable, reviewable snapshot of a token override
 * set.
 *
 * The configurator could already persist overrides two ways, and neither is a
 * file you can put in a repository:
 *
 *   - localStorage (savedThemes.ts) — trapped in one browser profile.
 *   - the share link (codec.ts) — a compressed base64url blob. Ideal for its
 *     job (a short URL), useless for review: it is opaque in a diff, and it is
 *     keyed by numeric token id.
 *
 * A theme file is keyed by token NAME and pretty-printed with sorted keys, so
 * `git diff` shows `--sf-color-primary-source-light` changing value, which is
 * the whole point. It is the artifact you hand a client, commit next to the
 * CSS it themes, or review in a pull request.
 *
 * Consumed by scripts/migrate-theme.js and (mirrored through
 * configurator/src/data/) by the configurator's import/export.
 */

/**
 * Bumped only when the file SHAPE changes (a new/renamed/removed field), never
 * when the token set changes — token drift is handled by migrateOverrides()
 * against docs/token-renames.json, which is versionless by design.
 */
export const THEME_SCHEMA_VERSION = 1;

export const THEME_SCHEMA_URL = 'https://slashed.codeslash.dev/schema/theme/v1.json';

/** Well-formed `--sf-*` custom property name. */
const TOKEN_NAME_RE = /^--sf-[a-z0-9-]+$/;

/**
 * Characters that would let a value break out of the `--token: value;`
 * declaration it is written into and inject arbitrary CSS. Mirrors the intent
 * of the configurator's sanitizeValue(), but rejects instead of silently
 * rewriting: a CLI processing a file from disk should say what is wrong, not
 * quietly alter the user's data.
 */
const UNSAFE_VALUE_RE = /[;{}]|\/\*|\*\//;

/**
 * Validate and normalise a parsed theme file.
 *
 * @param {unknown} raw parsed JSON (not a string)
 * @returns {{ theme: null | { schemaVersion: number, slashedVersion: string|null, name: string|null, overrides: Record<string,string> }, errors: string[] }}
 */
export function validateThemeFile(raw) {
  const errors = [];
  const fail = (msg) => {
    errors.push(msg);
    return { theme: null, errors };
  };

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fail('theme file must be a JSON object.');
  }

  const { schemaVersion, overrides, name, slashedVersion } = /** @type {any} */ (raw);

  if (!Number.isInteger(schemaVersion)) {
    return fail('`schemaVersion` is missing or not an integer.');
  }
  if (schemaVersion < 1) {
    return fail(`\`schemaVersion\` must be >= 1 (got ${schemaVersion}).`);
  }
  if (schemaVersion > THEME_SCHEMA_VERSION) {
    // Refusing beats guessing: a newer shape may carry fields whose meaning we
    // cannot know, and silently ignoring them would corrupt the theme.
    return fail(
      `\`schemaVersion\` ${schemaVersion} is newer than this SLASHED understands ` +
        `(max ${THEME_SCHEMA_VERSION}). Upgrade SLASHED to read this file.`,
    );
  }

  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    return fail('`overrides` is missing or not an object.');
  }
  if (name != null && typeof name !== 'string') errors.push('`name` must be a string when present.');
  if (slashedVersion != null && typeof slashedVersion !== 'string') {
    errors.push('`slashedVersion` must be a string when present.');
  }

  const clean = {};
  for (const [key, value] of Object.entries(overrides)) {
    if (!TOKEN_NAME_RE.test(key)) {
      errors.push(`overrides["${key}"]: not a well-formed --sf-* token name.`);
      continue;
    }
    if (typeof value !== 'string') {
      errors.push(`overrides["${key}"]: value must be a string (got ${typeof value}).`);
      continue;
    }
    if (UNSAFE_VALUE_RE.test(value)) {
      errors.push(
        `overrides["${key}"]: value contains CSS-breaking characters (; { } or comment markers).`,
      );
      continue;
    }
    clean[key] = value.trim();
  }

  if (errors.length) return { theme: null, errors };

  return {
    theme: {
      schemaVersion,
      slashedVersion: typeof slashedVersion === 'string' ? slashedVersion : null,
      name: typeof name === 'string' ? name : null,
      overrides: clean,
    },
    errors: [],
  };
}

/**
 * Parse theme-file JSON text.
 * @param {string} text
 * @returns {ReturnType<typeof validateThemeFile>}
 */
export function parseThemeFile(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch (err) {
    return { theme: null, errors: [`not valid JSON (${err.message}).`] };
  }
  return validateThemeFile(raw);
}

/**
 * Migrate an override set onto the current token API.
 *
 * Deliberately never drops an override it does not understand: an unrecognised
 * token is REPORTED, not deleted. The map is knowledge about the framework's
 * own history, and absence of knowledge is not evidence the user was wrong —
 * they may be theming a token from a build this checkout has never seen.
 *
 * @param {Record<string,string>} overrides
 * @param {object} opts
 * @param {Record<string,string>} opts.renames   old name → current name
 * @param {Record<string,string>} opts.removals  dead name → guidance
 * @param {Set<string>} [opts.live]              current token names; omit to skip the unknown-token report
 * @returns {{
 *   overrides: Record<string,string>,
 *   renamed: Array<{ from: string, to: string }>,
 *   removed: Array<{ name: string, reason: string }>,
 *   unknown: string[],
 *   collisions: Array<{ from: string, to: string, kept: string }>,
 * }}
 */
export function migrateOverrides(overrides, { renames = {}, removals = {}, live } = {}) {
  const out = {};
  const renamed = [];
  const removed = [];
  const unknown = [];
  const collisions = [];

  for (const key of Object.keys(overrides).sort()) {
    const value = overrides[key];

    if (Object.prototype.hasOwnProperty.call(removals, key)) {
      removed.push({ name: key, reason: removals[key] });
      continue;
    }

    const target = renames[key];
    if (target) {
      // The file may already carry the NEW name too (e.g. it was migrated
      // halfway, or the user set both). The explicit current-name value wins —
      // it is the one the author most recently meant.
      if (Object.prototype.hasOwnProperty.call(overrides, target)) {
        collisions.push({ from: key, to: target, kept: overrides[target] });
        continue;
      }
      out[target] = value;
      renamed.push({ from: key, to: target });
      continue;
    }

    if (live && !live.has(key)) unknown.push(key);
    out[key] = value;
  }

  return { overrides: sortKeys(out), renamed, removed, unknown, collisions };
}

/** Return a new object with keys in sorted order (stable, diff-friendly output). */
export function sortKeys(obj) {
  const out = {};
  for (const key of Object.keys(obj).sort()) out[key] = obj[key];
  return out;
}

/**
 * Serialise a theme file. Keys are sorted and the output is pretty-printed with
 * a trailing newline so re-exporting an unchanged theme produces an empty diff.
 *
 * @param {object} theme
 * @param {Record<string,string>} theme.overrides
 * @param {string} [theme.name]
 * @param {string} [theme.slashedVersion]
 * @returns {string}
 */
export function serializeThemeFile({ overrides, name, slashedVersion }) {
  const doc = {
    $schema: THEME_SCHEMA_URL,
    schemaVersion: THEME_SCHEMA_VERSION,
    ...(slashedVersion ? { slashedVersion } : {}),
    ...(name ? { name } : {}),
    overrides: sortKeys(overrides ?? {}),
  };
  return `${JSON.stringify(doc, null, 2)}\n`;
}
