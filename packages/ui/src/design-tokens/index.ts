/**
 * @file packages/ui/src/design-tokens/index.ts
 * @summary UI package re-export surface for shared design tokens.
 * @security Re-exports static token definitions only.
 * @requirements PROD-UI-001
 */

export { designTokens } from '@repo/design-tokens';
export type { DesignTokens } from '@repo/design-tokens';

// Enhanced theme tokens with CSS custom properties
export { themeTokens, generateCSSVariables, applyTenantTheme, validateWCAGCompliance } from './theme-tokens';
export type { ThemeTokens } from './theme-tokens';
