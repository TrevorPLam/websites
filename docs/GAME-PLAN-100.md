# Game Plan: Achieving 100/100 in All Categories

> **Last Updated:** 2026-01-03  
> **Canonical Status:** Supporting  
> **Purpose:** Quality improvement planning and tracking for site metrics  
> **Note:** This document contains reference checklists for planning. For actionable tasks, see [TODO.md](../TODO.md).  
> **See Also:** [DOCS_INDEX.md](./DOCS_INDEX.md)

## Current Status Overview

| Category | Current | Target | Gap | Priority |
|----------|---------|--------|-----|----------|
| **Offline Support** | 100 | 100 | 0 | ✅ Complete |
| **Error Monitoring** | 95 | 100 | +5 | 🟡 Low |
| **SEO** | 95 | 100 | +5 | 🟡 Low |
| **Accessibility** | 90 | 100 | +10 | 🟠 Medium |
| **Performance** | 92 | 100 | +8 | 🟠 Medium |
| **Testing** | 85 | 100 | +15 | 🔴 High |
| **Overall** | 95 | 100 | +5 | 🎯 Goal |

---

## 1. Testing Coverage: 85 → 100 (+15 points)

### Current Gaps
- Component test coverage incomplete (~30%)
- No integration tests
- No E2E tests
- Missing tests for utility functions
- No visual regression testing

### Action Plan

#### Phase 1: Unit Test Coverage (Goal: 80%+)
**Priority: High | Estimated Impact: +7 points**

- [ ] **Component Tests**
  - [ ] Button component (all variants, sizes, states)
  - [ ] Input/Textarea/Select components (validation states, focus, blur)
  - [ ] Card, Container, Section components
  - [ ] Navigation component (mobile menu, links, active states)
  - [ ] Footer component (links, copyright)
  - [ ] CTASection component (variants, CTAs)
  - [ ] Accordion component (expand/collapse)
  - [ ] SkipToContent component
  - [ ] InstallPrompt component (dismiss, install events)
  - [ ] Skeleton components (all variants)

- [ ] **Utility Function Tests**
  - [ ] lib/utils.ts (cn function with various inputs)
  - [ ] lib/blog.ts (getAllPosts, getPostBySlug, getFeaturedPosts)
  - [ ] lib/case-studies.ts (all export functions)

- [ ] **Server Action Tests**
  - [ ] lib/actions.ts (submitContactForm with various inputs)
  - [ ] Rate limiting behavior
  - [ ] Email sending success/failure
  - [ ] Input sanitization

#### Phase 2: Integration Tests
**Priority: High | Estimated Impact: +5 points**

- [ ] **Form Flows**
  - [ ] Contact form end-to-end (fill → validate → submit → success)
  - [ ] Contact form error handling (network errors, rate limits)

- [ ] **Navigation Flows**
  - [ ] Page navigation and routing
  - [ ] Mobile menu open/close
  - [ ] Link accessibility

- [ ] **PWA Installation Flow**
  - [ ] Install prompt appearance
  - [ ] Install prompt dismissal
  - [ ] Offline functionality after installation

#### Phase 3: E2E Tests (Optional)
**Priority: Medium | Estimated Impact: +3 points**

- [ ] Install Playwright: `npm install -D @playwright/test`
- [ ] Create E2E tests:
  - [ ] Homepage load and navigation
  - [ ] Contact form submission flow
  - [ ] Blog post reading flow
  - [ ] Service page navigation
  - [ ] Mobile responsive tests
  - [ ] Accessibility tree validation

**Tools to Install:**
```bash
npm install -D @playwright/test
npm install -D @vitest/coverage-v8  # For coverage reports
```

---

## 2. Performance: 92 → 100 (+8 points)

### Current Gaps
- Image optimization could be improved
- Bundle size not fully optimized
- No lazy loading for non-critical components
- Font loading not optimized
- No preloading of critical resources

### Action Plan

#### Phase 1: Image Optimization
**Priority: High | Estimated Impact: +3 points**

- [ ] **Optimize Images**
  - [ ] Convert all images to WebP format
  - [ ] Add appropriate image sizes with srcset
  - [ ] Implement lazy loading for below-fold images
  - [ ] Add blur placeholders for images
  - [ ] Compress images with tools like Squoosh or ImageOptim

