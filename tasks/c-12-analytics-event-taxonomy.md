# C.12 Analytics Event Taxonomy

## Metadata

- **Task ID**: c-12-analytics-event-taxonomy
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.12]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Conversion tracking

## Context

Add event-contract.ts to packages/integrations/analytics/ per THEGOAL. Defines conversion event taxonomy: event names, payload shapes, consent requirements. Enables consistent tracking across clients.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Related Files

- `packages/integrations/analytics/src/event-contract.ts` – create
- `packages/integrations/analytics/src/__tests__/event-contract.test.ts` – create
- `docs/analytics/conversion-event-taxonomy.md` – reference

## Acceptance Criteria

- [ ] event-contract: typed event names and payloads
- [ ] Covers: page_view, conversion (booking, contact, etc.), custom events
- [ ] Consent flags where needed
- [ ] Unit tests
- [ ] Document in docs/analytics/conversion-event-taxonomy.md

## Implementation Plan

- [ ] Create event-contract.ts with event types
- [ ] Add tests
- [ ] Integrate with existing analytics package
- [ ] Document

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Event contract defined and tested
- [ ] Build passes
