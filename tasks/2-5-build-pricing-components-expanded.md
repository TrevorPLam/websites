# 2.5 Build Pricing Components (Expanded)

## Metadata

- **Task ID**: 2-5-build-pricing-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.2 (Button), 1.24 (Alert)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

15+ Pricing variants with advanced customization and comparison. L2.

**Enhanced Requirements:**

- **Variants:** Three Column, Four Column, Two Column, Single Featured, Comparison Table, Tabs, Accordion, Toggle (Monthly/Yearly), With Features, Minimal, Bold, Card Grid, Side-by-Side, With Calculator, Customizable (15+ total)
- **Customization:** Feature lists, CTA buttons, badges (Popular, Best Value), tooltips, icons
- **Comparison:** Side-by-side comparison, feature comparison table, highlight differences
- **Interactive:** Toggle between pricing periods, expandable features, hover effects

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Upstream Task**: 1.24 (Alert) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.2 (Button), 1.24 (Alert); marketing-components exists
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

- `packages/marketing-components/src/pricing/types.ts` – modify – (see task objective)
- `PricingThreeColumn.tsx` – modify – (see task objective)
- `PricingFourColumn.tsx` – modify – (see task objective)
- `PricingComparison.tsx` – modify – (see task objective)
- `PricingTabs.tsx` – modify – (see task objective)
- `PricingToggle.tsx` – modify – (see task objective)
- `PricingWithFeatures.tsx` – modify – (see task objective)
- `PricingCard.tsx` – modify – (see task objective)
- `pricing/comparison.tsx` – modify – (see task objective)
- `pricing/customization.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Pricing section with composition

```typescript
interface PricingProps {
  title: string;
  plans: PricingPlan[];
  layout?: 'three-column' | 'four-column' | 'comparison';
  showToggle?: boolean;
  children?: React.ReactNode;
}
export function PricingSection({ title, plans, layout = 'three-column', showToggle, children }: PricingProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div className={layout === 'three-column' ? 'grid grid-cols-3' : 'grid grid-cols-4'}>{/* plans */}</div>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function PricingCard({ ref, className, ...props }: PricingCardProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('pricing-card', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type PricingCardRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.pricing-cta-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. pricing < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const PricingRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('pricing-root', className)} {...props} />
));
```

### Pricing types and customization

```typescript
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  currency: string;
  features: string[];
  badge?: 'popular' | 'best-value' | 'new';
  cta?: {
    text: string;
    href: string;
  };
}
```

### Button integration (from 1.2)

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### Alert integration (from 1.24)

```typescript
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}
```

## Acceptance Criteria

- [ ] Types; variants; comparison system; customization; export.
- [ ] All 15+ variants render
- [ ] comparison works
- [ ] customization functional
- [ ] toggle period works.

## Technical Constraints

- No payment integration
- display only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; comparison system; customization; export.

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
