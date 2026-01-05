import type { Metadata } from 'next'
import { IBM_Plex_Sans, Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SkipToContent from '@/components/SkipToContent'
import { getSearchIndex } from '@/lib/search'

const Providers = dynamic(() => import('@/app/providers'), { ssr: false })
const InstallPrompt = dynamic(() => import('@/components/InstallPrompt'), { ssr: false })

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdedicatedmarketer.com'),
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
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdedicatedmarketer.com',
    siteName: 'Your Dedicated Marketer',
    title: 'Your Dedicated Marketer | Digital Marketing Services That Drive Results',
    description:
      'Expert digital marketing services for businesses that want to grow. We specialize in SEO, content marketing, social media, and email marketing that delivers real ROI.',
    images: [
      {
        url: '/api/og?title=Your%20Dedicated%20Marketer',
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
    images: ['/api/og?title=Your%20Dedicated%20Marketer'],
    creator: '@yourdedicatedmarketer',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchItems = getSearchIndex()

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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Your Dedicated Marketer',
              description: 'Expert digital marketing services for businesses that want to grow.',
              url: 'https://yourdedicatedmarketer.com',
              logo: 'https://yourdedicatedmarketer.com/logo.png',
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Your Dedicated Marketer',
              url: 'https://yourdedicatedmarketer.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://yourdedicatedmarketer.com/search?q={search_term_string}',
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
      </body>
    </html>
  )
}
