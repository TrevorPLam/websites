# 2.7 Build Stats Counter Component (Expanded)

## Metadata

- **Task ID**: 2-7-build-stats-counter-component-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

6 Stats Counter variants with animation customization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), List, Carousel, With Icons (6 total)
- **Animation:** Count-up animation, duration control, easing functions
- **Composition:** Stat cards with number, label, icon, description, trend indicator

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: marketing-components package exists
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

- `packages/marketing-components/src/stats/types.ts` – modify – (see task objective)
- `StatsGrid.tsx` – modify – (see task objective)
- `StatsList.tsx` – modify – (see task objective)
- `StatsCarousel.tsx` – modify – (see task objective)
- `StatsCard.tsx` – modify – (see task objective)
- `stats/animations.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Stats section with composition

```typescript
interface StatsProps {
  title?: string;
  stats: StatItem[];
  layout?: 'grid' | 'list' | 'carousel';
  showAnimation?: boolean;
  children?: React.ReactNode;
}
export function StatsSection({ title, stats, layout = 'grid', showAnimation, children }: StatsProps) {
  return (
    <section>
      {title && <h2>{title}</h2>}
      <div className={layout === 'grid' ? 'grid grid-cols-3' : 'flex flex-col'}>{/* stats */}</div>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function StatCard({ ref, className, ...props }: StatCardProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('stat-card', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type StatCardRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.stat-card-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection for animations

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. stats < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const StatRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('stat-root', className)} {...props} />
));
```

### Stats types and animation

```typescript
interface StatItem {
  id: string;
  value: number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
  animationDuration?: number;
}
```

### Animation hook for count-up effect

```typescript
import { useEffect, useState } from 'react';

export function useCountUp(target: number, duration = 2000, enabled = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      setCount(target);
      return;
    }

    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, enabled]);

  return count;
}
```

## Acceptance Criteria

- [ ] Types; variants; animations; export.
- [ ] All 6 variants render
- [ ] count-up animations work
- [ ] responsive breakpoints work.

## Technical Constraints

- No custom easing functions
- CSS animations only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; animations; export.

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
