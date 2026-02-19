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

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: Performance gates

## Research

- **Primary topics**: [R-PERF](RESEARCH-INVENTORY.md#r-perf-lcp-inp-cls-bundle-budgets), [R-ERROR-BUDGET](RESEARCH-INVENTORY.md#r-error-budget-error-budgets-slos-release-gates). THEGOAL [C.14].
- **[2026-02] SLOs**: LCP, INP, CLS targets; validate-budgets script; bundle size optional; docs/performance/slo-definition.md.
- **References**: [RESEARCH-INVENTORY.md – R-PERF](RESEARCH-INVENTORY.md#r-perf-lcp-inp-cls-bundle-budgets), [THEGOAL.md](../THEGOAL.md).

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

## Sample code / examples

- **validate-budgets.ts**: Read build output or run Lighthouse; compare LCP/INP/CLS to thresholds; exit 1 on breach. Document in slo-definition.md.

## Testing Requirements

- Run script; confirm it passes/fails as expected; build pass.

## Execution notes

- **Related files — current state:** SLOs and performance budgets — docs and/or CI (e.g. perf/validate-budgets script). R-PERF; LCP, INP, CLS, bundle budgets.
- **Potential issues / considerations:** Wire to scripts-wire task; document in docs/architecture or reliability.
- **Verification:** Budget checks run; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Budget validation works
- [ ] Documentation updated
- [ ] Build passes
