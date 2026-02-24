import type { MetadataRoute } from 'next';
import { buildSitemap } from '@repo/seo';
import siteConfig from '../site.config';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig);
}