- [ ] **Next.js Image Component**
  - [ ] Replace all `<img>` tags with `<Image>` component
  - [ ] Set proper width/height to prevent layout shift
  - [ ] Add priority to above-the-fold images

#### Phase 2: Code Splitting & Lazy Loading
**Priority: High | Estimated Impact: +2 points**

- [ ] **Dynamic Imports**
  - [ ] Lazy load InstallPrompt component
  - [ ] Lazy load ContactForm (below fold)
  - [ ] Lazy load Accordion component (interactive)
  - [ ] Code split blog MDX content

- [ ] **Bundle Analysis**
  ```bash
  npm install -D @next/bundle-analyzer
  ```
  - [ ] Analyze bundle size
  - [ ] Remove duplicate dependencies
  - [ ] Tree-shake unused code

#### Phase 3: Font & Resource Loading
**Priority: Medium | Estimated Impact: +2 points**

- [ ] **Font Optimization**
  - [ ] Use next/font for automatic font optimization
  - [ ] Implement font-display: swap
  - [ ] Subset fonts to only needed characters
  - [ ] Self-host fonts instead of Google Fonts

- [ ] **Resource Hints**
  - [ ] Add preconnect for critical domains
  - [ ] Preload critical fonts
  - [ ] Prefetch next pages on hover

#### Phase 4: Runtime Performance
**Priority: Low | Estimated Impact: +1 point**

- [ ] **React Optimizations**
  - [ ] Add React.memo to pure components
  - [ ] Implement useMemo for expensive calculations
  - [ ] Use useCallback for event handlers
  - [ ] Virtualize long lists if any

**Configuration Example:**
```typescript
// next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(pwaConfig(withMDX(nextConfig)))
```

---

## 3. Accessibility: 90 → 100 (+10 points)

### Current Gaps
- Some color contrast issues
- Missing ARIA attributes in some components
- Keyboard navigation could be improved
- No focus management for modals/overlays
- Screen reader announcements incomplete

### Action Plan

#### Phase 1: Color Contrast & Visual Accessibility
**Priority: High | Estimated Impact: +4 points**

- [ ] **Color Contrast Audit**
  - [ ] Run automated contrast checker (WebAIM, axe DevTools)
  - [ ] Ensure all text meets WCAG AAA standards (7:1 for normal, 4.5:1 for large)
  - [ ] Fix any contrast issues in:
    - [ ] Links (especially on colored backgrounds)
    - [ ] Button states (hover, focus, disabled)
    - [ ] Form field borders
    - [ ] Placeholder text
    - [ ] Footer text

- [ ] **Focus Indicators**
  - [ ] Ensure visible focus rings on all interactive elements
  - [ ] Customize focus styles to be prominent (3px solid, high contrast)
  - [ ] Test keyboard navigation through entire site

#### Phase 2: ARIA & Semantic HTML
**Priority: High | Estimated Impact: +3 points**

- [ ] **ARIA Improvements**
  - [ ] Add aria-label to icon-only buttons
  - [ ] Add aria-describedby to form fields with hints
  - [ ] Add role="navigation" to nav elements
  - [ ] Add aria-current="page" to active nav links
  - [ ] Add aria-expanded to accordion/dropdown items
  - [ ] Add landmark roles (banner, main, contentinfo, navigation)

- [ ] **Semantic HTML**
  - [ ] Use proper heading hierarchy (h1 → h2 → h3, no skipping)
  - [ ] Use <nav> for navigation
  - [ ] Use <article> for blog posts
  - [ ] Use <aside> for sidebars
  - [ ] Use <figure> and <figcaption> for images with captions

#### Phase 3: Keyboard & Screen Reader Support
**Priority: Medium | Estimated Impact: +2 points**

- [ ] **Keyboard Navigation**
  - [ ] Test all interactive elements with Tab/Shift+Tab
  - [ ] Implement keyboard shortcuts for common actions
  - [ ] Add visible skip links (already have skip-to-content)
  - [ ] Ensure modal traps focus when open
  - [ ] Implement Escape key to close modals

- [ ] **Screen Reader Testing**
  - [ ] Test with NVDA (Windows) or VoiceOver (Mac)
  - [ ] Add sr-only text for icon meanings
  - [ ] Ensure form errors are announced
  - [ ] Add live regions for dynamic content updates
  - [ ] Test reading order matches visual order

