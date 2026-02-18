# 4.1 Email Marketing Integrations

**Status:** [ ] TODO | **Batch:** F | **Effort:** 6h | **Deps:** None

**Related Research:** §4.1 (Security, OAuth 2.1), §7.1 (Retry patterns)

**Objective:** EmailAdapter interface. Mailchimp, SendGrid, ConvertKit. Retry(3) + timeout(10s). OAuth 2.1 PKCE optional.

**Files:** `packages/integrations/email/contract.ts`, `mailchimp.ts`, `sendgrid.ts`, `convertkit.ts`, `index.ts`

**API:** `EmailAdapter { subscribe, health }`, `createMailchimpAdapter`, etc.

**Checklist:** 4.1a contract; 4.1b–d providers; export; tests.
**Done:** Adapters implement interface; subscribe works.
**Anti:** No double opt-in; stop at 3 providers.

---
