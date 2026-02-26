**THE COMPLETE MASTER REPOSITORY MANIFEST**
**Marketing Websites Monorepo — Definitive Architecture with Comprehensive Annotations**
*Version: 2.0 Synthesized | File Count: 1,124 | Architecture: FSD v2.1 + Zero-Trust Multi-Tenancy*

---

## 📁 ROOT LEVEL (52 files)
*The monorepo's nervous system—dependency orchestration, task automation, and architectural enforcement.*

```text
/
├── .commitlintrc.js                         # Conventional commit enforcement (feat:, fix:, security: scopes). Ensures changelog generation and semantic versioning automation.
├── .dockerignore                            # Multi-stage build exclusions. Prevents node_modules, .git, and local env files from bloating production images (target: <200MB final image).
├── .editorconfig                            # Universal formatting standard (2 spaces, LF, insert_final_newline). Enforced by IDE plugins to eliminate "formatting wars" in PRs.
├── .env                                     # Local development secrets (gitignored). Never committed; contains Clerk dev keys, Supabase local credentials.
├── .env.development                         # Default development variables (non-secret). Shared across team: API endpoints, feature flags defaults.
├── .env.example                             # Template with 34 documented variables. Onboarding checklist: copy to .env.local and fill blanks.
├── .env.production.local.example            # Production secrets template (AES-256 keys, Stripe live keys). Stored in 1Password/Vault, not LastPass.
├── .env.staging.local.example               # Staging environment template. Mirrors production but with sandbox credentials.
├── .eslintignore                            # Build artifacts exclusion (dist/, .next/, *.config.js). Speeds up linting by 40%.
├── .eslintrc.js                             # Root ESLint entry point. Imports tooling/eslint for shared rules; enforces import/no-cycle (critical for FSD).
├── .gitattributes                           # LFS for binary assets (fonts, images >1MB), linguist overrides for generated files (marks SQL migrations as "generated" to hide in PR diffs).
├── .gitignore                               # Global ignore strategy: node_modules, .next, dist, *.log, .turbo, coverage/. Critical: ignores .env.*.local.
├── .gitleaks.toml                           # Secret scanning with 78 regex patterns (AWS keys, Slack tokens, private keys). Prevents credential leakage in commits.
├── .gitleaksignore                          # False positives registry (e.g., test fixtures that look like keys but are dummy data).
├── .lintstagedrc.mjs                        # Pre-commit hook orchestration: runs lint + type-check + gitleaks only on staged files (speed: <3s per commit).
├── .markdownlint.json                       # Documentation style enforcement (MD013 line length, MD033 no inline HTML). Ensures consistent README formatting.
├── .nvmrc                                   # Node v20.11.0 (LTS). Enforced via `engine-strict` in .npmrc to prevent "works on my machine" with Node 18.
├── .npmrc                                   # PNPM strict mode, hoisting disabled (prevents phantom dependencies), shamefully-hoist=false for isolation.
├── .prettierignore                          # Generated files exclusion (lockfiles, dist, coverage reports).
├── .prettierrc.mjs                          # Prettier config importing plugin:prettier-plugin-tailwindcss for class sorting.
├── .size-limit.json                         # Bundle budgets (12 limits). Marketing page: <150KB, Dashboard: <300KB, Admin: <400KB. Fails CI on regression.
├── .syncpackrc.js                           # Dependency alignment rules. Enforces single version of React, Next.js across all 15 packages (prevents "dual React" bugs).
├── CHANGELOG.md                             # Semantic release history (auto-generated from conventional commits). Source of truth for release notes.
├── CODE_OF_CONDUCT.md                       # Contributor standards (CNCF-style). Defines harassment-free collaboration, enforcement contacts.
├── CONTRIBUTING.md                          # Development workflow bible: FSD slice creation, commit message format, PR checklist (includes security review checkbox).
├── LICENSE                                  # Apache 2.0. Permits commercial use, requires attribution. Enterprise-friendly.
├── Makefile                                 # Common commands abstraction: `make dev` (turbo run dev), `make test` (vitest), `make db-reset` (Docker compose down/up).
├── README.md                                # Project overview: quickstart (5 min), architecture diagrams (Mermaid), tech stack badges, contribution guidelines.
├── SECURITY.md                              # Security policy: reporting process (security@company.com), supported versions, disclosure timeline (90 days).
├── docker-compose.test.yml                  # Full integration test environment: Postgres 15 (RLS enabled), Redis (Upstash local), MinIO (S3 mock), Mailhog (SMTP capture), Elasticsearch (logs), mockserver (third-party APIs).
├── docker-compose.yml                       # Single service testing-not-a-client. Minimal local app container for Docker-based development.
├── knip.config.ts                           # Dead code detection. Finds unused exports (dead weight) and dependencies (bloat). Runs in CI to prevent accumulation.
├── madge.config.js                          # Circular dependency check. Fails build if FSD import rules violated (e.g., entities importing widgets).
├── package.json                             # Root workspace manifest: scripts orchestration (turbo), pnpm workspaces reference, engine requirements.
├── pnpm-lock.yaml                           # Lockfile integrity. Uses pnpm v9+ format with content-addressable store for disk efficiency.
├── pnpm-workspace.yaml                      # Catalog versions definition (Next 16.1.5, React 19). Single source of truth for dependency versions across packages.
├── repo-config.yml                          # Repository metadata for 2026 standards: tier (enterprise), AI-enabled (true), licenses (Apache 2.0), security contacts.
├── steiger.config.ts                        # FSD v2.1 architecture linter. Enforces @x notation for cross-imports, prohibits cross-layer violations (widgets→entities).
├── tsconfig.base.json                       # Base TypeScript (strictest settings: strict, noImplicitAny, exactOptionalPropertyTypes). All packages extend this.
├── tsconfig.json                            # Root project references for composite builds. Enables incremental compilation across 15 packages.
├── turbo.json                               # Turborepo pipeline definition: topological build order, remote caching configuration (Vercel), env var pass-through lists.
└── vitest.config.ts                         # Root test config (workspace mode). Defines projects: unit (node), integration (node + db), components (jsdom).
```

---

## 📁 .github/ (38 files)
*DevOps automation, security gates, and collaborative workflows. The CI/CD fortress.*

```text
.github/
├── CODEOWNERS                               # Package-level ownership. @platform-team owns infrastructure/, @product-team owns features/. Auto-assigns PR reviewers.
├── PULL_REQUEST_TEMPLATE.md                 # Mandatory security checklist: "I have tested RLS policies," "No secrets in code," "Bundle size checked."
├── FUNDING.yml                              # GitHub Sponsors configuration. Open source sustainability funding links.
├── dependabot.yml                           # Automated updates (backup to Renovate). Handles GitHub Actions version bumps.
├── ISSUE_TEMPLATE/
│   ├── bug_report.md                        # Structured bug template: reproduction steps, expected vs actual, environment (tenant-aware logs).
│   ├── feature_request.md                   # RFC-style template: problem statement, proposed solution, FSD slice impact, breaking changes assessment.
│   └── security_vulnerability.md            # Private issue template for CVE reports. Auto-labels as confidential.
├── actions/
│   ├── setup-node-pnpm/
│   │   ├── action.yml                       # Composite action: installs Node 20, pnpm 9, caches ~/.pnpm-store. Reusable across all workflows (DRY).
│   │   └── post-install.js                  # Post-setup script: verifies pnpm version, checks for frozen-lockfile compliance.
│   └── vercel-deploy/
│       ├── action.yml                       # Vercel deployment abstraction with environment URL output.
│       └── deployment-url.js                # Helper parsing Vercel deployment JSON for GitHub deployment status updates.
└── workflows/
    ├── ci-gates.yml                         # Phase 0 quick checks (2 min): lint (steiger + eslint), type-check, unit tests (changed packages only). Blocks PRs fast.
    ├── ci-thorough.yml                      # Phase 0 integration (8 min): full test suite, build all packages, database migration validation, security audit (snyk).
    ├── ci-nightly.yml                       # Phase 2 full matrix: tests against Node 18/20, Postgres 14/15, visual regression (Chromatic), load testing (k6).
    ├── security-audit.yml                   # Snyk + Trivy container scanning + gitleaks secret detection. Runs on schedule (daily) and PR (if dependencies changed).
    ├── tenant-isolation.yml                 # CRITICAL: RLS bypass attempts test. Spins up test DB, attempts cross-tenant reads, must fail. Production gate.
    ├── lighthouse.yml                       # Performance budgets enforcement: LCP <2.5s, CLS <0.1. Fails PR if marketing page regresses.
    ├── dependency-review.yml                # PR dependency audit: flags GPL licenses (incompatible with Apache 2.0), deprecated packages, known CVEs.
    ├── e2e.yml                              # Phase 1 Playwright E2E: Golden path tests (signup → lead → booking). Runs on deploy preview.
    ├── e2e-scheduled.yml                    # Nightly full suite: cross-browser (Chrome, Firefox, Safari), mobile viewports, accessibility (axe-core).
    ├── production-deploy.yml                # Phase 1 canary → full deployment: 5% traffic → health checks → 100%. Includes rollback trigger.
    ├── release.yml                          # Phase 2 semantic release: generates changelog, creates GitHub release, tags Docker images.
    ├── snapshot-release.yml                 # Phase 1 PR snapshot releases: publishes packages to npm with `pr-123` tag for testing.
    ├── cleanup-cache.yml                    # Weekly Turborepo remote cache cleanup (prevents storage bloat).
    └── stale.yml                            # Issue management: marks issues stale after 60 days, closes after 30 more. Keees backlog actionable.
```

---

## 📁 apps/web/ (312 files)
*The primary Next.js 16.1.5 application—multi-tenant marketing platform and dashboard. The revenue-generating engine.*

