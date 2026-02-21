// File: packages/features/src/blog/index.ts  [TRACE:FILE=packages.features.blog.index]
// Purpose: Blog feature barrel export providing clean imports for blog components,
//          content management, and utilities. Centralizes blog functionality for
//          consistent content management and rendering across the application.
//
// Relationship: Depends on @repo/ui, next-mdx-remote, etc. Consumed by template blog pages and search.
// System role: Feature barrel; content from BlogContentSource (e.g. MDX); BlogPostContent renders MDX.
// Assumptions: Template provides BlogFeatureConfig with contentSource; blog items feed search index.
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

import 'server-only';

// Content management exports (server-only)
export * from './lib/blog';
export type { BlogPost } from './lib/blog-types';

// Image utilities (server-only - uses fs)
export * from './lib/blog-images';
