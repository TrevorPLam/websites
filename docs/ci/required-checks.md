# Required CI Checks — Branch Protection Mapping

**Last Updated:** 2026-02-14  
**Task:** 0.13  
**Related:** `docs/tooling/turborepo.md`, `docs/architecture/module-boundaries.md`

> **Note:** As of 2026-02-14, the pipeline structure is in place. Pre-existing lint failures (@repo/utils ESLint config) and env schema test failures (NODE_ENV, URL validation) cause CI to fail. These are tracked separately and do not block Task 0.13 completion.

---

## Overview

This document defines the CI quality gates and their mapping to GitHub branch protection rules. Configure **Settings → Branches → Branch protection rules** to require these checks before merge.

## Required Check Names

| Check Name     | Workflow | Job            | Purpose                                |
|---------------|----------|----------------|----------------------------------------|
| **quality-gates** | CI       | quality-gates  | Blocking: lint, type-check, build, test |

**Branch protection configuration:**
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Status checks to require: **quality-gates**

## Pipeline Structure

### Blocking (must pass)

| Step           | Command                    | Notes                                              |
|----------------|----------------------------|----------------------------------------------------|
| Lint           | `pnpm turbo run lint`      | Module boundaries, ESLint                           |
| Type check     | `pnpm turbo run type-check`| TypeScript strict                                  |
| Validate exports | `pnpm validate-exports`  | Package.json exports resolve to files               |
| Syncpack       | `pnpm syncpack:check`      | Dependency version consistency                     |
| Build          | `pnpm turbo run build`    | All packages build                                 |
| Test           | `pnpm test`                | Root Jest (full monorepo suite)                    |

### Non-blocking (informative)

| Step      | Command    | Notes                               |
|-----------|------------|-------------------------------------|
| Knip      | `pnpm knip`| Dead code, unused exports           |
| SBOM      | anchore/sbom-action | Supply chain visibility      |
| pnpm audit| Dependency scan | Vulnerability detection      |

## Affected Package Optimization

**PRs (pull_request event):** Turbo runs use `--filter="...[origin/main]"` to execute only on packages with changes between the PR branch and the target branch. This reduces CI time for smaller PRs.

**Push to main/develop:** Full pipeline runs (no filter) to validate the merged state.

**Nightly workflow:** Full pipeline runs daily at 02:00 UTC across all packages. Catches drift that PR-level runs might miss.

## Quick Reference

```bash
# Local: replicate CI quality gates
pnpm install
pnpm turbo run lint type-check build
pnpm validate-exports
pnpm syncpack:check
pnpm test

# Exit gate (Wave 0)
pnpm install && pnpm turbo run lint type-check build && pnpm validate-exports && pnpm syncpack:check && pnpm test
```

## Adding New Packages

When adding a new workspace package:

1. Add `lint` and `type-check` scripts to its `package.json`
2. Add `build` if it produces distributable output
3. Add `test` if it has tests (or extend root Jest `collectCoverageFrom`)
4. Ensure `turbo.json` defines the task (or uses defaults)
5. Run full pipeline locally before PR

## References

- `.github/workflows/ci.yml` — Main CI workflow
- `.github/workflows/nightly.yml` — Full nightly run
- `turbo.json` — Task definitions and cache config
