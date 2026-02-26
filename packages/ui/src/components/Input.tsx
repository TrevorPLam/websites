// File: packages/ui/src/components/Input.tsx  [TRACE:FILE=packages.ui.components.Input]
// Purpose: Reusable input component providing consistent styling, validation feedback,
//          and accessibility features across the application. Supports labels, error states,
//          and success validation with proper ARIA attributes. Uses CVA for variant styling.
//
// Exports / Entry: Input component, InputProps interface
// Used by: All forms requiring text input (ContactForm, BookingForm, etc.)
//
// Invariants:
// - Must maintain consistent visual hierarchy and spacing
// - Must be fully accessible with proper ARIA attributes
// - Must support keyboard navigation and focus management
// - Must handle validation states (error, success, default) gracefully via CVA
// - Must forward refs properly for DOM manipulation
// - Public API unchanged: error/isValid booleans derived into CVA validationState internally
//
// Status: @public
// Features:
// - [FEAT:UI] Consistent input styling and behavior
// - [FEAT:ACCESSIBILITY] Full keyboard and screen reader support
// - [FEAT:VALIDATION] Visual feedback for validation states (CVA compoundVariants)
// - [FEAT:RESPONSIVE] Mobile-first responsive design
// - [FEAT:DESIGN] Integration with design system tokens
// - [FEAT:VARIANTS] CVA for type-safe validation state resolution

import * as React from 'react';
import { cva } from '@repo/infrastructure/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Internal validation state derived from error/isValid booleans. */
type InputValidationState = 'default' | 'error' | 'success';

/**
 * Input props: label, error, isValid plus standard input attributes. Used for form fields
 * with optional label and validation feedback (error message or success border).
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above input */
  label?: string;
  /** Error message from validation */
  error?: string;
  /** Whether validation passed (shows success styling) */
  isValid?: boolean;
}

// ─── CVA Variant Definitions ─────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.Input.inputVariants]
// Resolves border and focus-ring color by validation state.
const inputVariants = cva({
  base: [
    'flex h-10 w-full rounded-md border bg-background px-3 py-2',
    'text-sm text-foreground transition-colors',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  variants: {
    validationState: {
      default: 'border-input',
      error: 'border-destructive focus-visible:ring-destructive',
      success: 'border-primary focus-visible:ring-primary',
    },
  },
  defaultVariants: { validationState: 'default' },
});

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Renders a labeled input with optional error/success state. Sets aria-invalid and
 * aria-describedby for the error message; error paragraph has role="alert".
 *
 * @param props - InputProps (label, error, isValid, id, and HTML input attributes)
 * @returns Forwarded ref to the native input element
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, isValid, id, ...props }, ref) => {
    // Stable id for label association and aria-describedby; fallback from label if id not provided
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Derive single CVA-compatible state from two booleans (error wins over isValid)
    const validationState: InputValidationState = error ? 'error' : isValid ? 'success' : 'default';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(inputVariants({ validationState }), className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
