/**
 * Reusable service detail page layout template.
 * 
 * **Purpose:**
 * Provides consistent structure for all service pages (/services/*).
 * Each service page imports this and passes service-specific data.
 * 
 * **Sections (in order):**
 * 1. Hero - Icon, title, description, CTA
 * 2. What's Included - Checklist of features
 * 3. Our Process - Numbered steps
 * 4. Who It's For - Target audience list
 * 5. Pricing Options - Tier cards with links
 * 6. FAQs - Accordion with questions
 * 7. Final CTA - Contact prompt
 * 
 * **SEO Features:**
 * - Service schema.org structured data
 * - FAQ schema.org structured data
 * 
 * **Usage:**
 * ```tsx
 * // In app/services/seo/page.tsx
 * import ServiceDetailLayout from '@/components/ServiceDetailLayout'
 * import { Search } from 'lucide-react'
 * 
 * export default function SEOServicePage() {
 *   return (
 *     <ServiceDetailLayout
 *       icon={Search}
 *       title="SEO Services"
 *       description="Optimize your search presence..."
 *       included={['Technical SEO', 'Keyword research', ...]}
 *       process={[{ title: 'Audit', description: '...' }, ...]}
 *       whoItsFor={['Small businesses', 'E-commerce stores', ...]}
 *       pricing={[{ tier: 'Starter', description: '...', href: '/pricing' }]}
 *       faqs={[{ question: '...', answer: '...' }]}
 *     />
 *   )
 * }
 * ```
 * 
 * @component
 */

import React from 'react'
import Link from 'next/link'
import { Check, LucideIcon } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Accordion, { AccordionItem } from '@/components/ui/Accordion'
import { getPublicBaseUrl } from '@/lib/env.public'

/**
 * Process step data structure.
 */
export interface ProcessStep {
  /** Step title */
  title: string
  /** Step description */
  description: string
}

/**
 * Service detail page props.
 * All fields are required to ensure consistent service pages.
 */
export interface ServiceDetailProps {
  /** Lucide icon component for the service */
  icon: LucideIcon
  /** Service title (used in h1 and structured data) */
  title: string
  /** Service description (hero and meta) */
  description: string
  /** List of features/deliverables included */
  included: string[]
  /** Numbered process steps */
  process: ProcessStep[]
  /** Target audience descriptions */
  whoItsFor: string[]
  /** Pricing tier cards */
  pricing: {
    tier: string
    description: string
    href: string
  }[]
  /** FAQ items for accordion */
  faqs: AccordionItem[]
  /** Optional service slug for structured data */
  serviceSlug?: string
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
  const baseUrl = getPublicBaseUrl().replace(/\/$/, '')
  const resolvedServiceUrl = serviceSlug
    ? `${baseUrl}/services/${serviceSlug}`
    : `${baseUrl}/services`

  // Structured data for Service
  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: description,
    provider: {
      '@type': 'Organization',
      name: 'Your Dedicated Marketer',
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
  }

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
  }

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
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-teal/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-teal" />
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
            <h2 className="text-3xl font-bold text-charcoal mb-8 text-center">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {included.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-teal" />
                  </div>
                  <span className="text-slate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="bg-off-white">
        <Container>
          <h2 className="text-3xl font-bold text-charcoal mb-12 text-center">Our Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <Card key={index} variant="default">
                <div className="w-12 h-12 bg-teal rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">{step.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who It's For */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-8 text-center">
              Who This Service Is For
            </h2>
            <div className="space-y-4">
              {whoItsFor.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Pricing */}
      <Section className="bg-gradient-to-br from-teal/10 to-teal/5">
        <Container>
          <h2 className="text-3xl font-bold text-charcoal mb-8 text-center">Pricing Options</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((tier, index) => (
              <Card key={index} variant="default" className="text-center">
                <h3 className="text-xl font-bold text-charcoal mb-2">{tier.tier}</h3>
                <p className="text-slate mb-4">{tier.description}</p>
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
            <h2 className="text-3xl font-bold text-charcoal mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="bg-charcoal text-white">
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
  )
}
