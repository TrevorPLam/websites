# REFACTOR PLAN: Transform to Best-in-Class Production System
## From Audit to Elite Codebase

**Date:** 2026-01-20  
**Based On:** FORENSIC_AUDIT.md (32 issues identified)  
**Principles:** Determinism > Cleverness, Explicit > Implicit, Compile-time > Runtime failure  

---

## 1. TARGET ARCHITECTURE DESCRIPTION

### Desired End State

**Security-First Architecture:**
- Zero client-side secrets (enforced at build time)
- CSRF protection mandatory for all mutations
- Rate limiting distributed (Redis-only in production)
- Input validation with compile-time type safety
- Dependency vulnerabilities = build failure

**Type-Safe Runtime:**
- No `any` types (ESLint enforced)
- Exhaustive pattern matching
- No type suppression comments
- Unsafe operations caught at compile-time

**Resilient Frontend:**
- Error boundaries around all user-facing features
- Memory leaks impossible (automatic cleanup)
- SSR-safe by default (no global state)
- Stable React keys (unique IDs, never index)

**Observable Operations:**
- Performance budgets enforced in CI
- Structured logging with correlation IDs
- Integration tests for critical revenue paths
- Automated dependency scanning

**Deterministic Build:**
- Reproducible builds
- Bundle size limits enforced
- No manual deployment steps
- Rollback procedure automated

---

## 2. REFACTOR PLAN (Phased, Safe, Reversible)

### Phase 1: Critical Security & Type Safety (P0 - Must Fix)
**Goal:** Eliminate exploit vectors and type unsoundness  
**Duration:** Immediate  
**Rollback:** Feature flags + git revert capability

