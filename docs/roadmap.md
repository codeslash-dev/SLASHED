# SLASHED — Roadmap

Current version: **0.6.35**

## Before v1.0

*All pre-v1.0 items are complete as of v0.6.0. The API is frozen for
non-additive changes; the v0.6.x series focuses on the components layer.*

## Post-1.0

- **Components layer** — the `slashed.components` layer and its stubs are already
  declared; the eight `.sf-*` components land incrementally after v1.0, additive
  only. Tracked in [#384](https://github.com/codeslash-dev/SLASHED/issues/384)
  (consolidated tranche), with `.sf-btn` and `.sf-card` broken out individually
  in [#493](https://github.com/codeslash-dev/SLASHED/issues/493) /
  [#494](https://github.com/codeslash-dev/SLASHED/issues/494) — both fully
  written but commented out in `optional/components.css`, staged until
  activated. An outline `.sf-btn` variant is queued as a follow-on in
  [#486](https://github.com/codeslash-dev/SLASHED/issues/486) once the base
  variant set ships. **Note:** #384 and #493/#494 currently overlap in scope
  (same button/card work tracked twice) — worth consolidating before
  implementation starts.
- ~~**`@property` for spacing/shadow tokens**~~ ✓ **Done** — spacing (`--sf-radius-*`,
  `--sf-space-*`, semantic spacing) and shadow (`--sf-shadow-*`, `--sf-text-shadow-*`,
  `--sf-drop-shadow-*`) tokens are already registered via `@property` in
  `core/tokens.css`, alongside the existing colour registrations. Transitions on
  layout values and DevTools inspection both work.
- **Consolidate named surfaces onto `.sf-surface`** — the 11 `.sf-surface--*`
  variants could become one-line `--sf-surface-color` presets of the generic
  primitive, once a fallback story for the precomputed
  `tokens.color-fallbacks.css` path is settled.
- **Curated core utility set** — visibility/display, text-alignment,
  flex/grid item-alignment, gap, and content-width (default/wide/full)
  utilities, shipped enabled (not staged) in a new `slashed.utilities` layer
  in `core/` — distinct from the staged, opt-in `optional/utilities.css`.
  Tracked in [#248](https://github.com/codeslash-dev/SLASHED/issues/248).

## Under consideration

- **Per-layer opt-in bundle via `@import`** — already possible today via the
  granular `core`/`optional` files (`core/layers.css` first); needs docs, not
  code.
- **Native CSS custom functions (`@function`)** — an `optional/functions.css`
  module exposing a true `--fluid(min, max)` (and friends), once cross-engine
  support for `@function` exists. Until then the documented `clamp()` recipe
  covers ad-hoc fluid values without a build step.
- **Heading helper utilities** — activate `.sf-h1`–`.sf-h6` in
  `optional/utilities.css` so elements can take heading typography without
  changing document semantics.
- **Skeleton shape component** — ship `.sf-skeleton` plus shape modifiers such as
  `.sf-skeleton--text`, `.sf-skeleton--line`, `.sf-skeleton--avatar`, and
  `.sf-skeleton--card` in the optional components layer. Item 8 of
  [#384](https://github.com/codeslash-dev/SLASHED/issues/384).
- **Z-index utilities** — expose the named z-index scale as `.sf-z-*` classes
  (for example `.sf-z-modal` and `.sf-z-tooltip`) in `optional/utilities.css`.
- **First component tranche** — implement `.sf-btn`, `.sf-card`, `.sf-badge`,
  and `.sf-tag` first, using `optional/tokens.components.css` and existing
  `.is-*` states where appropriate. Tracked in
  [#384](https://github.com/codeslash-dev/SLASHED/issues/384); `.sf-btn`/`.sf-card`
  specifically in [#493](https://github.com/codeslash-dev/SLASHED/issues/493) /
  [#494](https://github.com/codeslash-dev/SLASHED/issues/494) (see Post-1.0 note
  on overlapping tracking above).
- **Standalone table pattern** — add `.sf-table`, `.sf-table-scroll`, and compact
  variants such as striped, bordered, and compact tables without changing global
  `table` styles or `.sf-prose table` behaviour.
- **Form layout helpers** — complement `optional/forms.css` with opt-in structure
  classes such as `.sf-field`, `.sf-field__label`, `.sf-field__hint`,
  `.sf-field__error`, `.sf-form-row`, `.sf-form-col`, and `.sf-form-inline`.
- **Remaining optional components** — after the first component tranche, complete
  `.sf-alert`, `.sf-avatar`, and `.sf-modal` with token-driven variants and
  native `<dialog>` compatibility where applicable. Items 5–7 of
  [#384](https://github.com/codeslash-dev/SLASHED/issues/384).
- **Outline button variant** — a border-only `.sf-btn--outline` style, plus a
  possible gradient-border follow-up, once the base `.sf-btn` variant set ships.
  Tracked in [#486](https://github.com/codeslash-dev/SLASHED/issues/486).
- **Decorative animation utility classes** — the keyframes for `sf-spin`,
  `sf-shimmer`, `sf-ping`, `sf-blink`, and `sf-float` are already defined in
  `core/motion.css`; they need corresponding `.sf-spin`, `.sf-shimmer`, etc.
  utility classes in `optional/utilities.css` to be usable from markup.
- ~~**Hover-transform utility classes**~~ ✓ **Done** — `.sf-hover-grow`,
  `-shrink`, `-float`, `-sink`, `-slide-start`, `-slide-end` are written and
  documented, staged (commented out) in `optional/utilities.css` alongside
  the other opt-in utilities, pending activation.
  Tracked in [#487](https://github.com/codeslash-dev/SLASHED/issues/487).
- ~~**Overflow-detection debug utility**~~ ✓ **Done** — `.sf-debug-overflow`
  visually flags the element(s) causing horizontal page overflow, staged
  (commented out) in `optional/utilities.css` pending activation.
  Tracked in [#495](https://github.com/codeslash-dev/SLASHED/issues/495).
- **Interactive `drives N` exploration** — turn the configurator's passive
  dependency-count badge into a keyboard-accessible popover/list that navigates
  to dependent tokens.
- **Motion configurator UX expansion** — extend the existing motion domain with
  richer previews, motion presets, `--sf-motion-scale` affordances, animation
  tokens, and transition-token editing.
- **Configurator: live hover preview in CheatsheetPanel** — hovering a
  class/token entry in `CheatsheetPanel.svelte` live-previews it against the
  current `PreviewPanel` element, reverting on mouseleave.
  Tracked in [#470](https://github.com/codeslash-dev/SLASHED/issues/470).
- **Design-token export formats** — CSS and SLASHED theme JSON already exist;
  consider Figma Tokens, W3C Design Tokens, and Style Dictionary export/import if
  design-tool workflows become a priority. DTCG/W3C export specifically tracked
  in [#361](https://github.com/codeslash-dev/SLASHED/issues/361).
- **Versioned token manifest + JSON Schema** — promote `docs/api-index.json` to
  a versioned, published artifact with a companion JSON Schema so external
  tools (WP plugin, configurator, editors, linters) can consume the
  token/class catalogue against a stable contract, validated in CI.
  Tracked in [#360](https://github.com/codeslash-dev/SLASHED/issues/360).
- **Consumer-facing Stylelint plugin/config** — a shippable, separately
  published Stylelint config that lints *consumer* projects using SLASHED
  (`@layer` order, `sf-`/`is-` reserved-name collisions, raw values that
  should be tokens). Tracked in
  [#363](https://github.com/codeslash-dev/SLASHED/issues/363).
- **Distilled AI-assistant context file (`llms.txt`)** — a compact,
  build-generated distillation of `docs/llm-guide.md` for consumers to drop
  into their own AI coding assistant's context.
  Tracked in [#472](https://github.com/codeslash-dev/SLASHED/issues/472).
- **MCP server for live token/class data** — explore an MCP server exposing
  the generated token/class/API-index data as live tools/resources
  (`search_tokens`, `get_class_info`, etc.) for AI coding assistants, as a
  live alternative to the static `llms.txt`.
  Tracked in [#473](https://github.com/codeslash-dev/SLASHED/issues/473).
- ~~**Concave/inverted corner utility**~~ ✓ **Done** — shipped as
  `.sf-corner-scoop` (mask-based radial-gradient cut) with 4 single-corner
  position variants (`--top-left`/`--top-right`/`--bottom-left`/`--bottom-right`).
  A two-corner "pair variant" (for U-shaped cutouts) was explored and
  dropped — WebKit's `mask-composite` implementation has a bug with no
  viable workaround found.
  Tracked in [#484](https://github.com/codeslash-dev/SLASHED/issues/484).
- ~~**Boxed-section layout primitive**~~ ✗ **Not planned** — a `.sf-boxed`
  section macro was implemented and then dropped after review; judged too
  thin a wrapper over existing primitives (`.sf-section` + border/shadow/
  radius tokens) to justify a dedicated class.
  Tracked in [#485](https://github.com/codeslash-dev/SLASHED/issues/485).
- ~~**Flex-based grid alternative**~~ ✓ **Done** — shipped as `.sf-grid-flex`
  (+ size/gap/`--center` variants) alongside `.sf-grid`/`.sf-equal`/
  `.sf-grid-cols-*`, documented for the uneven-item-count case.
  Tracked in [#488](https://github.com/codeslash-dev/SLASHED/issues/488).
- ~~**Unified background media overlay macro**~~ ✓ **Done** — resolved as
  composition guidance rather than a new macro: `.sf-scrim` composed with
  the existing `.sf-bg` background-media primitive already layers a
  color/gradient overlay with correct automatic stacking; documented in
  `docs/macros.md` instead of adding a redundant class.
  Tracked in [#489](https://github.com/codeslash-dev/SLASHED/issues/489).
- **Concrete recipe macros** — **partially done**. Shipped: `.sf-corner-scoop`
  (border-radius-style recipe, tracked as #484 above) and `.sf-overlap`/
  `.sf-overlap-host` (overlap + card-container recipes). A `.sf-corners`
  logical-corner recipe (with a `--leaf` asymmetric variant) was also built
  and then cut — judged too niche for the public API relative to its
  long-term maintenance cost.
  Tracked in [#490](https://github.com/codeslash-dev/SLASHED/issues/490).
- **Container-relative fluid scale** — the `--sf-text-*`/`--sf-space-*` fluid
  scales are `100vw`-driven and don't respond to `@container` width the way
  the layout primitives do; investigate a `cqi`-based opt-in variant for
  nested/narrow contexts (sidebars, cards) without replacing the
  viewport-based page-level default. A technique spike was posted as an
  issue comment; no code shipped yet.
  Tracked in [#497](https://github.com/codeslash-dev/SLASHED/issues/497).
- **Hero recipe / alias** — document or optionally add a `.sf-hero` convenience
  pattern that composes existing `.sf-cover` and `.sf-scrim` behaviour.
- **Scroll progress bar recipe** — consider an optional JS-assisted or
  scroll-timeline-enhanced reading progress pattern once fallback expectations
  are clear.
- **Auto-grid ratio helper** — evaluate whether a ratio-driven auto-grid adds
  enough value beyond the existing `--sf-grid-min` / `.sf-grid--fit` API.
- **Animated link effects** — extend existing link variants with opt-in effects
  such as underline growth or fade behaviours while preserving accessible
  reduced-motion fallbacks.

## Out of scope

- **A full utility-first API** — SLASHED remains BEM-first and token-first. Small,
  token-backed, single-purpose helpers may be considered in `optional/utilities.css`,
  but a broad Tailwind-style utility surface is out of scope.
