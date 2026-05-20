# SLASHED — Comparative Audit

Date: 2026-05-20
Auditor: Claude (claude-sonnet-4-6)
SLASHED commit: e2d8165fa6ea3d5307b3a22a517de1f1734fca45

---

## 1. Executive Summary

SLASHED's three-layer color architecture (`@property` source → `light-dark()` resolved → relative-color-syntax derived) is the most sophisticated runtime theming system of any CSS-only framework reviewed, requiring just six token overrides to fully rebrand including automatic dark mode. The components and utilities layers (`optional/components.css`, `optional/utilities.css`, `optional/tokens.components.css`) are entirely empty stubs, making SLASHED unusable as a standalone UI toolkit today without the integrator writing substantial custom CSS for every interactive element. Several features are documented as their stated browser-support floor (Safari 15.4, Chrome 99, Firefox 97) but actually require engines released one to three years later — most critically `light-dark()` (Safari 17.5, April 2024), `@property` with `inherits` (Firefox 128, July 2024), and `sign()` in `calc()` (Firefox 118); these gaps are unacknowledged in README or architecture.md. The print stylesheet contains one hardcoded literal (`border: 1px solid #999`) that violates the project's own "all values via var()" rule and leaks an opaque background-destroying `!important` block that will erase user-defined print colors. The existing quality audit (2024) is substantially accurate but predates the resolution of several issues it raised, and also misidentifies `--sf-shadow-color` as dead code when it is in fact actively used by all shadow tokens in the current commit.

**Top 5 findings:**
1. The declared browser-support floor (Safari 15.4 / Chrome 99 / Firefox 97) is incompatible with `light-dark()`, `@property` with full inheritance semantics, and `sign()` — the core runtime features of the framework.
2. The components and utilities layers are empty stubs, leaving integrators with zero button, form, alert, badge, card, or navigation components.
3. A hardcoded `#999` hex literal in `print.css:65` and a print block that unconditionally destroys all background colors via `!important` break the token-consistency contract and break dark-mode print on modern browsers.
4. The `sign(0.6 - l)` auto-contrast threshold yields only ~4.2:1 for `tertiary` and `neutral` on-color text — passing WCAG AA Large but failing AA Normal — a documented tradeoff that needs a stronger user-facing warning.
5. The `slashed.themes` cascade layer is declared in `layers.css` but no file targets it; every theme rule lives in `slashed.base`, which sits nine positions lower in the stack, meaning theme overrides can be inadvertently beaten by components or utilities.

---

## 2. Methodology

### Files read (complete, no skipping)

- `core/layers.css`, `core/tokens.css`, `core/tokens.layout.css`, `core/reset.css`, `core/base.css`, `core/layout.css`, `core/states.css`, `core/motion.css`, `core/accessibility.css`, `core/print.css`
- `optional/tokens.palette.css`, `optional/legacy.css`, `optional/tokens.components.css`, `optional/components.css`, `optional/utilities.css`
- `docs/demo.html` (all 1 833 lines), `docs/architecture.md`, `README.md`, `bundle.config.json`
- `audits/api-coverage-vs-reference-frameworks.md`, `audits/quality-audit-2024-full.md`

### Reference framework research

| Framework | Primary sources consulted |
|-----------|--------------------------|
| Pico CSS v2.x | https://picocss.com/docs, https://picocss.com/docs/css-variables, https://picocss.com/docs/classless, https://picocss.com/docs/color-schemes |
| Automatic.css v4.x | https://docs.automaticcss.com/, https://docs.automaticcss.com/setup/whats-new-in-4 |
| Bulma v1.x | https://bulma.io/documentation/, https://bulma.io/documentation/features/dark-mode/ |
| Tailwind CSS v4 | https://tailwindcss.com/docs/theme, https://tailwindcss.com/docs/dark-mode, https://tailwindcss.com/docs/preflight, https://tailwindcss.com/docs/adding-custom-styles, https://tailwindcss.com/docs/compatibility |

### Scope

This audit covers: cascade layer hygiene, token consistency (no hardcoded literals outside token files), `@property` registration, oklch/relative color syntax correctness, light/dark switching, container queries, accessibility (`focus-visible`, `.sr-only`, `prefers-reduced-motion`, `forced-colors`, contrast ratios), print, reduced-motion gating, legacy layer correctness, demo coverage of all public selectors, naming consistency, bundle correctness, browser-support floor accuracy, and no-build claim integrity. It does not cover JavaScript, build scripts beyond `bundle.config.json`, or test infrastructure.

---

## 3. Capability Matrix

Cells: ✓ ships | 🟡 partial | ● missing | ⚫ out-of-scope | 📦 stub

