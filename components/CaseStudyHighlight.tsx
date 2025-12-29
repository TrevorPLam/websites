import React from 'react'
import Link from 'next/link'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

const metrics = [
  {
    icon: TrendingUp,
    value: '250%',
    label: 'Revenue Increase',
  },
  {
    icon: Users,
    value: '3.5x',
    label: 'Lead Generation',
  },
  {
    icon: DollarSign,
    value: '5:1',
    label: 'Marketing ROI',
  },
]

export default function CaseStudyHighlight() {
  return (
    <Section className="bg-gradient-to-br from-teal/10 to-teal/5">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Case Study Details */}
          <div>
            <div className="inline-block bg-teal/20 text-teal font-semibold px-4 py-2 rounded-full mb-4">
              Featured Case Study
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              How Local Services Co. Increased Revenue 250% in 6 Months
            </h2>
            <p className="text-lg text-slate mb-6 leading-relaxed">
              Discover how we helped a local service business transform their marketing strategy
              and achieve exceptional growth through strategic SEO, content marketing, and targeted campaigns.
            </p>
            <Link href="/case-studies/local-services-co">
              <Button variant="primary" size="medium">
                View Full Case Study
              </Button>
            </Link>
          </div>

          {/* Right Column - Key Metrics */}
          <div className="grid gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md">
                  <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-charcoal">{metric.value}</div>
                    <div className="text-slate">{metric.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
