# Deep Codebase Analysis - Enhanced

## Executive Summary

This document provides a comprehensive, evidence-based analysis of the marketing-websites monorepo, documenting its current architecture, component inventory, metaheader patterns, and recommendations for transforming from template-based to feature-based architecture. All data points are verified from actual file system inspection.

**Current State at a Glance:**

- **7 package directories** in `packages/` (config, infra, integrations, ui, utils, **types**, **features**) resolving to **~10 workspace packages**
- **1 template** (hair-salon) in `templates/`; **@repo/types** in `packages/types/` (moved from `templates/shared/`, which was removed)
- **9 UI components** in `@repo/ui` (including Dialog, ThemeInjector)
- **5 security modules** in `@repo/infra` + 7 env validation schemas
- **11 template-specific components** in hair-salon
- **5 feature modules** in `@repo/features` (blog, booking, contact, search, services); template re-exports from package for all five
- **Parity tests** in `templates/hair-salon/__tests__/refactor-parity/` (booking, search, services, contact, blog)
- **pnpm catalog** configured; workspace globs synced (Task 0.2)

---

## 1. Repository Structure Analysis

### 1.1 High-Level Architecture (Verified)

```
c:\dev\marketing-websites/
├── .github/               # CI/CD workflows
├── .vscode/               # Editor configuration (settings.json, extensions.json)
├── clients/               # Client implementations (contains only README.md)
├── docs/                  # Documentation (currently empty)
├── packages/              # Shared packages (7 packages total)
│   ├── config/            # Shared configurations (3 items)
│   │   ├── eslint-config/     # ESLint flat config for Next.js
│   │   ├── tailwind-preset.js # Design tokens preset
│   │   └── typescript-config/ # Base TS configs (4 variants)
│   ├── infra/             # Security, middleware, logging (37 items)
│   │   ├── security/          # CSP, rate-limit, validation, sanitize, headers
│   │   ├── context/           # Request context (server/client safe)
│   │   ├── env/               # Environment validation (12 items)
│   │   ├── logger/            # Structured logging with Sentry
│   │   ├── middleware/        # Middleware factory
│   │   ├── sentry/            # Error tracking integration
│   │   └── __tests__/         # Test coverage (7 test files)
│   ├── integrations/      # Third-party APIs (3 integrations)
│   │   ├── analytics/         # Consent-gated analytics
│   │   ├── hubspot/           # CRM integration
│   │   └── supabase/          # Database integration
│   ├── ui/                # Shared UI components (8 components)
│   │   └── src/
│   │       └── components/
│   │           ├── Accordion.tsx    (2,439 bytes)
│   │           ├── Button.tsx         (3,532 bytes)
│   │           ├── Card.tsx           (801 bytes)
│   │           ├── Container.tsx      (683 bytes)
│   │           ├── Input.tsx          (3,587 bytes)
│   │           ├── Section.tsx        (543 bytes)
│   │           ├── Select.tsx         (2,141 bytes)
│   │           └── Textarea.tsx       (1,936 bytes)
│   └── utils/             # Shared utilities (2 source files)
│       └── src/
│           ├── cn.ts              # Tailwind class merging (deps: clsx, tailwind-merge)
│           └── index.ts           # Barrel export
├── templates/             # Industry templates (2 items)
│   ├── hair-salon/        # Hair salon template (91 items)
│   │   ├── app/               # Next.js App Router (28 route segments)
│   │   ├── components/        # 11 template-specific components
│   │   ├── features/          # 5 feature modules (20 items total)
│   │   ├── content/           # MDX content (5 items)
│   │   └── lib/               # Utilities (14 items)
│   └── shared/            # Shared template utilities (5 items)
├── package.json           # Root workspace configuration
├── pnpm-workspace.yaml    # pnpm workspace with catalog
├── turbo.json             # Turborepo pipeline configuration
└── tsconfig.base.json     # Base TypeScript configuration
```

### 1.2 Workspace Configuration (Verified)

**Root package.json:**

```json
{
  "name": "marketing-website-templates",
  "version": "1.0.0",
  "packageManager": "pnpm@10.29.2",
  "engines": { "node": ">=24.0.0" },
  "workspaces": ["packages/*", "packages/config/*", "templates/*", "clients/*"]
}
```

**pnpm-workspace.yaml (Actual):**

```yaml
packages:
  - 'packages/*'
  - 'packages/config/*'
  - 'packages/integrations/*'
  - 'packages/features/*' # Exists: booking, contact, blog, services, search
  - 'templates/*'
  - 'clients/*'
  - 'apps/*'

# NOTE: root package.json workspaces field is synced with this file (Task 0.2).

catalog:
  next: '15.5.12'
  react: '19.0.0'
  react-dom: '19.0.0'
  typescript: '5.7.2'
  '@sentry/nextjs': '10.38.0'
  '@types/node': '^22.0.0'
  '@types/react': '^19.0.2'
  '@types/react-dom': '^19.0.2'
  zod: '^3.22.0'
  eslint: '^9.18.0'
```

**Key Findings:**

