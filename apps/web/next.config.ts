/**
 * @file apps/web/next.config.ts
 * @summary Next.js configuration for the web application.
 * @description Standalone output configuration for deployment optimization.
 * @security None - Configuration file only
 * @requirements none
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
