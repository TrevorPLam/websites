import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getAllCategories } from '@/lib/blog'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Container } from '@repo/ui'

export const metadata: Metadata = {
  title: 'Blog | Hair Salon Template',
  description: 'Hair care tips, trends, and salon news.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal via-slate-800 to-teal/20 text-white py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Salon Tips & Trends
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Expert advice on maintaining your look, product recommendations, and the latest style trends.
            </p>
          </div>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-slate-200">
          <Container className="py-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/blog"
                className="px-4 py-2 bg-charcoal text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className="px-4 py-2 bg-off-white text-charcoal rounded-full font-medium hover:bg-slate-200 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-20 bg-off-white">
        <Container>
          {posts.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-slate text-lg">
                No blog posts yet. Check back soon for hair care tips!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    {/* Category Badge */}
                    <div className="inline-block px-3 py-1 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-4">
                      {post.category}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-charcoal mb-3 group-hover:text-teal transition-colors">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate mb-6 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-slate/70 mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-teal font-semibold group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
              Ready for a Transformation?
            </h2>
            <p className="text-xl text-slate mb-8">
              Book your appointment today and let our experts take care of you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark transition-all shadow-lg hover:shadow-xl"
            >
              Book Appointment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
