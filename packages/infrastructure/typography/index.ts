// File: packages/infra/typography/index.ts  [TRACE:FILE=packages.infra.typography.index]
// Purpose: Barrel export for the @repo/infrastructure typography module.
//          Re-exports font definitions, type scale constants, line-height utilities,
//          and typography utility functions.
//
// System role: Client-safe public surface for typography primitives.
// Entry point: import from '@repo/infrastructure/typography'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: @repo/ui components, ThemeInjector, client apps
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - Scale values follow the modular scale system (1.250 major third ratio)
//
// Status: @public
// Features:
// - [FEAT:TYPOGRAPHY] Font definitions, type scale, line heights, and utilities

export * from './fonts';
export * from './scale';
export * from './line-height';
export * from './utils';
