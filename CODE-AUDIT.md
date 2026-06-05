# SLASHED — code audit

> **Pre-fix snapshot** — several findings below were addressed in PR #196
> (CSS generator validation hardening, version-sync lastIndex ordering,
> export.js `base → surface` rename). This document reflects the state of the
> codebase at audit time; resolved items are kept for historical context.

> **2026-06-05 WP-plugin re-audit pass** — a focused re-review of the
> `plugins/SLASHED-for-WP` tree confirmed most prior High/Medium items were
> already fixed (CSS-generator allowlist validation, `slashed.php` cleanup +
> cron moved to the global layer, color defaults consolidated through
> `Slashed_Token_Defaults`). Two genuine bugs, one PHP duplication, and a set
> of editor-app cleanups were fixed in this pass — see
> **"Re-audit fixes (2026-06-05)"** below. A deep read of the entire
> `editor-app` (~5.4k lines) found **no functional bugs** — only the small
> cleanups listed. Items that need a product/architecture decision before
> touching are collected under **"Remaining — needs a decision"**.

Whole-repo code review across four domains: build scripts, the WordPress PHP
plugin, the Svelte editor/admin apps, and the CSS source. Overall the codebase
is unusually clean and well-documented — most "odd" patterns are deliberate and
explained inline. The findings below are the genuine issues, ordered by impact.
The top items were verified directly against the source.

Date: 2026-06-02

---

## ✅ Re-audit fixes (2026-06-05)

Applied on branch `audit/wp-plugin-cleanup`. All PHP files pass `php -l`; the
admin SPA rebuilds cleanly; `node --test` is 64/64 green.

### 1. `surface` → `base` regression fixed in the two remaining stragglers

The framework's only *source* brand token is `--sf-color-base-light`;
`--sf-color-surface` is a derived semantic alias (`= var(--sf-color-base)`) with
no `-light`/`-dark` source. Commit `62b7337` partially reverted a
`base → surface` rename but missed two spots, both of which read the
non-existent `brand_surface` key and emitted a phantom
`--sf-color-surface-light`, silently dropping the user's `brand_base` override:

- `integrations/bricks/admin-app/src/lib/export.js:70` — client-side "Export
  CSS". **Fixed** `'surface'` → `'base'` and rebuilt the bundle
  (`assets/admin-app/app.js`, one-line diff).
- `integrations/bricks/includes/class-inventory.php:241`
  (`get_admin_color_overrides()`) — its own docblock says it mirrors
  `Slashed_CSS_Generator::generate_color_declarations()` (which uses `base`), so
  the editor color-swatch preview for the base color was wrong. **Fixed.**

Cross-checked against the source of truth: `class-token-defaults.php`,
`class-css-generator.php`, `ColorTab.svelte`, `color-model.js`,
`LivePreview.svelte` all use `base`, as does `tests/color-model.test.js`.

### 2. Bricks font collection de-duplicated

`Slashed_Token_Page::get_bricks_fonts()` and
`Slashed_Bricks_Fonts_REST::get_fonts()` were ~110-line near-verbatim copies of
the same option-probing + Font-Manager-CPT query + dedup logic (sharing the
`slashed_bricks_cpt_fonts` transient) that had already started to drift. The
collector now lives once in `Slashed_Token_Page::get_bricks_fonts()` (the
always-loaded canonical owner, in both unified and standalone modes); the REST
endpoint is a thin wrapper, and the shared transient key is a single constant
`Slashed_Token_Page::CPT_FONTS_TRANSIENT`. No behavioural change.

### 3. editor-app cleanups (reBEMer + Color System)

A full read of all ~5.4k lines of `editor-app` confirmed the bundle is in very
good shape — solid lifecycle teardown (every module wires an `AbortController`
+ `destroy()`), debounced + pre-filtered mutation observers, pure unit-tested
helpers, and an allowlist-based migrate path with snapshot/rollback. The
following small, behaviour-preserving cleanups were applied and the bundle
rebuilt (`assets/editor-app/app.js`):

