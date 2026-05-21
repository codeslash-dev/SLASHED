# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-05-21

### Added

- Comprehensive comparative audit (`audits/comparative-audit-2026.md`) against Pico CSS v2, Automatic.css v4, Bulma v1, and Tailwind CSS v4 — 22 findings with a prioritised remediation roadmap ([#33](https://github.com/codeslash-dev/SLASHED/pull/33))
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
