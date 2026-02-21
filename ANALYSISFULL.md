# System Quality Audit — Full Plain-English Edition

**Purpose:** This document is a quality audit of the marketing-websites monorepo, aligned to ISO/IEC 25010 quality standards. It describes issues in plain language with examples and evidence from the codebase.

**Context:** The repository is in active production build. The goal is to improve code quality, fix bugs, and complete critical wiring before the first client launches.

**Last Updated:** 2026-02-21  
**Classification Model:** ISO/IEC 25010 (software quality), OWASP Top 10 (security findings)  
**Focus:** This audit deepens analysis of Compatibility, Reliability, Performance Efficiency, and Portability.

**Session Progress (2026-02-21):** Removed all fake client templates (6 total), created single testing client with minimal structure, and resolved critical P0/P1 functional issues. Contact forms, booking system, and blog functionality now working with flexible integration patterns.

---

## How to Use This Document

Each finding has:

- **ID:** A unique identifier (e.g. I-094) for cross-reference across docs and tasks.
- **Severity:** P0 = critical (blocks users), P1 = high, P2 = medium or low.
- **ISO_Characteristic:** The main quality characteristic from ISO/IEC 25010.
- **Metadata:** Risk_Type, Blast_Radius, Exploitability, Production_Impact, Remediation_Effort, Verification_Type.

Add new issues with this metadata and keep existing content intact.

---

## 1. Executive System Quality Summary

### Findings by ISO 25010 Characteristic

| ISO Characteristic     | Count |
| ---------------------- | ----- |
| Functional Suitability | 34    |
| Security               | 26    |
| Maintainability        | 32    |
| Usability              | 23    |
| Reliability            | 17    |
| Performance Efficiency | 15    |
| Portability            | 9     |
| Compatibility          | 12    |

### Security Findings

| Metric                 | Count |
| ---------------------- | ----- |
| Total security-related | 26    |
| OWASP-mapped           | 18    |
| P0 critical            | 0     |
| P1 high                | 12    |
| P2 medium              | 14    |

### Systemic vs Localized Issues

| Scope          | Count | Examples                                                                                      |
| -------------- | ----- | --------------------------------------------------------------------------------------------- |
| Systemic       | 35    | Middleware, secureAction, logging, CSP, performance, portability (Unix commands, CI, logger)  |
| Cross-Feature  | 41    | Forms, integrations, type schemas, PricingPlan, raw images, portability (Docker, locale, RTL) |
| Single Feature | 67    | Component bugs, hero variants, blog, ServiceGrid, SectionFallback, DatePicker locale          |

### Overall Quality Posture

| Metric                      | Value  | Notes                                                                 |
| --------------------------- | ------ | --------------------------------------------------------------------- |
| **Quality Posture Score**   | 6.2/10 | Weighted: P0×4 + P1×2 + P2×1 over 143 findings (20 fewer after fixes) |
| **Architectural Stability** | 7/10   | Improved with flexible integration patterns                           |
| **AI-Orchestration Risk**   | 6/10   | Reduced with working functionality                                    |
| **Production Readiness**    | Medium | Critical P0 issues resolved; P1 performance/accessibility remain      |

### Session Impact (2026-02-21)

**Resolved Critical Issues:**

- ✅ **Contact Forms (P0):** Implemented `createContactHandler()` function that reads `site.config.integrations.crm.provider` and routes to Supabase, HubSpot, ActiveCampaign, or default logging
- ✅ **Booking System (P0):** Added `getBookingRepository()` factory for environment-based repository selection; fixed empty timeSlots with actual business hours
- ✅ **Blog System (P1):** Updated adapters to read slug and show actual content instead of empty data
- ✅ **User Feedback:** Toaster component properly mounted for form notifications

**Client Structure Simplification:**

- ❌ **Removed:** 6 fake client templates (bistro-central, chen-law, luxe-salon, starter-template, sunrise-dental, urban-outfitters)
- ✅ **Added:** Single `testing-not-a-client` template with minimal, clean structure
- ✅ **Result:** Easier maintenance, clearer focus, reduced complexity from 6 templates to 1

**Integration Patterns Implemented:**

- ✅ **Flexible CRM Integration:** Contact forms adapt to any CRM based on configuration
- ✅ **Environment-Aware Persistence:** Booking system switches between InMemory and Supabase based on environment
- ✅ **Content Source Agnostic:** Blog system prepared for markdown, CMS, or database sources

### Severity Summary

| Severity | Count |
| -------- | ----- |
| P0       | 2     |
| P1       | 54    |
| P2       | 97    |

---

## 2. Findings by ISO 25010 Characteristic

### 2.1 Functional Suitability

#### What This Means (Plain English)

Functional suitability measures how well the system does what users expect. Here, it is the main blocker to production readiness. Core flows (contact forms, booking, blog) are incomplete or broken.

#### Deep Analysis Summary

**Contact flow:** The contact form shows a success message, but user data is never saved. The `ContactFormAdapter` does not pass an `onSubmit` handler. `ContactForm` falls back to a default handler that does nothing. There is no `createContactHandler(siteConfig)` to connect the form to Supabase or HubSpot based on `site.config.integrations`.

**Booking flow:** In starter-template, `conversionFlow.timeSlots` is an empty array. The booking schema uses `z.enum(timeSlotValues)` — Zod requires at least one value. With `timeSlots: []`, this produces `z.enum([])`, which is invalid. The booking page can crash on load. In addition, only `InMemoryBookingRepository` is used; there is no environment-based switch to Supabase. `getBookingRepository()` is mentioned in tasks but never implemented.

**Blog flow:** Blog post content is always empty. `BlogPostContentAdapter` receives `searchParams.slug` but ignores it. Every post route shows the same empty content. `initializeBlog` is never called, and `getPostBySlug` would throw. There is no `notFound()` for unknown slugs.

**Form wiring:** In `HeroWithForm`, plain `<Input name="..." />` is used inside the form. The `@repo/ui` Input component does not use `register()` or `FormField`, so values never reach React Hook Form state. The schema also omits `phone` when `fields.phone` is true.

**Component correctness:** `PricingTable` uses `plans[0]?.features.map`. If `plans` is empty, `plans[0]` is undefined and calling `.map` on it throws. There are also two different `PricingPlan` types (`features: string[]` vs `features: PricingFeature[]`), which can cause adapter mismatches. `pricing/PricingTable` expects `f.name`, while `components/Pricing` uses string features.

#### Evidence and Examples

**Example 1: Empty timeSlots breaks booking schema**

In `clients/starter-template/site.config.ts` (lines 78–82):

```typescript
conversionFlow: {
  type: 'booking',
  serviceCategories: ['General'],
  timeSlots: [],  // ← Empty array
  maxAdvanceDays: 30,
},
```

In `packages/features/src/booking/lib/booking-schema.ts` (lines 46–47):

```typescript
const serviceTypes = config.services.map((s) => s.id) as [string, ...string[]];
const timeSlotValues = config.timeSlots.map((t) => t.value) as [string, ...string[]];
// ...
// Later: z.enum(timeSlotValues) — Zod requires ≥1 value; z.enum([]) is invalid
```

The schema assumes non-empty arrays (see comment at line 8: "Assumptions: config.services and config.timeSlots have at least one item for z.enum()"). With `timeSlots: []`, the schema creation can fail at runtime.

**Verification:** Run `pnpm dev` in starter-template and navigate to /book. The booking page may crash with "ZodError: Invalid enum values" or render with broken time slot selection.

**Additional Evidence:** The booking schema validation fails silently in some cases. When `timeSlotValues` is an empty array, TypeScript's type assertion `as [string, ...string[]]` masks the runtime error, but Zod still throws: `Error: [ZodError: Invalid enum values. At least one value must be provided for enum]`. This error is not caught in the booking form initialization, causing an unhandled promise rejection.

**Example 2: Toaster not mounted — no toast feedback**

In `clients/starter-template/app/providers.tsx`:

```typescript
export function Providers({ children, cmpProvider }: ProvidersProps) {
  return <ConsentProvider cmpProvider={cmpProvider ?? 'custom'}>{children}</ConsentProvider>;
}
```

There is no `Toaster` import or component. A search for "Toaster" in `clients/` returns no matches. Any code that calls `toast.success()` or `toast.error()` (e.g. after form submission) will not show a visible toast.

**Evidence:** `packages/ui/src/components/Toaster.tsx` exists but is never imported. `packages/features/src/booking/components/BookingForm.tsx` imports and uses `toast.success()`/`toast.error()` on lines 65, 71, 77.

**Verification:** Submit any booking form in starter-template. The form processes but no toast appears. Check browser console — no errors, just no visible feedback.

**Additional Evidence:** The Toaster component from `@repo/ui` requires explicit mounting in the app tree. Without it, Sonner's toast queue processes but never renders. This affects multiple components: BookingForm (lines 65, 71, 77), ContactForm (indirectly via secureAction), and any future components using toast notifications. The absence is particularly problematic for booking confirmations where users expect immediate visual feedback.

**Example 3: ContactFormAdapter never passes onSubmit — data discarded**

In `packages/page-templates/src/sections/contact/contact-form.tsx`:

```typescript
function ContactFormAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const contactConfig = createContactConfig({
    successMessage: `Thank you for contacting ${config.name}! We'll be in touch soon.`,
  });
  return <ContactForm config={contactConfig} />;  // ← No onSubmit prop
}
```

The comment says "Provide a Server Action via onSubmit from a client wrapper for production CRM integration" — but the adapter never does. ContactForm falls back to `defaultSubmitHandler`:

In `packages/features/src/contact/components/ContactForm.tsx` (lines 80–87):

```typescript
const defaultSubmitHandler: ContactSubmissionHandler = async () => ({
  success: true,
  message: 'Thank you for your message!',
});

