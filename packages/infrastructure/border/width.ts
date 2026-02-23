// File: packages/infra/border/width.ts  [TRACE:FILE=packages.infra.border.width]
// Purpose: Border width scale constants and utilities.
//          Maps semantic width keys (0, 1, 2, 4, 8) to CSS values and Tailwind classes.
//
// System role: Single source of truth for border-width tokens.
// Entry point: import from '@repo/infra/border'
//
// Exports / Entry: BORDER_WIDTH_SCALE, BorderWidthKey, BorderWidthValue, getBorderWidth
// Used by: UI components (Input, Card, Table, Divider)
//
// Invariants:
// - Keys match Tailwind's border-{key} classes (border-0, border, border-2, etc.)
// - 'default' maps to 1px (Tailwind's 'border' class without width suffix)
//
// Status: @public
// Features:
// - [FEAT:BORDER] Border width scale

/** Border width scale key identifiers */
export type BorderWidthKey = '0' | 'default' | '2' | '4' | '8';

/** Border width value definition */
export interface BorderWidthValue {
  /** CSS value string */
  css: string;
  /** Pixel value */
  px: number;
  /** Tailwind CSS class */
  tailwindClass: string;
}

/** Border width scale matching Tailwind CSS defaults */
export const BORDER_WIDTH_SCALE: Readonly<Record<BorderWidthKey, BorderWidthValue>> = {
  '0': { css: '0px', px: 0, tailwindClass: 'border-0' },
  default: { css: '1px', px: 1, tailwindClass: 'border' },
  '2': { css: '2px', px: 2, tailwindClass: 'border-2' },
  '4': { css: '4px', px: 4, tailwindClass: 'border-4' },
  '8': { css: '8px', px: 8, tailwindClass: 'border-8' },
} as const;

/**
 * Get the border width value for a given key.
 * @param key - Border width scale key
 */
export function getBorderWidth(key: BorderWidthKey): BorderWidthValue {
  return BORDER_WIDTH_SCALE[key];
}

/**
 * Get the Tailwind CSS class for a border width key.
 * @param key - Border width scale key
 * @example getBorderWidthClass('2') → 'border-2'
 */
export function getBorderWidthClass(key: BorderWidthKey): string {
  return BORDER_WIDTH_SCALE[key].tailwindClass;
}
