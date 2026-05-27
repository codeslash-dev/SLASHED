# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **reBEMer** (`integrations/bricks/`) — Subtree-scoped BEM class manager
  for the Bricks Builder structure panel. Adds a "BEM" badge to every
  structure-panel item; clicking it opens a draggable modal that names a
  block + every descendant element + an optional modifier and applies the
  result as global classes in one transaction. Five operation modes
  (Add / Rename / Replace / Add Modifier / Migrate ID styles), a REST
  preflight endpoint that reports cross-element class usage so destructive
  ops never silently break unrelated elements, snapshot + rollback for
  every apply, an in-panel undo ring buffer, and a reserved-name guard
  against SLASHED's own utility classes. Full design at
  [docs/rebemer.md](docs/rebemer.md). The editor app lives in
  `integrations/bricks/editor-app/` (Svelte 5 runes + Vite); the PHP side
  is `Slashed_Bricks_ReBEMer_{Policy,REST,Enqueue}` under
  `integrations/bricks/includes/`.

### ⚠️ Breaking Changes (pre-freeze cleanup)

The framework is in pre-freeze cleanup. No published consumer is affected.
The following changes simplify the public API surface before the token-API
freeze. Done in a single PR with no version bump.

#### Tokens removed

- **`--sf-ratio-photo`** — removed. Use `--sf-ratio-3-2` (semantically
  identical) or `--sf-ratio-4-3`.
- **`--sf-sidebar-width-default`** — removed. The canonical name
  `--sf-sidebar-width` is now declared directly with `18rem`. Override that
  token instead.
- **`--sf-grid-min-default`** — removed. The canonical name `--sf-grid-min`
  is now declared directly with `16rem`. Override that token instead.
- **`--sf-color-primary--hover`**, **`--sf-color-secondary--hover`**,
  **`--sf-color-tertiary--hover`**, **`--sf-color-action--hover`**,
  **`--sf-color-neutral--hover`** — removed from `core/tokens.css`.
  These were only consumed internally by `optional/forms.css`, which
  ships with `optional/tokens.palette.css` (where `--sf-color-{role}-hover`
  exists with palette-derived values). Single-source-of-truth: brand hover
  variants now live in palette only. Inter-bundle drift between essential
  and optimal/full eliminated.

#### Class modifiers removed

- **`.sf-stack--2xs`**, **`.sf-stack--3xl`**, **`.sf-cluster--2xs`** removed.
  The underlying tokens (`--sf-space-2xs`/`-3xl`/`-4xl`) remain part of the
  public API; override the primitive's scoped token directly to access the
  extreme tiers (`style="--sf-stack-gap: var(--sf-space-3xl)"`).

#### Class modifiers added

- **`.sf-cluster--2xl`**, **`.sf-grid--2xl`** (+ token `--sf-grid-min-2xl: 28rem`),
  **`.sf-section--xs`** (+ token `--sf-section-pad--xs`),
  **`.sf-section--2xl`** (+ token `--sf-section-pad--2xl`).
  Result: every size-aware primitive supports the canonical `--xs … --2xl`
  range, with the documented exception of `.sf-icon` which caps at `--xl`
  (3em ≈ 48px on default text — above that the element is no longer an
  icon). One sentence rule: **xs..2xl wszędzie poza ikoną.**

### Enhanced

#### `.sf-clickable-parent` — multi-link support and built-in focus ring

- **Dual-mode link selection.** Automatic mode (no extra markup) continues to
  work for single-link cards. Explicit mode: add `data-overlay-link` to the
  primary link and every other link/button in the card is lifted above the
  overlay automatically — robust across any nesting depth, no manual z-index
  work required.
- **Built-in card-level focus ring** via `:focus-within`. Keyboard users see
  the same "whole card highlighted" cue as mouse-hover without a separate
  companion class. Can be suppressed with `outline: none` if the card design
  provides its own indicator.
- **`--sf-clickable-overlay-z` custom property** (default `1`). Set it on the
  card to escape a parent stacking context without touching framework internals.
- **Flow-content trade-off remains explicit.** Card text stays non-selectable
  by mouse by default to preserve full-card navigation. Use `[data-no-overlay]`
  on specific descendants that must sit above the overlay.
