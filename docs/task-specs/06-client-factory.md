# Client Factory (5.1–5.6) — Normalized Specs

**Package:** `clients/`
**Current State:** README only
**Hard Constraint:** No business logic in client; everything from packages

---

## 5.1 Create Starter-Template

### 1️⃣ Objective Clarification
- Problem: No golden-path client; thin Next.js shell using page-templates
- Layer: L3 (clients)
- Introduces: Next.js app, routes, site.config.ts, ThemeInjector, providers
- site.config.ts is the ONLY file a client changes

### 2️⃣ Dependency Check
- **Completed:** 3.1, 3.2, 3.3, 3.5, 3.8 (minimum page set)
- **Packages:** @repo/page-templates, @repo/features, @repo/ui, @repo/marketing-components
- **Blockers:** 3.2, 3.3, 3.5, 3.8 must exist

### 3️⃣ File System Plan
- **Create:**
  - clients/starter-template/package.json
  - clients/starter-template/next.config.js
  - clients/starter-template/tailwind.config.js
  - clients/starter-template/middleware.ts
  - clients/starter-template/app/layout.tsx
  - clients/starter-template/app/page.tsx (HomePageTemplate)
  - clients/starter-template/app/about/page.tsx
  - clients/starter-template/app/services/page.tsx
  - clients/starter-template/app/contact/page.tsx
  - clients/starter-template/app/blog/page.tsx
  - clients/starter-template/app/book/page.tsx
  - clients/starter-template/app/api/health/route.ts
  - clients/starter-template/site.config.ts
  - clients/starter-template/README.md
- **Update:** None
- **Delete:** None

### 4️⃣ Public API Design
- No exports; client app. site.config.ts validated with siteConfigSchema at build (in next.config or validate script).

### 5️⃣ Data Contracts & Schemas
- site.config.ts must satisfy siteConfigSchema (from @repo/types)
- Validate at build: `import { siteConfig } from './site.config';` + runtime validation or build-time assertion

### 6️⃣ Internal Architecture
- **5.1a:** layout.tsx: ThemeInjector, providers (analytics consent, etc.); no custom logic
- **5.1b:** Each route imports page template from @repo/page-templates; passes siteConfig
- **5.1c:** site.config.ts + README with setup, deploy, customization
- No server actions in client; use @repo/features actions
- app/api/: health (200 OK), optional OG image

### 7️⃣ Performance & SEO
- ThemeInjector in layout; page templates handle LCP
- Metadata from siteConfig

### 8️⃣ Accessibility
- Inherited from page templates; layout has lang, etc.

### 9️⃣ Analytics
- Consent gate in providers; feature-level events

### 🔟 Testing
- Build smoke: `pnpm build` in starter-template
- `scripts/validate-client.js` (6.10a) validates config + routes

### 1️⃣1️⃣ Example
```ts
// app/page.tsx
import { HomePageTemplate } from '@repo/page-templates';
import { siteConfig } from '@/site.config';
export default function Home() {
  return <HomePageTemplate siteConfig={siteConfig} />;
}
```

### 1️⃣2️⃣ Failure Modes
- Missing page template → build fails
- Invalid siteConfig → validate-client fails
- Rollback: delete clients/starter-template; no upstream impact

### 1️⃣3️⃣ Checklist
1. 5.1a: Create layout, ThemeInjector, providers
2. 5.1b: Create routes (home, about, services, contact, blog, book)
3. 5.1c: site.config.ts + README
4. Add api/health, api/og if needed
5. Run validate-client (when 6.10a exists)
6. Build; deploy smoke

### 1️⃣4️⃣ Done Criteria
- Builds; all routes render; siteConfig-only customization; no business logic in client

### 1️⃣5️⃣ Anti-Overengineering
- No CMS wiring; no custom API routes beyond health/OG
- No industry-specific code; config drives all
- 5.2, 5.3 copy this; no fork logic

---

## 5.2 Luxe-Salon Example Client

### 1️⃣ Objective Clarification
- Example: salon industry; validates config-driven assembly
- Layer: L3
- Copy starter-template → clients/luxe-salon/; edit site.config.ts only

### 2️⃣ Dependency Check
- **Completed:** 5.1

### 3️⃣ File System Plan
- **Create:** clients/luxe-salon/ (copy of starter-template)
- **Update:** site.config.ts: industry `salon`, booking true, team layout `grid`
- **Delete:** None

### 5️⃣ Data Contracts
- siteConfigSchema; industry: 'salon'; conversionFlow: booking

### 1️⃣3️⃣ Checklist
1. Copy starter-template → luxe-salon
2. Edit site.config.ts: industry, booking, team
3. Run validate-client
4. Build; manual smoke

### 1️⃣5️⃣ Anti-Overengineering
- No custom components; config only

---

## 5.3 Bistro-Central Example Client

### 1️⃣ Objective Clarification
- Example: restaurant industry; booking true
- Same pattern as 5.2

### 3️⃣ File System Plan
- **Create:** clients/bistro-central/
- **Update:** site.config.ts: industry `restaurant`

---

## 5.4 Law Firm (Chen-Law)

### 1️⃣ Objective Clarification
- Practice Areas, Attorneys, Case Results; legal disclaimers
- Industry: legal
- Uses: 2.3 Team, 2.2 Services (as Practice Areas); disclaimer component/section

### 3️⃣ File System Plan
- **Create:** clients/chen-law/
- **Update:** site.config.ts; add disclaimer section config

### 1️⃣5️⃣ Anti-Overengineering
- Disclaimer = config string; no legal logic
- Case results = config-driven list or simple CMS

---

## 5.5 Medical (Sunrise-Dental)

### 1️⃣ Objective Clarification
- Services, Doctors, Insurance, Booking
- Industry: medical
- Uses: 2.5 Pricing (insurance tiers?), 2.3 Team (doctors), booking

### 1️⃣5️⃣ Anti-Overengineering
- No HIPAA logic in client; forms submit to feature
- Insurance = display only; no verification

---

## 5.6 Retail (Urban-Outfitters)

### 1️⃣ Objective Clarification
- Products, Locations, Lookbook
- Industry: retail
- Uses: 2.6 Gallery (lookbook), 2.3 or custom for locations; product grid (if 2.x has it, else config list)
- May need minimal product card; defer to config-driven list

### 1️⃣5️⃣ Anti-Overengineering
- No cart/checkout; links to external shop or CTA
- Products = config array; no inventory
