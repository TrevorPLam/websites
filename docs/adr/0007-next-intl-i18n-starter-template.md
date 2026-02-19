<!--
/**
 * @file docs/adr/0007-next-intl-i18n-starter-template.md
 * @role docs/adr
 * @summary Decision record for adding next-intl i18n support to the starter-template,
 *          using app/[locale]/ routing with middleware-based locale detection.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# ADR 0007: next-intl for i18n in starter-template

**Status:** Accepted
**Date:** 2026-02-19
**Task:** 6.7 (ADR series)

## Context

The `clients/starter-template` serves as the golden path for all new marketing website clients. Many local businesses serve multilingual communities (salons in multicultural neighborhoods, law firms serving immigrant communities, dental practices, etc.).

Internationalization must be built into the golden path rather than retrofitted into individual clients, because adding i18n after a site launches requires restructuring the entire `app/` directory routing.

### Requirements

- Support for 2–10 languages per client
- Locale-aware routing with clean URLs (`/es/servicios`, `/fr/services`)
- Fallback to default locale
- Message files that non-developers can edit
- Compatible with Next.js App Router and React Server Components
- Minimal bundle overhead on monolingual deployments

## Decision

Adopt **next-intl** for internationalization in `clients/starter-template`.

### Implementation

1. **Routing**: `app/[locale]/` directory structure with Next.js dynamic segment. All pages live under this segment.

2. **Middleware**: `middleware.ts` at the client root handles locale detection (browser `Accept-Language` header), cookie-based preference, and redirect to localized paths.

3. **Message files**: `messages/<locale>.json` (e.g., `messages/en.json`, `messages/es.json`) contain all translatable strings. These are plain JSON files editable without code knowledge.

4. **i18n config**: `i18n/routing.ts` defines `locales: ['en', 'es']` and `defaultLocale: 'en'`. New clients extend or override this list.

5. **`useTranslations` hook**: Server and client components use `next-intl`'s typed hook with TypeScript inference from message keys.

### File structure

```
clients/starter-template/
├── app/
│   └── [locale]/          # All routes are under locale segment
│       ├── layout.tsx
│       ├── page.tsx
│       ├── about/page.tsx
│       └── ...
├── i18n/
│   └── routing.ts         # Locale configuration
├── messages/
│   ├── en.json            # English strings
│   └── es.json            # Spanish strings (extend as needed)
└── middleware.ts           # Locale detection and redirect
```

## Consequences

### Positive

- **Golden path includes i18n by default**: No retrofitting needed — new clients inherit the routing structure.
- **Non-developer friendly**: `messages/*.json` files can be handed to translators directly.
- **Type safety**: TypeScript infers message key types from the default locale's JSON, catching missing keys at build time.
- **SSR compatible**: next-intl works with React Server Components; no client-side JS overhead for static translations.
- **URL structure is clean**: `/es/servicios` (not `/servicios?lang=es`).

### Negative / Trade-offs

- **Routing complexity**: Flat `app/` structure used in other clients (`luxe-salon`, `bistro-central`) is different from `app/[locale]/`. This divergence means the starter-template is not a drop-in copy for clients that don't want i18n.
- **Middleware overhead**: Every request goes through middleware for locale detection. Latency is negligible (~1ms) but adds complexity to debugging.
- **Message management**: As clients grow, keeping `messages/*.json` in sync requires a translation management workflow. No tooling is currently set up for this.

### Neutral

- Other clients (`luxe-salon`, `bistro-central`, etc.) use a flat `app/` structure without i18n. These clients can add next-intl later by restructuring to `app/[locale]/`, but this is a breaking change to URL structure.

## Alternatives Considered

### next-i18next (Pages Router)
Incompatible with App Router. Rejected.

### React-intl / i18next
Viable, but next-intl has first-party Next.js integration, official support for Server Components, and the cleanest DX for App Router. next-intl is the recommended choice in the Next.js ecosystem as of 2026.

### Manual locale parameter
Passing locale as a prop/context without a routing library avoids the `[locale]` segment but loses automatic locale detection, clean URLs, and type safety. Rejected.

## References

- `clients/starter-template/i18n/routing.ts`
- `clients/starter-template/middleware.ts`
- `clients/starter-template/messages/`
- [next-intl documentation](https://next-intl-docs.vercel.app/)
