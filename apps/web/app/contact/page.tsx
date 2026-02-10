/**
 * @file apps/web/app/contact/page.tsx
 * @role runtime
 * @summary Contact page with form, salon info, and reschedule CTA.
 *
 * @entrypoints
 * - Route: /contact
 *
 * @exports
 * - metadata
 * - default ContactPage
 *
 * @depends_on
 * - External: next (Metadata)
 * - External: lucide-react
 * - Internal: @repo/ui (Container, Section, Card)
 * - Internal: @/components/ContactForm
 * - Internal: @/components/ErrorBoundary
 *
 * @used_by
 * - Next.js app router
 *
 * @runtime
 * - environment: server
 * - side_effects: none (form handled by ContactForm)
 *
 * @data_flow
 * - inputs: contact form fields
 * - outputs: form UI and salon contact info
 *
 * @invariants
 * - CONTACT_EMAIL should be valid and monitored
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @verification
 * - Visit /contact and confirm form + fallback render.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

import type { Metadata } from 'next';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { Container, Section, Card } from '@repo/ui';
import { ContactForm } from '@/features/contact';
import ErrorBoundary from '@/components/ErrorBoundary';

const CONTACT_EMAIL = 'contact@hairsalontemplate.com';

export const metadata: Metadata = {
  title: 'Contact Us | Hair Salon Template',
  description: 'Book your appointment or get in touch with our salon team.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get In Touch</h1>
            <p className="text-xl text-white/80">
              Ready for a fresh look? Schedule your appointment or send us a message.
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
                Have a question about our services? Fill out the form below and we&apos;ll get back
                to you shortly.
              </p>
              <ErrorBoundary
                fallback={
                  <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
                    We&apos;re having trouble loading the form. Please email us at{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </div>
                }
              >
                <ContactForm />
              </ErrorBoundary>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-charcoal mb-6">Salon Info</h2>

              <div className="space-y-6 mb-8">
                <Card variant="default">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Visit Us</h3>
                      <p className="text-slate">123 Salon Street</p>
                      <p className="text-slate">Style City, ST 12345</p>
                    </div>
                  </div>
                </Card>

                <Card variant="default">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Call Us</h3>
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
                      <Clock className="w-6 h-6 text-teal" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Hours</h3>
                      <div className="grid grid-cols-2 gap-x-8 text-slate">
                        <span>Tue - Fri:</span>
                        <span>10am - 7pm</span>
                        <span>Saturday:</span>
                        <span>9am - 5pm</span>
                        <span>Sun - Mon:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-off-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Need to Reschedule?</h2>
            <p className="text-lg text-slate mb-8">
              Please give us a call at least 24 hours in advance to avoid cancellation fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center bg-teal hover:bg-teal-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                Call Now
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
