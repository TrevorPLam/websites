/**
 * @file packages/page-templates/src/sections/blog/blog-grid.tsx
 * Purpose: Blog grid section adapter and registration.
 */
import * as React from 'react';
import { BlogGrid } from '@repo/marketing-components';
import type { SectionProps } from '../../types';
import { registerSection } from '../../registry';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  category?: string;
}

function BlogGridAdapter(_props: SectionProps) {
  // Create sample blog posts. In a real implementation, this would:
  // 1. Fetch posts from the configured source (markdown, CMS, database)
  // 2. Transform to the expected format
  // 3. Handle empty states gracefully

  const samplePosts: BlogPost[] = [
    {
      id: '1',
      title: 'Getting Started Guide',
      excerpt: 'Learn the basics and get up and running quickly with our comprehensive guide.',
      content: 'Full blog post content would go here...',
      date: '2024-01-15',
      author: 'Expert',
      image: '/api/placeholder/400/300',
      category: 'Tutorial',
    },
    {
      id: '2',
      title: 'Advanced Tips and Tricks',
      excerpt: 'Discover advanced techniques to maximize your productivity and results.',
      content: 'Full blog post content would go here...',
      date: '2024-01-10',
      author: 'Expert',
      image: '/api/placeholder/400/300',
      category: 'Advanced',
    },
    {
      id: '3',
      title: 'Best Practices Guide',
      excerpt: 'Follow industry best practices to achieve optimal outcomes.',
      content: 'Full blog post content would go here...',
      date: '2024-01-05',
      author: 'Professional',
      image: '/api/placeholder/400/300',
      category: 'Guide',
    },
  ];

  return React.createElement(BlogGrid, { posts: samplePosts });
}

registerSection('blog-grid', BlogGridAdapter);
