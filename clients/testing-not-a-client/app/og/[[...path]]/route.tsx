import type { NextRequest } from 'next/server';
import { buildOgImage } from '@repo/seo';
import siteConfig from '../../../site.config';

export const runtime = 'edge';

export function GET(request: NextRequest) {
  const url = new URL(request.url);
  return buildOgImage({ config: siteConfig, pathname: url.pathname });
}
