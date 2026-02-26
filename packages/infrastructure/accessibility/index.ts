// File: packages/infra/accessibility/index.ts  [TRACE:FILE=packages.infra.accessibility.index]
// Purpose: Barrel export for the @repo/infrastructure accessibility module.
//          Re-exports all ARIA utilities, keyboard helpers, screen-reader utilities,
//          and React hooks from sub-modules.
//
// System role: Client-safe public surface.
// Entry point: import from '@repo/infrastructure/accessibility'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: @repo/ui components, @repo/features, client apps
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - Hooks are in hooks.ts (requires 'use client' at call site)
//
// Status: @public
// Features:
// - [FEAT:ACCESSIBILITY] ARIA utilities, keyboard navigation, screen reader, hooks

export * from './aria';
export * from './keyboard';
export * from './screen-reader';
export * from './hooks';
