/**
 * @file apps/web/src/pages/home/index.tsx
 * @summary Home page composition.
 * @description Composes hero banner, features grid, testimonials, and CTA sections.
 * @security No sensitive data exposure; public content only.
 * @adr none
 * @requirements DOMAIN-3-6
 */

'use client';

import { HeroBanner } from '@/widgets/hero-banner';
import { FeaturesGrid } from '@/widgets/features-grid';
import { TestimonialsCarousel } from '@/widgets/testimonial-carousel';
import { CtaSection } from '@/widgets/cta-section';

/**
 * Renders the home page with hero banner and feature sections.
 *
 * @returns JSX element representing the complete home page layout.
 */
export function HomePage() {
  return (
    <main>
      <HeroBanner
        headline="Marketing Websites That Convert"
        subheadline="Build beautiful, high-performing marketing sites that drive results for your business."
        ctaPrimary={{
          label: 'Get Started Free',
          href: '/pricing',
        }}
        ctaSecondary={{
          label: 'View Demo',
          href: '/dashboard',
        }}
        backgroundImage={{
          url: '/images/hero-bg.jpg',
          alt: 'Marketing website platform dashboard',
        }}
      />

      <FeaturesGrid />

      <TestimonialsCarousel />

      <CtaSection
        headline="Ready to Grow Your Business?"
        subheadline="Join thousands of businesses using our platform to create stunning marketing websites."
        cta={{
          label: 'Start Your Free Trial',
          href: '/register',
        }}
      />
    </main>
  );
}