```text
apps/web/
├── .env.local                               # App-specific secrets (Clerk frontend API, Supabase anon key). Gitignored.
├── .env.example                             # App-specific template: public env vars (NEXT_PUBLIC_STRIPE_PK), private (RESEND_API_KEY).
├── README.md                                # App architecture docs: routing conventions, data fetching patterns, deployment notes.
├── eslint.config.js                         # App ESLint (Flat Config): extends root FSD rules, adds Next.js core-web-vitals plugin.
├── instrumentation.ts                       # Phase 0: OpenTelemetry + Sentry initialization. Registers trace exporters before app startup.
├── middleware.ts                            # Phase 0: Tenant resolution (280 lines). Custom domain/subdomain parsing → Redis cache → RLS context injection. Security: CVE-2025-29927 mitigation (blocks x-middleware-subrequest).
├── next-env.d.ts                            # Next.js TypeScript declarations (auto-generated). Do not edit.
├── next.config.ts                           # Phase 0: Next 16 config. PPR enabled (experimental), bundleAnalyzer (conditional), images (remotePatterns for tenant logos).
├── package.json                             # App dependencies: uses catalog: protocol for React/Next, specific versions for app-only libs (framer-motion).
├── playwright.config.ts                     # Phase 1: E2E config with 3 projects (chromium, mobile-chrome, tablet-safari). Storage state for auth persistence.
├── postcss.config.mjs                       # PostCSS + Tailwind v4 configuration. Uses @tailwindcss/postcss plugin.
├── tailwind.config.ts                       # Phase 0: Tailwind (imports presets from packages/config/tailwind). Content paths include widget files.
├── tsconfig.json                            # App TS config: extends base, sets strict mode, path aliases for @/ (src root).
├── vitest.config.ts                         # Unit test config: jsdom environment, setupFiles (msw server, cleanup).
├── vitest.setup.ts                          # Test environment initialization: MSW (Mock Service Worker), jsdom cleanup, Faker seeding for determinism.
│
├── public/                                  # Static assets served from CDN (Vercel Edge).
│   ├── favicon.ico                          # Legacy favicon fallback.
│   ├── favicon.svg                          # Vector favicon (light/dark mode support).
│   ├── manifest.json                        # PWA manifest: name, icons, theme_color (dynamic per tenant in future).
│   ├── robots.txt                           # Fallback (dynamic preferred at /robots.ts). Allows all, points to sitemap.
│   ├── sitemap.xml                          # Fallback (dynamic preferred at /sitemap.ts).
│   ├── .well-known/                         # Security and discovery standards.
│   │   ├── security.txt                     # Security contacts (Phase 0): email, PGP key link, policy URL. IETF standard.
│   │   └── change-password                  # Apple/password manager support (spec: https://w3c.github.io/webappsec-change-password-url/).
│   ├── fonts/                               # Self-hosted fonts (privacy compliance, no Google Fonts tracking).
│   │   ├── Inter-var.woff2                  # Phase 0: Variable font (weight 100-900). Single file, all weights. preload in layout.tsx.
│   │   ├── Inter-italic.var.woff2           # Italic variant for rich text.
│   │   └── CalSans-SemiBold.woff2           # Phase 1: Display font for marketing headlines (Cal Sans).
│   └── images/                              # Static image assets.
│       ├── og-default.jpg                   # Phase 0: Default Open Graph image (1200x630). Fallback when dynamic generation fails.
│       └── logo.svg                         # Phase 0: Default platform logo (tenant overrides via DB).
│
└── src/
    ├── app/                                 # Next.js App Router (thin adapters, FSD App layer).
    │   ├── layout.tsx                       # Phase 0: Root layout. Providers (TanStack Query, Clerk, Theme), font injection, metadata base.
    │   ├── page.tsx                         # Phase 0: Root redirect/landing. Redirects to /home or /dashboard based on auth state.
    │   ├── loading.tsx                      # Phase 0: Global loading UI (skeleton shell shown during suspense boundaries).
    │   ├── error.tsx                        # Phase 0: Error boundary (React Error Boundary). Catches render errors, shows friendly UI, reports to Sentry.
    │   ├── global-error.tsx                 # Phase 0: HTML error wrapper (catches layout.tsx errors). Minimal HTML for catastrophic failures.
    │   ├── not-found.tsx                    # Phase 0: 404 page with tenant-aware branding (reads tenant from middleware context).
    │   ├── icon.tsx                         # Phase 1: Dynamic favicon route (generate SVG with tenant color).
    │   ├── apple-icon.tsx                   # Phase 1: Apple touch icon route (180x180 PNG).
    │   ├── opengraph-image.tsx              # Phase 1: Dynamic OG image generation (1200x630) using @vercel/og (Edge Runtime).
    │   ├── twitter-image.tsx                # Phase 1: Twitter card image (summary_large_card format).
    │   ├── sitemap.ts                       # Phase 1: Dynamic sitemap generation (includes tenant pages from Page Builder).
    │   ├── robots.ts                        # Phase 1: Dynamic robots.txt (disallow admin paths, allow marketing).
    │   ├── manifest.ts                      # Phase 1: Dynamic PWA manifest (tenant-specific name/icons).
    │   │
    │   ├── (auth)/                          # Route group: Authentication pages (no layout shell, centered design).
    │   │   ├── layout.tsx                   # Phase 0: Centered auth layout, max-width 420px, gradient background.
    │   │   ├── login/
    │   │   │   └── page.tsx                 # Phase 0: Login page. Uses Clerk <SignIn /> component with custom appearance.
    │   │   ├── register/
    │   │   │   └── page.tsx                 # Phase 0: Registration. Clerk <SignUp />, redirects to onboarding.
    │   │   ├── forgot-password/
    │   │   │   └── page.tsx                 # Phase 0: Password reset request form.
    │   │   ├── reset-password/
    │   │   │   └── page.tsx                 # Phase 0: Password reset confirmation (token validation).
    │   │   ├── callback/
    │   │   │   └── route.ts                 # Phase 0: OAuth callback handler (Clerk, Google, GitHub).
    │   │   └── verify-email/
    │   │       └── page.tsx                 # Phase 0: Email verification confirmation.
    │   │
    │   ├── (marketing)/                     # Route group: Public marketing pages (SEO-optimized, Server Components).
    │   │   ├── layout.tsx                   # Phase 0: Marketing shell. Header, footer, analytics (GA4), intercom widget.
    │   │   ├── page.tsx                     # Phase 0: Homepage. Composes Hero, FeaturesGrid, SocialProof, CTASection widgets.
    │   │   ├── about/
    │   │   │   └── page.tsx                 # Phase 1: About page (company story, team photos).
    │   │   ├── features/
    │   │   │   └── page.tsx                 # Phase 1: Features list (detailed product capabilities).
    │   │   ├── pricing/
    │   │   │   └── page.tsx                 # Phase 0: Pricing page. Uses PricingTable widget, Stripe Checkout integration.
    │   │   ├── blog/
    │   │   │   ├── page.tsx                 # Phase 2: Blog index (ISR, paginated).
    │   │   │   └── [slug]/
    │   │   │       ├── page.tsx             # Phase 2: Blog post (MDX rendering).
    │   │   │       └── opengraph-image.tsx  # Phase 2: Post-specific OG image.
    │   │   ├── contact/
    │   │   │   └── page.tsx                 # Phase 1: Contact page (form + map).
    │   │   ├── privacy/
    │   │   │   └── page.tsx                 # Phase 0: Privacy policy (dynamic from DB legal templates).
    │   │   ├── terms/
    │   │   │   └── page.tsx                 # Phase 0: Terms of service.
    │   │   └── cookies/
    │   │       └── page.tsx                 # Phase 0: Cookie policy (granular consent explanation).
    │   │
    │   ├── (dashboard)/                     # Route group: Protected tenant dashboard (SPA-like, Client Components for interactivity).
    │   │   ├── layout.tsx                   # Phase 0: Dashboard shell. Sidebar navigation, header with user menu, tenant switcher (Phase 2).
    │   │   ├── page.tsx                     # Phase 0: Dashboard home/analytics overview. MetricCards, recent activity.
    │   │   ├── analytics/
    │   │   │   └── page.tsx                 # Phase 1: Analytics dashboard. Charts (recharts/tremor), date range picker.
    │   │   ├── leads/
    │   │   │   ├── page.tsx                 # Phase 0: Lead management table. DataTable widget with filtering.
    │   │   │   └── [id]/
    │   │   │       └── page.tsx             # Phase 0: Lead detail view. Activity timeline, notes, email history.
    │   │   ├── bookings/
    │   │   │   └── page.tsx                 # Phase 1: Booking calendar. FullCalendar or custom implementation with Cal.com sync.
    │   │   ├── content/                     # Page builder routes.
    │   │   │   ├── page.tsx                 # Phase 1: Content management (list of pages).
    │   │   │   └── [id]/
    │   │   │       └── page.tsx             # Phase 1: Page editor. React DnD canvas, property panels.
    │   │   ├── campaigns/
    │   │   │   └── page.tsx                 # Phase 3: Email campaigns list (status: draft, sending, sent).
    │   │   ├── settings/
    │   │   │   ├── page.tsx                 # Phase 1: General settings (tenant name, timezone).
    │   │   │   ├── branding/
    │   │   │   │   └── page.tsx             # Phase 1: Brand customization (colors, logo upload via Task 18).
    │   │   │   ├── integrations/
    │   │   │   │   └── page.tsx             # Phase 1: Integration config (Stripe, Cal.com API keys).
    │   │   │   ├── team/
    │   │   │   │   └── page.tsx             # Phase 2: Team management (invite, roles).
    │   │   │   └── billing/
    │   │   │       └── page.tsx             # Phase 0: Subscription management (Stripe Customer Portal).
    │   │   └── api-keys/
    │   │       └── page.tsx                 # Phase 2: API key generation for public API access.
    │   │
    │   └── api/                             # API Routes (Route Handlers).
    │       ├── auth/
    │       │   └── [...nextauth]/            # Legacy NextAuth.js endpoint (if migrating) or Clerk webhook handler.
    │       │       └── route.ts             # Phase 0: Auth callback handling.
    │       ├── trpc/
    │       │   └── [trpc]/
    │       │       └── route.ts             # Phase 0: tRPC router handler (if using tRPC over Server Actions).
    │       ├── webhooks/
    │       │   ├── stripe/
    │       │   │   └── route.ts             # Phase 0: Stripe webhook handler (invoice.paid, subscription.updated).
    │       │   ├── hubspot/
    │       │   │   └── route.ts             # Phase 1: HubSpot CRM sync webhooks.
    │       │   └── calcom/
    │       │       └── route.ts             # Phase 1: Cal.com booking webhooks.
    │       ├── upload/
    │       │   └── route.ts                 # Phase 1: File upload handler (returns presigned S3 URL).
    │       ├── health/
    │       │   └── route.ts                 # Phase 0: Health check endpoint (DB connectivity, Redis ping).
    │       └── cron/
    │           └── route.ts                 # Phase 2: Scheduled jobs endpoint (Vercel Cron) for reports, cleanup.
    │
    ├── pages/                               # FSD Pages layer (composition of widgets for specific routes).
    │   ├── home/
    │   │   ├── index.ts                     # Phase 0: Public API export (HomeHero, FeaturesGrid).
    │   │   ├── ui/
    │   │   │   ├── HomeHero.tsx             # Phase 0: Hero composition (headline, subheadline, CTA button, hero image).
    │   │   │   ├── FeaturesGrid.tsx         # Phase 0: 3-column feature highlights with icons.
    │   │   │   ├── SocialProof.tsx          # Phase 0: Logo cloud, testimonial quotes, trust badges.
    │   │   │   └── CTASection.tsx           # Phase 0: Final call-to-action before footer.
    │   │   └── api/
    │   │       └── getHeroData.ts           # Phase 0: Data fetching (could be static or from CMS).
    │   │
    │   ├── pricing/
    │   │   ├── index.ts
    │   │   ├── ui/
    │   │   │   ├── PricingHero.tsx          # Phase 0: Headline for pricing page.
    │   │   │   ├── PricingTable.tsx         # Phase 0: Tier comparison (Free, Pro, Enterprise).
    │   │   │   ├── FeatureComparison.tsx    # Phase 1: Detailed feature matrix.
    │   │   │   └── FAQSection.tsx           # Phase 1: Pricing-specific FAQs.
    │   │   └── api/
    │   │       └── getPricingTiers.ts       # Phase 0: Fetches from packages/features/billing.
    │   │
    │   ├── blog-index/                      # Phase 2: Blog listing page composition.
    │   ├── blog-post/                       # Phase 2: Individual blog post composition.
    │   ├── dashboard-home/                  # Phase 0: Dashboard overview composition.
    │   ├── lead-list/                       # Phase 0: Lead table page composition.
    │   ├── lead-detail/                     # Phase 0: Lead single view composition.
    │   └── settings-general/                # Phase 1: Settings page composition.
    │
    ├── widgets/                             # FSD Widgets (30 total) - Composed UI units with business logic.
    │   ├── header/
    │   │   ├── index.ts                     # Phase 0: Public export (Header, Logo).
    │   │   ├── ui/
    │   │   │   ├── Header.tsx               # Phase 0: Main header composition (logo, nav, user menu).
    │   │   │   ├── Logo.tsx                 # Phase 0: Tenant-aware logo (SVG or image).
    │   │   │   ├── Navigation.tsx           # Phase 0: Desktop navigation links.
    │   │   │   ├── MobileMenu.tsx           # Phase 0: Hamburger menu with Sheet primitive.
    │   │   │   ├── UserMenu.tsx             # Phase 0: Dropdown with profile, settings, logout.
    │   │   │   └── TenantSwitcher.tsx       # Phase 2: Multi-tenant user switcher.
    │   │   ├── model/
    │   │   │   └── header-store.ts          # Phase 0: Zustand store for mobile menu state.
    │   │   └── lib/
    │   │       └── useScrollPosition.ts     # Phase 0: Hook for sticky header background change.
    │   │
    │   ├── footer/                          # Phase 0: Site footer with links, copyright, social icons.
    │   ├── hero/                            # Phase 0: Main hero section widget (alternative to page-specific).
    │   ├── feature-showcase/                # Phase 0: Animated feature highlight widget.
    │   ├── testimonial-carousel/            # Phase 1: Swipeable testimonials.
    │   ├── pricing-comparison/              # Phase 0: Interactive pricing toggle (monthly/yearly).
    │   ├── stats-counter/                   # Phase 1: Animated number counters.
    │   ├── team-grid/                       # Phase 2: Team member display grid.
    │   ├── contact-form/                    # Phase 1: Contact page form widget.
    │   ├── newsletter-form/                 # Phase 1: Email subscription capture.
    │   ├── lead-capture-modal/              # Phase 0: Modal dialog for lead capture (triggers from CTAs).
    │   ├── booking-calendar-widget/         # Phase 1: Embedded Cal.com or custom calendar.
    │   ├── dashboard-sidebar/               # Phase 0: Navigation sidebar for dashboard layout.
    │   ├── analytics-chart/                 # Phase 1: Recharts wrapper for dashboard.
    │   ├── data-table/                      # Phase 0: TanStack Table wrapper with sorting/filtering.
    │   ├── file-uploader/                   # Phase 1: Drag-drop file upload with progress.
    │   ├── rich-text-editor/                # Phase 2: Tiptap or Lexical editor widget.
    │   ├── color-picker/                    # Phase 1: Theme customization color input.
    │   ├── seo-preview/                     # Phase 2: Google search result preview widget.
    │   ├── activity-feed/                   # Phase 2: Real-time activity stream (Supabase Realtime).
    │   ├── notification-center/             # Phase 2: Toast and notification management.
    │   ├── search-command/                  # Phase 2: CMD+K search palette (Command primitive).
    │   ├── page-builder-canvas/             # Phase 1: DnD canvas for page editing.
    │   ├── form-builder/                    # Phase 1: Dynamic form creation widget.
    │   ├── template-gallery/                # Phase 2: Page template selection grid.
    │   ├── integration-grid/                # Phase 1: Connected services display.
    │   ├── billing-portal/                  # Phase 0: Stripe Customer Portal wrapper.
    │   └── team-member-list/                # Phase 2: Team management table.
    │
    ├── features/                            # FSD Features (20 total) - Business logic and use cases.
    │   ├── auth/
    │   │   ├── index.ts                     # Phase 0: Public API (LoginForm, AuthGuard).
    │   │   ├── ui/
    │   │   │   ├── LoginForm.tsx            # Phase 0: React Hook Form + Zod validation.
    │   │   │   ├── RegisterForm.tsx         # Phase 0: Registration form composition.
    │   │   │   └── AuthGuard.tsx            # Phase 0: HOC for protected routes.
    │   │   ├── api/
    │   │   │   ├── login.ts                 # Phase 0: Server Action (legacy or Clerk integration).
    │   │   │   ├── logout.ts                # Phase 0: Session termination.
    │   │   │   ├── register.ts              # Phase 0: User creation.
    │   │   │   └── session.ts               # Phase 0: Session validation helper.
    │   │   ├── model/
    │   │   │   ├── auth-store.ts            # Phase 0: Zustand auth state (client-side).
    │   │   │   └── types.ts                 # Phase 0: Auth-related TypeScript interfaces.
    │   │   └── lib/
    │   │       ├── auth-utils.ts            # Phase 0: Token decoding, role checking.
    │   │       └── validation.ts            # Phase 0: Zod schemas for auth forms.
    │   │
    │   ├── lead-capture/                    # Phase 0: Lead creation logic, form validation.
    │   ├── lead-scoring/                    # Phase 2: AI/algorithmic lead quality scoring.
    │   ├── lead-routing/                    # Phase 2: Assignment rules (round-robin, territory).
    │   ├── booking-management/              # Phase 1: Create, update, cancel bookings.
    │   ├── email-campaigns/                 # Phase 3: Bulk email orchestration (see Task 23).
    │   ├── analytics-tracking/              # Phase 1: Event capture, GA4 integration.
    │   ├── ab-testing/                      # Phase 3: Experiment framework.
    │   ├── cookie-consent/                  # Phase 0: GDPR cookie banner logic.
    │   ├── file-upload/                     # Phase 1: Upload logic, virus scanning prep.
    │   ├── real-time-notifications/         # Phase 2: Supabase Realtime integration.
    │   ├── global-search/                   # Phase 2: Cross-entity search (leads, pages, bookings).
    │   ├── command-palette/                 # Phase 2: CMD+K actions and navigation.
    │   ├── onboarding-tour/                 # Phase 1: Shepard.js or custom tour logic.
    │   ├── feature-flags/                   # Phase 1: Client and server flag checking (re-export from packages/flags).
    │   ├── page-builder/                    # Phase 1: Block CRUD operations.
    │   ├── form-builder/                    # Phase 1: Dynamic form field management.
    │   ├── template-system/                 # Phase 2: Template application logic.
    │   ├── billing/                         # Phase 0: Subscription management, Stripe integration.
    │   └── team-management/                 # Phase 2: Invites, roles, permissions (see Task 22).
    │
    ├── entities/                            # FSD Entities (8 total) - Domain models (thin in UI layer, rich in packages/core).
    │   ├── tenant/
    │   │   ├── index.ts                     # Phase 0: Tenant entity public API.
    │   │   ├── model/
    │   │   │   ├── types.ts                 # Phase 0: Tenant TypeScript interfaces.
    │   │   │   ├── schema.ts                # Phase 0: Zod schema for validation.
    │   │   │   └── selectors.ts             # Phase 0: State selectors (if using Redux/Zustand).
    │   │   └── api/
    │   │       ├── queries.ts               # Phase 0: TanStack Query hooks for tenant data.
    │   │       └── mutations.ts             # Phase 0: Update tenant settings.
    │   │
    │   ├── user/                            # Phase 0: User profile entity.
    │   ├── lead/                            # Phase 0: Lead entity (UI layer adapters).
    │   ├── booking/                         # Phase 1: Booking entity.
    │   ├── site/                            # Phase 1: Site (tenant website) entity.
    │   ├── page/                            # Phase 1: Page (CMS) entity.
    │   ├── campaign/                        # Phase 3: Email campaign entity.
    │   └── subscription/                    # Phase 0: Billing subscription entity.
    │
    └── shared/                              # FSD Shared - Reusable utilities, strictly no business logic.
        ├── api/
        │   ├── index.ts                     # API clients barrel export.
        │   ├── supabase.ts                  # Phase 0: Browser Supabase client (singleton).
        │   ├── supabase-server.ts           # Phase 0: Server Supabase client with RLS context.
        │   ├── trpc.ts                      # Phase 0: tRPC client setup (if used).
        │   ├── request.ts                   # Phase 0: HTTP fetch wrappers with error handling.
        │   └── graphql.ts                   # Phase 4: Future GraphQL client (Apollo/URQL).
        │
        ├── config/
        │   ├── index.ts                     # Config exports.
        │   ├── env.ts                       # Phase 0: t3-env validation (client/server env vars).
        │   ├── constants.ts                 # Phase 0: App constants (pagination limits, date formats).
        │   └── routes.ts                    # Phase 0: Route definitions (typed routing).
        │
        ├── lib/
        │   ├── utils/
        │   │   ├── cn.ts                    # Phase 0: Tailwind merge (clsx + tailwind-merge).
        │   │   ├── dates.ts                 # Phase 0: Date formatting (date-fns wrappers).
        │   │   ├── strings.ts               # Phase 0: String utilities (truncate, slugify).
        │   │   ├── numbers.ts               # Phase 0: Number formatting (currency, percentages).
        │   │   ├── colors.ts                # Phase 1: Color manipulation (hex to hsl).
        │   │   └── validation.ts            # Phase 0: Zod helpers (password strength, phone).
        │   ├── hooks/
        │   │   ├── useTenant.ts             # Phase 0: Current tenant context hook.
        │   │   ├── useUser.ts               # Phase 0: Current user hook.
        │   │   ├── useLocalStorage.ts       # Phase 0: Persisted state hook.
        │   │   ├── useDebounce.ts           # Phase 0: Input debouncing.
        │   │   ├── useMediaQuery.ts         # Phase 0: Responsive breakpoint detection.
        │   │   ├── useIntersectionObserver.ts # Phase 1: Scroll-triggered animations.
        │   │   └── useLockBodyScroll.ts     # Phase 1: Modal scroll locking.
        │   └── hocs/
        │       └── withTenant.tsx           # Phase 0: HOC for tenant context injection.
        │
        ├── ui/                              # Phase 0: Re-exports from @repo/ui-primitives (convenience layer).
        └── types/
            ├── index.ts                     # Global type exports.
            ├── tenant.ts                    # Phase 0: Tenant-specific types.
            ├── api.ts                       # Phase 0: API response types.
            └── database.ts                  # Phase 0: Supabase generated types re-export.
```

