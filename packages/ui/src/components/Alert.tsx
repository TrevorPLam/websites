// File: packages/ui/src/components/Alert.tsx  [TRACE:FILE=packages.ui.components.Alert]
// Purpose: Alert message component with variants and icons.
//          Provides accessible alert messages with visual variants.
//
// Relationship: Depends on @repo/utils (cn), lucide-react.
// System role: Feedback primitive (Layer L2 @repo/ui).
// Assumptions: Used for alert messages, not modals or dialogs.
//
// Exports / Entry: Alert, AlertTitle, AlertDescription, AlertProps
// Used by: Forms, notifications, status messages
//
// Invariants:
// - Proper ARIA role="alert" for important messages
// - Variant-based styling
//
// Status: @public
// Features:
// - [FEAT:UI] Multiple variants (default, destructive, success, warning)
// - [FEAT:ACCESSIBILITY] Proper ARIA attributes

import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cva } from '@repo/infra/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: AlertVariant;
}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const alertVariants = cva({
  base: 'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  variants: {
    variant: {
      default: 'bg-background text-foreground border-border',
      destructive:
        'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      success:
        'border-green-500/50 text-green-600 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
      warning:
        'border-yellow-500/50 text-yellow-600 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
    },
  },
  defaultVariants: { variant: 'default' },
});

const iconMap: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle2,
  warning: AlertCircle,
};

// ─── Components ──────────────────────────────────────────────────────────────

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const Icon = iconMap[variant];
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant, className }))} {...props}>
        <Icon className="h-4 w-4" />
        {props.children}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
);
AlertDescription.displayName = 'AlertDescription';
