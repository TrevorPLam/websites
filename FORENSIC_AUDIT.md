# FORENSIC AUDIT REPORT
## Full-Spectrum Security & Quality Analysis

**Repository:** TrevorPLam/your-dedicated-marketer  
**Audit Date:** 2026-01-20  
**Auditor Role:** Paranoid Senior Staff Engineer & Security Auditor (25+ years production experience)  
**Methodology:** Assume unsafe until proven otherwise; enumerate ALL technically possible issues  

**Audit Scope:** ~5,292 lines of production code (TypeScript/TSX), Next.js 15 App Router, Cloudflare Pages deployment target  

---

## EXECUTIVE SUMMARY

**Total Issues Identified:** TBD (ongoing enumeration)  
**Critical Severity:** TBD  
**High Severity:** TBD  
**Medium Severity:** TBD  

**Primary Risk Vectors:**
1. Type system unsoundness (lax ESLint rules allow `any` types and type suppression)
2. In-memory rate limiter unsuitable for production (single-instance only)
3. CSP with `unsafe-inline` reduces XSS protection
4. HubSpot sync failures unrecoverable (no retry mechanism)
5. Missing CSRF protection on server actions
6. Dependency installation failures detected (UNMET DEPENDENCIES)

---

## DETAILED FINDINGS

### CATEGORY: Language & Type System

#### ISSUE #001: ESLint Allows `any` Type With Warning Only

**Category:** Maintainability / Future Risk  
**Severity:** Future Risk → Degradation  
**Confidence:** Certain  

**Exact Location:**
- File: `eslint.config.mjs`
- Line: 43
- Symbol: `@typescript-eslint/no-explicit-any`

**Current Configuration:**
```javascript
"@typescript-eslint/no-explicit-any": "warn"  // ← PROBLEM
```

**Failure Mode:**
Developers can commit code with `any` types that bypass TypeScript's type checking. The `any` type disables all type safety for that value, allowing runtime type errors that TypeScript should catch.

**How It Manifests in Production:**
1. Developer uses `any` type to bypass type error during development
2. ESLint shows warning but allows commit
3. Code ships to production with untyped values
4. Runtime type error occurs when incorrect type is passed
5. Application crashes or exhibits undefined behavior

**Example Scenario:**
```typescript
function processUser(user: any) {  // ← Warning ignored
  return user.profile.name.toUpperCase();  // ← Crashes if user.profile is undefined
}
```

**Why This Is Dangerous:**
- Defeats entire purpose of TypeScript type system
- Creates latent bugs that manifest at runtime
- Type errors become runtime errors (crash, data corruption, security bypass)
- Allows implicit type coercion vulnerabilities
- Makes refactoring dangerous (no compiler checks)

**Whether It Is Preventable by Automation:**
Yes - ESLint rule can be set to `"error"` instead of `"warn"` to block commits with `any` types.

**Recommended Guardrail:**
1. **Lint Rule (Immediate):** Change to `"@typescript-eslint/no-explicit-any": "error"`
2. **CI/CD (Immediate):** Run `npm run lint` in CI and fail on any errors
3. **Pre-commit Hook (Optional):** Block commits with lint errors locally

---

#### ISSUE #002: TypeScript Comment Suppression Too Lenient

**Category:** Maintainability / Future Risk  
**Severity:** Future Risk → Crash  
**Confidence:** Certain  

**Exact Location:**
- File: `eslint.config.mjs`
- Line: 44
- Symbol: `@typescript-eslint/ban-ts-comment`

**Current Configuration:**
```javascript
"@typescript-eslint/ban-ts-comment": "warn"  // ← PROBLEM
```

**Failure Mode:**
Developers can use `@ts-ignore`, `@ts-nocheck`, and `@ts-expect-error` comments to suppress TypeScript errors with only a warning. This allows code with known type errors to be committed and deployed.

