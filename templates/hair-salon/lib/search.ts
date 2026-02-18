// File: lib/search.ts  [TRACE:FILE=lib.search]
// Purpose: Search index adapter wiring template-specific content sources to
//          @repo/features/search. Provides getSearchIndex() for layout and
//          search page. Static pages from route registry; blog from blog feature.
//
// Exports / Entry: SearchItem type, getSearchIndex function
// Used by: app/layout.tsx, app/search/page.tsx, Navigation
//
// Invariants:
// - Static pages from lib/routes.ts (single source of truth)
// - Blog posts from @repo/features/blog via template adapter
// - Same API as pre-extraction for backward compatibility
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Site-wide search
// - [FEAT:ARCHITECTURE] Template-to-feature adapter

import { getSearchIndex as getSearchIndexFromFeature } from '@repo/features/search';
export type { SearchItem } from '@repo/features/search';
import { getSearchEntries } from '@/lib/routes';
import { getAllPosts } from '@/features/blog';

/**
 * Build and return search index for the site.
 * Merges static route pages with blog posts.
 */
export async function getSearchIndex(): Promise<SearchItem[]> {
  const staticItems = getSearchEntries() as SearchItem[];
  const posts = getAllPosts();
  const blogItems: SearchItem[] = posts.map((post) => {
    const tags = ['blog', post.category, post.author].filter(
      (tag): tag is string => Boolean(tag)
    );
    return {
      id: `blog-${post.slug}`,
      title: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      type: 'Blog' as const,
      tags,
    };
  });

  return getSearchIndexFromFeature({ staticItems, blogItems });
}
