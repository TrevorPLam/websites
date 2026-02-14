import type { Metadata } from 'next';
import Link from 'next/link';
import { Scissors, Palette, Sparkles, Calendar, User, Clock, Heart, Star } from 'lucide-react';
import { Container, Section, Card, Button } from '@repo/ui';

export const metadata: Metadata = {
  title: 'Salon Services',
  description:
    'Explore our full range of hair salon services including cuts, color, treatments, and bridal styling.',
};

const coreServices = [
  {
    icon: Scissors,
    title: 'Haircuts & Styling',
    description: 'Precision cuts and styling for women, men, and children to suit your lifestyle.',
    href: '/services/haircuts',
    features: ['Precision Cutting', 'Blowouts', "Men's Grooming", "Children's Cuts"],
  },
  {
    icon: Palette,
    title: 'Coloring Services',
    description: 'Full color, highlights, balayage, and corrections by master colorists.',
    href: '/services/coloring',
    features: ['Full Color', 'Highlights & Lowlights', 'Balayage', 'Color Correction'],
  },
  {
    icon: Sparkles,
    title: 'Treatments',
    description: 'Deep conditioning, keratin, and scalp treatments for healthy, shiny hair.',
    href: '/services/treatments',
    features: ['Deep Conditioning', 'Keratin Smoothing', 'Scalp Detox', 'Glossing'],
  },
  {
    icon: Calendar,
    title: 'Special Occasions',
    description: 'Bridal hair, updos, and styling for weddings, proms, and special events.',
    href: '/services/special-occasions',
    features: ['Bridal Hair', 'Updos', 'Event Styling', 'On-site Services'],
  },
];

const additionalServices = [
  {
    icon: User,
    title: 'Consultations',
    description: 'Complimentary 15-minute consultations to discuss your hair goals.',
    href: '/contact',
  },
  {
    icon: Clock,
    title: 'Express Services',
    description: 'Quick trims and touch-ups for when you are short on time.',
    href: '/contact',
  },
  {
    icon: Heart,
    title: 'Gift Cards',
    description: 'Give the gift of great hair. Available for any service or amount.',
    href: '/contact',
  },
  {
    icon: Star,
    title: 'Memberships',
    description: 'Join our VIP program for discounts on products and services.',
    href: '/contact',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-secondary to-secondary/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Services Tailored to You
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Experience professional hair care in a relaxing environment. Our expert stylists are
              dedicated to making you look and feel your best.
            </p>
            <Link href="/book">
              <Button variant="primary" size="large">
                Book an Appointment
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Core Services */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Menu</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of services to meet all your hair care needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} variant="service">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={`${service.title}-${feature}`}
                        className="flex items-center text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

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

      {/* Additional Services */}
      <Section className="bg-muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              More Ways to Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your visit with these additional offerings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} variant="default">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary/10 to-primary/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready for a Transformation?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Schedule your appointment today and let our experts take care of the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button variant="primary" size="large">
                  Book Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="large">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
