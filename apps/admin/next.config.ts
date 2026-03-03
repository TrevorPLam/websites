/**
 * @file apps/admin/next.config.ts
 * @summary Next.js 16 configuration for admin dashboard with PPR and React Compiler.
 * @description Enables experimental features, image optimization, and workspace package transpilation.
 * @security none
 * @adr none
 * @requirements TASK-034
 */

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    ppr: true,
    reactCompiler: true,
    turbo: {
      loaders: {
        ".svg": ["@svgr/webpack"],
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["@repo/ui", "@repo/types", "@repo/core-engine"],
};

export default config;
