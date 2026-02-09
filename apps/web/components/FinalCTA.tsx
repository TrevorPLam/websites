import React, { memo } from 'react'
import Link from 'next/link'
import { Button, Container, Section } from '@repo/ui'

function FinalCTA() {
  return (
    <Section className="bg-charcoal text-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for your new look?
          </h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Book an appointment today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="large">
                Book Appointment
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="secondary" size="large" className="border-white text-charcoal bg-white hover:bg-off-white">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default memo(FinalCTA)
