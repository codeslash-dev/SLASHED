# SLASHED — Roadmap

Current version: **0.7.16**

## Before v1.0

*All pre-v1.0 items are complete as of v0.6.0. The API is frozen for
non-additive changes; the v0.6.x series focuses on the components layer.*

## Post-1.0

- **Components layer** — the `slashed.components` layer is declared and its first
  tranche is now live: **`.sf-btn` and `.sf-card` shipped in v0.7.0**
  ([#493](https://github.com/codeslash-dev/SLASHED/issues/493) /
  [#494](https://github.com/codeslash-dev/SLASHED/issues/494)), including the
  outline `.sf-btn--outline` variant
  ([#486](https://github.com/codeslash-dev/SLASHED/issues/486)), a button size
  scale, and `.sf-card` modifiers. The remaining `.sf-*` components
  (badge, tag, alert, avatar, modal, skeleton) stay staged in
  `optional/components.css` and land incrementally in later minors. Tracked in
  [#384](https://github.com/codeslash-dev/SLASHED/issues/384) (consolidated
  tranche).
- ~~**`@property` for spacing/shadow tokens**~~ ✓ **Done** — spacing (`--sf-radius-*`,
  `--sf-space-*`, semantic spacing) and shadow (`--sf-shadow-*`, `--sf-text-shadow-*`,
  `--sf-drop-shadow-*`) tokens are already registered via `@property` in
  `core/tokens.css`, alongside the existing colour registrations. Transitions on
  layout values and DevTools inspection both work.
- **Consolidate named surfaces onto `.sf-surface`** — the 10 `.sf-surface--*`
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
  `.sf-skeleton--rect` in the optional components layer. Item 8 of
  [#384](https://github.com/codeslash-dev/SLASHED/issues/384).
  **Naming decision (resolved,
  [#575](https://github.com/codeslash-dev/SLASHED/issues/575)):** `.sf-skeleton`
  keeps the industry-standard component name; the shipped shimmer *state*
  `.sf-is-skeleton` will be renamed to `.sf-is-shimmer` (a breaking rename
  landing together with the `.sf-skeleton` implementation) so "skeleton" means
  exactly one thing — the component, which composes with `.sf-is-shimmer` for
  the shimmer effect. Shape modifiers must not reuse component names: the
  card-like placeholder shape is `--rect` (geometric), never `--card`, to avoid
  implying parity with `.sf-card`'s token set.
- **Z-index utilities** — expose the named z-index scale as `.sf-z-*` classes
  (for example `.sf-z-modal` and `.sf-z-tooltip`) in `optional/utilities.css`.
- **First component tranche** — `.sf-btn` and `.sf-card` shipped in v0.7.0
  (see Post-1.0 note); `.sf-badge` and `.sf-tag` are next, using
  `optional/tokens.components.css` and existing `.sf-is-*` states where
  appropriate. Tracked in
  [#384](https://github.com/codeslash-dev/SLASHED/issues/384).
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
- ~~**Outline button variant**~~ ✓ **Done (0.7.0)** — the border-only
  `.sf-btn--outline` style shipped with the first component tranche. The
  gradient-border version shipped as the real `.sf-btn--gradient` modifier in
  0.7.7 (fill + outline, core-4 brand families), replacing the earlier
  copy-paste recipe in `docs/components.md`. Tracked in
  [#486](https://github.com/codeslash-dev/SLASHED/issues/486) /
  [#571](https://github.com/codeslash-dev/SLASHED/issues/571).
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
- ~~**Divide-between-children macro**~~ ✓ **Done** — `.sf-divide` (+
  `--vertical`) applies a border between direct children in one class,
  reusing `.sf-divider`'s width/style/color tokens. Shipped (active) in
  `core/layout.css`.
  Tracked in [#537](https://github.com/codeslash-dev/SLASHED/issues/537).
- ~~**Global media radius**~~ ✓ **Done** — `--sf-media-radius` (0 by
  default, off) applied via `:where(img, figure)` in `core/base.css`; opt
  in globally by setting the token, without fighting `.sf-bg-layer` or a
  component's own radius (layer order + zero specificity).
  Tracked in [#529](https://github.com/codeslash-dev/SLASHED/issues/529).
- ~~**Scroll-out (exit) effects**~~ ✓ **Done** — `.sf-exit--fade/-fade-up/
  -fade-down/-fade-left/-fade-right/-scale-down` mirror `.sf-entrance--*`
  using `animation-timeline: view()` with a `cover 70%` → `exit 100%`
  range. Unlike entrance, `animation-name` is set only inside
  `@supports (animation-timeline: view())`, so engines without scroll-driven
  animation support leave the element visible instead of fading it out
  unconditionally. Shipped (active) in `core/motion.css`.
  Tracked in [#527](https://github.com/codeslash-dev/SLASHED/issues/527).
- ~~**Small utilities: `.sf-list-none` / `.sf-selection--alt`**~~ ✓ **Done**
  — both written and staged (commented out) in `optional/utilities.css`
  pending activation, alongside the other opt-in utilities.
  `.sf-selection--alt` overrides `--sf-color-selection-bg/-text` via new
  `--sf-color-selection-*--alt` tokens.
  Tracked in [#540](https://github.com/codeslash-dev/SLASHED/issues/540).
- ~~**Sticky positioning utility**~~ ✓ **Done** — `.sf-sticky` plus
  `--s/-m/-l` offset modifiers, active in `optional/utilities.css`, layering
  extra gap on top of the existing `--sf-sticky-offset` fluid offset. This is
  now the sole sticky mechanism — the redundant sticky state class was
  removed (`position: sticky` is conditional by nature and needs no runtime
  toggle).
  Tracked in [#542](https://github.com/codeslash-dev/SLASHED/issues/542).
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
  (`@layer` order, `sf-`/`sf-is-` reserved-name collisions, raw values that
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
  the existing `.sf-bg-layer` background-media primitive already layers a
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

The following are **permanently excluded** — deliberate architectural decisions,
not backlog. They should not be re-proposed or picked up by accident:

- **Runtime JavaScript in the framework core** — the core ships zero runtime JS and
  will keep doing so. Viewport-triggered "reveal on scroll / on-visible" behaviour
  that depends on an `IntersectionObserver` is out of scope for `core/`; the supported
  surfaces are the CSS-only `.sf-is-visible` state hook and scroll-timeline `view()`
  entrance animations. Any observer-driven JS belongs to host/integration layers,
  never to the framework bundle.
- **A consumer-facing preprocessor layer (mixins / functions)** — SLASHED is authored
  and shipped as plain CSS with no build step for consumers. We will not expose an
  `@include`/`@function`-style mixin or helper-function authoring API. Native CSS
  (`calc()`, `pow()`, `color-mix()`, relative colour syntax, and — when it lands —
  CSS `@function`) is the intended substitute.
- **Prefix-based automatic component styling** — the framework will not auto-style
  arbitrary classes by name pattern (e.g. "style everything matching `*--primary` or
  `.btn-*`"). Components are explicit BEM classes (`.sf-*`); there is deliberately no
  "style anything that matches this prefix" mechanism.
- **Viewport-breakpoint utilities / breakpoint mixins** — responsiveness is expressed
  with container queries and intrinsic, breakpoint-free techniques. A media-query
  breakpoint utility or mixin system (viewport `--l-`/`--md:` suffixes,
  `breakpoint()`-style helpers) is out of scope.
- **Snippet-expansion ("recipe") syntax** — a `?name`-style token that expands into a
  CSS block requires a preprocessor or builder pass, which the pure-CSS framework will
  not implement. Editor/builder integrations may offer their own snippets; that is an
  integration concern, not a `core/` feature.
- **Selector-list-driven rule generation** — the framework will not read a
  user-supplied list of selectors and graft component rules onto them (e.g. "apply
  these card styles to this selector list"). Consumers opt in by applying the
  component class itself.
- **Per-channel colour partials (`-h`/`-s`/`-l`, `-r`/`-g`/`-b`)** — the colour system
  is built on OKLCH, relative colour syntax, and `color-mix()`. We will not ship
  per-channel HSL/RGB partial tokens for manual recomposition; relative colour syntax
  covers those cases.
- **Placeholder-content and script-wrapper helpers** — generating dummy/lorem text or
  `<script>` boilerplate is not a styling concern and is out of scope for a CSS
  framework.
