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
};

export default config;
