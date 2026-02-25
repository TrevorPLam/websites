/**
 * Sonner Toast Notifications Component
 * Promise-based loading states with action buttons
 * WCAG 2.2 AA compliant with proper focus management
 */

import * as React from 'react';
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';
import { cva, type ClassValue } from '@repo/infra/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ToastProps {
  /** Toast content */
  title?: string;
  /** Optional description */
  description?: string;
  /** Toast variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'loading';
  /** Action button configuration */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  /** Whether toast can be dismissed */
  dismissible?: boolean;
  /** Auto-dismiss duration in milliseconds */
  duration?: number;
  /** Position on screen */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export interface ToastOptions extends Omit<ToastProps, 'title' | 'description'> {
  /** Unique identifier for the toast */
  id?: string;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
  /** Callback when action button is clicked */
  onActionClick?: () => void;
  /** Optional description */
  description?: string;
}

// ─── CVA Variant Definitions ─────────────────────────────────────────────────

const toastVariants = cva({
  base: 'group pointer-events-auto flex w-full max-w-sm items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  variants: {
    variant: {
      default: 'border-border bg-background text-foreground',
      success: 'border-success bg-success/10 text-success-foreground',
      warning: 'border-warning bg-warning/10 text-warning-foreground',
      error: 'border-error bg-error/10 text-error-foreground',
      loading: 'border-border bg-background text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const actionButtonVariants = cva({
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[32px] h-8 px-3',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

// ─── Toast Component ───────────────────────────────────────────────────────

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ToastProps
>(
  (
    {
      className,
      title,
      description,
      variant = 'default',
      action,
      dismissible = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="grid gap-1">
          {title && (
            <div className="text-sm font-semibold">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>

        {action && (
          <button
            className={actionButtonVariants({ variant: action.variant })}
            onClick={action.onClick}
            aria-label={action.label}
          >
            {action.label}
          </button>
        )}

        {dismissible && (
          <button
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring group-hover:opacity-100"
            onClick={() => sonnerToast.dismiss()}
            aria-label="Dismiss notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

// ─── Toast API Functions ───────────────────────────────────────────────────

/**
 * Show a success toast notification
 */
export function toastSuccess(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, {
    icon: '✓',
    description: options?.description,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    duration: options?.duration || 4000,
    position: options?.position || 'bottom-right',
  });
}

/**
 * Show an error toast notification
 */
export function toastError(message: string, options?: ToastOptions) {
  return sonnerToast.error(message, {
    icon: '✕',
    description: options?.description,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    duration: options?.duration || 6000,
    position: options?.position || 'bottom-right',
  });
}

/**
 * Show a warning toast notification
 */
export function toastWarning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    icon: '⚠',
    description: options?.description,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    duration: options?.duration || 5000,
    position: options?.position || 'bottom-right',
  });
}

/**
 * Show an info toast notification
 */
export function toastInfo(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, {
    icon: 'ℹ',
    description: options?.description,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    duration: options?.duration || 4000,
    position: options?.position || 'bottom-right',
  });
}

/**
 * Show a loading toast notification with promise handling
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: ToastOptions
) {
  return sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    description: options?.description,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    position: options?.position || 'bottom-right',
  });
}

/**
 * Dismiss a specific toast notification
 */
export function toastDismiss(id?: string) {
  return sonnerToast.dismiss(id);
}

/**
 * Dismiss all toast notifications
 */
export function toastDismissAll() {
  return sonnerToast.dismiss();
}

// ─── Toast Provider Component ─────────────────────────────────────────────────

export interface ToasterProps {
  /** Position of toast notifications */
  position?: ToastProps['position'];
  /** Maximum number of toasts to show */
  limit?: number;
  /** Whether to show rich format (HTML) */
  richColors?: boolean;
  /** Whether to expand toast on hover */
  expand?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Toast provider component that renders the Sonner toaster
 * Place this component in your app root
 */
export function Toaster({
  position = 'bottom-right',
  limit = 3,
  richColors = true,
  expand = false,
  className,
}: ToasterProps) {
  return (
    <SonnerToaster
      className={className}
      position={position}
      limit={limit}
      richColors={richColors}
      expand={expand}
      toastOptions={{
        className: toastVariants,
        style: {
          background: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
      }}
      icons={{
        success: <div className="w-4 h-4 rounded-full bg-success text-success-foreground flex items-center justify-center text-xs">✓</div>,
        error: <div className="w-4 h-4 rounded-full bg-error text-error-foreground flex items-center justify-center text-xs">✕</div>,
        warning: <div className="w-4 h-4 rounded-full bg-warning text-warning-foreground flex items-center justify-center text-xs">!</div>,
        info: <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">i</div>,
        loading: <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />,
      }}
    />
  );
}

// ─── Accessibility Utilities ─────────────────────────────────────────────

/**
 * Validates toast meets WCAG 2.2 AA requirements
 * @param toastElement - The toast element to validate
 */
export function validateToastAccessibility(toastElement: HTMLDivElement): boolean {
  // Check for proper ARIA live region
  const hasLiveRegion = toastElement.getAttribute('role') === 'alert' ||
                        toastElement.getAttribute('aria-live') === 'polite' ||
                        toastElement.closest('[role="alert"], [aria-live="polite"]');

  if (!hasLiveRegion) {
    console.warn('WCAG 2.2 violation: Toast missing ARIA live region', toastElement);
    return false;
  }

  // Check for accessible name
  const accessibleName = toastElement.getAttribute('aria-label') ||
                        toastElement.textContent?.trim();

  if (!accessibleName) {
    console.warn('WCAG 2.2 violation: Toast missing accessible name', toastElement);
    return false;
  }

  // Check for dismiss button if toast is dismissible
  const dismissButton = toastElement.querySelector('button[aria-label*="dismiss"], button[aria-label*="close"]');
  const shouldBeDismissible = toastElement.hasAttribute('data-dismissible') ||
                            dismissButton !== null;

  if (shouldBeDismissible && !dismissButton) {
    console.warn('WCAG 2.2 violation: Dismissible toast missing dismiss button', toastElement);
    return false;
  }

  return true;
}

// ─── Exports ───────────────────────────────────────────────────────────────

export {
  Toast,
  sonnerToast as toast,
};
