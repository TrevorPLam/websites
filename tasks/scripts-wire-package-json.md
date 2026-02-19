# Wire Scripts to package.json

## Metadata

- **Task ID**: scripts-wire-package-json
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL scripts
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: Scripts exist in scripts/
- **Downstream Tasks**: CI, developer workflow

## Context

Add scripts to root package.json so the following are runnable via pnpm: architecture/check-dependency-graph, ci/report-cache-hit-rate, governance/validate-schema-versioning, perf/validate-budgets, reliability/check-error-budget, strategy/calculate-leverage-score, operations/spc-control-charts. Many scripts exist but are not wired.

## Dependencies

- **Upstream Task**: Scripts exist in scripts/ subdirectories

## Cross-Task Dependencies & Sequencing

- **Upstream**: Scripts exist
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: CI jobs, docs

## Research

- **Primary topics**: [R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding). THEGOAL scripts section.
- **[2026-02] Script wiring**: Root package.json scripts call tsx/node for scripts/; consistent names (script:check-deps, script:cache-report, etc.); document in README.
- **References**: [RESEARCH-INVENTORY.md – R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `package.json` – modify – Add script entries
- `scripts/architecture/check-dependency-graph.ts` – reference
- `scripts/ci/report-cache-hit-rate.ts` – reference
- `scripts/governance/validate-schema-versioning.ts` – reference
- `scripts/perf/validate-budgets.ts` – reference
- `scripts/reliability/check-error-budget.ts` – reference
- `scripts/strategy/calculate-leverage-score.ts` – reference
- `scripts/operations/spc-control-charts.ts` – reference

## Acceptance Criteria

- [ ] pnpm script:check-deps (or similar) runs check-dependency-graph
- [ ] pnpm script:cache-report runs report-cache-hit-rate
- [ ] pnpm script:validate-schema runs validate-schema-versioning
- [ ] pnpm script:validate-budgets runs validate-budgets
- [ ] pnpm script:check-error-budget runs check-error-budget
- [ ] pnpm script:leverage-score runs calculate-leverage-score
- [ ] pnpm script:spc-charts runs spc-control-charts
- [ ] All scripts execute successfully (or document dependencies)

## Technical Constraints

- Scripts may need tsx or node to run
- Some scripts may have external dependencies (e.g. Redis for cache report)

## Implementation Plan

- [ ] Audit each script for runnability
- [ ] Add package.json entries with consistent naming
- [ ] Document in README or docs

## Sample code / examples

- **package.json**: Add entries like `"script:check-deps": "tsx scripts/architecture/check-dependency-graph.ts"`, `"script:cache-report": "tsx scripts/ci/report-cache-hit-rate.ts"`, etc. Use tsx for .ts scripts.

## Testing Requirements

- Run each new script; fix or document failures

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All scripts wired and documented
- [ ] README updated
