# SLASHED — Path to Maximum Engine-Design Score

> A per-criterion roadmap for raising SLASHED toward the ceiling of the 14-category engine-design scoring model (max **1215** points). Each item is tagged by feasibility. Read the verdict first: a perfect score is **not** attainable by engineering alone.

## Verdict

| Milestone | Points | % of 1215 |
|---|---|---|
| Current | 1059 | 87.2% |
| + everything achievable now within the philosophy | **1180** | **97.1%** |
| + guaranteed-contrast work once `contrast-color()` is baseline | **1192** | **98.1%** |
| Theoretical max | 1215 | 100% |

**A perfect 1215 is unreachable by instructions.** The final ~23 points are market- and time-bound (community maturity, commercial support, sustained organisational backing) — they cannot be engineered, and two of them sit in tension with the free/open half of the philosophy. The realistic ceiling is **~97–98%**.

Of the 156-point gap:
- **121 points** — achievable now, within philosophy (opt-in optional files + dev-time tooling; no core build, no runtime dependency).
- **12 points** — timing-capped: need `contrast-color()` (not yet baseline); reachable later via progressive enhancement.
- **23 points** — out of reach by instruction (ecosystem adoption/support/backing).

## Legend

- ✅ **Achievable** — buildable now without breaking the philosophy.
- ⏳ **Timing-capped** — blocked on a CSS feature reaching baseline; ship gated as progressive enhancement.
- ❌ **Out of reach** — depends on adoption, time, or a commercial organisation; cannot be produced by code.

## Non-negotiable guardrails (every item below must hold these)

- Core stays build-free, dependency-free, license-free, framework-agnostic.
- New heavy surfaces (utilities, components, templates) ship in **opt-in optional files** — the essential bundle stays within its gzip budget, so Performance stays maxed.
- No `PUBLIC`/`PUBLIC-ADVANCED` token removed or renamed; additions are additive (SemVer freeze).
- All new CSS uses logical properties, the `--sf-*` namespace, and the existing `@layer` order.
- Any tooling (token export, config generator, fallback generator) is **dev-time only**.

---

## Per-category roadmap

### 1. Color — 152 / 175 (gap 23)
- **Brand-slot flexibility** (+2) — add an accent/extra brand slot and document arbitrary-slot patterns. ✅
- **Gamut handling & fallbacks** (+9) — dev-time generator emits sRGB fallbacks for `oklch()`/`color-mix()`/relative-color values, gamut-mapped, alpha preserved. ✅
- **Customization ergonomics** (+8) — machine-readable `tokens.json` + a static, no-build config playground/CLI for non-WordPress users. ✅
- **Auto text-contrast** (+4) — adopt `contrast-color()` behind `@supports`; until baseline, improve the threshold algorithm and document the override register. ⏳

### 2. Typography — 88 / 105 (gap 17)
- **Type-scale configurability** (+3) — `--sf-fluid-min-vw` / `--sf-fluid-max-vw` endpoint tokens. ✅
- **Numeric/tabular features** (+2) — expand numeric-figure tokens (lining, oldstyle, slashed-zero). ✅
- **Text utilities** (+12) — opt-in utilities for size/weight/transform/decoration/style/leading/tracking/wrap. ✅

### 3. Spacing & sizing — 84 / 105 (gap 21)
- **Spacing utilities** (+12) — opt-in logical margin/padding utilities across the scale. ✅
- **Fluid-endpoint configurability** (+9) — same endpoint tokens as Typography, driving every `clamp()`. ✅

### 4. Layout & grid — 148 / 170 (gap 22)
- **Fixed-column grid footgun** (+4) — ship a self-contained grid variant that does not silently collapse without a container ancestor; document the requirement. ✅
- **Flex helpers** (+6) — opt-in flex/grid alignment helpers. ✅
- **Masonry** (+10) — columns-based masonry helpers now; revisit true grid masonry when the spec stabilises. ✅ (true grid-masonry portion ⏳)
- **CSS columns helper** (+2) — promote the existing column tokens into a ready helper/recipe. ✅

### 7. Theming & dark mode — 89 / 100 (gap 11)
- **Multi-brand support** (+3) — documented multi-brand scoping with per-scope source tokens. ✅
- **Forced light/dark contexts** (+2) — explicit forced-theme classes for sections and components. ✅
- **Theme-toggle wiring** (+6) — optional, dependency-free toggle snippet plus the documented `[data-theme]` pattern. ✅

### 8. Responsive design — 56 / 70 (gap 14)
- **Configurable breakpoints** (+4) — expose breakpoint tokens for opt-in helpers. ✅
- **Viewport-debug overlay** (+10) — a CSS-only, opt-in indicator showing the active container/viewport state. ✅

### 9. Accessibility — 112 / 120 (gap 8)
- **Guaranteed AA contrast on arbitrary colors** (+8) — `contrast-color()` behind `@supports`; documented manual-override register until baseline. ⏳

### 10. Motion & animation — 46 / 50 (gap 4)
- **Scroll-driven & view-transition presets** (+4) — additional documented presets and patterns. ✅

### 12. Architecture & cascade — 95 / 95 (perfect)
- Maintain. No work. ✅

### 14. Performance & footprint — 70 / 70 (perfect)
- Constraint, not work: keep every new surface opt-in; enforce the essential-bundle budget in CI. ✅

### 15. Ecosystem, platform & licensing — 49 / 80 (gap 31)
- **Template/section library** (+8) — a static HTML+CSS template library (effort-heavy but on-philosophy). ✅
- **Community maturity** (+9) — depends on adoption over time. ❌
- **Commercial support** (+8) — a business/org decision; partly conflicts with the free/open stance. ❌
- **Update cadence / backing** (+6) — depends on sustained maintenance and an organisation. ❌

### 17. Maintainability & governance — 37 / 40 (gap 3)
- **Test coverage / CI** (+3) — expand property-based and visual-regression coverage. ✅

### 18. Forms — 23 / 25 (gap 2)
- **Adaptive form theming** (+2) — forced light/dark form variants. ✅

### 19. Print — 10 / 10 (perfect)
- Maintain. No work. ✅

---

## Attainable vs capped

| Bucket | Points | Result |
|---|---|---|
| ✅ Achievable now within philosophy | 121 | 1059 → **1180** (97.1%) |
| ⏳ Timing-capped (`contrast-color()`) | 12 | → **1192** (98.1%) once baseline |
| ❌ Out of reach (ecosystem) | 23 | blocks 100% permanently |

## Suggested sequencing

1. **Endpoint tokens** (`--sf-fluid-min/max-vw`) — unblocks Typography + Spacing configurability in one change.
2. **Color fallback generator + `tokens.json`** — closes the largest Color sub-gaps and feeds the config playground.
3. **Opt-in utilities** (text, spacing, flex, width) — closes Typography/Spacing/Layout utility criteria without touching the essential bundle.
4. **Layout fixes** — grid footgun, columns helper, masonry.
5. **Theming + responsive + forms + motion polish** — toggle helper, breakpoint tokens, viewport overlay, forced-theme variants, presets.
6. **Governance** — expand PBT + visual-regression CI.
7. **Template library** — the only ✅ ecosystem item; everything else in Ecosystem is ❌.
8. **`contrast-color()`** — adopt under `@supports` when it reaches baseline to claim the ⏳ points.

The final ~23 points are intentionally left on the table: pursuing them means becoming a commercial, backed product, which would erode the free/agnostic/young qualities that earn SLASHED its lead in this model in the first place.
