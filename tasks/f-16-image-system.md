# F.16 Image System

## Metadata

- **Task ID**: f-16-image-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Image system with optimization, lazy loading, and responsive images.

## Dependencies

- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – Image optimization, Next.js Image

## Related Files

- `packages/infrastructure/image/index` – create – (see task objective)
- `packages/infrastructure/image/optimization.ts` – create – (see task objective)
- `packages/infrastructure/image/lazy-loading.ts` – create – (see task objective)
- `packages/infrastructure/image/responsive.ts` – create – (see task objective)
- `packages/infrastructure/image/utils.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `OptimizedImage`, `useImage`, `optimizeImage`, `lazyLoadImage`, `getResponsiveSrc`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Image component; optimization; lazy loading; responsive images; export.
- [ ] Builds
- [ ] image system functional
- [ ] optimization works
- [ ] lazy loading works.

## Technical Constraints

- No custom optimization
- Next.js Image + standard techniques only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Image component; optimization; lazy loading; responsive images; export.

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

