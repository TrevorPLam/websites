import type { Metadata } from 'next';
import { Palette } from 'lucide-react';
import ServiceDetailLayout from '@/features/services/components/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Coloring Services',
  description:
    'Professional hair coloring services including highlights, balayage, and full color. Transform your look with our master colorists.',
};

export default function ColoringPage() {
  return (
    <ServiceDetailLayout
      icon={Palette}
      title="Coloring Services"
      description="Full color, highlights, balayage, and corrections by master colorists. Whether you want a subtle change or a bold transformation, we have the expertise to achieve it safely."
      serviceSlug="coloring"
      included={[
        'Color consultation',
        'Custom color formulation',
        'Application by certified colorists',
        'Post-color treatment',
        'Blow-dry and style',
        'Maintenance advice',
      ]}
      process={[
        {
          title: 'Consultation',
          description: 'Assess hair health and discuss color goals and maintenance.',
        },
        {
          title: 'Application',
          description: 'Precise application of color using high-quality products.',
        },
        {
          title: 'Processing',
          description: 'Relax while the color develops to the perfect shade.',
        },
        {
          title: 'Rinse & Treat',
          description: 'Wash out color and apply treatments to seal in vibrancy.',
        },
      ]}
      whoItsFor={[
        'Covering gray hair',
        'Adding dimension with highlights',
        'Sun-kissed balayage looks',
        'Vibrant fashion colors',
        'Correcting past color mishaps',
        'Refreshing faded color',
      ]}
      pricing={[
        {
          tier: 'Root Touch-up',
          description: 'Maintenance for regrowth',
          href: '/pricing#roots',
        },
        {
          tier: 'Full Color',
          description: 'Single process roots to ends',
          href: '/pricing#color',
        },
        {
          tier: 'Balayage',
          description: 'Hand-painted highlights',
          href: '/pricing#balayage',
        },
      ]}
      faqs={[
        {
          question: 'How long does hair color last?',
          answer:
            'Permanent color lasts until it grows out, but may fade over time. Semi-permanent lasts 4-6 weeks. We recommend refreshing every 4-8 weeks.',
        },
        {
          question: 'Will coloring damage my hair?',
          answer:
            'We use premium products with bond-building technology to protect your hair during the coloring process.',
        },
        {
          question: 'What is Balayage?',
          answer:
            'Balayage is a freehand highlighting technique that creates a natural, graduated effect that is lower maintenance than traditional foils.',
        },
      ]}
    />
  );
}
