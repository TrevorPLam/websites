/**
 * @file packages/design-tokens/src/tailwind-preset.ts
 * @summary Tailwind CSS preset mapping design tokens to utility classes for consistent theming.
 * @description Maps design tokens to Tailwind utilities with theme integration and CSS custom properties.
 * @security No sensitive data processing; read-only token mapping and CSS generation.
 * @adr docs/architecture/decisions/ADR-004-design-tokens.md
 * @requirements DESIGN-001, TAILWIND-001
 */
/**
 * Tailwind CSS Preset for Design Tokens
 * 
 * Maps design tokens to Tailwind CSS utility classes
 * Provides consistent theming across the application
 */

import { designTokens, semanticColors } from './tokens';

// Tailwind CSS preset configuration
export const tailwindPreset = {
  theme: {
    extend: {
      // Colors
      colors: {
        // Semantic colors
        background: `hsl(${semanticColors.background})`,
        foreground: `hsl(${semanticColors.foreground})`,
        surface: `hsl(${semanticColors.surface})`,
        'surface-variant': `hsl(${semanticColors.surfaceVariant})`,
        'surface-highlight': `hsl(${semanticColors.surfaceHighlight})`,
        
        primary: `hsl(${semanticColors.primary})`,
        'primary-foreground': `hsl(${semanticColors.primaryForeground})`,
        'primary-hover': `hsl(${semanticColors.primaryHover})`,
        'primary-active': `hsl(${semanticColors.primaryActive})`,
        
        secondary: `hsl(${semanticColors.secondary})`,
        'secondary-foreground': `hsl(${semanticColors.secondaryForeground})`,
        'secondary-hover': `hsl(${semanticColors.secondaryHover})`,
        'secondary-active': `hsl(${semanticColors.secondaryActive})}`,
        
        muted: `hsl(${semanticColors.muted})`,
        'muted-foreground': `hsl(${semanticColors.mutedForeground})`,
        
        accent: `hsl(${semanticColors.accent})`,
        'accent-foreground': `hsl(${semanticColors.accentForeground})`,
        'accent-hover': `hsl(${semanticColors.accentHover})`,
        
        border: `hsl(${semanticColors.border})`,
        'border-hover': `hsl(${semanticColors.borderHover})`,
        'border-focus': `hsl(${semanticColors.borderFocus})`,
        
        input: `hsl(${semanticColors.input})`,
        'input-foreground': `hsl(${semanticColors.inputForeground})`,
        'input-border': `hsl(${semanticColors.inputBorder})`,
        'input-border-focus': `hsl(${semanticColors.inputBorderFocus})`,
        
        ring: `hsl(${semanticColors.ring})`,
        'ring-offset': `hsl(${semanticColors.ringOffset})`,
        
        success: `hsl(${semanticColors.success})`,
        'success-foreground': `hsl(${semanticColors.successForeground})`,
        warning: `hsl(${semanticColors.warning})`,
        'warning-foreground': `hsl(${semanticColors.warningForeground})`,
        error: `hsl(${semanticColors.error})`,
        'error-foreground': `hsl(${semanticColors.errorForeground})`,
        info: `hsl(${semanticColors.info})`,
        'info-foreground': `hsl(${semanticColors.infoForeground})`,
        
        // Text colors
        'text-primary': `hsl(${semanticColors.textPrimary})`,
        'text-secondary': `hsl(${semanticColors.textSecondary})`,
        'text-muted': `hsl(${semanticColors.textMuted})`,
        'text-disabled': `hsl(${semanticColors.textDisabled})`,
        
        // Link colors
        link: `hsl(${semanticColors.link})`,
        'link-visited': `hsl(${semanticColors.linkVisited})`,
        'link-hover': `hsl(${semanticColors.linkHover})`,
        'link-active': `hsl(${semanticColors.linkActive})`,
        
        // Brand colors
        'brand-primary': `hsl(${designTokens.colors.primary[500]})`,
        'brand-secondary': `hsl(${designTokens.colors.secondary[500]})`,
        
        // Neutral colors
        'neutral-50': `hsl(${designTokens.colors.gray[50]})`,
        'neutral-100': `hsl(${designTokens.colors.gray[100]})`,
        'neutral-200': `hsl(${designTokens.colors.gray[200]})`,
        'neutral-300': `hsl(${designTokens.colors.gray[300]})`,
        'neutral-400': `hsl(${designTokens.colors.gray[400]})`,
        'neutral-500': `hsl(${designTokens.colors.gray[500]})`,
        'neutral-600': `hsl(${designTokens.colors.gray[600]})`,
        'neutral-700': `hsl(${designTokens.colors.gray[700]})`,
        'neutral-800': `hsl(${designTokens.colors.gray[800]})`,
        'neutral-900': `hsl(${designTokens.colors.gray[900]})`,
        'neutral-950': `hsl(${designTokens.colors.gray[950]})`,
        
        // Status colors
        'status-success': `hsl(${designTokens.colors.success[500]})`,
        'status-warning': `hsl(${designTokens.colors.warning[500]})`,
        'status-error': `hsl(${designTokens.colors.error[500]})`,
        'status-info': `hsl(${designTokens.colors.info[500]})`,
      },
      
      // Font families
      fontFamily: {
        sans: designTokens.typography.fontFamily.sans.join(', '),
        serif: designTokens.typography.fontFamily.serif.join(', '),
        mono: designTokens.typography.fontFamily.mono.join(', '),
        display: designTokens.typography.fontFamily.display.join(', '),
      },
      
      // Font sizes
      fontSize: {
        xs: designTokens.typography.fontSize.xs,
        sm: designTokens.typography.fontSize.sm,
        base: designTokens.typography.fontSize.base,
        lg: designTokens.typography.fontSize.lg,
        xl: designTokens.typography.fontSize.xl,
        '2xl': designTokens.typography.fontSize['2xl'],
        '3xl': designTokens.typography.fontSize['3xl'],
        '4xl': designTokens.typography.fontSize['4xl'],
        '5xl': designTokens.typography.fontSize['5xl'],
        '6xl': designTokens.typography.fontSize['6xl'],
        '7xl': designTokens.typography.fontSize['7xl'],
        '8xl': designTokens.typography.fontSize['8xl'],
        '9xl': designTokens.typography.fontSize['9xl'],
      },
      
      // Font weights
      fontWeight: {
        thin: designTokens.typography.fontWeight.thin,
        extralight: designTokens.typography.fontWeight.extralight,
        light: designTokens.typography.fontWeight.light,
        normal: designTokens.typography.fontWeight.normal,
        medium: designTokens.typography.fontWeight.medium,
        semibold: designTokens.typography.fontWeight.semibold,
        bold: designTokens.typography.fontWeight.bold,
        extrabold: designTokens.typography.fontWeight.extrabold,
        black: designTokens.typography.fontWeight.black,
      },
      
      // Letter spacing
      letterSpacing: {
        tighter: designTokens.typography.letterSpacing.tighter,
        tight: designTokens.typography.letterSpacing.tight,
        normal: designTokens.typography.letterSpacing.normal,
        wide: designTokens.typography.letterSpacing.wide,
        wider: designTokens.typography.letterSpacing.wider,
        widest: designTokens.typography.letterSpacing.widest,
      },
      
      // Line heights
      lineHeight: {
        none: designTokens.typography.lineHeight.none,
        tight: designTokens.typography.lineHeight.tight,
        snug: designTokens.typography.lineHeight.snug,
        normal: designTokens.typography.lineHeight.normal,
        relaxed: designTokens.typography.lineHeight.relaxed,
        loose: designTokens.typography.lineHeight.loose,
      },
      
      // Spacing
      spacing: {
        ...designTokens.spacing,
        // Additional spacing utilities
        '0.5': designTokens.spacing[0.5],
        '1.5': designTokens.spacing[1.5],
        '2.5': designTokens.spacing[2.5],
        '3.5': designTokens.spacing[3.5],
        '4.5': designTokens.spacing[4.5],
        '5.5': designTokens.spacing[5.5],
        '6.5': designTokens.spacing[6.5],
        '7.5': designTokens.spacing[7.5],
        '8.5': designTokens.spacing[8.5],
        '9.5': designTokens.spacing[9.5],
        '10.5': designTokens.spacing[10.5],
        '11.5': designTokens.spacing[11.5],
        '12.5': designTokens.spacing[12.5],
        '13.5': designTokens.spacing[13.5],
        '14.5': designTokens.spacing[14.5],
        '15.5': designTokens.spacing[15.5],
        '16.5': designTokens.spacing[16.5],
        '17.5': designTokens.spacing[17.5],
        '18.5': designTokens.spacing[18.5],
        '19.5': designTokens.spacing[19.5],
        '20.5': designTokens.spacing[20.5],
        '21.5': designTokens.spacing[21.5],
        '22.5': designTokens.spacing[22.5],
        '23.5': designTokens.spacing[23.5],
        '24.5': designTokens.spacing[24.5],
        '25.5': designTokens.spacing[25.5],
        '26.5': designTokens.spacing[26.5],
        '27.5': designTokens.spacing[27.5],
        '28.5': designTokens.spacing[28.5],
        '29.5': designTokens.spacing[29.5],
        '30.5': designTokens.spacing[30.5],
        '31.5': designTokens.spacing[31.5],
        '32.5': designTokens.spacing[32.5],
        '33.5': designTokens.spacing[33.5],
        '34.5': designTokens.spacing[34.5],
        '35.5': designTokens.spacing[35.5],
        '36.5': designTokens.spacing[36.5],
        '37.5': designTokens.spacing[37.5],
        '38.5': designTokens.spacing[38.5],
        '39.5': designTokens.spacing[39.5],
        '40.5': designTokens.spacing[40.5],
        '41.5': designTokens.spacing[41.5],
        '42.5': designTokens.spacing[42.5],
        '43.5': designTokens.spacing[43.5],
        '44.5': designTokens.spacing[44.5],
        '45.5': designTokens.spacing[45.5],
        '46.5': designTokens.spacing[46.5],
        '47.5': designTokens.spacing[47.5],
        '48.5': designTokens.spacing[48.5],
        '49.5': designTokens.spacing[49.5],
        '50.5': designTokens.spacing[50.5],
        '51.5': designTokens.spacing[51.5],
        '52.5': designTokens.spacing[52.5],
        '53.5': designTokens.spacing[53.5],
        '54.5': designTokens.spacing[54.5],
        '55.5': designTokens.spacing[55.5],
        '56.5': designTokens.spacing[56.5],
        '57.5': designTokens.spacing[57.5],
        '58.5': designTokens.spacing[58.5],
        '59.5': designTokens.spacing[59.5],
        '60.5': designTokens.spacing[60.5],
        '61.5': designTokens.spacing[61.5],
        '62.5': designTokens.spacing[62.5],
        '63.5': designTokens.spacing[63.5],
        '64.5': designTokens.spacing[64.5],
        '65.5': designTokens.spacing[65.5],
        '66.5': designTokens.spacing[66.5],
        '67.5': designTokens.spacing[67.5],
        '68.5': designTokens.spacing[68.5],
        '69.5': designTokens.spacing[69.5],
        '70.5': designTokens.spacing[70.5],
        '71.5': designTokens.spacing[71.5],
        '72.5': designTokens.spacing[72.5],
        '73.5': designTokens.spacing[73.5],
        '74.5': designTokens.spacing[74.5],
        '75.5': designTokens.spacing[75.5],
        '76.5': designTokens.spacing[76.5],
        '77.5': designTokens.spacing[77.5],
        '78.5': designTokens.spacing[78.5],
        '79.5': designTokens.spacing[79.5],
        '80.5': designTokens.spacing[80.5],
        '81.5': designTokens.spacing[81.5],
        '82.5': designTokens.spacing[82.5],
        '83.5': designTokens.spacing[83.5],
        '84.5': designTokens.spacing[84.5],
        '85.5': designTokens.spacing[85.5],
        '86.5': designTokens.spacing[86.5],
        '87.5': designTokens.spacing[87.5],
        '88.5': designTokens.spacing[88.5],
        '89.5': designTokens.spacing[89.5],
        '90.5': designTokens.spacing[90.5],
        '91.5': designTokens.spacing[91.5],
        '92.5': designTokens.spacing[92.5],
        '93.5': designTokens.spacing[93.5],
        '94.5': designTokens.spacing[94.5],
        '95.5': designTokens.spacing[95.5],
        '96.5': designTokens.spacing[96.5],
        '97.5': designTokens.spacing[97.5],
        '98.5': designTokens.spacing[98.5],
        '99.5': designTokens.spacing[99.5.5],
        '100.5': designTokens.spacing[100.5],
      },
      
      // Border radius
      borderRadius: {
        none: designTokens.borderRadius.none,
        sm: designTokens.borderRadius.sm,
        DEFAULT: designTokens.borderRadius.DEFAULT,
        md: designTokens.borderRadius.lg,
        lg: designTokens.borderRadius.xl,
        xl: designTokens.borderRadius['2xl'],
        '3xl': designTokens.borderRadius['3xl'],
        full: designTokens.borderRadius.full,
      },
      
      // Shadows
      boxShadow: {
        sm: designTokens.shadows.sm,
        DEFAULT: designTokens.shadows.DEFAULT,
        md: designTokens.shadows.md,
        lg: designTokens.shadows.lg,
        xl: designTokens.shadows.xl,
        '2xl': designTokens.shadows['2xl'],
        inner: designTokens.shadows.inner,
        
        // Colored shadows
        'primary': designTokens.shadows.primary,
        'success': designTokens.shadows.success,
        'warning': designTokens.shadows.warning,
        'error': designTokens.shadows.error,
      },
      
      // Z-index
      zIndex: {
        hide: designTokens.zIndex.hide,
        auto: designTokens.zIndex.auto,
        base: designTokens.zIndex.base,
        docked: designTokens.zIndex.docked,
        dropdown: designTokens.zIndex.dropdown,
        sticky: designTokens.zIndex.sticky,
        banner: designTokens.zIndex.banner,
        overlay: designTokens.zIndex.overlay,
        modal: designTokens.zIndex.modal,
        popover: designTokens.zIndex.popover,
        'skip-link': designTokens.zIndex.skipLink,
        toast: designTokens.zIndex.toast,
        tooltip: designTokens.zIndex.tooltip,
      },
      
      // Animation duration
      transitionDuration: {
        '75': designTokens.animation.duration[75],
        '100': designTokens.animation.duration[100],
        '150': designTokens.animation.duration[150],
        '200': designTokens.animation.duration[200],
        '300': designTokens.animation.duration[300],
        '500': designTokens.animation.duration[500],
        '700': designTokens.animation.duration[700],
        '1000': designTokens.animation.duration[1000],
      },
      
      // Animation timing
      transitionTimingFunction: {
        'linear': designTokens.animation.ease.linear,
        'in': designTokens.animation.ease.in,
        'out': designTokens.animation.ease.out,
        'in-out': designTokens.animation.ease['in-out'],
      },
      
      // Breakpoints
      screens: {
        'sm': designTokens.breakpoints.sm,
        'md': designTokens.breakpoints.md,
        'lg': designTokens.breakpoints.lg,
        'xl': designTokens.breakpoints.xl,
        '2xl': designTokens.breakpoints['2xl'],
      },
      
      // Component-specific
      button: {
        height: {
          sm: designTokens.components.button.height.sm,
          md: designTokens.components.button.height.md,
          lg: designTokens.components.button.height.lg,
          xl: designTokens.components.button.height.xl,
        },
        padding: {
          sm: designTokens.components.button.padding.sm,
          md: designTokens.components.button.padding.md,
          lg: designTokens.components.button.padding.lg,
          xl: designTokens.components.button.padding.xl,
        },
        fontSize: {
          sm: designTokens.components.button.fontSize.sm,
          md: designTokens.components.button.fontSize.md,
          lg: designTokens.components.button.fontSize.lg,
          xl: designTokens.components.button.fontSize.xl,
        },
        borderRadius: {
          sm: designTokens.components.button.borderRadius.sm,
          md: designTokens.components.button.borderRadius.md,
          lg: designTokens.components.button.borderRadius.lg,
          xl: designTokens.components.button.borderRadius.xl,
        },
      },
      
      input: {
        height: {
          sm: designTokens.components.input.height.sm,
          md: designTokens.components.input.height.md,
          lg: designTokens.components.input.height.lg,
        },
        padding: {
          sm: designTokens.components.input.padding.sm,
          md: designTokens.components.input.padding.md,
          lg: designTokens.components.input.padding.lg,
        },
        fontSize: {
          sm: designTokens.components.input.fontSize.sm,
          md: designTokens.components.input.fontSize.md,
          lg: designTokens.components.input.fontSize.lg,
        },
        borderRadius: {
          sm: designTokens.components.input.borderRadius.sm,
          md: designTokens.components.input.borderRadius.md,
          lg: designTokens.components.input.borderRadius.lg,
        },
      },
      
      card: {
        padding: {
          sm: designTokens.components.card.padding.sm,
          md: designTokens.components.card.padding.md,
          lg: designTokens.components.card.padding.lg,
        },
        borderRadius: {
          sm: designTokens.components.card.borderRadius.sm,
          md: designTokens.components.card.borderRadius.md,
          lg: designTokens.components.card.borderRadius.lg,
        },
        shadow: {
          sm: designTokens.components.card.shadow.sm,
          md: designTokens.components.card.shadow.md,
          lg: designTokens.components.card.shadow.lg,
          xl: designTokens.components.card.shadow.xl,
        },
      },
      
      container: {
        maxWidth: {
          sm: designTokens.components.container.maxWidth.sm,
          md: designTokens.components.container.maxWidth.md,
          lg: designTokens.components.container.maxWidth.lg,
          xl: designTokens.components.container.maxWidth.xl,
          '2xl': designTokens.components.container.maxWidth['2xl'],
        },
        padding: {
          sm: designTokens.components.container.padding.sm,
          md: designTokens.components.container.padding.md,
          lg: designTokens.components.container.padding.lg,
          xl: designTokens.components.container.padding.xl,
        },
      },
      
      navigation: {
        height: {
          sm: designTokens.components.navigation.height.sm,
          md: designTokens.components.navigation.height.md,
          lg: designTokens.components.navigation.height.lg,
        },
        padding: {
          sm: designTokens.components.navigation.padding.sm,
          md: designTokens.components.navigation.padding.md,
          lg: designTokens.components.navigation.padding.lg,
        },
      },
    },
  },
} as const;

// Export types
export type TailwindPreset = typeof tailwindPreset;

// Default export
export default tailwindPreset;
