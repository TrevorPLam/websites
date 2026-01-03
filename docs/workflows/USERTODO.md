# User TODO - Remaining Action Items

This document contains action items that require manual intervention, external service setup, or user decisions.

---

## 🔴 Critical - Do First

### 1. ~~Install Dependencies~~ ✅ DONE

### 2. ~~Create PWA Icons~~ ✅ DONE
Icons have been generated in `/public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)
- `og-image.jpg` (1200x630)
- `logo.png` (200x60)
- `favicon.png` (32x32)

**Note**: These are placeholder icons with "YDM" branding. Replace with your actual brand assets when ready.

### 3. Configure Production API Keys
The `.env.local` file has been created with development defaults. 

**For production**, you need to add your API keys:
```env
NEXT_PUBLIC_SITE_URL=https://yourdedicatedmarketer.com
RESEND_API_KEY=re_your_actual_api_key
CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

---

## 🟡 High Priority - This Sprint

### 4. Implement Distributed Rate Limiting
The current in-memory rate limiting won't work across serverless instances.

**Options (choose one):**

**A) Upstash Redis (Recommended for Vercel/Cloudflare)**
```bash
pnpm add @upstash/ratelimit @upstash/redis
```
- Sign up at https://upstash.com
- Create a Redis database
- Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to env

**B) Vercel KV**
- Enable Vercel KV in your project dashboard
- Use `@vercel/kv` package

**C) Arcjet (All-in-one protection)**
```bash
pnpm add @arcjet/next
```
- Sign up at https://arcjet.com
- Includes rate limiting, bot protection, and more

### 5. Migrate PWA Library
`next-pwa` is deprecated. Migrate to a maintained alternative:

**Option A: @ducanh2912/next-pwa**
```bash
pnpm remove next-pwa
pnpm add @ducanh2912/next-pwa
```

Update `next.config.mjs`:
```javascript
import withPWA from '@ducanh2912/next-pwa'
```

**Option B: Serwist**
```bash
pnpm remove next-pwa
pnpm add @serwist/next
```

### 6. Configure Sentry DSN
1. Create account at https://sentry.io
2. Create a new Next.js project
3. Copy the DSN
4. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_AUTH_TOKEN=sntrys_xxx  # For source maps upload
   ```

### 7. Set Up Resend Email
1. Create account at https://resend.com
2. Verify your domain or use test domain
3. Create API key
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxx
   CONTACT_EMAIL=your@email.com
   ```

---

## 🟠 Medium Priority - Next Sprint

### 8. Add Lighthouse Performance Budgets
Create `.github/lighthouse/budget.json`:
```json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "first-contentful-paint", "budget": 2000 },
      { "metric": "interactive", "budget": 3500 },
      { "metric": "largest-contentful-paint", "budget": 2500 }
    ],
    "resourceSizes": [
      { "resourceType": "total", "budget": 500 },
      { "resourceType": "script", "budget": 200 },
      { "resourceType": "stylesheet", "budget": 50 }
    ]
  }
]
```

### 9. Increase Test Coverage
Current coverage is low. Priority areas:

- [ ] Add tests for `lib/blog.ts`
- [ ] Add tests for `lib/case-studies.ts`
- [ ] Add tests for all UI components in `components/ui/`
- [ ] Add tests for page components
- [ ] Target: 70%+ coverage

Run coverage report:
```bash
pnpm test:coverage
```

### 10. Add E2E Tests for Critical Flows
Priority user journeys to test:

- [ ] Homepage → Services → Contact form submission
- [ ] Blog listing → Blog post → CTA click
- [ ] Mobile navigation flow
- [ ] Contact form validation and submission
- [ ] 404 page handling

Add tests in `tests/e2e/`:
```bash
pnpm test:e2e
```

### 11. Optimize Bundle Size
Current build output is ~276MB. Analyze and optimize:

```bash
ANALYZE=true pnpm build
```

Areas to investigate:
- [ ] Check for duplicate dependencies
- [ ] Lazy load heavy components (MDX processing)
- [ ] Use dynamic imports for below-fold content
- [ ] Review Sentry bundle size
- [ ] Consider removing unused dependencies

---

## 🟢 Low Priority - Future Improvements

### 12. Accessibility Audit
Run a comprehensive accessibility audit:

- [ ] Use axe DevTools browser extension
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Check keyboard navigation
- [ ] Verify color contrast ratios
- [ ] Add skip links (already implemented ✓)
- [ ] Test focus management
- [ ] Target: WCAG 2.1 AA compliance

### 13. Visual Regression Testing
Consider adding visual regression tests:

**Options:**
- Percy (paid, easy setup)
- Chromatic (free for open source)
- Playwright visual comparisons (free, DIY)

### 14. Internationalization (i18n)
If targeting multiple markets:

```bash
pnpm add next-intl
```

- [ ] Set up locale routing
- [ ] Extract strings to translation files
- [ ] Add language switcher

### 15. Advanced Monitoring
Consider upgrading from Sentry-only to:

- [ ] LogRocket - Session replay
- [ ] Datadog - Full observability
- [ ] Vercel Analytics - Web vitals tracking

### 16. Add RSS Feed
For the blog:

- [ ] Create `/app/feed.xml/route.ts`
- [ ] Generate RSS from blog posts
- [ ] Add feed link to header

### 17. Add Search Functionality
Options:
- Algolia DocSearch (free for docs/blogs)
- Pagefind (static search)
- Custom implementation

---

## ✅ Completed by Automated Fix

These items have already been resolved:

- [x] Move `ci.yml` to `.github/workflows/ci.yml`
- [x] Move `dependabot.yml` to `.github/dependabot.yml`
- [x] Move `PULL_REQUEST_TEMPLATE.md` to `.github/`
- [x] Remove duplicate OpenGraph/Twitter metadata in `layout.tsx`
- [x] Fix Sentry logger to work on both server and client
- [x] Add GitHub issue templates (bug report, feature request)
- [x] Install dependencies (`pnpm install`)
- [x] Create PWA icons (icon-192.png, icon-512.png, apple-touch-icon.png)
- [x] Create OG image (og-image.jpg)
- [x] Create logo (logo.png)
- [x] Create `.env.local` with development defaults
- [x] Fix vitest.setup.tsx missing `vi` import

---

## 📋 Quick Reference Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server

# Testing
pnpm test             # Run unit tests
pnpm test:coverage    # Run with coverage
pnpm test:e2e         # Run E2E tests

# Quality
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript check
pnpm format           # Format with Prettier

# Analysis
ANALYZE=true pnpm build  # Bundle analysis
```

---

## 📞 External Services Reference

| Service | Purpose | URL |
|---------|---------|-----|
| Resend | Email delivery | https://resend.com |
| Sentry | Error tracking | https://sentry.io |
| Upstash | Redis rate limiting | https://upstash.com |
| Vercel | Hosting (optional) | https://vercel.com |
| Cloudflare | Hosting/CDN | https://cloudflare.com |

---

*Last updated: December 29, 2025*
