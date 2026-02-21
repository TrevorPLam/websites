/**
 * Client-safe features barrel export
 * Only exports components and utilities that are safe for client-side use
 */

export * from './booking';
export * from './contact';
// Blog client exports - direct imports to avoid module resolution issues
export { default as BlogPostContent } from './blog/components/BlogPostContent';
export type { BlogPostContentProps } from './blog/components/BlogPostContent';
export * from './blog/lib/blog-config';
export type { BlogFeatureConfig } from './blog/lib/blog-config';
export * from './blog/lib/blog-content-source';
export type { BlogContentSource, BlogContentSourceConfig } from './blog/lib/blog-content-source';

export * from './services';
export * from './search';
export * from './localization';
export * from './team';
export * from './testimonials';
export * from './gallery';
export * from './pricing';
export * from './newsletter';
export * from './social-media';
export * from './reviews';
export * from './analytics';
export * from './ab-testing';
export * from './chat';
export * from './ecommerce';
export * from './authentication';
export * from './payment';
export * from './content-management';
export * from './notification';
