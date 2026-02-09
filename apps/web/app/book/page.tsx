import type { Metadata } from 'next'
import { Container, Section, Card, Button, Input, Select, Textarea } from '@repo/ui'
import { Calendar, Clock, Scissors } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Book an Appointment | Hair Salon Template',
  description: 'Schedule your next haircut, color, or style appointment online.',
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero */}
      <section className="bg-charcoal text-white py-16">
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
              <Card variant="default" className="p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-teal" />
                  Request an Appointment
                </h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <Input placeholder="Jane" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <Input type="email" placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <Input type="tel" placeholder="(555) 123-4567" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service Type
                    </label>
                    <Select>
                      <option>Haircut & Style</option>
                      <option>Color & Highlights</option>
                      <option>Treatment</option>
                      <option>Special Occasion</option>
                      <option>Consultation</option>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Preferred Date
                      </label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Preferred Time
                      </label>
                      <Select>
                        <option>Morning (9am - 12pm)</option>
                        <option>Afternoon (12pm - 4pm)</option>
                        <option>Evening (4pm - 8pm)</option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes for Stylist (Optional)
                    </label>
                    <Textarea placeholder="Any specific requests or hair history..." rows={3} />
                  </div>

                  <Button variant="primary" size="large" className="w-full">
                    Request Appointment
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center mt-4">
                    By booking, you agree to our cancellation policy (24-hour notice required).
                  </p>
                </form>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card variant="service" className="bg-teal/5 border-teal/20">
                <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal" />
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
                <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-teal" />
                  Cancellation Policy
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We understand that things come up. If you need to cancel or reschedule, please let us know at least 24 hours in advance to avoid a cancellation fee.
                </p>
              </Card>

              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                <h3 className="font-bold text-charcoal mb-2">Prefer to call?</h3>
                <p className="text-2xl font-bold text-teal mb-1">(555) 123-4567</p>
                <p className="text-sm text-slate-500">We&apos;re available during business hours.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
