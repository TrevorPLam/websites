# C.8 Add infra/experiments (Feature Flags, A/B, Guardrails)

## Metadata

- **Task ID**: c-8-infra-experiments
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.8], experimentation
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: A/B testing, feature flags

## Context

Add packages/infra/experiments/ with feature-flags.ts (deterministic evaluation, kill-switch), ab-testing.ts (variant assignment, exposure logging), guardrails.ts (SRM checks, minimum run validation per D.2).

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: D.2 (experiment stats)
- **Downstream**: C.18 edge context, marketing experiments

## Research

- **Primary topics**: [R-EXPERIMENTATION](RESEARCH-INVENTORY.md#r-experimentation-ab-testing-feature-flags-guardrails). THEGOAL [C.8].
- **[2026-02] Experiments**: feature-flags (deterministic, kill-switch), ab-testing (variant, exposure), guardrails (SRM, min run); server/edge safe; no PII in logs.
- **References**: [RESEARCH-INVENTORY.md – R-EXPERIMENTATION](RESEARCH-INVENTORY.md#r-experimentation-ab-testing-feature-flags-guardrails), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `packages/infra/experiments/feature-flags.ts` – create
- `packages/infra/experiments/ab-testing.ts` – create
- `packages/infra/experiments/guardrails.ts` – create
- `packages/infra/experiments/__tests__/guardrails.test.ts` – create
- `packages/infra/index.ts` – modify – Export experiments

## Acceptance Criteria

- [ ] feature-flags: deterministic evaluation, kill-switch support
- [ ] ab-testing: variant assignment, exposure logging
- [ ] guardrails: SRM checks, minimum run validation
- [ ] Exported from @repo/infra
- [ ] Unit tests for guardrails

## Technical Constraints

- Server-safe and edge-safe where used
- Privacy: no PII in logs

## Implementation Plan

- [ ] Create experiments directory
- [ ] Implement feature-flags, ab-testing, guardrails
- [ ] Add tests
- [ ] Export from infra

## Sample code / examples

- **feature-flags.ts**: evaluate(flagId, context) returns boolean; kill-switch override. **guardrails.ts**: SRM check, minimum run validation; unit tests.

## Testing Requirements

- Unit tests for guardrails
- Run `pnpm test`, `pnpm type-check`

## Execution notes

- **Related files — current state:** infra/experiments or feature-flag layer — to be created or extended. R-EXPERIMENTATION; A/B, guardrails, SRM checks.
- **Potential issues / considerations:** Config-driven; no breaking changes; optional guardrails for experiment assignment.
- **Verification:** Build passes; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Exported from infra
- [ ] Build passes
