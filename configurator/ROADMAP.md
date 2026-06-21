# Configurator roadmap

Anything **below** the "—" line is intentional non-goals; there to make the
intentional scope of the configurator legible.

---

## Shipped (v2 — dogfood, share links, bundle picker, test hardening)

- **Dogfood SLASHED**: the configurator chrome renders with the framework's own
  `--sf-*` tokens and `[data-theme]` light/dark. `src/main.js` loads SLASHED's
  token + theme layers at `:root`; `styles/app.css` sources every `--cfg-*`
  alias from a matching `--sf-*` token. User overrides stay scoped to the
  preview stage, so the chrome always shows framework defaults (isolation
  contract, asserted by `tests-e2e/dogfood.spec.js`).
- **Shareable config URLs**: the override map is encoded into the URL fragment
  (`#c=…`, lz-string) and restored on load. `src/lib/share.js`, a header Share
  button, debounced `replaceState` sync (`src/App.svelte`).
- **Bundle / module picker** (Install panel): pick a dist bundle and copy a
  complete drop-in (framework `<link>` + your overrides in cascade order). Data
  auto-synced from `bundle.config.json` (`src/lib/bundles.js`,
  `BundlePicker.svelte`); recommends the leanest bundle that covers your edits.
- **Test hardening**: Vitest + @testing-library/svelte component tests; e2e for
  share / dogfood-isolation / axe a11y; Firefox + WebKit added to the e2e
  matrix; a `check:curation` tripwire keeps every public knob mapped to a domain.

## Shipped (Basic/Advanced/Power IA restructure)

- **Basic = per-project checklist**: a Home landing screen plus six curated
  domains (Colors, Typography, Spacing, Layout, Borders, Shadows) and the
  Themes tool. Curated controls carry friendly labels, help text and an ⓘ
  popover revealing the raw token (see `src/lib/basics.js` — validated
  against the catalogue by `tests/basics.test.js`).
- **Power knobs** — the global multipliers (`--sf-space-scale` drives 45
  tokens, `--sf-shadow-strength` 14, `--sf-motion-scale` 13…) moved out of
  Basic into a collapsed, warning-styled group at the bottom of each
  Advanced panel.
- **Scalar-writing scale generators** — Apply writes the framework's live
  fluid-engine scalars (base/ratio/shared viewport, `src/lib/fluidEngine.js`)
  instead of baking per-step `clamp()` expressions.
- **Style preset rows** — one-click Corner style and Shadow style looks on
  the Basic borders/shadows panels (`src/lib/stylePresets.js`), each a
  single undo step.
- Basic search scopes to the curated surface and offers an
  "N more matches in Advanced" jump that preserves the query.

## Shipped (PR #303)

- Categorised UI: every one of the **841 framework tokens** is reachable, no
  catch-all bucket. Sidebar nav, basic ↔ advanced global toggle, search.
- **Theme presets** + save/load custom slots in `localStorage`.
- **Undo / Redo** with `Ctrl+Z` / `Ctrl+Shift+Z`, 50-step history, single-step
  bulk operations.
- **Slider + number combo** for length / duration / dimension tokens (with a
  `raw` escape hatch for `calc()` / `clamp()`).
- **"drives N" badge** per token row — surfaces how far an edit cascades.
- **Inline WCAG contrast badge** on every color row (probe-resolves
  `light-dark()` / `oklch(from var(...) ...)` / plain `var(--sf-*)`).
- **Viewport ruler** (Mobile / Tablet / Laptop / Desktop / Fluid) wrapping the
  preview stage.
- **Reduced-motion preview** — third theme toggle, scopes
  `--sf-motion-scale: 0` to the stage and zeroes all transitions / animations
  via a scoped class. Never touches the user's overrides.
- **Diff view** in the Output drawer — token / framework default / your
  override, side-by-side.
- **OKLCH picker** with HEX round-trip + EyeDropper (where supported).
- **WCAG matrix** tool — text-on-background pair audit.
- **Modular type / display / spacing scale generators**.

---

## Next up (in priority order)

### 1. Dependency graph hover  *(half-day)*
When the user hovers a sample element in the live preview, highlight every
token referenced by its computed style and scroll the editor to the first
match. Inverse direction is already half-there: editing a token shows live
preview reflow.

Likely implementation: instrument `Preview.svelte` with a `pointermove`
listener, walk the hovered element's `computedStyleMap()` for `--sf-*`
references, and pipe them through a new `ui.spotlight: Set<string>` slot the
TokenRow reads to render a glow. Needs Chromium-only API (`computedStyleMap`)
or a fallback that scans `getComputedStyle` for known `--sf-*` properties.

### 2. Utility-class copy on relevant tokens  *(½–1 day, blocked on framework)*
Some framework configurators offer "copy `.text-l`" / "copy `.bg-primary`"
buttons next to every value. Whether SLASHED ships utility classes alongside the tokens is a
framework question — if yes, the configurator could add a "📋 utility"
button per row that copies the equivalent class name.

Action item: confirm with the framework team whether utilities are part of
SLASHED 1.0 scope; if so, generate a `name → utility-class` map at sync time
and surface it.

### 3. Visual preset builder  *(1 day)*
Today, building a custom preset means editing JSON. A friendlier path: a
"Build preset" mode that opens with the user's current overrides as the
working set, lets them name + describe + tag the preset, and saves it as
JSON ready to paste into `lib/themes.js` (or contribute upstream).

Implementation: a new tool tab next to **Themes** with an in-place editor
table, plus an "Export preset JSON" button.

### 4. Component templates / layout starters  *(½ day)*
Pre-built sample pages (landing / docs / dashboard) the user can flip
between in the preview, so the configurator visualises framework intent at
the page level — not just at the token level.

### 5. Per-domain "compact tabular view"  *(½ day)*
A toggle in the panel header that collapses every row into a one-line
table — name · default · override · drives — for power users scanning the
entire catalogue.

---

## Non-goals

- **Real-time collaborative editing**. Out of scope; this is a single-user
  authoring panel.
- **Visual canvas / drag-to-resize component editor**. The configurator
  edits *tokens* — the framework's primitives — not bespoke component
  layout.
- **Component-level `.cfg.json` overlays**. The framework is variable-first;
  we don't shadow component CSS.
- **Brand-colour HSL fallback tuner**. The legacy `--sf-*-h/s/l` triplet is
  being phased out of the framework; surfacing it as a first-class control
  would cement what we're removing.
