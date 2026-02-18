// File: packages/features/src/contact/index.ts  [TRACE:FILE=packages.features.contact.index]
// Purpose: Contact feature barrel export providing clean imports for contact components,
//          schemas, actions, and configuration. Centralizes contact functionality for customer
//          communication and inquiry handling across the application.
//
// Relationship: Depends on @repo/ui, @repo/infra. Consumed by template contact page; handler passed by template.
// System role: Feature barrel; config-driven schema; submitContactForm uses pluggable ContactSubmissionHandler.
// Assumptions: Template provides createContactConfig and handler (e.g. Supabase + HubSpot in lib/actions/submit).
//
// Exports / Entry: ContactForm component, contact schemas, actions, and config utilities
// Used by: Contact pages, footer contact sections, and any inquiry features
//
// Invariants:
// - Must export all public contact utilities with consistent naming
// - Component exports must be default exports for React patterns
// - Library exports (schemas, actions, config) must be named exports
// - Export structure must remain stable to avoid breaking contact functionality
//
// Status: @public
// Features:
// - [FEAT:CONTACT] Customer inquiry and communication forms
// - [FEAT:FORMS] Contact form validation and submission
// - [FEAT:INTEGRATION] External CRM and email system connections
// - [FEAT:ARCHITECTURE] Clean barrel export pattern
// - [FEAT:CONFIGURATION] Configurable contact feature setup

// Component exports
export { default as ContactForm } from './components/ContactForm';
export type { ContactFormProps } from './components/ContactForm';

// Configuration exports
export * from './lib/contact-config';
export type { ContactFeatureConfig, ContactFieldConfig, ContactStepConfig } from './lib/contact-config';

// Schema exports
export * from './lib/contact-schema';
export type { ContactFormData } from './lib/contact-schema';

// Action exports
export * from './lib/contact-actions';
export type { ContactSubmissionResult, ContactSubmissionHandler } from './lib/contact-actions';
