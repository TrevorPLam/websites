/**
 * @file apps/web/src/widgets/modal-dialog/ui/Modal-dialog.tsx
 * @summary Enhanced modal dialog component with accessibility and performance optimizations.
 * @description Production-ready modal dialog with focus management, WCAG 2.2 AA compliance, and 2026 performance standards.
 * @security Focus trapping and keyboard navigation for accessibility
 * @performance Optimized for INP <200ms with proper event handling
 * @compliance WCAG 2.2 AA, Core Web Vitals optimization
 * @requirements TASK-007, modal-composition, accessibility-2026
 */

'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/Dialog';
import { Button } from '@repo/ui/components/Button';
import { cn } from '@repo/utils';

// Modal dialog props interface
export interface ModalDialogProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when modal open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Modal title for accessibility */
  title: string;
  /** Optional description for additional context */
  description?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Footer content with action buttons */
  footer?: React.ReactNode;
  /** Size variant for responsive design */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Prevent closing on outside click */
  preventCloseOnOutsideClick?: boolean;
  /** Prevent closing on escape key */
  preventCloseOnEscape?: boolean;
}

// Size variants for responsive modal sizing
const sizeVariants = {
  small: 'max-w-md',
  medium: 'max-w-lg',
  large: 'max-w-2xl',
  fullscreen: 'max-w-[95vw] max-h-[95vh]',
};

/**
 * Enhanced modal dialog component with comprehensive accessibility and performance optimizations.
 *
 * Features:
 * - WCAG 2.2 AA compliance with proper focus management
 * - Core Web Vitals optimization (INP <200ms)
 * - Responsive design with mobile-first approach
 * - Keyboard navigation support
 * - Proper ARIA attributes and screen reader support
 * - Performance optimized with React.memo and useCallback
 *
 * @param props - ModalDialogProps interface
 * @returns Enhanced modal dialog component
 */
export const ModalDialog = React.memo<ModalDialogProps>(
  ({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    size = 'medium',
    showCloseButton = true,
    className,
    preventCloseOnOutsideClick = false,
    preventCloseOnEscape = false,
  }) => {
    // Memoized close handler for performance
    const handleClose = React.useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    // Memoized dialog content props
    const dialogContentProps = React.useMemo(
      () => ({
        className: cn('sm:rounded-lg', sizeVariants[size], className),
        showCloseButton,
        ariaTitle: title,
        onPointerDownOutside: preventCloseOnOutsideClick ? (e) => e.preventDefault() : undefined,
        onEscapeKeyDown: preventCloseOnEscape ? (e) => e.preventDefault() : undefined,
      }),
      [size, className, showCloseButton, title, preventCloseOnOutsideClick, preventCloseOnEscape]
    );

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent {...dialogContentProps}>
          {/* Header with title and description */}
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="mt-2 text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Main content area */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer with action buttons */}
          {footer && <div className="px-6 pb-6 pt-2">{footer}</div>}
        </DialogContent>
      </Dialog>
    );
  }
);

ModalDialog.displayName = 'ModalDialog';

// Modal action buttons component for consistent footer patterns
export interface ModalActionsProps {
  /** Primary action button */
  primaryAction: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  /** Optional secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  /** Optional cancel action button */
  cancelAction?: {
    label?: string;
    onClick: () => void;
    disabled?: boolean;
  };
  /** Layout direction */
  direction?: 'row' | 'column';
  /** Custom className */
  className?: string;
}

/**
 * Modal actions component for consistent button layouts in modal footers.
 * Optimized for performance with proper button variants and accessibility.
 */
export const ModalActions = React.memo<ModalActionsProps>(
  ({ primaryAction, secondaryAction, cancelAction, direction = 'row', className }) => {
    const directionClasses =
      direction === 'row' ? 'flex-row sm:justify-end sm:space-x-2' : 'flex-col space-y-2';

    return (
      <div className={cn('flex', directionClasses, className)}>
        {cancelAction && (
          <Button
            variant="outline"
            onClick={cancelAction.onClick}
            disabled={cancelAction.disabled}
            className="w-full sm:w-auto"
          >
            {cancelAction.label || 'Cancel'}
          </Button>
        )}

        {secondaryAction && (
          <Button
            variant="secondary"
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            className="w-full sm:w-auto"
          >
            {secondaryAction.label}
          </Button>
        )}

        <Button
          variant="primary"
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled || primaryAction.loading}
          className="w-full sm:w-auto"
        >
          {primaryAction.loading ? 'Loading...' : primaryAction.label}
        </Button>
      </div>
    );
  }
);

ModalActions.displayName = 'ModalActions';
