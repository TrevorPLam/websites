import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'

export const metadata: Metadata = {
  title: 'Pricing | Your Dedicated Marketer',
  description: 'Transparent pricing for marketing services. Choose from Starter, Growth, or Scale tiers. No hidden fees, no surprises.',
}

const tiers = [
  {
    name: 'Starter',
    price: '$1,500',
    period: '/month',
    description: 'Perfect for small businesses getting started with marketing',
    features: [
      { name: '4 blog posts per month', included: true },
      { name: 'Basic SEO optimization', included: true },
      { name: 'Social media (2 platforms)', included: true },
      { name: '12 social posts per month', included: true },
      { name: '2 email campaigns per month', included: true },
      { name: 'Monthly performance report', included: true },
      { name: 'Email support', included: true },
      { name: 'Monthly strategy call', included: true },
      { name: 'Advanced SEO', included: false },
      { name: 'Marketing automation', included: false },
      { name: 'Dedicated account manager', included: false },
      { name: 'Weekly strategy calls', included: false },
    ],
    cta: 'Get Started',
    href: '/contact',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$3,500',
    period: '/month',
    description: 'For established businesses ready to scale their marketing',
    features: [
      { name: '8 blog posts per month', included: true },
      { name: 'Advanced SEO program', included: true },
      { name: 'Social media (3 platforms)', included: true },
      { name: '20 social posts per month', included: true },
      { name: '4 email campaigns per month', included: true },
      { name: 'Bi-weekly performance reports', included: true },
      { name: 'Priority email & phone support', included: true },
      { name: 'Bi-weekly strategy calls', included: true },
      { name: 'Email automation setup', included: true },
      { name: 'CRM management', included: true },
      { name: 'Ad account setup & monitoring', included: true },
      { name: 'Dedicated account manager', included: false },
    ],
    cta: 'Get Started',
    href: '/contact',
    popular: true,
  },
  {
    name: 'Scale',
    price: '$6,000',
    period: '/month',
    description: 'For businesses with complex marketing needs',
    features: [
      { name: '12+ blog posts per month', included: true },
      { name: 'Comprehensive SEO program', included: true },
      { name: 'Social media (4+ platforms)', included: true },
      { name: '30+ social posts per month', included: true },
      { name: 'Unlimited email campaigns', included: true },
      { name: 'Weekly performance reports', included: true },
      { name: 'Priority support (24hr response)', included: true },
      { name: 'Weekly strategy calls', included: true },
      { name: 'Advanced marketing automation', included: true },
      { name: 'Full CRM management', included: true },
      { name: 'PPC management included', included: true },
      { name: 'Dedicated account manager', included: true },
    ],
    cta: 'Get Started',
    href: '/contact',
    popular: false,
  },
]

const addOns = [
  {
    name: 'PPC Management',
    price: 'Starting at $1,000/month',
    description: 'Google Ads and social media advertising management with optimization',
  },
  {
    name: 'Website Redesign',
    price: 'Starting at $5,000',
    description: 'Complete website redesign with conversion optimization',
  },
  {
    name: 'Advanced SEO',
    price: 'Starting at $2,000/month',
    description: 'Link building, technical SEO, and enterprise optimization',
  },
  {
    name: 'Video Content',
    price: 'Starting at $500/video',
    description: 'Professional video production and editing for marketing',
  },
]

const faqs = [
  {
    question: 'What\'s included in each tier?',
    answer: 'Each tier includes a set of core services shown in the comparison table above. Higher tiers include more deliverables, more frequent reporting, and additional services. All tiers include strategy, execution, and reporting.',
  },
  {
    question: 'Can I switch tiers?',
    answer: 'Yes! You can upgrade or downgrade at any time. If you upgrade mid-month, we\'ll prorate the difference. If you downgrade, the new rate applies at your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, ACH transfers, and wire transfers. Payment is due monthly in advance. We also offer quarterly and annual payment options with discounts.',
  },
  {
    question: 'Is there a contract?',
    answer: 'We require a 3-month initial commitment to see results. After that, you can continue month-to-month or commit to longer terms for discounted rates. We believe in earning your business every month.',
  },
  {
    question: 'What\'s not included in these prices?',
    answer: 'Paid advertising budgets, premium tools/software (unless specified), third-party services (photographers, videographers), and services outside our core offerings. We\'re transparent about any additional costs before starting work.',
  },
  {
    question: 'How do we measure success?',
    answer: 'Success metrics vary by business but typically include organic traffic growth, lead generation, conversion rates, and ROI. We set specific KPIs during onboarding and track them monthly. You\'ll always know if we\'re delivering results.',
  },
  {
    question: 'Do you work with businesses in my industry?',
    answer: 'We work with B2B and B2C businesses across many industries. During our consultation, we\'ll discuss your industry specifics and share relevant experience. We focus on understanding your business rather than cookie-cutter solutions.',
  },
  {
    question: 'What if I need custom services?',
    answer: 'We can create custom packages combining services from different tiers or adding specialized services. Schedule a consultation to discuss your specific needs, and we\'ll build a proposal that fits your goals and budget.',
  },
]

export default function PricingPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/80 mb-4">
              No hidden fees, no surprises. Choose the plan that fits your business goals.
            </p>
            <p className="text-lg text-white/70">
              All plans include strategy, execution, and reporting. Cancel anytime after initial 3-month commitment.
            </p>
          </div>
        </Container>
      </Section>

      {/* Pricing Tiers */}
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                variant="default"
                className={tier.popular ? 'ring-2 ring-teal relative' : ''}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-teal text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-charcoal mb-2">{tier.name}</h3>
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-charcoal">{tier.price}</span>
                    <span className="text-slate">{tier.period}</span>
                  </div>
                  <p className="text-slate text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-charcoal' : 'text-slate/50'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.href}>
                  <Button
                    variant={tier.popular ? 'primary' : 'secondary'}
                    size="medium"
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Add-Ons */}
      <Section className="bg-off-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Add-On Services</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Enhance your marketing package with additional specialized services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index} variant="default">
                <h3 className="text-xl font-semibold text-charcoal mb-2">{addon.name}</h3>
                <p className="text-teal font-semibold mb-2">{addon.price}</p>
                <p className="text-slate text-sm">{addon.description}</p>
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

      {/* CTA Section */}
      <Section className="bg-charcoal text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Schedule a free consultation to discuss which plan is right for your business.
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
