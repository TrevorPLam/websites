// File: packages/features/src/search/lib/filter-items.ts  [TRACE:FILE=packages.features.search.filterItems]
// Purpose: Client-side search filtering utilities. Provides substring matching
//          across title, description, and tags with consistent semantics between
//          SearchDialog and SearchPage.
//
// Exports / Entry: filterSearchItems function
// Used by: SearchDialog, SearchPage
//
// Invariants:
// - Case-insensitive matching
// - Matches against title, description, and joined tags
// - Empty query returns first N items (configurable)
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Consistent filtering semantics
// - [FEAT:UX] Substring matching for discoverability

import type { SearchItem } from '../types';

/**
 * Filters search items by query. Case-insensitive substring match across
 * title, description, and tags.
 *
 * @param items - Full search index
 * @param query - User search query (trimmed, lowercased internally)
 * @param emptyLimit - Max items to return when query is empty (default 10)
 */
// [TRACE:FUNC=packages.features.search.filterSearchItems]
// [FEAT:SEARCH] [FEAT:UX]
export function filterSearchItems(
  items: SearchItem[],
  query: string,
  emptyLimit = 10
): SearchItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items.slice(0, emptyLimit);
  }

  return items.filter((item) => {
    const tagText = Array.isArray(item.tags)
      ? item.tags
          .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
          .join(' ')
      : '';
    const haystack = [item.title, item.description, tagText].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}
