/**
 * @file packages/core-engine/src/renderer/ppr-marketing-template.tsx
 * @summary PPR Marketing Page Template with Static Shell + Dynamic Streaming
 * @description Demonstrates Next.js 16 PPR pattern for marketing pages: static pre-rendered shell
 *   with streaming dynamic content. Enables sub-100ms initial loads with personalized content.
 * @security Tenant-scoped data fetching prevents cross-tenant access
 * @requirements TASK-PERF-001: Next.js 16 Cache Components & PPR Optimization
 * @performance LCP <2.5s, INP <200ms, CLS <0.1 through PPR optimization
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { CacheComponent, fetchWithCache } from './CacheComponent';
import { TenantPageCache, TenantComponentCache } from './per-tenant-cache-patterns';

// ─── Types ─────────────────────────────────────────────────────────────────

interface MarketingPageProps {
  params: {
    tenantId: string;
    slug: string;
  };
  searchParams?: {
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
  };
}

interface PageData {
  hero: {
    headline: string;
    subheadline: string;
    cta: {
      text: string;
      url: string;
    };
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
}

// ─── Static Components (Pre-rendered) ──────────────────────────────────────

/**
 * Static Hero Section - Pre-rendered at build time for instant LCP
 */
function StaticHero() {
  return (
    <section className="hero bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 opacity-95">Transform Your Business</h1>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Discover how our platform can revolutionize your workflow and boost productivity by 300%.
        </p>
        {/* CTA placeholder - will be replaced by dynamic content */}
        <div className="w-48 h-12 bg-white/20 rounded-lg mx-auto animate-pulse" />
      </div>
    </section>
  );
}

/**
 * Static Features Section - Pre-rendered with skeleton placeholders
 */
