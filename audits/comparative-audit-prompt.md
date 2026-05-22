# SLASHED — Comparative Gap Audit Prompt (v2)

> **Purpose:** Feed this prompt to a Senior CSS Architect agent (or LLM with web-search capability) to produce a definitive gap analysis of the SLASHED framework against four reference frameworks.
>
> **Date authored:** 2026-05-22  
> **SLASHED version under audit:** 0.2.10  
> **Prerequisite:** The agent must have full read access to the SLASHED repository and internet access for benchmark documentation.

---

## 1. Role & Constraints

You are a **Senior CSS Architect** specializing in:
- Modern CSS without build steps (cascade layers, `@property`, `oklch`, `light-dark()`, relative color syntax, container queries, `@starting-style`, anchor positioning, `sign()`, `color-mix()`, scroll-driven animations, `:has()`)
- Design-token architectures and BEM methodology
- WCAG 2.2 AA/AAA compliance mechanics

**Hard rules:**
- Every claim about SLASHED requires a **file path + line number**.
- Every claim about a benchmark requires a **documentation URL**.
- No hallucinated versions. Mark unverified claims `[unverified]`.
- Max 3 lines of code per citation. Longer → paraphrase.
- No marketing language. No "could potentially" — either a concrete, actionable recommendation or nothing.
- `critical` severity = breaks public API or accessibility. Aesthetic = `nit`/`low`.
- Never recommend migrating to a build step (Sass/PostCSS/Node pipeline). SLASHED is no-build by contract. If a recommendation would violate this, flag it explicitly and justify why it's worth the tradeoff.
- SLASHED is **BEM-first** — its token API is the product; consumers build components. Do NOT expect utility-class parity with Tailwind. The absence of `.text-lg` or `.flex` is out-of-scope, not a gap.

---

## 2. SLASHED — What You're Auditing

### 2.1 Architecture summary (verified from source)

| Aspect | Implementation |
|--------|---------------|
| Philosophy | No-build, cascade-layer-first, BEM-first, tokens-as-product |
| Layers (14) | `tokens → reset → base → forms → layout → components → utilities → states → themes → motion → accessibility → print → legacy → overrides` |
| Color system | oklch source tokens (6 brand + 5 status), 12 `@property` registrations (6 brand-light + 5 status-light + `--sf-is-dark`), `light-dark()` resolved, relative color syntax for dark auto-derivation |
| Dark mode | `prefers-color-scheme` + `[data-theme="light|dark"]` on any element, `--sf-is-dark` flag |
| Typography | Fluid `clamp()` scale (2xs–4xl + display s/m/l), system font stacks, weight scale (100–900 + semantic aliases) |
| Spacing | Fluid `clamp()` scale (2xs–4xl) × `--sf-space-scale` multiplier |
| Layout primitives | stack, box, center, cluster, sidebar, switcher, grid (auto-fill + fixed-col + ratio), bento, content-grid, cover, frame, reel, imposter, alternate, pancake, subgrid, prose, section, divider, icon, container |
| Container queries | `.sf-container` declares `sf-layout / inline-size`; `.sf-alternate` declares own named CQ; `.sf-bento`, `.sf-grid-*` use anonymous CQ |
| States | `.is-*` exclusive prefix (40 state classes), token-driven |
| Motion | `prefers-reduced-motion: no-preference` gating, 14 keyframes, view-transition support, animation preset tokens, stagger delay tokens |
| Accessibility | `:focus-visible` ring, `.sr-only` (clip-path: inset(50%)), `.skip-link`, forced-colors, prefers-contrast, prefers-reduced-transparency, touch targets (pointer:coarse), manual `.no-motion` class |
| Print | `@page` with tokens, link expansion, break-inside, `.print-only`/`.no-print`/`.print-color-exact`/`.print-no-color` |
| Forms | Optional classless styling (`optional/forms.css`) — inputs, select (custom chevron), button, checkbox/radio, range, file, fieldset, label with `:has(:required)` |
| Palette | Optional `tokens.palette.css` — 50–950 numeric scale + alpha variants + semantic aliases per brand color via `color-mix(in oklab)` |
| Legacy | `@supports not(...)` fallbacks for dvh, `:focus-visible`, `scrollbar-gutter` |
| Components | **Empty stub** — intentional; future layer |
| Utilities | **Empty stub** — intentional; BEM-first by design |
| Browser floor | Chrome 123+, Safari 17.5+, Firefox 128+ (April–July 2024) |
| Distribution | npm + CDN (unpkg/jsdelivr), 5 tiered bundles, lightningcss minification, subpath exports, zero runtime deps |

