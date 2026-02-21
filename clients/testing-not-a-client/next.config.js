/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@repo/ui',
    '@repo/infra',
    '@repo/infra/integrations',
    '@repo/infra/layout',
    '@repo/infra/security',
    '@repo/infra/ui',
    '@repo/marketing-components',
    '@repo/page-templates',
    '@repo/types',
  ],
  optimizePackageImports: ['@repo/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
