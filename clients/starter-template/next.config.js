/* eslint-env node */
/**
 * @file clients/starter-template/next.config.js
 * @summary Next.js config — standalone output for Docker, bundle budgets, i18n.
 * @see docs/adr/0004-dockerfile-standalone-output.md
 */

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Bundle analyzer (optional, enabled via ANALYZE=true)
const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({
        enabled: true,
      })
    : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  transpilePackages: [
    '@repo/ui',
    '@repo/utils',
    '@repo/infra',
    '@repo/types',
    '@repo/features',
    '@repo/page-templates',
    '@repo/marketing-components',
    '@repo/infrastructure-ui',
  ],
  typescript: { ignoreBuildErrors: false },
  // Task 4.1: Enable `use cache` directive (Next.js 16 cache directives).
  // cacheComponents: cache React Server Component render output between requests.
  // dynamicIO: enforce explicit caching — `use cache` or `noStore()` per data fetch.
  //   NOTE: dynamicIO disabled — requires all data access in <Suspense>/<use cache>;
  //   re-enable once pages explicitly opt-in to caching strategy (Task 4.1).
  experimental: {
    // cacheComponents and dynamicIO require pages to be cache-annotated with 'use cache'
    // or data fetching wrapped in <Suspense>. Disabled until Task 4.1 annotations are done.
    // cacheComponents: true,
    // dynamicIO: true,
    // Optimize barrel file imports — rewrites named imports to direct file paths.
    // Fixes server/client boundary issues with @repo/* barrel files.
    optimizePackageImports: [
      '@repo/ui',
      '@repo/features',
      '@repo/page-templates',
      '@repo/marketing-components',
      '@repo/infrastructure-ui',
    ],
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
