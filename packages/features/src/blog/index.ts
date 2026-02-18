// File: packages/features/src/blog/index.ts  [TRACE:FILE=packages.features.blog.index]
// Purpose: Blog feature barrel export providing clean imports for blog components,
//          content management, and utilities. Centralizes blog functionality for
//          consistent content management and rendering across the application.
//
// Exports / Entry: Blog components, content management functions, image utilities, and config
// Used by: Blog pages, search functionality, and any blog-related features
//
// Invariants:
// - Must export all public blog utilities with consistent naming
// - Component exports must be default exports for React patterns
// - Library exports (content management, config) must be named exports
// - Export structure must remain stable to avoid breaking blog functionality
//
// Status: @public
// Features:
// - [FEAT:BLOG] MDX content management and rendering
// - [FEAT:CONTENT] Blog post discovery and indexing
// - [FEAT:IMAGES] Blog image optimization and processing
// - [FEAT:SEARCH] Blog content integration with site search
// - [FEAT:ARCHITECTURE] Clean barrel export pattern
// - [FEAT:CONFIGURATION] Configurable blog feature setup

// Component exports
export { default as BlogPostContent } from './components/BlogPostContent';
export type { BlogPostContentProps } from './components/BlogPostContent';

// Content management exports
export * from './lib/blog';
export type { BlogPost } from './lib/blog-types';

// Configuration exports
export * from './lib/blog-config';
export type { BlogFeatureConfig } from './lib/blog-config';

// Content source exports
export * from './lib/blog-content-source';
export type { BlogContentSource, BlogContentSourceConfig } from './lib/blog-content-source';

// Image utilities
export * from './lib/blog-images';