**How It Manifests in Production:**
1. Developer encounters TypeScript error
2. Adds `@ts-ignore` comment to suppress it (only gets warning)
3. Underlying type error remains but is hidden
4. Code ships to production
5. Runtime error occurs at the suppressed location
6. Difficult to debug because type error was intentionally hidden

**Current Usage in Codebase:**
```bash
next.config.mjs:    // @ts-ignore - optional dependency for bundle analysis
__tests__/lib/analytics.test.ts:    // @ts-ignore (2 occurrences)
```

**Why This Is Dangerous:**
- Hides real type errors that should be fixed
- Creates technical debt (suppressed errors never get resolved)
- May hide security vulnerabilities (e.g., unsafe type casts)
- Makes codebase harder to refactor
- Normalizes ignoring type safety

**Whether It Is Preventable by Automation:**
Yes - ESLint rule can be set to `"error"` to block type suppression comments entirely, or can require explicit justification with `@ts-expect-error: <reason>`.

**Recommended Guardrail:**
1. **Lint Rule (Immediate):** Change to `"@typescript-eslint/ban-ts-comment": "error"`
2. **Alternative:** Allow only `@ts-expect-error` with mandatory description requirement
3. **Audit (Immediate):** Review all existing `@ts-ignore` usages and fix or document
4. **CI/CD (Immediate):** Fail builds on type suppression comments

---

#### ISSUE #003: Missing TypeScript `no-unsafe-*` Rules

**Category:** Maintainability / Security  
**Severity:** Future Risk → Data Loss  
**Confidence:** Highly Likely  

**Exact Location:**
- File: `eslint.config.mjs`
- Lines: 38-46 (rules section)
- Symbol: Missing rules configuration

**Failure Mode:**
ESLint is not configured to detect unsafe operations with `any` types, allowing dangerous operations that bypass type safety:
- `no-unsafe-assignment` - assigning `any` to typed variable
- `no-unsafe-call` - calling function with `any` type
- `no-unsafe-member-access` - accessing property on `any`
- `no-unsafe-return` - returning `any` from typed function

**How It Manifests in Production:**
```typescript
// Example: Undetected unsafe assignment
const data: any = await fetchUserData();  // API returns unexpected shape
const username: string = data.username;   // ← No error, but data.username might not exist
console.log(username.toUpperCase());      // ← Runtime crash
```

**Why This Is Dangerous:**
- Allows type system to be silently bypassed
- Runtime type mismatches cause crashes
- Can lead to security vulnerabilities (type confusion attacks)
- Data corruption from incorrect type assumptions
- Silent failures in production

**Whether It Is Preventable by Automation:**
Yes - Add these TypeScript ESLint rules to detect unsafe type operations.

**Recommended Guardrail:**
1. **Lint Rule (High Priority):** Add to `eslint.config.mjs`:
   ```javascript
   "@typescript-eslint/no-unsafe-assignment": "error",
   "@typescript-eslint/no-unsafe-call": "error",
   "@typescript-eslint/no-unsafe-member-access": "error",
   "@typescript-eslint/no-unsafe-return": "error"
   ```
2. **Test (After Adding):** Run `npm run lint` and fix all detected issues
3. **CI/CD:** Enforce in continuous integration

---

#### ISSUE #004: TypeScript `strict` Mode Not Explicitly Documented

**Category:** Maintainability  
**Severity:** Future Risk  
**Confidence:** Plausible  

**Exact Location:**
- File: `tsconfig.json`
- Line: 11
- Symbol: `"strict": true`

**Failure Mode:**
While `"strict": true` is enabled (which is good), it implicitly enables multiple sub-flags without documenting them explicitly. Future developers may not understand what's enabled, and partial disabling of strict mode features could happen unintentionally.

**Implicit Flags Enabled by `strict: true`:**
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

**Why This Is Dangerous:**
- Lack of explicit documentation obscures what protections are active
- Developers may not understand why certain code patterns are rejected
- Makes it easier to accidentally disable protections
- Onboarding documentation incomplete

