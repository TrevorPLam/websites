# Repository Index

Status: INCOMPLETE. Will be updated as files are audited.

## Task Management

This repository uses a structured task workflow to maintain quality and documentation:

- **[TODO.md](TODO.md)** - Active tasks currently in progress
- **[BACKLOG.md](BACKLOG.md)** - Queued tasks awaiting promotion
- **[ARCHIVE.md](ARCHIVE.md)** - Completed tasks with session notes
- **[docs/TASK_WORKFLOW.md](docs/TASK_WORKFLOW.md)** - Complete workflow documentation
- **[docs/DEFINITION_OF_DONE.md](docs/DEFINITION_OF_DONE.md)** - Quality checklist

See [CONTRIBUTING.md](CONTRIBUTING.md) for contributor workflow guidelines.

## Repo Map

- TODO(verify): Populate folder map from docs/FILE_INVENTORY.md.

## Quickstart

- TODO(verify): Add verified commands from docs/TESTING_STATUS.md.

## Architecture Overview

- TODO(verify): Summarize system architecture from docs/ARCHITECTURE_MAP.md.

## Route Catalog Summary

- See docs/ROUTE_CATALOG.md.

## Integrations Summary

- See docs/INTEGRATIONS_AUDIT.md.

## Package Graph

- TODO(verify): Add apps/packages graph after auditing package.json files.

## File Atlas

- Root
  - [package.json](package.json): Monorepo scripts, workspaces, and tool versions. See [docs/file-meta/package.json.md](docs/file-meta/package.json.md) for metaheader.
  - [pnpm-workspace.yaml](pnpm-workspace.yaml): Workspace globs for pnpm package discovery. See [docs/file-meta/pnpm-workspace.yaml.md](docs/file-meta/pnpm-workspace.yaml.md) for metaheader.
  - [turbo.json](turbo.json): Turbo pipeline tasks and caching outputs. See [docs/file-meta/turbo.json.md](docs/file-meta/turbo.json.md) for metaheader.
  - [.pnpmrc](.pnpmrc): pnpm install rules (peer deps, lockfile, hoisting). See [docs/file-meta/.pnpmrc.md](docs/file-meta/.pnpmrc.md) for metaheader.
  - [.npmrc](.npmrc): npm registry configuration. See [docs/file-meta/.npmrc.md](docs/file-meta/.npmrc.md) for metaheader.
  - [.editorconfig](.editorconfig): EditorConfig formatting rules for the repo.
  - [.env.example](.env.example): Environment variable template for local development.
  - [.eslintignore](.eslintignore): ESLint ignore patterns for generated and vendor paths.
  - [.gitignore](.gitignore): Git ignore rules for generated and local-only files.
  - [.markdownlint.json](.markdownlint.json): Markdown linting rules. See [docs/file-meta/.markdownlint.json.md](docs/file-meta/.markdownlint.json.md) for metaheader.
  - [.prettierignore](.prettierignore): Prettier ignore patterns for generated and vendor files.
  - [.prettierrc](.prettierrc): Prettier formatting rules. See [docs/file-meta/.prettierrc.md](docs/file-meta/.prettierrc.md) for metaheader.
  - [ANALYSIS.md](ANALYSIS.md): Legacy analysis; currently UNVERIFIED and pending re-audit.
  - [ARCHIVE.md](ARCHIVE.md): Completed tasks with comprehensive session notes. See [docs/TASK_WORKFLOW.md](docs/TASK_WORKFLOW.md) for archival process.
  - [BACKLOG.md](BACKLOG.md): Queued tasks awaiting promotion to active TODO. See [docs/TASK_WORKFLOW.md](docs/TASK_WORKFLOW.md) for promotion rules.
  - [CONFIG.md](CONFIG.md): Configuration overview with partial verification notes.
  - [CONTRIBUTING.md](CONTRIBUTING.md): Contribution guide with task workflow integration.
  - [docker-compose.yml](docker-compose.yml): Local Docker Compose definition. See [docs/file-meta/docker-compose.yml.md](docs/file-meta/docker-compose.yml.md) for metaheader.
  - [jest.config.js](jest.config.js): Jest root configuration for monorepo tests.
  - [jest.helpers.ts](jest.helpers.ts): Shared Jest helper utilities for tests.
  - [jest.setup.js](jest.setup.js): Jest global setup and console suppression.
  - [LICENSE](LICENSE): MIT license text. See [docs/file-meta/LICENSE.md](docs/file-meta/LICENSE.md) for metaheader.
  - [README.md](README.md): Root overview with partial verification notes.
  - [SECURITY.md](SECURITY.md): Security policy (placeholder contact noted).
  - [tasks.md](tasks.md): Audit task tracker checklist.
  - [TODO.md](TODO.md): Active implementation tasks. See [docs/TASK_WORKFLOW.md](docs/TASK_WORKFLOW.md) for task lifecycle.
  - [tsconfig.base.json](tsconfig.base.json): Shared TypeScript compiler options. See [docs/file-meta/tsconfig.base.json.md](docs/file-meta/tsconfig.base.json.md) for metaheader.
  - [tsconfig.json](tsconfig.json): Root TypeScript config. See [docs/file-meta/tsconfig.json.md](docs/file-meta/tsconfig.json.md) for metaheader.
