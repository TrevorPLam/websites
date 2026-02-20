/**
 * @file packages/page-templates/src/sections/blog/index.ts
 * Purpose: Barrel and side-effect registration for blog sections.
 */
import './blog-grid';
import './blog-pagination';
import './blog-post-content';
import './blog-related-posts';
import './blog-cta';

export function registerBlogSections(): void {
  // Registration is done via side-effects when the adapter modules above are imported.
}
