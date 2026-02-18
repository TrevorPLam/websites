// File: packages/ui/src/components/Button.tsx  [TRACE:FILE=packages.ui.components.Button]
// Purpose: Reusable button component providing consistent styling and behavior across the application.
//          Supports multiple variants, sizes, and accessibility features with proper focus management
//          and keyboard navigation support.
//
// Exports / Entry: Button component, ButtonProps interface
// Used by: All application components requiring button interactions
//
// Invariants:
// - Must maintain consistent visual hierarchy across all variants
// - Must be fully accessible with proper ARIA attributes
// - Must support keyboard navigation and focus management
// - Must handle disabled state gracefully
// - Must forward refs properly for DOM manipulation
//
// Status: @public
// Features:
// - [FEAT:UI] Consistent button styling and behavior
// - [FEAT:ACCESSIBILITY] Full keyboard and screen reader support
// - [FEAT:RESPONSIVE] Multiple size variants for different contexts
// - [FEAT:DESIGN] Multiple visual variants for different use cases

import * as React from 'react';
import { cn } from '@repo/utils';

/**
 * Button props: variant/size plus standard button attributes. Default type is 'button'.
 *
 * @param variant - Visual style; maps to theme tokens (primary, secondary, outline, etc.)
 * @param size - small | medium | large for height and padding
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'text';
  size?: 'small' | 'medium' | 'large';
}

// [TRACE:CONST=packages.ui.components.Button.variantStyles]
// [FEAT:DESIGN]
// NOTE: Visual variant definitions - maintains consistent design system across all button styles.
const variantStyles: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xs',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
  ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs',
  text: 'bg-transparent text-primary hover:text-primary/80 underline-offset-4 hover:underline',
};

// [TRACE:CONST=packages.ui.components.Button.sizeStyles]
// [FEAT:RESPONSIVE]
// NOTE: Size variant definitions - provides consistent spacing and typography for different contexts.
const sizeStyles: Record<string, string> = {
  small: 'h-8 px-3 text-sm',
  medium: 'h-10 px-5 text-base',
  large: 'h-12 px-8 text-lg',
};

/**
 * Accessible button with variant/size styling. Focus ring and disabled state handled via Tailwind.
 *
 * @param props - ButtonProps (variant, size, type, className, and HTML button attributes)
 * @returns Forwarded ref to the native button element
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'medium', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
