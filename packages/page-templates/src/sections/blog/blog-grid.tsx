/**
 * @file packages/page-templates/src/sections/blog/blog-grid.tsx
 * Purpose: Blog grid section adapter and registration.
 */
import * as React from 'react';
import { BlogGrid } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from '../contact/shared';

function BlogGridAdapter(props: SectionProps) {
  const config = getSiteConfig(props);

  // Create sample blog posts. In a real implementation, this would:
  // 1. Fetch posts from the configured source (markdown, CMS, database)
  // 2. Transform to the expected format
  // 3. Handle empty states gracefully

  const samplePosts = [
    {
      id: '1',
      title: `${config.name} - Getting Started`,
      excerpt: 'Learn how to get started with our amazing platform and services.',
      featuredImage: '/api/placeholder/400/300',
      publishedAt: new Date('2024-01-15'),
      slug: 'getting-started',
      author: {
        name: 'Team',
        avatar: '/api/placeholder/40/40',
      },
      category: 'Tutorial',
      readTime: '5 min read',
    },
    {
      id: '2',
      title: 'Advanced Tips and Tricks',
      excerpt: 'Discover advanced techniques to maximize your productivity and results.',
      featuredImage: '/api/placeholder/400/300',
      publishedAt: new Date('2024-01-10'),
      slug: 'advanced-tips',
      author: {
        name: 'Expert',
        avatar: '/api/placeholder/40/40',
      },
      category: 'Advanced',
      readTime: '8 min read',
    },
    {
      id: '3',
      title: 'Best Practices Guide',
      excerpt: 'Follow industry best practices to achieve optimal outcomes.',
      featuredImage: '/api/placeholder/400/300',
      publishedAt: new Date('2024-01-05'),
      slug: 'best-practices',
      author: {
        name: 'Professional',
        avatar: '/api/placeholder/40/40',
      },
      category: 'Guide',
      readTime: '6 min read',
    },
  ];

  return React.createElement(BlogGrid, { posts: samplePosts });
}

registerSection('blog-grid', BlogGridAdapter);
