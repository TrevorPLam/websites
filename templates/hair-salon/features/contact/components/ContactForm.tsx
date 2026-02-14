// File: features/contact/components/ContactForm.tsx  [TRACE:FILE=features.contact.components.ContactForm]
// Purpose: Contact form component providing customer inquiry submission with real-time validation,
//          error handling, and analytics tracking. Implements form state management, submission
//          feedback, and Sentry error monitoring for reliable communication.
//
// Exports / Entry: ContactForm component (default export)
// Used by: Contact page (/contact), footer contact sections, and any inquiry features
//
// Invariants:
// - Form must validate all inputs against contact schema before submission
// - Submission state must be preserved to prevent duplicate submissions
// - Error messages must be user-friendly and actionable
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

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitContactForm } from '@/lib/actions';
import {
  contactFormSchema,
  type ContactFormData,
} from '@/features/contact/lib/contact-form-schema';
import { trackFormSubmission } from '@/features/analytics/lib/analytics';
import { UI_TIMING } from '@/lib/constants';
import { Input, Select, Textarea, Button } from '@repo/ui';
import { Loader2 } from 'lucide-react';
import { setSentryContext, setSentryUser, withSentrySpan } from '@repo/infra/client';

/**
 * Contact form with full validation and server submission.
 * Manages its own submission state and error handling.
 */
// [TRACE:FUNC=features.contact.ContactForm]
// [FEAT:CONTACT] [FEAT:VALIDATION] [FEAT:ANALYTICS] [FEAT:MONITORING]
// NOTE: Main contact form component - orchestrates validation, submission, analytics, and error monitoring.
export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
    reset,
  } = useForm<ContactFormData>({
    // Type assertion: zodResolver expects Zod 3.23+ internal types; we use Zod 3.22
    resolver: zodResolver(contactFormSchema as unknown as Parameters<typeof zodResolver>[0]),
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first validation
    delayError: UI_TIMING.FORM_ERROR_DEBOUNCE_MS, // Debounce error display
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // [TRACE:BLOCK=features.contact.formSubmission]
      // [FEAT:CONTACT] [FEAT:ANALYTICS] [FEAT:MONITORING]
      // NOTE: Form submission flow - tracks analytics, sets Sentry context, and handles server submission.
      const result = await withSentrySpan(
        { name: 'contact_form.submit', op: 'ui.action', attributes: { route: '/contact' } },
        () => submitContactForm(data)
      );

      if (result.success) {
        trackFormSubmission('contact', true);
        await setSentryUser({ email: data.email, name: data.name });
        await setSentryContext('contact_form', {
          servicesInterested: data.servicesInterested,
          preferredAppointment: data.preferredAppointment,
          heardFrom: data.hearAboutUs,
        });
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });
        reset();
      } else {
        trackFormSubmission('contact', false);
        setSubmitStatus({
          type: 'error',
          message: result.message,
        });
      }
    } catch {
      trackFormSubmission('contact', false);
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <Input
        label="Name"
        type="text"
        placeholder="John Smith"
        required
        error={errors.name?.message}
        isValid={touchedFields.name && !errors.name}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="john@company.com"
        required
        error={errors.email?.message}
        isValid={touchedFields.email && !errors.email}
        {...register('email')}
      />

      <Input
        label="Company"
        type="text"
        placeholder="Your Company"
        error={errors.company?.message}
        isValid={touchedFields.company && dirtyFields.company && !errors.company}
        {...register('company')}
      />

      <Input
        label="Phone"
        type="tel"
        placeholder="(555) 123-4567"
        required
        error={errors.phone?.message}
        isValid={Boolean(touchedFields.phone && !errors.phone)}
        {...register('phone')}
      />

      <Select
        label="Services Interested In"
        options={[
          { value: '', label: 'Select services' },
          { value: 'haircut', label: 'Haircut & Styling' },
          { value: 'color', label: 'Hair Color & Highlights' },
          { value: 'treatment', label: 'Hair Treatment' },
          { value: 'styling', label: 'Special Occasion Styling' },
          { value: 'consultation', label: 'Consultation' },
        ]}
        error={errors.servicesInterested?.message}
        {...register('servicesInterested')}
      />

      <Select
        label="Preferred Appointment Time"
        options={[
          { value: '', label: 'Select time' },
          { value: 'morning', label: 'Morning (9AM - 12PM)' },
          { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
          { value: 'evening', label: 'Evening (5PM - 8PM)' },
        ]}
        error={errors.preferredAppointment?.message}
        {...register('preferredAppointment')}
      />

      <Textarea
        label="Message"
        placeholder="Tell us about your hair care needs and desired services..."
        rows={5}
        required
        error={errors.message?.message}
        isValid={touchedFields.message && !errors.message}
        {...register('message')}
      />

      <Select
        label="How did you hear about us?"
        options={[
          { value: '', label: 'Select an option' },
          { value: 'search', label: 'Search engine (Google, Bing, etc.)' },
          { value: 'social', label: 'Social media' },
          { value: 'referral', label: 'Referral from a friend or colleague' },
          { value: 'ad', label: 'Online advertisement' },
          { value: 'other', label: 'Other' },
        ]}
        error={errors.hearAboutUs?.message}
        {...register('hearAboutUs')}
      />

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

      <Button
        type="submit"
        variant="primary"
        size="large"
        className="w-full"
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
    </form>
  );
}
