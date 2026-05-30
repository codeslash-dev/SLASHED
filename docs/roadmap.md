# SLASHED — Roadmap

Current stable version: **0.4.11**

This document tracks planned enhancements, post-1.0 features, and ideas under
consideration. It is not a commitment — priorities shift as the project evolves.

---

## Before v1.0

These items are planned as part of the path to a stable v1.0 release.

### Framework

- **Logical property audit** — replace remaining physical properties
  (`margin-left`, `padding-right`, etc.) with logical equivalents
  (`margin-inline-start`, `padding-inline-end`) for RTL support.

- **`sf-prose` subtoken expansion** — expose per-prose override tokens
  (`--sf-prose-paragraph`, `--sf-prose-heading-gap`, `--sf-prose-marker-color`,
  `--sf-prose-img-radius`, etc.) so users can customise prose spacing/styling
  per-instance without writing custom CSS.

- **`slashed.overrides` usage guidance** — add an `overrides-example.css` file
  (parallel to `theme-example.css`) showing exactly how and where to place
  consumer overrides so they correctly win over framework rules.

- **Unused token detection in audit script** — extend `scripts/audit.js` with a
  coverage pass: cross-reference tokens declared in `tokens.css` against usage
  in `core/` and `optional/` layers. Surface as warnings (not errors) since
  public API tokens are intentionally unused by the framework.

- **Scoped token snapshot tests** — add Playwright snapshot assertions for ~20
  key semantic tokens (e.g. `--sf-color-text`, `--sf-color-primary`,
  `--sf-color-background`) in both light and dark modes to catch accidental
  value regressions during releases.

### Bricks Integration

- **reBEMer v1 completion** — wire up `applyPlan()` with the snapshot/rollback
  machinery from the design spec (§10). Ensure all mutations flow through
  Bricks' standard API so Bricks' own Ctrl-Z undoes the entire operation as a
  single step. Remove the in-panel ring buffer from scope — Bricks' native undo
  is sufficient.

- **Color contrast reference table** — generate a `contrast-reference.json` at
  build time computing WCAG AA/AAA ratios between semantic foreground and
  background tokens in both light and dark modes. Surface as a tab in the admin
  settings SPA: a matrix of "foreground × background → pass / fail" for users
  to consult when choosing tokens.

- **Class documentation tooltips** — extract `docs/classes.md` data into a
  `data/classes.json` (generated at build time). When a new "Show class hints"
  toggle in admin settings is enabled, inject short descriptions into Bricks'
  class manager on hover. Implemented via a `show_class_hints` setting in
  `class-token-store.php` and a flag passed to the editor JS bundle.

- **Inventory stale-detection** — a weekly WP cron job checks the npm registry
  for a newer framework version and surfaces a subtle dashboard widget (not a
  red admin notice) when the installed inventory is behind. Skipped if the user
  has pinned a version intentionally.

- **REST token validation** — a thin HTTP wrapper (`class-rest-validation.php`)
  around the existing `class-token-sanitizer.php` logic. Enables inline
  validation in the admin Svelte SPA and future external tooling (CLI, CI).

---

## Post-1.0 Enhancements

These are confirmed future directions, deferred until after the v1.0 API is
stable and locked.

### Framework

- **Components layer** — the `slashed.components` layer and its stubs
  (`optional/components.css`, `optional/tokens.components.css`) are already
  declared and in place. Components will land incrementally after v1.0 under the
  `.sf-` prefix without any breaking changes to existing layers or tokens.

- **`@property` registration for spacing and shadow tokens** — extend typed
  registration beyond brand colors to spacing, sizing, and shadow tokens. Enables
  CSS transitions on layout values and better DevTools inspection.

### Bricks Integration

- **Token inheritance explorer** — a panel or modal in admin settings showing
  the full alias chain for any `--sf-*` token
  (e.g. `--sf-color-text → light-dark(--sf-base-950, --sf-base-050)`).
  Invaluable for debugging theme overrides. Requires the inventory parser to
  track alias relationships in addition to resolved values.

- **Live design token playground** — an `<iframe>` preview of the site homepage
  or a selected Bricks template embedded in the admin settings SPA. Changing a
  design token updates `document.documentElement.style` in the iframe via
  `postMessage` — no page reload, no persistence until the user saves. Changes
  are isolated to the preview session. Requires the site to permit same-origin
  iframing.

---

## Under Consideration

Ideas that are promising but not yet committed.

- **Gutenberg integration** — CSS loading + color palette sync + `theme.json`
  custom property mapping. Scoped v1 is ~2–3 weeks of work and covers 80% of
  what Gutenberg users need. Deferred because the `--sf-*` → `--wp--custom--*`
  naming mismatch needs a clean translation layer, and Gutenberg's per-block
  architecture is fundamentally different from Bricks' canvas model. reBEMer
  parity is not a goal for any Gutenberg integration.

- **Per-layer opt-in bundle via `@import`** — technically already possible
  today using the granular `core/` and `optional/` source files (with
  `core/layers.css` loaded first). Needs documentation rather than new code.

---

## Out of Scope

- **Per-page CSS bundle override** — the use case is covered by the existing
  `slashed_bricks/css_bundle_url` PHP filter. No UI planned.
- **Utility classes** — SLASHED is BEM-first by design. The utilities layer
  stub will remain empty through v1.0.
