---
title: "Sanity CMS Draft Mode Integration 2026 Guide"
description: "Sanity CMS draft mode integration enables real-time visual editing, allowing content creators to view and interact with draft content before publishing. This guide covers implementing draft mode with ..."
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "sanity", "draft", "mode"]
legacy_path: "cms-content\sanity-cms-draft-mode-2026.md"
---
# Sanity CMS Draft Mode Integration 2026 Guide

## Overview

Sanity CMS draft mode integration enables real-time visual editing, allowing content creators to view and interact with draft content before publishing. This guide covers implementing draft mode with Next.js 16, including dual client setup, visual editing overlays, and seamless draft/published content switching.

## Key Concepts

### What is Sanity Draft Mode?

Draft mode allows authorized content editors to:

- **View unpublished content** in the live application
- **See real-time changes** as they edit in Sanity Studio
- **Toggle between draft and published** content states
- **Use visual editing overlays** for direct content manipulation

### Dual Client Architecture

The dual client approach uses different configurations:

- **Draft Client**: Uses API tokens, bypasses CDN, fetches preview content
- **Published Client**: Uses CDN, fetches only published content
- **Automatic Switching**: Detects draft mode and selects appropriate client

## Implementation Guide

### 1. Sanity Client Configuration

Create a dual client setup with automatic draft mode detection:

```typescript
// packages/cms-adapter/src/sanity/client.ts
import { createClient, type SanityClient } from '@sanity/client';
import { draftMode } from 'next/headers';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID!;
const SANITY_DATASET = process.env.SANITY_DATASET ?? 'production';
const SANITY_API_VERSION = '2024-11-01';

// ============================================================================
// DUAL CLIENT: Draft Mode aware
// Published: uses public read token (safe to expose)
// Draft: uses editor token (server-side only, never to client)
// ============================================================================

export function getSanityClient(): SanityClient {
  // Preview token — only used server-side when draft mode is active
  const token = process.env.SANITY_API_READ_TOKEN;

  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false, // Always fresh in server context
    stega: {
      enabled: false, // Only enable in visual editor context
    },
    ...(token ? { token } : {}),
  });
}

// Server Component usage (auto-detects draft mode)
export async function getSanityClientForRequest(): Promise<{
  client: SanityClient;
  isDraft: boolean;
}> {
  const { isEnabled: isDraft } = await draftMode();

  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: !isDraft, // CDN for published, direct for drafts
    perspective: isDraft ? 'previewDrafts' : 'published', // Draft mode toggle
    token: isDraft ? process.env.SANITY_API_READ_TOKEN : undefined,
    stega: {
      // Enable Sanity Visual Editing overlays only in draft mode
      enabled: isDraft,
      studioUrl: process.env.SANITY_STUDIO_URL ?? 'http://localhost:3333',
    },
  });

  return { client, isDraft };
}
```

### 2. Draft Mode API Routes

Create API routes for enabling and disabling draft mode:

```typescript
// sites/*/src/app/api/draft-mode/enable/route.ts
import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { getSanityClient } from '@repo/cms-adapter/sanity';

export async function GET(req: NextRequest) {
  // Validate the secret token from Sanity Studio
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(getSanityClient(), req.url);

  if (!isValid) {
    return new NextResponse('Invalid secret', { status: 401 });
  }

  // Enable draft mode (sets __prerender_bypass cookie)
  (await draftMode()).enable();

  // Redirect to the page being previewed
  return NextResponse.redirect(new URL(redirectTo, req.url));
}

// sites/*/src/app/api/draft-mode/disable/route.ts
import { draftMode } from 'next/headers';

export async function GET() {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL!));
}
```

### 3. Visual Editing Components

Create components for visual editing and draft mode management:

