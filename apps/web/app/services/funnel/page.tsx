import type { Metadata } from 'next'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { Container, Section, Card, Button } from '@repo/ui'

export const metadata: Metadata = {
  title: 'Funnel Build-Out | Your Dedicated Marketer',
  description: 'Funnel build-out services are coming soon. Get early access to landing page optimization, lead magnets, and conversion tracking.',
}

const funnelHighlights = [
  {
    title: 'Landing page optimization',
    description: 'Clarify your offer and remove friction so visitors take the next step.',
  },
  {
    title: 'Lead magnet development',
    description: 'Create compelling assets that turn visitors into qualified leads.',
  },
  {
    title: 'Conversion tracking',
    description: 'Instrument the funnel so every step is measurable and improvable.',
  },
]

export default function FunnelBuildOutPage() {
  return (
    <>
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-teal/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-teal" />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Coming Soon</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Funnel Build-Out</h1>
            <p className="text-xl text-white/80 mb-8">
              We&apos;re designing a funnel build-out package that aligns your landing pages, offers,
              and follow-up flows. Be the first to get the new funnel roadmap.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Get Funnel Help
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
              {funnelHighlights.map((item) => (
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
            <h2 className="text-3xl font-bold text-charcoal mb-4">Need a better funnel today?</h2>
            <p className="text-lg text-slate mb-6">
              We can audit your current funnel and recommend improvements you can act on immediately.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="large">
                Schedule a Funnel Audit
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
