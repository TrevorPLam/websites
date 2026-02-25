/**
 * @file packages/ui/src/design-tokens/css-variables.ts
 * @summary CSS custom properties system for runtime theming and tenant-specific overrides.
 * @description Exports theme token generation and validation functions for dynamic styling.
 * @security No security concerns - design token system for UI theming.
 * @adr none
 * @requirements WCAG-2.2, DOMAIN-3-1
 */

/**
 * CSS Custom Properties for Runtime Theming
 * Generates CSS variables for per-tenant theme overrides
 * WCAG 2.2 AA compliant design system
 */

export { generateCSSVariables, applyTenantTheme, validateWCAGCompliance } from './theme-tokens';
export type { ThemeTokens } from './theme-tokens';
