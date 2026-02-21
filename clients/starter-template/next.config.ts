import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: [
    '@repo/ui',
    '@repo/features',
    '@repo/page-templates',
    '@repo/marketing-components',
  ],
};

export default config;
