import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { Container, Section, Card, Button } from '@repo/ui'

export const metadata: Metadata = {
  title: 'Marketing Strategy | Your Dedicated Marketer',
  description: 'Marketing strategy services are coming soon. Get early access to quarterly planning, channel prioritization, and growth roadmaps.',
}

const strategyHighlights = [
  {
    title: 'Quarterly planning sessions',
    description: 'Set clear goals, prioritize initiatives, and align marketing with business objectives.',
  },
  {
    title: 'Channel prioritization',
    description: 'Focus on the channels that will deliver the biggest impact for your budget and timeline.',
  },
  {
    title: 'Competitive positioning',
    description: 'Clarify your differentiators and translate them into focused messaging.',
  },
]

export default function MarketingStrategyPage() {
  return (
    <>
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-teal/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-teal" />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Coming Soon</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Marketing Strategy</h1>
            <p className="text-xl text-white/80 mb-8">
              We&apos;re building a dedicated strategy offer to help you plan every quarter with confidence.
              Get early access and we&apos;ll tailor the first roadmap to your goals.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Get Early Access
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
              {strategyHighlights.map((item) => (
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
            <h2 className="text-3xl font-bold text-charcoal mb-4">Want a custom roadmap now?</h2>
            <p className="text-lg text-slate mb-6">
              Let&apos;s map out your next 90 days together. We&apos;ll identify quick wins and the highest-leverage initiatives.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="large">
                Schedule a Strategy Call
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
