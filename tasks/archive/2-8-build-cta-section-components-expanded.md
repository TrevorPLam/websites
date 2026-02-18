# 2.8 Build CTA Section Components (Expanded)

## Metadata

- **Task ID**: 2-8-build-cta-section-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.2 (Button)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ CTA Section variants with A/B testing support. L2.

**Enhanced Requirements:**

- **Variants:** Centered, Split, With Image, With Video, With Form, Minimal, Bold, With Stats, With Testimonials, Sidebar (10+ total)
- **A/B Testing:** Variant selection, conversion tracking, analytics integration
- **Composition:** CTA sections with headline, description, primary CTA, secondary CTA, image/video, form

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.2 (Button); marketing-components exists
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

- `packages/marketing-components/src/cta/types.ts` – modify – (see task objective)
- `CTACentered.tsx` – modify – (see task objective)
- `CTASplit.tsx` – modify – (see task objective)
- `CTAWithImage.tsx` – modify – (see task objective)
- `CTAWithVideo.tsx` – modify – (see task objective)
- `CTAWithForm.tsx` – modify – (see task objective)
- `cta/ab-testing.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — CTA section with composition

```typescript
interface CTASectionProps {
  title: string;
  description?: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  variant?: 'centered' | 'split' | 'with-image' | 'with-video';
  children?: React.ReactNode;
}
export function CTASection({ title, description, primaryCta, secondaryCta, variant = 'centered', children }: CTASectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <a href={primaryCta.href}>{primaryCta.text}</a>
      {secondaryCta && <a href={secondaryCta.href}>{secondaryCta.text}</a>}
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function CTASection({ ref, className, ...props }: CTASectionProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('cta-section', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type CTASectionRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.cta-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. CTA < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const CTARoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('cta-root', className)} {...props} />
));
```

### Button integration (from 1.2)

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### A/B testing integration

```typescript
interface CTAVariant {
  id: string;
  name: string;
  title: string;
  description?: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}

interface CTAABTest {
  experimentId: string;
  variants: CTAVariant[];
  tracking?: {
    onConversion?: (variantId: string) => void;
    onView?: (variantId: string) => void;
  };
}
```

### Conversion tracking hook

```typescript
import { useEffect } from 'react';

export function useConversionTracking(
  experimentId: string,
  variantId: string,
  onConversion?: () => void
) {
  useEffect(() => {
    // Track view event
    console.log(`CTA View: ${experimentId} - ${variantId}`);
  }, [experimentId, variantId]);

  const handleConversion = () => {
    console.log(`CTA Conversion: ${experimentId} - ${variantId}`);
    onConversion?.();
  };

  return { handleConversion };
}
```

## Acceptance Criteria

- [ ] Types; variants; A/B testing integration; export.
- [ ] All 10+ variants render
- [ ] A/B testing functional
- [ ] conversion tracking works.

## Technical Constraints

- No analytics provider integration
- basic tracking only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; A/B testing integration; export.

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
