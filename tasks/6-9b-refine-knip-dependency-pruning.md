# 6-9b Refine knip.config and Dependency Pruning

## Metadata

- **Task ID**: 6-9b-refine-knip-dependency-pruning
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: 6-9 dead code
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6-9
- **Downstream Tasks**: 6-9 complete

## Context

Refine knip.config.ts for dead code detection; run dependency pruning. Remove unused exports, unused dependencies. docs/cleanup/dependency-pruning-report.md may inform work.

## Dependencies

- **Upstream Task**: 6-9

## Related Files

- `knip.config.ts` – modify
- `package.json` files – modify – Remove unused deps
- `docs/cleanup/dependency-pruning-report.md` – reference

## Acceptance Criteria

- [ ] knip.config tuned for project structure (entry points, ignore patterns)
- [ ] pnpm knip runs without critical errors (or document expected warnings)
- [ ] Unused dependencies removed where safe
- [ ] Build and tests pass

## Implementation Plan

- [ ] Review knip.config.ts
- [ ] Add/update entry points, project config, ignore rules
- [ ] Run pnpm knip; address high-priority findings
- [ ] Run depcheck or similar; remove unused deps
- [ ] Document any retained intentional duplicates

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Knip config refined
- [ ] Dead deps removed where safe
- [ ] Build passes
