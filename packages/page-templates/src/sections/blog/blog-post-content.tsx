/**
 * @file packages/page-templates/src/sections/blog/blog-post-content.tsx
 * Purpose: Blog post content section adapter and registration.
 */
import * as React from 'react';
import { BlogPostContent } from '@repo/features';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from '../contact/shared';

function BlogPostContentAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const slug = props.searchParams?.slug as string;

  // For now, create sample content. In a real implementation, this would:
  // 1. Read slug from searchParams
  // 2. Fetch content from the configured source (markdown, CMS, database)
  // 3. Handle notFound() if slug doesn't exist

  const sampleContent = `
# ${config.name} Blog Post

This is a sample blog post content for slug: ${slug || 'unknown'}.

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Main Content

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Conclusion

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  `;

  return React.createElement(BlogPostContent, { content: sampleContent });
}

registerSection('blog-post-content', BlogPostContentAdapter);
