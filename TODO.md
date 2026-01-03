# TODO - Security Review Findings

> Last updated: 2026-01-03
> This file tracks security findings from security reviews and other quality/enhancement tasks.

## Security Tasks

### T-001: Enhance Sentry PII Redaction [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Status:** Open

**Description:**  
While Sentry is configured with `maskAllText: true` and `blockAllMedia: true` for session replays, the `beforeSend` hooks in both client and server configurations don't explicitly sanitize or redact PII from error contexts.

**Acceptance Criteria:**
- [ ] Add `beforeSend` sanitization to remove/redact email addresses from error contexts
- [ ] Add `beforeSend` sanitization to remove/redact phone numbers from error contexts
- [ ] Add `beforeSend` sanitization to remove/redact form data from error contexts
- [ ] Document which fields are automatically redacted in DECISIONS.md

**Files:**
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `lib/logger.ts` (ensure no sensitive data in context objects)

---

### T-002: Add Request Body Sanitization to Logger [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Status:** Open

**Description:**  
The logger utility doesn't explicitly prevent logging of sensitive fields from request bodies or headers. While the current code doesn't log request bodies, adding explicit sanitization provides defense-in-depth.

**Acceptance Criteria:**
- [ ] Add sanitization function to logger.ts that redacts common sensitive fields
- [ ] Redact fields: password, token, authorization, cookie, api_key, secret
- [ ] Apply sanitization to all context objects before logging
- [ ] Add unit tests for sanitization function

**Files:**
- `lib/logger.ts`

---

### T-003: Document Sensitive Data Retention Policy [P2] [SEC]
**Type:** COMPLETE  
**Priority:** P2  
**Category:** SEC (Security Documentation)  
**Status:** Open

**Description:**  
The application collects PII (name, email, phone, company, message) via the contact form but lacks a documented data retention policy for logs, form submissions, and error tracking.

**Acceptance Criteria:**
- [ ] Document retention period for contact form data (emails sent via Resend)
- [ ] Document retention period for Sentry error logs (if using paid plan)
- [ ] Document log rotation policy for production console logs
- [ ] Add retention policy to SECURITY.md or create DATA_RETENTION.md

**Files:**
- `SECURITY.md` or new `DATA_RETENTION.md`

---

### T-004: Add CSRF Token Support Documentation [P1] [SEC]
**Type:** COMPLETE  
**Priority:** P1  
**Category:** SEC (Security Enhancement)  
**Status:** Open

**Description:**  
The application uses Next.js server actions for form submission which provides some CSRF protection, but this isn't explicitly documented. The middleware sets security headers but doesn't include explicit CSRF token validation.

**Acceptance Criteria:**
- [ ] Document Next.js server action CSRF protections in SECURITY.md
- [ ] Verify SameSite cookie settings are configured appropriately
- [ ] Consider adding explicit CSRF tokens for enhanced protection in production
- [ ] Document any CSRF risks and mitigations in DECISIONS.md

**Files:**
- `SECURITY.md`
- `DECISIONS.md`
- `middleware.ts` (review and document cookie settings)

---

### T-005: Implement Production Console Log Suppression [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Status:** Open

**Description:**  
The analytics.ts file logs to console in development, but there's no explicit suppression of debug/info logs in production. Production logs should be minimal to avoid information leakage.

**Acceptance Criteria:**
- [ ] Review all `console.log()`, `console.info()`, `console.warn()` calls
- [ ] Ensure no console logging in production except for critical errors
- [ ] Add build-time log stripping or environment checks
- [ ] Document logging policy in SECURITY.md

**Files:**
- `lib/analytics.ts`
- `lib/logger.ts`
- All components with console statements

---

### T-006: Add Security Headers Documentation [P2] [SEC]
**Type:** COMPLETE  
**Priority:** P2  
**Category:** SEC (Security Documentation)  
**Status:** Open

**Description:**  
The middleware.ts implements comprehensive security headers, but the configuration rationale and trade-offs aren't documented. The CSP uses `'unsafe-inline'` and `'unsafe-eval'` which should be documented.

**Acceptance Criteria:**
- [ ] Document why `'unsafe-inline'` is needed for scripts and styles
- [ ] Document why `'unsafe-eval'` is needed (Next.js requirement)
- [ ] Add comments in middleware.ts explaining each header
- [ ] Document plan to tighten CSP in future (if feasible)
- [ ] Add security headers verification to deployment checklist

**Files:**
- `middleware.ts`
- `SECURITY.md`
- `DEPLOYMENT.md`

---

### T-007: Enhance Rate Limiting Implementation [P1] [SEC]
**Type:** ENHANCE  
**Priority:** P1  
**Category:** SEC (Security Enhancement)  
**Status:** Open

