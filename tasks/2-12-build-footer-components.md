# 2.12 Build Footer Components

## Metadata

- **Task ID**: 2-12-build-footer-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Footer variants with newsletter and social-focused layouts. L2.

**Enhanced Requirements:**

- **Variants:** Standard, Minimal, With Newsletter, Social-Focused, Multi-Column, With Map, With Contact, With Links, With Logo, Sticky (10+ total)
- **Newsletter Integration:** Email signup, validation, integration
- **Social Integration:** Social media links, icons, follow buttons

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

- `packages/marketing-components/src/footer/types.ts` – modify – (see task objective)
- `FooterStandard.tsx` – modify – (see task objective)
- `FooterMinimal.tsx` – modify – (see task objective)
- `FooterWithNewsletter.tsx` – modify – (see task objective)
- `FooterSocial.tsx` – modify – (see task objective)
- `footer/newsletter.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Footer with composition

```typescript
interface FooterProps {
  variant?: 'standard' | 'minimal' | 'with-newsletter' | 'social-focused';
  logo?: React.ReactNode;
  links?: FooterLink[];
  socialLinks?: SocialLink[];
  newsletter?: boolean;
  children?: React.ReactNode;
}
export function Footer({ variant = 'standard', logo, links, socialLinks, newsletter, children }: FooterProps) {
  return (
    <footer>
      {logo && <div className="footer-logo">{logo}</div>}
      {links && <nav>{/* footer links */}</nav>}
      {socialLinks && <div className="social-links">{/* social icons */}</div>}
      {newsletter && <div className="newsletter">{/* newsletter signup */}</div>}
      {children}
    </footer>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function FooterWrapper({ ref, className, ...props }: FooterWrapperProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('footer', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type FooterWrapperRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.footer-link {
  min-width: 24px;
  min-height: 24px;
}

.social-icon {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. footer < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const FooterRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('footer-root', className)} {...props} />
));
```

### Footer types and integration

```typescript
interface FooterLink {
  id: string;
  label: string;
  href: string;
  category?: string;
}

interface SocialLink {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube';
  href: string;
  label?: string;
}

interface NewsletterProps {
  onSubmit: (email: string) => void;
  placeholder?: string;
  buttonText?: string;
}
```

### Newsletter integration hook

```typescript
import { useState } from 'react';

export function useNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Newsletter submission logic
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { email, setEmail, handleSubmit, isSubmitting, status };
}
```

## Acceptance Criteria

- [ ] Types; variants; newsletter integration; social integration; export.
- [ ] All 10+ variants render
- [ ] newsletter works
- [ ] social links functional.

## Technical Constraints

- No custom styling
- standard layouts only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; newsletter integration; social integration; export.

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
