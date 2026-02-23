// File: packages/infra/spacing/index.ts  [TRACE:FILE=packages.infra.spacing.index]
// Purpose: Barrel export for the @repo/infra spacing module.
//          Re-exports spacing scale constants, utility functions, and React hooks
//          for consistent spacing across the design system.
//
// System role: Client-safe public surface for spacing primitives.
// Entry point: import from '@repo/infra/spacing'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: @repo/ui components, @repo/features, client apps
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - Scale values are immutable constants (never mutate at runtime)
// - All px/rem conversions use a 16px base font size
//
// Status: @public
// Features:
// - [FEAT:SPACING] Spacing scale, utilities, and hooks

export * from './scale';
export * from './utils';
export * from './hooks';
