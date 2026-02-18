# Page Templates (3.1–3.8) — Normalized Specs

**Optional Mode:** Template → enforce registry-based composition; no switch statements.
**Package:** `packages/page-templates`
**Current State:** Has package.json only; no `src/`

---

## 3.1 Page-Templates Registry and Package Scaffold

### 1️⃣ Objective Clarification
- Problem: No composable page assembly; templates hand-wired
- Layer: L3 (Experience)
- Introduces: Registry (Map), barrel, template types, templates/ directory
- No switch-based section selection; config-driven keys → registry lookup

### 2️⃣ Dependency Check
- **Completed:** None
- **Packages:** @repo/types (in package.json); add @repo/ui, @repo/features, @repo/marketing-components when building templates
- **Blockers:** None

### 3️⃣ File System Plan
- **Create:**
  - `packages/page-templates/src/registry.ts` — Map<string, React.ComponentType<SectionProps>>
  - `packages/page-templates/src/types.ts` — SectionProps, TemplateConfig
  - `packages/page-templates/src/index.ts` — barrel
  - `packages/page-templates/src/templates/` — directory (empty until 3.2)
- **Update:** None
- **Delete:** None

### 4️⃣ Public API Design
```ts
export const sectionRegistry: Map<string, React.ComponentType<SectionProps>>;
export interface SectionProps {
  sectionKey: string;
  config: Record<string, unknown>;
  siteConfig: SiteConfig;
}
export interface TemplateConfig {
  sections: string[];  // ordered section keys
}
export function composePage(config: TemplateConfig, siteConfig: SiteConfig): JSX.Element;
```

### 5️⃣ Data Contracts & Schemas
- SectionProps: generic; each section defines its own config shape
- TemplateConfig: sections array; validated by siteConfigSchema (in @repo/types)
- No new Zod in page-templates; reuse siteConfigSchema

### 6️⃣ Internal Architecture
- Registry: `sectionRegistry.set('hero', HeroSection);` etc.
- composePage: map over sections, lookup in registry, render with section config
- No switch(sectionKey); purely registry-driven

### 7️⃣ Performance & SEO
- Sections render in order; lazy below-fold sections optional in future

### 8️⃣ Accessibility
- Each section responsible for its own a11y
- Main landmark; skip links optional

### 9️⃣ Analytics
- Section visibility optional; not in scaffold

### 🔟 Testing
- `packages/page-templates/src/__tests__/registry.test.ts` — composePage renders placeholder sections
- `packages/page-templates/src/__tests__/compose.test.tsx` — mock registry, assert order

### 1️⃣1️⃣ Example
```ts
const config: TemplateConfig = { sections: ['hero', 'services', 'cta'] };
composePage(config, siteConfig);
```

### 1️⃣2️⃣ Failure Modes
- Missing section key → warn and skip; no crash
- Circular dependency: registry must not import templates that import registry; use lazy registration if needed

### 1️⃣3️⃣ Checklist
1. Create src/registry.ts with Map and SectionProps
2. Create src/types.ts
3. Create composePage
4. Create src/templates/ dir
5. Create src/index.ts
6. Add deps to package.json as needed
7. Type-check; build

### 1️⃣4️⃣ Done Criteria
- Registry exists; composePage works with stub sections; 3.2 can add HomePageTemplate

### 1️⃣5️⃣ Anti-Overengineering
- No CMS section definitions; config from siteConfig only
- No visual builder; registry is code-only

---

## 3.2 HomePageTemplate

### 1️⃣ Objective Clarification
- Home page: hero, services, CTA, etc.; assembled from registry
- Layer: L3; uses 2.1 Hero, 2.2 Services, 2.8 CTA, etc.
- Config-driven section keys from siteConfig.pages.home.sections

### 2️⃣ Dependency Check
- **Completed:** 3.1, 2.1
- **Packages:** @repo/marketing-components, @repo/features, @repo/ui

### 3️⃣ File System Plan
- **Create:** `packages/page-templates/src/templates/HomePageTemplate.tsx`
- **Update:** registry.ts — register sections used by home
- **Delete:** None

### 4️⃣ Public API
```ts
export function HomePageTemplate(props: { siteConfig: SiteConfig }): JSX.Element;
```
- Reads siteConfig.pages?.home?.sections ?? defaultSections
- Renders composePage({ sections }, siteConfig)

### 5️⃣ Data Contracts
- siteConfig.pages.home.sections: string[] (optional)
- Section configs come from siteConfig.sections?[key] or similar

### 6️⃣ Internal
- Default sections: ['hero','services','testimonials','cta']
- Each section pulled from registry
- Register hero, services, testimonials, cta in 3.1 or 3.2

