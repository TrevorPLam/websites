<!--
/**
 * @file docs/archive/REPODETAILED.md
 * @role docs (archived)
 * @summary Comprehensive AI-readable repository reference — architecture, patterns, data flow, features, integrations, known issues, roadmap.
 * ARCHIVED: 2026-02-19 — Moved from root; use README.md, CLAUDE.md, and docs/ for current guidance.
 */
-->

**Archived:** This document was moved from the repository root to reduce documentation sprawl. For current guidance, see [README.md](../../README.md) and [CLAUDE.md](../../CLAUDE.md).

---

# Marketing Websites Platform

> **Multi-industry marketing website template system** — A modern monorepo for creating and managing client websites across all industries with configuration-driven architecture.

[![Node.js](https://img.shields.io/badge/Node.js-22.0.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.29.2-blue.svg)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎯 Overview

Professional multi-industry marketing website template system built with modern web technologies. This monorepo provides **ready-to-use templates** for businesses across all industries and enables you to **create and manage unlimited client projects** from a single, well-structured repository.

**Vision:** Transform from template-based to feature-based, industry-agnostic marketing website platform with configuration-as-code architecture (CaCA). Every aspect of a client website — theming, page composition, feature selection, SEO schema — is driven by a validated `site.config.ts`.

### Current Status

**Phase:** Wave 0 Complete → Wave 1 In Progress  
**Timeline:** 12 weeks | **Current State:** Config-driven clients (6 industry clients) → **Target:** 12 industries, 20+ components

> **Quality gates:** Run `pnpm lint type-check build test` to verify. Historical issue analysis is in [docs/archive/ISSUES.md](docs/archive/ISSUES.md).

| Layer  | Package                      | Status             | Progress                                                                        |
| ------ | ---------------------------- | ------------------ | ------------------------------------------------------------------------------- |
| **L0** | `@repo/infra`                | 🟢 Complete        | Security, middleware, logging, 7 env schemas                                    |
| **L2** | `@repo/ui`                   | 🟡 In Progress     | 9+ UI primitives (Button, Dialog, Input, Slider, Toast, etc.)                   |
| **L2** | `@repo/marketing-components` | 🟡 Partial         | Package exists; scaffolded component families                                   |
| **L2** | `@repo/features`             | 🟡 Partial         | 5 features (booking, contact, blog, services, search); all tests pass           |
| **L2** | `@repo/types`                | 🟢 Complete        | Shared TypeScript types/interfaces                                              |
| **L2** | `@repo/infrastructure-*`     | 🟡 Partial         | tenant-core, theme, layout, ui (type-check fails in infrastructure-ui)          |
| **L3** | `@repo/page-templates`       | 🔴 Scaffolded Only | All 7 templates are NotImplementedPlaceholder                                   |
| **L3** | `clients/starter-template`   | 🟢 Active          | Golden-path template (port 3101, next-intl, Docker)                             |
| **L3** | `clients/luxe-salon`, etc.   | 🟡 Partial         | 6 industry clients (bistro-central, chen-law, sunrise-dental, urban-outfitters) |

See task specs in [tasks/](../../tasks/) (e.g. [tasks/archive/0-4-fix-toast-sonner-api.md](../../tasks/archive/0-4-fix-toast-sonner-api.md)) and [docs/architecture/README.md](../architecture/README.md) for architecture details. **Related:** [CLAUDE.md](CLAUDE.md) (AI assistant guide), [THEGOAL.md](THEGOAL.md) (target architecture), [docs/archive/ISSUES.md](docs/archive/ISSUES.md) (known issues), [docs/architecture/](docs/architecture/) (module boundaries, dependency graph).

### Key Features

- 🎨 **Industry Templates** - Ready-to-use templates (starting with hair salon, expandable to all industries)
- 🚀 **Multi-Client Support** - Manage unlimited client projects in one repository
- 🔧 **Highly Customizable** - Configuration-driven architecture with easy branding and feature customization
- 📦 **Shared Components** - Reusable UI primitives, marketing components, and features across templates
- 🏗️ **Modern Architecture** - Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4
- 🔒 **Production-Ready** - Security, performance, and SEO optimized
- 📱 **Responsive** - Mobile-first design approach
- ♿ **Accessible** - WCAG 2.2 AA compliance built-in
- 🎯 **Marketing-First** - Conversion optimization features (planned)
- 🔐 **Privacy-First** - Consent-gated analytics, GDPR/CCPA compliant

---

## Architecture Deep-Dive

**Layer model with full dependency direction:**

```mermaid
graph TD
    Clients[clients/] --> PageTemplates[@repo/page-templates]
    Clients --> Features[@repo/features]
    Clients --> Marketing[@repo/marketing-components]
    PageTemplates --> Marketing
    PageTemplates --> Features
    Features --> UI[@repo/ui]
    Features --> Infra[@repo/infra]
    Marketing --> UI
    UI --> Utils[@repo/utils]
    Infra --> Integrations[@repo/integrations-*]
```

**Module boundaries** ([docs/architecture/module-boundaries.md](docs/architecture/module-boundaries.md)):

- **Allowed:** clients → @repo/\* via public exports; features → ui, utils, types, infra; marketing → ui; page-templates → marketing, features
- **Blocked:** clients/A → clients/B; packages → clients; deep imports (@repo/_/src/_)
- **Enforcement:** ESLint no-restricted-imports, pnpm validate-exports, CI lint

**@repo/infra subpath exports:** `@repo/infra` (main: security, middleware, logging), `@repo/infra/client` (client-safe logger, Sentry, request context), `@repo/infra/env`, `@repo/infra/env/validate`, `@repo/infra/context/request-context`, `@repo/infra/context/request-context.server`, `@repo/infra/security/request-validation`, `@repo/infra/security/sanitize`, `@repo/infra/security/rate-limit`, `@repo/infra/security/csp`, `@repo/infra/security/security-headers`, `@repo/infra/logger`, `@repo/infra/sentry/sanitize`, `@repo/infra/sentry/client`, `@repo/infra/sentry/server`, `@repo/infra/middleware/create-middleware`

**Additional infra modules (design tokens, composition):** variants/ (cva, composeVariants, extendVariants, cx, tw), typography/ (TYPE_SCALE, LINE_HEIGHT_SCALE, FONT_STACKS, getTypographyCssVars), spacing/ (SPACING_SCALE, SEMANTIC_SPACING, pxToRem, getSpacingCssVars), shadow/ (SHADOW_SCALE, getShadowCssVars, coloredShadow), color/ (parseHsl, formatHsl, hslToCss, adjustLightness, REQUIRED_COLOR_KEYS), border/ (RADIUS_SCALE, BORDER_WIDTH_SCALE, getRadiusCssVars), accessibility/ (Keys, createRovingTabIndex, handleMenuKeys, focusTrap, useAria, useFocusTrap), composition/ (Slot, createSafeContext, composeProviders, withDisplayName, withConditionalRender)

---

## Configuration-as-Code (CaCA)

**Full SiteConfig schema** ([packages/types/src/site-config.ts](packages/types/src/site-config.ts)):

| Section                          | Purpose             | Key Fields / Types                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                             | Machine-readable ID | string (e.g. "luxe-salon")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `name`, `tagline`, `description` | Branding            | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `url`                            | Canonical URL       | string, no trailing slash                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `industry`                       | 12-industry enum    | salon, restaurant, law-firm, dental, medical, fitness, retail, consulting, realestate, construction, automotive, general                                                                                                                                                                                                                                                                                                                                                                                   |
| `features`                       | Section variants    | hero: centered/split/video/carousel \| null; services: grid/list/tabs/accordion \| null; team: grid/carousel/detailed \| null; testimonials: carousel/grid/marquee \| null; pricing: table/cards/calculator \| null; contact: simple/multi-step/with-booking \| null; gallery: grid/carousel/lightbox \| null; blog, booking, faq: boolean; industry flags: location, menu, portfolio, caseStudy, jobListing, course, resource, comparison, filter, search, socialProof, video, audio, interactive, widget |
| `integrations`                   | Provider selection  | analytics (google/plausible/none), crm (hubspot/none), booking (internal/calendly/acuity/none), email, chat, reviews, maps, abTesting                                                                                                                                                                                                                                                                                                                                                                      |
| `navLinks`, `socialLinks`        | Nav structure       | NavLink[], SocialLink (platform + url)                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `footer`                         | Footer layout       | columns (heading + links), legalLinks, copyrightTemplate with {year}                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `contact`                        | Business info       | email, phone?, address?, hours? (BusinessHours[])                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `theme`                          | HSL palette         | colors (17 keys), fonts (heading, body, accent?), borderRadius, shadows                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `conversionFlow`                 | Discriminated union | booking: serviceCategories, timeSlots, maxAdvanceDays; contact: subjects?; quote; dispatch: urgencyLevels                                                                                                                                                                                                                                                                                                                                                                                                  |
| `seo`                            | Meta + schema       | titleTemplate, defaultDescription, ogImage?, twitterHandle?, schemaType?                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**Industry configs** ([packages/types/src/industry-configs.ts](packages/types/src/industry-configs.ts)) — per-industry defaults:

| Industry     | schemaType                  | defaultIntegrations           |
| ------------ | --------------------------- | ----------------------------- |
| salon        | HairSalon                   | booking:internal, crm:hubspot |
| restaurant   | Restaurant                  | booking:calendly              |
| law-firm     | LegalService                | crm:hubspot                   |
| dental       | Dentist                     | booking:internal              |
| medical      | MedicalClinic               | booking:calendly              |
| fitness      | HealthClub                  | booking:internal              |
| retail       | Store                       | —                             |
| consulting   | ProfessionalService         | —                             |
| realestate   | RealEstateAgent             | —                             |
| construction | HomeAndConstructionBusiness | —                             |
| automotive   | AutoRepair                  | booking:internal              |
| general      | LocalBusiness               | —                             |

**Zod schema:** `siteConfigSchema` exported for runtime validation at build/bootstrap. See [CLAUDE.md](CLAUDE.md) for CaCA usage.

---

## Data Flow

**End-to-end flow:**

```
HTTP Request → middleware (next-intl: locale, redirect / → /en)
    → app/layout.tsx (lang, dir from getLocaleDir)
    → app/[locale]/layout.tsx
          ├─ ThemeInjector(theme.colors) → <style> :root { --primary: hsl(...); }
          ├─ metadata: title (siteConfig.name), template (siteConfig.seo.titleTemplate), description
          ├─ NextIntlClientProvider(messages)
          └─ <main id="main-content">{children}</main>
    → app/[locale]/page.tsx (or services, about, contact, book, blog, blog/[slug])
          └─ import siteConfig from '@/site.config'
          └─ HomePageTemplate({ config: siteConfig })
                └─ import '../sections/home'  // side-effect: registerSection
                └─ composePage({ page: 'home' }, config)
                      ├─ getSectionsForPage('home', config.features) → ['hero-split','services-preview','team','testimonials','pricing','cta']
                      ├─ for each id: sectionRegistry.get(id) → Section component
                      └─ React.createElement(Section, { siteConfig, searchParams })
                            └─ Adapter: config.name, config.tagline → HeroSplit props
```

**composePage** ([packages/page-templates/src/registry.ts](packages/page-templates/src/registry.ts)): Resolves `sections` from `config.sections` or `getSectionsForPage(config.page, siteConfig.features)`; maps each section ID to `sectionRegistry.get(id)`; renders each Section with `{ siteConfig, searchParams }`.

**Types** ([packages/page-templates/src/types.ts](packages/page-templates/src/types.ts)): `TemplateConfig` (sections?, page?, searchParams?), `SectionProps` (id?, children?, siteConfig, searchParams), `PageTemplateProps` (config: SiteConfig, searchParams?).

---

## Section Registry — All Registered Sections

| File         | Sections registered                                                                                                                                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| home.tsx     | hero-split, hero-centered, hero-video, hero-carousel, services-preview, team, testimonials, pricing, cta                                                                                                                                      |
| services.tsx | services-grid, services-list, services-tabs, services-accordion                                                                                                                                                                               |
| about.tsx    | about-story, about-team, about-testimonials, about-cta                                                                                                                                                                                        |
| contact.tsx  | contact-form, contact-info                                                                                                                                                                                                                    |
| booking.tsx  | booking-form                                                                                                                                                                                                                                  |
| blog.tsx     | blog-grid, blog-pagination, blog-post-content, blog-related-posts, blog-cta                                                                                                                                                                   |
| features.tsx | feature-analytics, feature-chat, feature-ab-testing                                                                                                                                                                                           |
| industry.tsx | industry-location, industry-menu, industry-portfolio, industry-course, industry-resource, industry-comparison, industry-filter, industry-search, industry-social-proof, industry-video, industry-audio, industry-interactive, industry-widget |

**getSectionsForPage(page, features):** home → hero-{features.hero}, services-preview, team, testimonials, pricing, cta; services → services-{features.services}; about → about-hero, about-team?, about-testimonials?, about-cta; contact → contact-form, contact-info; blog-index → blog-grid, blog-pagination?; blog-post → blog-post-content, blog-related-posts, blog-cta; booking → booking-form.

---

## Section Adapter Patterns

**Hero adapter** ([packages/page-templates/src/sections/home.tsx](packages/page-templates/src/sections/home.tsx)): `HeroSplitAdapter` reads `getSiteConfig(props)` and passes `config.name`, `config.tagline`, `config.description`, and first navLink as CTA to `<HeroSplit />`; `registerSection('hero-split', HeroSplitAdapter)`.

**Booking adapter** ([packages/page-templates/src/sections/booking.tsx](packages/page-templates/src/sections/booking.tsx)): If `config.conversionFlow.type !== 'booking'` returns null; else `createBookingConfig(config.conversionFlow)` → `BookingFeatureConfig`; renders `<BookingForm config={bookingConfig} prefilledService={searchParams['service']} />`.

**Contact adapter** ([packages/page-templates/src/sections/contact.tsx](packages/page-templates/src/sections/contact.tsx)): `createContactConfig({ successMessage })` with message e.g. "Thank you for contacting {config.name}!"; `ContactForm({ config: contactConfig, onSubmit: defaultContactHandler })`.

**createBookingConfig** ([packages/features/src/booking/lib/booking-config.ts](packages/features/src/booking/lib/booking-config.ts)): Maps `BookingFlowConfig` → `BookingFeatureConfig` (services from serviceCategories with id+label, timeSlots, maxAdvanceDays).

---

## Theme System

**ThemeInjector** ([packages/ui/src/components/ThemeInjector.tsx](packages/ui/src/components/ThemeInjector.tsx)): Server component. Bare HSL strings (e.g. `"174 85% 33%"`) are wrapped as `hsl(174 85% 33%)`; full CSS colors passed through. Renders `<style>` with `:root { --primary: ...; }`. Input: `siteConfig.theme.colors` (17 keys). Selector default `:root`. tailwind-theme.css references these variables.

---

## Feature Modules — Full Detail

| Feature                                                              | components/                           | lib/                                                               | Key pattern                                                                                 |
| -------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| booking                                                              | BookingForm                           | booking-actions, booking-schema, booking-config, booking-providers | submitBookingRequest; rate limit (checkRateLimit), IP (getValidatedClientIp), provider sync |
| contact                                                              | ContactForm, ContactFormStandard      | contact-actions, contact-config, contact-schema                    | createContactConfig(successMessage); ContactSubmissionHandler                               |
| blog                                                                 | BlogPostContent                       | blog.ts, blog-content-source, blog-mdx-source                      | BlogContentSource adapter; MDX                                                              |
| services                                                             | ServicesOverview, ServiceDetailLayout | —                                                                  | Presentational; data from template                                                          |
| search                                                               | SearchDialog, SearchPage              | search-index, filter-items                                         | getSearchIndex(config)                                                                      |
| localization                                                         | —                                     | format, rtl (getLocaleDir), routing                                | i18n                                                                                        |
| team                                                                 | TeamSection                           | team-schema                                                        | —                                                                                           |
| testimonials                                                         | TestimonialsSection                   | testimonial-schema, testimonial-actions                            | —                                                                                           |
| gallery                                                              | GallerySection                        | gallery-schema                                                     | —                                                                                           |
| pricing                                                              | PricingSection                        | pricing-schema                                                     | —                                                                                           |
| newsletter, analytics, ab-testing, chat                              | (various)                             | \*-config                                                          | —                                                                                           |
| ecommerce, authentication, payment, content-management, notification | —                                     | \*-config                                                          | —                                                                                           |

**Server action flow (booking-actions.ts):** `submitBookingRequest(data, config)` → createBookingFormSchema(config), checkRateLimit, validateBookingSecurity, getValidatedClientIp, hashIp, getBookingProviders, revalidatePath('/book').

---

## Environment Schemas

**base** ([packages/infra/env/schemas/base.ts](packages/infra/env/schemas/base.ts)): NODE_ENV (default development), SITE_URL (default http://localhost:3000), SITE_NAME (default "Hair Salon Template"), ANALYTICS_ID (optional).

**supabase** ([packages/infra/env/schemas/supabase.ts](packages/infra/env/schemas/supabase.ts)): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — **pair required** (both or neither); isSupabaseEnabled().

**rate-limit:** UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN — **pair**; falls back to in-memory.

**hubspot:** HUBSPOT_PRIVATE_APP_TOKEN.

**booking** ([packages/infra/env/schemas/booking.ts](packages/infra/env/schemas/booking.ts)): MINDBODY*API_KEY + MINDBODY_BUSINESS_ID, VAGARO*\_, SQUARE\_\_ — **pairs per provider**.

**sentry:** NEXT_PUBLIC_SENTRY_DSN (client-safe), sample rate.

**public:** Client-safe vars (NEXT*PUBLIC*\*).

**Validation:** validateEnv(), safeValidateEnv(), createEnvSchema(), getFeatureFlags(), validateEnvForEnvironment().

---

## Integration Packages

**Aggregate (contract + adapters):** scheduling (Calendly, Acuity, Cal.com) — getEventTypes, getBookingUrl, getEmbedConfig; email (Mailchimp, SendGrid, ConvertKit) — subscribe, unsubscribe, sendEvent; chat (Intercom, Crisp, Tidio) — getEmbedConfig; reviews (Google, Yelp, Trustpilot) — getReviews; maps (Google Maps) — getStaticMapUrl, getEmbedConfig.

**Standalone:** analytics (trackEvent, consent-gated), hubspot (searchContact, upsertContact), supabase (insertLead, getSupabaseClient).

**Status:** 14 packages exist; **none wired into clients yet** — scaffolded only.

---

## Industry Schemas

**@repo/industry-schemas** ([packages/industry-schemas/src/index.ts](packages/industry-schemas/src/index.ts)): `generateOrganizationJsonLd(siteConfig, industryConfig?)` uses `siteConfig.seo?.schemaType ?? getIndustryConfig(siteConfig.industry).schemaType` and builds schema.org JSON-LD (name, description, url, image, address, contactPoint, openingHoursSpecification). Output: Organization/LocalBusiness/HairSalon/Restaurant etc.

---

## Marketing Components

**Core families:** hero, services, team, testimonials, pricing, gallery, stats, cta, faq, navigation, footer, blog.

**Industry-specific:** product, event, location, menu, portfolio, case-study, job-listing, course, resource, comparison, filter, search, social-proof, video, audio, interactive, widget.

**Experiments:** framing (experiments/framing).

**Variants:** HeroCentered, HeroSplit, HeroVideo, HeroCarousel; ServiceGrid, ServiceList, ServiceTabs, ServiceAccordion; TestimonialCarousel, TestimonialGrid, TestimonialMarquee; etc.

---

## Client Structure & Validation

**starter-template app routes:** app/layout.tsx (root: lang, dir); app/[locale]/layout.tsx (ThemeInjector, metadata, NextIntlProvider, main); app/[locale]/page.tsx (HomePageTemplate); app/[locale]/services, about, contact, book, blog, blog/[slug]; app/api/health/route.ts.

**middleware** ([clients/starter-template/middleware.ts](clients/starter-template/middleware.ts)): next-intl createMiddleware(routing); matcher excludes api, \_next, \_vercel, static files.

**validate-client** ([scripts/validate-client.ts](scripts/validate-client.ts)): Checks site.config.ts exists and parses; package.json has @clients/ name; app/ has layout + page; tsconfig extends base. **Cross-client import scan:** app/, components/ scanned for `@clients/` — forbidden. Exits 0/1; API: validateClient(clientPath, root?, opts?).

**Port mapping:** starter-template 3101, luxe-salon 3102. **Client divergence** ([docs/archive/ISSUES.md](docs/archive/ISSUES.md)): starter has next.config.js (standalone, next-intl); other clients next.config.ts (minimal, no next-intl).

---

## Quality Gates & Known Issues

**CRITICAL (blocking CI):** 1) Toast.tsx Sonner API — toast.custom ReactNode vs ReactElement; toast.promise arg count. 2) validate-workspaces — package.json workspaces omit ai-platform, content-platform, marketing-ops, infrastructure, tooling. 3) booking-actions tests (4 fail) — confirmBooking, cancelBooking, getBookingDetails ignore verification params; IDOR risk. 4) @repo/marketing-components build — no dist output; Turbo warning.