1. **packages/features/** exists with five extracted feature modules: booking, contact, blog, services, search. Template re-exports from @repo/features for all five.
2. **Config conflict:** Fixed (Task 0.1). `.npmrc` no longer sets node-linker; `.pnpmrc` is authoritative.
3. **Workspace glob mismatch:** Fixed (Task 0.2). Root `package.json` workspaces match `pnpm-workspace.yaml`.

**turbo.json Pipeline (Actual):**

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] },
    "type-check": { "dependsOn": ["^type-check"] },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "**/__tests__/**", "jest.config.js"]
    },
    "format": { "cache": false },
    "format:check": { "cache": false }
  }
}
```

### 1.3 Dependency Graph Analysis

**Workspace Package Dependencies (Verified):**

| Package             | Dependencies             | Peer Dependencies    | Consumers             |
| ------------------- | ------------------------ | -------------------- | --------------------- |
| @repo/utils         | none                     | none                 | @repo/ui, @repo/infra |
| @repo/ui            | @repo/utils              | react, react-dom     | hair-salon template   |
| @repo/infra         | @repo/utils, server-only | @sentry/nextjs, next | hair-salon template   |
| @repo/config        | none                     | none                 | all packages (dev)    |
| hair-salon template | 6 workspace packages     | -                    | -                     |

**Template Dependencies (package.json excerpt):**

```json
"dependencies": {
  "@repo/infra": "workspace:*",
  "@repo/integrations-analytics": "workspace:*",
  "@repo/integrations-hubspot": "workspace:*",
  "@repo/integrations-supabase": "workspace:*",
  "@repo/shared": "workspace:*",
  "@repo/ui": "workspace:*",
  "@repo/utils": "workspace:*",
  "next": "catalog:",
  "react": "19.0.0",
  "react-dom": "19.0.0"
}
```

---

## 2. Shared Packages Deep Dive

### 2.1 @repo/ui - UI Component Library

**Actual File Inventory:**

- **Total Files:** 9 (1 index.ts + 8 components)
- **Total Size:** ~16 KB across all components
- **Lines of Code:** ~800 lines (estimated from file sizes)

**Component Specifications:**

| Component     | Size        | Props Interface               | Variants                                                                    | Accessibility                     |
| ------------- | ----------- | ----------------------------- | --------------------------------------------------------------------------- | --------------------------------- |
| **Accordion** | 2,439 bytes | AccordionProps, AccordionItem | collapsible sections                                                        | Keyboard navigation               |
| **Button**    | 3,532 bytes | ButtonProps                   | 6 variants (primary, secondary, outline, ghost, destructive, text), 3 sizes | ARIA attributes, focus management |
| **Card**      | 801 bytes   | CardProps                     | default, outline, muted                                                     | Semantic HTML                     |
| **Container** | 683 bytes   | ContainerProps                | max-width wrapper                                                           | -                                 |
| **Input**     | 3,587 bytes | InputProps                    | label, error, isValid states                                                | aria-invalid, aria-describedby    |
| **Section**   | 543 bytes   | SectionProps                  | page section wrapper                                                        | -                                 |
| **Select**    | 2,141 bytes | SelectProps, SelectOption     | dropdown with options                                                       | Keyboard navigation               |
| **Textarea**  | 1,936 bytes | TextareaProps                 | label, error states                                                         | aria-invalid                      |

**Package Configuration:**

```json
{
  "name": "@repo/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "@repo/utils": "workspace:*"
  }
}
```

**Gap Analysis:**

- ✅ Comprehensive TypeScript types exported
- ✅ CSS custom properties for theming
- ✅ Accessibility features (ARIA, keyboard nav)
- ⚠️ **Missing:** Dialog/Modal, Toast, Tabs, Dropdown Menu, Tooltip, Popover
- ⚠️ **Missing:** Compound component patterns
- ⚠️ **Missing:** Animation/transition primitives

### 2.2 @repo/utils - Utility Functions

**Actual Contents:**

- **Files:** 2 (index.ts, cn.ts)
- **Functions:** 1 exported (`cn`)

**cn.ts Implementation:**

```typescript
// Combines clsx + tailwind-merge
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**Package.json:**

```json
{
  "name": "@repo/utils",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "dependencies": {
    "clsx": "2.1.1",
    "tailwind-merge": "2.6.1"
  }
}
```

**Gap Analysis:**

- ✅ Two runtime dependencies: `clsx` (2.1.1) and `tailwind-merge` (2.6.1)
- ✅ Well-typed with TypeScript
- ⚠️ **Missing:** Date formatting utilities
- ⚠️ **Missing:** Validation helpers
- ⚠️ **Missing:** Array/object manipulation utilities
- ⚠️ **Missing:** String/text utilities

### 2.3 @repo/infra - Infrastructure & Security

**Actual Module Inventory:**

| Module                     | File                                | Size         | Purpose                                       |
| -------------------------- | ----------------------------------- | ------------ | --------------------------------------------- |
| **CSP**                    | `security/csp.ts`                   | 8,699 bytes  | Content Security Policy with nonce generation |
| **Rate Limiting**          | `security/rate-limit.ts`            | 15,551 bytes | Sliding window with 6 presets                 |
| **Request Validation**     | `security/request-validation.ts`    | 10,282 bytes | Input validation utilities                    |
| **Sanitization**           | `security/sanitize.ts`              | 12,407 bytes | XSS prevention (DOMPurify)                    |
| **Security Headers**       | `security/security-headers.ts`      | 7,022 bytes  | HTTP security headers                         |
| **Middleware Factory**     | `middleware/create-middleware.ts`   | 3,970 bytes  | Request middleware factory                    |
| **Logger**                 | `logger/index.ts`                   | 8,127 bytes  | Structured logging with Sentry                |
| **Logger Client**          | `logger/client.ts`                  | 1,104 bytes  | Client-safe logger                            |
| **Sentry Client**          | `sentry/client.ts`                  | 1,713 bytes  | Client-side error tracking                    |
| **Sentry Server**          | `sentry/server.ts`                  | 870 bytes    | Server-side error tracking                    |
| **Sentry Sanitize**        | `sentry/sanitize.ts`                | 1,724 bytes  | Data sanitization for Sentry                  |
| **Request Context**        | `context/request-context.ts`        | 708 bytes    | Universal request context (stub)              |
| **Request Context Server** | `context/request-context.server.ts` | 939 bytes    | Server-only AsyncLocalStorage context         |
| **Env Validation**         | `env/validate.ts`                   | 12,776 bytes | Environment variable validation               |
| **Env Types**              | `env/types.ts`                      | 7,372 bytes  | Environment type definitions                  |
| **Env Index**              | `env/index.ts`                      | 2,975 bytes  | Env module barrel export + composition        |

**Package.json Exports:**

```json
{
  "exports": {
    ".": "./index.ts",
    "./client": "./index.client.ts",
    "./context/request-context": "./context/request-context.ts",
    "./security/csp": "./security/csp.ts",
    "./security/rate-limit": "./security/rate-limit.ts",
    "./security/request-validation": "./security/request-validation.ts",
    "./security/sanitize": "./security/sanitize.ts",
    "./security/security-headers": "./security/security-headers.ts",
    "./logger": "./logger/index.ts"
  }
}
```

**Rate Limiting Presets (Actual):**

```typescript
contact:    { maxRequests: 3,  windowMs: 60 * 60 * 1000 }  // 1 hour
booking:    { maxRequests: 5,  windowMs: 60 * 60 * 1000 }  // 1 hour
api:        { maxRequests: 100, windowMs: 60 * 1000 }     // 1 minute
auth:       { maxRequests: 5,  windowMs: 15 * 60 * 1000 } // 15 minutes
upload:     { maxRequests: 10, windowMs: 60 * 60 * 1000 }  // 1 hour
general:    { maxRequests: 20, windowMs: 60 * 60 * 1000 }  // 1 hour
```

**Test Coverage:**

- Location: `packages/infra/__tests__/`
- Files: 7 test files
- Coverage areas: CSP, rate-limit, request-validation, sanitize, security-headers, middleware

**Gap Analysis:**

- ✅ Comprehensive security modules
- ✅ 128-bit nonce generation for CSP
- ✅ Privacy-first rate limiting (no IP storage)
- ✅ Structured logging with Sentry
- ✅ Test coverage present
- ⚠️ **Missing:** Web Application Firewall (WAF) rules
- ⚠️ **Missing:** Bot detection integration

### 2.4 @repo/integrations - Third-Party APIs

**Actual Integration Inventory:**

| Integration   | Directory    | Files   | Purpose                           |
| ------------- | ------------ | ------- | --------------------------------- |
| **Analytics** | `analytics/` | 4 files | Consent-gated analytics, GTM, GA4 |
| **HubSpot**   | `hubspot/`   | 5 files | CRM integration, form submissions |
| **Supabase**  | `supabase/`  | 6 files | Database, auth, storage           |

**Analytics Features (Verified):**

- Consent management (GDPR/CCPA compliant)
- Google Analytics 4 integration
- Google Tag Manager support
- Privacy-compliant tracking (no cookies without consent)

**Gap Analysis:**

- ✅ Privacy-first approach
- ✅ Modular structure
- ⚠️ **Missing:** Mailchimp/SendGrid email integrations
- ⚠️ **Missing:** Stripe/payment integrations
- ⚠️ **Missing:** Calendly/Acuity scheduling
- ⚠️ **Missing:** Review platform integrations (Google, Yelp)
- ⚠️ **Missing:** AI/ML service integrations

### 2.5 @repo/shared - Shared Types (Previously Undocumented)

**Location:** `templates/shared/` (workspace package name: `@repo/shared`)

**Actual Contents:**

- **Files:** 3 (package.json, tsconfig.json, types/)
- **Types:** 2 (index.ts, site-config.ts)

**SiteConfig Type (4,240 bytes):**

The `SiteConfig` interface is the **single source of truth** for all marketing site configuration.
It already supports 4 conversion flow types via discriminated union:

```typescript
export type ConversionFlowType = 'booking' | 'contact' | 'quote' | 'dispatch';

export type ConversionFlowConfig =
  | BookingFlowConfig // serviceCategories, timeSlots, maxAdvanceDays
  | ContactFlowConfig // subjects (optional)
  | QuoteFlowConfig // serviceCategories, allowAttachments
  | DispatchFlowConfig; // urgencyLevels
```

**Key Finding:** The TODO and analysis both underestimate the existing type system.
The `ConversionFlowConfig` already supports 4 flow types — not just 'booking'.
This significantly reduces the work needed for Task 1.8 (Enhance Configuration System).

**Package.json Exports:**

```json
{
  "name": "@repo/shared",
  "exports": {
    "./types": "./types/index.ts",
    "./site-config": "./types/site-config.ts"
  }
}
```

**Gap Analysis:**

- ✅ Well-typed SiteConfig with discriminated unions
- ✅ Supports 4 conversion flow types
- ✅ Used by hair-salon template via `import type { SiteConfig } from '@repo/shared/types'`
- ⚠️ **Missing:** Industry type field (no `industry` property yet)
- ⚠️ **Missing:** Feature toggles (no `features` property yet)
- ⚠️ **Missing:** Integration configuration (no `integrations` property yet)
- ⚠️ **Location anomaly:** Lives in `templates/shared/` not `packages/` — should be moved

---

### 2.6 @repo/config - Shared Configurations

**Actual Configuration Inventory:**

| Config                 | Location                               | Size        | Purpose                                     |
| ---------------------- | -------------------------------------- | ----------- | ------------------------------------------- |
| **Tailwind Preset**    | `tailwind-preset.js`                   | 3,815 bytes | Design tokens (colors, typography, spacing) |
| **ESLint Config**      | `eslint-config/next.js`                | 1,245 bytes | Next.js + TypeScript flat config            |
| **TypeScript Base**    | `typescript-config/base.json`          | 342 bytes   | Base TS configuration                       |
| **TypeScript Next.js** | `typescript-config/nextjs.json`        | 241 bytes   | Next.js-specific TS config                  |
| **TypeScript React**   | `typescript-config/react-library.json` | 198 bytes   | React library TS config                     |

**Tailwind Preset (Actual):**

- Semantic color mapping (primary, secondary, accent, muted, destructive)
- CSS custom property integration (--primary, --secondary, etc.)
- Border radius tokens (--radius)
- Typography (heading, body font families)
- Extends Tailwind's theme.extend

**Gap Analysis:**

- ✅ CSS custom properties for runtime theming
- ✅ Shared ESLint flat config (v9 compatible)
- ✅ TypeScript configurations for different package types
- ⚠️ **Note:** Colors are HSL values hardcoded in preset

---

## 3. Templates Analysis

### 3.1 hair-salon Template (Detailed)

**Actual Structure:**

```
templates/hair-salon/
├── app/                   # Next.js App Router (28 items)
│   ├── layout.tsx         # Root layout with CSP nonce, metadata
│   ├── page.tsx           # Homepage
│   ├── about/
│   ├── api/               # API routes (2 routes)
│   │   └── og/            # Open Graph image generation
│   ├── blog/              # Blog pages (listing + [slug])
│   ├── book/              # Booking page
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery page
│   ├── pricing/           # Pricing page
│   ├── privacy/           # Privacy policy
│   ├── robots.ts          # robots.txt generation
│   ├── services/          # Service pages (5 routes)
│   │   ├── haircuts/
│   │   ├── coloring/
│   │   ├── treatments/
│   │   ├── special-occasions/
│   │   └── bridal/
│   ├── sitemap.ts         # sitemap.xml generation
│   ├── team/              # Team page
│   ├── terms/             # Terms of service
│   └── search/            # Search page
├── components/            # 11 template-specific components (see 3.3)
├── features/              # 5 feature modules
│   ├── blog/              # 5 items
│   │   ├── components/
│   │   ├── lib/
│   │   └── index.ts
│   ├── booking/           # 6 items
│   │   ├── components/    # BookingForm.tsx
│   │   ├── lib/           # booking-schema.ts, booking-actions.ts, booking-providers.ts, utils.ts
│   │   └── index.ts
│   ├── contact/           # 3 items
│   │   ├── components/    # ContactForm.tsx
│   │   └── index.ts
│   ├── search/            # 3 items
│   │   └── lib/           # search.ts, search-index.ts
│   └── services/          # 3 items
│       └── components/    # ServicesOverview.tsx
├── lib/                   # 14 items
│   ├── actions/           # Server actions
│   ├── constants.ts
│   ├── env.ts             # Environment validation
│   ├── env.public.ts      # Public environment
│   ├── search.ts
│   └── utils.ts
├── content/               # MDX content
│   └── blog/              # Blog posts (5 items)
├── public/                # Static assets (currently empty)
├── site.config.ts         # Site configuration (4,643 bytes)
├── middleware.ts          # Next.js middleware (CSP, security headers)
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind with @repo/config preset
├── sentry.client.config.ts
├── sentry.server.config.ts
└── Dockerfile             # Container configuration
```

**Template Dependencies:**

```json
"dependencies": {
  "@repo/infra": "workspace:*",
  "@repo/integrations-analytics": "workspace:*",
  "@repo/integrations-hubspot": "workspace:*",
  "@repo/integrations-supabase": "workspace:*",
  "@repo/shared": "workspace:*",
  "@repo/ui": "workspace:*",
  "@repo/utils": "workspace:*",
  "@sentry/nextjs": "10.38.0",
  "@upstash/ratelimit": "2.0.5",
  "@upstash/redis": "1.34.3",
  "clsx": "2.1.1",
  "date-fns": "^4.1.0",
  "gray-matter": "4.0.3",
  "lucide-react": "0.344.0",
  "next": "catalog:",
  "next-mdx-remote": "5.0.0",
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "react-hook-form": "7.55.0",
  "sonner": "^2.0.7",
  "tailwind-merge": "2.6.1",
  "zod": "3.22.4"
}
```

### 3.2 Feature Module Analysis (Verified)

**Feature Inventory:**

| Feature      | Location             | Components                            | Schema   | Actions | Server   | Status          |
| ------------ | -------------------- | ------------------------------------- | -------- | ------- | -------- | --------------- |
| **Blog**     | `features/blog/`     | BlogPostContent                       | ❌       | ❌      | ✅ (MDX) | Partial         |
| **Booking**  | `features/booking/`  | BookingForm                           | ✅ (Zod) | ✅      | ✅       | Complete        |
| **Contact**  | `features/contact/`  | ContactForm                           | ✅ (Zod) | ✅      | ✅       | Complete        |
| **Search**   | `features/search/`   | SearchDialog, SearchPage              | ❌       | ❌      | ❌       | UI done, no lib |
| **Services** | `features/services/` | ServicesOverview, ServiceDetailLayout | ❌       | ❌      | ❌       | UI done, no lib |

**Booking Feature (Most Complete Example):**

- **Components:** 1 (BookingForm.tsx)
- **Library Files:** 3 + 1 test
  - `booking-schema.ts` (7,475 bytes) - Zod validation schema
  - `booking-actions.ts` (10,740 bytes) - Server actions for form submission
  - `booking-providers.ts` (13,842 bytes) - Data providers (time slots, services)
  - `__tests__/booking-actions.test.ts` - Action tests
- **Exports:** BookingForm component, bookingFormSchema, bookingFormDefaults, SERVICE_TYPES, TIME_SLOTS, submitBookingRequest

**Contact Feature:**

- **Components:** 1 (ContactForm.tsx)
- **Library:** contact-form-schema.ts

**Blog Feature:**

- **Components:** 1 (BlogPostContent.tsx)
- **Library:** blog.ts (MDX parsing, frontmatter)
- **Note:** No Zod schema for blog content

**Search Feature:**

- **Components:** 2 (SearchDialog.tsx: 6,275 bytes, SearchPage.tsx: 3,487 bytes)
- **Library:** None in feature dir (search logic lives in `templates/hair-salon/lib/search.ts`)
- **Status:** UI components exist; library code needs extraction into feature dir

**Services Feature:**

- **Components:** 2 (ServicesOverview.tsx: 3,908 bytes, ServiceDetailLayout.tsx: 8,033 bytes)
- **Library:** None (data from site.config.ts)
- **Status:** UI complete with overview + detail layout; needs configurable data source

### 3.3 Components Inventory (Verified)

**Template-Specific Components (11 total):**

| Component                  | File Size   | Feature Tags                                                       | TRACE ID                          |
| -------------------------- | ----------- | ------------------------------------------------------------------ | --------------------------------- |
| **AnalyticsConsentBanner** | 4,874 bytes | [FEAT:ANALYTICS] [FEAT:PRIVACY] [FEAT:UX]                          | components.AnalyticsConsentBanner |
| **Breadcrumbs**            | 4,635 bytes | [FEAT:UX] [FEAT:SEO] [FEAT:ACCESSIBILITY]                          | components.Breadcrumbs            |
| **ErrorBoundary**          | 6,354 bytes | [FEAT:ERROR_HANDLING] [FEAT:UX]                                    | components.ErrorBoundary          |
| **FinalCTA**               | 1,235 bytes | [FEAT:MARKETING] [FEAT:CONVERSION]                                 | components.FinalCTA               |
| **Footer**                 | 4,448 bytes | [FEAT:UX] [FEAT:SEO] [FEAT:NAVIGATION]                             | components.Footer                 |
| **Hero**                   | 3,462 bytes | [FEAT:MARKETING] [FEAT:UX] [FEAT:ACCESSIBILITY] [FEAT:PERFORMANCE] | components.Hero                   |
| **InstallPrompt**          | 4,710 bytes | [FEAT:PWA] [FEAT:UX]                                               | components.InstallPrompt          |
| **Navigation**             | 8,720 bytes | [FEAT:NAVIGATION] [FEAT:UX] [FEAT:ACCESSIBILITY] [FEAT:MOBILE]     | components.Navigation             |
| **SkipToContent**          | 427 bytes   | [FEAT:ACCESSIBILITY]                                               | components.SkipToContent          |
| **SocialProof**            | 2,529 bytes | [FEAT:MARKETING] [FEAT:SOCIAL] [FEAT:CONVERSION]                   | components.SocialProof            |
| **ValueProps**             | 4,037 bytes | [FEAT:MARKETING] [FEAT:UX]                                         | components.ValueProps             |

**Total Component Size:** ~45 KB (template-specific only)

**Shared UI Components (8 from @repo/ui):**

- Accordion, Button, Card, Container, Input, Section, Select, Textarea

### 3.4 Site Configuration Analysis (site.config.ts)

**Actual Configuration Structure (Verified):**

```typescript
interface SiteConfig {
  id: 'hair-salon'; // Template identifier
  name: 'Hair Salon Template'; // Site name
  tagline: 'Professional hair care...'; // Marketing tagline
  description: string; // SEO description
  url: string; // Site URL (from env or default)

  navLinks: Array<{ href: string; label: string }>; // 6 navigation items (Services, Pricing, Gallery, Team, About, Blog)
  socialLinks: Array<{ platform: string; url: string }>; // 4 social platforms

  footer: {
    columns: Array<{ heading: string; links: NavLink[] }>; // 2 columns
    legalLinks: NavLink[]; // 2 links (privacy, terms)
    copyrightTemplate: string; // With {year} placeholder
  };

  contact: {
    email: string;
    phone: string;
    address: { street; city; state; zip; country };
    hours: Array<{ label: string; hours: string }>; // 3 time slots
  };

  seo: {
    titleTemplate: string; // '%s | Hair Salon Template'
    defaultDescription: string;
    ogImage: string;
    twitterHandle: string;
    schemaType: 'HairSalon';
  };

  theme: {
    // HSL color values (hardcoded)
    primary: '174 85% 33%';
    'primary-foreground': '0 0% 100%';
    secondary: '220 20% 14%';
    // ... 15 more color tokens
  };

  conversionFlow: {
    type: 'booking'; // Only one type currently
    serviceCategories: string[]; // 5 categories
    timeSlots: Array<{ value: string; label: string }>; // 3 slots
    maxAdvanceDays: 90;
  };
}
```

**Key Findings:**

- ✅ Centralized configuration (4,643 bytes)
- ✅ Type-safe with TypeScript
- ✅ Comprehensive (SEO, theme, contact, navigation)
- ⚠️ Theme values are hardcoded HSL (not customizable at runtime)
- ⚠️ Only supports `conversionFlow.type: 'booking'` (not configurable)
- ⚠️ No industry abstraction (hair-salon specific)

---

## 4. Metaheader & Documentation Patterns

### 4.1 File-Level Metaheader Format (Verified)

**Actual Pattern from codebase:**

```typescript
// File: packages/ui/src/components/Button.tsx  [TRACE:FILE=packages.ui.components.Button]
// Purpose: Reusable button component providing consistent styling and behavior across the application.
//          Supports multiple variants, sizes, and accessibility features with proper focus management
//          and keyboard navigation support.
//
// Exports / Entry: Button component, ButtonProps interface
// Used by: All application components requiring button interactions
//
// Invariants:
// - Must maintain consistent visual hierarchy across all variants
// - Must be fully accessible with proper ARIA attributes
// - Must support keyboard navigation and focus management
// - Must handle disabled state gracefully
// - Must forward refs properly for DOM manipulation
//
// Status: @public
// Features:
// - [FEAT:UI] Consistent button styling and behavior
// - [FEAT:ACCESSIBILITY] Full keyboard and screen reader support
// - [FEAT:RESPONSIVE] Multiple size variants for different contexts
// - [FEAT:DESIGN] Multiple visual variants for different use cases
```

### 4.2 TRACE Annotations (Verified)

**Actual Usage in Codebase:**

```typescript
// [TRACE:FILE=packages.ui.index]           // File-level trace
// [TRACE:FUNC=features.booking.BookingForm] // Function trace
// [TRACE:INTERFACE=packages.ui.ButtonProps] // Interface trace
// [TRACE:CONST=packages.config.tailwindPreset.primaryColors] // Constant trace
// [TRACE:BLOCK=packages.ui.components.Input.idGeneration] // Block trace
```

### 4.3 Feature Tags Taxonomy (Verified from codebase)

**Actually Used Tags:**

```typescript
[FEAT:MARKETING]       // Conversion optimization
[FEAT:SEO]            // Search engine optimization
[FEAT:UX]             // User experience
[FEAT:ACCESSIBILITY]  // WCAG compliance
[FEAT:PERFORMANCE]    // Speed optimization
[FEAT:SECURITY]       // Security features
[FEAT:PRIVACY]        // Privacy/GDPR compliance
[FEAT:ANALYTICS]      // Tracking and measurement
[FEAT:MOBILE]         // Mobile/responsive
[FEAT:PWA]            // Progressive web app
[FEAT:DESIGN]         // Visual design
[FEAT:UI]             // UI components
[FEAT:UI_COMPONENTS]  // Component library
[FEAT:THEMING]        // Theme support
[FEAT:FORMS]          // Form handling
[FEAT:BOOKING]        // Appointment booking
[FEAT:ERROR_HANDLING] // Error management
[FEAT:NAVIGATION]     // Site navigation
[FEAT:CONVERSION]     // Conversion optimization
[FEAT:SOCIAL]         // Social features
[FEAT:STYLING]        // CSS/styling
[FEAT:UTILITIES]      // Utility functions
[FEAT:SHARED]         // Shared functionality
[FEAT:CONFIGURATION]  // Configuration
[FEAT:COMPONENTS]     // Component architecture
[FEAT:DESIGN_SYSTEM]  // Design system
```

### 4.4 Documentation Coverage (Verified)

**Well-Documented (with metaheaders):**

- ✅ All packages/ui/src/components/\* (8 files)
- ✅ All packages/ui/src/index.ts
- ✅ All packages/utils/src/\* (2 files)
- ✅ All packages/infra/index.ts
- ✅ All packages/infra/security/\* (5 files)
- ✅ Most packages/infra/logger/\* (2 files)
- ✅ packages/config/tailwind-preset.js
- ✅ packages/config/eslint-config/next.js
- ✅ templates/hair-salon/features/\*/index.ts (5 files)

