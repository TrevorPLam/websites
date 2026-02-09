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
 * - Primary: "Book Appointment" → /contact
 * - Secondary: "View Services" → /services
 *
 * **Image:**
 * - Location: /public/images/hero-salon.svg
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
import { Button, Container } from '@repo/ui'

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
              Professional hair care that makes you shine.
            </h1>
            <p className="text-lg md:text-xl text-slate-800 mb-8 leading-relaxed">
              Experience the perfect blend of style and service. Our expert stylists are dedicated to helping you look and feel your best with personalized hair care solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button variant="primary" size="large">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="secondary" size="large">
                  View Services
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate mt-4">
              Walk-ins welcome · Free consultations · Satisfaction guaranteed
            </p>
          </div>

          {/* Right Column - Hero Image/Illustration */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-charcoal to-teal/20 rounded-2xl p-4 aspect-square flex items-center justify-center shadow-lg">
              <Image
                src="/images/hero-salon.svg"
                alt="Stylized illustration of hair salon services"
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
