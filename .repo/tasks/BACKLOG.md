# 📋 Task Backlog

> **Prioritized Queue** — All open tasks ordered by priority (P0 highest → P3 lowest).

---

## Workflow Instructions

### Adding New Tasks:
1. Use the standard task format (see template below)
2. Assign appropriate priority: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
3. Insert task in correct priority order (P0 tasks at top)
4. Include clear acceptance criteria

### Promoting Tasks:
1. When `TODO.md` is empty, move the TOP task from this file to `TODO.md`
2. Update status from `Pending` to `In Progress`
3. Remove the task from this file

### Task Format Template:
```markdown
### [TASK-XXX] Task Title
- **Priority:** P0 | P1 | P2 | P3
- **Status:** Pending
- **Created:** YYYY-MM-DD
- **Context:** Brief description of why this task matters

#### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

#### Notes
- Any relevant context or links
```

---

## Priority Legend
| Priority | Meaning | SLA |
|----------|---------|-----|
| **P0** | Critical / Blocking | Immediate |
| **P1** | High / Important | This week |
| **P2** | Medium / Should do | This month |
| **P3** | Low / Nice to have | When possible |

---

## P0 — Critical

### [TASK-012] Run Security Audit and Fix Vulnerabilities
- **Priority:** P0
- **Status:** Blocked (HITL-0001)
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - Security audit needed to identify and fix dependency vulnerabilities. Critical for production safety.

#### Acceptance Criteria
- [ ] Run `npm audit` to identify vulnerabilities
- [ ] Fix all critical and high severity vulnerabilities
- [ ] Document any acceptable risks for medium/low severity
- [ ] Update dependencies where safe
- [ ] Add npm audit to CI pipeline

#### Notes
- **BLOCKED:** Pending HITL-0001 completion per `.repo/policy/HITL.md` dependency-vulnerability rule.
- Filepath: `.repo/hitl/HITL-0001.md`
- Current status: Human action required before remediation work can proceed.

---


## P1 — High


## P2 — Medium

### [TASK-009] Add Worker Runtime for Job Queue
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Job queue models exist but no worker process to execute them.

#### Acceptance Criteria
- [ ] Create management command or worker process
- [ ] Add worker service to docker-compose.yml
- [ ] Document worker scaling strategy
- [ ] Add health checks for worker

#### Notes
- Per ANALYSIS.md: jobs modeled in DB but can't run
- backend/modules/jobs/models.py defines JobQueue/DLQ

---

### [TASK-027] Clean Up Repository Root - Move Documentation to Appropriate Locations
- **Priority:** P2
- **Status:** ✅ **COMPLETED**
- **Created:** 2026-01-23
- **Completed:** 2026-01-23
- **Context:** Repository root contains 9+ documentation and historical files that should be organized into appropriate directories for better maintainability.

