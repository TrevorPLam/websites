# 2.3 Build TeamDisplay Components (Expanded)

## Metadata

- **Task ID**: 2-3-build-teamdisplay-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.8 (Avatar)
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

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.8 (Avatar) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.8 (Avatar); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

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

### R-MARKETING — Team section with composition

```typescript
interface TeamDisplayProps {
  title: string;
  members: TeamMember[];
  layout?: 'grid' | 'list' | 'carousel';
  filterBy?: 'role' | 'department';
  children?: React.ReactNode;
}
export function TeamDisplay({ title, members, layout = 'grid', filterBy, children }: TeamDisplayProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div className={layout === 'grid' ? 'grid grid-cols-3' : 'flex flex-col'}>{/* members */}</div>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function TeamMemberCard({ ref, className, ...props }: TeamMemberCardProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('team-member-card', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type TeamMemberCardRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and social links

```css
.team-member-social-link {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. team section < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const TeamMemberRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('team-member-root', className)} {...props} />
));
```

### Avatar integration (from 1.8)

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}
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
