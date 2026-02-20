/**
 * @file packages/types/src/theme-presets.ts
 * Purpose: Theme preset library (inf-12). Curated token overrides: minimal, bold, professional.
 *          Merged with DEFAULT_THEME_COLORS and theme.colors in resolveThemeColors().
 * Task: inf-12 Theme Preset Library
 */

import type { ThemeColors } from './site-config';
import { DEFAULT_THEME_COLORS } from './site-config';

/** Named presets supported in site.config.theme.preset */
export type ThemePresetName = 'minimal' | 'bold' | 'professional';

/** Preset definitions: partial theme color overrides (HSL strings). */
const PRESETS: Record<ThemePresetName, Partial<ThemeColors>> = {
  minimal: {
    primary: '0 0% 9%',
    'primary-foreground': '0 0% 98%',
    background: '0 0% 100%',
    foreground: '0 0% 9%',
    muted: '0 0% 96%',
    'muted-foreground': '0 0% 45%',
    border: '0 0% 90%',
    ring: '0 0% 64%',
  },
  bold: {
    primary: '262 83% 58%',
    'primary-foreground': '0 0% 100%',
    secondary: '280 60% 40%',
    'secondary-foreground': '0 0% 100%',
    accent: '45 93% 47%',
    'accent-foreground': '0 0% 9%',
    background: '240 10% 4%',
    foreground: '0 0% 98%',
    muted: '240 6% 10%',
    'muted-foreground': '0 0% 64%',
    card: '240 6% 10%',
    'card-foreground': '0 0% 98%',
    border: '240 4% 16%',
    input: '240 4% 16%',
    ring: '262 83% 58%',
  },
  professional: {
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
    border: '214 32% 91%',
    input: '214 32% 91%',
    ring: '221 83% 53%',
  },
};

/**
 * Returns preset token overrides by name, or undefined if unknown.
 */
export function getThemePreset(name: ThemePresetName): Partial<ThemeColors> {
  return PRESETS[name];
}

/** Theme config slice used for resolution (preset + colors). */
export interface ThemeConfigForResolution {
  preset?: ThemePresetName;
  colors?: Partial<ThemeColors>;
}

/**
 * Resolves theme colors for ThemeInjector: base + preset + theme.colors.
 * Use in layout before passing to LocaleProviders/ThemeInjector.
 *
 * Resolution order: DEFAULT_THEME_COLORS (full) → preset overrides → theme.colors overrides.
 * Always returns a full ThemeColors because DEFAULT_THEME_COLORS provides all required keys.
 */
export function resolveThemeColors(theme: ThemeConfigForResolution): ThemeColors {
  const presetOverrides = theme.preset ? (getThemePreset(theme.preset) ?? {}) : {};
  // DEFAULT_THEME_COLORS is ThemeColors (all required keys); spread always yields ThemeColors.
  return { ...DEFAULT_THEME_COLORS, ...presetOverrides, ...theme.colors } as ThemeColors;
}
