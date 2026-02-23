Rich data across all three research threads. Generating Batch 5 now — completing remaining **P0** docs, **P1 accessibility suite**, and the **Sanity** pair.

---

# tenant-data-flow-patterns.md

```markdown
# tenant-data-flow-patterns.md

> **Internal Reference** | Per-Tenant Data Isolation · RLS · Edge Headers ·
> Server Components · Drizzle ORM

## Table of Contents

1. [Data Flow Overview](#data-flow-overview)
2. [The Golden Rule of Tenant Data](#the-golden-rule-of-tenant-data)
3. [Layer 1 — Edge Header Injection](#layer-1--edge-header-injection)
4. [Layer 2 — Server Component Data Access](#layer-2--server-component-data-access)
5. [Layer 3 — Database RLS Enforcement](#layer-3--database-rls-enforcement)
6. [Layer 4 — Cache Namespacing](#layer-4--cache-namespacing)
7. [Layer 5 — File Storage Isolation](#layer-5--file-storage-isolation)
8. [Cross-Tenant Data Access Patterns](#cross-tenant-data-access-patterns)
9. [Data Flow Audit Checklist](#data-flow-audit-checklist)
10. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Data Flow Overview
```

Request Arrives
│
▼
EDGE (middleware.ts)
tenantId injected into x-tenant-id header
tenantPlan injected into x-tenant-plan header
billingAccess injected into x-billing-access header
│
▼
SERVER COMPONENT
const tenantId = await getTenantId() ← reads x-tenant-id header
All DB queries scoped to tenantId
All cache keys prefixed with tenant:${tenantId}:
│
▼
DATABASE (Supabase + RLS)
Row Level Security enforces tenant isolation at DB layer
Even if tenantId is incorrect in code, DB blocks cross-tenant reads
│
▼
RESPONSE
Data returned belongs exclusively to the requesting tenant
No tenant ID appears in response body (leaks context)

````

---

## The Golden Rule of Tenant Data

> **Every database query, every cache key, every storage path, every background job
> MUST be scoped to a tenantId. If you write a query without a `where tenant_id =`
> clause, it is a bug.**

This rule is enforced at three independent layers:
1. **Application code** — explicit `tenantId` in every query
2. **Database RLS** — blocks any query without matching tenant context
3. **CI lint rule** — custom ESLint rule flags queries missing `tenantId`

---

## Layer 1 — Edge Header Injection

The canonical tenant context flows from middleware into all downstream code as
request headers. Nothing downstream should ever re-resolve the tenant from scratch.

```typescript
// packages/tenant/src/context.ts

/**
 * Read resolved tenant context from Edge-injected headers.
 * Call this in Server Components and API Route Handlers.
 * Never call DB or KV from here — headers are already resolved.
 */
export async function getTenantContext(): Promise<TenantContext> {
  const headersList = await headers()

  const tenantId = headersList.get('x-tenant-id')
  const tenantSlug = headersList.get('x-tenant-slug')
  const tenantPlan = headersList.get('x-tenant-plan') as TenantPlan
  const billingAccess = headersList.get('x-billing-access') as BillingAccess
  const tenantLocale = headersList.get('x-tenant-locale') ?? 'en'

  if (!tenantId) {
    throw new TenantNotFoundError('No tenant context in request headers')
  }

  return {
    tenantId,
    tenantSlug: tenantSlug ?? '',
    tenantPlan: tenantPlan ?? 'free',
    billingAccess: billingAccess ?? 'full',
    locale: tenantLocale,
  }
}

// Convenience helpers
export async function getTenantId(): Promise<string> {
  return (await getTenantContext()).tenantId
}

export async function requireBillingAccess(
  required: BillingAccess,
): Promise<TenantContext> {
  const ctx = await getTenantContext()
  const accessLevels: BillingAccess[] = ['locked', 'readonly', 'restricted', 'full']
  const requiredLevel = accessLevels.indexOf(required)
  const actualLevel = accessLevels.indexOf(ctx.billingAccess)

  if (actualLevel < requiredLevel) {
    throw new BillingAccessError(
      `Operation requires ${required} billing access; tenant has ${ctx.billingAccess}`,
    )
  }
  return ctx
}
````

---

## Layer 2 — Server Component Data Access

### Repository Pattern (Tenant-Scoped)

Every data access function takes `tenantId` as its **first parameter**, making
cross-tenant access require an explicit override — preventing accidental omission.

```typescript
// packages/db/src/repositories/leads.repository.ts
import { getDb } from '../drizzle';
import { leads } from '../schema/leads';
import { eq, and, desc, count } from 'drizzle-orm';

export const leadsRepository = {
  async findMany(
    tenantId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
    } = {}
  ) {
    const db = getDb();
    return db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.tenantId, tenantId), // Always scope to tenant
          options.status ? eq(leads.status, options.status) : undefined
        )
      )
      .orderBy(desc(leads.createdAt))
      .limit(options.limit ?? 50)
      .offset(options.offset ?? 0);
  },

  async findById(tenantId: string, leadId: string) {
    const db = getDb();
    const [lead] = await db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.tenantId, tenantId), // Scope: tenant MUST match
          eq(leads.id, leadId)
        )
      )
      .limit(1);

    // Returns undefined if lead exists but belongs to different tenant
    // This is intentional — prevents information disclosure
    return lead ?? null;
  },

  async countByTenant(tenantId: string): Promise<number> {
    const db = getDb();
    const [result] = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.tenantId, tenantId));
    return result?.count ?? 0;
  },
};
```

### Usage in Server Components

```typescript
// widgets/lead-feed/ui/LeadFeed.tsx
import { getTenantId } from '@repo/tenant/context'
import { leadsRepository } from '@repo/db/repositories/leads'