**Whether It Is Preventable by Automation:**
Partially - Can document via comments or explicit flags, but cannot enforce explicit configuration.

**Recommended Guardrail:**
1. **Documentation (Low Priority):** Add comment to `tsconfig.json` listing implicit flags
2. **Alternative (Optional):** Explicitly list all strict flags for clarity
3. **Test:** Verify current behavior before any changes

---

### CATEGORY: Runtime & Execution

#### ISSUE #005: In-Memory Rate Limiter Not Production-Safe

**Category:** Ops / Security  
**Severity:** Exploit  
**Confidence:** Certain  

**Exact Location:**
- File: `lib/actions.ts`
- Lines: 100, 348-369
- Symbol: `rateLimitMap`, `checkRateLimitInMemory()`

**Current Implementation:**
```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimitInMemory(identifier: string): boolean {
  // Fixed window, single-instance only
  // ...
}
```

**Failure Mode:**
The in-memory Map-based rate limiter only works for single-instance deployments. In production with multiple instances (horizontal scaling), each instance maintains its own separate Map, allowing attackers to bypass rate limits by distributing requests across instances.

**How It Manifests in Production:**
1. Application deployed with 3 instances for load balancing
2. Rate limit set to 3 requests/hour per email
3. Attacker sends 3 requests to each instance (9 total)
4. Each instance's Map shows only 3 requests
5. All requests pass rate limit check
6. Attacker successfully bypasses 3x intended limit

**Attack Scenario:**
```
Load Balancer
├── Instance 1: rateLimitMap shows user@example.com = 3 requests ✓
├── Instance 2: rateLimitMap shows user@example.com = 3 requests ✓
└── Instance 3: rateLimitMap shows user@example.com = 3 requests ✓
Total: 9 requests (300% of intended limit)
```

**Why This Is Dangerous:**
- Allows spam/abuse at 3x-10x intended rate (depending on instance count)
- Database/CRM can be overwhelmed with fake leads
- Costs increase (storage, CRM operations, email processing)
- Legitimate users may face performance degradation
- Attackers can exhaust resources

**Whether It Is Preventable by Automation:**
Yes - Code includes proper Upstash Redis integration but falls back to in-memory. Can detect at deployment time if Redis is not configured.

**Recommended Guardrail:**
1. **Config Validation (Immediate):** Add startup check that fails if Redis not configured in production
2. **Deployment (Immediate):** Ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in production
3. **Monitoring (High Priority):** Alert if in-memory fallback is ever used in production
4. **Code (Optional):** Remove in-memory fallback entirely, force Redis requirement

---

#### ISSUE #006: Unhandled Promise Rejections Potential

**Category:** Bug / Ops  
**Severity:** Crash  
**Confidence:** Plausible  

**Exact Location:**
- File: `lib/actions.ts`
- Lines: 163-184, 186-196, 198-248 (async fetch operations)
- Symbol: `insertLead()`, `updateLead()`, `upsertHubSpotContact()`

**Failure Mode:**
Multiple async fetch operations to external services (Supabase, HubSpot) can throw network errors, timeout errors, or receive unexpected responses. While the main `submitContactForm` function has try-catch, the helper functions throw errors that may not be properly handled in all code paths.

**Potential Crash Vectors:**
1. **Network timeout:** Fetch to Supabase/HubSpot hangs indefinitely (no timeout configured)
2. **DNS resolution failure:** External service unavailable
3. **Unexpected response format:** JSON parsing fails if API returns HTML error page
4. **Connection pool exhaustion:** Too many concurrent requests

**Example Vulnerable Code:**
```typescript
async function insertLead(payload: Record<string, unknown>): Promise<SupabaseLeadRow> {
  const response = await fetch(getSupabaseRestUrl(), {
    method: 'POST',
    // ← NO TIMEOUT SET
    headers: {
      ...getSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify([payload]),
  })
  // ← If fetch throws (network error), no handling here
}
```

