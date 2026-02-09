import React from 'react'
import Link from 'next/link'
import { Scissors, Palette, Sparkles, Calendar } from 'lucide-react'
import { Container, Section, Card } from '@repo/ui'

const services = [
  {
    icon: Scissors,
    title: 'Haircuts & Styling',
    description: 'Precision cuts and styling for women, men, and children to suit your lifestyle.',
    href: '/services/haircuts',
  },
  {
    icon: Palette,
    title: 'Coloring Services',
    description: 'Full color, highlights, balayage, and corrections by master colorists.',
    href: '/services/coloring',
  },
  {
    icon: Sparkles,
    title: 'Treatments',
    description: 'Deep conditioning, keratin, and scalp treatments for healthy, shiny hair.',
    href: '/services/treatments',
  },
  {
    icon: Calendar,
    title: 'Special Occasions',
    description: 'Bridal hair, updos, and styling for weddings, proms, and special events.',
    href: '/services/special-occasions',
  },
]

export default function ServicesOverview() {
  return (
    <Section className="bg-off-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Our Services
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            From classic cuts to modern makeovers, we offer a full range of hair services tailored to you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.title} variant="service">
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
