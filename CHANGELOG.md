# SLASHED Framework Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.6.4] - 2026-06-21

### Features
- merge per-size typography sub-properties into core/tokens.css

### Bug Fixes
- remove trailing comma in artifacts.json

## [0.6.4] - 2026-06-20

### Features
- merge per-size typography sub-properties into core/tokens.css

### Bug Fixes
- remove trailing comma in artifacts.json

## [0.6.3] - 2026-06-19

### Bug Fixes
- **ci:** ensure both downstream dispatches run even if one fails
- **ci:** always dispatch configurator deploy on release

## [0.6.2] - 2026-06-19

### Bug Fixes
- **configurator:** prioritize group description annotations over source descriptions
- **docs:** correct sf-bento--compact annotation to row height not gap
- **docs:** add core/themes.css to gen-class-reference and regenerate
- **docs:** correct token descriptions in generated API index

## [0.6.1] - 2026-06-19

### Breaking Changes
- drop the last backward-compat token alias (pre-1.0)

## [0.6.0] - 2026-06-19

### Breaking Changes
- flatten gap tokens to base→semantic→component model
- v0.6.0 usability-driven token-surface reduction

### Bug Fixes
- pin undici to >=7.28.0 via overrides to resolve high-severity CVEs

## [0.6.0] - 2026-06-18

A usability-driven token-surface reduction: ~182 tokens removed from the public
API (876 → 694) by cutting power-user/vestigial families that real marketing,
landing, and business sites never reach for, while keeping (and clarifying) the
families they do. See `docs/migration.md` for the upgrade guide.

### Features
- **themes:** add opt-in `.sf-theme-transition` helper + `--sf-theme-transition-duration` knob for a soft light/dark cross-fade
- **tokens:** add `--sf-blur` (single frosted-surface default) and `--sf-opacity-muted`
- **tokens:** add semantic font-weight roles `--sf-font-weight-interactive` and `--sf-font-weight-strong`
- **tokens:** z-index is now a semantic, Bootstrap/Chakra-style ladder — adds `--sf-z-modal`, `--sf-z-tooltip`
- **tokens:** flatten the gap system to a base→semantic→component model — three semantic rhythms `--sf-gap` (loose), `--sf-content-gap` (tight), `--sf-gutter` (wide); every layout primitive defaults straight to one
- **tokens:** brand ghost/subtle/muted tokens (`--sf-color-{primary,secondary,tertiary,action,neutral,base}-{ghost,subtle,muted}`) moved from `optional/tokens.palette.css` to `core/tokens.css` — now available in the essential bundle, no longer requiring the optional palette file

### Bug Fixes
- **tokens:** `--sf-color-text--muted` now uses a contrast-aware neutral-lightness formula instead of a plain neutral reference
- **tokens:** `--sf-color-text--on-inverse` now correctly references `--sf-color-inverse` (was `--sf-color-text--inverse`)
- **tokens:** add `var(--sf-color-bg, …)` fallback to `--sf-focus-ring-shadow` for contexts where `--sf-color-bg` is unset
- **forms:** scope button default styles to `:not([class*="sf-"])` to avoid overriding Slashed UI component classes

### Changed
- **tokens:** alpha transparency for brand ghost/subtle/muted tokens now uses `oklch(from …)` syntax instead of `color-mix(…, transparent)` — equivalent output, better color-space fidelity
- **optional/tokens.palette.css:** numeric alpha scale is now gated behind `@supports (color: oklch(from red l c h))`; older engines receive no alpha tokens instead of invalid values

### ⚠️ Breaking Changes
- **tokens:** removed the combinatorial fluid-pair "bridge" matrix `--sf-{space,text}-{step}-to-{step}` (optional/tokens.sizes-extended.css). Use the already-fluid base scales, or a custom `clamp()`.
- **tokens:** trimmed alpha ramps to 5 steps per family — kept `-a5/-a10/-a30/-a50/-a80`; removed `-a20/-a40/-a60/-a70/-a90/-a95`. For an intermediate alpha use `oklch(from var(--sf-color-x) l c h / .NN)`.
- **tokens:** removed the custom fluid slots `--sf-fluid-custom-{1,2,3}` and their `-min`/`-max` endpoints. Write a `clamp()` directly; engine knobs `--sf-fluid-{min,max}-vw` are unchanged.
- **tokens:** collapsed the 5-step blur scale `--sf-blur-{xs,s,m,l,xl}` to a single `--sf-blur`. Other amounts: inline `blur(Npx)`.
- **tokens:** removed the numeric opacity scale `--sf-opacity-{0,10,25,50,75,100}`. Kept `--sf-opacity-disabled`; added `--sf-opacity-muted` (0.5).
- **tokens:** removed stroke presets `--sf-stroke-{thin,regular,bold,heavy}`. Set SVG `stroke-width` directly or reuse `--sf-border-width-*`.
- **tokens:** removed multi-column presets `--sf-col-width-{s,m,l}` and `--sf-col-rule-width-{s,m,l}`.
- **tokens:** removed `--sf-truncate-suffix` (was never read — `text-overflow` string values are Firefox-only).
- **tokens:** removed rare font-weights `--sf-font-weight-{thin,extralight,extrabold,black}`. Kept `light/normal/medium/semibold/bold`; for an off-scale weight write `font-weight: 100` or override a role token. **`--sf-body-strong-weight` now references `--sf-font-weight-strong`.**
- **tokens:** removed the z-index numeric ladder `--sf-z-{low,mid,high,top,max}`. Use the semantic roles `--sf-z-{sticky,fixed,dropdown,overlay,modal,toast,tooltip}` (values shifted to the 1000-base Bootstrap/Chakra convention).
- **tokens:** flattened the gap aliases. Removed the middle "layout" tier `--sf-space-gap`, `--sf-space-content`, `--sf-space-gutter`, `--sf-gap-size`, and folded the container gutter into a single `--sf-gutter` (no separate `--sf-gutter-width`/`--sf-space-gutter`). Layout primitives now default straight to the semantic `--sf-gap` / `--sf-content-gap` / `--sf-gutter`. To retune all primitives at once, override the semantic token (e.g. `--sf-gap`); per-primitive knobs (`--sf-cluster-gap`, …) are unchanged.
- **tokens:** removed the `--sf-color-text--on-surface` compat alias — use `--sf-color-text--on-base`. SLASHED is pre-1.0 and retains no backward-compat aliases.

## [0.5.47] - 2026-06-18

### Bug Fixes
- **tokens:** add static fallbacks for --sf-color-text--on-* outside sign() gate
- **print:** globally force-expand all <details> in print
- **macros:** correct margin-block-end-only on prose lists
- **print:** scope details rules to .sf-prose; remove sub-floor RTL fallback
- **demo:** add sf-scrim__content and sf-clickable-parent__overlay examples
- **post-freeze:** implement category-2 audit fixes for issue #327

## [0.5.46] - 2026-06-17

### Features
- **layout:** add .sf-cq and refactor .sf-equal to RAM pattern
- **configurator:** foldable generators, fullscreen preview, a11y & theme import/export
- **bento:** default 4 cols, add child span modifiers (School 1)

