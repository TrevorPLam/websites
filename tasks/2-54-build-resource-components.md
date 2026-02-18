# 2.22 Build Resource Components

## Metadata

- **Task ID**: 2-22-build-resource-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.39 (File Upload)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

8+ Resource variants with download tracking. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, With Downloads, Category Tabs, Searchable, With Previews, Minimal, Featured (8+ total)
- **Download Tracking:** Download counts, analytics, file types

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.39 (File Upload) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.39 (File Upload)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/resource/types.ts` – modify – (see task objective)
- `ResourceGrid.tsx` – modify – (see task objective)
- `ResourceList.tsx` – modify – (see task objective)
- `ResourceCard.tsx` – modify – (see task objective)
- `resource/downloads.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `ResourceDisplay`, `ResourceCard`. Props: `variant`, `resources` (array), `showDownloads`, `trackDownloads`, `filterByType`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; download tracking; export.
- [ ] All 8+ variants render
- [ ] downloads work
- [ ] tracking functional.

## Technical Constraints

- No custom analytics
- basic tracking only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; download tracking; export.

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

