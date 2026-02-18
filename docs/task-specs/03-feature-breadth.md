# Feature Breadth (2.16–2.19) — Normalized Specs

**Optional Mode:** Feature → enforce adapter contract + normalized schema.
**Package:** `packages/features/src/<feature>/`
**Reference:** Existing structure in `packages/features/src/booking/`, `contact/`, `blog/`, `services/`, `search/`

---

## 2.16 Testimonials Feature

### 1️⃣ Objective Clarification
- Problem: No reusable testimonials feature; config/CMS/API sources need normalization
- Layer: L2 (@repo/features)
- Introduces: Types, runtime logic, source adapters, UI components
- Uses marketing components 2.4 (display variants)

### 2️⃣ Dependency Check
- **Completed:** 2.11 (feature skeleton), 2.4 (TestimonialCarousel, etc.)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components
- **Blockers:** 2.11, 2.4 must be done

### 3️⃣ File System Plan
- **Create:** `packages/features/src/testimonials/index.ts`, `lib/schema.ts`, `lib/adapters.ts`, `lib/testimonials-config.ts`, `components/TestimonialsSection.tsx`
- **Update:** `packages/features/src/index.ts`
- **Delete:** None

### 4️⃣ Public API Design
```ts
export { TestimonialsSection } from './components/TestimonialsSection';
export { testimonialsSchema, type Testimonial, type TestimonialsConfig } from './lib/schema';
export { createTestimonialsConfig } from './lib/testimonials-config';
export { normalizeGoogleReviews, normalizeYelp, normalizeFromConfig } from './lib/adapters';
```

### 5️⃣ Data Contracts & Schemas
```ts
// Zod schema
const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  rating: z.number().min(1).max(5).optional(),
  source: z.enum(['config','google','yelp']).optional(),
});
type Testimonial = z.infer<typeof testimonialSchema>;
```
- Adapter contract: `(raw: unknown) => Testimonial[]`; each adapter normalizes external payload

### 6️⃣ Internal Architecture
- `TestimonialsSection`: accepts `testimonials: Testimonial[]`, `layout: 'carousel'|'grid'|'marquee'`, renders marketing component
- Adapters: Google Reviews API → normalize to Testimonial[]; Yelp → same; config (static) → same
- No direct API calls in component; parent fetches and passes data
- SSR: fetch in server component or getServerSideProps; CSR: optional client fetch hook

### 7️⃣ Performance & SEO
- Lazy load carousel if below fold; reduced-motion → grid
- Schema.org Review markup optional (4.6 or feature-level)

### 8️⃣ Accessibility
- Quote semantics; author/role structure; carousel keyboard (from 2.4)

### 9️⃣ Analytics
- None by default; optional `onTestimonialView` if C.12 contract exists

### 🔟 Testing Strategy
- `packages/features/src/testimonials/__tests__/adapters.test.ts` — adapter output shape
- `packages/features/src/testimonials/__tests__/TestimonialsSection.test.tsx` — render with mock data

### 1️⃣1️⃣ Example Usage
```ts
import { TestimonialsSection, createTestimonialsConfig, normalizeFromConfig } from '@repo/features/testimonials';
const config = createTestimonialsConfig(siteConfig.testimonials);
const items = normalizeFromConfig(config);
<TestimonialsSection testimonials={items} layout="carousel" />
```

### 1️⃣2️⃣ Failure Modes
- Adapter throws on malformed API → wrap in try/catch, return []
- Blockers: 2.11, 2.4

### 1️⃣3️⃣ Checklist
1. Create testimonials/ folder structure
2. Add schema + types
3. Add adapters (config, Google, Yelp stubs)
4. Add TestimonialsSection component
5. Add createTestimonialsConfig
6. Export from features index
7. Type-check; build; tests

### 1️⃣4️⃣ Done Criteria
- Builds; adapters normalize; TestimonialsSection renders with marketing variants

### 1️⃣5️⃣ Anti-Overengineering
- No live API key handling in feature; pass fetched data from parent
- No moderation UI; assume pre-moderated
- Stop at 3 sources (config, Google, Yelp); more = separate task

---

## 2.17 Team Feature

### 1️⃣ Objective Clarification
- Member profiles with layouts; configurable
- Layer: L2; uses 2.3 TeamDisplay components
- Schema: reusable profile card

### 2️⃣ Dependency Check
- **Completed:** 2.11, 2.3

### 3️⃣ File System Plan
- **Create:** `packages/features/src/team/` (index, schema, config, TeamSection)
- **Update:** features index

### 4️⃣ Public API
```ts
export { TeamSection } from './components/TeamSection';
export { teamSchema, type TeamMember, type TeamConfig } from './lib/schema';
export { createTeamConfig } from './lib/team-config';
```

### 5️⃣ Data Contracts
```ts
const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.object({ src: z.string(), alt: z.string() }),
  bio: z.string().optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
});
```

### 6️⃣ Internal
- TeamSection: receives `members`, `layout`; renders TeamGrid/TeamCarousel/TeamDetailed from 2.3

### 1️⃣3️⃣ Checklist
- Schema → config → TeamSection → export; copy pattern from testimonials

### 1️⃣5️⃣ Anti-Overengineering
- No CMS sync; config or parent-provided data only

---

## 2.18 Gallery Feature

### 1️⃣ Objective Clarification
- Image optimization, lightbox; transform presets by use case
- Layer: L2; uses 2.6 Gallery components, Dialog for lightbox
- Data: image items with optional transform presets

### 2️⃣ Dependency Check
- **Completed:** 2.11, 2.6

### 3️⃣ File System Plan
- **Create:** `packages/features/src/gallery/` (index, schema, GallerySection, transform presets)
- **Update:** features index

### 4️⃣ Public API
```ts
export { GallerySection } from './components/GallerySection';
export { gallerySchema, type GalleryItem, type GalleryConfig } from './lib/schema';
export type { TransformPreset } from './lib/presets';
```

### 5️⃣ Data Contracts
- GalleryItem: src, alt, caption?; preset?: 'hero'|'thumbnail'|'lightbox'

### 6️⃣ Internal
- Use next/image with sizes; preset maps to sizes/quality
- Lightbox via Dialog (existing)

### 1️⃣5️⃣ Anti-Overengineering
- No DAM; no CDN logic; pass URLs from parent

---

## 2.19 Pricing Feature

### 1️⃣ Objective Clarification
- Data-driven pricing; currency/locale formatting centralized
- Layer: L2; uses 2.5 Pricing components
- Formatting: pass formatted strings from config/formatter; no Intl in component

### 2️⃣ Dependency Check
- **Completed:** 2.11, 2.5

### 3️⃣ File System Plan
- **Create:** `packages/features/src/pricing/` (index, schema, PricingSection, formatCurrency util)
- **Update:** features index

### 4️⃣ Public API
```ts
export { PricingSection } from './components/PricingSection';
export { pricingSchema, formatCurrency, type PricingTier, type PricingConfig } from './lib/schema';
```

### 5️⃣ Data Contracts
- PricingTier: name, price (string or number+currency), interval?, features[], cta
- formatCurrency(amount, currency, locale): string

### 1️⃣5️⃣ Anti-Overengineering
- No payment processing; display only
- Calculator: simple client-side math; no backend
