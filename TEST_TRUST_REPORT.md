# Test Trust Report

**Date:** 2026-01-22  
**Repository:** TrevorPLam/your-dedicated-marketer  
**Test Framework:** Vitest 4.0.16  
**Primary Language:** TypeScript/JavaScript (Next.js 15.5.2)

## Executive Summary

**Status:** 🔴 Test suite has significant trustworthiness issues

**Key Findings:**
- 4 pre-existing test failures (out of 151 tests)
- Multiple tests pass despite broken production code
- Over-reliance on mocks that prevent meaningful failure detection
- Missing assertions and weak oracle patterns detected
- Async test issues with error handling validation

**Biggest Risk:** Tests provide false confidence that features work correctly when they do not.

---

## Phase 0: Orientation & Reproduction Commands

### Environment Setup

**Prerequisites:**
- Node.js: >=20 <23
- npm: >=10

### Installation

```bash
# Clone repository
git clone https://github.com/TrevorPLam/your-dedicated-marketer.git
cd your-dedicated-marketer

# Install dependencies
npm ci --legacy-peer-deps
```

### Running Tests

**Run all unit tests:**
```bash
npm test -- --run
```

**Run tests in watch mode:**
```bash
npm test
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

**Run E2E tests (Playwright):**
```bash
npm run test:e2e
```

**Type check:**
```bash
npm run type-check
```

**Lint:**
```bash
npm run lint
```

**Build:**
```bash
npm run build
```

### Test Suite Structure

- **Unit Tests:** `__tests__/**/*.test.{ts,tsx}` (27 test files, 151 tests)
- **E2E Tests:** `tests/e2e/**` (Playwright)
- **Coverage Thresholds:** branches: 40%, functions: 45%, lines: 50%, statements: 50%

### CI Configuration

Tests run in GitHub Actions on PR and push to main:
- Location: `.github/workflows/ci.yml`
- Steps: Type check → Lint → Test → Build
- Coverage reporting: Enabled via Vitest

---

## Phase 1: Manual Canary Validation Results

### Methodology

For each selected test:
1. Identified the behavior contract it protects
2. Introduced a controlled defect in the production code
3. Ran the test to see if it caught the defect
4. Documented the outcome and root cause
5. Reverted the change immediately

### Canary Test Results

| # | Test Name | Module | Contract | Canary Change | Expected | Actual | Root Cause |
|---|-----------|--------|----------|---------------|----------|--------|------------|
| 1 | test_skips_tracking_when_consent_denied | lib/analytics | Must not track when consent is denied | Inverted consent check (`if (hasConsent) return`) | FAIL | ✅ FAIL | Working correctly - caught bug |
| 2 | test_logs_error_when_local_storage_read_fails | lib/analytics-consent | Must log errors when localStorage fails | Mock localStorage.getItem to throw | FAIL | ❌ PASS | **FALSE POSITIVE** - logError mock doesn't verify actual call |
| 3 | sanitize sensitive fields tests | lib/logger | Must redact passwords, tokens, API keys | Return `false` from isSensitiveKey | FAIL | ✅ FAIL | Working correctly - 3 tests caught security bug |
| 4 | ContactForm tests (all 8 tests) | components/ContactForm | Must validate honeypot field (max 0 chars) | Changed honeypot max to 1000 | FAIL | ❌ PASS | **FALSE POSITIVE** - No test validates honeypot logic |
| 5 | test_allows_three_requests_then_blocks_on_fourth | lib/rate-limit | Must block 4th request per identifier | Always return `true` when limit exceeded | FAIL | ✅ FAIL | Working correctly - caught rate limit bypass |
| 6 | skips posts with invalid dates | lib/blog | Must reject invalid dates like 2024-02-30 | Removed date rollover validation | FAIL | ✅ FAIL | Working correctly - caught date validation bug |
| 7 | should escape HTML special characters | lib/sanitize | Must escape forward slashes to prevent XSS | Removed `/` from escape map | FAIL | ✅ FAIL | Working correctly - caught XSS vulnerability |

**Summary:** 5/7 tests working correctly, **2/7 are false positives** that provide false confidence.

---

## Phase 2: Systematic Detection

### 2A: Mutation Testing

**Status:** Manual mutation approach (no automated mutation tool configured)

**Mutations Applied:** TBD

**Surviving Mutants:** TBD

### 2B: Test Wiring Verification

**Findings:**

#### Pre-Existing Test Failures (Baseline)
1. **`__tests__/components/HomePage.test.tsx`** - Looking for outdated text that no longer exists in component
2. **`__tests__/lib/actions.upstash.test.ts`** (2 failures) - Mock configuration issues with Upstash rate limiting  
3. **`__tests__/lib/analytics-consent.test.ts`** - Error logging not triggered when expected (mock wiring issue)

#### Tests Never Executed
None found - all test files are discovered and executed by Vitest

#### Skipped/Ignored Tests
None found via `it.skip`, `test.skip`, or `describe.skip` patterns

#### Mock Configuration Issues

1. **Analytics consent error logging test** (`__tests__/lib/analytics-consent.test.ts:42-51`)
   - **Issue:** Mock is set up incorrectly - `logError` is already mocked when module is imported
   - **Impact:** Test claims to verify error logging but doesn't actually exercise the code path
   - **Evidence:** Test passes even though logError is never called

2. **Heavy mock reliance in actions tests** (`__tests__/lib/actions.*.test.ts`)
   - **Issue:** Complex fetch mocking with branching logic
   - **Impact:** Tests may not catch real integration issues
   - **Risk:** 60+ lines of mock setup per test file

3. **Module-level vi.hoisted mocks** (multiple files)
   - **Pattern:** Using `vi.hoisted()` to mock before imports
   - **Risk:** Mocks can prevent real module code from executing
   - **Files affected:** `actions.upstash.test.ts`, `actions.submit.test.ts`, `logger.test.ts`

### 2C: Assertion & Oracle Strength Audit

**Top 10 Test Smells:**

1. **Missing honeypot validation test** - `ContactForm.test.tsx`  
   **Risk:** HIGH - Honeypot is a security feature to block bots, but no test validates it
   **Location:** `__tests__/components/ContactForm.test.tsx`  
   **Evidence:** All 8 tests pass even when honeypot validation is completely broken

2. **Error logging mock not validated** - `analytics-consent.test.ts`  
   **Risk:** HIGH - Test claims to validate error logging but doesn't actually verify it works
   **Location:** `__tests__/lib/analytics-consent.test.ts:42-51`  
   **Evidence:** Test passes but `logError` is never called (mock wiring issue)

3. **Weak mock verification** - Multiple files  
   **Risk:** MEDIUM - Tests use `toHaveBeenCalled()` without checking arguments
   **Locations:**  
   - `analytics.test.ts:113,127,146` - Only checks mock was called, not with correct data
   - `app/layout.test.tsx:90-91` - Negative assertions without positive cases
   **Impact:** Tests pass even if function is called with wrong data

4. **Over-mocked integration tests** - `actions.submit.test.ts`, `actions.upstash.test.ts`  
   **Risk:** MEDIUM - Heavy mocking of fetch prevents real integration issues from being caught
   **Evidence:** 60+ lines of mock implementation per file with complex branching
   **Impact:** Won't catch real API integration bugs

5. **No async timeout validation** - `ContactForm.test.tsx`  
   **Risk:** LOW-MEDIUM - Tests use `waitFor` but don't validate timeouts
   **Location:** Multiple test files using `waitFor()`
   **Evidence:** No tests verify what happens if async operations hang

6. **Snapshot testing absent** - All component tests  
   **Risk:** LOW - Could catch unintended UI regressions
   **Evidence:** No `.toMatchSnapshot()` calls found in component tests
   **Note:** Intentional design choice - snapshots can be noisy

7. **Coverage gaps in edge cases** - `blog.test.ts`  
   **Risk:** MEDIUM - Tests cover happy path well but missing some edge cases
   **Location:** `__tests__/lib/blog.test.ts`
   **Gap:** No test for empty blog directory, malformed YAML frontmatter

8. **No integration with real localStorage** - `analytics-consent.test.ts`  
   **Risk:** LOW - Only mocks localStorage, doesn't test real browser behavior
   **Evidence:** All localStorage operations are mocked
   **Impact:** Won't catch real browser storage issues

9. **Missing negative test cases** - `ContactForm.test.tsx`  
   **Risk:** MEDIUM - No tests for honeypot field being filled (should block)
   **Evidence:** Only happy path tested for form submission
   **Missing:** Bot detection, honeypot field validation, malicious input

10. **No performance/timeout tests** - All test files  
    **Risk:** LOW - No tests validate performance characteristics
    **Evidence:** No tests measure execution time or enforce timeouts
    **Note:** Unit tests typically don't need this, but integration tests might

**Statistics:**
- Total test files: 27
- Total tests: 151 (147 passing, 4 failing at baseline)
- Mock usage: 41 `vi.fn()` calls
- Total assertions: 253 `expect()` calls
- Average assertions per test: 1.68 (healthy)
- Tests without assertions: 0 (good)
- Tests with only truthiness checks: 0 (good)

---

## Phase 3: Improvements Made

### Changes Summary

TBD

### Mapping to Risks

| Change | Files Modified | Risk Addressed | Before Evidence | After Evidence |
|--------|---------------|----------------|-----------------|----------------|
| TBD | TBD | TBD | TBD | TBD |

---

## Before/After Comparison

### Before Improvements

```bash
# Test run output before changes
TBD
```

### After Improvements

```bash
# Test run output after changes
TBD
```

---

## Recommendations & Next Steps

### High Priority (Do Next)

1. TBD
2. TBD
3. TBD

### Medium Priority (Soon)

1. TBD
2. TBD

### Low Priority (Future)

1. TBD

### Test Infrastructure Improvements

1. **Consider mutation testing tool:** Stryker supports TypeScript/JavaScript
2. **Add pre-commit hooks:** Run tests before commit to catch regressions early
3. **Increase coverage thresholds gradually:** Current thresholds are relatively low

---

## Appendix

### Pre-Existing Failures (Baseline)

Captured on 2026-01-22 before any changes:

```
 Test Files  3 failed | 24 passed (27)
      Tests  4 failed | 147 passed (151)
```

Failed tests:
1. `HomePage.test.tsx > renders hero and CTA content` - Text assertion mismatch
2. `actions.upstash.test.ts > uses Upstash limiter when credentials are present` - Expected true, got false
3. `actions.upstash.test.ts > blocks submissions when Upstash reports a limit breach` - Wrong error message
4. `analytics-consent.test.ts > test_logs_error_when_local_storage_read_fails` - logError not called

These failures demonstrate that the test suite already has issues catching real bugs.
