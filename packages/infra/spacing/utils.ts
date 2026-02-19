// File: packages/infra/spacing/utils.ts  [TRACE:FILE=packages.infra.spacing.utils]
// Purpose: Utility functions for spacing calculations: px↔rem conversion, scale lookup,
//          CSS custom property generation, and responsive spacing helpers.
//
// System role: Spacing computation helpers — pure functions with no side-effects.
// Entry point: import from '@repo/infra/spacing'
//
// Exports / Entry: pxToRem, remToPx, getSpacingValue, spacingVar, clampSpacing, scaleSpacing
// Used by: UI components, layout systems, theme utilities
//
// Invariants:
// - All functions are pure (no side-effects)
// - Base font size is 16px (standard browser default)
// - Negative spacing values are supported for negative margins
//
// Status: @public
// Features:
// - [FEAT:SPACING] Spacing calculation utilities

import { SPACING_SCALE, SEMANTIC_SPACING } from './scale';
import type { SpacingKey, SemanticSpacingKey } from './scale';

const BASE_FONT_SIZE_PX = 16;

/**
 * Convert a pixel value to rem.
 * @param px - Pixel value to convert
 * @param baseFontSize - Base font size in px (default: 16)
 */
export function pxToRem(px: number, baseFontSize = BASE_FONT_SIZE_PX): string {
  return `${px / baseFontSize}rem`;
}

/**
 * Convert a rem value to pixels.
 * @param rem - Rem value to convert
 * @param baseFontSize - Base font size in px (default: 16)
 */
export function remToPx(rem: number, baseFontSize = BASE_FONT_SIZE_PX): number {
  return rem * baseFontSize;
}

/**
 * Look up a spacing value from the standard scale by key.
 * @param key - Spacing scale key (e.g. '4', '8', '12')
 * @returns SpacingValue with px, rem, and tailwindClass
 */
export function getSpacingValue(key: SpacingKey) {
  const value = SPACING_SCALE[key];
  if (!value) {
    throw new Error(`Invalid spacing key: "${key}". Must be a valid SpacingKey.`);
  }
  return value;
}

/**
 * Look up spacing by semantic alias (xs, sm, md, lg, xl, 2xl, 3xl).
 * @param alias - Semantic spacing alias
 */
export function getSemanticSpacing(alias: SemanticSpacingKey) {
  const key = SEMANTIC_SPACING[alias];
  return getSpacingValue(key);
}

/**
 * Generate a CSS custom property reference for spacing.
 * @example spacingVar('md') → 'var(--spacing-md)'
 */
export function spacingVar(alias: SemanticSpacingKey): string {
  return `var(--spacing-${alias})`;
}

/**
 * Generate CSS custom property declarations for all semantic spacing values.
 * Suitable for injecting into a :root block.
 */
export function getSpacingCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  const aliases = Object.keys(SEMANTIC_SPACING) as SemanticSpacingKey[];
  for (const alias of aliases) {
    const value = getSemanticSpacing(alias);
    vars[`--spacing-${alias}`] = `${value.rem}rem`;
  }
  return vars;
}

/**
 * Clamp a spacing value between min and max scale keys.
 * Returns the closest valid scale value within the range.
 *
 * @param value - Current px value
 * @param minKey - Minimum scale key
 * @param maxKey - Maximum scale key
 */
export function clampSpacing(
  value: number,
  minKey: SpacingKey,
  maxKey: SpacingKey
): number {
  const min = SPACING_SCALE[minKey]?.px ?? 0;
  const max = SPACING_SCALE[maxKey]?.px ?? Infinity;
  return Math.min(Math.max(value, min), max);
}

/**
 * Scale a spacing value by a multiplier and return the nearest valid scale value.
 * Useful for responsive spacing calculations.
 *
 * @param key - Base spacing key
 * @param multiplier - Scale factor (e.g. 1.5, 2)
 */
export function scaleSpacing(key: SpacingKey, multiplier: number): number {
  const base = SPACING_SCALE[key]?.px ?? 0;
  return base * multiplier;
}
