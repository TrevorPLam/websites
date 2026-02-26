// File: packages/infra/typography/line-height.ts  [TRACE:FILE=packages.infra.typography.line-height]
// Purpose: Line height scale constants and utility functions.
//          Maps semantic line-height keys (none, tight, snug, normal, relaxed, loose)
//          to CSS values and Tailwind class names.
//
// System role: Single source of truth for line-height tokens.
// Entry point: import from '@repo/infrastructure/typography'
//
// Exports / Entry: LINE_HEIGHT_SCALE, LineHeightKey, LineHeightValue, getLineHeight
// Used by: typography utils, UI text components
//
// Invariants:
// - Keys match Tailwind's leading-{key} classes exactly
// - Values are unitless ratios (recommended for accessibility)
//
// Status: @public
// Features:
// - [FEAT:TYPOGRAPHY] Line height scale

/** Line height scale key identifiers (Tailwind leading-{key}) */
export type LineHeightKey =
  | 'none'
  | 'tight'
  | 'snug'
  | 'normal'
  | 'relaxed'
  | 'loose'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10';

/** Line height value definition */
export interface LineHeightValue {
  /** CSS value (unitless ratio or px string) */
  value: string;
  /** Tailwind CSS class */
  tailwindClass: string;
  /** Approximate ratio (for documentation) */
  ratio?: number;
}

/** Line height scale matching Tailwind CSS defaults */
export const LINE_HEIGHT_SCALE: Readonly<Record<LineHeightKey, LineHeightValue>> = {
  none: { value: '1', tailwindClass: 'leading-none', ratio: 1 },
  tight: { value: '1.25', tailwindClass: 'leading-tight', ratio: 1.25 },
  snug: { value: '1.375', tailwindClass: 'leading-snug', ratio: 1.375 },
  normal: { value: '1.5', tailwindClass: 'leading-normal', ratio: 1.5 },
  relaxed: { value: '1.625', tailwindClass: 'leading-relaxed', ratio: 1.625 },
  loose: { value: '2', tailwindClass: 'leading-loose', ratio: 2 },
  // Fixed px values (Tailwind rem-based line heights)
  '3': { value: '.75rem', tailwindClass: 'leading-3' },
  '4': { value: '1rem', tailwindClass: 'leading-4' },
  '5': { value: '1.25rem', tailwindClass: 'leading-5' },
  '6': { value: '1.5rem', tailwindClass: 'leading-6' },
  '7': { value: '1.75rem', tailwindClass: 'leading-7' },
  '8': { value: '2rem', tailwindClass: 'leading-8' },
  '9': { value: '2.25rem', tailwindClass: 'leading-9' },
  '10': { value: '2.5rem', tailwindClass: 'leading-10' },
} as const;

/**
 * Get a line height value by key.
 * @param key - Line height scale key
 */
export function getLineHeight(key: LineHeightKey): LineHeightValue {
  return LINE_HEIGHT_SCALE[key];
}

/**
 * Get the Tailwind CSS leading class for a line height key.
 * @param key - Line height scale key
 * @example getLeadingClass('relaxed') → 'leading-relaxed'
 */
export function getLeadingClass(key: LineHeightKey): string {
  return LINE_HEIGHT_SCALE[key].tailwindClass;
}

/**
 * Recommended line height for a given font size in px.
 * Larger text benefits from tighter line heights (headings use 'tight', body uses 'normal').
 */
export function recommendedLineHeight(fontSizePx: number): LineHeightKey {
  if (fontSizePx >= 48) return 'none';
  if (fontSizePx >= 36) return 'tight';
  if (fontSizePx >= 24) return 'snug';
  if (fontSizePx >= 18) return 'normal';
  return 'relaxed';
}
