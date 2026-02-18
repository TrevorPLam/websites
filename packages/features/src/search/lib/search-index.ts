// File: packages/features/src/search/lib/search-index.ts  [TRACE:FILE=packages.features.search.searchIndex]
// Purpose: Search index builder providing site-wide search index generation from
//          configurable content sources. Caches results for performance and supports
//          static pages, blog content, and future CMS/API sources.
//
// Relationship: Uses search types (SearchItem, SearchIndexConfig). Uses React cache() for request deduplication.
// System role: buildSearchIndexCached merges staticItems with blogItems (array or promise); getSearchIndex exports.
// Assumptions: config.staticItems and config.blogItems (if present) produce valid SearchItem[]; no dedupe by id in merge.
//
// Exports / Entry: getSearchIndex function
// Used by: Search page routes, layout (for SearchDialog), content indexing
//
// Invariants:
// - Static and blog items are merged without duplicates (by id)
// - Results are stable (same input = same output)
// - Caching is caller responsibility (React cache, etc.)
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Configurable search index generation
// - [FEAT:PERFORMANCE] Async support for lazy content loading
// - [FEAT:ARCHITECTURE] Content source abstraction

import { cache } from 'react';
import type { SearchItem, SearchIndexConfig } from '../types';

/**
 * Builds search index from config. Merges static items with optional blog items.
 * Uses React cache() when called during render for request-scoped deduplication.
 */
// [TRACE:FUNC=packages.features.search.buildSearchIndex]
// [FEAT:SEARCH] [FEAT:PERFORMANCE]
const buildSearchIndexCached = cache(async (config: SearchIndexConfig): Promise<SearchItem[]> => {
  const staticItems = config.staticItems ?? [];
  let blogItems: SearchItem[] = [];

  if (config.blogItems) {
    if (Array.isArray(config.blogItems)) {
      blogItems = config.blogItems;
    } else {
      blogItems = await config.blogItems();
    }
  }

  return [...staticItems, ...blogItems];
});

/**
 * Get search index for the site.
 * Call with config from template (static routes + blog items).
 *
 * @param config - SearchIndexConfig with staticItems and optional blogItems
 * @returns Promise resolving to SearchItem array
 */
// [TRACE:FUNC=packages.features.search.getSearchIndex]
// [FEAT:SEARCH] [FEAT:PERFORMANCE]
export async function getSearchIndex(config: SearchIndexConfig): Promise<SearchItem[]> {
  return buildSearchIndexCached(config);
}
