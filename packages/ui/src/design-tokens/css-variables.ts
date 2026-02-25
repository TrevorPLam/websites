/**
 * CSS Custom Properties for Runtime Theming
 * Generates CSS variables for per-tenant theme overrides
 * WCAG 2.2 AA compliant design system
 */

export { generateCSSVariables, applyTenantTheme, validateWCAGCompliance } from './theme-tokens';
export type { ThemeTokens } from './theme-tokens';
