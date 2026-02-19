# C.1 Architecture check-dependency-graph

## Metadata

- **Task ID**: c-1-architecture-check-dependency-graph
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.1]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: CI, scripts-wire

## Context

Wire and document scripts/architecture/check-dependency-graph.ts. Detects circular dependencies and layer violations. Script may exist; ensure it runs via pnpm and is documented in docs/architecture/dependency-graph.md.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: CI, scripts-wire

## Research

- **Primary topics**: [R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), [docs/architecture/module-boundaries.md](../docs/architecture/module-boundaries.md).
- **[2026-02] Layer rules**: clients/ must not import clients/; packages must not import clients; circular deps forbidden. Script detects both.
- **References**: [CLAUDE.md](../CLAUDE.md) (dependency direction), [docs/architecture/dependency-graph.md](../docs/architecture/dependency-graph.md).

## Related Files

- `scripts/architecture/check-dependency-graph.ts` – modify or verify
- `docs/architecture/dependency-graph.md` – modify – Document usage
- `package.json` – modify – Wire script (or via scripts-wire task)

## Acceptance Criteria

- [ ] Script detects circular dependencies
- [ ] Script detects layer violations (e.g. clients importing clients)
- [ ] Runnable via pnpm (e.g. pnpm script:check-deps)
- [ ] Documented in docs/architecture/dependency-graph.md

## Implementation Plan

- [ ] Verify script exists and works
- [ ] Wire to package.json
- [ ] Document
- [ ] Add to CI optional or required step

## Sample code / examples

- **package.json**: `"script:check-deps": "tsx scripts/architecture/check-dependency-graph.ts"`. Script: walk dependency graph; detect cycles and layer violations (e.g. clients→clients); exit 1 on violation.

## Testing Requirements

- Run the wired script; verify it fails on a deliberate violation and passes on clean graph.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Script wired and documented
- [ ] Build passes
