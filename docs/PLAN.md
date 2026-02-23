Here are Domains 27–30 at full production depth.

---

## DOMAIN 27: SERVICE AREA PAGES

### 27.1 Philosophy

**What it is:** Programmatic SEO at scale — for every city in a client's service area, the platform auto-generates a dedicated landing page: `/service-area/plano-tx`, `/service-area/frisco-tx`, `/service-area/allen-tx`. Each page is unique (not duplicate content), targeting exact long-tail queries like "HVAC repair in Plano TX" or "licensed electrician Frisco TX." [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)

**Why this is the single highest-ROI feature for service businesses:** Local service businesses live and die by hyper-local search. A plumber in Plano competes with hundreds of other plumbers on the query "plumber near me" — but may face zero direct competition on "emergency water heater replacement Allen TX." Each programmatic area page captures a slice of that long-tail demand with virtually no marginal effort. [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)

**Rendering strategy:** `generateStaticParams` generates the top 10 cities at build time (seed routes). All remaining cities in the config use `dynamicParams = true` with `cacheLife({ revalidate: 86400 })` — they're generated on first request and cached 24h. This means 500 cities never bloat your build time. [mgphq](https://www.mgphq.com/blog/nextjs-programmatic-seo-isr-guide)

---

### 27.2 Service Area Route

**File:** `apps/*/src/app/service-area/[slug]/page.tsx`

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { cacheLife, cacheTag } from 'next/cache';
import { resolveTenant } from '@repo/multi-tenant/resolve-tenant';
import { db } from '@repo/db';
import { buildMetadata } from '@repo/seo/metadata-factory';
import {
  buildLocalBusinessSchema,
  buildServiceSchema,
  buildBreadcrumbSchema,
  JsonLd,
} from '@repo/seo/structured-data';
import { ServiceAreaHero } from '@/components/service-area/ServiceAreaHero';
import { ServiceAreaServices } from '@/components/service-area/ServiceAreaServices';
import { ServiceAreaTestimonials } from '@/components/service-area/ServiceAreaTestimonials';
import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { BookingEmbedPopup } from '@repo/ui/booking/BookingEmbed';

// ============================================================================
// SERVICE AREA PAGE — Programmatic Local SEO
// URL: /service-area/[slug]   e.g. /service-area/plano-tx
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Allow pages beyond the seeded static set (on-demand ISR)
export const dynamicParams = true;