### Bug Fixes
- **themes,tokens:** add [data-theme="light"] scoped token re-declarations and correct -dark token group
- **themes:** re-declare surface and on-colour tokens in [data-theme="dark"]
- **tokens,tests,docs:** register -dark tokens as @property <color> and update baselines
- **tests:** add 11 -dark @property tokens to token-api snapshot
- **tokens,themes:** re-enable @property <color> for computed tokens via -dark source tokens
- **tokens:** remove @property registration for computed color tokens
- **tokens:** computed color mirrors resolve via -light tokens, not hardcoded values
- **tokens,layout,macros:** pre-freeze audit fixes — overflow fallback, color @property, radius-2xs, equal tokens
- extend prose heading gap to h5/h6 and fix entrance animation fill-mode
- **framework:** cover-max min-height bug + overflow logical property fallbacks
- **framework:** audit — replace transition-all, motion/a11y/form fixes
- **docs:** update sf-grid-cols-1 description to reflect no container context
- **ci:** sync configurator api-index.generated.json
- **ci:** sync docs and registry with bento API changes
- **bento:** remove redundant .sf-bento--3
- **lumlocker:** scope to 4 brand colors, fix section-theme bypass

## [0.5.45] - 2026-06-15

### Bug Fixes
- **tests:** update semantic snapshot for opaque --sf-color-text--muted
- restore select chevron, make muted text opaque, fix is-* group metadata

## [0.5.44] - 2026-06-15

### Features
- **api-freeze:** implement all Category 1 pre-freeze public API changes
- **preview:** comprehensive framework showcase with 7 tabbed sections
- notify slashed-plugins when configurator source changes
- **configurator:** make consume tokens read-only

### Bug Fixes
- preserve @layer declaration in minified CSS bundles
- **tests:** sync token-api snapshot with new tokens from merged PR
- **tests:** update snapshots for new h*-max-width tokens and border-scale
- **tests:** update api-index-sync and p7-oldengine after HSL fallback removal
- **docs:** update all references to renamed tokens and layout classes
- **a11y:** forced-colors fixes for text-gradient, spinner, and button borders
- **api-freeze:** move component tokens to tokens.components.css, drop premature utility classes
- **preview:** address CodeRabbit a11y findings
- add permissions block to notify workflow (CodeQL)
- **tests:** use power-knob number input for preset-deactivation test
- **tests:** use shadow-strength knob for preset-deactivation test
- **tests:** update presets test to use a knob token

### Reverts
- **layout:** restore .sf-equal class and --sf-equal-cols/--sf-equal-gap tokens

## [0.5.44] - 2026-06-15

### Features
- **api-freeze:** implement all Category 1 pre-freeze public API changes
- **preview:** comprehensive framework showcase with 7 tabbed sections
- notify slashed-plugins when configurator source changes
- **configurator:** make consume tokens read-only

### Bug Fixes
- **tests:** sync token-api snapshot with new tokens from merged PR
- **tests:** update snapshots for new h*-max-width tokens and border-scale
- **tests:** update api-index-sync and p7-oldengine after HSL fallback removal
- **docs:** update all references to renamed tokens and layout classes
- **a11y:** forced-colors fixes for text-gradient, spinner, and button borders
- **api-freeze:** move component tokens to tokens.components.css, drop premature utility classes
- **preview:** address CodeRabbit a11y findings
- add permissions block to notify workflow (CodeQL)
- **tests:** use power-knob number input for preset-deactivation test
- **tests:** use shadow-strength knob for preset-deactivation test
- **tests:** update presets test to use a knob token

### Reverts
- **layout:** restore .sf-equal class and --sf-equal-cols/--sf-equal-gap tokens

## [0.5.43] - 2026-06-13

### Features
- **configurator:** add light/dark mode toggle for the configurator UI

## [0.5.42] - 2026-06-13

### Features
- **configurator:** add Gradients, Palette, and Forms sidebar domains
- **configurator:** expand live preview with gradients, navigation, form states, motion

### Bug Fixes
- **configurator:** use correct duration token names in motion preview
- **tests:** update assertions for logical property changes + fix version sync

## [0.5.41] - 2026-06-13

### Bug Fixes
- **release:** add actions:write and use gh CLI for workflow dispatch
- **release:** dispatch deploy/dist workflows after sync-main push

## [0.5.40] - 2026-06-13

### Bug Fixes
- **configurator:** two root-cause bugs on mobile
- **configurator:** prevent spacing-scale bars from overflowing Preview pane
- **configurator:** prevent ScaleGenerator preview from overflowing on mobile

## [0.5.39] - 2026-06-13

### Bug Fixes
- **configurator:** hide brand-colors card in Advanced mode (filter bypass)
- **configurator:** hide essentials card in Advanced mode

## [0.5.38] - 2026-06-13

### Bug Fixes
- **configurator:** eliminate preview flash + fix narrow-viewport overflow

## [0.5.37] - 2026-06-13

### Bug Fixes
- **configurator:** track viewport changes for output drawer collapse
- **configurator:** collapse output drawer on mobile + limit max-height
- **configurator:** remove unused sync import from css.js
- **configurator:** inject version at build time — eliminates off-by-one release bug

## [0.5.36] - 2026-06-12

### Features
- **configurator:** ux/a11y polish — escape, focus, persisted prefs, meta

### Bug Fixes
- **configurator:** resolve horizontal overflow + CodeRabbit review fixes
- **configurator:** font-weight tokens no longer get font-family picker + draggable pane widths
- **configurator:** preview overlay self-contained controls + a11y polish
- **configurator:** garbage css import no longer wipes existing overrides
- **configurator:** track viewport changes live + dedupe count helpers
- **configurator:** make the live preview reachable on narrow viewports

## [0.5.35] - 2026-06-11

### Features
- **configurator:** docs links per domain, header export shortcut
- **configurator:** scalar-writing scale generator + style preset rows
- **configurator:** curated Basic forms with friendly labels
- **configurator:** demote quick knobs to Advanced, add Basic Home screen

### Bug Fixes
- **configurator:** address review feedback on PR #311

## [0.5.34] - 2026-06-11

### Bug Fixes
- address CodeRabbit review comments
- **tokens:** classify --sf-shadow-strength as role:knob in generation pipeline
- **configurator:** audit fixes — resetDomain history, shadow role, dead code
- **configurator:** add danger to brand color keys
- **configurator:** brand colors, consume/configure filter, cheatsheet tab
- **configurator:** domain essentials, token descriptions, css source banners
- **configurator:** address 6 reported issues

## [0.5.33] - 2026-06-10

### Features
- **configurator:** add configure/consume usage filter for token classification
- **badges:** add optimal bundle size, zero-deps, and CDN badges

### Bug Fixes
- **configurator:** replace overflow:hidden with overflow:clip in panel cards
- **configurator:** address code-review findings on mobile layout
- **badges:** use namedLogo instead of logo in endpoint badge JSON
- **bundle:** warn instead of silently skip when badge bundle is missing
- **configurator:** fix token editor overflow hiding inputs on mobile
- **configurator:** correct version display and improve mobile header layout

