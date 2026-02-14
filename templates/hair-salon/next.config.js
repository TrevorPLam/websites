

/** @type {import('next').NextConfig} */
const nextConfig = {
  // [Task 0.4.1] Enable standalone output for Docker deployments
  output: 'standalone',
  // [Task 1.5.4] Suppress X-Powered-By header to avoid tech stack disclosure
  poweredByHeader: false,
  // Include all workspace packages that need transpilation
  transpilePackages: ['@repo/ui', '@repo/utils', '@repo/infra', '@repo/shared'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
