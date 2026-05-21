# SLASHED — Production Readiness Checklist v3

> Generated: 2026-05-21
> Framework version: 0.1.0
> Target: v1.0 release
> Supersedes: `audits/completion-checklist-v2.md`

This is the **implementation-ready** edition. v2 was an inventory; v3 records
the **decisions** taken after auditing the checklist against source, gives the
**exact change** for each accepted item, lists what we **deliberately reject**,
and lays out the **road to perfection**. Nothing here has been implemented yet —
this document IS the instruction to implement.

---

## What changed since v2

v2 was verified line-by-line against the source. It was accurate on most
falsifiable claims, but had a blind spot and a few errors, all corrected here:

1. **Existing tooling was not credited.** The repo already ships `stylelint`
   (with enforced `--sf-*` custom-property and `sf-*` keyframe naming),
   a CI workflow (`.github/workflows/ci.yml` → lint + build + test),
   `release.yml`, `commitlint`, and git hooks (`.githooks/`). v2's Build (50%)
   and infra scores were too harsh. Re-scored in §E.
2. **The three stub files were never inventoried.** `optional/components.css`,
   `optional/utilities.css`, `optional/tokens.components.css` exist as empty
   `/* TODO */` stubs. Now listed (§C.16).
3. **`slashed.forms` layer confirmed.** `core/layers.css` has **14** layers
   including `slashed.forms` (between `base` and `layout`). v2 §14.4 correctly
   flagged that `docs/architecture.md` is missing it — but **`README.md` is
   missing it too** (layer-order line + quick-start wiring). Both need fixing.
4. **v2 footer was inaccurate** — it claimed analysis of "all optional/*.css"
   but skipped the three stubs.

Everything else in v2's inventory stands and is carried forward, corrected,
into §C.

---

## How to read this document

**Status:** ✓ done · 🟡 partial · ✗ missing · ⚠ cleanup · ◆ **DECIDED** (instruction in §A)

**Priority:** CRITICAL · HIGH · MEDIUM · LOW

**Decision tag:** `[D#]` links a checklist row to its full instruction in §A.

---

## §A — Decision Log (ready to implement)

Each decision is final. The "Change" block is the exact edit to make.
None are implemented yet.

### D1 — Base layer is UNIVERSAL, not opinionated

**Decision.** The `base` layer stays a minimal, readable foundation for flow and
inline text. It will **not** grow into a Pico-style classless UI kit.

**Rationale.** SLASHED is **BEM-first**: the token API is the product and
consumers build components on top of it. A fully opinionated classless base
serves a different user and contradicts that identity. This *resolves* — rather
than fixes — most of v2's "Base" gaps: `dialog`, `details/summary`, `progress`
are **widgets** (consumer/component territory); `table`, `blockquote`, `figure`,
`dl` already get opinionated styling **inside `.sf-prose`**.

**Scope rule (the line to hold):**
- Global base styles: flow/inline text for readability — headings, `p`, `a`,
  `code`, `pre`, `mark`, `hr`, `sub/sup`, `abbr`, `::selection`, etc. (current).
- Rich blocks (`table`, `blockquote`, `figure`, `dl`): **only inside `.sf-prose`**.
- Interactive widgets (`dialog`, `details`, `progress`, `meter`): consumer BEM
  (future `components` layer). Reset-level normalization only in `core`.
- Native form controls: opt-in `optional/forms.css` (see D5).

**Change (documentation only — no new CSS):**
- README: add a "Scope of the base layer" section stating the rule above; soften
  any "classless-friendly" wording to "readable semantic defaults".
- `docs/architecture.md`: expand the **slashed.base** description with the scope
  rule and the prose-vs-base-vs-component split.
- Fix the current inconsistency in framing: blockquote/table/figure being styled
  *only* in `.sf-prose` is now the **documented intent**, not an omission.

**Supersedes v2 rows:** Base `blockquote/details/dialog/dl/figure/progress/meter/table`
(global) — reclassified from "missing HIGH/MEDIUM" to **out-of-scope by design**.

---

### D2 — Wire base "behaviour tokens" (stop declaring tokens the base ignores)

