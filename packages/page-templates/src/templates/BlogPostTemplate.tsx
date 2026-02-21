/**
 * @file packages/page-templates/src/templates/BlogPostTemplate.tsx
 * Task: [3.7] Article + related posts + inline CTAs + slot-based content injection
 *
 * Purpose: Renders a blog post page via composePage. Sections: blog-post-content,
 * blog-related-posts, blog-cta. Slug derived from searchParams.
 * Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/blog/index'; // side-effect: register blog sections

export function BlogPostTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  const content = composePage(
    { page: 'blog-post', sections: config.pageSections?.['blog-post'], searchParams },
    config
  );

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <div data-template="BlogPostTemplate" />}
      {slots?.footer}
    </>
  );
}
