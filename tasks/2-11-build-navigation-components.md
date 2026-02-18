# 2.11 Build Navigation Components

## Metadata

- **Task ID**: 2-11-build-navigation-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.19 (Navigation Menu)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

15+ Navigation variants with multi-level and mega menu support. L2.

**Enhanced Requirements:**

- **Variants:** Horizontal, Vertical, Sidebar, Sticky, Transparent, With Logo, With Search, Mega Menu, Dropdown, Mobile Drawer, Breadcrumb Nav, Footer Nav, Tab Nav, Accordion Nav, Minimal (15+ total)
- **Multi-Level:** Nested navigation, submenus, mega menus
- **Features:** Search integration, mobile responsive, keyboard navigation

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.19 (Navigation Menu) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.19 (Navigation Menu); marketing-components exists
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

- `packages/marketing-components/src/navigation/types.ts` – modify – (see task objective)
- `NavigationHorizontal.tsx` – modify – (see task objective)
- `NavigationVertical.tsx` – modify – (see task objective)
- `NavigationMegaMenu.tsx` – modify – (see task objective)
- `NavigationMobile.tsx` – modify – (see task objective)
- `navigation/mega-menu.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Navigation with composition

```typescript
interface NavigationProps {
  items: NavigationItem[];
  variant?: 'horizontal' | 'vertical' | 'mega-menu' | 'mobile';
  logo?: React.ReactNode;
  search?: boolean;
  children?: React.ReactNode;
}
export function Navigation({ items, variant = 'horizontal', logo, search, children }: NavigationProps) {
  return (
    <nav>
      {logo && <div className="nav-logo">{logo}</div>}
      {search && <input type="search" placeholder="Search..." />}
      <ul className={variant}>{/* navigation items */}</ul>
      {children}
    </nav>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function NavigationItem({ ref, className, ...props }: NavigationItemProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('navigation-item', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type NavigationItemRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and keyboard navigation

```css
.navigation-link {
  min-width: 24px;
  min-height: 24px;
}

/* Focus management for keyboard navigation */
.navigation-item:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. navigation < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const NavigationRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('navigation-root', className)} {...props} />
));
```

### Navigation Menu integration (from 1.19)

```typescript
interface NavigationMenuProps {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  triggerMode?: 'hover' | 'click';
}
```

### Navigation types and mega menu

```typescript
interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  children?: NavigationItem[];
  icon?: React.ReactNode;
  badge?: string;
}

interface MegaMenuProps {
  items: NavigationItem[];
  columns?: number;
  featured?: {
    title: string;
    description: string;
    image?: string;
    link: string;
  }[];
}
```

### Mobile navigation hook

```typescript
import { useState, useEffect } from 'react';

export function useMobileNavigation(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return { isMobile, isOpen, toggle, close };
}
```

## Acceptance Criteria

- [ ] Types; variants; mega menu; mobile responsive; export.
- [ ] All 15+ variants render
- [ ] mega menus work
- [ ] mobile responsive
- [ ] keyboard accessible.

## Technical Constraints

- No custom animations
- CSS transitions only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; mega menu; mobile responsive; export.

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
