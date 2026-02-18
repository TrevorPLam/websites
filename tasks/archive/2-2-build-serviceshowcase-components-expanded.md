# 2.2 Build ServiceShowcase Components (Expanded)

## Metadata

- **Task ID**: 2-2-build-serviceshowcase-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.3, 1.24, 1.25
- **Downstream Tasks**: (Tasks that consume this output)

## Context

20+ Service layout variants with filtering, sorting, and advanced composition. L2.

**Enhanced Requirements:**

- **Layout Variants:** Grid (2-col, 3-col, 4-col), List (vertical, horizontal), Tabs, Accordion, Masonry, Card Grid, Featured + Grid, Carousel, Sidebar + Content, Comparison Table, Timeline, Stepper, Filterable Grid, Searchable List, Category Tabs, Tagged Grid, Featured Service, Service Showcase, Service Directory, Service Map (20+ total)
- **Filtering:** By category, tag, price range, rating, featured status
- **Sorting:** By name, price, rating, date added, popularity
- **Composition:** Service cards with image, title, description, price, CTA, tags, rating, badges
- **Responsive:** Mobile-first, breakpoint-specific layouts
- **Interactive:** Hover effects, expandable details, quick view modal

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.3 – required – prerequisite
- **Upstream Task**: 1.24 – required – prerequisite
- **Upstream Task**: 1.25 – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.3, 1.24, 1.25; marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/marketing-components/src/services/types.ts` – modify – (see task objective)
- `ServiceGrid.tsx` – modify – (see task objective)
- `ServiceList.tsx` – modify – (see task objective)
- `ServiceTabs.tsx` – modify – (see task objective)
- `ServiceAccordion.tsx` – modify – (see task objective)
- `ServiceMasonry.tsx` – modify – (see task objective)
- `ServiceCarousel.tsx` – modify – (see task objective)
- `ServiceComparison.tsx` – modify – (see task objective)
- `ServiceTimeline.tsx` – modify – (see task objective)
- `ServiceFilterable.tsx` – modify – (see task objective)
- `ServiceSearchable.tsx` – modify – (see task objective)
- `services/filters.tsx` – modify – (see task objective)
- `services/sorting.tsx` – modify – (see task objective)
- `services/composition.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Section with slots

```typescript
interface ServiceShowcaseProps {
  title: string;
  services: Service[];
  layout?: 'grid' | 'list' | 'carousel';
  children?: React.ReactNode;
}
export function ServiceShowcase({ title, services, layout = 'grid', children }: ServiceShowcaseProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div className={layout === 'grid' ? 'grid grid-cols-3' : 'flex flex-col'}>{/* items */}</div>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function ServiceCard({ ref, className, ...props }: ServiceCardProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('service-card', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type ServiceCardRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.service-card-cta {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization and bundle budgets

- Page shell < 250 KB gzipped; component-level budgets (e.g. section < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const ServiceCardRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('service-card-root', className)} {...props} />
));
```

### R-FORM — Filter form with Zod resolver

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const serviceFilterSchema = z.object({
  category: z.string().optional(),
  priceRange: z.array(z.number()).optional(),
  rating: z.number().min(0).max(5).optional(),
});

type ServiceFilterData = z.infer<typeof serviceFilterSchema>;

const filterForm = useForm<ServiceFilterData>({
  resolver: zodResolver(serviceFilterSchema),
  defaultValues: { category: '', priceRange: [], rating: 0 },
});
```

### Related Patterns

- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples

## Acceptance Criteria

- [ ] All 20+ layouts render
- [ ] filtering works
- [ ] sorting functional
- [ ] RSC where static
- [ ] responsive breakpoints work.

## Technical Constraints

- No CMS wiring
- data from props only.

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
