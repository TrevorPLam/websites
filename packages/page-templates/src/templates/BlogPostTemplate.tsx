/**
 * @file packages/page-templates/src/templates/BlogPostTemplate.tsx
 * Task: [3.7] Article + related posts + inline CTAs
 *
 * Purpose: Renders a blog post page via composePage. Sections: blog-post-content,
 * blog-related-posts, blog-cta. Slug derived from searchParams.
 * Registration via import side-effect.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/blog'; // side-effect: register blog sections

export function BlogPostTemplate({
  config,
  searchParams,
}: PageTemplateProps): React.ReactElement | null {
  const result = composePage(
    { page: 'blog-post', searchParams },
    config
  );
  if (result === null) {
    return React.createElement('div', { 'data-template': 'BlogPostTemplate' }, null);
  }
  return result;
}