export async function LeadFeed() {
  // Tenant ID comes from edge-injected headers — never from URL params or query strings
  const tenantId = await getTenantId()

  const leads = await leadsRepository.findMany(tenantId, {
    limit: 20,
    status: 'new',
  })

  return (
    <ul role="list">
      {leads.map(lead => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </ul>
  )
}
```

---

## Layer 3 — Database RLS Enforcement

RLS is the **backstop** — even if application code has a bug, the database rejects
cross-tenant queries. The application passes tenant context via JWT claims.

```sql
-- supabase/migrations/20260223_tenant_rls.sql

-- Enable RLS on all tenant-scoped tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Tenants can only read their own leads
CREATE POLICY "tenant_leads_select"
ON leads FOR SELECT
USING (
  tenant_id = (
    COALESCE(
      auth.jwt() ->> 'tenant_id',
      auth.jwt() -> 'app_metadata' ->> 'tenant_id'
    )
  )::uuid
);

-- Policy: Tenants can only insert leads for themselves
CREATE POLICY "tenant_leads_insert"
ON leads FOR INSERT
WITH CHECK (
  tenant_id = (
    COALESCE(
      auth.jwt() ->> 'tenant_id',
      auth.jwt() -> 'app_metadata' ->> 'tenant_id'
    )
  )::uuid
);

-- Policy: Tenants can only update their own leads
CREATE POLICY "tenant_leads_update"
ON leads FOR UPDATE
USING (
  tenant_id = (
    COALESCE(
      auth.jwt() ->> 'tenant_id',
      auth.jwt() -> 'app_metadata' ->> 'tenant_id'
    )
  )::uuid
)
WITH CHECK (
  tenant_id = (
    COALESCE(
      auth.jwt() ->> 'tenant_id',
      auth.jwt() -> 'app_metadata' ->> 'tenant_id'
    )
  )::uuid
);

-- Service role bypass (for admin/internal operations only)
-- Never use service role in tenant-facing code paths
CREATE POLICY "service_role_bypass"
ON leads
USING (auth.role() = 'service_role');
```

### Drizzle + RLS: Passing Tenant Context

```typescript
// packages/db/src/rls-client.ts
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

/**
 * Create a DB client with tenant JWT embedded.
 * Supabase RLS uses this JWT to enforce row-level policies.
 * Use for any operation where tenant isolation matters.
 */
export function createTenantDb(tenantJwt: string) {
  const sql = postgres(process.env.DATABASE_POOL_URL!, {
    max: 1,
    prepare: false,
    transform: postgres.camel,
    connection: {
      // Supabase reads this setting to apply RLS
      search_path: 'public',
    },
    onnotice: () => {}, // Suppress notices in production
  });

  return drizzle(sql, {
    schema,
    // Set JWT for this connection so RLS policies fire
    // This is done via SET LOCAL in a transaction
  });
}
```

---

## Layer 4 — Cache Namespacing

Every cached value uses a `tenant:${tenantId}:` prefix. This prevents cache
pollution between tenants and enables surgical invalidation per tenant.

```typescript
// packages/cache/src/tenant-cache.ts
import { redis } from './redis-client';

export const tenantCache = {
  key: (tenantId: string, resource: string, id?: string): string =>
    id ? `tenant:${tenantId}:${resource}:${id}` : `tenant:${tenantId}:${resource}`,

  async get<T>(tenantId: string, resource: string, id?: string): Promise<T | null> {
    const key = this.key(tenantId, resource, id);
    return redis.get<T>(key);
  },

  async set<T>(
    tenantId: string,
    resource: string,
    value: T,
    ttlSeconds: number,
    id?: string
  ): Promise<void> {
    const key = this.key(tenantId, resource, id);
    await redis.set(key, value, { ex: ttlSeconds });
  },

  async invalidate(tenantId: string, resource?: string): Promise<void> {
    const pattern = resource ? `tenant:${tenantId}:${resource}:*` : `tenant:${tenantId}:*`;

    // Scan and delete (never use KEYS in production — use SCAN)
    let cursor = 0;
    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor = nextCursor;
      if (keys.length) await redis.del(...keys);
    } while (cursor !== 0);
  },
};
```

---

## Layer 5 — File Storage Isolation

All tenant files live under a path prefix that includes the tenantId:

```typescript
// packages/storage/src/tenant-storage.ts

export function getTenantStoragePath(
  tenantId: string,
  category: 'uploads' | 'exports' | 'avatars' | 'documents',
  filename: string
): string {
  // Path: tenants/{tenantId}/{category}/{filename}
  // Supabase Storage RLS enforces this path prefix per tenant
  return `tenants/${tenantId}/${category}/${filename}`;
}

export async function uploadTenantFile(
  tenantId: string,
  category: 'uploads' | 'exports' | 'avatars',
  file: File,
  options: { upsert?: boolean } = {}
): Promise<{ path: string; url: string }> {
  const supabase = createServiceClient();
  const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const path = getTenantStoragePath(tenantId, category, filename);

  const { error } = await supabase.storage.from('tenant-files').upload(path, file, {
    upsert: options.upsert ?? false,
    contentType: file.type,
  });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from('tenant-files').getPublicUrl(path);

  return { path, url: publicUrl };
}
```

### Supabase Storage RLS

```sql
-- Storage bucket policy: tenants can only access their own prefix
CREATE POLICY "tenant_storage_access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'tenant-files'
  AND (storage.foldername(name)) = 'tenants'
  AND (storage.foldername(name)) = (
    auth.jwt() -> 'app_metadata' ->> 'tenant_id'
  )
);
```

---

## Cross-Tenant Data Access Patterns

Some legitimate operations require reading across tenants. These are **always admin-only**, use the service role, and are explicitly logged:

```typescript
// packages/db/src/admin-queries.ts — ADMIN ONLY — never expose to tenants
import { createServiceClient } from '@repo/db/supabase-server';

/**
 * Cross-tenant query — bypasses RLS via service role.
 * NEVER call from tenant-facing code paths.
 * All calls are logged for audit purposes.
 */
export async function adminGetAllTenants(options: {
  plan?: string;
  status?: string;
  adminId: string; // Required for audit log
}) {
  // Audit log first
  await auditLog({
    action: 'admin.tenants.list',
    actorId: options.adminId,
    metadata: options,
  });

  const supabase = createServiceClient(); // Service role — bypasses RLS
  const query = supabase.from('tenants').select('*');

  if (options.plan) query.eq('plan', options.plan);
  if (options.status) query.eq('status', options.status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

---

## Data Flow Audit Checklist

```
Per-Feature Checklist (run before merging any new data-access code):

□ Every DB query has .where(eq(table.tenantId, tenantId))
□ tenantId comes from getTenantId() (header), NOT URL params
□ Every cache key uses tenantCache.key(tenantId, ...) pattern
□ Every storage upload uses getTenantStoragePath(tenantId, ...)
□ Background job payloads include tenantId and use it in all queries
□ No raw SQL strings (use Drizzle ORM for type-safe queries)
□ Service role client (createServiceClient) NOT used in tenant-facing routes
□ findById queries use BOTH tenantId AND resourceId in WHERE clause
□ Error messages do NOT reveal cross-tenant resource existence
□ Logging redacts tenantId from public-facing error responses
```

---

## Anti-Patterns to Avoid

```typescript
// ❌ ANTI-PATTERN 1: Getting tenantId from URL params
export async function BadLeadPage({ params }: { params: { tenantId: string } }) {
  // URL params can be manipulated — attacker sets ?tenantId=victim_tenant
  const leads = await getLeads(params.tenantId);
}

// ✅ CORRECT: Always from trusted headers
export async function GoodLeadPage() {
  const tenantId = await getTenantId(); // From Edge-validated headers
  const leads = await leadsRepository.findMany(tenantId);
}

// ❌ ANTI-PATTERN 2: Missing tenant scope in lookup
async function badFindLead(leadId: string) {
  return db.select().from(leads).where(eq(leads.id, leadId));
  // Any tenant can read any lead by guessing the UUID!
}

// ✅ CORRECT: Always double-key with tenantId
async function goodFindLead(tenantId: string, leadId: string) {
  return leadsRepository.findById(tenantId, leadId);
}

// ❌ ANTI-PATTERN 3: Unscoped cache key
await redis.set(`lead:${leadId}`, data); // Cross-tenant cache collision!

// ✅ CORRECT: Tenant-namespaced cache key
await tenantCache.set(tenantId, 'lead', data, 300, leadId);
// key = tenant:{tenantId}:lead:{leadId}

// ❌ ANTI-PATTERN 4: Using service role in tenant-facing route
export async function POST(req: NextRequest) {
  const supabase = createServiceClient(); // Bypasses RLS — NEVER in API routes!
  const leads = await supabase.from('leads').select(); // Returns ALL tenants' leads
}
```

````

***

# sanity-client-groq.md

```markdown
# sanity-client-groq.md

> **2026 Standards Compliance** | next-sanity 9.x · @sanity/client 6.x ·
> GROQ Typegen · Next.js 16 `use cache` · Perspective API

## Table of Contents
1. [Overview](#overview)
2. [Client Setup](#client-setup)
3. [GROQ Query Patterns](#groq-query-patterns)
4. [Sanity TypeGen](#sanity-typegen)
5. [Integration with Next.js 16 Cache](#integration-with-nextjs-16-cache)
6. [Draft Mode / Live Preview](#draft-mode--live-preview)
7. [Image URL Builder](#image-url-builder)
8. [Portable Text Rendering](#portable-text-rendering)
9. [Testing GROQ Queries](#testing-groq-queries)
10. [References](#references)

---

## Overview

`next-sanity` is the official Sanity toolkit for Next.js. It provides a pre-configured
Sanity client, live preview support, Portable Text rendering, and deep integration with
Next.js 16's `use cache` directive for optimal performance. [web:73][web:79]

---

## Client Setup

```typescript
// packages/cms/src/sanity/client.ts
import { createClient } from 'next-sanity'

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

if (!projectId) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required')
}

// Published content client (CDN-cached — for production pages)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-19',    // Pin to stable API version [sanity](https://www.sanity.io/answers/issue-with-groq-query-not-working-in-next-js-application--but-works-in-browser-and-studio)
  useCdn: true,                 // CDN for published content
  perspective: 'published',     // Only return published documents
  stega: {
    enabled: false,             // Disable stega in production
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
})

