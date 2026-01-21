# BESTPR.md — Best Practices Reference

**Document Type:** Technical Standards
**Version:** 1.0.0
**Last Updated:** 2026-01-21
**Status:** Active
**Authority:** Required reading for all code changes

## Purpose

Token-optimized, repo-specific guide for shipping quality code consistently. This document distills patterns from the codebase to help agents write complementary code on first attempt.

---

## Quick Reference Card

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript 5 + Tailwind CSS + Vitest + Playwright
**Hosting:** Cloudflare Pages (SSG)
**Integrations:** Sentry, Supabase, HubSpot, Upstash Redis
**Key Files:** `CODEBASECONSTITUTION.md` → `AGENTS.md` → `TODO.md` → `BESTPR.md`

---

## 1. Architecture Fundamentals

### Rendering Model
- **Default:** Server Components (no `'use client'`)
- **SSG Only:** All pages pre-rendered at build time (no ISR/SSR)
- **Edge Runtime:** API routes only (`/api/og`)
- **Client Components:** Only for interactivity (forms, state, events, browser APIs)

### Current Client Components
```
Navigation, ContactForm, SearchDialog, Breadcrumbs, 
ErrorBoundary, InstallPrompt, AnalyticsConsentBanner, SearchPage
```

### Directory Hierarchy
```
app/           → Pages (App Router), Server Components default
components/    → React components (Server default, Client explicit)
  ui/          → Design system primitives (Button, Card, Input)
lib/           → Server utilities, actions, schemas (Server-only)
__tests__/     → Unit tests (Vitest)
tests/         → E2E tests (Playwright)
public/        → Static assets
content/       → MDX blog posts
docs/          → Documentation + AGENTS.md files
scripts/       → Build/audit scripts
```

---

## 2. Code Conventions (Non-Negotiable)

### Naming
- **Files:** `PascalCase.tsx` for components, `kebab-case.ts` for utilities
- **Functions:** `camelCase`
- **Components:** `PascalCase`
- **Constants:** `SCREAMING_SNAKE_CASE`
- **Env vars (public):** `NEXT_PUBLIC_*`
- **Env vars (secret):** Never prefix with `NEXT_PUBLIC_`

### Import Organization
```typescript
// 1. External dependencies
import React from 'react'
import { useForm } from 'react-hook-form'

// 2. Internal absolute imports (@/)
import { Button } from '@/components/ui/Button'
import { submitContactForm } from '@/lib/actions'

// 3. Relative imports (rare, prefer @/)
import './styles.css'
```

### TypeScript Standards
- **Strict mode:** Always enabled
- **Props:** Use `interface` (not `type`)
- **Exports:** Default exports for components, named exports for utilities
- **Runtime validation:** Use Zod for user input, API responses
- **No `any`:** Use `unknown` and narrow with type guards

### Component Template
```typescript
/**
 * ComponentName — Brief description
 * 
 * @example
 * <ComponentName required="value" />
 */

import React from 'react'

interface ComponentNameProps {
  /** Description of prop */
  required: string
  optional?: boolean
  children?: React.ReactNode
}

export default function ComponentName({ 
  required, 
  optional = false 
}: ComponentNameProps) {
  return (
    <div className="container mx-auto">
      {/* Implementation */}
    </div>
  )
}
```

---

## 3. Styling Standards

### Tailwind Only
- **YES:** Tailwind utility classes
- **NO:** Inline styles, CSS modules, arbitrary values (`bg-[#123456]`)
- **Conditional:** Use `cn()` from `@/lib/utils`

### Color Palette (tailwind.config.ts)
```
charcoal: #1A1A1A (backgrounds)
coral: #FF6B6B (primary CTA)
mint: #4ECDC4 (secondary accent)
cream: #F7F7F7 (light backgrounds)
```

### Responsive Pattern
```typescript
// Mobile-first (default classes apply to mobile)
<div className="text-sm md:text-base lg:text-lg">
```

### Conditional Classes
```typescript
import { cn } from '@/lib/utils'

<button className={cn(
  'base-class another-class',
  isActive && 'active-class',
  hasError && 'error-class',
  props.className // Allow override
)}>
```

---

## 4. Security Requirements (Critical)

### Input Sanitization
```typescript
// ALWAYS sanitize user input before use
import { sanitizeHTML, sanitizeEmailHeader } from '@/lib/sanitize'

const safe = sanitizeHTML(userInput)
const safeHeader = sanitizeEmailHeader(emailValue)
```

### Server Actions
```typescript
'use server'

// MUST be at top of file for server actions
// Rate limit ALL form submissions
// Hash IPs with SHA-256 (never log raw IPs)
// Validate with Zod before processing
```

### Environment Variables
```typescript
// Use env.ts for validation (fails fast on missing secrets)
import { env } from '@/lib/env'
import { publicEnv } from '@/lib/env.public'

// Server-only (actions.ts, API routes)
const apiKey = env.HUBSPOT_API_KEY

// Client-safe (components)
const sentryDSN = publicEnv.NEXT_PUBLIC_SENTRY_DSN
```

