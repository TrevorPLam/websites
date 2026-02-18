// File: packages/features/src/blog/lib/blog-images.ts  [TRACE:FILE=packages.features.blog.blogImages]
// Purpose: Blog image utilities providing image URL resolution and optimization
//          for blog posts. Handles per-post image assets with fallback to default OG image.
//
// Exports / Entry: getBlogPostImageUrl function
// Used by: Blog post pages, Open Graph image generation, structured data
//
// Invariants:
// - Image paths must be relative to public directory
// - Must support multiple image formats (jpg, jpeg, png, webp, svg)
// - Must fallback gracefully when images don't exist
// - Base URL must be normalized (no trailing slash)
//
// Status: @public
// Features:
// - [FEAT:BLOG] Blog image management
// - [FEAT:SEO] Open Graph image support
// - [FEAT:PERFORMANCE] Image format optimization

import fs from 'fs';
import path from 'path';

const BLOG_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg'] as const;
const DEFAULT_BLOG_IMAGE = 'og-image.jpg';

/**
 * Normalizes base URL by removing trailing slash
 */
function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}

/**
 * Checks if public asset exists
 */
function hasPublicAsset(relativePath: string): boolean {
  const absolutePath = path.join(process.cwd(), 'public', relativePath);
  return fs.existsSync(absolutePath);
}

/**
 * Get blog post image URL
 * Prefers per-post assets when available, falls back to default OG image
 *
 * @param baseUrl - Site base URL (e.g., 'https://example.com')
 * @param slug - Blog post slug
 * @returns Image URL or null if no image found
 *
 * @example
 * const imageUrl = getBlogPostImageUrl('https://example.com', 'hair-care-tips')
 * // Returns: 'https://example.com/blog/hair-care-tips.jpg' or null
 */
// [TRACE:FUNC=packages.features.blog.getBlogPostImageUrl]
// [FEAT:BLOG] [FEAT:SEO] [FEAT:PERFORMANCE]
// NOTE: Image URL resolution - finds blog post images with format fallback and default image support.
export function getBlogPostImageUrl(baseUrl: string, slug: string): string | null {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  // Prefer per-post assets when available
  for (const extension of BLOG_IMAGE_EXTENSIONS) {
    const candidate = `blog/${slug}.${extension}`;
    if (hasPublicAsset(candidate)) {
      return `${normalizedBaseUrl}/${candidate}`;
    }
  }

  // Fallback to default OG image
  if (hasPublicAsset(DEFAULT_BLOG_IMAGE)) {
    return `${normalizedBaseUrl}/${DEFAULT_BLOG_IMAGE}`;
  }

  return null;
}