// Seed top 10 service areas at build time per tenant
export async function generateStaticParams() {
  const allTenants = await db
    .from('tenants')
    .select('config')
    .eq('status', 'active');

  const params: { slug: string }[] = [];

  for (const tenant of allTenants.data ?? []) {
    const areas: string[] = (tenant.config as any)?.identity?.serviceAreas ?? [];
    // Seed the first 10 areas only — rest are on-demand ISR
    areas.slice(0, 10).forEach((area) => {
      params.push({ slug: slugifyArea(area) });
    });
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const tenantContext = await resolveTenant({ headers: headersList } as any);
  if (!tenantContext) return {};

  const { data: tenant } = await db
    .from('tenants')
    .select('config')
    .eq('id', tenantContext.tenantId)
    .single();

  if (!tenant?.config) return {};

  const config = tenant.config as any;
  const areaName = deslugifyArea(slug);
  const city = areaName.split(',')[0].trim();
  const state = areaName.split(',') [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)?.trim() ?? config.identity?.address?.state ?? '';
  const industry = config.identity?.industry ?? 'services';

  return buildMetadata({
    config,
    path: `/service-area/${slug}`,
    pageTitle: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Services in ${city}${state ? `, ${state}` : ''}`,
    pageDescription: `${config.identity?.siteName} provides professional ${industry} services in ${city}, ${state}. ${config.identity?.tagline ?? ''} Licensed, insured, and locally trusted. Free estimates — call ${config.identity?.contact?.phone ?? 'today'}.`,
  });
}

export default async function ServiceAreaPage({ params }: PageProps) {
  'use cache';

  const { slug } = await params;
  const headersList = await headers();

  const tenantContext = await resolveTenant({ headers: headersList } as any);
  if (!tenantContext) return notFound();

  const { tenantId } = tenantContext;

  cacheTag(`tenant:${tenantId}:service-area:${slug}`);
  cacheLife({ revalidate: 86400 }); // 24h — static content rarely changes

  const { data: tenant } = await db
    .from('tenants')
    .select('config, custom_domain, subdomain')
    .eq('id', tenantId)
    .single();

  if (!tenant?.config) return notFound();

  const config = tenant.config as any;
  const identity = config.identity ?? {};
  const serviceAreas: string[] = identity.serviceAreas ?? [];
  const domain = tenant.custom_domain ?? `${tenant.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const siteUrl = `https://${domain}`;

  // Validate: area must be in the configured service areas
  const areaName = deslugifyArea(slug);
  const isValidArea = serviceAreas.some(
    (a: string) => slugifyArea(a) === slug || a.toLowerCase() === areaName.toLowerCase()
  );

  if (!isValidArea) return notFound();

  const city = areaName.split(',')[0].trim();
  const state = areaName.split(',') [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)?.trim() ?? identity.address?.state ?? '';
  const services = identity.services ?? [];
  const industry = identity.industry ?? 'services';

  // Build page-specific LocalBusiness schema (override city with service area city)
  const localSchema = {
    ...buildLocalBusinessSchema(config),
    name: `${identity.siteName} — ${city}`,
    description: `Professional ${industry} services in ${city}, ${state}. ${identity.tagline ?? ''}`,
    areaServed: [{ '@type': 'City', name: city }],
  };

  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, identity.siteName, [
    { name: 'Service Areas', url: `${siteUrl}/service-areas` },
    { name: city, url: `${siteUrl}/service-area/${slug}` },
  ]);

  const calUsername = null; // Fetched from secrets only if needed client-side

  return (
    <>
      {/* Structured Data */}
      <JsonLd schema={localSchema} />
      <JsonLd schema={breadcrumbSchema} />
      {services.slice(0, 3).map((service: any) => (
        <JsonLd
          key={service.slug}
          schema={buildServiceSchema(config, service)}
        />
      ))}

      {/* Page content */}
      <main id="main-content">
        <ServiceAreaHero
          city={city}
          state={state}
          businessName={identity.siteName}
          industry={industry}
          tagline={identity.tagline}
          phone={identity.contact?.phone}
          primaryColor={config.theme?.colors?.primary}
        />

        <ServiceAreaServices
          city={city}
          services={services}
          businessName={identity.siteName}
          industry={industry}
        />

        {identity.testimonials?.length > 0 && (
          <ServiceAreaTestimonials
            testimonials={identity.testimonials}
            city={city}
          />
        )}

        <section className="py-16 bg-gray-50" aria-label="Contact us">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Get a Free Estimate in {city}
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
              Serving {city} and the surrounding {state} area. Response within 1 business hour.
            </p>
            <ContactFormSection
              tenantId={tenantId}
              metadata={{ serviceArea: slug, city, state }}
            />
          </div>
        </section>

        {/* Internal links to other service areas (SEO: link equity distribution) */}
        <RelatedServiceAreas
          currentSlug={slug}
          areas={serviceAreas}
          siteUrl={siteUrl}
        />
      </main>
    </>
  );
}

// ── Related areas nav (internal linking) ─────────────────────────────────────

function RelatedServiceAreas({
  currentSlug,
  areas,
  siteUrl,
}: {
  currentSlug: string;
  areas: string[];
  siteUrl: string;
}) {
  const others = areas
    .filter((a) => slugifyArea(a) !== currentSlug)
    .slice(0, 8);

  if (others.length === 0) return null;

  return (
    <nav
      aria-label="Other service areas"
      className="py-12 bg-white border-t border-gray-100"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Also Serving:
        </h2>
        <ul className="flex flex-wrap gap-3" role="list">
          {others.map((area) => (
            <li key={area}>
              <a
                href={`${siteUrl}/service-area/${slugifyArea(area)}`}
                className="px-4 py-2 bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-700 rounded-full text-sm transition-colors"
              >
                {area}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugifyArea(area: string): string {
  return area
    .toLowerCase()
    .replace(/,\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function deslugifyArea(slug: string): string {
  // "plano-tx" → "Plano, TX"
  // "north-richland-hills-tx" → "North Richland Hills, TX"
  const parts = slug.split('-');
  const stateAbbr = parts[parts.length - 1]?.toUpperCase();
  const US_STATES = ['TX', 'CA', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI',
    'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI', 'CO', 'MN',
    'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT', 'NV', 'AR', 'MS', 'KS',
    'NM', 'NE', 'WV', 'ID', 'HI', 'NH', 'ME', 'MT', 'RI', 'DE', 'SD', 'ND',
    'AK', 'VT', 'WY', 'DC'];

  if (US_STATES.includes(stateAbbr ?? '')) {
    const cityParts = parts.slice(0, -1);
    const city = cityParts
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return `${city}, ${stateAbbr}`;
  }

  // No state abbr detected — treat whole slug as city name
  return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
```

---

### 27.3 Service Area Hero Component

**File:** `apps/*/src/components/service-area/ServiceAreaHero.tsx`

```typescript
interface ServiceAreaHeroProps {
  city: string;
  state: string;
  businessName: string;
  industry: string;
  tagline?: string;
  phone?: string;
  primaryColor?: string;
}

export function ServiceAreaHero({
  city,
  state,
  businessName,
  industry,
  tagline,
  phone,
  primaryColor = '#2563eb',
}: ServiceAreaHeroProps) {
  const industryLabel = industry.charAt(0).toUpperCase() + industry.slice(1);

  return (
    <section
      className="relative py-20 px-6 text-center overflow-hidden"
      style={{ backgroundColor: `${primaryColor}08` }}
      aria-labelledby="area-hero-heading"
    >
      {/* Geo badge */}
      <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-6 shadow-sm">
        <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        Serving {city}, {state}
      </div>

      <h1
        id="area-hero-heading"
        className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight max-w-3xl mx-auto"
      >
        {industryLabel} Services{' '}
        <span style={{ color: primaryColor }}>in {city}</span>
      </h1>

      {tagline && (
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          {tagline}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
            aria-label={`Call ${businessName} at ${phone}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
            </svg>
            Call {phone}
          </a>
        )}

        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
          style={{ borderColor: primaryColor, color: primaryColor }}
        >
          Get a Free Estimate
        </a>
      </div>

      {/* Trust signals */}
      <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        {['Licensed & Insured', 'Free Estimates', 'Same-Day Service', '5-Star Rated'].map((signal) => (
          <div key={signal} className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {signal}
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

### 27.4 Service Area Job: Cache Invalidation on Config Change

When the client updates their service areas via the portal, the relevant service area page caches must be busted. This is done via a tag-based `revalidateTag` call.

**File:** `packages/cache/src/invalidate-tenant.ts`

```typescript
import { revalidateTag } from 'next/cache';

export async function invalidateTenantServiceAreas(
  tenantId: string,
  changedSlugs?: string[]
): Promise<void> {
  if (changedSlugs?.length) {
    // Bust only the changed areas
    for (const slug of changedSlugs) {
      revalidateTag(`tenant:${tenantId}:service-area:${slug}`);
    }
  } else {
    // Bust all service area pages for this tenant
    revalidateTag(`tenant:${tenantId}:service-area`);
  }

  // Also bust the sitemap (now includes new/removed areas)
  revalidateTag(`tenant:${tenantId}:sitemap`);
}
```

---

## DOMAIN 28: BLOG / CONTENT SYSTEM

### 28.1 Philosophy

**What it is:** Sanity v3 is the headless CMS powering the blog/content section of each client's marketing site. Content editors (the agency, or the client via Sanity Studio) publish posts, and the marketing site fetches them via GROQ queries with on-demand ISR via Sanity webhooks. The result: a Google-indexed blog with fresh content, zero build-time latency, and zero manual deployment steps. [buttercups](https://www.buttercups.tech/blog/react/sanity-integration-guide-for-nextjs-app-router-users)

**Multi-tenant content isolation:** All tenants share one Sanity project (cost savings), with content isolated by a required `tenantId` field on every document. All GROQ queries include `&& tenantId == $tenantId` — no tenant sees another tenant's posts. Premium plan clients can get a dedicated Sanity project with their own Studio subdomain. [github](https://github.com/sanity-io/next-sanity)

---

### 28.2 Sanity Schema

**File:** `packages/content/schemas/post.ts`

```typescript
import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    // Required: tenant isolation
    defineField({
      name: 'tenantId',
      title: 'Tenant ID',
      type: 'string',
      readOnly: true, // Set programmatically on create, never editable
      hidden: ({ currentUser }) => {
        // Hide from editors who aren't super-admins — they only see their tenant's posts
        return !currentUser?.roles?.some((r: any) => r.name === 'administrator');
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'role', type: 'string', title: 'Role' },
        { name: 'avatar', type: 'image', title: 'Avatar' },
      ],
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Tips & Guides', value: 'tips-guides' },
          { title: 'Company News', value: 'company-news' },
          { title: 'Industry News', value: 'industry-news' },
          { title: 'Case Studies', value: 'case-studies' },
          { title: 'FAQs', value: 'faqs' },
        ],
      },
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Used in post cards and meta description (max 160 chars)',
      validation: (Rule) => Rule.max(160),
    }),

    // Portable Text body
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (Rule) => Rule.required(),
            },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
        // Custom block: Call-to-action button
        {
          name: 'cta',
          title: 'Call to Action',
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Button text' },
            { name: 'href', type: 'url', title: 'URL' },
          ],
        },
      ],
    }),

    // SEO overrides (optional — auto-generated from title/excerpt if omitted)
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Meta title (override)' },
        { name: 'description', type: 'text', title: 'Meta description (override)', rows: 2 },
        { name: 'noIndex', type: 'boolean', title: 'Hide from search engines' },
      ],
    }),

    defineField({
      name: 'estimatedReadingTime',
      title: 'Reading time (minutes)',
      type: 'number',
      readOnly: true,
      // Auto-computed by Sanity input component or computed on save
    }),
  ],

  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'mainImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'Draft',
        media,
      };
    },
  },
});
```

---

### 28.3 Sanity Client + GROQ Queries

**File:** `packages/content/src/sanity-client.ts`

```typescript
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2025-01-01',
  useCdn: true, // CDN for public reads; disabled for preview mode
  // Stega encoding disabled in production (for Visual Editing in Studio only)
  stega: {
    enabled: process.env.NEXT_PUBLIC_SANITY_STEGA === 'true',
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});

