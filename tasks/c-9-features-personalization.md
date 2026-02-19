# C.9 Add features/personalization

## Metadata

- **Task ID**: c-9-features-personalization
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.9], personalization engine
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: C.8 (experiments, optional)
- **Downstream Tasks**: Personalized UX, F.6 co-creation

## Context

Add packages/features/src/personalization/ with rules-engine.ts (privacy-safe, allowlist-only signals), segments.ts (geo, returning visitor, campaign source), and optionally co-creation-patterns.ts for participatory UX (F.6).

## Dependencies

- **Upstream Task**: C.8 – optional (feature flags)
- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: C.8 optional
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Personalization in pages, F.6

## Research

- **Primary topics**: [R-PERSONALIZATION](RESEARCH-INVENTORY.md#r-personalization-personalization-engine-behavioral-tracking). THEGOAL [C.9].
- **[2026-02] Personalization**: rules-engine (allowlist-only, privacy-safe), segments (geo, returning, campaign), co-creation optional; no PII; consent-aware.
- **References**: [RESEARCH-INVENTORY.md – R-PERSONALIZATION](RESEARCH-INVENTORY.md#r-personalization-personalization-engine-behavioral-tracking), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `packages/features/src/personalization/rules-engine.ts` – create
- `packages/features/src/personalization/segments.ts` – create
- `packages/features/src/personalization/co-creation-patterns.ts` – create (optional)
- `packages/features/src/index.ts` – modify – Export personalization
- `docs/marketing/personalization-rules.md` – reference

## Acceptance Criteria

- [ ] rules-engine: privacy-safe, allowlist-only signal evaluation
- [ ] segments: geo, returning visitor, campaign source
- [ ] Export from @repo/features
- [ ] Document in docs/marketing/personalization-rules.md

## Technical Constraints

- No PII in rules; consent-aware
- Client and server usage patterns

## Implementation Plan

- [ ] Create personalization directory
- [ ] Implement rules-engine, segments
- [ ] Add to features exports
- [ ] Document

## Sample code / examples

- **rules-engine.ts**: evaluate(signals) with allowlist; **segments.ts**: getSegment(context) returns geo/returning/campaign; export from @repo/features.

## Testing Requirements

- Unit tests for rules and segments
- Run `pnpm test`, `pnpm type-check`

## Execution notes

- **Related files — current state:** features/personalization — to be created or extended. R-PERSONALIZATION; align with c-18 edge if applicable.
- **Potential issues / considerations:** Config-driven; behavioral tracking and variant selection; consent where required.
- **Verification:** Build passes; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Exported from features
- [ ] Build passes