**Decision.** Tokens whose names advertise control over the base's own rendering
must actually drive it. Replace the hardcodes in `core/base.css` with the tokens.
(This is distinct from the BEM consumer-API tokens — `--sf-shadow-*`, `--sf-gap`,
etc. — which are *correctly* unconsumed and stay as-is.)

**Tokens affected:** `--sf-h1-font-weight`..`--sf-h6-font-weight`,
`--sf-heading-text-wrap`, `--sf-body-text-wrap`, `--sf-body-strong-weight`,
`--sf-body-em-style`.

**⚠ Regression guard.** `--sf-body-strong-weight` currently defaults to
`var(--sf-font-weight-heading)` = **semibold (600)**, but the base hardcodes
`b, strong` at `--sf-font-weight-bold` = **700**. Naively wiring the token would
silently downweight every `<strong>`. **Fix the token default to bold first.**

**Change — `core/tokens.css`:**
```css
/* was: var(--sf-font-weight-heading) */
--sf-body-strong-weight: var(--sf-font-weight-bold);
```

**Change — `core/base.css`:**
```css
h1, h2, h3, h4, h5, h6 {
  font-family:       var(--sf-heading-font-family, var(--sf-font-heading));
  line-height:       var(--sf-leading-tight);
  color:             var(--sf-heading-color, var(--sf-color-heading));
  text-wrap:         var(--sf-heading-text-wrap);   /* was: balance */
  overflow-wrap:     break-word;
  text-rendering:    optimizelegibility;
  scroll-margin-top: calc(var(--sf-header-height, 3.5rem) + var(--sf-space-m));
}
/* add font-weight per heading; remove the shared font-weight line above */
h1 { font-size: var(--sf-h1-size); line-height: var(--sf-h1-line-height); font-weight: var(--sf-h1-font-weight); letter-spacing: var(--sf-h1-letter-spacing); }
/* …h2–h6 identically… */

p      { text-wrap: var(--sf-body-text-wrap); /* was: pretty */ … }
b, strong { font-weight: var(--sf-body-strong-weight); }
em        { font-style: var(--sf-body-em-style); }   /* new rule — no em rule exists today */
```

**Verify:** all defaults reproduce current rendering (weights unchanged at 600
for headings / 700 for strong; text-wrap balance/pretty unchanged; `em` italic
matches UA). No visual diff expected → `tests/demo-visual.spec.js` snapshots stable.

---

### D3 — Implement `--sf-contrast-bias` (kill the dead token by making it real)

**Decision.** `--sf-contrast-bias` is declared `0` and consumed nowhere. Rather
than delete it, implement it as a genuine **global text-contrast knob** — a
single value that nudges derived reading-text colours toward the extremes
(darker in light mode, lighter in dark mode). This is on-brand: token-driven,
deterministic, zero new selectors.

**Change — `core/tokens.css`** (fold into the three reading-text formulas;
default `0` ⇒ identical output ⇒ safe for contrast tests):
```css
--sf-color-text: light-dark(
  oklch(from var(--sf-color-neutral-light) clamp(0.05, calc(l - 0.4  - var(--sf-contrast-bias)), 0.35) c h),
  oklch(from var(--sf-color-neutral)       clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1)    c h)
);
--sf-color-text--secondary: light-dark(
  oklch(from var(--sf-color-neutral-light) clamp(0.15, calc(l - 0.25 - var(--sf-contrast-bias)), 0.45) c h),
  oklch(from var(--sf-color-neutral)       clamp(0.55, calc(l + 0.1  + var(--sf-contrast-bias)), 0.90) c h)
);
--sf-color-heading: /* same pattern as --sf-color-text */ ;
```
Update the `--sf-contrast-bias` declaration comment to document the knob
(positive = more contrast). Mention it in the theming/a11y docs.

---

### D4 — Consume `--sf-print-base-size`

**Decision.** Token declared, never used. Wire it.

**Change — `core/print.css`** (inside `@media print`, after `@page`):
```css
body { font-size: var(--sf-print-base-size); }
```

---

### D5 — Forms stays OPTIONAL; fix its broken distribution + docs

**Decision.** Forms styling is opinionated, so `optional/forms.css` correctly
lives outside the universal base as opt-in (consistent with D1). The real defect
is **distribution**: `forms.css` has its own `slashed.forms` cascade layer but
ships in **no** bundle and is undocumented in README + architecture. Fix by
introducing a tiered bundle scheme and documenting the layer.

