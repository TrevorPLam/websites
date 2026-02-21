/**
 * @file packages/page-templates/src/templates/BlogPostTemplate.tsx
 * Task: [3.7] Article + related posts + inline CTAs + slot-based content injection
 *
 * Purpose: Renders a blog post page via composePage. Sections: blog-post-content,
 * blog-related-posts, blog-cta. Slug derived from searchParams.
 * Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

'use client';

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';

export function BlogPostTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  // Dynamically load blog sections only when this template is used
  React.useEffect(() => {
    import('../sections/blog/index').then((mod) => mod.registerBlogSections());
  }, []);

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
