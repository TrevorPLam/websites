# Marketing Components Library

**Last Updated:** 2026-02-18  
**Validation:** `pnpm validate-marketing-exports`  
**Package:** `@repo/marketing-components`  
**Purpose:** Marketing-specific UI component families for template composition

---

## Overview

The `@repo/marketing-components` package provides display-only components organized by section type: Hero, Services, Team, Testimonials, Pricing, Gallery, Stats, CTA, FAQ, Navigation, Footer, Blog, Product, Event. These are consumed by `@repo/features` and client templates.

### Key Principles

- **Display only:** Components accept data via props; no CMS/API integration
- **Depends only on @repo/ui:** No dependency on @repo/features (avoids cycles)
- **Types in types.ts:** Each family has a `types.ts` for shared interfaces
- **Composition:** Use Container, Section, Card, cn() from @repo/ui

### Link Pattern

Avoid `Button asChild` (not supported). Use styled anchors or `HeroCTAButton` for link-style CTAs:

```tsx
<a href={href} className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-8...">
  {label}
</a>
```

---

## Component Families

### Hero (2-1)
- Variants: Centered, Split, Video, Carousel, ImageBackground, Gradient, etc.
- Uses: `HeroCTAButton` for CTAs, `Container`, `Section`

### Services (2-2)
- ServiceGrid, ServiceAccordion, ServiceList, ServiceTabs
- Types: `Service`, `ServiceFilter` in `services/types.ts`

### Team (2-3)
- TeamGrid, TeamCarousel, TeamDetailed
- Types: `TeamMember` (avatar/photo, socialLinks)

### Testimonials (2-4)
- TestimonialCarousel, TestimonialGrid, TestimonialMarquee
- Types: `Testimonial` (quote/content, author, rating)

### Pricing (2-5)
- PricingTable, PricingCards, PricingCalculator (stub)
- Types: `PricingPlan`, `PricingFeature`

### Gallery (2-6)
- GalleryGrid
- Types: `GalleryItem`

### Stats (2-7)
- StatsCounter

### CTA (2-8)
- CTASection (styled anchors, not Button asChild)

### FAQ (2-9)
- FAQSection (uses Accordion from @repo/ui)

### Navigation (2-11)
- NavigationHorizontal, NavigationMobile, NavigationMegaMenu
- Hooks: useMobileNavigation
- Types: NavigationItem, MegaMenuFeatured

### Footer (2-12)
- FooterStandard, FooterMinimal, FooterWithNewsletter, FooterSocial
- Hooks: useNewsletter

### Blog (2-13)
- BlogPostCard, BlogGrid, BlogList, BlogMasonry, BlogWithSidebar, BlogPagination, RelatedPosts

### Product (2-14)
- ProductCard, ProductGrid, ProductDetail, ProductComparison

### Event (2-15)
- EventCard, EventGrid, EventTimeline, EventCalendar, EventRegistration

### Industry & Advanced (2-48 through 2-62)

| Family | Components | Purpose |
|--------|------------|---------|
| **Location (2-48)** | LocationCard, LocationList | Addresses, hours, directions |
| **Menu (2-49)** | MenuCard, MenuList | Restaurant menus, dietary tags |
| **Portfolio (2-50)** | PortfolioCard, PortfolioGrid | Work samples, case studies |
| **Case Study (2-51)** | CaseStudyCard | Client success stories |
| **Job Listing (2-52)** | JobListingCard | Career listings |
| **Course (2-53)** | CourseCard, CourseGrid | Education courses, enrollment |
| **Resource (2-54)** | ResourceCard, ResourceGrid | Downloadable resources |
| **Comparison (2-55)** | ComparisonTable | Feature/price comparison |
| **Filter (2-56)** | FilterBar | Category filter buttons |
| **Search (2-57)** | SearchBar | Search input |
| **Social Proof (2-58)** | SocialProofBadge, SocialProofStack | Trust badges |
| **Video (2-59)** | VideoEmbed | YouTube, Vimeo, native |
| **Audio (2-60)** | AudioPlayer | Native audio element |
| **Interactive (2-61)** | AccordionContent | Accordion wrapper |
| **Widget (2-62)** | WidgetCard | Generic widget container |

---

## Feature Modules

Feature orchestration lives in `@repo/features`. Features depend on marketing-components for display:

| Feature | Section Component | Display Components Used |
|---------|-------------------|-------------------------|
| Team | TeamSection | TeamGrid, TeamCarousel, TeamDetailed |
| Testimonials | TestimonialsSection | TestimonialCarousel, TestimonialGrid, TestimonialMarquee |
| Gallery | GallerySection | GalleryGrid |
| Pricing | PricingSection | PricingTable, PricingCards |
| Newsletter | NewsletterSection | Input, custom form |
| Social Media | SocialMediaSection | Container, Section |
| Reviews | ReviewsSection | TestimonialGrid, TestimonialCarousel |
| Contact | ContactFormStandard | ContactForm (in features) |

---

## Usage

```tsx
import { TeamGrid, HeroCentered } from '@repo/marketing-components';
import { TeamSection } from '@repo/features/team';

// Direct display component
<TeamGrid members={members} title="Our Team" />

// Feature section (handles layout + config)
<TeamSection members={members} layout="grid" />
```

---

_See [phase-analysis-2-tasks.md](../qa/phase-analysis-2-tasks.md) for implementation status._
