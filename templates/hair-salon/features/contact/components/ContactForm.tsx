// File: templates/hair-salon/features/contact/components/ContactForm.tsx  [TRACE:FILE=templates.hair-salon.features.contact.ContactForm]
// Purpose: Backward-compatible adapter wrapper for extracted contact feature.
//          Bridges the old template-specific ContactForm API to the new configurable
//          ContactForm from @repo/features/contact. Maintains backward compatibility
//          while using the extracted feature implementation.
//
// Exports / Entry: ContactForm component (default export)
// Used by: Contact page (/contact), footer contact sections
//
// Invariants:
// - Must maintain backward compatibility with existing template usage
// - Must convert template-specific config to ContactFeatureConfig
// - Must provide submission handler that integrates with template's Supabase/HubSpot setup
//
// Status: @public (template-specific adapter)
// Features:
// - [FEAT:CONTACT] Customer inquiry form with validation
// - [FEAT:ARCHITECTURE] Backward-compatible adapter pattern
// - [FEAT:INTEGRATION] Template-specific submission handler

'use client';

import { ContactForm as BaseContactForm, createContactConfig, type ContactSubmissionHandler } from '@repo/features/contact';
import { submitContactForm } from '@/lib/actions';
import { trackFormSubmission } from '@repo/integrations-analytics';
import siteConfig from '@/site.config';

/**
 * Contact form adapter - bridges template-specific usage to extracted feature
 * Maintains backward compatibility while using the new configurable implementation
 */
// [TRACE:FUNC=templates.hair-salon.features.contact.ContactForm]
// [FEAT:CONTACT] [FEAT:ARCHITECTURE]
// NOTE: Adapter component - converts template config to feature config and provides submission handler.
export default function ContactForm() {
  // Create feature config from template site config
  const config = createContactConfig({
    fields: [
      {
        id: 'name',
        label: 'Name',
        placeholder: 'John Smith',
        required: true,
        type: 'text',
        validation: {
          minLength: 2,
          maxLength: 100,
        },
      },
      {
        id: 'email',
        label: 'Email',
        placeholder: 'john@company.com',
        required: true,
        type: 'email',
        validation: {
          maxLength: 254,
        },
      },
      {
        id: 'company',
        label: 'Company',
        placeholder: 'Your Company',
        required: false,
        type: 'text',
        validation: {
          maxLength: 200,
        },
      },
      {
        id: 'phone',
        label: 'Phone',
        placeholder: '(555) 123-4567',
        required: true,
        type: 'tel',
        validation: {
          minLength: 10,
          maxLength: 50,
        },
      },
      {
        id: 'servicesInterested',
        label: 'Services Interested In',
        required: false,
        type: 'select',
        options: [
          { value: '', label: 'Select services' },
          { value: 'haircut', label: 'Haircut & Styling' },
          { value: 'color', label: 'Hair Color & Highlights' },
          { value: 'treatment', label: 'Hair Treatment' },
          { value: 'styling', label: 'Special Occasion Styling' },
          { value: 'consultation', label: 'Consultation' },
        ],
      },
      {
        id: 'preferredAppointment',
        label: 'Preferred Appointment Time',
        required: false,
        type: 'select',
        options: [
          { value: '', label: 'Select time' },
          { value: 'morning', label: 'Morning (9AM - 12PM)' },
          { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
          { value: 'evening', label: 'Evening (5PM - 8PM)' },
        ],
      },
      {
        id: 'message',
        label: 'Message',
        placeholder: 'Tell us about your hair care needs and desired services...',
        required: true,
        type: 'textarea',
        rows: 5,
        validation: {
          minLength: 10,
          maxLength: 5000,
        },
      },
      {
        id: 'hearAboutUs',
        label: 'How did you hear about us?',
        required: false,
        type: 'select',
        options: [
          { value: '', label: 'Select an option' },
          { value: 'search', label: 'Search engine (Google, Bing, etc.)' },
          { value: 'social', label: 'Social media' },
          { value: 'referral', label: 'Referral from a friend or colleague' },
          { value: 'ad', label: 'Online advertisement' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
    enableHoneypot: true,
    successMessage: "Thank you for your message! We'll be in touch soon.",
    errorMessage: 'Something went wrong. Please try again.',
  });

  // Submission handler that integrates with template's Supabase/HubSpot setup
  const submissionHandler: ContactSubmissionHandler = async (data, metadata) => {
    // Call the template's existing submitContactForm action
    // This maintains integration with Supabase and HubSpot
    const result = await submitContactForm(data as any);

    return {
      success: result.success,
      message: result.message,
    };
  };

  return (
    <BaseContactForm
      config={config}
      onSubmit={submissionHandler}
      trackFormSubmission={trackFormSubmission}
    />
  );
}
