import React from 'react'
import Link from 'next/link'
import { Check, LucideIcon } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Accordion, { AccordionItem } from '@/components/ui/Accordion'

export interface ProcessStep {
  title: string
  description: string
}

export interface ServiceDetailProps {
  icon: LucideIcon
  title: string
  description: string
  included: string[]
  process: ProcessStep[]
  whoItsFor: string[]
  pricing: {
    tier: string
    description: string
    href: string
  }[]
  faqs: AccordionItem[]
}

export default function ServiceDetailLayout({
  icon: Icon,
  title,
  description,
  included,
  process,
  whoItsFor,
  pricing,
  faqs,
}: ServiceDetailProps) {
  return (
    <>
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
