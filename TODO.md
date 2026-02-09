# Hair Salon Template - Implementation TODO

## Overview
This document tracks all remaining implementation tasks needed to complete the hair salon template. Configuration and infrastructure are complete; this list focuses on feature development.

**Status:** Configuration ✅ | Build 🔴 | Development 🚀

---

## Critical Path (Blocking Build)

### 1. Blog System
- [ ] Create `features/blog/lib/blog.ts` - Blog post management and metadata
- [ ] Create `features/blog/lib/blog-images.ts` - Image handling for blog posts
- [ ] Create `features/blog/components/BlogPostContent.tsx` - MDX content renderer with syntax highlighting
- [ ] Add missing dependencies: `next-mdx-remote`, `gray-matter`, `reading-time`, `remark-gfm`, `rehype-slug`, `rehype-pretty-code`
- [ ] Create sample blog posts in `blogs/` directory (MDX format)

### 2. Contact Form System
- [ ] Create `features/contact/components/ContactForm.tsx` - Form UI component
- [ ] Create `features/contact/lib/contact-form-schema.ts` - Zod validation schema
- [ ] Create `features/contact/lib/constants.ts` - Form field definitions
- [ ] Add missing dependencies: `react-hook-form`, `@hookform/resolvers`
- [ ] Set up backend form submission (HubSpot or Supabase integration)

### 3. Analytics & Consent
- [ ] Create `lib/analytics-consent.ts` - Cookie consent management
- [ ] Implement consent banner state persistence
- [ ] Connect to existing `features/analytics/` setup

### 4. Search System
- [ ] Create `features/search/components/SearchDialog.tsx` - Search modal/dialog UI
- [ ] Create `features/search/components/SearchPage.tsx` - Full search results page
- [ ] Fix `SearchItem` type to include: `id`, `href`, `type`, `tags`
- [ ] Ensure search indexing includes blog posts and services

### 5. Services Feature
- [ ] Create `features/services/components/ServicesOverview.tsx` - Services listing component
- [ ] Create `features/services/components/ServiceDetailLayout.tsx` - Service detail page layout
- [ ] Populate services data (coloring, haircuts, treatments, special-occasions)

---

## Type & Export Issues

### Module Exports
- [ ] `features/blog/index.ts` - Export `BlogPostContent` as named export
- [ ] `features/contact/index.ts` - Export `ContactForm` as named export
- [ ] `features/search/index.ts` - Export `SearchDialog` and `SearchPage` as named exports
- [ ] `features/services/index.ts` - Export `ServicesOverview` and `ServiceDetailLayout` as named exports
- [ ] `components/ui/Button.tsx` - Add default export or update imports in `InstallPrompt.tsx`

### Type Definitions
- [ ] Add `options` property to `SelectProps` interface (used in book page)
- [ ] Define `SearchItem` interface with required properties
- [ ] Add proper types for blog post metadata
- [ ] Fix undefined navigation element reference issue in `Navigation.tsx`

### Unused Variables
- [ ] Remove unused `requestId` in `lib/request-context.ts`
- [ ] Resolve implicit `any` types in multiple files (use proper generics)

---

## Dependencies to Add

### Essential
- [ ] `react-hook-form` - Form state management
- [ ] `@hookform/resolvers/zod` - Schema validation integration
- [ ] `next-mdx-remote` - MDX content rendering in Next.js
- [ ] `gray-matter` - YAML frontmatter parsing

### Optional but Recommended
- [ ] `@upstash/ratelimit` - API rate limiting
- [ ] `@upstash/redis` - Serverless Redis for rate limiting
- [ ] `reading-time` - Estimated reading time for blog posts
- [ ] Markdown plugins: `remark-gfm`, `rehype-slug`, `rehype-pretty-code`

---

## Feature Implementation Details

### Blog Posts
- [ ] Create `blogs/` directory structure
- [ ] Add sample posts in MDX format with frontmatter (title, date, author, excerpt, etc.)
- [ ] Implement dynamic route `app/blog/[slug]/page.tsx`
- [ ] Generate static routes at build time
- [ ] Add RSS feed generation (optional)

### Contact Form
- [ ] Design form fields (name, email, phone, message, service type)
- [ ] Set up validation with Zod
- [ ] Implement submission handler (API route or server action)
- [ ] Add rate limiting to prevent spam
- [ ] Connect to email/CRM (HubSpot or Supabase)

### Services Pages
- [ ] Define service categories and details
- [ ] Create service detail pages: `/services/coloring`, `/services/haircuts`, etc.
- [ ] Add pricing information
- [ ] Link to booking system

### Search
- [ ] Index all pages, blog posts, and services
- [ ] Implement search algorithm (full-text or simple filtering)
- [ ] Create search API endpoint
- [ ] Add keyboard shortcuts (Cmd/Ctrl+K) for search dialog

### Analytics
- [ ] Set up Sentry error tracking
- [ ] Implement Google Analytics/Vercel Analytics
- [ ] Cookie consent management for tracking
- [ ] User consent persistence

---

## Component Fixes

### InstallPrompt.tsx
- [ ] Fix Button import - change from default to named import from `@repo/ui`
- [ ] Update: `import { Button } from '@repo/ui'`

### Navigation.tsx
- [ ] Add null check for `lastElement` and `firstElement` before using
- [ ] Fix SearchDialog integration

### Gallery Page
- [ ] Fix Button variant - change `"outline"` to valid variant (`"text"`, `"primary"`, or `"secondary"`)

### Book Page
- [ ] Add `options` property to Select components (line 71 and 91)
- [ ] Define available options for each Select

---

## Page-Specific Implementations

### `/blog` Pages
- [ ] Implement blog list with filtering and sorting
- [ ] Add pagination support
- [ ] Category/tag filtering

### `/contact` Page
- [ ] Ensure ContactForm component loads
- [ ] Add form submission feedback (success/error states)
- [ ] Form accessibility compliance

### `/book` Page (Appointment Booking)
- [ ] Integration with appointment system
- [ ] Calendar/date picker
- [ ] Service selection
- [ ] Stylist selection
- [ ] Payment processing (if applicable)

### `/search` Page
- [ ] Real-time search results
- [ ] Search suggestions/autocomplete
- [ ] Results filtering

---

## Testing & Validation

- [ ] Unit tests for form validation schemas
- [ ] Integration tests for form submission
- [ ] E2E tests for critical user journeys
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance testing (Core Web Vitals)
- [ ] Mobile responsiveness validation

---

## Optional Enhancements

- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA) capabilities
- [ ] Image optimization and CDN setup
- [ ] Caching strategies
- [ ] API rate limiting
- [ ] Admin dashboard for content management
- [ ] Email marketing integration
- [ ] SMS notifications for appointments
- [ ] Google Business profile integration
- [ ] Review/ratings system

---

## Deployment Checklist

- [ ] Environment variables configured (.env.local)
- [ ] Database connections tested (Supabase or alternative)
- [ ] Third-party API keys secured
- [ ] Build process verified on clean machine
- [ ] Staging deployment successful
- [ ] Production deployment plan
- [ ] Monitoring and alerting setup
- [ ] Backup strategy in place

---

## Notes

- All configuration and infrastructure is production-ready
- ESLint and TypeScript are properly configured
- Use `pnpm dev` for development
- Use `pnpm build` to test production build
- Use `pnpm lint` and `pnpm type-check` regularly
- See CONFIG.md for detailed configuration documentation

---

**Last Updated:** February 9, 2026  
**Estimated Completion:** 2-4 weeks (depending on scope and team size)
