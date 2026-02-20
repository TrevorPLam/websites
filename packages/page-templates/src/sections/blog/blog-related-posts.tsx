/**
 * @file packages/page-templates/src/sections/blog/blog-related-posts.tsx
 * Purpose: Blog related posts section adapter and registration.
 */
import * as React from 'react';
import { RelatedPosts } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function BlogRelatedPostsAdapter(_props: SectionProps) {
  return React.createElement(RelatedPosts, { posts: [] });
}

registerSection('blog-related-posts', BlogRelatedPostsAdapter);
