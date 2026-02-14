import type { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import ServiceDetailLayout from '@/features/services/components/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Special Occasions',
  description:
    'Elegant hairstyles for weddings, proms, and special events. Look your absolute best for your big day.',
};

export default function SpecialOccasionsPage() {
  return (
    <ServiceDetailLayout
      icon={Calendar}
      title="Special Occasions"
      description="Bridal hair, updos, and styling for weddings, proms, and special events. We create stunning looks that stay perfect all day and night."
      serviceSlug="special-occasions"
      included={[
        'Style consultation',
        'Trial run (recommended for brides)',
        'Secure updos and pinning',
        'Long-lasting curls and waves',
        'Veil and accessory placement',
        'On-site services available',
      ]}
      process={[
        {
          title: 'Consultation',
          description: 'Share your inspiration and dress details to plan the perfect look.',
        },
        {
          title: 'Trial',
          description:
            "Test run the style before the big day to ensure it's exactly what you want.",
        },
        {
          title: 'Prep',
          description: 'Hair is prepped with texturizing products for hold and volume.',
        },
        {
          title: 'The Big Day',
          description: 'Relax while we create your dream hairstyle.',
        },
      ]}
      whoItsFor={[
        'Brides and bridal parties',
        'Prom and homecoming attendees',
        'Gala and formal event guests',
        'Photoshoots',
        'Graduations',
        'Anyone wanting to look extra special',
      ]}
      pricing={[
        {
          tier: 'Updo',
          description: 'Formal styling',
          href: '/pricing#updo',
        },
        {
          tier: 'Bridal',
          description: 'Includes trial & day-of',
          href: '/pricing#bridal',
        },
        {
          tier: 'Blowout',
          description: 'Voluminous style',
          href: '/pricing#blowout',
        },
      ]}
      faqs={[
        {
          question: 'Should I wash my hair before an updo?',
          answer:
            'Usually, "day-old" hair holds style better. We recommend washing it the night before and not applying heavy products.',
        },
        {
          question: 'Do you travel to wedding venues?',
          answer: 'Yes, we offer on-site services for bridal parties. Travel fees may apply.',
        },
        {
          question: 'How long does bridal hair take?',
          answer:
            'We typically allocate 60-90 minutes for the bride and 45 minutes for bridesmaids.',
        },
      ]}
    />
  );
}
