import { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}
