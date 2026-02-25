/**
 * Enhanced Button Component with Loading States and Full Accessibility
 * WCAG 2.2 AA compliant with 24x24px minimum touch targets
 * Supports loading states, disabled states, and proper ARIA attributes
 */

import * as React from 'react';
import { cva, type ClassValue } from '@repo/infra/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'text';
  /** Size of the button (all meet WCAG 2.2 AA 44px minimum) */
  size?: 'small' | 'medium' | 'large';
  /** Loading state shows spinner and disables button */
  loading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
}

// ─── CVA Variant Definitions ─────────────────────────────────────────────────

const buttonVariants = cva({
  // Base styles - all meet WCAG 2.2 AA requirements
  base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xs',
      outline:
        'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
      ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs',
      text: 'bg-transparent text-primary hover:text-primary/80 underline-offset-4 hover:underline',
    },
    size: {
      // All sizes meet WCAG 2.2 AA minimum 44px height
      small: 'min-h-[44px] h-11 px-4 text-sm',
      medium: 'min-h-[44px] h-12 px-6 text-base',
      large: 'min-h-[48px] h-14 px-8 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

// ─── Loading Spinner Component ───────────────────────────────────────────────

const LoadingSpinner = ({ size = 'small' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// ─── Button Component ───────────────────────────────────────────────────────

/**
 * Enhanced accessible button with loading states and icon support.
 *
 * @example
 * <Button loading leftIcon={<PlusIcon />}>
 *   Add Item
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'medium',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {

    // Determine if button should be disabled
    const isDisabled = disabled || loading;

    // Generate appropriate ARIA attributes
    const ariaProps = React.useMemo(() => {
      const aria: Record<string, string | boolean> = {};

      if (loading) {
        aria['aria-busy'] = true;
        aria['aria-live'] = 'polite';
      }

      if (isDisabled) {
        aria['aria-disabled'] = true;
      }

      return aria;
    }, [loading, isDisabled]);

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        {...ariaProps}
        {...props}
      >
        {/* Loading spinner */}
        {loading && <LoadingSpinner size={size} />}

        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="inline-flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button text/content */}
        <span className="truncate">
          {loading ? 'Loading...' : children}
        </span>

        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="inline-flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ─── Button Variants Helper ─────────────────────────────────────────────────

/**
 * Helper function to create button variant styles programmatically
 * Useful for dynamic styling based on context
 */
export function createButtonVariant(
  baseClasses: string,
  variantClasses: Record<string, ClassValue>,
  sizeClasses: Record<string, ClassValue>
) {
  return cva({
    base: baseClasses,
    variants: {
      variant: variantClasses,
      size: sizeClasses,
    },
  });
}

// ─── Accessibility Utilities ─────────────────────────────────────────────

/**
 * Validates button meets WCAG 2.2 AA requirements
 * @param buttonElement - The button element to validate
 */
export function validateButtonAccessibility(buttonElement: HTMLButtonElement): boolean {
  // Check minimum touch target size (24x24 CSS pixels)
  const rect = buttonElement.getBoundingClientRect();
  const computedStyle = getComputedStyle(buttonElement);

  // Convert to CSS pixels (account for zoom)
  const cssWidth = rect.width / parseFloat(computedStyle.zoom || '1');
  const cssHeight = rect.height / parseFloat(computedStyle.zoom || '1');

  if (cssWidth < 24 || cssHeight < 24) {
    console.warn('WCAG 2.2 violation: Button touch target smaller than 24x24px', {
      width: cssWidth,
      height: cssHeight,
      element: buttonElement,
    });
    return false;
  }

  // Check for accessible name
  const accessibleName = buttonElement.getAttribute('aria-label') ||
                        buttonElement.getAttribute('aria-labelledby') ||
                        buttonElement.textContent?.trim();

  if (!accessibleName) {
    console.warn('WCAG 2.2 violation: Button missing accessible name', buttonElement);
    return false;
  }

  // Check for proper focus management
  if (computedStyle.outline === 'none' && computedStyle.outlineOffset === '0px') {
    const hasFocusRing = computedStyle.getPropertyValue('focus-visible') !== 'none' ||
                        buttonElement.hasAttribute('data-focus-visible');

    if (!hasFocusRing) {
      console.warn('WCAG 2.2 violation: Button lacks visible focus indicator', buttonElement);
      return false;
    }
  }

  return true;
}
