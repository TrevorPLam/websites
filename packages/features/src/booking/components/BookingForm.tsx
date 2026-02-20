'use client';

// File: packages/features/src/booking/components/BookingForm.tsx  [TRACE:FILE=packages.features.booking.components.BookingForm]
// Purpose: Booking form component providing comprehensive appointment scheduling with real-time validation,
//          service selection, and submission handling. Now configurable via BookingFeatureConfig.
//
// Exports / Entry: BookingForm component (default export)
// Used by: Booking page (/book), service pages, and any appointment scheduling features
//
// Invariants:
// - Form must validate all inputs against booking schema before submission
// - Service types and time slots must match provided configuration
// - Form state must be preserved during submission to prevent data loss
// - Error messages must be user-friendly and actionable
// - Submission must be idempotent to prevent duplicate bookings
//
// Status: @public
// Features:
// - [FEAT:BOOKING] Comprehensive appointment scheduling form
// - [FEAT:VALIDATION] Real-time form validation with Zod schema
// - [FEAT:UX] User-friendly error handling and feedback
// - [FEAT:ACCESSIBILITY] Accessible form controls and ARIA labels
// - [FEAT:PERFORMANCE] Optimized form state management
// - [FEAT:CONFIGURATION] Configurable service types and time slots

'use client';

import { useState, useTransition, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Card, Button, Input, Select, Textarea } from '@repo/ui';
import { Calendar } from 'lucide-react';

import {
  createBookingFormSchema,
  createBookingFormDefaults,
  type BookingFormData,
} from '../lib/booking-schema';
import { submitBookingRequest, type BookingSubmissionResult } from '../lib/booking-actions';
import type { BookingFeatureConfig } from '../lib/booking-config';

// [TRACE:INTERFACE=packages.features.booking.BookingFormProps]
// [FEAT:BOOKING] [FEAT:UX] [FEAT:CONFIGURATION]
// NOTE: Form props interface - supports flexible form customization and callback handling with configuration.
export interface BookingFormProps {
  /** Booking feature configuration (service categories, time slots, etc.) */
  config: BookingFeatureConfig;
  /** Optional CSS class name */
  className?: string;
  /** Optional pre-filled service type */
  prefilledService?: string;
  /** Success callback */
  onSuccess?: (result: BookingSubmissionResult) => void;
  /** Error callback */
  onError?: (error: string) => void;
}

// [TRACE:FUNC=packages.features.booking.BookingForm]
// [FEAT:BOOKING] [FEAT:VALIDATION] [FEAT:UX] [FEAT:ACCESSIBILITY] [FEAT:CONFIGURATION]
// NOTE: Main booking form component - orchestrates form state, validation, and submission with user feedback.
export default function BookingForm({
  config,
  className,
  prefilledService,
  onSuccess,
  onError,
}: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Create schema and defaults from config
  const schema = useMemo(() => createBookingFormSchema(config), [config]);
  const defaults = useMemo(() => createBookingFormDefaults(config), [config]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(schema as unknown as Parameters<typeof zodResolver>[0]),
    defaultValues: {
      ...defaults,
      serviceType: prefilledService ?? defaults.serviceType ?? '',
    },
    mode: 'onChange',
  });

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Set maximum date based on config
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + config.maxAdvanceDays);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const onSubmit: SubmitHandler<BookingFormData> = async (data: BookingFormData) => {
    startTransition(async () => {
      try {
        // Create FormData for server action
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Add honeypot field (hidden from user)
        formData.append('honeypot', '');
        formData.append('timestamp', new Date().toISOString());

        const result = await submitBookingRequest(formData, config);

        if (result.success) {
          setIsSubmitted(true);
          toast.success('Booking request submitted successfully!');
          onSuccess?.(result);
        } else {
          toast.error(result.error || 'Failed to submit booking');
          onError?.(result.error || 'Failed to submit booking');
        }
      } catch {
        const errorMessage = 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    });
  };

  if (isSubmitted) {
    return (
      <Card variant="default" className={`p-8 text-center ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
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
          <h3 className="text-2xl font-bold text-foreground mb-4">Booking Request Received!</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for your booking request. We'll review your request and send you a
            confirmation email shortly.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Please check your email for confirmation details. If you don't receive an email within
            24 hours, please contact us.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setIsSubmitted(false);
              // Reset form
              setValue('firstName', '');
              setValue('lastName', '');
              setValue('email', '');
              setValue('phone', '');
              setValue('notes', '');
            }}
          >
            Submit Another Booking
          </Button>
        </div>
      </Card>
    );
  }

  // Create service options from config
  const serviceOptions = config.services.map((service) => ({
    value: service.id,
    label: service.label,
  }));

  // Create time slot options from config
  const timeSlotOptions = config.timeSlots.map((slot) => ({
    value: slot.value,
    label: slot.label,
  }));

  return (
    <Card variant="default" className={`p-8 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Request an Appointment
        </h2>
        <p className="text-muted-foreground">
          Fill out the form below and we'll confirm your appointment shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden honeypot field for bot detection */}
        <input
          type="text"
          {...register('honeypot')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          aria-label="Do not fill"
        />

        {/* Customer Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            {...register('firstName')}
            label="First Name"
            placeholder="Jane"
            error={errors.firstName?.message}
            disabled={isPending}
          />
          <Input
            {...register('lastName')}
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            disabled={isPending}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            {...register('email')}
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            error={errors.email?.message}
            disabled={isPending}
          />
          <Input
            {...register('phone')}
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            error={errors.phone?.message}
            disabled={isPending}
          />
        </div>

        {/* Service Details */}
        <Select
          {...register('serviceType')}
          label="Service Type"
          options={serviceOptions}
          error={errors.serviceType?.message}
          disabled={isPending}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Input
              {...register('preferredDate')}
              label="Preferred Date"
              type="date"
              min={minDate}
              max={maxDateStr}
              error={errors.preferredDate?.message}
              disabled={isPending}
            />
            <p className="text-xs text-slate-500 mt-1">
              Bookings available up to {config.maxAdvanceDays} days in advance
            </p>
          </div>
          <Select
            {...register('timeSlot')}
            label="Preferred Time"
            options={timeSlotOptions}
            error={errors.timeSlot?.message}
            disabled={isPending}
          />
        </div>

        <div>
          <Textarea
            {...register('notes')}
            label={config.notesLabel ?? 'Notes (Optional)'}
            placeholder={config.notesPlaceholder ?? 'Any specific requests or notes...'}
            rows={3}
            error={errors.notes?.message}
            disabled={isPending}
          />
          <p className="text-xs text-slate-500 mt-1">Maximum 500 characters</p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          className="w-full"
          disabled={!isValid || !isDirty || isPending}
        >
          {isPending ? 'Submitting...' : 'Request Appointment'}
        </Button>

        <p className="text-xs text-slate-500 text-center">
          By booking, you agree to our cancellation policy (24-hour notice required).
        </p>
      </form>
    </Card>
  );
}
