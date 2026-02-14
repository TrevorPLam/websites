// File: app/layout.tsx  [TRACE:FILE=app.rootLayout]
// Purpose: Root layout component providing global HTML structure, metadata, CSP security,
//          and core UI providers for the hair salon website. Handles font loading,
//          SEO optimization, and analytics consent management.
//
// Exports / Entry: RootLayout component, metadata export
// Used by: Next.js as the root layout for all pages in the application
//
// Invariants:
// - Must resolve CSP nonce before any script execution for security
// - Fonts must be loaded with display: swap to prevent layout shift
// - Analytics consent banner must render after all other content for GDPR compliance
// - Search index must be available for Navigation component
//
// Status: @internal
// Features:
// - [FEAT:SEO] Global metadata and OpenGraph optimization
// - [FEAT:SECURITY] Content Security Policy with nonce generation
// - [FEAT:ANALYTICS] Consent management and GDPR compliance
// - [FEAT:SEARCH] Search index integration for navigation
// - [FEAT:ACCESSIBILITY] Skip links and semantic HTML structure

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { IBM_Plex_Sans, Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';
import AnalyticsConsentBanner from '@/components/AnalyticsConsentBanner';
import Providers from '@/app/providers';
import InstallPrompt from '@/components/InstallPrompt';
import { createCspNonce, CSP_NONCE_HEADER, logError, logWarn } from '@repo/infra';
import { getPublicBaseUrl, validatedPublicEnv } from '@/lib/env.public';
import { getSearchIndex } from '@/lib/search';
import siteConfig from '@/site.config';

// Font configuration with CSS variables
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const siteUrl = getPublicBaseUrl();
const analyticsId = validatedPublicEnv.NEXT_PUBLIC_ANALYTICS_ID;
const ogImageUrl = new URL(
  `/api/og?title=${encodeURIComponent(siteConfig.name)}`,
  siteUrl
).toString();
const NONCE_ERROR_FALLBACK = 'fallback-nonce';

// [TRACE:FUNC=app.resolveCspNonce]
// [FEAT:SECURITY]
// NOTE: Critical security function - provides fallback nonce generation when middleware
//       fails to set the CSP header. Prefers keeping the app online over hard failures.
function resolveCspNonce(requestHeaders: Headers): string {
  const headerNonce = requestHeaders.get(CSP_NONCE_HEADER);

  if (headerNonce) {
    return headerNonce;
  }

  // We prefer keeping the app online over hard-failing when middleware misses the header.
  logWarn('CSP nonce missing from request headers; using fallback nonce.', {
    header: CSP_NONCE_HEADER,
  });

  try {
    return createCspNonce();
  } catch (error) {
    // If crypto is unavailable, still return a nonce so the layout can render.
    logError('Failed to create CSP nonce fallback; using static nonce.', error, {
      header: CSP_NONCE_HEADER,
    });
    return NONCE_ERROR_FALLBACK;
  }
}

/**
 * Global metadata applied to all pages.
 * Child pages can override with their own metadata export.
 *
 * Title template: "%s | Hair Salon Template"
 * - Child page title replaces %s
 * - Example: "Services | Hair Salon Template"
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [
    'hair salon',
    'hair stylist',
    'beauty salon',
    'haircut',
    'hair styling',
    'salon website',
    'booking system',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.seo.defaultDescription,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} brand preview image`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.seo.defaultDescription,
    images: [ogImageUrl],
    creator: siteConfig.seo.twitterHandle,
  },
};

// [TRACE:FUNC=app.RootLayout]
// [FEAT:SEO] [FEAT:SECURITY] [FEAT:ANALYTICS] [FEAT:SEARCH] [FEAT:ACCESSIBILITY]
// NOTE: Main layout component - orchestrates all global providers and structure.
//       Critical for app initialization and security context.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = await getSearchIndex();
  const requestHeaders = await headers();
  const cspNonce = resolveCspNonce(requestHeaders);

  return (
    <html lang="en" className={`${inter.variable} ${plexSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.id.toUpperCase()} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />

        <script
          type="application/ld+json"
          nonce={cspNonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteConfig.name,
              description: siteConfig.seo.defaultDescription,
              url: siteUrl,
              logo: new URL('/logo.png', siteUrl).toString(),
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: siteConfig.contact.email,
              },
              sameAs: siteConfig.socialLinks.map((s) => s.url),
              ...(siteConfig.contact.address && {
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: siteConfig.contact.address.country,
                },
              }),
            }),
          }}
        />
        <script
          type="application/ld+json"
          nonce={cspNonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteConfig.name,
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans bg-muted text-foreground">
        <SkipToContent />
        <Navigation searchItems={searchItems} />
        <Providers>
          <main id="main-content" tabIndex={-1} className="focus-visible:outline-none">
            {children}
          </main>
        </Providers>
        <Footer />
        <InstallPrompt />
        {/* NOTE(consent): Banner must keep analytics default-off until user opts in. */}
        <AnalyticsConsentBanner analyticsId={analyticsId} nonce={cspNonce} />
      </body>
    </html>
  );
}
