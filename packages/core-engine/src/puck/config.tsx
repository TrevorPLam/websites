import React from 'react';
import { createConfig, Config } from '@measured/puck';
import { headingAnalyzer } from '@measured/puck-plugin-heading-analyzer';
import { designTokens } from '@repo/design-tokens';
import { z } from 'zod';

// Design token schema
const DesignTokenSchema = z.object({
  colors: z.record(z.string()),
  fonts: z.record(z.string()),
  spacing: z.record(z.string()),
  borderRadius: z.record(z.string()),
  shadows: z.record(z.string()),
});

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

// Create Puck configuration with design tokens integration
export function createPuckConfig(overrides: Partial<PuckConfig> = {}): Config {
  const baseConfig: PuckConfig = {
    root: {
      title: 'Page Builder',
      description: 'Drag and drop page builder with design tokens',
    },
    components: {},
    theme: {
      colors: designTokens.colors,
      fonts: designTokens.fonts,
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
      colors: validated.theme.colors,
      fonts: validated.theme.fonts,
      spacing: validated.theme.spacing,
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
