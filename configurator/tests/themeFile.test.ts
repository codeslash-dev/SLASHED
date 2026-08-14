/**
 * Theme-file import/export, plus the parity contract with the framework's
 * Node implementation.
 *
 * src/lib/themeFile.ts and scripts/lib/theme-file.js are two implementations of
 * one format. They exist separately on purpose (the configurator cannot import
 * across the package boundary at runtime — see the header of themeFile.ts), so
 * the drift risk is real and has to be tested rather than commented about.
 *
 * Vitest runs in Node, so this test — unlike the shipped bundle — CAN import
 * both and run them over the same fixtures.
 */
import { describe, test, expect } from "vitest";
import {
  THEME_SCHEMA_VERSION,
  parseThemeFile,
  migrateOverrides,
  serializeThemeFile,
  validateThemeFile,
} from "../src/lib/themeFile";
import * as node from "../../scripts/lib/theme-file.js";
import renameMap from "../src/data/token-renames.generated.json";

/** The rename map as the Node implementation takes it (it is passed explicitly there). */
const nodeOpts = {
  renames: (renameMap as any).renames,
  removals: (renameMap as any).removals,
};

const FIXTURES: Array<{ label: string; raw: unknown }> = [
  {
    label: "well-formed minimal",
    raw: { schemaVersion: 1, overrides: { "--sf-color-primary-source-light": "#3b5bdb" } },
  },
  {
    label: "legacy names needing migration",
    raw: {
      schemaVersion: 1,
      slashedVersion: "0.6.10",
      name: "Acme",
      overrides: {
        "--sf-color-primary-light": "#3b5bdb",
        "--sf-color-error": "#e03131",
        "--sf-opacity-25": "0.25",
        "--sf-radius-m": "10px",
      },
    },
  },
  { label: "not an object", raw: "nope" },
  { label: "missing schemaVersion", raw: { overrides: {} } },
  { label: "future schemaVersion", raw: { schemaVersion: 99, overrides: {} } },
  { label: "bad token name", raw: { schemaVersion: 1, overrides: { "color-primary": "red" } } },
  {
    label: "CSS-breaking value",
    raw: { schemaVersion: 1, overrides: { "--sf-color-primary": "red; background: url(x)" } },
  },
  { label: "non-string value", raw: { schemaVersion: 1, overrides: { "--sf-radius-m": 10 } } },
];

describe("parity with scripts/lib/theme-file.js", () => {
  test("the schema version matches", () => {
    expect(THEME_SCHEMA_VERSION).toBe(node.THEME_SCHEMA_VERSION);
  });

  test.each(FIXTURES)("validate agrees on: $label", ({ raw }) => {
    const mine = validateThemeFile(raw);
    const theirs = node.validateThemeFile(raw);
    expect(mine.theme).toEqual(theirs.theme);
    expect(mine.errors).toEqual(theirs.errors);
  });

  test.each(FIXTURES)("migrate agrees on: $label", ({ raw }) => {
    const mine = validateThemeFile(raw);
    if (!mine.theme) return; // invalid fixtures are covered by the validate test
    const live = new Set(["--sf-radius-m", "--sf-color-primary-source-light"]);
    expect(migrateOverrides(mine.theme.overrides, { live })).toEqual(
      node.migrateOverrides(mine.theme.overrides, { ...nodeOpts, live }),
    );
  });

  test("serialize produces byte-identical output", () => {
    const args = {
      overrides: { "--sf-b": "2", "--sf-a": "1" },
      name: "Acme",
      slashedVersion: "0.7.31",
    };
    expect(serializeThemeFile(args)).toBe(node.serializeThemeFile(args));
  });
});

describe("theme file round-trip", () => {
  test("serialize → parse preserves the override set", () => {
    const overrides = { "--sf-color-primary-source-light": "#3b5bdb", "--sf-radius-m": "10px" };
    const { theme, errors } = parseThemeFile(serializeThemeFile({ overrides, name: "Acme" }));
    expect(errors).toEqual([]);
    expect(theme?.overrides).toEqual(overrides);
    expect(theme?.name).toBe("Acme");
  });

  test("output is key-order independent", () => {
    const a = serializeThemeFile({ overrides: { "--sf-b": "2", "--sf-a": "1" } });
    const b = serializeThemeFile({ overrides: { "--sf-a": "1", "--sf-b": "2" } });
    expect(a).toBe(b);
  });
});

describe("migration on import", () => {
  test("rewrites renamed tokens using the synced map", () => {
    const r = migrateOverrides({ "--sf-color-error": "#e03131" });
    expect(r.overrides).toEqual({ "--sf-color-danger": "#e03131" });
    expect(r.renamed).toEqual([{ from: "--sf-color-error", to: "--sf-color-danger" }]);
  });

  test("drops removed tokens with a reason", () => {
    const r = migrateOverrides({ "--sf-opacity-25": "0.25" });
    expect(r.overrides).toEqual({});
    expect(r.removed[0].name).toBe("--sf-opacity-25");
    expect(r.removed[0].reason).toBeTruthy();
  });

  test("keeps an unknown token rather than discarding user data", () => {
    const r = migrateOverrides({ "--sf-mystery": "1rem" }, { live: new Set(["--sf-radius-m"]) });
    expect(r.overrides).toEqual({ "--sf-mystery": "1rem" });
    expect(r.unknown).toEqual(["--sf-mystery"]);
  });

  test("is idempotent", () => {
    const once = migrateOverrides({ "--sf-color-error": "#e03131" });
    const twice = migrateOverrides(once.overrides);
    expect(twice.overrides).toEqual(once.overrides);
    expect(twice.renamed).toEqual([]);
  });
});
