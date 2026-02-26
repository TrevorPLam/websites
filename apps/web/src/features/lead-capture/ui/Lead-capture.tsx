/**
 * @file apps/web/src/features/lead-capture/ui/Lead-capture.tsx
 * @summary Lead capture widget with React Hook Form and Server Actions integration.
 * @description Production-ready lead capture modal form with optimistic UI, validation, and 2026 performance standards.
 * @security GDPR/CCPA compliant with consent tracking and data minimization
 * @performance Optimized for INP <200ms with optimistic UI updates
 * @compliance WCAG 2.2 AA, Core Web Vitals, multi-tenant security
 * @requirements TASK-007, lead-capture-widget, server-actions, progressive-ux
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition, useOptimistic } from 'react';
import { ModalDialog, ModalActions } from '@/widgets/modal-dialog/ui/Modal-dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@repo/ui/forms';
import { Input } from '@repo/ui';
import { Button } from '@repo/ui';
import { createLeadAction } from '../api/lead-capture-server-actions';
import { cn } from '@repo/utils';

// Lead capture form schema with comprehensive validation
const leadCaptureSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters'),

  // Optional fields
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  company: z.string().max(100, 'Company must be less than 100 characters').optional(),
  message: z.string().max(2000, 'Message must be less than 2000 characters').optional(),

  // GDPR/CCPA consent
  consent: z
    .object({
      marketing: z.boolean().default(false),
      processing: z.boolean().default(true),
    })
    .refine((consent) => consent.processing === true, {
      message: 'You must consent to data processing to continue',
    }),
});

// Type inference from schema
type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;

// Lead capture widget props
export interface LeadCaptureWidgetProps {
  /** Whether the widget is open */
  open?: boolean;
  /** Callback when widget open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Modal title override */
  title?: string;
  /** Modal description override */
  description?: string;
  /** Tenant ID for multi-tenant isolation */
  tenantId: string;
  /** Landing page URL for UTM tracking */
  landingPage?: string;
  /** Referrer URL for tracking */
  referrer?: string;
  /** Custom submit button text */
  submitText?: string;
  /** Custom success message */
  successMessage?: string;
  /** Show/hide optional fields */
  showOptionalFields?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Lead capture widget with comprehensive features:
 * - React Hook Form with Zod validation
 * - Server Actions integration with optimistic UI
 * - GDPR/CCPA compliance with consent tracking
 * - Multi-tenant security isolation
 * - Core Web Vitals optimization (INP <200ms)
 * - WCAG 2.2 AA accessibility compliance
 * - Progressive enhancement and graceful degradation
 * - Real-time validation and error handling
 */
export const LeadCaptureWidget = React.memo<LeadCaptureWidgetProps>(
  ({
    open,
    onOpenChange,
    title = 'Get Started',
    description = "Fill out the form below and we'll get back to you as soon as possible.",
    tenantId,
    landingPage,
    referrer,
    submitText = 'Submit',
    successMessage = "Thank you! We'll be in touch soon.",
    showOptionalFields = true,
    className,
  }) => {
    const [isPending, startTransition] = useTransition();
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // React Hook Form setup with Zod validation
    const form = useForm<LeadCaptureFormData>({
      resolver: zodResolver(leadCaptureSchema),
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        consent: {
          marketing: false,
          processing: true,
        },
      },
      mode: 'onBlur',
    });

    // Optimistic UI for form submission
    const [optimisticSubmitted, addOptimisticSubmitted] = useOptimistic(false);

    // Form submission handler with Server Actions
    const onSubmit = React.useCallback(
      (data: LeadCaptureFormData) => {
        setError(null);

        startTransition(async () => {
          try {
            addOptimisticSubmitted(true);

            // Prepare lead data with tenant context
            const leadData = {
              ...data,
              tenantId,
              landingPage:
                landingPage || (typeof window !== 'undefined' ? window.location.href : ''),
              referrer: referrer || (typeof window !== 'undefined' ? document.referrer : ''),
              source: 'website' as const,
              sessionId: crypto.randomUUID(),
            };

            // Call Server Action
            const result = await createLeadAction(leadData);

            if (result.success) {
              setIsSubmitted(true);
              form.reset();
            } else {
              setError(
                typeof result.error === 'string'
                  ? result.error
                  : 'An error occurred. Please try again.'
              );
              addOptimisticSubmitted(false);
            }
          } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            addOptimisticSubmitted(false);
          }
        });
      },
      [form, tenantId, landingPage, referrer, addOptimisticSubmitted]
    );

    // Reset form when modal opens
    React.useEffect(() => {
      if (open) {
        setIsSubmitted(false);
        setError(null);
        form.reset();
      }
    }, [open, form]);

    // Close modal after successful submission
    const handleClose = React.useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    // Loading state
    const isLoading = isPending || optimisticSubmitted;

    return (
      <ModalDialog
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        size="medium"
        preventCloseOnOutsideClick={isLoading}
        preventCloseOnEscape={isLoading}
        className={className}
      >
        {isSubmitted ? (
          // Success state
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
            <p className="text-sm text-gray-600 mb-6">{successMessage}</p>
            <Button onClick={handleClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        ) : (
          // Form state
          <Form<LeadCaptureFormData> {...form} onSubmit={onSubmit} className="space-y-6">
            {/* Required fields */}
            <FormField
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value as string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="John Doe"
                      disabled={isLoading}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value as string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      type="email"
                      placeholder="john@example.com"
                      disabled={isLoading}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional fields */}
            {showOptionalFields && (
              <>
                <FormField
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value as string}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="company"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value as string}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Acme Corporation"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="message"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <textarea
                          value={field.value as string}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className={cn(
                            'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2',
                            'text-sm text-foreground placeholder:text-muted-foreground',
                            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                            'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                            'resize-none'
                          )}
                          placeholder="Tell us about your project..."
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* GDPR/CCPA consent */}
            <div className="space-y-4 border-t pt-4">
              <FormField
                name="consent.processing"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value as boolean}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isLoading}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        aria-required="true"
                        id="consent-processing"
                        aria-describedby="consent-processing-desc"
                        title="I consent to the processing of my personal data"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        className="text-sm font-medium cursor-pointer"
                        htmlFor="consent-processing"
                      >
                        I consent to the processing of my personal data *
                      </FormLabel>
                      <p id="consent-processing-desc" className="text-xs text-muted-foreground">
                        Required for us to process your inquiry and respond to you.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="consent.marketing"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value as boolean}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isLoading}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        id="consent-marketing"
                        aria-describedby="consent-marketing-desc"
                        title="I consent to receive marketing communications"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        className="text-sm font-medium cursor-pointer"
                        htmlFor="consent-marketing"
                      >
                        I consent to receive marketing communications
                      </FormLabel>
                      <p id="consent-marketing-desc" className="text-xs text-muted-foreground">
                        Optional. You can unsubscribe at any time.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Error display */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <ModalActions
              primaryAction={{
                label: submitText,
                onClick: form.handleSubmit(onSubmit),
                loading: isLoading,
                disabled: !form.formState.isValid,
              }}
              cancelAction={{
                label: 'Cancel',
                onClick: handleClose,
                disabled: isLoading,
              }}
            />
          </Form>
        )}
      </ModalDialog>
    );
  }
);

LeadCaptureWidget.displayName = 'LeadCaptureWidget';
