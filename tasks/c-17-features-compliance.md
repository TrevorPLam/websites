# C.17 Add features/compliance + types/compliance-packs

## Metadata

- **Task ID**: c-17-features-compliance
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.17], industry compliance
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Industry-specific disclaimers, medical/legal

## Context

Add packages/types/src/compliance-packs.ts (industry compliance overlays) and packages/features/src/compliance/renderers/ (medical privacy, legal disclaimers). Supports industry-specific regulatory requirements.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Industry clients (dental, law, medical)

## Research

- **Primary topics**: [R-COMPLIANCE](RESEARCH-INVENTORY.md#r-compliance-industry-compliance-packs). THEGOAL [C.17].
- **[2026-02] Compliance**: compliance-packs (industry overlays); renderers for medical privacy, legal disclaimers; config-driven; industry from site.config.
- **References**: [RESEARCH-INVENTORY.md – R-COMPLIANCE](RESEARCH-INVENTORY.md#r-compliance-industry-compliance-packs), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `packages/types/src/compliance-packs.ts` – create
- `packages/types/src/index.ts` – modify – Export compliance-packs
- `packages/features/src/compliance/renderers/` – create – Medical, legal renderers
- `packages/features/src/index.ts` – modify – Export compliance
- `docs/compliance/industry-compliance-packs.md` – reference

## Acceptance Criteria

- [ ] compliance-packs: industry overlay types (medical, legal, etc.)
- [ ] compliance renderers: medical privacy notices, legal disclaimers
- [ ] Export from @repo/types and @repo/features
- [ ] Document in docs/compliance/industry-compliance-packs.md

## Technical Constraints

- Config-driven; industry from site.config
- Renderers output JSX or plain text

## Implementation Plan

- [ ] Create compliance-packs in types
- [ ] Create compliance/renderers in features
- [ ] Add to exports
- [ ] Document

## Sample code / examples

- **compliance-packs.ts**: Industry overlay types (medical, legal). **renderers/**: medical-privacy.tsx, legal-disclaimer.tsx; industry from config.

## Testing Requirements

- Unit tests for renderers
- Run `pnpm test`, `pnpm type-check`

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Exported from types and features
- [ ] Build passes
