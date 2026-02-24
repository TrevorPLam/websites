/**
 * @file packages/design-tokens/src/tokens.ts
 * @summary Canonical color, spacing, typography, and component tokens.
 * @security Static values used for theming only.
 * @requirements GAP-DESIGN-001, PROD-UI-001
 */

export const designTokens = {
  color: {
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    primary: '174 85% 33%',
    primaryForeground: '0 0% 100%',
    secondary: '220 20% 14%',
    secondaryForeground: '0 0% 100%',
    muted: '220 14% 92%',
    mutedForeground: '220 10% 40%',
    accent: '174 85% 93%',
    accentForeground: '174 85% 20%',
    destructive: '0 72% 38%',
    destructiveForeground: '0 0% 100%',
    border: '220 14% 88%',
    input: '220 14% 88%',
    ring: '174 85% 33%',
  },
  typography: {
    fontFamilySans: ['Inter', 'system-ui', 'sans-serif'],
    fontFamilyMono: ['JetBrains Mono', 'monospace'],
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  component: {
    buttonHeight: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
