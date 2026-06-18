# SLASHED Token Cleanup Proposal — v2 (decisions locked)

> **Purpose:** Reduce the *conceptual surface* of SLASHED's `--sf-*` token API for its real audience —
> people building **marketing sites, landing pages, and business/corporate websites**. Bytes are not
> the goal (gzip handles those); the goal is shrinking what an author must understand.
>
> **Decision rule:** keep a family if a landing-page / business-site builder would plausibly reach for
> it; trim or cut it if it's power-user or vestigial (they'd inline a value or use the base scale).
>
> This v2 reflects the decisions made on review. Items marked **CONFIRM** still need your sign-off on
> a naming/shape detail before implementation.

- **Current surface:** ~899 `--sf-*` tokens
- **Proposed removal:** ~213 tokens (~24%), +1 added (theme-transition knob)
- **Status:** all items CONFIRMED — ready to implement
- **Release:** single breaking change, `0.5.47 → 0.6.0`
- **Branch:** `claude/confident-maxwell-5dd0pa`

---

## Summary table

| # | Family | Location | Decision | Net change |
|---|---|---|---|---|
| 1 | Fluid-pair "bridge" matrix | `optional/tokens.sizes-extended.css` | **CUT ALL** | −~130 |
| 2 | Alpha color ramps | `optional/tokens.palette.css` | **TRIM → keep `a5/a10/a30/a50/a80`** | −~36 |
| 3 | Blur presets | `core/tokens.css` | **CUT scale, keep one `--sf-blur`** | −4 |
| 4 | Stroke presets | `core/tokens.css` | **CUT** | −4 |
| 5 | Multi-column presets | `core/tokens.css` | **CUT** | −6 |
| 6 | Numeric opacity scale | `core/tokens.css` | **CUT, keep `-disabled` + one default** | −5 |
| 7 | `truncate-suffix` | `core/tokens.macros.css` | **CUT** (can't wire portably) | −1 |
| 8 | Unused state flags | `core/tokens.css` | **CUT `is-pressed` + `is-open`** | −2 |
| 9 | Font-weights → hybrid | `core/tokens.css` | **Trimmed weights + roles; keep `light`** ✓ | −5 |
| 10 | Fluid custom slots | `core/tokens.css` | **CUT ALL** | −9 |
| Z | Z-index | `core/tokens.css` | **Semantic ladder (Bootstrap/Chakra style)** ✓ | −3 |
| T | Theme cross-fade helper | `core/themes.css` | **ADD `.sf-theme-transition` + duration knob** ✓ | +1 |
| — | Per-level heading max-width | `core/base.css` | **KEEP** | 0 |
| — | 7 scale knobs | `core/tokens.css` | **KEEP** (firm rec) | 0 |
| — | `:root` color / theming + fallbacks | `core/tokens.css`, `core/themes.css` | **KEEP** (ditching = risk, 0 surface gain) | 0 |
| — | Safe-area insets | `core/tokens.css` | **KEEP** | 0 |

> `~` counts (bridge matrix, alpha) confirmed against live files at implementation time.

---

## Confirmed cuts

### 1. Fluid-pair "bridge" matrix — **CUT ALL**
- `optional/tokens.sizes-extended.css` (gen `scripts/gen-sizes-extended.js`). The full combinatorial
  `--sf-{space,text}-*-to-*` set. Zero internal consumers.
- **Why:** authors use the base `--sf-space-*`/`--sf-text-*` scale (already fluid via `clamp()`). An
  N×N menu is pure concept bloat. Remove the whole family; update the generator to stop emitting it.
- **Migration:** custom fluid pair → write your own `clamp(min, …, max)`.

### 2. Alpha color ramps — **TRIM to 5 steps/family**
- `optional/tokens.palette.css` (+ generator). Keep `a5, a10, a30, a50, a80`; drop
  `a20, a40, a60, a70, a90, a95`. Re-point any functional alias (hover/active/subtle/muted/ghost)
  that targets a dropped step onto a kept step.
- **Migration:** intermediate steps via `oklch(from var(--sf-color-x) l c h / .NN)`.

### 3. Blur presets — **CUT scale, keep one default**
- `core/tokens.css:1172-1176`. Remove `--sf-blur-xs/s/m/l/xl`; **keep a single `--sf-blur`** (suggest
  `12px`) for frosted-nav/overlay use. Zero internal consumers today.
- **Migration:** other amounts → inline `blur(Npx)`.

### 4. Stroke presets — **CUT**
- `core/tokens.css:1348-1351`. Remove `--sf-stroke-thin/regular/bold/heavy`. Zero consumers; authors
  set SVG `stroke-width` directly or reuse `--sf-border-width-*`.

### 5. Multi-column presets — **CUT**
- `core/tokens.css:1366-1371`. Remove `--sf-col-width-s/m/l`, `--sf-col-rule-width-s/m/l`. Zero
  consumers; multi-column is unused in modern responsive marketing layout.

### 6. Numeric opacity scale — **CUT, keep disabled + one default**
- `core/tokens.css:1178-1183`. Remove `--sf-opacity-0/10/25/50/75/100`.
- **KEEP** `--sf-opacity-disabled` (`:482`, used by `core/states.css:44`, `optional/forms.css`,
  `core/accessibility.css:107`) **+ one general default** — suggest `--sf-opacity-muted: 0.6` for
  de-emphasized text/icons. (Confirm the default name/value.)

### 7. `truncate-suffix` — **CUT**
- `core/tokens.macros.css:45`. **Cannot be wired into `.sf-truncate` portably:** `text-overflow`
  accepts a string value only in Firefox; Chrome/Safari would break truncation. The `.sf-truncate`
  macro (`core/macros.css:100`) and `.is-truncated` (`core/states.css:281`) both hardcode
  `text-overflow: ellipsis`. Remove the token (and the doc reference at `core/tokens.css:147`).

### 8. Unused interaction-state flags — **CUT 2 of 5**
- `core/tokens.css:278-281`. Remove `--sf-is-pressed`, `--sf-is-open` (never set or read).
- **KEEP** `--sf-is-current` (`core/states.css:144`), `--sf-is-active` (`core/states.css:132`),
  `--sf-is-dark` (`:273`, theming flag).

### 10. Fluid custom slots — **CUT ALL**
- `core/tokens.css:328-360`. Remove `--sf-fluid-custom-{1,2,3}` + 6 `-min`/`-max` endpoints (9).
- **KEEP** shared engine knobs `--sf-fluid-min-vw` / `--sf-fluid-max-vw` (power the core scales).
- **Side tasks:** delete `tests/fluid-custom.spec.js`; fix `--sf-fluid-custom-1` ref in
  `configurator/tests/domains.test.js`; drop commented example in `optional/config-example.css`.

---

## Needs your CONFIRM

### 9. Font-weights → hybrid (trimmed weight names + semantic roles) — **REPLACE the ladder**
- Current (`core/tokens.css:924-941`): weight ladder `thin(100) … black(900)` (9) + semantic
  `body/heading/display` (3) + `--sf-current-font-weight`. **Only `normal/semibold/bold` are
  consumed**; `thin/extralight/light/medium/extrabold/black` are defined-but-unused.
- **Ecosystem:** Tailwind/Chakra ship the full weight ladder (authors think in weights); Bootstrap &
  GitHub Primer trim to `normal/medium/semibold/bold`; Material uses semantic type *roles*. Modern
  best practice = base (raw) → semantic (purpose) layers.
- **Proposal (hybrid — Primer base + Material roles):** keep a small recognizable weight base AND
  expose role aliases on top:

  ```css
  /* Base — trimmed weight names */
  --sf-font-weight-light:    300;   /* kept: common for elegant hero/display */
  --sf-font-weight-normal:   400;
  --sf-font-weight-medium:   500;   /* kept: common for buttons/labels */
  --sf-font-weight-semibold: 600;
  --sf-font-weight-bold:     700;
  /* Semantic roles */
  --sf-font-weight-body:        var(--sf-font-weight-normal);
  --sf-font-weight-heading:     var(--sf-font-weight-semibold);
  --sf-font-weight-display:     var(--sf-font-weight-bold);
  --sf-font-weight-interactive: var(--sf-font-weight-semibold);  /* buttons/badges/nav */
  --sf-font-weight-strong:      var(--sf-font-weight-bold);      /* <strong>/body-strong */
  --sf-current-font-weight:     var(--sf-font-weight-bold);      /* current nav (keep) */
  ```

- **Drop:** `thin(100)`, `extralight(200)`, `extrabold(800)`, `black(900)` — the rare extremes only.
- **Needing a thinner/heavier weight than the named set?** (a) inline `font-weight: 100`; or (b) the
  intended way — re-tune the role token globally, e.g. `:root { --sf-font-weight-body: 300 }`. Cutting
  a token never removes a capability; the role tokens are overridable.
- **Rewire:** button/badge specs + `--sf-h*-font-weight` (`-semibold`) → `-interactive`/`-heading`;
  `body-strong` + `is-current` (`-bold`) → `-strong`.
- Net 12 → 11, every token a recognizable weight or clear role. **CONFIRMED: hybrid, keep `light`.**

### Z. Z-index → semantic ladder matching Bootstrap/Chakra — **TRIM**
- Current (`core/tokens.css:1233-1246`): numeric ladder `below/base/raised/low/mid/high/top/max` +
  aliases `sticky/fixed/dropdown/toast/overlay` (aliases just point at ladder steps — redundant).
- **Ecosystem:** component frameworks (Bootstrap, Chakra, MUI, Primer) use **semantic component
  names**; utility frameworks (Tailwind `z-0..z-50`, Open Props `--layer-*`) use bare numbers.
  SLASHED ships components → semantic is the right convention.
- **Proposal (leaner Chakra; familiar names + gaps for insertion):**

  ```css
  --sf-z-below: -1;  --sf-z-base: 0;  --sf-z-raised: 1;
  --sf-z-sticky: 100;  --sf-z-fixed: 200;  --sf-z-dropdown: 300;
  --sf-z-overlay: 400; --sf-z-modal: 500;  --sf-z-toast: 600;  --sf-z-tooltip: 700;
  ```

- **Drop** the `low/mid/high/top/max` ladder; rewire `core/states.css` + `core/accessibility.css`
  (read `z-low`/`z-mid`/`z-max`) to the semantic names.
- Net 13 → 10, all use-case-named, convention every Bootstrap/Chakra user knows.
- **CONFIRMED: adopt the semantic set above.**

### T. Theme cross-fade helper — **ADD** (new, not a cut)
- The soft animated mode switch is enabled by the `@property syntax:"<color>"` regs but is opt-in
  (transitioning all colors permanently is a perf footgun). Ship a documented one-class helper so it's
  trivial to turn on:
  ```css
  /* core/themes.css */
  --sf-theme-transition-duration: 300ms;   /* the knob */
  .sf-theme-transition, .sf-theme-transition * {
    transition: background-color var(--sf-theme-transition-duration) var(--sf-ease-standard),
                color            var(--sf-theme-transition-duration) var(--sf-ease-standard),
                border-color     var(--sf-theme-transition-duration) var(--sf-ease-standard),
                fill             var(--sf-theme-transition-duration) var(--sf-ease-standard);
  }
  ```
- Apply `.sf-theme-transition` on `<html>` (or a subtree) to get a cross-fade when `[data-theme]`
  flips; `--sf-theme-transition-duration` is the author knob. Respects `prefers-reduced-motion` via
  the existing motion guards. Adds 1 token (+1 class). **CONFIRMED: add.**
- *Exact transitioned-property list and reduced-motion gating finalized during implementation; verify
  against the existing example in `optional/theme-example.css`.*

---

## KEEP — re-judged useful (no change)

- **Per-level heading max-width** (`--sf-h1..h6-max-width`, applied `core/base.css`): readability
  control, cheap, occasionally wanted per level.
- **7 scale knobs** (`--sf-{space,text,text-display,radius,motion,section,border}-scale`): default `1`
  (invisible to authors who ignore them); power the configurator + 6 presets + ~50 tests. **Firm keep.**
- **All `:root` color / theming blocks + `@property` regs + fallbacks** (`core/tokens.css` `@property`
  color regs @ 241-251, light-dark @ ~498, fallback ~256-268; `core/themes.css` derivations +
  `[data-theme]` @ 163-295). **Keep — load-bearing for the override + animation model:**
  - **Override model already works:** users set the **6 source `-light` tokens**; dark is auto-derived
    (`themes.css:167-177`) and `[data-theme]` re-derives bg/text/borders/links for section cascade
    (`themes.css:181-293` + `:where([data-theme])` @ `:60`).
  - **`@property initial-value` MUST be hardcoded** (spec: computationally independent, no `var()`);
    the variable-driven values live in the `:root`/`[data-theme]` *declarations*. Both are needed.
  - **The `@property syntax:"<color>"` registration is what enables the soft animated mode switch** —
    unregistered custom props flip instantly and can't transition. Cutting it would break the
    requested fade. (Transition is opt-in to avoid the global-transition perf footgun;
    `themes.css:29-33`, example in `optional/theme-example.css`.)
  - Ditching the fallback `:root` blocks removes **zero** token names (same names as modern path) →
    no concept gain, only lost old-browser support. Not worth it.
  - *Optional small addition (not a cut):* ship the opt-in cross-fade as a documented one-class helper
    (e.g. `.sf-theme-transition` on `<html>`) so the soft switch is easy to enable.
- **Safe-area insets** (`--sf-safe-top/bottom/left/right` = `env(safe-area-inset-*, 0px)`,
  `core/tokens.css:1333`): author-facing convenience for sticky headers / bottom CTAs on notched
  mobile (needs `viewport-fit=cover`). Real mobile need. **Keep.** (Note: comment claims internal
  consumption but there is none — purely author-facing.)

---

## Implementation pipeline (per cut)
1. Edit token file(s); update generators (`scripts/gen-sizes-extended.js`, palette generator) for
   generated families.
2. Rewire the few internal consumers for the **font-weight** and **z-index** changes (the only cuts
   touching core rules): `core/states.css`, `core/accessibility.css`, `core/base.css`,
   `optional/tokens.components.css`. All other cuts target zero-consumer families — grep to confirm
   before deleting.
3. Regenerate: `npm run build` + `npm run docs`.
4. Regenerate/accept `tests/token-api.snapshot.json` (deliberate-breakage gate).
5. Update consequential tests: `tests/color-semantic.spec.js`, `tests/tokens.spec.js`, delete
   `tests/fluid-custom.spec.js`, fix `configurator/tests/domains.test.js`.
6. CHANGELOG `## [0.6.0]` ⚠️ Breaking Changes + `docs/migration.md` upgrade table.

## Verification
1. `npm run lint:css`
2. `npm run build` (token count drops in size report)
3. `node --test tests/tier1-*.test.js tests/api-index-sync.test.js`
4. `npx playwright test` — green in **both light and dark** (theming guard)
5. **Author-experience smoke check** — configurator + a sample `docs/` landing page: nav/sticky/modal
   z-index, headings, buttons (interactive weight), disabled-form opacity, light/dark all correct.
6. **Surface re-count:** `grep -rhoE -- "--sf-[a-z0-9-]+\s*:"` → expect ~899 → ~685.