---

## 📁 apps/admin/ (148 files)
*Internal Administration Dashboard—Cross-tenant oversight and platform governance. Mirror structure to apps/web but narrower scope, elevated privileges.*

```text
apps/admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Phase 2: Admin shell (dark theme, system navigation).
│   │   ├── page.tsx                       # Phase 2: System dashboard (metrics, alerts).
│   │   ├── tenants/                       # Phase 2: Tenant management (suspend, impersonate, delete).
│   │   ├── users/                         # Phase 2: Cross-tenant user search (find by email across all tenants).
│   │   ├── billing/                       # Phase 2: Platform-wide revenue analytics (MRR, churn).
│   │   ├── system/                        # Phase 2: Health monitoring (Redis, DB, queue depths).
│   │   └── api/                           # Phase 2: Admin API routes (higher rate limits, super-admin auth).
│   ├── pages/                             # Admin-specific page compositions (simpler than web, data-dense).
│   ├── widgets/                           # 15 admin-specific widgets (SystemHealthCard, RevenueChart, TenantList).
│   ├── features/                          # 10 admin features (Impersonation, SystemAlerts, DataExport).
│   ├── entities/                          # Same as web (reuses packages/core types).
│   └── shared/                            # Admin-specific utilities (super-auth hooks).
└── (config files mirror apps/web)         # eslint, tsconfig, tailwind, etc. Independent deployment target.
```

