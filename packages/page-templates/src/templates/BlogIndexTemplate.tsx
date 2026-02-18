/**
 * @file packages/page-templates/src/templates/BlogIndexTemplate.tsx
 * Task: [3.6] Post listing + pagination + categories
 *
 * Purpose: Renders blog index page via composePage. Sections: blog-grid,
 * blog-pagination. Blog config derived from siteConfig.features.blog.
 * Registration via import side-effect.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/blog'; // side-effect: register blog sections

export function BlogIndexTemplate({
  config,
  searchParams,
}: PageTemplateProps): React.ReactElement | null {
  const result = composePage(
    { page: 'blog', searchParams },
    config
  );
  if (result === null) {
    return React.createElement('div', { 'data-template': 'BlogIndexTemplate' }, null);
  }
  return result;
}
