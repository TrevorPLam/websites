/**
 * @file packages/infrastructure/theme/src/css-vars.ts
 * Task: [F.5] Theme extension system — CSS custom property generation
 *
 * Purpose: Convert design tokens into CSS custom property declarations.
 *          Generates both light and dark mode variable sets.
 *          Output can be injected into :root or any selector.
 *
 * Exports: tokensToCSSVars, tokensToStyleObject, generateThemeCSS,
 *          CSS_VAR_PREFIX
 *
 * Invariants:
 * - Variable names are predictable: --{prefix}-{category}-{key}
 * - camelCase keys are converted to kebab-case
 * - Output is always a plain string of CSS declarations
 * - No DOM access — pure string generation
 */

import type { DesignTokens } from './tokens';

// ─── Configuration ────────────────────────────────────────────────────────────

export const CSS_VAR_PREFIX = 'dt' as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert camelCase to kebab-case.
 * @example camelToKebab('primaryForeground') → 'primary-foreground'
 */
export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Build a CSS variable name from category and key.
 * @example cssVarName('colors', 'primaryForeground') → '--dt-colors-primary-foreground'
 */
export function cssVarName(category: string, key: string): string {
  return `--${CSS_VAR_PREFIX}-${camelToKebab(category)}-${camelToKebab(key)}`;
}

// ─── Core conversion ─────────────────────────────────────────────────────────

/**
 * Convert a single token category to CSS custom property declarations.
 *
 * @example
 * tokenCategoryToCSS('colors', { primary: '174 85% 33%' })
 * // → '--dt-colors-primary: 174 85% 33%;'
 */
type TokenMap = Record<string, string | undefined>;

function tokenCategoryToCSS(category: string, tokens: TokenMap): string {
  return Object.entries(tokens)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([key, value]) => `  ${cssVarName(category, key)}: ${value};`)
    .join('\n');
}

/**
 * Convert all design tokens to a CSS block for the given color mode.
 *
 * @param tokens - The design tokens to convert
 * @param mode - 'light' | 'dark' — determines which color set to use
 * @param selector - CSS selector to wrap the declarations (default ':root')
 *
 * @example
 * const css = tokensToCSSVars(myTokens, 'light');
 * // Output: ':root {\n  --dt-colors-primary: 174 85% 33%;\n  ...\n}'
 */
export function tokensToCSSVars(
  tokens: DesignTokens,
  mode: 'light' | 'dark' = 'light',
  selector = ':root'
): string {
  const colors: TokenMap =
    mode === 'dark' ? { ...tokens.colors, ...tokens.darkColors } : tokens.colors;

  const sections = [
    tokenCategoryToCSS('colors', colors),
    tokenCategoryToCSS('radius', tokens.radius as TokenMap),
    tokenCategoryToCSS('shadows', tokens.shadows as TokenMap),
    tokenCategoryToCSS('typography', tokens.typography as TokenMap),
    tokenCategoryToCSS('animation', tokens.animation as TokenMap),
  ].filter(Boolean);

  return `${selector} {\n${sections.join('\n')}\n}`;
}

/**
 * Convert all tokens to a React `style` object (for inline injection).
 * Useful for scoped theming without a `<style>` tag.
 *
 * @example
 * const style = tokensToStyleObject(myTokens, 'light');
 * return <div style={style}>...</div>;
 */
export function tokensToStyleObject(
  tokens: DesignTokens,
  mode: 'light' | 'dark' = 'light'
): Record<string, string> {
  const colors: TokenMap =
    mode === 'dark' ? { ...tokens.colors, ...tokens.darkColors } : tokens.colors;

  const result: Record<string, string> = {};

  const add = (category: string, map: TokenMap) => {
    for (const [key, value] of Object.entries(map)) {
      if (value !== undefined && value !== '') {
        result[cssVarName(category, key)] = value;
      }
    }
  };

  add('colors', colors);
  add('radius', tokens.radius as TokenMap);
  add('shadows', tokens.shadows as TokenMap);
  add('typography', tokens.typography as TokenMap);
  add('animation', tokens.animation as TokenMap);

  return result;
}

/**
 * Generate a complete `<style>` tag content for both light and dark modes.
 *
 * @example
 * const css = generateThemeCSS(myTokens);
 * // `:root { ... } [data-color-mode="dark"] { ... }`
 */
export function generateThemeCSS(tokens: DesignTokens): string {
  const lightCSS = tokensToCSSVars(tokens, 'light', ':root');
  const darkCSS = tokensToCSSVars(tokens, 'dark', '[data-color-mode="dark"]');
  return `${lightCSS}\n\n${darkCSS}`;
}
