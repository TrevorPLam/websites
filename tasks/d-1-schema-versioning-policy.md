# D.1 Schema Versioning Policy

## Metadata

- **Task ID**: d-1-schema-versioning-policy
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [D.1]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Governance

## Context

Wire scripts/governance/validate-schema-versioning.ts. Document schema version compatibility in docs/governance/schema-versioning-policy.md and schema-change-checklist.md. THEGOAL [D.1].

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Related Files

- `scripts/governance/validate-schema-versioning.ts` – modify or create
- `docs/governance/schema-versioning-policy.md` – create or update
- `docs/governance/schema-change-checklist.md` – reference

## Acceptance Criteria

- [ ] validate-schema-versioning checks schema compatibility
- [ ] schema-versioning-policy.md defines version rules
- [ ] schema-change-checklist.md guides schema changes
- [ ] Runnable via pnpm

## Implementation Plan

- [ ] Implement or refine validate-schema-versioning
- [ ] Create/update governance docs
- [ ] Wire to package.json

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Script and docs complete
- [ ] Build passes