**HIGH:** 5) Page templates NotImplementedPlaceholder in some paths (registry implemented — verify). 6) Integration packages unused by clients. 7) ESLint 9: many packages lack eslint.config.mjs. 8) @repo/marketing-components type-check fails (unused imports, ServiceAccordion, Toast).

**MEDIUM:** 9) Client Next.js config divergence. 10) Client i18n/routing inconsistency.

**CI pipeline** ([.github/workflows/ci.yml](.github/workflows/ci.yml)): lint (PR: affected via --filter="...[origin/main]"), type-check, validate-exports, validate-marketing-exports, validate-all-clients, madge:circular, syncpack:check, build, test:coverage; quality-audit: knip, SBOM, audit (non-blocking). See [docs/ci/required-checks.md](docs/ci/required-checks.md).

---

## Testing

**Jest** (jest.config.js): node (packages/utils, infra, features/**/lib), jsdom (packages/ui, features/**/components). **ResizeObserver** (jest.setup.js): polyfill for Radix Slider. **Parity tests:** packages/features/**tests**/parity/ — extraction vs original template. **UI tests:** packages/ui/src/components/**tests**/ — Button, Dialog, Input, Label, Slider, Alert, Checkbox; @testing-library/react, jest-axe, userEvent.

---

## Roadmap & File Reference Map

