# SLASHED Changelog

Complete development history from v0.1.0 through v0.5.24, organized by category and version.

## Contents
- [Framework](#framework)
- [Plugins](#plugins)

---

## Framework


### v0.1.0

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
- **#47** — completion checklist — framework coverage benchmark
  > Comprehensive completion checklist for bringing the existing SLASHED layers to 100% — benchmarked against a comparable utility-class feature set (closest match, ~85% overla
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
- **#54** — Add D11 — token alias-chain hygiene &amp; API-surface freeze to checklist v3
  > Follow-up to the merged checklist v3 (#53). Adds a token API-freeze checkup based on a full var()-graph audit of all 562 token definitions.
- **#55** — foundation polish for v0.2.0 (checklist v3 §F batch)
  > Wire up declared-but-unused base/print tokens, fix two form bugs, ship
- **#56** — move container-type to parent for sf-grid-6 and ratio grids
  > @container queries look for an ancestor container, not the element
- **#57** — comprehensive optimal bundle index &amp; inventory
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

### v0.2.0

- **#30** — v0.2.0: bugfixes from quality audit + token enrichment + a11y/docs/tooling
  > Doprowadza framework do stanu opisanego w zatwierdzonym 7-fazowym planie: 3 bugfixy z audits/quality-audit-2024-full.md, 5 warningów rozstrzygniętych
- **#32** — show auto-derived dark colors in the configurator
  > Follow-up to #29. The theme configurator's dark color pickers were seeded from a hardcoded TOKEN_DEFAULTS table, which:
- **#33** — Add comprehensive comparative audit against reference CSS frameworks
  > This PR adds a detailed comparative audit of SLASHED against a curated set of reference CSS frameworks
- **#34** — Phase 1: truthfulness foundation — themes layer extraction, bundle scope, browser floor accuracy
  > Phase 1 of the perfection roadmap from audits/comparative-audit-2026.md Resolution Log. Foundation pass — no behavioural changes, no breaking changes.
- **#35** — clear WCAG AA Normal by default for every brand &amp; status on-color (Phase 2)
  > Phase 2 of the perfection roadmap. Tightens the default brand & status palette so every on-color foreground clears WCAG AA Normal (4.5:1) by default —
- **#36** — WCAG AA Normal by default for every brand &amp; status on-color (Phase 2 redo)
  > Phase 2 (#35) was approved and clicked-merge, but its base.ref was chore/phase-1-truthfulness (the now-deleted Phase 1 branch) instead of main. After
- **#37** — preserve authored colour by default; opt-in .print-color-exact / .print-no-color (Phase 3)
  > Phase 3 of the perfection roadmap. Reverses the print-stylesheet colour contract: authored colour is preserved by default, ink-on-paper is now an opt-
- **#38** — comparative audit of framework coverage (2026-05-20)
  > Adds a single new file: audits/comparative-audit-2026-05-20.md (1501 linii, narracja po polsku, nagłówki sekcji po angielsku zgodnie ze specyfikacją a
- **#39** — name container queries — sf-layout and sf-alternate (Phase 4)
  > Phase 4 of the perfection roadmap. Names two of the framework's container-query containers and binds one framework-internal query to a name. The remai
- **#40** — Phase 5 — Motion API polish
  > Phase 5 of the framework perfection plan. Polishes the motion/transition API, modernizes accessibility patterns, and proves @property color interpolat
- **#41** — Phase 6 — regression tests &amp; full demo coverage
  > Phase 6 — Coverage & regression tests. Completes the full audit remediation plan.

### v0.3.0

- **#79** — class taxonomy + macros layer + components blueprint
  > Class taxonomy refactor for v0.3.0. Introduces the new slashed.macros cascade layer, ships 12 macro recipes, adds 3 recipe-coverage essentials (icon-boxed
- **#80** — add workflow_dispatch trigger to release workflow
  > Allows publishing a release manually (e.g. v0.3.0) without needing to
- **#82** — replace &#39;blueprint&#39; with plain language
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
  > Addresses all CodeRabbit review comments from PR #98.\n\n## Changes\n\n- BundleTab.svelte: Prevent overlapping success timers on rapid saves (track/cl
- **#101** — add canonical token/class counter as single source of truth
  > Introduce scripts/audit.js + docs/registry.json to eliminate count
- **#102** — Depersonalize framework references in docs and comments
  > Replace named third-party framework references in documentation and source comments with neutral wording.
- **#104** — API freeze - new tokens, hardcode fixes, cleanup
  > Prepares the token layer for API freeze by:
- **#107** — PUBLIC/ADVANCED/INTERNAL contract + docs sync
  > Completes the PUBLIC/ADVANCED/INTERNAL token classification and syncs documentation with code for the v0.3.0 API freeze.
- **#110** — dual-mode link selection, built-in focus ring, broader lifting
  > Explicit mode: add [data-overlay-link] to the primary link and every
- **#111** — rebuild minified bundles to purge stale vendor wording from sourcemaps
  > Rebuilds all 10 minified CSS bundles and their sourcemaps to remove a stale vendor-specific comment that survived PR #102's framework-name cleanup.
- **#112** — Remove all third-party CSS framework references
  > Strip mentions of specific framework names and comparative advantage claims
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
- **#135** — Generalize Auto-BEM references and remove vendor-specific wording
  > Updated documentation to use neutral language for Auto-BEM tooling and remove vendor-specific references.
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

### v0.5.0

- **#179** — Identity Refresh and Documentation Overhaul for v0.5.0
  > This comprehensive update refreshes the SLASHED framework's identity and documentation for the v0.5.0 release.
- **#181** — don&#39;t abort commits staging gitignored dist bundles
  > The .githooks/pre-commit hook rebuilds dist bundles and git adds every output. But dist/*.css is gitignored on main (built via npm run build, shipped
- **#188** — complete color system — shade scale, section theming, swatch coverage
  > A comprehensive pass over the SLASHED color system touching the core framework CSS, the Bricks builder integration, and the documentation. All changes
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
- **#234** — native validation, autofill, auto-grow textarea &amp; numeric/overlay tokens
  > Resolves the batch of well-scoped, low-risk open issues. Each change is additive, progressively enhanced, and built on existing tokens.
- **#235** — add .sf-content-auto and .sf-tabular-nums macros (#222, #214)
  > Follow-up to #234. Resolves the two remaining issues that I'd previously mis-shelved as "blocked utilities" — they're actually macros (token-driven re
- **#236** — class-family picker for rename/replace + remove-all toggle
  > In the reBEMer panel, Rename mode previously always renamed *the first* class on an element ("This element has 2 classes. Only the first will be renam
- **#237** — scrim, focus-shadow, divider &amp; link recipes + auto-colour tests
  > Implements the recipe-tier enhancements and tests recommended after the SLASHED recipe coverage audit. Everything here is a token-driven macro/rec
- **#239** — prepare for WordPress.org submission
  > - Add readme.txt (required for wp.org review)
- **#240** — WordPress.org submission prep, docs cleanup, ESM scripts
  > - WordPress.org submission prep — local-first CSS delivery (dist/ bundled in plugin), in-admin updater to download latest bundles from jsDelivr, optio
- **#241** — add feature-completeness &amp; graceful-degradation issue backlog
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
- **#256** — keep WordPress plugin&#39;s bundled CSS in sync with core builds
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

### v0.5.24

- **#264** — consolidate post-0.3.0 work under v0.5.24
  > Fixes the framework changelog version history. The changelog was stuck at 0.3.0 with everything piled under a perpetual [Unreleased] section, even tho

### Unreleased

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

## Plugins

### Bricks Builder Integration

- **#60** — : add generic flat bundles, drop bricks-branded bundle
  > Replaces the single bricks-branded flat bundle with a generic *.flat.css sibling for every tier, and produces them in dist/.
- **#61** — add generic flat bundles, replace bricks-branded bundle
  > Adds generic *.flat.css bundles for every tier, replacing the single bricks-branded flat bundle.
- **#71** — add Bricks Builder integration plugin
  > Adds a WordPress plugin at integrations/bricks/ that natively integrates SLASHED with Bricks Builder, providing the same type of in-builder experience
- **#74** — use jsDelivr CDN as default CSS source for Bricks
  > Changes the default CSS source for the Bricks Builder integration plugin to load from jsDelivr CDN instead of requiring local files.
- **#81** — inject all framework classes and variables into Bricks UI
  > The Bricks integration was supposed to populate the Bricks Builder UI with every SLASHED token and class so users get a complete picker / autocomplete
- **#83** — separate color palette + HEX picker + Contrast tab in admin
  > Three GUI/integration improvements to the SLASHED ↔ Bricks integration, addressing user feedback (PL):
- **#84** — register variables/classes via canonical options and stop CSS bleed into builder UI
  > Fixes two bugs in the Bricks integration that were surfacing together:
- **#92** — use official bricks/builder/color_palette filter for color injection
  > The previous option_bricks_color_palette filter only fires when WordPress
- **#97** — resolve color swatches + add HTML font-size option
  > Fixes two issues with the SLASHED for Bricks plugin:
- **#98** — expand admin panel to full API + add cheatsheet tab
  > Expands the Svelte 5 admin SPA (integrations/bricks/admin-app/) to cover the entire SLASHED Bricks plugin public API and adds a comprehensive Cheatshe
- **#103** — sync Bricks color palette with admin-saved overrides
  > Fixes the disconnect between admin-saved color customizations and the Bricks Builder color palette swatches.
- **#105** — port remaining 7 token tabs to Svelte admin SPA
  > Bring the Svelte v2 admin SPA (SLASHED → Tokens (v2)) to functional parity with the legacy jQuery admin page (SLASHED → SLASHED), so the next PR can p
- **#106** — extract Token_Store / Token_Sanitizer / Tab_Registry helpers
  > Extracts the data-layer pieces of class-admin-page.php into three small, stateless helper classes so the Svelte SPA, the REST controller, and the lega
- **#108** — promote Svelte SPA to the primary admin slug
  > Promotes the Svelte SPA to the primary admin page (top-level "SLASHED" menu, slug slashed-bricks). Moves the legacy jQuery form behind an opt-in filte
- **#109** — remove the legacy jQuery admin page
  > Final PR of the migration: deletes the legacy jQuery admin page, the transitional opt-in filter, and the Slashed_Bricks_Admin_Page class entirely. The
- **#114** — bridge data-brx-theme to SLASHED theme system
  > Adds a CSS-only bridge in the Bricks integration plugin that maps Bricks' data-brx-theme attribute to SLASHED's theme system.
- **#116** — resolve REST 404 and add dark mode colors
  > Fixes three issues in the Svelte admin app:
- **#119** — add Export CSS button to admin panel
  > Adds a client-side CSS export feature to the Bricks admin panel so users can download a slashed-custom.css file containing only their non-default toke
- **#120** — remove dead constructor hook + document sanitizer contract
  > Follow-up to #116 (merged). Addresses two non-blocking review findings:
- **#122** — add CSS export functionality (rebased)
  > Rebased PR #119 (feat/export-css) onto current main (which now includes PRs #116, #117, #120). All merge conflicts resolved.
- **#124** — add reBEMer — subtree BEM class manager for the Bricks structure panel
  > - Five operation modes: Add, Rename, Replace, Add Modifier, Migrate ID styles.
- **#125** — reBEMer MVP — subtree BEM class manager
  > Stripped-down MVP of reBEMer: add/rename/replace BEM classes for an element and its children via the Bricks Builder structure panel.
- **#129** — natural-sort palette so -50 lands before -500 + reBEMer design refinements
  > Two related changes from this design-review pass:
- **#132** — hover-only badge that matches Bricks action-icon size
  > Three small fixes to the reBEMer badge in the Bricks structure panel:
- **#134** — CSS bundle selector in admin panel, remove legacy admin page
  > - Add css_bundle plugin setting (essential / optimal / full) so admins
- **#142** — Add token export/import and Bricks template workflow
  > - REST: GET /tokens/export returns all token overrides + plugin settings
- **#157** — REST validation, stale detection, and class hints
  > - REST validation endpoint — POST /slashed-bricks/v1/tokens/validate runs Token_Sanitizer on submitted values without saving; returns { section, sanit
- **#163** — include Google Fonts from Bricks font manager in Bricks tab
  > - The bricks-fonts REST endpoint was only probing bricks_custom_fonts (uploaded fonts) and bricks_adobe_fonts. Fonts added via Bricks > Settings > Goo
- **#164** — use title as family name fallback for Bricks custom fonts
  > Fonts added via Bricks > Settings > Custom Fonts (including Google Fonts downloaded for local serving) store the CSS family name only in title — no se
- **#170** — builder-agnostic CSS delivery and de-Bricks admin UI
  > SLASHED is a CSS framework, not a Bricks tool. This PR makes the core CSS delivery work on any WordPress site — custom theme, classic theme, or no pag
- **#171** — builder-agnostic architecture, global token infrastructure, Bricks CPT font fix
  > - Move token infrastructure to global includes/ — Slashed_Token_Store, Slashed_CSS_Generator, Slashed_CSS_Loader, Slashed_Token_Page, and REST control
- **#172** — builder-aware admin UI and fix Bricks Font Manager fonts in dropdown
  > - Fix Bricks Font Manager fonts missing in dropdown — fonts created via the new Font Manager start as post_status = 'draft' and were excluded by the p
- **#173** — Fix Bricks font tab always visible + WCAG oklch color resolution
  > - Bricks font tab always shows when the Bricks integration is enabled — the tab is no longer hidden if no fonts are registered yet; instead it shows a
- **#174** — Fix fatal error when opening Bricks editor (Slashed_Token_Page not found)
  > - Slashed_Token_Page::get_class_hints() is called from Slashed_Bricks_ReBEMer_Enqueue::enqueue() on the wp_enqueue_scripts hook — a frontend hook that
- **#176** — Gutenberg CSS bleed into Bricks editor + dark mode toggle + misc
  > - Bricks editor CSS bleed: Slashed_Gutenberg_Enqueue::enqueue_frontend_styles() lacked a bricks_is_builder_main() guard. In the unified plugin both in
- **#177** — Show class hints in Bricks editor
  > This PR implements "Show class hints" in the Bricks editor. When enabled in the SLASHED plugin settings, hovering over a SLASHED class (sf-* or is-*)
- **#178** — restore sf-container max-width overridden by Bricks generic selector
  > Bricks emits [class*=brxe-] { max-width: 100% } as unlayered author CSS. SLASHED's container classes live inside @layer slashed.layout, and unlayered
- **#180** — class documentation tooltips in builder
  > Completes the class documentation tooltips feature for the Bricks integration. All the data/admin/PHP plumbing already existed on main (generator → da
- **#182** — skip color-palette injection on Bricks 2.2+ Color Manager
  > Dark/light mode silently breaks for SLASHED colors in Bricks 2.2+. Bricks 2.2's new Color Manager materializes every color-palette entry into :root as
- **#184** — add color swatches to variable-picker dropdown
  > Restores colour swatches in the Bricks builder without re-introducing the dark-mode bug that #182 fixed. Closes the follow-up tracked in #183.
- **#189** — add missing *-strong status swatches to variable-picker hex map
  > The five status *-strong tokens appeared as plain text in the Bricks variable-picker dropdown while every other variant for the same family (-subtle,
- **#190** — complete color swatch coverage in variable picker
  > - Add hex entries for all 11 --sf-color-{family}-light source tokens (previously the resolver read them as inputs but never wrote them to the hex map,
- **#191** — Bricks swatch coverage + lightweight CSS normalize
  > - Add hex entries for all 11 --sf-color-{family}-light source tokens — the resolver read them as inputs but never wrote them to the hex map, leaving c
- **#193** — add in-builder Color System panel with light/dark preview
  > A floating Color System panel for the Bricks builder, launched from a
- **#195** — Add SF Colors button to Bricks colour fields for quick variable access
  > This PR adds a contextual "SF Colors" button to Bricks colour input fields, allowing users to quickly insert SLASHED color variables directly into any
- **#202** — SF Colors panel — pick flow, icon, and remove Color Manager palette injection
  > - Remove class-colors.php — the class injected SLASHED tokens into Bricks' Color Manager as static hex values, overriding the framework's adaptive lig
- **#206** — prevent focus-steal that closed border/box-shadow colour picker
  > For border and box-shadow controls, Bricks renders the colour input inside
- **#208** — SF colour panel broken for border/box-shadow + missing admin inputs
  > - SF colour panel — border/box-shadow fix: clicking a swatch closed the Bricks settings panel and showed "input not found" for border and box-shadow c
- **#212** — remove SF colour border/box-shadow fixes
  > - Reverts the three SF colour border/box-shadow fix commits (93da924, cafa170, 18303c0) that were introduced to handle event-ordering issues with Bric
- **#227** — lock framework classes by default in Class Manager
  > Adds a lock_framework_classes plugin setting (default: true) so all
- **#230** — emit brand `base` token in CSS export + color overrides; de-dupe font collector
  > Focused re-audit of plugins/SLASHED-for-WP. Most prior High/Medium audit items were already resolved (CSS-generator allowlist validation, slashed.php
- **#231** — Refresh Bricks fonts dropdown on mount via REST endpoint
  > Previously bricksFonts was a const read once from the PHP bootstrap
- **#238** — translate Bricks workflow to English, fix stale facts, trim redundancy
  > A documentation/comment cleanup pass across the repo: ensure everything is in English, fix factual claims that had drifted from the source, and trim g
- **#258** — Refactor bundle settings and improve Bricks font CPT handling
  > This PR refactors the CSS bundle selection UI, improves Bricks Font Manager CPT compatibility, and adds support for legacy color fallback tokens. The


---

## Development Summary

- **Framework**: 168 PRs
- **Plugins**: 54 PRs
- **Total**: 222 PRs
- **Versions**: 6 releases

**Version History**: v0.1.0 → v0.2.0 → v0.3.0 → v0.5.0 → v0.5.24

---

*Generated from 222 merged PRs*
*Last Updated: 2026-06-08*
