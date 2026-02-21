// File: packages/ui/src/components/Stepper.tsx  [TRACE:FILE=packages.ui.components.Stepper]
// Purpose: Multi-step progress indicator with navigation.
//          Provides visual step indicator for multi-step processes.
//
// Relationship: Depends on @repo/utils (cn), lucide-react.
// System role: Navigation primitive (Layer L2 @repo/ui).
// Assumptions: Used for multi-step forms and processes.
//
// Exports / Entry: Stepper component and sub-components, StepperProps
// Used by: Multi-step forms, wizards, onboarding flows
//
// Invariants:
// - Visual indicator only (no custom step validation)
// - Keyboard accessible navigation
//
// Status: @public
// Features:
// - [FEAT:UI] Step navigation
// - [FEAT:UI] Variant styles
// - [FEAT:ACCESSIBILITY] Keyboard navigation

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of steps */
  steps: StepperStep[];
  /** Current active step (0-indexed) */
  currentStep: number;
  /** Callback when step is clicked */
  onStepClick?: (stepIndex: number) => void;
  /** Variant style */
  variant?: 'default' | 'vertical';
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, currentStep, onStepClick, _variant = 'default', ...props }, ref) => {
    const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'current';
      return 'upcoming';
    };

    if (_variant === 'vertical') {
      return (
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = onStepClick && status !== 'upcoming';

            return (
              <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(index)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      status === 'completed' && 'border-primary bg-primary text-primary-foreground',
                      status === 'current' && 'border-primary bg-background text-primary',
                      status === 'upcoming' && 'border-muted bg-background text-muted-foreground',
                      isClickable && 'cursor-pointer hover:border-primary/80',
                      !isClickable && 'cursor-default'
                    )}
                    disabled={!isClickable}
                    aria-current={status === 'current' ? 'step' : undefined}
                  >
                    {status === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-10 left-5 h-full w-0.5',
                        status === 'completed' ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col pt-1">
                  <div
                    className={cn(
                      'text-sm font-medium',
                      status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="mt-1 text-sm text-muted-foreground">{step.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-center justify-between', className)} {...props}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = onStepClick && status !== 'upcoming';

          return (
            <React.Fragment key={index}>
              <div className="flex flex-1 flex-col items-center">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(index)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    status === 'completed' && 'border-primary bg-primary text-primary-foreground',
                    status === 'current' && 'border-primary bg-background text-primary',
                    status === 'upcoming' && 'border-muted bg-background text-muted-foreground',
                    isClickable && 'cursor-pointer hover:border-primary/80',
                    !isClickable && 'cursor-default'
                  )}
                  disabled={!isClickable}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {status === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      'text-sm font-medium',
                      status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="mt-1 text-xs text-muted-foreground">{step.description}</div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 flex-1',
                    status === 'completed' ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);
Stepper.displayName = 'Stepper';
