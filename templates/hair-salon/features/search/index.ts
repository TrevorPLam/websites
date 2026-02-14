// File: features/search/index.ts  [TRACE:FILE=features.search.index]
// Purpose: Search feature barrel export providing clean imports for search components
//          and utilities. Centralizes search functionality for site-wide search
//          capabilities with consistent import patterns.
//
// Exports / Entry: SearchDialog component, SearchPage component
// Used by: Navigation component, search page (/search), and any search-related features
//
// Invariants:
// - Must export all public search components with consistent naming
// - Component exports must be default exports for React patterns
// - No internal utilities should be exported (only public components)
// - Export structure must remain stable to avoid breaking imports
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Site-wide search functionality
// - [FEAT:NAVIGATION] Search dialog integration
// - [FEAT:ARCHITECTURE] Clean barrel export pattern
// - [FEAT:MAINTAINABILITY] Centralized export management

// Component exports
export { default as SearchDialog } from './components/SearchDialog';
export { default as SearchPage } from './components/SearchPage';
