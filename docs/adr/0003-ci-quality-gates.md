# ADR 0003: Strengthen CI Quality Gates

**Status:** Accepted  
**Date:** 2026-02-14  
**Task:** 0.13

## Context

The monorepo CI workflow ran a single job with mixed blocking and non-blocking steps. There was no clear mapping to branch protection rules, no affected-package optimization for PRs, and no nightly full-repo validation. PR checks could run the full pipeline even when only one package changed, slowing feedback. There was no safety net for drift that PR-level runs might miss.

## Decision

1. **Split into two jobs:**
   - `quality-gates` (blocking): lint, type-check, validate-exports, syncpack, build, test. Must pass before merge.
   - `quality-audit` (informative): knip, SBOM, pnpm audit. Runs in parallel; failures do not block merge.

2. **Affected-package optimization for PRs:** On `pull_request` events, turbo commands use `--filter="...[origin/main]"` to run only on packages with changes between the PR branch and the target branch. On `push` to main/develop, run full pipeline (no filter).

3. **Nightly full-repo workflow:** New `nightly.yml` runs daily at 02:00 UTC and on `workflow_dispatch`. Executes full lint, type-check, build, test across all packages with no affected filter.

4. **Branch protection mapping:** Document the required check name `quality-gates` in `docs/ci/required-checks.md` for branch protection configuration.

5. **Fetch depth:** Keep `fetch-depth: 0` for turbo's affected-package git comparison.

## Consequences

### Positive

- Clear pass/fail: only `quality-gates` blocks merge.
- Faster PR feedback via affected-package runs when changes are localized.
- Nightly catches transitive and config-level drift.
- OWASP-aligned: dependency scan (supply chain), SBOM (visibility).
- Single source of truth for required checks.

### Neutral

- `turbo run test` not used; root `pnpm test` (Jest) runs full suite. Turbo's test task exists for packages that add per-package test scripts later.

### Risks

- Fork PRs: `origin/main` may resolve differently; affected filter might behave unexpectedly. Mitigation: document same-repo assumption; full run on push to main.
- Audit job runs even when quality-gates fails; acceptable for visibility.

## References

- `docs/ci/required-checks.md`
- `.github/workflows/ci.yml`
- `.github/workflows/nightly.yml`
- [Turborepo Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/)
