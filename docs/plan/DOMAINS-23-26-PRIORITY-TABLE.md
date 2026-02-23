# Priority Table for Domains 23–26

| Task                                                   | Domain | Priority | Timeline | Success Metric                                         |
| ------------------------------------------------------ | ------ | -------- | -------- | ------------------------------------------------------ |
| `buildMetadata()` factory for all page types           | 23     | **P0**   | Week 1   | `<title>` and `<meta name="description">` on all pages |
| `LocalBusiness` JSON-LD on homepage                    | 23     | **P0**   | Week 1   | Passes Google Rich Results Test                        |
| `Service` schema on each service page                  | 23     | **P0**   | Week 1   | Service pages show rich results in Search Console      |
| Per-tenant `sitemap.ts` (all service + area pages)     | 23     | **P0**   | Week 1   | Google indexes all pages within 48h of launch          |
| Per-tenant `robots.ts` (block API, portal, UTM URLs)   | 23     | **P0**   | Week 1   | `/api/*` returns `Disallow` in robots.txt              |
| Dynamic OG image route (`/og/[[...path]]`)             | 23     | **P1**   | Week 2   | Social shares show branded preview card                |
| `FAQPage` schema on services (People Also Ask)         | 23     | **P2**   | Week 3   | FAQs appear in PAA rich results                        |
| Enable Realtime publication for `leads` table          | 24     | **P0**   | Week 1   | New leads appear instantly in portal                   |
| RLS enforced on Realtime subscription                  | 24     | **P0**   | Week 1   | Tenant A cannot receive Tenant B's leads               |
| Reconnect on tab visibility change                     | 24     | **P0**   | Week 1   | WebSocket reconnects after tab sleep                   |
| Browser notification on new qualified lead             | 24     | **P1**   | Week 2   | Push notification fires for score ≥ 70 leads           |
| A/B middleware cookie assignment (deterministic)       | 25     | **P1**   | Week 2   | Same IP always gets same variant                       |
| Edge Config experiment definitions                     | 25     | **P1**   | Week 2   | Experiments updateable without redeploy                |
| Conversion tracking (Redis `hincrby`)                  | 25     | **P1**   | Week 2   | Lead submits increment variant counter                 |
| Admin UI for experiment results                        | 25     | **P2**   | Week 3   | Conversion rates visible per variant                   |
| Playwright config (multi-role auth projects)           | 26     | **P0**   | Week 1   | CI runs 4 parallel test workers                        |
| Auth setup file (save storage state once)              | 26     | **P0**   | Week 1   | Auth state reused, no login in each test               |
| Contact form → lead creation E2E test                  | 26     | **P0**   | Week 1   | Test asserts lead in DB within 5s                      |
| Axe accessibility scan in E2E (WCAG 2.2 AA)            | 26     | **P0**   | Week 2   | Zero critical violations on all public pages           |
| Multi-tenant isolation test (Tenant A ≠ Tenant B data) | 26     | **P0**   | Week 2   | Test confirms RLS prevents cross-tenant reads          |
| Billing page E2E (plan display + portal button)        | 26     | **P1**   | Week 2   | Correct plan highlighted, manage button present        |
| Keyboard navigation E2E on contact form                | 26     | **P1**   | Week 2   | All fields tab-focusable in correct order              |

---

## Cross-domain invariants for Domains 23–26:

- The `robots.ts` must block all non-public routes — `/api/*`, `/dashboard/*`, `/portal/*`. Any of these indexed by Google leaks internal URLs and wastes crawl budget. [buildwithmatija](https://www.buildwithmatija.com/blog/dynamic-sitemap-robots-nextjs-payload-multi-tenant)
- The JSON-LD `@id` values are canonical URIs (`${siteUrl}/#organization`, `${siteUrl}/#website`) — this links the two schemas together into a Knowledge Graph entity Google can deduplicate.
- Supabase Realtime filter (`tenant_id=eq.${tenantId}`) is applied **server-side** before broadcast, not client-side after receipt. A client-side filter would still receive all rows over the WebSocket — a data leak for multi-tenant systems. [supabase](https://supabase.com/docs/guides/realtime/postgres-changes)
- The A/B assignment cookie is `httpOnly: true` — the visitor cannot read or modify their bucket assignment from JavaScript, preventing self-selection bias in experiment results. [reddit](https://www.reddit.com/r/nextjs/comments/1alab0x/how_do_i_do_split_testing_ab_testing_given_these/)
- Playwright auth state is committed to `.gitignore` — never committed to source control. CI regenerates auth state fresh on every run using secrets from the CI environment. [linkedin](https://www.linkedin.com/pulse/playwright-reuse-login-test-multiple-users-easily-testleaf-dnddc)
- Every E2E test that reads from the database after an action uses `waitForResponse` on the relevant API route first — never a fixed `setTimeout`. Fixed sleeps are the primary source of flaky E2E tests.
