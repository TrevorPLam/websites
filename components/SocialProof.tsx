import React, { memo } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const testimonials = [
  {
    quote: "Working with Your Dedicated Marketer transformed our online presence. We saw a 150% increase in qualified leads within the first 3 months.",
    author: 'Sarah Johnson',
    company: 'Tech Solutions Inc.',
    title: 'CEO',
  },
  {
    quote: "Finally, a marketing partner that actually understands founder and team realities. No fluff, just results-driven strategies that work.",
    author: 'Michael Chen',
    company: 'Local Services Co.',
    title: 'Founder',
  },
  {
    quote: "The transparency and communication are outstanding. I always know exactly what's being done and why. Our ROI has been exceptional.",
    author: 'Emily Rodriguez',
    company: 'E-commerce Store',
    title: 'Owner',
  },
]

const metrics = [
  { value: '127%', label: 'Average Growth' },
  { value: '50+', label: 'Clients Served' },
  { value: '95%', label: 'Client Retention' },
]

function SocialProof() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Trusted by founders and teams I work with
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Here’s what people say about having me embedded in their marketing
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="testimonial">
              <p className="text-slate mb-6 italic leading-relaxed">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-charcoal">{testimonial.author}</p>
                <p className="text-slate text-sm">{testimonial.company}, {testimonial.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-8 text-center">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold text-teal mb-2">{metric.value}</div>
              <div className="text-slate font-medium">{metric.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default memo(SocialProof)
