import type { Metadata } from 'next'
import Link from 'next/link'
import { Database } from 'lucide-react'
import { Container, Section, Card, Button } from '@repo/ui'

export const metadata: Metadata = {
  title: 'CRM Setup & Management | Your Dedicated Marketer',
  description: 'CRM setup and management services are coming soon. Get early access to CRM selection, automation, and reporting support.',
}

const crmHighlights = [
  {
    title: 'CRM selection & setup',
    description: 'Choose the right CRM and configure it to match your sales process.',
  },
  {
    title: 'Workflow automation',
    description: 'Reduce manual follow-up with smart automations and task routing.',
  },
  {
    title: 'Reporting dashboards',
    description: 'Track pipeline health, lead sources, and conversion performance.',
  },
]

export default function CrmServicesPage() {
  return (
    <>
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-teal/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-teal" />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Coming Soon</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">CRM Setup &amp; Management</h1>
            <p className="text-xl text-white/80 mb-8">
              We&apos;re crafting a hands-on CRM service to help you organize leads, automate follow-ups,
              and keep your pipeline crystal clear. Join the early access list.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Request CRM Support
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">What to expect</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {crmHighlights.map((item) => (
                <Card key={item.title} variant="default">
                  <h3 className="text-lg font-semibold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-sm text-slate leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-off-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Ready to tame your pipeline?</h2>
            <p className="text-lg text-slate mb-6">
              We&apos;ll assess your current tools and outline a CRM plan that your team can adopt quickly.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="large">
                Schedule a CRM Review
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