**THEGOAL.md target:** 136 tasks; templates/ deleted; 7 page templates fully composed; turbo gen new-client; tooling (create-client, validation, generate-component); docs (adr, migration, governance, reliability, ux, strategy).

**File map:**

| Concern                | Primary Files                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| SiteConfig type/schema | packages/types/src/site-config.ts                                                                     |
| Industry configs       | packages/types/src/industry-configs.ts                                                                |
| Section registry       | packages/page-templates/src/registry.ts                                                               |
| Section adapters       | packages/page-templates/src/sections/{home,services,about,contact,booking,blog,features,industry}.tsx |
| Page template types    | packages/page-templates/src/types.ts                                                                  |
| ThemeInjector          | packages/ui/src/components/ThemeInjector.tsx                                                          |
| Starter layout         | clients/starter-template/app/[locale]/layout.tsx                                                      |
| Starter middleware     | clients/starter-template/middleware.ts                                                                |
| Booking config         | packages/features/src/booking/lib/booking-config.ts                                                   |
| Booking actions        | packages/features/src/booking/lib/booking-actions.ts                                                  |
| Contact config         | packages/features (createContactConfig)                                                               |
| Env schemas            | packages/infra/env/schemas/\*.ts                                                                      |
| Module boundaries      | docs/architecture/module-boundaries.md                                                                |
| Target architecture    | THEGOAL.md                                                                                            |
| Known issues           | docs/archive/ISSUES.md                                                                                |
| Validate client        | scripts/validate-client.ts                                                                            |
| CI workflow            | .github/workflows/ci.yml                                                                              |
| Turbo config           | turbo.json                                                                                            |
| Version catalog        | pnpm-workspace.yaml catalog                                                                           |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>=22.0.0` (enforced via [package.json engines](package.json))
- **pnpm** `10.29.2` exactly (enforced via [packageManager](package.json))

> **Note:** pnpm version is strictly enforced. Install with `npm install -g pnpm@10.29.2` or use [Corepack](https://nodejs.org/api/corepack.html).

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd marketing-websites

# Install all dependencies
pnpm install
```

