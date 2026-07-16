# scripts/ conventions

## Error handling (SL-008)

No single convention is enforced — each script picks whichever fits its
failure mode, and that's intentional at the current script count (each is a
single, independently-invoked CI-gate job, not a shared library):

- **`throw new Error(...)`** — for conditions the caller (another script's
  `import`, or `npm run docs`'s pipeline) should be able to catch, or that
  indicate a genuinely broken invariant (`bundle.js`'s unbalanced `@layer`
  block, `version-sync.js`'s pattern-not-found).
- **`console.error(...)` + `process.exit(1)`** — the CI-gate scripts
  (`check-*.js`, `audit.js --check`), where the failure is meant to print a
  human-readable diagnosis and stop the pipeline, not be caught.
- **Bare `catch { ... }`** (no rethrow) — best-effort operations where
  failure is an expected, non-fatal branch (e.g. "file doesn't exist yet,
  fall back to a default").

Revisit this if the script count grows enough that the inconsistency itself
becomes confusing; not worth enforcing for ~27 independent scripts.

## CLI flag parsing (SL-009)

Every script hand-rolls `process.argv.includes('--flag')` checks; there's no
shared arg-parsing helper or `--help` output. Fine at the current ~1-2
flags per script — revisit if any script's flag count grows past that.

## Environment variables (SL-011)

| Var | Read by | Purpose |
|---|---|---|
| `SLASHED_ROOT` | `version-sync.js` + the `check-*.js` gates (e.g. `check-version-sync.js`, `check-llm-guide.js`, `check-doc-refs.js`, `check-layer-order.js`, `check-release-add-list.js`) | Override the repo root (test-only — lets a check's test suite point at a fixture tree instead of the real repo). |
| `GITHUB_REF`, `GITHUB_REF_NAME` | `bundle.js` | CI-only — used to detect whether the current run is on a release tag, for badge-stamping. |
| `GITHUB_BASE_REF` | `check-token-registry.js` | CI-only — the PR's target branch, used to diff the registry against the base ref instead of just the working tree. |

## `execSync(cmd, { shell: true })` (SL-013)

`check-artifacts.js`'s `run()` helper and `changelog-release.js` both shell
out with a command string. In both cases `cmd` is either a hardcoded git
command or sourced from `scripts/artifacts.json`, a repo-committed config
file — not attacker-controlled input today. The pattern does grant full
shell execution to whatever string ends up in `artifacts.json`'s
`buildCmd` field, though, so treat new entries there with the same care as
any other code change, not as inert config.
