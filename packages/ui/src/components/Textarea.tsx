/**
 * @file packages/ui/src/components/Textarea.tsx
 * [TRACE:FILE=packages.ui.components.Textarea]
 *
 * Purpose: Multiline text input with optional label and validation feedback (error/success).
 *          Mirrors Input behavior for consistency in forms.
 *
 * Relationship: Used by @repo/features contact/booking forms. Depends on @repo/utils (cn).
 * System role: Form primitive; aria-invalid and aria-describedby for error.
 * Assumptions: Same id/label/error pattern as Input; isValid shows primary border.
 */

import * as React from 'react';
import { cn } from '@repo/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Error message from validation */
  error?: string;
  /** Whether validation passed (shows success styling) */
  isValid?: boolean;
}

/**
 * Renders a labeled textarea with error/success styling. Min height 80px; id from label if omitted.
 *
 * @param props - TextareaProps (label, error, isValid, id, and native textarea props)
 * @returns Forwarded ref to the native textarea element
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, isValid, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground transition-colors',
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
