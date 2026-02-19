# 6.8e Wire pnpm health to Full Pipeline

## Metadata

- **Task ID**: 6-8e-wire-pnpm-health
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: INNOV-3, THEGOAL scripts
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1
- **Downstream Tasks**: Developer workflow, CI

## Context

Wire `pnpm health` to run lint + type-check + build + test (and optionally validate-exports, validate-client). scripts/health-check.ts exists; ensure it runs the full quality gate or extend it to do so.

## Dependencies

- **Upstream Task**: 5.1 – Clients exist
- **Upstream Task**: 0-4, 0-5, 0-6, 0-7 – CI blockers resolved (ideal)

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Single-command health check

## Research

- **Primary topics**: [R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), THEGOAL INNOV-3.
- **[2026-02] Health check**: scripts/health-check.ts runs lint, type-check, build, test; optional validate-exports/validate-client; exit 0 on success. Local dev aid, not full CI duplicate.
- **References**: [scripts/health-check.ts](../scripts/health-check.ts), [THEGOAL.md](../THEGOAL.md), [CLAUDE.md](../CLAUDE.md).

## Related Files

- `scripts/health-check.ts` – modify – Extend or verify
- `package.json` – modify – health script

## Acceptance Criteria

- [ ] `pnpm health` runs: lint, type-check, build, test
- [ ] Optionally: validate-exports, validate-all-clients
- [ ] Exit 0 if all pass, non-zero on first failure
- [ ] Reasonable runtime; possible to add --quick for subset

## Technical Constraints

- Must not duplicate CI exactly; health is local dev aid
- Consider --filter for affected packages (optional)

## Implementation Plan

- [ ] Review current health-check.ts
- [ ] Add or wire: pnpm lint, pnpm type-check, pnpm build, pnpm test
- [ ] Update package.json "health" script
- [ ] Document in README

## Sample code / examples

- **package.json**: `"health": "tsx scripts/health-check.ts"` (or node). health-check.ts: run `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm test` in sequence; exit with first failure code.

## Testing Requirements

- Run `pnpm health` and verify it executes all steps

## Definition of Done

- [ ] Code reviewed and approved
- [ ] pnpm health works end-to-end
- [ ] Documentation updated