#### Phase 4: Advanced A11y Features
**Priority: Low | Estimated Impact: +1 point**

- [ ] **Motion & Animation**
  - [ ] Respect prefers-reduced-motion
  - [ ] Disable animations for users who prefer it
  - [ ] Ensure content is accessible without animations

- [ ] **Text Spacing**
  - [ ] Support text resizing up to 200%
  - [ ] No content loss at higher zoom levels
  - [ ] Ensure layout doesn't break

**Tools to Use:**
```bash
npm install -D @axe-core/react  # For runtime accessibility checks
npm install -D eslint-plugin-jsx-a11y  # Already have, ensure it's configured
```

---

## 4. SEO: 95 → 100 (+5 points)

### Current Gaps
- Missing Open Graph images
- No Twitter Card meta tags
- Robots meta tags not optimized
- Missing breadcrumb schema
- No FAQ schema on some pages

### Action Plan

#### Phase 1: Meta Tags & Social Sharing
**Priority: High | Estimated Impact: +2 points**

- [ ] **Open Graph Tags**
  - [ ] Add og:image for all pages (1200x630px images)
  - [ ] Create social share images for blog posts
  - [ ] Add og:image:width and og:image:height
  - [ ] Add og:type (website, article, etc.)
  - [ ] Add og:locale

- [ ] **Twitter Cards**
  - [ ] Add twitter:card (summary_large_image)
  - [ ] Add twitter:site and twitter:creator
  - [ ] Add twitter:image
  - [ ] Test with Twitter Card Validator

- [ ] **Generate Social Images**
  ```bash
  npm install -D @vercel/og  # For dynamic OG image generation
  ```
  - [ ] Create API route for dynamic OG images
  - [ ] Generate images for blog posts automatically
  - [ ] Add to metadata for all pages

#### Phase 2: Enhanced Structured Data
**Priority: Medium | Estimated Impact: +2 points**

- [ ] **Additional Schema Types**
  - [ ] Add BreadcrumbList schema to all pages
  - [ ] Add FAQ schema to About page
  - [ ] Add HowTo schema for blog posts (where applicable)
  - [ ] Add VideoObject schema if adding videos
  - [ ] Add LocalBusiness schema with complete address

- [ ] **Rich Results Testing**
  - [ ] Test all pages with Google Rich Results Test
  - [ ] Fix any validation errors
  - [ ] Verify preview appearance

#### Phase 3: Technical SEO
**Priority: Low | Estimated Impact: +1 point**

- [ ] **Robots & Indexing**
  - [ ] Add noindex to test/staging pages
  - [ ] Ensure canonical URLs are set correctly
  - [ ] Add hreflang if supporting multiple languages
  - [ ] Optimize robots.txt for better crawling

- [ ] **Performance SEO**
  - [ ] Ensure Core Web Vitals are green
  - [ ] Optimize Largest Contentful Paint (LCP < 2.5s)
  - [ ] Optimize First Input Delay (FID < 100ms)
  - [ ] Optimize Cumulative Layout Shift (CLS < 0.1)