**Bundle scheme (names WIP — confirm before release):**

| Bundle | Contents |
|--------|----------|
| `essential` | all `core/` |
| `optimal` | essential + `tokens.palette` + `forms` + `legacy` |
| `optimal-components` | optimal + `tokens.components` + `components` |
| `optimal-utilities` | optimal + `utilities` |
| `full` | optimal + `tokens.components` + `components` + `utilities` |

Also support à-la-carte: `essential` (or raw `core/`) + hand-picked optionals.

**Change:**
- `bundle.config.json`: add the four new bundles (legacy always emitted last).
- `package.json` `exports`: add `./optimal`, `./optimal-components`,
  `./optimal-utilities`, `./full` subpaths.
- `README.md`: add `slashed.forms` to the layer-order line; add `forms.css` to
  the optional wiring with a note; replace the 2-row bundle table with the 5-row
  table; correct the "stubs not bundled" note (they now ship in `*-components`/
  `*-utilities`/`full`, no-op until populated).
- `docs/architecture.md`: add `slashed.forms` to the `@layer` block, the
  specificity ladder, the file-structure tree, and add a **slashed.forms** layer
  description. Rewrite the Bundle configuration section for the 5 bundles.

**Note.** Because every rule is in an `@layer` block, physical concatenation
order in a bundle does not affect the cascade — `core/layers.css` fixes order.

---

### D6 — Integrate states with forms (`--sf-field-border-color`)

**Decision.** `core/states.css` sets `--sf-field-border-color` on `.is-valid /
.is-invalid / .is-error / .is-warning / .is-success / .is-info / .is-danger`,
but `forms.css` never reads it, so validation states silently don't recolour
native inputs. Wire it.

**Change — `optional/forms.css`** (shared text-input/select/textarea rule):
```css
border: var(--sf-border-width-1) solid var(--sf-field-border-color, var(--sf-color-border));
```
Document the integration in the forms.css header (TOKENS CONSUMED + a STATE
INTEGRATION note).

---

### D7 — Fix the primary-button `:hover` bug (at the source)

**Decision.** Confirmed bug. `optional/forms.css` button `:hover` swaps the fill
to `--sf-color-bg--hover` (an 8 %-opacity neutral tint meant for *surface* hover,
defined at `tokens.css` as `oklch(from var(--sf-color-neutral) l c h / 0.08)`)
and flips text to `--sf-color-text`. A solid action button thus turns into a
faint grey button with dark text on hover — jarring, and a possible contrast
regression. There is no `--sf-color-action--hover` token.

**Change — `optional/forms.css`** (button/submit/reset/button-input `:hover`):
```css
background-color: oklch(from var(--sf-color-action) calc(l - 0.05) c h);
/* drop the `color: var(--sf-color-text)` override — keep --sf-color-text--on-action */
```

---

### D8 — Required-field asterisk in forms (classless)

**Decision.** Keep `forms.css` purely classless and element-level. The required
asterisk fits because it needs no markup convention (`:has()` + `:required`).
(Switch toggle and helper/error text do NOT — see D9.)

**Change — `optional/forms.css`:**
```css
label:has(:required)::after,      /* <label>Name <input required></label> */
label:has(+ :required)::after {   /* <label>Name</label><input required>  */
  content: var(--sf-field-required-marker, " *");
  color: var(--sf-color-error);
}
```

---

### D9 — Deliberate rejections (do NOT do, with rationale)

These appear in v2 / benchmark parity but are rejected to protect the philosophy
and current scope:

