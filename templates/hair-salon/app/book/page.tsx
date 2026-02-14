// File: app/book/page.tsx  [TRACE:FILE=app.bookingPage]
// Purpose: Booking page providing appointment scheduling interface with booking form,
//          business hours information, cancellation policy, and contact alternatives.
//          Integrates with the booking feature for form handling and submission.
//
// Exports / Entry: BookPage component, metadata export
// Used by: Next.js for the /book route
//
// Invariants:
// - Booking form must be the primary focus (2/3 column width on desktop)
// - Business hours and policy information must be visible for user context
// - Contact fallback must be provided for users who prefer phone booking
// - Page must be fully responsive with mobile-first design
//
// Status: @public
// Features:
// - [FEAT:BOOKING] Appointment scheduling interface
// - [FEAT:UX] Responsive layout with form and information sidebar
// - [FEAT:BUSINESS] Hours, policy, and contact information display

import type { Metadata } from 'next';
import { Container, Section, Card } from '@repo/ui';
import { Clock, Scissors } from 'lucide-react';
import { BookingForm } from '@/features/booking';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Schedule your next haircut, color, or style appointment online.',
};

// [TRACE:FUNC=app.BookPage]
// [FEAT:BOOKING] [FEAT:UX] [FEAT:BUSINESS]
// NOTE: Booking interface - balances form functionality with business information for conversion.
export default function BookPage() {
  return (
    <div className="min-h-screen bg-muted">
      {/* Hero */}
      <section className="bg-secondary text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Visit</h1>
            <p className="text-xl text-white/80">
              Select your service and preferred time. We&apos;ll confirm your appointment shortly.
            </p>
          </div>
        </Container>
      </section>

      <Section className="py-12">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <BookingForm />
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card variant="service" className="bg-primary/5 border-primary/20">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Hours of Operation
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex justify-between">
                    <span>Monday</span>
                    <span className="font-semibold">Closed</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tue - Fri</span>
                    <span className="font-semibold">9am - 8pm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">9am - 6pm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">10am - 4pm</span>
                  </li>
                </ul>
              </Card>

              <Card variant="default">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-primary" />
                  Cancellation Policy
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We understand that things come up. If you need to cancel or reschedule, please let
                  us know at least 24 hours in advance to avoid a cancellation fee.
                </p>
              </Card>

              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                <h3 className="font-bold text-foreground mb-2">Prefer to call?</h3>
                <p className="text-2xl font-bold text-primary mb-1">(555) 123-4567</p>
                <p className="text-sm text-slate-500">
                  We&apos;re available during business hours.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
