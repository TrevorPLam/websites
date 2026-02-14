// File: components/ValueProps.tsx  [TRACE:FILE=components.valueProps]
// Purpose: Value propositions component showcasing key business differentiators with icons
//          and detailed descriptions. Presents expert stylists, premium products,
//          and relaxing atmosphere to build customer trust and conversion.
//
// Exports / Entry: ValueProps component (default export)
// Used by: Homepage (app/page.tsx) as part of above-fold content
//
// Invariants:
// - Must render exactly three value propositions for consistent layout
// - Icons must be meaningful and relevant to each proposition
// - Content must be concise yet compelling for conversion
// - Component must be responsive across all device sizes
// - Descriptions support rich content (lists, formatting)
//
// Status: @public
// Features:
// - [FEAT:MARKETING] Value proposition showcase
// - [FEAT:UX] Icon-enhanced content presentation
// - [FEAT:RESPONSIVE] Mobile-friendly layout
// - [FEAT:CONVERSION] Trust-building content for conversion

// [Task 8.2.7] React.memo removed — has no effect on Server Components
import React from 'react';
import { Scissors, Heart, Sparkles } from 'lucide-react';
import { Container, Section, Card } from '@repo/ui';

// [TRACE:CONST=components.valueProps.content]
// [FEAT:MARKETING] [FEAT:UX]
// NOTE: Value propositions - defines key business differentiators with compelling descriptions and relevant icons.
const valueProps = [
  {
    icon: Scissors,
    title: 'Expert Stylists',
    description: (
      <>
        <p>Our team consists of highly trained professionals who are passionate about hair.</p>
        <p>We provide:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Precision cutting techniques</li>
          <li>Master colorists</li>
          <li>Continuous education on latest trends</li>
          <li>Personalized consultations</li>
        </ul>
        <p>We listen to your needs to deliver the look you want.</p>
      </>
    ),
  },
  {
    icon: Sparkles,
    title: 'Premium Products',
    description: (
      <>
        <p>
          We believe that great hair starts with great health. That’s why we use only the best
          products.
        </p>
        <p>Our selection includes:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Sulfate-free shampoos and conditioners</li>
          <li>Organic and eco-friendly options</li>
          <li>Professional-grade styling tools</li>
          <li>Treatments for all hair types</li>
        </ul>
        <p>Your hair deserves the best care possible.</p>
      </>
    ),
  },
  {
    icon: Heart,
    title: 'Relaxing Atmosphere',
    description: (
      <>
        <p>Your salon visit should be a break from your busy day.</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Comfortable, modern seating</li>
          <li>Complimentary beverages</li>
          <li>Relaxing music and ambiance</li>
          <li>Friendly and welcoming staff</li>
        </ul>
        <p>Sit back, relax, and let us pamper you.</p>
        <p>Leave feeling refreshed and confident.</p>
      </>
    ),
  },
];

function ValueProps() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop) => {
            const Icon = prop.icon;
            return (
              <Card key={prop.title} variant="default">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{prop.title}</h3>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  {prop.description}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default ValueProps;
