## Summary

<!-- What does this change and why? -->

## Type

- [ ] fix
- [ ] feat
- [ ] docs
- [ ] chore / tooling

## Checklist

- [ ] Conventional Commit messages (`feat:`, `fix:`, `docs:`, …) — enforced by commitlint
- [ ] `npm run lint:css` passes (stylelint)
- [ ] `npm run build` rebuilds `dist/` (bundles are git-ignored; CI rebuilds and stamps headers)
- [ ] `npm test` passes (unit + Playwright e2e)
- [ ] Version references in sync if any version-related file changed (`npm run check:version`)
- [ ] LLM guide reviewed/updated if `core/*.css`, `optional/*.css`, or `token-registry.json` changed (`npm run check:llm-guide`)
- [ ] Generated artifacts regenerated, not hand-edited (`npm run check:macros`, `check:registry`, `audit:check`)
- [ ] `CHANGELOG.md` updated under `## [Unreleased]` (for user-facing changes)
- [ ] Breaking changes include migration docs

## Notes

<!-- Screenshots, manual testing, known limitations. -->
