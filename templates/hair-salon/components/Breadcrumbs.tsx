// File: components/Breadcrumbs.tsx  [TRACE:FILE=components.breadcrumbs]
// Purpose: Breadcrumb navigation component providing hierarchical navigation context
//          and structured data for SEO. Generates breadcrumb trail from current
//          pathname with proper accessibility and schema.org markup.
//
// Exports / Entry: Breadcrumbs component (default export)
// Used by: Layout component and pages requiring navigation context
//
// Invariants:
// - Must generate correct hrefs for all breadcrumb levels
// - Must handle root path (/) gracefully without showing breadcrumbs
// - Must include structured data for SEO and search engines
// - Must be fully accessible with proper ARIA labels
// - Current page must be marked as aria-current="page"
//
// Status: @public
// Features:
// - [FEAT:NAVIGATION] Hierarchical breadcrumb navigation
// - [FEAT:SEO] Structured data for search engines
// - [FEAT:ACCESSIBILITY] Screen reader and keyboard navigation support
// - [FEAT:RESPONSIVE] Mobile-friendly breadcrumb display
// - [FEAT:LOCALIZATION] Title case conversion for readable labels

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

import { getPublicBaseUrl } from '@/lib/env.public';

// [TRACE:FUNC=components.breadcrumbs.titleize]
// [FEAT:LOCALIZATION]
// NOTE: Converts URL segments to readable title case format for breadcrumb labels.
function titleize(segment: string) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// [TRACE:FUNC=components.breadcrumbs.Breadcrumbs]
// [FEAT:NAVIGATION] [FEAT:SEO] [FEAT:ACCESSIBILITY]
// NOTE: Main breadcrumbs component - generates navigation trail with structured data and accessibility.
export default function Breadcrumbs() {
  const pathname = usePathname();

  // [TRACE:BLOCK=components.breadcrumbs.crumbsGeneration]
  // [FEAT:NAVIGATION]
  // NOTE: Generates breadcrumb items from current pathname with proper href calculation.
  const crumbs = useMemo(() => {
    if (!pathname || pathname === '/') return [];

    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      return { label: titleize(segment), href };
    });
  }, [pathname]);

  if (!crumbs.length) return null;

  // [TRACE:BLOCK=components.breadcrumbs.structuredData]
  // [FEAT:SEO]
  // NOTE: Creates structured data for search engines following schema.org BreadcrumbList format.
  const baseUrl = getPublicBaseUrl().replace(/\/$/, '');
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.label,
        item: `${baseUrl}${crumb.href}`,
      })),
    ],
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white/90 backdrop-blur sticky top-16 z-30 border-b border-charcoal/5"
    >
      <ol className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:text-primary/80"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <span aria-hidden="true" className="text-foreground/60">
              /
            </span>
            <li>
              {index === crumbs.length - 1 ? (
                <span className="text-foreground font-semibold" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-primary font-semibold hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </nav>
  );
}
