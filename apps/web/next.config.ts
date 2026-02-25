/**
 * @file apps/web/next.config.ts
 * @summary Next.js configuration for the web application.
 * @description Configuration with src directory, PPR enabled, and optimization settings.
 * @security None - Configuration file only
 * @requirements TASK-033 FSD structure implementation
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    ppr: true, // Enable Partial Prerendering
  },
  images: {
    domains: ['localhost'],
  },
  // Use src directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Enable React strict mode
  reactStrictMode: true,
  // Enable SWC minification
  swcMinify: true,
}

module.exports = nextConfig