---

## 📁 apps/storybook/ (65 files)
*Component Documentation and Visual Testing Environment—Isolation chamber for UI development.*

```text
apps/storybook/
├── .storybook/
│   ├── main.ts                            # Phase 1: SB config (Vite builder, stories glob pattern).
│   ├── preview.tsx                        # Phase 1: Global decorators: ThemeProvider (tenant mock), Router mock.
│   └── manager.ts                         # Phase 1: Theme customization (dark mode, brand logo).
├── src/
│   ├── introduction.mdx                   # Phase 1: Getting started guide for designers.
│   └── stories/
│       ├── primitives/                    # Phase 1: 28 stories (Button, Input, Dialog—visual states).
│       ├── marketing/                     # Phase 1: 20 stories (Hero, PricingTable—composed blocks).
│       └── dashboard/                     # Phase 2: 15 stories (DataTable, Charts—data-dense components).
└── package.json                           # Dependencies: storybook/react, @storybook/addon-a11y (accessibility).
```

---

## 📁 packages/core/ (85 files)
*Domain Logic—Zero External Dependencies. The immutable business rules heart of the system. Portable, testable, framework-agnostic.*

```text
packages/core/
├── package.json                           # No dependencies except TypeScript. Strictest tsconfig.
├── tsconfig.json                          # Strict, no DOM libs (Node.js environment only).
├── src/
│   ├── index.ts                           # Public API barrel (exports entities, value-objects, policies).
│   ├── entities/                          # Business rules only (no database, no UI).
│   │   ├── tenant/
│   │   │   ├── Tenant.ts                  # Phase 0: Entity class with business methods (suspend(), updateSettings()).
│   │   │   ├── Tenant.spec.ts             # Phase 0: Unit tests (Vitest, no mocks needed for pure logic).
│   │   │   ├── TenantRepository.ts        # Phase 0: Interface definition (ports/adapters pattern).
│   │   │   └── errors.ts                  # Phase 0: Domain errors (TenantSuspendedError).
│   │   │
│   │   ├── user/                          # Phase 0: User entity (role management, profile validation).
│   │   ├── lead/                          # Phase 0: Lead entity (state machine: new → qualified → converted).
│   │   ├── booking/                       # Phase 1: Booking entity (conflict detection, rescheduling rules).
│   │   ├── site/                          # Phase 1: Site aggregate (custom domain validation).
│   │   ├── page/                          # Phase 1: Page entity (block tree validation).
│   │   ├── subscription/                  # Phase 0: Subscription entity (billing status logic).
│   │   └── campaign/                      # Phase 3: Email campaign entity (audience segmentation rules).
│   │
│   ├── value-objects/                     # Immutable domain values (compared by value, not identity).
│   │   ├── Email.ts                       # Phase 0: Validation, normalization (trim, lowercase), equality.
│   │   ├── Money.ts                       # Phase 0: Currency handling, precision arithmetic (cents, not floats).
│   │   ├── UUID.ts                        # Phase 0: UUID v4 validation and generation wrapper.
│   │   ├── Slug.ts                        # Phase 0: URL-safe string generation (kebab-case).
│   │   ├── TenantId.ts                    # Phase 0: Branded type for type safety.
│   │   └── DateRange.ts                   # Phase 1: Time interval validation (end > start), overlap detection.
│   │
│   ├── policies/                          # Authorization rules (pure functions).
│   │   ├── TenantAccessPolicy.ts          # Phase 0: Can user access this tenant? (membership check).
│   │   ├── BillingPolicy.ts               # Phase 0: Can tenant perform action? (active subscription check).
│   │   └── FeaturePolicy.ts               # Phase 1: Is feature enabled for tenant tier? (plan gating).
│   │
│   └── shared/                            # Domain utilities.
│       ├── Result.ts                      # Phase 0: Either monad (Result<T, E>) for explicit error handling.
│       ├── Option.ts                      # Phase 0: Maybe type (Some/None) for nullable handling.
│       └── errors/
│           ├── DomainError.ts             # Phase 0: Base error class (message, code, context).
│           └── ValidationError.ts         # Phase 0: Field-level validation errors collection.
```

---

## 📁 packages/features/ (95 files)
*Use Case Orchestration—Application services coordinating domain entities with infrastructure.*