- **Dead prop `referenceMode` removed.** `ColorPanel.svelte` declared and
  `ColorApp.svelte` passed `referenceMode`, but the component derives its mode
  purely from whether `onPickValue` is supplied (`pickerMode`). The prop was
  never read. Removed from both the prop list and the call site.
- **`ColorPanel.svelte` Brand/Status duplication collapsed.** The two palette
  sections were ~90 lines of near-identical markup differing only by the source
  group list. Extracted into a single `{#snippet familyScanner(groups)}`
  rendered twice (`brandGroups` / `statusGroups`) so they can't drift. Pure
  structural refactor — `app.css` is byte-identical, confirming no class/markup
  change.
- **Redundant branch in `color-swatches.js`.** `injectSFButton()` had an
  `else if (varBtn) appendChild` / `else appendChild` pair that both did the
  same thing; collapsed to a single `else`.

### 4. PHP: duplicated `require_once` block extracted

`slashed-bricks.php` loaded the same parser → resolver → inventory trio in both
`slashed_bricks_data_init()` (plugins_loaded) and `slashed_bricks_init()`
(after_setup_theme). The two paths gate on different signals and must each load
their deps independently, so the calls can't simply be removed — instead the
shared trio is now `slashed_bricks_require_data_classes()`, called from both.
Idempotent via `require_once`; no behavioural change.

### 5. PR #230 review feedback addressed (CodeRabbit)

- **CPT font-cache invalidation moved to an always-loaded path (real fix).** The
  `save_post_{BRICKS_DB_CUSTOM_FONTS}` → cache-bust hook was registered inside
  `Slashed_Bricks_Fonts_REST::register_routes()`, which only runs on
  `rest_api_init`. A normal (non-REST) admin save of a custom-font post would
  therefore not invalidate the `slashed_bricks_cpt_fonts` transient, leaving a
  stale font list for up to an hour. The invalidation now lives on
  `Slashed_Token_Page::flush_bricks_fonts_cache()` (the always-loaded canonical
  owner of the transient) and is hooked from `slashed_bricks_data_init()`
  (`plugins_loaded`, all request types). The REST class no longer registers the
  hook. Pre-existing bug, surfaced by the de-dup refactor.
- **Inline `base`/`surface` comment added in `class-inventory.php`** to mirror
  the note in `export.js`, so the brand-family list documents why `base` is
  included and `surface` (a derived alias) is not.

### Verified already-resolved since the 2026-06-02 snapshot

CSS-generator allowlist validation (`valid_color`/`valid_dimension`/
`valid_font_family` + `is_css_safe` + `balanced_parens`); `slashed.php` no-op
activation hook removed and the version-check cron clean-up moved to the global
layer; `class-color-resolver.php` default colors derived from
`Slashed_Token_Defaults`; the "kept for tests" `get_colors()`/`get_classes()`
wrappers and the empty `slashed_bricks_activation_check()` are gone. In
`editor-app`: the speculative "shape 3 (hypothetical)" history probe in
`bricks-api.js` is gone (only two version-verified shapes remain), and
`color-swatches.js` now pre-filters mutations via `touchesPicker()` + a 50 ms
debounce rather than running `.closest()` on every mutation.

### Remaining — needs a decision (not changed this pass)

Each of these is either intentional-by-design or carries enough behavioural risk
that it should be a deliberate choice rather than a drive-by edit:

1. **Triplicated `DIST_SHA` constant** — `slashed.php:41`,
   `slashed-bricks.php:32`, `slashed-gutenberg.php:32` hand-sync the same SHA.
   The inline comment says this is **deliberate** so each integration file stays
   self-contained and distributable standalone; the version-sync workflow keeps
   them aligned. Decision needed: accept the documented duplication, or add a
   shared canonical constant with a standalone fallback. *Left as-is.*
