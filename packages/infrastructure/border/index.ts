// File: packages/infra/border/index.ts  [TRACE:FILE=packages.infra.border.index]
// Purpose: Barrel export for the @repo/infrastructure border module.
//          Re-exports border radius scale, border width utilities, and border helpers.
//
// System role: Client-safe public surface for border primitives.
// Entry point: import from '@repo/infrastructure/border'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: @repo/ui components, ThemeInjector, site.config.ts validation
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - Border radius values follow Tailwind's rounded-{key} classes
//
// Status: @public
// Features:
// - [FEAT:BORDER] Border radius, width, and utility constants

export * from './radius';
export * from './width';
export * from './utils';