## [0.5.32] - 2026-06-10

### Features
- **configurator:** knob-density pack — slider editors, drives/contrast badges, viewport ruler, RM preview, diff view
- **configurator:** automatic.css-tier DX — quick knobs, theme presets, undo/redo
- **configurator:** full redesign — categorised UI, sidebar nav, classifier coverage
- palette mix knobs, surface cascade, [data-theme] bg fix, alpha leak fix

### Bug Fixes
- **configurator:** address CodeRabbit review on knob-density commit
- **configurator:** honour quoted parens in light-dark() depth scan
- **configurator:** tabbed Basic/Advanced UI, dark-mode preview, display scale
- address review findings on palette knobs, docs, and tier metadata

## [0.5.31] - 2026-06-10

### Added
- **Custom fluid slots** — `--sf-fluid-custom-{1,2,3}` ad-hoc fluid values: set
  a `-min`/`-max` endpoint pair (unitless rem), read the slot as a length that
  interpolates across the engine's viewport range and recalibrates with
  `--sf-fluid-{min,max}-vw`.
- **Generic surface** — `.sf-surface` (`core/macros.css`) + `--sf-surface-color`
  (`core/tokens.macros.css`): give it any color (including palette shades) and
  it derives background, auto-contrast foreground, and the full contextual
  token cascade — extending the colour-context contract beyond the 11 named
  `.sf-surface--*` variants.
- **`--sf-section-scale`** — global multiplier over every `--sf-section-pad--*`
  size; one dial re-rhythms all section padding (default `1`, no visual change).
- **`--sf-leading-taper`** — progressive per-size line-height tightener consumed
  by `optional/tokens.sizes-extended.css` (default `0`, no visual change).
- **`optional/config-example.css`** — single annotated "control panel" reference
  file: brand colours, the 12 fluid-engine inputs, custom slots, all scale
  multipliers, font families, radius.
- **docs:** new "Fluid engine" and "Root size, rem and user zoom" sections in
  `docs/theming.md` (engine inputs, worked examples, canonical `clamp()`
  recipe); generic-surface + author-your-own-surface recipes in
  `docs/macros.md`; "Fluid engine" section in the README; roadmap entries for a
  native `@function --fluid()` module and surface consolidation.

## [0.5.30] - 2026-06-10

### Bug Fixes
- **configurator:** render WCAG color swatches, sync to 0.5.29, show display type

## [0.5.29] - 2026-06-10

### Features
- **configurator:** unify into one palette generator + on-color usage preview
- **configurator:** add WCAG color locks + richer live preview
- **pages:** deploy full docs site — docs, demo, coverage, configurator

### Bug Fixes
- **configurator:** gate usage-preview roles on the on-color token too
- **configurator:** address self-review of the OKLCH generator
- **pages:** fix _site permission denied after jekyll-build-pages

## [0.5.28] - 2026-06-09

### Features
- **configurator:** add Accessibility + Scales views and shared parity modules
- **configurator:** add Accessibility + Scales views and shared parity modules
- **picker:** convert hex and hsl → oklch on parse
- **configurator:** oklch/oklab picker, wider inputs, token descriptions

### Bug Fixes
- **configurator:** a11y polish on the new tools (self-review)
- **configurator:** a11y polish on the new tools (self-review)
- **annotations:** remove duplicate --sf-color-dim key; widen artifact srcPrefixes
- **artifacts:** auto-sync configurator on token-annotations.json changes

## [0.5.27] - 2026-06-09

### Features
- **tokens:** retier fluid -to- bridges as PUBLIC-ADVANCED and add knob/consumption role axis
- **release:** auto-generate changelog + restore Unreleased + breaking-change guard

### Bug Fixes
- **release:** address CodeRabbit review findings
- convert changelog-release.js to ES module + sync v0.5.26 artifacts

## [0.5.26] - 2026-06-09

> **Note:** v0.5.25 was published on 2026-06-08 but its `sync-main` CI step
> failed due to the ESM `require()` bug fixed in this release. That release had
> no additional changes relative to v0.5.24; v0.5.26 supersedes it.
- **Generative fluid scale engine** — the fluid type, display, and space scales are now computed at runtime from override-able input tokens instead of hard-coded `clamp()` slopes. No build step.
  > ### Added
  > - `--sf-fluid-min-vw` / `--sf-fluid-max-vw` — fluid interpolation viewport range (rem, unitless). Override once to recalibrate every fluid token.
  > - `--sf-text-ratio-min` / `--sf-text-ratio-max`, `--sf-text-base-min` / `--sf-text-base-max` — generative TYPE scale inputs (dual modular ratio: 1.25 mobile → 1.333 desktop).
  > - `--sf-text-display-base-min` / `--sf-text-display-base-max` — generative DISPLAY scale base (reuses the type ratios).
  > - `--sf-space-ratio-min` / `--sf-space-ratio-max`, `--sf-space-base-min` / `--sf-space-base-max` — generative SPACE scale inputs (independent of type).
  > - `--sf-display-s-line-height` / `--sf-display-m-line-height` / `--sf-display-l-line-height` — tighter leading for display sizes (not auto-applied; wire alongside `font-size`).
  > - `--sf-prose-blockquote-padding`, `--sf-prose-blockquote-border`, `--sf-prose-hr-margin`, `--sf-prose-nested-list-gap`, `--sf-prose-table-pad` — extended `.sf-prose` editorial spacing knobs (auto-applied inside `.sf-prose`, reset by `.sf-not-prose`).
  > - `.sf-surface--*` now also rebind `--sf-color-link` / `--sf-color-link--hover` / `--sf-color-link--underline` so links on coloured surfaces stay contrast-safe (lightness preserved, chroma nudged; underline carries the affordance).
  > - `scripts/gen-sizes-extended.js` now emits the bridge matrix over the same generative engine, so `optional/tokens.sizes-extended.css` recalibrates with the inputs.
  >
  > ### Changed
  > - `--sf-text-*`, `--sf-text-display-*`, `--sf-space-*`, `--sf-header-height`, and `--sf-sticky-offset` formulas rewritten as `calc()`/`pow()` over the new inputs. Default computed values are within rounding of the previous scale.
  > - `core/tokens.color-fallbacks.css` (HSL legacy fallbacks) is no longer bundled into `slashed.essential*` — those bundles are now modern-only. It remains first-loaded in every `optimal*`/`full` bundle, and can be `<link>`ed before an essential build to restore old-engine colour fallbacks.
  >
  > ### Removed
  > - ⚠️ **Breaking:** `--sf-perspective-near` / `--sf-perspective-normal` / `--sf-perspective-far` — unused 3D tokens with no framework integration.
  >
  > ### Browser support
  > - ⚠️ Floor raised **Chrome 123 → 125** to gain the CSS `pow()` math function that drives the generative scales. Safari 17.5+ / Firefox 128+ unchanged.

- **#269** — fix changelog version ordering
  > Reorder PR summary newest→oldest (v0.5.24 → v0.0.1). Rename "Unreleased" to "v0.0.1 / Pre-release". Remove orphaned content block floating between sections.
