import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  reactCompiler: {
    compilationMode: 'annotation',
  },
  output: 'standalone',
  transpilePackages: [
    '@repo/ui',
    '@repo/infrastructure',
    '@repo/infrastructure/integrations',
    '@repo/infrastructure/layout',
    '@repo/infrastructure/security',
    '@repo/infrastructure/ui',
    '@repo/marketing-components',
    '@repo/page-templates',
    '@repo/types',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '*.youragency.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ];
  },
  optimizePackageImports: ['@repo/ui', '@repo/integrations-analytics', 'date-fns'],
  experimental: {
    optimisticClientCache: true,
    typedRoutes: true,
    instrumentationHook: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    dirs: ['app'],
    ignoreDuringBuilds: false,
  },
};

export default withBundleAnalyzer(nextConfig);
