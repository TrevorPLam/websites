# 2.13 Build Blog Components

## Metadata

- **Task ID**: 2-13-build-blog-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.41 (Pagination)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

15+ Blog variants with pagination, filtering, and related posts. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Featured + Grid, Card Grid, Masonry, With Sidebar, Minimal, Magazine, Timeline, Category Tabs, Tagged, Searchable, With Author, With Date, Infinite Scroll (15+ total)
- **Pagination:** Page-based, infinite scroll, load more
- **Filtering:** By category, tag, author, date
- **Related Posts:** Algorithm-based, manual selection

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.41 (Pagination) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.41 (Pagination); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-CMS**: Content adapters, MDX, pagination — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-cms) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-CMS](RESEARCH-INVENTORY.md#r-cms) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/marketing-components/src/blog/types.ts` – modify – (see task objective)
- `BlogGrid.tsx` – modify – (see task objective)
- `BlogList.tsx` – modify – (see task objective)
- `BlogMasonry.tsx` – modify – (see task objective)
- `BlogWithSidebar.tsx` – modify – (see task objective)
- `BlogPostCard.tsx` – modify – (see task objective)
- `blog/pagination.tsx` – modify – (see task objective)
- `blog/filters.tsx` – modify – (see task objective)
- `blog/related.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Blog section with composition

```typescript
interface BlogProps {
  posts: BlogPost[];
  layout?: 'grid' | 'list' | 'masonry' | 'with-sidebar';
  pagination?: PaginationConfig;
  filters?: BlogFilters;
  showRelated?: boolean;
  children?: React.ReactNode;
}
export function BlogSection({ posts, layout = 'grid', pagination, filters, showRelated, children }: BlogProps) {
  return (
    <section>
      <div className={layout}>{/* blog posts */}</div>
      {pagination && <BlogPagination {...pagination} />}
      {filters && <BlogFilters {...filters} />}
      {showRelated && <RelatedPosts posts={posts} />}
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function BlogPostCard({ ref, className, ...props }: BlogPostCardProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('blog-post-card', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type BlogPostCardRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-A11Y — Touch targets and reduced motion

```css
.blog-post-link {
  min-width: 24px;
  min-height: 24px;
}

.blog-pagination-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. blog < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const BlogRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('blog-root', className)} {...props} />
));
```

### Pagination integration (from 1.41)

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}
```

### R-CMS — Content adapters and pagination

```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishDate: string;
  categories: Category[];
  tags: string[];
  featuredImage?: string;
  slug: string;
}

interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}
```

### Blog filtering hook

```typescript
import { useMemo } from 'react';

export function useBlogFiltering(posts: BlogPost[], filters: BlogFilters) {
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        !filters.category || post.categories.some((cat) => cat.slug === filters.category);
      const matchesTag = !filters.tag || post.tags.includes(filters.tag);
      const matchesAuthor = !filters.author || post.author.slug === filters.author;

      return matchesCategory && matchesTag && matchesAuthor;
    });
  }, [posts, filters]);

  return { filteredPosts };
}
```

## Acceptance Criteria

- [ ] Types; variants; pagination; filtering; related posts; export.
- [ ] All 15+ variants render
- [ ] pagination works
- [ ] filtering functional
- [ ] related posts display.

## Technical Constraints

- No CMS integration
- data from props only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; pagination; filtering; related posts; export.

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
