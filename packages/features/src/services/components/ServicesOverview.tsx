// File: packages/features/src/services/components/ServicesOverview.tsx  [TRACE:FILE=packages.features.services.overview]
// Purpose: Services overview component displaying service categories in a responsive grid.
//          Configurable for cross-industry use (salon, restaurant, law-firm, etc.).
//
// Exports / Entry: ServicesOverview (default export)
// Used by: Homepage, services landing page, marketing sections
//
// Invariants:
// - Must render provided services array; no hardcoded content
// - Grid responsive: 1 col mobile, 2 cols tablet+
// - Semantic HTML: Section, headings, links with proper hierarchy
// - Accessible: link text, focus states, keyboard navigation
//
// Status: @public
// Features:
// - [FEAT:SERVICES] Service category display and navigation
// - [FEAT:UX] Responsive grid with hover effects
// - [FEAT:NAVIGATION] Service discovery
// - [FEAT:CONFIGURATION] Props-driven, industry-agnostic

import React from 'react';
import Link from 'next/link';
import { Container, Section, Card } from '@repo/ui';
import type { ServicesOverviewProps } from '../types';

// [TRACE:FUNC=packages.features.services.ServicesOverview]
// [FEAT:SERVICES] [FEAT:UX] [FEAT:NAVIGATION]
export default function ServicesOverview({
  services,
  heading = 'Our Services',
  subheading,
}: ServicesOverviewProps) {
  return (
    <Section className="bg-muted">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subheading}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} variant="service">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" aria-hidden />
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
