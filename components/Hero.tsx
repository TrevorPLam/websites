import React from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-off-white to-white py-20 md:py-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
              Growth-Focused Marketing for Small Businesses
            </h1>
            <p className="text-lg md:text-xl text-slate mb-8 leading-relaxed">
              Strategic marketing services that drive real results - without the agency overhead
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button variant="primary" size="large">
                  Schedule Free Consultation
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="secondary" size="large">
                  View Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Hero Image/Illustration */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-teal/20 to-teal/5 rounded-2xl p-12 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-slate font-medium">Professional marketing illustration</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