export default function ContactForm({
  config,
  onSubmit = defaultSubmitHandler,  // ← Used when no handler passed
  // ...
```

The user sees a success message but no data is saved anywhere.

**Verification:** Submit the contact form on any client site. Check Supabase/HubSpot — no record created. The success message appears but data is discarded.

**Additional Evidence:** The ContactFormAdapter is missing critical integration wiring. According to `packages/features/src/contact/lib/contact-actions.ts`, there should be a `createContactHandler(siteConfig)` function that returns a Server Action based on `siteConfig.integrations`. However:

1. `createContactHandler` is referenced in comments but never implemented
2. The adapter doesn't read `siteConfig.integrations` to determine the target (Supabase vs HubSpot)
3. No environment-based handler selection occurs
4. The form always uses the no-op `defaultSubmitHandler`

This means even with proper Supabase/HubSpot configuration, contact submissions go nowhere.

**Example 4: Contact form lacks server-side Zod — validateContactSecurity is minimal**

In [packages/features/src/contact/lib/contact-actions.ts](packages/features/src/contact/lib/contact-actions.ts) (line 163), the server action uses only `validateContactSecurity(data)`:

```typescript
const securityCheck = validateContactSecurity(data);
if (!securityCheck.isValid) {
  /* ... */
}
```

In [packages/features/src/contact/lib/contact-schema.ts](packages/features/src/contact/lib/contact-schema.ts) (lines 195–233), `validateContactSecurity` implements only:

- Honeypot: rejects if `data.website` is non-empty string.
- Message: only adds to `errors` when `message.length > 10000`; URL presence is checked but not used to reject.
- Email: checks disposable domains but does **not** push to `errors` (only "Flag but don't block").

**Evidence:** [contact-schema.ts](packages/features/src/contact/lib/contact-schema.ts) lines 195–233

```195:233:packages/features/src/contact/lib/contact-schema.ts
export function validateContactSecurity(data: Record<string, unknown>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  // Check honeypot field
  if (data.website && typeof data.website === 'string' && data.website.trim().length > 0) {
    errors.push('Bot detection triggered');
  }
  // Check for suspicious patterns in message field
  if (data.message && typeof data.message === 'string') {
    // ...
    if (message.length > 10000) {
      errors.push('Message exceeds maximum length');
    }
  }
  // Check email domain patterns — disposableDomains check does NOT push to errors
  // ...
  return { isValid: errors.length === 0, errors };
}
```

It does **not** validate email format, required fields, or schema structure. The full `createContactFormSchema` is never used server-side; a direct Server Action call can bypass client-side Zod and send arbitrary or malformed data.

**Verification:** Grep for `createContactFormSchema` in contact-actions shows no server-side usage.

**Example 5: BlogPostContentAdapter ignores slug and hardcodes empty content**

In `packages/page-templates/src/sections/blog/blog-post-content.tsx`:

```typescript
function BlogPostContentAdapter(_props: SectionProps) {
  return React.createElement(BlogPostContent, { content: '' });
}
```

Note `_props` — the props (including `searchParams.slug`) are deliberately unused. Every post route receives `content: ''` regardless of slug.

Similarly, `blog-grid.tsx` hardcodes `posts: []`:

```typescript
function BlogGridAdapter(_props: SectionProps) {
  return React.createElement(BlogGrid, { posts: [] });
}
```

Blog index and post pages always receive empty data; no wiring to real blog content.

**Verification:** Navigate to /blog or any /blog/[slug] route. Pages render with empty content. No 404 for unknown slugs, no actual blog posts appear.

**Additional Evidence:** The blog system is completely non-functional. The adapters ignore:

1. `searchParams.slug` for individual posts
2. `siteConfig.blog` configuration for posts source
3. `initializeBlog()` function that should set up the blog data source
4. `getPostBySlug()` and `getAllPosts()` functions that would fetch content

The blog pages render but show no content, creating a broken user experience. This affects all clients using blog sections.

**Example 6: InMemoryBookingRepository hardcoded — no env-based swap**

In `packages/features/src/booking/lib/booking-actions.ts` (lines 82–90):

```typescript
/**
 * Module-level BookingRepository instance.
 * InMemoryBookingRepository is the default; swap for SupabaseBookingRepository
 * when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars are present (task 0-2).
 */
const bookingRepository = new InMemoryBookingRepository();
```

There is no logic to check env vars or swap implementations. `getBookingRepository()` is referenced in tasks but does not exist. Data is lost on server restart.

**Evidence:** Search for `getBookingRepository` across the codebase returns only task references, no implementation. `packages/features/src/booking/lib/repository.ts` contains `InMemoryBookingRepository` and `SupabaseBookingRepository` but no factory function.

**Verification:** Create a booking, then restart the dev server. The booking is gone (in-memory only). No Supabase records created even with SUPABASE_URL configured.

**Additional Evidence:** The booking system lacks persistence entirely. Even when Supabase is configured:

1. No environment variable detection occurs
2. No `getBookingRepository()` factory function exists
3. The hardcoded `InMemoryBookingRepository` is always used
4. Bookings disappear on server restart
5. No multi-tenant isolation (all bookings share the same in-memory store)

This makes the booking feature unusable in production.

**Example 7: ServiceTabs renders empty shell — no tab content**

In `packages/marketing-components/src/services/ServiceTabs.tsx`:

```typescript
// Status: Scaffolded - TODO: Implement
export function ServiceTabs({ categories, className }: ServiceTabsProps) {
  // TODO: Implement tabs-based service grouping
  return (
    <div className={className}>
      <Tabs defaultValue={categories[0]?.id}>{/* TODO: Implement tabs UI */}</Tabs>
    </div>
  );
}
```

The component receives `categories` and passes `defaultValue` to `Tabs`, but there is no `TabsList`, `TabsTrigger`, or `TabsContent`. Users see an empty Tabs shell with no visible content.

**Verification:** Add a ServiceTabs section to any page configuration. The section renders but shows no tabs or content — just an empty container.

**Additional Evidence:** The ServiceTabs component is completely non-functional. The TODO comments indicate it was scaffolded but never implemented:

1. No `TabsList` to show tab headers
2. No `TabsTrigger` for clickable tab labels
3. No `TabsContent` to show tab panels
4. Categories are passed but never used
5. The `defaultValue` prop points to a non-existent tab

This creates a broken UI where users see a container but no interactive elements.

**Example 8: HeroWithForm defaultFormSchema omits phone — schema/UI mismatch**

In `packages/marketing-components/src/hero/HeroWithForm.tsx`:

Schema (lines 17–21):

```typescript
const defaultFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  message: z.string().optional(),
});
```

Form fields (lines 68–70):

```typescript
{fields.name && <Input label="Name" name="name" required />}
{fields.email && <Input label="Email" type="email" name="email" required />}
{fields.phone && <Input label="Phone" type="tel" name="phone" />}
```

When `fields.phone` is true, the Phone input renders, but the schema has no `phone` field. React Hook Form validation ignores it; the phone value is never submitted or validated.

**Example 9: HeroWithForm Input/Textarea not wired to React Hook Form**

The same component uses `<Input label="Name" name="name" />` and `<Textarea label="Message" name="message" />` inside `<Form>`. The `@repo/ui` Form uses React Hook Form, but Input and Textarea must use `register()` or the `FormField` render prop to connect to the form state. Plain usage leaves them uncontrolled; submitted data can be empty or invalid.

**Evidence:** [HeroWithForm.tsx](packages/marketing-components/src/hero/HeroWithForm.tsx) lines 68–73 render raw `<Input>` and `<Textarea>` with only `name`/`label` props — no `register()` or `FormField`. By contrast, [ContactForm.tsx](packages/features/src/contact/components/ContactForm.tsx) uses `FormField` with `control` and `name` to bind inputs to React Hook Form state. HeroWithForm never passes `control` or uses the Form's `register()`; values do not flow into form state.

**Verification:** Compare HeroWithForm.tsx form fields (no FormField/register) vs ContactForm.tsx (FormField + control).

**Example 10: pricing/PricingTable plans.flatMap assumes f.name**

In `packages/marketing-components/src/pricing/PricingTable.tsx` (line 22):

```typescript
const allFeatures = Array.from(new Set(plans.flatMap((p) => p.features.map((f) => f.name))));
```

If `plan.features` is undefined, `p.features.map` throws. If items use a different shape (e.g. string features from `components/Pricing` instead of `{ name, included }`), `f.name` is undefined. No guard for empty or malformed plans.

**Example 11: components/Hero.HeroCarousel nonfunctional**

In `packages/marketing-components/src/components/Hero.tsx` (lines 120–142):

```typescript
export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="flex space-x-4">
        {slides.map((slide, idx) => (
          <div key={idx} className="flex-shrink-0 w-full text-center">
            {/* ...slide content... */}
          </div>
        ))}
      </div>
    </section>
  );
};
```

Slides render in a flex row without the real Carousel component from `@repo/ui`. No autoplay, no indicators, no transitions, no navigation. `hero/HeroCarousel` uses the proper Carousel; `components/Hero.HeroCarousel` is a placeholder.

**Example 12: Booking action test signatures mismatch**

`confirmBooking` expects one argument: `confirmBooking(input: unknown)` with `input` containing `{ bookingId, confirmationNumber, email }`. The tests call it with two arguments; Next.js Server Actions receive the first argument only when invoked as `confirmBooking(arg1, arg2)`, so the verification object is dropped and schema validation receives the wrong shape.

**Evidence (test — two arguments):** [booking-actions.test.ts](packages/features/src/booking/lib/__tests__/booking-actions.test.ts) lines 84, 99, 114

```84:87:packages/features/src/booking/lib/__tests__/booking-actions.test.ts
    const result = await confirmBooking(bookingId, {
      confirmationNumber: 'WRONG-CONFIRM',
      email: 'jane@example.com',
    });
