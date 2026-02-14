// File: app/blog/page.tsx  [TRACE:FILE=app.blog.page]
// Purpose: Blog listing page displaying all blog posts with category filtering and search functionality.
//          Provides content discovery through categorized posts, reading time estimates, and
//          conversion CTAs to drive appointment bookings.
//
// Exports / Entry: BlogPage component (default export), metadata export
// Used by: Next.js app router for /blog route
//
// Invariants:
// - Must handle category filtering safely with validation
// - Must display posts in responsive grid layout
// - Must show appropriate empty states for no posts or filtered results
// - All post links must navigate to valid blog post routes
// - Reading time estimates must be accurate and consistent
//
// Status: @public
// Features:
// - [FEAT:BLOG] Blog post listing and discovery
// - [FEAT:SEARCH] Category-based filtering
// - [FEAT:SEO] Optimized metadata for blog content
// - [FEAT:RESPONSIVE] Mobile-first responsive design
// - [FEAT:CONVERSION] Strategic CTAs for appointment booking

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getAllCategories } from '@/features/blog/lib/blog';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Container } from '@repo/ui';

// [TRACE:BLOCK=app.blog.metadata]
// [FEAT:SEO]
// NOTE: SEO-optimized metadata for blog listing page - targets hair care and salon-related searches.
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Hair care tips, trends, and salon news.',
};

// [TRACE:INTERFACE=app.blog.BlogPageProps]
// [FEAT:SEARCH]
// NOTE: Props interface for blog page - supports category filtering through search params.
interface BlogPageProps {
  searchParams?: Promise<{ category?: string }>;
}

// [TRACE:FUNC=app.blog.BlogPage]
// [FEAT:BLOG] [FEAT:SEARCH] [FEAT:RESPONSIVE]
// NOTE: Main blog page component - handles category filtering, post display, and conversion CTAs.
export default async function BlogPage({ searchParams }: BlogPageProps) {
  // [TRACE:BLOCK=app.blog.dataProcessing]
  // [FEAT:SEARCH]
  // NOTE: Data processing and category filtering - safely validates and filters blog posts by category.
  const posts = getAllPosts();
  const categories = getAllCategories();
  const resolvedParams = await searchParams;
  const requestedCategory = resolvedParams?.category?.trim();
  const activeCategory =
    requestedCategory && categories.includes(requestedCategory) ? requestedCategory : undefined;
  const filteredPosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  return (
    <div className="min-h-screen">
      {/* [TRACE:BLOCK=app.blog.hero] */}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-slate-800 to-primary/20 text-white py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Salon Tips & Trends</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Expert advice on maintaining your look, product recommendations, and latest style
              trends.
            </p>
          </div>
        </Container>
      </section>

      {/* [TRACE:BLOCK=app.blog.categories] */}
      {/* [FEAT:SEARCH] */}
      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-slate-200">
          <Container className="py-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  !activeCategory
                    ? 'bg-secondary text-white hover:bg-slate-800'
                    : 'bg-muted text-foreground hover:bg-slate-200'
                }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-secondary text-white hover:bg-slate-800'
                      : 'bg-muted text-foreground hover:bg-slate-200'
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* [TRACE:BLOCK=app.blog.posts] */}
      {/* [FEAT:BLOG] */}
      {/* Blog Posts */}
      <section className="py-20 bg-muted">
        <Container>
          {filteredPosts.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center">
              {activeCategory ? (
                <p className="text-muted-foreground text-lg">
                  No posts found for {activeCategory}. Check back soon for more updates.
                </p>
              ) : (
                <p className="text-muted-foreground text-lg">
                  No blog posts yet. Check back soon for hair care tips!
                </p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    {/* Category Badge */}
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                      {post.category}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary/80 transition-colors">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 line-clamp-3">{post.description}</p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground/70 mb-6">
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
                    <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
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

      {/* [TRACE:BLOCK=app.blog.cta] */}
      {/* [FEAT:CONVERSION] */}
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready for a Transformation?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book your appointment today and let our experts take care of you.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Book Appointment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
