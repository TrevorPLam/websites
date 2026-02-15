// File: lib/search.ts  [TRACE:FILE=lib.search]
// Purpose: Search functionality providing site-wide search index generation and search
//          capabilities for pages and blog content. Caches search results for performance
//          and integrates with navigation components. Consumes unified route registry from
//          lib/routes.ts for static pages.
//
// Exports / Entry: SearchItem type, getSearchIndex function
// Used by: Navigation component, SearchDialog, and any search-related features
//
// Invariants:
// - Static pages come from lib/routes.ts (single source of truth)
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
// - [FEAT:CONFIGURATION] Route registry consumer
//
// Related: Task 0.25 — Create Unified Route Registry

import { cache } from 'react';
import { getAllPosts } from '@/features/blog/lib/blog';
import { getSearchEntries } from '@/lib/routes';

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'Page' | 'Blog';
  tags?: string[];
};

// [TRACE:FUNC=lib.buildSearchIndex]
// [FEAT:SEARCH] [FEAT:PERFORMANCE] [FEAT:BLOG]
// NOTE: Cached index builder. Static pages from route registry; blog posts from content.
const buildSearchIndex = cache((): SearchItem[] => {
  const staticItems = getSearchEntries() as SearchItem[];
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
  return [...staticItems, ...blogItems];
});

// [TRACE:FUNC=lib.getSearchIndex]
// [FEAT:SEARCH] [FEAT:PERFORMANCE]
export async function getSearchIndex(): Promise<SearchItem[]> {
  return buildSearchIndex();
}
