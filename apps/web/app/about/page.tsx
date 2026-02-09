import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Scissors, Heart, Sparkles, User, Clock, Star } from 'lucide-react'
import { Container, Section } from '@repo/ui'

export const metadata: Metadata = {
  title: 'About Us | Hair Salon Template',
  description: 'Meet our team of expert stylists and learn about our commitment to healthy, beautiful hair.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal via-slate-800 to-teal/20 text-white py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              More Than Just a Haircut
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We are a team of passionate stylists dedicated to creating a relaxing experience and delivering results that make you shine.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-slate space-y-6">
              <p>
                Our salon was founded with a simple mission: to provide high-quality hair care in a welcoming and unpretentious environment. We believe that getting your hair done should be the best part of your week.
              </p>
              <p>
                We started as a small team of two stylists and have grown into a family of creative professionals who share a love for the craft. We constantly educate ourselves on the latest trends and techniques to ensure we can bring your vision to life.
              </p>
              <p>
                Whether you're looking for a subtle refresh or a complete transformation, we listen, we care, and we deliver.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-off-white">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-12 text-center">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-3">Expertise</h3>
              <p className="text-slate">
                Our stylists are master-certified and participate in ongoing education to stay ahead of the curve.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-3">Care</h3>
              <p className="text-slate">
                We prioritize the health of your hair, using only the finest products that nourish and protect.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-3">Atmosphere</h3>
              <p className="text-slate">
                Relax in our modern, clean, and comfortable space. Enjoy a beverage and let us pamper you.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-charcoal via-slate-800 to-teal/20 text-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              By The Numbers
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
                <div className="text-white/90">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">5k+</div>
                <div className="text-white/90">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-white/90">Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-white/90">Awards Won</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl text-slate mb-8">
              Book your appointment today and discover your best hair.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark transition-all shadow-lg hover:shadow-xl"
              >
                Book Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-charcoal font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