```typescript
// packages/ui/src/shared/DraftModeBanner.tsx
import { draftMode } from 'next/headers';

export async function DraftModeBanner() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-amber-500 text-black px-6 py-3 rounded-full shadow-xl font-semibold"
    >
      <span>🔶 Draft Mode Active</span>
      <a
        href="/api/draft-mode/disable"
        className="underline text-sm hover:text-amber-900 focus-visible:ring-2 focus-visible:ring-black rounded"
      >
        Exit Preview
      </a>
    </div>
  );
}

// packages/ui/src/shared/DisableDraftMode.tsx
'use client';

import { useTransition } from 'react';
import { disableDraftMode } from '@/app/actions';
import { useIsPresentationTool } from 'next-sanity/hooks';

export function DisableDraftMode() {
  const [pending, startTransition] = useTransition();
  const isPresentationTool = useIsPresentationTool();

  // Only show the disable draft mode button when outside of Presentation Tool
  if (isPresentationTool === null || isPresentationTool === true) {
    return null;
  }

  const disable = () => startTransition(() => disableDraftMode());

  return (
    <div>
      {pending ? (
        'Disabling draft mode...'
      ) : (
        <button type="button" onClick={disable}>
          Disable draft mode
        </button>
      )}
    </div>
  );
}
```

### 4. Root Layout Integration

Integrate visual editing components in the root layout:

```typescript
// sites/*/src/app/layout.tsx
import { VisualEditing } from 'next-sanity/visual-editing';
import { draftMode } from 'next/headers';
import { DisableDraftMode } from '@/components/DisableDraftMode';
import { DraftModeBanner } from '@/components/DraftModeBanner';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Draft mode banner for content editors */}
        <DraftModeBanner />

        {/* Visual editing components - only in draft mode */}
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
```

### 5. Content Fetching with Draft/Published Switching

Create content fetchers that automatically handle draft/published content:

```typescript
// packages/cms-adapter/src/sanity/queries.ts
import { getSanityClientForRequest } from './client';
import { groq } from 'next-sanity';

export async function getHomePageContent(tenantId: string) {
  const { client, isDraft } = await getSanityClientForRequest();

  // In draft mode: fetches unpublished changes
  // In published mode: fetches only live content
  const query = groq`
    *[_type == "homePage" && tenant._ref == $tenantId][0] {
      headline,
      subheadline,
      ctaText,
      ctaUrl,
      "backgroundImage": backgroundImage.asset->url,
      "services": services[] {
        name,
        description,
        "icon": icon.asset->url,
        slug
      },
      faqs[] {
        question,
        answer
      }
    }
  `;

  return client.fetch(
    query,
    { tenantId },
    {
      // Cache bust in draft mode; cache in production
      cache: isDraft ? 'no-store' : 'force-cache',
      next: isDraft ? undefined : { revalidate: 3600, tags: [`tenant:${tenantId}:content`] },
    }
  );
}

export async function getBlogPosts(tenantId: string, limit = 10) {
  const { client, isDraft } = await getSanityClientForRequest();

  const query = groq`
    *[_type == "blogPost" && tenant._ref == $tenantId] | order(publishedAt desc) [0...$limit] {
      title,
      slug,
      excerpt,
      publishedAt,
      "author": author->{
        name,
        "image": image.asset->url
      },
      "mainImage": mainImage.asset->url,
      body
    }
  `;

  return client.fetch(
    query,
    { tenantId, limit },
    {
      cache: isDraft ? 'no-store' : 'force-cache',
      next: isDraft ? undefined : { revalidate: 1800, tags: [`tenant:${tenantId}:blog`] },
    }
  );
}
```

### 6. Server Actions for Draft Mode

Create server actions for draft mode management:

```typescript
// sites/*/src/app/actions.ts
'use server';

import { draftMode } from 'next/headers';

export async function disableDraftMode() {
  const disable = (await draftMode()).disable();

  // Add delay to ensure loading state is shown
  const delay = new Promise((resolve) => setTimeout(resolve, 1000));

  await Promise.allSettled([disable, delay]);
}

export async function enableDraftMode(secret: string, redirectTo?: string) {
  const enable = (await draftMode()).enable();

  // Validate secret and redirect
  // Implementation depends on your validation logic

  await Promise.allSettled([enable]);

  return { success: true, redirectTo: redirectTo || '/' };
}
```