**How It Manifests in Production:**
1. Supabase service experiences temporary outage
2. User submits contact form
3. Fetch to Supabase throws network error or times out
4. Error propagates to submitContactForm try-catch
5. Generic error returned to user: "Something went wrong"
6. BUT: No lead captured, no retry attempted, data lost
7. Worse: If error is unhandled promise rejection, may crash Node process

**Why This Is Dangerous:**
- Lost customer leads (business impact)
- Poor user experience (form submission appears to fail)
- Potential Node.js process crash on unhandled rejection
- No visibility into failure rate or patterns
- No automatic retry mechanism

**Whether It Is Preventable by Automation:**
Partially - Can add timeout configuration and better error handling. Cannot fully prevent external service failures.

**Recommended Guardrail:**
1. **Timeout (High Priority):** Add fetch timeout (10-30 seconds) using `AbortSignal`
2. **Retry Logic (Medium Priority):** Implement exponential backoff for transient failures
3. **Monitoring (High Priority):** Log all API failures to Sentry with structured data
4. **Circuit Breaker (Optional):** Stop calling external service after N consecutive failures
5. **Graceful Degradation (Optional):** Queue failed submissions for later retry

---

#### ISSUE #007: Memory Leak in Rate Limit Map

**Category:** Perf / Ops  
**Severity:** Degradation  
**Confidence:** Certain  

**Exact Location:**
- File: `lib/actions.ts`
- Lines: 100, 348-369
- Symbol: `rateLimitMap`

**Failure Mode:**
The in-memory `rateLimitMap` grows unbounded over time. While it cleans up expired entries when they're accessed again, entries for identifiers that are never re-accessed remain in memory forever.

**Memory Leak Pattern:**
```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimitInMemory(identifier: string): boolean {
  // Cleanup only happens if identifier is accessed again
  if (limit && now > limit.resetAt) {
    rateLimitMap.delete(identifier)  // ← Only runs for ACCESSED identifiers
  }
  // ...
}
```

**How It Manifests in Production:**
1. Application receives 1000 unique email submissions over 1 week
2. Each email creates a Map entry
3. Only repeat submissions trigger cleanup
4. 90% of users submit only once (900 entries never cleaned up)
5. After 1 month: ~3,600 stale entries in memory
6. After 1 year: ~43,000 stale entries
7. Memory usage grows linearly with unique identifiers
8. Eventually: Out of memory error, process crash

**Memory Growth Calculation:**
- Average entry size: ~200 bytes (identifier + metadata)
- 10,000 stale entries = 2 MB
- 100,000 stale entries = 20 MB
- 1,000,000 stale entries = 200 MB

**Why This Is Dangerous:**
- Memory exhaustion crashes Node.js process
- Performance degradation as Map grows (O(n) cleanup operations)
- Affects all tenants in multi-tenant deployment
- Difficult to debug (gradual degradation over weeks/months)

**Whether It Is Preventable by Automation:**
Yes - Can add periodic cleanup or use LRU cache with size limit.

**Recommended Guardrail:**
1. **Immediate Fix:** Add periodic cleanup interval (every 5-10 minutes)
   ```typescript
   setInterval(() => {
     const now = Date.now();
     for (const [key, value] of rateLimitMap.entries()) {
       if (now > value.resetAt) {
         rateLimitMap.delete(key);
       }
     }
   }, 5 * 60 * 1000); // 5 minutes
   ```
2. **Better Solution:** Use LRU cache library with max size
3. **Best Solution:** Use Redis (already implemented as fallback)
4. **Monitoring:** Track Map size in metrics/logs

---

#### ISSUE #008: Race Condition in Rate Limiter Initialization

**Category:** Bug  
**Severity:** Degradation  
**Confidence:** Plausible  

**Exact Location:**
- File: `lib/actions.ts`
- Lines: 87-94, 293-330
- Symbol: `rateLimiter`, `getRateLimiter()`

