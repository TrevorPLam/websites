// File: packages/features/src/contact/components/ContactForm.tsx  [TRACE:FILE=packages.features.contact.components.ContactForm]
// Purpose: Contact form component providing customer inquiry submission with real-time validation,
//          error handling, and analytics tracking. Supports configurable fields, multi-step
//          variants, and pluggable submission handlers. Implements form state management,
//          submission feedback, and Sentry error monitoring for reliable communication.
//
// Exports / Entry: ContactForm component (default export), ContactFormProps interface
// Used by: Contact pages, footer contact sections, and any inquiry features
//
// Invariants:
// - Form must validate all inputs against contact schema before submission
// - Submission state must be preserved to prevent duplicate submissions
// - Error messages must be user-friendly and actionable
// - Multi-step forms must persist state across steps
// - Analytics events must be tracked for form interactions
// - Sentry context must be set for error monitoring
//
// Status: @public
// Features:
// - [FEAT:CONTACT] Customer inquiry form with validation
// - [FEAT:VALIDATION] Real-time form validation with Zod schema
// - [FEAT:ANALYTICS] Form interaction tracking
// - [FEAT:MONITORING] Sentry error tracking and context
// - [FEAT:UX] User-friendly error handling and feedback
// - [FEAT:CONFIGURATION] Configurable fields and multi-step support
// - [FEAT:ACCESSIBILITY] Full keyboard navigation and screen reader support

'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input, Select, Textarea, Button } from '@repo/ui';
import { setSentryContext, setSentryUser, withSentrySpan } from '@repo/infra/client';
import { sanitizeHtml } from '@repo/infra/security/sanitize';
import {
  createContactFormSchema,
  createContactFormDefaults,
  type ContactFormData,
} from '../lib/contact-schema';
import { submitContactForm, type ContactSubmissionResult, type ContactSubmissionHandler } from '../lib/contact-actions';
import type { ContactFeatureConfig } from '../lib/contact-config';

/**
 * Contact form props interface
 */
// [TRACE:INTERFACE=packages.features.contact.ContactFormProps]
// [FEAT:CONTACT] [FEAT:UX] [FEAT:CONFIGURATION]
// NOTE: Form props interface - supports flexible form customization, multi-step variants, and callback handling.
export interface ContactFormProps {
  /** Contact feature configuration (fields, steps, messages) */
  config: ContactFeatureConfig;
  /** Submission handler function (saves to database, sends email, syncs CRM, etc.) */
  onSubmit: ContactSubmissionHandler;
  /** Optional CSS class name */
  className?: string;
  /** Success callback */
  onSuccess?: (result: ContactSubmissionResult) => void;
  /** Error callback */
  onError?: (error: string) => void;
  /** Optional analytics tracking function */
  trackFormSubmission?: (formName: string, success: boolean) => void;
}

/**
 * Contact form component with configurable fields and multi-step support
 */
