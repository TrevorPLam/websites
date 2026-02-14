// File: features/services/components/ServicesOverview.tsx  [TRACE:FILE=features.services.overview]
// Purpose: Services overview component displaying the main service categories with icons,
//          descriptions, and navigation links. Provides a grid layout for service discovery
//          and acts as the primary services entry point from the homepage.
//
// Exports / Entry: ServicesOverview component (default export)
// Used by: Homepage (app/page.tsx) and potentially other service-related pages
//
// Invariants:
// - Must display exactly 4 main service categories in responsive grid
// - Each service must have icon, title, description, and navigation link
// - Grid must be responsive (1 column mobile, 2 columns tablet, 4 columns desktop)
// - All service links must be valid routes within the services section
// - Icons must be consistent with service themes
//
// Status: @public
// Features:
// - [FEAT:SERVICES] Service category display and navigation
// - [FEAT:UX] Responsive grid layout with hover effects
// - [FEAT:NAVIGATION] Service discovery and routing
// - [FEAT:DESIGN] Consistent iconography and visual hierarchy

import React from 'react';
import Link from 'next/link';
import { Scissors, Palette, Sparkles, Calendar } from 'lucide-react';
import { Container, Section, Card } from '@repo/ui';

// [TRACE:BLOCK=features.services.data]
// [FEAT:SERVICES] [FEAT:NAVIGATION]
// NOTE: Core service categories - maintain consistency with actual available service routes.
const services = [
  {
    icon: Scissors,
    title: 'Haircuts & Styling',
    description: 'Precision cuts and styling for women, men, and children to suit your lifestyle.',
    href: '/services/haircuts',
  },
  {
    icon: Palette,
    title: 'Coloring Services',
    description: 'Full color, highlights, balayage, and corrections by master colorists.',
    href: '/services/coloring',
  },
  {
    icon: Sparkles,
    title: 'Treatments',
    description: 'Deep conditioning, keratin, and scalp treatments for healthy, shiny hair.',
    href: '/services/treatments',
  },
  {
    icon: Calendar,
    title: 'Special Occasions',
    description: 'Bridal hair, updos, and styling for weddings, proms, and special events.',
    href: '/services/special-occasions',
  },
];

// [TRACE:FUNC=features.services.ServicesOverview]
// [FEAT:SERVICES] [FEAT:UX] [FEAT:NAVIGATION] [FEAT:DESIGN]
// NOTE: Service discovery component - balances visual appeal with navigation clarity.
export default function ServicesOverview() {
  return (
    <Section className="bg-muted">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From classic cuts to modern makeovers, we offer a full range of hair services tailored
            to you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} variant="service">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <Link
                  href={service.href}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center"
                >
                  Learn More →
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