**Example OG Image Generator:**
```typescript
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Your Dedicated Marketer'

  return new ImageResponse(
    (
      <div style={{ /* OG image design */ }}>
        <h1>{title}</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

---

## 5. Error Monitoring: 95 → 100 (+5 points)

### Current Gaps
- Source maps not uploaded to Sentry
- Missing user context tracking
- No performance monitoring
- Error boundaries not comprehensive
- Missing custom error pages

### Action Plan

#### Phase 1: Sentry Enhancement
**Priority: Medium | Estimated Impact: +2 points**

- [ ] **Source Maps**
  - [ ] Configure Sentry auth token
  - [ ] Enable automatic source map upload
  - [ ] Verify source maps in Sentry dashboard
  - [ ] Test error stack traces are readable

- [ ] **User Context**
  - [ ] Track user sessions (anonymous IDs)
  - [ ] Add user email if logged in
  - [ ] Add breadcrumbs for user actions
  - [ ] Track user journey before errors

#### Phase 2: Error Boundaries
**Priority: Medium | Estimated Impact: +2 points**

- [ ] **Component-Level Error Boundaries**
  - [ ] Wrap ContactForm in error boundary
  - [ ] Wrap Navigation in error boundary
  - [ ] Wrap blog content in error boundary
  - [ ] Create specific fallback UIs for each section

- [ ] **Custom Error Pages**
  - [ ] Enhance 404 page (already have basic one)
  - [ ] Create 500 error page
  - [ ] Add helpful recovery suggestions
  - [ ] Track error page views in analytics

#### Phase 3: Performance Monitoring
**Priority: Low | Estimated Impact: +1 point**

- [ ] **Enable Sentry Performance**
  - [ ] Set up performance monitoring
  - [ ] Track slow API calls
  - [ ] Monitor page load times
  - [ ] Track database query times (if applicable)

**Configuration:**
```typescript
// sentry.client.config.ts
Sentry.init({
  // ... existing config
  tracesSampleRate: 1.0,  // Increase for better performance data
  profilesSampleRate: 1.0,  // Enable profiling

  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'yourdedicatedmarketer.com'],
    }),
  ],
})
```

---

## Implementation Priority Matrix

### Phase 1: Quick Wins (1-2 days)
**Impact: +20 points | Effort: Low**

1. ✅ Color contrast fixes (Accessibility +4)
2. ✅ Meta tags & OG images (SEO +2)
3. ✅ Component unit tests (Testing +7)
4. ✅ Image optimization (Performance +3)
5. ✅ ARIA improvements (Accessibility +3)

### Phase 2: High-Impact Items (3-5 days)
**Impact: +15 points | Effort: Medium**

1. ✅ Integration tests (Testing +5)
2. ✅ Code splitting & lazy loading (Performance +2)
3. ✅ Enhanced structured data (SEO +2)
4. ✅ Error boundaries (Error Monitoring +2)
5. ✅ Font optimization (Performance +2)

### Phase 3: Polish & Perfection (2-3 days)
**Impact: +10 points | Effort: Medium-High**

1. ✅ E2E tests with Playwright (Testing +3)
2. ✅ Keyboard navigation & screen reader (Accessibility +2)
3. ✅ Source maps & user context (Error Monitoring +2)
4. ✅ Bundle analysis & optimization (Performance +1)
5. ✅ Advanced SEO (SEO +1)

---

## Tools & Dependencies to Install

```bash
# Testing
npm install -D @playwright/test
npm install -D @vitest/coverage-v8

# Performance
npm install -D @next/bundle-analyzer

# SEO
npm install -D @vercel/og

# Accessibility
npm install -D @axe-core/react

# Already installed:
# - @testing-library/react
# - @testing-library/user-event
# - vitest
# - @sentry/nextjs
# - next-pwa
```

---

## Success Metrics

### Testing (100/100)
- ✅ 80%+ code coverage
- ✅ All critical paths tested
- ✅ E2E tests for user flows
- ✅ No failing tests
- ✅ Fast test execution (<30s)

### Performance (100/100)
- ✅ Lighthouse score: 100
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ Total bundle < 200KB (gzipped)

### Accessibility (100/100)
- ✅ axe DevTools: 0 violations
- ✅ WAVE: 0 errors
- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ WCAG 2.1 AAA compliant

### SEO (100/100)
- ✅ Google Rich Results: All valid
- ✅ All pages have OG images
- ✅ Core Web Vitals: All green
- ✅ Mobile-friendly test: Pass
- ✅ Sitemap & robots.txt optimized

### Error Monitoring (100/100)
- ✅ Sentry configured with source maps
- ✅ Error boundaries on all components
- ✅ User context tracked
- ✅ Performance monitoring enabled
- ✅ Custom error pages

---

## Estimated Timeline

| Phase | Duration | Outcome |
|-------|----------|---------|
| **Phase 1: Quick Wins** | 2 days | Score: 95 → 100+ |
| **Phase 2: High-Impact** | 4 days | Score: 100+ → 100 (solidified) |
| **Phase 3: Polish** | 3 days | Score: 100 (perfect) |
| **Total** | **~9 days** | **100/100 in all categories** |

---

## Next Steps

1. **Start with Quick Wins** - Maximum impact, minimum effort
2. **Run automated audits** - Lighthouse, axe DevTools, WAVE
3. **Implement fixes incrementally** - Test after each change
4. **Monitor metrics** - Track improvements in real-time
5. **Document changes** - Keep IMPROVEMENTS-SUMMARY.md updated

---

**Let's achieve perfection! 🎯**