```text
packages/features/
├── src/
│   ├── index.ts                           # Public API exports.
│   ├── auth-flows/                        # Phase 0: Login, logout, password reset workflows.
│   ├── lead-management/                   # Phase 0: Capture, qualification, assignment commands.
│   ├── booking-system/                    # Phase 1: Availability checking, booking creation, cancellation.
│   ├── billing/                           # Phase 0: Subscription creation, invoice handling, portal sessions.
│   ├── email-campaigns/                   # Phase 3: Campaign orchestration, segmentation, sending.
│   ├── analytics-engine/                  # Phase 1: Event aggregation, funnel analysis, reporting.
│   ├── ab-testing/                        # Phase 3: Experiment assignment, variant selection.
│   ├── page-builder/                      # Phase 1: Block CRUD, publishing workflows, versioning.
│   ├── automation-workflows/              # Phase 3: Trigger-action engine (Zapier-like internal).
│   ├── file-management/                   # Phase 1: Upload coordination, metadata management.
│   └── team-collaboration/                # Phase 2: Invitations, role changes, permission checks.
│
└── Each folder contains:                  # Standard FSD structure within features.
    ├── index.ts                           # Public API (commands and queries only).
    ├── commands/                          # Write operations (Server Actions or API calls).
    ├── queries/                           # Read operations (cached data fetching).
    ├── events/                            # Domain event handlers (integration side effects).
    └── dto.ts                             # Data transfer objects (Zod schemas for I/O).
```

---

## 📁 packages/ui-primitives/ (90 files)
*Radix UI + Tailwind Base Components—The design system's atomic elements.*

```text
packages/ui-primitives/
├── src/
│   ├── index.ts                           # Barrel export (Button, Input, etc.).
│   ├── components/
│   │   ├── button/
│   │   │   ├── Button.tsx                 # Phase 0: Polymorphic component (asChild) with CVA variants.
│   │   │   ├── Button.test.tsx            # Phase 0: Unit tests (rendering, click handlers).
│   │   │   ├── variants.ts                # Phase 0: CVA configuration (size, intent, loading states).
│   │   │   └── index.ts                   # Phase 0: Clean export.
│   │   │
│   │   ├── input/                         # Phase 0: Text input with validation states (error, success).
│   │   ├── textarea/                      # Phase 0: Multi-line text.
│   │   ├── select/                        # Phase 0: Dropdown using Radix Select (accessible, searchable).
│   │   ├── checkbox/                      # Phase 0: Boolean input with indeterminate state.
│   │   ├── radio-group/                   # Phase 0: Exclusive selection group.
│   │   ├── switch/                        # Phase 0: Toggle (iOS-style).
│   │   ├── label/                         # Phase 0: Form label with error association.
│   │   ├── badge/                         # Phase 0: Status indicators (colors, dots).
│   │   ├── card/                          # Phase 0: Content container (variants: default, outline, ghost).
│   │   ├── avatar/                        # Phase 0: User image with fallback initials.
│   │   ├── skeleton/                      # Phase 0: Loading placeholder (pulse animation).
│   │   ├── spinner/                       # Phase 0: Loading indicator (SVG).
│   │   ├── separator/                     # Phase 0: Visual divider (horizontal/vertical).
│   │   ├── progress/                      # Phase 1: Bar indicator (determinate/indeterminate).
│   │   ├── slider/                        # Phase 1: Range selection (Radix Slider).
│   │   ├── toggle/                        # Phase 0: Two-state button (bold/italic in editor).
│   │   ├── toggle-group/                  # Phase 1: Exclusive tool button group.
│   │   ├── tabs/                          # Phase 0: Content panels (Radix Tabs).
│   │   ├── accordion/                     # Phase 0: Collapsible sections (Radix Accordion).
│   │   ├── dialog/                        # Phase 0: Modal window (focus trap, scroll lock).
│   │   ├── sheet/                         # Phase 0: Side panel (mobile navigation).
│   │   ├── popover/                       # Phase 0: Floating content (date pickers, menus).
│   │   ├── tooltip/                       # Phase 0: Hover information (Radix Tooltip).
│   │   ├── hover-card/                    # Phase 1: Rich hover preview (like GitHub user cards).
│   │   ├── dropdown-menu/                 # Phase 0: Context menus (Radix DropdownMenu).
│   │   ├── context-menu/                  # Phase 2: Right-click menus.
│   │   ├── command/                       # Phase 1: CMD+K palette base (Radix Command).
│   │   ├── calendar/                      # Phase 1: Date grid (react-day-picker base).
│   │   ├── date-picker/                   # Phase 1: Input + calendar popover.
│   │   ├── date-range-picker/             # Phase 2: Two-date selection.
│   │   ├── data-table/                    # Phase 1: TanStack Table primitive wrapper.
│   │   ├── pagination/                    # Phase 1: Page navigation controls.
│   │   ├── resizable/                     # Phase 2: Draggable panel sizing.
│   │   ├── scroll-area/                   # Phase 1: Custom scrollbar (Radix ScrollArea).
│   │   ├── sonner/                        # Phase 0: Toast notifications (positioning, stacking).
│   │   ├── toaster/                       # Phase 0: Toast manager instance.
│   │   ├── alert/                         # Phase 0: Contextual messages (info, warning, error).
│   │   ├── alert-dialog/                  # Phase 0: Critical confirmation (destructive actions).
│   │   ├── aspect-ratio/                  # Phase 1: Media container sizing.
│   │   ├── breadcrumb/                    # Phase 1: Navigation path display.
│   │   ├── carousel/                      # Phase 1: Image/content slider (Embla Carousel base).
│   │   ├── chart/                         # Phase 2: Recharts wrapper theming.
│   │   ├── collapsible/                   # Phase 0: Show/hide content (Radix Collapsible).
│   │   ├── drawer/                        # Phase 1: Mobile-bottom sheet.
│   │   ├── form/                          # Phase 0: React Hook Form integration (FormField, FormMessage).
│   │   ├── input-otp/                     # Phase 2: One-time code input.
│   │   ├── menubar/                       # Phase 2: Application menu bar (Radix Menubar).
│   │   ├── navigation-menu/               # Phase 1: Complex dropdown navigation.
│   │   ├── phone-input/                   # Phase 1: International phone formatting (libphonenumber-js).
│   │   ├── pin-input/                     # Phase 2: Digit code entry.
│   │   ├── select-multi/                  # Phase 1: Multi-select dropdown.
│   │   ├── table/                         # Phase 1: HTML table styling (headless).
│   │   ├── textarea-auto/                 # Phase 1: Auto-resizing textarea.
│   │   └── timeline/                      # Phase 2: Vertical step display.
│   │
│   ├── hooks/                             # Primitive-specific hooks.
│   └── theme/
│       ├── tokens.ts                      # Phase 0: Design token definitions (colors, spacing).
│       ├── colors.ts                      # Phase 0: Color palette (radix-colors base).
│       └── css-variables.css              # Phase 0: CSS custom properties injection.
```

---

## 📁 packages/ui-marketing/ (60 files)
*Marketing Section Components—Composable blocks for landing pages.*

```text
packages/ui-marketing/
├── src/
│   ├── index.ts                           # Block exports.
│   ├── blocks/
│   │   ├── Hero.tsx                       # Phase 0: Standard hero (headline, subhead, cta, image).
│   │   ├── HeroSplit.tsx                  # Phase 1: Two-column hero.
│   │   ├── HeroGradient.tsx               # Phase 1: Gradient background hero.
│   │   ├── FeatureGrid.tsx                # Phase 0: 3-column icon features.
│   │   ├── FeatureList.tsx                # Phase 1: Icon + text vertical list.
│   │   ├── FeatureTabs.tsx                # Phase 2: Tabbed feature showcase.
│   │   ├── PricingTable.tsx               # Phase 0: Tiered pricing display.
│   │   ├── PricingToggle.tsx              # Phase 0: Monthly/yearly switcher.
│   │   ├── PricingComparison.tsx          # Phase 1: Feature matrix table.
│   │   ├── Testimonial.tsx                # Phase 1: Single quote card.
│   │   ├── TestimonialCarousel.tsx        # Phase 1: Rotating testimonials.
│   │   ├── TestimonialGrid.tsx            # Phase 2: Masonry grid of quotes.
│   │   ├── LogoCloud.tsx                  # Phase 0: Grayscale logo strip.
│   │   ├── LogoGrid.tsx                   # Phase 1: Multi-row logo display.
│   │   ├── Stats.tsx                      # Phase 1: Big number counters.
│   │   ├── CTASection.tsx                 # Phase 0: Final call-to-action block.
│   │   ├── Newsletter.tsx                 # Phase 1: Email capture section.
│   │   ├── TeamGrid.tsx                   # Phase 2: Team member cards.
│   │   ├── ContactForm.tsx                # Phase 1: Full contact section.
│   │   ├── LeadForm.tsx                   # Phase 0: Embedded lead capture.
│   │   ├── FAQ.tsx                        # Phase 1: Accordion FAQ block.
│   │   ├── ComparisonTable.tsx            # Phase 1: Competitor comparison.
│   │   ├── IntegrationGrid.tsx            # Phase 1: Logo grid of integrations.
│   │   ├── SocialProof.tsx                # Phase 1: Combined stats + testimonials.
│   │   ├── TrustBadge.tsx                 # Phase 1: Security/compliance badges.
│   │   ├── Countdown.tsx                  # Phase 2: Launch timer.
│   │   ├── AnnouncementBar.tsx            # Phase 2: Top banner message.
│   │   ├── CookieBanner.tsx               # Phase 0: GDPR consent banner.
│   │   ├── ExitIntent.tsx                 # Phase 2: Modal on mouse-out.
│   │   ├── FloatingCTA.tsx                # Phase 1: Fixed bottom button.
│   │   ├── VideoHero.tsx                  # Phase 2: Background video hero.
│   │   ├── Gallery.tsx                    # Phase 2: Image grid/lightbox.
│   │   ├── Stepper.tsx                    # Phase 1: Process steps (1-2-3).
│   │   ├── TimelineVertical.tsx           # Phase 2: History/changelog timeline.
│   │   ├── BentoGrid.tsx                  # Phase 2: Complex grid layout (Apple-style).
│   │   ├── Marquee.tsx                    # Phase 2: Scrolling text/images.
│   │   ├── Typewriter.tsx                 # Phase 2: Animated text effect.
│   │   └── TextReveal.tsx                 # Phase 2: Scroll-triggered text animation.
│   │
│   └── animation/
│       ├── Fade.tsx                       # Phase 0: Opacity transition wrapper.
│       ├── Slide.tsx                      # Phase 0: Directional slide animation.
│       ├── Stagger.tsx                    # Phase 1: Staggered children animation.
│       └── Parallax.tsx                   # Phase 2: Scroll-based parallax.
```

