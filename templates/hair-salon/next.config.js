/* eslint-env node */
/* global require, module, process */

/**
 * @type {import('next').NextConfig}
 * [Task 0.16] Standalone output required for Docker deployments.
 * Bundles prod deps into .next/standalone for minimal container size (~180MB).
 * Windows: local `next build` may EPERM on symlinks; use `next dev` or build in Docker.
 * See: docs/adr/0004-dockerfile-standalone-output.md, docs/deployment/docker.md
 *
 * [Task 0.6] Performance baseline & budgets:
 * - Bundle analyzer enabled via ANALYZE=true for JS bundle inspection (@next/bundle-analyzer)
 * - Webpack performance hints set for asset/entry thresholds to flag regressions during build
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ASSET_BUDGET_BYTES = 250 * 1024; // 250KB per asset
const ENTRYPOINT_BUDGET_BYTES = 550 * 1024; // 550KB per entrypoint (after code-splitting)

const nextConfig = {
  output: 'standalone',
  // [Task 1.5.4] Suppress X-Powered-By header to avoid tech stack disclosure
  poweredByHeader: false,
  // Include all workspace packages that need transpilation
  transpilePackages: [
    '@repo/ui',
    '@repo/utils',
    '@repo/infra',
    '@repo/integrations-analytics',
    '@repo/integrations-hubspot',
    '@repo/integrations-supabase',
    '@repo/types',
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.performance = {
      hints: 'warning',
      maxAssetSize: ASSET_BUDGET_BYTES,
      maxEntrypointSize: ENTRYPOINT_BUDGET_BYTES,
    };
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
