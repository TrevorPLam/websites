// File: app/contact/page.tsx  [TRACE:FILE=app.contact.page]
// Purpose: Contact page providing customer communication interface with contact form,
//          business information, hours, and rescheduling options. Integrates with contact
//          feature for form handling and error boundary protection.
//
// Exports / Entry: ContactPage component, metadata export
// Used by: Next.js app router for /contact route
//
// Invariants:
// - Contact form must be primary focus with error boundary protection
// - Business information must be complete and accurate from site config
// - All contact methods must be accessible and functional
// - Rescheduling policy must be clearly communicated
// - Page must be fully responsive with mobile-first design
//
// Status: @public
// Features:
// - [FEAT:CONTACT] Customer communication interface
// - [FEAT:BUSINESS] Hours, location, and contact information display
// - [FEAT:ERROR_HANDLING] Error boundary protection for form loading
// - [FEAT:ACCESSIBILITY] Accessible contact methods and ARIA labels
// - [FEAT:RESPONSIVE] Mobile-first responsive design

import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { Container, Section, Card } from '@repo/ui';
import { ContactForm } from '@/features/contact';
import ErrorBoundary from '@/components/ErrorBoundary';
import siteConfig from '@/site.config';

const { contact } = siteConfig;

// [TRACE:BLOCK=app.contact.metadata]
// [FEAT:SEO]
// NOTE: SEO-optimized metadata for contact page - targets appointment booking and customer service searches.
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Book your appointment or get in touch with our salon team.',
};

// [TRACE:FUNC=app.contact.ContactPage]
// [FEAT:CONTACT] [FEAT:BUSINESS] [FEAT:ERROR_HANDLING]
// NOTE: Main contact page component - provides form, business info, and rescheduling options.
export default function ContactPage() {
  return (
    <>
      {/* [TRACE:BLOCK=app.contact.hero] */}
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-secondary to-secondary/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get In Touch</h1>
            <p className="text-xl text-white/80">
              Ready for a fresh look? Schedule your appointment or send us a message.
            </p>
          </div>
        </Container>
      </Section>

      {/* [TRACE:BLOCK=app.contact.formSection] */}
      {/* [FEAT:CONTACT] [FEAT:ERROR_HANDLING] */}
      {/* Contact Form Section */}
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Have a question about our services? Fill out the form below and we&apos;ll get back
                to you shortly.
              </p>
              <ErrorBoundary
                fallback={
                  <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
                    We&apos;re having trouble loading the form. Please email us at{' '}
                    <a
                      href={`mailto:${contact.email}`}
                      className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                    >
                      {contact.email}
                    </a>
                    .
                  </div>
                }
              >
                <ContactForm />
              </ErrorBoundary>
            </div>

            {/* [TRACE:BLOCK=app.contact.businessInfo] */}
            {/* [FEAT:BUSINESS] */}
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Salon Info</h2>

              <div className="space-y-6 mb-8">
                {contact.address && (
                  <Card variant="default">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                        <p className="text-muted-foreground">{contact.address.street}</p>
                        <p className="text-muted-foreground">
                          {contact.address.city}, {contact.address.state} {contact.address.zip}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {contact.phone && (
                  <Card variant="default">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                        <a
                          href={`tel:${contact.phone.replace(/\D/g, '')}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  </Card>
                )}

                <Card variant="default">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </Card>

                {contact.hours && contact.hours.length > 0 && (
                  <Card variant="default">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                        <div className="grid grid-cols-2 gap-x-8 text-muted-foreground">
                          {contact.hours.map((slot) => (
                            <React.Fragment key={slot.label}>
                              <span>{slot.label}:</span>
                              <span>{slot.hours}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* [TRACE:BLOCK=app.contact.reschedule] */}
      {/* [FEAT:BUSINESS] */}
      {/* FAQ Section */}
      <Section className="bg-muted">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Need to Reschedule?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Please give us a call at least 24 hours in advance to avoid cancellation fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                  Call Now
                </a>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