2. **Duplicated `slashed_inject_token_overrides()`** — defined in both
   `slashed.php` and (guarded by `! defined('SLASHED_VERSION')`) in
   `slashed-bricks.php`. This is the **standalone-mode bootstrap**: the Bricks
   plugin must provide the function when the unified plugin isn't present.
   Removing it would break standalone activation. Decision needed: keep, or
   factor the shared bootstrap into a common file loaded by both. *Left as-is.*
3. **`apply.js` migrate edge case** — two siblings migrating into the *same new*
   class name. Re-reading the full file, the live `getGlobalClasses()` reference
   + the additive merge block + auto-numbering's uniqueness guarantee appear to
   cover this, but confirming it needs a live Bricks editor. Decision needed:
   write an integration test harness, or leave the current (apparently-correct)
   behaviour documented. *Left as-is — no blind change.*
4. **`class-css-parser.php` `[^}]*` regex** — breaks on a `}` inside an
   `@property` initial-value. Non-fatal (cached, editor-only) and CSS parsing
   via regex is inherently brittle. Decision needed: accept, or move to a small
   tokeniser. *Left as-is.*
5. **`migrate-keys.js` allowlist carries both naming conventions** — e.g.
   `_widthMin`/`_widthMax` *and* `_minWidth`/`_maxWidth`. Harmless (unknown keys
   are simply never present), but worth confirming which Bricks actually uses
   and pruning the dead half. Decision needed: verify against a live Bricks
   build before trimming. *Left as-is.*

---

## 🔴 High priority

### 1. `export.js` drops the `surface` brand color (confirmed regression)

`plugins/SLASHED-for-WP/integrations/bricks/admin-app/src/lib/export.js:70` — the
brand list is `['primary','secondary','tertiary','action','neutral','base']`,
but the framework (and the saved settings keys, per
`includes/class-token-defaults.php:72`) renamed `base → surface`. The git history
shows that rename landing across PHP/CSS/tests, but this file was missed.

- A user's `brand_surface` / `brand_dark_surface` override is **never emitted**
  in the client-side "Export CSS" — diverging from the correct server-rendered CSS.
- A phantom `--sf-color-base-light` would be emitted if a `brand_base` key existed.
- **Fix:** `'base'` → `'surface'` on line 70 (the loop covers both light at L74
  and dark at L94).

### 2. CSS generator writes admin token values via blacklist stripping, not validation

`includes/class-css-generator.php` (color/font/spacing/shadow/motion paths,
~L130-260). Values are concatenated into the CSS string guarded only by
`Slashed_Token_Sanitizer::sanitize_css_value()` (strips `{ } < > @ ;`). That still
permits `url(...)`, `:`, `(`, `)`, `/`, newlines, `!important`, etc. Input is
admin-only (`manage_options`), so the realistic impact is self-XSS / CSS
injection, but it is the framework's biggest soft spot.

- **Fix:** per-type allowlist — numerics through `format_float()`/`(float)`,
  colors through `is_hex_color()`/an oklch parser, font-family allowlist; reject
  anything else. (`generate_layout_declarations` already runs `sanitize_text_field`
  at L343; the color/typography/spacing paths do not even do that.)

---

## 🟠 Medium priority

### Duplicate / divergent sources of truth (the recurring theme)

- **Color palette defined twice.** `core/tokens.css` (oklch / mix-with-white-black)
  vs `optional/tokens.palette.css` (oklab / mix-with-surface-text) define the *same*
  `--sf-color-{family}-{50..950}` token names with different formulas. Both load in
  the `optimal`/`full` bundles, so palette.css wins and ~250 lines in tokens.css are
  dead there but live in `essential` → the **same token resolves to a different
  color depending on which bundle is used**, and the divergence is undocumented.
  Move the numeric scale to a single definition, or have palette.css override only
  what it intends to change.
- **Default color values diverge.** `includes/class-token-defaults.php` and
  `integrations/bricks/includes/class-color-resolver.php` hard-code two different
  oklch/hex sets (e.g. primary `oklch(0.47 0.27 264)` vs `oklch(0.45 0.20 264)`) →
  mismatched picker previews. Consolidate to one source.