### Never Commit
- API keys, tokens, passwords
- `.env` files (only `.env.example` allowed)
- PII or sensitive user data
- Unencrypted secrets

### Error Handling
```typescript
// ALWAYS use logger.ts (sanitizes before Sentry)
import { logError, logInfo } from '@/lib/logger'

try {
  await riskyOperation()
} catch (error) {
  logError('Operation failed', { context: { operation: 'name' }, error })
  // Return user-safe error
  return { success: false, message: 'Please try again later' }
}
```

---

## 5. Data Patterns

### Server Actions (Contact Form)
```typescript
'use server'

import { z } from 'zod'
import { sanitizeHTML } from '@/lib/sanitize'

export async function submitContactForm(data: FormData) {
  // 1. Rate limit (IP + email)
  // 2. Validate with Zod
  // 3. Sanitize inputs
  // 4. Process (Supabase + HubSpot)
  // 5. Return typed response
  
  return { success: true, message: 'Thank you!' }
}
```

### Rate Limiting
```typescript
// Dual-layer: email + IP (SHA-256 hashed)
// Redis (Upstash) or in-memory fallback
// 3 submissions per email per 24h
// 5 submissions per IP per 24h
```

### Form Validation
```typescript
// Use Zod + react-hook-form
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema } from '@/lib/contact-form-schema'

const form = useForm({
  resolver: zodResolver(contactFormSchema),
  defaultValues: { name: '', email: '', phone: '', message: '' }
})
```

### Data Fetching (Static Only)
```typescript
// Build-time data loading
import { getAllPosts } from '@/lib/blog'
import { getSearchIndex } from '@/lib/search'

// NO client-side fetching, NO API calls from components
// All data resolved during `next build`
```

---

## 6. Testing Standards

### Unit Tests (Vitest)
- **Location:** `__tests__/` (mirrors source structure)
- **Naming:** `ComponentName.test.tsx`
- **Pattern:** `describe` → `it` blocks
- **Mocking:** Use `vi.mock()` for external dependencies

### Test Template
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ComponentName from '@/components/ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText('value')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const handleClick = vi.fn()
    render(<ComponentName onClick={handleClick} />)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### E2E Tests (Playwright)
- **Location:** `tests/e2e/`
- **Focus:** Critical user flows (contact form, navigation)
- **Run:** `npm run test:e2e`

### Coverage Requirements
- **Target:** >80% for security-critical modules (`lib/actions.ts`, `lib/sanitize.ts`)
- **Run:** `npm run test:coverage`

---

## 7. Integration Patterns

### Sentry (Error Reporting)
```typescript
// Separate configs: sentry.{server,client,edge}.config.ts
// ALWAYS sanitize before sending (see lib/sentry-sanitize.ts)
// PII redaction: email, IP, phone, name

import { captureException } from '@sentry/nextjs'
import { sanitizeEventForSentry } from '@/lib/sentry-sanitize'

captureException(sanitizeEventForSentry(error, context))
```

### Supabase (Lead Storage)
```typescript
// Server-only (lib/actions.ts)
// Schema: contacts table with is_suspicious + hubspot_sync_status
// Insert with suspicion metadata

await supabase.from('contacts').insert({
  name, email, phone, message,
  is_suspicious: false,
  suspicion_reason: null,
  hubspot_sync_status: 'pending'
})
```

### HubSpot (CRM Sync)
```typescript
// Best-effort sync (don't block UX on failure)
// Upsert by email, store HubSpot ID in Supabase

try {
  await hubspotClient.contacts.upsert({ email, ...data })
  // Update sync_status = 'synced'
} catch (error) {
  // Log error, mark sync_status = 'needs_sync'
  // Return success to user anyway
}
```

### Upstash Redis (Rate Limiting)
```typescript
// Optional dependency (graceful fallback)
// SHA-256 hash before storing (never raw IPs/emails)

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '24h')
})
```

---

## 8. Build & Deploy

### Commands
```bash
npm run dev              # Local dev server
npm run build            # Next.js build (SSG)
npm run pages:build      # Cloudflare Pages adapter
npm run lint             # ESLint (must pass)
npm run format           # Prettier (auto-fix)
npm run type-check       # TypeScript (must pass)
npm run test             # Vitest unit tests
npm run test:e2e         # Playwright E2E tests
npm run test:coverage    # Coverage report
```

### Build Requirements
- Zero ESLint errors
- Zero TypeScript errors
- All tests passing
- No missing environment variables (fail-fast in `lib/env.ts`)

### Cloudflare Pages Config
- **Build command:** `npm run pages:build`
- **Output directory:** `.vercel/output/static`
- **Node version:** 20.x
- **Env var:** `CLOUDFLARE_BUILD=true` (disables Next.js Image Optimization)

---

## 9. Accessibility (A11y)

### Requirements
- **WCAG 2.1 AA** compliance target
- **Focus states:** All interactive elements
- **Keyboard navigation:** Full site (tab, shift+tab, enter, escape)
- **Screen reader:** Semantic HTML + ARIA labels
- **Mobile:** Touch targets ≥44px

