# Issue Backlog — Feature Completeness & Graceful Degradation

Tracking backlog to bring SLASHED to full feature completeness on the modern CSS baseline and to add graceful degradation for browsers from approximately 2020 onward. Each section below is a suggested GitHub issue (similar work grouped together). Priority labels: `P0` (parity-critical), `P1` (competitive), `P2` (polish).

## Definition of Done (applies to every issue)

- Core stays build-free, dependency-free, license-free, and framework-agnostic. Anything requiring a build ships as a separate, optional tool.
- No `PUBLIC` / `PUBLIC-ADVANCED` token is removed or renamed without a major version bump. New tokens are added additively. Default resolved values for the default palette are unchanged.
- Heavy surfaces live under `optional/`. The essential bundle stays within the documented gzip budget (enforced by the bundle-size test).
- All new CSS uses logical properties, the `--sf-*` namespace, and the correct `@layer`.

---

## 1. Graceful degradation: delivery path & feature gating
**Labels:** `P0` `degradation`

`@layer` is dropped entirely by Chrome <99 / Safari <15.4 / Firefox <97, so the whole framework fails to apply there. Ship a flat delivery path and gate progressive-enhancement features.

- [ ] Provide a pre-generated flat (unlayered) stylesheet so framework rules apply on engines without `@layer` support; keep the existing layered build unchanged for supporting engines.
- [ ] Flat sheet preserves the 15-layer effective order (tokens → reset → base → forms → layout → components → macros → utilities → states → themes → motion → accessibility → print → legacy → overrides) via source-order tie-breaking.
- [ ] Flat and layered paths style the same elements except for property features that are `@supports`-gated; flat path produced with no consumer build/transpile/install.
- [ ] Document that consumer rules override the flat path only by specificity/source order, that loading both sheets is unsupported, and which browser versions each option targets.
- [ ] Gate `:has()` behind `@supports selector(:has(*))`; provide a non-`:has()` fallback for `:has()`-dependent states (focus-parent, validation).
- [ ] Provide a plain custom-property fallback equal to each `@property` registered initial-value when `@property` is absent.
- [ ] `@starting-style` degrades to the final state (no entrance animation, no unset property); unsupported gated features never invalidate sibling or outside-block declarations.

## 2. Graceful degradation: color & dark-mode fallbacks
**Labels:** `P0` `degradation` `color`

- [ ] Emit a preceding `rgb()`/`hsl()` fallback for every `oklch()` color property, gamut-mapped to sRGB, alpha preserved.
- [ ] Emit precomputed sRGB fallbacks for `oklch(from …)` and `color-mix()` derivations (alpha preserved); no color property left unset when `oklch()` is unsupported.
- [ ] Every fallback derives from the same source color as its modern value, bounded by the correctness tolerance (see issue 4).
- [ ] Provide a documented regeneration mechanism so overriding a depended-on source token never leaves a stale fallback.
- [ ] Emit a `prefers-color-scheme` fallback for every `light-dark()` color (detect absence via `@supports (color: light-dark(white, black))`).
- [ ] Resolution precedence when `light-dark()` is absent: explicit section `[data-theme="light|dark"]` > system preference > framework default. When `light-dark()` is supported, suppress the media fallback so each token resolves by exactly one path.

## 3. Graceful degradation: layout fallbacks & grid predictability
**Labels:** `P0` `degradation` `layout`

At-risk primitives: `.sf-grid-1/2/3/4/6`, ratio grids `.sf-grid-1-2/2-1/1-3/3-1`, `.sf-bento`, `.sf-alternate`.

- [ ] Provide a flex/block fallback for container-query-dependent primitives, active only without container-query support and inert otherwise.
- [ ] Without container queries: fixed-column grids → flex-wrap row; ratio grids / `.sf-bento` / `.sf-alternate` → single full-inline-width column.
- [ ] Preserve DOM source order, prevent child overlap, and preserve `--sf-*` gap-token spacing in the fallback arrangement.
- [ ] Fix the footgun where `.sf-grid-N` / ratio grids silently collapse to a single column with no container ancestor: render the intended multi-column layout, document the container-context requirement and how to satisfy it, and preserve existing behavior where a container ancestor already exists.

## 4. Graceful degradation: correctness test harness
**Labels:** `P0` `degradation` `testing` `a11y`

- [ ] Property: every default-palette element with a foreground color resolves a defined, non-empty foreground and background on all targeted engines.
- [ ] Property: every token with modern + fallback values resolves the fallback to a valid CSS color (never empty / `unset` / invalid).
- [ ] Property: a single invalid fallback is isolated — no whole-rule drop, no sibling change.
- [ ] Property: WCAG 2.1 AA contrast (4.5:1 normal, 3:1 large/UI) for the default palette in both light and dark.
- [ ] Property: degraded vs modern color differs by `ΔE_OK ≤ 0.02`, or is recorded in a documented accepted-degradation register.
- [ ] Implement as property-based tests plus visual-regression coverage across the support floor.

## 5. Recipes: catalog, drift check & optional expansion plugin
**Labels:** `P0`/`P1` `recipes` `docs` `tooling`

Document existing macros (`.sf-prose`, `.sf-line-clamp`, `.sf-flow`, `.sf-truncate`, `.sf-equal-height`, `.sf-text-gradient`, `.sf-scroll-shadow`, `.sf-scrim`, `.sf-content-auto`) as copy-paste CSS for a single BEM rule.