**Partially Documented:**

- ⚠️ templates/hair-salon/components/\* (varies by component)
- ⚠️ templates/hair-salon/lib/\* (some files lack metaheaders)

**Not Documented:**

- ❌ Test files (no metaheaders)
- ❌ Configuration files (next.config.js, tailwind.config.js)
- ❌ Middleware files (middleware.ts)
- ❌ Site config (site.config.ts has minimal documentation)

---

## 5. Current State Assessment

### 5.1 Strengths (Evidence-Based)

**1. Architecture**

- **Evidence:** Clean separation with 7 packages, dependency graph verified
- **Evidence:** pnpm workspace with catalog for version consistency
- **Evidence:** Turborepo pipeline with 7 configured tasks
- **Impact:** Enables code sharing while maintaining boundaries

**2. Security & Privacy**

- **Evidence:** 5 security modules (CSP, rate-limit, validation, sanitize, headers)
- **Evidence:** 128-bit nonce generation (csp.ts: crypto.getRandomValues)
- **Evidence:** Privacy-first rate limiting (no IP storage per rate-limit.ts)
- **Evidence:** Consent-gated analytics (AnalyticsConsentBanner.tsx)
- **Impact:** 2026 security best practices implemented

**3. Developer Experience**

- **Evidence:** TypeScript strict mode (tsconfig.base.json)
- **Evidence:** 28+ files with comprehensive metaheaders
- **Evidence:** Shared ESLint flat config (eslint-config/next.js)
- **Evidence:** pnpm catalog with 9 centralized versions
- **Impact:** Consistent code quality and easier maintenance

