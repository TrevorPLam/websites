/**
 * @file packages/ui/src/components/Textarea.tsx
 * [TRACE:FILE=packages.ui.components.Textarea]
 *
 * Purpose: Multiline text input with optional label and validation feedback (error/success).
 *          Mirrors Input behavior for consistency in forms. Uses CVA for validation state.
 *
 * Relationship: Used by @repo/features contact/booking forms. Depends on
 *               @repo/infrastructure/variants (cva), @repo/utils (cn).
 * System role: Form primitive; aria-invalid and aria-describedby for error.
 * Assumptions: Same id/label/error pattern as Input; isValid shows primary border.
 *              Public API unchanged: error/isValid booleans derived into CVA validationState.
 *
 * Exports / Entry: Textarea, TextareaProps
 * Features:
 * - [FEAT:VALIDATION] Visual feedback for validation states (CVA)
 * - [FEAT:VARIANTS] CVA for type-safe validation state resolution
 */

import * as React from 'react';
import { cva } from '@repo/infrastructure/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Internal validation state derived from error/isValid booleans. */
type TextareaValidationState = 'default' | 'error' | 'success';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Error message from validation */
  error?: string;
  /** Whether validation passed (shows success styling) */
  isValid?: boolean;
}

// ─── CVA Variant Definitions ─────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.Textarea.textareaVariants]
// Resolves border and focus-ring color by validation state (mirrors inputVariants in Input.tsx).
const textareaVariants = cva({
  base: [
    'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2',
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
 * Renders a labeled textarea with error/success styling. Min height 80px; id from label if omitted.
 *
 * @param props - TextareaProps (label, error, isValid, id, and native textarea props)
 * @returns Forwarded ref to the native textarea element
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, isValid, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Derive single CVA-compatible state from two booleans (error wins over isValid)
    const validationState: TextareaValidationState = error
      ? 'error'
      : isValid
        ? 'success'
        : 'default';

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
          className={cn(textareaVariants({ validationState }), className)}
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