**Failure Mode:**
The `rateLimiter` variable is initialized on first access via `getRateLimiter()`. If multiple requests arrive simultaneously before initialization completes, race condition can occur:

1. Request A calls `getRateLimiter()`, sees `rateLimiter === null`, starts initialization
2. Request B calls `getRateLimiter()`, sees `rateLimiter === null`, starts ANOTHER initialization
3. Both requests create separate Upstash Redis clients
4. One overwrites the other, causing connection leaks

**Current Code:**
```typescript
let rateLimiter: RateLimiter | null | false = null

async function getRateLimiter() {
  if (rateLimiter !== null) {  // ← CHECK
    return rateLimiter
  }
  // ← GAP: Multiple concurrent requests can pass check
  
  // Dynamic import and initialization
  rateLimiter = new Ratelimit({ ... })  // ← SET
  return rateLimiter
}
```

**Race Condition Timeline:**
```
Time  | Request A                  | Request B
------|----------------------------|---------------------------
T0    | Check: rateLimiter === null | 
T1    | Start async import         | Check: rateLimiter === null
T2    | Create Redis client        | Start async import
T3    | Set rateLimiter = client A | Create Redis client
T4    |                            | Set rateLimiter = client B (overwrites A)
```

**Why This Is Dangerous:**
- Connection leak (client A is orphaned but connection remains open)
- Resource exhaustion (multiple Redis connections)
- Unpredictable behavior (which client wins is timing-dependent)
- Difficult to reproduce (only happens under high concurrency)

**Whether It Is Preventable by Automation:**
Yes - Use proper async initialization pattern with Promise or lock.

**Recommended Guardrail:**
1. **Code Fix (Medium Priority):** Use Promise-based initialization:
   ```typescript
   let rateLimiterPromise: Promise<RateLimiter | null> | null = null
   
   async function getRateLimiter() {
     if (!rateLimiterPromise) {
       rateLimiterPromise = initializeRateLimiter()
     }
     return rateLimiterPromise
   }
   ```
2. **Test:** Add concurrent request test to verify no race
3. **Alternative:** Initialize at module load time (not lazy)

---

### CATEGORY: Security

#### ISSUE #009: Content Security Policy Uses `unsafe-inline`

**Category:** Security  
**Severity:** Exploit (XSS)  
**Confidence:** Certain  

**Exact Location:**
- File: `middleware.ts`
- Lines: 160-180
- Symbol: CSP header `script-src` and `style-src` directives

**Current Configuration:**
```javascript
"script-src 'self' 'unsafe-inline'"
"style-src 'self' 'unsafe-inline'"
```

**Failure Mode:**
CSP `unsafe-inline` allows execution of inline `<script>` tags and inline `onclick` handlers. While all user input is sanitized with `escapeHtml()`, this directive weakens defense-in-depth:

1. If sanitization is bypassed (bug in escapeHtml or new input vector)
2. Inline script injection becomes possible
3. XSS attack succeeds despite CSP being present

**Why `unsafe-inline` Is Required:**
- Next.js injects inline scripts for hydration
- Tailwind generates inline styles at runtime

**XSS Attack Vector (if sanitization fails):**
```typescript
// If escapeHtml has a bug or is not applied:
const userInput = '<script>alert(document.cookie)</script>'
// With unsafe-inline: script executes
// Without unsafe-inline: script blocked by CSP
```

**Why This Is Dangerous:**
- Reduces effectiveness of CSP (primary XSS defense)
- Single point of failure (sanitization must be perfect)
- New input vectors may bypass sanitization
- Third-party dependencies could introduce XSS

**Whether It Is Preventable by Automation:**
Partially - Can migrate to nonce-based CSP, but requires significant refactoring.

**Recommended Guardrail:**
1. **Documentation (Immediate):** Already well-documented in middleware.ts (✓)
2. **Hardening (Long-term):** Migrate to nonce-based CSP:
   - Generate random nonce per request
   - Add nonce to all inline scripts
   - Replace `unsafe-inline` with `nonce-{random}`
