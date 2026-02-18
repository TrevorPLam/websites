/**
 * @file packages/ui/src/components/Select.tsx
 * [TRACE:FILE=packages.ui.components.Select]
 *
 * Purpose: Native select wrapper with optional label, options array, error state, and
 *          placeholder. Used in forms (contact, booking) for dropdowns.
 *
 * Relationship: Used by @repo/features (ContactForm, BookingForm). Depends on @repo/utils (cn).
 * System role: Form primitive; aria-invalid and aria-describedby for error message.
 * Assumptions: options are { value, label }; placeholder renders as disabled empty option.
 */

import * as React from 'react';
import { cn } from '@repo/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text displayed above the select */
  label?: string;
  /** Options to render */
  options?: SelectOption[];
  /** Error message from validation */
  error?: string;
  /** Placeholder text for the default empty option */
  placeholder?: string;
}

/**
 * Renders a labeled select with optional placeholder and error message. Id derived from
 * label if not provided, for accessibility.
 *
 * @param props - SelectProps (label, options, error, placeholder, id, and native select props)
 * @returns Forwarded ref to the native select element
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options = [], error, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground transition-colors',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-destructive' : 'border-input',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
