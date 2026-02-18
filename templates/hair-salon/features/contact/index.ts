// File: templates/hair-salon/features/contact/index.ts  [TRACE:FILE=templates.hair-salon.features.contact.index]
// Purpose: Backward-compatible barrel export for contact feature.
//          Re-exports from extracted @repo/features/contact while maintaining
//          template-specific compatibility layer for existing usage.
//
// Exports / Entry: ContactForm component, contact form schema (backward-compatible)
// Used by: Contact page (/contact), footer contact sections
//
// Invariants:
// - Must maintain backward compatibility with existing template imports
// - Must re-export ContactForm component (adapter wrapper)
// - Must provide schema exports compatible with existing usage
//
// Status: @public (template-specific compatibility layer)
// Features:
// - [FEAT:CONTACT] Customer inquiry and communication forms
// - [FEAT:ARCHITECTURE] Backward-compatible re-export pattern

// Re-export ContactForm component (adapter wrapper)
export { default as ContactForm } from './components/ContactForm';

// Re-export schema for backward compatibility
// Note: Template-specific code should migrate to use @repo/features/contact directly
export * from './lib/contact-form-schema';
export type { ContactFormData } from './lib/contact-form-schema';