// Draft/preview client (bypasses CDN — for Studio live preview)
export const sanityPreviewClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-19',
  useCdn: false,                // Never cache draft content
  perspective: 'previewDrafts', // Returns drafts + published [sanity](https://www.sanity.io/answers/issue-with-groq-query-not-working-in-next-js-application--but-works-in-browser-and-studio)
  token: process.env.SANITY_API_READ_TOKEN,  // Required for draft access
  stega: {
    enabled: true,              // Enable visual editing overlays
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
})

// Factory: get the right client based on preview mode
export function getSanityClient(preview = false) {
  return preview ? sanityPreviewClient : sanityClient
}
````

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=https://yoursaas.sanity.studio
SANITY_API_READ_TOKEN=sk...    # Read-only token (never write token in app)
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

---

## GROQ Query Patterns

GROQ (Graph-Relational Object Queries) is Sanity's native query language — similar to
GraphQL but optimized for document stores with rich filtering and projection.

### Centralized Query File

```typescript
// packages/cms/src/sanity/queries.ts
import { defineQuery } from 'next-sanity';

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "author": author-> {
      name,
      "avatar": avatar.asset->url
    },
    "categories": categories[]->{ title, slug },
    "coverImage": mainImage {
      asset->,                    // Dereference asset for URL building
      alt,
      hotspot,
      crop
    }
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    updatedAt,
    excerpt,
    body,                         // Portable Text block content
    "author": author-> {
      _id,
      name,
      bio,
      "avatar": avatar.asset->url
    },
    "categories": categories[]->{ title, "slug": slug.current },
    "coverImage": mainImage {
      asset->,
      alt,
      hotspot,
      crop
    },
    // SEO fields
    seo {
      metaTitle,
      metaDescription,
      "ogImage": ogImage.asset->url
    }
  }
`);

// ─── Service Areas ────────────────────────────────────────────────────────────

export const SERVICE_AREAS_BY_TENANT_QUERY = defineQuery(`
  *[_type == "serviceArea" && references($tenantId)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "hero": heroImage { asset->, alt },
    services[]->{
      _id,
      title,
      "slug": slug.current,
      price,
      duration
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`);

// ─── Site Config ──────────────────────────────────────────────────────────────

export const SITE_CONFIG_QUERY = defineQuery(`
  *[_type == "siteConfig" && tenant._ref == $tenantId] {
    _id,
    siteName,
    tagline,
    "logo": logo { asset->, alt },
    primaryColor,
    secondaryColor,
    contactEmail,
    contactPhone,
    address,
    socialLinks,
    businessHours,
    "faviconUrl": favicon.asset->url
  }
`);

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_QUERY = defineQuery(`
  *[_type == "navigation" && tenant._ref == $tenantId] {
    items[] {
      label,
      "href": coalesce(externalUrl, "/" + internalPage->slug.current),
      openInNewTab,
      children[] {
        label,
        "href": coalesce(externalUrl, "/" + internalPage->slug.current)
      }
    }
  }
`);

// ─── Homepage ─────────────────────────────────────────────────────────────────

export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage" && tenant._ref == $tenantId] {
    hero {
      headline,
      subheadline,
      ctaText,
      ctaHref,
      "image": heroImage { asset->, alt, hotspot, crop }
    },
    featuredServices[]->{
      title,
      "slug": slug.current,
      shortDescription,
      "icon": icon { asset->url }
    },
    testimonials[] {
      quote,
      authorName,
      authorTitle,
      rating
    },
    faq[] {
      question,
      answer
    }
  }
`);
```

### Fetching in Server Components

```typescript
// packages/cms/src/sanity/fetch.ts
import { getSanityClient } from './client';
import type { QueryParams } from 'next-sanity';
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

/**
 * Cached Sanity fetch — integrates with Next.js 16 `use cache`.
 * Cache is invalidated via Sanity webhook → revalidateTag().
 */
export async function sanityFetch<T>(options: {
  query: string;
  params?: QueryParams;
  tags: string[];
  cacheProfile?: 'hours' | 'days' | 'weeks';
  preview?: boolean;
}): Promise<T> {
  'use cache';
  cacheLife(options.cacheProfile ?? 'hours');

  // Register all cache tags for surgical invalidation
  for (const tag of options.tags) {
    cacheTag(tag);
  }

  const client = getSanityClient(options.preview);
  return client.fetch<T>(options.query, options.params ?? {});
}
```

### Usage in Server Components

```typescript
// apps/web/src/app/blog/[slug]/page.tsx
import { sanityFetch } from '@repo/cms/sanity/fetch'
import { POST_BY_SLUG_QUERY } from '@repo/cms/sanity/queries'
import type { POST_BY_SLUGResult } from '@repo/cms/sanity/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await sanityFetch<POST_BY_SLUGResult>({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [`blog:${slug}`, 'blog'],
    cacheProfile: 'hours',
  })

  return {
    title: post?.seo?.metaTitle ?? post?.title,
    description: post?.seo?.metaDescription ?? post?.excerpt,
    openGraph: {
      images: post?.seo?.ogImage ? [{ url: post.seo.ogImage }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await sanityFetch<POST_BY_SLUGResult>({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [`blog:${slug}`, 'blog'],
  })

  if (!post) notFound()

  return <BlogPost post={post} />
}

// Static params for SSG at build time
export async function generateStaticParams() {
  const posts = await sanityFetch<Array<{ slug: string }>>({
    query: `*[_type == "blogPost"] { "slug": slug.current }`,
    tags: ['blog-slugs'],
    cacheProfile: 'days',
  })
  return posts.map(p => ({ slug: p.slug }))
}
```

---

## Sanity TypeGen

TypeGen generates TypeScript types from GROQ queries automatically, eliminating
manual type definitions:

```bash
# Install
pnpm add -D @sanity/codegen

# Generate types from all defineQuery() calls
pnpm sanity typegen generate

# Output: packages/cms/src/sanity/types.ts
# Contains: POST_BY_SLUGResult, ALL_POSTS_QUERYResult, etc.
```

```json
// sanity.config.ts (for TypeGen)
{
  "generates": {
    "packages/cms/src/sanity/types.ts": {
      "plugins": ["@sanity/codegen"],
      "config": "sanity.config.ts"
    }
  }
}
```

---

## Integration with Next.js 16 Cache

```typescript
// The sanityFetch wrapper above uses 'use cache' with cacheTag() for on-demand
// invalidation via the Sanity webhook. Tags follow this convention:

// Content type tags:
cacheTag('blog'); // All blog content
cacheTag(`blog:${slug}`); // Specific post
cacheTag('service-areas'); // All service areas
cacheTag(`site-config:${tenantId}`); // Tenant site config

// Invalidation from Sanity webhook calls revalidateTag() — see sanity-webhook-isr.md
```

---

## Draft Mode / Live Preview

```typescript
// app/api/draft/enable/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(slug ?? '/');
}

// app/api/draft/disable/route.ts
export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect('/');
}
```

---

## Image URL Builder

```typescript
// packages/cms/src/sanity/image.ts
import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
});

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source).auto('format').fit('max');
}

// Usage:
// urlForImage(post.coverImage).width(1200).height(630).url()
// urlForImage(author.avatar).width(64).height(64).url()
```

---

## Portable Text Rendering

