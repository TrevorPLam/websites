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

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: Governance

## Research

- **Primary topics**: [R-VERSIONING](RESEARCH-INVENTORY.md#r-versioning-changesets-versioning-strategy), [R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation-config-schema-validation-zod).
- **[2026-02] Schema versioning**: validate-schema-versioning script checks compatibility; governance docs define version rules and change checklist.
- **References**: [RESEARCH-INVENTORY.md – R-VERSIONING](RESEARCH-INVENTORY.md#r-versioning-changesets-versioning-strategy), [THEGOAL.md](../THEGOAL.md) [D.1].

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

## Sample code / examples

- **package.json**: `"script:validate-schema": "tsx scripts/governance/validate-schema-versioning.ts"`. Script and docs per THEGOAL [D.1].

## Testing Requirements

- Run script; run pnpm build.

## Execution notes

- **Related files — current state:** governance/validate-schema-versioning or similar script — see scripts-wire; schema versioning policy doc — to be created or updated.
- **Potential issues / considerations:** Wire script via scripts-wire-package-json; document policy in docs/.
- **Verification:** Script runs; docs complete; build passes.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Script and docs complete
- [ ] Build passes
