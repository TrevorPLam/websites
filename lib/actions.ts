/**
 * Server actions for contact form submission with rate limiting and lead capture.
 *
 * @module lib/actions
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Core server action for contact form. Single entry point for
 * all form submissions. Handles validation → rate-limiting → persistence/sync.
 *
 * **ARCHITECTURE PATTERN**: Server Action (Next.js 14+ pattern)
 * - Called directly from ContactForm.tsx via `submitContactForm(data)`
 * - Runs server-side only (no API route needed)
 * - Returns { success, message, errors? } response object
 *
 * **CURRENT STATE**: Refactored into modules (TASK-014).
 * - Implementation split across lib/actions/*.ts modules
 * - This file re-exports submitContactForm for backward compatibility
 *
 * **MODULE STRUCTURE**:
 * - `./actions/types.ts` — Shared types and interfaces
 * - `./actions/helpers.ts` — Helper functions (hashing, name splitting, etc.)
 * - `./actions/hubspot.ts` — HubSpot-related functions
 * - `./actions/supabase.ts` — Supabase-related functions
 * - `./actions/submit.ts` — Main submission handler
 *
 * **KEY DEPENDENCIES**:
 * - `./sanitize.ts` — XSS prevention (escapeHtml, sanitizeEmail, sanitizeName)
 * - `./env.ts` — Server-only env validation (validatedEnv)
 * - `./contact-form-schema.ts` — Zod schema (contactFormSchema)
 * - `@upstash/ratelimit` — Distributed rate limiting (optional)
 *
 * **RATE LIMIT DESIGN**:
 * - Dual limiting: per-email AND per-IP (both must pass)
 * - 3 requests/hour per identifier
 * - IP hashed with SHA-256 before storage (privacy)
 * - Falls back to in-memory Map when Upstash not configured (logged with missing keys)
 *
 * **AI ITERATION HINTS**:
 * 1. Schema changes: Update contact-form-schema.ts first, then modules
 * 2. New fields: Add to sanitized payload before storage and sync
 * 3. Testing: See __tests__/lib/actions.rate-limit.test.ts for mocking pattern
 * 4. Module changes: Update corresponding file in lib/actions/
 *
 * **SECURITY CHECKLIST** (verify after any changes):
 * - [x] All user inputs pass through escapeHtml() before HTML context
 * - [x] CRM payload uses sanitizeName() / sanitizeEmail()
 * - [x] No raw IP addresses logged (use hashedIp)
 * - [x] Errors return generic messages (no internal details)
 * - [x] CSRF protection validates origin/referer headers
 * - [x] IP validation only trusts known proxy headers
 *
 * **RESOLVED ISSUES** (completed in transformation):
 * - [x] ~~In-memory rate limiter not suitable for multi-instance production~~ (FIXED: Issue #005)
 *       Production now enforces Upstash Redis at startup (lib/env.ts)
 * - [x] ~~No CSRF protection~~ (FIXED: Issue #010)
 *       Origin validation added with defense-in-depth approach
 * - [x] ~~IP header spoofing possible~~ (FIXED: Issue #011)
 *       Only trusted proxy headers accepted in production
 * - [x] ~~File too large (536 lines)~~ (FIXED: TASK-014)
 *       Split into focused modules (<200 lines each)
 *
 * **REMAINING TECH DEBT**:
 * - [ ] No retry logic for HubSpot sync failures (tracked in Phase 5)
 *       Workaround: Failed syncs marked as `needs_sync` in database
 * - [ ] No performance monitoring for server action timing (tracked in Phase 4)
 *       Workaround: Sentry captures errors with context
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Features:**
 * - Distributed rate limiting via Upstash Redis (production) or in-memory fallback (development)
 * - Input sanitization to prevent XSS and injection attacks
 * - IP address hashing for privacy (SHA-256)
 * - Lead storage in Supabase and CRM sync to HubSpot
 *
 * **Security:**
 * - All user inputs sanitized with escapeHtml() before use
 * - IP addresses hashed before storage (never logged in plain text)
 * - Rate limits enforced per email address AND per IP address
 * - Payload size limited by middleware (1MB max)
 *
 * **Error Handling:**
 * - Validation errors return user-friendly messages
 * - Rate limit errors return "try again later" message
 * - Network/API errors logged to Sentry, return generic error message
 */

'use server'

export { submitContactForm } from './actions/submit'