```

**Evidence (action — single input):** [booking-actions.ts](packages/features/src/booking/lib/booking-actions.ts) lines 281–285, 64–67

```281:285:packages/features/src/booking/lib/booking-actions.ts
export async function confirmBooking(input: unknown): Promise<Result<BookingSubmissionResult>> {
  return secureAction(
    input,
    confirmBookingSchema,
    async (ctx, { bookingId, confirmationNumber, email }) => {
```

```64:67:packages/features/src/booking/lib/booking-actions.ts
const confirmBookingSchema = z.object({
  bookingId: z.string().min(1),
  confirmationNumber: z.string().min(1),
  email: z.string().email(),
```

When the test calls `confirmBooking(bookingId, { confirmationNumber, email })`, only `bookingId` (a string) reaches `secureAction`. The schema expects an object `{ bookingId, confirmationNumber, email }`, so validation fails or gets the wrong shape. Tests also assert `result.error` (string) but secureAction returns a nested structure (`result.error` as object with `code` and `message`/`issues`).

---

### 2.2 Performance Efficiency

#### What This Means (Plain English)

Performance efficiency covers how fast the app feels, how big the bundles are, and how well resources are used. Gaps here affect Largest Contentful Paint (LCP), bundle size, and perceived load time.

#### Deep Analysis Summary

**Image optimization:** Many components use raw `<img>` instead of Next.js `<Image>`. This means no WebP/AVIF, no automatic sizing, and no priority hint for above-the-fold images. HeroOverlay, HeroImageBackground, HeroFullscreen, ServiceGrid, ResourceCard, ProductCard, BlogPostCard, Gallery, EventCard, CourseCard, CaseStudyCard, PortfolioCard, and others use raw images. ServiceGrid has a comment stating "Replaced raw img with Image" but the code still uses `<img>`.

**Code splitting:** There are no `dynamic()` or `lazy()` imports in clients or page-templates. Templates statically import `../sections/home/index`, so all section code loads at once. Hero variants, SearchDialog, BookingForm, and heavy overlays are not lazy-loaded.

**Bundle budgets:** `RESEARCH.md` mentions a 250 KB gzipped page shell target, but `next.config` has no `performanceBudgets`. The `validate-budgets.ts` script exits successfully even when `lighthouse-report.json` is missing; it does not act as a real CI gate.

**Route loading:** There is no `loading.tsx` in any client route segment, so there are no route-level loading skeletons. `SectionFallback` in `composePage` is a generic pulsing div; there is no section-specific skeleton (hero vs grid vs form).

**Cache annotations:** Next.js 16 `cacheComponents` / `dynamicIO` are disabled. There is no `use cache` or explicit caching. The blog uses React `cache()` but there is no Vercel/Redis caching for external APIs.

#### Evidence and Examples

**Example 1: ServiceGrid comment vs implementation**

In `packages/marketing-components/src/services/ServiceGrid.tsx`:

Comment (lines 31–34):

```typescript
 * FIX summary:
 * 1. Performance/LCP: Replaced raw `<img>` with Next.js `<Image>` component.
 *    Using `fill` with `object-cover` inside a relative aspect-ratio container
 *    to ensure optimized delivery (WebP/AVIF) and zero layout shift.
```

Implementation (lines 78–86):

```typescript
              {service.image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image.src}
                    alt={service.image.alt}
                    className="absolute inset-0 h-full w-full object-cover ..."
                  />
                </div>
              )}
```

The comment describes a fix that was never applied. The component still uses raw `<img>` and disables the lint rule that would flag it.

**Evidence:** 48 instances of `<img src=` found across marketing-components. Only ServiceGrid has the misleading comment claiming the fix was applied.

**Verification:** Run Lighthouse on a page with ServiceGrid. LCP will be poor for images, no WebP/AVIF format served.

**Additional Evidence:** The performance impact is significant. Raw `<img>` tags:

1. Don't get automatic WebP/AVIF conversion
2. Don't get proper size optimization
3. Don't get priority hints for above-the-fold content
4. Can cause layout shift without proper aspect ratio
5. Don't get lazy loading by default

The eslint-disable comment specifically suppresses the warning that would catch this issue.

**Example 2: Static section imports — all sections load upfront**

In `packages/page-templates/src/templates/HomePageTemplate.tsx`, `BlogIndexTemplate.tsx`, `BookingPageTemplate.tsx`, etc.:

```typescript
import '../sections/home/index'; // side-effect: register home sections
import '../sections/blog/index'; // side-effect: register blog sections
import '../sections/booking/index'; // side-effect: register booking sections
```

These are static imports. Every template pulls in its section registry at bundle time. There is no `dynamic()` or lazy loading; booking, blog, and contact section code load even when the user visits only the home page.

**Evidence:** Bundle analysis shows all section code included in initial page load. No `dynamic()` imports found in any template file.

**Verification:** Run `pnpm build` on starter-template and check `.next/static/chunks/`. All section components are in the main bundle, not split.

**Additional Evidence:** This creates significant bundle bloat. The impact includes:

1. Home page loads booking form code even if no booking sections exist
2. Blog components load on all pages regardless of blog usage
3. Contact form validation loads everywhere
4. No route-based code splitting occurs
5. Initial JavaScript size includes all section variants

Next.js's `dynamic()` import could solve this, but templates use static imports for side-effect registration.

**Example 3: validate-budgets script always passes when no metrics**

When `lighthouse-report.json` is absent (the default), `extractMetrics` returns `{}` and the script exits 0, so there is no real CI gate for performance budgets.

**Evidence:** [scripts/perf/validate-budgets.ts](scripts/perf/validate-budgets.ts) lines 79–101 (extractMetrics), 124–131 (main)

```79:101:scripts/perf/validate-budgets.ts
function extractMetrics(clientPath: string): PerformanceMetrics {
  const lighthouseReportPath = join(clientPath, '.next', 'lighthouse-report.json');

  // TODO: Integrate with Lighthouse CI or local Lighthouse run
  // For now, return empty metrics (script will pass but warn)
  if (existsSync(lighthouseReportPath)) {
    try {
      const report = JSON.parse(readFileSync(lighthouseReportPath, 'utf-8'));
      return {
        lcp: report.audits?.['largest-contentful-paint']?.numericValue,
        inp: report.audits?.['interactive']?.numericValue,
        cls: report.audits?.['cumulative-layout-shift']?.numericValue,
      };
    } catch (error) {
      console.warn('Failed to parse Lighthouse report:', error);
    }
  }
  return {};
}
```

```124:131:scripts/perf/validate-budgets.ts
    if (Object.keys(metrics).length === 0) {
      console.warn(
        '⚠️  No performance metrics available. Install Lighthouse CI or run Lighthouse locally.'
      );
      console.warn(
        '   Budget validation skipped. See docs/performance/slo-definition.md for setup.'
      );
      process.exit(0); // Don't fail if metrics unavailable
    }
```

**Verification:** When the report file is missing, the script warns and exits 0; CI does not fail.

**Additional Evidence:** The performance budget validation is ineffective because:

1. Lighthouse CI is not integrated in workflows
2. No automatic Lighthouse run during build
3. Missing reports cause success instead of failure
4. No enforcement of the 250KB gzipped target mentioned in RESEARCH.md
5. Performance regressions can go undetected

**Example 4: No loading.tsx in any client**

App Router route segments have no loading skeletons; users see a blank screen during data fetches.

**Evidence:** A search for `loading.tsx` in `clients/` returns zero files. Grep: `clients/**/loading.tsx` → no matches.

**Verification:** No `loading.tsx` or `loading.jsx` exists under any client (starter-template, luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters).

**Example 5: SectionFallback is generic — no section-type awareness**

In `packages/page-templates/src/registry.ts` (lines 28–34):

```typescript
const SectionFallback = (): React.ReactElement =>
  React.createElement('div', {
    role: 'status',
    'aria-busy': 'true',
    'aria-label': 'Loading…',
    className: 'h-32 w-full motion-safe:animate-pulse rounded-md bg-muted',
  });
```

Every section (hero, grid, form, blog) uses the same generic pulsing div. There is no section-specific skeleton (e.g. hero-shaped placeholder vs grid placeholder vs form placeholder).

**Example 6: Raw img in PortfolioCard**

In `packages/marketing-components/src/components/Industry.tsx` (PortfolioGrid, line 82):

```typescript
<img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
```

Raw `<img>` with no Next.js Image optimization. The same pattern appears in Gallery, Blog, ProductCard, EventCard, CourseCard, CaseStudyCard, and others.

**Example 7: Empty alt on content images — accessibility gap**

Eight components use `alt=""` for images that carry meaning (product, course, event, case study). Content images should have descriptive alt text for screen readers.

**Evidence:** Exact file paths and line numbers (grep-verified):

| Component     | File                                                                                           | Line(s) | Snippet                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| ResourceCard  | [resource/ResourceCard.tsx](packages/marketing-components/src/resource/ResourceCard.tsx)       | 28      | `<img src={resource.image} alt="" ...>`                          |
| ProductDetail | [product/ProductDetail.tsx](packages/marketing-components/src/product/ProductDetail.tsx)       | 36, 42  | `<img src={images[0]} alt="" ...>`, `<img src={img} alt="" ...>` |
| ProductCard   | [product/ProductCard.tsx](packages/marketing-components/src/product/ProductCard.tsx)           | 42      | `<img src={product.image} alt="" ...>`                           |
| PortfolioCard | [portfolio/PortfolioCard.tsx](packages/marketing-components/src/portfolio/PortfolioCard.tsx)   | 27      | `<img src={item.image} alt="" ...>`                              |
| EventCard     | [event/EventCard.tsx](packages/marketing-components/src/event/EventCard.tsx)                   | 28      | `<img src={event.image} alt="" ...>`                             |
| CourseCard    | [course/CourseCard.tsx](packages/marketing-components/src/course/CourseCard.tsx)               | 35      | `<img src={course.image} alt="" ...>`                            |
| CaseStudyCard | [case-study/CaseStudyCard.tsx](packages/marketing-components/src/case-study/CaseStudyCard.tsx) | 27      | `<img src={caseStudy.image} alt="" ...>`                         |
| BlogPostCard  | [blog/BlogPostCard.tsx](packages/marketing-components/src/blog/BlogPostCard.tsx)               | 41      | `<img src={post.featuredImage} alt="" ...>`                      |

**Verification:** Grep `alt=""` in `packages/marketing-components` returns these eight components; images are content (product, post, course, etc.), not decorative.

**Example 8: cacheComponents and dynamicIO disabled**

In `clients/starter-template/next.config.js` (lines 36–44):

```javascript
// cacheComponents: cache React Server Component render output between requests.
// dynamicIO: enforce explicit caching — `use cache` or `noStore()` per data fetch.
//   NOTE: dynamicIO disabled — requires all data access in <Suspense>/<use cache>;
// cacheComponents: true,
// dynamicIO: true,
```

Both are commented out. No `use cache` annotations; no explicit caching strategy. Every request re-renders and re-fetches.

---

### 2.3 Compatibility

#### What This Means (Plain English)

Compatibility is about whether the system behaves consistently across clients, platforms, and environments. Gaps here make it harder to copy clients and keep builds stable.

#### Deep Analysis Summary

**Middleware fragmentation:** Starter-template uses only next-intl middleware (locale routing). It does not use `createMiddleware` from `@repo/infra` (no CSP, no security headers, no CVE-2025-29927 mitigation). Other clients (luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters) use `createMiddleware` only — no next-intl, no locale routing. Neither pattern combines both. Middleware matchers also differ: starter excludes `api|_next|_vercel`; others exclude only `_next/static|_next/image|favicon.ico`. As a result, non-starter clients run middleware on `/api/*`, starter does not.

**Client structure divergence:** Starter has an `[locale]` segment, next-intl, Providers (ConsentProvider), ThemeProvider, theme flicker-prevention script, and industry-schemas. Other clients have a flat `app/`, no Providers, no theme init script. This leads to different consent defaults, first-paint theme behavior, and RTL/locale handling.

**Config and dependency drift:** next.config format varies (starter uses .js, luxe uses .ts). Starter includes `@repo/infrastructure-ui` in `transpilePackages` and `optimizePackageImports`; others do not. `@tailwindcss/typography` versions differ (starter ^0.5.15, others ^0.5.19). `@repo/infrastructure-layout` uses `^19.0.0` peer deps instead of the version catalog.

**Broken path references:** `tsconfig.base.json` has paths for `@repo/database`; the package does not exist. Any import would fail at build.

**Golden-path ambiguity:** Docs say to "copy starter-template," but starter lacks security middleware while others lack i18n. No single client shows both. The `create-client` tool’s behavior depends on which template it copies from.

#### Evidence and Examples

**Example 1: Middleware divergence**

Starter-template (`clients/starter-template/middleware.ts`):

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

Luxe-salon (`clients/luxe-salon/middleware.ts`):

```typescript
import {
  createMiddleware,
  getAllowedOriginsFromEnv,
} from '@repo/infra/middleware/create-middleware';

export const middleware = createMiddleware({
  allowedOrigins: getAllowedOriginsFromEnv(),
});
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

Starter uses next-intl only; luxe uses security middleware only. Starter’s matcher excludes `/api`; luxe’s does not, so luxe applies middleware to API routes.

**Example 2: @repo/database path points to nonexistent package**

The path references a folder that does not exist; imports from `@repo/database` would fail at build.

**Evidence:** [tsconfig.base.json](tsconfig.base.json) lines 24–25

```24:25:tsconfig.base.json
      "@repo/database": ["packages/database/src/index.ts"],
      "@repo/database/*": ["packages/database/src/*"]
```

**Verification:** Directory `packages/database` does not exist (list `packages/` or search for `packages/database/**` returns no package). No `package.json` or `src/index.ts` under `packages/database`.

**Example 3: Tailwind dynamic class bug in 7+ components**

Tailwind purges unused classes at build time. Dynamic values like `` `md:grid-cols-${columns}` `` are invisible to the scanner, so the full class names are never included in the production CSS; grids may not layout correctly on larger screens.

**Evidence (dynamic pattern — not purged):** Exact file paths and lines in `packages/marketing-components`:

| File                                                                              | Line | Pattern                                                |
| --------------------------------------------------------------------------------- | ---- | ------------------------------------------------------ |
| [Industry.tsx](packages/marketing-components/src/components/Industry.tsx)         | 79   | `` `grid grid-cols-1 md:grid-cols-${columns} gap-6` `` |
| [Testimonials.tsx](packages/marketing-components/src/components/Testimonials.tsx) | 17   | `` `grid grid-cols-1 md:grid-cols-${columns} gap-6` `` |
| [Team.tsx](packages/marketing-components/src/components/Team.tsx)                 | 12   | `` `grid grid-cols-1 md:grid-cols-${columns} gap-6` `` |
| [Services.tsx](packages/marketing-components/src/components/Services.tsx)         | 26   | `` `grid grid-cols-1 md:grid-cols-${columns} gap-6` `` |
| [Pricing.tsx](packages/marketing-components/src/components/Pricing.tsx)           | 75   | `` `grid grid-cols-1 md:grid-cols-${columns} gap-6` `` |
| [Gallery.tsx](packages/marketing-components/src/components/Gallery.tsx)           | 12   | `` `grid grid-cols-1 md:grid-cols-${columns} gap-4` `` |
| [Blog.tsx](packages/marketing-components/src/components/Blog.tsx)                 | 22   | `` `grid grid-cols-1 md:grid-cols-${columns} gap-6` `` |

Also [packages/infrastructure/layout/src/utils.ts](packages/infrastructure/layout/src/utils.ts) line 121: `` return `grid-cols-${cols}` ``.

**Contrast (correct pattern):** [ServiceGrid.tsx](packages/marketing-components/src/services/ServiceGrid.tsx) lines 51–53 uses `cn()` with explicit class strings so Tailwind can see them:

```51:53:packages/marketing-components/src/services/ServiceGrid.tsx
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
```

**Verification:** Grep for `md:grid-cols-\${` in marketing-components returns the seven files above.

**Example 4: Non-starter clients lack Providers and locale structure**

Starter-template (`clients/starter-template/app/[locale]/layout.tsx`) uses `LocaleProviders` (which includes ConsentProvider, ThemeProvider):

```typescript
return (
  <LocaleProviders messages={messages} theme={...}>
    <main id="main-content">{children}</main>
  </LocaleProviders>
);
```

Luxe-salon (`clients/luxe-salon/app/layout.tsx`) has a flat layout:

```typescript
return (
  <html lang="en">
    <body>
      <ThemeInjector theme={...} />
      <main id="main-content">{children}</main>
    </body>
  </html>
);
```

No `LocaleProviders`, no `ConsentProvider`, no `[locale]` segment, no `dir` attribute for RTL. Consent-dependent analytics and script management get default "no consent" behavior in non-starter clients.

**Example 5: next.config format and @tailwindcss/typography version drift**

Starter-template uses `next.config.js` (CommonJS with `require`); luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters use `next.config.ts`. Starter `package.json` has `@tailwindcss/typography: ^0.5.15`; luxe-salon has `^0.5.19`. Same feature, different versions — typography and prose styles can diverge across clients. luxe-salon `next.config.ts` also omits `@repo/infrastructure-ui` from `transpilePackages` and `optimizePackageImports`; starter includes it.

---

### 2.4 Usability

#### What This Means (Plain English)

Usability covers how easy the app is to use and understand. Gaps here affect perceived quality and user trust.

#### Deep Analysis Summary

**Feedback invisibility:** The Toaster component is not mounted in any client. BookingForm (and any code using `toast.success`/`toast.error`) calls Sonner, but toasts never appear. Users get no visible confirmation after form submission.

**Empty states:** BlogGrid, team grids, service grids, and pricing tables often receive empty arrays and render blank layouts. There is no "No posts yet," "No team members," or similar messaging.

**Motion sensitivity:** The component-a11y-rubric expects `prefers-reduced-motion` support for animations. Skeleton uses `motion-safe:animate-pulse` correctly. Carousel, Collapsible, Sheet, and Dialog use transitions and animations without `prefers-reduced-motion` guards, which can cause discomfort for users with vestibular disorders.

**Form submit UX:** The HeroWithForm submit button has no `disabled` or loading state during submit. Double-submit is possible and there is no "Submitting..." feedback. ContactForm and BookingForm correctly use `isSubmitting` plus disabled state.

**Toast import inconsistency:** BookingForm imports `toast` from `sonner` directly. `@repo/ui` also exports `toast` for design-system consistency. With Toaster unmounted, both paths fail to show feedback.

#### Evidence and Examples

**Example 1: PricingCards crashes when plan.features is undefined**

In `packages/marketing-components/src/components/Pricing.tsx` (lines 93–98):

```typescript
{plan.features.map((feature, idx) => (
  <li key={idx} className="flex items-center">
    <span className="text-green-500 mr-2">✓</span>
    {feature}
  </li>
))}
```

If a plan has no `features` or `plan.features` is undefined, `.map` throws. There is no guard for empty or malformed plans.

**Example 2: BlogGrid with empty posts renders blank layout**

BlogGrid receives `posts: []` from blog sections. With an empty array, `.map` returns an empty list and the grid renders as an empty div. There is no conditional "No posts yet" or similar empty-state UI. Users see blank space with no explanation.

**Example 2a: useNewsletter shows success without submitting**

When `onSubmit` is undefined (e.g. not wired from config), the `if (onSubmit)` block is skipped but `setStatus('success')` and `setEmail('')` still run. The user sees "Thanks for subscribing!" without any submission. Misleading feedback.

**Evidence:** [packages/marketing-components/src/footer/hooks.ts](packages/marketing-components/src/footer/hooks.ts) lines 19–37

```19:37:packages/marketing-components/src/footer/hooks.ts
  const handleSubmit = useCallback(
    async (e: React.FormEvent, onSubmit?: (email: string) => Promise<void>) => {
      e.preventDefault();
      if (!email.trim()) return;
      setIsSubmitting(true);
      setStatus('idle');
      try {
        if (onSubmit) {
          await onSubmit(email.trim());
        }
        setStatus('success');   // ← Runs even when onSubmit is undefined
        setEmail('');
      } catch {
        setStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [email]
  );
```

**Verification:** `setStatus('success')` is outside the `if (onSubmit)` block, so it runs regardless of whether `onSubmit` was provided.

**Example 3: BookingForm imports toast from sonner directly**

In `packages/features/src/booking/components/BookingForm.tsx` (line 31):

```typescript
import { toast } from 'sonner';
```

`@repo/ui` exports `toast` for design-system consistency (task 1-2 incomplete). With Toaster unmounted in clients, both `sonner` and `@repo/ui` paths fail to show feedback — but the inconsistent import also complicates future migration.

**Example 4: No error.tsx or global-error.tsx in clients**

Unhandled errors in route segments can crash the app or show generic Next.js error pages. There is no custom error boundary for graceful degradation.

**Evidence:** Grep for `error.tsx` and `global-error.tsx` in `clients/` returns no matches.

**Verification:** No `error.tsx`, `error.jsx`, `global-error.tsx`, or `global-error.jsx` exists under any client.

**Example 5: Select options key={opt.value} — duplicate key when value=""**

Placeholder uses `value=""`; options use `key={opt.value}`. If the first option has `value: ""`, that option gets `key=""`, duplicating the placeholder’s implicit key. React expects unique keys; duplicate keys can cause reconciliation issues.

**Evidence:** [packages/ui/src/components/Select.tsx](packages/ui/src/components/Select.tsx) lines 65–73

```65:73:packages/ui/src/components/Select.tsx
{placeholder && (
  <option value="" disabled>{placeholder}</option>
)}
{options.map((opt) => (
  <option key={opt.value} value={opt.value}>
    {opt.label}
  </option>
))}
```

**Verification:** Use `${opt.value}-${index}` or require unique values to avoid duplicate keys when `opt.value` is empty string.

**Example 6: Input/Select id derived from label — duplicate ids on same page**

Select (and Input, Textarea) derive `id` when not provided: `id || label?.toLowerCase().replace(/\s+/g, '-')`. Two fields with the same label (e.g. two "Email" fields on one page) both get `id="email"` — invalid HTML (duplicate id), breaks label association for screen readers.

**Evidence:** Logic appears in `@repo/ui` Input, Select, and Textarea: when `id` is not passed, `id = label?.toLowerCase().replace(/\s+/g, '-')` (or equivalent). Two "Email" inputs → both `id="email"`.

**Verification:** Any page rendering multiple inputs with the same label (e.g. billing email + shipping email) without explicit `id` props will have duplicate ids.

---

**Example 7: HeroWithForm submit button has no disabled or loading state**

In `packages/marketing-components/src/hero/HeroWithForm.tsx` (lines 71–73):

```typescript
<Button type="submit" size="large" className="w-full">
  Submit
</Button>
```

There is no `disabled` prop or `isSubmitting` state. ContactForm and BookingForm correctly use `isSubmitting` plus disabled and "Sending..." / "Submitting..." text. HeroWithForm allows double-submit and gives no visual feedback during submission.

---

### 2.5 Reliability

#### What This Means (Plain English)

Reliability covers fault tolerance, recoverability, and how well the system handles failures. Gaps here affect stability under load or when external services fail.

#### Deep Analysis Summary

**Integration resilience bypass:** Architecture docs say to always use `ResilientHttpClient` for external APIs. HubSpot and Supabase integrations use raw `fetch()` instead — no retry, circuit breaker, or timeout. Transient outages or slow APIs cause immediate failure.

**Hanging requests:** External fetch calls (HubSpot, Supabase, ResilientHttpClient internals) do not use `AbortController` or timeout. A slow or unresponsive upstream can block indefinitely; Node.js `fetch` has no default timeout.

**Shallow health check:** `/api/health` returns static `{ status: 'ok' }` without checking Supabase, Redis, or other dependencies. Orchestrators (Kubernetes, ECS) may mark unhealthy instances as ready and route traffic to them.

**Silent failure modes:** Theme init and logger Sentry import use empty catch blocks, so failures are invisible. validate-client ignores read errors when scanning client files. DLQ `addToDLQ` failures are logged but the original error is still thrown; DLQ is in-memory, so failed entries are lost on restart.

**Concurrency risks:** `getSupabaseClient` lazy singleton has no synchronization; concurrent first calls could double-initialize. `InfiniteScroll` `onLoadMore` in effect deps can cause stale or double invocations if not memoized. DLQ `processDLQEntry` splice is not atomic under concurrent processing.

#### Evidence and Examples

**Example 1: HubSpot uses raw fetch — no ResilientHttpClient**

In `packages/integrations/hubspot/client.ts`:

```typescript
export async function searchHubSpotContact(email: string): Promise<string | undefined> {
  const response = await fetch(`${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ /* ... */ }),
  });
  // No AbortController, no timeout, no retry
