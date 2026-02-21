import type { NextConfig } from 'next';

const config: NextConfig = {
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
  experimental: {
    // Optimize barrel file imports — rewrites named imports to direct file paths.
    // Fixes server/client boundary issues with @repo/* barrel files in transpilePackages.
    optimizePackageImports: [
      '@repo/ui',
      '@repo/features',
      '@repo/page-templates',
      '@repo/marketing-components',
    ],
  },
};

export default config;