3. **Testing (Immediate):** Comprehensive XSS testing of all input fields
4. **Monitoring (High Priority):** CSP violation reporting to Sentry

---

#### ISSUE #010: No CSRF Protection on Server Actions

**Category:** Security  
**Severity:** Exploit  
**Confidence:** Highly Likely  

**Exact Location:**
- File: `lib/actions.ts`
- Line: 67 (`'use server'`)
- Symbol: `submitContactForm()` server action

**Failure Mode:**
Next.js server actions do not have built-in CSRF protection. An attacker can create a malicious website that submits the contact form on behalf of a victim who visits the attacker's site while logged into your site (or just visits it):

**Attack Scenario:**
1. Victim visits attacker's website `evil.com`
2. Attacker's page contains hidden form that calls `submitContactForm()`
3. Form auto-submits without victim interaction
4. Request goes to your server with victim's IP address
5. Lead is created with attacker-controlled data
6. Victim's IP gets rate-limited
7. Attacker can spam your CRM with fake leads

**Example Attack Code:**
```html
<!-- On attacker's website -->
<form id="csrf-attack" style="display:none">
  <input name="name" value="Spam Name">
  <input name="email" value="spam@example.com">
  <input name="message" value="Spam message">
</form>
<script>
  // Call your server action from attacker's domain
  submitContactForm({
    name: "Spam",
    email: "spam@example.com", 
    message: "Spam"
  });
</script>
```

**Why This Is Dangerous:**
- Allows cross-site form submission attacks
- Attacker can submit unlimited forms using victims' browsers
- Bypasses same-origin policy for server actions
- Can be used for:
  - CRM spam/pollution
  - Rate limit exhaustion of victim IPs
  - Resource consumption (database, CRM, emails)
  - Reputation damage (fake leads appear real)

**Current Mitigations (Insufficient):**
- ✓ Rate limiting (per email/IP) - helps but doesn't prevent initial attack
- ✓ Input validation - doesn't prevent CSRF
- ✗ No CSRF token verification
- ✗ No origin/referer checking

**Whether It Is Preventable by Automation:**
Yes - Add CSRF token validation or origin checking.

**Recommended Guardrail:**
1. **Origin Check (Medium Priority):** Verify request origin header:
   ```typescript
   const origin = headers().get('origin')
   const host = headers().get('host')
   if (origin && !origin.includes(host)) {
     return { success: false, message: 'Invalid request origin' }
   }
   ```
2. **CSRF Token (Better):** Implement CSRF token validation
3. **Rate Limiting (Current):** Already implemented, provides some protection
4. **Honeypot (Current):** Already implemented, catches simple bots

---

#### ISSUE #011: IP Address Header Spoofing Vulnerability

**Category:** Security  
**Severity:** Exploit  
**Confidence:** Highly Likely  

**Exact Location:**
- File: `lib/actions.ts`
- Lines: 263-276
- Symbol: `getClientIp()`

**Current Implementation:**
```typescript
async function getClientIp(): Promise<string> {
  const requestHeaders = await headers()
  const forwardedFor =
    requestHeaders.get('x-forwarded-for') ||
    requestHeaders.get('x-vercel-forwarded-for') ||
    requestHeaders.get('x-real-ip') ||
    requestHeaders.get('cf-connecting-ip')
  
  if (!forwardedFor) {
    return 'unknown'
  }
  
  return forwardedFor.split(',')[0]?.trim() || 'unknown'
}
```

**Failure Mode:**
The function trusts HTTP headers to determine client IP address. These headers can be spoofed by attackers to bypass rate limiting:

**Attack Scenario:**
1. Attacker sends requests with fake `X-Forwarded-For` header
2. Each request uses different fake IP address
3. IP-based rate limiting sees different IP each time
4. Attacker bypasses rate limit completely
5. Only email-based rate limit remains (easier to generate fake emails)