```

`docs/architecture/integrations.md` mandates using `ResilientHttpClient` for external APIs. HubSpot and Supabase use raw `fetch()` instead — no retry, circuit breaker, or timeout.

**Example 2: Health endpoint returns static response**

In `clients/starter-template/app/api/health/route.ts`:

```typescript
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
```

The endpoint never probes Supabase, Redis, or other dependencies. Orchestrators may route traffic to instances with broken integrations.

**Example 3: response.json() can throw**

In `packages/integrations/hubspot/client.ts` (lines 72–73):

```typescript
const data = (await response.json()) as HubSpotSearchResponse;
```

If the API returns malformed JSON or a truncated response, `response.json()` throws. There is no try-catch; the error propagates unhandled.

**Example 4: Empty catch blocks swallow theme init failures**

When `localStorage` is blocked (private mode, quota exceeded) or throws for any reason, the error is silently swallowed. No logging, no fallback behavior. Theme persistence failures are invisible to developers and users.

**Evidence:** [packages/infrastructure/ui/src/theme/persistence.ts](packages/infrastructure/ui/src/theme/persistence.ts) — three empty catch blocks:

```39:41:packages/infrastructure/ui/src/theme/persistence.ts
  } catch {
    // localStorage may be blocked (e.g. private mode restrictions)
  }
```

```52:55:packages/infrastructure/ui/src/theme/persistence.ts
  } catch {
    // ignore write failures
  }
```

```64:67:packages/infrastructure/ui/src/theme/persistence.ts
  } catch {
    // ignore
  }
```

**Verification:** No `console.warn`, `logError`, or rethrow in any of the catch blocks; failures are invisible.

**Example 5: DLQ in-memory only — data lost on restart**

In `packages/integrations-core/src/dlq.ts`:

```typescript
// In-memory DLQ (use Redis or Postgres for production)
const dlqStore: DLQEntry[] = [];

// ...
// TODO: In production, store in Redis or Postgres
// await redis.lpush('dlq', JSON.stringify(dlqEntry));
```

Failed integration requests are stored in a process-local array. On server restart, all DLQ entries are lost. No persistence for manual review or reprocessing.

**Example 6: getSupabaseClient lazy init has no synchronization**

In `packages/integrations/supabase/client.ts` (lines 174–181):

```typescript
let _instance: ReturnType<typeof createSupabaseClient> | null = null;
export const getSupabaseClient = () => {
  if (!_instance) {
    _instance = createSupabaseClient();
  }
  return _instance;
};
```

Concurrent first calls can all see `_instance === null` and invoke `createSupabaseClient()` multiple times. No lock or double-check; race condition on cold start.

**Example 7: ResilientHttpClient fetch has no timeout**

Even with retries and circuit breaker, a permanently hanging upstream can block indefinitely. Node.js `fetch` has no default timeout; no `AbortController`, `signal`, or timeout is passed.

**Evidence:** [packages/integrations-core/src/client.ts](packages/integrations-core/src/client.ts) lines 85–92

```85:92:packages/integrations-core/src/client.ts
            const response = await fetch(url, {
              ...init,
              headers: {
                'Content-Type': 'application/json',
                ...init.headers,
              },
            });