---

## 📁 packages/ui-dashboard/ (45 files)
*Data-Dense Dashboard Components—Complex interactive widgets for analytics and management.*

```text
packages/ui-dashboard/
├── src/
│   ├── data-table/
│   │   ├── DataTable.tsx                  # Phase 0: Main table component (TanStack Table).
│   │   ├── DataTablePagination.tsx        # Phase 0: Page controls.
│   │   ├── DataTableSorting.tsx           # Phase 1: Column sort indicators.
│   │   ├── DataTableFiltering.tsx         # Phase 1: Column filters (text, select, date).
│   │   └── DataTableSelection.tsx         # Phase 2: Row checkboxes, bulk actions.
│   │
│   ├── charts/
│   │   ├── LineChart.tsx                  # Phase 1: Time series (Recharts).
│   │   ├── BarChart.tsx                   # Phase 1: Categorical comparison.
│   │   ├── PieChart.tsx                   # Phase 1: Proportion display.
│   │   ├── AreaChart.tsx                  # Phase 2: Stacked area (cumulative).
│   │   └── StatsCards.tsx                 # Phase 0: Metric display (current vs previous).
│   │
│   ├── filters/
│   │   ├── DateRangeFilter.tsx            # Phase 1: Calendar popover range picker.
│   │   ├── SelectFilter.tsx               # Phase 1: Dropdown filter.
│   │   └── SearchFilter.tsx               # Phase 1: Text search with debounce.
│   │
│   ├── layout/
│   │   ├── DashboardShell.tsx             # Phase 0: Main layout wrapper (sidebar + content).
│   │   ├── Sidebar.tsx                    # Phase 0: Navigation sidebar (collapsible).
│   │   └── TopNav.tsx                     # Phase 0: Header with search and profile.
│   │
│   └── widgets/
│       ├── MetricCard.tsx                 # Phase 0: KPI display (trend indicator).
│       ├── ActivityList.tsx               # Phase 1: Recent actions feed.
│       └── NotificationItem.tsx           # Phase 2: Rich notification row.
```

---

## 📁 packages/infrastructure/ (78 files)
*External Concerns—Auth, DB, Cache, Monitoring. The adapter layer to the outside world.*

```text
packages/infrastructure/
├── src/
│   ├── index.ts                           # Infrastructure exports (clients, security).
│   │
│   ├── auth/
│   │   ├── clerk.ts                       # Phase 0: Clerk client setup (frontend API).
│   │   ├── oauth.ts                       # Phase 0: OAuth provider configs (Google, GitHub).
│   │   ├── jwt.ts                         # Phase 0: JWT verification utilities.
│   │   ├── rbac.ts                        # Phase 0: Role definitions and permission checks.
│   │   └── middleware.ts                  # Phase 0: Auth middleware helpers (requireAuth).
│   │
│   ├── database/
│   │   ├── client.ts                      # Phase 0: Browser Supabase client (singleton).
│   │   ├── server.ts                      # Phase 0: Server Supabase client with RLS (service role for migrations).
│   │   ├── admin.ts                       # Phase 0: Service role client (bypass RLS for admin tasks).
│   │   ├── types.ts                       # Phase 0: Generated DB types (supabase gen types).
│   │   ├── rls-helpers.ts                 # Phase 0: set_config helpers for tenant context.
│   │   ├── connection.ts                  # Phase 1: Connection pooling management (PgBouncer config).
│   │   └── migrations.ts                  # Phase 0: Migration runner wrapper.
│   │
│   ├── cache/
│   │   ├── redis.ts                       # Phase 0: Upstash Redis client (ioredis or @upstash/redis).
│   │   ├── ratelimit.ts                   # Phase 0: Rate limiting implementation (sliding window).
│   │   ├── sessions.ts                    # Phase 0: Session storage in Redis.
│   │   └── tenant-context.ts              # Phase 0: Tenant ID caching (domain → tenantId lookup).
│   │
│   ├── storage/
│   │   ├── s3.ts                          # Phase 1: S3/R2 client initialization.
│   │   └── presigned-urls.ts              # Phase 1: URL generation for secure uploads.
│   │
│   ├── queue/
│   │   ├── client.ts                      # Phase 2: Inngest/BullMQ setup.
│   │   └── jobs.ts                        # Phase 2: Job definitions and workers.
│   │
│   ├── context/
│   │   ├── tenant-context.ts              # Phase 0: AsyncLocalStorage for tenant propagation.
│   │   └── request-context.ts             # Phase 0: Request ID and tracing context.
│   │
│   ├── security/
│   │   ├── encryption.ts                  # Phase 0: AES-256-GCM for secrets at rest.
│   │   ├── hash.ts                        # Phase 0: Argon2id for password hashing (if custom auth).
│   │   ├── audit-logger.ts                # Phase 0: Structured audit trail emitter.
│   │   ├── csp.ts                         # Phase 0: Content Security Policy nonce generation.
│   │   └── sanitization.ts                # Phase 0: XSS prevention (DOMPurify server-side).
│   │
│   ├── monitoring/
│   │   ├── sentry.ts                      # Phase 0: Error tracking initialization.
│   │   ├── opentelemetry.ts               # Phase 1: OTel setup with @vercel/otel.
│   │   ├── pino.ts                        # Phase 0: Structured JSON logging.
│   │   ├── health-checks.ts               # Phase 0: Health check endpoints (DB, Redis ping).
│   │   └── metrics.ts                     # Phase 2: Custom metrics (Prometheus format).
│   │
│   └── config/
│       ├── env.ts                         # Phase 0: Environment variable validation (t3-env).
│       └── constants.ts                   # Phase 0: Infrastructure constants (timeouts, retry counts).
```

---

## 📁 packages/integrations/ (65 files)
*Plugin System + Core Adapters—Third-party service abstraction layer.*

```text
packages/integrations/
├── src/
│   ├── index.ts                           # Integration exports.
│   ├── types.ts                           # Phase 0: Integration interface definitions (adapter pattern).
│   ├── registry.ts                        # Phase 0: Plugin registry (dynamic loading map).
│   ├── loader.ts                          # Phase 0: Dynamic adapter loader (lazy imports).
│   │
│   ├── core/                              # Plugin system infrastructure.
│   │   ├── adapter.ts                     # Phase 0: Base adapter class (connect, disconnect, healthCheck).
│   │   ├── validator.ts                   # Phase 0: Config validation (Zod schemas).
│   │   └── sanitizer.ts                   # Phase 0: Output sanitization (PII redaction).
│   │
│   ├── adapters/                          # Core integrations.
│   │   ├── google-analytics-4/
│   │   │   ├── index.ts                   # Phase 0: Adapter registration.
│   │   │   ├── client.ts                  # Phase 0: GTag initialization.
│   │   │   ├── server.ts                  # Phase 0: Measurement Protocol (server-side tracking).
│   │   │   ├── track.ts                   # Phase 0: Event tracking helper.
│   │   │   └── types.ts                   # Phase 0: GA4 event type definitions.
│   │   │
│   │   ├── stripe/                        # Phase 0: Payments adapter.
│   │   ├── hubspot/                       # Phase 1: CRM adapter.
│   │   ├── calcom/                        # Phase 1: Scheduling adapter.
│   │   └── resend/                        # Phase 0: Email adapter.
│   │
│   ├── webhooks/                          # Webhook infrastructure.
│   │   ├── idempotency.ts                 # Phase 0: Idempotency key storage (Redis).
│   │   ├── signature.ts                   # Phase 0: HMAC signature verification.
│   │   ├── retries.ts                     # Phase 0: Exponential backoff logic.
│   │   └── validation.ts                  # Phase 0: Payload schema validation (Zod).
│   │
│   └── marketplace/                       # Future plugins (stubs).
│       ├── mailchimp/                     # Phase 3: Email marketing.
│       ├── sendgrid/                      # Phase 3: Alternative email.
│       └── zapier/                        # Phase 3: Automation platform.
```

---

## 📁 packages/email/ (42 files)
*React Email Templates—Type-safe email HTML generation.*

```text
packages/email/
├── src/
│   ├── index.ts                           # Template exports.
│   ├── components/
│   │   ├── layout/
│   │   │   ├── EmailLayout.tsx            # Phase 0: Base HTML structure (doctype, meta tags).
│   │   │   ├── Header.tsx                 # Phase 0: Logo and brand header.
│   │   │   └── Footer.tsx                 # Phase 0: Unsubscribe link, address, social icons.
│   │   ├── Button.tsx                     # Phase 0: CTA button (table-based for Outlook).
│   │   ├── Typography.tsx                 # Phase 0: Text styles (Heading, Text, Link).
│   │   └── Divider.tsx                    # Phase 0: Visual separator.
│   │
│   ├── templates/
│   │   ├── welcome.tsx                    # Phase 0: New user welcome.
│   │   ├── password-reset.tsx             # Phase 0: Password reset link.
│   │   ├── booking-confirmation.tsx       # Phase 1: Booking details and calendar invite.
│   │   ├── lead-notification.tsx          # Phase 0: New lead alert to tenant.
│   │   ├── weekly-report.tsx              # Phase 2: Analytics summary email.
│   │   ├── campaign-sent.tsx              # Phase 3: Campaign completion notice.
│   │   ├── subscription-renewal.tsx       # Phase 1: Upcoming billing notice.
│   │   ├── payment-receipt.tsx            # Phase 0: Invoice receipt.
│   │   ├── team-invite.tsx                # Phase 2: Invitation to join tenant.
│   │   └── verification-code.tsx          # Phase 0: OTP/2FA code email.
│   │
│   └── preview/
│       ├── page.tsx                       # Phase 0: Dev preview page (localhost:3000/email-preview).
│       └── layout.tsx                     # Phase 0: Preview layout wrapper.
```

