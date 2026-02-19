/**
 * @file packages/infrastructure/theme/src/extension.ts
 * Task: [F.5] Theme extension system — theme composition and extension
 *
 * Purpose: Utilities for extending and composing design tokens.
 *          `extendTokens` performs a deep merge so clients only need to
 *          specify overrides — the rest falls through from the base.
 *
 * Exports: extendTokens, mergeTokens, createThemeVariant, TokenOverride
 *
 * Invariants:
 * - Extension is non-destructive: base tokens are never mutated
 * - Deep merge preserves nested categories (e.g. partial color overrides)
 * - Color strings must remain HSL without hsl() wrapper
 */

import type { ColorTokens, DesignTokens } from './tokens';
import { DEFAULT_TOKENS } from './tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A partial override of any token category */
export type TokenOverride = {
  colors?: Partial<ColorTokens>;
  darkColors?: Partial<ColorTokens>;
  radius?: Partial<DesignTokens['radius']>;
  shadows?: Partial<DesignTokens['shadows']>;
  typography?: Partial<DesignTokens['typography']>;
  animation?: Partial<DesignTokens['animation']>;
};

/** Named theme variant built from an override */
export interface ThemeVariant {
  name: string;
  tokens: DesignTokens;
}

// ─── Core composition ────────────────────────────────────────────────────────

/**
 * Deep-merge a partial token override onto a base token set.
 * Returns a new object — base is not mutated.
 *
 * @example
 * const brandTheme = extendTokens(DEFAULT_TOKENS, {
 *   colors: { primary: '262 83% 58%' },
 * });
 */
function mergeCategory<T>(base: T, override?: Partial<T>): T {
  return { ...base, ...override } as T;
}

export function extendTokens(base: DesignTokens, override: TokenOverride): DesignTokens {
  return {
    colors: mergeCategory(base.colors, override.colors),
    darkColors: mergeCategory(base.darkColors, override.darkColors),
    radius: mergeCategory(base.radius, override.radius),
    shadows: mergeCategory(base.shadows, override.shadows),
    typography: mergeCategory(base.typography, override.typography),
    animation: mergeCategory(base.animation, override.animation),
  };
}

/**
 * Merge multiple token overrides in order (last wins).
 * Useful for layering brand + client-specific customizations.
 *
 * @example
 * const finalTheme = mergeTokens(DEFAULT_TOKENS, brandOverride, clientOverride);
 */
export function mergeTokens(base: DesignTokens, ...overrides: TokenOverride[]): DesignTokens {
  return overrides.reduce<DesignTokens>((acc, override) => extendTokens(acc, override), base);
}

/**
 * Create a named theme variant by extending the default token set.
 *
 * @example
 * const luxeTheme = createThemeVariant('luxe-salon', {
 *   colors: { primary: '287 54% 42%' },
 * });
 */
export function createThemeVariant(
  name: string,
  override: TokenOverride,
  base: DesignTokens = DEFAULT_TOKENS
): ThemeVariant {
  return {
    name,
    tokens: extendTokens(base, override),
  };
}
