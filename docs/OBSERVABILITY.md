# OBSERVABILITY.md

Last Updated: 2026-01-20

Applies to repos that run services (API, worker, cron, etc.). For libraries/CLI, keep logging conventions only.

## Logging (required)
- Structured logs (JSON) for services.
- Include a correlation/request id on every request.
- Never log secrets or full PII.

### Log format
Production logs are emitted as JSON with these fields:

- `timestamp` — ISO8601 timestamp
- `level` — `info`, `warn`, or `error`
- `message` — human-readable log message
- `context` — sanitized context object (optional)
- `error` — serialized error metadata (optional)

The correlation ID is stored in `context.request_id` when available.

### Correlation ID headers
Middleware assigns (or forwards) `x-correlation-id` on every request and echoes
it on responses. Server actions read this header and inject it into log context
for consistent tracing across logs and Sentry events.

## Metrics (recommended)
- Request count, latency, error rate
- Queue depth (workers)
- CPU/memory (if containerized)

## Tracing (optional)
- Add distributed tracing when there are multiple services or external dependencies.
- Contact form submissions emit server spans for the action and key external calls.
  - `contact_form.submit` (server action)
  - `supabase.insert` / `supabase.update`
  - `hubspot.search` / `hubspot.upsert`
- Span attributes are limited to hashed identifiers and non-PII flags.

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

## Bundle size regression guard

Run the bundle size budget check after a build to catch oversized chunks before deployment:

```bash
npm run build
npm run check:bundle-size
```

## Sentry instrumentation

- Contact form submissions emit a dedicated performance span (`contact_form.submit`) on both the client (`op="ui.action"`) and the server action (`op="action"`).
- External calls in the submission flow (Supabase + HubSpot) are wrapped in spans for latency visibility.
- Use Sentry traces for user-facing actions; avoid attaching PII to span attributes.
