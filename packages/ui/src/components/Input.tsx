// File: packages/ui/src/components/Input.tsx  [TRACE:FILE=packages.ui.components.Input]
// Purpose: Reusable input component providing consistent styling, validation feedback,
//          and accessibility features across the application. Supports labels, error states,
//          and success validation with proper ARIA attributes.
//
// Exports / Entry: Input component, InputProps interface
// Used by: All forms requiring text input (ContactForm, BookingForm, etc.)
//
// Invariants:
// - Must maintain consistent visual hierarchy and spacing
// - Must be fully accessible with proper ARIA attributes
// - Must support keyboard navigation and focus management
// - Must handle validation states (error, success, default) gracefully
// - Must forward refs properly for DOM manipulation
//
// Status: @public
// Features:
// - [FEAT:UI] Consistent input styling and behavior
// - [FEAT:ACCESSIBILITY] Full keyboard and screen reader support
// - [FEAT:VALIDATION] Visual feedback for validation states
// - [FEAT:RESPONSIVE] Mobile-first responsive design
// - [FEAT:DESIGN] Integration with design system tokens

import * as React from 'react';
import { cn } from '@repo/utils';

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
          className={cn(
            'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground transition-colors',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : isValid
                ? 'border-primary focus-visible:ring-primary'
                : 'border-input',
            className
          )}
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
