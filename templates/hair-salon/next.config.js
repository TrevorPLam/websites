/**
 * @type {import('next').NextConfig}
 * [Task 0.16] Standalone output required for Docker deployments.
 * Bundles prod deps into .next/standalone for minimal container size (~180MB).
 * Windows: local `next build` may EPERM on symlinks; use `next dev` or build in Docker.
 * See: docs/adr/0004-dockerfile-standalone-output.md, docs/deployment/docker.md
 */
const nextConfig = {
  output: 'standalone',
  // [Task 1.5.4] Suppress X-Powered-By header to avoid tech stack disclosure
  poweredByHeader: false,
  // Include all workspace packages that need transpilation
  transpilePackages: ['@repo/ui', '@repo/utils', '@repo/infra', '@repo/integrations-analytics', '@repo/integrations-hubspot', '@repo/integrations-supabase', '@repo/shared'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
