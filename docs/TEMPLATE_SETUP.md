# Template Setup

This guide explains how to configure the template and connect optional integrations (booking, payments, CRM).

## Required Environment Variables

Set these on every deployment. They are validated at startup.

- `NEXT_PUBLIC_SITE_URL` - Public base URL (e.g., https://example.com)
- `NEXT_PUBLIC_SITE_NAME` - Public site name for metadata
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
- `HUBSPOT_PRIVATE_APP_TOKEN` - HubSpot private app token (server-only)

## Production-Only Requirements

- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token

These are required in production to enforce distributed rate limiting.

## Optional Environment Variables

- `NEXT_PUBLIC_ANALYTICS_ID` - GA4 measurement ID (enables analytics once consent is granted)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error reporting

## Booking Integrations (Optional)

Choose one provider and connect its hosted booking page or API:

- Square Appointments
- Fresha
- Vagaro
- GlossGenius
- Mindbody

Recommended approach:

1. Replace the booking CTA URLs (e.g., `/book`) with the provider link.
2. If using an embedded widget, add a client component that loads the script after user consent.
3. Update copy in the booking page to match the provider flow.

## Payments (Optional)

If you collect deposits or gift card payments online:

- Stripe Checkout
- Square Payments
- PayPal

Recommended approach:

1. Add a deposit option to the booking page or contact flow.
2. Use a hosted checkout URL instead of handling card data directly.

## CRM and Lead Routing (Optional)

The template supports HubSpot by default. If you use a different CRM:

1. Update the server action in [apps/web/lib/actions](apps/web/lib/actions) to route leads.
2. Keep the same payload shape for contact form data to avoid UI changes.

## Customization Checklist

- Update organization details in [apps/web/lib/constants.ts](apps/web/lib/constants.ts)
- Replace logos and social links in [apps/web/components/Navigation.tsx](apps/web/components/Navigation.tsx) and [apps/web/components/Footer.tsx](apps/web/components/Footer.tsx)
- Update images in `apps/web/public`
- Review sitemap entries in [apps/web/app/sitemap.ts](apps/web/app/sitemap.ts)
- Review SEO metadata in [apps/web/app/layout.tsx](apps/web/app/layout.tsx)
