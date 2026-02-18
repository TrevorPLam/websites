// File: packages/features/src/blog/lib/blog-config.ts  [TRACE:FILE=packages.features.blog.blogConfig]
// Purpose: Blog feature configuration interface enabling template-agnostic blog setup
//          with configurable content sources, routing, and metadata defaults.
//
// Relationship: Uses blog-content-source (BlogContentSourceConfig). Used by blog lib, template blog setup.
// System role: createBlogConfig fills defaults; contentSource drives getPosts/getBySlug.
// Assumptions: contentSource is configured for template's content location (e.g. app/blog/content).
//
// Exports / Entry: BlogFeatureConfig interface, createBlogConfig helper
// Used by: Blog feature initialization, content source creation
//
// Invariants:
// - Content source must be properly configured
// - Default values must be provided for all optional fields
// - Slug policy must be defined for collision handling
//
// Status: @public
// Features:
// - [FEAT:BLOG] Configuration-driven blog feature
// - [FEAT:CONFIGURATION] Template-agnostic blog setup
// - [FEAT:TYPES] Type-safe blog configuration

import type { BlogContentSourceConfig } from './blog-content-source';

/**
 * Blog feature configuration
 */
// [TRACE:INTERFACE=packages.features.blog.BlogFeatureConfig]
// [FEAT:BLOG] [FEAT:CONFIGURATION]
// NOTE: Feature configuration - provides all configurable aspects of blog feature.
export interface BlogFeatureConfig {
  /** Content source configuration */
  contentSource: BlogContentSourceConfig;
  /** Base URL for blog routes (e.g., '/blog') */
  basePath?: string;
  /** Posts per page for pagination */
  postsPerPage?: number;
  /** Enable category filtering */
  enableCategories?: boolean;
  /** Enable tag filtering */
  enableTags?: boolean;
  /** Enable featured posts */
  enableFeatured?: boolean;
}

/**
 * Creates blog feature configuration with defaults
 */
// [TRACE:FUNC=packages.features.blog.createBlogConfig]
// [FEAT:BLOG] [FEAT:CONFIGURATION]
// NOTE: Config factory - creates blog config with sensible defaults that can be customized per client.
export function createBlogConfig(
  contentSource: BlogContentSourceConfig,
  overrides?: Partial<BlogFeatureConfig>
): BlogFeatureConfig {
  return {
    contentSource,
    basePath: '/blog',
    postsPerPage: 12,
    enableCategories: true,
    enableTags: false,
    enableFeatured: true,
    ...overrides,
  };
}
