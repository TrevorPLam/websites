// File: templates/hair-salon/features/blog/index.ts  [TRACE:FILE=templates.hair-salon.features.blog.index]
// Purpose: Backward-compatible barrel export for blog feature.
//          Re-exports from extracted @repo/features/blog while maintaining
//          template-specific compatibility layer for existing usage.
//
// Exports / Entry: Blog utilities, BlogPostContent component, blog image functions
// Used by: Blog pages, search functionality
//
// Invariants:
// - Must maintain backward compatibility with existing template imports
// - Must re-export BlogPostContent component
// - Must provide blog API exports compatible with existing usage
//
// Status: @public (template-specific compatibility layer)
// Features:
// - [FEAT:BLOG] MDX content management and rendering
// - [FEAT:ARCHITECTURE] Backward-compatible re-export pattern

// Re-export BlogPostContent component
export { default as BlogPostContent } from '@repo/features/blog';

// Re-export blog API functions (adapter wrappers)
export * from './lib/blog';
export type { BlogPost } from './lib/blog';

// Re-export image utilities
export * from '@repo/features/blog';