**Description:**  
The contact form uses in-memory rate limiting (3 submissions per hour per email) which resets on server restart and doesn't scale across multiple instances. This is acceptable for MVP but should be enhanced for production.

**Acceptance Criteria:**
- [ ] Document current rate limiting approach in DECISIONS.md
- [ ] For production deployment, implement persistent rate limiting (Redis, Upstash, or similar)
- [ ] Add rate limiting per IP address in addition to email
- [ ] Add rate limiting monitoring/alerting
- [ ] Document rate limiting configuration in DEPLOYMENT.md

**Files:**
- `lib/actions.ts`
- `DECISIONS.md`
- `DEPLOYMENT.md`

---

### T-DEP-001: Evaluate and Replace next-pwa [P2] [DEP]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DEP (Dependency Health)  
**Status:** Open

**Description:**  
The next-pwa@^5.6.0 package is outdated and no longer actively maintained. The last significant update was in 2022, and it may have compatibility issues with Next.js 14. PWA functionality is configured in next.config.mjs but may not be actively tested or used in production.

**Acceptance Criteria:**
- [ ] Evaluate if PWA features are actively used and needed
- [ ] If PWA is needed: migrate to @ducanh2912/next-pwa (maintained fork) or alternative
- [ ] If PWA is not needed: remove next-pwa and related configuration from next.config.mjs
- [ ] Test PWA functionality if keeping it (service worker registration, offline caching)
- [ ] Update documentation to reflect PWA status
- [ ] Document decision in DECISIONS.md

**Files:**
- `package.json`
- `next.config.mjs`
- `DECISIONS.md`

**References:**
- Identified in Dependency Health Review (2026-01-03)
- Original next-pwa: https://github.com/shadowwalker/next-pwa (archived)
- Maintained fork: https://github.com/DuCanh2k/next-pwa

---

### T-008: Review and Update Dependencies [P2] [SEC]
**Type:** QUALITY  
**Priority:** P2  
**Category:** SEC (Supply Chain Security)  
**Status:** Open

**Description:**  
Some dependencies are using caret (^) version ranges which could auto-update to versions with breaking changes or vulnerabilities. Consider more explicit version pinning for critical security dependencies.

**Acceptance Criteria:**
- [ ] Review security-critical dependencies: zod, @sentry/nextjs, resend, next
- [ ] Consider exact version pinning (no ^ or ~) for security-critical deps
- [x] Document dependency update cadence in DEPENDENCY_HEALTH.md.md
- [ ] Set up Dependabot or Renovate for automated security updates
- [ ] Add "npm audit" to CI/CD or pre-deployment checklist

**Files:**
- `package.json`
- `DEPENDENCY_HEALTH.md.md`

**Updates:**
- 2026-01-03: Dependency health review completed. Update policy now documented in DEPENDENCY_HEALTH.md.md

---

### T-009: Add Input Size Limits Enforcement [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Status:** Open

**Description:**  
While Zod schema defines max lengths for form fields, there's no explicit payload size limit at the HTTP level. Large payloads could be used for DoS attacks.

**Acceptance Criteria:**
- [ ] Add body size limit to API routes (e.g., 1MB max)
- [ ] Document size limits in API documentation
- [ ] Add proper error handling for oversized payloads
- [ ] Test with large payload to verify rejection

**Files:**
- `next.config.mjs` (add bodyParser size limit config)
- `lib/actions.ts`

---

### T-010: Verify Environment Variable Leakage Prevention [P2] [SEC]
**Type:** QUALITY  
**Priority:** P2  
**Category:** SEC (Security Verification)  
**Status:** Open

**Description:**  
Ensure that server-side environment variables (especially RESEND_API_KEY) are never exposed to the client bundle. Next.js should handle this automatically for non-NEXT_PUBLIC_ prefixed vars, but explicit verification is prudent.

**Acceptance Criteria:**
- [ ] Build production bundle and verify RESEND_API_KEY is not in client JS
- [ ] Use bundle analyzer to inspect client-side bundle
- [ ] Document environment variable naming convention in SECURITY.md
- [ ] Add build-time check to verify no secrets in client bundle

**Files:**
- `lib/env.ts`
- `SECURITY.md`

---

## Notes

### Security Review Context
These tasks were generated from the security review conducted on 2026-01-03 following the SECURITY_REVIEW.md.md framework. All findings represent hardening opportunities rather than critical exploitable vulnerabilities.

### Priority Definitions
- **P0 (Critical):** Exploitable security vulnerability requiring immediate remediation
- **P1 (High):** High-risk security issue or missing critical protection
- **P2 (Hardening):** Security best practice or defense-in-depth enhancement

### Type Definitions
- **COMPLETE:** Required functionality that is missing
- **ENHANCE:** Improvement to existing functionality
- **QUALITY:** Code quality, refactoring, or cleanup

### Category Codes
- **SEC:** Security-related task