---

## 📁 packages/seo/ (24 files)
*Search Engine Optimization—Metadata, structured data, sitemaps.*

```text
packages/seo/
├── src/
│   ├── index.ts                           # SEO utilities export.
│   ├── metadata.ts                        # Phase 0: Metadata factory (generate title, description).
│   ├── json-ld.ts                         # Phase 1: JSON-LD structured data generators.
│   ├── sitemap.ts                         # Phase 1: XML sitemap generation helpers.
│   ├── robots.ts                          # Phase 1: Robots.txt generation.
│   ├── og-images.ts                       # Phase 1: Open Graph image generation helpers (@vercel/og).
│   └── schemas/
│       ├── organization.ts                # Phase 1: Schema.org Organization markup.
│       ├── website.ts                     # Phase 1: WebSite schema (search box in SERP).
│       ├── article.ts                     # Phase 2: BlogPosting schema.
│       ├── product.ts                     # Phase 2: Product schema (for pricing page).
│       └── local-business.ts              # Phase 2: LocalBusiness schema (address, hours).
```

---

## 📁 packages/i18n/ (18 files)
*Internationalization—next-intl configuration and message catalogs.*

```text
packages/i18n/
├── src/
│   ├── index.ts                           # i18n utilities export.
│   ├── config.ts                          # Phase 1: next-intl configuration (locales, default).
│   ├── middleware.ts                      # Phase 1: Locale detection and negotiation middleware.
│   ├── client.tsx                         # Phase 1: Client-side provider (NextIntlClientProvider).
│   ├── server.ts                          # Phase 1: Server-side helpers (getTranslations).
│   ├── messages/
│   │   ├── en.json                        # Phase 1: English source strings.
│   │   ├── es.json                        # Phase 2: Spanish translations.
│   │   └── de.json                        # Phase 3: German translations.
│   └── types.ts                           # Phase 1: Type generation for message keys (autocomplete).
```

---

## 📁 packages/flags/ (12 files)
*Feature Flags—Vercel Edge Config integration for safe rollouts.*

```text
packages/flags/
├── src/
│   ├── index.ts                           # Flag evaluation exports.
│   ├── client.ts                          # Phase 1: Client-side flag checking (useFlag hook).
│   ├── server.ts                          # Phase 1: Server-side flag checking (flag evaluation).
│   ├── config.ts                          # Phase 1: Edge Config connection setup.
│   └── flags.ts                           # Phase 1: Flag definitions registry (enable_booking, etc.).
```

---

## 📁 packages/types/ (20 files)
*Shared TypeScript Definitions—Cross-package type contracts.*

```text
packages/types/
├── src/
│   ├── index.ts                           # Types barrel export.
│   ├── tenant.ts                          # Phase 0: Tenant interface (settings, plan, status).
│   ├── user.ts                            # Phase 0: User interface (profile, roles).
│   ├── lead.ts                            # Phase 0: Lead interface (contact info, status, source).
│   ├── booking.ts                         # Phase 1: Booking interface (time, status, customer).
│   ├── site.ts                            # Phase 1: Site interface (domain, theme, pages).
│   ├── page.ts                            # Phase 1: Page interface (blocks, meta, published).
│   ├── campaign.ts                        # Phase 3: Campaign interface (audience, content, stats).
│   ├── subscription.ts                    # Phase 0: Subscription interface (plan, status, dates).
│   ├── api.ts                             # Phase 0: API response wrappers (ApiResponse<T>, ApiError).
│   ├── database.ts                        # Phase 0: Supabase generated types re-export.
│   ├── integrations.ts                    # Phase 0: Integration config types.
│   └── global.d.ts                        # Phase 0: Global declarations (window extensions, env).
```

---

## 📁 packages/utils/ (22 files)
*Shared Utilities—Pure functions, no React, no Node-specific APIs (isomorphic).*

```text
packages/utils/
├── src/
│   ├── index.ts                           # Utils barrel export.
│   ├── strings.ts                         # Phase 0: Slugify, truncate, capitalize.
│   ├── dates.ts                           # Phase 0: FormatRelative, isExpired, addDays.
│   ├── numbers.ts                         # Phase 0: Currency formatting, compact notation (1.2k).
│   ├── arrays.ts                          # Phase 0: GroupBy, unique, shuffle.
│   ├── objects.ts                         # Phase 0: Deep merge, pick, omit.
│   ├── validation.ts                      # Phase 0: Zod refinement helpers (password strength).
│   ├── colors.ts                          # Phase 1: Hex to HSL, contrast ratio calculation.
│   ├── currency.ts                        # Phase 0: Money formatting with Intl.NumberFormat.
│   ├── slugs.ts                           # Phase 0: URL-safe string generation.
│   ├── type-guards.ts                     # Phase 0: isString, isNumber, isObject runtime checks.
│   └── crypto.ts                          # Phase 1: Client-safe crypto (random UUID, hash).
```

---

## 📁 packages/config/ (28 files)
*Tooling Configurations—Shared ESLint, TypeScript, Tailwind presets.*

```text
packages/config/
├── eslint/
│   ├── base.js                            # Phase 0: Base ESLint config (typescript-eslint, prettier).
│   ├── next.js                            # Phase 0: Next.js specific (next/core-web-vitals).
│   ├── react.js                           # Phase 0: React hooks and jsx-a11y rules.
│   └── typescript.js                      # Phase 0: TypeScript parser and plugin settings.
├── typescript/
│   ├── base.json                          # Phase 0: Strictest compiler options.
│   ├── nextjs.json                        # Phase 0: Next.js specific (moduleResolution: bundler).
│   ├── react-library.json                 # Phase 0: For UI packages (jsx: react-jsx).
│   └── node.json                          # Phase 0: For Node scripts (target: ES2022).
├── tailwind/
│   ├── base.ts                            # Phase 0: Base Tailwind config (content paths, theme).
│   └── preset.ts                          # Phase 0: Sharable preset for apps.
└── prettier/
    └── index.js                           # Phase 0: Prettier config (printWidth: 100, singleQuote).
```

---

## 📁 clients/ (45 files)
*Enterprise Client Overrides—White-label customization layer.*

```text
clients/
├── _template/                             # Phase 2: Scaffolding for new enterprise clients.
│   ├── package.json                       # Client-specific dependencies (rarely needed).
│   ├── tsconfig.json                      # References main monorepo tsconfig.
│   ├── README.md                          # Integration guide for this client.
│   ├── src/
│   │   ├── config.ts                      # Tenant config override (colors, fonts).
│   │   ├── theme/
│   │   │   ├── colors.ts                  # Brand color palette.
│   │   │   ├── typography.ts              # Font overrides.
│   │   │   └── custom.css                 # Additional styles.
│   │   ├── components/                    # Custom React components (override defaults).
│   │   │   └── CustomCalculator.tsx       # Example: ROI calculator widget.
│   │   └── middleware.ts                  # Client-specific middleware (e.g., FedRAMP headers).
│   └── assets/
│       ├── logo.svg                       # Brand logo.
│       └── favicon.ico                    # Brand favicon.
│
├── acme-corp/                             # Phase 3: Example enterprise client.
│   └── src/
│       ├── components/
│       │   └── ROICalculator.tsx          # Proprietary widget (trade secret).
│       └── integrations/
│           └── workday-sync.ts            # Custom HRIS integration.
│
└── gov-agency/                            # Phase 3: Compliance-heavy client.
    └── src/
        └── middleware.ts                  # FedRAMP headers, enhanced logging.
```

---

## 📁 database/ (55 files)
*Supabase-Native Schema—Migrations, functions, and policies.*

```text
database/
├── migrations/                            # 25 SQL files (immutable history).
│   ├── 00000000000000_init.sql            # Phase 0: Extensions, UUID setup.
│   ├── 20240101000000_tenants.sql         # Phase 0: Tenant table + RLS policies.
│   ├── 20240102000000_users.sql           # Phase 0: User management (auth.users extension).
│   ├── 20240103000000_leads.sql           # Phase 0: Lead capture table.
│   ├── 20240104000000_bookings.sql        # Phase 1: Scheduling table.
│   ├── 20240105000000_sites.sql           # Phase 1: Site builder (custom domains).
│   ├── 20240106000000_pages.sql           # Phase 1: CMS pages (JSON blocks).
│   ├── 20240107000000_campaigns.sql       # Phase 3: Email campaigns.
│   ├── 20240108000000_analytics.sql       # Phase 1: Events table (time-series).
│   ├── 20240109000000_integrations.sql    # Phase 1: Connection configs (encrypted).
│   ├── 20240110000000_files.sql           # Phase 1: Storage metadata.
│   ├── 20240111000000_subscriptions.sql   # Phase 0: Billing (Stripe sync).
│   ├── 20240112000000_audit_logs.sql      # Phase 0: Compliance logging (append-only).
│   ├── 20240113000000_rls_policies.sql    # Phase 0: Centralized RLS definitions.
│   └── ... (12 more migration files)
│
├── functions/                             # Supabase Edge Functions (Deno/TypeScript).
│   ├── hello-world/                       # Phase 0: Basic function template.
│   ├── stripe-webhook/                    # Phase 0: Stripe event processing (idempotency critical).
│   ├── send-email/                        # Phase 1: Queue-based email sending (rate limiting).
│   └── process-image/                     # Phase 1: Image optimization (Sharp WASM).
│
├── policies/                              # RLS documentation and testing.
│   ├── README.md                          # Phase 0: RLS architecture overview.
│   ├── tenant_isolation.md                # Phase 0: Isolation strategy documentation.
│   └── user_access.md                     # Phase 0: Role-based access matrix.
│
├── triggers/                              # Database triggers.
│   └── audit_trigger.sql                  # Phase 0: Auto-insert audit logs on data changes.
│
└── seed.sql                               # Phase 0: Golden path test data (10 tenants, 100 leads).
```

