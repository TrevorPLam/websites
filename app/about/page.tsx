import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Users, TrendingUp, Award, Heart, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Your Dedicated Marketer',
  description: 'Learn about Your Dedicated Marketer - your partner in digital marketing success. Discover our story, values, and proven approach to growing businesses online.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Partner in Digital Marketing Success
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We're not just another marketing agency. We're your dedicated team, committed to understanding your business and driving real, measurable growth.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p>
                Your Dedicated Marketer was born from a simple observation: small and medium-sized businesses
                deserve the same level of marketing expertise as large corporations, without the enterprise price tag.
              </p>
              <p>
                We saw too many talented business owners struggling to navigate the complex world of digital marketing.
                They were spending money on tactics that didn't work, or worse, not investing in marketing at all because
                they didn't know where to start.
              </p>
              <p>
                That's why we created a different kind of marketing agency—one that acts as an extension of your team,
                not just a vendor. We take the time to understand your business, your customers, and your goals. Then we
                build and execute strategies that actually move the needle.
              </p>
              <p>
                Today, we've helped hundreds of businesses increase their online visibility, generate more qualified leads,
                and achieve sustainable growth. But what makes us most proud isn't just the results—it's the long-term
                partnerships we've built along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client-First Mindset</h3>
              <p className="text-gray-600">
                Your success is our success. We make decisions based on what's best for your business,
                not what's easiest for us.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Results-Driven</h3>
              <p className="text-gray-600">
                We're obsessed with metrics and ROI. Every strategy we implement is measured,
                tested, and optimized for maximum impact.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                No smoke and mirrors. We provide clear reporting, honest feedback, and straightforward
                communication every step of the way.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Partnership Approach</h3>
              <p className="text-gray-600">
                We're not just a service provider—we're your dedicated marketing team. We collaborate,
                educate, and grow together.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expertise</h3>
              <p className="text-gray-600">
                We stay on the cutting edge of digital marketing. Our team continuously learns and
                adapts to bring you the latest strategies that work.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategic Thinking</h3>
              <p className="text-gray-600">
                We don't just execute tactics—we develop comprehensive strategies aligned with your
                long-term business goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Approach
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Discovery & Strategy</h3>
                  <p className="text-gray-600">
                    We start by deeply understanding your business, target audience, competitive landscape,
                    and goals. This foundation informs every decision we make.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Plan Development</h3>
                  <p className="text-gray-600">
                    We create a tailored marketing plan that combines the right channels, tactics, and
                    messaging to reach your ideal customers and drive conversions.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Implementation & Execution</h3>
                  <p className="text-gray-600">
                    Our team gets to work implementing your strategy with precision and care. We handle all
                    the details so you can focus on running your business.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Measure & Optimize</h3>
                  <p className="text-gray-600">
                    We continuously track performance, analyze data, and refine our approach. Marketing is
                    never "set it and forget it"—we're always finding ways to improve.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Report & Communicate</h3>
                  <p className="text-gray-600">
                    You'll never wonder what we're doing or how it's performing. We provide regular reports,
                    insights, and recommendations to keep you informed and engaged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Track Record
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Clients Served</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">250%</div>
                <div className="text-blue-100">Avg. ROI Increase</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10M+</div>
                <div className="text-blue-100">Leads Generated</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Client Retention</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's talk about your goals and how we can help you achieve them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                View Our Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