### Development

```bash
# Start the starter template development server
cd clients/starter-template
pnpm dev

# Or use workspace filter (runs on port 3101)
pnpm --filter @clients/starter-template dev

# Build all packages and projects
pnpm build

# Run quality checks
pnpm lint          # ESLint across workspace
pnpm type-check    # TypeScript type checking
pnpm test          # Jest tests
pnpm format        # Format with Prettier
```

### Creating a New Client Project

**Step 1: Copy the template**

```bash
# Copy starter template to create a new client
cp -r clients/starter-template clients/my-client-name
```

**Step 2: Configure the client**

```bash
cd clients/my-client-name

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# Update site.config.ts with client-specific settings
```

**Step 3: Add to workspace**

The `clients/` directory is already included in `pnpm-workspace.yaml`, so new clients are automatically part of the workspace.

**Step 4: Install and run**

```bash
# Install dependencies (from root)
pnpm install

# Start development server (use unique port)
pnpm --filter @clients/my-client-name dev --port 3001
```

For detailed instructions, see:

- **[Developer Onboarding](docs/getting-started/onboarding.md)** - Complete setup guide
- **[Build First Client](docs/tutorials/build-first-client.md)** - Step-by-step tutorial

## 📁 Project Structure

```
marketing-websites/
├── clients/                      # Client implementations
│   ├── starter-template/        # Golden-path template (@clients/starter-template, port 3101)
│   ├── luxe-salon/              # Salon industry
│   ├── bistro-central/          # Restaurant industry
│   ├── chen-law/                # Law firm
│   ├── sunrise-dental/          # Dental practice
│   ├── urban-outfitters/        # Retail
│   └── [client-name]/           # Your client projects
│
├── packages/                     # Shared packages (Layer 0-2)
│   ├── ui/                      # @repo/ui - UI primitives (Button, Input, Dialog, Toast, etc.)
│   ├── features/                 # @repo/features - Feature modules (booking, contact, blog)
│   ├── marketing-components/    # @repo/marketing-components - Hero, services, testimonials
│   ├── page-templates/          # @repo/page-templates - Page layouts (scaffolded placeholders)
│   ├── types/                   # @repo/types - Shared TypeScript types
│   ├── utils/                   # @repo/utils - Utility functions (cn, etc.)
│   ├── infra/                   # @repo/infra - Security, middleware, logging, env schemas
│   ├── industry-schemas/        # @repo/industry-schemas - JSON-LD per industry
│   ├── integrations/            # 20+ integration packages
│   │   ├── analytics/           # @repo/integrations-analytics
│   │   ├── hubspot/             # @repo/integrations-hubspot
│   │   ├── supabase/            # @repo/integrations-supabase
│   │   ├── scheduling/          # @repo/integrations-scheduling (Calendly, Acuity, Cal.com)
│   │   ├── chat/                # @repo/integrations-chat (Intercom, Crisp, Tidio)
│   │   ├── reviews/             # @repo/integrations-reviews (Google, Yelp, Trustpilot)
│   │   ├── maps/                # @repo/integrations-maps
│   │   └── ...                  # acuity, calendly, convertkit, mailchimp, sendgrid, etc.
│   ├── ai-platform/             # @repo/ai-platform-* (agent-orchestration, llm-gateway, content-engine)
│   ├── content-platform/       # dam-core, visual-editor
│   ├── marketing-ops/           # campaign-orchestration
│   ├── infrastructure/          # tenant-core, theme, layout, ui
│   └── config/                  # eslint-config, typescript-config
│
├── tooling/                     # Dev tooling
│   ├── create-client/           # @repo/create-client
│   ├── generate-component/     # @repo/generate-component
│   └── validation/              # @repo/validation
│
├── docs/                        # Documentation hub
│   ├── getting-started/         # Onboarding guides
│   ├── tutorials/               # Step-by-step tutorials
│   ├── architecture/            # Architecture documentation
│   ├── ci/                      # CI/CD (required-checks.md)
│   └── ...
│
├── tasks/                       # Task specifications (e.g. 0-4-fix-toast-sonner-api.md)
├── scripts/                     # validate-documentation, validate-exports, validate-workspaces
├── docker-compose.yml           # Docker Compose configuration
├── turbo.json                   # Turborepo pipeline config
├── pnpm-workspace.yaml          # Workspace globs + version catalog
└── package.json                 # Root package.json
```

