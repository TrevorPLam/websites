/**
 * Homepage hero section component.
 * 
 * **Purpose:**
 * Primary above-the-fold content on the homepage.
 * Introduces the brand value proposition with CTAs.
 * 
 * **Layout:**
 * - Two-column grid on desktop (text + image)
 * - Single column on mobile (text only, image hidden)
 * 
 * **CTAs:**
 * - Primary: "Schedule Free Consultation" → /contact
 * - Secondary: "View Services" → /services
 * 
 * **Image:**
 * - Location: /public/images/hero-growth.svg
 * - Priority loaded (LCP optimization)
 * - Hidden on mobile for faster load
 * 
 * **Styling:**
 * - Background: Gradient from off-white to white
 * - Text: charcoal (dark) headings, slate body
 * 
 * @component
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'

/**
 * Homepage hero section.
 * Renders the main value proposition and CTAs.
 */
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-off-white to-white py-20 md:py-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
              Growth-Focused Marketing for Small Businesses
            </h1>
            <p className="text-lg md:text-xl text-slate-800 mb-8 leading-relaxed">
              Strategic marketing services that drive real results - without the agency overhead
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button variant="primary" size="large">
                  Schedule Free Consultation
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="secondary" size="large">
                  View Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Hero Image/Illustration */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-charcoal to-teal/20 rounded-2xl p-4 aspect-square flex items-center justify-center shadow-lg">
              <Image
                src="/images/hero-growth.svg"
                alt="Stylized bar chart climbing upward to represent marketing growth"
                width={640}
                height={640}
                sizes="(min-width: 1280px) 592px, (min-width: 1024px) 50vw, 0px"
                priority
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
