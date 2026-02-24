import type { Metadata } from 'next';
import type { SiteConfig } from '@repo/types';

type MetadataOptions = {
  config: SiteConfig;
  path: string;
  pageTitle?: string;
  pageDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
};

function sanitizePath(path: string): string {
  if (!path.startsWith('/')) return `/${path}`;
  return path;
}

export function buildMetadata(options: MetadataOptions): Metadata {
  const { config, pageTitle, pageDescription, ogImage, noIndex = false, canonical } = options;
  const path = sanitizePath(options.path);

  const siteUrl = config.url.replace(/\/$/, '');
  const city = config.contact.address?.city;
  const state = config.contact.address?.state;
  const businessSuffix = city ? `${config.name} — ${city}, ${state ?? ''}`.trim() : config.name;

  const title = pageTitle
    ? { default: `${pageTitle} | ${businessSuffix}`, template: `%s | ${businessSuffix}` }
    : { default: businessSuffix, template: `%s | ${businessSuffix}` };

  const description =
    pageDescription ??
    config.seo.defaultDescription ??
    `${config.name} serving ${city ?? 'your area'}. Call ${config.contact.phone ?? 'us today'}.`;

  const resolvedCanonical = canonical ?? `${siteUrl}${path === '/' ? '' : path}`;
  const resolvedOgImage =
    ogImage ?? config.seo.ogImage ?? `${siteUrl}/og${path === '/' ? '' : path}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: resolvedCanonical },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: resolvedCanonical,
      siteName: config.name,
      title: pageTitle ?? config.name,
      description,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: `${config.name} — ${config.tagline || config.industry}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle ?? config.name,
      description,
      images: [resolvedOgImage],
      creator: config.seo.twitterHandle,
      site: config.seo.twitterHandle,
    },
    other: {
      'theme-color': `hsl(${config.theme.colors.primary ?? '174 100% 26%'})`,
    },
  };
}

export function buildServiceMetadata(
  config: SiteConfig,
  service: { name: string; description: string; slug: string }
): Metadata {
  const city = config.contact.address?.city ?? '';
  const state = config.contact.address?.state ?? '';

  return buildMetadata({
    config,
    path: `/services/${service.slug}`,
    pageTitle: `${service.name}${city ? ` in ${city}${state ? `, ${state}` : ''}` : ''}`,
    pageDescription: `${service.description} Serving ${city || 'your area'}. Call ${config.contact.phone ?? 'us'} for a free quote.`,
  });
}

export function buildHomepageMetadata(config: SiteConfig): Metadata {
  const city = config.contact.address?.city ?? '';
  const state = config.contact.address?.state ?? '';

  return buildMetadata({
    config,
    path: '/',
    pageTitle: city ? `${config.name} in ${city}${state ? `, ${state}` : ''}` : config.name,
    pageDescription: config.tagline || config.seo.defaultDescription,
  });
}
