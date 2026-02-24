import type { MetadataRoute } from 'next';
import { buildRobots } from '@repo/seo';
import siteConfig from '../site.config';

export default function robots(): MetadataRoute.Robots {
  return buildRobots(siteConfig);
}
