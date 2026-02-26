/**
 * @file apps/portal/next.config.ts
 * @summary Next.js configuration for the portal application with performance and security optimizations.
 * @description Enables PPR, React Compiler, and Turbopack with custom image loader and security headers.
 * @security No secrets in config; security headers prevent clickjacking and content-type sniffing.
 * @adr none
 * @requirements DOMAIN-5-001, DOMAIN-13-001
 */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    ppr: true, // Enable Partial Prerendering (Next.js 16)
    reactCompiler: true, // Enable React Compiler (Next.js 16)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    loader: 'custom',
    loaderFile: './src/lib/supabase-image-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
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
};

export default nextConfig;
