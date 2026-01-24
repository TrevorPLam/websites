/**
 * Contact form component with validation and submission handling.
 *
 * @component ContactForm
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Primary lead capture form. Critical conversion component.
 * Handles client-side validation → server action submission → feedback display.
 *
 * **RENDERING**: Client component ('use client') for form interactivity.
 *
 * **FORM FLOW**:
 * 1. User fills form (validated on blur via react-hook-form)
 * 2. Submit triggers onSubmit handler
 * 3. Calls submitContactForm server action (lib/actions.ts)
 * 4. Displays success/error message based on response
 *
 * **HONEYPOT FIELD**: Hidden 'website' field catches bots.
 * - Rendered as sr-only, tabIndex=-1, autoComplete=off
 * - Server rejects if filled (lib/actions.ts)
 *
 * **FORM FIELDS** (current schema from contact-form-schema.ts):
 * | Field | Required | Notes |
 * |-------|----------|-------|
 * | name | ✅ | min 2 chars |
 * | email | ✅ | valid email |
 * | company | ❌ | optional |
 * | phone | ✅ | required |
 * | marketingSpend | ❌ | dropdown |
 * | message | ✅ | min 10 chars |
 * | hearAboutUs | ❌ | dropdown |
 *
 * **AI ITERATION HINTS**:
 * - Adding field? Update contact-form-schema.ts FIRST, then add Input here
 * - Required fields: name, email, phone, message
 * - Use same pattern: register() + error display + isValid green check
 * - Test with __tests__/components/ContactForm.test.tsx
 *
 * **DEPENDENCIES**:
 * - lib/actions.ts — submitContactForm server action
 * - lib/contact-form-schema.ts — Zod validation schema
 * - components/ui/Input, Select, Textarea, Button — form primitives
 * - lib/sentry-client.ts — Sentry context on successful submit
 * - lib/analytics.ts — conversion tracking for submissions
 *
 * **VALIDATION MODES**:
 * - mode: 'onBlur' — validates when field loses focus
 * - reValidateMode: 'onChange' — re-validates while typing after first error
 * - delayError: UI_TIMING.FORM_ERROR_DEBOUNCE_MS — debounces error display for smoother UX
 *
 * **POTENTIAL ISSUES**:
 * - [ ] Success message disappears on page navigation
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Features:**
 * - Client-side validation with Zod schema
 * - Server action submission (no API route needed)
 * - Rate limiting protection (server-side)
 * - Success/error state feedback
 * - Loading state with spinner
 * - Sentry context for error tracking
 *
 * **Form Fields:**
 * - Name (required)
 * - Email (required, validated)
 * - Company (optional)
 * - Phone (required)
 * - Marketing Spend (dropdown)
 * - Message (required)
 * - How did you hear about us (dropdown)
 *
 * **Validation:**
 * - Mode: onBlur (validates when field loses focus)
 * - ReValidateMode: onChange (re-validates as user types after first error)
 * - Error delay: 500ms debounce
 *
 * **Security:**
 * - All inputs sanitized server-side in lib/actions.ts
 * - Rate limited per email and IP address
 * - No sensitive data logged
 *
 * **Usage:**
 * ```tsx
 * import ContactForm from '@/components/ContactForm'
 *
 * // In contact page
 * <ContactForm />
 * ```
 *
 * @see lib/actions.ts for server-side handling
 * @see lib/contact-form-schema.ts for validation schema
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitContactForm } from '@/lib/actions'
import { contactFormSchema, type ContactFormData } from '@/lib/contact-form-schema'
import { trackFormSubmission } from '@/lib/analytics'
import { UI_TIMING } from '@/lib/constants'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { setSentryContext, setSentryUser, withSentrySpan } from '@/lib/sentry-client'

/**
 * Contact form with full validation and server submission.
 * Manages its own submission state and error handling.
 */
export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first validation
    delayError: UI_TIMING.FORM_ERROR_DEBOUNCE_MS, // Debounce error display
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const result = await withSentrySpan(
        { name: 'contact_form.submit', op: 'ui.action', attributes: { route: '/contact' } },
        () => submitContactForm(data),
      )

      if (result.success) {
        trackFormSubmission('contact', true)
        await setSentryUser({ email: data.email, name: data.name })
        await setSentryContext('contact_form', {
          marketingSpend: data.marketingSpend,
          heardFrom: data.hearAboutUs,
        })
        setSubmitStatus({
          type: 'success',
          message: result.message,
        })
        reset()
      } else {
        trackFormSubmission('contact', false)
        setSubmitStatus({
          type: 'error',
          message: result.message,
        })
      }
    } catch {
      trackFormSubmission('contact', false)
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
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
        label="Current Monthly Marketing Spend"
        options={[
          { value: '', label: 'Select an option' },
          { value: 'under-1k', label: 'Under $1,000' },
          { value: '1k-5k', label: '$1,000 - $5,000' },
          { value: '5k-10k', label: '$5,000 - $10,000' },
          { value: 'over-10k', label: 'Over $10,000' },
          { value: 'not-sure', label: 'Not sure' },
        ]}
        error={errors.marketingSpend?.message}
        {...register('marketingSpend')}
      />

      <Textarea
        label="Message"
        placeholder="Tell us about your business and marketing goals..."
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
  )
}