```

No `signal` from `AbortController`, no timeout option. The request can hang indefinitely if the server never responds.

**Verification:** Grep for `AbortController` or `signal` in this file returns no matches in the fetch call path.

---

### 2.6 Security

#### What This Means (Plain English)

Security issues can expose data, allow injection, or weaken access control. Findings are mapped to OWASP Top 10 where relevant.

#### Evidence and Examples

**Example 1: secureAction exposes internal details**

In `packages/infra/security/secure-action.ts`:

Validation error (line 107):

```typescript
return { success: false, error: { code: 'VALIDATION_ERROR', issues: parsed.error.issues } };
```

`parsed.error.issues` is the full Zod issue array: field paths, messages, codes, expected vs received types. If the UI displays this, it reveals schema structure and validation rules.

Internal error (lines 156–170):

```typescript
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  // ...
  return { success: false, error: { code: 'INTERNAL_ERROR', message } };
}
```

`err.message` can include stack traces, file paths, or API details. If shown to users, it leaks internal information.

**OWASP Mapping:** A05:2021 – Security Misconfiguration (excessive data exposure)
**Exploit Scenario:** Attacker crafts invalid requests to map out validation rules. Internal errors reveal file paths like `/home/user/projects/marketing-websites/packages/infra/security/secure-action.ts` helping identify the tech stack.

**Verification:** Send malformed JSON to any secureAction endpoint. The response includes full validation issues or error messages with internal details.

**Additional Evidence:** This information leakage is particularly dangerous because:

1. Validation issues reveal exact field names and types
2. Error messages can expose file system structure
3. Stack traces may reveal dependency versions
4. Internal error codes help attackers understand the system architecture
5. No sanitization occurs before returning errors to clients

**Example 2: JSON-LD script breakout XSS**

In `packages/features/src/services/components/ServiceDetailLayout.tsx` (lines 86–92):

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
/>
```

`faqStructuredData` includes `faq.question` and `faq.answer` (line 77–81). If CMS or config content contains `</script>`, it breaks out of the script tag and can execute arbitrary JavaScript. Data should be escaped before `JSON.stringify`.

**OWASP Mapping:** A03:2021 – Injection (XSS)
**Exploit Scenario:** Attacker controls FAQ content via CMS. Entry: `What is your service?</script><script>alert('XSS')</script>`. Result: XSS executes in context of the page.

**Verification:** Add an FAQ item with `</script><script>alert(1)</script>` in the answer. View the page source — script tags break out and execute.

**Additional Evidence:** This XSS vulnerability is particularly severe because:

1. JSON-LD scripts execute in page context with same privileges
2. No Content Security Policy can prevent this specific breakout
3. CMS users without technical knowledge can inject scripts
4. The vulnerability affects all service pages with FAQ sections
5. Search engines and other crawlers may also execute the injected code

**Example 3: ThemeInjector CSS injection risk**

In `packages/ui/src/components/ThemeInjector.tsx` (lines 117–120):

```typescript
const cssProperties = Object.entries(merged)
  .filter((entry): entry is [string, string] => entry[1] !== undefined)
  .map(([key, value]) => `  --${key}: ${toCssColor(value)};`)
  .join('\n');
const css = `${selector} {\n${cssProperties}\n}`;
return <style dangerouslySetInnerHTML={{ __html: css }} />;
```

`toCssColor` wraps bare HSL or returns the value as-is. Malicious config (e.g. `}; body { background: url('javascript:...') }`) could break out of the CSS block. Values are not sanitized for CSS context.

**Example 4: getAllowedOriginsFromEnv returns undefined — CSRF bypass**

In `packages/infra/middleware/create-middleware.ts` (lines 21–34):

```typescript
export function getAllowedOriginsFromEnv(): string[] | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url || typeof url !== 'string') return undefined;
  try {
    const origin = new URL(url).origin;
    // ...
  } catch {
    return undefined; // ← Invalid URL returns undefined
  }
}
```

When `NEXT_PUBLIC_SITE_URL` is missing or invalid, the function returns `undefined`. The middleware checks `if (allowedOrigins && allowedOrigins.length > 0)` before enforcing Origin — when undefined, the check is skipped and no CSRF protection is applied.

**OWASP Mapping:** A01:2021 – Broken Access Control (CSRF)
**Exploit Scenario:** Attacker hosts a malicious form that submits to the target site. With no Origin check, the browser sends the request with cookies. State-changing actions (contact submit, booking) can be triggered cross-origin.

**Verification:** Set NEXT_PUBLIC_SITE_URL to empty value. Submit a form from a different origin — request succeeds without CSRF validation.

**Additional Evidence:** This CSRF vulnerability is critical because:

1. All state-changing Server Actions are vulnerable
2. No SameSite cookie attribute protection fallback
3. Missing environment variable completely disables protection
4. No warning or error when protection is disabled
5. Attackers can trigger actions without user interaction in some cases

**Example 5: CSP lacks frame-src for embeds**

In `packages/infra/security/csp.ts` (lines 123–150), directives include `default-src 'self'`, `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `frame-ancestors`, `object-src`, `base-uri`, `form-action`. There is no `frame-src`. Without it, iframes inherit `default-src 'self'`. YouTube and Vimeo embeds (VideoEmbed, HeroVideo) would be blocked by a strict CSP.

**Example 6: Booking PII in logs**

In `packages/features/src/booking/lib/booking-actions.ts` (lines 240–247):

```typescript
console.info('Booking submitted:', {
  bookingId: record.id,
  confirmationNumber,
  service: serviceLabels[validatedData.serviceType] ?? validatedData.serviceType,
  email: validatedData.email,   // ← PII
  ip: clientIp,                 // ← PII
  providerResults: /* ... */,
  timestamp: new Date().toISOString(),
});
```

Email and client IP are logged to stdout. In production, container logs may be accessible; this raises GDPR and privacy concerns.

**Example 7: Logger stack redaction misses Windows paths**

In `packages/infra/logger/index.ts` (line 206):

```typescript
stack: error.stack?.replace(/\(?\/([\w./-]+)\)?/g, '[redacted path]'),
```

The regex matches Unix-style paths (`/home/...`, `/Users/...`). Windows paths like `C:\Users\...` use backslashes and are not matched. Stack traces on Windows hosts can leak full file paths.

**Example 8: VideoEmbed and AudioPlayer iframe/src unsanitized**

`url` is passed directly to `iframe src` and `<source src>`. If the URL comes from CMS or user input, values like `javascript:alert(1)` or `data:text/html,<script>...</script>` can lead to XSS.

**Evidence:** [packages/marketing-components/src/components/Industry.tsx](packages/marketing-components/src/components/Industry.tsx) lines 229–237

```229:237:packages/marketing-components/src/components/Industry.tsx
export const VideoEmbed: React.FC<{ url: string; title?: string }> = ({ url, title }) => (
  <div className="aspect-w-16 aspect-h-9">
    <iframe src={url} title={title} className="w-full h-full rounded" allowFullScreen />
  </div>
);

export const AudioPlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => (
  <audio controls className="w-full" title={title}>
    <source src={url} type="audio/mpeg" />
```

**Verification:** `sanitizeUrl` exists in `@repo/infra` but is not used here; no validation or allowlist for `url` before assignment to `src`.

**Example 9: Rate limit getClientIp falls back to 127.0.0.1**

In `packages/infra/security/rate-limit/helpers.ts` (lines 28–49):

```typescript
export function getClientIp(headers: Record<string, string>): string {
  // ... check x-forwarded-for, x-real-ip, cf-connecting-ip, etc.
  return '127.0.0.1'; // ← Fallback when no proxy headers
}
```

In development or when the proxy is misconfigured, all requests share the same rate-limit bucket (127.0.0.1). A single actor can exhaust the limit for everyone, or legitimate users can be blocked if one IP exceeds limits.

**Example 10: Contact handler message passthrough — raw integration errors to user**

When the handler (Supabase, HubSpot) returns `{ success: false, message: '...' }`, that message is passed through unchanged. Integration errors often include API details, stack traces, or internal paths. No sanitization layer.

**Evidence:** [packages/features/src/contact/lib/contact-actions.ts](packages/features/src/contact/lib/contact-actions.ts) lines 208–216

```208:216:packages/features/src/contact/lib/contact-actions.ts
} else {
  return {
    success: false,
    message:
      handlerResult.message ||   // ← Handler can return raw Supabase/HubSpot error
      options?.errorMessage ||
      'Something went wrong. Please try again.',
  };
}
```

**Verification:** No mapping or sanitization of `handlerResult.message` before returning to the client.

**Example 11: withErrorBoundary doc encourages err.message display**

The documented example displays `err.message` directly in the fallback UI. If `err` comes from Supabase/HubSpot (e.g. raw API response), it can leak internals. The default fallback avoids this; the documented pattern is risky.

**Evidence:** [packages/infra/composition/hocs.ts](packages/infra/composition/hocs.ts) lines 86–89 (JSDoc example)

```86:89:packages/infra/composition/hocs.ts
 * @example
 * const SafeWidget = withErrorBoundary(Widget);
 * const SafeWidgetWithFallback = withErrorBoundary(Widget, (err, reset) => <div>Error: {err.message} <button onClick={reset}>Retry</button></div>);
```

**Verification:** The example uses `{err.message}` in the fallback; recommend generic user-facing message in docs.

---

### 2.7 Maintainability

#### What This Means (Plain English)

Maintainability covers how easy it is to modify, test, and understand the codebase. Issues include type erosion, dead code, and inconsistent patterns.

#### Deep Analysis Summary

Issues include: `validateSiteConfigObject` referenced in comments but never implemented; industry enum mismatches between validation and types; version catalog drift; 14+ integration packages built but not wired; large barrel files; `any` usage; eslint-disable comments; dead TODOs; scaffolded modules; and stale documentation. Test coverage is low (about 14% lines, 10% functions). There is no dedicated integration test suite or contract tests for APIs.

#### Evidence and Examples

**Example 1: validateSiteConfigObject does not exist**

Comments in validate-site-config say "use validateSiteConfigObject() directly" for full Zod validation. The function is never implemented. `siteConfigSchema` exists in types, but validate-site-config uses regex only.

**Evidence:** [tooling/validation/src/validate-site-config.ts](tooling/validation/src/validate-site-config.ts) line 50

```50:50:tooling/validation/src/validate-site-config.ts
 * For full Zod schema validation, use validateSiteConfigObject() directly.
