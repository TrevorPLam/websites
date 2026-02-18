# 2.17 Create Team Feature (Enhanced)

## Metadata

- **Task ID**: 2-17-create-team-feature-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 2.3
- **Downstream Tasks**: (Tasks that consume this output)

## Context

TeamSection with 5+ implementation patterns, CMS and API adapters. Uses 2.3 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Hybrid, Directory-Based (5+ total)
- **CMS Integration:** Sanity, Contentful, Strapi, MDX adapters
- **API Integration:** REST API, GraphQL, directory services
- **Features:** Schema validation, role filtering, department organization, social integration

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 2.3 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 2.3
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/features/src/team/index` – create – (see task objective)
- `packages/features/src/team/lib/schema` – create – (see task objective)
- `packages/features/src/team/lib/adapters/config.ts` – create – (see task objective)
- `packages/features/src/team/lib/adapters/api.ts` – create – (see task objective)
- `packages/features/src/team/lib/adapters/cms.ts` – create – (see task objective)
- `packages/features/src/team/lib/adapters/directory.ts` – create – (see task objective)
- `packages/features/src/team/lib/team-config.ts` – create – (see task objective)
- `packages/features/src/team/lib/filters.ts` – create – (see task objective)
- `packages/features/src/team/components/TeamSection.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamConfig.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamAPI.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamCMS.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `TeamSection`, `teamSchema`, `createTeamConfig`, `normalizeFromConfig`, `normalizeFromAPI`, `normalizeFromCMS`, `filterByRole`, `filterByDepartment`, `TeamConfig`, `TeamAPI`, `TeamCMS`, `TeamHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema → adapters → implementation patterns → Section components → export. Copy pattern from testimonials.
- [ ] Builds
- [ ] all patterns work
- [ ] CMS integration functional
- [ ] API adapters work
- [ ] filtering works.

## Technical Constraints

- No CMS sync
- Server Components for data
- formatCurrency server-side.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

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