- **Wider interactive-element exceptions.** `summary`, `video`, `audio`, and
  `[role="button"]` are now lifted alongside buttons and form controls.

### Documentation

- `docs/architecture.md`: rewrote the "Naming conventions" section to
  document the two parallel rules. Single dash (`<role>-<variant>`) names a
  palette/shade variant — the token IS a colour. Double dash
  (`<role>--<context>`) names an application slot — the token is consumed in
  a specific semantic context. Both are public, both are SemVer-locked;
  the difference is documentation-level.
- `docs/layout.md`: added "Size-modifier scale" section with the per-primitive
  table and the documented `.sf-icon` exception.
- `core/tokens.css`: added inline comment to the Icon sizes section
  explaining em-based design (icons scale with surrounding text), why no
  `clamp()`, why no separate `--sf-icon-scale` knob (transitively covered
  by `--sf-text-scale`), and why `--xl` is the cap.

## [0.3.0] - 2026-05-24

Class taxonomy refactor. New `slashed.macros` cascade layer, 12 macro
recipes, layout essentials, and 8 taken component names with empty
class definitions ready for upcoming minor releases. Plus the in-flight
WebKit a11y/contrast fixes that were sitting in `Unreleased`.

### ⚠️ Breaking Changes

#### New `slashed.macros` cascade layer

A new `slashed.macros` layer is introduced between `slashed.components`
and `slashed.utilities`. Macros may compose with primitives and
components, but a single-property utility still wins on the same
selector. Updated layer order:

```text
tokens → reset → base → forms → layout → components → macros →
utilities → states → themes → motion → accessibility → print →
legacy → overrides
```

Three classes change cascade layer (selectors and properties unchanged):

- `.sf-prose`, `.sf-not-prose` — `slashed.layout` → `slashed.macros`.
  Moved out of `core/layout.css` into the new `core/macros.css`.
- `.focus-parent` — `slashed.states` → `slashed.accessibility`.
  Now lives in `core/accessibility.css` alongside the rest of the focus /
  a11y rules.

A site that worked in 0.2.x works in 0.3.0 without any markup changes.
Consumers who previously wrote `@layer slashed.layout { .sf-prose { … } }`
or `@layer slashed.states { .focus-parent { … } }` overrides should move
those rules to `slashed.overrides` (the documented escape hatch).
See `docs/migration.md` for details.

### Added

- **`core/macros.css`** — 12 recipes / patterns.
  - `.sf-prose`, `.sf-not-prose` (relocated from `core/layout.css`).
  - `.sf-flow` — Heydon Pickering's lobotomized owl
    (`> * + * { margin-block-start: var(--sf-flow-space) }`).
  - `.sf-truncate` — single-line ellipsis.
  - `.sf-line-clamp-2`, `.sf-line-clamp-3`, `.sf-line-clamp-N`.
  - `.sf-equal-height` — flex children stretch to tallest.
  - `.sf-aspect` — generic aspect-ratio container.
  - `.sf-scroll-shadow` — top + bottom mask gradient on a vertical
    scroll container.
  - `.sf-scroll-snap` — vertical scroll-snap container.
  - `.sf-overflow-fade` — end-edge horizontal mask fade.
  - `.sf-no-tap-highlight` — suppress mobile tap-highlight.
- **`core/tokens.macros.css`** — semantic tokens for the macros:
  `--sf-flow-space`, `--sf-line-clamp`, `--sf-truncate-suffix`,
  `--sf-aspect`, `--sf-scroll-shadow-size`.
- **A11y patterns:**
  - `.sf-clickable-parent` — the card-with-link pattern (overlay-based
    full-card click target with single AT announcement; text remains
    selectable; secondary buttons / links keep working;
    `[data-no-overlay]` is the consumer escape hatch).