- **#268** — consolidate post-0.3.0 work under v0.5.24 in CHANGELOG
  > Restructures CHANGELOG.md to assign 222 merged PRs to proper version buckets (v0.1.0–v0.5.24), replacing a perpetual [Unreleased] accumulation.
- **#267** — add CHANGELOG_FULL.md with complete development history
  > Adds CHANGELOG_FULL.md — a master changelog organized by version and category (Framework vs Plugins) covering all 222 PRs.
- **#266** — docs: consolidate and trim documentation
  > Merges three overlapping docs into existing files (dark-mode.md → theming.md, performance.md → architecture.md, browser-support.md → README). Cuts filler prose throughout.
- **#265** — docs: add token index (tier + fallback cross-reference)
  > Adds scripts/gen-token-index.js + docs/token-index.md — a generated per-token table cross-referencing stability tier (PUBLIC/ADVANCED/INTERNAL), source file, HSL fallback coverage, and default value for all 771 tokens.

## v0.5.24

- **#264** — consolidate post-0.3.0 work under v0.5.24
  > Fixes the framework changelog version history. The changelog was stuck at 0.3.0 with everything piled under a perpetual [Unreleased] section, even tho

## v0.5.0

- **#179** — Identity Refresh and Documentation Overhaul for v0.5.0
  > This comprehensive update refreshes the SLASHED framework's identity and documentation for the v0.5.0 release.
