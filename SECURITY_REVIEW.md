SECURITY_REVIEW.md

---

# SECURITY REVIEW

Precedence: CODEBASECONSTITUTION.md → READMEAI.md → specs/* → this document.

Purpose: maintain a practical security baseline for an AI-built codebase without requiring scripts, scanners, or CI. This is a repeatable review checklist that produces concrete TODO.md tasks when gaps exist.

What this is:

* A lightweight, recurring security checklist focused on the most common real-world failures.

What this is not:

* A formal pen test
* A compliance certification
* A replacement for professional review on high-stakes systems

Primary outputs:

* Security findings converted into TODO.md tasks (Type: QUALITY or COMPLETE or ENHANCE with SEC category)
* Optional updates to DECISIONS.md when security tradeoffs are chosen
* Optional updates to docs if behavior/requirements change

Hard rule:

* No security findings stay buried in docs or code comments. They become tasks with acceptance criteria.
---

## AGENT EXECUTION PROMPT (RUN THIS EXACTLY)

You are a security review agent operating inside this repository.

Constraints:

* Assume the repo owner does not run scripts and does not use GitHub Actions.
* Prefer review methods that can be done by reading code/config and using the deployed preview (if available).
* When you find a gap, create a concrete task in TODO.md:

  * Priority: P0 for critical exploitable issues; P1 for high-risk; P2 for hardening
  * Type: QUALITY if refactor/cleanup; COMPLETE if required behavior is missing; ENHANCE if hardening
  * Include acceptance criteria and file references.

Deliverables:

1. A “Security Review Summary” section appended to the bottom of this file (date + results).
2. TODO.md updates for all findings (no exceptions).
3. If applicable, updates to env.example to document required env vars safely (placeholders only).

⠀
Stop conditions:

* If you identify a likely secret committed to the repo, treat as P0 and prioritize remediation steps immediately (rotate key, remove secret, document).
---

## Severity Rules (Use These)

P0 (Critical):

* secrets committed or exposed
* auth bypass or missing authorization checks
* payment or sensitive data integrity failure
* arbitrary code execution / injection vectors
* IDOR (insecure direct object reference) on sensitive objects

P1 (High):

* weak session handling, missing CSRF protections where needed
* overly verbose error messages leaking internals
* missing rate limits on sensitive endpoints
* unsafe file upload handling
* missing input validation on key fields

P2 (Hardening):

* security headers, best-practice defaults
* dependency hygiene improvements
* logging redaction improvements
* least privilege improvements
* improved audit trails
---

## Phase 1 — Secrets & Sensitive Data (Most Important)

1. Confirm no secrets are stored in repo

2. Check common locations:

⠀
* .env, .env.*, env.example
* README*, docs, config files
* code constants, “API_KEY=”
* JSON credentials, private keys, PEM files

If any real secret is found:

* Create P0 tasks:

  * rotate/revoke the secret
  * remove it from history if necessary
  * replace with env var references
  * update env.example with placeholder

1. Logging safety

2. Check for logs that might leak:

⠀
* tokens, cookies, auth headers
* full request bodies containing PII
* payment details

Task rule:

* Add a task to redact or avoid logging sensitive fields.

Acceptance criteria examples:

* “No logs include Authorization headers or session tokens”
* “PII fields are masked/redacted in logs”
---

## Phase 2 — Authentication & Authorization

1. Authentication present and consistent (if app uses auth)

⠀
* Is there a single auth mechanism (not multiple half-implemented ones)?
* Are session/token lifetimes defined?
* Is logout implemented correctly?

1. Authorization (most common failure)

2. For any data access or mutation:

⠀
* Confirm there is an authorization check:

  * tenant isolation (if multi-tenant)
  * role permissions (admin/user)
  * ownership checks (“can this user access this object?”)

Look specifically for IDOR:

* routes like /resource/:id without checking ownership/tenant

If missing:

* P0 tasks with explicit acceptance criteria:

  * “User cannot access objects outside their tenant even with direct ID guessing”
  * “Server enforces access; UI-only checks not relied upon”

1. CSRF (if cookies + state-changing requests)

⠀
* If using cookie-based auth:

  * confirm CSRF protections exist or architecture avoids CSRF risk (e.g., same-site strict + token)
* If unclear, create a P1 task to document and enforce.
---

## Phase 3 — Input Validation & Injection Risks

1. Validate all external inputs

2. Targets:

⠀
* form inputs
* query params
* JSON payloads
* webhook payloads
* file uploads
* redirects/URLs

1. Injection vectors checklist

⠀
* SQL injection (if raw queries exist)
* command injection (shell execution)
* XSS (rendering user-controlled HTML)
* SSRF (server fetching user-provided URLs)
* open redirect (redirect URL is user-controlled)

If any “direct string concatenation” to queries/commands/HTML is found:

* Create P0/P1 tasks depending on exploitability.

Acceptance criteria examples:

* “All API routes validate request schema before processing”
* “User input is escaped/encoded when rendered”
* “Server-side fetch only allows allowlisted domains”
---

## Phase 4 — External Integrations (Stripe, OAuth, Webhooks, etc.)

1. Webhooks

⠀
* Verify signature validation exists (Stripe webhook signature, etc.)
* Ensure idempotency (duplicate webhook events don’t double-apply effects)
* Ensure webhook handler does not log sensitive payloads

1. OAuth / third-party tokens

⠀
* Tokens stored securely (server-side, not in client localStorage unless architecture demands)
* Refresh token handling documented
* Scopes minimized

1. Payment safety (if applicable)

⠀
* Never store card numbers/CVV
* Use provider tokens
* Confirm “double charge” prevention (idempotency keys / dedupe)

Missing signature validation or idempotency in payments/webhooks is typically P0.

---

## Phase 5 — Data Protection & Privacy Basics

1. Identify sensitive data categories used in app

⠀
* PII (name, email, phone)
* financial data
* credentials/tokens
* business confidential data

1. Storage rules

⠀
* Sensitive data should not be stored unnecessarily
* If stored, encryption-at-rest depends on platform; document assumptions
* Access should be least privilege

1. Client-side storage

⠀
* Avoid storing tokens in localStorage when possible
* Avoid storing sensitive user data in the browser persistently

1. Data retention

⠀
* If you keep logs or user data, document retention defaults
* If not decided, create a P2 hardening task to define retention
---

## Phase 6 — Dependency & Supply Chain Hygiene (No tools required)

1. Quick dependency sanity

2. By inspection:

⠀
* Are there obviously abandoned libs?
* Are there “random” one-off deps used for trivial tasks?
* Are there duplicate libs (two date libs, etc.)?

1. Pinning policy

⠀
* Lockfile present
* Avoid “latest” without reason

Create P2 tasks:

* reduce dependency sprawl
* replace questionable deps
* document update cadence in DEPENDENCY_HEALTH.md (if present)
---

## Phase 7 — Deployment & Runtime Hardening (Doc-only)

Even without configuring headers/infra today, document what “good” looks like.

Checklist:

* HTTPS only (platform default typically)
* security headers (CSP, HSTS, X-Frame-Options, etc.) where feasible
* error pages don’t leak stack traces
* environment separation (dev/staging/prod)

If lacking:

* Create P2 tasks (or P1 if real leakage exists).
---

## Required Output: Security Review Summary (Append Below)

When you complete a review, append:

## Security Review Summary — YYYY-MM-DD

## Scope reviewed:

Top findings:

* (P0) …
* (P1) …
* (P2) …

* Tasks created:
* T-### …

* Notes / assumptions:
---

## Security Review Summary — 2026-01-03

### Scope Reviewed

Complete security review of Next.js 14 marketing website covering all 7 phases:
- Secrets & sensitive data handling
- Authentication & authorization (limited scope - no auth system)
- Input validation & injection risks
- External integrations (Resend email service)
- Data protection & privacy
- Dependency hygiene
- Deployment & runtime hardening

**Codebase Statistics:**
- 40+ TypeScript/TSX files reviewed
- Key security files: `lib/actions.ts`, `lib/sanitize.ts`, `lib/env.ts`, `lib/logger.ts`, `middleware.ts`, Sentry configs
- Security implementations: Input sanitization, rate limiting, security headers, environment validation

### Top Findings

**No P0 (Critical) Issues Found** ✓
- No secrets committed to repository
- No authentication bypass (no auth system present)
- No SQL injection (no database)
- No arbitrary code execution vectors identified
- All secrets properly managed via environment variables

**P1 (High Priority) Findings:**
- **(P1) T-004:** CSRF protection relies on Next.js server actions without explicit documentation or token validation
- **(P1) T-007:** Rate limiting uses in-memory storage, not suitable for production multi-instance deployments

**P2 (Hardening) Findings:**
- **(P2) T-001:** Sentry error tracking lacks explicit PII redaction in `beforeSend` hooks
- **(P2) T-002:** Logger utility doesn't explicitly sanitize sensitive fields from contexts
- **(P2) T-003:** No documented data retention policy for PII collected via contact form
- **(P2) T-005:** Production console logging not explicitly suppressed
- **(P2) T-006:** Security headers well-implemented but CSP trade-offs (unsafe-inline/eval) not documented
- **(P2) T-008:** Dependency version pinning uses caret ranges; consider exact versions for security-critical deps
- **(P2) T-009:** No HTTP-level payload size limits to prevent DoS via large requests
- **(P2) T-010:** Environment variable separation not explicitly verified (should be automatic with Next.js)

### Tasks Created

All findings documented in TODO.md with detailed acceptance criteria:
- **T-001** through **T-010** (10 tasks total)
- 2 P1 tasks, 8 P2 tasks
- All tagged with [SEC] category
- Each task includes affected files, acceptance criteria, and remediation guidance

### Positive Security Findings

**Strong Security Practices Observed:**
1. ✅ **Input Sanitization:** Comprehensive XSS prevention using `escapeHtml()` and `sanitizeEmailSubject()` functions
2. ✅ **Input Validation:** Zod schema validation with strict field length limits and type checking
3. ✅ **Security Headers:** Excellent middleware implementation with CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.
4. ✅ **Environment Variable Management:** Proper use of `NEXT_PUBLIC_` prefix, validation with Zod, no secrets in code
5. ✅ **Rate Limiting:** Basic rate limiting implemented (3 submissions/hour/email) - suitable for MVP
6. ✅ **Error Handling:** Proper error handling with Sentry integration, generic error messages to users
7. ✅ **Structured Data Safety:** All `dangerouslySetInnerHTML` usage limited to JSON-LD structured data (safe)
8. ✅ **Logging Discipline:** No sensitive data (passwords, tokens, keys) logged in current code
9. ✅ **No Database:** Static site generation eliminates entire class of SQL injection and data breach risks
10. ✅ **Email Injection Prevention:** Contact form sanitizes email subjects to prevent header injection

**Architecture Security Benefits:**
- Static site generation (SSG) minimizes attack surface
- No authentication system = no auth vulnerabilities
- No payment processing = no PCI compliance concerns
- No file uploads = no upload vulnerabilities
- No webhooks = no signature validation concerns
- Server actions provide automatic CSRF protection via Next.js

### Notes / Assumptions

**Deployment Context:**
- Assumes deployment to modern platform with HTTPS by default (Vercel, Cloudflare Pages, etc.)
- Assumes single-instance deployment or platform-provided rate limiting for MVP
- Production deployment should address T-007 (persistent rate limiting) for scalability

**Risk Assessment:**
- Overall risk level: **LOW**
- Application is a marketing website with minimal user interaction (contact form only)
- No authentication, no sensitive transactions, no database, no file uploads
- Primary risks are information disclosure via logs and potential DoS via form abuse
- All identified findings are hardening opportunities, not exploitable vulnerabilities

**Architecture Decisions:**
- Next.js Server Actions used instead of API routes (provides built-in CSRF protection)
- Resend used for transactional email (trusted third-party, API key properly secured)
- Sentry for error tracking (should enhance PII redaction per T-001)
- In-memory rate limiting acceptable for MVP (should upgrade for production scale per T-007)

**Testing Performed:**
- Code review of all security-relevant files
- Secret scanning across repository (git history, current files)
- Input validation review (Zod schemas)
- Header configuration review
- Dependency analysis
- Logging and error handling review

**Out of Scope:**
- Penetration testing (not performed)
- Dependency vulnerability scanning with automated tools (manual review only)
- Infrastructure security (delegated to hosting platform)
- Client-side bundle analysis (recommended in T-010)
- DDoS mitigation (platform responsibility)

**Recommendations for Production:**
1. Implement T-004 and T-007 (P1 tasks) before high-traffic launch
2. Set up automated dependency scanning (Dependabot, Snyk, or npm audit in CI/CD)
3. Consider professional security review if handling payments or auth in future
4. Monitor rate limit effectiveness and adjust thresholds based on actual traffic
5. Implement proper production logging infrastructure with retention policies

**Next Review:**
- Recommended after any major feature additions (authentication, payments, user accounts)
- Or quarterly for ongoing maintenance and dependency updates
- Or immediately if any P0/P1 issues arise from external reports

---