**Example Attack:**
```bash
# Request 1
curl -H "X-Forwarded-For: 1.2.3.4" ...

# Request 2  
curl -H "X-Forwarded-For: 5.6.7.8" ...

# Request 3
curl -H "X-Forwarded-For: 9.10.11.12" ...

# Each appears as different IP, bypassing rate limit
```

**Why This Is Dangerous:**
- Allows complete bypass of IP-based rate limiting
- Reduces dual rate limiting to single rate limiting (email only)
- Attacker can generate unlimited fake email addresses
- Opens door to spam/abuse at scale
- Can be used to frame innocent IP addresses for attacks

**Deployment Context:**
The vulnerability severity depends on deployment environment:
- **Behind Cloudflare/Vercel:** Headers are set by trusted proxy (safer)
- **Direct to origin:** Headers can be spoofed (vulnerable)
- **Mixed deployment:** Depends on route configuration

**Current Code Checks Multiple Headers (Good):**
- `x-forwarded-for` - Standard proxy header
- `x-vercel-forwarded-for` - Vercel-specific  
- `x-real-ip` - Nginx
- `cf-connecting-ip` - Cloudflare

**But:** No validation that headers come from trusted proxy!

**Whether It Is Preventable by Automation:**
Yes - Validate that request comes from trusted proxy before trusting headers.

**Recommended Guardrail:**
1. **Validation (High Priority):** Only trust headers when request comes from known proxy IPs
2. **Cloudflare (If Used):** Use `CF-Connecting-IP` exclusively (Cloudflare-guaranteed)
3. **Vercel (If Used):** Use `x-vercel-forwarded-for` exclusively (Vercel-guaranteed)
4. **Documentation:** Document which headers are trusted in which environments
5. **Configuration:** Add environment variable for trusted proxy configuration

---

#### ISSUE #012: Secrets Logging Risk in Error Paths

**Category:** Security  
**Severity:** Data Loss (secret exposure)  
**Confidence:** Plausible  

**Exact Location:**
- File: `lib/actions.ts`
- Lines: 173-176, 194-195, 244-245, 536-537, 543-544, 556-557
- Symbol: Error handling blocks that call `logError()`

**Failure Mode:**
When API calls to Supabase or HubSpot fail, error objects are passed to `logError()`. These error objects may contain:
- Request headers (including Authorization tokens)
- Request/response bodies (including API keys)
- Stack traces with environment variables

**Vulnerable Code Pattern:**
```typescript
if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Supabase insert failed with status ${response.status}: ${errorText}`)
}
// ← Error object may contain sensitive data

