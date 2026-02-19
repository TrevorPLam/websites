/**
 * @file clients/starter-template/app/sitemap.ts
 * @summary Sitemap generation for SEO crawlability
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import siteConfig from '../site.config';
import { routing } from '../i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const entries: MetadataRoute.Sitemap = [];

  // Generate sitemap entries for each locale
  // Since localePrefix is 'always', all locales get a prefix including 'en'
  for (const locale of routing.locales) {
    const localePrefix = `/${locale}`;

    // Home page
    entries.push({
      url: `${baseUrl}${localePrefix}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Core pages from navLinks
    const corePages = siteConfig.navLinks.map((link) => ({
      url: `${baseUrl}${localePrefix}${link.href}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    entries.push(...corePages);

    // Blog pages (if blog is enabled)
    if (siteConfig.features.blog) {
      entries.push({
        url: `${baseUrl}${localePrefix}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      });
    }
  }

  return entries;
}
