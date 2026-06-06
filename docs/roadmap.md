# SLASHED — Roadmap

Current version: **0.5.0-beta5**

---

## Before v1.0

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

- **reBEMer v1 completion** — two distinct goals:
  1. **Atomic apply via Bricks' mutation API** — route all `applyPlan()` mutations
     through Bricks' standard element mutation API so Bricks' own Ctrl-Z treats the
     entire operation as a single undoable step. No custom undo stack needed.
  2. **Internal snapshot/rollback for error recovery** — if `applyPlan()` throws
     mid-way, the pre-apply snapshot is restored silently so the user is never left
     with a half-applied rename. This is invisible to users; it is not a user-facing
     undo feature.
  The `undo.js` in-panel ring buffer is removed from scope entirely.

- **Color contrast reference — dynamic, user-aware** — a tab in the admin settings
  SPA showing WCAG AA/AAA contrast ratios for every semantic foreground/background
  token pair, in both light and dark modes, computed against the user's *current
  saved token overrides* (not hardcoded defaults). Updates live as the user adjusts
  color tokens before saving. Powered by `class-color-resolver.php` (which already
  resolves OKLCH/alias chains to hex for palette swatches) exposed via a REST
  endpoint or included in the inventory payload.

- **Class documentation tooltips** — extract `docs/classes.md` data into a
  `data/classes.json` (generated at build time). When a new "Show class hints"
  toggle in admin settings is enabled, inject a small "?" info icon beside each
  SLASHED class row's action icons in Bricks' class manager; hovering or focusing
  that icon reveals a short description. Implemented via a `show_class_hints`
  setting in `class-token-store.php` and a flag passed to the editor JS bundle.

- **Inventory stale-detection** — a weekly WP cron job checks the npm registry
  for a newer framework version and surfaces a subtle dashboard widget (not a
  red admin notice) when the installed inventory is behind. Skipped if the user
  has pinned a version intentionally.

- **REST token validation** — a thin HTTP wrapper (`class-rest-validation.php`)
  around the existing `class-token-sanitizer.php` logic. Enables inline
  validation in the admin Svelte SPA and future external tooling (CLI, CI).

---

## Post-1.0 Enhancements

### Framework

- **Components layer** — the `slashed.components` layer and its stubs
  (`optional/components.css`, `optional/tokens.components.css`) are already
  declared and in place. Components will land incrementally after v1.0 under the
  `.sf-` prefix without any breaking changes to existing layers or tokens.

- **`@property` registration for spacing and shadow tokens** — extend typed
  registration beyond brand colors to spacing, sizing, and shadow tokens. Enables
  CSS transitions on layout values and better DevTools inspection.

### Gutenberg Integration

- **`--sf-*` → `--wp--custom--*` theme.json mapping** — exposes SLASHED tokens in the Global Styles UI (Site Editor). Only needed for the Site Editor token UI; not required for the standard block editor workflow.
- **Token override admin UI** — a Svelte settings panel for Gutenberg, parallel to the Bricks admin SPA. Until then, overrides go via the `slashed_gutenberg/css_bundle_url` filter or a child-theme stylesheet.
- **reBEMer parity** — reBEMer is currently Bricks-specific (structure panel integration). Gutenberg equivalent not scoped.

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

- **Per-layer opt-in bundle via `@import`** — technically already possible
  today using the granular `core/` and `optional/` source files (with
  `core/layers.css` loaded first). Needs documentation rather than new code.

---

## Out of Scope

- **Per-page CSS bundle override** — the use case is covered by the existing
  `slashed_bricks/css_bundle_url` PHP filter. No UI planned.
- **Utility classes** — SLASHED is BEM-first by design. The utilities layer
  stub will remain empty through v1.0.