- apps/web/app
  - [apps/web/app/layout.tsx](apps/web/app/layout.tsx): Global app shell, metadata, CSP nonce, and shared UI wrappers.
  - [apps/web/app/page.tsx](apps/web/app/page.tsx): Home page composition and above-the-fold ordering.
  - [apps/web/app/providers.tsx](apps/web/app/providers.tsx): Client providers wrapper with error boundary and breadcrumbs.
  - [apps/web/app/loading.tsx](apps/web/app/loading.tsx): Global loading UI for route-level suspense.
  - [apps/web/app/not-found.tsx](apps/web/app/not-found.tsx): Custom 404 UI with recovery links.
  - [apps/web/app/robots.ts](apps/web/app/robots.ts): robots.txt metadata route.
  - [apps/web/app/sitemap.ts](apps/web/app/sitemap.ts): sitemap.xml metadata route.
  - [apps/web/app/about/page.tsx](apps/web/app/about/page.tsx): About page story, values, stats, and CTAs.
  - [apps/web/app/blog/page.tsx](apps/web/app/blog/page.tsx): Blog index with categories and post cards.
  - [apps/web/app/blog/[slug]/page.tsx](apps/web/app/blog/[slug]/page.tsx): Blog post detail view with structured data.
  - [apps/web/app/book/page.tsx](apps/web/app/book/page.tsx): Booking request form and salon info.
  - [apps/web/app/contact/page.tsx](apps/web/app/contact/page.tsx): Contact form, salon info, and reschedule CTA.
  - [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx): Gallery grid with placeholder portfolio.
  - [apps/web/app/pricing/page.tsx](apps/web/app/pricing/page.tsx): Pricing menu, FAQs, and booking CTA.
  - [apps/web/app/privacy/page.tsx](apps/web/app/privacy/page.tsx): Privacy policy content.
  - [apps/web/app/search/page.tsx](apps/web/app/search/page.tsx): Search experience powered by the site index.
  - [apps/web/app/services/page.tsx](apps/web/app/services/page.tsx): Services overview and CTAs.
  - [apps/web/app/services/coloring/page.tsx](apps/web/app/services/coloring/page.tsx): Coloring service detail.
  - [apps/web/app/services/haircuts/page.tsx](apps/web/app/services/haircuts/page.tsx): Haircuts service detail.
  - [apps/web/app/services/special-occasions/page.tsx](apps/web/app/services/special-occasions/page.tsx): Special occasions service detail.
  - [apps/web/app/services/treatments/page.tsx](apps/web/app/services/treatments/page.tsx): Treatments service detail.
  - [apps/web/app/team/page.tsx](apps/web/app/team/page.tsx): Team bios and hiring CTA.
  - [apps/web/app/terms/page.tsx](apps/web/app/terms/page.tsx): Terms of Service template content.
  - [apps/web/app/api/og/route.tsx](apps/web/app/api/og/route.tsx): Open Graph image generation route.
