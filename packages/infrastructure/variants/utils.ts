// File: packages/infra/variants/utils.ts  [TRACE:FILE=packages.infra.variants.utils]
// Purpose: Low-level utility functions for the variant system.
//          Provides cx() (class concatenation) and tw() (Tailwind-merge wrapper).
//
// System role: Client-safe — no DOM or React.
// Assumptions: @repo/utils provides `cn` (clsx + tailwind-merge).
//              cx is a lightweight alternative that does NOT merge conflicting Tailwind classes.
//              Use `cn` from @repo/utils when Tailwind class deduplication is needed.
//
// Exports: cx, tw, filterFalsy, flattenClassValues
//
// Invariants:
// - cx is pure — no side effects
// - cx does NOT deduplicate Tailwind classes (use tw / cn for that)
// - All functions handle undefined / null / false gracefully
//
// Status: @public
// Features:
// - [FEAT:VARIANTS] Class concatenation utilities

import type { ClassValue } from './types';

/**
 * Lightweight class concatenation — joins truthy class values with a space.
 * Does NOT deduplicate conflicting Tailwind utilities.
 * Use `cn` from `@repo/utils` when you need Tailwind conflict resolution.
 *
 * @example
 * cx('flex', undefined, false, 'gap-2') // → 'flex gap-2'
 */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ').trim();
}

/**
 * Alias for cx — emphasises intent of creating a Tailwind class string.
 * Identical behaviour to cx; provided for call-site readability.
 *
 * @example
 * const base = tw('rounded font-semibold', isLarge && 'text-lg');
 */
export const tw = cx;

/**
 * Filter an array of ClassValues, removing undefined, null, and false.
 * Useful when building class arrays before joining.
 *
 * @example
 * const classes = filterFalsy([base, isActive && 'ring-2', extraClass]);
 */
export function filterFalsy(values: ClassValue[]): string[] {
  return values.filter((v): v is string => typeof v === 'string' && v.length > 0);
}

/**
 * Flatten a nested structure of ClassValues into a single string.
 * Accepts arrays, nested arrays, or scalar values — useful for composition.
 *
 * @example
 * flattenClassValues([['flex', 'items-center'], 'gap-2', undefined])
 * // → 'flex items-center gap-2'
 */
export function flattenClassValues(values: Array<ClassValue | ClassValue[]>): string {
  return values
    .flat()
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
    .join(' ')
    .trim();
}
