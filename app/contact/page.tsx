import type { Metadata } from 'next'
import { Mail, Phone, Clock } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import ContactForm from '@/components/ContactForm'
import ErrorBoundary from '@/components/ErrorBoundary'

const CONTACT_EMAIL = 'contact@yourdedicatedmarketer.com'

export const metadata: Metadata = {
  title: 'Contact Us | Your Dedicated Marketer',
  description: 'Get in touch to discuss your marketing goals. Schedule a free consultation or send us a message.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let's Grow Your Business Together
            </h1>
            <p className="text-xl text-white/80">
              Schedule a free 30-minute consultation to discuss your marketing goals and how we can help you achieve them.
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-charcoal mb-6">Send Us a Message</h2>
              <p className="text-slate mb-8">
                Fill out the form below and we'll get back to you within 24 hours (usually much faster!).
              </p>
              <ErrorBoundary
                fallback={(
                  <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
                    We're having trouble loading the form. Please email us at{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </div>
                )}
              >
                <ContactForm />
              </ErrorBoundary>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-charcoal mb-6">Get In Touch</h2>

              <div className="space-y-6 mb-8">
                <Card variant="default">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Email</h3>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-teal hover:text-teal-dark transition-colors"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                </Card>

                <Card variant="default">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Phone</h3>
                      <a
                        href="tel:+15551234567"
                        className="text-teal hover:text-teal-dark transition-colors"
                      >
                        (555) 123-4567
                      </a>
                    </div>
                  </div>
                </Card>

                <Card variant="default">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Office Hours</h3>
                      <p className="text-slate">Monday - Friday</p>
                      <p className="text-slate">9:00 AM - 5:00 PM EST</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="bg-gradient-to-br from-teal/10 to-teal/5 rounded-xl p-6">
                <h3 className="font-semibold text-charcoal mb-2">What Happens Next?</h3>
                <ol className="space-y-3 text-slate">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      1
                    </span>
                    <span>We'll review your information and respond within 24 hours</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      2
                    </span>
                    <span>Schedule a free 30-minute consultation to discuss your goals</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      3
                    </span>
                    <span>Receive a custom marketing plan tailored to your business</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-off-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Prefer to Talk First?
            </h2>
            <p className="text-lg text-slate mb-8">
              No problem! Send us an email or give us a call during business hours. We're here to answer any questions about our services, pricing, or process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center bg-teal hover:bg-teal-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
                Email Us
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center bg-transparent hover:bg-off-white text-charcoal font-semibold py-3 px-6 rounded-lg border-2 border-charcoal transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                Call Us
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
