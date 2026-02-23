# white-label-portal-architecture.md

## Overview

White-labeling allows Enterprise-tier clients to remove all agency branding from the portal and replace it with their own logo, colors, domain, and support contact. The implementation is a **pure presentation layer** — no code branching, no separate deployment. All behavior is controlled by a `whiteLabel` block in `site.config`. [qimu](https://www.qimu.dev/blog/2026-01-06-1-multi-tenant-theming)

---

## What Changes vs. What Stays the Same

| What changes                          | What stays the same         |
| ------------------------------------- | --------------------------- |
| Portal logo + favicon                 | Underlying Next.js codebase |
| Portal name in `<title>` and header   | Database schema             |
| Primary color (CSS custom properties) | Auth system (Clerk)         |
| Portal domain (`portal.client.com`)   | Feature set and permissions |
| Footer attribution text               | Infrastructure              |
| Support email/link                    | Security policies           |

---

## CSS Variable Injection (Server-Side, No FOUC)

The critical implementation constraint: theme variables must be present in the **SSR'd HTML** — not applied client-side after hydration. A `useEffect` approach causes a flash of the wrong brand color on first paint, which is unacceptable for Enterprise clients doing demos. [reddit](https://www.reddit.com/r/css/comments/oob53o/best_way_to_apply_styles_for_a/)

```typescript
// apps/portal/src/components/providers/WhiteLabelProvider.tsx
// Server Component — reads config from DB, injects <style> into SSR HTML

export async function WhiteLabelProvider({ children }) {
  const config = await getWhiteLabelConfig(); // Server-side DB read

  const primaryColor = config?.portalPrimaryColor ?? '#2563eb';

  const cssVars = `
    :root {
      --color-primary: ${primaryColor};
      --color-primary-50: ${primaryColor}14;
      --color-primary-100: ${primaryColor}29;
    }
  `.trim();

  return (
    <>
      {/* Inline style tag in SSR — zero FOUC */}
      <style dangerouslySetInnerHTML={{ __html: cssVars }} id="wl-vars" />
      {children}
    </>
  );
}
```

---

## White-Label Config Schema

```typescript
// packages/config/src/types.ts
export interface WhiteLabelConfig {
  enabled: boolean;
  portalName: string;
  portalLogoUrl?: string;
  portalFaviconUrl?: string;
  portalPrimaryColor: string; // Hex, e.g. "#7c3aed"
  portalDomain?: string; // e.g. "portal.johnsplumbing.com"
  hideAgencyBranding: boolean; // Removes "Powered by" footer
  hideSupportLink: boolean;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
}
```

---

## Plan Gate

White-label is **Enterprise plan only**. The settings UI shows an upgrade prompt for non-Enterprise tenants:

```typescript
if (tenant.plan !== 'enterprise') {
  return <EnterpriseUpgradePrompt feature="White-Label Portal" />;
}
```

The API layer also enforces this:

```typescript
export const updateWhiteLabelSettings = createServerAction(
  WhiteLabelSchema,
  async (input, { tenantId }) => {
    const { data: tenant } = await db.from('tenants').select('plan').eq('id', tenantId).single();

    if (tenant?.plan !== 'enterprise') {
      throw new Error('White-label requires Enterprise plan');
    }

    await db.rpc('deep_merge_config', {
      p_tenant_id: tenantId,
      p_path: '{whiteLabel}',
      p_value: { ...input, enabled: true },
    });
  }
);
```

---

## Portal Domain Routing

A white-label Enterprise client who wants `portal.johnsplumbing.com` requires:

1. A CNAME record: `portal.johnsplumbing.com → cname.vercel-dns.com`
2. Adding the domain to Vercel via the Domains API (same `addDomainToVercel()` from Domain 30)
3. Storing `portalDomain` in `whiteLabel.portalDomain`
4. Updating `resolveTenant()` middleware to recognize `portal.johnsplumbing.com` as the portal app for that tenant

```typescript
// packages/multi-tenant/src/resolve-tenant.ts (addition)
// Check portal domain table in addition to custom_domain
const { data: portalTenant } = await db
  .from('tenants')
  .select('id, status, plan, config')
  .eq('config->whiteLabel->portalDomain', hostname)
  .maybeSingle();
```

---

## Portal Header / Footer (White-Label Aware)

```typescript
// apps/portal/src/components/layout/WhiteLabelHeader.tsx
export function WhiteLabelHeader({ portalName, logoUrl }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/dashboard">
          {logoUrl ? (
            <Image src={logoUrl} alt={`${portalName} logo`} width={120} height={36}
                   className="h-8 w-auto object-contain" priority />
          ) : (
            <span className="text-lg font-bold text-gray-900">{portalName}</span>
          )}
        </Link>
        <PortalHeaderActions />
      </div>
    </header>
  );
}

// WhiteLabelFooter.tsx
export function WhiteLabelFooter({ hideAgencyBranding, supportEmail, hideSupportLink }) {
  return (
    <footer className="border-t border-gray-100 py-4 px-6 mt-auto text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
        <div className="flex gap-4">
          {supportEmail && !hideSupportLink && (
            <a href={`mailto:${supportEmail}`}>Support</a>
          )}
          {/* Only shown when hideAgencyBranding is false */}
          {!hideAgencyBranding && (
            <span className="text-gray-300">
              Powered by {process.env.NEXT_PUBLIC_AGENCY_NAME}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Multi-Tenant Theming (2026) — https://www.qimu.dev/blog/2026-01-06-1-multi-tenant-theming
- Production White Label System — https://www.linkedin.com/pulse/how-i-built-production-ready-white-label-system-under-jason-vertrees-qh4yc
- Multi-Brand Site with Next.js — https://www.youtube.com/watch?v=rJ5nmEKogeI
- CSS Custom Properties (MDN) — https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

## Implementation

[Add content here]

## Best Practices

[Add content here]

## Testing

[Add content here]
