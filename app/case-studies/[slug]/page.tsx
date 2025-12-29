import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowLeft, TrendingUp, Building2, Clock, CheckCircle2 } from 'lucide-react'
import { getCaseStudyBySlug, caseStudies } from '@/lib/case-studies'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudyBySlug(params.slug)

  if (!study) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: `${study.title} | Case Studies | Your Dedicated Marketer`,
    description: study.description,
  }
}

export default function CaseStudyPage({ params }: Props) {
  const study = getCaseStudyBySlug(params.slug)

  if (!study) {
    notFound()
  }

  // Structured data for case study
  const caseStudyStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Service',
      name: 'Digital Marketing Services',
      provider: {
        '@type': 'Organization',
        name: 'Your Dedicated Marketer',
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    },
    author: {
      '@type': 'Person',
      name: study.testimonial.author,
      jobTitle: study.testimonial.position,
      worksFor: {
        '@type': 'Organization',
        name: study.client,
      },
    },
    reviewBody: study.testimonial.quote,
    name: study.title,
    description: study.description,
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyStructuredData) }}
      />

      {/* Back Link */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Building2 className="w-4 h-4" />
                <span>{study.industry}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span>{study.duration}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {study.title}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {study.description}
            </p>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              The Results
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {study.results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 border border-purple-100"
                >
                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {result.value}
                      </div>
                      <div className="text-sm font-semibold text-purple-600 mb-2">
                        {result.metric}
                      </div>
                      <div className="text-gray-600">
                        {result.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              The Challenge
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>{study.challenge}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Solution
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 mb-8">
              <p>{study.solution}</p>
            </div>

            {/* Services Used */}
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                Services Implemented
              </h3>
              <div className="flex flex-wrap gap-3">
                {study.services.map((service) => (
                  <span
                    key={service}
                    className="px-4 py-2 bg-white text-gray-800 font-medium rounded-lg border border-blue-200"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6 opacity-50">"</div>
            <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
              {study.testimonial.quote}
            </blockquote>
            <div className="border-t border-white/30 pt-8">
              <div className="font-semibold text-xl mb-1">
                {study.testimonial.author}
              </div>
              <div className="text-blue-100">
                {study.testimonial.position}
              </div>
              <div className="text-blue-100">
                {study.client}
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
              Ready to Achieve Similar Results?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's discuss how we can create a custom strategy for your business.
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
                href="/case-studies"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                View More Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
