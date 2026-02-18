# 3.2 HomePageTemplate

## Metadata

- **Task ID**: 3-2-homepagetemplate
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 3.1 + respective features (2.1, 2.2, 2.3/2.17, 2.10/2.13, 2.14, 2.14, 2.12)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Each template reads siteConfig.pages.<page>.sections, renders composePage. Registers sections in registry.

## Dependencies

- **Upstream Task**: 3.1 + respective features (2.1 – required – prerequisite
- **Upstream Task**: 2.2 – required – prerequisite
- **Upstream Task**: 2.3/2.17 – required – prerequisite
- **Upstream Task**: 2.10/2.13 – required – prerequisite
- **Upstream Task**: 2.14 – required – prerequisite
- **Upstream Task**: 2.14 – required – prerequisite
- **Upstream Task**: 2.12) – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 3.1 + respective features (2.1, 2.2, 2.3/2.17, 2.10/2.13, 2.14, 2.14, 2.12)
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

- [ ] Register sections; create Template.tsx; use composePage; export.
- [ ] Template renders
- [ ] config-driven sections.

## Technical Constraints

- No hardcoded industry content
- all from config.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Register sections; create Template.tsx; use composePage; export.

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