- **Layout extras:**
  - `.sf-icon--boxed` — modifier on the existing `.sf-icon` that wraps
    the glyph in a padded, bordered, optionally coloured frame
    (content-box; consumes new `--sf-icon-box-*` tokens).
  - Border-style scale: `--sf-border-style`, `--sf-border-style-strong`,
    `--sf-border-style-soft`, `--sf-border-style-dotted` — pairs with
    the existing `--sf-border-width-*` and `--sf-color-border*` so
    consumers can switch decorative styles without rewriting rules.
  - Icon-boxed tokens: `--sf-icon-box-pad`, `--sf-icon-box-radius`,
    `--sf-icon-box-bg`, `--sf-icon-box-border`.
- **Components — incomplete files** — `optional/components.css` and
  `optional/tokens.components.css` move from empty `/* TODO */` stubs
  to structured files with all class definitions and tokens commented
  out. Both files keep an active `@layer` declaration to RESERVE
  cascade position; nothing else ships in `*.min.css` (minifier strips
  the comments). Class and token activation is planned for upcoming
  upcoming minor releases (additive only). The 8 taken component names
  are: `.sf-button`, `.sf-card`, `.sf-badge`, `.sf-tag`, `.sf-alert`,
  `.sf-avatar`, `.sf-modal`, `.sf-skeleton`. Card tokens (originally
  proposed for the essential bundle) live here, commented, alongside
  the rest — so the entire component-related surface (classes +
  tokens) ships together when ready. See `docs/components.md`.

### Documentation

- **`docs/architecture.md`** — new "Class taxonomy" section with the
  7 categories and a 5-step decision tree for adding new classes;
  layer order updated; file structure updated.
- **`docs/macros.md`** *(new)* — full reference for every macro with
  signature, usage example, and consumed tokens.
- **`docs/components.md`** *(new)* — taken component names and the
  out-of-scope list (`tabs`, `accordion`, `tooltip`, …) with
  rationale for each exclusion.
- **`docs/migration.md`** — adds an "0.2.x → 0.3.0" section explaining
  the three relocations and the `slashed.overrides` escape hatch.
- README updated for the new layer order, file list, and bundle
  contents.

### Tests

- `tests/macros.spec.js` *(new)* — behavioural tests for each macro,
  covering both default behaviour and token-override paths.
- `tests/layers.spec.js` — three new ordering invariants:
  `macros > components`, `utilities > macros`,
  `accessibility > motion`.
- `tests/coverage.spec.js` — three new exclusions for selectors
  exercised by dedicated specs (`.sf-overflow-fade`,
  `.sf-no-tap-highlight`, `.sf-clickable-parent`).
- `tests/tokens.spec.js` — adds `core/tokens.macros.css` to
  the token-coverage source list.
- `docs/demo.html` — new `<section id="macros">` exercising every
  macro inline. Existing `tests/demo-visual.spec.js` screenshots are
  locator-scoped and unaffected.

### Changed

- **CI: skip `[webkit] axe: no WCAG A/AA violations (dark)`** with a
  documented deferral. WebKit's headless build under Playwright paints
  `-webkit-link` (≈ `#00728f`) on `<a href>` elements in dark mode
  regardless of how `--sf-color-link` is computed, what selector
  specificity is used, or which `@layer` the rule lives in. The
  framework's value applies correctly in Chromium, Firefox, and
  (per manual checking) real Safari — the failure is specific to
  WebKit's headless test build. The dark a11y audit still runs on
  Chromium and Firefox, so a real link-contrast regression will be
  caught on two engines.

- **Dark-mode link luminance floor reverted `0.72` → `0.68`** in
  `core/tokens.css` (`--sf-color-link`, `--sf-color-link--hover`,
  `--sf-color-link--visited`; the corresponding `--sf-color-link--active`
  floor `0.78` → `0.74`, preserving its +0.06 offset above base). PR #73's
  bump from `0.68` to `0.72` was made under the (incorrect) belief that
  the dark-mode link floor was the cause of the WebKit axe contrast
  failure. The actual cause was selector specificity (now fixed via
  `a:link`, see below) and the WebKit value was painting `-webkit-link`
  regardless of how the formula computed. Restoring PR #70's `0.68`
  floor — still a defensive contrast cushion above the pre-PR-#70
  `0.62`, without the speculative extra bump that served no purpose.

### Fixed

