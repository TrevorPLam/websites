// File: components/Hero.tsx  [TRACE:FILE=components.hero]
// Purpose: Hero section component providing the main landing page header with compelling
//          value proposition, call-to-action buttons, and visual branding. Optimized for
//          conversion and accessibility with responsive design.
//
// Exports / Entry: Hero component (default export)
// Used by: Homepage (app/page.tsx) as the primary above-fold content
//
// Invariants:
// - Must render immediately without dynamic imports for SEO and UX
// - Primary CTA must lead to booking/contact for conversion optimization
// - Secondary CTA must provide service information path
// - Hero image must be responsive and optimized for performance
// - All text must be accessible with proper contrast ratios
//
// Status: @public
// Features:
// - [FEAT:MARKETING] Conversion-focused hero section
// - [FEAT:UX] Responsive layout with mobile-first design
// - [FEAT:ACCESSIBILITY] Semantic HTML and ARIA-friendly structure
// - [FEAT:PERFORMANCE] Optimized image loading with priority flag

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Container } from '@repo/ui';

// [TRACE:FUNC=components.Hero]
// [FEAT:MARKETING] [FEAT:UX] [FEAT:ACCESSIBILITY] [FEAT:PERFORMANCE]
// NOTE: Primary conversion component - balances visual appeal with performance and accessibility.
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-off-white to-white py-20 md:py-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Professional hair care that makes you shine.
            </h1>
            <p className="text-lg md:text-xl text-slate-800 mb-8 leading-relaxed">
              Experience the perfect blend of style and service. Our expert stylists are dedicated
              to helping you look and feel your best with personalized hair care solutions.
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
            <p className="text-sm text-muted-foreground mt-4">
              Walk-ins welcome · Free consultations · Satisfaction guaranteed
            </p>
          </div>

          {/* Right Column - Hero Image/Illustration */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-secondary to-primary/20 rounded-2xl p-4 aspect-square flex items-center justify-center shadow-lg">
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
  );
}
