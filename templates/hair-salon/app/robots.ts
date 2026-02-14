

import { MetadataRoute } from 'next';
import { getPublicBaseUrl } from '@/lib/env.public';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getPublicBaseUrl();

  // Default policy: allow everything except API/admin paths; keep sitemap in sync with sitemap.ts
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
