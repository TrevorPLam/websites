/* eslint-env node */
/**
 * @file clients/starter-template/next.config.js
 * @summary Next.js config — standalone output for Docker, bundle budgets.
 * @see docs/adr/0004-dockerfile-standalone-output.md
 */

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
  ],
  typescript: { ignoreBuildErrors: false },
};

module.exports = nextConfig;