catch (syncError) {
  logError('HubSpot sync failed', syncError)  // ← May log secrets
}
```

**Potential Leaked Data:**
1. **Authorization headers:** `Bearer sk_test_...` (HubSpot token)
2. **API keys:** Supabase service role key
3. **Error responses:** May include sensitive user data
4. **Stack traces:** May expose file paths, env vars, internal structure

**Why This Is Dangerous:**
- Secrets exposed in logs (Sentry, console, log files)
- Logs may be accessible to unauthorized personnel
- Logs may be stored in insecure locations
- Compliance violations (GDPR, PCI-DSS)
- Secrets can be used to access systems directly

**Current Mitigation:**
- `lib/logger.ts` has `sanitizeSensitiveData()` function
- `lib/sentry-sanitize.ts` redacts known patterns

**But:** May not catch all cases, especially dynamic keys or new patterns.

**Whether It Is Preventable by Automation:**
Partially - Sanitization functions help but cannot guarantee complete coverage.

**Recommended Guardrail:**
1. **Review (Immediate):** Audit all `logError()` calls for potential secret exposure
2. **Sanitization (High Priority):** Enhance sanitize functions to catch:
   - Bearer tokens
   - API keys (Supabase, HubSpot)
   - Authorization headers
3. **Structured Logging:** Use structured error format that excludes sensitive fields
4. **Testing:** Add unit tests for secret sanitization
5. **Static Analysis:** Add rule to detect logging of raw error objects

---


#### ISSUE #013: Phone Field Validation Contradiction

**Category:** Bug  
**Severity:** Degradation  
**Confidence:** Certain  

**Exact Location:**
- File: `lib/contact-form-schema.ts`
- Line: 8
- Symbol: `phone` field schema

**Current Definition:**
```typescript
phone: z.string().trim().min(1, 'Phone number is required').max(50).optional(),
```

**Failure Mode:**
The phone field is defined as `.optional()` but also has `.min(1)` with error message "Phone number is required". This is contradictory:
- `.optional()` means the field can be undefined/omitted
- `.min(1, 'Phone number is required')` suggests it's required

**How It Manifests:**
1. User submits form without phone number
2. Zod validation passes (field is optional)
3. UI shows phone as "required" (marked with asterisk in ContactForm.tsx line 216)
4. Confusion: is phone required or not?

**Current Behavior:**
- Phone IS optional (empty submission allowed)
- But UI and error message SAY it's required
- Mixed signals cause user confusion

**Why This Is Dangerous:**
- User experience degradation (confusing validation)
- May lose legitimate leads (users think phone is required when it's not)
- May collect incomplete data (users skip optional field thinking it's required)
- Contradicts UI contract (required asterisk displayed)

**Whether It Is Preventable by Automation:**
Yes - Schema validation tests would catch this discrepancy.

**Recommended Guardrail:**
1. **Decision:** Clarify business requirement - is phone required or optional?
2. **If Required:** Remove `.optional()`, keep `.min(1)`
3. **If Optional:** Remove `.min(1)` error, change message to "Phone number must be valid if provided"
4. **UI Consistency:** Update ContactForm.tsx `required` prop to match schema
5. **Test:** Add validation test for phone field edge cases

---

#### ISSUE #014: OG Image Route Has No Rate Limiting

**Category:** Ops / Security  
**Severity:** Degradation  
**Confidence:** Certain  

**Exact Location:**
- File: `app/api/og/route.tsx`
- Lines: 31-46
- Symbol: `GET` function

**Failure Mode:**
The `/api/og` endpoint generates OG (Open Graph) images dynamically but has no rate limiting. Attackers can:
1. Request thousands of unique OG images (different title/description params)
2. Each request triggers server-side image rendering
3. CPU exhaustion from image generation
4. Memory exhaustion from concurrent requests
5. Denial of service for legitimate users

**Attack Example:**
```bash
# Generate 10,000 unique requests
for i in {1..10000}; do
  curl "https://site.com/api/og?title=Attack${i}&description=Spam${i}" &
done
# Each generates new image, consuming CPU/memory
```

**Resource Consumption:**
- Image generation is CPU-intensive (canvas rendering)
- Each response is ~100KB (OG image size)
- 1000 concurrent requests = 100MB memory + high CPU
- Runs on Edge runtime (limited resources)

**Why This Is Dangerous:**
- Denial of service attack vector
- Resource exhaustion costs (Cloudflare/Vercel billing)
- Degrades performance for legitimate traffic
- Easy to exploit (simple GET requests)
- No authentication required

**Current Mitigation:**
- ❌ No rate limiting
- ✓ Input validation (Zod schema limits title/description length)
- ✓ Edge runtime (isolated, can't crash main server)
- ✓ Parameters sanitized with escapeHtml()

**Whether It Is Preventable by Automation:**
Yes - Add rate limiting to API route.

**Recommended Guardrail:**
1. **Rate Limiting (High Priority):** Add per-IP rate limit (e.g., 60 requests/minute)
2. **Caching (High Priority):** Cache generated images by parameters (CDN or memory)
3. **Monitoring (Medium Priority):** Alert on high request rate to this endpoint
4. **Alternative:** Pre-generate OG images at build time for known pages

---

