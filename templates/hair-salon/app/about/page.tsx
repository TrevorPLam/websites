// File: app/about/page.tsx  [TRACE:FILE=app.about.page]
// Purpose: About page component showcasing salon story, values, statistics, and conversion CTAs.
//          Provides brand narrative and trust signals to convert visitors into customers through
//          compelling storytelling and social proof.
//
// Exports / Entry: AboutPage component (default export), metadata export
// Used by: Next.js app router for /about route
//
// Invariants:
// - Must render responsive design across all device sizes
// - All CTAs must navigate to valid routes within the application
// - Statistics must be credible and regularly updated
// - Images and icons must have proper alt text for accessibility
// - Content must reflect current salon branding and messaging
//
// Status: @public
// Features:
// - [FEAT:SEO] Optimized metadata for search engines
// - [FEAT:BRANDING] Consistent salon story and values presentation
// - [FEAT:CONVERSION] Strategic CTAs for booking and services
// - [FEAT:RESPONSIVE] Mobile-first responsive design
// - [FEAT:ACCESSIBILITY] Semantic HTML and ARIA compliance

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Scissors, Heart, Sparkles } from 'lucide-react';
import { Container } from '@repo/ui';

// [TRACE:BLOCK=app.about.metadata]
// [FEAT:SEO]
// NOTE: SEO-optimized metadata for search engine indexing and social sharing.
export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet our team of expert stylists and learn about our commitment to healthy, beautiful hair.',
};

// [TRACE:FUNC=app.about.AboutPage]
// [FEAT:BRANDING] [FEAT:CONVERSION] [FEAT:RESPONSIVE]
// NOTE: Main about page component - renders brand story, values, stats, and conversion CTAs.
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* [TRACE:BLOCK=app.about.hero] */}
      {/* Hero Section - Main value proposition */}
      <section className="bg-gradient-to-br from-secondary via-slate-800 to-primary/20 text-white py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">More Than Just a Haircut</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We are a team of passionate stylists dedicated to creating a relaxing experience and
              delivering results that make you shine.
            </p>
          </div>
        </Container>
      </section>

      {/* [TRACE:BLOCK=app.about.story] */}
      {/* Our Story Section - Founding narrative */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p>
                Our salon was founded with a simple mission: to provide high-quality hair care in a
                welcoming and unpretentious environment. We believe that getting your hair done
                should be the best part of your week.
              </p>
              <p>
                We started as a small team of two stylists and have grown into a family of creative
                professionals who share a love for their craft. We constantly educate ourselves on
                the latest trends and techniques to ensure we can bring your vision to life.
              </p>
              <p>
                Whether you&apos;re looking for a subtle refresh or a complete transformation, we
                listen, we care, and we deliver.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* [TRACE:BLOCK=app.about.values] */}
      {/* Values Section - Key differentiators */}
      <section className="py-20 bg-muted">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Value 1: Expertise */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Expertise</h3>
              <p className="text-muted-foreground">
                Our stylists are master-certified and participate in ongoing education to stay ahead
                of the curve.
              </p>
            </div>

            {/* Value 2: Care */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Care</h3>
              <p className="text-muted-foreground">
                We prioritize the health of your hair, using only the finest products that nourish
                and protect.
              </p>
            </div>

            {/* Value 3: Atmosphere */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Atmosphere</h3>
              <p className="text-muted-foreground">
                Relax in our modern, clean, and comfortable space. Enjoy a beverage and let us
                pamper you.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* [TRACE:BLOCK=app.about.stats] */}
      {/* Stats Section - Social proof */}
      <section className="py-20 bg-gradient-to-br from-secondary via-slate-800 to-primary/20 text-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">By The Numbers</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
                <div className="text-white/90">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">5k+</div>
                <div className="text-white/90">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-white/90">Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-white/90">Awards Won</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* [TRACE:BLOCK=app.about.cta] */}
      {/* [FEAT:CONVERSION] */}
      {/* CTA Section - Final conversion */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book your appointment today and discover your best hair.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Book Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-foreground font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
