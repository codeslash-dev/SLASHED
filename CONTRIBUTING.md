# Contributing to SLASHED

Thanks for your interest! SLASHED is a build-free, token-first CSS framework.
This guide covers the workflow and the conventions the codebase enforces.

## Setup

```sh
npm ci                 # install dev tooling (stylelint, playwright, …)
npm run test:install   # one-time: install the Chromium test browser
```

There is **no build step for consumers** — `scripts/bundle.js` is a maintainer
convenience that concatenates `core/` + `optional/` into `dist/` bundles.

## Workflow

```sh
npm run build        # rebuild dist/ bundles
npm run watch        # rebuild on change
npm run lint:css     # stylelint (must pass)
npm run lint:css:fix # auto-fix
npm test             # Playwright regression suite (light + dark)
npm run docs:tokens  # regenerate docs/tokens.md from source
```

Before opening a PR: `npm run lint:css && npm run build && npm test` must all
be green, and `dist/` must be rebuilt and committed.

## Conventions (enforced)

- **Custom properties** must start with `--sf-` (stylelint
  `custom-property-pattern`). **Keyframes** must start with `sf-`.
- **Tokens, not literals.** Every value in `base`/`layout`/`components`/etc.
  goes through `var(--sf-*)`. Colours use `oklch()` (modern notation) with
  relative colour syntax for derived values.
- **Layers.** Every rule lives in its `@layer` (see `core/layers.css`). Keep
  selectors low-specificity (single class, element, `:root`).
- **`.is-*` is reserved** for runtime state classes only (the `slashed.states`
  layer) — never for utilities or variants.
- **Public vs internal tokens.** Label new tokens in the file header
  (PUBLIC / PUBLIC-ADVANCED / INTERNAL). Keep alias chains ≤2 indirections
  (3 nodes max: per-primitive → layout-system → canonical source); don't
  introduce duplicate/dangling/cyclic aliases.
- **Scope of `base`.** Global base styles cover flow/inline text only. Rich
  blocks belong in `.sf-prose`; widgets and form controls are opt-in/component
  territory (see [architecture.md](docs/architecture.md)).

## Tests & demo coverage

- Any new `.sf-*` or `.is-*` class in `core/*.css` must appear in
  `docs/demo.html` — `tests/coverage.spec.js` enforces it.
- Any new token must resolve in both themes — `tests/tokens.spec.js`. Tokens
  whose value is `inherit` go in that file's `EXPECTED_EMPTY` allowlist.
- Prefer adding a focused assertion when you fix a bug.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, `docs:`, …) — `commitlint` runs via git hooks, and
`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/).

## Scope

SLASHED deliberately rejects some additions (utility-class proliferation, a 7th
brand colour, pre-compiled themes, decorative token bloat). If you're proposing
a sizeable feature, open an issue first to check it fits the philosophy.