// Stega-disabled client for non-preview reads (faster)
export const sanityClientPublic = sanityClient.withConfig({ stega: false });

// Image URL builder
const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ============================================================================
// GROQ QUERIES
// All queries include tenantId filter — non-negotiable for multi-tenant
// ============================================================================

// Projection shared across list and detail views
const POST_CARD_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  estimatedReadingTime,
  categories,
  mainImage { asset->, alt },
  author { name, role, "avatarUrl": avatar.asset->url }
}`;

export const POSTS_LIST_QUERY = `
  *[_type == "post" && tenantId == $tenantId && !(_id in path("drafts.**")) && !coalesce(seo.noIndex, false)]
  | order(publishedAt desc)
  [$from...$to]
  ${POST_CARD_PROJECTION}
`;

export const POSTS_COUNT_QUERY = `
  count(*[_type == "post" && tenantId == $tenantId && !(_id in path("drafts.**"))])
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && tenantId == $tenantId && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    estimatedReadingTime,
    categories,
    mainImage { asset->, alt, caption },
    author { name, role, "avatarUrl": avatar.asset->url },
    body[] {
      ...,
      _type == "image" => {
        asset->,
        alt,
        caption
      }
    },
    seo
  }
`;

export const RELATED_POSTS_QUERY = `
  *[
    _type == "post"
    && tenantId == $tenantId
    && slug.current != $currentSlug
    && !(_id in path("drafts.**"))
    && count(categories[@ in $categories]) > 0
  ]
  | order(publishedAt desc)
  [0...3]
  ${POST_CARD_PROJECTION}
`;

export const ALL_POST_SLUGS_QUERY = `
  *[_type == "post" && tenantId == $tenantId && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }
`;
```

---

### 28.4 Blog Post Page (ISR + On-Demand Revalidation)

**File:** `apps/*/src/app/blog/[slug]/page.tsx`

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { cacheLife, cacheTag } from 'next/cache';
import { PortableText } from '@portabletext/react';
import { resolveTenant } from '@repo/multi-tenant/resolve-tenant';
import { db } from '@repo/db';
import {
  sanityClientPublic,
  POST_BY_SLUG_QUERY,
  RELATED_POSTS_QUERY,
  ALL_POST_SLUGS_QUERY,
  urlFor,
} from '@repo/content/sanity-client';
import { buildMetadata } from '@repo/seo/metadata-factory';
import { buildBreadcrumbSchema, JsonLd } from '@repo/seo/structured-data';
import Image from 'next/image';

export const dynamicParams = true;