// [TRACE:FUNC=packages.features.contact.ContactForm]
// [FEAT:CONTACT] [FEAT:VALIDATION] [FEAT:UX] [FEAT:ACCESSIBILITY] [FEAT:CONFIGURATION]
// NOTE: Main contact form component - orchestrates form state, validation, multi-step navigation, and submission with user feedback.
export default function ContactForm({
  config,
  onSubmit,
  className,
  onSuccess,
  onError,
  trackFormSubmission,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Multi-step state
  const isMultiStep = config.steps && config.steps.length > 1;
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepConfig = isMultiStep ? config.steps![currentStep] : undefined;
  const totalSteps = isMultiStep ? config.steps!.length : 1;

  // Create schema and defaults from config
  const schema = useMemo(() => createContactFormSchema(config), [config]);
  const defaults = useMemo(() => createContactFormDefaults(config), [config]);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    trigger,
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema as unknown as Parameters<typeof zodResolver>[0]),
    defaultValues: defaults,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  // Get fields for current step (if multi-step) or all fields
  const fieldsToRender = useMemo(() => {
    if (isMultiStep && currentStepConfig) {
      return config.fields.filter((field) => currentStepConfig.fieldIds.includes(field.id));
    }
    return config.fields;
  }, [config.fields, isMultiStep, currentStepConfig]);

  // Handle step navigation
  const handleNext = async () => {
    if (!isMultiStep || !currentStepConfig) return;

    // Validate current step fields
    if (currentStepConfig.validateOnNext !== false) {
      const fieldNames = currentStepConfig.fieldIds as (keyof ContactFormData)[];
      const isValid = await trigger(fieldNames);
      if (!isValid) {
        return;
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const onFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await withSentrySpan(
        { name: 'contact_form.submit', op: 'ui.action', attributes: { route: '/contact' } },
        () =>
          submitContactForm(
            data,
            onSubmit,
            {
              successMessage: config.successMessage,
              errorMessage: config.errorMessage,
            }
          )
      );

      if (result.success) {
        trackFormSubmission?.('contact', true);
        await setSentryUser({
          email: typeof data.email === 'string' ? data.email : '',
          name: typeof data.name === 'string' ? data.name : '',
        });
        await setSentryContext('contact_form', {
          ...data,
        });
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });
        reset();
        onSuccess?.(result);
      } else {
        trackFormSubmission?.('contact', false);
        setSubmitStatus({
          type: 'error',
          message: result.message,
        });
        onError?.(result.message);
      }
    } catch {
      trackFormSubmission?.('contact', false);
      setSubmitStatus({
        type: 'error',
        message: config.errorMessage || 'Something went wrong. Please try again.',
      });
      onError?.(config.errorMessage || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (field: typeof config.fields[0]) => {
    const fieldError = errors[field.id as keyof ContactFormData];
    const errorMessage = typeof fieldError === 'object' && fieldError !== null && 'message' in fieldError
      ? String(fieldError.message)
      : undefined;
    const isTouched = touchedFields[field.id as keyof ContactFormData];
    const isValid = isTouched && !fieldError;

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            rows={field.rows || 5}
            required={field.required}
            error={errorMessage}
            isValid={isValid}
            {...register(field.id as keyof ContactFormData)}
          />
        );

      case 'select':
        return (
          <Select
            key={field.id}
            label={field.label}
            options={field.options || [{ value: '', label: 'Select an option' }]}
            error={errorMessage}
            {...register(field.id as keyof ContactFormData)}
          />
        );

      case 'email':
      case 'tel':
      case 'text':
      default:
        return (
          <Input
            key={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMessage}
            isValid={isValid}
            {...register(field.id as keyof ContactFormData)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={`space-y-6 ${className || ''}`} aria-label="Contact form">
      {/* Honeypot field */}
      {config.enableHoneypot && (
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website' as keyof ContactFormData)} />
        </div>
      )}

      {/* Multi-step progress indicator */}
      {isMultiStep && totalSteps > 1 && (
        <div
          className="mb-6"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuetext={`Step ${currentStep + 1} of ${totalSteps}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step title and description */}
      {isMultiStep && currentStepConfig && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">{currentStepConfig.title}</h3>
          {currentStepConfig.description && (
            <p className="text-muted-foreground">{currentStepConfig.description}</p>
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-6">
        {fieldsToRender.map((field) => renderField(field))}
      </div>

      {/* Consent text */}
      {config.consentText && (
        <div
          className="text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(config.consentText, { allowBasicHtml: true, strict: false }),
          }}
        />
      )}

      {/* Status message */}
      {submitStatus.type && (
        <div
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-error/10 text-error border border-error/20'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-4">
        {/* Previous button (multi-step only) */}
        {isMultiStep && currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Previous
          </Button>
        )}

        {/* Next button (multi-step only, not last step) */}
        {isMultiStep && currentStep < totalSteps - 1 && (
          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center ml-auto"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        )}

        {/* Submit button (single-step or last step) */}
        {(!isMultiStep || currentStep === totalSteps - 1) && (
          <Button
            type="submit"
            variant="primary"
            size="large"
            className={`w-full ${isMultiStep ? '' : 'ml-auto'}`}
            disabled={isSubmitting}
            aria-label={isSubmitting ? 'Sending message' : 'Send message'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
