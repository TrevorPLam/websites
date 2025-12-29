import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Building2 } from 'lucide-react'
import { caseStudies } from '@/lib/case-studies'

export const metadata: Metadata = {
  title: 'Case Studies | Your Dedicated Marketer',
  description: 'Explore our success stories and see how we\'ve helped businesses like yours achieve remarkable growth through strategic digital marketing.',
}

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Results from Real Clients
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Don't just take our word for it. See how we've helped businesses across industries
              achieve measurable growth through strategic digital marketing.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <Link
                key={study.id}
                href={`/case-studies/${study.slug}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  {/* Industry Badge */}
                  <div className="flex items-center gap-2 text-sm text-purple-600 mb-4">
                    <Building2 className="w-4 h-4" />
                    <span>{study.industry}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {study.title}
                  </h2>

                  {/* Client */}
                  <p className="text-gray-600 mb-4">{study.client}</p>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{study.description}</p>

                  {/* Key Result */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {study.results[0].value}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {study.results[0].description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.services.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 transition-all">
                    Read Full Case Study
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's discuss how we can help you achieve similar results for your business.
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
