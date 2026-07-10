/**
 * Coverage gate for the live-preview gallery (src/lib/preview/).
 *
 * The preview's job is to make EVERY configurable part of the framework API
 * visible so any configurator change can be verified. This locks that in: the
 * concatenated output of all tabs must mention every public class and every
 * public token by name. Domain tabs render the important ones as live
 * specimens; the "Advanced / All" tab enumerates the exhaustive index, so new
 * tokens/classes stay covered automatically. If someone trims that index or a
 * new API group appears with no home, this test fails instead of the preview
 * silently going stale.
 */
import { describe, test, expect } from "vitest";
import { TABS } from "../src/lib/preview";
import { CLASSES, PUBLIC_TOKENS } from "../src/lib/preview/catalog";

const ALL_HTML = TABS.map((t) => t.build()).join("\n");

describe("live-preview API coverage", () => {
  test("every public token name appears somewhere in the preview", () => {
    const missing = PUBLIC_TOKENS.map((t) => t.name).filter((n) => !ALL_HTML.includes(n));
    expect(missing, `tokens absent from the preview:\n${missing.join("\n")}`).toEqual([]);
  });

  test("every framework class name appears somewhere in the preview", () => {
    const missing = CLASSES.map((c) => c.name).filter((n) => !ALL_HTML.includes(n));
    expect(missing, `classes absent from the preview:\n${missing.join("\n")}`).toEqual([]);
  });

  test("every tab builds to non-trivial HTML", () => {
    for (const t of TABS) {
      const html = t.build();
      expect(html.length, `tab "${t.id}" produced too little HTML`).toBeGreaterThan(200);
      expect(html).toContain("sf-container");
    }
  });
});
