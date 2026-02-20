/**
 * @file packages/page-templates/src/sections/blog/blog-post-content.tsx
 * Purpose: Blog post content section adapter and registration.
 */
import * as React from 'react';
import { BlogPostContent } from '@repo/features';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function BlogPostContentAdapter(_props: SectionProps) {
  return React.createElement(BlogPostContent, { content: '' });
}

registerSection('blog-post-content', BlogPostContentAdapter);
