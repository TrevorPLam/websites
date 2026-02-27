/**
 * @file packages/design-tokens/src/tokens.ts
 * @summary Comprehensive design tokens for color, typography, spacing, and components
 * @description Single source of truth for all design system values using HSL color format
 * @security Static values used for theming only - no runtime logic
 * @requirements GAP-DESIGN-001, PROD-UI-001, TASK-DS-001
 */

// Base color palette using HSL format for CSS custom properties
export const colorTokens = {
  // Semantic colors
  white: '0 0% 100%',
  black: '0 0% 0%',
  
  // Brand colors
  primary: {
    50: '174 85% 97%',
    100: '174 85% 94%',
    200: '174 85% 87%',
    300: '174 85% 78%',
    400: '174 85% 65%',
    500: '174 85% 33%', // Primary brand color
    600: '174 85% 28%',
    700: '174 85% 23%',
    800: '174 85% 18%',
    900: '174 85% 13%',
    950: '174 85% 8%',
  },
  
  secondary: {
    50: '220 20% 98%',
    100: '220 20% 95%',
    200: '220 20% 90%',
    300: '220 20% 82%',
    400: '220 20% 70%',
    500: '220 20% 14%', // Secondary brand color
    600: '220 20% 12%',
    700: '220 20% 10%',
    800: '220 20% 8%',
    900: '220 20% 6%',
    950: '220 20% 4%',
  },
  
  // Neutral colors
  gray: {
    50: '220 14% 98%',
    100: '220 14% 96%',
    200: '220 14% 92%',
    300: '220 14% 88%',
    400: '220 14% 78%',
    500: '220 14% 66%',
    600: '220 14% 55%',
    700: '220 14% 46%',
    800: '220 14% 39%',
    900: '220 14% 33%',
    950: '220 14% 26%',
  },
  
  // Semantic colors
  success: {
    50: '142 76% 96%',
    100: '142 76% 92%',
    200: '142 76% 84%',
    300: '142 76% 72%',
    400: '142 76% 58%',
    500: '142 76% 36%',
    600: '142 76% 31%',
    700: '142 76% 26%',
    800: '142 76% 21%',
    900: '142 76% 16%',
    950: '142 76% 11%',
  },
  
  warning: {
    50: '38 92% 96%',
    100: '38 92% 92%',
    200: '38 92% 84%',
    300: '38 92% 72%',
    400: '38 92% 58%',
    500: '38 92% 36%',
    600: '38 92% 31%',
    700: '38 92% 26%',
    800: '38 92% 21%',
    900: '38 92% 16%',
    950: '38 92% 11%',
  },
  
  error: {
    50: '0 72% 96%',
    100: '0 72% 92%',
    200: '0 72% 84%',
    300: '0 72% 72%',
    400: '0 72% 58%',
    500: '0 72% 38%', // Destructive/error color
    600: '0 72% 33%',
    700: '0 72% 28%',
    800: '0 72% 23%',
    900: '0 72% 18%',
    950: '0 72% 13%',
  },
  
  info: {
    50: '214 100% 97%',
    100: '214 100% 94%',
    200: '214 100% 87%',
    300: '214 100% 78%',
    400: '214 100% 65%',
    500: '214 100% 50%',
    600: '214 100% 45%',
    700: '214 100% 40%',
    800: '214 100% 35%',
    900: '214 100% 30%',
    950: '214 100% 25%',
  },
} as const;

// Typography tokens
export const typographyTokens = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
    display: ['Inter Display', 'Inter', 'system-ui', 'sans-serif'],
  },
  
  // Font sizes using CSS custom property compatible values
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// Spacing tokens
export const spacingTokens = {
  // Base spacing scale (4px base unit)
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',   // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',    // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',   // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem',    // 384px,
} as const;

// Border radius tokens
export const borderRadiusTokens = {
  none: '0',
  px: '1px',
  sm: '0.125rem',  // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Shadow tokens
export const shadowTokens = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Colored shadows
  primary: '0 4px 6px -1px rgb(174 85% 33% / 0.1), 0 2px 4px -2px rgb(174 85% 33% / 0.1)',
  success: '0 4px 6px -1px rgb(142 76% 36% / 0.1), 0 2px 4px -2px rgb(142 76% 36% / 0.1)',
  warning: '0 4px 6px -1px rgb(38 92% 36% / 0.1), 0 2px 4px -2px rgb(38 92% 36% / 0.1)',
  error: '0 4px 6px -1px rgb(0 72% 38% / 0.1), 0 2px 4px -2px rgb(0 72% 38% / 0.1)',
} as const;

// Z-index tokens
export const zIndexTokens = {
  hide: '-1',
  auto: 'auto',
  base: '0',
  docked: '10',
  dropdown: '1000',
  sticky: '1100',
  banner: '1200',
  overlay: '1300',
  modal: '1400',
  popover: '1500',
  skipLink: '1600',
  toast: '1700',
  tooltip: '1800',
} as const;

