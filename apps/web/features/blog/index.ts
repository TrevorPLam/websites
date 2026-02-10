/**
 * @file apps/web/features/blog/index.ts
 * @role runtime
 * @summary Blog feature public exports.
 *
 * @entrypoints
 * - Module barrel
 *
 * @exports
 * - blog data helpers
 * - blog image helpers
 * - BlogPostContent
 *
 * @depends_on
 * - Internal: ./lib/blog
 * - Internal: ./lib/blog-images
 * - Internal: ./components/BlogPostContent
 *
 * @used_by
 * - Blog routes and sitemap/search
 *
 * @runtime
 * - environment: shared
 * - side_effects: none
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

export * from './lib/blog';
export * from './lib/blog-images';
export { default as BlogPostContent } from './components/BlogPostContent';