### 1️⃣3️⃣ Checklist
1. Register hero, services, cta sections (create minimal section components if needed)
2. Create HomePageTemplate.tsx
3. Use composePage
4. Export; type-check; build

### 1️⃣5️⃣ Anti-Overengineering
- No hardcoded industry content; all from config

---

## 3.3 ServicesPageTemplate

### 1️⃣ Objective Clarification
- Services grid/list/tabs; URL-synced filters; uses ServicesOverview, ServiceDetailLayout from features
- Layer: L3; 2.2 ServiceShowcase

### 2️⃣ Dependency Check
- **Completed:** 3.1, 2.2
- **Packages:** @repo/features (services), @repo/marketing-components

### 3️⃣ File System Plan
- **Create:** `packages/page-templates/src/templates/ServicesPageTemplate.tsx`
- **Update:** registry (services section)
- **Delete:** None

### 4️⃣ Public API
```ts
export function ServicesPageTemplate(props: { siteConfig: SiteConfig }): JSX.Element;
```
- Layout driven by config; filters from URL searchParams

### 1️⃣3️⃣ Checklist
- Wire ServicesOverview; URL filter sync; register section; export

---

## 3.4 AboutPageTemplate

### 1️⃣ Objective Clarification
- Story, Team, Mission, Values, Timeline; trust modules (certs, awards, press)
- Layer: L3; 2.3 Team, 2.17 Team feature

### 2️⃣ Dependency Check
- **Completed:** 3.1, 2.3, 2.17
- **Packages:** @repo/marketing-components, @repo/features

### 3️⃣ File System Plan
- **Create:** `packages/page-templates/src/templates/AboutPageTemplate.tsx`
- **Update:** registry
- **Delete:** None

### 1️⃣5️⃣ Anti-Overengineering
- No CMS for story/timeline; config-driven content

---

## 3.5 ContactPageTemplate

### 1️⃣ Objective Clarification
- Form + business info + optional map
- Layer: L3; 2.10 Contact form variants, @repo/features/contact
- Uses contact form variants; submission via feature actions

### 2️⃣ Dependency Check
- **Completed:** 3.1, 2.10, 2.13 (contact feature)

### 3️⃣ File System Plan
- **Create:** `packages/page-templates/src/templates/ContactPageTemplate.tsx`
- **Update:** registry

### 4️⃣ Public API
```ts
export function ContactPageTemplate(props: { siteConfig: SiteConfig }): JSX.Element;
```
- Renders SimpleContactForm or variant; business info from siteConfig; map optional (4.5 later)

---

## 3.6 BlogIndexTemplate

### 1️⃣ Objective Clarification
- Blog listing; filters, categories, tags; SEO-friendly pagination
- Layer: L3; 2.14 (blog feature)
- Uses @repo/features/blog

### 2️⃣ Dependency Check
- **Completed:** 3.1, 2.14

### 3️⃣ File System Plan
- **Create:** `packages/page-templates/src/templates/BlogIndexTemplate.tsx`
- **Update:** registry

### 1️⃣3️⃣ Checklist
- Wire blog feature listing; pagination; filters from URL

---

## 3.7 BlogPostTemplate

### 1️⃣ Objective Clarification
- Individual post layout; metadata, related posts, inline CTA slots; structured data hooks
- Layer: L3; 2.14

### 2️⃣ Dependency Check
- **Completed:** 3.1, 2.14
- **Packages:** next-mdx-remote for MDX; blog feature

### 3️⃣ File System Plan
- **Create:** `packages/page-templates/src/templates/BlogPostTemplate.tsx`
- **Update:** registry

### 5️⃣ Data Contracts
- Post shape from blog feature; structured data via 4.6 or feature
- No new schema; use existing blog types

---

## 3.8 BookingPageTemplate

### 1️⃣ Objective Clarification
- Booking form with pre-fill context
- Layer: L3; 2.12 (booking feature), @repo/features/booking
- Uses BookingForm from features; pre-fill from URL/context

### 2️⃣ Dependency Check
- **Completed:** 3.1, 2.12
- **Packages:** @repo/features (booking)

### 3️⃣ File System Plan
- **Create:** `packages/page-templates/src/templates/BookingPageTemplate.tsx`
- **Update:** registry

### 4️⃣ Public API
```ts
export function BookingPageTemplate(props: { siteConfig: SiteConfig; prefill?: Partial<BookingFormData> }): JSX.Element;
```

### 1️⃣5️⃣ Anti-Overengineering
- No provider selection in template; feature handles that
- Pre-fill only; no session/state beyond URL
