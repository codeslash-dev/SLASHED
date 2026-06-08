# Contributing to SLASHED

Conventions below are enforced by stylelint, tests, and git hooks.

## Setup

```sh
npm ci                 # install dev tooling
npm run test:install   # one-time: install the Chromium test browser
```

There is no build step for consumers — `scripts/bundle.js` concatenates `core/`
+ `optional/` into `dist/` bundles for maintainers.

## Workflow

```sh
npm run build        # rebuild dist/ bundles
npm run watch        # rebuild on change
npm run lint:css     # stylelint (must pass)
npm run lint:css:fix # auto-fix
npm test             # Playwright regression suite (light + dark)
npm run docs:tokens  # regenerate docs/tokens.md from source
```

Before opening a PR: `npm run lint:css && npm run build && npm test` must pass,
and `dist/` must be rebuilt and committed.

## Conventions (enforced)

- **Custom properties** start with `--sf-`; **keyframes** start with `sf-`.
- **Tokens, not literals.** Every value in `base`/`layout`/`components`/etc. goes
  through `var(--sf-*)`. Colours use `oklch()` with relative colour syntax for
  derived values.
- **Layers.** Every rule lives in its `@layer` (see `core/layers.css`). Keep
  selectors low-specificity (single class, element, `:root`).
- **`.is-*` is reserved** for runtime state classes (the `slashed.states` layer)
  — never utilities or variants.
- **Public vs internal tokens.** Label new tokens in the file header (PUBLIC /
  PUBLIC-ADVANCED / INTERNAL). Keep alias chains ≤2 indirections (3 nodes max);
  no duplicate/dangling/cyclic aliases.
- **Scope of `base`.** Global base covers flow/inline text only. Rich blocks
  belong in `.sf-prose`; widgets and form controls are opt-in/component territory
  (see [architecture.md](docs/architecture.md)).

## Tests & demo coverage

- Any new `.sf-*` or `.is-*` class in `core/*.css` must appear in `docs/demo.html`
  (`tests/coverage.spec.js`).
- Any new token must resolve in both themes (`tests/tokens.spec.js`); tokens whose
  value is `inherit` go in that file's `EXPECTED_EMPTY` allowlist.
- Add a focused assertion when you fix a bug.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/) — `commitlint`
runs via git hooks. `CHANGELOG.md` follows
[Keep a Changelog](https://keepachangelog.com/).

## Releasing

`CHANGELOG.md` is maintained by hand; the release pipeline reads the matching
`## [x.y.z]` section.

1. Move accumulated `## [Unreleased]` entries under a new `## [x.y.z] - YYYY-MM-DD`
   heading; leave a fresh empty `## [Unreleased]`.
2. Run `npm run release` (patch), `npm run release:minor`, or
   `npm run release:major`. This bumps `package.json`, runs
   `scripts/version-sync.js` (propagates the version to `docs/roadmap.md`),
   rebuilds bundles, commits, tags, and pushes.
3. The pushed tag triggers `release.yml` (GitHub Release + dist assets) and
   re-aligns version references on main. The `dist` branch is published by
   `publish-dist.yml` on every push to main.

## Scope

SLASHED rejects some additions (utility-class proliferation, a 7th brand colour,
pre-compiled themes, decorative token bloat). Open an issue first for sizeable
features.
