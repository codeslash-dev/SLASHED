/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Unified override import.
 *
 * The header import used to have two silent, inconsistent paths: a `.json` file
 * REPLACED the whole state with no validation, while a `.css` file MERGED via a
 * loose regex — and a file with nothing recognisable just did nothing, with no
 * feedback. This parses either format through ONE pipeline:
 *
 *   1. detect JSON (flat map or a theme-file `{ tokens }`) vs CSS
 *   2. sanitise every value (codec.sanitizeValue) and drop keys that aren't a
 *      real `--sf-*` name or whose value is structurally unsafe (would be
 *      dropped on export anyway)
 *   3. migrate renamed/removed tokens and flag unknown ones (themeFile)
 *   4. return the cleaned overrides plus a report the caller can surface
 *
 * The caller decides merge vs replace; the default header flow merges, which is
 * the predictable, non-destructive choice for both formats.
 */
import { parseCSS, sanitizeValue } from "./codec";
import { migrateOverrides } from "./themeFile";
import { isStructurallySafe } from "./tokenModel";

export interface ImportReport {
  format: "json" | "css";
  /** Tokens accepted into the result. */
  accepted: number;
  /** Old names migrated to their current name. */
  renamed: number;
  /** Tokens dropped because the framework removed them. */
  removed: number;
  /** Accepted tokens that aren't part of this framework build. */
  unknown: number;
  /** Keys rejected for a bad name or an unsafe/empty value. */
  invalid: string[];
  /** True when the file couldn't be parsed into any tokens. */
  malformed: boolean;
}

export interface ImportResult {
  overrides: Record<string, string>;
  report: ImportReport;
}

const KEY_RE = /^--sf-[\w-]+$/;

function looksLikeJson(text: string): boolean {
  return text.trim().startsWith("{");
}

/** Extract a raw name→value map from JSON (flat, or a theme-file `{ tokens }`). */
function readJsonMap(text: string): { map: Record<string, string>; malformed: boolean } {
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data)) return { map: {}, malformed: true };
    const src =
      "tokens" in data && data.tokens && typeof data.tokens === "object"
        ? (data.tokens as Record<string, unknown>)
        : (data as Record<string, unknown>);
    const map: Record<string, string> = {};
    for (const [k, v] of Object.entries(src)) {
      if (typeof v === "string") map[k] = v;
    }
    return { map, malformed: false };
  } catch {
    return { map: {}, malformed: true };
  }
}

/**
 * Parse and validate an imported CSS or JSON override file.
 *
 * @param text      the raw file contents
 * @param filename  used (with a content sniff) to pick the JSON vs CSS path
 * @param liveTokens the set of token names in the current framework build
 */
export function parseImport(
  text: string,
  filename: string,
  liveTokens: Set<string>,
): ImportResult {
  const isJson = /\.json$/i.test(filename) || looksLikeJson(text);
  const { map: rawMap, malformed } = isJson
    ? readJsonMap(text)
    : { map: parseCSS(text), malformed: false };

  const cleaned: Record<string, string> = {};
  const invalid: string[] = [];
  for (const [key, value] of Object.entries(rawMap)) {
    if (!KEY_RE.test(key)) { invalid.push(key); continue; }
    const safe = sanitizeValue(value);
    if (!isStructurallySafe(safe)) { invalid.push(key); continue; }
    cleaned[key] = safe;
  }

  const migrated = migrateOverrides(cleaned, { live: liveTokens });

  return {
    overrides: migrated.overrides,
    report: {
      format: isJson ? "json" : "css",
      accepted: Object.keys(migrated.overrides).length,
      renamed: migrated.renamed.length,
      removed: migrated.removed.length,
      unknown: migrated.unknown.length,
      invalid,
      malformed: malformed && Object.keys(cleaned).length === 0,
    },
  };
}

/** A short human summary of an import for a status banner. */
export function summarizeImport(r: ImportReport): string {
  if (r.malformed) return "Import failed — the file has no recognisable SLASHED tokens.";
  if (r.accepted === 0) return "Nothing imported — no valid SLASHED tokens found.";
  const parts = [`Imported ${r.accepted} token${r.accepted === 1 ? "" : "s"}`];
  if (r.renamed) parts.push(`${r.renamed} migrated`);
  if (r.removed) parts.push(`${r.removed} removed`);
  if (r.unknown) parts.push(`${r.unknown} unknown`);
  if (r.invalid.length) parts.push(`${r.invalid.length} skipped`);
  return parts.join(" · ") + ".";
}