// Animation tokens
export const animationTokens = {
  // Durations
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  // Timing functions
  ease: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Component-specific tokens
export const componentTokens = {
  // Button tokens
  button: {
    height: {
      sm: '2rem',    // 32px
      md: '2.5rem',  // 40px
      lg: '3rem',    // 48px
      xl: '3.5rem',  // 56px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
      xl: '1.25rem 2.5rem',
    },
    fontSize: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  },
  
  // Input tokens
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.75rem 1rem',
      lg: '1rem 1.25rem',
    },
    fontSize: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
    },
  },
  
  // Card tokens
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    borderRadius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
    },
    shadow: {
      sm: 'sm',
      md: 'DEFAULT',
      lg: 'md',
      xl: 'lg',
    },
  },
  
  // Navigation tokens
  navigation: {
    height: {
      sm: '3rem',
      md: '4rem',
      lg: '5rem',
    },
    padding: {
      sm: '0 1rem',
      md: '0 2rem',
      lg: '0 4rem',
    },
  },
  
  // Container tokens
  container: {
    maxWidth: {
      sm: '36rem',    // 576px
      md: '48rem',    // 768px
      lg: '64rem',    // 1024px
      xl: '80rem',    // 1280px
      '2xl': '96rem', // 1536px
    },
    padding: {
      sm: '1rem',
      md: '2rem',
      lg: '4rem',
      xl: '6rem',
    },
  },
} as const;

// Breakpoint tokens
export const breakpointTokens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Combined design tokens object
export const designTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  borderRadius: borderRadiusTokens,
  shadows: shadowTokens,
  zIndex: zIndexTokens,
  animation: animationTokens,
  components: componentTokens,
  breakpoints: breakpointTokens,
} as const;

// Semantic color shortcuts for common use
export const semanticColors = {
  // Background colors
  background: colorTokens.white,
  foreground: colorTokens.gray[900],
  
  // Surface colors
  surface: colorTokens.gray[50],
  surfaceVariant: colorTokens.gray[100],
  surfaceHighlight: colorTokens.primary[50],
  
  // Primary colors
  primary: colorTokens.primary[500],
  primaryForeground: colorTokens.white,
  primaryHover: colorTokens.primary[600],
  primaryActive: colorTokens.primary[700],
  
  // Secondary colors
  secondary: colorTokens.secondary[500],
  secondaryForeground: colorTokens.white,
  secondaryHover: colorTokens.secondary[600],
  secondaryActive: colorTokens.secondary[700],
  
  // Muted colors
  muted: colorTokens.gray[100],
  mutedForeground: colorTokens.gray[500],
  
  // Accent colors
  accent: colorTokens.primary[100],
  accentForeground: colorTokens.primary[900],
  accentHover: colorTokens.primary[200],
  
  // Border colors
  border: colorTokens.gray[200],
  borderHover: colorTokens.gray[300],
  borderFocus: colorTokens.primary[500],
  
  // Input colors
  input: colorTokens.gray[100],
  inputForeground: colorTokens.gray[900],
  inputBorder: colorTokens.gray[300],
  inputBorderFocus: colorTokens.primary[500],
  
  // Ring colors (for focus states)
  ring: colorTokens.primary[500],
  ringOffset: colorTokens.white,
  
  // Status colors
  success: colorTokens.success[500],
  successForeground: colorTokens.white,
  warning: colorTokens.warning[500],
  warningForeground: colorTokens.white,
  error: colorTokens.error[500],
  errorForeground: colorTokens.white,
  info: colorTokens.info[500],
  infoForeground: colorTokens.white,
  
  // Text colors
  textPrimary: colorTokens.gray[900],
  textSecondary: colorTokens.gray[600],
  textMuted: colorTokens.gray[500],
  textDisabled: colorTokens.gray[400],
  
  // Link colors
  link: colorTokens.primary[600],
  linkVisited: colorTokens.primary[700],
  linkHover: colorTokens.primary[800],
  linkActive: colorTokens.primary[900],
} as const;

// Export types
export type ColorTokens = typeof colorTokens;
export type TypographyTokens = typeof typographyTokens;
export type SpacingTokens = typeof spacingTokens;
export type BorderRadiusTokens = typeof borderRadiusTokens;
export type ShadowTokens = typeof shadowTokens;
export type ZIndexTokens = typeof zIndexTokens;
export type AnimationTokens = typeof animationTokens;
export type ComponentTokens = typeof componentTokens;
export type BreakpointTokens = typeof breakpointTokens;
export type DesignTokens = typeof designTokens;
export type SemanticColors = typeof semanticColors;

// Legacy exports for backward compatibility
export { designTokens as default };
