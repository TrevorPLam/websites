// File: templates/hair-salon/features/blog/lib/blog.ts  [TRACE:FILE=templates.hair-salon.features.blog.blog]
// Purpose: Backward-compatible adapter wrapper for extracted blog feature.
//          Bridges the old template-specific blog API to the new configurable
//          blog feature from @repo/features/blog. Maintains backward compatibility
//          while using the extracted feature implementation.
//
// Exports / Entry: Blog API functions (getAllPosts, getPostBySlug, etc.), BlogPost type
// Used by: Blog pages, search functionality
//
// Invariants:
// - Must maintain backward compatibility with existing template usage
// - Must initialize blog feature with MDX source on first access
// - Must convert template-specific config to BlogFeatureConfig
//
// Status: @public (template-specific adapter)
// Features:
// - [FEAT:BLOG] MDX blog post parsing and management
// - [FEAT:ARCHITECTURE] Backward-compatible adapter pattern

import {
  initializeBlog,
  createBlogConfig,
  getAllPosts as getAllPostsFromFeature,
  getPostBySlug as getPostBySlugFromFeature,
  getPostSlugs as getPostSlugsFromFeature,
  getFeaturedPosts as getFeaturedPostsFromFeature,
  getPostsByCategory as getPostsByCategoryFromFeature,
  getAllCategories as getAllCategoriesFromFeature,
  type BlogPost,
} from '@repo/features/blog';
import siteConfig from '@/site.config';

// Initialize blog feature on module load
let initialized = false;

function ensureInitialized(): void {
  if (initialized) {
    return;
  }

  const config = createBlogConfig({
    type: 'mdx',
    options: {
      contentDirectory: 'content/blog',
      extension: '.mdx',
    },
    defaultAuthor: `${siteConfig.name} Team`,
    defaultCategory: 'Hair Care',
  });

  initializeBlog(config);
  initialized = true;
}

// Re-export BlogPost type for backward compatibility
export type { BlogPost };

/**
 * Get all blog posts sorted by date (newest first)
 * Backward-compatible wrapper around extracted feature
 */
export function getAllPosts(): BlogPost[] {
  ensureInitialized();
  return getAllPostsFromFeature();
}

/**
 * Get a single blog post by its slug
 * Backward-compatible wrapper around extracted feature
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  ensureInitialized();
  return getPostBySlugFromFeature(slug);
}

/**
 * Get all post slugs
 * Backward-compatible wrapper around extracted feature
 */
export function getPostSlugs(): string[] {
  ensureInitialized();
  return getPostSlugsFromFeature();
}

/**
 * Get posts marked as featured
 * Backward-compatible wrapper around extracted feature
 */
export function getFeaturedPosts(): BlogPost[] {
  ensureInitialized();
  return getFeaturedPostsFromFeature();
}

/**
 * Get posts by category
 * Backward-compatible wrapper around extracted feature
 */
export function getPostsByCategory(category: string): BlogPost[] {
  ensureInitialized();
  return getPostsByCategoryFromFeature(category);
}

/**
 * Get all unique categories
 * Backward-compatible wrapper around extracted feature
 */
export function getAllCategories(): string[] {
  ensureInitialized();
  return getAllCategoriesFromFeature();
}
