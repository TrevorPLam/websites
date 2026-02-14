// File: lib/utils.ts  [TRACE:FILE=lib.utils]
// Purpose: Utility functions for CSS class name merging and conditional styling.
//          Provides a unified approach to combining Tailwind CSS classes with
//          conditional logic and conflict resolution.
//
// Exports / Entry: cn function for class name merging
// Used by: All React components throughout the application for conditional styling
//
// Invariants:
// - Must resolve Tailwind CSS conflicts (e.g., px-4 vs px-2) correctly
// - Must handle conditional classes without breaking existing styles
// - Must maintain performance for frequent re-renders
// - Must support both string and array class inputs
//
// Status: @public
// Features:
// - [FEAT:STYLING] Conditional CSS class merging
// - [FEAT:PERFORMANCE] Optimized class resolution
// - [FEAT:UX] Dynamic styling capabilities
// - [FEAT:DESIGN] Tailwind CSS conflict resolution

import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// [TRACE:FUNC=lib.cn]
// [FEAT:STYLING] [FEAT:PERFORMANCE] [FEAT:UX]
// NOTE: Class name merger - combines conditional classes while resolving Tailwind conflicts for consistent styling.
export function cn(...inputs: ClassValue[]) {
  // Merge conditional class names while resolving Tailwind conflicts (e.g., px-4 vs px-2)
  return twMerge(clsx(inputs));
}