## Best Practices

### 1. Security Considerations

**Token Management**

- **Never expose** API tokens to client-side code
- **Use environment variables** for sensitive configuration
- **Implement proper validation** for draft mode requests
- **Use HTTPS** for all draft mode communications

**Access Control**

- **Validate secret tokens** from Sanity Studio
- **Implement role-based access** for draft mode
- **Use IP restrictions** if needed
- **Log draft mode access** for security auditing

### 2. Performance Optimization

**Caching Strategy**

- **Disable CDN** in draft mode for immediate updates
- **Use aggressive caching** for published content
- **Implement proper revalidation** strategies
- **Cache database queries** appropriately

**Content Loading**

- **Use incremental static regeneration** for published content
- **Implement proper loading states** for draft content
- **Optimize image loading** with next/image
- **Use streaming responses** for large content

### 3. Content Management

**Draft Mode Workflow**

- **Clear content status indicators** for editors
- **Provide easy exit** from draft mode
- **Show last modified** timestamps
- **Implement content validation** before publishing

**Visual Editing**

- **Enable stega** only in draft mode
- **Provide clear visual indicators** for editable content
- **Implement proper focus management** for overlays
- **Use appropriate z-index** for overlay elements

## Advanced Patterns

### 1. Multi-tenant Draft Mode

```typescript
export async function getTenantSanityClient(tenantId: string) {
  const { isEnabled: isDraft } = await draftMode();

  // Tenant-specific configuration
  const tenantConfig = await getTenantConfig(tenantId);

  return createClient({
    projectId: tenantConfig.sanityProjectId,
    dataset: tenantConfig.sanityDataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: !isDraft,
    perspective: isDraft ? 'previewDrafts' : 'published',
    token: isDraft ? tenantConfig.sanityApiReadToken : undefined,
    stega: {
      enabled: isDraft,
      studioUrl: tenantConfig.sanityStudioUrl,
    },
  });
}
```

### 2. Content Preview with Live Updates

```typescript
// packages/cms-adapter/src/sanity/live-preview.ts
import { defineLive } from 'next-sanity';
import { getSanityClientForRequest } from './client';

export const { sanityFetch, SanityLiveContent } = defineLive({
  client: async () => {
    const { client } = await getSanityClientForRequest();
    return client;
  },
});

// Usage in component
import { sanityFetch, SanityLiveContent } from '@repo/cms-adapter/sanity/live-preview';

export async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await sanityFetch(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      body,
      publishedAt
    }`,
    { params: { slug: params.slug } }
  );

  return (
    <article>
      <SanityLiveContent />
      <h1>{post.title}</h1>
      <div>{post.body}</div>
    </article>
  );
}
```

### 3. Draft Mode Analytics

```typescript
// packages/cms-adapter/src/sanity/analytics.ts
export async function trackDraftModeActivity(
  action: 'enable' | 'disable' | 'view',
  tenantId: string,
  userId?: string
) {
  const { isEnabled } = await draftMode();

  await fetch('/api/analytics/draft-mode', {
    method: 'POST',
    body: JSON.stringify({
      action,
      isActive: isEnabled,
      tenantId,
      userId,
      timestamp: new Date().toISOString(),
    }),
  });
}
```

## Testing and Validation

### 1. Unit Testing

```typescript
// packages/cms-adapter/src/__tests__/client.test.ts
import { getSanityClientForRequest } from '../client';

