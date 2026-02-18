# 4.2 Scheduling

## Metadata

- **Task ID**: 4-2-scheduling
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None (4.4 feeds 2.16)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Adapter contracts. Calendly/Acuity/Cal.com; Intercom/Crisp/Tidio; Google/Yelp/Trustpilot; Google Maps (static + interactive); JSON-LD generators per industry.

## Dependencies

- **Upstream Task**: None (4.4 feeds 2.16) – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None (4.4 feeds 2.16)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- (Add file paths)

## Code Snippets / Examples

```typescript
// Add code snippets and usage examples
```

## Acceptance Criteria

- [ ] Contract first; adapters; export; consent gate where needed.
- [ ] Adapters work
- [ ] schemas generate valid JSON-LD.

## Technical Constraints

- No calendar sync (4.2)
- no review response (4.4)
- limit 12 industries (4.6).

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Contract first; adapters; export; consent gate where needed.

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

