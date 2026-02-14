// File: features/blog/index.ts  [TRACE:FILE=features.blog.index]
// Purpose: Blog feature barrel export providing clean imports for blog content management,
//          MDX rendering, and image processing. Centralizes blog functionality
//          for consistent content management and rendering across the application.
//
// Exports / Entry: Blog utilities, BlogPostContent component, blog image functions
// Used by: Blog pages, search functionality, and any blog-related features
//
// Invariants:
// - Must export all public blog utilities with consistent naming
// - MDX rendering components must handle both markdown and MDX content
// - Blog image utilities must optimize for performance and SEO
// - Export structure must remain stable to avoid breaking blog functionality
// - No internal parsing details should be exposed unnecessarily
//
// Status: @public
// Features:
// - [FEAT:BLOG] MDX content management and rendering
// - [FEAT:CONTENT] Blog post discovery and indexing
// - [FEAT:IMAGES] Blog image optimization and processing
// - [FEAT:SEARCH] Blog content integration with site search
// - [FEAT:ARCHITECTURE] Clean barrel export pattern

// Library exports
export * from './lib/blog';
export * from './lib/blog-images';

// Component exports
export { default as BlogPostContent } from './components/BlogPostContent';