// Seed existing post slugs at build time
export async function generateStaticParams() {
  // Minimal: generate for the first 50 posts across all active tenants
  // Long-tail posts use on-demand ISR
  const allTenants = await db
    .from('tenants')
    .select('id')
    .eq('status', 'active')
    .limit(100);

  const params: { slug: string }[] = [];

  for (const tenant of allTenants.data ?? []) {
    const slugs = await sanityClientPublic.fetch<{ slug: string }[]>(
      ALL_POST_SLUGS_QUERY,
      { tenantId: tenant.id }
    );
    slugs.slice(0, 10).forEach((s) => params.push({ slug: s.slug }));
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const tenantContext = await resolveTenant({ headers: headersList } as any);
  if (!tenantContext) return {};

  const { data: tenant } = await db
    .from('tenants')
    .select('config')
    .eq('id', tenantContext.tenantId)
    .single();

  const config = tenant?.config as any;
  if (!config) return {};

  const post = await sanityClientPublic.fetch(
    POST_BY_SLUG_QUERY,
    { tenantId: tenantContext.tenantId, slug }
  );

  if (!post) return {};

  const ogImage = post.mainImage?.asset?.url
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
    : undefined;

  return buildMetadata({
    config,
    path: `/blog/${slug}`,
    pageTitle: post.seo?.title ?? post.title,
    pageDescription: post.seo?.description ?? post.excerpt,
    ogImage,
    noIndex: post.seo?.noIndex ?? false,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  'use cache';

  const { slug } = await params;
  const headersList = await headers();

  const tenantContext = await resolveTenant({ headers: headersList } as any);
  if (!tenantContext) return notFound();

  const { tenantId } = tenantContext;

  cacheTag(`tenant:${tenantId}:blog:${slug}`);
  cacheLife({ revalidate: 3600 }); // 1h fallback; on-demand webhook busts earlier

  const { data: tenant } = await db
    .from('tenants')
    .select('config, custom_domain, subdomain')
    .eq('id', tenantId)
    .single();

  const config = tenant?.config as any;
  const domain = tenant?.custom_domain ?? `${tenant?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const siteUrl = `https://${domain}`;

  const [post, relatedPosts] = await Promise.all([
    sanityClientPublic.fetch(POST_BY_SLUG_QUERY, { tenantId, slug }),
    sanityClientPublic.fetch(RELATED_POSTS_QUERY, {
      tenantId,
      currentSlug: slug,
      categories: [],
    }),
  ]);

  if (!post) return notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name ?? config?.identity?.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: config?.identity?.siteName,
      logo: {
        '@type': 'ImageObject',
        url: config?.assets?.logo,
      },
    },
    image: post.mainImage?.asset?.url,
    url: `${siteUrl}/blog/${slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${slug}` },
    ...(post.estimatedReadingTime ? {
      timeRequired: `PT${post.estimatedReadingTime}M`,
    } : {}),
  };

  const breadcrumbSchema = buildBreadcrumbSchema(
    siteUrl,
    config?.identity?.siteName ?? '',
    [
      { name: 'Blog', url: `${siteUrl}/blog` },
      { name: post.title, url: `${siteUrl}/blog/${slug}` },
    ]
  );

  return (
    <>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <main id="main-content" className="py-12 px-6">
        <article className="max-w-3xl mx-auto" aria-label={post.title}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8 flex items-center gap-2">
            <a href={siteUrl} className="hover:text-primary">Home</a>
            <span aria-hidden="true">›</span>
            <a href={`${siteUrl}/blog`} className="hover:text-primary">Blog</a>
            <span aria-hidden="true">›</span>
            <span className="text-gray-900 truncate">{post.title}</span>
          </nav>

          {/* Categories */}
          {post.categories?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.categories.map((cat: string) => (
                <span
                  key={cat}
                  className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full capitalize"
                >
                  {cat.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            {post.author?.name && (
              <div className="flex items-center gap-2">
                {post.author.avatarUrl && (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.estimatedReadingTime && (
              <span>{post.estimatedReadingTime} min read</span>
            )}
          </div>

          {/* Hero image */}
          {post.mainImage?.asset && (
            <div className="relative aspect-video mb-10 rounded-2xl overflow-hidden">
              <Image
                src={urlFor(post.mainImage).width(1200).height(630).url()}
                alt={post.mainImage.alt ?? post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
              {post.mainImage.caption && (
                <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-4 py-2">
                  {post.mainImage.caption}
                </p>
              )}
            </div>
          )}

          {/* Portable Text body */}
          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-extrabold prose-a:text-primary">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>
        </article>

        {/* Related posts */}
        {relatedPosts?.length > 0 && (
          <aside className="max-w-3xl mx-auto mt-16 pt-12 border-t border-gray-200" aria-label="Related posts">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp: any) => (
                <a key={rp._id} href={`${siteUrl}/blog/${rp.slug}`} className="group block">
                  <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {rp.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(rp.publishedAt).toLocaleDateString()}
                  </p>
                </a>
              ))}
            </div>
          </aside>
        )}
      </main>
    </>
  );
}

// ── Portable Text custom components ──────────────────────────────────────────

const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <figure className="my-8">
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt ?? ''}
            width={800}
            height={450}
            className="w-full h-auto"
          />
        </div>
        {value.caption && (
          <figcaption className="text-sm text-gray-500 text-center mt-2">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    cta: ({ value }: any) => (
      <div className="my-8 flex justify-center">
        <a
          href={value.href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          {value.text}
        </a>
      </div>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target={value.href?.startsWith('http') ? '_blank' : undefined}
        rel={value.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
};
```

---

### 28.5 Sanity Webhook → On-Demand ISR

**File:** `apps/*/src/app/api/webhooks/sanity/route.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { revalidateTag, revalidatePath } from 'next/cache';

// ============================================================================
// SANITY WEBHOOK HANDLER
// Triggered by GROQ-powered webhook in Sanity project settings.
// Webhook filter: _type == "post"
// Payload: { _type, slug: { current }, tenantId }
// Reference: https://www.sanity.io/learn/course/controlling-cached-content-in-next-js/tag-based-revalidation
// ============================================================================

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<SanityWebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET!
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
    }

    const { _type, slug, tenantId } = body;

    switch (_type) {
      case 'post': {
        const slugCurrent = slug?.current;
        if (slugCurrent && tenantId) {
          // Bust the specific post
          revalidateTag(`tenant:${tenantId}:blog:${slugCurrent}`);
        }
        // Bust the blog index (post list order/count changed)
        if (tenantId) {
          revalidateTag(`tenant:${tenantId}:blog`);
          // Also bust sitemap (new/removed post affects sitemap.xml)
          revalidateTag(`tenant:${tenantId}:sitemap`);
        }
        break;
      }
      default:
        console.log(`[Sanity Webhook] Unhandled type: ${_type}`);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
    });
  } catch (err: any) {
    console.error('[Sanity Webhook] Error:', err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

interface SanityWebhookBody {
  _type: string;
  slug?: { current: string };
  tenantId?: string;
}
```

---

## DOMAIN 29: CLIENT PORTAL SETTINGS

### 29.1 Philosophy

**What it is:** The settings section of the portal — where clients update their business info, branding, contact details, integrations, and notification preferences. Every field maps to a path in `site.config`, and changes are persisted via Server Actions with Zod validation, optimistic UI, and deep-merge into the JSONB config column. [nextjs](https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations)

**Architecture — one schema per settings section:**
Rather than one giant settings form (unmaintainable), settings are split into sections (`identity`, `branding`, `contact`, `hours`, `integrations`, `notifications`). Each section is its own form with its own Zod schema and Server Action. This gives clean error boundaries, granular `revalidateTag` calls, and independent loading states.

---

### 29.2 Settings Server Actions

**File:** `apps/portal/src/features/settings/model/settings-actions.ts`

```typescript
'use server';

import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { createServerAction } from '@repo/auth/server-action-wrapper';
import { db } from '@repo/db';
import { invalidateTenantServiceAreas } from '@repo/cache/invalidate-tenant';

// ============================================================================
// SETTINGS ACTIONS
// Each action handles one settings section independently.
// All use deep-merge: only specified fields are updated, rest preserved.
// ============================================================================

// ── 1. Identity settings ──────────────────────────────────────────────────────

const IdentitySchema = z.object({
  siteName: z.string().min(2).max(80),
  tagline: z.string().max(160).optional(),
  description: z.string().max(500).optional(),
  industry: z.enum(['hvac', 'plumbing', 'electrical', 'dental', 'medical',
    'law', 'realEstate', 'accounting', 'restaurant', 'salon', 'general']),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  yearEstablished: z.number().min(1800).max(new Date().getFullYear()).optional(),
});

export const updateIdentitySettings = createServerAction(
  IdentitySchema,
  async (input, ctx) => {
    const { tenantId } = ctx;

    await db.rpc('deep_merge_config', {
      p_tenant_id: tenantId,
      p_path: '{identity}',
      p_value: input,
    });

    revalidateTag(`tenant:${tenantId}`);
    revalidateTag(`tenant:${tenantId}:sitemap`);

    return { success: true };
  }
);

// ── 2. Contact settings ───────────────────────────────────────────────────────

const ContactSchema = z.object({
  phone: z.string().regex(/^[\+]?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number').optional(),
  email: z.string().email().optional(),
  address: z.object({
    street: z.string().max(100).optional(),
    city: z.string().max(80),
    state: z.string().length(2).toUpperCase(),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/).optional(),
  }).optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
});

export const updateContactSettings = createServerAction(
  ContactSchema,
  async (input, ctx) => {
    const { tenantId } = ctx;

    await db.rpc('deep_merge_config', {
      p_tenant_id: tenantId,
      p_path: '{identity,contact}',
      p_value: { ...input.address ? { address: input.address } : {},
                 ...input.coordinates ? { coordinates: input.coordinates } : {},
                 ...input.phone ? { contact: { phone: input.phone, email: input.email } } : {} },
    });

    revalidateTag(`tenant:${tenantId}`);
    return { success: true };
  }
);

// ── 3. Service areas settings ─────────────────────────────────────────────────

const ServiceAreasSchema = z.object({
  serviceAreas: z.array(z.string().min(2).max(60)).min(1).max(50),
});

export const updateServiceAreasSettings = createServerAction(
  ServiceAreasSchema,
  async (input, ctx) => {
    const { tenantId } = ctx;

    // Fetch current areas before update (for cache invalidation delta)
    const { data: current } = await db
      .from('tenants')
      .select('config->identity->serviceAreas')
      .eq('id', tenantId)
      .single();

    const previousAreas: string[] = (current as any)?.['config->identity->serviceAreas'] ?? [];

    await db.rpc('deep_merge_config', {
      p_tenant_id: tenantId,
      p_path: '{identity}',
      p_value: { serviceAreas: input.serviceAreas },
    });

    // Invalidate only removed areas (added areas have no cache to bust)
    const removedAreas = previousAreas.filter((a) => !input.serviceAreas.includes(a));
    await invalidateTenantServiceAreas(tenantId, removedAreas.map(slugifyArea));

    revalidateTag(`tenant:${tenantId}:sitemap`);

    return { success: true };
  }
);

// ── 4. Business hours settings ────────────────────────────────────────────────

const HoursSchema = z.object({
  hours: z.array(z.object({
    days: z.array(z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])),
    opens: z.string().regex(/^( [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
    closes: z.string().regex(/^( [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  })).max(7),
});

export const updateHoursSettings = createServerAction(
  HoursSchema,
  async (input, ctx) => {
    await db.rpc('deep_merge_config', {
      p_tenant_id: ctx.tenantId,
      p_path: '{identity}',
      p_value: { hours: input.hours },
    });

    revalidateTag(`tenant:${ctx.tenantId}`);
    return { success: true };
  }
);

// ── 5. Notification preferences ───────────────────────────────────────────────

const NotificationsSchema = z.object({
  leadEmail: z.object({
    enabled: z.boolean(),
    scoreThreshold: z.number().min(0).max(100),
    digestEnabled: z.boolean(),
    digestTime: z.string().regex(/^( [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)\d|2[0-3]):([0-5]\d)$/),
  }),
  bookingEmail: z.object({
    confirmationEnabled: z.boolean(),
    reminderEnabled: z.boolean(),
    followUpEnabled: z.boolean(),
  }),
  smsEnabled: z.boolean().optional(),
  smsPhone: z.string().optional(),
});

export const updateNotificationsSettings = createServerAction(
  NotificationsSchema,
  async (input, ctx) => {
    await db
      .from('tenants')
      .update({
        notification_config: input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ctx.tenantId);

    return { success: true };
  }
);

// ── 6. Integrations settings ──────────────────────────────────────────────────

const IntegrationsSchema = z.object({
  googleAnalyticsId: z.string().regex(/^G-[A-Z0-9]+$/).optional().or(z.literal('')),
  googleTagManagerId: z.string().regex(/^GTM-[A-Z0-9]+$/).optional().or(z.literal('')),
  facebookPixelId: z.string().regex(/^\d+$/).optional().or(z.literal('')),
  googleSiteVerification: z.string().optional(),
  bingSiteVerification: z.string().optional(),
});

export const updateIntegrationsSettings = createServerAction(
  IntegrationsSchema,
  async (input, ctx) => {
    // Store non-empty values only
    const cleaned = Object.fromEntries(
      Object.entries(input).filter(([, v]) => v !== '' && v !== undefined)
    );

    await db.rpc('deep_merge_config', {
      p_tenant_id: ctx.tenantId,
      p_path: '{identity}',
      p_value: cleaned,
    });

    revalidateTag(`tenant:${ctx.tenantId}`);
    return { success: true };
  }
);

function slugifyArea(area: string): string {
  return area.toLowerCase().replace(/,\s*/g, '-').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
```

---

### 29.3 Deep Merge Config SQL Function

```sql
-- Supabase migration: deep_merge_config RPC
-- Used by all settings actions to surgically update config paths
-- without overwriting sibling keys

CREATE OR REPLACE FUNCTION deep_merge_config(
  p_tenant_id  uuid,
  p_path       text[],         -- e.g. '{identity}' or '{identity,contact}'
  p_value      jsonb           -- New values to merge at this path
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current jsonb;
  v_merged  jsonb;
BEGIN
  -- Get current config (locked for update)
  SELECT config INTO v_current
  FROM tenants
  WHERE id = p_tenant_id
  FOR UPDATE;

  IF v_current IS NULL THEN
    RAISE EXCEPTION 'Tenant % not found', p_tenant_id;
  END IF;

  -- Deep merge: existing value at path is merged with new value
  -- jsonb_set replaces; we use || (concat) for shallow merge at the path
  v_merged := jsonb_set(
    v_current,
    p_path,
    COALESCE(v_current #> p_path, '{}') || p_value,
    true  -- create missing path
  );

  UPDATE tenants
  SET config     = v_merged,
      updated_at = now()
  WHERE id = p_tenant_id;
END;
$$;

-- Grant execute to authenticated users (RLS still enforced by row ownership)
GRANT EXECUTE ON FUNCTION deep_merge_config TO authenticated;
```

---

### 29.4 Settings Form (Hours Example — Most Complex)

**File:** `apps/portal/src/features/settings/ui/HoursSettings.tsx`

```typescript
'use client';

import { useState, useTransition } from 'react';
import { updateHoursSettings } from '../model/settings-actions';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Day = typeof DAYS[number];

interface HourEntry {
  days: Day[];
  opens: string;
  closes: string;
}

interface HoursSettingsProps {
  initialHours: HourEntry[];
}

export function HoursSettings({ initialHours }: HoursSettingsProps) {
  const [hours, setHours] = useState<HourEntry[]>(
    initialHours.length > 0 ? initialHours : [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    ]
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const addHourGroup = () => {
    setHours((prev) => [...prev, { days: [], opens: '09:00', closes: '17:00' }]);
  };

  const removeHourGroup = (index: number) => {
    setHours((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDay = (entryIndex: number, day: Day) => {
    setHours((prev) =>
      prev.map((entry, i) => {
        if (i !== entryIndex) return entry;
        const days = entry.days.includes(day)
          ? entry.days.filter((d) => d !== day)
          : [...entry.days, day];
        return { ...entry, days };
      })
    );
  };

  const handleTimeChange = (entryIndex: number, field: 'opens' | 'closes', value: string) => {
    setHours((prev) =>
      prev.map((entry, i) =>
        i === entryIndex ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await updateHoursSettings({ hours });
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Failed to save hours. Please check your entries and try again.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Business hours settings">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Business Hours</h2>
      <p className="text-sm text-gray-500 mb-6">
        Set your operating hours. These appear on your website and in Google search results.
      </p>

      <div className="space-y-4">
        {hours.map((entry, entryIndex) => (
          <div
            key={entryIndex}
            className="border border-gray-200 rounded-xl p-4 space-y-4 bg-white"
          >
            {/* Day selector */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Days</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={`Days for schedule ${entryIndex + 1}`}>
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(entryIndex, day)}
                    className={`
                      px-3 py-1 rounded-lg text-sm font-medium transition-colors
                      ${entry.days.includes(day)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                    aria-pressed={entry.days.includes(day)}
                    aria-label={day}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time range */}
            <div className="flex items-center gap-4">
              <div>
                <label
                  htmlFor={`opens-${entryIndex}`}
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Opens
                </label>
                <input
                  id={`opens-${entryIndex}`}
                  type="time"
                  value={entry.opens}
                  onChange={(e) => handleTimeChange(entryIndex, 'opens', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <span className="text-gray-400 mt-5">–</span>
              <div>
                <label
                  htmlFor={`closes-${entryIndex}`}
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Closes
                </label>
                <input
                  id={`closes-${entryIndex}`}
                  type="time"
                  value={entry.closes}
                  onChange={(e) => handleTimeChange(entryIndex, 'closes', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => removeHourGroup(entryIndex)}
                className="mt-5 text-gray-400 hover:text-red-500 p-1 rounded focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={`Remove schedule ${entryIndex + 1}`}
                disabled={hours.length === 1}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addHourGroup}
        className="mt-3 text-sm text-primary hover:underline flex items-center gap-1"
      >
        <span aria-hidden="true">+</span> Add another schedule
      </button>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
          aria-busy={isPending}
        >
          {isPending ? 'Saving…' : 'Save Hours'}
        </button>
        {saved && (
          <p role="status" className="text-sm text-green-600 font-medium">
            ✓ Hours saved
          </p>
        )}
      </div>
    </form>
  );
}
```

---

## DOMAIN 30: DOMAIN MANAGEMENT

### 30.1 Philosophy

**What it is:** Every client can connect their own domain (`johnsplumbing.com`) to replace the default subdomain (`johns-plumbing.agency.com`). The platform handles the full flow: client enters domain → platform adds it to Vercel via API → DNS instructions shown → platform polls verification → marks as active. [vercel](https://vercel.com/docs/multi-tenant/domain-management)

**Vercel for Platforms API:** Vercel exposes a REST API for programmatically adding, removing, and checking domains. In multi-tenant apps, the wildcard domain `*.agency.com` is set at project level. Custom domains like `johnsplumbing.com` are added per-deployment via this API. Vercel auto-provisions the SSL certificate once DNS propagates. [vercel](https://vercel.com/kb/guide/how-do-i-add-a-custom-domain-to-my-vercel-project)

**DNS requirements for clients:** Two records are needed. For an apex domain (`johnsplumbing.com`): an `A` record pointing to `76.76.21.21` (Vercel's IP). For a `www` subdomain: a `CNAME` pointing to `cname.vercel-dns.com`. [stackoverflow](https://stackoverflow.com/questions/78001208/add-custom-domain-to-dynamic-subdomain-in-nextjs-app-deployed-in-vercel-that-alr)

---

### 30.2 Domain Management Service

**File:** `packages/domains/src/vercel-domains.ts`

```typescript
import { Redis } from '@upstash/redis';
import { db } from '@repo/db';

const redis = Redis.fromEnv();

const VERCEL_API = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID!;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

// ============================================================================
// VERCEL DOMAINS API WRAPPER
// Reference: https://vercel.com/docs/multi-tenant/domain-management
// ============================================================================

interface VercelDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string;
  verified: boolean;
  verification?: VercelVerificationChallenge[];
}

interface VercelVerificationChallenge {
  type: 'TXT';
  domain: string;
  value: string;
  reason: string;
}

interface DomainAddResult {
  status: 'added' | 'already_exists' | 'conflict' | 'error';
  domain?: VercelDomainResponse;
  dnsInstructions?: DNSInstruction[];
  error?: string;
}

interface DNSInstruction {
  type: 'A' | 'CNAME' | 'TXT';
  name: string; // '@' or 'www'
  value: string;
  ttl?: number;
  note?: string;
}

export async function addDomainToVercel(domain: string): Promise<DomainAddResult> {
  const response = await fetch(
    `${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains?teamId=${VERCEL_TEAM_ID}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  );

  if (response.status === 409) {
    // Domain already exists in this project
    return { status: 'already_exists' };
  }

  if (response.status === 403) {
    // Domain belongs to another Vercel team
    return {
      status: 'conflict',
      error:
        'This domain is currently associated with another project. Please remove it from its current location first.',
    };
  }

  if (!response.ok) {
    const error = await response.text();
    return { status: 'error', error };
  }

  const data: VercelDomainResponse = await response.json();

  // Build DNS instructions based on whether it's apex or subdomain
  const isApex = !domain.includes('.', domain.indexOf('.') + 1) || domain.split('.').length === 2;

  const dnsInstructions: DNSInstruction[] = isApex
    ? [
        {
          type: 'A',
          name: '@',
          value: '76.76.21.21',
          ttl: 3600,
          note: 'Add at your DNS provider for the root domain',
        },
        {
          type: 'CNAME',
          name: 'www',
          value: 'cname.vercel-dns.com.',
          ttl: 3600,
          note: 'Optional: redirects www to root domain',
        },
      ]
    : [
        {
          type: 'CNAME',
          name: domain.split('.')[0],
          value: 'cname.vercel-dns.com.',
          ttl: 3600,
          note: 'Add at your DNS provider',
        },
      ];

  // If Vercel requires a verification TXT record (domain in use elsewhere)
  if (data.verification?.length) {
    data.verification.forEach((v) => {
      dnsInstructions.push({
        type: 'TXT',
        name: v.domain.replace(`.${domain}`, '') || '@',
        value: v.value,
        note: 'Required for domain verification: ' + v.reason,
      });
    });
  }

  return { status: 'added', domain: data, dnsInstructions };
}

export async function removeDomainFromVercel(domain: string): Promise<void> {
  await fetch(
    `${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?teamId=${VERCEL_TEAM_ID}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    }
  );
}

export async function checkDomainVerification(
  domain: string
): Promise<{ verified: boolean; config?: VercelDomainResponse }> {
  const response = await fetch(
    `${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?teamId=${VERCEL_TEAM_ID}`,
    {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    }
  );

  if (!response.ok) return { verified: false };

  const data: VercelDomainResponse = await response.json();

  return { verified: data.verified, config: data };
}

// ============================================================================
// TENANT DOMAIN MANAGEMENT
// ============================================================================

export async function addCustomDomainForTenant(
  tenantId: string,
  domain: string
): Promise<DomainAddResult> {
  // Normalize: lowercase, strip protocol, strip trailing slash
  const normalized = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

  // Check if domain is already claimed by another tenant
  const { data: existing } = await db
    .from('tenants')
    .select('id')
    .eq('custom_domain', normalized)
    .neq('id', tenantId)
    .maybeSingle();

  if (existing) {
    return {
      status: 'conflict',
      error: 'This domain is already registered to another account.',
    };
  }

  // Add to Vercel
  const result = await addDomainToVercel(normalized);

  if (result.status === 'added' || result.status === 'already_exists') {
    // Save domain (unverified) to tenant record
    await db
      .from('tenants')
      .update({
        custom_domain: normalized,
        custom_domain_verified: false,
        custom_domain_added_at: new Date().toISOString(),
      })
      .eq('id', tenantId);

    // Store DNS instructions in Redis (TTL 7 days — client needs time to update DNS)
    if (result.dnsInstructions) {
      await redis.setex(
        `domain-dns:${tenantId}`,
        7 * 24 * 3600,
        JSON.stringify(result.dnsInstructions)
      );
    }

    // Schedule first verification check in 5 minutes
    const { enqueue } = await import('@repo/jobs/client');
    await enqueue(
      'domain.verify',
      { tenantId, domain: normalized },
      {
        notBefore: new Date(Date.now() + 5 * 60 * 1000),
      }
    );
  }

  return result;
}

export async function verifyAndActivateDomain(
  tenantId: string,
  domain: string
): Promise<{ activated: boolean; retryIn?: number }> {
  const { verified } = await checkDomainVerification(domain);

  if (verified) {
    await db
      .from('tenants')
      .update({
        custom_domain_verified: true,
        custom_domain_verified_at: new Date().toISOString(),
      })
      .eq('id', tenantId);

    // Bust cache so middleware picks up new domain
    await redis.del(`tenant-domain:${domain}`);

    // Also provision Resend sending domain (now that custom domain is verified)
    const { checkTenantEmailDomainVerification } = await import('@repo/email/client');
    await checkTenantEmailDomainVerification(tenantId);

    return { activated: true };
  }

  // Not yet verified — schedule retry with exponential backoff
  // (5min, 10min, 20min, 1h, 2h, 6h, 12h, 24h)
  return { activated: false, retryIn: 300 };
}

export async function removeCustomDomainForTenant(tenantId: string): Promise<void> {
  const { data: tenant } = await db
    .from('tenants')
    .select('custom_domain')
    .eq('id', tenantId)
    .single();

  if (!tenant?.custom_domain) return;

  await removeDomainFromVercel(tenant.custom_domain);

  await db
    .from('tenants')
    .update({
      custom_domain: null,
      custom_domain_verified: false,
      custom_domain_added_at: null,
      custom_domain_verified_at: null,
    })
    .eq('id', tenantId);

  await redis.del(`tenant-domain:${tenant.custom_domain}`);
  await redis.del(`domain-dns:${tenantId}`);
}
```

---

### 30.3 Domain Management UI

**File:** `apps/portal/src/features/settings/ui/DomainSettings.tsx`

```typescript
'use client';

import { useState, useTransition } from 'react';
import { addDomainAction, removeDomainAction, verifyDomainAction } from '../model/domain-actions';

interface DNSInstruction {
  type: string;
  name: string;
  value: string;
  note?: string;
}

interface DomainSettingsProps {
  tenantId: string;
  currentDomain: string | null;
  isVerified: boolean;
  defaultSubdomain: string;
  initialDnsInstructions: DNSInstruction[] | null;
}

export function DomainSettings({
  tenantId,
  currentDomain,
  isVerified,
  defaultSubdomain,
  initialDnsInstructions,
}: DomainSettingsProps) {
  const [domain, setDomain] = useState(currentDomain ?? '');
  const [dnsInstructions, setDnsInstructions] = useState<DNSInstruction[] | null>(initialDnsInstructions);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'verified' | 'pending' | null>(
    isVerified ? 'verified' : currentDomain ? 'pending' : null
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalized = domain.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!normalized || !normalized.includes('.')) {
      setError('Please enter a valid domain name (e.g. johnsplumbing.com)');
      return;
    }

    startTransition(async () => {
      const result = await addDomainAction({ domain: normalized });
      if (result.success && result.data) {
        const { status, dnsInstructions: instructions, error: addError } = result.data as any;
        if (status === 'added' || status === 'already_exists') {
          setDnsInstructions(instructions ?? null);
          setVerificationResult('pending');
        } else {
          setError(addError ?? 'Failed to add domain. Please try again.');
        }
      }
    });
  };

  const handleVerify = () => {
    setVerifying(true);
    startTransition(async () => {
      const result = await verifyDomainAction({ domain });
      if (result.success && (result.data as any)?.activated) {
        setVerificationResult('verified');
      } else {
        setVerificationResult('pending');
      }
      setVerifying(false);
    });
  };

  const handleRemove = () => {
    if (!confirm('Remove this custom domain? Your site will return to the default subdomain.')) return;
    startTransition(async () => {
      await removeDomainAction({});
      setDomain('');
      setDnsInstructions(null);
      setVerificationResult(null);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Custom Domain</h2>
        <p className="text-sm text-gray-500">
          Connect your own domain to replace{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{defaultSubdomain}</code>
        </p>
      </div>

      {/* Current domain status */}
      {currentDomain && (
        <div className={`flex items-center justify-between p-4 rounded-xl border ${
          verificationResult === 'verified'
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${
              verificationResult === 'verified' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
            }`} aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-900">{currentDomain}</p>
              <p className="text-sm text-gray-500">
                {verificationResult === 'verified'
                  ? 'Active — SSL certificate issued'
                  : 'Pending DNS verification'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
      )}

      {/* Add domain form */}
      {!currentDomain && (
        <form onSubmit={handleAdd} className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="custom-domain" className="sr-only">Custom domain</label>
            <input
              id="custom-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="johnsplumbing.com"
              disabled={isPending}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              aria-describedby={error ? 'domain-error' : undefined}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !domain.trim()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {isPending ? 'Adding…' : 'Add Domain'}
          </button>
        </form>
      )}

      {error && (
        <p id="domain-error" role="alert" className="text-sm text-red-600">{error}</p>
      )}

      {/* DNS Instructions */}
      {dnsInstructions && verificationResult === 'pending' && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm">DNS Configuration Required</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Add these records at your DNS provider (GoDaddy, Namecheap, Cloudflare, etc.)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Type', 'Name', 'Value', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dnsInstructions.map((record, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                        {record.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{record.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700 max-w-xs truncate" title={record.value}>
                      {record.value}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(record.value)}
                        className="text-xs text-gray-400 hover:text-primary"
                        aria-label={`Copy ${record.type} record value`}
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-100 flex items-center justify-between">
            <p className="text-xs text-yellow-700">
              DNS propagation can take 5 minutes to 48 hours
            </p>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isPending || verifying}
              className="text-sm font-semibold text-primary hover:underline disabled:opacity-50"
            >
              {verifying ? 'Checking…' : 'Check Verification'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Priority Table for Domains 27–30

| Task                                           | Domain | Priority | Timeline | Success Metric                                        |
| ---------------------------------------------- | ------ | -------- | -------- | ----------------------------------------------------- |
| Service area pages (`/service-area/[slug]`)    | 27     | **P0**   | Week 1   | All configured areas resolve to unique pages          |
| `generateStaticParams` for top 10 areas        | 27     | **P0**   | Week 1   | Top areas pre-built, don't incur first-request delay  |
| Area-specific `LocalBusiness` JSON-LD          | 27     | **P0**   | Week 1   | Each area page passes Google Rich Results Test        |
| Internal linking between area pages            | 27     | **P1**   | Week 1   | Link equity flows to all area pages                   |
| `cacheTag` bust on service area config change  | 27     | **P1**   | Week 2   | Deleted area returns 404 within 60s                   |
| Sanity schema (`post` + `tenantId` isolation)  | 28     | **P1**   | Week 2   | No cross-tenant content leakage in GROQ queries       |
| Blog list + detail pages (ISR, `cacheLife` 1h) | 28     | **P1**   | Week 2   | Posts render SSR, not CSR                             |
| Sanity webhook → `revalidateTag` on publish    | 28     | **P1**   | Week 2   | New post live on site < 5s after Sanity publish       |
| `BlogPosting` + `BreadcrumbList` JSON-LD       | 28     | **P1**   | Week 2   | Blog posts eligible for Google article rich results   |
| Related posts (GROQ category match)            | 28     | **P2**   | Week 3   | 3 related posts shown on each post page               |
| `deep_merge_config` SQL function               | 29     | **P0**   | Week 1   | Settings updates never clobber sibling config keys    |
| Identity + contact settings forms              | 29     | **P0**   | Week 1   | Client can update business name, phone, address       |
| Business hours form (multi-day groups)         | 29     | **P0**   | Week 1   | Hours changes reflect in JSON-LD within 60s           |
| Notification preferences settings              | 29     | **P1**   | Week 2   | Client can disable/enable lead email alerts           |
| Integrations settings (GA, GTM, Pixel)         | 29     | **P1**   | Week 2   | Client can add GA4 ID, tags fire on next visit        |
| Vercel Domains API integration                 | 30     | **P0**   | Week 1   | Custom domain added to project programmatically       |
| DNS instructions display with copy buttons     | 30     | **P0**   | Week 1   | Client can follow DNS setup without support ticket    |
| Domain verification polling job (QStash)       | 30     | **P0**   | Week 1   | Domain auto-activates within 5 min of DNS propagation |
| Domain → Resend sending domain auto-link       | 30     | **P1**   | Week 2   | Verified domain automatically used for outbound email |
| Remove domain flow (Vercel API delete)         | 30     | **P1**   | Week 2   | Removing domain falls back to subdomain cleanly       |

---

**Cross-domain invariants for Domains 27–30:**

- Service area pages must return `notFound()` for any slug not in the tenant's configured `serviceAreas`. Without this, Googlebot could crawl fabricated URLs (`/service-area/mars-tx`) and waste crawl budget on 200s with thin content. [mgphq](https://www.mgphq.com/blog/nextjs-programmatic-seo-isr-guide)
- All Sanity GROQ queries **must** include `&& tenantId == $tenantId`. A query without this filter returns all tenants' posts. This is a data isolation requirement, not an optimization. [github](https://github.com/sanity-io/next-sanity)
- The `deep_merge_config` function uses `FOR UPDATE` row lock — two simultaneous settings saves from different browser tabs will serialize, not race. Without the lock, the second write silently overwrites the first. [nextjs](https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations)
- The Vercel Domains API call in `addDomainToVercel` must handle the `403` (domain in another team) and `409` (domain already in this project) responses gracefully — both are valid non-error states that require different UI feedback. [macchiato.hashnode](https://macchiato.hashnode.dev/how-to-build-a-multi-tenant-app-with-custom-domains-using-nextjs)
- Domain verification polling uses QStash with exponential backoff scheduling — not a cron job polling all unverified domains every minute. At scale (1000+ tenants), a per-domain backoff queue is orders of magnitude more efficient than a batch cron. [youtube](https://www.youtube.com/watch?v=NizAmP_Eobs)

---
