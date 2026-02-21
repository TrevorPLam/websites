/**
 * @file packages/page-templates/src/sections/blog/blog-grid.tsx
 * Purpose: Blog grid section adapter and registration.
 */
import * as React from 'react';
import { BlogGrid } from '@repo/marketing-components';
import type { SectionProps } from '../../types';
import { registerSection } from '../../registry';
import { getBlogPosts } from './blog-content-loader';

async function BlogGridAdapter(_props: SectionProps) {
  // Fetch blog posts from content loader
  const posts = await getBlogPosts();

  return React.createElement(BlogGrid, { posts });
}

registerSection('blog-grid', BlogGridAdapter);