#### Acceptance Criteria
- [x] Create `.repo/archive/assessments/` directory
- [x] Create `.repo/archive/injection/` directory
- [x] Move 6 historical analysis documents to `.repo/archive/assessments/`
- [x] Move DIAMOND.md to `.repo/archive/assessments/` (docs/security/ doesn't exist)
- [x] Move injection.py and agentic.json to `.repo/archive/injection/`
- [x] Search codebase for references to moved files
- [x] Update all references to moved files
- [x] Create archive README files explaining the archive
- [x] Verify root directory contains only essential files

#### Notes
- Reference: `.repo/tasks/REPO_ROOT_CLEANUP_PLAN.md` for detailed plan
- Files moved: CODEBASE_ANALYSIS.md, ORIENTATION_SUMMARY.md, CLEANUP_COMPLETE.md, INJECTION_COMPLETE.md, INJECTION_SUMMARY.md, AGENTIC_ANALYSIS.md, DIAMOND.md, injection.py, agentic.json
- All files successfully moved to archive directories
- References updated in `.repo/policy/BESTPR.md`
- Archive README files created

---

### [TASK-018] Run Bundle Analysis and Optimize Bundle Size
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - Bundle size unknown, needs analysis and optimization for performance.

#### Acceptance Criteria
- [ ] Run bundle analysis (`ANALYZE=true npm run build`)
- [ ] Identify large dependencies
- [ ] Document bundle size targets (<500KB)
- [ ] Optimize tree-shaking opportunities
- [ ] Add bundle size check to CI
- [ ] Consider code splitting for large dependencies

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 19.19 (Bundle Size Analysis)
- Bundle analyzer already configured in next.config.mjs
- Target: <500KB initial bundle size

---

### [TASK-020] Increase Test Coverage to 70%+
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - Target coverage is 70%+ for critical paths. Current: 50%.

#### Acceptance Criteria
- [ ] Add tests for all critical paths
- [ ] Add edge case tests
- [ ] Add integration tests for complex flows
- [ ] Update vitest.config.ts threshold to 70%
- [ ] Verify coverage report shows 70%+

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 5.1
- Prerequisite: TASK-015 (60% coverage)
- Focus on critical paths: contact form, rate limiting, sanitization

---

### [TASK-021] Add React.memo and useCallback Optimizations
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - Only 4 useMemo instances, missing useCallback and React.memo for performance.

#### Acceptance Criteria
- [ ] Add useCallback for event handlers passed to children
- [ ] Add React.memo for expensive components
- [ ] Profile before/after to measure impact
- [ ] Document optimization decisions
- [ ] Update performance metrics

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 19.4 (Performance Pattern Analysis)
- Current: 4 useMemo, 0 useCallback, 0 React.memo
- Target: Optimize expensive components and event handlers

---

### [TASK-022] Create hooks/ Directory for Reusable Hooks
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - No custom hooks directory. Extract reusable hook patterns for better code organization.

#### Acceptance Criteria
- [ ] Create hooks/ directory
- [ ] Extract form validation logic from ContactForm.tsx to hooks/useContactForm.ts
- [ ] Extract other reusable hook patterns
- [ ] Update all imports
- [ ] Document hook usage patterns

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 19.18 (React Hooks Analysis)
- Example: Extract ContactForm validation to custom hook
- Follow React hooks best practices

---

### [TASK-033] Add CodeQL Analysis to CI
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md - CodeQL analysis workflow is missing. Critical SAST tool for security vulnerability detection.

#### Acceptance Criteria
- [ ] Create `.github/workflows/codeql.yml`
- [ ] Configure CodeQL for TypeScript/JavaScript
- [ ] Set up automated analysis on PRs
- [ ] Configure alerts for security findings
- [ ] Document CodeQL setup in SECURITY.md
- [ ] Test CodeQL analysis locally

#### Notes
- Reference: DIAMOND.md section 10.1 (SAST Fundamentals)
- Missing: `.github/workflows/codeql.yml`
- Required for: Static application security testing (SAST)

---

### [TASK-034] Implement SLSA Provenance Generation
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md Priority Gaps - SLSA provenance is missing. Critical for build integrity attestation and supply chain security.

#### Acceptance Criteria
- [ ] Add SLSA provenance generation to CI
- [ ] Generate provenance attestations for builds
- [ ] Store provenance artifacts with releases
- [ ] Document SLSA setup in SECURITY.md
- [ ] Verify provenance generation works
- [ ] Integrate with SBOM generation

#### Notes
- Reference: DIAMOND.md section 12.2 (Supply Chain Security)
- Missing: SLSA provenance (mentioned in Priority Gaps)
- Required for: Build integrity attestation, supply chain security

---

### [TASK-035] Add OWASP ZAP DAST Scanning
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md Priority Gaps - Advanced DAST tools are missing. OWASP ZAP is fundamental for dynamic security testing.

#### Acceptance Criteria
- [ ] Add OWASP ZAP to CI pipeline
- [ ] Configure ZAP baseline scan
- [ ] Set up automated DAST on PRs or schedule
- [ ] Configure alerts for security findings
- [ ] Document DAST process in SECURITY.md
- [ ] Test ZAP scanning locally

#### Notes
- Reference: DIAMOND.md section 11.1 (DAST Fundamentals), Priority Gaps
- Missing: Advanced DAST tools (mentioned in Priority Gaps)
- Required for: Dynamic application security testing

---

### [TASK-036] Verify and Configure Branch Protection
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md - Branch protection needs verification. Critical for repository security and code quality.

#### Acceptance Criteria
- [ ] Verify branch protection settings on main/master branch
- [ ] Configure required status checks
- [ ] Enable branch deletion prevention
- [ ] Require pull request reviews
- [ ] Document branch protection in CONTRIBUTING.md
- [ ] Test branch protection rules

#### Notes
- Reference: DIAMOND.md section 2.1 (Access Control), 14.1 (CI/CD Security)
- Status: Needs verification (mentioned multiple times)
- Required for: Repository security, code quality enforcement

---

### [TASK-037] Implement Threat Modeling
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md - Threat modeling is a fundamental security requirement. Needed for systematic threat identification.

#### Acceptance Criteria
- [ ] Create threat model document
- [ ] Identify and document threats
- [ ] Map attack surface
- [ ] Document security architecture
- [ ] Create risk assessment
- [ ] Store in docs/security/ or .repo/archive/
- [ ] Review and update quarterly

#### Notes
- Reference: DIAMOND.md section 1.1 (Threat Modeling & Security Architecture)
- Missing: Threat modeling (fundamental security requirement)
- Required for: Security architecture, risk assessment

---

### [TASK-038] Add Production Deployment Automation
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md Priority Gaps - Production deployment automation is missing. Needed for reliable deployments.

#### Acceptance Criteria
- [ ] Create Cloudflare Pages deployment workflow
- [ ] Add deployment verification
- [ ] Implement rollback procedures
- [ ] Add smoke tests post-deployment
- [ ] Configure staging environment
- [ ] Document deployment process
- [ ] Add deployment notifications

#### Notes
- Reference: DIAMOND.md section 16.2, 16.3 (Deployment), Priority Gaps
- Missing: Production deployment automation (mentioned in Priority Gaps)
- Platform: Cloudflare Pages

---

## P3 — Low

### [TASK-010] Add Observability Stack (OpenTelemetry/Prometheus)
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Logging and Sentry exist but no metrics/tracing.

#### Acceptance Criteria
- [ ] Add OpenTelemetry instrumentation
- [ ] Configure Prometheus metrics endpoint
- [ ] Create basic Grafana dashboards-as-code
- [ ] Document observability in RUNBOOK.md

#### Notes
- Per ANALYSIS.md: observability incomplete

---

### [TASK-011] Add SBOM Generation to CI
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Supply chain security best practice.

#### Acceptance Criteria
- [ ] Add SBOM generation step to CI
- [ ] Choose format (SPDX or CycloneDX)
- [ ] Store SBOM artifact with releases
- [ ] Document in SECURITY.md

#### Notes
- Required for enterprise security compliance

---

### [TASK-023] Add Visual Regression Testing
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - Missing visual regression tests. Important for UI consistency.

#### Acceptance Criteria
- [ ] Set up visual regression testing tool (e.g., Percy, Chromatic, or Playwright screenshots)
- [ ] Add baseline screenshots for key pages
- [ ] Integrate into CI pipeline
- [ ] Document visual testing workflow
- [ ] Add to test coverage reporting

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 5.2 and 19.23
- Current: No visual regression tests
- Tools: Playwright (already in use) or dedicated visual testing service

---

### [TASK-024] Implement Advanced Caching Strategy
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - No caching layer for blog posts, search index needs caching.

#### Acceptance Criteria
- [ ] Add caching layer for blog posts (dev mode)
- [ ] Cache search index generation
- [ ] Implement ISR (Incremental Static Regeneration) for blog posts
- [ ] Add cache headers for static assets
- [ ] Document caching strategy

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 4.3 and 19.21
- Files: lib/blog.ts (line 46), app/layout.tsx (search index)
- Consider Redis or in-memory cache for dev mode

---

### [TASK-025] Add Performance Benchmarks
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - No performance benchmarks. Needed to track performance over time.

#### Acceptance Criteria
- [ ] Create performance benchmark suite
- [ ] Add benchmarks for critical functions (sanitize, rate-limit)
- [ ] Integrate into CI (run on schedule)
- [ ] Document benchmark results
- [ ] Set performance budgets

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 15.5 (lib/sanitize.ts TODO)
- Focus on: sanitize functions, rate limiting, form submission
- Use Node.js performance API or benchmark.js

---

### [TASK-026] Complete Technical Debt Items
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per CODEBASE_ANALYSIS.md - Multiple documented technical debt items need resolution.

#### Acceptance Criteria
- [ ] Review all technical debt items from CODEBASE_ANALYSIS.md section 7.1
- [ ] Prioritize and address high-impact items
- [ ] Add retry logic for HubSpot sync failures
- [ ] Add frontmatter validation with Zod
- [ ] Document resolved items

#### Notes
- Reference: CODEBASE_ANALYSIS.md section 7 (Technical Debt)
- Key items: HubSpot retry logic, blog caching, frontmatter validation
- Track in technical debt log

---

### [TASK-039] Add Semantic Versioning and Release Automation
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md - Semantic versioning and release automation are missing. Needed for proper version management.

#### Acceptance Criteria
- [ ] Set up semantic-release or similar tool
- [ ] Configure automated changelog generation
- [ ] Add automated Git tagging
- [ ] Create release workflow
- [ ] Document versioning strategy
- [ ] Test release automation

#### Notes
- Reference: DIAMOND.md section 16.2 (Release Fundamentals)
- Missing: semantic-release, automated changelog, Git tagging
- Required for: Proper version management, release automation

---

### [TASK-040] Add OSSF Scorecard to CI
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md - OSSF Scorecard is missing. Provides security best practices scoring for open source projects.

#### Acceptance Criteria
- [ ] Add OSSF Scorecard workflow to CI
- [ ] Configure automated scoring
- [ ] Set up scorecard badges
- [ ] Document scorecard in README.md
- [ ] Review and address low-scoring areas
- [ ] Monitor scorecard results

#### Notes
- Reference: DIAMOND.md section 10.1 (SAST Fundamentals)
- Missing: OSSF Scorecard workflow
- Required for: Security best practices verification

---

### [TASK-041] Expand E2E Testing Coverage
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md Priority Gaps - E2E testing needs expansion. Playwright is configured but needs more coverage.

#### Acceptance Criteria
- [ ] Review current E2E test coverage
- [ ] Add E2E tests for critical user flows
- [ ] Add accessibility testing to E2E suite
- [ ] Add performance testing to E2E suite
- [ ] Add mobile device testing
- [ ] Document E2E testing strategy

#### Notes
- Reference: DIAMOND.md Priority Gaps, section 13.1 (Testing)
- Status: Playwright configured, needs more coverage
- Current: 5 E2E test files

---

### [TASK-042] Add Trivy Security Scanning
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Per DIAMOND.md - Trivy scanning workflow is missing. Provides comprehensive vulnerability scanning.

#### Acceptance Criteria
- [ ] Create `.github/workflows/trivy.yml`
- [ ] Configure Trivy for container/image scanning
- [ ] Set up automated scanning on PRs
- [ ] Configure alerts for vulnerabilities
- [ ] Document Trivy setup in SECURITY.md
- [ ] Test Trivy scanning locally

#### Notes
- Reference: DIAMOND.md section 10.1 (SAST Fundamentals)
- Missing: `.github/workflows/trivy.yml`
- Required for: Container and dependency vulnerability scanning