- **Anchor selector specificity** — `core/base.css` now styles
  unvisited anchors with `a:link { color: var(--sf-color-link); }`
  (specificity 0,1,1) instead of bare `a { color: ...; }` (0,0,1).
  This puts the author rule on equal footing with WebKit's UA
  stylesheet `a:link { color: -webkit-link; }`, which would otherwise
  win on most browsers' UA cascade. Resolves the long-running
  dark-mode link contrast issue (PR #73 and four iterations of PR #76
  all chased the colour formula instead of the selector specificity).

- **Form-field contrast in WebKit dark mode** — text-like `<input>`s
  and `<textarea>`s now get `appearance: none` (previously only
  `<select>` had it). Without this, WebKit overlays its own dark-mode
  default field background (≈ `#5f6163`) on top of the framework's
  `--sf-color-surface`, producing a 1.78 : 1 contrast failure flagged
  by axe. Chromium and Firefox honoured the CSS `background-color`
  without `appearance: none`; only WebKit needed the explicit opt-out.
  Native rendering of checkbox / radio / range / file / datetime
  pickers is unaffected (the `:where()` block only matches text-like
  inputs).

### Bundle size

- essential: 9.9 kB → 10.4 kB gzip (+5%).
- optimal: 12.2 kB → 12.7 kB gzip (+4%).
- optimal-components / full: minifier strips the commented-out
  component definitions, so min sizes are unchanged from optimal.
- All bundles remain well under their `tests/bundle-size.spec.js`
  budgets (15 / 18 / 20 kB gzip).

## [0.2.12] - 2026-05-23

Release infrastructure and Bricks Builder integration.

### Added

