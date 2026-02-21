# ADR 0002: Module Boundary Enforcement via ESLint

**Status:** Accepted  
**Date:** 2026-02-14  
**Task:** 0.11

## Context

The monorepo lacked formal enforcement of import boundaries. Templates could theoretically import from other templates' internals, packages could use deep internal paths (`@repo/ui/src/Button`), and relative paths could escape package boundaries. This risks architecture drift and makes refactoring unsafe.

## Decision

1. **Document the dependency matrix** in `docs/architecture/module-boundaries.md` — explicit allowed/blocked directions between templates, packages, and @repo/\*.
2. **Add `@repo/infra` export** — `./env` → `./env/index.ts` (was missing; hair-salon imports from `@repo/infra/env`).
3. **Configure ESLint `no-restricted-imports`** — shared `boundaries.js` rule config merged into `@repo/eslint-config` (next.js and library.js).
4. **Blocked patterns:**
   - `@repo/*/src` and `@repo/*/src/*` — deep internal imports; use package public API.
   - `**/packages/**` and `**/templates/**` — relative cross-boundary imports; use @repo/\* workspace protocol.

## Consequences

### Positive

- Lint fails on boundary violations; CI catches drift.
- Single source of truth (module-boundaries.md) for allowed imports.
- No new runtime dependencies; uses built-in ESLint rule.
- Forward-compatible: add more patterns when packages/features/\* exists.

### Neutral

- Existing imports comply; no migration required.
- Pre-existing lint/type-check failures in @repo/utils, @repo/integrations remain (out of scope).

### Risks

- `**/packages/**` could theoretically match external package paths (e.g. `some-pkg/packages/foo`); low probability.
- Future multi-template setup may need per-template allowlists for `**/templates/**`.

## References

- `docs/architecture/module-boundaries.md`
- `packages/config/eslint-config/boundaries.js`
- [ESLint no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)