- apps/web
  - [apps/web/eslint.config.mjs](apps/web/eslint.config.mjs): App-specific ESLint config.
  - [apps/web/middleware.ts](apps/web/middleware.ts): CSP nonce injection, security headers, and request context.
  - [apps/web/next.config.js](apps/web/next.config.js): Next.js config for images, headers, and build options.
  - [apps/web/postcss.config.js](apps/web/postcss.config.js): PostCSS config for Tailwind and autoprefixer.
  - [apps/web/tailwind.config.js](apps/web/tailwind.config.js): Tailwind theme and content sources.
- apps/web/components
  - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx): Consent gating UI for analytics activation.
  - [apps/web/components/Breadcrumbs.tsx](apps/web/components/Breadcrumbs.tsx): Breadcrumb navigation for interior routes.
  - [apps/web/components/ErrorBoundary.tsx](apps/web/components/ErrorBoundary.tsx): Client error boundary wrapper.
  - [apps/web/components/FinalCTA.tsx](apps/web/components/FinalCTA.tsx): Final CTA marketing block.
  - [apps/web/components/Footer.tsx](apps/web/components/Footer.tsx): Site footer navigation and contact info.
  - [apps/web/components/Hero.tsx](apps/web/components/Hero.tsx): Homepage hero section.
  - [apps/web/components/InstallPrompt.tsx](apps/web/components/InstallPrompt.tsx): PWA install prompt handler.
  - [apps/web/components/Navigation.tsx](apps/web/components/Navigation.tsx): Global navigation bar.
  - [apps/web/components/SkipToContent.tsx](apps/web/components/SkipToContent.tsx): Accessibility skip link.
  - [apps/web/components/SocialProof.tsx](apps/web/components/SocialProof.tsx): Testimonials and ratings block.
  - [apps/web/components/ValueProps.tsx](apps/web/components/ValueProps.tsx): Value proposition marketing grid.
- apps/web/features
  - [apps/web/features/analytics/index.ts](apps/web/features/analytics/index.ts): Analytics feature exports.
  - [apps/web/features/analytics/lib/analytics-consent.ts](apps/web/features/analytics/lib/analytics-consent.ts): Consent storage and evaluation helpers.
  - [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts): Analytics initialization and tracking helpers.
  - [apps/web/features/blog/index.ts](apps/web/features/blog/index.ts): Blog feature exports.
  - [apps/web/features/blog/components/BlogPostContent.tsx](apps/web/features/blog/components/BlogPostContent.tsx): Blog post content renderer.
  - [apps/web/features/blog/lib/blog-images.ts](apps/web/features/blog/lib/blog-images.ts): Blog image lookup helpers.
  - [apps/web/features/blog/lib/blog.ts](apps/web/features/blog/lib/blog.ts): Blog post data access helpers.
  - [apps/web/features/contact/index.ts](apps/web/features/contact/index.ts): Contact feature exports.
  - [apps/web/features/contact/components/ContactForm.tsx](apps/web/features/contact/components/ContactForm.tsx): Contact form UI and validation wiring.
  - [apps/web/features/contact/lib/contact-form-schema.ts](apps/web/features/contact/lib/contact-form-schema.ts): Contact form schema and validation rules.
  - [apps/web/features/hubspot/index.ts](apps/web/features/hubspot/index.ts): HubSpot integration exports.
  - [apps/web/features/hubspot/lib/hubspot-client.ts](apps/web/features/hubspot/lib/hubspot-client.ts): HubSpot API client helper.
  - [apps/web/features/search/index.ts](apps/web/features/search/index.ts): Search feature exports.
  - [apps/web/features/search/components/SearchDialog.tsx](apps/web/features/search/components/SearchDialog.tsx): Site-wide search dialog UI.
  - [apps/web/features/search/components/SearchPage.tsx](apps/web/features/search/components/SearchPage.tsx): Search results UI.
  - [apps/web/features/services/index.ts](apps/web/features/services/index.ts): Services feature exports.
  - [apps/web/features/services/components/ServiceDetailLayout.tsx](apps/web/features/services/components/ServiceDetailLayout.tsx): Service detail layout wrapper.
  - [apps/web/features/services/components/ServicesOverview.tsx](apps/web/features/services/components/ServicesOverview.tsx): Services overview content block.
  - [apps/web/features/supabase/index.ts](apps/web/features/supabase/index.ts): Supabase integration exports.
  - [apps/web/features/supabase/lib/supabase-leads.ts](apps/web/features/supabase/lib/supabase-leads.ts): Supabase lead capture helper.
