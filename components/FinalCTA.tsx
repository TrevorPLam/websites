import React, { memo } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

function FinalCTA() {
  return (
    <Section className="bg-charcoal text-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to grow with me?
          </h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Book a free strategy call and I’ll map the next marketing moves with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="large">
                Book a Free Strategy Call
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="large" className="border-white text-charcoal bg-white hover:bg-off-white">
                Get a Free Marketing Plan
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default memo(FinalCTA)
