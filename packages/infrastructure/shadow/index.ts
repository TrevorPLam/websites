// File: packages/infra/shadow/index.ts  [TRACE:FILE=packages.infra.shadow.index]
// Purpose: Barrel export for the @repo/infrastructure shadow module.
//          Re-exports shadow scale constants and utility functions.
//
// System role: Client-safe public surface for box-shadow primitives.
// Entry point: import from '@repo/infrastructure/shadow'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: @repo/ui components, ThemeInjector, site.config.ts validation
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - Shadow values are valid CSS box-shadow strings
//
// Status: @public
// Features:
// - [FEAT:SHADOW] Box shadow scale and utilities

export * from './scale';
export * from './utils';
