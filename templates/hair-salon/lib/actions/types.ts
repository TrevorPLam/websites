// File: lib/actions/types.ts  [TRACE:FILE=lib.actions.types]
// Purpose: Type definitions for form submission, data sanitization, and monitoring.
//          Provides standardized interfaces for contact data, sanitized data structures,
//          and span attributes used across form processing and analytics.
//
// Exports / Entry: SanitizedContactData type, SpanAttributes type
// Used by: Contact form submission, booking actions, helpers, and any form processing features
//
// Invariants:
// - All sanitized data must exclude potentially dangerous content
// - Span attributes must be compatible with monitoring systems
// - Contact data must support validation and sanitization workflows
// - Types must be serializable for database storage and logging
// - Hashed identifiers must preserve privacy while enabling traceability
//
// Status: @public
// Features:
// - [FEAT:TYPES] Standardized form data interfaces
// - [FEAT:SECURITY] Sanitized data structures
// - [FEAT:MONITORING] Monitoring and tracing types
// - [FEAT:VALIDATION] Form validation type definitions
// - [FEAT:PRIVACY] Privacy-preserving data structures

import type { SpanAttributes } from '@repo/infra';

// [TRACE:TYPE=lib.actions.SanitizedContactData]
// [FEAT:SECURITY] [FEAT:VALIDATION] [FEAT:PRIVACY]
// NOTE: Sanitized contact data - provides safe data structure with validation and privacy protection.
export type SanitizedContactData = {
  safeEmail: string;
  safeName: string;
  safePhone: string;
  safeMessage: string;
  emailHash: string;
  hashedIp: string;
  contactSpanAttributes: SpanAttributes;
};
