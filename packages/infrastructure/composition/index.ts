// File: packages/infra/composition/index.ts  [TRACE:FILE=packages.infra.composition.index]
// Purpose: Barrel export for the @repo/infra composition module.
//          Re-exports Slot, context factories, provider composer, render props,
//          and HOC utilities from sub-modules.
//
// System role: Client-safe public surface.
// Entry point: import from '@repo/infra/composition'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: @repo/ui compound components, @repo/features, client apps
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - 'use client' is declared in individual sub-modules, not here
//
// Status: @public
// Features:
// - [FEAT:COMPOSITION] Slot, context, providers, render props, HOCs

export * from './slots';
export * from './context';
export * from './provider';
export * from './render-props';
export * from './hocs';
