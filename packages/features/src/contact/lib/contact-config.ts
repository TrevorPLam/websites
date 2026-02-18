// File: packages/features/src/contact/lib/contact-config.ts  [TRACE:FILE=packages.features.contact.contactConfig]
// Purpose: Configuration interface for contact feature, enabling template-agnostic contact forms
//          with configurable fields, validation rules, and multi-step support. Supports
//          industry-specific customization while maintaining consistent validation patterns.
//
// Relationship: Can derive from @repo/types ContactFlowConfig. Used by contact-schema, ContactForm, contact-actions.
// System role: createContactConfig builds ContactFeatureConfig from flow config; fields drive schema factory.
// Assumptions: config.fields non-empty; step boundaries align with field order when multi-step.
//
// Exports / Entry: ContactFeatureConfig interface, ContactFieldConfig interface, createContactConfig helper
// Used by: ContactForm component, contact schema factory, contact actions
//
// Invariants:
// - Field configurations must include validation rules
// - Multi-step configurations must define step boundaries
// - Consent text must be provided when required
// - Submission handlers must be pluggable per client
//
// Status: @public
// Features:
// - [FEAT:CONTACT] Configuration-driven contact feature
// - [FEAT:CONFIGURATION] Template-agnostic contact setup
// - [FEAT:TYPES] Type-safe contact configuration
// - [FEAT:FORMS] Configurable field registry

/**
 * Field configuration for contact form
 * Defines which fields are shown, their labels, placeholders, and validation
 */
// [TRACE:INTERFACE=packages.features.contact.ContactFieldConfig]
// [FEAT:CONTACT] [FEAT:CONFIGURATION] [FEAT:FORMS]
// NOTE: Field configuration - enables per-client customization of form fields with validation rules.
export interface ContactFieldConfig {
  /** Field identifier (matches schema field names) */
  id: string;
  /** Display label for the field */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether field is required */
  required?: boolean;
  /** Field type (text, email, tel, select, textarea) */
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  /** For select fields: options array */
  options?: Array<{ value: string; label: string }>;
  /** For textarea: number of rows */
  rows?: number;
  /** Validation constraints */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customMessage?: string;
  };
}

/**
 * Multi-step form step configuration
 */
// [TRACE:INTERFACE=packages.features.contact.ContactStepConfig]
// [FEAT:CONTACT] [FEAT:UX] [FEAT:FORMS]
// NOTE: Step configuration - defines form steps for multi-step variant with navigation and validation.
export interface ContactStepConfig {
  /** Step identifier */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Field IDs included in this step */
  fieldIds: string[];
  /** Whether to validate on step navigation */
  validateOnNext?: boolean;
}

/**
 * Contact feature configuration
 * Enables template-agnostic contact forms with configurable fields and multi-step support
 */
// [TRACE:INTERFACE=packages.features.contact.ContactFeatureConfig]
// [FEAT:CONTACT] [FEAT:CONFIGURATION] [FEAT:FORMS] [FEAT:UX]
// NOTE: Feature configuration - provides all configurable aspects of contact feature including fields, steps, and handlers.
export interface ContactFeatureConfig {
  /** Field configurations */
  fields: ContactFieldConfig[];
  /** Multi-step configuration (if multi-step variant) */
  steps?: ContactStepConfig[];
  /** Consent text (if required) */
  consentText?: string;
  /** Success message after submission */
  successMessage?: string;
  /** Error message template */
  errorMessage?: string;
  /** Whether to enable honeypot bot protection */
  enableHoneypot?: boolean;
  /** Custom validation rules */
  customValidation?: Record<string, unknown>;
}

/**
 * Default contact field configurations
 * Provides sensible defaults for common contact form fields
 */
// [TRACE:CONST=packages.features.contact.defaultContactFields]
// [FEAT:CONTACT] [FEAT:CONFIGURATION] [FEAT:FORMS]
// NOTE: Default fields - standard contact form fields that can be customized per client.
export const defaultContactFields: ContactFieldConfig[] = [
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
    id: 'message',
    label: 'Message',
    placeholder: 'Tell us about your needs...',
    required: true,
    type: 'textarea',
    rows: 5,
    validation: {
      minLength: 10,
      maxLength: 5000,
    },
  },
];

/**
 * Creates contact feature configuration with defaults
 * Can be extended with custom fields and multi-step configuration
 */
// [TRACE:FUNC=packages.features.contact.createContactConfig]
// [FEAT:CONTACT] [FEAT:CONFIGURATION]
// NOTE: Config factory - creates contact config with sensible defaults that can be customized per client.
export function createContactConfig(
  overrides?: Partial<ContactFeatureConfig>
): ContactFeatureConfig {
  return {
    fields: defaultContactFields,
    enableHoneypot: true,
    successMessage: "Thank you for your message! We'll be in touch soon.",
    errorMessage: 'Something went wrong. Please try again.',
    ...overrides,
  };
}
