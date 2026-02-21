/**
 * @file packages/page-templates/src/sections/blog/blog-post-content.tsx
 * Purpose: Blog post content section adapter and registration.
 */
import * as React from 'react';
import { BlogPostContent } from '@repo/features/blog/client';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getBlogPost } from './blog-content-loader';

async function BlogPostContentAdapter(props: SectionProps) {
  const searchParams = (props.searchParams || {}) as Record<string, string>;
  const slug = searchParams.slug;

  if (!slug) {
    return React.createElement('div', {
      'data-template': 'blog-post-content',
      children: 'No slug provided',
    });
  }

  // Fetch blog post from content loader
  const post = await getBlogPost(slug);

  if (!post) {
    return React.createElement('div', {
      'data-template': 'blog-post-content',
      children: `Blog post not found: ${slug}`,
    });
  }

  return React.createElement(BlogPostContent, { content: post.content });
}

registerSection('blog-post-content', BlogPostContentAdapter);
