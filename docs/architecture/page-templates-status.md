<!--
/**
 * @file docs/architecture/page-templates-status.md
 * @role docs
 * @summary Page templates implementation status and usage guidance.
 *
 * @entrypoints
 * - Architecture documentation for page templates
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - packages/page-templates
 * - packages/marketing-components
 *
 * @used_by
 * - Developers using page templates
 * - Template maintainers
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: SiteConfig, searchParams
 * - outputs: Composed page React elements
 *
 * @invariants
 * - Templates use composePage registry pattern
 * - Sections must be registered before use
 * - Templates return null or empty div if no sections found
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Page Templates Status

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [@repo/page-templates](../../packages/page-templates), [@repo/marketing-components](../../packages/marketing-components), [evolution-roadmap](evolution-roadmap.md)

---

## Overview

Page templates use a registry-based composition pattern where sections are registered and composed dynamically based on `site.config.ts` features. All 7 templates are implemented and functional.

## Implementation Status

| Template                 | Status         | Sections Registered                                         | Usage                    |
| ------------------------ | -------------- | ----------------------------------------------------------- | ------------------------ |
| **HomePageTemplate**     | ✅ Implemented | hero-\*, services-preview, team, testimonials, pricing, cta | Used in starter-template |
| **ServicesPageTemplate** | ✅ Implemented | services-\* (grid/list/tabs/accordion)                      | Available for use        |
| **AboutPageTemplate**    | ✅ Implemented | about-hero, about-team, about-testimonials, about-cta       | Available for use        |
| **ContactPageTemplate**  | ✅ Implemented | contact-form, contact-info                                  | Available for use        |
| **BlogIndexTemplate**    | ✅ Implemented | blog-grid, blog-pagination                                  | Available for use        |
| **BlogPostTemplate**     | ✅ Implemented | blog-post-content, blog-related-posts, blog-cta             | Available for use        |
| **BookingPageTemplate**  | ✅ Implemented | booking-form                                                | Available for use        |

## Architecture

### Registry Pattern

Templates use a section registry to compose pages:

```typescript
// Sections register themselves on import
import '../sections/home'; // Side-effect: registers sections

// Template composes page from registered sections
const result = composePage({ page: 'home' }, siteConfig);
```

### Section Registration

Sections are registered by template modules:

```typescript
// packages/page-templates/src/sections/home.tsx
registerSection('hero-split', HeroSplitAdapter);
registerSection('services-preview', ServicesPreviewAdapter);
// ... etc
```

### Page Composition

Templates derive sections from `site.config.ts`:

```typescript
// HomePageTemplate derives sections from features
if (page === 'home') {
  if (features.hero) sections.push(`hero-${features.hero}`);
  if (features.services) sections.push('services-preview');
  // ... etc
}
```

## Usage

### In Client Pages

```tsx
// clients/starter-template/app/[locale]/page.tsx
import { HomePageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function HomePage() {
  return <HomePageTemplate config={siteConfig} />;
}
```

### Template Behavior

- **Sections found:** Renders composed page with all registered sections
- **No sections:** Returns `null` or empty `<div data-template="...">`
- **Partial sections:** Renders only registered sections (unknown IDs skipped)

## Current Limitations

1. **Empty state handling:** Templates return empty divs when no sections match (could show placeholder)
2. **Section completeness:** Some sections may have empty data (e.g., testimonials with empty array)
3. **Content sourcing:** Sections derive minimal data from `site.config.ts` (may need CMS integration)

## Recommendations

### Short-term

1. **Add placeholder fallback:** Show helpful message when `composePage` returns null
2. **Document section requirements:** Which `site.config.ts` fields are needed for each template
3. **Add section examples:** Show how to populate sections with real data

### Medium-term

1. **CMS integration:** Connect sections to content sources (task c-10)
2. **Section validation:** Warn when required sections aren't registered
3. **Template preview:** Add template preview in development mode

### Long-term

1. **Visual editor:** Allow non-developers to compose pages (task c-10)
2. **Template variants:** Support multiple template variants per page type
3. **A/B testing:** Built-in template variant testing

## Evolution: Capability-Based Composition and Universal Renderer

Per [NEW.md](../../NEW.md) (Phase 3–4), page composition will evolve:

- **Capability-based composition** — Sections can reference `capability: 'booking'`; capabilities provide sections. evol-8.
- **Universal renderer** — New clients may opt in via `renderer: 'universal'`; capability-driven composition with `activateCapabilities` and `CapabilityProvider`. evol-9.
- **Classic vs universal** — Classic clients continue using the current registry; universal renderer is opt-in for new clients.

See [evolution-roadmap.md](evolution-roadmap.md) for phase sequencing.

## Related Documentation

- [@repo/page-templates source](../../packages/page-templates)
- [@repo/marketing-components](../../packages/marketing-components)
- [Content Operations](../content-operations.md) (if exists)
