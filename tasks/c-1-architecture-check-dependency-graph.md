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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Script wired and documented
- [ ] Build passes
