// File: packages/features/src/search/types.ts  [TRACE:FILE=packages.features.search.types]
// Purpose: Search feature type definitions providing type-safe search item structures.
//          Defines SearchItem interface for consistent search result handling across
//          dialog, full-page search, and content source adapters.
//
// Exports / Entry: SearchItem type, SearchIndexConfig interface
// Used by: SearchDialog, SearchPage, search index builder, content source adapters
//
// Invariants:
// - SearchItem must have valid href for navigation
// - type must be 'Page' or 'Blog' for filtering/grouping
// - All items must have unique id for React keys
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Type-safe search result structures
// - [FEAT:CONTENT] Content source abstraction support
// - [FEAT:ARCHITECTURE] Config-driven search index

/**
 * Search result item for display in SearchDialog and SearchPage
 */
// [TRACE:INTERFACE=packages.features.search.SearchItem]
// [FEAT:SEARCH] [FEAT:CONTENT]
export type SearchItem = {
  /** Unique identifier for React keys */
  id: string;
  /** Display title */
  title: string;
  /** Short description for result preview */
  description: string;
  /** Navigation URL (must be valid path) */
  href: string;
  /** Content type for filtering and display */
  type: 'Page' | 'Blog';
  /** Optional tags for extended search matching */
  tags?: string[];
};

/**
 * Configuration for building the search index
 * Enables configurable content sources (static routes, blog, CMS, API)
 */
// [TRACE:INTERFACE=packages.features.search.SearchIndexConfig]
// [FEAT:SEARCH] [FEAT:CONFIGURATION] [FEAT:ARCHITECTURE]
export interface SearchIndexConfig {
  /** Static page items from route registry */
  staticItems: SearchItem[];
  /**
   * Optional blog items. Provide array or async getter.
   * Enables lazy loading for large content sets.
   */
  blogItems?: SearchItem[] | (() => Promise<SearchItem[]>);
}