### 2.2 Known intentional tradeoffs (from `docs/architecture.md`)

1. **Binary text-on-color threshold** — `sign(0.6 - l)` picks black/white. Mid-luminance (L≈0.55–0.65) may not reach 4.5:1. Future: `contrast-color()`.
2. **Smooth scroll disabled on focus-within** — Andy Bell pattern; prevents keyboard hijack.
3. **V-shaped base palette ramp** — `base-600` can be lighter than `base-400`; surface-relative, not perceptual lightness.
4. **`@starting-style` and anchor positioning deferred** — waiting for components layer.
5. **No utility classes** — BEM-first; tokens ARE the API.

### 2.3 Files to read (complete list)

**Total framework source:** ~3,391 lines of CSS (core: 2,640 + optional: 751).

**Core (11 files, all required):**
```
core/layers.css              — @layer declaration (~19 lines)
core/tokens.css              — main token store (~851 lines)
core/tokens.layout.css       — layout-primitive tokens (~129 lines)
core/reset.css               — normalization (~119 lines)
core/base.css                — element defaults (~173 lines)
core/themes.css              — dark/light switching (~53 lines)
core/layout.css              — all .sf-* layout primitives (~499 lines)
core/states.css              — .is-* state classes (~331 lines)
core/motion.css              — keyframes + transitions (~114 lines)
core/accessibility.css       — a11y rules (~195 lines)
core/print.css               — @media print (~157 lines)
```

**Optional (7 files):**
```
optional/tokens.palette.css  — populated: 50-950 tint/shade scales (~278 lines)
optional/forms.css           — populated: classless form styling (~289 lines)
optional/legacy.css          — populated: @supports not fallbacks (~101 lines)
optional/theme-example.css   — example: 6-token rebrand (~54 lines)
optional/tokens.components.css — EMPTY STUB (~9 lines)
optional/components.css      — EMPTY STUB (~11 lines)
optional/utilities.css       — EMPTY STUB (~9 lines)
```

**Also read:**
```
docs/architecture.md         — declared design intentions
docs/demo.html               — what's actually demonstrated (~1832 lines)
README.md                    — public API promises
bundle.config.json           — bundle composition
audits/*                     — existing audits to cross-reference/verify
```

---

## 3. Benchmarks

| Framework | Version | Character | Why included |
|-----------|---------|-----------|--------------|
| **Pico CSS** | v2.x (latest) | Classless-first, semantic HTML, minimalist | Closest classless overlap with SLASHED's base/forms |
| **Automatic.css** | v4.x | Tokens-first, page-builder, fluid clamp, container queries | Closest token-system overlap |
| **Bulma** | v1.x | Class-based component framework | Measures component-layer gap |
| **Tailwind CSS** | v4 (latest stable) | Utility-first, atomic | Measures token parity + modern CSS adoption |

### Benchmark documentation (authoritative sources)

- Pico: https://picocss.com/docs
- Automatic.css: https://automaticcss.com/docs/
- Bulma: https://bulma.io/documentation/
- Tailwind: https://tailwindcss.com/docs

**Cite the URL for every benchmark claim.** If documentation doesn't confirm a feature, mark `[unverified]`.

### Comparison scope by benchmark

| Comparison axis | vs Pico | vs ACSS | vs Bulma | vs Tailwind |
|----------------|---------|---------|----------|-------------|
| Token architecture | ○ | ◉◉◉ | ○ | ◉◉ |
| Color system depth | ◉◉ | ◉◉◉ | ◉◉ | ◉◉◉ |
| Layout primitives | ○ | ◉◉◉ | ◉◉ | ◉◉ |
| UI components | ◉◉ | ○ | ◉◉◉ | ○ |
| Form styling | ◉◉◉ | ◉◉ | ◉◉◉ | ◉◉ |
| Dark mode mechanism | ◉◉◉ | ◉◉ | ◉◉ | ◉◉◉ |
| Accessibility defaults | ◉◉◉ | ◉◉ | ◉◉ | ◉◉ |
| Print support | ◉◉ | ○ | ○ | ○ |
| Responsive strategy | ◉◉ | ◉◉◉ | ◉◉ | ◉◉◉ |
| Cascade layers | ◉◉ | ○ | ◉◉ | ◉◉◉ |
| No-build delivery | ◉◉◉ | ○ | ◉◉ | ○ |

(○ = low relevance for that comparison pair, ◉◉◉ = high relevance)

