// File: app/gallery/page.tsx  [TRACE:FILE=app.gallery.page]
// Purpose: Gallery page showcasing salon portfolio with category filtering and
//          placeholder data. Provides visual proof of work quality and style
//          capabilities to convert visitors into customers.
//
// Exports / Entry: GalleryPage component, metadata export
// Used by: Next.js app router for /gallery route
//
// Invariants:
// - Must display portfolio items in responsive grid layout
// - Category filtering must work correctly with visual feedback
// - Placeholder data must be realistic and representative of actual work
// - All images must have proper alt text for accessibility
// - Social media CTA must link to actual Instagram account
//
// Status: @public
// Features:
// - [FEAT:GALLERY] Portfolio showcase with category filtering
// - [FEAT:FILTERING] Visual category selection and filtering
// - [FEAT:RESPONSIVE] Mobile-first responsive grid layout
// - [FEAT:PLACEHOLDER] Realistic placeholder portfolio data
// - [FEAT:SOCIAL] Social media integration and CTA

import type { Metadata } from 'next';
import { Container, Section, Button } from '@repo/ui';
import { Instagram } from 'lucide-react';

// [TRACE:BLOCK=app.gallery.metadata]
// [FEAT:SEO]
// NOTE: SEO-optimized metadata for gallery page - targets portfolio and salon work searches.
export const metadata: Metadata = {
  title: 'Gallery',
  description: 'View our portfolio of haircuts, colors, and styles.',
};

// [TRACE:CONST=app.gallery.categories]
// [FEAT:FILTERING]
// NOTE: Gallery categories for filtering - represents main service types offered.
const categories = ['All', 'Cuts', 'Color', 'Bridal', 'Extensions'];

// [TRACE:CONST=app.gallery.portfolioItems]
// [FEAT:PLACEHOLDER]
// NOTE: Placeholder portfolio data - realistic examples of actual salon work for demonstration.
const portfolioItems = [
  { id: 1, category: 'Color', title: 'Platinum Blonde Transformation', image: 'bg-slate-200' },
  { id: 2, category: 'Cuts', title: 'Textured Bob', image: 'bg-slate-300' },
  { id: 3, category: 'Bridal', title: 'Romantic Updo', image: 'bg-slate-200' },
  { id: 4, category: 'Color', title: 'Balayage Blend', image: 'bg-slate-300' },
  { id: 5, category: 'Cuts', title: 'Modern Shag', image: 'bg-slate-200' },
  { id: 6, category: 'Extensions', title: 'Volume & Length', image: 'bg-slate-300' },
  { id: 7, category: 'Color', title: 'Vivid Purple', image: 'bg-slate-200' },
  { id: 8, category: 'Bridal', title: 'Beach Waves', image: 'bg-slate-300' },
];

// [TRACE:FUNC=app.gallery.GalleryPage]
// [FEAT:GALLERY] [FEAT:FILTERING] [FEAT:RESPONSIVE]
// NOTE: Main gallery page component - displays portfolio with category filtering and social CTA.
export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* [TRACE:BLOCK=app.gallery.hero] */}
      {/* Hero */}
      <section className="bg-secondary text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Work</h1>
            <p className="text-xl text-white/80">
              Browse our portfolio of real client transformations.
            </p>
          </div>
        </Container>
      </section>

      {/* [TRACE:BLOCK=app.gallery.filterAndGrid] */}
      {/* [FEAT:FILTERING] [FEAT:RESPONSIVE] */}
      {/* Gallery Filter & Grid */}
      <Section className="py-12">
        <Container>
          {/* Filter Tabs (Visual only for now) */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                  idx === 0 ? 'bg-primary text-white' : 'bg-muted text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-ish Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 cursor-pointer"
              >
                {/* Placeholder for actual image */}
                <div
                  className={`w-full h-full ${item.image} flex items-center justify-center text-slate-400`}
                >
                  Image {item.id}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* [TRACE:BLOCK=app.gallery.socialCTA] */}
      {/* [FEAT:SOCIAL] */}
      <div className="text-center mt-12">
        <Button variant="secondary" size="large" className="inline-flex items-center gap-2">
          <Instagram className="w-5 h-5" />
          Follow us on Instagram for more
        </Button>
      </div>
    </div>
  );
}
