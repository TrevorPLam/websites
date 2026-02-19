# E.7 Add infra/ops (Queue Policy)

## Metadata

- **Task ID**: e-7-infra-ops
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [E.7], operational governance
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Async queue governance

## Context

Add packages/infra/ops/ with queue-policy.ts for queue fairness, retry budgets, and timeout rules. Supports async job processing, webhooks, and background tasks.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: docs/operations/async-queue-governance.md, retry-timeout-policy

## Related Files

- `packages/infra/ops/queue-policy.ts` – create
- `packages/infra/index.ts` – modify – Export ops
- `docs/operations/async-queue-governance.md` – reference
- `docs/operations/retry-timeout-policy.md` – reference

## Acceptance Criteria

- [ ] queue-policy: fairness rules, retry budgets, timeout rules
- [ ] Export from @repo/infra
- [ ] Document in operations docs
- [ ] Server-only (no client export)

## Technical Constraints

- Use server-only; ops is infra for backend workflows
- Coordinate with existing rate-limit, retry patterns

## Implementation Plan

- [ ] Create ops directory
- [ ] Implement queue-policy
- [ ] Add to infra exports
- [ ] Document

## Testing Requirements

- Unit tests for policy logic
- Run `pnpm test`, `pnpm type-check`

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Exported from infra
- [ ] Build passes
