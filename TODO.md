# TODO — Monetization Module (Gift Cards, Loyalty, Memberships)

Goal: Add a config-driven “Monetization” module to the template so every new salon site can launch
Gift Cards, Loyalty/Rewards, and Paid Memberships via platform link-out + attribution (no POS replacement).

---

## P0 — Ship the default (link-out + tracking)

- [ ] Create module folder structure
  - Add: `src/monetization/`
  - Include: `README.md`, `contracts.ts`, `platformRegistry.ts`, `adapters/*`, `attribution.ts`
  - Acceptance: module compiles; exports a single entrypoint (e.g., `getMonetizationLinks()`)

- [ ] Define config shape (per salon)
  - Add: `salon.config.example.json` (and document required fields)
  - Fields (minimum):
    - `platform`: `"square" | "vagaro" | "boulevard" | "other"`
    - `links.giftCards.purchaseUrl`
    - `links.membership.purchaseUrl`
    - `utm.defaults` (source/medium/campaign)
  - Acceptance: app can run with example config; missing fields fail fast with clear error

- [ ] Implement platform adapters (link generation only)
  - Add: `src/monetization/adapters/square.ts`
  - Add: `src/monetization/adapters/vagaro.ts`
  - Add: `src/monetization/adapters/boulevard.ts`
  - Add: `src/monetization/adapters/genericLinkOut.ts`
  - Acceptance: calling adapter returns the correct set of URLs for Gift Cards / Membership
  - Note: Loyalty is typically “tracked at checkout” → page CTA can be “Join rewards” / “Book now” / “Learn more”
    based on what the platform supports; if no URL exists, return `null` and render an alternate CTA.

- [ ] Add attribution utilities (UTM builder + safe redirect URL builder)
  - Add: `src/monetization/attribution.ts`
  - Acceptance: given a base URL + UTM defaults + optional overrides → returns final URL
  - Acceptance: supports “direct link” and “redirect endpoint” modes

- [ ] Add optional redirect endpoint for clean attribution + click logging
  - Add: `src/app/api/redirect/route.ts` (or `pages/api/redirect.ts` depending on router)
  - Behavior:
    - Validate `to` (allowlist domains from config)
    - Log click event (basic: timestamp, page, destination, UTM payload)
    - 302 redirect to destination
  - Acceptance: redirect works; unsafe domains are blocked; logs appear (console or storage)

- [ ] Add landing pages (marketing pages + CTA wiring)
  - Add: `src/app/gift-cards/page.tsx`
  - Add: `src/app/rewards/page.tsx`
  - Add: `src/app/membership/page.tsx`
  - Each page includes:
    - Hero + benefits
    - FAQs
    - CTA button(s) that call `getMonetizationLinks(config)` and render:
      - Gift Cards: “Buy Gift Card”
      - Membership: “Join Membership”
      - Rewards: “Join Rewards” (or “Book Now” / “Ask in-store” if no link)
  - Acceptance: pages render with correct CTAs for all platforms + safe fallbacks

- [ ] Add navigation hooks
  - Add links in header/footer: Gift Cards / Rewards / Membership
  - Acceptance: nav visible and routes work

- [ ] Add basic docs + ops checklists inside repo
  - Add: `docs/monetization/OVERVIEW.md`
  - Add: `docs/monetization/INTAKE_CHECKLIST.md`
  - Add: `docs/monetization/QA_CHECKLIST.md`
  - Acceptance: checklists are usable for a real client launch

---

## P1 — Hardening (reduce support risk)

- [ ] Add domain allowlist enforcement for link-out + redirect
  - Add allowlist in config: `security.allowedDomains[]`
  - Acceptance: only domains on allowlist can be used for CTAs/redirects

- [ ] Add analytics event hooks
  - Fire an event on CTA click (e.g., `monetization_cta_click`)
  - Acceptance: event includes `program` (giftCards/rewards/membership), `platform`, `destination`

- [ ] Add tests for URL building + allowlist validation
  - Add: `src/monetization/__tests__/...`
  - Acceptance: tests cover UTM merge logic + domain validation + adapter outputs

- [ ] Add “UNKNOWN / NOT CONFIGURED” UI states
  - For missing purchase URLs, render:
    - “Call us to buy” / “Available in-salon” / “Book an appointment”
  - Acceptance: no broken buttons even when config is incomplete

- [ ] Add a simple admin note block (for internal use)
  - Show configured platform + link destinations in dev mode
  - Acceptance: easy to verify config quickly during setup

---

## P2 — Advanced (only when justified)

- [ ] Add “Square advanced path” placeholder (no implementation unless needed)
  - Document where a future API integration would live:
    - `src/monetization/advanced/square/*`
  - Acceptance: decision tree documented: when link-out is enough vs when API/headless is worth it

- [ ] Add compliance page stubs (content owned by you / attorney)
  - Add: `src/app/legal/gift-card-terms/page.tsx`
  - Add: `src/app/legal/membership-terms/page.tsx`
  - Acceptance: pages exist; placeholders clearly marked “review required”

---

## Definition of Done

- Gift Cards, Rewards, and Membership pages exist in the template.
- Per-salon config controls platform + checkout URLs with zero code edits per client.
- CTAs route to platform-hosted purchase flows with attribution.
- Redirect endpoint is optional but available, secured by allowlist.
- Clear docs + intake + QA checklists are included.