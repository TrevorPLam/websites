# 3.1 Create Page-Templates Registry and Package Scaffold

## Metadata

- **Task ID**: 3-1-create-page-templates-registry-and-package-scaffold
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Registry (Map), SectionProps, TemplateConfig, composePage. No switch-based section selection. L3.

## Dependencies

- **Package**: @repo/page-templates – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1 (Templates), §3.1 (React 19), §8 (AOS)

## Related Files

- `packages/page-templates/src/registry.ts, types.ts, index.ts, templates/empty` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `sectionRegistry`, `SectionProps`, `TemplateConfig`, `composePage(config, siteConfig)`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] registry.ts; types.ts; composePage; templates/; index; deps; type-check; build.
- [ ] Registry exists
- [ ] composePage works with stubs
- [ ] 3.2 can add HomePageTemplate.

## Technical Constraints

- No CMS section definitions
- config from siteConfig only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] registry.ts; types.ts; composePage; templates/; index; deps; type-check; build.

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

