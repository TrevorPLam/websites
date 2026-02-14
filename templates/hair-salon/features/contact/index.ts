// File: features/contact/index.ts  [TRACE:FILE=features.contact.index]
// Purpose: Contact feature barrel export providing clean imports for contact components
//          and form schemas. Centralizes contact functionality for customer
//          communication and inquiry handling across the application.
//
// Exports / Entry: ContactForm component, contact form schema
// Used by: Contact page (/contact), footer contact sections, and inquiry features
//
// Invariants:
// - Must export ContactForm as default export for React patterns
// - Must export all contact form utilities with consistent naming
// - Export structure must remain stable to avoid breaking contact functionality
// - Schema exports must include validation rules and type definitions
//
// Status: @public
// Features:
// - [FEAT:CONTACT] Customer inquiry and communication forms
// - [FEAT:FORMS] Contact form validation and submission
// - [FEAT:INTEGRATION] External CRM and email system connections
// - [FEAT:ARCHITECTURE] Clean barrel export pattern

// Library exports
export * from './lib/contact-form-schema';

// Component exports
export { default as ContactForm } from './components/ContactForm';
