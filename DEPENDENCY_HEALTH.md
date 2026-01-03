DEPENDENCY_HEALTH.md

---

# DEPENDENCY HEALTH

Precedence: CODEBASECONSTITUTION.md → READMEAI.md → specs/* → this document.

Purpose: keep dependencies safe, minimal, and maintainable without requiring scripts, scanners, or CI. This doc defines how to evaluate, add, update, and remove dependencies, and how to prevent “dependency creep” in AI-built repos.

Primary outputs:

* A predictable dependency posture (few surprises, fewer abandoned libs)
* Dependency changes recorded in CHANGELOG.md when they affect behavior
* Any dependency findings converted into TODO.md tasks (with acceptance criteria)

Hard rules:

1. Add dependencies only with an explicit reason and ownership.
2. Prefer fewer, well-maintained dependencies over many one-off packages.
3. Keep only one library per “job” unless there is a documented reason.
4. No dependency changes are “silent.” They must be recorded either in TODO (planned) or CHANGELOG (done).

⠀
---

## AGENT EXECUTION PROMPT (RUN THIS EXACTLY)

You are a dependency health agent operating inside this repository.

Constraints:

* Assume the repo owner does not run scripts and does not use GitHub Actions.
* You may inspect package.json, lockfiles, requirements.txt, pyproject.toml, etc.
* You must not recommend large dependency upgrades unless you also list the risks and a safe upgrade plan.
* Convert findings into concrete TODO.md tasks with:

  * Priority (P0/P1/P2)
  * Type (QUALITY or ENHANCE)
  * Acceptance criteria
  * References (files)

Deliverables:

1. Append a “Dependency Health Summary” section to the bottom of this file (dated).
2. Add/modify TODO.md tasks for any recommended changes (add/update/remove/dedupe).
3. If a dependency change is already completed, ensure it is reflected in CHANGELOG.md and TODO_COMPLETED.md.

⠀
Stop conditions:

* If removing or upgrading a dependency could break production behavior and you cannot validate safely, create a task and stop short of executing the change.
---

## What “healthy” looks like

* Minimal: no duplicates (one date library, one HTTP client, etc.)
* Maintained: dependencies show ongoing maintenance and documentation
* Scoped: dependencies are chosen for clear roles
* Predictable: upgrades happen intentionally, not randomly
* Replaceable: key abstractions avoid lock-in where possible
---

## Phase 1 — Inventory (By Inspection)

Identify dependency manifest(s):

* JS/TS: package.json (+ lockfile)
* Python: pyproject.toml or requirements.txt
* Other ecosystems if present

Record:

* total dependency count (rough)
* top “heavy” dependencies (frameworks, SDKs)
* any obvious duplicates (two libs solving same thing)
* any “one-off” micro deps that could be replaced with native code

Output:

* A short list of “Critical Dependencies” (the ones that can’t break)

* Examples:
* framework (Next.js, React)
* auth provider SDK
* payments SDK (Stripe)
* database client/ORM
---

## Phase 2 — Add Dependency Policy (Before Adding Anything New)

A dependency is allowed only if:

1. It solves a real problem not reasonably solved by existing deps or standard library.
2. It is actively maintained OR is a well-established, stable standard.
3. It doesn’t introduce redundant overlap.
4. It has acceptable licensing for your use (if relevant).
5. You record:

   * why you added it
   * what it replaces (if anything)
   * where it’s used

⠀
When proposing a new dependency, always produce:

* “Why this dependency?”
* “Alternatives considered”
* “Risk if it becomes unmaintained”
* “How to remove later”
---

## Phase 3 — Update Policy (Cadence + Safety)

Recommended cadence (doc-only, no tooling required):

* Patch updates: safe, can bundle periodically
* Minor updates: do selectively; group by area
* Major updates: treat like a mini-project

Upgrade safety checklist:

* Identify what changes (breaking notes, new behavior)
* Identify blast radius (files/flows)
* Define validation plan (manual smoke tests from RELEASE_CHECKLIST.md)
* Update CHANGELOG.md if user-facing behavior changes

Hard rule:

* Never do major upgrades “because it’s old.” Only upgrade with a reason + validation plan.
---

## Phase 4 — Duplicate & Overlap Control

Common overlap categories (choose one):

* Date/time: pick one library
* HTTP: pick one client abstraction
* Validation: pick one schema validator
* State management: pick one approach
* UI components: avoid multiple component kits unless justified

If overlap exists:

* Create a TODO.md task to consolidate:

  * pick the canonical lib
  * list where the other is used
  * migration steps
  * acceptance criteria: “only canonical lib remains”
---

## Phase 5 — Risk Heuristics (No Web, No Tools)

Even without browsing or scanners, you can spot risk patterns:

High risk (P0/P1 candidates):

* dependencies that touch auth, crypto, payments, file uploads
* deps copied from random repos or unverified sources
* deps that require native binaries without clear reason
* deps with broad permissions or runtime code execution

Moderate risk:

* deps that are “glue” libraries but unmaintained
* overly large deps used for tiny tasks

Low risk:

* stable, widely used libraries in mature ecosystems

Rule:

* If a dependency is high-risk and poorly justified, create a task to replace or isolate it.
---

## Phase 6 — Removal Policy (How to Reduce Dependency Creep)

When removing dependencies:

1. Identify all usages (imports/require references).
2. Replace with:

   * existing dependencies, or
   * standard library code, or
   * a small internal utility module.
3. Remove the dependency from manifest.
4. Ensure docs/code references are updated.
5. Record removal in:

   * CHANGELOG.md if behavior changed
   * TODO_COMPLETED.md with date

⠀
Acceptance criteria template:

* “No remaining imports of X”
* “X removed from manifest and lockfile”
* “Equivalent behavior confirmed via smoke tests”
---

## Phase 7 — Dependency Change Recording

Every dependency change must be recorded:

* Planned: TODO.md with task ID
* Completed: TODO_COMPLETED.md + CHANGELOG.md (if behavior impact)

Recommended task labeling:

* Type: ENHANCE (general) or QUALITY (cleanup/consolidation)
* Tag: include “DEP” in title or context
---

## Optional: Lightweight Dependency Notes (Recommended)

Create a short section in DECISIONS.md whenever you choose:

* a core framework
* an auth strategy
* a payments SDK
* an ORM/database layer

This prevents future churn and re-arguing.

---

## Dependency Health Summary (Append Below Each Review)

## Dependency Health Summary — 2026-01-03

### Inventory:

**Ecosystem(s):** JavaScript/TypeScript (npm/pnpm)

**Total Dependencies:**
- Production: 22 packages
- Development: 19 packages
- Total: 41 packages

**Critical Dependencies:**
- **Framework:** next@^14.2.18, react@^18.3.1, react-dom@^18.3.1
- **External Services:** @sentry/nextjs@^10.32.1 (error tracking), resend@^6.6.0 (email)
- **Validation:** zod@^4.2.1, react-hook-form@^7.54.2
- **Content Processing:** MDX ecosystem (@next/mdx, next-mdx-remote, gray-matter, shiki)
- **Styling:** tailwindcss@^3.4.17, postcss@^8.4.49

**Duplicates/Overlap Suspected:**
- None identified. Both clsx and tailwind-merge work together (not redundant).
- Both @next/mdx and next-mdx-remote serve different purposes (build-time vs runtime MDX).

### Findings:

**(P2) Outdated PWA Library**
- **Issue:** next-pwa@^5.6.0 is outdated and no longer actively maintained. Last significant update was in 2022. May have compatibility issues with Next.js 14.
- **Risk:** Medium - PWA features may break with future Next.js updates
- **Recommendation:** Evaluate if PWA features are critical. If yes, consider migration to @ducanh2912/next-pwa (maintained fork) or remove if not actively used.

**(P2) Dependency Version Pinning Strategy**
- **Issue:** All dependencies use caret (^) ranges, which allows automatic minor/patch updates. This is generally safe but can introduce unexpected breaking changes, especially for security-critical dependencies.
- **Risk:** Low-Medium - Potential for unexpected behavior changes
- **Recommendation:** Consider exact version pinning for security-critical deps (Sentry, zod, resend, next) as mentioned in TODO.md T-008.

**(P2) Missing Dependency Update Documentation**
- **Issue:** No documented cadence or process for dependency updates beyond what's already in TODO.md T-008.
- **Risk:** Low - May lead to dependency drift over time
- **Recommendation:** Document dependency update policy in this file.

### Positive Findings:

- **Minimal & Well-Justified:** All dependencies serve clear purposes with no obvious redundancies
- **Well-Maintained:** Critical dependencies (Next.js, React, Sentry, zod) are actively maintained
- **No Obvious Security Risks:** No abandoned or suspicious packages identified
- **Clear Architecture:** Dependencies are organized by function (testing, styling, content, forms)
- **Modern Versions:** Most packages are on recent stable versions
- **Testing Coverage:** Good testing infrastructure with Vitest and Playwright

### Tasks Created:

**T-DEP-001:** Evaluate and potentially replace next-pwa (documented below in TODO.md)
**Priority:** P2  
**Type:** QUALITY  

**T-008:** Review and Update Dependencies (already exists in TODO.md)  
**Priority:** P2  
**Type:** QUALITY (SEC)  
**Status:** Already tracked

### Recommended Actions:

1. **Immediate (P1):** None - no critical issues found
2. **Short-term (P2):**
   - Evaluate next-pwa usage and migration path (T-DEP-001)
   - Continue with existing dependency security review (T-008)
3. **Long-term:**
   - Establish quarterly dependency review cadence
   - Consider setting up automated dependency update tool (Dependabot/Renovate) for security patches

### Dependency Update Policy:

**Patch Updates (x.y.Z):** 
- Safe to apply periodically (monthly or as-needed)
- Review changelog for any unexpected behavior changes
- Test critical flows after update

**Minor Updates (x.Y.0):**
- Review selectively
- Group by functional area (e.g., all MDX plugins together)
- Test thoroughly before production

**Major Updates (X.0.0):**
- Treat as mini-projects with dedicated time
- Read migration guides
- Test all affected features
- Update CHANGELOG.md if behavior changes
- Consider creating a separate branch for testing

**Never upgrade just because "it's old"** - Only upgrade with:
- Clear reason (security fix, needed feature, bug fix)
- Understanding of changes
- Validation plan
- Rollback strategy

### Notes / Assumptions:

- Analysis performed without installing dependencies (based on package.json and code inspection)
- Repository uses pnpm as package manager (pnpm-lock.yaml present)
- PWA functionality configured but may not be actively tested/used
- Both @next/mdx and next-mdx-remote are intentionally used for different purposes:
  - @next/mdx: Local .mdx files in pages (build-time compilation)
  - next-mdx-remote: Dynamic blog content from /content directory (runtime)
- clsx + tailwind-merge combination is intentional (common pattern for className utilities)
- Testing infrastructure is comprehensive (unit + E2E)
- All security-critical operations (Sentry, Resend) use official SDKs from trusted vendors

---