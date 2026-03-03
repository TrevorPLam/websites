/**
 * @file packages/core-engine/src/puck/config.tsx
 * @summary Puck editor configuration with design tokens integration.
 * @description Defines Puck editor configuration with design system tokens and component settings.
 * @security Configuration data; no sensitive information stored.
 * @adr none
 * @requirements DOMAIN-3 / core-engine-implementation
 */
import { Config, createConfig } from '@puckeditor/core';
import { headingAnalyzer } from '@puckeditor/plugin-heading-analyzer';
import { z } from 'zod';

// Design token schema
const DesignTokenSchema = z.object({
  colors: z.record(z.string()),
  fonts: z.record(z.string()),
  spacing: z.record(z.string()),
  borderRadius: z.record(z.string()),
  shadows: z.record(z.string()),
});

// Local design tokens for Puck integration
const designTokens = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
};

// Component configuration schema
const ComponentConfigSchema = z.object({
  heading: z.object({
    levels: z.array(z.string()),
    defaultLevel: z.string(),
  }),
  button: z.object({
    variants: z.array(z.string()),
    defaultVariant: z.string(),
    sizes: z.array(z.string()),
    defaultSize: z.string(),
  }),
  card: z.object({
    variants: z.array(z.string()),
    defaultVariant: z.string(),
    padding: z.array(z.string()),
    defaultPadding: z.string(),
  }),
});

// Puck configuration schema
const PuckConfigSchema = z.object({
  root: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
  components: z.record(z.any()),
  theme: z.object({
    colors: z.record(z.string()),
    fonts: z.record(z.string()),
    spacing: z.record(z.string()),
  }),
  ui: ComponentConfigSchema,
});

export type PuckConfig = z.infer<typeof PuckConfigSchema>;

/**
 * Create Puck configuration with design tokens integration.
 * @param overrides - Partial configuration overrides to merge with base config.
 * @returns Complete Puck configuration object with design tokens and component settings.
 */
export function createPuckConfig(overrides: Partial<PuckConfig> = {}): Config {
  const baseConfig: PuckConfig = {
    root: {
      title: 'Page Builder',
      description: 'Drag and drop page builder with design tokens',
    },
    components: {},
    theme: {
      colors: {
        white: designTokens.colors.white,
        black: designTokens.colors.black,
        primary50: designTokens.colors.primary[50],
        primary100: designTokens.colors.primary[100],
        primary200: designTokens.colors.primary[200],
        primary300: designTokens.colors.primary[300],
        primary400: designTokens.colors.primary[400],
        primary500: designTokens.colors.primary[500],
        primary600: designTokens.colors.primary[600],
        primary700: designTokens.colors.primary[700],
        primary800: designTokens.colors.primary[800],
        primary900: designTokens.colors.primary[900],
        primary950: designTokens.colors.primary[950],
        gray50: designTokens.colors.gray[50],
        gray100: designTokens.colors.gray[100],
        gray200: designTokens.colors.gray[200],
        gray300: designTokens.colors.gray[300],
        gray400: designTokens.colors.gray[400],
        gray500: designTokens.colors.gray[500],
        gray600: designTokens.colors.gray[600],
        gray700: designTokens.colors.gray[700],
        gray800: designTokens.colors.gray[800],
        gray900: designTokens.colors.gray[900],
        gray950: designTokens.colors.gray[950],
      },
      fonts: {
        sans: designTokens.fonts.sans.join(', '),
        mono: designTokens.fonts.mono.join(', '),
      },
      spacing: designTokens.spacing,
    },
    ui: {
      heading: {
        levels: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        defaultLevel: 'h2',
      },
      button: {
        variants: ['primary', 'secondary', 'outline', 'ghost'],
        defaultVariant: 'primary',
        sizes: ['sm', 'md', 'lg'],
        defaultSize: 'md',
      },
      card: {
        variants: ['default', 'elevated', 'outlined'],
        defaultVariant: 'default',
        padding: ['sm', 'md', 'lg'],
        defaultPadding: 'md',
      },
    },
  };

  const mergedConfig = { ...baseConfig, ...overrides };

  const validated = PuckConfigSchema.parse(mergedConfig);

  return createConfig({
    // Root configuration
    root: validated.root,

    // Component registration
    components: validated.components,

    // Theme configuration
    theme: {
      colors: {
        white: designTokens.colors.white,
        black: designTokens.colors.black,
        primary50: designTokens.colors.primary[50],
        primary100: designTokens.colors.primary[100],
        primary200: designTokens.colors.primary[200],
        primary300: designTokens.colors.primary[300],
        primary400: designTokens.colors.primary[400],
        primary500: designTokens.colors.primary[500],
        primary600: designTokens.colors.primary[600],
        primary700: designTokens.colors.primary[700],
        primary800: designTokens.colors.primary[800],
        primary900: designTokens.colors.primary[900],
        primary950: designTokens.colors.primary[950],
        gray50: designTokens.colors.gray[50],
        gray100: designTokens.colors.gray[100],
        gray200: designTokens.colors.gray[200],
        gray300: designTokens.colors.gray[300],
        gray400: designTokens.colors.gray[400],
        gray500: designTokens.colors.gray[500],
        gray600: designTokens.colors.gray[600],
        gray700: designTokens.colors.gray[700],
        gray800: designTokens.colors.gray[800],
        gray900: designTokens.colors.gray[900],
        gray950: designTokens.colors.gray[950],
      },
      fonts: {
        sans: designTokens.fonts.sans.join(', '),
        mono: designTokens.fonts.mono.join(', '),
      },
      spacing: designTokens.spacing,
    },

    // UI component defaults
    ui: validated.ui,

    // Plugins
    plugins: [headingAnalyzer()],

    // Analytics and tracking
    analytics: {
      trackPageView: true,
      trackComponentChanges: true,
    },

    // Permissions and security
    permissions: {
      canEdit: true,
      canPreview: true,
      canPublish: true,
    },
  });
}

// Export default configuration
export const puckConfig = createPuckConfig();
