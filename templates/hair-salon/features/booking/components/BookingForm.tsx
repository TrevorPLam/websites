// File: features/booking/components/BookingForm.tsx  [TRACE:FILE=features.booking.components.BookingForm]
// Purpose: Booking form component providing comprehensive appointment scheduling with real-time validation,
//          service selection, and submission handling. Implements form state management, error handling,
//          and user feedback for seamless booking experience.
//
// Exports / Entry: BookingForm component (default export)
// Used by: Booking page (/book), service pages, and any appointment scheduling features
//
// Invariants:
// - Form must validate all inputs against booking schema before submission
// - Service types and time slots must match available business offerings
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

'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Card, Button, Input, Select, Textarea } from '@repo/ui';
import { Calendar } from 'lucide-react';

import {
  bookingFormSchema,
  BookingFormData,
  SERVICE_LABELS,
  TIME_SLOT_LABELS,
  SERVICE_TYPES,
  TIME_SLOTS,
  bookingFormDefaults,
} from '../lib/booking-schema';
import { submitBookingRequest, BookingSubmissionResult } from '../lib/booking-actions';

// [TRACE:INTERFACE=features.booking.BookingFormProps]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Form props interface - supports flexible form customization and callback handling.
interface BookingFormProps {
  className?: string;
  prefilledService?: string;
  onSuccess?: (result: BookingSubmissionResult) => void;
  onError?: (error: string) => void;
}

// [TRACE:FUNC=features.booking.BookingForm]
// [FEAT:BOOKING] [FEAT:VALIDATION] [FEAT:UX] [FEAT:ACCESSIBILITY]
// NOTE: Main booking form component - orchestrates form state, validation, and submission with user feedback.
export default function BookingForm({
  className,
  prefilledService,
  onSuccess,
  onError,
}: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
  } = useForm<BookingFormData>({
    // Type assertion: zodResolver expects Zod 3.23+ internal types (~standard, ~validate); we use Zod 3.22
    resolver: zodResolver(bookingFormSchema as unknown as Parameters<typeof zodResolver>[0]),
    defaultValues: {
      ...bookingFormDefaults,
      serviceType: (prefilledService as any) || 'consultation',
    },
    mode: 'onChange',
  });

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Set maximum date to 90 days from now
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const onSubmit = async (data: BookingFormData) => {
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

        const result = await submitBookingRequest(formData);

        if (result.success) {
          setIsSubmitted(true);
          toast.success('Booking request submitted successfully!');
          onSuccess?.(result);
        } else {
          toast.error(result.error || 'Failed to submit booking');
          onError?.(result.error || 'Failed to submit booking');
        }
      } catch (error) {
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
        />

        {/* Customer Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
            <Input
              {...register('firstName')}
              placeholder="Jane"
              error={errors.firstName?.message}
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
            <Input
              {...register('lastName')}
              placeholder="Doe"
              error={errors.lastName?.message}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <Input
              {...register('email')}
              type="email"
              placeholder="jane@example.com"
              error={errors.email?.message}
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <Input
              {...register('phone')}
              type="tel"
              placeholder="(555) 123-4567"
              error={errors.phone?.message}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Service Details */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Service Type</label>
          <Select
            {...register('serviceType')}
            options={SERVICE_TYPES.map((type) => ({
              value: type,
              label: SERVICE_LABELS[type],
            }))}
            error={errors.serviceType?.message}
            disabled={isPending}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Date</label>
            <Input
              {...register('preferredDate')}
              type="date"
              min={minDate}
              max={maxDateStr}
              error={errors.preferredDate?.message}
              disabled={isPending}
            />
            <p className="text-xs text-slate-500 mt-1">
              Bookings available up to 90 days in advance
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Time</label>
            <Select
              {...register('timeSlot')}
              options={TIME_SLOTS.map((slot) => ({
                value: slot,
                label: TIME_SLOT_LABELS[slot],
              }))}
              error={errors.timeSlot?.message}
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes for Stylist (Optional)
          </label>
          <Textarea
            {...register('notes')}
            placeholder="Any specific requests or hair history..."
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