- **Bricks font collection duplicated.** `class-token-page.php::get_bricks_fonts()`
  and `integrations/bricks/includes/class-fonts-rest.php::get_fonts()` are
  near-verbatim copies (same `slashed_bricks_cpt_fonts` transient key) that already
  differ subtly in label fallbacks. Extract one shared resolver.
- **Triplicated `DIST_SHA` constants** hand-synced across `slashed.php:41`,
  `integrations/bricks/slashed-bricks.php:32`, and
  `integrations/gutenberg/slashed-gutenberg.php:32` — a stale copy ships the wrong
  CDN CSS. Prefer a single canonical constant.
- **Two copies of the "one authoritative parser."** `stripComments` /
  `extractTokens` / `extractClasses` are duplicated between `scripts/audit.js` and
  `scripts/gen-bricks-inventory.js` and already disagree on sort order. Consolidate
  near `scripts/registry-sources.js`.

### Correctness / fragility

- `editor-app/src/lib/apply.js:243` (and `validateMigrate`) — `migrate` looks up
  `existing` in a pre-batch `globalClasses` snapshot (captured at L178) while newly
  created classes are pushed to the live state via `upsertGlobalClass`. Two siblings
  migrating into the *same new* class name → the 2nd+ op's seed keys are stripped
  without being merged anywhere (silent style loss). Re-query the live class list
  inside the loop.
- `scripts/version-sync.js` — non-global `SEMVER_RE`; a silent no-match logs
  "already up to date," so a file-format change can ship a stale version from the
  release-it hooks. Assert each pattern matched at least once.
- `scripts/gen-class-hints.js` `--check` — raw string compare is line-ending
  sensitive → spurious CI failures on CRLF checkouts. Compare parsed JSON, or
  normalize line endings first.
- `scripts/bundle.js:96` — `stripLayerWrappers` has a magic 32-iteration cap that
  silently leaves blocks wrapped past the limit. Loop until no header matches.
- `slashed.php` vs `slashed-bricks.php` — the `slashed_bricks_version_check` cron +
  dashboard "update available" widget concern the framework CSS but are scheduled
  and cleaned up only when the Bricks integration is active → orphaned-cron risk in
  unified mode. Move both to the global layer.

### Ugly-but-contained workarounds

Well-documented, fail-safe, but rot-prone — worth a TODO/expiry note and a record
of the Bricks version each was verified against:

- `editor-app/src/main.js:82-94` — fixed-interval polling probe (25 × 400ms) to wait
  for Bricks to mount; `L273-286` reaches into `HTMLInputElement.prototype` value
  setter to drive Bricks' Vue input.
- `editor-app/src/lib/bricks-api.js:76-110` — speculative "shape 2/3" history-API
  probes (the comment itself labels shape 3 "hypothetical"). Drop the unverified
  shapes or gate behind a feature flag. `getActiveElementId` (L234-262) similarly
  guesses 4 unverified `_state` keys before DOM-scraping.
- `editor-app/src/lib/color-swatches.js:291` — `MutationObserver` on `document.body`
  with `subtree:true` runs `.closest()`/`.querySelector()` per mutation during drag
  bursts. Scope to a narrower container once the panel root is found.
- Bricks 2.2 Color-Manager version-gated disable (`slashed-bricks.php:169-183`,
  `class-colors.php:141-156`) — keeps disabling palette injection on all future
  Bricks ≥ 2.2. Filter-overridable, but add an expiry note.
- `class-css-parser.php` (L45, 78, 86, 111, 154, 166) — regex CSS parsing is
  inherently brittle (nested braces in `@property initial-value`, comments in
  strings). Non-fatal (cached, editor-only), but `[^}]*` at L154 breaks on any `}`
  inside an initial-value.
