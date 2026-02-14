import React from 'react';
import Link from 'next/link';
import { Check, LucideIcon } from 'lucide-react';
import { Container, Section, Card, Button, Accordion, AccordionItem } from '@repo/ui';
import { getPublicBaseUrl } from '@/lib/env.public';
import siteConfig from '@/site.config';

/**
 * Process step data structure.
 */
export interface ProcessStep {
  /** Step title */
  title: string;
  /** Step description */
  description: string;
}

/**
 * Service detail page props.
 * All fields are required to ensure consistent service pages.
 */
export interface ServiceDetailProps {
  /** Lucide icon component for the service */
  icon: LucideIcon;
  /** Service title (used in h1 and structured data) */
  title: string;
  /** Service description (hero and meta) */
  description: string;
  /** List of features/deliverables included */
  included: string[];
  /** Numbered process steps */
  process: ProcessStep[];
  /** Target audience descriptions */
  whoItsFor: string[];
  /** Pricing tier cards */
  pricing: {
    tier: string;
    description: string;
    href: string;
  }[];
  /** FAQ items for accordion */
  faqs: AccordionItem[];
  /** Optional service slug for structured data */
  serviceSlug?: string;
}

/**
 * Service detail page layout component.
 * Renders all sections with consistent styling.
 */
export default function ServiceDetailLayout({
  icon: Icon,
  title,
  description,
  included,
  process,
  whoItsFor,
  pricing,
  faqs,
  serviceSlug,
}: ServiceDetailProps) {
  const baseUrl = getPublicBaseUrl().replace(/\/$/, '');
  const resolvedServiceUrl = serviceSlug
    ? `${baseUrl}/services/${serviceSlug}`
    : `${baseUrl}/services`;

  // Structured data for Service
  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
    },
    url: resolvedServiceUrl,
    serviceType: title,
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    offers: pricing.map((tier) => ({
      '@type': 'Offer',
      name: `${title} - ${tier.tier}`,
      description: tier.description,
      url: `${baseUrl}${tier.href}`,
    })),
  };

  // Structured data for FAQs
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-secondary to-secondary/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
            <p className="text-xl text-white/80 mb-8">{description}</p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Get Started
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* What's Included */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="bg-muted">
        <Container>
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <Card key={step.title} variant="default">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who It's For */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Who This Service Is For
            </h2>
            <div className="space-y-4">
              {whoItsFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Pricing */}
      <Section className="bg-gradient-to-br from-primary/10 to-primary/5">
        <Container>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Pricing Options</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((tier) => (
              <Card key={tier.tier} variant="default" className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.tier}</h3>
                <p className="text-muted-foreground mb-4">{tier.description}</p>
                <Link href={tier.href}>
                  <Button variant="primary" size="medium" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQs */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="bg-secondary text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Schedule a free consultation to discuss how this service can help grow your business.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Schedule Free Consultation
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