---

## 4. Methodology (execute in this order)

> **Phase → Output mapping:** Phase 1 produces Appendices A+B. Phase 2 informs the matrix. Phase 3 produces Output §3. Phase 4 produces Output §4. Phase 5 produces Output §5. Phase 6 produces Output §6.

### Phase 1 — SLASHED Inventory

For each CSS file, extract:

1. **Selectors** — type (element / `.sf-*` / `.is-*` / pseudo / attribute), count, max specificity
2. **Custom properties** — full `--sf-*` list with default value, type (color/length/duration/ratio/integer/string), whether `@property`-registered
3. **CSS primitives used** — oklch, color-mix, light-dark, clamp, @container, @property, @supports, sign(), relative color syntax, @starting-style, anchor positioning, scroll-driven animations, :has(), :focus-visible, prefers-*, interpolate-size, subgrid, view-transition-name
4. **Layer assignment** — verify each rule sits in the layer declared by `layers.css`
5. **At-rules** — @media, @container, @supports, @page, @keyframes, @property (count each)

### Phase 2 — Benchmark Feature Mapping

For each benchmark, document:

| Category | What to capture |
|----------|----------------|
| Tokens | Existence, color model (oklch/hsl/hex), fluid clamp?, spacing scale, type scale |
| Reset/normalize | Own vs external (modern-normalize)? |
| Layout primitives | Equivalent to SLASHED's stack/cluster/sidebar/cover/grid/container/prose? Names? |
| Components | Buttons, forms, cards, navs, modals, accordion, tabs, tooltip, toast, dropdown, breadcrumb, pagination, progress, badge, alert, skeleton, table |
| Dark mode | Mechanism (attribute/class/media), toggle approach |
| Motion | Tokens, keyframes, reduced-motion gating |
| Accessibility | focus-visible, sr-only, skip-link, forced-colors, touch targets |
| Print | @media print, @page, link expansion |
| Responsive | Breakpoints vs container queries vs fluid |
| Cascade layers | Uses @layer? How many? |
| Distribution | CDN? npm? Build required? |
| Browser floor | Declared minimum |

### Phase 3 — Gap Matrix

Build a table: **rows = capabilities** (≥50), **columns = SLASHED | Pico | ACSS | Bulma | Tailwind**.

Cell values:
- `✓` — fully implemented and shipped
- `🟡` — partial (tokens only / reset-level only / behind a flag)
- `●` — missing (not implemented)
- `⚫` — out-of-scope (intentionally excluded, with justification)
- `📦` — stub reserved (SLASHED components/utilities)

**Every SLASHED cell must cite file:line. Every benchmark cell must cite URL.**

#### Required capability rows (minimum — add more as discovered):

**Token system:**
- Color: brand palette (primary/secondary/etc.)
- Color: status/semantic (success/warning/error/info/danger)
- Color: surfaces (bg/surface/well/raised/overlay)
- Color: text hierarchy (primary/secondary/muted/disabled/inverse)
- Color: text-on-color auto-contrast
- Color: numeric scale (50–950)
- Color: alpha variants
- Color: oklch native
- Color: relative color syntax / auto dark derivation
- Spacing: fluid scale
- Spacing: multiplier/scale token
- Typography: fluid scale
- Typography: display sizes
- Typography: weight scale (semantic + numeric)
- Typography: line-height scale
- Typography: letter-spacing scale
- Typography: font stacks (system, geometric, humanist, slab, mono)
- Border: width scale
- Border: radius scale + scale multiplier
- Shadow: elevation scale
- Shadow: dark-mode adaptive
- Z-index: named scale
- Duration: scale + motion-scale multiplier
- Easing: named curves (including spring/bounce/elastic)
- Container: width tokens (narrow/default/wide/full)
- Aspect ratio: tokens

**Reset & base:**
- Box-sizing reset
- Margin/padding reset
- List-style reset
- Media max-width
- Form font-inherit
- Color-scheme declaration
- Scrollbar-gutter
- Touch-action: manipulation
- interpolate-size: allow-keywords

**Layout:**
- Stack (vertical spacing)
- Cluster (horizontal wrap)
- Sidebar (two-column collapse)
- Switcher (threshold-based)
- Grid: auto-fill responsive
- Grid: fixed-column responsive
- Grid: ratio grids
- Grid: bento/masonry-like
- Content grid (breakout pattern)
- Container (max-width + named CQ)
- Cover (full-height centered)
- Frame (aspect-ratio media)
- Reel (horizontal scroll-snap)
- Imposter (centered overlay)
- Prose (long-form rhythm)
- Subgrid support
- Section padding primitives

