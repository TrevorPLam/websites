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

## Testing Requirements

- Unit tests for rules and segments
- Run `pnpm test`, `pnpm type-check`

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Exported from features
- [ ] Build passes
