/**
 * @file packages/page-templates/src/templates/BlogIndexTemplate.tsx
 * Task: [3.6] Post listing + pagination + categories + slot-based content injection
 *
 * Purpose: Renders blog index page via composePage. Sections: blog-grid,
 * blog-pagination. Blog config derived from siteConfig.features.blog.
 * Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/blog/index'; // side-effect: register blog sections

export function BlogIndexTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  const content = composePage({ page: 'blog', searchParams }, config);

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <div data-template="BlogIndexTemplate" />}
      {slots?.footer}
    </>
  );
}
