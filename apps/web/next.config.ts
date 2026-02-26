/**
 * @file apps/web/next.config.ts
 * @summary Next.js 16.1.5 configuration for the web application.
 * @description Configuration with PPR enabled, React Compiler, and Next.js 16 optimizations.
 * @security None - Configuration file only
 * @requirements README.md technology stack compliance
 */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // PPR and React Compiler require Next.js 16 canary
    // ppr: true, // Enable Partial Prerendering (Next.js 16)
    // reactCompiler: true, // Enable React Compiler (Next.js 16)
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Use src directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Enable React strict mode
  reactStrictMode: true,
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ],
  // Documentation migration redirects
  async redirects() {
    return [
      // Security documentation redirects
      {
        source: '/docs/guides/security/security-implementation-guide',
        destination: '/docs/guides-new/security/security-patterns-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/security/encryption/multi-layer-rate-limiting',
        destination: '/docs/guides-new/security/security-patterns-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/security/authentication/supabase-auth-docs',
        destination: '/docs/guides-new/security/security-patterns-guide',
        permanent: true,
      },
      // Payment documentation redirects
      {
        source: '/docs/guides/payments-billing/stripe-documentation',
        destination: '/docs/guides-new/payments/payment-processing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/payments-billing/stripe-checkout-sessions',
        destination: '/docs/guides-new/payments/payment-processing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/payments-billing/stripe-customer-portal',
        destination: '/docs/guides-new/payments/payment-processing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/payments-billing/stripe-webhook-handler',
        destination: '/docs/guides-new/payments/payment-processing-guide',
        permanent: true,
      },
      // SEO documentation redirects
      {
        source: '/docs/guides/seo-metadata/metadata-generation-system',
        destination: '/docs/guides-new/seo/seo-optimization-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/seo-metadata/dynamic-sitemap-generation',
        destination: '/docs/guides-new/seo/seo-optimization-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/seo-metadata/structured-data-system',
        destination: '/docs/guides-new/seo/seo-optimization-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/seo-metadata/dynamic-og-images',
        destination: '/docs/guides-new/seo/seo-optimization-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/multi-tenant/tenant-metadata-factory',
        destination: '/docs/guides-new/seo/seo-optimization-guide',
        permanent: true,
      },
      // Testing documentation redirects
      {
        source: '/docs/guides/testing/playwright-best-practices',
        destination: '/docs/guides-new/testing/testing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/testing/testing-library-documentation',
        destination: '/docs/guides-new/testing/testing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/testing/vitest-documentation',
        destination: '/docs/guides-new/testing/testing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/testing/e2e-testing-suite-patterns',
        destination: '/docs/guides-new/testing/testing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/testing/axe-core-documentation',
        destination: '/docs/guides-new/testing/testing-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/testing/playwright-documentation',
        destination: '/docs/guides-new/testing/testing-guide',
        permanent: true,
      },
      // Email documentation redirects
      {
        source: '/docs/guides/email/email-package-structure',
        destination: '/docs/guides-new/email/email-architecture-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/email/multi-tenant-email-routing',
        destination: '/docs/guides-new/email/email-architecture-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/email/unified-email-send',
        destination: '/docs/guides-new/email/email-architecture-guide',
        permanent: true,
      },
      {
        source: '/docs/guides/email/email-integration-guide',
        destination: '/docs/guides-new/email/email-architecture-guide',
        permanent: true,
      },
      // AI documentation redirects
      {
        source: '/docs/guides/ai-automation/ai-integration-guide',
        destination: '/docs/guides-new/ai/ai-integration-patterns',
        permanent: true,
      },
      {
        source: '/docs/guides/ai-automation/ide-agentic-setup-guide',
        destination: '/docs/guides-new/ai/ai-integration-patterns',
        permanent: true,
      },
      {
        source: '/docs/guides/best-practices/agentic-development',
        destination: '/docs/guides-new/ai/ai-integration-patterns',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
