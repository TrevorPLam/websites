/**
 * Root layout component for the entire application.
 *
 * @module app/layout
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Root layout wrapping ALL pages. Defines HTML structure,
 * global metadata, fonts, navigation, and footer. Changes here affect
 * every page on the site.
 *
 * **RENDERING**: Server component (no 'use client'). Children rendered
 * inside Providers wrapper which IS a client component.
 *
 * **COMPONENT HIERARCHY**:
 * ```
 * <html>
 *   <head>  ← metadata export handles this
 *   <body>
 *     <SkipToContent />     ← a11y jump link
 *     <Navigation />         ← sticky header (client)
 *     <Providers>            ← ErrorBoundary + Breadcrumbs (client)
 *       <main>{children}</main>
 *     </Providers>
 *     <Footer />             ← site footer (server)
 *     <InstallPrompt />      ← PWA install (client)
 *   </body>
 * </html>
 * ```
 *
 * **METADATA**:
 * - Default title with template: "%s | Your Dedicated Marketer"
 * - Child pages override with their own metadata export
 * - OG image generated via /api/og route
 * - Structured data: Organization + WebSite schemas in <head>
 *
 * **FONTS** (Google Fonts via next/font):
 * - Inter: --font-inter (body text, sans-serif default)
 * - IBM Plex Sans: --font-plex (headings, .font-authority class)
 *
 * **AI ITERATION HINTS**:
 * - Adding global script? Add to <head> section
 * - GA4 script is injected after consent when NEXT_PUBLIC_ANALYTICS_ID is set
 * - Changing fonts? Update font imports and CSS variables
 * - Changing nav links? Edit Navigation.tsx navLinks array
 * - Adding global provider? Wrap in Providers component
 *
 * **PWA CONFIG**:
 * - manifest.json linked in metadata
 * - Apple touch icons in metadata
 * - Theme color: #0ea5e9
 * - InstallPrompt handles A2HS flow
 *
 * **SEARCH**: getSearchIndex() called at layout level,
 * passed to Navigation for SearchDialog.
 *
 * **KNOWN ISSUES**:
 * - [ ] No skip link target (#main-content) on some pages
 * - [ ] Structured data URLs hardcoded (should use env)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Defines the HTML document structure
 * - Provides global metadata for SEO
 * - Wraps all pages with Navigation, Footer, and Providers
 * - Configures fonts, PWA settings, and structured data
 *
 * **Component Hierarchy:**
 * ```
 * <html>
 *   <head>  (PWA meta, structured data)
 *   <body>
 *     <SkipToContent />     (accessibility)
 *     <Navigation />         (sticky header)
 *     <Providers>            (error boundary, breadcrumbs)
 *       <main>{children}</main>
 *     </Providers>
 *     <Footer />
 *     <InstallPrompt />     (PWA install)
 *   </body>
 * </html>
 * ```
 *
 * **SEO Configuration:**
 * - Default title with template for child pages
 * - OpenGraph and Twitter card metadata
 * - Organization and WebSite structured data
 * - Robots directives for search engines
 *
 * **Fonts:**
 * - Inter: Primary sans-serif (body text)
 * - IBM Plex Sans: Authority font (headings, emphasis)
 *
 * **PWA:**
 * - Manifest linked for installability
 * - Apple touch icons configured
 * - Theme color set
 *
 * **Dynamic Imports:**
 * - Providers: Client-side only (ErrorBoundary needs browser)
 * - InstallPrompt: Client-side only (PWA API)
 *
 * @see app/AGENTS.md for page conventions
 * @see tailwind.config.ts for theme customization
 */