- `derive_local_path_from_url` / `../../../../dist/` path walking
  (`slashed-bricks.php:100-105`, `gutenberg` enqueue, `class-inventory.php:614-623`)
  — counting `../` levels is fragile to any directory restructuring.

---

## 🟡 Low priority / cleanups

### CSS

- `core/base.css:28` — `text-rendering: optimizelegibility` should be
  `optimizeLegibility` (works due to case-insensitivity, but wrong casing — or drop
  it; it can degrade rendering perf on all headings).
- `core/layout.css:234` doc comment and `optional/overrides-example.css:99` reference
  a `--sf-fit` / `--fit` token that does not exist (only the `.sf-grid--fit` modifier
  class does) — misleading example.
- `core/macros.css:249-261` — `-webkit-background-clip: text` + the
  `@supports (background-clip: text)` gate are dead per the stated browser floor
  (the comment admits the `or` branch is dead).
- `optional/legacy.css:88-100` — accent-color section is an empty documentation-only
  no-op; can be deleted (accent-color is within the floor).
- `core/tokens.css:996` — `--sf-radius-outer` forward-references `--sf-component-pad`
  defined ~256 lines later; resolves fine but is confusing.

### Dead PHP

- `slashed.php:109` — `register_activation_hook(__FILE__, '__return_true')` no-op.
- `integrations/bricks/slashed-bricks.php:312-315` — empty
  `slashed_bricks_activation_check()`.
- `includes/class-rest-controller.php:28-30` — empty "No-op" constructor.
- `includes/class-token-store.php:42` — option still Bricks-namespaced
  (`slashed_bricks_settings`) despite being the global settings store; a migration
  (like the one at L60-67) would clean it up.
- `class-colors.php:370-410` (`get_colors()`) and `class-classes.php:236-238`
  (`get_classes()`) are "kept for tests" wrappers — drop if no caller/test uses them.

### Dead JS

- `editor-app/.../components/ColorPanel.svelte:46` — `initialTarget` prop is never
  passed (always defaults to `'background'`); wire it or drop it.
- `editor-app/src/lib/color-swatches.js:138-142` — redundant identical `appendChild`
  branch; collapse to `if (varBtn?.nextSibling) insertBefore else appendChild`.
- `scripts/gen-class-hints.js` — `parentClass` is tracked but never used.

### Scripts

- `scripts/audit.js` — `ALL_SOURCE_FILES` is a hand-maintained list that has drifted
  (omits `core/layers.css`, `optional/utilities.css`, `optional/overrides-example.css`)
  → false "unused token" warnings. Glob `core/*.css` + `optional/*.css` instead.
- `scripts/zip-plugin.js:85` — prefer `execFileSync('zip', ['-r', OUTPUT, 'slashed'],
  { cwd: STAGE })` over the shell-interpolated `execSync`; use `lstatSync` (L50) to
  avoid following symlinks out of the staging tree.
- Several scripts mix `require('fs')` vs `node:fs` — cosmetic inconsistency.
- `scripts/registry-sources.js` — `optional/theme-example.css` sits in the canonical
  `CLASS_FILES` registry; confirm an example file belongs there.

---

## Notable non-issues (deliberate, verified correct)

- `optional/utilities.css` / `components.css` / `tokens.components.css` empty or
  commented stubs — intentional per the README.
- Legacy `@supports` gates in `core/reset.css` / `optional/legacy.css` are still
  required at the stated browser floor (Chrome 123 / Safari 17.5 / Firefox 128).
- `--sf-is-*` state-flag tokens unread within core — intentional consumer-only
  public API, registered via `@property`.
- reBEMer SQL uses `$wpdb->prepare` with placeholders correctly; all REST routes
  define a `permission_callback`; the admin form checks nonce + capability; admin
  output is escaped.
- `format_float()` via `number_format` (PHP) and `formatFloat` (JS) are both correct.
- The `static function` closure using `self::` in `class-token-sanitizer.php:46-50`
  is legal in PHP 7.4+ (a static closure retains class scope); only a readability nit.
