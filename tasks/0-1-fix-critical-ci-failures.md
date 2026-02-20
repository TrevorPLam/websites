# 0-1 Fix Critical CI Failures (Make CI Green)

## Metadata

- **Task ID**: 0-1-fix-critical-ci-failures
- **Owner**: AGENT
- **Priority / Severity**: P0
- **Target Release**: Pre-Phase (Week 0) — must complete before all other work
- **Related Epics / ADRs**: ROADMAP Pre-Phase
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: 0-2, 0-3, evol-1, all Phase 1+ work

## Context

CI must be green before any substantial work can be merged. This task fixes blocking TypeScript errors, build failures, and test failures that prevent the evolution from proceeding. Per [ROADMAP](../ROADMAP.md) § Organic Evolution Pre-Phase — unblocks all merges.

## Dependencies

- None — this is the first Pre-Phase task

## Research

- **2026-02** — CI must pass before merge; standard monorepo practice. Turbo affected builds; pnpm workspace resolution. References: [ROADMAP](../ROADMAP.md) Pre-Phase, [TASKS.md](TASKS.md).

## Related Files

- `.github/workflows/ci.yml` — CI pipeline
- All packages with type-check, build, or test failures
- `pnpm type-check`, `pnpm build`, `pnpm test` output

## Acceptance Criteria

- [ ] `pnpm type-check` passes with zero errors
- [ ] `pnpm build` passes for all packages (or documented exclusions)
- [ ] `pnpm test` passes (or documented known failures with tickets)
- [ ] CI workflow (ci.yml) is green on main/develop
- [ ] No blocking lint errors (`pnpm lint`)

## Technical Constraints

- Fix root causes; avoid `// @ts-ignore` or skipping tests without justification
- Document any known non-blocking issues in ISSUES.md or TASKS.md
- CI gates: lint, type-check, validate-exports, build, test

## Sample Code

```bash
# Reproduce failures
pnpm type-check
pnpm build
pnpm test
pnpm lint
pnpm validate-exports

# After fixes, CI should pass
```

## Implementation Plan

1. Run `pnpm type-check` — identify and fix TypeScript errors
2. Run `pnpm build` — fix build failures (transpilePackages, exports, etc.)
3. Run `pnpm test` — fix failing tests or document as known issues
4. Run `pnpm lint` — fix blocking lint errors
5. Run `pnpm validate-exports` — fix export map issues
6. Push and verify CI is green
7. Document any remaining non-blocking issues

## Testing Requirements

- CI workflow runs successfully on push
- `pnpm type-check` exits 0
- `pnpm build` exits 0
- `pnpm test` exits 0 (or documented exemptions)
- `pnpm validate-exports` exits 0

## Definition of Done

- [ ] Code reviewed and approved
- [ ] CI green on target branch
- [ ] All Pre-Phase downstream tasks (0-2, 0-3) unblocked for merge
