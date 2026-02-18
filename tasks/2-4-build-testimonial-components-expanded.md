# 2.4 Build Testimonial Components (Expanded)

## Metadata

- **Task ID**: 2-4-build-testimonial-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.45 (Carousel), 1.40 (Rating)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

20+ Testimonial variants with multi-source integration. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col), Carousel, Slider, List, Featured + Grid, Card Grid, Quote Cards, Minimal, Bold, With Images, With Videos, Filterable, Searchable, Star Ratings, Review Cards, Trust Badges, Social Proof, Testimonial Wall, Rotating Quotes, Side-by-Side (20+ total)
- **Multi-Source Integration:** Google Reviews, Yelp, Trustpilot, custom config, API adapters
- **Composition:** Testimonial cards with quote, author, role, company, image, rating, date, source badge
- **Filtering:** By rating, source, date, featured
- **Animations:** Fade, slide, rotate, typewriter

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.45 (Carousel) – required – prerequisite
- **Upstream Task**: 1.40 (Rating) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.45 (Carousel), 1.40 (Rating); marketing-components exists
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

- `packages/marketing-components/src/testimonials/types.ts` – modify – (see task objective)
- `TestimonialGrid.tsx` – modify – (see task objective)
- `TestimonialCarousel.tsx` – modify – (see task objective)
- `TestimonialSlider.tsx` – modify – (see task objective)
- `TestimonialList.tsx` – modify – (see task objective)
- `TestimonialCard.tsx` – modify – (see task objective)
- `TestimonialFilterable.tsx` – modify – (see task objective)
- `testimonials/sources.tsx` – modify – (see task objective)
- `testimonials/filters.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Testimonial section with composition

```typescript
interface TestimonialProps {
  title: string;
  testimonials: Testimonial[];
  layout?: 'grid' | 'carousel' | 'slider';
  showRating?: boolean;
  showSource?: boolean;
  children?: React.ReactNode;
}
export function TestimonialSection({ title, testimonials, layout = 'grid', showRating, showSource, children }: TestimonialProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div className={layout === 'grid' ? 'grid grid-cols-3' : 'flex flex-col'}>{/* testimonials */}</div>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function TestimonialCard({ ref, className, ...props }: TestimonialCardProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('testimonial-card', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type TestimonialCardRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.testimonial-card-link {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. testimonials < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const TestimonialRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('testimonial-root', className)} {...props} />
));
```

### Multi-source integration types

```typescript
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  date?: string;
  source?: 'google' | 'yelp' | 'trustpilot' | 'custom';
  sourceUrl?: string;
}
```

### Rating integration (from 1.40)

```typescript
interface RatingProps {
  value: number;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

## Acceptance Criteria

- [ ] Types; variants; multi-source adapters; filtering; export.
- [ ] All 20+ variants render
- [ ] multi-source integration works
- [ ] filtering functional
- [ ] animations smooth.

## Technical Constraints

- No live API keys
- mock data for external sources.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; multi-source adapters; filtering; export.

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
