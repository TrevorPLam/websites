// File: lib/search.ts  [TRACE:FILE=lib.search]
// Purpose: Search functionality providing site-wide search index generation and search
//          capabilities for pages and blog content. Caches search results for performance
//          and integrates with navigation components.
//
// Exports / Entry: SearchItem type, getSearchIndex function
// Used by: Navigation component, SearchDialog, and any search-related features
//
// Invariants:
// - Must include all static pages in search index for comprehensive coverage
// - Blog posts must be dynamically fetched and included in search results
// - Search index must be cached to avoid repeated file system operations
// - All search items must have valid hrefs for navigation
// - Tags must be consistent across similar content types
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Site-wide search functionality
// - [FEAT:PERFORMANCE] Cached search index generation
// - [FEAT:BLOG] Dynamic blog post integration
// - [FEAT:NAVIGATION] Search result navigation

import { cache } from 'react';
import { getAllPosts } from '@/features/blog/lib/blog';

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'Page' | 'Blog';
  tags?: string[];
};

// [TRACE:BLOCK=lib.search.staticPages]
// [FEAT:SEARCH] [FEAT:NAVIGATION]
// NOTE: Core page index - maintain consistency with actual available routes and page content.
const staticPages: SearchItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    description: 'Overview of our hair salon services, pricing, and booking information.',
    href: '/',
    type: 'Page',
    tags: ['hair salon', 'services', 'styling'],
  },
  {
    id: 'page-services',
    title: 'Services',
    description: 'Explore haircuts, coloring, styling, and hair treatment services.',
    href: '/services',
    type: 'Page',
    tags: ['hair services', 'treatments', 'styling'],
  },
  {
    id: 'page-pricing',
    title: 'Pricing',
    description: 'Review hair salon service packages, pricing, and membership options.',
    href: '/pricing',
    type: 'Page',
    tags: ['pricing', 'packages'],
  },
  {
    id: 'page-book',
    title: 'Book',
    description: 'Request an appointment and share your preferred time.',
    href: '/book',
    type: 'Page',
    tags: ['booking', 'appointment'],
  },
  {
    id: 'page-gallery',
    title: 'Gallery',
    description: 'Browse before-and-after transformations from our stylists.',
    href: '/gallery',
    type: 'Page',
    tags: ['gallery', 'before and after'],
  },
  {
    id: 'page-team',
    title: 'Team',
    description: 'Meet stylists and learn about their specialties.',
    href: '/team',
    type: 'Page',
    tags: ['team', 'stylists'],
  },
  {
    id: 'page-contact',
    title: 'Contact',
    description: 'Get in touch to schedule a free consultation.',
    href: '/contact',
    type: 'Page',
    tags: ['contact', 'consultation'],
  },
  {
    id: 'page-about',
    title: 'About',
    description: 'Learn about our stylists, mission, and hair care philosophy.',
    href: '/about',
    type: 'Page',
    tags: ['team', 'mission'],
  },
  {
    id: 'page-blog',
    title: 'Blog',
    description: 'Hair care tips, trends, and styling advice from our experts.',
    href: '/blog',
    type: 'Page',
    tags: ['blog', 'insights'],
  },
  {
    id: 'page-search',
    title: 'Search',
    description: 'Search blog posts, services, and hair care resources across site.',
    href: '/search',
    type: 'Page',
    tags: ['search', 'resources'],
  },
];

// [TRACE:FUNC=lib.buildSearchIndex]
// [FEAT:SEARCH] [FEAT:PERFORMANCE] [FEAT:BLOG]
// NOTE: Cached index builder - combines static pages with dynamic blog content for comprehensive search.
const buildSearchIndex = cache((): SearchItem[] => {
  const posts = getAllPosts();
  const blogItems: SearchItem[] = posts.map((post) => {
    const tags = ['blog', post.category, post.author].filter((tag): tag is string => Boolean(tag));

    return {
      id: `blog-${post.slug}`,
      title: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      type: 'Blog',
      tags,
    };
  });

  return [...staticPages, ...blogItems];
});

// [TRACE:FUNC=lib.getSearchIndex]
// [FEAT:SEARCH] [FEAT:PERFORMANCE]
// NOTE: Public search API - provides cached search index for navigation and search components.
export async function getSearchIndex(): Promise<SearchItem[]> {
  return buildSearchIndex();
}
