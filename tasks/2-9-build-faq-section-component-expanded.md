# 2.9 Build FAQ Section Component (Expanded)

## Metadata

- **Task ID**: 2-9-build-faq-section-component-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.27 (Accordion)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

6 FAQ Section variants with search functionality. L2.

**Enhanced Requirements:**

- **Variants:** Accordion, List, Tabs, Searchable, With Categories, Minimal (6 total)
- **Search:** Full-text search, highlight matches, filter by category
- **Composition:** FAQ items with question, answer, category, tags

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.27 (Accordion) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.27 (Accordion); marketing-components exists
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

- `packages/marketing-components/src/faq/types.ts` – modify – (see task objective)
- `FAQAccordion.tsx` – modify – (see task objective)
- `FAQList.tsx` – modify – (see task objective)
- `FAQTabs.tsx` – modify – (see task objective)
- `FAQSearchable.tsx` – modify – (see task objective)
- `FAQWithCategories.tsx` – modify – (see task objective)
- `faq/search.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — FAQ section with composition

```typescript
interface FAQSectionProps {
  title: string;
  faqs: FAQItem[];
  variant?: 'accordion' | 'list' | 'tabs' | 'searchable';
  enableSearch?: boolean;
  categories?: string[];
  children?: React.ReactNode;
}
export function FAQSection({ title, faqs, variant = 'accordion', enableSearch, categories, children }: FAQSectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      {enableSearch && <input type="search" placeholder="Search FAQs..." />}
      <div className={variant}>{/* FAQ items */}</div>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function FAQItem({ ref, className, ...props }: FAQItemProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('faq-item', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type FAQItemRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.faq-question-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. FAQ < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const FAQRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('faq-root', className)} {...props} />
));
```

### Accordion integration (from 1.27)

```typescript
interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
  collapsible?: boolean;
  multiple?: boolean;
}
```

### FAQ types and search functionality

```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  order?: number;
}
```

### Search hook for FAQ functionality

```typescript
import { useState, useMemo } from 'react';

export function useFAQSearch(faqs: FAQItem[], searchTerm: string, category?: string) {
  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !category || faq.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, category]);

  return { filteredFAQs };
}
```

## Acceptance Criteria

- [ ] Types; variants; search functionality; export.
- [ ] All 6 variants render
- [ ] search works
- [ ] filtering functional
- [ ] SEO-friendly.

## Technical Constraints

- No fuzzy search
- basic string matching only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; search functionality; export.

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
