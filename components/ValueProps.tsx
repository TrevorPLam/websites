import React from 'react'
import { Target, DollarSign, Settings } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const valueProps = [
  {
    icon: Target,
    title: 'Data-Driven Strategy',
    description: 'Marketing strategies tailored to your business goals and backed by analytics',
  },
  {
    icon: DollarSign,
    title: 'No Surprise Costs',
    description: 'Clear, predictable monthly pricing with no hidden fees or unexpected charges',
  },
  {
    icon: Settings,
    title: 'We Execute, Not Just Plan',
    description: 'From strategy to implementation, we handle every aspect of your marketing',
  },
]

export default function ValueProps() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon
            return (
              <Card key={index} variant="default">
                <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{prop.title}</h3>
                <p className="text-slate leading-relaxed">{prop.description}</p>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
