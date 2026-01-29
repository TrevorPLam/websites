/**
 * Shared types and interfaces for contact form actions.
 *
 * @module lib/actions/types
 */

import type { SpanAttributes } from '../sentry-server'

export type SanitizedContactData = {
  safeEmail: string
  safeName: string
  safePhone: string
  safeMessage: string
  emailHash: string
  hashedIp: string
  contactSpanAttributes: SpanAttributes
}
