// File: packages/infra/color/palette.ts  [TRACE:FILE=packages.infra.color.palette]
// Purpose: Default color palette constants and semantic color role definitions.
//          Provides a baseline neutral palette and validation helpers for site.config.ts colors.
//
// System role: Color constants for default/fallback values; validation helpers for ThemeColors.
// Entry point: import from '@repo/infrastructure/color'
//
// Exports / Entry: NEUTRAL_PALETTE, DEFAULT_THEME_COLORS, REQUIRED_COLOR_KEYS, validateThemeColors
// Used by: site.config.ts validation, ThemeInjector fallback, design system documentation
//
// Invariants:
// - All color values use project HSL format ("H S% L%")
// - REQUIRED_COLOR_KEYS must be present in every ThemeColors object
// - Default palette provides a neutral, accessible starting point
//
// Status: @public
// Features:
// - [FEAT:COLOR] Default palette and theme validation

/** All required keys in a ThemeColors object */
export const REQUIRED_COLOR_KEYS = [
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'background',
  'foreground',
  'muted',
  'muted-foreground',
  'card',
  'card-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
] as const;

export type RequiredColorKey = (typeof REQUIRED_COLOR_KEYS)[number];

/** Neutral base palette in project HSL format */
export const NEUTRAL_PALETTE = {
  /** Pure white */
  white: '0 0% 100%',
  /** Pure black */
  black: '0 0% 0%',
  /** Neutral gray scale */
  gray50: '210 40% 98%',
  gray100: '210 40% 96%',
  gray200: '214 32% 91%',
  gray300: '213 27% 84%',
  gray400: '215 20% 65%',
  gray500: '215 16% 47%',
  gray600: '215 19% 35%',
  gray700: '215 25% 27%',
  gray800: '217 33% 17%',
  gray900: '222 47% 11%',
  /** Destructive / error red */
  red500: '0 84% 60%',
  red600: '0 72% 51%',
  red700: '0 63% 31%',
} as const;

/** Default theme colors (neutral, accessible starting point) */
export const DEFAULT_THEME_COLORS: Readonly<Record<RequiredColorKey, string>> = {
  primary: '221 83% 53%',
  'primary-foreground': '0 0% 100%',
  secondary: '210 40% 96%',
  'secondary-foreground': '222 47% 11%',
  accent: '210 40% 96%',
  'accent-foreground': '222 47% 11%',
  background: '0 0% 100%',
  foreground: '222 47% 11%',
  muted: '210 40% 96%',
  'muted-foreground': '215 16% 47%',
  card: '0 0% 100%',
  'card-foreground': '222 47% 11%',
  destructive: '0 72% 51%',
  'destructive-foreground': '0 0% 100%',
  border: '214 32% 91%',
  input: '214 32% 91%',
  ring: '221 83% 53%',
} as const;

/**
 * Validate that a theme colors object contains all required keys.
 * Returns a list of missing keys (empty array = valid).
 *
 * @param colors - Partial or complete theme colors object
 */
export function validateThemeColors(colors: Record<string, string>): string[] {
  return REQUIRED_COLOR_KEYS.filter((key) => !(key in colors) || !colors[key]);
}

/**
 * Merge partial theme colors with the default palette.
 * Missing keys fall back to DEFAULT_THEME_COLORS.
 *
 * @param partialColors - Partial theme colors to merge
 */
export function mergeWithDefaults(
  partialColors: Partial<Record<RequiredColorKey, string>>
): Record<RequiredColorKey, string> {
  return { ...DEFAULT_THEME_COLORS, ...partialColors };
}
