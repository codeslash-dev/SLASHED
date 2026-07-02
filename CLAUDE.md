# CLAUDE.md — AI developer guide for SLASHED

## Version synchronisation — MANDATORY

SLASHED has **one version number**. It must be identical in every artifact.
If you touch anything version-related, you are responsible for keeping all
of these in sync:

| File | Field |
|------|-------|
| `package.json` | `.version` ← **source of truth** |
| `package-lock.json` | `.version` + `.packages[""].version` |
| `docs/roadmap.md` | `Current version: **X.Y.Z**` line |
| `configurator/package.json` | `.version` |
| `configurator/package-lock.json` | `.version` + `.packages[""].version` |
| `badges/*.css` (unminified) | `/* SLASHED vX.Y.Z */` comment header |
| Configurator UI version pill | baked in via Vite `__SLASHED_VERSION__` at build time |

**Never edit version numbers by hand.** Use `npm version` then the sync script:

```bash
npm version <new-version> --no-git-tag-version   # bump the source of truth
npm run version-sync                              # propagates to all files above
npm run check:version                             # must pass — CI fails if it doesn't
npm run build                                     # rebuilds badges/ with stamped headers
```

If you are not bumping the version but you touch any of the files in the table
above, still run `npm run check:version` before committing to confirm nothing
has drifted.

## Configurator — always in sync with the framework

The `configurator/` package is private and internal. Its version must always
equal the root framework version. `npm run version-sync` handles this
automatically — but if you ever edit `configurator/package.json` directly
for any reason, immediately re-run `npm run version-sync` and
`npm run check:version`.

The version shown in the configurator UI (`v{frameworkVersion}`) is injected
at **Vite build time** from the root `package.json` via `__SLASHED_VERSION__`
(see `configurator/vite.config.js`). It does NOT come from
`configurator/package.json` at runtime. This means: a correct UI version
requires a rebuild+redeploy, not just a file edit.

## Key scripts

| Command | What it does |
|---------|-------------|
| `npm run build` | Build all CSS bundles + docs + sync configurator API |
| `npm run version-sync` | Sync all version references to root `package.json` |
| `npm run check:version` | Verify all version references match (CI gate — run before every commit that touches versions) |
| `npm run check:llm-guide` | Verify `docs/llm-guide.md` only references live tokens (CI gate) |
| `npm run check:macros` | Verify `.sf-*` macro classes match `docs/macros.md` (CI gate) |
| `npm run check:registry` | Verify `token-registry.json` is in sync with source (CI gate) |
| `npm run audit:check` | Verify `docs/registry.json` matches source without writing (CI gate) |
| `npm run lint:css` | Lint all CSS source with stylelint (CI gate) |
| `npm run lint:css:fix` | Lint CSS source and auto-fix violations |
| `npm run docs` | Regenerate docs and sync configurator API index |
| `npm run docs:tokens` | Regenerate `docs/tokens.md` only |
| `npm run docs:index` | Regenerate `docs/token-index.md` + `.json` only |
| `npm run docs:api` | Regenerate `docs/api-index.md` + `.json` only |
| `npm run docs:classes` | Regenerate `docs/classes.md` only |
| `npm run gen:registry` | Regenerate `token-registry.json` (stable id assignments) |
| `npm run configurator:sync` | Push `docs/api-index.json` → `configurator/src/data/api-index.generated.json` |
| `npm run audit` | Audit CSS tokens for consistency, writing `docs/registry.json` |
| `npm run watch` | Rebuild CSS bundles on file change (dev watch mode) |
| `npm run test:unit` | Run the Node `--test` unit suite only, without the Playwright e2e build |
| `npm test` | Full suite: build → unit → Playwright e2e |

## Release process

Releases are handled by `release-it` (`.release-it.json`). The hooks run
`version-sync` and `build` automatically after bumping.

```bash
npm run release          # patch bump (default)
npm run release:minor    # minor bump
npm run release:major    # major bump
```

After the tag is pushed, GitHub Actions (`release.yml`) does the rest:
1. Builds and publishes the GitHub Release with dist bundles
2. Syncs all version artifacts to `main`
3. Dispatches `deploy-configurator.yml` to redeploy the configurator app
4. Dispatches `publish-dist.yml` to update the dist branch

**Do not manually trigger partial steps** of this pipeline — run the full
`npm run release` so nothing ends up out of sync.

## CSS architecture

- Source lives in `core/` (required) and `optional/` (opt-in).
- `scripts/bundle.js` concatenates and builds `badges/`.
- Every unminified dist bundle is stamped with `/* SLASHED vX.Y.Z ... */`.
- The stamp version must match `package.json` — `release.yml` verifies this
  before publishing the GitHub Release.

## LLM guide sync — MANDATORY

`docs/llm-guide.md` is the authoritative LLM reference for the framework API.
It must stay in sync with the live token set. The CI gate `check:llm-guide`
enforces this mechanically — but the gate only catches **renamed or deleted
tokens**. You are responsible for the qualitative layer:

**Any PR that touches `core/*.css`, `optional/*.css`, or `token-registry.json`
must also review `docs/llm-guide.md` and update it if needed.**

Changes that always require a guide update:
- New PUBLIC or PUBLIC-ADVANCED token added → add it to the relevant section
- Token renamed or deleted → the CI gate will catch stale refs; fix them
- New token role, tier, or behaviour documented in a token's description

Changes that may require a guide update:
- Default value changed for a widely-used knob
- New layout primitive or macro added
- New browser support floor or feature gating change

After any token-touching PR, verify with:

```bash
npm run check:llm-guide   # must pass — CI fails if it doesn't
```

## Tests

```bash
npm test              # full suite (requires built dist — runs build automatically via pretest)
npm run test:install  # install Playwright browsers (first time only)
```

Do not skip the pretest build step. Tests import from `badges/` and will fail
with stale bundles.
