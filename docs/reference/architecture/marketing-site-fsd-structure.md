---
title: "marketing-site-fsd-structure.md"
description: "> **Internal Template – customize as needed**"
domain: architecture
type: how-to
layer: global
audience: ["developer", "architect"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["architecture", "marketing-site-fsd-structure.md"]
legacy_path: "architecture\marketing-site-fsd-structure.md"
---
# marketing-site-fsd-structure.md

> **Internal Template – customize as needed**
> **2026 Standards Compliance** | FSD 2.1 · Next.js 16 PPR · WCAG 2.2 AA ·
> Core Web Vitals (LCP ≤2.5s, CLS ≤0.1, INP ≤200ms)

## Table of Contents

1. [Overview](#overview)
2. [Why FSD for Marketing Sites](#why-fsd-for-marketing-sites)
3. [Complete Directory Structure](#complete-directory-structure)
4. [Layer Definitions & Rules](#layer-definitions--rules)
5. [Page Composition Patterns](#page-composition-patterns)
6. [CMS Integration Pattern](#cms-integration-pattern)
7. [Performance Architecture](#performance-architecture)
8. [SEO & Metadata Architecture](#seo--metadata-architecture)
9. [References](#references)

---

## Overview

Marketing sites have **different FSD constraints** from portal apps:

- **No `features/` with mutations** — marketing is read-only; CTAs are links, not actions
- **Heavy `widgets/`** — hero sections, testimonial carousels, pricing tables are self-contained composites
- **PPR-friendly `pages/`** — static shell with dynamic personalization islands
- **CMS-driven `entities/`** — content types (BlogPost, ServiceArea, Testimonial) come from Sanity/Storyblok

---

## Why FSD for Marketing Sites

Marketing sites grow chaotically without structure. Teams add one-off landing pages,
duplicate components, and couple CMS queries to UI. FSD enforces:

1. **Reusable widgets** — `HeroSection`, `TestimonialCarousel`, `PricingTable` work across pages
2. **Typed CMS entities** — `BlogPost`, `ServiceAreaPage`, `Testimonial` have a single model definition
3. **Testable layers** — each widget can be tested in Storybook without routing or CMS dependencies
4. **PPR compatibility** — `pages/` layer naturally maps to Next.js page components with Suspense boundaries

---

## Complete Directory Structure

```
apps/marketing/src/
│
├── app/ # [app layer] — Routing ONLY, minimal logic
│ ├── layout.tsx # Root layout: fonts, analytics, global providers
│ ├── page.tsx # Homepage → imports pages/home
│ ├── about/
│ │ └── page.tsx # → imports pages/about
│ ├── blog/
│ │ ├── page.tsx # Blog index → imports pages/blog-index
│ │ └── [slug]/
│ │ └── page.tsx # Blog post → imports pages/blog-post
│ ├── services/
│ │ └── [area]/
│ │ └── page.tsx # Service area → imports pages/service-area
│ ├── pricing/
│ │ └── page.tsx
│ ├── [tenant]/ # Tenant-specific marketing (white-label)
│ │ └── page.tsx
│ └── sitemap.ts # Dynamic sitemap generation
│
├── pages/ # [pages layer] — Full page compositions
│ ├── home/
│ │ ├── index.tsx # Composes: HeroBanner + ServicesGrid + Testimonials + CTA
│ │ └── index.test.tsx
│ ├── blog-index/
│ │ ├── index.tsx
│ │ └── index.test.tsx
│ ├── blog-post/
│ │ ├── index.tsx # ISR page: fetches from Sanity, renders BlogPostLayout widget
│ │ ├── index.test.tsx
│ │ └── generate-static-params.ts
│ ├── service-area/
│ │ ├── index.tsx # Dynamic local SEO page
│ │ ├── index.test.tsx
│ │ └── generate-static-params.ts
│ └── pricing/
│ ├── index.tsx
│ └── index.test.tsx
│
├── widgets/ # [widgets layer] — Composite, CMS-aware sections
│ │ # Can use entities + shared; CANNOT use features
│ ├── hero-banner/
│ │ ├── index.ts # Public API
│ │ ├── ui/
│ │ │ ├── HeroBanner.tsx
│ │ │ └── HeroBanner.stories.tsx
│ │ └── hero-banner.test.tsx
│ ├── services-grid/
│ │ ├── index.ts
│ │ └── ui/ServicesGrid.tsx
│ ├── testimonial-carousel/
│ │ ├── index.ts
│ │ └── ui/TestimonialCarousel.tsx
│ ├── pricing-table/
│ │ ├── index.ts
│ │ ├── ui/PricingTable.tsx
│ │ └── ui/PricingCard.tsx
│ ├── blog-post-layout/
│ │ ├── index.ts
│ │ └── ui/BlogPostLayout.tsx # Article with TOC, author bio, related posts
│ ├── site-header/
│ │ ├── index.ts
│ │ └── ui/
│ │ ├── SiteHeader.tsx
│ │ └── MobileNav.tsx
│ ├── site-footer/
│ │ ├── index.ts
│ │ └── ui/SiteFooter.tsx
│ ├── service-area-hero/
│ │ ├── index.ts
│ │ └── ui/ServiceAreaHero.tsx # Location-specific hero with schema.org LocalBusiness
│ └── cta-section/
│ ├── index.ts
│ └── ui/CtaSection.tsx
│
├── features/ # [features layer] — VERY LIMITED on marketing sites
│ │ # Only features with minimal side effects
│ ├── contact-form/ # Lead capture form
│ │ ├── index.ts
│ │ ├── ui/ContactForm.tsx
│ │ ├── model/contact-schema.ts # Zod validation
│ │ └── api/submit-contact.ts # Server action
│ ├── newsletter-signup/
│ │ ├── index.ts
│ │ ├── ui/NewsletterForm.tsx
│ │ └── api/subscribe-action.ts
│ └── chat-widget/
│ ├── index.ts
│ └── ui/ChatWidget.tsx # Lazy-loaded, below-fold only
│
├── entities/ # [entities layer] — CMS content types
│ ├── blog-post/
│ │ ├── index.ts
│ │ ├── model/
│ │ │ ├── blog-post.schema.ts # Zod schema matching Sanity schema
│ │ │ └── blog-post.queries.ts # GROQ queries
│ │ └── ui/
│ │ ├── BlogPostCard.tsx
│ │ └── BlogPostMeta.tsx
│ ├── service-area/
│ │ ├── index.ts
│ │ ├── model/
│ │ │ ├── service-area.schema.ts
│ │ │ └── service-area.queries.ts
│ │ └── ui/
│ │ └── ServiceAreaCard.tsx
│ ├── testimonial/
│ │ ├── index.ts
│ │ ├── model/testimonial.schema.ts
│ │ └── ui/TestimonialCard.tsx
│ ├── team-member/
│ │ ├── index.ts
│ │ └── ui/TeamMemberCard.tsx
│ └── site-config/
│ ├── index.ts
│ ├── model/site-config.schema.ts # Per-tenant config
│ └── hooks/use-site-config.ts
│
└── shared/ # [shared layer] — Zero business logic
├── lib/
│ ├── sanity-client.ts # Sanity client (shared, no entity-specific queries)
│ ├── cn.ts # className utility
│ ├── format-date.ts
│ └── structured-data.ts # JSON-LD helpers
├── ui/
│ ├── Button.tsx
│ ├── Badge.tsx
│ ├── OptimizedImage.tsx # next/image wrapper with blur placeholder
│ └── index.ts
├── config/
│ ├── site.ts # Root domain, default OG image
│ └── seo.ts # Default metadata
└── analytics/
├── PostHogProvider.tsx
└── track-event.ts

```

---

## Layer Definitions & Rules

### `app/` — Routing Only

Marketing site `app/` pages must be **thin wrappers**:

```typescript
// app/blog/[slug]/page.tsx  ✅ CORRECT
import { BlogPostPage } from '@/pages/blog-post'
import { generateBlogPostMetadata } from '@/pages/blog-post/seo'
import type { Metadata } from 'next'

export { generateBlogPostMetadata as generateMetadata }

export default function Page({ params }: { params: { slug: string } }) {
  return <BlogPostPage slug={params.slug} />
}

// ❌ WRONG — data fetching in app/ route
export default async function Page({ params }) {
  const post = await sanityClient.fetch(BLOG_POST_QUERY, { slug: params.slug })
  return <article>...</article>  // Logic belongs in pages/ layer
}
```

### `pages/` — Data Fetching + Composition

```typescript
// pages/blog-post/index.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BlogPostLayout } from '@/widgets/blog-post-layout'
import { RelatedPosts } from '@/widgets/related-posts'
import { CtaSection } from '@/widgets/cta-section'
import { fetchBlogPost } from '@/entities/blog-post/model/blog-post.queries'

// Static with ISR: revalidate every hour, on-demand via Sanity webhook
export const revalidate = 3600

interface BlogPostPageProps {
  slug: string
}

export async function BlogPostPage({ slug }: BlogPostPageProps) {
  const post = await fetchBlogPost(slug)
  if (!post) notFound()

  return (
    <>
      {/* Static shell (PPR) — renders immediately */}
      <BlogPostLayout post={post} />

      {/* Dynamic island — personalized related posts */}
      <Suspense fallback={<RelatedPostsSkeleton />}>
        <RelatedPosts currentSlug={slug} tags={post.tags} />
      </Suspense>

      {/* Static CTA — always the same */}
      <CtaSection
        headline="Ready to get started?"
        cta={{ label: 'Get a Free Quote', href: '/contact' }}
      />
    </>
  )
}
```

### `widgets/` — Storybook-Testable Composites

```typescript
// widgets/hero-banner/ui/HeroBanner.tsx
import Image from 'next/image'
import { Button } from '@/shared/ui'
import type { HeroBannerProps } from '../index'

export function HeroBanner({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
}: HeroBannerProps) {
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative min-h-[60vh] flex items-center"
    >
      {backgroundImage && (
        // LCP element: priority load, explicit dimensions
        <Image
          src={backgroundImage.url}
          alt={backgroundImage.alt}
          fill
          priority                          // LCP optimization
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={backgroundImage.blur}
        />
      )}

      <div className="relative z-10 container mx-auto px-4">
        <h1
          id="hero-headline"
          className="text-4xl font-bold tracking-tight md:text-6xl"
        >
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-4 text-xl text-gray-600">{subheadline}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={ctaPrimary.href} size="lg">
            {ctaPrimary.label}
          </Button>
          {ctaSecondary && (
            <Button href={ctaSecondary.href} variant="outline" size="lg">
              {ctaSecondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
```

---

## CMS Integration Pattern

CMS queries live in `entities/[type]/model/[type].queries.ts` — never in widgets or pages:

```typescript
// entities/blog-post/model/blog-post.queries.ts
import { sanityClient } from '@/shared/lib/sanity-client';
import { z } from 'zod';

export const BlogPostSchema = z.object({
  _id: z.string(),
  slug: z.string(),
  title: z.string(),
  publishedAt: z.string(),
  excerpt: z.string().optional(),
  coverImage: z
    .object({
      url: z.string(),
      alt: z.string(),
      blur: z.string().optional(),
    })
    .optional(),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(),
  }),
  body: z.array(z.unknown()), // Portable Text
  tags: z.array(z.string()),
  readingTimeMinutes: z.number(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

const BLOG_POST_QUERY = `
  *[_type == "blogPost" && slug.current == $slug] {
    _id,
    "slug": slug.current,
    title,
    publishedAt,
    excerpt,
    "coverImage": coverImage {
      "url": asset->url,
      "alt": alt,
      "blur": asset->metadata.lqip
    },
    author-> { name, "avatar": image.asset->url },
    body,
    tags,
    "readingTimeMinutes": round(length(pt::text(body)) / 5 / 200)
  }
`;

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const raw = await sanityClient.fetch(BLOG_POST_QUERY, { slug });
  if (!raw) return null;
  const result = BlogPostSchema.safeParse(raw);
  if (!result.success) {
    console.error('BlogPost schema validation failed:', result.error);
    return null;
  }
  return result.data;
}
```

---

## Performance Architecture

### PPR Configuration

```typescript
// app/blog/[slug]/page.tsx
// PPR: static shell streams immediately, dynamic parts use Suspense

// Make the page static by default (PPR shell)
export const dynamic = 'force-static';
export const revalidate = 3600;

// But allow dynamic islands inside via Suspense
// The <Suspense fallback> renders in the static shell,
// dynamic content streams in after
```

### Core Web Vitals Targets

| Metric | Target  | Marketing Site Strategy                                 |
| ------ | ------- | ------------------------------------------------------- |
| LCP    | ≤ 2.5s  | Hero image: `priority`, `sizes`, blur placeholder       |
| CLS    | ≤ 0.1   | Explicit `width`/`height` on all images; no FOUT        |
| INP    | ≤ 200ms | Lazy load chat widget, carousel JS; no blocking scripts |
| TTFB   | ≤ 800ms | ISR + CDN caching; PPR for dynamic pages                |

### Image Optimization

```typescript
// shared/ui/OptimizedImage.tsx
import Image from 'next/image'
import { getSanityImageDimensions } from '../lib/sanity-image'

interface OptimizedImageProps {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
}: OptimizedImageProps) {
  const { width, height } = getSanityImageDimensions(src)

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  )
}
```

---

## SEO & Metadata Architecture

### Dynamic Metadata Generation

```typescript
// pages/blog-post/seo.ts
import type { Metadata } from 'next';
import { BlogPost } from '@/entities/blog-post/model/blog-post.queries';

export async function generateBlogPostMetadata({ post }: { post: BlogPost }): Promise<Metadata> {
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage.url] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage.url] : [],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}
```

### Structured Data Integration

```typescript
// shared/lib/structured-data.ts
export function generateBlogPostStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Company',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
      },
    },
  };
}
```

---

## References

- [Feature-Sliced Design v2.1](https://feature-sliced.design/) - FSD methodology
- [Next.js 16 PPR Documentation](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering) - Partial Prerendering
- [Sanity CMS GROQ Queries](https://www.sanity.io/docs/groq) - Content queries
- [Core Web Vitals 2026](https://web.dev/vitals/) - Performance metrics
- [Storybook Testing](https://storybook.js.org/) - Component testing
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/) - Accessibility standards

---