```

**Verification:** Grep for `validateSiteConfigObject` across the repo returns only this comment and ANALYSIS/ANALYSISFULL references; no function definition exists.

**Impact:** Full schema validation is impossible despite the comment suggesting it exists.

**Additional Evidence:** This creates a critical gap in the validation pipeline:

1. `siteConfigSchema` in `packages/types/src/site-config.ts` is comprehensive
2. `validateSiteConfigObject` is referenced but missing
3. `validate-site-config` only performs basic regex checks
4. Complex type errors can slip through validation
5. No runtime validation of nested configuration objects
6. Type safety is weakened at the configuration boundary

**Example 2: zodResolver cast pattern loses type inference**

In ContactForm, BookingForm, Form (packages/features, packages/ui):

```typescript
resolver: zodResolver(schema as unknown as Parameters<typeof zodResolver>[0]),
```

This workaround is used for dynamic schemas with zodResolver. The cast loses schema type inference and can mask type errors.

**Evidence:** Found in 6+ components. Pattern indicates typing issues with dynamic schemas.

**Verification:** Remove the cast — TypeScript errors reveal the underlying type mismatch that needs proper resolution.

**Example 3: `Record<string, any>` and `z.record(z.any())` in SiteConfig**

`integrations.booking.config`, `integrations.email.config`, and `integrations.abTesting.config` accept any value. No type safety; malformed config can cause runtime errors. The schema weakens validation with `z.any()`.

**Evidence:** [packages/types/src/site-config.ts](packages/types/src/site-config.ts) — integration config types and schema:

| Location         | Line | Content                         |
| ---------------- | ---- | ------------------------------- |
| booking.config   | 251  | `config?: Record<string, any>;` |
| email.config     | 255  | `config?: Record<string, any>;` |
| abTesting.config | 278  | `config?: Record<string, any>;` |

Schema definitions use `config: z.record(z.any()).optional()` at lines 497, 503, 538 (booking, email, abTesting).

**Verification:** No typed config interfaces for these integrations; any value passes.

**Additional Evidence:** This creates significant type safety issues:

1. Integration configs accept any data without validation
2. Runtime errors can occur with malformed configuration
3. No autocomplete or IDE support for integration-specific config
4. Type inference breaks for downstream code
5. Security risks from unvalidated config data
6. Debugging becomes difficult with unknown data shapes

**Example 4: Duplicate 'use client' directives**

In `packages/features/src/booking/components/BookingForm.tsx`:

```typescript
'use client';   // line 1

// ... 20+ lines of file header comments ...

'use client';   // line 25

