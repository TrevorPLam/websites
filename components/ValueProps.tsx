import React, { memo } from 'react'
import { Target, DollarSign, Settings } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const valueProps = [
  {
    icon: Target,
    title: 'Marketing shouldn’t feel like a guessing game.',
    description: (
      <>
        Most founders don’t actually need more marketing.
        <br />
        They need someone to own it.
        <br />
        <br />
        Someone who:
        <br />• Understands the business context
        <br />• Knows what matters right now (and what doesn’t)
        <br />• Makes decisions, not just suggestions
        <br />• Stays accountable over time
        <br />
        <br />
        That’s the role I fill.
      </>
    ),
  },
  {
    icon: DollarSign,
    title: 'What ‘part of your team’ actually means',
    description: (
      <>
        I’m embedded in your team, learning the business and taking ownership — not handing you a list of tasks.
        <br />
        <br />
        When we work together:
        <br />• I learn your business like an internal hire would
        <br />• I help decide priorities, not just execute orders
        <br />• I work within your existing tools, people, and constraints
        <br />• You get marketing leadership without hiring full-time
        <br />
        <br />
        You stay focused on running the business.
        <br />
        I take responsibility for the marketing.
      </>
    ),
  },
  {
    icon: Settings,
    title: 'Who this works best for',
    description: (
      <>
        This is a good fit if:
        <br />• You’re a founder or part of a lean team
        <br />• You want senior-level marketing ownership, not hand-holding
        <br />• You don’t want to manage freelancers or a revolving bench of contractors
        <br />• You want clarity, momentum, and follow-through
        <br />
        <br />
        If you’re looking for a hands-off partner or a one-time project, this probably isn’t it.
        <br />
        If you want a dedicated marketer embedded into your team, it is.
      </>
    ),
  },
]

function ValueProps() {
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

export default memo(ValueProps)