- **#181** — don't abort commits staging gitignored dist bundles
  > The .githooks/pre-commit hook rebuilds dist bundles and git adds every output. But dist/*.css is gitignored on main (built via npm run build, shipped 
- **#188** — complete color system — shade scale, section theming, swatch coverage
  > A comprehensive pass over the SLASHED color system touching the core framework CSS, the Bricks Builder integration, and the documentation. All changes
- **#192** — refresh all docs, add WordPress plugin section, fix version sync
  > - E: Edgeless → Explicit — describes @layer declaration order, BEM naming, and the token API contract more precisely than the opaque "Edgeless"
- **#194** — Rename --sf-color-base to --sf-color-surface
  > This PR renames the --sf-color-base token family to --sf-color-surface throughout the codebase, along with renaming --sf-color-well to --sf-color-inse
- **#196** — Harden CSS value validation and fix color export regression
  > This PR addresses critical security and correctness issues in the CSS generator and color handling:
- **#197** — move numeric scale ownership to tokens.palette.css
  > Removes 121 numeric-scale lines (50–950) from core/tokens.css across
- **#198** — Redesign SF colors panel: Quick Use + Palette layout, two distinct modes
  > Badge (bottom-right): reference-only. Click copies var() to clipboard.
- **#199** — Redesign SF Colors panel: Quick Use + Palette layout, two behaviour modes
  > - Two distinct modes replace the old single-mode panel:
- **#200** — handle border/box-shadow colour inputs without explicit type attribute
  > - SF Colors picker was throwing "Couldn't apply var… input not found" when used inside border and box-shadow controls, while working correctly for bac
- **#201** — SF Colors picker panel — Quick Use + Palette, active swatch, border support, base rename
  > Full overhaul of the SF Colors panel and the --sf-color-base brand family rename.
- **#203** — Add contextual color cascade and fluid layout dimension controls
  > This PR enhances the design system with two major features: a contextual color cascade for surfaces that automatically adapts semantic color tokens to
- **#209** — Replace modifier mode with multi-modifier support in all modes
  > This PR removes the dedicated "modifier" mode and instead adds support for multiple modifiers across all non-migrate modes (add, rename, replace). Mod
- **#210** — Build reBEMer editor app (multi-block + multi-modifier)
  > - Compiles the Svelte source changes from #209 into the deployed plugin assets
- **#211** — auto-rebuild all generated artifacts on commit + CI
  > - Adds scripts/artifacts.json — a single manifest mapping source globs → build command → outputs for every generated/compiled file in the repo
- **#213** — escape Liquid delimiters in rebemer.md code block
  > - Fixes the red cross on main — GitHub Pages build was failing with a Liquid syntax error
- **#224** — Add optional sizes-extended tokens and color/border shorthands
  > Introduces a new optional token module (optional/tokens.sizes-extended.css) that extends the core spacing and typography scales with bridge variables 
- **#226** — add All-in-one (mixed) mode with per-row op toggle and family picker
  > New 'mixed' mode in the reBEMer panel lets users assign BEM classes to a
- **#228** — Document all framework tokens/classes in cheatsheet with coverage enforcement
  > This PR significantly expands and reorganizes the Cheatsheet documentation to cover every token and class shipped in the framework, and adds automated
- **#229** — Sync viewport previews, revamp live preview, icon-trigger class hints
  > - Live Scale Preview sliders in the Spacing and Typography tabs now scrub
- **#232** — Fix SF color button state sync and touch event handling
  > This PR improves the reliability of the SLASHED color button in the Bricks editor by ensuring its visual state stays synchronized with the color input
- **#233** — restore -webkit-background-clip for .sf-text-gradient (Safari 17.5)
  > A full audit pass over the CSS source (core/ + optional/, 22 files) found the framework in excellent shape — stylelint is clean, tradeoffs are documen
- **#234** — native validation, autofill, auto-grow textarea & numeric/overlay tokens
  > Resolves the batch of well-scoped, low-risk open issues. Each change is additive, progressively enhanced, and built on existing tokens.
- **#235** — add .sf-content-auto and .sf-tabular-nums macros (#222, #214)
  > Follow-up to #234. Resolves the two remaining issues that I'd previously mis-shelved as "blocked utilities" — they're actually macros (token-driven re
- **#236** — class-family picker for rename/replace + remove-all toggle
  > In the reBEMer panel, Rename mode previously always renamed *the first* class on an element ("This element has 2 classes. Only the first will be renam
- **#237** — scrim, focus-shadow, divider & link recipes + auto-colour tests
  > Implements the recipe-tier enhancements and tests recommended after the SLASHED vs Automatic.css v4 audit. Everything here is a token-driven macro/rec
- **#239** — prepare for WordPress.org submission
  > - Add readme.txt (required for wp.org review)
- **#240** — WordPress.org submission prep, docs cleanup, ESM scripts
  > - WordPress.org submission prep — local-first CSS delivery (dist/ bundled in plugin), in-admin updater to download latest bundles from jsDelivr, optio
- **#241** — add feature-completeness & graceful-degradation issue backlog
  > Adds docs/issue-backlog.md — a grouped backlog of suggested GitHub issues covering feature completeness on the modern CSS baseline and graceful degrad
- **#251** — add path to maximum engine-design score
  > - Adds docs/path-to-max-score.md, a per-criterion roadmap for raising SLASHED toward the ceiling of the 14-category engine-design scoring model (max 1
- **#252** — Add comprehensive index documentation for optimal bundle
  > This PR adds a complete reference index document (docs/optimal-bundle-index.md) that exhaustively catalogs everything shipped in the SLASHED optimal b
- **#253** — add 100% framework coverage test pages
  > Adds a six-page manual cross-browser test suite under docs/, designed to exercise 100% of the framework in action. Loads only the full variant via the
- **#254** — add Tier-1 sRGB color fallbacks for pre-Chrome-123 / pre-Safari-17.5 engines
  > Implements the "gate at declaration site" pattern to fix IACVT failures on
- **#255** — add optimal bundle master index
  > Adds docs/optimal-bundle-index.md — a complete master reference for the dist/slashed.optimal.css bundle variant, built directly from all 18 source fil
- **#256** — keep WordPress plugin's bundled CSS in sync with core builds
  > The plugin ships local copies of the essential/optimal/full CSS bundles
- **#257** — version sync to 0.5.21 + pre-release audit fixes (0.6.0 prep)
  > Pre-release audit and cleanup ahead of the 0.6.0 freeze. This does not release 0.6.0 — it restores the version invariant to the current released versi
- **#259** — Remove unused semantic color variant tokens
  > Removed 45 unused semantic color variant tokens across success, warning, error, info, and danger color families. These tokens were defined but not uti
- **#260** — full token palette, gradients, font-size/spacing presets + in-editor token panel
  > Brings the Gutenberg integration up to parity with the Bricks one. The block editor was shipping a stale, hand-maintained 20-entry color palette with 
- **#261** — : wire scales, semantic z-index aliases, complete Tier-1 fallbacks
  > Token-layer audit follow-ups: fixes dead/non-functional tokens, completes the Tier-1 sRGB fallback coverage, adds a semantic z-index layer, and makes 
- **#262** — Split WordPress plugin into its own repo; decouple framework + docs cleanup
  > Prepares the framework repo for the upcoming API freeze by splitting the bundled WordPress plugin out into its own repository (codeslash-dev/slashed-f
- **#263** — Make framework plugin-agnostic and fix release version drift
  > Follow-up to the plugin split (#262). Removes leftover integration references from the framework and fixes the version pipeline that left bundle heade

## v0.3.0

- **#79** — class taxonomy + macros layer + components blueprint
  > Class taxonomy refactor for v0.3.0. Introduces the new slashed.macros cascade layer, ships 12 macro recipes, adds 3 ACSS-parity essentials (icon-boxed
- **#80** — add workflow_dispatch trigger to release workflow
  > Allows publishing a release manually (e.g. v0.3.0) without needing to
- **#82** — replace 'blueprint' with plain language
  > Replaces the word "blueprint" across docs, README, CHANGELOG, and CSS file headers with plain language ("not yet complete", "commented out", "8 compon
- **#85** — POC: Svelte 5 admin page (alongside legacy jQuery one)
  > Hypothetical, non-merging PR. Goal: see what adopting Svelte 5 for the admin settings page actually looks like in this codebase. Discardable.
- **#86** — Replace light-dark() with FieldText system color for select chevron
  > Replaces the light-dark() function with the CSS system color FieldText for the select element chevron SVG stroke. This simplifies the implementation w
- **#87** — bump softprops/action-gh-release from 2 to 3
  > Bumps [softprops/action-gh-release](https://github.com/softprops/action-gh-release) from 2 to 3.
- **#88** — bump actions/upload-artifact from 4.6.2 to 7.0.1
  > Bumps [actions/upload-artifact](https://github.com/actions/upload-artifact) from 4.6.2 to 7.0.1.
- **#89** — bump actions/checkout from 4 to 6
  > Bumps [actions/checkout](https://github.com/actions/checkout) from 4 to 6.
- **#90** — bump actions/setup-node from 4 to 6
  > Bumps [actions/setup-node](https://github.com/actions/setup-node) from 4 to 6.
- **#91** — surface macros, entrance effects, unified lightness, section collapse
  > Implements the full Tier 1 feature set discussed in the framework audit session:
- **#93** — surface macros, entrance effects, unified lightness, section collapse (replaces #91)
  > Replaces #91, which got tangled in non-fast-forward state after PR #92 landed and could not be cleanly updated in place.
- **#94** — Add comprehensive public API audit for SLASHED v0.3.0
  > This PR adds a detailed public API audit document (audits/audit-c.md) for SLASHED v0.3.0, conducted on 2026-05-25. The audit comprehensively reviews t
- **#95** — pre-freeze API audit (audit-b) for v0.3.0
  > Full public API audit of the SLASHED framework v0.3.0, performed before the API freeze.
- **#96** — pre-freeze API audit for v0.3.0
  > Full public API audit of SLASHED v0.3.0 before the token-API freeze. The audit reads every source file (core/*.css, active optional/*.css, all docs/*.
- **#99** — admin panel full API coverage + cheatsheet (v2)
  > This PR supersedes #98 with review feedback fixes applied.
- **#100** — address PR #98 review feedback (a11y, timer, tab separation)
  > Addresses all CodeRabbit review comments from PR #98.
- **#101** — add canonical token/class counter as single source of truth
  > Introduce scripts/audit.js + docs/registry.json to eliminate count
- **#102** — Depersonalize framework references in docs and comments
  > Remove specific framework name references (Pico, Bulma, Tailwind, ACSS) from documentation and source code comments, replacing them with more generic 
- **#104** — API freeze - new tokens, hardcode fixes, cleanup
  > Prepares the token layer for API freeze by:
- **#107** — PUBLIC/ADVANCED/INTERNAL contract + docs sync
  > Completes the PUBLIC/ADVANCED/INTERNAL token classification and syncs documentation with code for the v0.3.0 API freeze.
- **#110** — dual-mode link selection, built-in focus ring, broader lifting
  > Explicit mode: add [data-overlay-link] to the primary link and every
- **#111** — rebuild minified bundles to purge stale ACSS mention from sourcemaps
  > Rebuilds all 10 minified CSS bundles and their sourcemaps to remove a stale ACSS calls this... comment that survived PR #102's framework-name cleanup.
- **#112** — Remove all third-party CSS framework references
  > Strip mentions of ACSS, Bootstrap (CSS framework), and any advantage
- **#113** — Pre-freeze cleanup: drop deprecated, consolidate hover, canonical xs..2xl scale
  > Pre-freeze cleanup. Single PR, no version bump (no users yet). Five logical commits:
- **#115** — Standardize hover color variable naming convention
  > This PR standardizes the naming convention for hover state color variables across the design system by replacing double-dash separators (--) with sing
- **#117** — Add .sf-gap and .sf-equal layout utility classes
  > Adds layout-agnostic gap utilities and a fixed equal-column grid system to provide more flexible spacing and grid options for developers.
- **#118** — resolve pre-freeze audit items (9 remaining 🟠)
  > Addresses all remaining 🟠 items from the v0.3.0 API audit. After this PR, the only open items are 🟡 (cosmetic/historical, safe to defer).
- **#121** — pre-freeze audit fixes (rebased onto main)
  > Rebased PR #118 (audit-fixes-pre-freeze) onto current main (which now includes PRs #116, #117, #120). All merge conflicts resolved.
- **#126** — resolve pre-freeze API audit findings
  > Resolves all findings from the pre-freeze API audit (9 issues across documentation drift, naming inconsistencies, and tooling gaps).
- **#127** — auto-bundle WordPress plugin zip in dist folder
  > Adds automatic packaging of the "SLASHED for Bricks" WordPress plugin into a distributable zip (dist/slashed-bricks.zip) as part of the standard build
- **#128** — prevent node_modules from being staged on dist branch
  > git rm -rf . (in the orphan checkout step) deletes .gitignore from
- **#130** — implement element-aware suggestions, auto-numbering, migrate mode, unused-class endpoint
  > Stacked on #129 — branch is feat/rebemer-v1-implementations ⇐ fix/natural-sort-color-palette ⇐ main. Merge #129 first, then this.
- **#131** — Fix/natural sort color palette
  > * Added "Migrate ID Styles" mode to reBEMer panel with class migration preview and summary
- **#133** — remove redundant .visually-hidden alias from .sr-only rule
  > .sr-only is the canonical class name used throughout the codebase.
- **#135** — Generalize Auto-BEM references and remove ACSS acronym
  > Updated documentation to use more generic language when referring to Auto-BEM tools, removing specific references to ACSS (Automatic.css) and replacin
- **#136** — Add CodeSlash homepage design and layout
  > Added a complete, production-ready homepage for CodeSlash — a senior WordPress developer portfolio/service site. This is a standalone HTML file with e
- **#138** — Redesign default token palette and fix selection color
  > - Redesigned default color palette — all 6 brand source tokens updated for a more vibrant, internally cohesive out-of-the-box appearance; neutral bump
- **#141** — add comprehensive Playwright test suite (172 tests)
  > Six spec files covering every major framework area:
- **#146** — automatic version sync on release
  > Adds scripts/version-sync.js which reads the canonical version from
- **#147** — Add typography preview and improve color swatches in admin UI
  > This PR enhances the Bricks admin app with a live typography scale preview component and improves the color preview to show dark mode variants and sta
- **#148** — version display, generated CSS fix, spacing step controls, type scale generator
  > - Version pills in admin header: Framework version (SLASHED_BRICKS_CSS_REF) and plugin version (SLASHED_BRICKS_VERSION) now appear as small monospace 
- **#149** — Sync version constants during release and update bundle size
  > This PR improves the release workflow by automatically syncing version constants to match the release tag, and updates documentation to reflect curren
- **#150** — Fix OKLch color conversion matrices for accurate round-trip conversion
  > This PR corrects the color conversion matrices used in the OKLch to hex and hex to OKLch conversion functions to use the standard OKLab matrices, ensu
- **#151** — richer live preview — motion, focus ring, card, dark mode toggle, CSS export
  > - Replace static dark section with ☀/☾ Light/Dark toggle; all swatches,
- **#152** — dark swatches respect the dark-overrides-enabled toggle
  > - Bug: When the "Custom dark mode colors" toggle was OFF, the live preview still injected explicit --sf-color-*-dark custom properties — from previous
- **#153** — remove dead code, stale artifacts, and empty placeholder
  > - Delete legacy admin-page.js/.css (17KB) — PHP now enqueues admin-app/app.js/.css
- **#154** — comprehensive CSS quality review — 49 issues corrected
  > - print.css: remove var() from @page (not valid there); hardcode A4/2cm
- **#155** — 16 CSS correctness issues found in systematic audit
  > - layout.css: replace physical left with logical-safe approach for
- **#156** — add roadmap with pre-1.0 priorities and post-1.0 enhancements
  > Captures planned work (reBEMer v1, prose tokens, contrast table, class
- **#158** — mid-apply snapshot/rollback
  > - applyToSubtree() now snapshots each element's class IDs, structure-panel label, and (for migrate mode) the exact setting keys that will be deleted, 
- **#159** — WCAG contrast checker + reBEMer undo batching
  > - New WCAG tab in the admin settings page with two features:
- **#160** — add Jekyll _config.yml to stop Pages build failing on Liquid syntax
  > - Adds a minimal _config.yml at the repo root with render_with_liquid: false
- **#161** — require class-admin-page-svelte before reBEMer enqueue (frontend fatal)
  > - Adds require_once for class-admin-page-svelte.php inside slashed_bricks_rebemer_init() before instantiating Slashed_Bricks_ReBEMer_Enqueue
- **#162** — modifier ensures base class present; rename carries modifiers
  > Two reBEMer apply-mode bugs related to modifier classes.
- **#165** — serve CSS from dist-branch SHA + add Layouts admin tab
  > - CDN URL now uses immutable dist-branch SHA instead of the release tag, so the jsDelivr URL is stable and doesn't require CSS files to be tracked on 
- **#168** — add standalone Gutenberg integration plugin (v1)
  > Three files, zero Bricks dependencies — designed to be severable into an
- **#169** — move token infrastructure to global includes/
  > - Token overrides, REST API, and admin page are now global — moved from integrations/bricks/includes/ to includes/ and renamed from Slashed_Bricks_* t
- **#175** — move WP plugin into plugins/SLASHED-for-WP/
  > Separates the WordPress plugin from the SLASHED CSS framework at the repository level. The framework stays at root; all WordPress-specific code moves 

## v0.2.0

- **#30** — v0.2.0: bugfixes from quality audit + token enrichment + a11y/docs/tooling
  > Doprowadza framework do stanu opisanego w zatwierdzonym 7-fazowym planie: 3 bugfixy z audits/quality-audit-2024-full.md, 5 warningów rozstrzygniętych 
- **#32** — show auto-derived dark colors in the configurator
  > Follow-up to #29. The theme configurator's dark color pickers were seeded from a hardcoded TOKEN_DEFAULTS table, which:
- **#33** — Add comprehensive comparative audit against reference CSS frameworks
  > This PR adds a detailed comparative audit of SLASHED against four reference CSS frameworks (Pico CSS v2, Automatic.css v4, Bulma v1, and Tailwind CSS 
- **#34** — Phase 1: truthfulness foundation — themes layer extraction, bundle scope, browser floor accuracy
  > Phase 1 of the perfection roadmap from audits/comparative-audit-2026.md Resolution Log. Foundation pass — no behavioural changes, no breaking changes.
- **#35** — clear WCAG AA Normal by default for every brand & status on-color (Phase 2)
  > Phase 2 of the perfection roadmap. Tightens the default brand & status palette so every on-color foreground clears WCAG AA Normal (4.5:1) by default —
- **#36** — WCAG AA Normal by default for every brand & status on-color (Phase 2 redo)
  > Phase 2 (#35) was approved and clicked-merge, but its base.ref was chore/phase-1-truthfulness (the now-deleted Phase 1 branch) instead of main. After 
- **#37** — preserve authored colour by default; opt-in .print-color-exact / .print-no-color (Phase 3)
  > Phase 3 of the perfection roadmap. Reverses the print-stylesheet colour contract: authored colour is preserved by default, ink-on-paper is now an opt-
- **#38** — comparative audit vs Pico/ACSS/Bulma/Tailwind (2026-05-20)
  > Adds a single new file: audits/comparative-audit-2026-05-20.md (1501 linii, narracja po polsku, nagłówki sekcji po angielsku zgodnie ze specyfikacją a
- **#39** — name container queries — sf-layout and sf-alternate (Phase 4)
  > Phase 4 of the perfection roadmap. Names two of the framework's container-query containers and binds one framework-internal query to a name. The remai
- **#40** — Phase 5 — Motion API polish
  > Phase 5 of the framework perfection plan. Polishes the motion/transition API, modernizes accessibility patterns, and proves @property color interpolat
- **#41** — Phase 6 — regression tests & full demo coverage
  > Phase 6 — Coverage & regression tests. Completes the full audit remediation plan.

## v0.1.0

- **#42** — add v0.1.0 entries for last 7 merged PRs (Phases 1–6)
  > Covers PRs #34–41: truthfulness foundation, WCAG AA token fix, print colour
- **#43** — use oklab for palette color-mix to prevent hue drift
  > Two fixes addressing palette correctness and demo page performance:
- **#44** — comprehensive visual tests + missing layout demos
  > - Replace text-only layout references in docs/demo.html with proper visual demonstrations
- **#45** — tighten assertions flagged in PR #44 review
  > - Replace permissive regex on .is-loading color with an explicit
- **#46** — tighten visual test assertions and clarify customizer labels
  > - Tighten .is-loading color assertion — replace the loose /rgba?\(.*0\)|transparent/ regex (which could falsely pass on opaque rgb() values containing
- **#47** — completion checklist — ACSS & Pico benchmark
  > Comprehensive completion checklist for bringing the existing SLASHED layers to 100% — benchmarked against Automatic.css v4 (closest match, ~85% overla
- **#48** — API freeze prep — contrast docs, optional forms, npm exports
  > Zamyka ostatnie potencjalne źródła breaking changes przed rozpoczęciem pracy nad komponentami i utilities.
- **#49** — update TOKENS CONSUMED comment to match actual usage
  > Align the documented token list in optional/forms.css header comment with the actual CSS custom properties used after the token-name correction in PR 
- **#50** — Premium furniture store homepage (FORMA)
  > Premium furniture store homepage FORMA built entirely using the SLASHED CSS framework.
- **#51** — Production-readiness checklist v2
  > Complete production-readiness audit for SLASHED CSS framework v1.0, benchmarked against 7 industry references:
- **#52** — repair broken interactive demos in docs/demo.html
  > Addresses the issues you reported in /docs/demo.html. Each fix is surgical and targets the specific demo that misbehaved — no library API changes, jus
- **#53** — Add production readiness checklist v3 with implementation decisions
  > This PR introduces audits/completion-checklist-v3.md, a comprehensive production readiness audit that supersedes v2. Unlike v2 (which was an inventory
- **#54** — Add D11 — token alias-chain hygiene & API-surface freeze to checklist v3
  > Follow-up to the merged checklist v3 (#53). Adds a token API-freeze checkup based on a full var()-graph audit of all 562 token definitions.
- **#55** — foundation polish for v0.2.0 (checklist v3 §F batch)
  > Wire up declared-but-unused base/print tokens, fix two form bugs, ship
- **#56** — move container-type to parent for sf-grid-6 and ratio grids
  > @container queries look for an ancestor container, not the element
- **#57** — comprehensive optimal bundle index & inventory
  > Full indexing and inventory of the slashed.optimal.css bundle — every token, class, alias, keyframe, and cascade relationship mapped and analysed for 
- **#58** — refined comparative gap audit prompt v2
  > Adds a comprehensive, source-verified audit prompt (audits/comparative-audit-prompt.md) designed to produce a definitive gap analysis of SLASHED again
- **#59** — add flat (unlayered) bundle option for page builders
  > Adds a flat: true per-bundle option to bundle.config.json that strips the SLASHED @layer scaffolding before emit. First consumer is dist/slashed.brick
- **#62** — comprehensive comparative gap audit
  > Adds a full comparative gap audit of SLASHED v0.2.10 (commit 4d0103e) against four benchmark frameworks:
- **#63** — clean up repo structure and gitignore
  > Brings the repo in line with best practices for a published CSS framework:
- **#64** — restore jsDelivr CDN link so demo works without local build
  > - Reverts the demo's CSS ` tags from local relative paths back to the jsDelivr @main CDN URLs that were in use prior to commit 26658d5`.
- **#65** — re-commit dist/ to unbreak jsDelivr @main CDN URLs
  > Reverts the dist/ removal from #63 so the jsDelivr CDN URLs that #64 restored (and any external user pinning to @main) keep working.
- **#66** — build dist on merge to main, publish to dedicated `dist` branch
  > Replaces the per-commit dist regeneration (via the .githooks/pre-commit hook) with a once-per-merge GitHub Action that publishes built CSS bundles to 
- **#68** — fix 4 factual inaccuracies in comparative-gap-audit.md
  > The comparative gap audit (audits/comparative-gap-audit.md) contained 4 major factual errors where it claimed features were missing that actually exis
- **#70** — fix documentation vs CSS discrepancies
  > Fixes 11 documentation vs CSS discrepancies identified during a full audit of the codebase.
- **#72** — attach all dist bundles to releases + backfill CHANGELOG
  > Fixes two issues with the release workflow:
- **#73** — use clamp() for dark-mode link lightness (WebKit)
  > Fixes the CI regression test failure: [webkit] › a11y.spec.js › axe: no WCAG A/AA violations (dark).
- **#75** — trigger CI to verify regression tests after PR #73 webkit fix
  > This is a small dummy-style PR primarily intended to trigger CI one more time and verify whether the Regression tests job now passes after the WebKit 
- **#76** — use a:link selector to win over WebKit UA stylesheet (dark-mode link contrast)
  > Replaces the WebKit dark-mode link contrast fix from PR #73 (which didn't actually work) with one that does. Fixes the WCAG AA failure flagged by axe-
- **#77** — add admin GUI for editing SLASHED design tokens
  > Adds a full WordPress admin settings page to the Bricks Builder integration plugin for visually editing all user-customizable SLASHED design tokens.
- **#78** — connect orphaned tokens and close page-property control gaps
  > Four tokens were defined but never consumed by the framework, making

## v0.0.1 / Pre-release

- **#1** — scaffold CSS architecture
  > - Replaces the two empty placeholder files (css/slashed-core.css, css/slashed-tokens.css) with a fully structured cascade-layer CSS scaffold
- **#2** — add layout primitives and token files from new-essential framework
  > - core/layout.tokens.css — semantic tokens for layout primitives
- **#3** — Add uploaded files
  > * Full accessibility layer with robust focus visibility, preference-aware motion/contrast/transparency handling, larger touch targets, hardened screen
- **#4** — Add CSS bundling system with file concatenation and watch mode
  > This PR introduces a build system for concatenating CSS files into a single distributable bundle. It includes a Node.js-based bundler script with file
- **#5** — Add CSS bundler for slashed-essential.css
  > - Dodaje scripts/bundle.js — bundler konkatenujący pliki z core/ w prawidłowej kolejności cascade layers do dist/slashed-essential.css
- **#6** — Add light theme support and theme application layer
  > This PR adds comprehensive light theme support to the design system and introduces a new theme application layer that properly applies color-scheme an
- **#7** — light/dark mode with auto-derived color system
  > Completely reworks the color system to be fully derived from 22 base colors (6+6 brand, 5+5 status).
- **#10** — CSS audit improvements — tokens, base, print, docs
  > Comprehensive CSS audit fixes across core and optional files. Each change was validated with a plus/minus/devil's-advocate analysis.
- **#11** — implement states.css and move motion.css to core
  > Two changes that promote essential bundle completeness:
- **#12** — restore --sf-shadow-color and --sf-prose-paragraph to tokens.css
  > Token names in tokens.css are part of the public API — they must not be
- **#13** — correct raised surface level, on-inverse text, shadow glow, space-scale integration; clarify cq breakpoint tokens
  > - --sf-color-raised: l+0.02 → l+0.04 so hierarchy well < surface < bg < raised is correct
- **#14** — design token bugs + demo nav UX
  > - --sf-color-raised: poprawka formuły l + 0.02 → l + 0.04 — hierarchia powierzchni well < surface < bg < raised była zepsuta (bg i raised były identyc
- **#15** — Fix layout utilities and dark mode color tokens
  > This PR fixes missing layout utility classes, improves dark mode color token definitions, and corrects animation implementation in the demo page.
- **#16** — dynamic brand/status color customizer + distinct token defaults
  > - demo: add Theme Customizer section at top of main with 22 color pickers
- **#17** — demo: theme customizer + distinct defaults for primary/action and error/danger
  > - core/tokens.css — fix overlapping defaults so role names actually correspond to distinct colors:
- **#18** — Theme-aware palette via light-dark() as single source of truth
  > In dark mode, large parts of the demo were unreadable: white islands inside the dark page, near-white text on near-white surfaces. Root cause was in o
- **#19** — migrate dark mode to light-dark() hybrid architecture
  > Eliminates the 80-line duplicate dark mode block in base.css by moving
- **#20** — Refactor design tokens and simplify color/spacing aliases
  > This PR refactors the design token system to improve consistency, reduce complexity, and establish clearer semantic relationships between tokens. Chan
- **#21** — demo color pickers showing black for light mode
  > Fixes the theme customizer color pickers in docs/demo.html that were incorrectly showing #000000 (black) for all light-mode tokens.
- **#22** — color palette aliases design decisions
  > Adds a design decisions document for the upcoming semantic color alias layer in tokens.palette.css.
- **#23** — rename status color tokens to --sf-color-{status}-subtle/muted/strong
  > Replaces --sf-status-{status}-{bg|border|text} with the new
- **#25** — color system DX - dark fallback + theme-aware palette
  > Improves the color system developer experience and fixes issue #24.
- **#26** — improve color system DX with dark-mode fallback and theme-aware palette
  > - Add dark-mode fallback to all 11 resolved color tokens so dark mode
- **#27** — add comprehensive quality audit (2024)
  > Adds audits/quality-audit-2024-full.md -- a comprehensive quality audit of the entire SLASHED framework covering all core and optional files.
- **#28** — Add API coverage audit vs 5 reference frameworks
  > Adds audits/api-coverage-vs-reference-frameworks.md - a comprehensive comparison of SLASHED's current API surface against Tailwind CSS v4, Open Props 
- **#29** — fix token bugs, modernize tokens, expand palette, add regression suite
  > Correctness (verified against audits/):

---

*Last Updated: 2026-06-08*

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
  - Border-style scale: `--sf-border-style`, `--sf-border-style-soft`,
    `--sf-border-style-dotted` — pairs with
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

- **Global text scale now functional** — `--sf-text-scale` and
  `--sf-text-display-scale` (`core/tokens.css`) are now applied to the
  `--sf-text-*` / `--sf-text-display-*` clamps via `calc(... * scale)`,
  mirroring how `--sf-space-scale` works. Previously both tokens were
  declared and documented as the global type multipliers but never
  consumed, so setting them had no effect. The default value is `1`, so
  existing output is unchanged; only overrides now take effect.

- **Header / sticky offset is responsive by default** — `--sf-header-height`
  and `--sf-sticky-offset` (`core/tokens.css`) now fluidly `clamp()`
  between their `-mobile` and `-desktop` companion tokens across the
  framework viewport range, instead of statically equalling the desktop
  value. This wires up the previously-orphaned `--sf-header-height-mobile`,
  `--sf-sticky-offset-mobile`, and `--sf-sticky-offset-desktop` tokens.
  Default endpoints (3.5rem mobile, 5rem desktop) are unchanged; the header is now
  shorter on small viewports.

- **Shadows tint to the surface on `.sf-surface--*`** — `core/macros.css`
  now re-derives `--sf-shadow-color` from each colored surface's own
  background, so elevated children cast an in-family shadow instead of a
  neutral-grey slab. Completes the existing surface contextual-color cascade.

- **Legacy shadow fallbacks completed** — `core/tokens.color-fallbacks.css`
  now defines the full HSL shadow set (`--sf-shadow-none/xl/2xl/inner`,
  `--sf-text-shadow-*`, `--sf-drop-shadow-*`); previously only `xs`–`l`
  were bridged, so pre-`oklch()` engines resolved the rest to empty.

- **BREAKING — `--sf-transition-fast/slow/enter/exit` no longer use `all`.**
  All four now transition an explicit curated property set (`color`,
  `background-color`, `border-color`, `box-shadow`, `opacity`, `transform`,
  `filter`), differing only in duration/easing. Previously each was
  `all <duration> <easing>`, which directly contradicted the file's own
  warning that `all` is a performance footgun. `--sf-transition-all` remains
  the single intentional `all` escape hatch. Elements that relied on these
  presets to animate a property outside the curated set (e.g. `width`,
  `clip-path`) must now switch to `--sf-transition-all` or compose their own.

- **Tier-1 colour fallbacks completed for colored surfaces** —
  `core/tokens.color-fallbacks.css` now defines `--sf-color-inverse`,
  `--sf-color-overlay`, and the full `--sf-color-text--on-*` set (13 tokens).
  The modern auto-contrast formula needs `oklch()` relative color, so on
  pre-`oklch()` engines every ungated `.sf-surface--*` rule previously kept
  its background but inherited unreadable body text; the hardcoded
  black/white choices restore legibility. No new token names (these are all
  already declared by the modern tier).

### Removed

- **`--sf-border-style-strong`** (`core/tokens.css`) — removed. It was a
  no-op alias resolving to the same value as `--sf-border-style` (`solid`)
  and consumed by no rule. The "strong" axis in SLASHED is a color axis
  (`--sf-border-strong` / `--sf-color-border--strong`, per the IBM Carbon /
  GitHub Primer convention), not a style axis, so a "strong border style"
  carried no distinct meaning. Compose a heavier border manually with
  `--sf-border-width-*` + `--sf-color-border--strong`.

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

Release infrastructure.

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
  structural contract (`surface-light` is a light surface), and why CSS alone can't
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
