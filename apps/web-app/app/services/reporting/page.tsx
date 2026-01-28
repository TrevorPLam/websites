import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart } from 'lucide-react'
import { Container, Section, Card, Button } from '@repo/ui'

export const metadata: Metadata = {
  title: 'Marketing Reporting | Your Dedicated Marketer',
  description: 'Marketing reporting services are coming soon. Get early access to KPI dashboards, performance insights, and ROI tracking.',
}

const reportingHighlights = [
  {
    title: 'KPI dashboards',
    description: 'Track the metrics that matter most to revenue and retention.',
  },
  {
    title: 'Performance insights',
    description: 'Turn campaign data into actionable next steps for your team.',
  },
  {
    title: 'ROI measurement',
    description: 'Connect marketing activity to pipeline and sales outcomes.',
  },
]

export default function MarketingReportingPage() {
  return (
    <>
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-teal/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <BarChart className="w-8 h-8 text-teal" />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Coming Soon</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Marketing Reporting</h1>
            <p className="text-xl text-white/80 mb-8">
              We&apos;re preparing a reporting service that keeps your team aligned on performance.
              Get notified when the new dashboards are ready.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Get Reporting Updates
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
              {reportingHighlights.map((item) => (
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
            <h2 className="text-3xl font-bold text-charcoal mb-4">Want clarity on your KPIs now?</h2>
            <p className="text-lg text-slate mb-6">
              We&apos;ll help you define the right KPIs and build a lightweight reporting cadence.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="large">
                Schedule Reporting Review
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