**Components (UI blocks):**
- Button variants (solid/outline/ghost/link)
- Card
- Modal/Dialog
- Navigation (navbar, sidebar nav)
- Accordion/Disclosure
- Tabs
- Tooltip
- Toast/Notification
- Dropdown/Menu
- Breadcrumb
- Pagination
- Progress bar
- Badge/Tag
- Alert/Callout
- Skeleton loader
- Table (styled)
- Avatar

**Forms:**
- Text inputs (classless)
- Select (custom chevron)
- Textarea
- Checkbox/Radio (styled)
- Range slider
- File input
- Fieldset/Legend
- Label + required marker
- Validation states (visual)
- Form layout (stacked/horizontal)
- Switch/Toggle
- Input group (prefix/suffix)
- Floating labels
- Autocomplete styling

**States:**
- Loading (spinner)
- Skeleton shimmer
- Disabled
- Active/Selected/Current
- Open/Collapsed/Expanded
- Valid/Invalid
- Dragging/Drop-target
- Sticky/Pinned/Fixed

**Theming:**
- prefers-color-scheme
- data-attribute toggle
- Scoped/section-level themes
- Multi-brand support
- 6-token rebrand
- Smooth theme transition
- Custom color override (any valid CSS color)

**Accessibility:**
- :focus-visible ring
- Screen-reader-only (clip-path:inset(50%))
- Skip link
- prefers-reduced-motion (full gating)
- prefers-contrast: more
- prefers-reduced-transparency
- forced-colors (Windows High Contrast)
- Touch targets (pointer:coarse)
- Manual motion opt-out (.no-motion)
- ARIA-driven disabled styling

**Motion:**
- Keyframe library (fade/slide/scale)
- Transition preset tokens
- Animation preset tokens
- Stagger delay tokens
- View transitions
- Scroll-driven animation tokens
- @starting-style support
- Color interpolation via @property

**Print:**
- @page with physical units
- Link URL expansion
- break-inside avoidance
- Hide interactive elements
- Opt-in color preservation
- Opt-in ink-saving mode
- .print-only / .no-print

**Infrastructure:**
- Cascade layers (@layer)
- No-build usability (single `<link>`)
- npm distribution
- CDN distribution
- Bundle tiers (essential/full)
- Subpath exports
- Source maps
- @property registrations
- Container query architecture

### Phase 4 — Findings

Each finding in this format:

```
### F-NN — <one-line title>

| Field | Value |
|-------|-------|
| Severity | critical \| high \| medium \| low \| nit |
| Category | gap \| bug \| inconsistency \| foot-gun \| a11y \| perf \| DX \| docs |
| Evidence | `file:line` + max 3-line code quote |
| Compared to | <Pico\|ACSS\|Bulma\|Tailwind> — description + URL |
| Impact | <concrete user scenario where this hurts> |
| Recommendation | <specific change, with code if ≤10 lines> |
| Effort | XS \| S \| M \| L |
```

Sort findings by severity descending.

### Phase 5 — Cross-reference Existing Internal Audits

The repository contains internal audit documents in `audits/`:
- `audits/completion-checklist-v3.md` — the most current internal production-readiness checklist (supersedes v2 and v1)
- `audits/completion-checklist-v2.md` — previous version
- `audits/completion-checklist.md` — original version