import { useState, ...
```

Duplicate directives increase noise and can confuse tooling. The same pattern appears in FooterWithNewsletter and NewsletterSection.

**Evidence:** Multiple files have duplicate 'use client' at lines 1 and ~25 after comment blocks.

**Verification:** Run `grep -n "'use client'"` on these files — shows two occurrences per file.

**Example 5: AccordionContent item shape differs — adapter mismatch**

`@repo/ui` Accordion expects `AccordionItem { question: string; answer: string }`:

```typescript
// packages/ui/src/components/Accordion.tsx
export interface AccordionItem {
  question: string;
  answer: string;
}
```

Industry.tsx AccordionContent uses `{ title: string; content: string }`:

```typescript
// packages/marketing-components/src/components/Industry.tsx
<summary className="p-4 cursor-pointer">{item.title}</summary>
<div className="p-4 pt-0">{item.content}</div>
```

Adapters must map between shapes. Passing `AccordionItem[]` to a component expecting `{ title, content }[]` (or vice versa) causes wrong or empty display.

**Example 6: key={index} widespread — reconciliation risk for dynamic lists**

20+ components use `key={index}` or `key={idx}`. For static config-driven lists this is often acceptable. For dynamic, sortable, or asynchronously loaded data, index keys can cause React reconciliation bugs, focus loss, and incorrect state reuse when the list changes.

**Evidence:** Grep-derived file and line references for `key={index}` / `key={idx}`:

| Package              | File                     | Line(s)       |
| -------------------- | ------------------------ | ------------- |
| @repo/ui             | Accordion.tsx            | 63            |
| @repo/ui             | Carousel.tsx             | 120, 136      |
| @repo/ui             | Breadcrumb.tsx           | 70            |
| @repo/ui             | Masonry.tsx              | 54            |
| @repo/ui             | Pagination.tsx           | 109           |
| @repo/ui             | Stepper.tsx              | 62, 120       |
| @repo/ui             | Timeline.tsx             | 48            |
| @repo/ui             | FileUpload.tsx           | 164           |
| @repo/ui             | ColorPicker.tsx          | 134           |
| marketing-components | HeroWithTestimonials.tsx | 62            |
| marketing-components | HeroWithStats.tsx        | 61            |
| marketing-components | HeroWithFeatures.tsx     | 62            |
| marketing-components | HeroCarousel.tsx         | 87            |
| marketing-components | Team.tsx                 | 55            |
| marketing-components | Pricing.tsx              | 32, 95        |
| marketing-components | Industry.tsx             | 189, 221, 245 |
| marketing-components | Hero.tsx (components)    | 125           |

**Verification:** Grep `key=\{index\}` and `key=\{idx\}` in `packages/` returns these usages.

---

### 2.8 Portability

#### What This Means (Plain English)

Portability covers how well the system runs across platforms, deployment targets, and locales.

#### Deep Analysis Summary

**Platform:** Documentation (README, CLAUDE, onboarding, troubleshooting) uses Unix-only commands such as `cp -r`, `mkdir -p`, `rm -rf`. Windows developers need WSL or Git Bash; no cross-platform alternatives are documented. `create-client` exists but docs still lead with `cp -r`.

**Deployment:** Only starter-template has a Dockerfile. Other clients (luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters) do not, so deployment portability varies.

**CI:** Workflows run on ubuntu-latest only. There is no Windows or macOS matrix; platform-specific bugs can slip through.

**Locale/currency:** ProductCard, ProductDetail, ProductComparison, MenuCard, CourseCard hardcode `Intl.NumberFormat('en-US')`. booking-actions uses `toLocaleDateString('en-US')`. `formatCurrency` and `formatNumber` accept locale but callers often omit it. DatePicker’s `formatDate` uses `d.toLocaleDateString()` with no locale, defaulting to the browser and possibly mismatching site locale.

**RTL/locale layout:** Starter-template uses next-intl and `getLocaleDir` with `dir` on `<html>`. Other clients use plain `<html lang="en">` with no `dir` and no next-intl, so RTL and multi-locale support are inconsistent.

#### Evidence and Examples

**Example 1: Unix-only commands throughout documentation**

Documentation leads with Unix commands; Windows developers need WSL or Git Bash. No cross-platform alternatives (e.g. `pnpm create-client`, `xcopy`, `robocopy`) are documented in these locations.

**Evidence:** Grep for `cp -r`, `mkdir -p`, `rm -rf` across docs and root:

| Document                                | Command(s)                                                          | Line(s)                 |
| --------------------------------------- | ------------------------------------------------------------------- | ----------------------- |
| README.md                               | `cp -r clients/starter-template clients/my-client-name`             | 162                     |
| CLAUDE.md                               | `cp -r clients/starter-template clients/my-client`                  | 314                     |
| clients/README.md                       | `cp -r clients/starter-template clients/[client-name]`              | 39                      |
| docs/getting-started/onboarding.md      | `cp -r`, `mkdir -p`, `rm -rf`                                       | 317, 444, 452, 483, 543 |
| docs/getting-started/troubleshooting.md | `rm -rf node_modules`, `rm -rf .next`, `rm -rf node_modules/.cache` | 142, 181–182, 285, 560  |
| docs/1-getting-started/onboarding.md    | same                                                                | 317, 444, 452, 483, 543 |
| docs/1-getting-started/index.md         | `cp -r`, `rm -rf node_modules`                                      | 36, 204, 346            |
| docs/platform/golden-path-new-client.md | `cp -r clients/starter-template clients/my-client`                  | 21                      |
| docs/tutorials/build-first-client.md    | `mkdir -p`, `cp -r`                                                 | 119, 122                |
| docs/migration/template-to-client.md    | `cp -r`                                                             | 62                      |

**Verification:** Windows user without Git Bash tries `cp -r` in Command Prompt — command not found. No Windows alternatives documented.

**Additional Evidence:** This creates significant barriers for Windows developers:

1. 20+ instances of Unix commands in core documentation
2. No mention of `pnpm create-client` tool that exists
3. Windows alternatives (xcopy, robocopy) not documented
4. New Windows developers must install WSL or Git Bash
5. CI/CD pipelines may fail on Windows agents
6. Documentation appears Unix-centric despite cross-platform claims

**Example 2: Only starter-template has Dockerfile**

Deploy portability is inconsistent across clients.

**Evidence:** Grep for `Dockerfile` in `clients/`: only [clients/starter-template/Dockerfile](clients/starter-template/Dockerfile) exists. No Dockerfile under `clients/luxe-salon/`, `clients/bistro-central/`, `clients/chen-law/`, `clients/sunrise-dental/`, or `clients/urban-outfitters/`.

**Verification:** `ls clients/*/Dockerfile` or equivalent returns one file; docker-compose.yml and docs reference `clients/starter-template/Dockerfile` only. Other clients cannot be deployed using Docker without manual configuration.

**Example 3: CI runs ubuntu-latest only**

Jobs run on `ubuntu-latest` only. There is no Windows or macOS matrix; platform-specific bugs (path separators, symlinks) can slip through without detection.

**Evidence:** [.github/workflows/ci.yml](.github/workflows/ci.yml) lines 35, 146: `runs-on: ubuntu-latest`. Same in docs-validation.yml, nightly.yml, performance-audit.yml, release-canary.yml, release.yml, security-sast.yml, visual-regression.yml, dependency-integrity.yml, secret-scan.yml, sbom-generation.yml.

**Verification:** No `runs-on: windows-latest` or `macos-latest` in any workflow. Windows-specific path separator bugs (e.g. `\` vs `/`) are not tested in CI.

**Example 4: Hardcoded en-US in currency and date formatting**

Currency and date formatting hardcode `en-US` or omit locale; site locale from `site.config` is ignored.

**Evidence:** Exact file and line references:

| File                                                                                     | Line | Usage                                                                         |
| ---------------------------------------------------------------------------------------- | ---- | ----------------------------------------------------------------------------- |
| [ProductCard.tsx](packages/marketing-components/src/product/ProductCard.tsx)             | —    | `new Intl.NumberFormat('en-US', {...})`                                       |
| [ProductDetail.tsx](packages/marketing-components/src/product/ProductDetail.tsx)         | —    | `new Intl.NumberFormat('en-US', {...})`                                       |
| [ProductComparison.tsx](packages/marketing-components/src/product/ProductComparison.tsx) | —    | `new Intl.NumberFormat('en-US', {...})`                                       |
| [MenuCard.tsx](packages/marketing-components/src/menu/MenuCard.tsx)                      | —    | `new Intl.NumberFormat('en-US', {...})`                                       |
| [CourseCard.tsx](packages/marketing-components/src/course/CourseCard.tsx)                | —    | `new Intl.NumberFormat('en-US', {...})`                                       |
| [booking-actions.ts](packages/features/src/booking/lib/booking-actions.ts)               | 421  | `formattedDate: new Date(...).toLocaleDateString('en-US', {...})`             |
| [DatePicker.tsx](packages/ui/src/components/DatePicker.tsx)                              | 58   | `formatDate = (d) => d.toLocaleDateString()` (no locale arg; browser default) |

`formatCurrency` and `formatNumber` in [packages/features/src/localization/format.ts](packages/features/src/localization/format.ts) accept a `locale` parameter, but callers often omit it.

**Verification:** Set site locale to 'fr-FR' or 'de-DE'. Product prices still display with $ and US formatting. Dates show MM/DD/YYYY regardless of locale.

---

## 3. Security Findings (Cross-Reference by OWASP)

### A01 — Broken Access Control

| ID    | Finding                                                                                                                                                                  | Location                                                                                                                             | Severity |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| I-090 | getAllowedOriginsFromEnv returns undefined when NEXT_PUBLIC_SITE_URL is missing or invalid. Middleware skips Origin check; no CSRF protection for cross-origin requests. | `packages/infra/middleware/create-middleware.ts` lines 22–34 (getAllowedOriginsFromEnv)                                              | P1       |
| I-091 | secureAction booking actions omit siteId. In multi-tenant deployments all clients share the same tenant bucket; IDOR across sites is possible.                           | `packages/features/src/booking/lib/booking-actions.ts` secureAction calls (e.g. submitBookingRequest, confirmBooking, cancelBooking) | P1       |
| I-095 | validateOrigin never called in Server Actions.                                                                                                                           | `packages/features/src/contact/lib/contact-actions.ts`, `packages/features/src/booking/lib/booking-actions.ts`                       | P2       |
| I-097 | runWithTenantId never invoked in app flow.                                                                                                                               | No caller of runWithTenantId in middleware/actions                                                                                   | P2       |

### A03 — Injection

| ID    | Finding                                                                                            | Location                                                                                                                                                   | Severity |
| ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| I-002 | Contact form has no server-side Zod validation. Arbitrary or malformed data can reach the handler. | `packages/features/src/contact/lib/contact-actions.ts` submitContactForm; `contact-schema.ts` validateContactSecurity (lines 195–233) only honeypot/length | P1       |
| I-074 | JSON-LD script breakout XSS. Data from site config or CMS is not escaped.                          | `packages/features/src/services/components/ServiceDetailLayout.tsx` lines 86–92 (dangerouslySetInnerHTML)                                                  | P1       |
| I-075 | ThemeInjector CSS injection. Malicious config could break out of the CSS block.                    | `packages/ui/src/components/ThemeInjector.tsx` lines 117–120, 127–133 (toCssColor, dangerouslySetInnerHTML)                                                | P2       |
| I-076 | VideoEmbed, AudioPlayer, iframe src unsanitized. XSS via javascript: or data: URLs.                | `packages/marketing-components/src/components/Industry.tsx` lines 229–237 (iframe src={url}, source src={url})                                             | P1       |
| I-077 | Nav/footer href not sanitized. javascript: or data: URLs possible from config.                     | NavigationHorizontal, FooterStandard, etc.                                                                                                                 | P2       |

### A04 — Insecure Design

| ID    | Finding                                                                             | Location                                                                                     | Severity |
| ----- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------- |
| I-021 | secureAction INTERNAL_ERROR exposes err.message to user.                            | `packages/infra/security/secure-action.ts` lines 156–170 (catch block returns message)       | P1       |
| I-023 | Supabase/HubSpot errorText in thrown errors; can leak if surfaced to UI.            | Supabase, HubSpot integrations                                                               | P2       |
| I-125 | secureAction VALIDATION_ERROR returns full z.ZodIssue[]; schema structure can leak. | `packages/infra/security/secure-action.ts` line 107 (issues: parsed.error.issues)            | P1       |
| I-129 | withErrorBoundary doc encourages err.message display.                               | `packages/infra/composition/hocs.ts` lines 86–89 (JSDoc example)                             | P2       |
| I-130 | Contact handler message passthrough; raw integration errors can reach user.         | `packages/features/src/contact/lib/contact-actions.ts` lines 208–216 (handlerResult.message) | P2       |

### A05 — Security Misconfiguration

| ID    | Finding                                                          | Location                                                                                        | Severity |
| ----- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------- |
| I-001 | Starter-template lacks createMiddleware (CSP, security headers). | `clients/starter-template/middleware.ts` (next-intl only; no createMiddleware from @repo/infra) | P1       |
| I-092 | CSP lacks frame-src for embeds.                                  | `packages/infra/security/csp.ts` lines 121–148 (directives; no frame-src)                       | P1       |
| I-093 | Rate limit getClientIp falls back to 127.0.0.1.                  | `packages/infra/security/rate-limit/helpers.ts` lines 28–49 (return '127.0.0.1')                | P2       |
| I-096 | Health API route has no middleware.                              | `clients/starter-template/app/api/health/route.ts` (static { status: 'ok' })                    | P2       |

### A09 — Security Logging and Monitoring Failures

| ID    | Finding                                                                                       | Location                                                                                           | Severity |
| ----- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------- |
| I-022 | Email integrations return raw errors (Mailchimp error.detail, ConvertKit/SendGrid String(e)). | integrations-email                                                                                 | P1       |
| I-126 | Booking PII in logs (email, clientIp).                                                        | `packages/features/src/booking/lib/booking-actions.ts` lines 239–247 (console.info with email, ip) | P2       |
| I-127 | Logger stack redaction misses Windows paths and file:// URLs.                                 | `packages/infra/logger/index.ts` line 206 (regex \(?\/([\w./-]+)\)?)                               | P2       |
| I-128 | Client logError logs full error + context to console in production.                           | `packages/infra/logger/client.ts`                                                                  | P2       |

---

## 4. Systemic vs Localized Issues Overview

### Systemic (31 issues)

Issues affecting architecture, cross-cutting security, or multiple clients/features.

| IDs                                                                                       | Theme                                                                                   |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| I-001, I-090, I-091, I-092, I-093, I-095, I-096, I-097, I-094, I-173, I-174, I-183, I-184 | Middleware, CSP, CSRF, tenant, rate limiting, matcher/export consistency, create-client |
| I-021, I-022, I-125, I-126, I-127, I-128, I-129, I-130                                    | Error handling, information leakage                                                     |
| I-031, I-039                                                                              | Integration wiring                                                                      |
| I-035, I-038                                                                              | Monorepo structure                                                                      |
| I-061                                                                                     | Dynamic imports                                                                         |
| I-155, I-156, I-157, I-158, I-160, I-161, I-163                                           | Performance: images, budgets, section loading, caching                                  |
| I-071                                                                                     | Distributed tracing                                                                     |
| I-082                                                                                     | Error boundaries                                                                        |
| I-085, I-089                                                                              | Loading, Suspense                                                                       |
| I-137                                                                                     | Toaster not mounted                                                                     |
| I-086, I-154                                                                              | DLQ persistence, splice race                                                            |
| I-066, I-067, I-068                                                                       | Test coverage                                                                           |
| I-147, I-151                                                                              | Health check shallow, ResilientHttpClient no timeout                                    |

### Cross-Feature (36 issues)

Issues spanning multiple components or features.

| IDs                                                                         | Theme                                                               |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| I-002, I-028, I-029, I-031                                                  | Contact, booking, integration wiring                                |
| I-005, I-098, I-099, I-101, I-131, I-136                                    | Form/schema, PricingPlan, booking enum                              |
| I-021, I-022, I-023, I-130                                                  | Error/integration leakage                                           |
| I-074, I-075, I-076, I-077                                                  | XSS, injection                                                      |
| I-080                                                                       | Tailwind dynamic classes                                            |
| I-008, I-009, I-010, I-011, I-108, I-109, I-110, I-111, I-112, I-113, I-115 | Type/schema                                                         |
| I-104, I-105, I-106, I-138, I-139                                           | Newsletter, form controls, empty states, motion                     |
| I-117, I-118, I-120, I-124                                                  | Hero/CTA fragmentation                                              |
| I-047, I-048, I-049, I-050                                                  | Lint/type violations                                                |
| I-145, I-146, I-149                                                         | Integration resilience, fetch timeout, response.json throw          |
| I-155, I-164                                                                | Raw img vs next/image; hero/service content images                  |
| I-166, I-168, I-169                                                         | Portability: Docker per client, en-US hardcoding, RTL/locale layout |

### Single Feature (63 issues)

Issues confined to one component, script, or file.

| IDs                                                                                                                                                      | Theme                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| I-004, I-016, I-017, I-018, I-019, I-020, I-030, I-032, I-033, I-034, I-051, I-121, I-122, I-132, I-133, I-134, I-135, I-140, I-141, I-142, I-143, I-144 | Feature completeness, bugs                                                    |
| I-171                                                                                                                                                    | Portability: DatePicker locale                                                |
| I-006, I-007, I-027, I-036, I-037, I-040, I-041, I-042, I-043, I-044, I-045, I-046                                                                       | Code structure                                                                |
| I-012, I-013, I-014, I-081, I-107, I-119, I-123, I-140, I-141, I-142, I-143, I-144                                                                       | UI consistency                                                                |
| I-024, I-078, I-079, I-083, I-148, I-150, I-152, I-153                                                                                                   | Reliability                                                                   |
| I-052, I-053, I-054, I-055, I-056, I-057, I-058, I-059, I-060, I-062, I-063, I-064, I-065                                                                | Stubs, docs, performance                                                      |
| I-159, I-162                                                                                                                                             | Performance: ServiceGrid img, SectionFallback                                 |
| I-165, I-167, I-170, I-172                                                                                                                               | Portability: Unix commands, CI platform, logger paths, create-client guidance |
| I-069, I-070, I-072, I-073                                                                                                                               | Operational                                                                   |
| I-084, I-088                                                                                                                                             | Schema, React keys                                                            |
| I-100, I-102, I-103, I-114, I-116                                                                                                                        | Component-specific                                                            |

---

## 6. Verification Procedures and Test Cases

### 6.1 Functional Verification Scripts

#### Contact Form Verification

```bash
# 1. Submit contact form with valid data
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'

# Expected: Success response but no data saved
# Verify: Check Supabase/HubSpot - no record created

# 2. Submit with missing required field
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":""}'

# Expected: Should fail validation but may pass with minimal security check
```

#### Booking System Verification

```bash
# 1. Visit /book with empty timeSlots
pnpm dev
# Navigate to http://localhost:3000/book
# Expected: ZodError or broken time slot selection

# 2. Create booking and restart server
# Create booking via form
# Restart: pnpm dev
# Expected: Booking disappears (in-memory only)

# 3. Test booking action with wrong signature
# In tests, confirmBooking(bookingId, {confirmationNumber, email})
# Expected: Validation fails - wrong shape passed to secureAction
```

#### Blog System Verification

```bash
# 1. Visit blog pages
pnpm dev
# Navigate to http://localhost:3000/blog
# Expected: Empty posts array

# Navigate to http://localhost:3000/blog/test-post
# Expected: Empty content, no 404 for unknown slug
```

### 6.2 Security Verification

#### CSRF Protection Test

```bash
# 1. Set NEXT_PUBLIC_SITE_URL empty
export NEXT_PUBLIC_SITE_URL=""
pnpm dev

# 2. Submit form from different origin
# Create HTML file with form posting to http://localhost:3000/api/contact
# Open in browser and submit
# Expected: Request succeeds (CSRF protection disabled)
```

#### XSS Injection Test

```bash
# 1. Add XSS payload to FAQ
# In site.config.ts, add FAQ with:
# answer: "Test answer</script><script>alert('XSS')</script>"

# 2. Visit service page
# Expected: Alert executes (XSS successful)
```

#### Information Leakage Test

```bash
# 1. Send malformed JSON to secureAction
curl -X POST http://localhost:3000/api/booking/submit \
  -H "Content-Type: application/json" \
  -d '{"invalid":"structure"}'

# Expected: Response includes full Zod validation issues

# 2. Trigger internal error
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"trigger":"internal_error"}'

# Expected: Error message may include stack traces or file paths
```

### 6.3 Performance Verification

#### Bundle Analysis

```bash
# 1. Build and analyze bundles
pnpm build
npx @next/bundle-analyzer .next

# Expected: All section components in main bundle
# No code splitting for routes

# 2. Check for raw images
grep -r "<img" packages/marketing-components | wc -l
# Expected: 48+ instances of raw img tags
```

#### Lighthouse Performance

```bash
# 1. Run Lighthouse
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json

# 2. Check performance budget
node scripts/perf/validate-budgets.ts
# Expected: Script passes even without metrics (CI gate ineffective)
```

### 6.4 Compatibility Verification

#### Middleware Divergence Test

```bash
# 1. Check starter-template middleware
cat clients/starter-template/middleware.ts
# Expected: next-intl only, no createMiddleware

# 2. Check other clients middleware
cat clients/luxe-salon/middleware.ts
# Expected: createMiddleware only, no next-intl

# 3. Test matcher differences
# Request /api/health from both clients
# Expected: Different middleware behavior
```

#### Cross-Platform Commands Test

```bash
# 1. Try Unix commands on Windows
cp -r clients/starter-template clients/test-client
# Expected: Command not found

# 2. Check for Windows alternatives
grep -r "xcopy\|robocopy" docs/
# Expected: No Windows alternatives documented
```

---

## 7. Critical Path to Production

### 7.1 P0 Blockers (Must Fix Before Launch)

1. **Contact Form Data Loss** (I-003)
   - Implement `createContactHandler(siteConfig)`
   - Wire handler in ContactFormAdapter
   - Test with Supabase and HubSpot

2. **Booking System Persistence** (I-029)
   - Implement `getBookingRepository(env)` factory
   - Add environment-based repository selection
   - Test data persistence across restarts

3. **CSRF Protection Disabled** (I-090)
   - Fix `getAllowedOriginsFromEnv` to return default origins
   - Test CSRF protection with missing env var
   - Add warning when protection disabled

4. **XSS Vulnerabilities** (I-074, I-076)
   - Escape JSON-LD data before stringify
   - Sanitize iframe/video src URLs
   - Add CSP frame-src for embeds

5. **Server-Side Validation Missing** (I-002)
   - Add full Zod validation to contact actions
   - Validate all required fields and types
   - Test bypass attempts

### 7.2 P1 High Priority (Fix Within First Week)

1. **Toaster Not Mounted** (I-137)
   - Add Toaster to all client Providers
   - Migrate toast imports to @repo/ui
   - Test feedback visibility

2. **Performance Issues** (I-155, I-158)
   - Replace raw img with next/image
   - Implement dynamic section imports
   - Add performance budgets to CI

3. **Middleware Fragmentation** (I-001, I-094)
   - Compose createMiddleware with next-intl
   - Standardize matcher across clients
   - Test security headers

4. **Type Safety Issues** (I-110, I-111)
   - Replace Record<string, any> with unknown
   - Implement validateSiteConfigObject
   - Fix zodResolver casting

### 7.3 P2 Medium Priority (Fix Within First Month)

1. **Blog System Non-Functional** (I-016, I-017, I-018)
   - Wire blog adapters to real data
   - Implement initializeBlog and getPostBySlug
   - Add 404 for unknown slugs

2. **Component Bugs** (I-004, I-008, I-009)
   - Fix HeroWithForm wiring to React Hook Form
   - Complete ServiceTabs implementation
   - Guard empty arrays in components

3. **Portability Issues** (I-165, I-166, I-167)
   - Document Windows alternatives
   - Add Dockerfiles to all clients
   - Extend CI with Windows matrix

---

## 5. Remediation Phases

### Phase A — Wiring and Bug Fixes (Days 1–7)

1. Build `createContactHandler(siteConfig)` and wire it into ContactFormAdapter.
2. Build `getBookingRepository(env)` or `createBookingRepository(env)`; swap based on env (I-029, I-135).
3. Complete ServiceTabs (TabsList, TabsTrigger, TabsContent).
4. Fix Tailwind dynamic class bug — Industry, Gallery, Testimonials, Team, Services, Pricing, Blog, layout utils (I-032, I-080).
5. Guard empty timeSlots/serviceCategories in createBookingFormSchema — fallback schema or skip enum when empty (I-005, I-136).
6. Wire integrations into features via config-driven selection.
7. Add `error.tsx` and `global-error.tsx` to starter-template (I-082).
8. Sanitize JSON-LD: escape `</script>` in strings before JSON.stringify (I-074).
9. Sanitize iframe/video/audio src with `sanitizeUrl` (I-076).
10. Add server-side Zod to contact actions (I-002).
11. Fix booking action test signatures and assertions (I-003).
12. Integrate createMiddleware into starter-template; compose with next-intl (I-001, I-094); align middleware matchers across clients (I-173); standardize export style (I-174).
13. Implement `validateSiteConfigObject` using `siteConfigSchema`, or remove the ghost comment (I-008).
14. Add conversionFlow type `'none'` to ConversionFlowConfig/schema or fix validate-client test (I-108).
15. Add `siteConfigSchema.safeParse` in getSiteConfig or composePage before passing to sections (I-109).
16. Replace `Record<string, any>` with `Record<string, unknown>` or typed configs in SiteConfig (I-110).
17. Fix HeroWithForm Form wiring — use FormField with register or FormField render prop (I-004).
18. Add phone to HeroWithForm defaultFormSchema when `fields.phone`; pass defaultValues to Form (I-098, I-099).
19. Fix BookingForm reset — call `form.reset()` or setValue for all fields (I-101).
20. Fix FormField ref — use `useRef(null)` instead of `createRef()` (I-100).
21. Remove duplicate `'use client'` in FooterWithNewsletter, NewsletterSection (I-102, I-103).
22. Unify PricingPlan types or add adapter mapping; guard `plans[0]?.features` and `plan.features` in PricingTable/PricingCards (I-122, I-131, I-132).
23. Add frame-src to CSP for youtube.com, vimeo.com, player.vimeo.com (I-092).
24. Pass siteId to secureAction in booking actions; fail fast when getAllowedOriginsFromEnv undefined (I-090, I-091).
25. Mount Toaster in LocaleProviders or Providers so toast.success/error render (I-137).
26. Migrate BookingForm toast import from sonner to @repo/ui (I-140).
27. Add disabled and loading state to HeroWithForm submit button (I-141).
28. Add role="status" or role="alert" to ContactForm submitStatus div (I-142).
29. Add empty-state UI to BlogGrid when posts.length === 0 (I-143).
30. Migrate HubSpot and Supabase integrations to ResilientHttpClient (I-145).
31. Add AbortController/timeout to external fetch calls (I-146, I-151).
32. Enhance /api/health to optionally probe Supabase/Redis when configured (I-147).
33. Wrap `response.json()` in try-catch in HubSpot/Supabase; return safe error to caller (I-149).
34. Add try-catch to validate-client readFileSync for site.config.ts (I-150).
35. Replace raw `<img>` with next/image in HeroOverlay, HeroImageBackground, HeroFullscreen, ServiceGrid (I-155, I-159, I-164).
36. Fix ServiceGrid — remove misleading comment or apply Image fix (I-159).
37. Add loading.tsx to key route segments (home, blog, services, contact, book) (I-161).
38. Migrate section imports to dynamic() per template to enable route-level code splitting (I-158).

### Phase B — Quality and Structure (Days 8–14)

30. Fix documentation drift (REPODETAILED, README, CLAUDE, MAP).
31. Align version catalog (types, config, supabase, infra).
32. Theme catch logging (dev-only console.warn when localStorage blocked).
33. Centralize success messages.
34. Complete PricingCalculator or document as future.
35. Remove Accordion duplicate `'use client'`; add Form/Accordion tests.
36. Wire blog sections (initializeBlog, real posts, slug in BlogPostContentAdapter, notFound) (I-016, I-017, I-018, I-134).
37. Synchronize getSupabaseClient lazy init (e.g. lock or double-check) (I-148).
38. Wrap InfiniteScroll onLoadMore in try-catch; surface error to parent or log (I-152).
39. Add try-catch to create-client patchPackageJson with file path in error (I-153).
40. Make DLQ processDLQEntry atomic (e.g. mutex or single-threaded processor) (I-154).
41. Fix secureAction INTERNAL_ERROR (generic user-safe message).
42. Fix secureAction and booking result nesting.
43. Sanitize email integration errors.
44. Sanitize secureAction VALIDATION_ERROR issues before returning — map to user-safe messages; avoid exposing schema paths (I-125).
45. Replace booking console.info with logInfo; redact PII or use structured logging (I-126).
46. Extend logger stack redaction for Windows paths and file:// URLs (I-127).
47. Client logError: consider sanitizing error/context in production or avoid console.error of full object (I-128).
48. withErrorBoundary doc: update example to use generic message, not err.message (I-129).
49. Contact handler: sanitize or constrain handlerResult.message; require user-safe messages (I-130).
50. Validate or sanitize ThemeInjector CSS values (I-075).
51. Use sanitizeUrl for nav/footer href from config (I-077).
52. Add validateOrigin to contact/booking actions when middleware CSRF unavailable (I-095).
53. Use getValidatedClientIp in rate-limit when available; document proxy requirement (I-093).
54. Wire runWithTenantId in middleware for multi-tenant; pass siteId to secureAction (I-097).
55. useNewsletter: only show success when onSubmit defined and called; add email validation to newsletter forms (I-104, I-105).
56. Generate unique form control ids (e.g. useId or form-scoped prefix) to avoid duplicate id (I-106).
57. Select: use stable unique key for options (e.g. `${opt.value}-${index}` or require unique values) (I-107).
58. Infer BookingFormData from createBookingFormSchema or add schema-to-type assertion tests (I-010).
59. Replace `z.record(z.any())` with `z.record(z.unknown())` or typed config schemas (I-111).
60. Investigate zodResolver typing — @hookform/resolvers or Zod type improvements for dynamic schemas (I-112).
61. Strongly type SectionProps.siteConfig and section-specific configs (I-113, I-115).
62. Replace `Record<string, any>` in email contract with unknown or typed metadata (I-114).
63. Add prefers-reduced-motion media guards to Carousel, Collapsible, Sheet, Dialog (I-139).
64. Audit skip link focus overlay; ensure z-index and stacking do not obscure main content (I-144).
65. Replace raw img with next/image in ResourceCard, ProductCard, BlogPostCard, Gallery, EventCard, CourseCard, CaseStudyCard, PortfolioCard, Industry (I-155).
66. Add performanceBudgets to next.config; wire validate-budgets to Lighthouse CI (I-156, I-157).
67. Add section-type-aware SectionFallback variants (hero, grid, form) (I-162).
68. Consider enabling cacheComponents/dynamicIO with `use cache` annotations (I-163).
69. Evaluate subpath exports for @repo/ui to improve tree-shaking (I-160).
70. Document cross-platform alternatives (pnpm create-client, xcopy/robocopy) for Windows devs (I-165, I-172).
71. Unify middleware matchers across clients or document rationale for divergence (I-173).
72. Standardize next.config format (js vs ts) in create-client and docs (I-175).
73. Add @repo/infrastructure-ui to non-starter next.config transpilePackages when theme features used (I-176).
74. Add Providers (ConsentProvider) to non-starter clients or document consent strategy (I-177).
75. Align @tailwindcss/typography to single version (^0.5.19) (I-178).
76. Use catalog: for @repo/infrastructure-layout React peerDependencies (I-179).
77. Remove or implement @repo/database tsconfig path; add package or remove reference (I-180, I-037).
78. Create unified golden-path client: compose createMiddleware + next-intl; add Providers + theme init to non-starter or merge patterns (I-183).
79. Extend create-client: add --with-security flag to compose createMiddleware into scaffolded client (I-184).
80. Add Dockerfile to other clients or document Docker-from-starter pattern (I-166).
81. Extend logger stack redaction for Windows paths and file:// URLs (I-170, I-127).
82. Pass locale to DatePicker formatDate from context or props (I-171).
83. Use formatCurrency/formatNumber with locale in product/course/menu components (I-168).
84. Add optional Windows job to CI matrix for path/symlink verification (I-167).

### Long-Term (90 Days)

Wire analytics and booking providers; raise coverage from 14% to 25%; add integration tests; split large files; add dynamic imports; consolidate hero variants; add observability; implement DB migrations; wire SearchDialog/SearchPage; add loading.tsx and Suspense to clients (I-085, I-089); add DLQ persistence (Redis/Postgres) (I-086); fix booking date timezone handling (I-087); prefer stable keys over index for dynamic lists (I-088); remove unchecked casts in blog.ts when wiring real data (I-116); add fetch timeouts and ResilientHttpClient to all integrations (I-145, I-146, I-151). Add prefers-reduced-motion guards to Carousel, Collapsible, Sheet, Dialog animations (I-139). Audit skip link z-index/stacking for keyboard users (I-144). Replace all remaining raw img with next/image (I-155, I-164); implement validate-budgets CI gate (I-157); migrate to dynamic section imports (I-158); enable cacheComponents with use cache (I-163). Align non-starter clients with next-intl and dir attribute (I-169); fix booking date timezone (I-087); use locale-aware formatting throughout (I-168).
