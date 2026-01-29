import React, { memo } from 'react'
import { Target, DollarSign, Settings } from 'lucide-react'
import { Container, Section, Card } from '@repo/ui'

const valueProps = [
  {
    icon: Target,
    title: 'Marketing shouldn’t feel like a guessing game.',
    description: (
      <>
        <p>Most founders don’t actually need more marketing. They need someone to own it.</p>
        <p>Someone who:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Understands the business context</li>
          <li>Knows what matters right now (and what doesn’t)</li>
          <li>Makes decisions, not just suggestions</li>
          <li>Stays accountable over time</li>
        </ul>
        <p>That’s the role I fill.</p>
      </>
    ),
  },
  {
    icon: DollarSign,
    title: 'What ‘part of your team’ actually means',
    description: (
      <>
        <p>
          I’m embedded in your team, learning the business and taking ownership — not handing you a list of tasks.
        </p>
        <p>When we work together:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>I learn your business like an internal hire would</li>
          <li>I help decide priorities, not just execute orders</li>
          <li>I work within your existing tools, people, and constraints</li>
          <li>You get marketing leadership without hiring full-time</li>
        </ul>
        <p>You stay focused on running the business.</p>
        <p>I take responsibility for the marketing.</p>
      </>
    ),
  },
  {
    icon: Settings,
    title: 'Who this works best for',
    description: (
      <>
        <p>This is a good fit if:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>You’re a founder or part of a lean team</li>
          <li>You want senior-level marketing ownership, not hand-holding</li>
          <li>You don’t want to manage freelancers or a revolving bench of contractors</li>
          <li>You want clarity, momentum, and follow-through</li>
        </ul>
        <p>If you’re looking for a hands-off partner or a one-time project, this probably isn’t it.</p>
        <p>If you want a dedicated marketer embedded into your team, it is.</p>
      </>
    ),
  },
]

function ValueProps() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop) => {
            const Icon = prop.icon
            return (
              <Card key={prop.title} variant="default">
                <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{prop.title}</h3>
                <div className="text-slate leading-relaxed space-y-4">{prop.description}</div>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

export default memo(ValueProps)