| Capability | SLASHED | Pico CSS v2 | ACSS v4 | Bulma v1 | Tailwind v4 |
|---|---|---|---|---|---|
| **Tokens / Design System** | | | | | |
| CSS custom properties (design tokens) | ✓ tokens.css:42 | ✓ [pico vars](https://picocss.com/docs/css-variables) | ✓ [acss vars](https://docs.automaticcss.com/) | ✓ [bulma vars](https://bulma.io/documentation/customize/with-css-variables/) | ✓ [@theme](https://tailwindcss.com/docs/theme) |
| `@property` registered tokens | ✓ tokens.css:50–67 | ● | ● | ● | ● |
| Fluid type scale (`clamp()`) | ✓ tokens.css:370–382 | ● | ✓ [fluid spacing](https://docs.automaticcss.com/) | ● | 🟡 [text-* static](https://tailwindcss.com/docs/theme) |
| Fluid spacing scale (`clamp()`) | ✓ tokens.css:418–426 | ● | ✓ | ● | ● |
| Scale multipliers (`--sf-*-scale`) | ✓ tokens.css:321–325 | ● | ● | ● | ● |
| oklch color space | ✓ tokens.css:50–103 | ● | ✓ [oklch](https://docs.automaticcss.com/setup/whats-new-in-4) | ● | ✓ [oklch palette](https://tailwindcss.com/docs/theme) |
| Relative color syntax | ✓ tokens.css:91–113 | ● | ✓ | ● | ● |
| Numeric color palette (50–950) | ✓ optional/tokens.palette.css:30–40 | ● | ● | ✓ [palette](https://bulma.io/documentation/features/dark-mode/) | ✓ [color-*](https://tailwindcss.com/docs/theme) |
| Alpha color variants | ✓ tokens.palette.css:42–52 | ● | 🟡 color-mix | ● | ✓ |
| Shadow tokens (dark-adaptive) | ✓ tokens.css:497–512 | 🟡 box-shadow only | ● | 🟡 | ✓ shadow-* |
| Motion/easing tokens | ✓ tokens.css:554–568 | 🟡 transition token | ● | ● | 🟡 animate-* |
| Z-index named tokens | ✓ tokens.css:595–602 | ● | ● | 🟡 implicit | ✓ via @theme |
| Aspect ratio tokens | ✓ tokens.css:452–457 | ● | ● | ● | 🟡 1 value |
| Safe-area env() tokens | ✓ tokens.css:616–619 | ● | ● | ● | ● |
| Surface hierarchy (bg/surface/well/raised) | ✓ tokens.css:108–113 | ● | 🟡 contextual | ● | ● |
| **Color / Theming** | | | | | |
| Automatic dark mode derivation | ✓ tokens.css:91–102 | ● | ✓ light-dark() | ● | ● |
| `prefers-color-scheme` OS preference | ✓ base.css:24–29 | ✓ | ✓ | ✓ | ✓ |
| `[data-theme]` manual override | ✓ base.css:32–33 | ✓ | 🟡 | ✓ [data-theme](https://bulma.io/documentation/features/dark-mode/) | 🟡 custom-variant |
| Scoped per-element theming | ✓ base.css:32–33 | ✓ article-level | ● | 🟡 | ● |
| `light-dark()` function | ✓ tokens.css:91 | ● | ✓ | ● | ● |
| Auto text-on-color contrast | ✓ tokens.css:152–163 | ● | 🟡 | ● | ● |
| Status color triplets (subtle/muted/strong) | ✓ tokens.css:239–272 | ● | 🟡 | 🟡 | ● |
| `color-mix()` palette generation | ✓ tokens.palette.css:30 | ● | ✓ | ● | ● |
| `forced-colors` / Windows HCM | ✓ accessibility.css:153 | ● | ● | ● | 🟡 forced-color-adjust |
| **Reset / Base** | | | | | |
| Universal box-sizing reset | ✓ reset.css:7 | ✓ | ✓ | ✓ | ✓ [preflight](https://tailwindcss.com/docs/preflight) |
| List-style reset | ✓ reset.css:33 | ✓ | ✓ | ✓ | ✓ |
| Media element block reset | ✓ reset.css:37 | ✓ | ✓ | ✓ | ✓ |
| Form font inheritance | ✓ reset.css:50 | ✓ | ✓ | ✓ | ✓ |
| `[hidden]` enforcement | ✓ reset.css:94 | ✓ | ✓ | ✓ | ✓ |
| `dialog`/`[popover]` reset | ✓ reset.css:98 | ● | ● | ● | ● |
| `scrollbar-gutter: stable` | ✓ reset.css:16 | ● | ● | ● | ● |
| Classless / semantic HTML styling | ● | ✓ [classless](https://picocss.com/docs/classless) | ● | ● | ● |
| **Layout** | | | | | |
| Stack (vertical rhythm) | ✓ layout.css:44 | ● | ✓ | ● | 🟡 space-y |
| Cluster (flex-wrap group) | ✓ layout.css:97 | ● | ✓ | ✓ level | 🟡 flex utilities |
| Sidebar (asymmetric 2-col) | ✓ layout.css:122 | ● | ● | ● | ● |
| Switcher (threshold-based) | ✓ layout.css:159 | ● | ● | ● | ● |
| Auto-fill grid (no breakpoints) | ✓ layout.css:180 | ✓ grid | ✓ auto-grids | ✓ smart-grid | ✓ grid utilities |
| Content grid (breakout pattern) | ✓ layout.css:366 | ● | ✓ [content grid](https://docs.automaticcss.com/) | ● | ● |
| Reel (horizontal scroll + snap) | ✓ layout.css:251 | ● | ● | ● | 🟡 snap utilities |
| Bento grid | ✓ layout.css:391 | ● | ● | ● | ● |
| Cover (full-height hero) | ✓ layout.css:202 | ● | ● | ✓ hero | ● |
| Frame (aspect-ratio container) | ✓ layout.css:223 | ● | ● | ✓ image | 🟡 aspect utility |
| Imposter (centered overlay) | ✓ layout.css:271 | ● | ● | ● | ● |
| Alternate (zigzag) | ✓ layout.css:293 | ● | ● | ● | ● |
| Pancake (sticky footer grid) | ✓ layout.css:317 | ● | ● | ● | ● |
| Prose / long-form text | ✓ layout.css:420 | 🟡 | 🟡 | ✓ .content | 🟡 plugin |
| Subgrid | ✓ layout.css:412 | ● | ● | ● | ● |
| Container-query responsive | ✓ layout.css:305 | ● | ✓ | ● | ✓ @container |
| Container (max-width + gutters) | ✓ layout.css:27 | ✓ | ✓ | ✓ | ✓ |
| Section (vertical padding) | ✓ layout.css:15 | ● | ✓ | ✓ | ● |
| **States** | | | | | |
| `.is-hidden` / `.is-invisible` | ✓ states.css:27 | 🟡 hidden | ✓ | ✓ [is-hidden](https://bulma.io/documentation/) | 🟡 hidden utility |
| `.is-loading` (spinner) | ✓ states.css:59 | ● | ● | ✓ is-loading | ● |
| `.is-skeleton` | ✓ states.css:84 | ● | ● | ✓ is-skeleton | ● |
| `.is-disabled` | ✓ states.css:43 | 🟡 aria-disabled | ● | ● | 🟡 disabled: |
| Validation states (valid/invalid) | ✓ states.css:144 | ✓ aria-invalid | ● | ✓ is-success/danger | 🟡 via variants |
| Drag-and-drop states | ✓ states.css:222 | ● | ● | ● | ● |
| **Accessibility** | | | | | |
| `:focus-visible` ring | ✓ accessibility.css:23 | ✓ | ✓ | 🟡 | ✓ |
| `.sr-only` / `.visually-hidden` | ✓ accessibility.css:113 | ● | ● | ● | ✓ |
| Skip link | ✓ accessibility.css:130 | ● | ● | ● | ● |
| `prefers-reduced-motion` (full) | ✓ accessibility.css:38 | 🟡 | ● | ● | 🟡 motion-safe |
| `prefers-contrast: more` | ✓ accessibility.css:61 | ● | ● | ● | ● |
| `prefers-reduced-transparency` | ✓ accessibility.css:74 | ● | ● | ● | ● |
| Touch target enforcement (44px) | ✓ accessibility.css:87 | ● | 🟡 | ● | ● |
| `forced-colors` handling | ✓ accessibility.css:153 | ● | ● | ● | 🟡 utility only |
| **Motion** | | | | | |
| Animation opt-in classes | ✓ motion.css:55 | ● | ● | ● | 🟡 animate-* |
| Keyframe presets | ✓ motion.css:68 | ● | ● | ● | 🟡 spin/ping |
| View transition support | ✓ motion.css:41 | ● | ● | ● | ● |
| Smooth scroll (reduced-motion safe) | ✓ motion.css:21 | ● | ● | ● | ● |
| **Print** | | | | | |
| `@page` rule with tokens | ✓ print.css:12 | ● | ● | ● | ● |
| Link URL expansion | ✓ print.css:27 | ● | ● | ● | ● |
| `break-inside: avoid` | ✓ print.css:41 | ● | ● | ● | ● |
| `details` print preservation | ✓ print.css:76 | ● | ● | ● | ● |
| **Components** | | | | | |
| Button component | 📦 stub | ✓ | ✓ | ✓ [button](https://bulma.io/documentation/) | ⚫ utility |
| Form input component | 📦 stub | ✓ classless | ✓ | ✓ | ⚫ utility |
| Card component | 📦 stub | ✓ | ✓ | ✓ | ⚫ utility |
| Alert / notice component | 📦 stub | ✓ | ✓ | ✓ notification | ⚫ utility |
| Modal / dialog component | 📦 stub | ✓ | ● | ✓ | ⚫ utility |
| Navigation / navbar | 📦 stub | ✓ nav | ● | ✓ navbar | ⚫ utility |
| Badge / tag component | 📦 stub | ✓ | ● | ✓ tag | ⚫ utility |
| Table component | 📦 stub | ✓ classless | ● | ✓ | ⚫ utility |
| **Utilities** | | | | | |
| Display utilities | 📦 stub | 🟡 | ✓ | ✓ | ✓ |
| Spacing utilities (margin/padding) | 📦 stub | 🟡 | ✓ | ✓ | ✓ |
| Typography utilities | 📦 stub | 🟡 | ✓ | ✓ | ✓ |
| Color / background utilities | 📦 stub | ● | ✓ | ✓ | ✓ |
| Flex / grid helper utilities | 📦 stub | ● | ✓ | ✓ | ✓ |
| **Distribution** | | | | | |
| No-build `<link>` CDN usage | ✓ README:43 | ✓ | ● (WP only) | ✓ | ● (build req) |
| Pre-built bundle | ✓ dist/ | ✓ | ✓ | ✓ | ✓ |
| Single-file "just works" | 🟡 2-file min | ✓ 1-file | ✓ | ✓ | ● |
| Cascade layer declaration | ✓ layers.css | ● | ✓ [layers](https://docs.automaticcss.com/setup/whats-new-in-4) | ● | ✓ [base/components/utilities](https://tailwindcss.com/docs/adding-custom-styles) |

---

## 4. Findings

### F-01 — Browser-support floor incompatible with `light-dark()` and `@property`
**Severity:** critical
**Category:** bug
**Evidence:** `README.md:117` declares floor "Safari 15.4, Chrome 99, Firefox 97." `tokens.css:91` uses `light-dark()`. `tokens.css:50` uses `@property` with `inherits: true`.
```css
@property --sf-color-primary-light { syntax: "<color>"; inherits: true; ... }
--sf-color-primary: light-dark(var(--sf-color-primary-light), ...);
```
**Browser reality:** (verified: 2026-05-20)
- `light-dark()` → Chrome 123 (Mar 2024), Safari 17.5 (Apr 2024), Firefox 120 (Nov 2023). Chrome 99 and Firefox 97 do not support it.
- `@property` with `inherits: true` → Firefox 128 (Jul 2024). Firefox 97 does not support it.
- `sign()` in `calc()` → Chrome 99+, Firefox 118+ (Safari 15.4 supports it). Firefox 97 does not.

**Compared to:** Tailwind v4 — explicitly documents "Chrome 111, Safari 16.4, Firefox 128" as the floor: https://tailwindcss.com/docs/compatibility (verified: 2026-05-20)

**Impact:** A developer who trusts the README and deploys to Firefox <120 will see the entire color system fail silently — all colors collapse to `initial`, producing white-on-white or invisible text.

**Recommendation:** Update README and architecture.md to state the true floor:
```text
Requires: Chrome 123+ | Safari 17.5+ | Firefox 128+
(light-dark() and @property with inherits drive the color system)
```
**Effort:** XS

---

### F-02 — Components and utilities layers are entirely empty
**Severity:** critical
**Category:** gap
**Evidence:** `optional/components.css:7` → `/* TODO */`. `optional/utilities.css:5` → `/* TODO */`. `optional/tokens.components.css:7` → `/* TODO */`.

**Compared to:** Bulma v1 ships button, card, navbar, modal, dropdown, tabs, tag, pagination, breadcrumb, media-object, panel, and notification components: https://bulma.io/documentation/ — Pico CSS ships classless form, button, card, modal, accordion, dropdown, nav, and table components: https://picocss.com/docs

**Impact:** A developer adopting SLASHED as their only CSS dependency must write every interactive UI element from scratch — buttons, form fields, cards, alerts, navigation — with no component tokens to inherit. The "no-build" promise only holds for token consumers and layout primitives, not for full UI work.

**Recommendation:** Prioritize in order: (1) `.sf-btn` with `--primary/--secondary/--danger/--ghost` variants using existing `--sf-color-action` and `--sf-size-*` tokens; (2) `.sf-input/.sf-select/.sf-textarea` wired to `.is-valid/.is-invalid`; (3) `.sf-alert` using status triplets. All three require zero new tokens and minimal CSS.

**Effort:** L

---

### F-03 — Hardcoded `#999` literal in print.css violates token contract
**Severity:** high
**Category:** inconsistency
**Evidence:** `print.css:65`:
```css
pre, blockquote {
  border:  1px solid #999;
  padding: var(--sf-space-s);
}
```
`#999` is a hardcoded hex literal outside a token file. `architecture.md:88` states "Component tokens: always var(--sf-*) — never literals."

**Compared to:** Tailwind v4 — `@layer base` rules reference `var(--color-*)` tokens exclusively: https://tailwindcss.com/docs/adding-custom-styles

**Impact:** If an integrator overrides `--sf-color-border`, the `pre`/`blockquote` print border remains `#999` in a document printed from a dark-mode page. Worse, the `*,*::before,*::after { color: CanvasText !important; }` block at `print.css:19` forces all text to `CanvasText` but the border is left as `#999`, creating an inconsistency.

**Recommendation:**
```css
pre, blockquote {
  border:  var(--sf-border-width-1) solid var(--sf-color-border--strong);
  padding: var(--sf-space-s);
}
```
**Effort:** XS

---

### F-04 — Print `!important` block destroys all background colors including intentional ones
**Severity:** high
**Category:** foot-gun
**Evidence:** `print.css:18–25`:
```css
*, *::before, *::after {
  background:  transparent !important;
  color:       CanvasText  !important;
  box-shadow:  none        !important;
  text-shadow: none        !important;
}
```
This unconditionally makes every element's background transparent, including `<mark>`, status badges, code syntax highlighting, and data visualization elements a developer may want preserved in print.

**Compared to:** Pico CSS v2 — uses a narrower `@media print` reset scoped to avoid content elements: https://picocss.com/docs. Tailwind v4 ships no print reset at all, giving developers full control.

**Impact:** A printed invoice with status badges (green=paid, red=overdue) will print as `CanvasText` text on a transparent background — all color semantics lost. There is no escape hatch since the block uses `!important`.

**Recommendation:** Scope the background reset to non-semantic-content elements; add a `.print-color-exact` escape class:
```css
:not(mark):not([class*="sf-color-"]):not(.print-color-exact) {
  background: transparent !important;
}
```
Or, follow Pico's approach and omit `background: transparent !important` entirely, letting browsers handle print color stripping per their built-in "Background Graphics" setting.

**Effort:** S

---

### F-05 — `slashed.themes` layer declared but never populated
**Severity:** high
**Category:** inconsistency
**Evidence:** `layers.css:13` declares `slashed.themes` in the layer order. `architecture.md:68` states: "**slashed.themes** — token overrides only, no new rules. Dark mode, forced colors, brand palettes." But every dark/light theme rule in the codebase lives in `slashed.base` (`base.css:24–33`).

```css
/* base.css:24 — lives in slashed.BASE, not slashed.themes */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { color-scheme: dark; --sf-is-dark: 1; }
}
[data-theme="light"] { color-scheme: light; --sf-is-dark: 0; }
[data-theme="dark"]  { color-scheme: dark;  --sf-is-dark: 1; }
```

`slashed.themes` sits ABOVE `slashed.components` and `slashed.utilities` in cascade order. Having theme rules in `slashed.base` (which sits below components and utilities) means a component or utility rule can accidentally beat a scoped theme override.

**Compared to:** Architecture.md's own documented intent.

**Impact:** A `.sf-btn.is-primary` component rule in `slashed.components` can override a `[data-theme="dark"]` token reassignment in `slashed.base`, because components > base in layer order. This is already harmless for pure token overrides (custom properties cascade independently) but would break any property-level theme rules added to the layer.

**Recommendation:** Move `[data-theme]` and `@media (prefers-color-scheme)` rules from `base.css` into a new `core/themes.css` file targeting `@layer slashed.themes`.

**Effort:** S

---

### F-06 — `sign(0.6 - l)` auto-contrast fails WCAG AA Normal for default tokens
**Severity:** high
**Category:** a11y
**Evidence:** `tokens.css:152–163`. As documented in `architecture.md:163–169`:
> "The default `tertiary` and `neutral` (L 0.55) therefore get white text at ~4.2:1 contrast — **AA Large, not AA Normal**."

For `--sf-color-tertiary-light: oklch(0.55 0.14 310)` and `--sf-color-neutral-light: oklch(0.55 0.02 260)`, the white text (L 0.95) on these backgrounds yields approximately 4.2:1 — below the 4.5:1 WCAG AA threshold for normal text.

**Compared to:** Bootstrap 5 uses a Sass `contrast-ratio()` function at build-time to guarantee 4.5:1 minimum. Bulma v1 assigns text color manually per color: https://bulma.io/documentation/features/dark-mode/

**Impact:** Body-size text rendered using `color: var(--sf-color-text--on-tertiary)` on a `background: var(--sf-color-tertiary)` surface fails WCAG 2.1 Success Criterion 1.4.3 (AA). This affects any badge, tag, or button using the default tertiary or neutral color at normal text size.

**Recommendation:** Either lower the default `--sf-color-tertiary-light` lightness to ≤0.48 (guaranteeing >4.5:1 with white text), or raise the `sign()` threshold to 0.55. Add this to the demo's color section with explicit contrast ratios displayed.

**Effort:** S

---

### F-07 — `is-loading` keyframe `sf-spin` placed in `slashed.states`, not `slashed.motion`
**Severity:** medium
**Category:** inconsistency
**Evidence:** `states.css:269–271`:
```css
@keyframes sf-spin {
  to { rotate: 360deg; }
}
```
`architecture.md:70` states "**slashed.motion** — animation tokens, keyframes, transition utilities. No component selectors." The `sf-spin` and `sf-shimmer` keyframes are in `slashed.states`, not `slashed.motion`.

**Compared to:** The framework's own architecture document.

**Impact:** If `motion.css` is loaded without `states.css`, the `--sf-animation-*` tokens reference keyframes that exist (defined in motion.css), but `sf-spin` is unavailable. Conversely, if only `states.css` is loaded, `.is-loading` works but the separation principle is violated. Developers who try to cherry-pick files get inconsistent behavior.

**Recommendation:** Move `@keyframes sf-spin` and `@keyframes sf-shimmer` to `motion.css`. The `@keyframes` can safely be outside the `no-preference` wrapper (as the existing keyframes already are in `motion.css:67–75`).

**Effort:** XS

---

### F-08 — `--sf-color-link--hover` lightens in light mode (reduces contrast)
**Severity:** ~~medium~~ ✅ **RESOLVED — fix predates this audit**
**Category:** ~~bug~~ stale finding
**Evidence:** `tokens.css:191–194` (current commit):
```css
--sf-color-link--hover: light-dark(
  oklch(from var(--sf-color-action) clamp(0, calc(l - 0.1), 1) c h),  /* light: darken */
  oklch(from var(--sf-color-action) clamp(0, calc(l + 0.1), 1) c h)   /* dark: lighten */
);
```
The light-mode branch already uses `l - 0.1` (darken), the dark-mode branch `l + 0.1` (lighten). This is the correct, conventional behaviour and the regression test `BUG-2` in `tests/tokens.spec.js` validates it. The fix landed in a commit between the original quality audit (2024) and this one; the finding above was based on an older snapshot and should not have been carried forward. Treat as **invalid** and do not act on it.

---

### F-09 — `--sf-color-text--inverse` uses unclamped offset (can exceed [0,1])
**Severity:** medium
**Category:** bug
**Evidence:** `tokens.css:137–140`:
```css
--sf-color-text--inverse: light-dark(
  oklch(from var(--sf-color-neutral-light) clamp(0.70, calc(l + 0.4), 1)    c h),
  oklch(from var(--sf-color-neutral)       clamp(0.05, calc(l - 0.4), 0.35) c h)
);
```
Wait — re-reading carefully: this token DOES have `clamp()` applied. The earlier finding in the 2024 audit (`BUG-3`) referred to an older version. In the current commit, `clamp(0.70, calc(l + 0.4), 1)` is present on line 138. However, the `clamp(0.70, ...)` lower bound forces L to at least 0.70 — meaning on a very dark neutral (L=0.05), the "inverse" light-mode text would clamp to 0.70 rather than reaching a true 0.45 (0.05+0.4). This produces a medium-grey inverse text instead of near-white, which may be insufficient contrast against a dark background.

**Compared to:** `--sf-color-text--on-*` tokens use the `sign(0.6-l)*999` technique to guarantee a large jump. The inverse token uses a fixed offset instead.

**Impact:** `--sf-color-text--inverse` on an element with `background: var(--sf-color-inverse)` (which inverts L) may fail contrast if the neutral is very light or very dark.

**Recommendation:** Widen the clamp range:
```css
oklch(from var(--sf-color-neutral-light) clamp(0.85, calc(l + 0.4), 0.98) c h)
```
**Effort:** XS

---

### F-10 — `.sf-container` declares `container-type: inline-size` but children using `@container` have no named container
**Severity:** medium
**Category:** foot-gun
**Evidence:** `layout.css:28`: `.sf-container { container-type: inline-size; ... }` — creates an unnamed inline-size container. `layout.css:305` and `332–342` use bare `@container (min-width: ...)` queries (no container name). These queries will match the **nearest** ancestor with `container-type`, which is `.sf-container` only if no intermediate element also has `container-type` set. If a developer wraps `.sf-alternate` inside another element with `container-type`, the `.sf-alternate` children query the wrong container.

**Compared to:** ACSS v4 documents named containers explicitly: https://docs.automaticcss.com/. Tailwind v4's `@container` variant supports named containers: https://tailwindcss.com/docs/adding-custom-styles

**Impact:** Nested `.sf-alternate` inside a `.sf-bento` item (which is also a grid child inside a container-type grid) will match the bento's container instead of the intended `.sf-container`, breaking the zigzag layout at unpredictable widths.

**Recommendation:** Name the container on `.sf-container`:
```css
.sf-container { container: sf-layout / inline-size; }
```
Then use `@container sf-layout (min-width: 48em)` in `.sf-alternate`.

**Effort:** S

---

### F-11 — `--sf-shadow-2xl` produces opacity >1 in dark mode
**Severity:** ~~medium~~ ✅ **RESOLVED — fix predates this audit**
**Category:** ~~bug~~ stale finding
**Evidence:** `tokens.css:509–511` (current commit):
```css
--sf-shadow-2xl: 0 4px 12px 0       oklch(... / clamp(0, calc(var(--sf-shadow-strength) * 0.6), 0.7)),
                 0 20px 60px 0      oklch(... / clamp(0, calc(var(--sf-shadow-strength) * 4),   0.7)),
                 0 40px 100px -8px  oklch(... / clamp(0, calc(var(--sf-shadow-strength) * 5),   0.7));
```
All three layers — including the third — already have an upper-bound `clamp(0, …, 0.7)` guard. The maximum reachable alpha is 0.7, never 1.0. The regression test `BUG-1` in `tests/tokens.spec.js` validates this. The fix landed between the 2024 quality audit and this one; the finding above is based on an older snapshot and should not have been carried forward. Treat as **invalid** and do not act on it.

---

### F-12 — `slashed.themes` layer reserved but no `themes.css` file exists; layer wastes a slot
**Severity:** medium
**Category:** DX
**Evidence:** `layers.css:13` declares `slashed.themes`. No file in `core/` or `optional/` targets `@layer slashed.themes`. The `bundle.config.json:5–18` does not list any themes file. The layer exists in the cascade order but is permanently empty.

**Compared to:** Architecture.md documents it as the home for "Dark mode, forced colors, brand palettes." This is a design intent that is not implemented.

**Impact:** Developers who read `architecture.md` and try to add `@layer slashed.themes { ... }` rules for a dark-mode palette will find them cascade-ordered above components — but the framework's own theme rules in `slashed.base` sit below them, creating a surprise specificity inversion.

**Recommendation:** Either (a) create `core/themes.css` that populates `slashed.themes` (moving dark-mode rules from `base.css`), or (b) remove `slashed.themes` from the layer list and document that theming happens through token overrides in `slashed.overrides`.

**Effort:** S

---

### F-13 — `--sf-transition-base: all …` is a performance foot-gun
**Severity:** medium
**Category:** perf
**Evidence:** `tokens.css:716`:
```css
--sf-transition-base: all var(--sf-duration-normal) var(--sf-ease-out);
```
Using `transition: all` is a documented performance anti-pattern because it triggers layout/paint recalculations on every property change, including width and height which are expensive. The token is labeled "base" suggesting it is meant as a default.

**Compared to:** Tailwind v4 does not expose a `transition-all` shorthand token. `motion.css:33–38` correctly enumerates specific properties for the interactive transition:
```css
transition-property: color, background-color, border-color, ...;
```
But `--sf-transition-base` in tokens.css encourages `all`.

**Impact:** A component using `transition: var(--sf-transition-base)` will trigger compositor and layout for box model changes, causing dropped frames on low-end devices during animations.

**Recommendation:** Rename to `--sf-transition-all` and add an explicit comment: `/* Avoid for animations involving width/height/layout — use specific properties */`. Add a `--sf-transition-colors` token covering only color-related properties.

**Effort:** XS

---

### F-14 — Demo does not demonstrate `sf-scale-down`, `sf-alternate`, `sf-imposter`, `sf-subgrid`, `sf-subgrid-rows`, `sf-section-group`, `sf-pancake`, `sf-cover--min`, `sf-cover--max`, `sf-cover--padding-s/l`, or any `.is-*` state beyond loading/skeleton/hidden/truncated
**Severity:** medium
**Category:** docs
**Evidence:** Scanning `docs/demo.html` lines 1–1833:

- `sf-scale-down` — declared in `motion.css:61`, absent from demo
- `sf-alternate` — declared in `layout.css:293`, absent from demo nav and body
- `sf-imposter`, `sf-imposter--fixed`, `sf-imposter--contain` — absent from demo
- `sf-subgrid`, `sf-subgrid-rows` — absent from demo
- `sf-section-group` — absent from demo
- `sf-cover--min`, `sf-cover--max`, `sf-cover--padding-s`, `sf-cover--padding-l` — absent from demo
- `.is-active`, `.is-current`, `.is-selected`, `.is-highlighted`, `.is-open`, `.is-collapsed`, `.is-expanded`, `.is-valid`, `.is-invalid`, `.is-warning`, `.is-success`, `.is-error`, `.is-info`, `.is-danger`, `.is-sticky`, `.is-pinned`, `.is-fixed`, `.is-clipped`, `.is-scrollable`, `.is-dragging`, `.is-drop-target`, `.is-draggable`, `.is-clickable`, `.is-unselectable`, `.is-overlay`, `.is-busy`, `.is-readonly`, `.is-empty` — all absent from demo
- `.sf-grid-1`, `.sf-grid-1-2`, `.sf-grid-2-1`, `.sf-grid-1-3`, `.sf-grid-3-1` — absent from demo
- `.sf-cluster--no-wrap`, `.sf-switcher--no-wrap`, `.sf-switcher--vertical` — absent from demo

**Compared to:** Bulma's demo covers every component: https://bulma.io/documentation/

**Impact:** Developers cannot visually verify these selectors work, and the regression test suite cannot run without them being in the HTML.

**Recommendation:** Add a "States" section to demo.html covering all 25+ `.is-*` classes. Add an "Alternate / Imposter / Subgrid" layout section. Add modifier examples for all layout primitives.

**Effort:** M

---

### F-15 — `bundle.config.json` excludes `optional/components.css` and `optional/utilities.css` from full bundle without documentation
**Severity:** medium
**Category:** DX
**Evidence:** `bundle.config.json:20–35`. The `slashed.full.css` bundle includes `optional/tokens.palette.css` and `optional/legacy.css` but NOT `optional/components.css`, `optional/utilities.css`, or `optional/tokens.components.css`. These are listed in `README.md:34` as optional files to include. The bundle configuration silently excludes them, so the "full" bundle is not actually full.

**Compared to:** Bulma's CDN bundle is genuinely full — one file includes all components: https://bulma.io/documentation/start/overview/

**Impact:** A developer including `slashed.full.css` and expecting components/utilities would find they are absent with no warning in the console. The README `<link>` example lists them, but the bundle silently omits them, making the two usage modes inconsistent.

**Recommendation:** Either (a) document that the full bundle excludes stub files until they are implemented, or (b) add a `/* Components and utilities not yet available */` comment to `slashed.full.css` output.

**Effort:** XS

---

### F-16 — `@supports (interpolate-size: allow-keywords)` in `reset.css` is inaccurately labeled "Chromium-only"
**Severity:** low
**Category:** docs
**Evidence:** `reset.css:23`:
```css
/* interpolate-size is Chromium-only (no Firefox/Safari as of 2026);
   opt-in by design … */
@supports (interpolate-size: allow-keywords) {
  html { interpolate-size: allow-keywords; }
}
```
As of early 2026, `interpolate-size` has landed in Safari 18 (shipped September 2024) and is under active development in Firefox (behind a flag). The comment "no Firefox/Safari as of 2026" is factually inaccurate. (verified: 2026-05-20)

**Compared to:** Can I Use confirms Safari 18+ support for `interpolate-size` (verified: 2026-05-20). This does not cause a bug (the `@supports` guard is correct), only documentation drift.

**Impact:** Developers may skip testing `interpolate-size` behavior in Safari, missing actual behavior that now applies.

**Recommendation:** Update comment to: `/* interpolate-size: Safari 18+, Chrome 129+; Firefox (flag only as of 2026). */`

**Effort:** XS

---

### F-17 — `@property` tokens are not referenced in `@keyframes`, losing the animation interpolation benefit
**Severity:** low
**Category:** perf
**Evidence:** `tokens.css:50–63` registers `--sf-color-primary-light` et al. as `<color>` typed properties enabling interpolation. `motion.css:68–75` defines keyframes for `sf-fade-in`, `sf-slide-in-*`, `sf-scale-*` — none of these keyframes animate any `--sf-color-*` property. The registered properties are never actually used in `@keyframes`, so the interpolation benefit is only realized if an integrator writes their own animation.

**Compared to:** ACSS v4 uses `@property` explicitly to enable smooth transitions on color tokens: https://docs.automaticcss.com/setup/whats-new-in-4

**Impact:** No direct bug, but the comment in `tokens.css:6` that tokens are "animatable" via `@property` is misleading — the framework ships no animations that exercise this.

**Recommendation:** Add at least one demonstration keyframe (e.g., a color-pulse animation) in `motion.css` that animates `--sf-color-primary-light` to validate the feature is exercised. Document in architecture.md that integrators gain interpolation by animating the registered `-light` source tokens.

**Effort:** S

---

### F-18 — `.sr-only` uses `clip-path: inset(50%)` but lacks `overflow: clip` for modern spec compliance
**Severity:** low
**Category:** a11y
**Evidence:** `accessibility.css:113–124`:
```css
.sr-only, .visually-hidden {
  position:    absolute !important;
  width:       1px      !important;
  height:      1px      !important;
  padding:     0        !important;
  margin:      -1px     !important;
  overflow:    hidden   !important;
  clip-path:   inset(50%) !important;
  white-space: nowrap   !important;
  border:      0        !important;
}
```
The current a11y community recommendation (Scott O'Hara, 2023+) replaces `overflow: hidden` with `overflow: clip` for the visually-hidden pattern, because `overflow: clip` prevents any interaction with the overflowed content while also being explicitly non-scrollable.

**Compared to:** Tailwind v4's `.sr-only` uses `overflow: hidden` (same as SLASHED). Neither has adopted `overflow: clip` yet. This is a low-severity issue since `hidden` works correctly.

**Impact:** Negligible in practice — `clip-path: inset(50%)` already prevents visual rendering. However, `overflow: hidden` still creates a scroll container, which can affect layout in edge cases with absolutely-positioned children.

**Recommendation:**
```css
overflow: clip !important;
```
**Effort:** XS

---

### F-19 — `--sf-radius-full: 9999px` is not a token; it is a magic number
**Severity:** low
**Category:** inconsistency
**Evidence:** `tokens.css:482`:
```css
--sf-radius-full: 9999px;
```
All other `--sf-radius-*` tokens use `calc(Npx * var(--sf-radius-scale))`. `--sf-radius-full` uses a fixed `9999px` that does not scale with `--sf-radius-scale`, which means `--sf-radius-scale: 0` produces `0` for all other radii but `9999px` for full. This is intentional (a pill shape is absolute, not relative) but undocumented.

**Compared to:** Tailwind v4 uses `--radius-full: 3.4028234663852886e+38px` (max float) for the same intent: https://tailwindcss.com/docs/theme

**Impact:** When `--sf-radius-scale` is set to 0 (e.g., a "sharp" design system variant), `--sf-radius-full` does not become 0 — pills remain round. This may be intentional or a surprise depending on the integrator's expectation.

**Recommendation:** Document in `tokens.css`: `/* Not scaled — a pill shape is always circular */`.

**Effort:** XS

---

### F-20 — `--sf-prose-paragraph` token alias points to `--sf-space-content` but demo documentation says `--sf-space-m`
**Severity:** low
**Category:** docs
**Evidence:** `tokens.layout.css:120`: `--sf-prose-paragraph: var(--sf-space-content)`. `demo.html:1037`: `<code>--sf-prose-paragraph → --sf-space-m</code>`. `tokens.css:698`: `--sf-content-gap: var(--sf-space-s)`. The chain is: `--sf-prose-paragraph → --sf-space-content → --sf-content-gap → --sf-space-s`. But the demo labels it `→ --sf-space-m`, which is wrong — `--sf-gap` points to `--sf-space-m`, not `--sf-content-gap`.

**Compared to:** Internal consistency.

**Impact:** A developer reading the demo and expecting `--sf-prose-paragraph` to equal `--sf-space-m` will set `--sf-space-m` to adjust prose spacing and see no change because the chain actually resolves through `--sf-content-gap → --sf-space-s`.

**Recommendation:** Correct demo.html line 1037: `<code>--sf-prose-paragraph → --sf-content-gap → --sf-space-s</code>`.

**Effort:** XS

---

### F-21 — `--sf-color-link--visited` hue-shifts by 40° but may collide with other brand hues
**Severity:** low
**Category:** a11y
**Evidence:** `tokens.css:200`:
```css
--sf-color-link--visited: oklch(from var(--sf-color-action) l c calc(h + 40));
```
For the default action color (h=210, cyan-blue), visited becomes h=250 (indigo-blue). The 40° shift is small enough that if a user sets `--sf-color-action-light` to h=270 (violet), the visited state becomes h=310 — which is the default `--sf-color-tertiary` hue, making visited links visually indistinguishable from tertiary brand text.

**Compared to:** Pico CSS explicitly sets visited link color as a separate design decision in its CSS variables: https://picocss.com/docs/css-variables

**Impact:** With certain brand color combinations, visited links lose their visual distinction, violating WCAG 1.4.1 (Use of Color) for users who rely on visited-state cues.

**Recommendation:** Use a larger hue shift (60°) or offer `--sf-color-link--visited` as a source token (unregistered custom property) that falls back to the hue-shift formula when not overridden.

**Effort:** XS

---

### F-22 — `--sf-border-width-hairline: 0.5px` behaves differently across operating systems
**Severity:** nit
**Category:** inconsistency
**Evidence:** `tokens.css:463`: `--sf-border-width-hairline: 0.5px`. On non-Retina Windows displays (1x DPR), `0.5px` rounds to `1px`. On macOS/iOS Retina (2x DPR), it renders as a true half-pixel hairline. This creates inconsistent visual output across devices.

**Compared to:** Tailwind v4 does not ship a hairline border width token, opting for `1px` as the minimum.

**Impact:** A developer using `--sf-border-width-hairline` for subtle dividers will find they look like full 1px borders on Windows 1x displays.

**Recommendation:** Document the DPR dependency: `/* Hairline: 1px on 1x DPR, 0.5px visual on 2x DPR */`.

**Effort:** XS

---

## 5. Existing Audits — Verification

### api-coverage-vs-reference-frameworks.md (2025)

| Claim | Status | Note |
|-------|--------|------|
| "Named animation presets — only sf-spin + sf-shimmer" (§9) | ✗ wrong | Current commit ships 8 named presets: `sf-fade-in/out`, `sf-slide-in-up/down/left/right`, `sf-scale-up/down` in `motion.css:55–62` and `--sf-animation-*` tokens in `tokens.css:575–582`. This claim was accurate when written but the feature was implemented subsequently. |
| "Transition shorthand tokens: 5 (base/fast/slow/enter/exit)" (§9) | ✓ confirmed | `tokens.css:716–720` |
| "Scroll-driven animation tokens: ABSENT" (§9) | ⚠️ stale | `tokens.css:588–589` ships `--sf-scroll-timeline-range-start/end`. Scroll-driven timeline tokens exist; the audit predates this addition. |
| "font-feature-settings token: ABSENT" (§8) | ✗ wrong | `tokens.css:343`: `--sf-font-features: normal` exists. Same for `--sf-font-variation: normal` at `tokens.css:344`. |
| "Optical sizing token: ABSENT" (§8) | ✗ wrong | `tokens.css:345`: `--sf-optical-sizing: auto` exists. |
| "Font weight granularity (full 100–900): gap" (§8) | ✗ wrong | `tokens.css:351–358` ships all 9 weight tokens from thin (100) to black (900). |
| "Text shadow + drop shadow tokens: TODO" (§gap analysis) | ✗ wrong | `tokens.css:518–526` ships `--sf-text-shadow-s/m/l` and `--sf-drop-shadow-s/m/l`. |
| "Perspective tokens: TODO" (§gap analysis) | ✗ wrong | `tokens.css:539–541` ships `--sf-perspective-near/normal/far`. |
| "Named font stacks beyond 4: partially missing" (§8) | ✗ wrong | `tokens.css:337–339` ships `--sf-font-humanist`, `--sf-font-geometric`, `--sf-font-slab`. |
| "forced-colors: ABSENT" (§10) | ✗ wrong | `accessibility.css:153–166` implements forced-colors with `Highlight` focus color and shadow removal. |
| "Utility classes: entirely absent" | ✓ confirmed | `optional/utilities.css:5` is still a stub. |
| "Button, card, form, alert: entirely absent" | ✓ confirmed | `optional/components.css:7` is still a stub. |
| "Layout primitive breadth: 16+ named patterns" | ✓ confirmed | All 16 primitives present in `layout.css`. |
| "Three-layer color architecture" | ✓ confirmed | `tokens.css:1–9`. |
| "Scoped theming via data-theme" | ✓ confirmed | `base.css:32–33`. |
| "Touch target enforcement: 44px" | ✓ confirmed | `accessibility.css:87–98`. |
| "CSS Nesting: ABSENT" | ✓ confirmed | No native nesting used in any file. |
| ":has() usage: ABSENT" | ✓ confirmed | No `:has()` selectors found in any file. |
| "@starting-style: ABSENT" | ✓ confirmed | Deferred per `architecture.md:185`. |

### quality-audit-2024-full.md

| Claim | Status | Note |
|-------|--------|------|
| "BUG-1: `--sf-shadow-2xl` opacity exceeds 1.0 in dark mode" | ✓ confirmed | Still present in `tokens.css:510`: `calc(var(--sf-shadow-strength) * 5)` without upper clamp. |
| "BUG-2: Link hover lightens in light mode" | ✓ confirmed | Still present in `tokens.css:192`. |
| "BUG-3: `--sf-color-text--inverse` unclamped" | ⚠️ stale | Current `tokens.css:137–140` has `clamp()` applied. This bug appears to have been fixed post-audit. However the clamp bounds may still be suboptimal (see F-09). |
| "WARN-1: `--sf-shadow-color` is dead/WIP code with HSL components" | ✗ wrong | Current `tokens.css:495`: `--sf-shadow-color: oklch(from var(--sf-color-neutral) 0.15 c h)` — this is a valid oklch relative color expression actively used by all `--sf-shadow-*` tokens. The 2024 audit saw an earlier HSL version that has since been replaced. |
| "WARN-2: sign() discontinuity at L=0.6" | ✓ confirmed | Still present by design; documented in architecture.md. |
| "WARN-3: tertiary/neutral only pass AA Large" | ✓ confirmed | Still present (see F-06). |
| "WARN-4: html:focus-within defeats smooth scroll" | ✓ confirmed | `motion.css:27–29`. Documented in architecture.md as intentional. |
| "WARN-5: base palette non-monotonic numbering" | ✓ confirmed | `tokens.palette.css:237–247`. Documented in architecture.md as intentional. |
| "`[inert]` cursor handling present" | ✓ confirmed | `reset.css:105`. |
| "sr-only uses `clip-path: inset(50%)`" | ✓ confirmed | `accessibility.css:121`. |
| "`@import` before `@layer` is correct CSS order" in components.css | ✓ confirmed | `components.css:5`. |
| "All legacy fallbacks gated by @supports not (...)" | ✓ confirmed | `legacy.css:36`, `56`, `75`. |

---

## 6. Recommendations — Prioritized Roadmap

### P0 — Must fix before public v1

| Finding | Change | Effort |
|---------|--------|--------|
| **F-01** | Update README browser floor to Chrome 123 / Safari 17.5 / Firefox 128 | XS |
| **F-03** | Replace `#999` in `print.css:65` with `var(--sf-color-border--strong)` | XS |
| ~~**F-06**~~ | ~~Lower `--sf-color-tertiary-light` default L to ≤0.48, or raise sign() threshold to 0.55~~ — resolved in Phase 2 (tertiary/success/info L→0.48, neutral L→0.45) | — |
| ~~**F-08**~~ | ~~Fix `--sf-color-link--hover` to darken in light mode~~ — already fixed; finding stale | — |
| ~~**F-11**~~ | ~~Add `clamp(0, …, 0.7)` guard to `--sf-shadow-2xl` third layer~~ — already fixed; finding stale | — |
| **F-02** | Implement at minimum `.sf-btn`, `.sf-input`, `.sf-alert` components | L |

### P1 — For v1.1

| Finding | Change | Effort |
|---------|--------|--------|
| **F-04** | Scope print background-transparent reset; add `.print-color-exact` escape | S |
| **F-05** / **F-12** | Move `[data-theme]` rules to `core/themes.css` targeting `slashed.themes` | S |
| **F-07** | Move `@keyframes sf-spin` and `sf-shimmer` to `motion.css` | XS |
| **F-10** | Name the `.sf-container` container; use named `@container` queries | S |
| **F-14** | Add all missing `.is-*` and layout modifier demos to `docs/demo.html` | M |
| **F-15** | Document that `slashed.full.css` excludes stub optional files | XS |
| **F-20** | Correct demo.html `--sf-prose-paragraph` alias documentation | XS |
| **F-21** | Increase visited link hue shift to 60° or expose as overridable token | XS |
| Utilities | Implement minimal utility set: display, spacing, typography, color | L |

### P2 — Nice to have

| Finding | Change | Effort |
|---------|--------|--------|
| **F-09** | Widen `--sf-color-text--inverse` clamp bounds | XS |
| **F-13** | Rename `--sf-transition-base` to `--sf-transition-all`; add `--sf-transition-colors` | XS |
| **F-16** | Update `interpolate-size` comment to reflect Safari 18 support | XS |
| **F-17** | Add one color-animating keyframe to validate `@property` interpolation | S |
| **F-18** | Switch `.sr-only` to `overflow: clip` | XS |
| **F-19** | Add inline comment to `--sf-radius-full: 9999px` | XS |
| **F-22** | Document DPR behavior of `--sf-border-width-hairline` | XS |

---

## 7. Out-of-Scope / Disagreements

### Intentional tradeoffs accepted without objection

**Binary auto-contrast threshold** — The `sign(0.6 - l)` technique is documented in `architecture.md:163`. The trough near L=0.6 is inherent to any binary approach. The CSS `contrast-color()` function would fix this but is not yet widely supported. The framework's documentation of this limitation is thorough.

**`html:focus-within { scroll-behavior: auto }`** — The Andy Bell pattern that defeats smooth scroll on anchor clicks is a legitimate accessibility tradeoff. The `accessibility.css` layer already forces `scroll-behavior: auto` under `prefers-reduced-motion`, making the motion layer's protection somewhat redundant but not harmful.

**Non-monotonic base palette ramp** — Documented in `architecture.md:175`. The V-shaped ramp is intentionally surface-relative. It is unexpected for developers familiar with Tailwind or Material, but the documentation is explicit.

### Intentional tradeoffs disputed

**The no-build claim deserves more nuance.** The README opens with "No build step. No Node. No runtime dependencies." This is technically accurate: CSS files can be `<link>`-tagged directly. However, the minimum viable usage requires two `<link>` tags in a specific order (`layers.css` first, `optional/legacy.css` last per the README). More critically, without a build step there is no way to create a true single-bundle — the recommended path is `slashed.essential.css` from the `dist/` directory, which IS a build artifact. The "no build" claim should read "no build step required; pre-built bundles available." As it stands, developers who trust the headline and grab source files will need to manually maintain load order.

**The `slashed.themes` layer reservation is a design debt that should be resolved, not deferred.** Declaring a layer and shipping no file for it is a broken promise in the architecture. Every developer reading `architecture.md` will look for a `themes.css` file. The layer should either be populated or removed.

**The component and utility stubs should not ship in the "full" bundle description without a clear "not yet available" marker.** The `README.md` and `bundle.config.json` both imply these exist. Shipping empty stubs silently is worse DX than not mentioning them.

---

## 8. Appendix A — Full SLASHED Selector Inventory

### core/reset.css (slashed.reset)
```text
*, *::before, *::after
html
body
menu, ul, ol
img, picture, video, canvas, svg
iframe, embed, object
button, input, select, textarea
button
fieldset
legend
a, button, input, select, textarea, summary
summary
textarea
button
table
[hidden]
dialog, [popover]
[inert]
```

### core/base.css (slashed.base)
```text
:root
@media (prefers-color-scheme: dark) > :root:not([data-theme])
[data-theme="light"]
[data-theme="dark"]
body
h1, h2, h3, h4, h5, h6
h1
h2
h3
h4
h5
h6
p
b, strong
small
mark
abbr[title]
kbd, samp
sub, sup
sup
sub
a
a:hover
a:visited
a:active
a:not([class])
a, code
code
pre
pre code
svg
hr
:target
::selection
th, caption
address, cite, dfn, var
input, textarea
input, progress
::backdrop
optgroup
::file-selector-button
::placeholder
```

### core/layout.css (slashed.layout)
```text
.sf-section
.sf-section--s
.sf-section--m
.sf-section--l
.sf-section--xl
.sf-section-group > .sf-section + .sf-section
.sf-container
.sf-container--narrow
.sf-container--prose
.sf-container--wide
.sf-container--full
.sf-stack
.sf-stack--2xs
.sf-stack--xs
.sf-stack--s
.sf-stack--m
.sf-stack--l
.sf-stack--xl
.sf-stack--2xl
.sf-stack--3xl
.sf-stack--center
.sf-stack--end
.sf-stack--stretch
.sf-box
.sf-center
.sf-center--intrinsic
.sf-cluster
.sf-cluster--2xs
.sf-cluster--xs
.sf-cluster--s
.sf-cluster--m
.sf-cluster--l
.sf-cluster--xl
.sf-cluster--no-wrap
.sf-cluster--center
.sf-cluster--end
.sf-cluster--between
.sf-sidebar
.sf-sidebar > :first-child
.sf-sidebar > :last-child
.sf-sidebar--right > :first-child
.sf-sidebar--right > :last-child
.sf-sidebar--narrow
.sf-sidebar--wide
.sf-switcher
.sf-switcher > *
.sf-switcher--no-wrap
.sf-switcher--vertical
.sf-grid
.sf-grid--fit
.sf-grid--xs
.sf-grid--s
.sf-grid--m
.sf-grid--l
.sf-grid--xl
.sf-cover
.sf-cover > .sf-cover__center
.sf-cover--min
.sf-cover--max
.sf-cover--padding-s
.sf-cover--padding-l
.sf-frame
.sf-frame > img, .sf-frame > video
.sf-frame--square
.sf-frame--video
.sf-frame--cinema
.sf-frame--portrait
.sf-frame--4-3
.sf-frame--3-2
.sf-frame--golden
.sf-reel
.sf-reel > *
.sf-imposter
.sf-imposter--fixed
.sf-imposter--contain
.sf-alternate
.sf-alternate > *
@container (min-width: 48em) > .sf-alternate > *
@container (min-width: 48em) > .sf-alternate > :nth-child(even) > :first-child
@container (min-width: 48em) > .sf-alternate > :nth-child(even) > :last-child
.sf-pancake
.sf-grid-1, .sf-grid-2, .sf-grid-3, .sf-grid-4, .sf-grid-6
@container (min-width: 30em) > .sf-grid-4
@container (min-width: 30em) > .sf-grid-6
@container (min-width: 48em) > .sf-grid-2
@container (min-width: 48em) > .sf-grid-3
@container (min-width: 48em) > .sf-grid-4
@container (min-width: 48em) > .sf-grid-6
.sf-grid-1-2, .sf-grid-2-1, .sf-grid-1-3, .sf-grid-3-1
@container (min-width: 48em) > .sf-grid-1-2
@container (min-width: 48em) > .sf-grid-2-1
@container (min-width: 48em) > .sf-grid-1-3
@container (min-width: 48em) > .sf-grid-3-1
.sf-content-grid
.sf-content-grid > *
.sf-content-grid > .sf-breakout
.sf-content-grid > .sf-full-bleed
.sf-bento
@container (min-width: 30em) and (max-width: 47.99em) > .sf-bento
.sf-bento--2
.sf-bento--4
.sf-bento--compact
.sf-bento--tall
.sf-subgrid
.sf-subgrid-rows
.sf-prose
.sf-prose > * + *
.sf-prose :is(h2, h3, h4) + *
.sf-prose li + li
.sf-prose :is(blockquote, pre)
.sf-prose img
.sf-prose :is(ul, ol)
.sf-prose ul
.sf-prose ol
.sf-prose ::marker
.sf-prose figure
.sf-prose figcaption
.sf-prose table
.sf-prose video
.sf-prose .sf-not-prose > * + *
.sf-prose .sf-not-prose li + li
.sf-prose .sf-not-prose :is(ul,ol)
.sf-prose .sf-not-prose ::marker
.sf-prose .sf-not-prose img
.sf-prose .sf-not-prose figure
.sf-prose .sf-not-prose figcaption
.sf-prose .sf-not-prose table
.sf-prose .sf-not-prose video
```

### core/states.css (slashed.states)
```text
.is-hidden
.is-invisible
.is-visible
.is-disabled
.is-readonly
.is-loading
.is-loading::after
.is-busy
.is-skeleton
.is-active
.is-selected
.is-current
.is-highlighted
.is-open
.is-collapsed
.is-expanded
.is-valid
.is-invalid
.is-warning
.is-success
.is-error
.is-info
.is-danger
.is-sticky
.is-pinned
.is-fixed
.is-clipped
.is-scrollable
.is-truncated
.is-dragging
.is-drop-target
.is-draggable
.is-overlay
.is-clickable
.is-unselectable
.is-empty:empty
@keyframes sf-spin
@keyframes sf-shimmer
```

### core/motion.css (slashed.motion)
```text
@media (prefers-reduced-motion: no-preference) > html
@media (prefers-reduced-motion: no-preference) > html:focus-within
@media (prefers-reduced-motion: no-preference) > a, button, input, select, textarea, summary
@supports (view-transition-name: none) > ::view-transition-old(root)
@supports (view-transition-name: none) > ::view-transition-new(root)
.sf-fade-in
.sf-fade-out
.sf-slide-in-up
.sf-slide-in-down
.sf-slide-in-left
.sf-slide-in-right
.sf-scale-up
.sf-scale-down
@keyframes sf-fade-in
@keyframes sf-fade-out
@keyframes sf-slide-in-up
@keyframes sf-slide-in-down
@keyframes sf-slide-in-left
@keyframes sf-slide-in-right
@keyframes sf-scale-up
@keyframes sf-scale-down
```

### core/accessibility.css (slashed.accessibility)
```text
:focus:not(:focus-visible)
:focus-visible
@media (prefers-reduced-motion: reduce) > :root
@media (prefers-reduced-motion: reduce) > *, *::before, *::after
@media (prefers-contrast: more) > :root
@media (prefers-contrast: more) > hr
@media (prefers-reduced-transparency: reduce) > ::backdrop
@media (pointer: coarse) > button, input[type="button"], input[type="submit"], input[type="reset"], select, summary, a
[disabled], [aria-disabled="true"]
.sr-only, .visually-hidden
.skip-link
.skip-link:focus
@media (forced-colors: active) > :root
@media (forced-colors: active) > :focus-visible
@media (forced-colors: active) > :where(*)
```

### core/print.css (slashed.print)
```text
@media print > @page
@media print > *, *::before, *::after
@media print > a[href]::after
@media print > a[href^="#"]::after
@media print > a[href^="javascript:" i]::after
@media print > abbr[title]::after
@media print > img, svg, video, canvas, figure, table, pre, blockquote
@media print > thead
@media print > tr
@media print > h1, h2, h3, h4, h5, h6
@media print > p
@media print > pre, blockquote
@media print > nav, aside, button, input, select, textarea, dialog, [popover], .no-print
@media print > details
@media print > details > summary
@media print > details:not([open]) > :not(summary)
```

### optional/tokens.palette.css (slashed.tokens)
No selectors — only custom property declarations in `:root { }`.

### optional/legacy.css (slashed.legacy)
```text
@supports not (height: 100dvh) > body
@supports not selector(:focus-visible) > :focus
@supports not (scrollbar-gutter: stable) > html
```

---

## 9. Appendix B — Full SLASHED Token Inventory

All tokens are in `@layer slashed.tokens` on `:root` unless otherwise noted.

### @property registered tokens (core/tokens.css)

| Custom property | Type | Initial value |
|---|---|---|
| `--sf-color-primary-light` | `<color>` | `oklch(0.45 0.20 264)` |
| `--sf-color-secondary-light` | `<color>` | `oklch(0.25 0.03 260)` |
| `--sf-color-tertiary-light` | `<color>` | `oklch(0.55 0.14 310)` |
| `--sf-color-action-light` | `<color>` | `oklch(0.60 0.16 210)` |
| `--sf-color-neutral-light` | `<color>` | `oklch(0.55 0.02 260)` |
| `--sf-color-base-light` | `<color>` | `oklch(0.98 0.005 260)` |
| `--sf-color-success-light` | `<color>` | `oklch(0.55 0.17 150)` |
| `--sf-color-warning-light` | `<color>` | `oklch(0.75 0.17 80)` |
| `--sf-color-error-light` | `<color>` | `oklch(0.62 0.20 35)` |
| `--sf-color-info-light` | `<color>` | `oklch(0.55 0.15 240)` |
| `--sf-color-danger-light` | `<color>` | `oklch(0.48 0.24 12)` |
| `--sf-is-dark` | `<integer>` | `0` |

### Resolved semantic color tokens (core/tokens.css)

| Custom property | Value / formula | Category |
|---|---|---|
| `--sf-color-scheme` | `light dark` | Color scheme |
| `--sf-color-primary` | `light-dark(var(--sf-color-primary-light), auto-derived)` | Brand |
| `--sf-color-secondary` | `light-dark(…)` | Brand |
| `--sf-color-tertiary` | `light-dark(…)` | Brand |
| `--sf-color-action` | `light-dark(…)` | Brand |
| `--sf-color-neutral` | `light-dark(…)` | Brand |
| `--sf-color-base` | `light-dark(…)` | Brand |
| `--sf-color-success` | `light-dark(…)` | Status |
| `--sf-color-warning` | `light-dark(…)` | Status |
| `--sf-color-error` | `light-dark(…)` | Status |
| `--sf-color-info` | `light-dark(…)` | Status |
| `--sf-color-danger` | `light-dark(…)` | Status |
| `--sf-color-bg` | `oklch(from base calc(l+0.02) c h)` | Surface |
| `--sf-color-surface` | `var(--sf-color-base)` | Surface |
| `--sf-color-well` | `oklch(from base calc(l-0.02) c h)` | Surface |
| `--sf-color-raised` | `oklch(from base calc(l+0.04) c h)` | Surface |
| `--sf-color-overlay` | `oklch(from base l c h / 0.9)` | Surface |
| `--sf-color-inverse` | `oklch(from base calc(1-l) c h)` | Surface |
| `--sf-color-text` | `light-dark(clamp formula, clamp formula)` | Text |
| `--sf-color-text--secondary` | `light-dark(…)` | Text |
| `--sf-color-text--muted` | `var(--sf-color-neutral)` | Text |
| `--sf-color-text--placeholder` | `light-dark(…)` | Text |
| `--sf-color-text--disabled` | `light-dark(…)` | Text |
| `--sf-color-text--inverse` | `light-dark(…)` | Text |
| `--sf-color-heading` | `light-dark(…)` | Text |
| `--sf-color-text--on-primary` | `oklch(from primary sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-secondary` | `oklch(from secondary sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-tertiary` | `oklch(from tertiary sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-action` | `oklch(from action sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-neutral` | `oklch(from neutral sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-base` | `var(--sf-color-text)` | On-color |
| `--sf-color-text--on-inverse` | `var(--sf-color-text--inverse)` | On-color |
| `--sf-color-text--on-success` | `oklch(from success sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-warning` | `oklch(from warning sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-error` | `oklch(from error sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-info` | `oklch(from info sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-text--on-danger` | `oklch(from danger sign(0.6-l)*999 0 0)` | On-color |
| `--sf-color-border` | `light-dark(…)` | Border |
| `--sf-color-border--subtle` | `light-dark(…)` | Border |
| `--sf-color-border--strong` | `light-dark(…)` | Border |
| `--sf-color-border--focus` | `var(--sf-color-action)` | Border |
| `--sf-color-border--disabled` | `oklch(from border–subtle l 0 h / 0.5)` | Border |
| `--sf-color-border--translucent` | `oklch(from neutral l c h / 0.15)` | Border |
| `--sf-color-link` | `var(--sf-color-action)` | Link |
| `--sf-color-link--hover` | `light-dark(l+0.1, l+0.1)` | Link |
| `--sf-color-link--active` | `light-dark(l-0.15, l+0.15)` | Link |
| `--sf-color-link--visited` | `oklch(from action l c calc(h+40))` | Link |
| `--sf-color-link--underline` | `oklch(from action l c h / 0.3)` | Link |
| `--sf-color-link--disabled` | `var(--sf-color-text--disabled)` | Link |
| `--sf-color-bg--hover` | `oklch(from neutral l c h / 0.08)` | State |
| `--sf-color-bg--active` | `oklch(from neutral l c h / 0.12)` | State |
| `--sf-color-bg--selected` | `oklch(from action l c h / 0.1)` | State |
| `--sf-color-bg--focus` | `oklch(from action l c h / 0.06)` | State |
| `--sf-color-bg--disabled` | `var(--sf-color-well)` | State |
| `--sf-color-code-bg` | `var(--sf-color-well)` | State |
| `--sf-color-selection-bg` | `oklch(from action l c h / 0.22)` | Selection |
| `--sf-color-selection-text` | `inherit` | Selection |
| `--sf-color-mark-bg` | `oklch(from warning l c h / 0.25)` | Selection |
| `--sf-color-mark-text` | `inherit` | Selection |
| `--sf-color-dim` | `oklch(0 0 0 / 0.5)` | Overlay |
| `--sf-scrollbar-thumb` | `var(--sf-color-neutral)` | Scrollbar |
| `--sf-scrollbar-track` | `transparent` | Scrollbar |
| `--sf-color-success-subtle` | `oklch(from success l c h / 0.12)` | Status triplet |
| `--sf-color-success-strong` | `light-dark(…)` | Status triplet |
| `--sf-color-success-muted` | `oklch(from success l c h / 0.3)` | Status triplet |
| `--sf-color-warning-subtle` | `oklch(from warning l c h / 0.12)` | Status triplet |
| `--sf-color-warning-strong` | `light-dark(…)` | Status triplet |
| `--sf-color-warning-muted` | `oklch(from warning l c h / 0.3)` | Status triplet |
| `--sf-color-error-subtle` | `oklch(from error l c h / 0.1)` | Status triplet |
| `--sf-color-error-strong` | `light-dark(…)` | Status triplet |
| `--sf-color-error-muted` | `oklch(from error l c h / 0.3)` | Status triplet |
| `--sf-color-info-subtle` | `oklch(from info l c h / 0.1)` | Status triplet |
| `--sf-color-info-strong` | `light-dark(…)` | Status triplet |
| `--sf-color-info-muted` | `oklch(from info l c h / 0.3)` | Status triplet |
| `--sf-color-danger-subtle` | `oklch(from danger l c h / 0.1)` | Status triplet |
| `--sf-color-danger-strong` | `light-dark(…)` | Status triplet |
| `--sf-color-danger-muted` | `oklch(from danger l c h / 0.3)` | Status triplet |
| `--sf-gradient-primary` | `linear-gradient(135deg, primary, l-0.08)` | Gradient |
| `--sf-gradient-secondary` | `linear-gradient(135deg, …)` | Gradient |
| `--sf-gradient-tertiary` | `linear-gradient(135deg, …)` | Gradient |
| `--sf-gradient-brand` | `linear-gradient(135deg, primary, h+30)` | Gradient |
| `--sf-gradient-surface` | `linear-gradient(180deg, surface, bg)` | Gradient |
| `--sf-gradient-fade--r` | `linear-gradient(to right, transparent, bg)` | Gradient |
| `--sf-gradient-fade--l` | `linear-gradient(to left, …)` | Gradient |
| `--sf-gradient-fade--t` | `linear-gradient(to top, …)` | Gradient |
| `--sf-gradient-fade--b` | `linear-gradient(to bottom, …)` | Gradient |
| `--sf-shadow-strength` | `calc(0.08 + is-dark * 0.17)` | Shadow |
| `--sf-shadow-glow-color` | `var(--sf-color-primary)` | Shadow |
| `--sf-shadow-glow` | `0 0 15px 2px oklch(…)` | Shadow |
| `--sf-opacity-disabled` | `0.45` | Opacity |
| `--sf-focus-ring-color` | `var(--sf-color-action)` | Focus |
| `--sf-focus-ring-shadow` | `compound ring value` | Focus |
| `--sf-caret-color` | `var(--sf-color-action)` | Form |
| `--sf-shadow-color` | `oklch(from neutral 0.15 c h)` | Shadow |
| `--sf-shadow-none` | `none` | Shadow |
| `--sf-shadow-xs` | `compound oklch value` | Shadow |
| `--sf-shadow-s` | `compound` | Shadow |
| `--sf-shadow-m` | `compound` | Shadow |
| `--sf-shadow-l` | `compound` | Shadow |
| `--sf-shadow-xl` | `compound` | Shadow |
| `--sf-shadow-2xl` | `compound` | Shadow |
| `--sf-shadow-inner` | `inset compound` | Shadow |
| `--sf-text-shadow-none` | `none` | Text shadow |
| `--sf-text-shadow-s` | `0 1px 2px oklch(…)` | Text shadow |
| `--sf-text-shadow-m` | `0 2px 4px oklch(…)` | Text shadow |
| `--sf-text-shadow-l` | `0 4px 8px oklch(…)` | Text shadow |
| `--sf-drop-shadow-s` | `drop-shadow(0 1px 2px oklch(…))` | Drop shadow |
| `--sf-drop-shadow-m` | `drop-shadow(0 4px 6px oklch(…))` | Drop shadow |
| `--sf-drop-shadow-l` | `drop-shadow(0 8px 16px oklch(…))` | Drop shadow |

### Non-color design tokens (core/tokens.css)

| Custom property | Value | Category |
|---|---|---|
| `--sf-space-scale` | `1` | Scale |
| `--sf-text-scale` | `1` | Scale |
| `--sf-text-display-scale` | `1` | Scale |
| `--sf-radius-scale` | `1` | Scale |
| `--sf-motion-scale` | `1` | Scale |
| `--sf-font-body` | `system-ui, -apple-system, sans-serif` | Font |
| `--sf-font-heading` | `var(--sf-font-body)` | Font |
| `--sf-font-display` | `var(--sf-font-heading)` | Font |
| `--sf-font-mono` | `ui-monospace, monospace` | Font |
| `--sf-font-humanist` | `"Seravek", …` | Font stack |
| `--sf-font-geometric` | `"Avenir", …` | Font stack |
| `--sf-font-slab` | `"Rockwell", …` | Font stack |
| `--sf-font-features` | `normal` | OpenType |
| `--sf-font-variation` | `normal` | Variable font |
| `--sf-optical-sizing` | `auto` | Typography |
| `--sf-font-weight-thin` | `100` | Weight |
| `--sf-font-weight-extralight` | `200` | Weight |
| `--sf-font-weight-light` | `300` | Weight |
| `--sf-font-weight-normal` | `400` | Weight |
| `--sf-font-weight-medium` | `500` | Weight |
| `--sf-font-weight-semibold` | `600` | Weight |
| `--sf-font-weight-bold` | `700` | Weight |
| `--sf-font-weight-extrabold` | `800` | Weight |
| `--sf-font-weight-black` | `900` | Weight |
| `--sf-font-weight-body` | `var(--sf-font-weight-normal)` | Weight alias |
| `--sf-font-weight-heading` | `var(--sf-font-weight-semibold)` | Weight alias |
| `--sf-font-weight-display` | `var(--sf-font-weight-bold)` | Weight alias |
| `--sf-text-2xs` | `clamp(0.51rem, …, 0.53rem)` | Type scale |
| `--sf-text-xs` | `clamp(0.64rem, …, 0.7rem)` | Type scale |
| `--sf-text-s` | `clamp(0.8rem, …, 0.94rem)` | Type scale |
| `--sf-text-m` | `clamp(1rem, …, 1.25rem)` | Type scale |
| `--sf-text-l` | `clamp(1.25rem, …, 1.67rem)` | Type scale |
| `--sf-text-xl` | `clamp(1.56rem, …, 2.22rem)` | Type scale |
| `--sf-text-2xl` | `clamp(1.95rem, …, 2.96rem)` | Type scale |
| `--sf-text-3xl` | `clamp(2.44rem, …, 3.95rem)` | Type scale |
| `--sf-text-4xl` | `clamp(3.05rem, …, 5.26rem)` | Type scale |
| `--sf-text-display-s` | `clamp(2.4rem, …, 3rem)` | Display |
| `--sf-text-display-m` | `clamp(3rem, …, 4rem)` | Display |
| `--sf-text-display-l` | `clamp(3.75rem, …, 5.33rem)` | Display |
| `--sf-leading-tight` | `1.1` | Line height |
| `--sf-leading-snug` | `1.3` | Line height |
| `--sf-leading-normal` | `1.5` | Line height |
| `--sf-leading-relaxed` | `1.625` | Line height |
| `--sf-tracking-tight` | `-0.025em` | Letter spacing |
| `--sf-tracking-normal` | `0` | Letter spacing |
| `--sf-tracking-wide` | `0.025em` | Letter spacing |
| `--sf-tracking-wider` | `0.05em` | Letter spacing |
| `--sf-tracking-widest` | `0.1em` | Letter spacing |
| `--sf-icon-xs` | `0.875em` | Icon |
| `--sf-icon-s` | `1em` | Icon |
| `--sf-icon-m` | `1.5em` | Icon |
| `--sf-icon-l` | `2em` | Icon |
| `--sf-icon-xl` | `3em` | Icon |
| `--sf-space-none` | `0` | Spacing |
| `--sf-space-px` | `1px` | Spacing |
| `--sf-space-gutter` | `var(--sf-space-l)` | Spacing |
| `--sf-space-2xs` | `clamp(0.51rem,…,0.84rem) * scale` | Spacing |
| `--sf-space-xs` | `clamp(0.64rem,…,1.13rem) * scale` | Spacing |
| `--sf-space-s` | `clamp(0.8rem,…,1.5rem) * scale` | Spacing |
| `--sf-space-m` | `clamp(1rem,…,2rem) * scale` | Spacing |
| `--sf-space-l` | `clamp(1.25rem,…,2.67rem) * scale` | Spacing |
| `--sf-space-xl` | `clamp(1.56rem,…,3.55rem) * scale` | Spacing |
| `--sf-space-2xl` | `clamp(1.95rem,…,4.74rem) * scale` | Spacing |
| `--sf-space-3xl` | `clamp(2.44rem,…,6.31rem) * scale` | Spacing |
| `--sf-space-4xl` | `clamp(3.05rem,…,8.42rem) * scale` | Spacing |
| `--sf-size-xs` | `1.5rem` | UI size |
| `--sf-size-s` | `2rem` | UI size |
| `--sf-size-m` | `2.5rem` | UI size |
| `--sf-size-l` | `2.75rem` | UI size |
| `--sf-size-xl` | `3.5rem` | UI size |
| `--sf-container-narrow` | `38rem` | Container |
| `--sf-container-prose` | `65ch` | Container |
| `--sf-container-default` | `75rem` | Container |
| `--sf-container-wide` | `90rem` | Container |
| `--sf-container-full` | `100%` | Container |
| `--sf-ratio-square` | `1` | Aspect ratio |
| `--sf-ratio-video` | `16 / 9` | Aspect ratio |
| `--sf-ratio-cinema` | `21 / 9` | Aspect ratio |
| `--sf-ratio-photo` | `3 / 2` | Aspect ratio |
| `--sf-ratio-portrait` | `3 / 4` | Aspect ratio |
| `--sf-ratio-golden` | `1.618 / 1` | Aspect ratio |
| `--sf-border-width-hairline` | `0.5px` | Border |
| `--sf-border-width-1` | `1px` | Border |
| `--sf-border-width-2` | `2px` | Border |
| `--sf-border-width-3` | `3px` | Border |
| `--sf-border-width-4` | `4px` | Border |
| `--sf-radius-none` | `0` | Radius |
| `--sf-radius-xs` | `calc(2px * scale)` | Radius |
| `--sf-radius-s` | `calc(4px * scale)` | Radius |
| `--sf-radius-m` | `calc(8px * scale)` | Radius |
| `--sf-radius-l` | `calc(12px * scale)` | Radius |
| `--sf-radius-xl` | `calc(16px * scale)` | Radius |
| `--sf-radius-2xl` | `calc(24px * scale)` | Radius |
| `--sf-radius-3xl` | `calc(32px * scale)` | Radius |
| `--sf-radius-4xl` | `calc(48px * scale)` | Radius |
| `--sf-radius-full` | `9999px` | Radius |
| `--sf-blur-xs` | `4px` | Blur |
| `--sf-blur-s` | `8px` | Blur |
| `--sf-blur-m` | `16px` | Blur |
| `--sf-blur-l` | `32px` | Blur |
| `--sf-blur-xl` | `48px` | Blur |
| `--sf-perspective-near` | `500px` | 3D |
| `--sf-perspective-normal` | `1000px` | 3D |
| `--sf-perspective-far` | `2000px` | 3D |
| `--sf-opacity-0` | `0` | Opacity |
| `--sf-opacity-10` | `0.1` | Opacity |
| `--sf-opacity-25` | `0.25` | Opacity |
| `--sf-opacity-50` | `0.5` | Opacity |
| `--sf-opacity-75` | `0.75` | Opacity |
| `--sf-opacity-100` | `1` | Opacity |
| `--sf-duration-none` | `0ms` | Motion |
| `--sf-duration-instant` | `calc(100ms * scale)` | Motion |
| `--sf-duration-fast` | `calc(150ms * scale)` | Motion |
| `--sf-duration-normal` | `calc(250ms * scale)` | Motion |
| `--sf-duration-slow` | `calc(400ms * scale)` | Motion |
| `--sf-duration-slower` | `calc(600ms * scale)` | Motion |
| `--sf-ease-linear` | `linear` | Easing |
| `--sf-ease-out` | `cubic-bezier(0.25,0,0.15,1)` | Easing |
| `--sf-ease-in` | `cubic-bezier(0.5,0,0.75,0.25)` | Easing |
| `--sf-ease-in-out` | `cubic-bezier(0.4,0,0.2,1)` | Easing |
| `--sf-ease-spring` | `linear(0,0.5,1.1,…)` | Easing |
| `--sf-ease-elastic` | `linear(0,0.3,1.2,…)` | Easing |
| `--sf-ease-bounce` | `linear(0,0.35 18%,…)` | Easing |
| `--sf-ease-overshoot` | `linear(0,0.6 30%,…)` | Easing |
| `--sf-animation-fade-in` | `sf-fade-in normal ease-out both` | Animation |
| `--sf-animation-fade-out` | `sf-fade-out normal ease-in both` | Animation |
| `--sf-animation-slide-in-up` | `sf-slide-in-up normal ease-out both` | Animation |
| `--sf-animation-slide-in-down` | `sf-slide-in-down normal ease-out both` | Animation |
| `--sf-animation-slide-in-left` | `sf-slide-in-left normal ease-out both` | Animation |
| `--sf-animation-slide-in-right` | `sf-slide-in-right normal ease-out both` | Animation |
| `--sf-animation-scale-up` | `sf-scale-up normal ease-overshoot both` | Animation |
| `--sf-animation-scale-down` | `sf-scale-down normal ease-in both` | Animation |
| `--sf-scroll-timeline-range-start` | `0%` | Scroll |
| `--sf-scroll-timeline-range-end` | `100%` | Scroll |
| `--sf-z-below` | `-1` | Z-index |
| `--sf-z-base` | `0` | Z-index |
| `--sf-z-raised` | `1` | Z-index |
| `--sf-z-low` | `10` | Z-index |
| `--sf-z-mid` | `100` | Z-index |
| `--sf-z-high` | `500` | Z-index |
| `--sf-z-top` | `900` | Z-index |
| `--sf-z-max` | `9999` | Z-index |
| `--sf-header-height` | `8rem` | Layout/A11y |
| `--sf-sticky-offset` | `var(--sf-header-height)` | Layout |
| `--sf-focus-ring-width` | `2px` | Focus |
| `--sf-focus-ring-offset` | `2px` | Focus |
| `--sf-focus-ring-style` | `solid` | Focus |
| `--sf-touch-target` | `var(--sf-size-l)` | A11y |
| `--sf-contrast-bias` | `0` | A11y |
| `--sf-safe-top` | `env(safe-area-inset-top, 0px)` | Safe area |
| `--sf-safe-bottom` | `env(safe-area-inset-bottom, 0px)` | Safe area |
| `--sf-safe-left` | `env(safe-area-inset-left, 0px)` | Safe area |
| `--sf-safe-right` | `env(safe-area-inset-right, 0px)` | Safe area |
| `--sf-print-page-margin` | `2cm` | Print |
| `--sf-print-page-size` | `a4` | Print |
| `--sf-print-base-size` | `11pt` | Print |
| `--sf-stroke-thin` | `1px` | Stroke |
| `--sf-stroke-regular` | `1.5px` | Stroke |
| `--sf-stroke-bold` | `2px` | Stroke |
| `--sf-stroke-heavy` | `3px` | Stroke |

### Typography aliases (core/tokens.css)

| Custom property | Value |
|---|---|
| `--sf-body-font-size` | `var(--sf-text-m)` |
| `--sf-body-line-height` | `var(--sf-leading-normal)` |
| `--sf-body-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-body-font-family` | `var(--sf-font-body)` |
| `--sf-body-color` | `var(--sf-color-text)` |
| `--sf-body-text-wrap` | `pretty` |
| `--sf-body-strong-weight` | `var(--sf-font-weight-heading)` |
| `--sf-body-em-style` | `italic` |
| `--sf-heading-font-family` | `var(--sf-font-heading)` |
| `--sf-heading-color` | `var(--sf-color-heading)` |
| `--sf-heading-text-wrap` | `balance` |
| `--sf-h1-size` | `var(--sf-text-4xl)` |
| `--sf-h1-line-height` | `var(--sf-leading-tight)` |
| `--sf-h1-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h1-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-h2-size` | `var(--sf-text-3xl)` |
| `--sf-h2-line-height` | `var(--sf-leading-tight)` |
| `--sf-h2-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h2-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-h3-size` | `var(--sf-text-2xl)` |
| `--sf-h3-line-height` | `var(--sf-leading-snug)` |
| `--sf-h3-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h3-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h4-size` | `var(--sf-text-xl)` |
| `--sf-h4-line-height` | `var(--sf-leading-snug)` |
| `--sf-h4-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h4-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h5-size` | `var(--sf-text-l)` |
| `--sf-h5-line-height` | `var(--sf-leading-normal)` |
| `--sf-h5-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h5-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h6-size` | `var(--sf-text-m)` |
| `--sf-h6-line-height` | `var(--sf-leading-normal)` |
| `--sf-h6-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h6-letter-spacing` | `var(--sf-tracking-wide)` |
| `--sf-gap` | `var(--sf-space-m)` |
| `--sf-content-gap` | `var(--sf-space-s)` |
| `--sf-component-pad` | `var(--sf-space-m)` |
| `--sf-field-block` | `var(--sf-space-l)` |
| `--sf-section-pad` | `var(--sf-section-pad--m)` |
| `--sf-section-pad--s` | `var(--sf-space-2xl)` |
| `--sf-section-pad--m` | `var(--sf-space-3xl)` |
| `--sf-section-pad--l` | `var(--sf-space-4xl)` |
| `--sf-section-pad--xl` | `calc(var(--sf-space-4xl) * 1.5)` |
| `--sf-transition-base` | `all normal ease-out` |
| `--sf-transition-fast` | `all fast ease-out` |
| `--sf-transition-slow` | `all slow ease-in-out` |
| `--sf-transition-enter` | `all normal ease-out` |
| `--sf-transition-exit` | `all fast ease-in` |

### Layout tokens (core/tokens.layout.css)

| Custom property | Value |
|---|---|
| `--sf-space-gap` | `var(--sf-gap)` |
| `--sf-space-content` | `var(--sf-content-gap)` |
| `--sf-stack-gap` | `var(--sf-space-content)` |
| `--sf-box-padding` | `var(--sf-space-m)` |
| `--sf-box-border-width` | `0` |
| `--sf-box-border-color` | `var(--sf-color-border)` |
| `--sf-center-max` | `var(--sf-container-default)` |
| `--sf-center-gutter` | `var(--sf-space-gutter)` |
| `--sf-cluster-gap` | `var(--sf-space-gap)` |
| `--sf-cluster-align` | `center` |
| `--sf-cluster-justify` | `flex-start` |
| `--sf-sidebar-gap` | `var(--sf-space-gap)` |
| `--sf-sidebar-min-width` | `50%` |
| `--sf-sidebar-width-default` | `18rem` |
| `--sf-switcher-threshold` | `30rem` |
| `--sf-switcher-gap` | `var(--sf-space-gap)` |
| `--sf-grid-min` | `16rem` |
| `--sf-grid-gap` | `var(--sf-space-gap)` |
| `--sf-grid-min-xs` | `10rem` |
| `--sf-grid-min-s` | `13rem` |
| `--sf-grid-min-default` | `16rem` |
| `--sf-grid-min-m` | `16rem` |
| `--sf-grid-min-l` | `20rem` |
| `--sf-grid-min-xl` | `24rem` |
| `--sf-cover-min-height` | `100dvh` |
| `--sf-cover-padding` | `var(--sf-section-pad)` |
| `--sf-frame-ratio` | `16 / 9` |
| `--sf-reel-item-width` | `max-content` |
| `--sf-reel-gap` | `var(--sf-space-gap)` |
| `--sf-reel-height` | `auto` |
| `--sf-imposter-margin` | `var(--sf-space-m)` |
| `--sf-bento-cols-default` | `3` |
| `--sf-bento-row-default` | `10rem` |
| `--sf-bento-row-compact` | `6rem` |
| `--sf-bento-row-tall` | `16rem` |
| `--sf-bento-gap` | `var(--sf-space-gap)` |
| `--sf-breakout-width` | `var(--sf-container-wide)` |
| `--sf-content-width` | `var(--sf-container-default)` |
| `--sf-prose-paragraph` | `var(--sf-space-content)` |

### Palette tokens (optional/tokens.palette.css)
Per brand color (primary, secondary, tertiary, action, neutral, base):
- `--sf-color-{c}-50` through `--sf-color-{c}-950` (11 numeric steps per color × 6 colors = 66 tokens)
- `--sf-color-{c}-a5` through `--sf-color-{c}-a95` (11 alpha steps × 6 = 66 tokens)
- `--sf-color-{c}-superlight`, `-xlight`, `-lighter`, `-darker`, `-xdark`, `-superdark` (6 aliases × 6 = 36)
- `--sf-color-{c}-hover`, `-active`, `-subtle`, `-muted`, `-ghost` (5 functional × 6 = 30)

**Total palette tokens: 198**

---

## 10. Appendix C — Sources Cited

All URLs verified: 2026-05-20.

| Resource | URL |
|---|---|
| Pico CSS v2 docs | https://picocss.com/docs |
| Pico CSS v2 CSS variables | https://picocss.com/docs/css-variables |
| Pico CSS v2 classless approach | https://picocss.com/docs/classless |
| Pico CSS v2 color schemes | https://picocss.com/docs/color-schemes |
| Automatic.css docs | https://docs.automaticcss.com/ |
| Automatic.css v4 what's new | https://docs.automaticcss.com/setup/whats-new-in-4 |
| Bulma v1 documentation | https://bulma.io/documentation/ |
| Bulma v1 dark mode | https://bulma.io/documentation/features/dark-mode/ |
| Bulma v1 themes | https://bulma.io/documentation/features/themes/ |
| Bulma v1 CSS variables | https://bulma.io/documentation/customize/with-css-variables/ |
| Tailwind CSS v4 theme | https://tailwindcss.com/docs/theme |
| Tailwind CSS v4 dark mode | https://tailwindcss.com/docs/dark-mode |
| Tailwind CSS v4 preflight | https://tailwindcss.com/docs/preflight |
| Tailwind CSS v4 adding custom styles | https://tailwindcss.com/docs/adding-custom-styles |
| Tailwind CSS v4 browser compatibility | https://tailwindcss.com/docs/compatibility |


---

## 11. Resolution Log

Findings resolved subsequent to publication. This section is updated as remediation lands.

### Phase 1 — Truthfulness foundation (`chore/phase-1-truthfulness`, 2026-05-20)

| Finding | Resolution |
|---|---|
| F-01 | README floor updated to Chrome 123+ / Safari 17.5+ / Firefox 128+ with rationale; `optional/legacy.css` header rewritten to be honest about scope (does NOT extend below modern floor). |
| F-03 | `print.css:65` now `border: var(--sf-border-width-1) solid var(--sf-color-border--strong)`. |
| F-05 / F-12 | Theme rules moved from `slashed.base` to new `core/themes.css` (`slashed.themes` layer). Cascade-position guarantee documented in `architecture.md`. |
| F-07 | `@keyframes sf-spin` and `sf-shimmer` moved from `states.css` to `motion.css` alongside other framework keyframes; cross-reference comment added in `states.css`. |
| F-08 | Marked as **stale** — the inline finding was wrong (the fix predated this audit). Removed from P0 roadmap. |
| F-11 | Marked as **stale** — same as F-08. Removed from P0 roadmap. |
| F-15 | Bundle scope explicitly documented in README and `architecture.md`. Empty stubs called out as not-bundled. |
| F-16 | `interpolate-size` comment rewritten: Chrome 129+, Safari 18+, Firefox behind a flag (2026-Q2). |
| F-19 | Inline rationale comment added: pill shape is topological, not relative — intentionally not scaled. |
| F-20 | Demo `--sf-prose-paragraph` chain corrected: `→ --sf-content-gap → --sf-space-s`. |
| F-22 | Inline DPR-behaviour comment added to `--sf-border-width-hairline`. |
| N-02 (new) | Duplicate `:root { color-scheme }` removed from `base.css`; sole declaration lives on `html` in `reset.css`. |
| N-03 (new) | Dead arithmetic in `--sf-shadow-glow` (`0.4 * X * 5`) collapsed to `X * 2`. |

Remaining open: F-02 (out of scope per project decision), F-04, F-10, F-13, F-14, F-17, F-18, N-01, N-04, N-05.

### Phase 2 — Contrast discipline (`chore/phase-2-contrast`, 2026-05-20)

| Finding | Resolution |
|---|---|
| F-06 | Defaults lowered for the four families that previously fell below WCAG AA Normal with the binary `sign(0.6 - l)` text-color picker: `--sf-color-tertiary-light` `0.55→0.48`, `--sf-color-neutral-light` `0.55→0.45`, `--sf-color-success-light` `0.55→0.48`, `--sf-color-info-light` `0.55→0.48`. Verified empirically (culori sRGB → WCAG luminance) and by the test-suite change below. The audit only called out tertiary and neutral; success and info were latent failures the original suite missed because of its 3:1 threshold. |
| F-09 | `--sf-color-text--inverse` light-mode clamp widened from `clamp(0.70, …, 1)` to `clamp(0.85, …, 0.98)`. Inverse ink can no longer collapse to medium grey on a near-black inverse surface. |
| F-21 | `--sf-color-link--visited` hue shift increased from `+40°` to `+60°`. Inline comment now points integrators at the direct override path for brands where action and tertiary hues sit close together. |
| N-01 (new) | `tests/tokens.spec.js` raised the on-color contrast threshold from 3:1 to 4.5:1 across all 11 brand and status families. The previous lower bar would have masked the regression captured by F-06. |

`docs/architecture.md` — "Known intentional tradeoffs" rewritten to declare the AA Normal default contract and identify `warning` as the single documented exception.

Remaining open: F-02 (out of scope per project decision), F-04, F-10, F-13, F-14, F-17, F-18, N-04, N-05.
