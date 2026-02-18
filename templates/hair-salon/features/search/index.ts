// File: features/search/index.ts  [TRACE:FILE=features.search.index]
// Purpose: Backward-compatible barrel export for search feature.
//          Re-exports from extracted @repo/features/search while maintaining
//          template-specific compatibility for existing usage.
//
// Exports / Entry: SearchDialog, SearchPage, SearchItem type
// Used by: Navigation component, search page
//
// Invariants:
// - Must maintain backward compatibility with existing imports
// - Component exports must match pre-extraction API
//
// Status: @public (template-specific compatibility layer)
// Features:
// - [FEAT:SEARCH] Site-wide search
// - [FEAT:ARCHITECTURE] Backward-compatible re-export pattern

export { SearchDialog, SearchPage } from '@repo/features/search';
export type { SearchItem } from '@repo/features/search';
