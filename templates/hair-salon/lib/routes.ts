// File: lib/routes.ts  [TRACE:FILE=lib.routes]
// Purpose: Single authoritative route registry for the hair-salon template. Consolidates
//          static page definitions used by sitemap, search index, and future config-driven
//          routing. Eliminates duplicate maintenance across sitemap.ts and search.ts.
//
// Exports / Entry: RouteEntry, getStaticRoutes, getSitemapEntries, getSearchEntries
// Used by: app/sitemap.ts, lib/search.ts, and future route consumers
//
// Invariants:
// - All static routes must exist as app directory page routes
// - path must be valid URL path (leading slash, no trailing slash except for '/')
// - changeFrequency and priority follow sitemap.org conventions
// - Search metadata (title, description, tags) must be present for searchable pages
//
// Status: @public
// Features:
// - [FEAT:NAVIGATION] Centralized route definition
// - [FEAT:SEO] Sitemap generation source
// - [FEAT:SEARCH] Search index source
// - [FEAT:CONFIGURATION] Foundation for config-driven routing (Task 3.x)
//
// Related: Task 0.25 — Create Unified Route Registry

import type { MetadataRoute } from 'next';

/** Sitemap change frequency per sitemaps.org. */
export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

/** Search index metadata for a route. */
export type RouteSearchMeta = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
};

/**
 * Canonical route definition. Single source of truth for static routes.
 * Used by sitemap generation and search index; extensible for config-driven routing.
 */
export type RouteEntry = {
  /** URL path (e.g. '/' or '/about'). No trailing slash except for '/'. */
  path: string;
  /** Sitemap change frequency hint for crawlers. */
  changeFrequency: ChangeFrequency;
  /** Sitemap priority 0.0–1.0. Homepage typically 1.0. */
  priority: number;
  /** Search index metadata. Omit for noindex or non-searchable pages. */
  search?: RouteSearchMeta;
};

/** Static route definitions. Add/remove here; sitemap and search stay in sync. */
const STATIC_ROUTES: RouteEntry[] = [
  {
    path: '/',
    changeFrequency: 'weekly',
    priority: 1.0,
    search: {
      id: 'page-home',
      title: 'Home',
      description: 'Overview of our hair salon services, pricing, and booking information.',
      tags: ['hair salon', 'services', 'styling'],
    },
  },
  {
    path: '/about',
    changeFrequency: 'monthly',
    priority: 0.8,
    search: {
      id: 'page-about',
      title: 'About',
      description: 'Learn about our stylists, mission, and hair care philosophy.',
      tags: ['team', 'mission'],
    },
  },
  {
    path: '/services',
    changeFrequency: 'monthly',
    priority: 0.9,
    search: {
      id: 'page-services',
      title: 'Services',
      description: 'Explore haircuts, coloring, styling, and hair treatment services.',
      tags: ['hair services', 'treatments', 'styling'],
    },
  },
  {
    path: '/services/haircuts',
    changeFrequency: 'monthly',
    priority: 0.8,
    search: {
      id: 'page-services-haircuts',
      title: 'Haircuts & Styling',
      description: 'Precision cuts and styling for women, men, and children.',
      tags: ['haircuts', 'styling'],
    },
  },
  {
    path: '/services/coloring',
    changeFrequency: 'monthly',
    priority: 0.8,
    search: {
      id: 'page-services-coloring',
      title: 'Coloring Services',
      description: 'Full color, highlights, balayage, and color corrections.',
      tags: ['coloring', 'highlights'],
    },
  },
  {
    path: '/services/treatments',
    changeFrequency: 'monthly',
    priority: 0.8,
    search: {
      id: 'page-services-treatments',
      title: 'Treatments',
      description: 'Deep conditioning, keratin, and scalp treatments.',
      tags: ['treatments', 'conditioning'],
    },
  },
  {
    path: '/services/special-occasions',
    changeFrequency: 'monthly',
    priority: 0.8,
    search: {
      id: 'page-services-special-occasions',
      title: 'Special Occasions',
      description: 'Bridal hair, updos, and styling for weddings and events.',
      tags: ['bridal', 'updos', 'special occasions'],
    },
  },
  {
    path: '/pricing',
    changeFrequency: 'monthly',
    priority: 0.9,
    search: {
      id: 'page-pricing',
      title: 'Pricing',
      description: 'Review hair salon service packages, pricing, and membership options.',
      tags: ['pricing', 'packages'],
    },
  },
  {
    path: '/book',
    changeFrequency: 'weekly',
    priority: 0.9,
    search: {
      id: 'page-book',
      title: 'Book',
      description: 'Request an appointment and share your preferred time.',
      tags: ['booking', 'appointment'],
    },
  },
  {
    path: '/gallery',
    changeFrequency: 'monthly',
    priority: 0.8,
    search: {
      id: 'page-gallery',
      title: 'Gallery',
      description: 'Browse before-and-after transformations from our stylists.',
      tags: ['gallery', 'before and after'],
    },
  },
  {
    path: '/team',
    changeFrequency: 'monthly',
    priority: 0.8,
    search: {
      id: 'page-team',
      title: 'Team',
      description: 'Meet stylists and learn about their specialties.',
      tags: ['team', 'stylists'],
    },
  },
  {
    path: '/contact',
    changeFrequency: 'monthly',
    priority: 0.9,
    search: {
      id: 'page-contact',
      title: 'Contact',
      description: 'Get in touch to schedule a free consultation.',
      tags: ['contact', 'consultation'],
    },
  },
  {
    path: '/privacy',
    changeFrequency: 'yearly',
    priority: 0.4,
    search: {
      id: 'page-privacy',
      title: 'Privacy Policy',
      description: 'Privacy policy and data handling practices.',
      tags: ['legal', 'privacy'],
    },
  },
  {
    path: '/terms',
    changeFrequency: 'yearly',
    priority: 0.4,
    search: {
      id: 'page-terms',
      title: 'Terms of Service',
      description: 'Terms and conditions of service.',
      tags: ['legal', 'terms'],
    },
  },
  {
    path: '/blog',
    changeFrequency: 'weekly',
    priority: 0.8,
    search: {
      id: 'page-blog',
      title: 'Blog',
      description: 'Hair care tips, trends, and styling advice from our experts.',
      tags: ['blog', 'insights'],
    },
  },
  {
    path: '/search',
    changeFrequency: 'weekly',
    priority: 0.5,
    search: {
      id: 'page-search',
      title: 'Search',
      description: 'Search blog posts, services, and hair care resources across site.',
      tags: ['search', 'resources'],
    },
  },
];

/**
 * Returns all static route entries. Use this for programmatic route iteration.
 */
export function getStaticRoutes(): RouteEntry[] {
  return STATIC_ROUTES;
}

/**
 * Converts route registry to sitemap entries. Use in app/sitemap.ts.
 */
export function getSitemapEntries(baseUrl: string): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((route) => ({
    url: `${baseUrl.replace(/\/$/, '')}${route.path === '/' ? '' : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

/**
 * Converts route registry to search index items (static pages only).
 * Blog posts are added separately by getSearchIndex.
 */
export function getSearchEntries(): Array<{
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'Page';
  tags?: string[];
}> {
  return STATIC_ROUTES.filter((r) => r.search).map((route) => ({
    id: route.search!.id,
    title: route.search!.title,
    description: route.search!.description,
    href: route.path === '/' ? '/' : route.path,
    type: 'Page' as const,
    tags: route.search!.tags,
  }));
}