**For `completion-checklist-v3.md`** (the authoritative internal audit):
- It contains 11 decisions (D1–D11) with specific implementation instructions
- Many of these have since been implemented in the current source code
- For each D-decision, verify: **implemented** (code matches the spec), **partially implemented** (some done, some not), or **still outstanding**
- The roadmap (the checklist's §F) proposed versions v0.2 → v0.3 → v0.4 → v1.0 — assess how much of this has been completed
- The scoring (the checklist's §E) rated areas like Tokens 85%, Base 90%, Forms 67%, etc. — re-evaluate against current source

For each claim in the existing audits:
- `✓ confirmed` — still true, with evidence
- `✓ resolved` — was true, now fixed (cite the fix location)
- `⚠️ stale` — no longer accurate (cite what changed)
- `✗ wrong` — was never true (cite counter-evidence)
- `❓ unverifiable` — cannot confirm either way

### Phase 6 — Prioritized Roadmap

Map findings to:
- **P0** — must-fix before public v1.0 (blocks shipping)
- **P1** — target for v1.1 (important but not blocking)
- **P2** — nice-to-have / future consideration

---

## 5. Mandatory Audit Checkpoints

Do NOT skip any of these. Each is a potential finding:

| # | Checkpoint | What to verify |
|---|-----------|----------------|
| 1 | **Layer hygiene** | Every rule in its declared layer? Any CSS leaking outside a layer (besides `layers.css` declaration)? |
| 2 | **Token consistency** | Every value in base/layout/forms/states uses `var(--sf-*)`? Find any hardcoded literals (hex, px, ms) outside tokens.css/tokens.layout.css/tokens.palette.css/legacy.css |
| 3 | **@property coverage** | Which tokens SHOULD be registered (colors used in transitions, longhand animation targets)? Which aren't? |
| 4 | **oklch purity** | Any HSL/RGB/hex artifacts in non-legacy, non-fallback CSS? |
| 5 | **Light/dark coherence** | Does `[data-theme="dark"]` on `<section>` inside OS-light truly work? Does `--sf-is-dark` propagate correctly to children? Do `light-dark()` tokens respond to scoped `color-scheme`? |
| 6 | **Container query safety** | Any container-type on a parent that contains a `%`-height child (would break)? Cycles? |
| 7 | **Accessibility completeness** | focus-visible on ALL interactive elements? .sr-only uses clip-path:inset(50%)? ALL animations gated by reduced-motion? forced-colors handles all custom borders/shadows? |
| 8 | **Print completeness** | @page uses physical units? All decorative elements hidden? Links expanded? break-inside on all block media? |
| 9 | **Reduced-motion gating** | Every `animation:` and `transition:` in the framework — is it gated or neutralized by accessibility.css? Any that slip through? |
| 10 | **Legacy layer correctness** | Every rule under `@supports not (...)`? No leakage onto modern engines? |
| 11 | **Demo coverage** | Does `docs/demo.html` exercise ALL public `.sf-*` and `.is-*` classes? List any declared-but-undemonstrated. |
| 12 | **Naming consistency** | All layout uses `.sf-*` prefix? States use `.is-*` exclusively? Modifiers use `--` (BEM)? Any violations? (Note: `states.css` contains `.focus-parent` which breaks the `.is-*` convention — verify if this is intentional.) |
| 13 | **Bundle correctness** | Does `bundle.config.json` produce the bundles described in README? File order match? Legacy always last? |
| 14 | **Browser floor accuracy** | Declared floor: Chrome 123 / Safari 17.5 / Firefox 128. For every modern CSS feature used, verify it's within or properly gated. See the Feature-to-Baseline Reference table at the end of this section. |
| 15 | **No-build integrity** | Can a consumer use SLASHED with just `<link>` tags? Is file order fragile or layer-protected? Does the single-bundle path work without Node? |
| 16 | **Token alias graph** | Verify ≤2 hops. Any dangling references (token references another that doesn't exist)? Cycles? |
| 17 | **Specificity budget** | Any selector above 0-2-0 outside accessibility.css/print.css? Compound selectors (`.sf-prose > * + *` → 0-1-1) are expected in layout but should not exceed 0-1-1. `!important` used only where documented (a11y hardened rules, print hide-list, .is-hidden)? |
| 18 | **forms.css integration** | Does `.is-valid`/`.is-invalid` from states.css actually recolor form fields in forms.css? Is `--sf-field-border-color` the bridge? |
| 19 | **Contrast compliance** | For default palette: do ALL `--sf-color-text--on-*` pairs meet WCAG AA (4.5:1)? Do link colors meet AA on background? Document the sign(0.6-l) trough. |
| 20 | **Scroll-driven animation tokens** | `--sf-scroll-timeline-range-*` declared but are they consumed anywhere? Is this dead code or BEM-consumer-API? |

#### 5.1 Feature-to-Baseline Reference (for Checkpoint 14)

| Feature | Used in | Actual baseline | Status on declared floor |
|---------|---------|-----------------|--------------------------|
| `interpolate-size` | reset.css:26 | Chrome 129, Safari 18, Firefox flag-only | ⚠ Above floor — gated by `@supports` ✓ |
| `hanging-punctuation` | reset.css:18 | Safari-only (no Chrome/Firefox ever) | ⚠ Progressive enhancement — degrades silently ✓ |
| `view-transition-name` | motion.css:41 | Chrome 111, Safari 18, Firefox 126 (partial) | ⚠ Safari 18 > 17.5 — gated by `@supports` ✓ |
| `text-wrap: pretty` | tokens.css:758 | Chrome 117, Safari 17.5, Firefox 121 | ✓ Within floor |
| `text-wrap: balance` | tokens.css:764 | Chrome 114, Safari 17.5, Firefox 121 | ✓ Within floor |
| `subgrid` | layout.css:462 | Chrome 117, Safari 16, Firefox 71 | ✓ Within floor |
| `:has()` | forms.css:283 | Chrome 105, Firefox 121, Safari 15.4 | ✓ Within floor |
| `:dir(rtl)` | forms.css:125 | Chrome 120, Firefox 49, Safari 16.4 | ✓ Within floor |
| `light-dark()` | tokens.css:114+ | Chrome 123, Safari 17.5, Firefox 120 | ✓ Floor-defining feature |
| `@property` (inherits) | tokens.css:75+ | Chrome 85, Safari 16.4, Firefox 128 | ✓ Floor-defining feature |
| `oklch(from … sign(…))` | tokens.css:189+ | Chrome 111, Safari 16.4, Firefox 113 | ✓ Within floor |
| `color-mix(in oklab)` | tokens.palette.css | Chrome 111, Safari 16.2, Firefox 113 | ✓ Within floor |
| `overflow: clip` | accessibility.css:138 | Chrome 90, Safari 16, Firefox 81 | ✓ Within floor |

The auditor must flag any additional feature that (a) exceeds the floor AND (b) is NOT gated by `@supports` or equivalent progressive enhancement.

---

## 6. Output Format

Produce a single Markdown document:

```
# SLASHED — Comparative Gap Audit

**Date:** YYYY-MM-DD
**Auditor:** <model/agent name>
**SLASHED commit:** <hash>
**Benchmarks:** Pico CSS v2.x, Automatic.css v4.x, Bulma v1.x, Tailwind CSS v4.x

---

## 1. Executive Summary (≤250 words)
Top 5–7 findings, one sentence each. Overall assessment.

## 2. Methodology
Files read, sources consulted, scope boundaries.

## 3. Capability Matrix
<Phase 3 table — ≥50 rows>

## 4. Findings
<All F-NN from Phase 4, sorted severity desc — target ≥25 findings>

## 5. Internal Audit Cross-Reference
<Phase 5 results — verify completion-checklist-v3.md D1–D11 status>

## 6. Prioritized Roadmap
### P0 — Before v1.0
### P1 — For v1.1
### P2 — Future

## 7. Tradeoff Opinions
For each of the 5 known tradeoffs (§2.2): agree/disagree/alternative.
If you have zero disagreements, explain why each tradeoff is correct.

## 8. Appendix A — SLASHED Selector Inventory
Per-file table: selector | type | specificity | layer

## 9. Appendix B — SLASHED Token Inventory
Per-category table: token name | default value | type | @property? | consumed-by

## 10. Appendix C — Sources Cited
All benchmark URLs referenced, grouped by framework.
```

---

## 7. Definition of Done

The audit is complete when ALL of the following are true:

- [ ] Every core + optional CSS file has its own inventory section
- [ ] Capability matrix has ≥50 rows × 5 columns
- [ ] ≥25 findings in full F-NN format
- [ ] Every SLASHED claim has file:line evidence
- [ ] Every benchmark claim has a URL
- [ ] All 20 mandatory checkpoints addressed (even if "no issue found")
- [ ] Roadmap maps every finding to P0/P1/P2
- [ ] Section 7 addresses all 5 known tradeoffs
- [ ] Internal audit cross-reference (Section 5) verifies D1–D11 implementation status
- [ ] No `should consider` / `might be nice` language — only concrete recommendations

---

## 8. Anti-Patterns to Avoid

1. **Don't penalize SLASHED for lacking utility classes.** It's BEM-first. The absence of `.text-center` is a feature, not a bug.
2. **Don't conflate empty stubs with bugs.** `components.css`, `utilities.css`, `tokens.components.css` are intentional placeholders. Report them as **gap (known)** in the matrix, not as findings.
3. **Don't treat architecture.md as ground truth.** Compare it against actual CSS. Mismatches ARE findings.
4. **Don't inflate severity.** Reserve `critical` for: broken API contract, accessibility failure, data loss. A missing component is `high` at most (since components are explicitly out-of-scope for v0.x).
5. **Don't recommend PostCSS/Sass/Tailwind migration.** Respect the no-build constraint. If something genuinely requires a build step to solve, say so explicitly and mark it as a tradeoff, not a recommendation.
6. **Don't guess benchmark features.** If you can't verify from official docs, mark `[unverified]` and move on.