---

## 📁 docs/ (85 files)
*Documentation—Architecture Decision Records (ADRs), runbooks, guides.*

```text
docs/
├── README.md                              # Documentation index and navigation.
├── guides/
│   ├── getting-started.md                 # Phase 0: 5-minute setup guide.
│   ├── architecture/
│   │   ├── fsd-structure.md               # Phase 0: Import rules and layer boundaries.
│   │   ├── tenant-isolation.md            # Phase 0: 3-layer defense (middleware, RLS, context).
│   │   ├── dependency-graph.md            # Phase 0: Visual package relationships.
│   │   ├── security-layers.md             # Phase 0: Defense in depth explanation.
│   │   └── data-flow.md                   # Phase 1: Request lifecycle diagram.
│   ├── development/
│   │   ├── adding-features.md             # Phase 0: How to add a new FSD feature.
│   │   ├── creating-components.md         # Phase 0: UI primitive creation guide.
│   │   ├── database-migrations.md         # Phase 0: Expand/contract pattern guide.
│   │   ├── testing-strategy.md            # Phase 0: Unit vs Integration vs E2E guidance.
│   │   └── performance-budgets.md         # Phase 1: Bundle size management.
│   └── deployment/
│       ├── vercel-setup.md                # Phase 0: Environment configuration.
│       ├── database-migrations.md         # Phase 0: Zero-downtime migration strategy.
│       ├── rollback-procedures.md         # Phase 0: How to revert bad deploys.
│       └── incident-response.md           # Phase 1: PagerDuty integration and runbooks.
│
├── adrs/                                  # Architecture Decision Records (immutable history).
│   ├── 001-why-fsd.md                     # Phase 0: Feature-Sliced Design rationale.
│   ├── 002-why-supabase.md                # Phase 0: Database choice (Postgres + RLS).
│   ├── 003-multi-tenancy-strategy.md      # Phase 0: Row-level vs schema isolation.
│   ├── 004-why-clerk.md                   # Phase 0: Auth provider choice.
│   ├── 005-client-folder-approach.md      # Phase 2: White-label architecture.
│   └── 006-plugin-architecture.md         # Phase 1: Integration adapter pattern.
│
├── tasks/                                 # AI context files (from root).
│   ├── domain-00-meta/                    # Phase 0: Task tracking metadata.
│   ├── domain-01-core-infrastructure/     # Phase 0: Infra tasks.
│   ├── domain-02-authentication/          # Phase 0: Auth tasks.
│   ├── domain-03-database/                # Phase 0: DB tasks.
│   ├── domain-04-ui-system/               # Phase 0: UI tasks.
│   └── ... (20 domains total)
│
├── runbooks/                              # SOC-2 operations documentation.
│   ├── security-incident.md               # Phase 1: Breach response protocol.
│   ├── database-restore.md                # Phase 1: PITR recovery steps.
│   ├── tenant-isolation-breach.md         # Phase 0: RLS bypass response (critical).
│   └── scaling-procedures.md              # Phase 3: Horizontal scaling playbook.
│
└── research/
    ├── auth-providers.md                  # Phase 0: Clerk vs Auth0 vs Supabase Auth comparison.
    ├── cms-options.md                     # Phase 1: Sanity vs Strapi vs Custom (chose custom).
    └── performance-benchmarks.md          # Phase 1: Load testing results (k6).
```

---

## 📁 scripts/ (25 files)
*Automation—Development, deployment, and maintenance scripts.*

```text
scripts/
├── setup-env.sh                           # Phase 0: macOS/Linux environment setup (brew, pnpm, git hooks).
├── setup-env.ps1                          # Phase 0: Windows environment setup (choco, pnpm).
├── seed.ts                                # Phase 0: Database seeding (Drizzle/Prisma/Supabase).
├── seed-test.ts                           # Phase 0: Test data generation (deterministic faker).
├── generate-component.ts                  # Phase 0: FSD component scaffolding (plop.js or custom).
├── generate-integration.ts                # Phase 1: Adapter boilerplate generation.
├── create-client.ts                       # Phase 2: Enterprise client folder scaffolding (copies _template).
├── verify-locks.sh                        # Phase 0: Pre-commit lockfile integrity check.
├── verify-security.sh                     # Phase 0: Pre-commit secret scanning (gitleaks).
├── check-circular.sh                      # Phase 0: Madge circular dependency check.
├── pre-flight-check.sh                    # Phase 0: Pre-push validation (lint, test, build).
├── db-migrate.sh                          # Phase 0: Migration helper with backup prompt.
├── db-reset.sh                            # Phase 0: Dangerous reset + reseed (local only).
├── db-backup.sh                           # Phase 1: Automated S3 backup script (pg_dump).
├── release.sh                             # Phase 2: Semantic release automation (git tag, changelog).
│
├── load-test/                             # Phase 3: k6 performance testing.
│   ├── k6-config.js                       # Phase 3: Global thresholds and stages.
│   ├── tenant-concurrency.js              # Phase 3: 1000 tenant isolation test.
│   ├── booking-stress.js                  # Phase 3: Double-booking race condition test.
│   └── webhook-flood.js                   # Phase 3: Webhook handling under load.
│
└── analyze/
    ├── bundle-analyze.js                  # Phase 1: Webpack bundle analyzer wrapper.
    └── dependency-graph.js                # Phase 0: Madge visualization generation.
```

---

## 📁 tooling/ (35 files)
*Internal Tools—Custom linting, scaffolding, and development aids.*

```text
tooling/
├── eslint/
│   ├── package.json                       # ESLint plugin dependencies.
│   ├── src/
│   │   ├── index.ts                       # Plugin entry point.
│   │   └── rules/
│   │       ├── fsd-boundaries.js          # Phase 0: Enforces layer separation (app→pages→widgets→features→entities→shared).
│   │       ├── no-cross-imports.js        # Phase 0: Prevents cross-slice imports except via @x.
│   │       └── no-package-leakage.js      # Phase 0: Prevents internal package paths from being imported.
│   └── README.md                          # Usage instructions.
│
├── fsd-cli/                               # Feature-Sliced Design scaffolding tool.
│   ├── package.json
│   ├── src/
│   │   ├── commands/
│   │   │   ├── create-slice.ts            # Phase 0: Generate FSD slice (folder structure + files).
│   │   │   ├── create-segment.ts          # Phase 0: Add segment to existing slice.
│   │   │   └── validate-structure.ts      # Phase 0: Steiger wrapper with custom rules.
│   │   └── templates/
│   │       ├── component.tsx.hbs          # Phase 0: Handlebars template for React components.
│   │       ├── feature.ts.hbs             # Phase 0: Template for feature slices.
│   │       └── test.ts.hbs                # Phase 0: Vitest test template.
│   └── README.md                          # CLI documentation.
│
├── typescript/
│   └── src/
│       └── strict-rules.json              # Phase 0: Additional strict TypeScript compiler options.
│
└── playwright/
    └── src/
        └── fixtures.ts                    # Phase 1: Shared E2E test fixtures (auth states, tenant setup).
```

---

## 📁 tests/ (20 files)
*Cross-Package Testing—Integration and E2E tests that span multiple packages.*

```text
tests/
├── integration/                           # Critical path integration tests.
│   ├── tenant-isolation.spec.ts           # Phase 0: MUST pass. Verifies RLS policies prevent cross-tenant access.
│   ├── rls-bypass.spec.ts                 # Phase 0: Attempts known RLS bypass techniques (CVE checks).
│   ├── middleware-security.spec.ts        # Phase 0: Tests security headers, CVE-2025-29927 protection.
│   └── database/
│       ├── connection.spec.ts             # Phase 0: Pool management and timeout handling.
│       └── migration.spec.ts              # Phase 0: Migration rollback and idempotency.
│
├── e2e/                                   # Golden path user flows (Playwright).
│   ├── fixtures/
│   │   ├── tenants.ts                     # Phase 0: Test tenant factory (Acme Corp, Test Inc).
│   │   ├── users.ts                       # Phase 0: Test user factory (admin, member, viewer roles).
│   │   └── leads.ts                       # Phase 0: Test lead factory (qualified, new, converted).
│   ├── pages/
│   │   ├── LoginPage.ts                   # Phase 0: Page Object Model for login.
│   │   ├── DashboardPage.ts               # Phase 0: POM for dashboard interactions.
│   │   └── LeadPage.ts                    # Phase 0: POM for lead management.
│   └── specs/
│       ├── golden-path.spec.ts            # Phase 0: Signup → Lead → Booking flow (critical revenue path).
│       ├── auth.spec.ts                   # Phase 0: Login, logout, password reset.
│       ├── leads.spec.ts                  # Phase 0: CRUD operations on leads.
│       ├── booking.spec.ts                # Phase 1: Calendar booking flow.
│       └── billing.spec.ts                # Phase 0: Subscription checkout.
│
└── load/
    └── k6/                                # Phase 3: Performance tests (see scripts/load-test).
```

---

**Summary Statistics:**
- **Total Files:** 1,124
- **Architecture:** FSD v2.1 with strict layer boundaries (@x notation)
- **Security:** Zero-trust multi-tenancy (RLS, AES-256-GCM, CVE-2025-29927 mitigation)
- **Performance:** Edge-cached, PPR-enabled, bundle-budgeted (<150KB marketing)
- **Scale:** Designed for 1000+ concurrent tenants with complete data isolation

*This manifest serves as the definitive architectural blueprint for the 6-month delivery timeline.*
