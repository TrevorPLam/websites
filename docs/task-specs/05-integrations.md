# Integrations (4.1–4.6) — Normalized Specs

**Optional Mode:** Client → enforce zero business logic rule; adapter contract + retry/timeout.
**Package:** `packages/integrations/` (existing: hubspot, analytics, supabase)

---

## 4.1 Email Marketing Integrations

### 1️⃣ Objective Clarification

- Problem: No email list subscription; Mailchimp, SendGrid, ConvertKit
- Layer: L0 (infra/integrations)
- Introduces: Provider adapter contracts, runtime clients, no UI

### 2️⃣ Dependency Check

- **Completed:** None
- **Packages:** Add packages/integrations/mailchimp, sendgrid, convertkit (or single email package)
- **Blockers:** None

### 3️⃣ File System Plan

- **Create:**
  - `packages/integrations/email/contract.ts` — adapter interface
  - `packages/integrations/email/mailchimp.ts`
  - `packages/integrations/email/sendgrid.ts`
  - `packages/integrations/email/convertkit.ts`
  - `packages/integrations/email/index.ts`
- **Update:** packages/integrations structure (or new subpackage)
- **Delete:** None

### 4️⃣ Public API Design

```ts
export interface EmailAdapter {
  subscribe(
    email: string,
    options?: { listId?: string; tags?: string[] }
  ): Promise<{ ok: boolean; id?: string }>;
  health(): Promise<boolean>;
  // 2026: OAuth 2.1 with PKCE support
  authenticate?(): Promise<OAuthToken>;
}
export function createMailchimpAdapter(config: MailchimpConfig): EmailAdapter;
export function createSendGridAdapter(config: SendGridConfig): EmailAdapter;
export function createConvertKitAdapter(config: ConvertKitConfig): EmailAdapter;
```

- All adapters implement EmailAdapter; retry(3) + timeout(10s)
- **2026 Updates**: OAuth 2.1 (draft-ietf-oauth-v2-1-14, Oct 2025; PKCE required) with PKCE for enhanced security; GDPR/CCPA consent tracking

### 5️⃣ Data Contracts & Schemas

```ts
const emailAdapterConfigSchema = z.discriminatedUnion('provider', [
  z.object({ provider: z.literal('mailchimp'), apiKey: z.string(), listId: z.string() }),
  z.object({ provider: z.literal('sendgrid'), apiKey: z.string(), listId: z.string().optional() }),
  z.object({
    provider: z.literal('convertkit'),
    apiKey: z.string(),
    formId: z.string().optional(),
  }),
]);
```

### 6️⃣ Internal Architecture

- 4.1a: Contract first — EmailAdapter interface; wrap with retry(3) + timeout(10s)
- 4.1b–d: Each provider implements; no business logic (validation only)
- Clients: thin wrappers; no orchestration
- **2026 Updates**: Circuit breaker pattern for API failures; dynamic rate limiting

### 7️⃣ Performance

- Subscribe is async; no LCP impact
- Rate limit per provider (configurable)
- **2026 Updates**: Edge computing execution; CDN-based integration processing; bundle splitting for integration features

### 8️⃣ Accessibility

- N/A (no UI)

### 9️⃣ Analytics

- Log subscribe success/failure; no PII in events

### 🔟 Testing

- `packages/integrations/email/__tests__/contract.test.ts` — mock adapter satisfies interface
- Per-provider: unit with mocked fetch; no live API in CI
- **2026 Updates**: Mock Service Worker (MSW) for API mocking; Vitest over Jest for performance; contract testing across environments

### 1️⃣1️⃣ Example

```ts
const adapter = createMailchimpAdapter({ apiKey: '...', listId: '...' });
await adapter.subscribe('user@example.com');
```

### 1️⃣2️⃣ Failure Modes

- API down → retry; timeout → throw
- Invalid key → throw with clear message

### 1️⃣3️⃣ Checklist

1. 4.1a: Define EmailAdapter + retry/timeout wrapper
2. 4.1b: Mailchimp
3. 4.1c: SendGrid
4. 4.1d: ConvertKit
5. Export; type-check; tests

### 1️⃣5️⃣ Anti-Overengineering

- No double opt-in logic; caller handles
- No analytics event emission; logging only
- Stop at 3 providers

---

## 4.2 Scheduling Integrations

### 1️⃣ Objective Clarification

- Calendly, Acuity, Cal.com; abstract scheduling interface; consent-based lazy loading
- Layer: L0
- Introduces: SchedulingAdapter interface; embed components with lazy load

### 2️⃣ Dependency Check

- **Completed:** None
- **Blockers:** None

### 3️⃣ File System Plan

- **Create:** packages/integrations/scheduling/contract.ts, calendly.ts, acuity.ts, calcom.ts
- **Update:** integrations index

### 4️⃣ Public API

```ts
export interface SchedulingAdapter {
  getEmbedUrl(params: { type?: string }): string;
  renderEmbed(container: HTMLElement, options: EmbedOptions): () => void;
  // 2026: TCF v2.3 compliance methods
  checkConsent(): Promise<boolean>;
  loadWhenConsented(): Promise<void>;
}
export function createCalendlyAdapter(config: CalendlyConfig): SchedulingAdapter;
// + Acuity, Cal.com
```

