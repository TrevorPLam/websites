import React from 'react'
import Link from 'next/link'
import { Search, FileText, Share2, Mail } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const services = [
  {
    icon: Search,
    title: 'SEO Services',
    description: 'Get found by customers actively searching for your services',
    href: '/services/seo',
  },
  {
    icon: FileText,
    title: 'Content Marketing',
    description: 'Attract and engage your audience with strategic content',
    href: '/services/content',
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Build community and brand awareness across platforms',
    href: '/services/social',
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Nurture leads and drive conversions with targeted campaigns',
    href: '/services/email',
  },
]

export default function ServicesOverview() {
  return (
    <Section className="bg-off-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Marketing leadership I run with your team
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            I focus on the channels that matter most right now so founders and teams get momentum without extra management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} variant="service">
                <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-2xl font-semibold text-charcoal mb-3">{service.title}</h3>
                <p className="text-slate mb-4 leading-relaxed">{service.description}</p>
                <Link
                  href={service.href}
                  className="text-teal font-semibold hover:text-teal-dark transition-colors inline-flex items-center"
                >
                  Learn More →
                </Link>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
