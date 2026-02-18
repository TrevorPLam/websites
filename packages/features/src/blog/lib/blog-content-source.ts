// File: packages/features/src/blog/lib/blog-content-source.ts  [TRACE:FILE=packages.features.blog.blogContentSource]
// Purpose: Content source adapter interface enabling blog feature to work with multiple content
//          sources (MDX files, headless CMS, API endpoints). Implements adapter pattern for
//          content federation and abstraction, supporting MDX, CMS, and API sources.
//
// Exports / Entry: BlogContentSource interface, BlogContentAdapter type, createMdxContentSource helper
// Used by: Blog feature content management, blog post discovery, and content indexing
//
// Invariants:
// - All content sources must implement BlogContentSource interface
// - Content adapters must normalize content to BlogPost format
// - Slug generation must be consistent and collision-safe
// - Content fetching must handle errors gracefully
// - Caching should be implemented at adapter level for performance
//
// Status: @public
// Features:
// - [FEAT:BLOG] Content source abstraction and federation
// - [FEAT:CONTENT] Multi-source content management
// - [FEAT:ARCHITECTURE] Adapter pattern for content sources
// - [FEAT:PERFORMANCE] Caching strategies for content fetching

import type { BlogPost } from './blog-types';

/**
 * Content source adapter interface
 * Implementations provide content from various sources (MDX, CMS, API)
 */
// [TRACE:INTERFACE=packages.features.blog.BlogContentSource]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:ARCHITECTURE]
// NOTE: Content source interface - enables pluggable content sources for blog feature.
export interface BlogContentSource {
  /** Get all blog posts */
  getAllPosts(): Promise<BlogPost[]>;
  /** Get a single post by slug */
  getPostBySlug(slug: string): Promise<BlogPost | undefined>;
  /** Get all unique slugs */
  getPostSlugs(): Promise<string[]>;
  /** Get posts by category */
  getPostsByCategory(category: string): Promise<BlogPost[]>;
  /** Get all unique categories */
  getAllCategories(): Promise<string[]>;
  /** Get featured posts */
  getFeaturedPosts(): Promise<BlogPost[]>;
}

/**
 * Content adapter factory function type
 * Creates a content source adapter with configuration
 */
// [TRACE:TYPE=packages.features.blog.BlogContentAdapter]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:ARCHITECTURE]
// NOTE: Adapter factory type - enables dynamic content source creation with configuration.
export type BlogContentAdapter = (config: BlogContentSourceConfig) => BlogContentSource;

/**
 * Content source configuration
 */
// [TRACE:INTERFACE=packages.features.blog.BlogContentSourceConfig]
// [FEAT:BLOG] [FEAT:CONFIGURATION]
// NOTE: Configuration interface - provides settings for content source adapters.
export interface BlogContentSourceConfig {
  /** Content source type */
  type: 'mdx' | 'cms' | 'api';
  /** Source-specific configuration */
  options: MdxSourceOptions | CmsSourceOptions | ApiSourceOptions;
  /** Default author name */
  defaultAuthor?: string;
  /** Default category */
  defaultCategory?: string;
}

/**
 * MDX file source options
 */
export interface MdxSourceOptions {
  /** Path to content directory (relative to project root) */
  contentDirectory: string;
  /** File extension (default: '.mdx') */
  extension?: string;
}

/**
 * CMS source options (e.g., Contentful, Sanity, Strapi)
 */
export interface CmsSourceOptions {
  /** CMS API endpoint */
  apiUrl: string;
  /** API key or access token */
  apiKey: string;
  /** Content type/model name */
  contentType: string;
  /** Optional: Custom field mappings */
  fieldMappings?: {
    title?: string;
    description?: string;
    date?: string;
    author?: string;
    category?: string;
    content?: string;
    featured?: string;
  };
}

/**
 * Generic API source options
 */
export interface ApiSourceOptions {
  /** API endpoint URL */
  endpoint: string;
  /** Optional: API key or bearer token */
  apiKey?: string;
  /** HTTP headers */
  headers?: Record<string, string>;
  /** Response transformation function */
  transform?: (data: unknown) => BlogPost[];
}

/**
 * Creates a canonical slug from a string
 * Handles collisions by appending numeric suffix
 */
// [TRACE:FUNC=packages.features.blog.createCanonicalSlug]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:SEO]
// NOTE: Slug generation - creates URL-safe slugs with collision handling.
export function createCanonicalSlug(title: string, existingSlugs: string[] = []): string {
  // Convert to lowercase, replace spaces and special chars with hyphens
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Handle empty slug
  if (!baseSlug) {
    baseSlug = 'untitled';
  }

  // Check for collisions and append numeric suffix if needed
  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Validates and normalizes a slug
 * Ensures slug is URL-safe and follows canonical format
 */
// [TRACE:FUNC=packages.features.blog.normalizeSlug]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:SEO]
// NOTE: Slug normalization - ensures consistent slug format across all content sources.
export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w-]/g, '') // Remove non-word characters except hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
