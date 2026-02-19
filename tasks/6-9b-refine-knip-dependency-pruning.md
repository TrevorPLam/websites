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

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6-9
- **Downstream**: 6-9 complete

## Research

- **Primary topics**: [R-CLEANUP](RESEARCH-INVENTORY.md#r-cleanup-dead-code-removal-dependency-pruning).
- **[2026-02] Knip**: Dead code and unused dependency detection; configure entry points and ignore patterns in knip.config.ts.
- **References**: [RESEARCH-INVENTORY.md – R-CLEANUP](RESEARCH-INVENTORY.md#r-cleanup-dead-code-removal-dependency-pruning), [CLAUDE.md](../CLAUDE.md) (pnpm knip).

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

## Sample code / examples

- **knip.config.ts**: Set `entry`, `project` patterns for packages and clients; use `ignore` for generated or spec files. Run `pnpm knip`; fix or document findings.

## Testing Requirements

- Run `pnpm knip`, `pnpm build`, `pnpm test` after changes.

## Execution notes

- **Related files — current state:** `knip.config.ts` (or knip config in package.json) — may exist at root; tune entry/project/ignore for packages and clients. `docs/cleanup/dependency-pruning-report.md` — reference or create.
- **Potential issues / considerations:** Knip can report false positives; set ignore for generated/spec files; remove unused deps only where safe (check peer deps and transitive use).
- **Verification:** `pnpm knip`, `pnpm build`, `pnpm test`.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Knip config refined
- [ ] Dead deps removed where safe
- [ ] Build passes
