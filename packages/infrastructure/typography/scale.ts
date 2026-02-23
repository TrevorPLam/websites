// File: packages/infra/typography/scale.ts  [TRACE:FILE=packages.infra.typography.scale]
// Purpose: Type scale constants following a modular scale (1.250 major third ratio).
//          Maps semantic size keys (xs → 9xl) to px, rem, and Tailwind class names.
//
// System role: Single source of truth for font size tokens.
// Entry point: import from '@repo/infra/typography'
//
// Exports / Entry: TYPE_SCALE, TypeScaleKey, TypeScaleValue, getTypeScale
// Used by: typography utils, UI components, heading/paragraph systems
//
// Invariants:
// - Scale uses Tailwind's default text size steps (text-xs → text-9xl)
// - All pixel values are based on 16px root font size
// - Keys are stable — never remove or resize a key once published
//
// Status: @public
// Features:
// - [FEAT:TYPOGRAPHY] Type scale constants

/** Type scale key identifiers (Tailwind text-{key}) */
export type TypeScaleKey =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

/** Type scale value */
export interface TypeScaleValue {
  /** Font size in pixels */
  px: number;
  /** Font size in rem */
  rem: number;
  /** Default line height (unitless or px) */
  defaultLineHeight: number | string;
  /** Corresponding Tailwind CSS class */
  tailwindClass: string;
}

/** Full type scale following Tailwind CSS defaults */
export const TYPE_SCALE: Readonly<Record<TypeScaleKey, TypeScaleValue>> = {
  xs: { px: 12, rem: 0.75, defaultLineHeight: 1, tailwindClass: 'text-xs' },
  sm: { px: 14, rem: 0.875, defaultLineHeight: 1.25, tailwindClass: 'text-sm' },
  base: { px: 16, rem: 1, defaultLineHeight: 1.5, tailwindClass: 'text-base' },
  lg: { px: 18, rem: 1.125, defaultLineHeight: 1.75, tailwindClass: 'text-lg' },
  xl: { px: 20, rem: 1.25, defaultLineHeight: 1.75, tailwindClass: 'text-xl' },
  '2xl': { px: 24, rem: 1.5, defaultLineHeight: 2, tailwindClass: 'text-2xl' },
  '3xl': { px: 30, rem: 1.875, defaultLineHeight: 2.25, tailwindClass: 'text-3xl' },
  '4xl': { px: 36, rem: 2.25, defaultLineHeight: 2.5, tailwindClass: 'text-4xl' },
  '5xl': { px: 48, rem: 3, defaultLineHeight: 1, tailwindClass: 'text-5xl' },
  '6xl': { px: 60, rem: 3.75, defaultLineHeight: 1, tailwindClass: 'text-6xl' },
  '7xl': { px: 72, rem: 4.5, defaultLineHeight: 1, tailwindClass: 'text-7xl' },
  '8xl': { px: 96, rem: 6, defaultLineHeight: 1, tailwindClass: 'text-8xl' },
  '9xl': { px: 128, rem: 8, defaultLineHeight: 1, tailwindClass: 'text-9xl' },
} as const;

/**
 * Get the type scale value for a given key.
 * @param key - Type scale key (e.g. 'base', 'lg', '2xl')
 */
export function getTypeScale(key: TypeScaleKey): TypeScaleValue {
  return TYPE_SCALE[key];
}

/**
 * Get the Tailwind CSS class for a type scale key.
 * @param key - Type scale key
 * @example getTailwindTextClass('lg') → 'text-lg'
 */
export function getTailwindTextClass(key: TypeScaleKey): string {
  return TYPE_SCALE[key].tailwindClass;
}

/**
 * Find the nearest type scale key for a given pixel value.
 * Returns the key whose px value is closest to the target.
 */
export function nearestTypeScaleKey(targetPx: number): TypeScaleKey {
  let closest: TypeScaleKey = 'base';
  let minDiff = Infinity;

  const entries = Object.entries(TYPE_SCALE) as [TypeScaleKey, TypeScaleValue][];
  for (const [key, value] of entries) {
    const diff = Math.abs(value.px - targetPx);
    if (diff < minDiff) {
      minDiff = diff;
      closest = key;
    }
  }
  return closest;
}