- apps/web/lib
  - [apps/web/lib/actions.ts](apps/web/lib/actions.ts): Exported server actions.
  - [apps/web/lib/constants.ts](apps/web/lib/constants.ts): Site constants and defaults.
  - [apps/web/lib/csp.ts](apps/web/lib/csp.ts): CSP nonce and security policy helpers.
  - [apps/web/lib/env.public.ts](apps/web/lib/env.public.ts): Public env schema and validation.
  - [apps/web/lib/env.ts](apps/web/lib/env.ts): Server env schema and validation.
  - [apps/web/lib/logger.ts](apps/web/lib/logger.ts): Logging utilities with Sentry hooks.
  - [apps/web/lib/rate-limit.ts](apps/web/lib/rate-limit.ts): Upstash rate limiting helpers.
  - [apps/web/lib/request-context.server.ts](apps/web/lib/request-context.server.ts): Per-request context storage (server).
  - [apps/web/lib/request-context.ts](apps/web/lib/request-context.ts): Per-request context helpers.
  - [apps/web/lib/request-validation.ts](apps/web/lib/request-validation.ts): Request validation and shaping helpers.
  - [apps/web/lib/sanitize.ts](apps/web/lib/sanitize.ts): Input sanitization helpers.
  - [apps/web/lib/search.ts](apps/web/lib/search.ts): Search index helpers.
  - [apps/web/lib/security-headers.ts](apps/web/lib/security-headers.ts): Security header definitions.
  - [apps/web/lib/sentry-client.ts](apps/web/lib/sentry-client.ts): Sentry browser initialization.
  - [apps/web/lib/sentry-sanitize.ts](apps/web/lib/sentry-sanitize.ts): Sentry data scrubbing helpers.
  - [apps/web/lib/sentry-server.ts](apps/web/lib/sentry-server.ts): Sentry server initialization.
  - [apps/web/lib/utils.ts](apps/web/lib/utils.ts): Utility helpers.
  - [apps/web/lib/actions/helpers.ts](apps/web/lib/actions/helpers.ts): Server action helpers.
  - [apps/web/lib/actions/hubspot.ts](apps/web/lib/actions/hubspot.ts): HubSpot submission action.
  - [apps/web/lib/actions/submit.ts](apps/web/lib/actions/submit.ts): Contact form submission orchestrator.
  - [apps/web/lib/actions/supabase.ts](apps/web/lib/actions/supabase.ts): Supabase submission action.
  - [apps/web/lib/actions/types.ts](apps/web/lib/actions/types.ts): Shared action types.
  - [apps/web/lib/**tests**/env-setup.ts](apps/web/lib/__tests__/env-setup.ts): Test env setup.
  - [apps/web/lib/**tests**/env.test.ts](apps/web/lib/__tests__/env.test.ts): Env validation tests.
  - [apps/web/lib/**tests**/sanitize.test.ts](apps/web/lib/__tests__/sanitize.test.ts): Sanitize helper tests.
- packages/config/eslint-config
  - [packages/config/eslint-config/library.js](packages/config/eslint-config/library.js): Shared ESLint config for library packages.
  - [packages/config/eslint-config/next.js](packages/config/eslint-config/next.js): Shared ESLint config for Next.js apps.
