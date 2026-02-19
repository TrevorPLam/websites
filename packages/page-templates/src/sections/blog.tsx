/**
 * @file packages/page-templates/src/sections/blog.tsx
 * Task: [3.6, 3.7] Blog page section adapters and registration
 *
 * Purpose: Register section components for blog index and blog post pages.
 * Adapters map SiteConfig to marketing-component props.
 * Sections: blog-grid, blog-pagination (index); blog-post-content, blog-related-posts, blog-cta (post).
 */

import * as React from 'react';
import type { SiteConfig } from '@repo/types';
import { BlogGrid, BlogPagination, RelatedPosts } from '@repo/marketing-components';
import { BlogPostContent } from '@repo/features';
import { CTASection } from '@repo/marketing-components';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

// --- Blog Index Sections ---

function BlogGridAdapter(props: SectionProps) {
  const searchParams = (props.searchParams ?? {}) as Record<string, string | string[] | undefined>;
  const page = Number(searchParams['page'] ?? 1);
  return React.createElement(BlogGrid, {
    posts: [],
    pagination: {
      currentPage: page,
      totalPages: 1,
      onPageChange: () => {},
    },
  });
}

function BlogPaginationAdapter(props: SectionProps) {
  const searchParams = (props.searchParams ?? {}) as Record<string, string | string[] | undefined>;
  const page = Number(searchParams['page'] ?? 1);
  return React.createElement(BlogPagination, {
    currentPage: page,
    totalPages: 1,
    onPageChange: () => {},
  });
}

// --- Blog Post Sections ---

function BlogPostContentAdapter(_props: SectionProps) {
  return React.createElement(BlogPostContent, {
    content: '',
  });
}

function BlogRelatedPostsAdapter(_props: SectionProps) {
  return React.createElement(RelatedPosts, { posts: [] });
}

function BlogCTAAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return React.createElement(CTASection, {
    title: `Stay updated with ${config.name}`,
    description: 'Subscribe to our newsletter for the latest updates.',
    primaryCta: { label: 'Contact Us', href: '/contact' },
  });
}

/** Register all blog page sections. Called once on module load. */
export function registerBlogSections(): void {
  // Blog index
  registerSection('blog-grid', BlogGridAdapter);
  registerSection('blog-pagination', BlogPaginationAdapter);
  // Blog post
  registerSection('blog-post-content', BlogPostContentAdapter);
  registerSection('blog-related-posts', BlogRelatedPostsAdapter);
  registerSection('blog-cta', BlogCTAAdapter);
}

// Side-effect: register on module load
registerBlogSections();