### Architecture Layers

- **Layer 0 (Infrastructure):** `@repo/infra`, `@repo/integrations-*` - Security, middleware, logging, env schemas
- **Layer 2 (Components):** `@repo/ui`, `@repo/marketing-components`, `@repo/features`, `@repo/infrastructure-*` - Reusable components
- **Layer 3 (Experience):** `@repo/page-templates`, `clients/` - Composed sites

See [Architecture Overview](docs/architecture/README.md) for detailed architecture documentation.

## 🛠️ Technology Stack

All versions verified against [package.json](package.json) and [pnpm-workspace.yaml](pnpm-workspace.yaml):

| Category               | Technology   | Version  | Source                                                                         |
| ---------------------- | ------------ | -------- | ------------------------------------------------------------------------------ |
| **Runtime**            | Node.js      | >=22.0.0 | [package.json](package.json)                                                   |
| **Package Manager**    | pnpm         | 10.29.2  | [package.json](package.json)                                                   |
| **Frontend Framework** | Next.js      | 16.1.5   | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **UI Library**         | React        | 19.0.0   | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Styling**            | Tailwind CSS | 4.1.0    | [clients/starter-template/package.json](clients/starter-template/package.json) |
| **Type Safety**        | TypeScript   | 5.9.3    | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Linting**            | ESLint       | 9.18.0   | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Code Formatting**    | Prettier     | 3.8.1    | [package.json](package.json)                                                   |
| **Monorepo Tool**      | Turbo        | 2.8.10   | [package.json](package.json)                                                   |
| **Testing**            | Jest         | 30.2.0   | [package.json](package.json)                                                   |
| **Database**           | Supabase     | -        | PostgreSQL with RLS                                                            |
| **Error Tracking**     | Sentry       | 10.38.0  | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Container**          | Docker       | -        | [docker-compose.yml](docker-compose.yml)                                       |

