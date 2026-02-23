// File: packages/infra/variants/index.ts  [TRACE:FILE=packages.infra.variants.index]
// Purpose: Barrel export for the @repo/infra variant system module.
//          Re-exports the cva() function, type utilities, composition helpers,
//          and class utilities from sub-modules.
//
// System role: Client-safe public surface.
// Entry point: import from '@repo/infra/variants'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: @repo/ui components (Button, Badge, Input variants), @repo/features
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - cva() is the primary export — use it to define component variants
//
// Status: @public
// Features:
// - [FEAT:VARIANTS] CVA-compatible variant system, type utilities, composition

export * from './types';
export * from './utils';
export * from './cva';
export * from './compose';
