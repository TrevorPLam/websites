/**
 * @file packages/page-templates/src/sections/blog/blog-grid.tsx
 * Purpose: Blog grid section adapter and registration.
 */
import * as React from 'react';
import { BlogGrid } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function BlogGridAdapter(_props: SectionProps) {
  return React.createElement(BlogGrid, { posts: [] });
}

registerSection('blog-grid', BlogGridAdapter);