describe('Sanity Client', () => {
  it('returns draft client when draft mode is enabled', async () => {
    // Mock draftMode to return true
    jest.mock('next/headers', () => ({
      draftMode: () => Promise.resolve({ isEnabled: true }),
    }));

    const { client, isDraft } = await getSanityClientForRequest();

    expect(isDraft).toBe(true);
    expect(client.config().useCdn).toBe(false);
  });

  it('returns published client when draft mode is disabled', async () => {
    jest.mock('next/headers', () => ({
      draftMode: () => Promise.resolve({ isEnabled: false }),
    }));

    const { client, isDraft } = await getSanityClientForRequest();

    expect(isDraft).toBe(false);
    expect(client.config().useCdn).toBe(true);
  });
});
```

### 2. Integration Testing

```typescript
// e2e/tests/draft-mode.spec.ts
import { test, expect } from '@playwright/test';

test('Draft mode enables and disables correctly', async ({ page }) => {
  // Navigate to a page
  await page.goto('/');

  // Enable draft mode
  await page.goto('/api/draft-mode/enable?secret=test-secret&redirect=/');

  // Check if draft mode banner appears
  await expect(page.locator('[role="alert"]')).toContainText('Draft Mode Active');

  // Disable draft mode
  await page.click('text=Exit Preview');

  // Check if banner disappears
  await expect(page.locator('[role="alert"]')).not.toBeVisible();
});

test('Visual editing overlays appear in draft mode', async ({ page }) => {
  // Enable draft mode
  await page.goto('/api/draft-mode/enable?secret=test-secret');

  // Check for visual editing elements
  await expect(page.locator('[data-sanity-studio]')).toBeVisible();
});
```

## Troubleshooting

### Common Issues

**Problem**: Draft mode not activating
**Solutions**:

- Check if secret token is valid
- Verify environment variables are set
- Ensure API routes are properly configured
- Check browser console for errors

**Problem**: Visual editing overlays not appearing
**Solutions**:

- Verify stega is enabled in client configuration
- Check if studio URL is correctly configured
- Ensure draft mode is actually active
- Check for CSS conflicts with overlay elements

**Problem**: Content not updating in real-time
**Solutions**:

- Verify client configuration bypasses CDN in draft mode
- Check if perspective is set to 'previewDrafts'
- Ensure API tokens have proper permissions
- Check network requests in browser dev tools

**Problem**: Performance issues in draft mode
**Solutions**:

- Optimize Sanity queries with proper projections
- Implement client-side caching for non-critical data
- Use incremental static regeneration where possible
- Monitor database query performance

### Debugging Tools

**Sanity Studio Debug Console**

```javascript
// In Sanity Studio console
console.log('Studio config:', studioConfig);
console.log('Client configuration:', client.config());
```

**Next.js Debug Information**

```typescript
// Add to API routes for debugging
console.log('Draft mode status:', await draftMode());
console.log('Client config:', client.config());
console.log('Environment variables:', {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  hasToken: !!process.env.SANITY_API_READ_TOKEN,
});
```

## Migration Guide

### From Single Client to Dual Client

1. **Update client configuration** to support dual mode
2. **Add draft mode detection** logic
3. **Update content fetchers** to use new client
4. **Add visual editing components** to layout
5. **Test thoroughly** in both modes

### Environment Variables Required

```bash
# .env.local
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token
SANITY_STUDIO_URL=http://localhost:3333
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Tools and Resources

### Development Tools

- **Sanity Studio** - Content management interface
- **Next.js** - Framework with draft mode support
- **next-sanity** - Official Sanity integration toolkit
- **Playwright** - End-to-end testing

### Monitoring Tools

- **Sanity Analytics** - Content performance metrics
- **Vercel Analytics** - Draft mode usage tracking
- **Custom monitoring** - Draft mode activity logging

### Documentation

- [Sanity Visual Editing Documentation](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router)
- [Next.js Draft Mode API](https://nextjs.org/docs/app/guides/draft-mode)
- [next-sanity Toolkit](https://github.com/sanity-io/next-sanity)
- [Sanity Presentation Tool](https://www.sanity.io/docs/content-lake/presenting-and-previewing-content)

---

_Last updated: February 2026_