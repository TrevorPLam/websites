# 5.6 Urban-Outfitters

## Metadata

- **Task ID**: 5-6-urban-outfitters
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Copy starter-template → clients/<name>. Edit site.config.ts only. Industry, conversionFlow, layout options.

## Dependencies

- **Upstream Task**: 5.1 – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §6 (Industry: salons, restaurants, legal, medical, retail)

## Related Files

- (Add file paths)

## Code Snippets / Examples

```typescript
// Add code snippets and usage examples
```

## Acceptance Criteria

- [ ] Copy; edit site.config (industry, features); validate-client; build; smoke.
- [ ] Client builds
- [ ] config-driven
- [ ] no custom components.

## Technical Constraints

- No custom components
- config only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Copy; edit site.config (industry, features); validate-client; build; smoke.

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

