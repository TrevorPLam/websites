import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Card, Button, Accordion } from '@repo/ui';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for all our hair services. Cuts, color, treatments, and more.',
};

const haircutPricing = [
  { name: "Women's Cut & Style", price: '$65+' },
  { name: "Men's Cut & Style", price: '$45+' },
  { name: "Children's Cut (Under 12)", price: '$35+' },
  { name: 'Bang Trim', price: 'Complimentary' },
];

const colorPricing = [
  { name: 'Root Touch-up', price: '$85+' },
  { name: 'Full Color', price: '$110+' },
  { name: 'Partial Highlights', price: '$135+' },
  { name: 'Full Highlights', price: '$165+' },
  { name: 'Balayage / Ombre', price: '$185+' },
  { name: 'Color Correction', price: 'Upon Consultation' },
];

const treatmentPricing = [
  { name: 'Deep Conditioning Mask', price: '$35' },
  { name: 'Keratin Smoothing Treatment', price: '$250+' },
  { name: 'Scalp Detox', price: '$45' },
  { name: 'Gloss / Toner', price: '$45' },
];

const occasionPricing = [
  { name: 'Blowout', price: '$55+' },
  { name: 'Updo / Formal Styling', price: '$85+' },
  { name: 'Bridal Trial', price: '$100' },
  { name: 'Bridal Day-Of', price: '$150+' },
];

const faqs = [
  {
    question: 'Why are prices listed as "starting at"?',
    answer:
      'Prices may vary based on hair length, thickness, and the complexity of the service. Your stylist will provide a quote during your consultation.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'We require 24 hours notice for cancellations. Cancellations made within 24 hours may be subject to a fee of 50% of the scheduled service.',
  },
  {
    question: 'Do you offer consultations?',
    answer:
      'Yes! We offer complimentary 15-minute consultations for all new color and extension clients.',
  },
  {
    question: 'What forms of payment do you accept?',
    answer: 'We accept cash, all major credit cards, and Apple Pay.',
  },
];

function PricingList({
  title,
  items,
}: {
  title: string;
  items: { name: string; price: string }[];
}) {
  return (
    <Card variant="default" className="h-full">
      <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-primary/20 pb-4">
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.name} className="flex justify-between items-center text-muted-foreground">
            <span className="font-medium">{item.name}</span>
            <span className="font-semibold text-primary">{item.price}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-secondary to-secondary/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Service Menu & Pricing
            </h1>
            <p className="text-xl text-white/80 mb-4">
              Transparent pricing for professional hair care.
            </p>
          </div>
        </Container>
      </Section>

      {/* Pricing Grids */}
      <Section className="bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingList title="Haircuts & Styling" items={haircutPricing} />
            <PricingList title="Color Services" items={colorPricing} />
            <PricingList title="Treatments" items={treatmentPricing} />
            <PricingList title="Special Occasions" items={occasionPricing} />
          </div>
          <div className="text-center mt-12 text-muted-foreground italic">
            * Prices are subject to change. Please consult with your stylist for an accurate quote.
          </div>
        </Container>
      </Section>

      {/* FAQs */}
      <Section className="bg-muted">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary/10 to-primary/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Book?</h2>
            <p className="text-lg text-muted-foreground mb-8">Secure your spot today.</p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Schedule Appointment
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
