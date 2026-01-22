import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { getPublicBaseUrl } from '@/lib/env.public'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'

const BlogPostContent = dynamic(() => import('@/components/BlogPostContent'), {
  loading: () => <div className="sr-only">Loading article content…</div>,
  ssr: true,
})

const getPostDateValues = (dateValue: string) => {
  const parsed = new Date(dateValue)
  const hasValidDate = !Number.isNaN(parsed.getTime())

  return {
    hasValidDate,
    isoDate: hasValidDate ? parsed.toISOString() : null,
    formattedDate: hasValidDate
      ? parsed.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Unknown date',
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Blog | Your Dedicated Marketer`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const baseUrl = getPublicBaseUrl().replace(/\/$/, '')
  // WHY: Guard against malformed frontmatter dates so rendering remains stable.
  const dateValues = getPostDateValues(post.date)

  // Structured data for article
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${baseUrl}/blog/${post.slug}.jpg`,
    ...(dateValues.hasValidDate && dateValues.isoDate
      ? { datePublished: dateValues.isoDate, dateModified: dateValues.isoDate }
      : {}),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'Your Dedicated Marketer Blog',
      url: `${baseUrl}/blog`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Dedicated Marketer',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    articleSection: post.category,
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      {/* Back Link */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category */}
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-6">
              {post.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>
                  {dateValues.formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{post.readingTime}</span>
              </div>
              <div className="text-gray-600">
                By {post.author}
              </div>
            </div>

            {/* Content */}
            <BlogPostContent content={post.content} />
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Implement These Strategies?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let our team handle your marketing while you focus on growing your business.
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
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                Read More Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