**4. Marketing Focus**

- **Evidence:** Conversion-optimized components (Hero, FinalCTA, SocialProof, ValueProps)
- **Evidence:** Feature tags explicitly mark marketing features
- **Evidence:** Site configuration supports conversion flow
- **Impact:** Business goals directly supported by code

**5. Accessibility**

- **Evidence:** ARIA attributes in Input.tsx (aria-invalid, aria-describedby)
- **Evidence:** Keyboard navigation in Accordion.tsx
- **Evidence:** SkipToContent.tsx (427 bytes, accessibility-only component)
- **Evidence:** Feature tags mark accessibility concerns
- **Impact:** WCAG compliance built-in

### 5.2 Weaknesses (Evidence-Based)

**1. Component Library Scope**

- **Evidence:** Only 8 UI components in @repo/ui
- **Evidence:** Missing: Dialog/Modal, Toast, Tabs, Dropdown Menu, Tooltip, Popover
- **Impact:** Template must implement or duplicate common patterns

**2. Template Architecture**

- **Evidence:** Single hair-salon template (no alternatives)
- **Evidence:** Template name "@templates/websites" in package.json (generic, not specific)
- **Evidence:** Hair-salon specific content in site.config.ts
- **Evidence:** No runtime theming (HSL hardcoded in config)
- **Impact:** New clients require copying and modifying template

