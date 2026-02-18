// File: packages/features/src/blog/lib/blog-types.ts  [TRACE:FILE=packages.features.blog.blogTypes]
// Purpose: Blog post type definitions providing type-safe blog content structures.
//          Defines BlogPost interface and related types for consistent content handling
//          across all content sources.
//
// Exports / Entry: BlogPost interface, BlogPostMetadata type
// Used by: Blog content sources, blog components, and blog utilities
//
// Invariants:
// - BlogPost must have all required fields for rendering
// - Dates must be in YYYY-MM-DD format for consistency
// - Slugs must be URL-safe and unique
// - Content must be raw MDX/markdown string
//
// Status: @public
// Features:
// - [FEAT:BLOG] Type-safe blog content structures
// - [FEAT:TYPES] TypeScript type definitions
// - [FEAT:CONTENT] Content metadata and structure

/**
 * Blog post data structure
 * Normalized format for all content sources
 */
// [TRACE:INTERFACE=packages.features.blog.BlogPost]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:SEO]
// NOTE: Blog post interface - provides normalized structure for blog content across all sources.
export interface BlogPost {
  /** URL-safe identifier (derived from filename or title) */
  slug: string;
  /** Post title */
  title: string;
  /** SEO description */
  description: string;
  /** Publication date (YYYY-MM-DD format) */
  date: string;
  /** Author name */
  author: string;
  /** Post category for filtering */
  category: string;
  /** Calculated reading time (e.g., "5 min read") */
  readingTime: string;
  /** Raw MDX/markdown content (without frontmatter) */
  content: string;
  /** Whether to show on homepage */
  featured?: boolean;
  /** Optional tags for additional categorization */
  tags?: string[];
}

/**
 * Blog post metadata (frontmatter)
 * Used for content source adapters to extract metadata
 */
// [TRACE:INTERFACE=packages.features.blog.BlogPostMetadata]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Metadata interface - defines frontmatter structure for blog posts.
export interface BlogPostMetadata {
  title: string;
  description: string;
  date: string | Date;
  author?: string;
  category?: string;
  featured?: boolean;
  tags?: string[];
}
