/**
 * Commit-message linting (Conventional Commits + light project tweaks).
 *
 * `header-max-length` is bumped from the conventional default (100) to 120
 * so an unusually descriptive feature subject — e.g. one that lists the
 * domains it touches — has a little headroom without resorting to a
 * per-commit `ignores` exception. 120 still fits comfortably in GitHub's
 * commit list view (which truncates around 130–140) and in Git's default
 * pager width, so reviewability is preserved.
 *
 * Every other rule (body line length, blank-line, type, scope, etc.) keeps
 * the conventional default — long bodies still wrap at 100, types are still
 * enum-checked, and merge commits remain auto-ignored.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 120],
  },
};
