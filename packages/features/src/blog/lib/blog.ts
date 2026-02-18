// File: packages/features/src/blog/lib/blog.ts  [TRACE:FILE=packages.features.blog.blog]
// Purpose: Blog content management system providing unified API for blog post discovery,
//          metadata extraction, and content indexing. Works with any content source
//          via BlogContentSource adapter pattern.
//
// Exports / Entry: Blog API functions (getAllPosts, getPostBySlug, etc.), BlogPost type
// Used by: Blog pages, search functionality, and any blog-related features
//
// Invariants:
// - Content source must be initialized before use
// - All functions must handle errors gracefully
// - Results should be cached when possible for performance
// - Slug normalization must be consistent
//
// Status: @public
// Features:
// - [FEAT:BLOG] Unified blog content management API
// - [FEAT:CONTENT] Multi-source content support
// - [FEAT:PERFORMANCE] Caching and optimization
// - [FEAT:SEO] Metadata extraction and indexing

import { cache } from 'react';
import type { BlogContentSource } from './blog-content-source';
import type { BlogPost } from './blog-types';
import type { BlogFeatureConfig } from './blog-config';
import { createMdxContentSource } from './blog-mdx-source';

/**
 * Global blog content source instance
 * Set via initializeBlog() function
 */
let blogContentSource: BlogContentSource | null = null;

/**
 * Initialize blog feature with content source
 * Must be called before using blog functions
 */
// [TRACE:FUNC=packages.features.blog.initializeBlog]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:ARCHITECTURE]
// NOTE: Initialization - sets up blog feature with content source adapter.
export function initializeBlog(config: BlogFeatureConfig): void {
  switch (config.contentSource.type) {
    case 'mdx':
      blogContentSource = createMdxContentSource(config.contentSource);
      break;
    case 'cms':
      // TODO: Implement CMS adapter (Contentful, Sanity, etc.)
      throw new Error('CMS content source adapter not yet implemented');
    case 'api':
      // TODO: Implement API adapter
      throw new Error('API content source adapter not yet implemented');
    default:
      throw new Error(`Unsupported content source type: ${config.contentSource.type}`);
  }
}

/**
 * Cached wrapper for getAllPosts to enable synchronous access
 * Uses React cache() for build-time caching
 */
const cachedGetAllPosts = cache(async (): Promise<BlogPost[]> => {
  if (!blogContentSource) {
    throw new Error('Blog not initialized. Call initializeBlog() first.');
  }
  return blogContentSource.getAllPosts();
});

/**
 * Get all blog posts sorted by date (newest first)
 * Synchronous version for backward compatibility (uses React cache)
 *
 * @returns Array of blog posts sorted by date descending
 *
 * @throws Error if blog not initialized
 */
// [TRACE:FUNC=packages.features.blog.getAllPosts]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Post retrieval - gets all posts from configured content source with caching.
export function getAllPosts(): BlogPost[] {
  if (!blogContentSource) {
    throw new Error('Blog not initialized. Call initializeBlog() first.');
  }
  // Use cached version for synchronous access (works in Server Components)
  return cachedGetAllPosts() as unknown as BlogPost[];
}

/**
 * Cached wrapper for getPostBySlug
 */
const cachedGetPostBySlug = cache(async (slug: string): Promise<BlogPost | undefined> => {
  if (!blogContentSource) {
    throw new Error('Blog not initialized. Call initializeBlog() first.');
  }
  return blogContentSource.getPostBySlug(slug);
});

/**
 * Get a single blog post by its slug
 * Synchronous version for backward compatibility
 *
 * @param slug - URL slug
 * @returns BlogPost object or undefined if not found
 *
 * @throws Error if blog not initialized
 */
// [TRACE:FUNC=packages.features.blog.getPostBySlug]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Single post retrieval - gets post by slug from configured content source with caching.
export function getPostBySlug(slug: string): BlogPost | undefined {
  return cachedGetPostBySlug(slug) as unknown as BlogPost | undefined;
}

/**
 * Get all post slugs
 * Synchronous version for backward compatibility
 *
 * @returns Array of post slugs
 *
 * @throws Error if blog not initialized
 */
// [TRACE:FUNC=packages.features.blog.getPostSlugs]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Slug retrieval - gets all slugs for static generation.
export function getPostSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map((post) => post.slug);
}

/**
 * Get posts marked as featured
 * Synchronous version for backward compatibility
 *
 * @returns Array of posts where featured === true
 *
 * @throws Error if blog not initialized
 */
// [TRACE:FUNC=packages.features.blog.getFeaturedPosts]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Featured posts - gets featured posts for homepage highlights.
export function getFeaturedPosts(): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.featured);
}

/**
 * Get posts by category
 * Synchronous version for backward compatibility
 *
 * @param category - Category name to filter by
 * @returns Array of posts in the specified category
 *
 * @throws Error if blog not initialized
 */
// [TRACE:FUNC=packages.features.blog.getPostsByCategory]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:SEARCH]
// NOTE: Category filtering - gets posts filtered by category.
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.category === category);
}

/**
 * Get all unique categories
 * Synchronous version for backward compatibility
 *
 * @returns Sorted array of unique category names
 *
 * @throws Error if blog not initialized
 */
// [TRACE:FUNC=packages.features.blog.getAllCategories]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:SEARCH]
// NOTE: Category listing - gets all unique categories for filtering UI.
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = posts.map((post) => post.category);
  return Array.from(new Set(categories)).sort();
}

// Re-export types for convenience
export type { BlogPost } from './blog-types';
export type { BlogFeatureConfig } from './blog-config';
export type { BlogContentSource, BlogContentSourceConfig } from './blog-content-source';
