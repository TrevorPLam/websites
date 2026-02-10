/**
 * @file apps/web/app/gallery/page.tsx
 * @role runtime
 * @summary Gallery page with category filters and portfolio grid.
 *
 * @entrypoints
 * - Route: /gallery
 *
 * @exports
 * - metadata
 * - default GalleryPage
 *
 * @depends_on
 * - External: next (Metadata)
 * - External: lucide-react
 * - Internal: @repo/ui (Container, Section, Button)
 *
 * @used_by
 * - Next.js app router
 *
 * @runtime
 * - environment: server
 * - side_effects: none
 *
 * @data_flow
 * - inputs: static categories and portfolio items
 * - outputs: gallery UI
 *
 * @invariants
 * - Placeholder data should be replaced with real assets
 *
 * @issues
 * - [severity:low] Gallery uses placeholder data and images.
 *
 * @verification
 * - Visit /gallery and verify grid and filter buttons render.
 *
 * @status
 * - confidence: medium
 * - last_audited: 2026-02-09
 */

import type { Metadata } from 'next';
import { Container, Section, Button } from '@repo/ui';
import { Instagram } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gallery | Hair Salon Template',
  description: 'View our portfolio of haircuts, colors, and styles.',
};

// Placeholder images logic
const categories = ['All', 'Cuts', 'Color', 'Bridal', 'Extensions'];

const portfolioItems = [
  { id: 1, category: 'Color', title: 'Platinum Blonde Transformation', image: 'bg-slate-200' },
  { id: 2, category: 'Cuts', title: 'Textured Bob', image: 'bg-slate-300' },
  { id: 3, category: 'Bridal', title: 'Romantic Updo', image: 'bg-slate-200' },
  { id: 4, category: 'Color', title: 'Balayage Blend', image: 'bg-slate-300' },
  { id: 5, category: 'Cuts', title: 'Modern Shag', image: 'bg-slate-200' },
  { id: 6, category: 'Extensions', title: 'Volume & Length', image: 'bg-slate-300' },
  { id: 7, category: 'Color', title: 'Vivid Purple', image: 'bg-slate-200' },
  { id: 8, category: 'Bridal', title: 'Boho Waves', image: 'bg-slate-300' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-charcoal text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Work</h1>
            <p className="text-xl text-white/80">
              Browse our portfolio of real client transformations.
            </p>
          </div>
        </Container>
      </section>

      {/* Gallery Filter & Grid */}
      <Section className="py-12">
        <Container>
          {/* Filter Tabs (Visual only for now) */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                  idx === 0
                    ? 'bg-teal text-white'
                    : 'bg-off-white text-slate-600 hover:bg-slate-200'
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
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-teal text-xs font-bold uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="large" className="inline-flex items-center gap-2">
              <Instagram className="w-5 h-5" />
              Follow us on Instagram for more
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
