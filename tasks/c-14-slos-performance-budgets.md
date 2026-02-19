# C.14 SLOs and Performance Budgets

## Metadata

- **Task ID**: c-14-slos-performance-budgets
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.14]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Performance gates

## Context

Wire scripts/perf/validate-budgets.ts as CI gate. Define SLOs (LCP, INP, CLS) and performance budgets. Document in docs/performance/slo-definition.md. THEGOAL [C.14].

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Related Files

- `scripts/perf/validate-budgets.ts` – modify or create
- `docs/performance/slo-definition.md` – create or update
- `package.json` – modify – Wire script
- CI workflow – modify – Add budget check (optional gate)

## Acceptance Criteria

- [ ] validate-budgets runs against build output or Lighthouse
- [ ] Budgets defined for: LCP, INP, CLS, bundle size (optional)
- [ ] SLO document defines targets
- [ ] Runnable via pnpm
- [ ] CI integration (optional, non-blocking initially)

## Implementation Plan

- [ ] Implement or refine validate-budgets
- [ ] Define budget thresholds
- [ ] Document SLOs
- [ ] Wire to package.json and optionally CI

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Budget validation works
- [ ] Documentation updated
- [ ] Build passes
