/**
 * Puck Editor Theme Configuration
 * 
 * Maps design tokens to Puck editor theme for visual editing
 * Provides consistent theming between design system and Puck editor
 */

import { designTokens, semanticColors } from './tokens';

// Puck theme configuration
export const puckTheme = {
  // Editor colors
  colors: {
    // Background colors
    background: semanticColors.background,
    foreground: semanticColors.foreground,
    
    // Surface colors
    surface: semanticColors.surface,
    surfaceVariant: semanticColors.surfaceVariant,
    
    // Primary colors
    primary: semanticColors.primary,
    primaryHover: semanticColors.primaryHover,
    primaryActive: semanticColors.primaryActive,
    
    // Secondary colors
    secondary: semanticColors.secondary,
    secondaryHover: semanticColors.secondaryHover,
    secondaryActive: semanticColors.secondaryActive,
    
    // Accent colors
    accent: semanticColors.accent,
    accentHover: semanticColors.accentHover,
    
    // Border colors
    border: semanticColors.border,
    borderHover: semanticColors.borderHover,
    borderFocus: semanticColors.borderFocus,
    
    // Status colors
    success: semanticColors.success,
    warning: semanticColors.warning,
    error: semanticColors.error,
    info: semanticColors.info,
    
    // Text colors
    text: semanticColors.textPrimary,
    textSecondary: semanticColors.textSecondary,
    textMuted: semanticColors.textMuted,
    textDisabled: semanticColors.textDisabled,
    
    // Link colors
    link: semanticColors.link,
    linkHover: semanticColors.linkHover,
    linkActive: semanticColors.linkActive,
  },
  
  // Typography
  typography: {
    fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    fontSize: {
      xs: designTokens.typography.fontSize.xs[0],
      sm: designTokens.typography.fontSize.sm[0],
      base: designTokens.typography.fontSize.base[0],
      lg: designTokens.typography.fontSize.lg[0],
      xl: designTokens.typography.fontSize.xl[0],
      '2xl': designTokens.typography.fontSize['2xl'][0],
      '3xl': designTokens.typography.fontSize['3xl'][0],
      '4xl': designTokens.typography.fontSize['4xl'][0],
      '5xl': designTokens.typography.fontSize['5xl'][0],
    },
    fontWeight: {
      light: designTokens.typography.fontWeight.light,
      normal: designTokens.typography.fontWeight.normal,
      medium: designTokens.typography.fontWeight.medium,
      semibold: designTokens.typography.fontWeight.semibold,
      bold: designTokens.typography.fontWeight.bold,
    },
    lineHeight: {
      tight: designTokens.typography.lineHeight.tight,
      normal: designTokens.typography.lineHeight.normal,
      relaxed: designTokens.typography.lineHeight.relaxed,
    },
  },
  
  // Spacing
  spacing: {
    xs: designTokens.spacing[0.5],
    sm: designTokens.spacing[1],
    md: designTokens.spacing[2],
    lg: designTokens.spacing[4],
    xl: designTokens.spacing[6],
    '2xl': designTokens.spacing[8],
    '3xl': designTokens.spacing[12],
    '4xl': designTokens.spacing[16],
    '5xl': designTokens.spacing[20],
  },
  
  // Border radius
  borderRadius: {
    none: designTokens.borderRadius.none,
    sm: designTokens.borderRadius.sm,
    md: designTokens.borderRadius.DEFAULT,
    lg: designTokens.borderRadius.lg,
    xl: designTokens.borderRadius.xl,
    '2xl': designTokens.borderRadius['2xl'],
    '3xl': designTokens.borderRadius['3xl'],
    full: designTokens.borderRadius.full,
  },
  
  // Shadows
  shadows: {
    sm: designTokens.shadows.sm,
    md: designTokens.shadows.DEFAULT,
    lg: designTokens.shadows.lg,
    xl: designTokens.shadows.xl,
    '2xl': designTokens.shadows['2xl'],
    inner: designTokens.shadows.inner,
    
    // Colored shadows
    primary: designTokens.shadows.primary,
    success: designTokens.shadows.success,
    warning: designTokens.shadows.warning,
    error: designTokens.shadows.error,
  },
  
  // Component-specific styling for Puck components
  components: {
    // Canvas styling
    canvas: {
      background: semanticColors.background,
      border: semanticColors.border,
      borderRadius: designTokens.borderRadius.lg,
      boxShadow: designTokens.shadows.md,
      padding: designTokens.spacing[8],
    },
    
    // Component styling
    component: {
      background: semanticColors.surface,
      border: semanticColors.border,
      borderRadius: designTokens.borderRadius.md,
      boxShadow: designTokens.shadows.sm,
      padding: designTokens.spacing[4],
      
      // Hover states
      '&:hover': {
        borderColor: semanticColors.borderHover,
        boxShadow: designTokens.shadows.md,
      },
      
      // Selected state
      '&.selected': {
        borderColor: semanticColors.borderFocus,
        boxShadow: `0 0 0 3px hsl(${semanticColors.borderFocus} / 0.3)`,
      },
      
      // Dragging state
      '&.dragging': {
        opacity: 0.8,
        borderColor: semanticColors.primary,
        boxShadow: `0 0 0 3px hsl(${semanticColors.primary} / 0.3)`,
      },
    },
    
    // Input fields
    input: {
      background: semanticColors.input,
      border: semanticColors.inputBorder,
      borderRadius: designTokens.borderRadius.md,
      color: semanticColors.inputForeground,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      fontSize: designTokens.typography.fontSize.base[0],
      
      '&:focus': {
        outline: 'none',
        borderColor: semanticColors.inputBorderFocus,
        boxShadow: `0 0 0 3px hsl(${semanticColors.inputBorderFocus} / 0.3)`,
      },
      
      '&::placeholder': {
        color: semanticColors.textMuted,
      },
    },
    
    // Buttons
    button: {
      background: semanticColors.primary,
      color: semanticColors.primaryForeground,
      border: 'none',
      borderRadius: designTokens.borderRadius.md,
      padding: designTokens.components.button.padding.md,
      fontSize: designTokens.components.button.fontSize.md,
      fontWeight: designTokens.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 150ms ease-in-out',
      
      '&:hover': {
        background: semanticColors.primaryHover,
        transform: 'translateY(-1px)',
        boxShadow: designTokens.shadows.md,
      },
      
      '&:active': {
        background: semanticColors.primaryActive,
        transform: 'translateY(0)',
      },
      
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        transform: 'none',
      },
      
      // Button variants
      '&.secondary': {
        background: semanticColors.secondary,
        color: semanticColors.secondaryForeground,
        
        '&:hover': {
          background: semanticColors.secondaryHover,
        },
        
        '&:active': {
          background: semanticColors.secondaryActive,
        },
      },
      
      '&.outline': {
        background: 'transparent',
        color: semanticColors.primary,
        border: `1px solid hsl(${semanticColors.primary})`,
        
        '&:hover': {
          background: semanticColors.primary,
          color: semanticColors.primaryForeground,
        },
      },
      
      '&.ghost': {
        background: 'transparent',
        color: semanticColors.primary,
        
        '&:hover': {
          background: semanticColors.primary,
          color: semanticColors.primaryForeground,
        },
      },
    },
    
    // Tabs
    tabs: {
      background: semanticColors.surface,
      borderBottom: `1px solid hsl(${semanticColors.border})`,
      borderRadius: designTokens.borderRadius.lg,
      
      '& .tab': {
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        color: semanticColors.textMuted,
        padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
        fontSize: designTokens.typography.fontSize.sm[0],
        fontWeight: designTokens.typography.fontWeight.medium,
        cursor: 'pointer',
        transition: 'all 150ms ease-in-out',
        
        '&:hover': {
          color: semanticColors.textPrimary,
        },
        
        '&.active': {
          color: semanticColors.primary,
          borderBottomColor: semanticColors.primary,
        },
      },
    },
    
    // Sidebar
    sidebar: {
      background: semanticColors.surface,
      borderRight: `1px solid hsl(${semanticColors.border})`,
      width: '280px',
      padding: designTokens.spacing[4],
      
      '& .section': {
        marginBottom: designTokens.spacing[6],
        
        '& .title': {
          fontSize: designTokens.typography.fontSize.sm[0],
          fontWeight: designTokens.typography.fontWeight.semibold,
          color: semanticColors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: designTokens.typography.letterSpacing.wide,
          marginBottom: designTokens.spacing[2],
        },
        
        '& .item': {
          padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
          borderRadius: designTokens.borderRadius.md,
          color: semanticColors.textSecondary,
          cursor: 'pointer',
          transition: 'all 150ms ease-in-out',
          
          '&:hover': {
            background: semanticColors.surfaceVariant,
            color: semanticColors.textPrimary,
          },
          
          '&.active': {
            background: semanticColors.primary,
            color: semanticColors.primaryForeground,
          },
        },
      },
    },
    
    // Toolbar
    toolbar: {
      background: semanticColors.surface,
      borderBottom: `1px solid hsl(${semanticColors.border})`,
      padding: designTokens.spacing[4],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      
      '& .group': {
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing[2],
        
        '& .button': {
          padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`,
          fontSize: designTokens.typography.fontSize.sm[0],
        },
      },
    },
    
    // Panel
    panel: {
      background: semanticColors.surface,
      border: `1px solid hsl(${semanticColors.border})`,
      borderRadius: designTokens.borderRadius.lg,
      padding: designTokens.spacing[4],
      
      '& .header': {
        borderBottom: `1px solid hsl(${semanticColors.border})`,
        padding: `0 0 ${designTokens.spacing[4]} 0`,
        marginBottom: designTokens.spacing[4],
        
        '& .title': {
          fontSize: designTokens.typography.fontSize.lg[0],
          fontWeight: designTokens.typography.fontWeight.semibold,
          color: semanticColors.textPrimary,
        },
      },
      
      '& .content': {
        '& p': {
          color: semanticColors.textSecondary,
          lineHeight: designTokens.typography.lineHeight.relaxed,
          marginBottom: designTokens.spacing[4],
        },
        
        '& p:last-child': {
          marginBottom: 0,
        },
      },
    },
  },
  
  // Responsive breakpoints
  breakpoints: {
    sm: designTokens.breakpoints.sm,
    md: designTokens.breakpoints.md,
    lg: designTokens.breakpoints.lg,
    xl: designTokens.breakpoints.xl,
    '2xl': designTokens.breakpoints['2xl'],
  },
  
  // Animation settings
  animation: {
    duration: {
      fast: designTokens.animation.duration[150],
      normal: designTokens.animation.duration[200],
      slow: designTokens.animation.duration[300],
    },
    easing: {
      ease: designTokens.animation.ease['in-out'],
      easeIn: designTokens.animation.ease.in,
      easeOut: designTokens.animation.ease.out,
    },
  },
} as const;

// Puck component category styling
export const puckComponentCategories = {
  // Layout components
  layout: {
    background: semanticColors.surfaceVariant,
    border: `2px dashed hsl(${semanticColors.border})`,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing[4],
    textAlign: 'center',
    color: semanticColors.textMuted,
    
    '& .icon': {
      fontSize: '2rem',
      marginBottom: designTokens.spacing[2],
      opacity: 0.5,
    },
  },
  
  // Content components
  content: {
    background: semanticColors.background,
    border: `1px solid hsl(${semanticColors.border})`,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing[4],
    
    '&.heading': {
      fontSize: designTokens.typography.fontSize['2xl'][0],
      fontWeight: designTokens.typography.fontWeight.bold,
      color: semanticColors.textPrimary,
      marginBottom: designTokens.spacing[2],
    },
    
    '&.text': {
      color: semanticColors.textSecondary,
      lineHeight: designTokens.typography.lineHeight.relaxed,
    },
    
    '&.image': {
      width: '100%',
      height: '200px',
      background: semanticColors.surface,
      borderRadius: designTokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: semanticColors.textMuted,
      
      '& .placeholder': {
        fontSize: '0.875rem',
      },
    },
  },
  
  // Form components
  form: {
    '&.input': {
      background: semanticColors.input,
      border: `1px solid hsl(${semanticColors.inputBorder})`,
      borderRadius: designTokens.borderRadius.md,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      color: semanticColors.inputForeground,
      
      '&::placeholder': {
        color: semanticColors.textMuted,
      },
    },
    
    '&.textarea': {
      background: semanticColors.input,
      border: `1px solid hsl(${semanticColors.inputBorder})`,
      borderRadius: designTokens.borderRadius.md,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      color: semanticColors.inputForeground,
      resize: 'vertical',
      minHeight: '100px',
      
      '&::placeholder': {
        color: semanticColors.textMuted,
      },
    },
    
    '&.button': {
      background: semanticColors.primary,
      color: semanticColors.primaryForeground,
      border: 'none',
      borderRadius: designTokens.borderRadius.md,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.base[0],
      fontWeight: designTokens.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 150ms ease-in-out',
      
      '&:hover': {
        background: semanticColors.primaryHover,
      },
      
      '&.secondary': {
        background: semanticColors.secondary,
        color: semanticColors.secondaryForeground,
        
        '&:hover': {
          background: semanticColors.secondaryHover,
        },
      },
    },
  },
  
  // Navigation components
  navigation: {
    '&.nav': {
      background: semanticColors.surface,
      borderBottom: `1px solid hsl(${semanticColors.border})`,
      padding: designTokens.spacing[2],
      
      '& .link': {
        color: semanticColors.textSecondary,
        textDecoration: 'none',
        padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`,
        borderRadius: designTokens.borderRadius.sm,
        transition: 'all 150ms ease-in-out',
        
        '&:hover': {
          color: semanticColors.primary,
          background: semanticColors.primary,
          color: semanticColors.primaryForeground,
        },
        
        '&.active': {
          color: semanticColors.primary,
          background: semanticColors.primary,
          color: semanticColors.primaryForeground,
        },
      },
    },
  },
  
  // Media components
  media: {
    '&.image': {
      width: '100%',
      borderRadius: designTokens.borderRadius.lg,
      overflow: 'hidden',
      
      '& img': {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
      },
    },
    
    '&.video': {
      width: '100%',
      borderRadius: designTokens.borderRadius.lg,
      overflow: 'hidden',
      
      '& video': {
        width: '100%',
        height: 'auto',
      },
    },
  },
} as const;

// Export types
export type PuckTheme = typeof puckTheme;
export type PuckComponentCategories = typeof puckComponentCategories;

// Default export
export default puckTheme;