### Key Dependencies

- **UI Components:** Radix UI primitives, Lucide React icons, Sonner toast notifications
- **Forms:** React Hook Form with Zod validation
- **Content:** MDX support with next-mdx-remote
- **Analytics:** Consent-gated analytics integration
- **CRM:** HubSpot integration for contact forms

## 📚 Documentation

### Getting Started

- **[📚 Documentation Hub](docs/README.md)** - Central navigation for all documentation
- **[Developer Onboarding](docs/getting-started/onboarding.md)** - Complete setup guide (2-4 hours)
- **[Troubleshooting Guide](docs/getting-started/troubleshooting.md)** - Common issues and solutions
- **[Learning Paths](docs/resources/learning-paths.md)** - Role-based learning guides

### Tutorials

- **[Build Your First Client](docs/tutorials/build-first-client.md)** - Step-by-step client creation
- **[Create a Custom Component](docs/tutorials/create-component.md)** - Component development guide
- **[Set Up Integrations](docs/tutorials/setup-integrations.md)** - Third-party service integration

### Architecture & Development

- **[Architecture Overview](docs/architecture/README.md)** - System architecture with visual diagrams
- **[Visual Architecture Guide](docs/architecture/visual-guide.md)** - Visual representations and flows
- **[Module Boundaries](docs/architecture/module-boundaries.md)** - Dependency rules and constraints
- **[Dependency Graph](docs/architecture/dependency-graph.md)** - Visual dependency mapping