function StaticFeatures() {
  return (
    <section className="features py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="feature-card bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-3 animate-pulse bg-gray-200 h-6 rounded" />
              <p className="text-gray-600 animate-pulse bg-gray-100 h-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Static Testimonials Section - Pre-rendered skeleton
 */
function StaticTestimonials() {
  return (
    <section className="testimonials py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="testimonial-card bg-white p-6 rounded-lg shadow-sm border">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dynamic Components (Streamed) ────────────────────────────────────────

/**
 * Dynamic Hero CTA - Personalized call-to-action based on traffic source
 */
async function DynamicHeroCTA({
  tenantId,
  searchParams,
}: {
  tenantId: string;
  searchParams?: MarketingPageProps['searchParams'];
}) {
  const ctaData = await fetchWithCache(
    `tenant:${tenantId}:hero:cta:${JSON.stringify(searchParams || {})}`,
    async () => {
      // Simulate personalized CTA logic
      const isPaidTraffic = searchParams?.utm_source === 'google' || searchParams?.utm_campaign;

      return {
        text: isPaidTraffic ? 'Start Free Trial' : 'Get Started',
        url: isPaidTraffic ? '/trial' : '/signup',
        variant: isPaidTraffic ? 'primary' : 'secondary',
      };
    },
    'hourly'
  );

  return (
    <a
      href={ctaData.url}
      className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${
        ctaData.variant === 'primary'
          ? 'bg-white text-blue-600 hover:bg-gray-100'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {ctaData.text}
    </a>
  );
}

/**
 * Dynamic Features - Personalized feature highlights
 */
async function DynamicFeatures({ tenantId }: { tenantId: string }) {
  const features = await TenantPageCache.getPageData(tenantId, 'features', async () => [
    {
      title: 'Advanced Analytics',
      description:
        'Get deep insights into your business performance with real-time analytics and custom dashboards.',
      icon: '📊',
    },
    {
      title: 'Team Collaboration',
      description:
        'Seamlessly collaborate with your team members with built-in communication and project management tools.',
      icon: '👥',
    },
    {
      title: 'Security First',
      description:
        'Enterprise-grade security with end-to-end encryption and compliance with industry standards.',
      icon: '🔒',
    },
  ]);

  return (
    <section className="features py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Dynamic Testimonials - Rotating testimonials based on performance
 */
async function DynamicTestimonials({ tenantId }: { tenantId: string }) {
  const testimonials = await TenantPageCache.getPageData(tenantId, 'testimonials', async () => [
    {
      quote:
        "This platform transformed our workflow completely. We've seen a 300% increase in productivity.",
      author: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechCorp',
    },
    {
      quote:
        'The analytics insights are incredible. We can now make data-driven decisions with confidence.',
      author: 'Mike Chen',
      role: 'Head of Operations',
      company: 'DataFlow Inc',
    },
    {
      quote:
        'Security and compliance were our top priorities, and this platform delivers on both fronts.',
      author: 'Emily Rodriguez',
      role: 'CTO',
      company: 'SecureTech',
    },
  ]);

  return (
    <section className="testimonials py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <blockquote className="text-gray-700 mb-4 italic">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Loading Components ───────────────────────────────────────────────────

/**
 * Hero CTA Loading Skeleton
 */
function HeroCTALoading() {
  return <div className="w-48 h-12 bg-white/20 rounded-lg mx-auto animate-pulse" />;
}

/**
 * Features Loading Skeleton
 */
function FeaturesLoading() {
  return (
    <section className="features py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="feature-card bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-3" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Testimonials Loading Skeleton
 */
function TestimonialsLoading() {
  return (
    <section className="testimonials py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="testimonial-card bg-white p-6 rounded-lg shadow-sm border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────

/**
 * PPR Marketing Page Template
 * Demonstrates static shell + dynamic streaming pattern
 */
export default async function MarketingPageTemplate({ params, searchParams }: MarketingPageProps) {
  const { tenantId } = params;

  // Pre-load critical navigation data (static)
  const navigation = await TenantComponentCache.getNavigation(tenantId, async () => ({
    logo: 'Company Logo',
    menu: ['Home', 'Features', 'Pricing', 'Contact'],
  }));

  return (
    <div className="min-h-screen">
      {/* Static Header - Pre-rendered */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="font-bold text-xl">{navigation.logo}</div>
            <ul className="flex space-x-6">
              {navigation.menu.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Static Hero Section - Instant LCP */}
      <StaticHero />

      {/* Dynamic Hero CTA - Personalized and streamed */}
      <div className="hero-cta-overlay">
        <CacheComponent fallback={<HeroCTALoading />}>
          <DynamicHeroCTA tenantId={tenantId} searchParams={searchParams} />
        </CacheComponent>
      </div>

      {/* Dynamic Features - Streamed content */}
      <CacheComponent fallback={<FeaturesLoading />}>
        <DynamicFeatures tenantId={tenantId} />
      </CacheComponent>

      {/* Dynamic Testimonials - Streamed content */}
      <CacheComponent fallback={<TestimonialsLoading />}>
        <DynamicTestimonials tenantId={tenantId} />
      </CacheComponent>

      {/* Static Footer - Pre-rendered */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Company Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Metadata Generation ──────────────────────────────────────────────────

/**
 * Generate SEO metadata for marketing pages
 */
export async function generateMetadata({ params }: MarketingPageProps): Promise<Metadata> {
  const { tenantId, slug } = params;

  // Cache SEO metadata
  const seoData = await fetchWithCache(
    `tenant:${tenantId}:seo:${slug}`,
    async () => ({
      title: 'Transform Your Business | Company Name',
      description:
        'Discover how our platform can revolutionize your workflow and boost productivity by 300%. Start your free trial today.',
      keywords: 'business transformation, productivity, workflow optimization',
      ogImage: '/og-image.png',
    }),
    'daily'
  );

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      images: [{ url: seoData.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: [seoData.ogImage],
    },
  };
}

// ─── Static Generation (SSG) Fallback ─────────────────────────────────────

/**
 * Generate static params for SSG fallback
 * Used when PPR is not available or for static hosting
 */
export async function generateStaticParams() {
  // In a real implementation, this would generate paths for popular pages
  return [
    { tenantId: 'demo', slug: 'home' },
    { tenantId: 'demo', slug: 'features' },
    { tenantId: 'demo', slug: 'pricing' },
  ];
}
