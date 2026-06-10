# Configurator roadmap

A short, honest list of the high-impact DX features the configurator does **not**
have yet, ordered by impact-vs-effort. Items here came out of an audit against
[Automatic.css 3.0](https://automaticcss.com/)'s panel — the bar this tool aims
for.

Anything **below** the "—" line is intentional non-goals; there to make the
intentional scope of the configurator legible.

---

## Shipped (PR #303)

- Categorised UI: every one of the **841 framework tokens** is reachable, no
  catch-all bucket. Sidebar nav, basic ↔ advanced global toggle, search.
- **Quick Knobs** — each domain panel opens with sliders for the global
  multipliers it owns (`--sf-space-scale` drives 45 tokens,
  `--sf-shadow-strength` drives 14, `--sf-motion-scale` drives 13…).
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
Automatic.css has "copy `.text-l`" / "copy `.bg-primary`" buttons next to
every value. Whether SLASHED ships utility classes alongside the tokens is a
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

### 6. Shareable URLs  *(½ day)*
Encode the override map (or a preset id + delta) into the URL fragment so a
configuration is shareable without a deploy step. `lz-string` over the
override JSON is enough to fit thousands of bytes into a URL.

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
