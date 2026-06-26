# Source comment policy

SLASHED source CSS and generated bundles are implementation artifacts, not the primary API documentation surface.

## Rule

Keep comments in `core/*.css`, `optional/*.css`, and generated `badges/*.css` limited to:

- concise file headers with the module path, layer, purpose, prefix/API surface, and load-scope facts when useful;
- short section/category separators that identify what the following block contains;
- tooling directives that are required for linters or processors;
- machine-readable metadata comments when a repository script still consumes them to generate documentation.

Do not keep long-form API notes, recipes, browser-history explanations, token catalogs, or consumer-facing examples in source CSS. Move that information to the documentation files under `docs/` instead.

## Documentation homes

Use these files for material removed from source comments:

| Subject | Documentation target |
| --- | --- |
| Architecture and layer decisions | `docs/architecture.md` |
| Token API and token behavior | `docs/tokens.md`, `docs/token-index.md`, `docs/llm-guide.md` |
| Classes and class taxonomy | `docs/classes.md`, `docs/layout.md`, `docs/macros.md` |
| Components | `docs/components.md` |
| States, motion, and theming | `docs/states.md`, `docs/motion.md`, `docs/theming.md` |
| Migration or compatibility notes | `docs/migration.md` |

When a CSS change affects public tokens or classes, update the relevant documentation and review `docs/llm-guide.md` as required by `CLAUDE.md`.
