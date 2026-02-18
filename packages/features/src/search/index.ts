// File: packages/features/src/search/index.ts  [TRACE:FILE=packages.features.search.index]
// Purpose: Search feature barrel export providing clean imports for search components,
//          index builder, and utilities. Centralizes search functionality for site-wide
//          search with configurable content sources.
//
// Relationship: Depends on @repo/ui (Dialog, Input). Consumed by template layout (SearchDialog) and /search page.
// System role: getSearchIndex(config) builds items; filterSearchItems for client filter; components use index.
// Assumptions: Template passes SearchIndexConfig (staticItems + optional blogItems) from layout/search page.
//
// Exports / Entry: SearchDialog, SearchPage, getSearchIndex, filterSearchItems, SearchItem
// Used by: Navigation, /search page, layout
//
// Invariants:
// - Must export all public search components and utilities
// - Config-driven index (no hardcoded content)
// - SearchDialog uses @repo/ui Dialog for accessibility
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Site-wide search functionality
// - [FEAT:ACCESSIBILITY] Dialog-based SearchDialog
// - [FEAT:ARCHITECTURE] Content source abstraction

// Component exports
export { default as SearchDialog } from './components/SearchDialog';
export type { SearchDialogProps } from './components/SearchDialog';
export { default as SearchPage } from './components/SearchPage';
export type { SearchPageProps } from './components/SearchPage';

// Index builder
export { getSearchIndex } from './lib/search-index';

// Filter utility (for custom UIs)
export { filterSearchItems } from './lib/filter-items';

// Types
export type { SearchItem, SearchIndexConfig } from './types';