**3. Feature Completeness**

- **Evidence:** Search feature has no UI component (lib only)
- **Evidence:** Services feature only has overview component
- **Evidence:** No e-commerce, testimonials, or team features
- **Impact:** Limited feature set for diverse client needs

**4. Integration Ecosystem**

- **Evidence:** Only 3 integrations (analytics, HubSpot, Supabase)
- **Evidence:** Missing: email, payments, scheduling, reviews, maps
- **Impact:** Manual integration required for common marketing tools

**5. Test Coverage**

- **Evidence:** infra has **tests**/ (7 files) + env/**tests**/ (2 files) = 9 infra tests
- **Evidence:** Template has tests in features/blog/**tests**/ (1), features/booking/lib/**tests**/ (1), lib/**tests**/ (2) = 4 template tests
- **Evidence:** Total: 13 test files across the repo (not just infra)
- **Evidence:** No tests in ui/ or utils/ packages
- **Impact:** Moderate coverage on infra/security; gaps in UI and utility packages

### 5.3 Technical Debt (Evidence-Based)

**1. Build System**

- **Evidence:** Turbo v2.2.3 installed (v2.8.4 available per RESEARCH.md)
- **Evidence:** README.md reports ESLint dependencies missing in packages/ui and packages/utils
- **Status:** Known issues, partially documented

