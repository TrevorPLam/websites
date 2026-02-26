// File: packages/infra/spacing/scale.ts  [TRACE:FILE=packages.infra.spacing.scale]
// Purpose: Standard spacing scale constants following the 4px base-unit system.
//          Provides named tokens (xs → 3xl) mapping to pixel values and Tailwind class names.
//
// System role: Single source of truth for spacing token values.
// Entry point: import from '@repo/infrastructure/spacing'
//
// Exports / Entry: SPACING_SCALE, SpacingKey, SpacingValue, spacingTailwindClass
// Used by: spacing utils, UI components, layout systems
//
// Invariants:
// - All values are multiples of 4px (standard spacing grid)
// - Keys are stable — never remove a key once published
// - Tailwind classes must exist in the project's Tailwind config
//
// Status: @public
// Features:
// - [FEAT:SPACING] Design-system spacing scale

/** Spacing scale key identifiers */
export type SpacingKey =
  | 'px'
  | '0'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '72'
  | '80'
  | '96';

/** Semantic spacing alias */
export type SemanticSpacingKey =
  | 'none'
  | 'px'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

/** Spacing value in pixels */
export interface SpacingValue {
  px: number;
  rem: number;
  tailwindClass: string;
}

/** Full Tailwind spacing scale (4px base unit) */
export const SPACING_SCALE: Readonly<Record<SpacingKey, SpacingValue>> = {
  px: { px: 1, rem: 0.0625, tailwindClass: 'px' },
  '0': { px: 0, rem: 0, tailwindClass: '0' },
  '0.5': { px: 2, rem: 0.125, tailwindClass: '0.5' },
  '1': { px: 4, rem: 0.25, tailwindClass: '1' },
  '1.5': { px: 6, rem: 0.375, tailwindClass: '1.5' },
  '2': { px: 8, rem: 0.5, tailwindClass: '2' },
  '2.5': { px: 10, rem: 0.625, tailwindClass: '2.5' },
  '3': { px: 12, rem: 0.75, tailwindClass: '3' },
  '3.5': { px: 14, rem: 0.875, tailwindClass: '3.5' },
  '4': { px: 16, rem: 1, tailwindClass: '4' },
  '5': { px: 20, rem: 1.25, tailwindClass: '5' },
  '6': { px: 24, rem: 1.5, tailwindClass: '6' },
  '7': { px: 28, rem: 1.75, tailwindClass: '7' },
  '8': { px: 32, rem: 2, tailwindClass: '8' },
  '9': { px: 36, rem: 2.25, tailwindClass: '9' },
  '10': { px: 40, rem: 2.5, tailwindClass: '10' },
  '11': { px: 44, rem: 2.75, tailwindClass: '11' },
  '12': { px: 48, rem: 3, tailwindClass: '12' },
  '14': { px: 56, rem: 3.5, tailwindClass: '14' },
  '16': { px: 64, rem: 4, tailwindClass: '16' },
  '20': { px: 80, rem: 5, tailwindClass: '20' },
  '24': { px: 96, rem: 6, tailwindClass: '24' },
  '28': { px: 112, rem: 7, tailwindClass: '28' },
  '32': { px: 128, rem: 8, tailwindClass: '32' },
  '36': { px: 144, rem: 9, tailwindClass: '36' },
  '40': { px: 160, rem: 10, tailwindClass: '40' },
  '44': { px: 176, rem: 11, tailwindClass: '44' },
  '48': { px: 192, rem: 12, tailwindClass: '48' },
  '52': { px: 208, rem: 13, tailwindClass: '52' },
  '56': { px: 224, rem: 14, tailwindClass: '56' },
  '60': { px: 240, rem: 15, tailwindClass: '60' },
  '64': { px: 256, rem: 16, tailwindClass: '64' },
  '72': { px: 288, rem: 18, tailwindClass: '72' },
  '80': { px: 320, rem: 20, tailwindClass: '80' },
  '96': { px: 384, rem: 24, tailwindClass: '96' },
} as const;

/**
 * Semantic spacing aliases mapping to Tailwind scale keys.
 * Use these for component-level spacing to decouple from raw pixel values.
 */
export const SEMANTIC_SPACING: Readonly<Record<SemanticSpacingKey, SpacingKey>> = {
  none: '0',
  px: 'px',
  xs: '1', // 4px
  sm: '2', // 8px
  md: '4', // 16px
  lg: '6', // 24px
  xl: '8', // 32px
  '2xl': '12', // 48px
  '3xl': '16', // 64px
  '4xl': '24', // 96px
  '5xl': '32', // 128px
} as const;

/**
 * Get the Tailwind padding/margin class suffix for a semantic spacing key.
 * @example spacingTailwindSuffix('md') → '4'
 */
export function spacingTailwindSuffix(key: SemanticSpacingKey): string {
  return SEMANTIC_SPACING[key];
}
