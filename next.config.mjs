import createMDX from '@next/mdx'
import { withSentryConfig } from '@sentry/nextjs'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'

let withBundleAnalyzer = (config) => config
if (process.env.ANALYZE === 'true') {
  try {
    // @ts-ignore - optional dependency for bundle analysis, may not be installed
    const bundleAnalyzer = (await import('@next/bundle-analyzer')).default
    withBundleAnalyzer = bundleAnalyzer({ enabled: true })
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Bundle analyzer unavailable, skipping analysis', error)
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    formats: ['image/webp'],
    remotePatterns: [],
    // Cloudflare Pages doesn't support the default Next.js Image Optimization API
    // Use unoptimized images or set up a custom loader
    unoptimized: process.env.CLOUDFLARE_BUILD === 'true',
  },
  // Security: Disable public source maps (Issue #032 fixed)
  // Source maps uploaded to Sentry via hideSourceMaps config below
  productionBrowserSourceMaps: false,
  // Ensure output is compatible with Cloudflare Pages
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: false,
        },
      ],
    ],
  },
})

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
  // Upload source maps to Sentry for debugging
  widenClientFileUpload: true,
}

const compiledConfig = withBundleAnalyzer(withMDX(nextConfig))
const sentryNextConfig = {
  // Hide source maps from public (upload to Sentry only)
  hideSourceMaps: true,
  disableLogger: true,
}

export default withSentryConfig(compiledConfig, sentryWebpackPluginOptions, sentryNextConfig)
