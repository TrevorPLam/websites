# BESTPR — your-dedicated-marketer Best Practices (Repo-Specific)

**File**: `.repo/policy/BESTPR.md`

## Purpose
Use this guide to ship changes that align with your-dedicated-marketer architecture, workflows, and quality bars. It captures the stack, repo layout, and the checks expected before delivery.

## Repository Map (where to work)
- **app/** — Next.js App Router pages and routes (page.tsx, layout.tsx, route handlers)
- **app/api/** — Next.js API routes (route.tsx files)
- **components/** — Reusable React components (UI components, layouts, etc.)
- **lib/** — Shared utilities, helpers, and business logic
- **public/** — Static assets (images, fonts, etc.)
- **__tests__/** — Unit and integration tests (Vitest)
- **tests/e2e/** — End-to-end tests (Playwright)
- **scripts/** — Project automation scripts
- **.repo/tasks/** — Task management (TODO.md, BACKLOG.md, ARCHIVE.md) for traceability

## Tech Stack & Core Libraries
- **Framework:** Next.js 15.5.2 (App Router)
- **React:** 19.2.3
- **TypeScript:** 5.7.2
- **Styling:** Tailwind CSS 3.4.17
- **Testing:** Vitest 4.0.16 (unit/integration), Playwright 1.49.0 (E2E)
- **Error Tracking:** Sentry 10.32.1
- **Rate Limiting:** Upstash Rate Limit
- **Deployment:** Cloudflare Pages

## Delivery Workflow (what to run)
1. **Local checks before PR:**
   - `make lint` — Run ESLint
   - `make typecheck` — TypeScript type checking
   - `make test` — Run unit/integration tests (Vitest)
   - `make test:e2e` — Run E2E tests (Playwright)
   - `make verify` — Full local CI suite (lint + typecheck + test)
   - `make build` — Verify production build
2. **When touching API routes:** Ensure proper input validation and error handling
3. **When touching components:** Add tests and ensure accessibility
4. **When touching styles:** Ensure responsive design and Tailwind best practices

## Repo-Specific Coding Practices

### Next.js App Router
- Use App Router conventions: `page.tsx` for pages, `layout.tsx` for layouts, `route.tsx` for API routes
- Keep server components by default, use `'use client'` only when needed
- Use Server Actions for form submissions and mutations
- Leverage Next.js Image component for optimized images
- Use middleware.ts for security headers and request validation

Example:
```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <div>About</div>;
}
```

### React Components
- Prefer functional components with TypeScript
- Use TypeScript interfaces for props
- Keep components in `components/` directory
- Use Tailwind CSS for styling
- Ensure accessibility (ARIA labels, semantic HTML)

Example:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### API Routes
- Use Next.js route handlers (`route.tsx`)
- Implement proper error handling
- Validate input with Zod or similar
- Use rate limiting for public endpoints
- Return appropriate HTTP status codes

Example:
```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Handle POST request
  return NextResponse.json({ success: true });
}
```

### Security
- All security headers configured in `middleware.ts`
- Content Security Policy (CSP) enforced
- Rate limiting via Upstash
- No secrets in client-side code (use environment variables)
- Input validation on all user inputs

### Testing
- Unit tests: `__tests__/` directory with Vitest
- E2E tests: `tests/e2e/` directory with Playwright
- Test coverage thresholds enforced
- Test accessibility with axe-core

## Documentation Expectations
- Follow the documentation structure:
  - `README.md` — Project overview and setup
  - `SECURITY.md` — Security policy and vulnerability reporting (when created)
  - `.repo/policy/` — Governance policies
  - `.repo/archive/assessments/DIAMOND.md` — Historical security checklist (archived)
- When adding new features, update relevant documentation
- Keep code comments clear and helpful

## Governance Alignment
- Follow the project governance rules in `.repo/policy/CONSTITUTION.md` for PR review, task traceability, verification evidence, and documentation rigor.
- Apply operating principles from `.repo/policy/PRINCIPLES.md` for day-to-day development practices.
- Quality gates in `.repo/policy/QUALITY_GATES.md` define merge requirements and verification checks.
- Security rules in `.repo/policy/SECURITY_BASELINE.md` define security checks, HITL triggers, and forbidden patterns.
- HITL process in `.repo/policy/HITL.md` defines how human-required actions are tracked and managed.
- All changes must be traceable to tasks in `.repo/tasks/` (Article 5: Strict Traceability, Principle 25).
- Completed tasks must be archived to `.repo/tasks/ARCHIVE.md` after PR merge.
- For risky changes (security, external systems), route to HITL per Article 6 & 8, Principle 10, SECURITY_BASELINE.md triggers, and HITL.md process.
- PRs must include filepaths, verification evidence, and rollback plans per Principles 6, 12, and 17.
- All quality gates must pass before merge (hard gates) or have approved waivers (waiverable gates).
- Never commit secrets (SECURITY_BASELINE.md: absolute prohibition).

---
**Canonical reference:** This document is the single source of truth for repo-specific best practices. Link to it from all AGENTS.md files and governance docs.
