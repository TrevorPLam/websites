# OBSERVABILITY.md

Last Updated: 2026-01-20

Applies to repos that run services (API, worker, cron, etc.). For libraries/CLI, keep logging conventions only.

## Logging (required)
- Structured logs (JSON) for services.
- Include a correlation/request id on every request.
- Never log secrets or full PII.

## Metrics (recommended)
- Request count, latency, error rate
- Queue depth (workers)
- CPU/memory (if containerized)

## Tracing (optional)
- Add distributed tracing when there are multiple services or external dependencies.

## Error handling
- Fail fast on configuration errors.
- Use consistent error codes/messages.
- Add alerting later; start with good logs now.

## Analytics (GA4)

GA4 is the selected analytics provider (see T-064). Tracking is enabled when `NEXT_PUBLIC_ANALYTICS_ID`
is set in the environment and the GA4 script is injected in `app/layout.tsx`.

**Tracked conversions/events:**
- `contact_submit` (conversion) — emitted by `trackFormSubmission('contact', true)` on successful contact form submission.
- `contact_submit` (error) — emitted by `trackFormSubmission('contact', false)` when the submit fails.

**Implementation notes:**
- Conversion tracking is wired in `components/ContactForm.tsx` via `lib/analytics.ts`.
- GA4 network calls require CSP allowlisting for `googletagmanager.com` + `google-analytics.com` in `middleware.ts`.

## Performance baselines (Lighthouse)

Run mobile Lighthouse audits locally against the running site:

```bash
npm run audit:lighthouse
```

This writes JSON reports under `reports/lighthouse/` (ignored by git) and a `mobile-summary.json` file you can copy into the baselines table below.

### Mobile baseline metrics (core pages)

| Page | Performance | Accessibility | Best Practices | SEO | LCP (ms) | FCP (ms) | CLS | TBT (ms) | Speed Index (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home (`/`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |
| Services (`/services`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |
| Pricing (`/pricing`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |
| Contact (`/contact`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |

**Note:** Lighthouse CLI is required to capture baselines. If it is unavailable in the environment, run `npm run audit:lighthouse` locally and replace the **UNKNOWN** values above. In this environment, npm registry access currently returns 403 (see `scripts/npm-registry-check.mjs`), so Lighthouse cannot be installed here.

### Regression budgets

Budgets are configured in `.github/lighthouse/budget.json` and treated as **regression guards**, not hard, arbitrary goals. Update budgets only after capturing a new baseline and agreeing to the trade-offs.

## Sentry instrumentation

- Contact form submissions emit a dedicated performance span (`contact_form.submit`) to track client-side latency.
- Use Sentry traces for user-facing actions; avoid attaching PII to span attributes.