| Item | v2 ref | Why rejected |
|------|--------|--------------|
| `.sf-pulse`, `.sf-bounce`, `.sf-stagger`, standalone `.sf-spin` classes | Motion 8.1/8.2 | Animation **utility classes** = utility-first drift, which the framework explicitly rejects. Utilities + components are a future *optional* layer — not now. Keyframes-as-tokens stays (the `sf-spin`/`sf-shimmer` keyframes remain, used by `.is-loading`/`.is-skeleton`). |
| `--sf-color-accent` (7th brand) | Tokens 1.1 | `action` already covers this and is the better choice. A 7th brand slot dilutes the headline "rebrand in 6 tokens". |
| Switch toggle | Forms | Needs markup/role convention → **component** territory (deferred layer). |
| Helper / error text below input | Forms | Needs structural convention → **component/utility** territory. |
| Color partials (H/S/L split) | Tokens 1.1 | oklch + relative color syntax makes this unnecessary (already rejected in v2). |
| 30 numbered gradient tokens, 5-per-easing variants | Tokens 1.6 | Decorative bloat; one set suffices. |
| Pre-compiled themes (Pico's 20) | Themes | 6-token override makes them unnecessary. |

**Note on `.sf-spin` standalone:** v2 marked it HIGH. Reclassified to **defer to
the future utilities layer** — it is a utility class, and we are not shipping
utilities yet.

---

### D10 — Infrastructure (accepted; separate workstream, needs a dependency)

**Decision.** Accepted in principle but kept out of the "free, philosophy-pure"
batch because they add a build dependency / CI surface. Schedule for v0.3.

- **Minified bundles** (`.min.css`) + **source maps** via `lightningcss`
  (CRITICAL/HIGH). Philosophy-safe: "no build step" applies to the *consumer*; a
  Node bundler already exists for maintainers.
- **Cross-browser CI**: add Firefox + WebKit to `playwright.config.js` (currently
  Chromium-only) — important precisely because the framework leans on
  bleeding-edge CSS (`oklch` relative color, `@property`, `light-dark()`).

---

## §B — Verification results (what was checked against source)

| Claim (from v2) | Verdict |
|---|---|
| `--sf-print-base-size` declared, never consumed | ✓ confirmed (`tokens.css`) → D4 |
| `textarea { resize: vertical }` duplicated in reset.css + forms.css | ✓ confirmed → cleanup |
| 14 layers incl. `slashed.forms` (between base & layout) | ✓ confirmed (`layers.css:9`) |
| `architecture.md` layer order outdated (no forms) | ✓ confirmed → D5 |
| `README.md` layer order also missing forms | ✓ **newly found** → D5 |
| Per-heading weights / text-wrap / em tokens unconsumed | ✓ confirmed → D2 |
| `sf-spin` keyframe-only (no class) | ✓ confirmed → D9 (keep as-is) |
| No `.sr-only-focusable` | ✓ confirmed → §C.9 |
| forms.css doesn't consume `--sf-field-border-color` | ✓ confirmed → D6 |
| No minification / forms in no bundle | ✓ confirmed → D10 / D5 |
| Button `:hover` misuses surface-hover token | ✓ confirmed bug → D7 |
| stylelint + CI + commitlint + hooks exist | ✓ **newly credited** → §E |
| 3 stub files exist (empty) | ✓ **newly inventoried** → §C.16 |

---

## §C — Outstanding items (complete carryover from v2)

Every **not-done** item from v2 is reproduced here — all priorities, including
LOW. Completed (✓) rows from v2 are intentionally omitted (this is the to-do
list). Status: ✗ missing · 🟡 partial · ⚠ cleanup. `[D#]` links to §A.
Rejected-on-purpose items live in §D9, not here.

### 1. Tokens

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `--sf-h1..h6-font-weight`, `--sf-heading-text-wrap`, `--sf-body-text-wrap`, `--sf-body-strong-weight`, `--sf-body-em-style` | 🟡 | HIGH | Wire in base **[D2]** |
| `--sf-contrast-bias` | 🟡 | MEDIUM | Implement as global text-contrast knob **[D3]** |
| `--sf-divider-width / -style / -color` | ✗ | HIGH | ACSS-style global divider system |
| `--sf-mask-scrim-start / -end` (mask/edge-fade) | ✗ | MEDIUM | Reel/scroll edge fades |
| `--sf-animation-delay-1..5` | ✗ | MEDIUM | Stagger tokens (token only; `.sf-stagger` class rejected — §D9) |
| `--sf-color-code-text` | 🟡 | LOW | Declared as fallback in base.css; add to tokens.css for discoverability |
| `--sf-text-decoration-thickness` | ✗ | LOW | Link/underline customisation (defer to utilities) |
| `--sf-line-clamp` | ✗ | LOW | Utility concern (defer to utilities) |
| `--sf-content-min-width` (fluid baseline) | ✗ | LOW | Not needed — `--sf-container-narrow` + 320px min body serves the same purpose |
| Status colours in palette (numeric scale) | ✗ | LOW | Status already have subtle/strong/muted in core; full numeric expansion not needed |

### 2. Reset

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `textarea { resize: vertical }` duplicated in forms.css | ⚠ | LOW | Remove from forms.css (reset owns it) |
| `::file-selector-button { appearance: button }` | ✗ | LOW | Only `font:inherit` set today; add for consistency |
| `<search>` element reset | 🟡 | LOW | Semantic only; optional `display:block` for older engines |

### 3. Base

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| Behaviour-token wiring (per-heading weights, text-wrap, strong, em) | 🟡 | HIGH | **[D2]** |
| blockquote (global) | ✗ | HIGH | **Out of scope by design [D1]** — styled inside `.sf-prose` |
| details/summary (global) | ✗ | HIGH | **Out of scope by design [D1]** — widget → consumer BEM |
| dialog (global) | ✗ | HIGH | **Out of scope by design [D1]** — widget → consumer BEM |
| table/thead/tbody/td/th (global) | ✗ | MEDIUM | **Out of scope by design [D1]** — styled inside `.sf-prose` |
| progress (global) | ✗ | MEDIUM | **Out of scope by design [D1]** — widget → consumer BEM |
| figure/figcaption (global) | ✗ | MEDIUM | **Out of scope by design [D1]** — styled inside `.sf-prose` |
| dl/dt/dd (global) | ✗ | MEDIUM | **Out of scope by design [D1]** |
| meter (global) | ✗ | LOW | **Out of scope by design [D1]** — complex cross-browser; widget |

### 4. Forms (optional)

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `.is-*` integration (consume `--sf-field-border-color`) | 🟡 | HIGH | **[D6]** |
| Button `:hover` bug | 🟡 | HIGH | Misuses surface-hover token — fix **[D7]** |
| `input[type="file"]` (`::file-selector-button`) | ✗ | HIGH | Button-like appearance |
| `input[type="range"]` (track + thumb, webkit + moz) | ✗ | HIGH | Slider styling |
| Select arrow cross-browser | 🟡 | MEDIUM | SVG `stroke="currentColor"` may not inherit in all engines; test FF/Safari, consider `mask-image` |
| Form group pattern (label + input + helper spacing) | ✗ | MEDIUM | Structural spacing; partly component territory |
| Helper / error text below input | ✗ | MEDIUM | **Deferred → components/utilities [D9]** |
| Switch (`checkbox[role="switch"]`) | ✗ | MEDIUM | **Deferred → components [D9]** |
| Required asterisk indicator | ✗ | LOW | Classless `:has()` — **add [D8]** |
| `textarea resize` duplication | ⚠ | LOW | Remove from forms.css |

### 5. Layout

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `.sf-divider` / `.sf-separator` class | ✗ | HIGH | Pairs with `--sf-divider-*` tokens (§C.1) |
| Icon sizing primitive (`.sf-icon`) | ✗ | LOW | `--sf-icon-*` tokens exist; class is a utility concern |
| `.sf-grid--dense` (dense flow on regular grids) | 🟡 | LOW | Only on `.sf-bento` today |

### 6. States

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `.is-error` vs `.is-invalid` — document semantics | ✗ | HIGH | Generic component state vs form-field validation |
| `.is-danger` vs `.is-error` — document semantics | ✗ | HIGH | Destructive-action context vs validation feedback |
| `.is-focused` (programmatic focus) | ✗ | MEDIUM | JS-driven focus without `:focus-visible` |
| `.focus-parent` (parent on child focus) | ✗ | MEDIUM | `:has(:focus-visible)` / `:focus-within` |
| `.is-open` vs `.is-expanded` — document semantics | ✗ | MEDIUM | Disclosure vs accordion |
| `.is-valid` vs `.is-success` — document semantics | ✗ | MEDIUM | Form-specific vs general positive |
| `.is-pressed` (aria-pressed) | ✗ | LOW | Toggle buttons |
| `.is-pending` (async, ≠ loading) | ✗ | LOW | Optimistic UI |
| `.is-fullscreen` | ✗ | LOW | Consider vs native `:fullscreen` |
| `.is-resizable` | ✗ | LOW | `resize: both` — niche |

### 7. Themes

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| Example branded theme file | ✗ | HIGH | Adoption-critical |
| Theme transition (view-transition on toggle) | ✗ | MEDIUM | Opt-in class/token |
| Multi-brand theming documentation | ✗ | MEDIUM | Architecture allows it; document |
| High-contrast theme variant | ✗ | LOW | `prefers-contrast:more` adjusts ring only; full override acceptable to skip (see also `--sf-contrast-bias` [D3]) |

### 8. Motion

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `sf-ping` keyframe (notification pulse) | ✗ | MEDIUM | Badges/notifications |
| `--sf-delay-1..5` animation-delay tokens | ✗ | MEDIUM | Stagger (tokens only) |
| `sf-blink` keyframe (cursor blink) | ✗ | LOW | Niche |
| `sf-float` keyframe (gentle float) | ✗ | LOW | Decorative |
| Scroll-driven animation utility classes | ✗ | LOW | Tokens exist; classes deferred to utilities |
| `@starting-style` readiness (entry animations) | 🟡 | LOW | Document as future enhancement |
| `.sf-spin` / `.sf-pulse` / `.sf-bounce` / `.sf-stagger` classes | — | — | **Rejected / deferred to utilities [D9]** |

### 9. Accessibility

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `.sr-only-focusable` | ✗ | HIGH | Skip-link alternatives / focus-trap exits |
| Forced-colors form-element borders | 🟡 | MEDIUM | Inputs lose visible borders in forced-colors |
| `.no-motion` (manual override, not OS) | ✗ | MEDIUM | Per-element motion suppression |
| `prefers-reduced-data` (`@supports`) | ✗ | LOW | Draft spec; speculative |
| ARIA live-region considerations | ✗ | LOW | CSS-only can't address; document as consumer responsibility |

### 10. Print

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| Consume `--sf-print-base-size` | ✗ | HIGH | **[D4]** |
| `.print-only` class | ✗ | MEDIUM | `display:none` normally, `block` in print |
| `.no-print` standalone documentation | 🟡 | LOW | Exists in hide-list; document explicitly |
| video/audio in hide-list | 🟡 | LOW | Blank boxes in print; add or document |
| `@page` named pages | ✗ | LOW | Advanced; defer to v1.x |
| `page-break-before` utility | ✗ | LOW | Utility concern; defer |

### 11. Legacy

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| Container query fallback | ✗ | LOW | Not needed — CQ is baseline 2023 within support floor |
| `@layer` fallback | ✗ | LOW | Not possible — layers are the foundational architecture |

### 12. Build & Distribution

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| Minified bundle (`.min.css`) | ✗ | CRITICAL | lightningcss/cssnano **[D10]** |
| Source maps (`.map`) | ✗ | HIGH | **[D10]** |
| forms.css not in any bundle | 🟡 | MEDIUM | Fixed by tiered bundle scheme **[D5]** |
| Lightning CSS integration | ✗ | MEDIUM | Minify + nesting + prefixes **[D10]** |
| Gzip/Brotli size reporting | ✗ | MEDIUM | Build-time report |
| Bundle size badge in README | ✗ | MEDIUM | shields.io / bundlephobia |
| Separate layers.css entry point | 🟡 | LOW | Document the import-first requirement for custom bundles |
| **Existing infra (credit)** | ✓ | — | stylelint (+ `^sf-`/`sf-*` enforcement), CI (lint+build+test), release.yml, commitlint, git hooks |

### 13. Tests

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| Cross-browser matrix (Firefox + WebKit) | ✗ | HIGH | Chromium-only today **[D10]** |
| axe-core a11y audit | ✗ | HIGH | `@axe-core/playwright` on demo/fixture |
| Container query breakpoint tests | ✗ | MEDIUM | Verify CQ triggers for grid-N/bento/alternate |
| States visual test (all 33 `.is-*`) | 🟡 | MEDIUM | Only some states covered today |
| Reduced-motion behavior test | ✗ | MEDIUM | Emulate `reduce`, assert 0.01ms |
| Performance / bundle-size regression | ✗ | MEDIUM | Threshold assert |
| Forced-colors rendering test | ✗ | LOW | Verify focus ring uses Highlight |

### 14. Documentation

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| `slashed.forms` layer + base scope rule documented | 🟡 | HIGH | **[D1, D5]** (README + architecture.md) |
| architecture.md layer order outdated (missing forms) | 🟡 | HIGH | **[D5]** |
| Theming guide (rebrand in 6 tokens) | ✗ | HIGH | Adoption-critical |
| Token reference table (all `--sf-*` + defaults) | ✗ | HIGH | Auto-generate from source |
| Layout primitives visual guide | ✗ | HIGH | Diagram per primitive |
| Browser support matrix (detailed) | ✗ | HIGH | Features × versions |
| State documentation (when to use each `.is-*`) | ✗ | HIGH | + ARIA mapping (ties to §C.6 overlaps) |
| Per-section theming examples | ✗ | MEDIUM | Nested `data-theme` |
| Dark-mode cookbook | ✗ | MEDIUM | Forced header, light card in dark, toggle JS |
| Performance considerations | ✗ | MEDIUM | oklch paint, `@property` cost, transition-all footgun |
| Contributing guide | ✗ | MEDIUM | For OSS contributors |
| tokens.palette.css missing in file-structure diagram | 🟡 | MEDIUM | Note it ships in the full/optimal bundles |
| Interactive state demos with descriptions | 🟡 | MEDIUM | States appear minimally in demo |
| Animation class visual demos (replay/before-after) | 🟡 | MEDIUM | Preset classes need comparison |
| Migration guide (Pico/Bulma → SLASHED) | ✗ | LOW | Class/concept mapping |

### 15. Internal Consistency

| Item | Status | Priority | Decision / Note |
|------|--------|----------|-----------------|
| Behaviour tokens declared-not-consumed (body/heading/per-heading) | 🟡 | HIGH | **[D2]** |
| `--sf-print-base-size` declared-not-consumed | 🟡 | HIGH | **[D4]** |
| `--sf-contrast-bias` declared-not-consumed | 🟡 | MEDIUM | **[D3]** |
| BEM-API tokens unconsumed (`--sf-scrollbar-*`, `--sf-optical-sizing`, `--sf-shadow-*`, `--sf-blur-*`, `--sf-gap`, `--sf-gradient-*`) | 🟡 | LOW | **Correct by design** — document explicitly as consumer API (not a defect) |
| Colour naming: `-light/-dark` (source) vs `--variant` (modifier) | 🟡 | LOW | Document: single dash = source, double dash = modifier |
| Print class naming (`.no-print` vs `.print-no-color` vs `.print-color-exact`) | 🟡 | LOW | Consider standardising to `.print-*` |

### 16. Stub files (newly inventoried)
- `optional/components.css` — empty `slashed.components` stub.
- `optional/utilities.css` — empty `slashed.utilities` stub.
- `optional/tokens.components.css` — empty `slashed.tokens` stub (imported by components.css).
- Status: reserved for the future component/utility layer; ship only in
  `*-components` / `*-utilities` / `full` bundles **[D5]**; no-op until populated.

---

## §D — What we have in excess

| Item | Recommendation |
|------|----------------|
| `textarea { resize }` duplication | Remove from forms.css (reset owns it) |
| `--sf-transition-base` deprecated alias | Keep until v1.1, then remove (path documented) |
| `--sf-contrast-bias` | **No longer dead — implemented [D3]** |
| 3 optional system font stacks, font-features/variation/optical-sizing | Keep + document (zero-cost BEM API) |
| `.is-visible`, `.sf-cover--max` | Keep, document |

---

## §E — Re-scored summary

**Decisions do not change the score — only implementation does.** Every D1–D10
item remains outstanding in §C until it lands in the code. The re-scores below
reflect *only* two legitimate sources, neither of which is work done in this
review: **(a) scope reclassification** — items that are now out-of-scope (D1) or
deliberately rejected (D9) leave the gap count; and **(b) crediting pre-existing
tooling** that v2 under-counted (stylelint, CI, commitlint, hooks). Nothing that
was prototyped during this session counts as done.

| Layer | Score (v2 → v3) | Note |
|-------|------------------|------|
| Tokens (core) | 85% | divider system is the main HIGH gap (no re-score — decisions don't count) |
| Reset | 91% | minor cleanups |
| Base | 77% → **90%** | reclassification only: widgets are out-of-scope [D1] (no code written) |
| Forms | 67% | file/range/states/hover/asterisk all **outstanding** — decided ≠ done |
| Layout | 93% | divider class outstanding |
| States | 85% | overlaps need docs |
| Themes | 60% | example theme + docs are the gap |
| Motion | 61% → **68%** | reclassification only: utility classes rejected [D9], leave the gap count |
| Accessibility | 71% | sr-only-focusable HIGH |
| Print | 71% | print-base-size + print-only outstanding |
| Legacy | 100% | — |
| Build | 50% → **70%** | pre-existing stylelint/CI/commitlint/hooks credited (v2 under-counted) |
| Tests | 42% → **55%** | pre-existing CI run credited; cross-browser + axe outstanding |
| Documentation | 33% | the real v1.0 blocker |
| Internal Consistency | 50% → **55%** | only BEM-API-token reclassification credited; D2/D3/D4 token wiring still outstanding |

**Overall: 72% → ~76% production-ready** (uplift is reclassification + crediting
existing tooling, not implemented work).
- Core CSS: ~87%
- Optional modules: ~74%
- Infrastructure (build/test/docs): ~60% (docs is the gating item for v1.0)

---

## §F — Roadmap to perfection

### v0.2 — Foundation polish (free, philosophy-pure; do first)
1. **[D2]** Wire behaviour tokens in base (+ fix `--sf-body-strong-weight` default). XS
2. **[D3]** Implement `--sf-contrast-bias`. XS
3. **[D4]** Consume `--sf-print-base-size`. XS
4. **[D6]** Forms consume `--sf-field-border-color`. XS
5. **[D7]** Fix button `:hover` bug. XS
6. **[D8]** Required-asterisk in forms. XS
7. **[D5]** New bundle scheme + ship forms + document `slashed.forms`. S
8. **[D1]** Document the universal-base scope rule (README + architecture). S
9. Remove `textarea resize` duplication. XS
10. Add `--sf-divider-*` tokens + `.sf-divider` class. S
11. Add `.sr-only-focusable`. XS

### v0.3 — Build & test infrastructure
1. **[D10]** Minified bundles + source maps (lightningcss). S
2. **[D10]** Firefox + WebKit in CI. S
3. axe-core a11y test. S
4. Bundle-size reporting + threshold test. S
5. `input[type="file"]` + `input[type="range"]` in forms. M
6. forced-colors form-border fix; `.no-motion`; `.print-only`. XS each
7. `--sf-mask-scrim-*`, `--sf-animation-delay-*`, `sf-ping` keyframe (tokens/keyframes only). S

### v0.4 — Documentation sprint (the v1.0 gate)
1. Theming guide (rebrand in 6 tokens) + example branded theme file. M
2. Browser support matrix. S
3. Token reference table (auto-generated). M
4. Layout primitives visual guide. L
5. State documentation (+ the overlap semantics from §C.6). M
6. Dark-mode cookbook; performance notes; contributing guide. S each

### v1.0 — Release gate (all must be green)
- [ ] All CRITICAL + HIGH resolved (or explicitly deferred with rationale)
- [ ] Minified bundles + source maps shipping
- [ ] axe-core passing on demo.html
- [ ] CI green on Chromium + Firefox + WebKit
- [ ] Theming guide, browser-support matrix, token reference, state docs published
- [ ] `slashed.forms` + universal-base scope documented everywhere
- [ ] Every `--sf-*` token either consumed internally OR documented as BEM API
- [ ] Bundle size < 30 KB uncompressed AND < 25 KB gzipped (essential)
- [ ] No deprecated aliases without a removal timeline
- [ ] CHANGELOG complete since v0.1.0

---

*End of v3. Decisions D1–D10 are implementation-ready; §F is the execution order.
Generated from source analysis of all `core/*.css`, all `optional/*.css`
(including the three empty stubs), `tests/*.js`, `scripts/bundle.js`,
`bundle.config.json`, `package.json`, `.stylelintrc.json`,
`.github/workflows/*.yml`, and `docs/`.*