import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { IBM_Plex_Sans, Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SkipToContent from '@/components/SkipToContent'
import AnalyticsConsentBanner from '@/components/AnalyticsConsentBanner'
import Providers from '@/app/providers'
import InstallPrompt from '@/components/InstallPrompt'
import { createCspNonce, CSP_NONCE_HEADER } from '@/lib/csp'
import { getPublicBaseUrl, validatedPublicEnv } from '@/lib/env.public'
import { logError, logWarn } from '@/lib/logger'
import { getSearchIndex } from '@/lib/search'

// Font configuration with CSS variables
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const siteUrl = getPublicBaseUrl()
const analyticsId = validatedPublicEnv.NEXT_PUBLIC_ANALYTICS_ID
const ogImageUrl = new URL('/api/og?title=Your%20Dedicated%20Marketer', siteUrl).toString()
const NONCE_ERROR_FALLBACK = 'fallback-nonce'

function resolveCspNonce(requestHeaders: Headers): string {
  const headerNonce = requestHeaders.get(CSP_NONCE_HEADER)

  if (headerNonce) {
    return headerNonce
  }

  // We prefer keeping the app online over hard-failing when middleware misses the header.
  logWarn('CSP nonce missing from request headers; using fallback nonce.', {
    header: CSP_NONCE_HEADER,
  })

  try {
    return createCspNonce()
  } catch (error) {
    // If crypto is unavailable, still return a nonce so the layout can render.
    logError('Failed to create CSP nonce fallback; using static nonce.', error, {
      header: CSP_NONCE_HEADER,
    })
    return NONCE_ERROR_FALLBACK
  }
}

/**
 * Global metadata applied to all pages.
 * Child pages can override with their own metadata export.
 * 
 * Title template: "%s | Your Dedicated Marketer"
 * - Child page title replaces %s
 * - Example: "SEO Services | Your Dedicated Marketer"
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Your Dedicated Marketer | Digital Marketing Services That Drive Results',
    template: '%s | Your Dedicated Marketer',
  },
  description: 'Expert digital marketing services for businesses that want to grow. We specialize in SEO, content marketing, social media, and email marketing that delivers real ROI.',
  keywords: ['digital marketing', 'SEO services', 'content marketing', 'social media marketing', 'email marketing', 'marketing agency'],
  authors: [{ name: 'Your Dedicated Marketer' }],
  creator: 'Your Dedicated Marketer',
  publisher: 'Your Dedicated Marketer',
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
    siteName: 'Your Dedicated Marketer',
    title: 'Your Dedicated Marketer | Digital Marketing Services That Drive Results',
    description:
      'Expert digital marketing services for businesses that want to grow. We specialize in SEO, content marketing, social media, and email marketing that delivers real ROI.',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Your Dedicated Marketer brand preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Dedicated Marketer | Digital Marketing Services That Drive Results',
    description:
      'Expert digital marketing services for businesses that want to grow. SEO, content, social media, and email marketing that delivers ROI.',
    images: [ogImageUrl],
    creator: '@yourdedicatedmarketer',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchItems = getSearchIndex()
  const requestHeaders = await headers()
  const cspNonce = resolveCspNonce(requestHeaders)

  return (
    <html lang="en" className={`${inter.variable} ${plexSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YDM" />
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
              name: 'Your Dedicated Marketer',
              description: 'Expert digital marketing services for businesses that want to grow.',
              url: siteUrl,
              logo: new URL('/logo.png', siteUrl).toString(),
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'contact@yourdedicatedmarketer.com',
              },
              sameAs: [
                'https://www.facebook.com/yourdedicatedmarketer',
                'https://www.twitter.com/yourdedicatedmarketer',
                'https://www.linkedin.com/company/yourdedicatedmarketer',
                'https://www.instagram.com/yourdedicatedmarketer',
              ],
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '127',
              },
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
              name: 'Your Dedicated Marketer',
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
      <body className="font-sans bg-off-white text-charcoal">
        <SkipToContent />
        <Navigation searchItems={searchItems} />
        <Providers>
          <main id="main-content" tabIndex={-1} className="focus-visible:outline-none">
            {children}
          </main>
        </Providers>
        <Footer />
        <InstallPrompt />
        <AnalyticsConsentBanner analyticsId={analyticsId} nonce={cspNonce} />
      </body>
    </html>
  )
}