- packages/ui
  - [packages/ui/eslint.config.mjs](packages/ui/eslint.config.mjs): UI package ESLint config.
- packages/ui/src/components
  - [packages/ui/src/components/index.ts](packages/ui/src/components/index.ts): UI component exports.
  - [packages/ui/src/components/Accordion.tsx](packages/ui/src/components/Accordion.tsx): Accordion component.
  - [packages/ui/src/components/Button.tsx](packages/ui/src/components/Button.tsx): Button component.
  - [packages/ui/src/components/Card.tsx](packages/ui/src/components/Card.tsx): Card component.
  - [packages/ui/src/components/Container.tsx](packages/ui/src/components/Container.tsx): Layout container component.
  - [packages/ui/src/components/Input.tsx](packages/ui/src/components/Input.tsx): Input component.
  - [packages/ui/src/components/Section.tsx](packages/ui/src/components/Section.tsx): Section layout component.
  - [packages/ui/src/components/Select.tsx](packages/ui/src/components/Select.tsx): Select component.
  - [packages/ui/src/components/Skeleton.tsx](packages/ui/src/components/Skeleton.tsx): Skeleton loading component.
  - [packages/ui/src/components/Textarea.tsx](packages/ui/src/components/Textarea.tsx): Textarea component.
  - [packages/ui/src/components/**tests**/index.test.ts](packages/ui/src/components/__tests__/index.test.ts): UI component tests.
- packages/utils
  - [packages/utils/eslint.config.mjs](packages/utils/eslint.config.mjs): Utils package ESLint config.
- packages/utils/src
  - [packages/utils/src/index.ts](packages/utils/src/index.ts): Shared utility exports.
  - [packages/utils/src/**tests**/index.test.ts](packages/utils/src/__tests__/index.test.ts): Utils package tests.

## Quality Dashboard

- TODO(verify): Summarize top issues from docs/QUALITY_REPORT.md.
- Build/test status: UNVERIFIED (see docs/TESTING_STATUS.md).

## Audit Progress

