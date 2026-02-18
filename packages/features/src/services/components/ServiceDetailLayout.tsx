// File: packages/features/src/services/components/ServiceDetailLayout.tsx  [TRACE:FILE=packages.features.services.detail]
// Purpose: Service detail page layout with hero, included, process, pricing, FAQs.
//          Renders Schema.org Service and FAQPage JSON-LD from props.
//
// Exports / Entry: ServiceDetailLayout (default export)
// Used by: Service detail pages (/services/[slug])
//
// Invariants:
// - No direct site config or env imports; siteName and baseUrl passed as props
// - Structured data uses passed siteName and baseUrl for provider/urls
// - Accordion items must match AccordionItem { question, answer }
// - CTAs link to configurable contactHref
//
// Status: @public
// Features:
// - [FEAT:SERVICES] Service detail presentation
// - [FEAT:SEO] Service + FAQ structured data
// - [FEAT:UX] Consistent layout sections
// - [FEAT:CONFIGURATION] Props-driven, no template coupling

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Container, Section, Card, Button, Accordion } from '@repo/ui';
import type { ServiceDetailProps } from '../types';

// [TRACE:FUNC=packages.features.services.ServiceDetailLayout]
// [FEAT:SERVICES] [FEAT:SEO] [FEAT:UX]
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
  siteName,
  baseUrl,
  contactHref = '/contact',
  ctaLabel = 'Get Started',
  finalCtaHeading = 'Ready to Get Started?',
  finalCtaDescription = 'Schedule a free consultation to discuss how this service can help grow your business.',
  finalCtaButtonLabel = 'Schedule Free Consultation',
}: ServiceDetailProps) {
  const resolvedBaseUrl = baseUrl.replace(/\/$/, '');
  const resolvedServiceUrl = serviceSlug
    ? `${resolvedBaseUrl}/services/${serviceSlug}`
    : `${resolvedBaseUrl}/services`;

  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: resolvedBaseUrl,
    },
    url: resolvedServiceUrl,
    serviceType: title,
    areaServed: { '@type': 'Country', name: 'United States' },
    offers: pricing.map((tier) => ({
      '@type': 'Offer',
      name: `${title} - ${tier.tier}`,
      description: tier.description,
      url: tier.href.startsWith('http') ? tier.href : `${resolvedBaseUrl}${tier.href}`,
    })),
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
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

      <Section className="bg-gradient-to-b from-secondary to-secondary/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-primary" aria-hidden />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
            <p className="text-xl text-white/80 mb-8">{description}</p>
            <Link href={contactHref}>
              <Button variant="primary" size="large">
                {ctaLabel}
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              What&apos;s Included
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" aria-hidden />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-muted">
        <Container>
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <Card key={step.title} variant="default">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl" aria-hidden>
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Who This Service Is For
            </h2>
            <div className="space-y-4">
              {whoItsFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" aria-hidden />
                  </div>
                  <span className="text-muted-foreground text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

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

      <Section className="bg-secondary text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{finalCtaHeading}</h2>
            <p className="text-lg text-white/80 mb-8">{finalCtaDescription}</p>
            <Link href={contactHref}>
              <Button variant="primary" size="large">
                {finalCtaButtonLabel}
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
