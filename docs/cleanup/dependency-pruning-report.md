# Dependency Pruning Report (Task 6-9b)

**Date:** 2026-02-20  
**Scope:** `knip.config.ts`, workspace dependency audit, stale reference cleanup alignment.

## What was executed

- Ran `pnpm knip` to collect unused files/dependencies/exports signal.
- Refined `knip.config.ts` to better model this monorepo layout:
  - Explicit workspace coverage for root, `packages/**`, `clients/*`, and `tooling/*`.
  - Added concrete `entry`/`project` patterns to reduce broad false positives.
  - Added `docs/templates/**` to ignored files.
  - Removed stale ignore file patterns for legacy eslint/jest setup files.

## Current knip status

`pnpm knip` still reports many findings (expected at current migration stage), including:

- Unused files across scaffolded packages and component families.
- Unused dependencies (notably `eslint` in many package-level manifests due to per-package config strategy).
- Unused exports in selected packages.
- 2 unresolved imports from tsconfig typing context (`react`, `react-dom` in `packages/types/tsconfig.json`).

## Assessment

- No **critical** runtime blocker was introduced by this task.
- Findings are primarily migration/scaffolding debt and should be addressed iteratively by package owners.
- Knip output is now better aligned with actual workspace boundaries, improving future pruning passes.

## Recommended next pass

1. Triage knip output into:
   - **Must-fix now**: broken exports / runtime risks.
   - **Can defer**: scaffolded-but-not-yet-wired files.
2. Remove or wire highest-confidence unused exports in `packages/page-templates` and `packages/integrations`.
3. Re-run `pnpm knip` after each wave and track delta in this report.