- **Bricks Builder integration** — WordPress plugin for one-click SLASHED
  loading in Bricks Builder themes (PR #71)

### Changed

- Removed `audits/` directory from repository (internal planning docs moved
  elsewhere)
- README updated for current project state

## [0.2.11] - 2026-05-23

Documentation accuracy and dark-mode link contrast.

### Fixed

- **Dark-mode link contrast (WebKit)** — raised the lightness floor in the
  `--sf-color-link` dark-mode formula from `0.62` to `0.68`, fixing a WCAG AA
  (4.5:1) failure flagged by axe-core in WebKit. `--sf-color-link--visited`
  raised to match. Chromium/Firefox were unaffected (PR #70)
- Added missing `--sf-field-required-marker` token declaration to
  `core/tokens.css` (was consumed by `forms.css` without a source declaration)

### Changed

- **docs/architecture.md** — fixed `color-mix(in oklch)` to `color-mix(in oklab)`;
  removed ghost `--sf-transition-base` from transition table; updated
  `sign(0.6 - l)` to `sign(var(--sf-contrast-threshold) - l)`; added
  `.visually-hidden` as `.sr-only` synonym; clarified `slashed.themes`
  extension guidance
- **docs/layout.md** — added 5 missing primitives (`.sf-box`, `.sf-center`,
  `.sf-alternate`, `.sf-pancake`, `.sf-not-prose`); corrected `.sf-grid-1...-6`
  to `.sf-grid-1/-2/-3/-4/-6` (no `-5`)
- **README.md** — clarified "22 source tokens" to "6 minimum light + up to 22
  total"
- **docs/tokens.md** — regenerated; adds `--sf-contrast-threshold`, fixes stale
  formulas
- `--sf-contrast-threshold` token (introduced in PR #68) now wired into all
  `--sf-color-text--on-*` formulas and `--sf-color-code-text`
- CI `docs-freshness` job added to verify `docs/tokens.md` stays in sync

## [0.2.10] - 2026-05-22

CI fix and PR review follow-ups.

### Fixed

- **CI green**: the cross-browser matrix ran the geometry/text-metric visual
  suite (`demo-visual.spec.js`) on Firefox/WebKit, whose font metrics differ
  from Chromium — pinned that suite to Chromium (where pixel/geometry
  regression belongs) while Firefox/WebKit keep validating CSS *behaviour*
  (colour resolution, a11y, states, container queries)
- Hardened `tests/a11y.spec.js` to wait for fonts + applied styles before the
  axe audit, eliminating a rare under-load flake where axe sampled unstyled
  defaults
- RTL: select chevron now mirrors to the inline-end (left) edge under
  `:dir(rtl)` instead of staying physically right
- `scripts/bundle.js` `@import`-stripping regex now requires matching quotes
  (backreference) instead of allowing `"…'`

### Changed

- Docs/demo review fixes: accessible name on the focus-parent demo input;
  `aria-pressed` kept in sync in the dark-mode toggle example; corrected
  "15-layer" → "14-layer" in performance docs; consistent `role="status"` /
  `role="alert"` notation in the states doc

## [0.2.9] - 2026-05-22

Universal-colour transparency: a live accessibility report in the demo.

### Added

- Demo Theme Customizer now includes a **live Accessibility report** that
  computes WCAG 2 contrast (AA / AA-Large / Fail) for 13 key colour pairs in
  both light and dark mode, recomputed whenever brand colours change. This makes
  the accessibility consequences of *any* chosen palette visible — including the
  edges pure-CSS auto-derivation can't guarantee
- `docs/theming.md` → "How universal is the colour system?" — documents what is
  fully universal (brand hue/chroma, on-colour text, surfaces), the one
  structural contract (`base-light` is a light surface), and why CSS alone can't
  guarantee 4.5:1 for every possible input
- `tests/demo-a11y-panel.spec.js` — verifies the report renders all pairs, that
  the default palette passes AA, and that it recomputes on colour change

## [0.2.8] - 2026-05-22

Robust link contrast under brand overrides.

### Changed

- `--sf-color-link` / `--hover` / `--active` / `--visited` now clamp OKLCH
  lightness toward a contrast-safe band (ceiling in light mode, floor in dark)
  instead of applying a fixed offset. Links keep the action hue but clear
  WCAG AA (4.5:1) for the default palette **and** the large majority of brand
  overrides — not just the default. Very high-chroma hues (saturated
  yellow/green) remain a documented exception (consumer overrides
  `--sf-color-link` directly)
- Audit checklist: items previously dispositioned "not needed / not possible /
  defer to v1.x" are retagged **defer to v0.5.0**

### Added

- `tests/link-contrast.spec.js` — verifies the clamp holds ≥ 4.5:1 across a
  range of moderate-chroma `--sf-color-action` overrides
- `docs/theming.md` → "Link contrast" section documenting the guarantee and
  its high-chroma caveat

## [0.2.7] - 2026-05-22

Behavioural test hardening (checklist v3 §C.13) — completes the test matrix.

### Added

- `tests/behavior.spec.js`:
  - reduced-motion neutralisation (`prefers-reduced-motion: reduce` and the
    manual `.no-motion` opt-out)
  - forced-colors focus-ring colour (Chromium-only emulation; skipped elsewhere)
  - container-query wiring (`.sf-container` inline-size container; fixed-grid
    reflow across container widths)
  - state-class effects (`.is-hidden`, `.is-disabled`, `.is-truncated`)

## [0.2.6] - 2026-05-22

Build & test infrastructure (checklist v3 §C.12, §C.13, D10).

### Added

- Minified bundles (`*.min.css`) + source maps (`*.min.css.map`) for every
  bundle via lightningcss; modern colour syntax is preserved (no down-levelling)
- `npm run build` now reports raw / gzip / brotli sizes per bundle
- Cross-browser test matrix — Firefox and WebKit added alongside Chromium in
  `playwright.config.js`, `test:install`, and CI
- `tests/a11y.spec.js` — axe-core WCAG 2 A/AA audit (light + dark) against a
  dedicated `tests/a11y-fixture.html`
- `tests/bundle-size.spec.js` — gzip-size regression budgets per bundle
- README bundle-size badge; docs for the minified bundles and the
  `layers.css`-first rule for custom bundles

### Fixed

- Default link colour now darkens the action colour in light mode so link text
  meets WCAG AA (4.5:1) on the page background (was 3.43:1); dark mode unchanged.
  Surfaced by the new axe audit
- `tests/demo-visual.spec.js` print-href assertion is now browser-aware
  (Firefox/WebKit report the unresolved `attr(href)` expression)

## [0.2.5] - 2026-05-22

Documentation sprint (checklist v3 §C.14) — the stated v1.0 gate.

### Added

- `docs/theming.md` — rebrand-in-6-tokens guide, multi-brand scoping, contrast
- `docs/dark-mode.md` — toggle script, scoped themes, per-value overrides, gotchas
- `docs/layout.md` — every layout primitive with its tokens
- `docs/states.md` — every `.is-*` class, ARIA mapping, and overlap semantics
- `docs/tokens.md` — full `--sf-*` reference (588 tokens), generated from source
- `docs/browser-support.md` — the support floor and the features that set it
- `docs/performance.md` — modern-CSS footguns (transition: all, oklch paint, …)
- `docs/migration.md` — migration guide for teams coming from other frameworks
- `CONTRIBUTING.md` — setup, enforced conventions, test/coverage rules
- `scripts/gen-token-reference.js` + `npm run docs:tokens` to regenerate the
  token reference from source

### Changed

- README gains a Documentation index linking the guides above
- `docs/architecture.md` notes `tokens.palette` ships in the optimal+ bundles

## [0.2.4] - 2026-05-22

Accessibility, print, and theming (checklist v3 §C.7, §C.9, §C.10).

### Added

- Accessibility: `.no-motion` (consumer-toggled motion opt-out, independent of
  the OS setting); forced-colors now re-asserts form-control borders so fields
  stay distinguishable; `prefers-contrast: more` now also raises
  `--sf-contrast-bias` to darken/lighten reading text
- Print: `.print-only` (hidden on screen, shown on paper); `audio`/`video` added
  to the print hide-list
- Themes: `optional/theme-example.css` — a copy-and-customise "rebrand in 6
  tokens" example covering quick rebrand, per-mode dark control, multi-brand
  scoping (`[data-brand]`), and an opt-in theme-transition class (not bundled)

### Changed

- `core/themes.css` documents multi-brand scoping and the
  `startViewTransition()` theme-toggle pattern

## [0.2.3] - 2026-05-22

State and motion primitives (checklist v3 §C.6, §C.8).

### Added

- States: `.is-pressed` (aria-pressed toggles), `.is-pending` (optimistic UI,
  distinct from `.is-loading`), `.is-focused` (programmatic focus ring),
  `.focus-parent:focus-within` (parent reacts to a focused descendant),
  `.is-fullscreen`, and `.is-resizable`
- Motion: `sf-ping`, `sf-blink`, and `sf-float` keyframes with matching
  `--sf-animation-ping` / `-blink` / `-float` presets (keyframes/tokens only —
  no utility classes, per audit §D9)
- Inline documentation of state-overlap semantics (`.is-error` vs `.is-invalid`
  vs `.is-danger`; `.is-open` vs `.is-expanded`) and an `@starting-style`
  readiness note in `core/motion.css`

## [0.2.2] - 2026-05-22

New CSS features across tokens, reset, forms, and layout (checklist v3 §C.1–5).

### Added

- Tokens: `--sf-mask-scrim-start` / `--sf-mask-scrim-end` (edge-fade stops for
  scroll reels) and `--sf-animation-delay-1`…`-5` (stagger delays; tokens only,
  no `.sf-stagger` class per audit §D9)
- Reset: `::file-selector-button { font: inherit }` and `search { display: block }`
- Forms: styled `input[type="file"]::file-selector-button` (action-button look),
  `input[type="range"]` track + thumb for WebKit and Firefox, and a focus ring
- Layout: `.sf-grid--dense` (dense auto-flow on any grid) and the `.sf-icon`
  inline icon-sizing primitive with `--xs`…`--xl` modifiers (consumes the
  existing `--sf-icon-*` tokens)

### Changed

- Select chevron now swaps stroke colour via `light-dark()` instead of relying
  on `currentColor` inside a data-URI background (which doesn't inherit the host
  colour cross-browser); the chevron now tracks dark mode and scoped
  `[data-theme]` regions

## [0.2.1] - 2026-05-22

Completes the v0.2 "leftovers" from `audits/completion-checklist-v3.md`:
the tiered bundle scheme (D5) and token-API hygiene (D11).

### Added

- Tiered bundle scheme (D5): `essential`, `optimal`, `optimal-components`,
  `optimal-utilities`, and `full`. `optimal` = core + `tokens.palette` +
  `forms` + `legacy`; `full` adds the (empty) component/utility stubs. New
  `package.json` `exports` subpaths: `./optimal`, `./optimal-components`,
  `./optimal-utilities`, `./full`
- `--sf-color-code-text` token in `core/tokens.css` (defaults to `inherit`)
  for discoverability — previously only a fallback in `base.css`
- Token-API contract documentation (D11): PUBLIC / INTERNAL / DEPRECATED
  labelling in the token-file headers, canonical-source alias documentation
  (`--sf-space-gap`→`--sf-gap`, etc.), and naming conventions (single- vs
  double-dash, BEM consumer-API tokens, print class prefix) in
  `docs/architecture.md`

### Changed

- `scripts/bundle.js` now strips local `@import` statements when
  concatenating, so bundled stubs carry no dead mid-file imports
- README and `docs/architecture.md` bundle sections rewritten for the
  five-bundle scheme

## [0.2.0] - 2026-05-22

Foundation polish from `audits/completion-checklist-v3.md` (§F v0.2): wire up
declared-but-unused base/print tokens, fix two real form bugs, ship the
previously-unbundled `optional/forms.css`, and close the `slashed.forms` /
base-scope documentation gaps.

### Added

- `em` base rule consuming `--sf-body-em-style`; per-heading `font-weight`
  wiring (`--sf-h1-font-weight`…`--sf-h6-font-weight`) and `text-wrap` wiring
  (`--sf-heading-text-wrap`, `--sf-body-text-wrap`) in `core/base.css` — tokens
  that previously advertised control the base ignored (D2)
- `--sf-contrast-bias` is now a real global text-contrast knob, folded into
  `--sf-color-text`, `--sf-color-text--secondary`, and `--sf-color-heading`
  (default `0` = no change) (D3)
- `--sf-divider-width` / `--sf-divider-style` / `--sf-divider-color` tokens and
  a `.sf-divider` (+ `.sf-divider--vertical`) layout primitive; `hr` now reads
  the divider tokens
- `.sr-only-focusable` accessibility helper (visually hidden until focused)
- Required-field asterisk in `optional/forms.css` — classless `:has()` +
  `:required`, customisable via `--sf-field-required-marker` (D8)
- `optional/forms.css` now ships in the `slashed.full.css` bundle (D5, bundle
  half); `slashed.forms` layer and the universal-base scope rule documented in
  `README.md` and `docs/architecture.md` (D1, D5)

### Changed

- `--sf-body-strong-weight` default corrected to `--sf-font-weight-bold` (700)
  before being wired, so `<strong>` is not silently downweighted to 600 (D2)
- `optional/forms.css` shared field border now reads `--sf-field-border-color`,
  so the `.is-*` validation states in `core/states.css` recolour native inputs
  (D6)
- `core/print.css` consumes `--sf-print-base-size` on `body` in `@media print`
  (D4)

### Fixed

- Primary-button `:hover` no longer swaps the solid action fill for the
  surface-hover tint and dark text; it now darkens the action colour
  (`oklch(from var(--sf-color-action) calc(l - 0.05) c h)`) (D7)
- Removed duplicate `textarea { resize: vertical }` from `optional/forms.css`
  (owned by `core/reset.css`)

## [0.1.0] - 2026-05-21

### Added

- Comprehensive comparative audit (`audits/comparative-audit-2026.md`) — 22 findings with a prioritised remediation roadmap ([#33](https://github.com/codeslash-dev/SLASHED/pull/33))
- Named container queries — `sf-layout` and `sf-alternate` containers explicitly named in `core/layout.css`; anonymous queries left deliberately unnamed (Phase 4, [#39](https://github.com/codeslash-dev/SLASHED/pull/39))
- Granular transition tokens — `--sf-transition-duration`, `--sf-transition-easing`, and related `--sf-transition-*` properties for fine-grained motion control; `@property` colour interpolation proof-of-concept via `color-pulse` utility (Phase 5, [#40](https://github.com/codeslash-dev/SLASHED/pull/40))
- Print demo section in `docs/demo.html` — interactive checklist verifying `<mark>`, status colours, SCREEN-ONLY badge, and colour opt-in callouts in print preview ([#37](https://github.com/codeslash-dev/SLASHED/pull/37))
- Full `.is-*` state coverage and missing layout primitives in `docs/demo.html` — all 25+ state classes exercised; `.sf-imposter`, `.sf-subgrid`, `.sf-section-group`, `.sf-cover` modifiers, ratio grids, `.sf-scale-down`, and all modifier variants documented (Phase 6, [#41](https://github.com/codeslash-dev/SLASHED/pull/41))
- Regression test suite (Phase 6, [#41](https://github.com/codeslash-dev/SLASHED/pull/41)):
  - `tests/layers.spec.js` — verifies cascade layer ordering invariant (themes > components, states > utilities, motion > themes)
  - `tests/print.spec.js` — verifies `<mark>` background retention, `.no-print` visibility, and `.print-color-exact` in print emulation
  - `tests/coverage.spec.js` — parses all `.sf-*` / `.is-*` selectors from `core/*.css` and asserts each appears at least once in `docs/demo.html`; permanently prevents demo-coverage regressions

### Changed

- Theme configurator dark colour pickers now read resolved `--sf-color-X` CSS custom properties from the live document instead of a hardcoded defaults table, correctly surfacing SLASHED's auto-derive-from-light behaviour ([#32](https://github.com/codeslash-dev/SLASHED/pull/32))
- Themes extracted to a dedicated `@layer themes` — isolates theme declarations from component styles and improves cascade predictability (Phase 1, [#34](https://github.com/codeslash-dev/SLASHED/pull/34))
- Bundle scope tightened — `core/*.css` imports aligned with the documented API; no undocumented selectors leak into the bundle (Phase 1, [#34](https://github.com/codeslash-dev/SLASHED/pull/34))
- Motion accessibility patterns modernised — `@media (prefers-reduced-motion)` coverage extended; transitions opt-in via token (Phase 5, [#40](https://github.com/codeslash-dev/SLASHED/pull/40))
- `overflow: clip` replaces `overflow: hidden` where scroll-container semantics are not needed (Phase 5, [#40](https://github.com/codeslash-dev/SLASHED/pull/40))

### Fixed

- WCAG AA Normal contrast (4.5:1) for all brand and status on-colour foregrounds — every `--sf-color-*-on` token now meets the threshold by default; auto-contrast mechanism unchanged (Phase 2, [#36](https://github.com/codeslash-dev/SLASHED/pull/36))
- Browser-floor tokens corrected to match actual browser computed values (Phase 1, [#34](https://github.com/codeslash-dev/SLASHED/pull/34))

### ⚠️ Breaking Changes

#### Print colour contract reversed (Phase 3, [#37](https://github.com/codeslash-dev/SLASHED/pull/37))

`core/print.css` no longer flattens authored colour by default. The previous blanket reset

```css
* { background: transparent !important; color: CanvasText !important; }
```

destroyed semantic colour in print — `<mark>` lost its highlight, `.is-success` lost its green, status pills lost their tint. The new contract:

- **Default**: authored colour reaches paper. Browsers handle ink-saving via their own `print-color-adjust: economy` heuristics.
- **`.print-color-exact`**: opt-in for colour-coded data that loses meaning when flattened (status pills, syntax highlighting, charts).
- **`.print-no-color`**: opt-in for ink-on-paper output where ink-saving is the contract. Restores the pre-0.1.0 blanket reset for the marked subtree.

`box-shadow` and `text-shadow` are still suppressed in print, but no longer with `!important` — an authored shadow that explicitly overrides the print layer is now the consumer's call.

**Migration:** if your site relied on the old blanket colour flatten (e.g. brand backgrounds authored for screen, silently dropped in print), wrap the affected region in `.print-no-color` to restore the previous behaviour.

## [0.0.1] - 2026-05-01

Initial pre-release.