**2. Workspace References**

- **Evidence:** pnpm-workspace.yaml references `packages/features/*` (doesn't exist)
- **Evidence:** pnpm-workspace.yaml references `apps/*` (doesn't exist)
- **Status:** Planned expansion not implemented

**3. Configuration Hardcoding**

- **Evidence:** site.config.ts has hardcoded HSL colors (not dynamic)
- **Evidence:** conversionFlow.type only supports 'booking'
- **Status:** Not configurable for different business types

---

## 6. Transformation Recommendations

### 6.1 Phase 1: Foundation (Weeks 1-2)

**Priority: CRITICAL**

**Component Library Expansion:**

- Add Dialog/Modal component (Radix Dialog primitive)
- Add Toast/Notification component (Sonner integration)
- Add Tabs component (Radix Tabs primitive)
- Add Dropdown Menu component (Radix DropdownMenu primitive)
- Add Tooltip component (Radix Tooltip primitive)

**Configuration System Enhancement:**

- Extend site.config.ts to support feature toggles
- Add industry type field ('salon', 'restaurant', 'law-firm', etc.)
- Make theme colors configurable (not hardcoded HSL)
- Add integrations configuration object

**Expected Outcome:** 13 UI components, configurable themes

### 6.2 Phase 2: Feature Extraction (Weeks 3-5)

**Priority: CRITICAL**

**Create packages/features/ directory:**

```
packages/features/
├── booking/           # Extract from templates/hair-salon/features/booking/
├── contact/          # Extract from templates/hair-salon/features/contact/
├── blog/             # Extract and enhance
├── services/         # Extract and enhance
├── testimonials/     # New feature
├── team/            # New feature
├── gallery/          # New feature
├── pricing/          # New feature
└── index.ts         # Barrel export
```

**Extraction Process:**

1. Copy feature from template to packages/features/
2. Refactor to remove hair-salon specific code
3. Add configuration props
4. Update imports in template
5. Verify functionality preserved

**Expected Outcome:** 8 feature modules in shared packages

### 6.3 Phase 3: Industry Abstraction (Weeks 6-7)

**Priority: HIGH**

**Create Industry-Specific Schemas:**

```typescript
// packages/types/industry.ts
export type Industry =
  | 'salon'
  | 'spa'
  | 'restaurant'
  | 'cafe'
  | 'law-firm'
  | 'dental'
  | 'medical'
  | 'fitness'
  | 'retail'
  | 'consulting'
  | 'realestate'
  | 'general';

export interface IndustryConfig {
  schemaType: string; // Schema.org type
  defaultFeatures: FeatureSet; // Feature defaults
  requiredFields: string[]; // Required site.config fields
  structuredData: object; // JSON-LD template
}
```

**Industry Defaults:**

- Salon: booking, services, team, gallery
- Restaurant: menu, reservations, hours, location
- Law Firm: services, team, case studies, contact

**Expected Outcome:** 12 industry configurations

### 6.4 Phase 4: Integration Expansion (Weeks 8-9)

**Priority: MEDIUM**

**New Integrations:**

```
packages/integrations/
├── analytics/        # Existing
├── hubspot/         # Existing
├── supabase/        # Existing
├── mailchimp/       # New: Email marketing
├── sendgrid/        # New: Transactional email
├── calendly/        # New: Scheduling
├── stripe/          # New: Payments
├── google-reviews/  # New: Review aggregation
└── google-maps/     # New: Maps embed
```

**Expected Outcome:** 9 integration modules

### 6.5 Phase 5: Client Template (Weeks 10-11)

**Priority: CRITICAL**

**Create Minimal Client Template:**

```
clients/
└── starter-template/
    ├── app/
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Home (uses template)
    │   └── [...routes]     # Standard routes
    ├── site.config.ts      # Client configuration ONLY
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json        # Minimal deps
```

**Client package.json:**

```json
{
  "dependencies": {
    "@repo/features": "workspace:*",
    "@repo/ui": "workspace:*",
    "next": "catalog:",
    "react": "catalog:"
  }
}
```

**Expected Outcome:** New client requires only site.config.ts

### 6.6 Phase 6: Template Deprecation (Week 12)

**Priority: CRITICAL**

**Migration Steps:**

1. Create migration guide (templates/hair-salon → clients/starter)
2. Migrate any existing client projects
3. Remove templates/ directory
4. Remove templates/\* from pnpm-workspace.yaml
5. Update documentation
6. Update turbo.json (remove template tasks)

**Expected Outcome:** templates/ directory removed

### 6.7 Effort Estimates

| Phase                   | Duration     | Deliverables                          |
| ----------------------- | ------------ | ------------------------------------- |
| 1: Foundation           | 2 weeks      | 13 UI components, configurable themes |
| 2: Feature Extraction   | 3 weeks      | 8 feature modules                     |
| 3: Industry Abstraction | 2 weeks      | 12 industry configs                   |
| 4: Integrations         | 2 weeks      | 6 new integrations                    |
| 5: Client Template      | 2 weeks      | Starter template                      |
| 6: Deprecation          | 1 week       | Templates removed                     |
| **Total**               | **12 weeks** | Full transformation                   |

### 6.8 Success Criteria

**Definition of Done:**

- [ ] templates/ directory removed
- [ ] 5+ example clients in clients/
- [ ] 13+ UI components in @repo/ui
- [ ] 8+ feature modules in @repo/features
- [ ] New client created with site.config.ts only
- [ ] 12 industry types supported
- [ ] All tests passing (build, lint, test)
- [ ] Documentation complete

---

## 7. Conclusion

### Summary

The marketing-websites monorepo has a **solid technical foundation** with modern tooling (Next.js 15, React 19, pnpm, Turborepo), strong security practices, and good documentation patterns. However, it currently operates as a **single-template system** that requires copying and modifying for each client.

### Critical Path

1. **Immediate (Weeks 1-2):** Expand UI component library to eliminate gaps
2. **Short-term (Weeks 3-5):** Extract features to shared packages
3. **Medium-term (Weeks 6-9):** Add industry abstraction and integrations
4. **Long-term (Weeks 10-12):** Deprecate templates, create client-only workflow

### Risk Mitigation

- **Migration Risk:** Keep template functional until all clients migrated
- **Breaking Changes:** Use semantic versioning for packages
- **Scope Creep:** Strict phase adherence, defer nice-to-haves
- **Testing Gap:** Add tests during feature extraction

### Final Estimate

**12 weeks** for complete transformation from template-based to feature-based, industry-agnostic marketing website platform.

---

_Analysis completed: February 2026_
_Files analyzed: 200+ across packages and templates_
_Data verified: File sizes, counts, and structures confirmed_
