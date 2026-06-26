---
layout: default
title: Home
---

# SLASHED

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**xplicit · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.
Current version: **0.6.16** · [Changelog](/CHANGELOG) · [GitHub](https://github.com/codeslash-dev/SLASHED) · [npm](https://www.npmjs.com/package/slashed)

---

## Configurators

| Tool | Description |
|------|-------------|
| [**Configurator v2**](/configurator/) | Svelte 5 SPA — configure all 686 tokens, live preview, shareable URLs, export override CSS |
| [**Configurator v1** (source archive)](https://github.com/codeslash-dev/SLASHED/tree/main/configurator-archive) | Legacy v1 configurator source — archived on GitHub, not deployed |

---

## Demo & test pages

| Page | Description |
|------|-------------|
| [**Demo**](/docs/demo.html) | Full component showcase with all built-in utilities and layout primitives |
| [**Test Coverage index**](/docs/test-coverage.html) | Visual regression coverage suite index |
| [Colors](/docs/test-coverage-1-colors.html) | Color token coverage |
| [Typography](/docs/test-coverage-2-typography.html) | Typography token coverage |
| [Layout](/docs/test-coverage-3-layout.html) | Layout primitives coverage |
| [Macros & States](/docs/test-coverage-4-macros-states.html) | Macro and state class coverage |
| [Forms & Features](/docs/test-coverage-5-forms-features.html) | Forms and accessibility features coverage |
| [Token Reference](/docs/test-coverage-6-token-reference.html) | Token reference coverage |

---

## Install

```css
/* jsDelivr CDN */
@import "https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css";
```

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css">
```

| Bundle | What's included |
|--------|-----------------|
| `slashed.optimal.css` | Core + classless forms (recommended) |
| `slashed.optimal-components.css` | Optimal + component stubs |
| `slashed.optimal-utilities.css` | Optimal + utility classes |
| `slashed.full.css` | Everything |

[All CDN bundles on jsDelivr](https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/) · [GitHub Releases](https://github.com/codeslash-dev/SLASHED/releases) · [npm](https://www.npmjs.com/package/slashed)

---

## Documentation

### Guides

- [Architecture](/docs/architecture) — layer order, cascade model, design decisions, bundle structure
- [Theming](/docs/theming) — custom themes, dark mode, contrast overrides, fluid type and spacing engine
- [Migration](/docs/migration) — upgrade guides across versions
- [Roadmap](/docs/roadmap) — post-v1.0 planned features

### Reference

- [Tokens](/docs/tokens) — full design token reference with defaults (686 tokens)
- [Token Index](/docs/token-index) — browseable token index
- [Classes](/docs/classes) — all shipped utility and macro classes (232 classes)
- [Layout](/docs/layout) — grid, flex, spacing utilities
- [Macros](/docs/macros) — macro/recipe classes: prose, flow, truncate, aspect, scroll-shadow
- [States](/docs/states) — state classes (`.is-*`) and ARIA mapping
- [Motion](/docs/motion) — animation and transition tokens, reduced-motion handling
- [Components](/docs/components) — component class stubs and post-v1.0 roadmap

### Developer & meta

- [LLM Guide](/docs/llm-guide) — authoritative reference for AI-assisted development with SLASHED
- [API Index](/docs/api-index) — machine-readable catalogue of all 918 framework elements
- [Source Comment Policy](/docs/source-comment-policy) — comment conventions for contributors

---

## Project files

- [Changelog](/CHANGELOG) — release notes for all versions
- [Full Changelog](/CHANGELOG_FULL) — extended history
- [Contributing](/CONTRIBUTING) — development setup, conventions, and PR process
- [Configurator README](https://github.com/codeslash-dev/SLASHED/blob/main/configurator-archive/README.md) — Svelte configurator architecture and features
- [Configurator Roadmap](https://github.com/codeslash-dev/SLASHED/blob/main/configurator-archive/ROADMAP.md) — planned configurator UI/UX features
- [GitHub repository](https://github.com/codeslash-dev/SLASHED)
- [CI status](https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml)
