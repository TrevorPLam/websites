import type { Metadata } from 'next';
import { Scissors } from 'lucide-react';
import ServiceDetailLayout from '@/features/services/components/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Haircuts & Styling',
  description:
    'Precision haircuts and professional styling for women, men, and children. Experience a fresh look tailored to your lifestyle.',
};

export default function HaircutsPage() {
  return (
    <ServiceDetailLayout
      icon={Scissors}
      title="Haircuts & Styling"
      description="Precision cuts and styling for women, men, and children to suit your lifestyle. Our stylists take the time to understand your needs and deliver a look that enhances your natural beauty."
      serviceSlug="haircuts"
      included={[
        'Personalized consultation',
        'Relaxing shampoo and conditioning',
        'Precision haircut',
        'Blow-dry and style',
        'Product recommendations',
        'Styling tips for home care',
      ]}
      process={[
        {
          title: 'Consultation',
          description: 'We discuss your hair type, lifestyle, and desired look to create a plan.',
        },
        {
          title: 'Wash & Condition',
          description: 'Enjoy a relaxing scalp massage with premium shampoos and conditioners.',
        },
        {
          title: 'The Cut',
          description: 'Expert techniques used to create shape, texture, and movement.',
        },
        {
          title: 'Style & Finish',
          description: 'Professional blow-dry and styling to showcase your new look.',
        },
      ]}
      whoItsFor={[
        'Anyone looking for a fresh new look',
        'Maintenance trims to keep hair healthy',
        'Transformation cuts (long to short)',
        'Curly hair specialists available',
        'Men seeking precision barbering',
        'Children of all ages',
      ]}
      pricing={[
        {
          tier: 'Women',
          description: 'Wash, Cut & Blow-dry',
          href: '/pricing#women',
        },
        {
          tier: 'Men',
          description: 'Wash, Cut & Style',
          href: '/pricing#men',
        },
        {
          tier: 'Children',
          description: 'Under 12 years old',
          href: '/pricing#children',
        },
      ]}
      faqs={[
        {
          question: 'How often should I get a haircut?',
          answer:
            'We generally recommend every 6-8 weeks to maintain shape and health. For shorter styles, 4-6 weeks may be necessary.',
        },
        {
          question: 'Do you cut curly hair?',
          answer:
            'Yes! We have stylists who specialize in curly hair techniques to enhance your natural texture.',
        },
        {
          question: 'Is a wash included?',
          answer:
            'Yes, all our haircut services include a luxurious shampoo and conditioning treatment.',
        },
        {
          question: 'Can I bring a picture of what I want?',
          answer:
            'Absolutely! Pictures are a great way to communicate your vision to your stylist.',
        },
      ]}
    />
  );
}
