# 2.6 Build Gallery Components (Expanded)

## Metadata

- **Task ID**: 2-6-build-gallery-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.45 (Carousel), 1.46 (Masonry)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

20+ Gallery variants with advanced filtering and organization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), Masonry, Carousel, Slider, Lightbox, Filterable Grid, Tagged Grid, Category Tabs, Timeline, Before/After, Portfolio Grid, Featured + Grid, With Captions, Minimal, Bold, Sidebar + Grid, Searchable, Infinite Scroll, With Filters, Custom Layout (20+ total)
- **Filtering:** By category, tag, date, featured status
- **Organization:** Categories, tags, albums, collections
- **Interactive:** Lightbox, zoom, fullscreen, slideshow, share

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.45 (Carousel) – required – prerequisite
- **Upstream Task**: 1.46 (Masonry) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.45 (Carousel), 1.46 (Masonry); marketing-components exists
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

- `packages/marketing-components/src/gallery/types.ts` – modify – (see task objective)
- `GalleryGrid.tsx` – modify – (see task objective)
- `GalleryMasonry.tsx` – modify – (see task objective)
- `GalleryCarousel.tsx` – modify – (see task objective)
- `GalleryLightbox.tsx` – modify – (see task objective)
- `GalleryFilterable.tsx` – modify – (see task objective)
- `GalleryTagged.tsx` – modify – (see task objective)
- `gallery/filters.tsx` – modify – (see task objective)
- `gallery/lightbox.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Gallery section with composition

```typescript
interface GalleryProps {
  title: string;
  images: GalleryImage[];
  layout?: 'grid' | 'masonry' | 'carousel';
  enableLightbox?: boolean;
  children?: React.ReactNode;
}
export function GallerySection({ title, images, layout = 'grid', enableLightbox, children }: GalleryProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div className={layout === 'grid' ? 'grid grid-cols-3' : 'flex flex-col'}>{/* images */}</div>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function GalleryImage({ ref, className, ...props }: GalleryImageProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('gallery-image', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type GalleryImageRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.gallery-image-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization with next/image

- Page shell < 250 KB gzipped; component-level budgets (e.g. gallery < 40 KB)
- Use `next/image` with `priority` for above-the-fold images
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const GalleryRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('gallery-root', className)} {...props} />
));
```

### Gallery types and filtering

```typescript
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  date?: string;
}
```

### Carousel integration (from 1.45)

```typescript
interface CarouselProps {
  items: React.ReactNode[];
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  autoplay?: boolean;
}
```

### Masonry integration (from 1.46)

```typescript
interface MasonryProps {
  items: React.ReactNode[];
  columnCount?: number;
  gap?: number;
  minColumnWidth?: number;
}
```

## Acceptance Criteria

- [ ] Types; variants; filtering; lightbox; export.
- [ ] All 20+ variants render
- [ ] filtering works
- [ ] lightbox functional
- [ ] responsive breakpoints work.

## Technical Constraints

- No image optimization
- use next/image.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; filtering; lightbox; export.

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