### Common Patterns
```typescript
// Skip to content link
<SkipToContent />

// Focus trap in modal
<Dialog onClose={() => {}}>

// Accessible form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" required />

// Screen reader text
<span className="sr-only">Descriptive text</span>
```

### Validation
```bash
npm run audit:a11y    # Automated axe-core checks
```

---

## 10. Performance

### Core Web Vitals Targets
- **LCP:** <2.5s
- **FID:** <100ms
- **CLS:** <0.1
- **Lighthouse Score:** ≥90 (Mobile)

### Optimization Checklist
- [ ] Images: WebP format, `next/image` with `unoptimized` for Cloudflare
- [ ] Fonts: Preload critical fonts
- [ ] JS: Code-split with dynamic imports
- [ ] CSS: Tailwind JIT (no unused styles)
- [ ] Analytics: Load after consent

### Bundle Size
- **Monitor:** `npm run check:bundle-size`
- **Target:** <200KB initial JS

---

## 11. Documentation Standards

### JSDoc Pattern
```typescript
/**
 * functionName — Brief description
 * 
 * @AI METACODE
 * Purpose: What this does and why it exists
 * Patterns: Key behaviors to preserve
 * Hints: Non-obvious gotchas
 * Security: Checklist for safe changes
 * 
 * @param {Type} param - Description
 * @returns {Type} Description
 * @throws {ErrorType} When this fails
 * 
 * @example
 * const result = functionName('input')
 */
```

### AGENTS.md Files
- **Location:** Every major directory
- **Sections:** Purpose, Structure, Patterns, Examples, Testing
- **Update:** When adding new components/modules

### Governance Hierarchy
1. `CODEBASECONSTITUTION.md` (supreme authority)
2. `AGENTS.md` (root) + `READMEAI.md`
3. `TODO.md` (task truth source)
4. Audit runbooks (`CODEAUDIT.md`, `SECURITYAUDIT.md`)
5. `BESTPR.md` (this document)
6. `specs/` (non-binding notes)

---

## 12. Common Tasks (Quick Start)

### Add a New Page
1. Create `app/[route]/page.tsx`
2. Export default component + `metadata`
3. Use Server Component (default)
4. Update `app/sitemap.ts`
5. Update Navigation if needed

### Add a New Component
1. Determine: Page-level (`components/`) or primitive (`components/ui/`)
2. Determine: Server (default) or Client (`'use client'`)
3. Create `ComponentName.tsx` with JSDoc
4. Update `components/AGENTS.md` table
5. Write tests in `__tests__/components/`

### Add a New Utility
1. Create `lib/util-name.ts`
2. Export types + functions
3. Add security notes if handles user input
4. Update `lib/AGENTS.md` table
5. Write tests in `__tests__/lib/`

### Add a New Dependency
1. Check security: `npm audit` + GitHub Advisory DB
2. Add to `package.json`: `npm install <package>`
3. Document usage in relevant AGENTS.md
4. Update `CHANGELOG.md` with rationale

---

## 13. Anti-Patterns (Never Do)

### Architecture
- ❌ Client-side data fetching (breaks SSG)
- ❌ API routes for data (use static generation)
- ❌ `'use client'` on pages (unless absolutely required)
- ❌ Mixing SSG + SSR/ISR

### Code Quality
- ❌ Inline styles or CSS modules
- ❌ Arbitrary Tailwind values (`bg-[#hex]`)
- ❌ `any` type (use `unknown` + guards)
- ❌ Raw `console.log` (use `logger.ts`)
- ❌ Unvalidated user input (always Zod + sanitize)

### Security
- ❌ Logging raw IPs or PII
- ❌ Committing secrets
- ❌ Client-side secret access (must be server-only)
- ❌ Bypassing rate limits
- ❌ Trusting user input without validation

### Testing
- ❌ Deleting or modifying existing tests without verification
- ❌ Skipping tests for security-critical code
- ❌ Testing implementation details (test behavior)

---

## 14. When in Doubt

1. **Check governance:** `CODEBASECONSTITUTION.md` → `AGENTS.md` → `TODO.md`
2. **Find examples:** Search codebase for similar patterns
3. **Use explore agent:** Ask questions about existing code
4. **Mark UNKNOWN:** If you can't verify, document uncertainty
5. **Create a task:** If scope is large, propose in `TODO.md`

---

## 15. Key Files Reference

| File | Purpose |
|------|---------|
| `CODEBASECONSTITUTION.md` | Supreme authority, non-negotiable rules |
| `AGENTS.md` | Agent behavior rules |
| `READMEAI.md` | Operating console, start here |
| `TODO.md` | Task truth source |
| `BESTPR.md` | This document (technical standards) |
| `PROJECT_STATUS.md` | Current state + next step |
| `CHANGELOG.md` | Historical changes |
| `repo.manifest.yaml` | How to run/verify repo |
| `package.json` | Dependencies + scripts |
| `tsconfig.json` | TypeScript config |
| `next.config.mjs` | Next.js config |
| `tailwind.config.ts` | Tailwind config |
| `.env.example` | Environment variable template |

---

## Version History

**1.0.0** (2026-01-21): Initial release
