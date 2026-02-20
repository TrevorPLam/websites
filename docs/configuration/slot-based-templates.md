<!--
@file docs/configuration/slot-based-templates.md
@role Configuration reference
@summary How to use PageTemplateSlots to inject header, aboveFold, and footer content
         into page templates without modifying the section registry.
@invariants
  - Slots are optional React nodes; null/undefined slots render nothing
  - Slot rendering order: header → aboveFold → sections → footer
  - Slot system requires no changes to composePage or the section registry
@gotchas
  - Slots are client-compatible but page templates themselves are Server Components;
    pass server-rendered slot content where possible
  - The Slot primitive from @repo/infra/composition/slots is for asChild prop
    composition (Radix-style); PageTemplateSlots are independent content-injection points
@verification
  pnpm type-check
  pnpm --filter @repo/page-templates test
@status stable
-->

# Slot-Based Page Templates

**Task:** 3.4 — Slot-Based Page Templates
**Package:** `@repo/page-templates`
**Source:** `packages/page-templates/src/types.ts`

---

## Overview

All page templates (`HomePageTemplate`, `ServicesPageTemplate`, etc.) accept an optional
`slots` prop of type `PageTemplateSlots`. Slots inject arbitrary React content into three
named positions in any template **without** modifying the section registry or `composePage`
logic.

```
┌──────────────────────────┐
│  slots.header            │  ← top of page (nav, announcement bar)
├──────────────────────────┤
│  slots.aboveFold         │  ← before first section (breadcrumbs, context)
├──────────────────────────┤
│  composePage() sections  │  ← sections from site.config.ts features
├──────────────────────────┤
│  slots.footer            │  ← bottom of page (footer, legal, persistent CTA)
└──────────────────────────┘
```

---

## API

```ts
// packages/page-templates/src/types.ts
interface PageTemplateSlots {
  header?: React.ReactNode; // Very top — before all sections
  aboveFold?: React.ReactNode; // Before first section (after header)
  footer?: React.ReactNode; // Very bottom — after all sections
}

interface PageTemplateProps {
  config: SiteConfig;
  searchParams?: Record<string, string | string[] | undefined>;
  slots?: PageTemplateSlots; // ← NEW in Task 3.4
}
```

---

## Usage Examples

### Inject a site navigation and footer

```tsx
// app/[locale]/page.tsx
import { HomePageTemplate } from '@repo/page-templates';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import siteConfig from '@/site.config';

export default function HomePage() {
  return (
    <HomePageTemplate
      config={siteConfig}
      slots={{
        header: <SiteNav />,
        footer: <SiteFooter />,
      }}
    />
  );
}
```

### Add an announcement banner above the fold

```tsx
import { HomePageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function HomePage() {
  return (
    <HomePageTemplate
      config={siteConfig}
      slots={{
        aboveFold: (
          <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
            🎉 Summer sale — 20% off all services this week!
          </div>
        ),
      }}
    />
  );
}
```

### Per-page breadcrumbs (services page)

```tsx
import { ServicesPageTemplate } from '@repo/page-templates';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '@repo/ui';
import siteConfig from '@/site.config';

export default function ServicesPage() {
  return (
    <ServicesPageTemplate
      config={siteConfig}
      slots={{
        aboveFold: (
          <div className="container mx-auto px-4 py-2">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Services</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        ),
      }}
    />
  );
}
```

### All three slots together

```tsx
<BookingPageTemplate
  config={siteConfig}
  searchParams={searchParams}
  slots={{
    header: <SiteNav />,
    aboveFold: <AnnouncementBanner />,
    footer: <SiteFooter />,
  }}
/>
```

---

## How It Works

Every template follows this render pattern:

```tsx
export function HomePageTemplate({ config, slots }: PageTemplateProps): React.ReactElement {
  const content = composePage({ page: 'home' }, config);
  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <EmptyState />}
      {slots?.footer}
    </>
  );
}
```

- **No registry changes needed** — slots wrap the composePage output externally
- **Null-safe** — unset slots render nothing (optional chaining `slots?.header`)
- **React fragments** — no wrapper DOM element added by the slot mechanism

---

## Supported Templates

All 7 page templates support the `slots` prop:

| Template               | Import                 |
| ---------------------- | ---------------------- |
| `HomePageTemplate`     | `@repo/page-templates` |
| `ServicesPageTemplate` | `@repo/page-templates` |
| `AboutPageTemplate`    | `@repo/page-templates` |
| `ContactPageTemplate`  | `@repo/page-templates` |
| `BlogIndexTemplate`    | `@repo/page-templates` |
| `BlogPostTemplate`     | `@repo/page-templates` |
| `BookingPageTemplate`  | `@repo/page-templates` |

---

## Related

- **Section registry** — `packages/page-templates/src/registry.ts` — add new section types
- **composePage** — `packages/page-templates/src/registry.ts` — drives section rendering
- **Slot (asChild)** — `@repo/infra/composition/slots` — prop-merging for component composition
  (different concept from page template slots; used for Radix-style `asChild` patterns)
- **ThemeProvider** — `@repo/infrastructure-ui/theme` — provides `useTheme()` for color mode
- **ADR 0005** — Tailwind v4 migration (theming context)
