// File: app/sitemap.ts  [TRACE:FILE=app.sitemap]
// Purpose: Generates sitemap.xml for SEO. Consumes unified route registry from lib/routes.ts
//          and merges with dynamic blog post pages.
//
// Exports / Entry: default function sitemap
// Used by: Next.js sitemap generation at /sitemap.xml
//
// Invariants:
// - Static routes come from lib/routes.ts (single source of truth)
// - Blog post URLs are dynamically generated from content
// - All URLs must use getPublicBaseUrl() for correct domain
//
// Status: @public
// Features:
// - [FEAT:SEO] Sitemap generation
// - [FEAT:NAVIGATION] Route registry consumer
//
// Related: Task 0.25 — Create Unified Route Registry

import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/features/blog/lib/blog';
import { getPublicBaseUrl } from '@/lib/env.public';
import { getSitemapEntries } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicBaseUrl();
  const staticEntries = getSitemapEntries(baseUrl);

  const posts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...blogPages];
}
