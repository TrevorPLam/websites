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
  experimental: {
    cacheComponents: true,
    dynamicIO: true,
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
