# 3.1 Create Page-Templates Registry and Package Scaffold

## Metadata

- **Task ID**: 3-1-create-page-templates-registry-and-package-scaffold
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Registry (Map), SectionProps, TemplateConfig, composePage. No switch-based section selection. L3.

## Dependencies

- **Package**: @repo/page-templates – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-NEXT**: App Router, RSC, Server Actions — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-next) for full research findings.
- **[2026-02-18] R-CMS**: Content adapters, MDX, pagination — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-cms) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-NEXT](RESEARCH-INVENTORY.md#r-next) — Full research findings
- [RESEARCH-INVENTORY.md - R-CMS](RESEARCH-INVENTORY.md#r-cms) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/page-templates/src/registry.ts, types.ts, index.ts, templates/empty` – create – (see task objective)

## Code Snippets / Examples

### R-NEXT — App Router and Server Components

```typescript
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Server Component by default
export default async function Page({ params }: { params: { slug: string } }) {
  const data = await fetchData(params.slug);

  if (!data) {
    notFound();
  }

  return React.createElement(
    Suspense,
    { fallback: React.createElement('div', {}, 'Loading...') },
    React.createElement(PageContent, { data })
  );
}

// Client Component for interactivity
('use client');

export function InteractiveComponent() {
  const [state, setState] = React.useState(null);

  return React.createElement('div', {}, 'interactive content');
}
```

### R-CMS — Content adapters and pagination

```typescript
interface ContentAdapter {
  getContent: (params: ContentParams) => Promise<ContentItem[]>;
  getPagination: (params: ContentParams) => Promise<PaginationInfo>;
  searchContent: (query: string) => Promise<ContentItem[]>;
}

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishDate: string;
  author?: Author;
  categories?: Category[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function Component({ ref, className, ...props }: ComponentProps) {
  return React.createElement(Primitive.Root, {
    ref,
    className: cn('component', className),
    ...props,
  });
}
```

### R-A11Y — Touch targets and reduced motion

```css
.component-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — Core Web Vitals optimization

```typescript
// Performance monitoring
export function reportWebVitals(metric: any) {
  // Send to analytics service
  console.log({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  });
}

// Bundle optimization
export function optimizeBundle() {
  // Bundle optimization logic
}

// Image optimization with next/image
export function OptimizedImage({ src, alt, priority }: ImageProps) {
  return React.createElement(Image, {
    src,
    alt,
    priority,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  });
}
```

### Related Patterns

- See [R-NEXT - Research Findings](RESEARCH-INVENTORY.md#r-next) for additional examples
- See [R-CMS - Research Findings](RESEARCH-INVENTORY.md#r-cms) for additional examples

## Acceptance Criteria

- [ ] registry.ts; types.ts; composePage; templates/; index; deps; type-check; build.
- [ ] Registry exists
- [ ] composePage works with stubs
- [ ] 3.2 can add HomePageTemplate.

## Technical Constraints

- No CMS section definitions
- config from siteConfig only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] registry.ts; types.ts; composePage; templates/; index; deps; type-check; build.

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