- In progress. Completed: [package.json](package.json), [pnpm-workspace.yaml](pnpm-workspace.yaml), [turbo.json](turbo.json), [.pnpmrc](.pnpmrc), [.npmrc](.npmrc), [.editorconfig](.editorconfig), [.env.example](.env.example), [.eslintignore](.eslintignore), [.gitignore](.gitignore), [.markdownlint.json](.markdownlint.json), [.prettierignore](.prettierignore), [.prettierrc](.prettierrc), [ANALYSIS.md](ANALYSIS.md), [CONFIG.md](CONFIG.md), [CONTRIBUTING.md](CONTRIBUTING.md), [docker-compose.yml](docker-compose.yml), [jest.config.js](jest.config.js), [jest.helpers.ts](jest.helpers.ts), [jest.setup.js](jest.setup.js), [LICENSE](LICENSE), [README.md](README.md), [SECURITY.md](SECURITY.md), [tasks.md](tasks.md), [TODO.md](TODO.md), [tsconfig.base.json](tsconfig.base.json), [tsconfig.json](tsconfig.json), [apps/web/app/layout.tsx](apps/web/app/layout.tsx), [apps/web/app/page.tsx](apps/web/app/page.tsx), [apps/web/app/providers.tsx](apps/web/app/providers.tsx), [apps/web/app/loading.tsx](apps/web/app/loading.tsx), [apps/web/app/not-found.tsx](apps/web/app/not-found.tsx), [apps/web/app/robots.ts](apps/web/app/robots.ts), [apps/web/app/sitemap.ts](apps/web/app/sitemap.ts), [apps/web/app/about/page.tsx](apps/web/app/about/page.tsx), [apps/web/app/blog/page.tsx](apps/web/app/blog/page.tsx), [apps/web/app/blog/[slug]/page.tsx](apps/web/app/blog/[slug]/page.tsx), [apps/web/app/book/page.tsx](apps/web/app/book/page.tsx), [apps/web/app/contact/page.tsx](apps/web/app/contact/page.tsx), [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx), [apps/web/app/pricing/page.tsx](apps/web/app/pricing/page.tsx), [apps/web/app/privacy/page.tsx](apps/web/app/privacy/page.tsx), [apps/web/app/search/page.tsx](apps/web/app/search/page.tsx), [apps/web/app/services/page.tsx](apps/web/app/services/page.tsx), [apps/web/app/services/coloring/page.tsx](apps/web/app/services/coloring/page.tsx), [apps/web/app/services/haircuts/page.tsx](apps/web/app/services/haircuts/page.tsx), [apps/web/app/services/special-occasions/page.tsx](apps/web/app/services/special-occasions/page.tsx), [apps/web/app/services/treatments/page.tsx](apps/web/app/services/treatments/page.tsx), [apps/web/app/team/page.tsx](apps/web/app/team/page.tsx), [apps/web/app/terms/page.tsx](apps/web/app/terms/page.tsx), [apps/web/app/api/og/route.tsx](apps/web/app/api/og/route.tsx), [apps/web/eslint.config.mjs](apps/web/eslint.config.mjs), [apps/web/middleware.ts](apps/web/middleware.ts), [apps/web/next.config.js](apps/web/next.config.js), [apps/web/postcss.config.js](apps/web/postcss.config.js), [apps/web/tailwind.config.js](apps/web/tailwind.config.js), [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx), [apps/web/components/Breadcrumbs.tsx](apps/web/components/Breadcrumbs.tsx), [apps/web/components/ErrorBoundary.tsx](apps/web/components/ErrorBoundary.tsx), [apps/web/components/FinalCTA.tsx](apps/web/components/FinalCTA.tsx), [apps/web/components/Footer.tsx](apps/web/components/Footer.tsx), [apps/web/components/Hero.tsx](apps/web/components/Hero.tsx), [apps/web/components/InstallPrompt.tsx](apps/web/components/InstallPrompt.tsx), [apps/web/components/Navigation.tsx](apps/web/components/Navigation.tsx), [apps/web/components/SkipToContent.tsx](apps/web/components/SkipToContent.tsx), [apps/web/components/SocialProof.tsx](apps/web/components/SocialProof.tsx), [apps/web/components/ValueProps.tsx](apps/web/components/ValueProps.tsx), [apps/web/features/analytics/index.ts](apps/web/features/analytics/index.ts), [apps/web/features/analytics/lib/analytics-consent.ts](apps/web/features/analytics/lib/analytics-consent.ts), [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts), [apps/web/features/blog/index.ts](apps/web/features/blog/index.ts), [apps/web/features/blog/components/BlogPostContent.tsx](apps/web/features/blog/components/BlogPostContent.tsx), [apps/web/features/blog/lib/blog-images.ts](apps/web/features/blog/lib/blog-images.ts), [apps/web/features/blog/lib/blog.ts](apps/web/features/blog/lib/blog.ts), [apps/web/features/contact/index.ts](apps/web/features/contact/index.ts), [apps/web/features/contact/components/ContactForm.tsx](apps/web/features/contact/components/ContactForm.tsx), [apps/web/features/contact/lib/contact-form-schema.ts](apps/web/features/contact/lib/contact-form-schema.ts), [apps/web/features/hubspot/index.ts](apps/web/features/hubspot/index.ts), [apps/web/features/hubspot/lib/hubspot-client.ts](apps/web/features/hubspot/lib/hubspot-client.ts), [apps/web/features/search/index.ts](apps/web/features/search/index.ts), [apps/web/features/search/components/SearchDialog.tsx](apps/web/features/search/components/SearchDialog.tsx), [apps/web/features/search/components/SearchPage.tsx](apps/web/features/search/components/SearchPage.tsx), [apps/web/features/services/index.ts](apps/web/features/services/index.ts), [apps/web/features/services/components/ServiceDetailLayout.tsx](apps/web/features/services/components/ServiceDetailLayout.tsx), [apps/web/features/services/components/ServicesOverview.tsx](apps/web/features/services/components/ServicesOverview.tsx), [apps/web/features/supabase/index.ts](apps/web/features/supabase/index.ts), [apps/web/features/supabase/lib/supabase-leads.ts](apps/web/features/supabase/lib/supabase-leads.ts), [apps/web/lib/actions.ts](apps/web/lib/actions.ts), [apps/web/lib/constants.ts](apps/web/lib/constants.ts), [apps/web/lib/csp.ts](apps/web/lib/csp.ts), [apps/web/lib/env.public.ts](apps/web/lib/env.public.ts), [apps/web/lib/env.ts](apps/web/lib/env.ts), [apps/web/lib/logger.ts](apps/web/lib/logger.ts), [apps/web/lib/rate-limit.ts](apps/web/lib/rate-limit.ts), [apps/web/lib/request-context.server.ts](apps/web/lib/request-context.server.ts), [apps/web/lib/request-context.ts](apps/web/lib/request-context.ts), [apps/web/lib/request-validation.ts](apps/web/lib/request-validation.ts), [apps/web/lib/sanitize.ts](apps/web/lib/sanitize.ts), [apps/web/lib/search.ts](apps/web/lib/search.ts), [apps/web/lib/security-headers.ts](apps/web/lib/security-headers.ts), [apps/web/lib/sentry-client.ts](apps/web/lib/sentry-client.ts), [apps/web/lib/sentry-sanitize.ts](apps/web/lib/sentry-sanitize.ts), [apps/web/lib/sentry-server.ts](apps/web/lib/sentry-server.ts), [apps/web/lib/utils.ts](apps/web/lib/utils.ts), [apps/web/lib/actions/helpers.ts](apps/web/lib/actions/helpers.ts), [apps/web/lib/actions/hubspot.ts](apps/web/lib/actions/hubspot.ts), [apps/web/lib/actions/submit.ts](apps/web/lib/actions/submit.ts), [apps/web/lib/actions/supabase.ts](apps/web/lib/actions/supabase.ts), [apps/web/lib/actions/types.ts](apps/web/lib/actions/types.ts), [apps/web/lib/**tests**/env-setup.ts](apps/web/lib/__tests__/env-setup.ts), [apps/web/lib/**tests**/env.test.ts](apps/web/lib/__tests__/env.test.ts), [apps/web/lib/**tests**/sanitize.test.ts](apps/web/lib/__tests__/sanitize.test.ts), [packages/config/eslint-config/library.js](packages/config/eslint-config/library.js), [packages/config/eslint-config/next.js](packages/config/eslint-config/next.js), [packages/ui/eslint.config.mjs](packages/ui/eslint.config.mjs), [packages/ui/src/components/index.ts](packages/ui/src/components/index.ts), [packages/ui/src/components/Accordion.tsx](packages/ui/src/components/Accordion.tsx), [packages/ui/src/components/Button.tsx](packages/ui/src/components/Button.tsx), [packages/ui/src/components/Card.tsx](packages/ui/src/components/Card.tsx), [packages/ui/src/components/Container.tsx](packages/ui/src/components/Container.tsx), [packages/ui/src/components/Input.tsx](packages/ui/src/components/Input.tsx), [packages/ui/src/components/Section.tsx](packages/ui/src/components/Section.tsx), [packages/ui/src/components/Select.tsx](packages/ui/src/components/Select.tsx), [packages/ui/src/components/Skeleton.tsx](packages/ui/src/components/Skeleton.tsx), [packages/ui/src/components/Textarea.tsx](packages/ui/src/components/Textarea.tsx), [packages/ui/src/components/**tests**/index.test.ts](packages/ui/src/components/__tests__/index.test.ts), [packages/utils/eslint.config.mjs](packages/utils/eslint.config.mjs), [packages/utils/src/index.ts](packages/utils/src/index.ts), [packages/utils/src/**tests**/index.test.ts](packages/utils/src/__tests__/index.test.ts).