- Lazy load: don't load embed script until consent (analytics consent); expose `loadWhenConsented()`
- **2026 Updates**: TCF v2.3 integration (mandatory Feb 28, 2026); Intersection Observer for performance

### 5️⃣ Data Contracts

- Config per provider; no Zod in integration (env/siteConfig validates)

### 6️⃣ Internal

- 4.2a: Interface + consent gate
- Embed: iframe or script injection; consent check before load

### 1️⃣5️⃣ Anti-Overengineering

- No calendar sync; no availability fetching; embed-only

---

## 4.3 Chat Support Integrations

### 1️⃣ Objective Clarification

- Intercom, Crisp, Tidio; lazy loading; consent-gated; provider-neutral API
- Layer: L0

### 3️⃣ File System Plan

- **Create:** packages/integrations/chat/contract.ts, intercom.ts, crisp.ts, tidio.ts

### 4️⃣ Public API

```ts
export interface ChatAdapter {
  load(config: ChatConfig): void;
  unload(): void;
  // 2026: WCAG 2.2 compliance methods
  setFocusManagement(enabled: boolean): void;
  announceMessage(message: string): void; // ARIA live regions
}
// load() checks consent before injecting script
```

- **2026 Updates**: WCAG 2.2 compliance (24×24px targets, focus management); ARIA live regions for screen readers

### 1️⃣3️⃣ Checklist

- Contract → 3 adapters → export; consent gate in load()

---

## 4.4 Review Platform Integrations

### 1️⃣ Objective Clarification

- Google Reviews, Yelp, Trustpilot; normalized schema; source/moderation flags
- Layer: L0; feeds into 2.16 testimonials adapters
- Output: Testimonial[] shape

### 3️⃣ File System Plan

- **Create:** packages/integrations/reviews/contract.ts, google.ts, yelp.ts, trustpilot.ts

### 5️⃣ Data Contracts

```ts
interface NormalizedReview {
  id: string;
  quote: string;
  author: string;
  rating?: number;
  source: 'google' | 'yelp' | 'trustpilot';
  moderated: boolean;
  date?: string;
  // 2026: Sentiment analysis support
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
}
```

### 1️⃣5️⃣ Anti-Overengineering

- No review response; read-only
- Moderation = flag; no moderation UI

---

## 4.5 Maps Integration

### 1️⃣ Objective Clarification

- Google Maps embed; progressive enhancement; static map preview for LCP
- Layer: L0

### 3️⃣ File System Plan

- **Create:** packages/integrations/maps/google-maps.ts

### 4️⃣ Public API

```ts
export function StaticMapPreview(props: { address: string; apiKey: string }): JSX.Element;
export function InteractiveMap(props: { address: string; apiKey: string }): JSX.Element;
// 2026: Performance optimization methods
export function LazyMap(props: MapProps): JSX.Element; // Intersection Observer
export function OptimizedMapTile(props: TileProps): JSX.Element; // WebP support
```

- StaticMapPreview: img with static maps API (fast LCP)
- InteractiveMap: lazy load full embed below fold
- **2026 Updates**: WebP map tiles; Intersection Observer for lazy loading; Network Information API integration

### 7️⃣ Performance

- LCP: use StaticMapPreview above fold; defer InteractiveMap

---

## 4.6 Industry Schemas Package

### 1️⃣ Objective Clarification

- JSON-LD structured data for SEO; typed; per-industry; snapshot-tested
- Layer: L0 / shared
- Introduces: Schema generators, types

### 2️⃣ Dependency Check

- **Completed:** None
- **Packages:** New package or packages/types/schemas/

### 3️⃣ File System Plan

- **Create:**
  - packages/types/src/schemas/ or packages/integrations/schemas/
  - base.ts (LocalBusiness, Organization)
  - industry/salon.ts, restaurant.ts, etc.
  - **tests**/snapshots/
- **Update:** types or integrations index

### 4️⃣ Public API

```ts
export function generateLocalBusinessSchema(config: SiteConfig): JsonLd;
export function generateSalonSchema(config: SiteConfig): JsonLd;
// 2026: AI search preparation
export function generateAISearchSchema(config: SiteConfig): JsonLd;
export function generateBreadcrumbSchema(pages: Page[]): JsonLd;
// per industry
```

### 5️⃣ Data Contracts

- JsonLd = Record<string, unknown>; validate structure in tests
- Industry-specific extensions; base + overlay
- **2026 Updates**: Focus on evergreen schema types (Product, Organization, Article, Review, Breadcrumb); AI search entity understanding

### 6️⃣ Internal

- 4.6a: Base + types
- 4.6b: Per-industry implementations
- 4.6c: Snapshot tests

### 1️⃣5️⃣ Anti-Overengineering

- No runtime validation of JSON-LD; structure guaranteed by types
- Limit to 12 industries (per types/industry-configs)
