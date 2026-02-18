// File: packages/utils/src/index.ts  [TRACE:FILE=packages.utils.index]
// Purpose: Shared utility functions entry point for the monorepo. Provides cross-cutting
//          utilities used by @repo/ui and all templates, ensuring consistent behavior
//          across all applications and components.
//
// Relationship: No @repo dependencies. Consumed by @repo/ui (all components using cn),
//               templates (e.g. Navigation via @/lib/utils or @repo/utils).
// System role: Foundation layer; styling and pure utilities only.
// Assumptions: New utilities added here must be framework-agnostic and stable.
//
// Exports / Entry: cn utility function for CSS class merging
// Used by: @repo/ui components, all template applications, any workspace needing utilities
//
// Invariants:
// - Must export only stable, well-tested utility functions
// - Exports must maintain backward compatibility
// - Utilities must be framework-agnostic where possible
// - No external dependencies that could cause version conflicts
//
// Status: @public
// Features:
// - [FEAT:UTILITIES] CSS class merging with Tailwind support
// - [FEAT:STYLING] Consistent styling utilities across components
// - [FEAT:SHARED] Cross-workspace utility functions

/**
 * @repo/utils — Shared Utility Functions
 *
 * Provides cross-cutting utilities used by @repo/ui and all templates.
 */

export { cn } from './cn';