### Reference Materials

- **[Glossary](docs/resources/glossary.md)** - Technical terms and concepts
- **[FAQ](docs/resources/faq.md)** - Frequently asked questions
- **[Component Library](docs/components/ui-library.md)** - UI component documentation

### Operations & Security

- **[Documentation Maintenance](docs/operations/maintenance.md)** - Documentation maintenance processes
- **[SECURITY.md](SECURITY.md)** - Security policy and vulnerability reporting
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes

### Standards & Guidelines

- **[Documentation Standards](docs/DOCUMENTATION_STANDARDS.md)** - Writing and formatting standards
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards

### Planning & Roadmap

- **[tasks/](../../tasks/)** - Task specifications (e.g. [tasks/archive/0-4-fix-toast-sonner-api.md](../../tasks/archive/0-4-fix-toast-sonner-api.md)), implementation backlog

## 🧪 Available Scripts

### Workspace Commands

| Command                     | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `pnpm install`              | Install all dependencies                          |
| `pnpm build`                | Build all packages and projects                   |
| `pnpm dev`                  | Start development servers (via Turbo)             |
| `pnpm lint`                 | Run ESLint across workspace                       |
| `pnpm type-check`           | Run TypeScript type checking                      |
| `pnpm test`                 | Run Jest tests                                    |
| `pnpm test:watch`           | Run tests in watch mode                           |
| `pnpm test:coverage`        | Generate test coverage report                     |
| `pnpm format`               | Format code with Prettier                         |
| `pnpm format:check`         | Check formatting without changes                  |
| `pnpm validate-docs`        | Validate documentation                            |
| `pnpm validate-docs:strict` | Validate documentation (strict mode)              |
| `pnpm validate-exports`     | Validate package exports                          |
| `pnpm validate:workspaces`  | Validate package.json vs pnpm-workspace.yaml sync |
| `pnpm knip`                 | Find unused dependencies and exports              |
| `pnpm syncpack:check`       | Check for dependency version mismatches           |
| `pnpm syncpack:fix`         | Fix dependency version mismatches                 |

