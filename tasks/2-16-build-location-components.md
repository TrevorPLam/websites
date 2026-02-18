# 2.16 Build Location Components

## Metadata

- **Task ID**: 2-16-build-location-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 4.5 (Maps Integration)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Location variants with maps integration. L2.

**Enhanced Requirements:**

- **Variants:** With Map, List, Grid, Single Location, Multiple Locations, With Directions, With Contact, With Hours, With Reviews, Minimal (10+ total)
- **Maps Integration:** Google Maps, Mapbox, interactive maps, markers, directions

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 4.5 (Maps Integration) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 4.5 (Maps Integration)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/location/types.ts` – modify – (see task objective)
- `LocationWithMap.tsx` – modify – (see task objective)
- `LocationList.tsx` – modify – (see task objective)
- `LocationGrid.tsx` – modify – (see task objective)
- `LocationCard.tsx` – modify – (see task objective)
- `location/maps.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `LocationDisplay`, `LocationCard`. Props: `variant`, `locations` (array), `showMap`, `showDirections`, `mapProvider`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; maps integration; export.
- [ ] All 10+ variants render
- [ ] maps display
- [ ] directions work.

## Technical Constraints

- No custom map styling
- standard providers only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; maps integration; export.

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

