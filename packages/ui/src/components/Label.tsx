// File: packages/ui/src/components/Label.tsx  [TRACE:FILE=packages.ui.components.Label]
// Purpose: Accessible form label component with required indicator and error state support.
//          Provides proper label association with form controls following WCAG 2.2 AA standards.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Compose with form controls (Input, Checkbox, Radio, etc.) for accessible labelling.
//
// Exports / Entry: Label, LabelProps
// Used by: Forms, input components, validation displays
//
// Invariants:
// - Must maintain proper htmlFor association with form controls
// - Required indicator must be visually distinct
// - Error state must be accessible to screen readers
//
// Status: @public
// Features:
// - [FEAT:UI] Required indicator support
// - [FEAT:UI] Error variant for validation states
// - [FEAT:ACCESSIBILITY] Proper label association and ARIA attributes

import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /** Whether the associated field is required */
  required?: boolean;
  /** Whether the label is in an error state */
  error?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Label]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, error, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      error && 'text-destructive',
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-0.5 text-destructive">*</span>}
  </LabelPrimitive.Root>
));
Label.displayName = 'Label';