### Client Commands

```bash
# Work on starter template (golden path)
pnpm --filter @clients/starter-template dev
pnpm --filter @clients/starter-template build

# Work on specific client (when created)
pnpm --filter @clients/my-client dev
pnpm --filter @clients/my-client build

# Run command in all clients
pnpm --filter "@clients/*" build
pnpm --filter "@clients/*" lint
```

## 🐳 Docker

Build and run locally with Docker Compose:

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The Docker Compose configuration includes:

- **Starter Template** - Available on `http://localhost:3101`

See [docker-compose.yml](docker-compose.yml) for configuration details and [docs/deployment/docker.md](docs/deployment/docker.md) for deployment documentation.

## 🤝 Contributing

We welcome contributions! Before contributing, please:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
2. Review [Code of Conduct](CODE_OF_CONDUCT.md) for community standards
3. Check [Documentation Standards](docs/DOCUMENTATION_STANDARDS.md) for writing guidelines

### Development Workflow

1. **Fork and clone** the repository
2. **Create a branch** for your changes (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the code standards
4. **Run quality checks** (`pnpm lint`, `pnpm type-check`, `pnpm test`)
5. **Commit** with clear messages
6. **Push** and create a pull request

### Quality Gates

All pull requests must pass:

- Linting (`pnpm lint`) — _many packages lack eslint.config.mjs_
- Type checking (`pnpm type-check`) — _currently fails in @repo/infrastructure-ui_
- Export validation (`pnpm validate-exports`)
- Marketing exports (`pnpm validate-marketing-exports`)
- Client validation (`pnpm validate-all-clients`)
- Circular deps (`pnpm madge:circular`)
- Dependency consistency (`pnpm syncpack:check`)
- Build (`pnpm build`)
- Tests (`pnpm test`) — _all 646 tests pass_

Workspace validation (`pnpm validate:workspaces`) passes; CI runs full pipeline on push, affected packages only on PRs.

See [docs/ci/required-checks.md](docs/ci/required-checks.md) for CI/CD details.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🆘 Support

For issues, questions, or suggestions:

1. **Check [FAQ](docs/resources/faq.md)** - Common questions and answers
2. **Review [Troubleshooting Guide](docs/getting-started/troubleshooting.md)** - Solutions to common issues
3. **Read [Documentation Hub](docs/README.md)** - Comprehensive documentation
4. **Open a GitHub Issue** - Report bugs or request features

## 🌟 Community

- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards and expectations
- **[Contributors](docs/CONTRIBUTORS.md)** - Recognition for contributors
- **[Documentation Standards](docs/DOCUMENTATION_STANDARDS.md)** - How we write documentation

## 📊 Project Status

**Last Updated:** 2026-02-19  
**Current Phase:** Wave 0 Complete → Wave 1 In Progress  
**Next Milestone:** Fix @repo/infrastructure-ui type-check; ensure full CI pipeline passes

For task specifications, see [tasks/](tasks/).

---

**Quick Links:**

- [🚀 Quick Start](#-quick-start)
- [📚 Documentation Hub](docs/README.md)
- [🏗️ Architecture](docs/architecture/README.md)
- [📁 Archived docs](docs/archive/)
- [🤝 Contributing](CONTRIBUTING.md)
- [📋 Task specs](tasks/)