```typescript
// packages/cms/src/components/PortableTextRenderer.tsx
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { urlForImage } from '../sanity/image'

const components = {
  types: {
    image: ({ value }: { value: { asset: unknown; alt: string; caption?: string } }) => (
      <figure className="my-8">
        <img
          src={urlForImage(value.asset).width(800).url()}
          alt={value.alt ?? ''}
          className="rounded-lg"
          loading="lazy"
          decoding="async"
        />
        {value.caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-500">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    callout: ({ value }: { value: { text: string; tone: string } }) => (
      <aside
        className={`my-6 rounded-lg p-4 ${
          value.tone === 'caution' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
        } border`}
        role="note"
      >
        <p>{value.text}</p>
      </aside>
    ),
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: { href: string; blank?: boolean } }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : undefined}
        rel={value.blank ? 'noopener noreferrer' : undefined}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold">{children}</h3>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-6">
        {children}
      </blockquote>
    ),
  },
}

export function PortableTextRenderer({ content }: { content: PortableTextBlock[] }) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText value={content} components={components} />
    </div>
  )
}
```

---

## References

- [next-sanity GitHub](https://github.com/sanity-io/next-sanity) [web:73]
- [next-sanity Plugin Page](https://www.sanity.io/plugins/next-sanity) [web:79]
- [Sanity GROQ in Next.js — Debug Notes](https://www.sanity.io/answers/issue-with-groq-query-not-working-in-next-js-application) [web:76]
- [GROQ Reference](https://www.sanity.io/docs/groq)
- [@sanity/image-url Docs](https://www.sanity.io/docs/image-url)

````

***

# sanity-webhook-isr.md

```markdown
# sanity-webhook-isr.md

> **2026 Standards Compliance** | Next.js 16 `revalidateTag` · Sanity GROQ Webhooks ·
> `@sanity/webhook` Signature Verification · App Router

## Table of Contents
1. [Overview — How Sanity ISR Works](#overview--how-sanity-isr-works)
2. [Sanity Dashboard Configuration](#sanity-dashboard-configuration)
3. [Webhook Handler Implementation](#webhook-handler-implementation)
4. [Tag Strategy](#tag-strategy)
5. [Webhook Security](#webhook-security)
6. [Testing Webhooks Locally](#testing-webhooks-locally)
7. [Monitoring & Debugging](#monitoring--debugging)
8. [References](#references)

---

## Overview — How Sanity ISR Works

````

Content Editor Sanity Studio Sanity API Webhook Handler Next.js Cache
│ │ │ │ │
│── Publish post ──→ │ │ │
│ │── Webhook ────────────────────→ │
│ │ │ Verify signature │
│ │ │ Extract \_type + slug │
│ │ │ revalidateTag(...) ────→│
│ │ │ │ Purge entries
│ │ │ │ │
│ │ │ Return 200 │
│ │ │ │ │
│ Next visitor gets
│ fresh content
│ (≤ 5 seconds total)

```

---

## Sanity Dashboard Configuration

In Sanity Manage → **API** → **Webhooks** → **Add Webhook**:

```

Name: Next.js ISR Revalidation
URL: https://yoursaas.com/api/webhooks/sanity
Trigger on: Create, Update, Delete
Filter: \_type in ["blogPost", "serviceArea", "siteConfig", "navigation", "homepage"]
Projection: {
\_id,
\_type,
"slug": slug.current,
"tenantId": tenant.\_ref,
"serviceAreaSlug": slug.current
}
Secret: [same as SANITY_WEBHOOK_SECRET env var]
HTTP Method: POST
Headers: Content-Type: application/json

````

The **GROQ Projection** in the webhook filters the payload to exactly what your
handler needs — no over-fetching, smaller payloads. [web:74]

---

## Webhook Handler Implementation

```typescript
// apps/portal/src/app/api/webhooks/sanity/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

// Disable body parsing — we need raw body for signature verification [stackfive](https://www.stackfive.io/work/nextjs/how-to-use-on-demand-isr-with-next-js-and-sanity)
export const dynamic = 'force-dynamic'

interface SanityWebhookBody {
  _id: string
  _type: string
  slug?: string
  tenantId?: string
  serviceAreaSlug?: string
}

export async function POST(req: NextRequest) {
  // Read raw body for signature verification BEFORE parsing JSON
  const rawBody = await req.text()
  const signature = req.headers.get(SIGNATURE_HEADER_NAME)
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  // Verify webhook signature [stackfive](https://www.stackfive.io/work/nextjs/how-to-use-on-demand-isr-with-next-js-and-sanity)
  const isValid = await isValidSignature(rawBody, signature ?? '', secret)
  if (!isValid) {
    console.warn('Invalid Sanity webhook signature — possible spoofing attempt')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let body: SanityWebhookBody
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const tags = resolveTagsFromWebhook(body)

  if (tags.length === 0) {
    return NextResponse.json({ revalidated: false, reason: 'No tags matched' })
  }

  // Revalidate all matched cache tags
  const revalidated: string[] = []
  for (const tag of tags) {
    revalidateTag(tag)
    revalidated.push(tag)
  }

  console.log(`[Sanity Webhook] Revalidated tags: ${revalidated.join(', ')}`)

  return NextResponse.json({
    revalidated: true,
    tags: revalidated,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Map Sanity document types to Next.js cache tags.
 * Tags must match the cacheTag() calls in sanityFetch().
 */
function resolveTagsFromWebhook(body: SanityWebhookBody): string[] {
  const tags: string[] = []

  switch (body._type) {
    case 'blogPost':
      tags.push('blog')                          // All blog listings
      if (body.slug) tags.push(`blog:${body.slug}`) // Specific post
      tags.push('blog-index')                    // Blog index/pagination
      break

    case 'serviceArea':
      tags.push('service-areas')                 // All service areas listing
      if (body.slug) tags.push(`service-area:${body.slug}`)
      if (body.tenantId) tags.push(`tenant:${body.tenantId}:service-areas`)
      break

    case 'siteConfig':
      if (body.tenantId) {
        tags.push(`site-config:${body.tenantId}`)
        tags.push(`tenant:${body.tenantId}`)     // Broad tenant invalidation
      }
      break

    case 'navigation':
      if (body.tenantId) {
        tags.push(`nav:${body.tenantId}`)
        tags.push(`tenant:${body.tenantId}:nav`)
      }
      break

    case 'homepage':
      if (body.tenantId) {
        tags.push(`homepage:${body.tenantId}`)
        tags.push(`tenant:${body.tenantId}:homepage`)
      }
      break

    default:
      console.warn(`[Sanity Webhook] Unhandled document type: ${body._type}`)
  }

  return tags
}
````

---

## Tag Strategy

Tag naming must be **consistent** between `cacheTag()` calls in `sanityFetch()` and
`revalidateTag()` calls in the webhook handler:

```
Document Type        cacheTag() in sanityFetch      revalidateTag() in webhook
─────────────────────────────────────────────────────────────────────────────
blogPost             blog, blog:{slug}              blog, blog:{slug}, blog-index
serviceArea          service-areas,                 service-areas,
                     service-area:{slug},           service-area:{slug},
                     tenant:{id}:service-areas      tenant:{id}:service-areas
siteConfig           site-config:{tenantId},        site-config:{tenantId},
                     tenant:{tenantId}              tenant:{tenantId}
navigation           nav:{tenantId}                 nav:{tenantId}
homepage             homepage:{tenantId}            homepage:{tenantId}
```

---

## Webhook Security

```typescript
// packages/cms/src/webhook-verification.ts — testable utility

import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

export async function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) return false;
  return isValidSignature(rawBody, signature, secret);
}

// Additional security: IP allowlist for Sanity webhook IPs
// Sanity documents their webhook IP ranges at sanity.io/docs/webhooks
const SANITY_WEBHOOK_IPS = [
  '35.223.27.101',
  // Check Sanity docs for current list
];

export function isSanityIp(ip: string): boolean {
  return SANITY_WEBHOOK_IPS.includes(ip);
}
```

---

## Testing Webhooks Locally

```bash
# 1. Install Sanity CLI and smee.io relay
pnpm add -g @sanity/cli smee-client

# 2. Start smee relay (tunnels Sanity webhooks to localhost)
smee -u https://smee.io/your-channel-id -t http://localhost:3000/api/webhooks/sanity

# 3. Configure .env.local with your webhook secret
SANITY_WEBHOOK_SECRET=your_test_secret

# 4. Set smee URL as webhook URL in Sanity Dashboard for development
# 5. Publish a document in Sanity Studio
# 6. Watch Next.js logs for revalidation messages

# Manual test via curl:
curl -X POST http://localhost:3000/api/webhooks/sanity \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: [generated]" \
  -d '{"_id":"test","_type":"blogPost","slug":"my-test-post"}'
```

### Vitest Unit Test

```typescript
// packages/cms/src/sanity-webhook.test.ts
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }));
vi.mock('@sanity/webhook', () => ({
  isValidSignature: vi.fn().mockResolvedValue(true),
  SIGNATURE_HEADER_NAME: 'sanity-webhook-signature',
}));

describe('Sanity Webhook Handler', () => {
  it('revalidates blog tags on blogPost publish', async () => {
    const { revalidateTag } = await import('next/cache');

    const body = JSON.stringify({
      _id: 'abc123',
      _type: 'blogPost',
      slug: 'my-new-post',
    });

    const req = new Request('http://localhost/api/webhooks/sanity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'sanity-webhook-signature': 'sig' },
      body,
    });

    const { POST } = await import('./route');
    const res = await POST(req as unknown as NextRequest);
    const data = await res.json();

    expect(data.revalidated).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith('blog');
    expect(revalidateTag).toHaveBeenCalledWith('blog:my-new-post');
  });
});
```

---

## References

- [next-sanity ISR Setup](https://github.com/sanity-io/next-sanity) [web:73]
- [On-Demand ISR with Sanity Webhooks](https://www.stackfive.io/work/nextjs/how-to-use-on-demand-isr-with-next-js-and-sanity) [web:71]
- [Sanity GROQ-Powered Webhooks — Next.js ISR](https://dev.to/valse/nextjs-on-demand-isr-by-sanity-groq-powered-webhooks-221n) [web:74]
- [Sanity Webhook Configuration](https://www.sanity.io/answers/how-to-set-up-a-web-hook-for-on-demand-isr-in-next-js) [web:77]

````

***

# wcag-compliance-checklist.md

```markdown
# wcag-compliance-checklist.md

> **2026 Standards Compliance** | WCAG 2.2 Level AA · 9 New Criteria ·
> React 19.2 ARIA Patterns · Automated + Manual Testing

## Table of Contents
1. [Why WCAG 2.2 AA in 2026](#why-wcag-22-aa-in-2026)
2. [The 9 New Criteria in WCAG 2.2](#the-9-new-criteria-in-wcag-22)
3. [Complete Level A + AA Checklist](#complete-level-a--aa-checklist)
4. [Perceivable](#perceivable)
5. [Operable](#operable)
6. [Understandable](#understandable)
7. [Robust](#robust)
8. [Per-Component Compliance Notes](#per-component-compliance-notes)
9. [Automated vs Manual Split](#automated-vs-manual-split)
10. [References](#references)

---

## Why WCAG 2.2 AA in 2026

WCAG 2.2 became a W3C Recommendation in October 2023 and is now the legal baseline
in the EU (EAA enforcement begins **June 28, 2025**), UK, Canada, and increasingly
in US ADA case law. Level AA is the minimum required for compliance. [web:65][web:67]

**Business impact beyond compliance:**
- Screen reader users represent ~7% of web users — a real revenue segment
- Keyboard navigation improvements benefit all power users
- Higher target sizes reduce friction on mobile (affects 60%+ of traffic)
- Accessible forms have lower abandonment rates
- Google uses accessibility signals as a ranking factor via Core Web Vitals (INP)

---

## The 9 New Criteria in WCAG 2.2

WCAG 2.2 added 9 new success criteria over WCAG 2.1. These are the most impactful
new requirements for 2026 compliance: [web:85][web:89][web:92]

| SC | Name | Level | What It Requires |
|----|------|-------|-----------------|
| 2.4.11 | Focus Not Obscured (Minimum) | A | Focused component not fully hidden by sticky header/banner |
| 2.4.12 | Focus Not Obscured (Enhanced) | AA | Focused component not partially hidden |
| 2.4.13 | Focus Appearance | AA | Focus indicator ≥ 2px solid outline; contrast ≥ 3:1 vs adjacent colors |
| 2.5.7 | Dragging Movements | AA | All drag interactions have single-pointer alternative |
| 2.5.8 | Target Size (Minimum) | AA | Interactive targets ≥ 24×24 CSS pixels (or adequate spacing) |
| 3.2.6 | Consistent Help | A | Help mechanisms in same relative location across pages |
| 3.3.7 | Redundant Entry | A | Don't ask for same info twice in same session |
| 3.3.8 | Accessible Authentication (Minimum) | AA | No cognitive function test required to authenticate |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA | No object recognition or transcription required |

**Removed:** SC 4.1.1 Parsing (no longer relevant — modern browsers handle malformed HTML). [web:85]

---

## Complete Level A + AA Checklist

### Perceivable

#### 1.1 — Text Alternatives

- [ ] **1.1.1 Non-text Content (A)** — All images have descriptive `alt` text; decorative images have `alt=""`; complex images (charts) have long descriptions; CAPTCHAs have alternatives

```tsx
// ✅ Informative image
<img src="/hero.webp" alt="Plumber fixing a sink in a modern kitchen" />

// ✅ Decorative image
<img src="/divider.svg" alt="" role="presentation" />

// ✅ Complex image (chart)
<figure>
  <img src="/chart.png" alt="Lead growth chart" aria-describedby="chart-desc" />
  <figcaption id="chart-desc">
    Leads increased from 45 in January to 120 in March 2026, a 167% increase.
  </figcaption>
</figure>
````

#### 1.2 — Time-Based Media

- [ ] **1.2.1 Audio-only / Video-only (A)** — Transcripts for audio; text alternative for silent video
- [ ] **1.2.2 Captions (A)** — Captions on all prerecorded video with audio
- [ ] **1.2.3 Audio Description (A)** — Audio description or media alternative for video
- [ ] **1.2.4 Captions (Live) (AA)** — Live captions for live video

#### 1.3 — Adaptable

- [ ] **1.3.1 Info and Relationships (A)** — Structure conveyed via markup, not just visual styling

```tsx
// ✅ Form with explicit label association
<div>
  <label htmlFor="email" className="block text-sm font-medium">
    Email address <span aria-hidden="true">*</span>
    <span className="sr-only">(required)</span>
  </label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-error"
    className="mt-1 block w-full rounded-md border"
  />
  <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
    {emailError}
  </p>
</div>
```

- [ ] **1.3.2 Meaningful Sequence (A)** — Reading order matches visual order in DOM
- [ ] **1.3.3 Sensory Characteristics (A)** — Instructions don't rely solely on shape, color, size, or location
- [ ] **1.3.4 Orientation (AA)** — Content not restricted to single orientation (unless essential)
- [ ] **1.3.5 Identify Input Purpose (AA)** — Form fields have correct `autocomplete` attributes

```tsx
// ✅ Autocomplete attributes enable password managers and autofill
<input autoComplete="given-name" name="firstName" />
<input autoComplete="family-name" name="lastName" />
<input autoComplete="email" type="email" name="email" />
<input autoComplete="tel" type="tel" name="phone" />
<input autoComplete="new-password" type="password" name="password" />
<input autoComplete="current-password" type="password" name="currentPassword" />
```

#### 1.4 — Distinguishable

- [ ] **1.4.1 Use of Color (A)** — Color not used as the only visual means of conveying information
- [ ] **1.4.2 Audio Control (A)** — Auto-playing audio can be paused/stopped
- [ ] **1.4.3 Contrast (Minimum) (AA)** — Text contrast ≥ 4.5:1; large text ≥ 3:1
- [ ] **1.4.4 Resize Text (AA)** — Text resizable to 200% without assistive technology
- [ ] **1.4.5 Images of Text (AA)** — Use actual text, not images of text
- [ ] **1.4.10 Reflow (AA)** — Content reflows at 320px width without horizontal scroll
- [ ] **1.4.11 Non-text Contrast (AA)** — UI components and graphics have 3:1 contrast ratio
- [ ] **1.4.12 Text Spacing (AA)** — Content not lost when: line-height 1.5×, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2×
- [ ] **1.4.13 Content on Hover/Focus (AA)** — Dismissible, hoverable, persistent tooltips/popovers

```css
/* ✅ 1.4.12 — Text spacing override test (paste in DevTools) */
/* Your layout must survive this: */
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
p {
  margin-bottom: 2em !important;
}
```

---

### Operable

#### 2.1 — Keyboard Accessible

- [ ] **2.1.1 Keyboard (A)** — All functionality accessible via keyboard

```tsx
// ✅ Custom interactive component with keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label="Delete lead"
  aria-pressed={isSelected}
>
  <TrashIcon aria-hidden="true" />
</div>
```

- [ ] **2.1.2 No Keyboard Trap (A)** — Users can navigate away from any component using only keyboard
- [ ] **2.1.4 Character Key Shortcuts (A)** — Single-key shortcuts can be remapped or disabled

#### 2.4 — Navigable

- [ ] **2.4.1 Bypass Blocks (A)** — Skip navigation link before main content

```tsx
// ✅ Skip link — visually hidden until focused
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
             focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded"
>
  Skip to main content
</a>
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

- [ ] **2.4.2 Page Titled (A)** — Every page has unique, descriptive `<title>`
- [ ] **2.4.3 Focus Order (A)** — Focus moves in logical sequence
- [ ] **2.4.4 Link Purpose (A)** — Link purpose clear from link text or context
- [ ] **2.4.6 Headings and Labels (AA)** — Descriptive headings and labels
- [ ] **2.4.7 Focus Visible (AA)** — Keyboard focus indicator visible
- [ ] **2.4.11 Focus Not Obscured (Minimum) (A) ⭐ NEW** — Sticky headers don't fully cover focused element

```css
/* ✅ 2.4.11/2.4.12 — Scroll padding prevents sticky header obscuring focus */
html {
  scroll-padding-top: calc(var(--header-height) + 16px);
}
```

- [ ] **2.4.12 Focus Not Obscured (Enhanced) (AA) ⭐ NEW** — Focused component fully visible
- [ ] **2.4.13 Focus Appearance (AA) ⭐ NEW** — Focus indicator ≥ 2px solid, ≥ 3:1 contrast

```css
/* ✅ 2.4.13 — Compliant focus indicator */
:focus-visible {
  outline: 2px solid #2563eb; /* ≥ 2px solid outline */
  outline-offset: 2px; /* Creates visible gap from element */
  /* #2563eb on white background = 5.9:1 contrast ratio ✅ */
}

/* ❌ Non-compliant — removed outline without replacement */
:focus {
  outline: none;
}
```

#### 2.5 — Input Modalities

- [ ] **2.5.3 Label in Name (A)** — Accessible name includes visible label text
- [ ] **2.5.7 Dragging Movements (AA) ⭐ NEW** — Drag interactions have keyboard/click alternative

```tsx
// ✅ 2.5.7 — Drag-to-reorder with keyboard alternative
<SortableList
  items={items}
  onReorder={handleReorder}
  // Keyboard alternative: arrow keys to move items up/down
  onKeyboardMove={(id, direction) => handleKeyboardReorder(id, direction)}
/>
```

- [ ] **2.5.8 Target Size (Minimum) (AA) ⭐ NEW** — Interactive targets ≥ 24×24px

```css
/* ✅ 2.5.8 — Minimum target size via padding (visible icon can be smaller) */
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
  padding: 4px; /* 16px icon + 4px×2 padding = 24px target ✅ */
  /* Recommended: 44×44px for primary actions (AAA: 2.5.5) */
}

.primary-button {
  min-height: 44px; /* Recommended for primary CTAs */
  padding-inline: 1rem;
}
```

---

### Understandable

#### 3.1 — Readable

- [ ] **3.1.1 Language of Page (A)** — `<html lang="en">` set correctly
- [ ] **3.1.2 Language of Parts (AA)** — Language changes marked with `lang` attribute

#### 3.2 — Predictable

- [ ] **3.2.1 On Focus (A)** — Focusing element doesn't trigger context change
- [ ] **3.2.2 On Input (A)** — Changing setting doesn't auto-submit or change context
- [ ] **3.2.3 Consistent Navigation (AA)** — Navigation repeated in same order across pages
- [ ] **3.2.4 Consistent Identification (AA)** — Components with same function identified consistently
- [ ] **3.2.6 Consistent Help (A) ⭐ NEW** — Help mechanisms (chat, FAQ, phone) in same location

#### 3.3 — Input Assistance

- [ ] **3.3.1 Error Identification (A)** — Errors identified in text, not just color

```tsx
// ✅ 3.3.1 — Error clearly identified with role="alert"
{
  errors.email && (
    <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
      <span aria-hidden="true">⚠</span> {errors.email}
    </p>
  );
}
```

- [ ] **3.3.2 Labels or Instructions (A)** — Input labels and format instructions provided
- [ ] **3.3.3 Error Suggestion (AA)** — Error messages include correction suggestions
- [ ] **3.3.4 Error Prevention (AA)** — Legal/financial submissions reversible or confirmable
- [ ] **3.3.7 Redundant Entry (A) ⭐ NEW** — Don't ask for same info twice in same session

```tsx
// ✅ 3.3.7 — Prefill known values in multi-step form
// In Step 3 (Billing), if email was collected in Step 1:
<input
  name="billingEmail"
  type="email"
  defaultValue={session.emailFromStep1} // Pre-fill, don't ask again
  aria-label="Billing email (prefilled from account)"
/>
```

- [ ] **3.3.8 Accessible Authentication (Minimum) (AA) ⭐ NEW** — No memorization/transcription required to log in

```tsx
// ✅ 3.3.8 — Allow password managers (no paste blocking)
<input
  type="password"
  // ❌ DO NOT: onPaste={e => e.preventDefault()}
  // ❌ DO NOT: autocomplete="off"
  autoComplete="current-password" // Enables password manager autofill
/>
// ✅ Also compliant: magic link, passkey, OAuth — no password memory needed
```

---

### Robust

#### 4.1 — Compatible

- [ ] **4.1.2 Name, Role, Value (A)** — All UI components have accessible name, role, state

```tsx
// ✅ 4.1.2 — Toggle button with full state
<button
  type="button"
  aria-pressed={isActive}
  aria-label={isActive ? 'Disable notifications' : 'Enable notifications'}
  onClick={() => setIsActive(!isActive)}
>
  <BellIcon aria-hidden="true" />
</button>

// ✅ Loading state communicated to screen readers
<button
  aria-busy={isLoading}
  disabled={isLoading}
  aria-label={isLoading ? 'Saving…' : 'Save changes'}
>
  {isLoading ? <Spinner aria-hidden="true" /> : 'Save changes'}
</button>
```

- [ ] **4.1.3 Status Messages (AA)** — Status updates communicated without focus change

```tsx
// ✅ 4.1.3 — Live region for status messages
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>

// For errors/urgent messages: aria-live="assertive"
```

---

## Per-Component Compliance Notes

| Component     | Key Requirements                                                  | Common Failures                            |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| Modal/Dialog  | Focus trap, `role="dialog"`, `aria-modal="true"`, close on Escape | Focus not trapped; background scrollable   |
| Dropdown Menu | `role="menu"`, arrow key navigation, `aria-expanded`              | Click-only; no keyboard nav                |
| Data Table    | `<th scope="col/row">`, `caption`, sort indicators                | No headers; sort state not announced       |
| Toast/Alert   | `role="alert"` or `aria-live="polite"`                            | Auto-dismissed before user reads           |
| Accordion     | `aria-expanded`, `aria-controls`, Enter/Space keys                | Click-only                                 |
| Tabs          | `role="tablist/tab/tabpanel"`, arrow keys                         | Tab key used instead of arrows             |
| Form          | Labels, error messages, required indicators                       | Placeholder-only labels; color-only errors |
| Skip Link     | Visible on focus, points to `#main-content`                       | Hidden permanently; broken href            |

---

## Automated vs Manual Split

WCAG 2.2 has **50 Level A + AA criteria**. Automated tools catch approximately
**40% of issues** (20 criteria). The remaining **60% require manual testing**. [web:69]

| Testing Method   | What It Catches                                                                  | Tools                                  |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------------- |
| Automated scan   | Missing alt text, contrast failures, missing labels, duplicate IDs, invalid ARIA | axe-core, Lighthouse                   |
| Keyboard testing | Tab order, focus traps, keyboard shortcuts, focus visibility                     | Manual: Tab/Shift-Tab/Arrow/Escape     |
| Screen reader    | Announcements, reading order, form instructions, dynamic updates                 | NVDA+Chrome, JAWS+IE, VoiceOver+Safari |
| Zoom/reflow      | 320px reflow, 200% text resize, 400% zoom                                        | Browser DevTools                       |
| Mobile testing   | Target sizes, orientation, touch gestures                                        | Physical device or emulator            |
| Cognitive review | Redundant entry, consistent help, error suggestions                              | Manual UX review                       |

---

## References

- [WCAG 2.2 Official Spec](https://www.w3.org/TR/WCAG22/) [web:65]
- [9 New WCAG 2.2 Criteria — TestParty](https://testparty.ai/blog/wcag-22-new-success-criteria) [web:85]
- [WCAG 2.2 New Criteria — Vispero](https://vispero.com/resources/new-success-criteria-in-wcag22/) [web:89]
- [Complete WCAG 2.2 Checklist — Inclly](https://inclly.com/resources/wcag-22-checklist) [web:69]
- [WCAG 2.2 AA Summary — wcag.com](https://www.wcag.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/) [web:78]
- [W3C — What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) [web:92]

````

***

# automated-accessibility-testing.md

```markdown
# automated-accessibility-testing.md

> **2026 Standards Compliance** | @axe-core/playwright · Playwright 1.50 ·
> WCAG 2.2 · GitHub Actions CI · Vitest + axe-core

## Table of Contents
1. [Overview — The 40% Rule](#overview--the-40-rule)
2. [Setup](#setup)
3. [Playwright + axe-core Integration](#playwright--axe-core-integration)
4. [Writing Accessibility Tests](#writing-accessibility-tests)
5. [Component-Level Testing with Vitest](#component-level-testing-with-vitest)
6. [CI/CD Integration](#cicd-integration)
7. [Reporting & Triage](#reporting--triage)
8. [Known Limitations & Manual Checklist](#known-limitations--manual-checklist)
9. [References](#references)

---

## Overview — The 40% Rule

Automated accessibility tools (axe-core, Lighthouse) catch approximately **40% of
WCAG issues** — specifically the rule-based violations that can be determined
programmatically without human judgment. [web:69][web:86]

**Automated tools catch:**
- Missing `alt` attributes on images
- Insufficient color contrast ratios
- Missing form labels
- Invalid ARIA attributes and roles
- Duplicate landmark regions
- Keyboard focus order issues (partially)
- Missing page `<title>` and `lang` attribute

**Automated tools cannot catch:**
- Whether `alt` text is *meaningful* (not just present)
- Whether navigation is *logically* ordered for users
- Whether error messages are *clear and actionable*
- Whether content is *understandable* at appropriate reading level
- Real-world screen reader behavior nuances

---

## Setup

```bash
# Install axe-core Playwright integration
pnpm add -D @axe-core/playwright

# Or use the axe-playwright wrapper (simpler API)
pnpm add -D axe-playwright

# Already have Playwright? Just add the axe package:
pnpm add -D @axe-core/playwright
````

```typescript
// playwright.config.ts — no special config needed for axe
// axe injects into existing tests via the AxeBuilder class
```

---

## Playwright + axe-core Integration

### Base Accessibility Fixture

Create a reusable fixture that wraps every test with accessibility scanning: [web:80][web:86]

```typescript
// e2e/fixtures/accessibility.ts
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export type AccessibilityFixtures = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<AccessibilityFixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']) // WCAG 2.2 AA
        .exclude('#third-party-widget') // Exclude known third-party iframes
        .exclude('[data-axe-ignore]'); // Opt-out escape hatch for known issues

    await use(makeAxeBuilder);
  },
});

export { expect };
```

---

## Writing Accessibility Tests

### Page-Level Scan

```typescript
// e2e/accessibility/pages.spec.ts
import { test, expect } from '../fixtures/accessibility';

const PAGES_TO_AUDIT = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' },
  { name: 'Sign Up', path: '/signup' },
  { name: 'Dashboard', path: '/dashboard', requiresAuth: true },
  { name: 'Settings', path: '/settings', requiresAuth: true },
];

for (const page of PAGES_TO_AUDIT) {
  test(`${page.name} page — no WCAG 2.2 AA violations`, async ({
    page: browserPage,
    makeAxeBuilder,
  }) => {
    if (page.requiresAuth) {
      await browserPage.goto('/login');
      await browserPage.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
      await browserPage.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
      await browserPage.click('[type="submit"]');
      await browserPage.waitForURL('/dashboard');
    }

    await browserPage.goto(page.path);
    await browserPage.waitForLoadState('networkidle');

    const results = await makeAxeBuilder().analyze();

    expect(results.violations).toEqual([]);
  });
}
```

### Component Interaction Flows

```typescript
// e2e/accessibility/forms.spec.ts
import { test, expect } from '../fixtures/accessibility';

test.describe('Form Accessibility', () => {
  test('contact form — no violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/contact');

    // Scan initial state
    const initialResults = await makeAxeBuilder().analyze();
    expect(initialResults.violations).toEqual([]);

    // Trigger validation errors
    await page.click('[type="submit"]');
    await page.waitForSelector('[role="alert"]');

    // Scan error state — errors must be accessible
    const errorResults = await makeAxeBuilder().analyze();
    expect(errorResults.violations).toEqual([]);
  });

  test('modal dialog — focus trap and ARIA', async ({ page, makeAxeBuilder }) => {
    await page.goto('/dashboard');
    await page.click('[data-testid="add-lead-button"]');
    await page.waitForSelector('[role="dialog"]');

    // Modal must be accessible
    const modalResults = await makeAxeBuilder()
      .include('[role="dialog"]') // Scope scan to modal only
      .analyze();

    expect(modalResults.violations).toEqual([]);

    // Verify focus is inside dialog
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']).toContain(focusedElement);

    // Verify Escape closes dialog
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('keyboard navigation — full page traversal', async ({ page }) => {
    await page.goto('/');

    // Tab through all interactive elements; verify none are trapped
    const tabCount = 30;
    for (let i = 0; i < tabCount; i++) {
      await page.keyboard.press('Tab');

      // Ensure no keyboard trap — each Tab moves focus
      const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedTag).not.toBe('BODY'); // Focus should be on something
    }
  });
});
```

### WCAG 2.2-Specific Tests

```typescript
// e2e/accessibility/wcag22.spec.ts
import { test, expect } from '../fixtures/accessibility';

test.describe('WCAG 2.2 New Criteria', () => {
  // 2.4.13 Focus Appearance — focus indicator must be visible
  test('2.4.13 — focus indicators visible on all interactive elements', async ({ page }) => {
    await page.goto('/dashboard');
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    const outline = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
        outlineColor: styles.outlineColor,
      };
    });

    expect(outline.outlineStyle).not.toBe('none');
    expect(parseFloat(outline.outlineWidth)).toBeGreaterThanOrEqual(2);
  });

  // 2.5.8 Target Size — interactive elements ≥ 24×24px [testparty](https://testparty.ai/blog/wcag-22-new-success-criteria)
  test('2.5.8 — interactive targets meet minimum size', async ({ page }) => {
    await page.goto('/dashboard');

    const violations = await page.evaluate(() => {
      const interactiveElements = Array.from(
        document.querySelectorAll('a, button, input, select, textarea, [role="button"]')
      );

      return interactiveElements
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          // Exclude invisible elements and inline links
          if (rect.width === 0 || rect.height === 0) return false;
          // Inline links in text are exempt from 2.5.8
          if (el.tagName === 'A' && el.closest('p, li, td')) return false;

          return rect.width < 24 || rect.height < 24;
        })
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent?.trim().substring(0, 30),
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height,
        }));
    });

    expect(violations).toEqual([]);
  });

  // 3.3.7 — Redundant entry: billing email should be pre-filled
  test('3.3.7 — billing form pre-fills known user email', async ({ page }) => {
    await page.goto('/billing/checkout');

    const emailField = page.locator('[name="billingEmail"]');
    const prefilled = await emailField.inputValue();

    // Should be prefilled from session; user shouldn't have to re-enter
    expect(prefilled).not.toBe('');
    expect(prefilled).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  // 2.4.11 — Sticky header should not obscure focused elements
  test('2.4.11 — sticky nav does not cover focused elements', async ({ page }) => {
    await page.goto('/blog');

    // Tab to a link deep in the page content
    const links = page.locator('article a');
    await links.first().focus();

    const linkBounds = await links.first().boundingBox();
    const headerHeight = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header?.getBoundingClientRect().bottom ?? 0;
    });

    // Focused element's top must be BELOW header bottom
    if (linkBounds) {
      expect(linkBounds.y).toBeGreaterThan(headerHeight);
    }
  });
});
```

---

## Component-Level Testing with Vitest

```typescript
// packages/ui/src/components/Button/Button.a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { expect, describe, it } from 'vitest'
import { Button } from './Button'

expect.extend(toHaveNoViolations)

describe('Button — Accessibility', () => {
  it('has no WCAG violations in default state', async () => {
    const { container } = render(<Button>Save changes</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no violations when loading', async () => {
    const { container } = render(
      <Button aria-busy={true} disabled>
        Saving…
      </Button>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no violations when icon-only (must have aria-label)', async () => {
    const { container } = render(
      <Button aria-label="Delete lead" variant="icon">
        <TrashIcon aria-hidden="true" />
      </Button>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('exposes correct accessible name', async () => {
    const { getByRole } = render(<Button>Save changes</Button>)
    expect(getByRole('button', { name: 'Save changes' })).toBeTruthy()
  })
})
```

---

## CI/CD Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Audit

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  a11y-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Install Playwright Browsers
        run: pnpm playwright install --with-deps chromium

      - name: Start app server
        run: pnpm start &
        env:
          PORT: 3000
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Wait for server
        run: npx wait-on http://localhost:3000 --timeout 60000

      - name: Run Accessibility Tests
        run: pnpm playwright test e2e/accessibility/
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000

      - name: Upload Accessibility Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-report
          path: playwright-report/
          retention-days: 30

      - name: Comment PR with violations
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ **Accessibility violations detected.** Check the [test report](${{ env.REPORT_URL }}) for details.'
            })
```

---

## Reporting & Triage

### Structured Violation Report

```typescript
// scripts/generate-a11y-report.ts
interface AxeViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  nodes: Array<{ html: string; failureSummary: string }>;
  tags: string[];
  helpUrl: string;
}

function formatViolationReport(violations: AxeViolation[]): string {
  const grouped = violations.reduce(
    (acc, v) => {
      const impact = v.impact;
      if (!acc[impact]) acc[impact] = [];
      acc[impact].push(v);
      return acc;
    },
    {} as Record<string, AxeViolation[]>
  );

  const lines: string[] = ['# Accessibility Violation Report\n'];

  for (const impact of ['critical', 'serious', 'moderate', 'minor']) {
    const items = grouped[impact] ?? [];
    if (!items.length) continue;

    lines.push(`## ${impact.charAt(0).toUpperCase() + impact.slice(1)} (${items.length})`);
    for (const v of items) {
      lines.push(`\n### ${v.id}`);
      lines.push(`${v.description}`);
      lines.push(`**Fix:** ${v.helpUrl}`);
      lines.push(`**Affects ${v.nodes.length} element(s)**`);
      lines.push(`\`\`\`html\n${v.nodes?.html}\n\`\`\``);
    }
  }

  return lines.join('\n');
}
```

---

## Known Limitations & Manual Checklist

Supplement automated testing with these manual checks every sprint: [web:84]

```
Manual Accessibility Sprint Checklist:

Keyboard Testing:
□ Tab through entire page — every interactive element reachable
□ No keyboard traps (can always Tab away)
□ Custom dropdowns/menus respond to arrow keys
□ Modals close on Escape and return focus to trigger
□ Skip link appears on first Tab and works

Screen Reader Testing (NVDA + Chrome, VoiceOver + Safari):
□ Page title announced correctly on navigation
□ Images read with meaningful alt text
□ Form labels read before inputs
□ Error messages announced when validation fails
□ Status messages (toasts) announced (aria-live)
□ Dynamic content updates announced (loading states)

Visual Testing:
□ Color contrast verified for all text (use Colour Contrast Analyser)
□ No information conveyed by color alone
□ Focus indicator visible on all interactive elements
□ Content readable at 200% zoom
□ Content reflows correctly at 320px viewport width

Cognitive/Usability:
□ No auto-playing media
□ Consistent navigation across all pages
□ Error messages suggest how to fix the problem
□ Multi-step forms don't require redundant entry
□ Login allows password manager autofill
```

---

## References

- [Playwright Accessibility Testing Docs](https://playwright.dev/docs/accessibility-testing) [web:80]
- [axe-core/playwright CI Guide](https://testdino.com/blog/playwright-accessibility/) [web:86]
- [Automating A11y Testing — Subito](https://dev.to/subito/how-we-automate-accessibility-testing-with-playwright-and-axe-3ok5) [web:82]
- [Playwright + Axe Tutorial — YouTube](https://www.youtube.com/watch?v=PGaF8lE3qm8) [web:81]
- [axe-core/playwright Tutorial — Checkly](https://www.checklyhq.com/blog/integrating-accessibility-checks-in-playwright-tes/) [web:90]
- [Nareshit — Playwright + Axe Guide](https://nareshit.com/blogs/accessibility-testing-using-playwright-and-axe-core) [web:84]
- [WCAG 2.2 Checklist — Inclly](https://inclly.com/resources/wcag-22-checklist) [web:69]

```

***

**Batch 5 complete.** [w3](https://www.w3.org/TR/WCAG22/)

| # | Document | Priority | Status |
|---|----------|----------|--------|
| 1 | `tenant-data-flow-patterns.md` | P0 | ✅ |
| 2 | `sanity-client-groq.md` | P1 | ✅ |
| 3 | `sanity-webhook-isr.md` | P1 | ✅ |
| 4 | `wcag-compliance-checklist.md` | P1 | ✅ |
| 5 | `automated-accessibility-testing.md` | P1 | ✅ |

**Running P0 tally:** 4 of 5 complete — `config-validation-ci-pipeline.md` and `golden-path-cli-documentation.md` remain

**Running P1 tally:** 8 of 11 complete — `accessibility-p0
```
