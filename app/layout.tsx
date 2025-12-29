import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Your Dedicated Marketer | Growth-Focused Marketing for Small Businesses',
  description: 'Strategic marketing services that drive real results - without the agency overhead. Data-driven strategies tailored to your business goals.',
  keywords: ['marketing services', 'digital marketing', 'SEO', 'content marketing', 'social media marketing', 'email marketing'],
  authors: [{ name: 'Your Dedicated Marketer' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Your Dedicated Marketer',
    title: 'Your Dedicated Marketer | Growth-Focused Marketing for Small Businesses',
    description: 'Strategic marketing services that drive real results - without the agency overhead.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Dedicated Marketer | Growth-Focused Marketing for Small Businesses',
    description: 'Strategic marketing services that drive real results - without the agency overhead.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
