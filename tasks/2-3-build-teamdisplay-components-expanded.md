# 2.3 Build TeamDisplay Components (Expanded)

## Metadata

- **Task ID**: 2-3-build-teamdisplay-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.8 (Avatar)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

15+ Team layout variants with role filtering and social integration. L2.

**Enhanced Requirements:**

- **Layout Variants:** Grid (2-col, 3-col, 4-col), List (vertical, horizontal), Card Grid, Featured + Grid, Carousel, Sidebar + Grid, Masonry, Timeline, Accordion, Filterable Grid, Role-based Grid, Department Tabs, Social-focused, Minimal Cards, Detailed Cards (15+ total)
- **Role Filtering:** Filter by role, department, team
- **Social Integration:** Social media links, LinkedIn, Twitter, GitHub integration
- **Composition:** Team member cards with avatar, name, role, bio, social links, contact info
- **Interactive:** Hover effects, expandable bios, modal details

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.8 (Avatar) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.8 (Avatar)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/team/types.ts` – modify – (see task objective)
- `TeamGrid.tsx` – modify – (see task objective)
- `TeamList.tsx` – modify – (see task objective)
- `TeamCarousel.tsx` – modify – (see task objective)
- `TeamMasonry.tsx` – modify – (see task objective)
- `TeamFilterable.tsx` – modify – (see task objective)
- `TeamRoleBased.tsx` – modify – (see task objective)
- `team/filters.tsx` – modify – (see task objective)
- `team/social.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `TeamDisplay`, `TeamMemberCard`. Props: `layout`, `members` (array), `filterByRole`, `showSocial`, `showBio`, `showContact`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; layouts; role filtering; social integration; export.
- [ ] All 15+ layouts render
- [ ] role filtering works
- [ ] social links functional
- [ ] RSC where static.

## Technical Constraints

- No CMS wiring
- data from props only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; layouts; role filtering; social integration; export.

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