- [ ] `P0` Publish a recipe catalog: each macro's raw CSS body, paste-ready, referencing consumed `--sf-*` tokens, noting equivalence to the markup class.
- [ ] `P0` Automated drift check: recipe declaration set equals the union of the macro's rules (after normalizing whitespace/comments/order); rules differing only by the leading class token match when declaration sets + combinators/pseudos match.
- [ ] `P0` Drift, orphaned (recipe → missing macro), or missing (public macro → no recipe) entries fail the check with identification, without mutating source.
- [ ] `P1` Optional, separately distributed build-time expansion plugin (PostCSS and/or Sass) that expands a recipe reference inside a BEM rule into the macro's declarations; output equivalent to the markup class; unknown macro name → descriptive build error.

## 6. Components: Card & Button
**Labels:** `P0` `components`

- [ ] Ship enabled `.sf-button` and `.sf-card` in the `slashed.components` layer, with their tokens enabled in `optional/tokens.components.css`.
- [ ] Consume only `--sf-*` tokens (color/spacing/radius/border/shadow); use logical properties for spacing/sizing/inset.
- [ ] Delivered under `optional/` (out of the essential bundle); their tokens covered by the SemVer freeze contract.

## 7. Components: Badge / Tag / Chip, Alert / Callout, Avatar
**Labels:** `P1` `components`

- [ ] Ship enabled Badge, Tag, Chip; Alert, Callout; Avatar and Avatar-group.
- [ ] Consume only `--sf-*` tokens (color/spacing/radius/border); logical properties for spacing/sizing/inset.
- [ ] Delivered under `optional/` (out of the essential bundle).

## 8. Components: advanced interactive set
**Labels:** `P2` `components`

- [ ] Opt-in definitions for modal/dialog, drawer, tooltip/popover, tabs, accordion, dropdown/menu, breadcrumb, pagination, table, toast, navbar.
- [ ] Modal/dialog uses the existing `--sf-transition-overlay` token and `@starting-style` entrance pattern.
- [ ] Consume only `--sf-*` tokens (color/spacing/radius/border/motion); logical properties for spacing/sizing/inset; delivered under `optional/`.
- [ ] Gate any beyond-floor feature behind an `@supports` query.

## 9. Utilities: curated core set
**Labels:** `P0` `utilities`

Make the "Hybrid" (BEM + utility) claim true with a small, always-on set.

- [ ] Visibility/display, text-alignment, flex/grid item-alignment, gap, and content-width (default/wide/full) utilities.
- [ ] Ship enabled in the `slashed.utilities` layer in core; logical properties + `--sf-*` tokens for all spacing/width.
- [ ] Essential-bundle gzip increase within the documented budget.

## 10. Utilities: optional atomic library & layout helpers
**Labels:** `P1` `utilities` `layout`

- [ ] Separate `optional/` file, outside the essential bundle, all classes in `slashed.utilities`, logical properties for directional utilities.
- [ ] Spacing (logical margin/padding per side across the scale); text (size/weight/transform/decoration/style/leading/tracking/wrap); color (text/bg/border across the semantic palette).
- [ ] Sizing (width % 10–90, max-width, height); border/radius/shadow; position/inset/z-index/overflow; opacity/aspect-ratio/object-fit; cursor/pointer-events/user-select.
- [ ] Width-percentage (10–90), flex `justify-content`, and masonry (1–5 columns) helpers that builders commonly expect.

## 11. Tooling: machine-readable token export
**Labels:** `P1` `tooling` `testing`

- [ ] Generate `tokens.json` enumerating `PUBLIC`/`PUBLIC-ADVANCED` tokens with default values; exclude `INTERNAL`; dev-time only (no runtime dependency); regenerable on add/remove/rename.
- [ ] Generate a VS Code custom-data artifact for `--sf-*` IntelliSense.
- [ ] Exactly one entry per token name (multi-file definitions resolved by documented file precedence); every entry references a real source token.
- [ ] Values normalized (trim + collapse whitespace) while keeping `clamp()`/`calc()`/`light-dark()`/`color-mix()`/`var()` verbatim and unresolved; parse → serialize reproduces identical names + values including alias chains up to three hops (round-trip property).

## 12. Tooling: fluid-endpoint configuration tokens
**Labels:** `P1` `tooling` `color`

- [ ] Expose `--sf-fluid-min-vw` and `--sf-fluid-max-vw`; compute all `clamp()` fluid scales from them.
- [ ] Overriding either re-anchors the affected clamps; when unset, the default minimum viewport stays `22.5rem` so existing output is unchanged.
- [ ] Added to the public token API and covered by the SemVer freeze contract.

## 13. Tooling: standalone config generator
**Labels:** `P2` `tooling`

A WordPress dashboard already exists (the SLASHED-for-WP plugin); this is for framework-agnostic, non-WordPress users only.

- [ ] Let a non-WordPress user set public source-token values and output an override stylesheet containing only changed tokens.
- [ ] Output is valid CSS in the `--sf-*` namespace, framework-agnostic, no WordPress dependency.
- [ ] Applied alongside core, overrides take effect; parsing generated output reproduces the configured names/values (round-trip property).

## 14. Docs: repositioning
**Labels:** `P2` `docs`

- [ ] Substantiate the "Hybrid" claim via the shipped core utility set, or remove the claim.
- [ ] Lead differentiation on the no-build, framework-agnostic nature of the core.
- [ ] Present intrinsic layout, state handling, accessibility, and print depth as primary differentiators.
- [ ] Frame modern-CSS support as a solved baseline rather than a differentiator.
