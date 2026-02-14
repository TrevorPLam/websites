import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import ServiceDetailLayout from '@/features/services/components/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Hair Treatments',
  description:
    'Revitalize your hair with our deep conditioning, keratin, and scalp treatments. Restore health, shine, and manageability.',
};

export default function TreatmentsPage() {
  return (
    <ServiceDetailLayout
      icon={Sparkles}
      title="Hair Treatments"
      description="Deep conditioning, keratin, and scalp treatments for healthy, shiny hair. Combat damage, dryness, and frizz with our specialized care menu."
      serviceSlug="treatments"
      included={[
        'Hair health analysis',
        'Customized treatment selection',
        'Deep penetrating application',
        'Scalp massage',
        'Steam processing (if applicable)',
        'Blow-dry finish',
      ]}
      process={[
        {
          title: 'Diagnosis',
          description: 'We analyze your hair and scalp to identify specific needs.',
        },
        {
          title: 'Application',
          description: 'Nutrient-rich treatments are applied to hair and scalp.',
        },
        {
          title: 'Absorption',
          description: 'Heat or steam may be used to help ingredients penetrate deeply.',
        },
        {
          title: 'Result',
          description: 'Instantly softer, shinier, and healthier-feeling hair.',
        },
      ]}
      whoItsFor={[
        'Dry or brittle hair',
        'Frizzy or unmanageable hair',
        'Color-treated hair needing repair',
        'Itchy or dry scalp issues',
        'Preparation for special events',
        'Routine hair health maintenance',
      ]}
      pricing={[
        {
          tier: 'Deep Condition',
          description: 'Intense moisture mask',
          href: '/pricing#condition',
        },
        {
          tier: 'Keratin',
          description: 'Smoothing treatment',
          href: '/pricing#keratin',
        },
        {
          tier: 'Scalp Detox',
          description: 'Exfoliating treatment',
          href: '/pricing#scalp',
        },
      ]}
      faqs={[
        {
          question: 'How long does a Keratin treatment last?',
          answer:
            'Depending on the specific treatment and aftercare, it can last anywhere from 3 to 5 months.',
        },
        {
          question: 'Can I get a treatment with my color service?',
          answer:
            'Yes! Many treatments are designed to be done immediately after color to lock it in and restore moisture.',
        },
        {
          question: 'How often should I get a deep conditioning treatment?',
          answer:
            'For most hair types, once a month is recommended. If your hair is very damaged, we may suggest more frequent visits.',
        },
      ]}
    />
  );
}