#### Phase 1.1: Type System Hardening
- [x] Audit identified
- [ ] Fix ESLint rules (#001, #002, #003)
  - Change `no-explicit-any` to error
  - Change `ban-ts-comment` to error
  - Add `no-unsafe-*` rules
  - **Prevents:** Runtime type errors, unsafe casts
  - **Fails:** Build fails on `any` types or `@ts-ignore`

#### Phase 1.2: Security Enforcement
- [x] Audit identified
- [ ] Remove CI `continue-on-error` for security audit (#016)
  - **Prevents:** Vulnerable code reaching production
  - **Fails:** CI blocks deployment if vulnerabilities detected
- [ ] Add CSRF protection to server actions (#010)
  - Origin header validation
  - **Prevents:** Cross-site form submission attacks
  - **Fails:** Requests from unauthorized origins rejected
- [ ] Fix IP header validation (#011)
  - Validate proxy trust
  - **Prevents:** Rate limit bypass
  - **Fails:** Rejects spoofed headers

#### Phase 1.3: Production Rate Limiter
- [x] Audit identified
- [ ] Enforce Upstash Redis in production (#005)
  - Add startup validation
  - Remove in-memory fallback
  - **Prevents:** Rate limit bypass in multi-instance
  - **Fails:** Application won't start without Redis configured

---

### Phase 2: React & Runtime Safety (P1 - This Sprint)
**Goal:** Eliminate memory leaks and state corruption  
**Duration:** Week 2  
**Rollback:** Component-level revert

#### Phase 2.1: React Key Fixes
- [x] Audit identified
- [ ] Fix array index keys in 6+ components (#024)
  - ServiceDetailLayout, ValueProps, ServicesOverview
  - SocialProof, Accordion, etc.
  - **Prevents:** Component state corruption
  - **Fails:** ESLint error on `key={index}`

#### Phase 2.2: Memory Leak Prevention
- [x] Audit identified
- [ ] Add setTimeout cleanup (#025)
  - InstallPrompt component
  - **Prevents:** Memory leaks in SPA
  - **Fails:** ESLint warning on uncleaned timers

#### Phase 2.3: SSR Safety
- [x] Audit identified
- [ ] Add localStorage SSR checks (#026)
  - InstallPrompt component
  - **Prevents:** Hydration errors
  - **Fails:** Server-side render failures

#### Phase 2.4: Error Boundaries
- [x] Audit identified
- [ ] Wrap ContactForm in ErrorBoundary (#027)
  - Add component-specific error UI
  - **Prevents:** Full app crashes
  - **Fails:** Gracefully with user feedback

---

### Phase 3: Build & CI Hardening (P1 - This Sprint)
**Goal:** Automate quality gates  
**Duration:** Week 2-3  
**Rollback:** CI config revert

#### Phase 3.1: Bundle Size Enforcement
- [x] Audit identified
- [ ] Add bundle size checks to CI (#031)
  - Configure bundlewatch
  - **Prevents:** Performance regressions
  - **Fails:** CI blocks bundle size increases >10%

#### Phase 3.2: Client Secret Detection
- [x] Audit identified
- [ ] Add explicit client secret check to CI (#018)
  - **Prevents:** API keys in browser bundle
  - **Fails:** Build fails on secret detection

#### Phase 3.3: Disable Production Source Maps
- [x] Audit identified
- [ ] Disable public source maps (#032)
  - Upload to Sentry instead
  - **Prevents:** Source code exposure
  - **Fails:** Source maps not publicly accessible

---

### Phase 4: Testing & Monitoring (P2 - Next Sprint)
**Goal:** Catch failures before users see them  
**Duration:** Week 3  
**Rollback:** N/A (additive only)

#### Phase 4.1: Integration Tests
- [x] Audit identified
- [ ] Add E2E tests for contact form (#021)
  - Full submission flow
  - **Prevents:** Silent integration failures
  - **Fails:** CI blocks on E2E failures

#### Phase 4.2: Performance Monitoring
- [x] Audit identified
- [ ] Add performance instrumentation (#023)
  - Server action timing
  - **Prevents:** Silent degradation
  - **Fails:** Alerts on SLO violations

#### Phase 4.3: Rollback Documentation
- [x] Audit identified
- [ ] Document rollback procedure (#020)
  - Create ROLLBACK.md
  - **Prevents:** Extended downtime
  - **Fails:** Clear procedure exists

---

### Phase 5: Code Quality & Polish (P2 - Next Sprint)
**Goal:** Eliminate tech debt  
**Duration:** Week 4  
**Rollback:** Per-component revert

#### Phase 5.1: Accessibility Fixes
- [x] Audit identified
- [ ] Add aria-live to search results (#029)
- [ ] Fix mobile nav focus trap (#030)
  - **Prevents:** WCAG violations
  - **Fails:** Accessibility audit passes

#### Phase 5.2: State Management
- [x] Audit identified
- [ ] Sync search state with URL (#028)
  - **Prevents:** Broken browser navigation
  - **Fails:** Back/forward works correctly

#### Phase 5.3: Dependency Updates
- [x] Audit identified
- [ ] Resolve known CVEs (#015)
  - Update vulnerable packages
  - **Prevents:** Known exploits
  - **Fails:** No moderate+ vulnerabilities

---

## 3. AUTOMATIONS & GUARDRAILS ADDED

### Build-Time Enforcements

**TypeScript Strict Mode (Extended):**
```typescript
// tsconfig.json additions
"noUncheckedIndexedAccess": true,
"noPropertyAccessFromIndexSignature": true,
"exactOptionalPropertyTypes": true
```
**Failure Mode:** Compilation error on unsafe patterns

**ESLint Rules (New):**
```javascript
"@typescript-eslint/no-explicit-any": "error",
"@typescript-eslint/ban-ts-comment": "error",
"@typescript-eslint/no-unsafe-assignment": "error",
"@typescript-eslint/no-unsafe-call": "error",
"@typescript-eslint/no-unsafe-member-access": "error",
"@typescript-eslint/no-unsafe-return": "error",
"react/no-array-index-key": "error"
```
**Failure Mode:** Lint failure blocks PR merge

### Runtime Enforcements

**Production Environment Check:**
```typescript
// lib/env.ts
if (isProduction() && !validatedEnv.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL required in production')
}
```
**Failure Mode:** Application startup failure

**CSRF Origin Validation:**
```typescript
// lib/actions.ts
const origin = headers().get('origin')
const host = headers().get('host')
if (origin && !isValidOrigin(origin, host)) {
  throw new Error('Invalid request origin')
}
```
**Failure Mode:** 403 Forbidden response

### CI/CD Enforcements

**Security Audit (Blocking):**
```yaml
- name: Security audit
  run: npm audit --audit-level=moderate
  # Removed: continue-on-error: true
```
**Failure Mode:** CI blocks deployment

**Bundle Size Check:**
```yaml
- name: Check bundle size
  run: npx bundlewatch
```
**Failure Mode:** CI fails on size regression

**Client Secret Scan:**
```yaml
- name: Check client secrets
  run: node scripts/check-client-secrets.mjs
```
**Failure Mode:** Build fails on secret detection

---

## 4. CODE DELETIONS JUSTIFIED

### Removed: In-Memory Rate Limiter Fallback

**Location:** `lib/actions.ts:100, 348-369`  
**Justification:**
- Not production-safe (single-instance only)
- Creates false sense of security
- Memory leak vector
- Complexity without benefit

**Replacement:** Mandatory Upstash Redis  
**Class of Bug Prevented:** Rate limit bypass in distributed systems

---

### Removed: `continue-on-error: true` from Security Audit

**Location:** `.github/workflows/ci.yml:31`  
**Justification:**
- Allows vulnerable code to reach production
- Defeats purpose of security scanning
- No exceptions process in place

**Replacement:** Blocking security audit  
**Class of Bug Prevented:** Known CVE exploitation

---

### Removed: Public Production Source Maps

**Location:** `next.config.mjs:31`  
**Justification:**
- Exposes source code to attackers
- Intellectual property leak
- Attack surface discovery

**Replacement:** Sentry-only source maps  
**Class of Bug Prevented:** Source code exposure

---

## 5. NEW INVARIANTS INTRODUCED

### Invariant 1: No `any` Types in Codebase

**Enforcement:** ESLint rule `no-explicit-any: error`  
**Violation Detection:** Compile-time (ESLint)  
**Failure Mode:** Build fails, shows exact location  
**Business Impact:** Prevents runtime type errors that crash user sessions

---

### Invariant 2: Redis Required in Production

**Enforcement:** Startup validation in `lib/env.ts`  
**Violation Detection:** Application startup  
**Failure Mode:** Process exits with error message  
**Business Impact:** Prevents rate limit bypass (leads to spam/abuse)

---

### Invariant 3: CSRF Origin Must Match Host

**Enforcement:** Runtime check in server actions  
**Violation Detection:** Per-request  
**Failure Mode:** 403 Forbidden response  
**Business Impact:** Prevents cross-site form submission attacks

---

### Invariant 4: React Keys Must Be Unique & Stable

**Enforcement:** ESLint rule `react/no-array-index-key: error`  
**Violation Detection:** Compile-time (ESLint)  
**Failure Mode:** Build fails, shows component location  
**Business Impact:** Prevents form data loss and UI corruption

---

### Invariant 5: setTimeout Must Have Cleanup

**Enforcement:** ESLint plugin (or manual review)  
**Violation Detection:** Code review + testing  
**Failure Mode:** Component tests fail on memory leak  
**Business Impact:** Prevents memory leaks in long-running sessions

---

### Invariant 6: No Client-Side Secrets

**Enforcement:** Build-time script `check-client-secrets.mjs`  
**Violation Detection:** Post-build  
**Failure Mode:** Build fails, lists leaked secrets  
**Business Impact:** Prevents API key exposure and unauthorized access

---

### Invariant 7: Bundle Size < 250KB (Per Route)

**Enforcement:** CI check with bundlewatch  
**Violation Detection:** CI pipeline  
**Failure Mode:** PR blocked, shows size increase  
**Business Impact:** Prevents performance regression (slow load = lost conversions)

---

### Invariant 8: Security Audit Must Pass

**Enforcement:** CI audit without continue-on-error  
**Violation Detection:** CI pipeline  
**Failure Mode:** Deployment blocked, shows CVEs  
**Business Impact:** Prevents known vulnerability exploitation

---

## 6. REMAINING KNOWN RISKS

### Acceptable Risks (Documented)

#### Risk 1: CSP Uses `unsafe-inline`

**Why Accepted:**
- Required by Next.js hydration
- Required by Tailwind runtime
- Mitigated by input sanitization
- Future: Migrate to nonce-based CSP (requires significant refactoring)

**Mitigation:** Comprehensive XSS testing + sanitization review

---

#### Risk 2: HubSpot Sync Failures Not Auto-Retried

**Why Accepted:**
- Manual retry acceptable for MVP phase
- Queue system adds complexity
- Failed syncs tracked in database

**Mitigation:** Monitor `needs_sync` count, manual sync process documented  
**Future:** Implement retry queue in Phase 6

---

#### Risk 3: No Integration Tests for Search

**Why Accepted:**
- Search is not revenue-critical
- Search index is static (low failure risk)
- E2E tests exist for critical flows

**Mitigation:** Manual testing before releases  
**Future:** Add search integration tests in Phase 5

---

### Unacceptable Risks (Must Fix)

**None remaining after Phase 1-3 completion.**

All critical and high-priority risks addressed through:
- Type system enforcement
- Security hardening
- Runtime validation
- CI/CD guardrails
- Memory leak prevention

---

## PHASE EXECUTION ORDER

**Week 1 (Immediate):**
- Phase 1.1: Type system hardening
- Phase 1.2: Security enforcement
- Phase 1.3: Production rate limiter

**Week 2:**
- Phase 2.1-2.4: React & runtime safety
- Phase 3.1-3.3: Build & CI hardening

**Week 3:**
- Phase 4.1-4.3: Testing & monitoring

**Week 4:**
- Phase 5.1-5.3: Code quality & polish

---

## SUCCESS METRICS

### Security Posture
- [ ] Security risk level: HIGH → LOW
- [ ] No moderate+ CVEs in production
- [ ] CSRF protection on all mutations
- [ ] Rate limiting cannot be bypassed

### Code Quality
- [ ] TypeScript strict score: 100%
- [ ] ESLint errors: 0
- [ ] React keys: All unique IDs
- [ ] Memory leaks: 0 detected

### Operations
- [ ] Bundle size: <250KB per route
- [ ] Build time: <5 minutes
- [ ] CI blocking on vulnerabilities
- [ ] Rollback procedure documented

### Testing
- [ ] Integration test coverage: >80% critical flows
- [ ] E2E tests: Pass on every commit
- [ ] Performance budgets: Enforced

---

*This refactor plan transforms audit findings into deterministic, production-grade implementation.*
