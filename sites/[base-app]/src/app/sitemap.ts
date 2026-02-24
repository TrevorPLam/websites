import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { db } from '@repo/db';
import config from '../../../../site.config';

// Google's limit: 50,000 URLs per sitemap file
// Use generateSitemaps() for sites with >50k pages
export const revalidate = 3600; // Rebuild hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.deployment.canonicalUrl;
  const tenantId = config.identity.tenantId;

  // -------------------------------------------------------------------------
  // Static routes (always present)
  // -------------------------------------------------------------------------
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // -------------------------------------------------------------------------
  // Dynamic blog posts (from CMS/DB)
  // -------------------------------------------------------------------------
  const { data: posts } = await db
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('tenant_id', tenantId)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // -------------------------------------------------------------------------
  // Dynamic service detail pages
  // -------------------------------------------------------------------------
  const { data: services } = await db
    .from('service_pages')
    .select('slug, updated_at')
    .eq('tenant_id', tenantId)
    .eq('status', 'published');

  const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...serviceRoutes];
}
