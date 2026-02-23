<!--
/**
 * @file client-portal-configuration.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for client portal configuration.
 * @entrypoints docs/guides/client-portal-configuration.md
 * @exports client portal configuration
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# client-portal-configuration.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

The client portal settings system allows tenants to update their `site.config` without filing a support ticket. Every settings section maps to a path in the JSONB `config` column and is updated via a Server Action backed by a `deep_merge_config` PostgreSQL function — ensuring sibling keys are never overwritten. [nextjs](https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## Architecture Principles

1. **Section isolation** — Each settings section (identity, contact, hours, integrations, notifications) is its own form, Zod schema, and Server Action. This gives clean error boundaries and granular cache invalidation.
2. **Deep merge, not full replace** — A `deep_merge_config(tenantId, path[], newValue)` SQL function uses `||` (JSONB concatenation) at the target path. A partial update to `identity.contact` never clobbers `identity.services`.
3. **Row lock on update** — `SELECT FOR UPDATE` prevents two simultaneous settings saves from racing and silently overwriting each other.
4. **Immediate cache bust** — Every action calls `revalidateTag(`tenant:${tenantId}`)` so the marketing site reflects the change within seconds.

---

## Deep Merge SQL Function

```sql
CREATE OR REPLACE FUNCTION deep_merge_config(
  p_tenant_id  uuid,
  p_path       text[],
  p_value      jsonb
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current jsonb;
BEGIN
  SELECT config INTO v_current FROM tenants
  WHERE id = p_tenant_id FOR UPDATE;  -- Prevents race conditions

  IF v_current IS NULL THEN
    RAISE EXCEPTION 'Tenant % not found', p_tenant_id;
  END IF;

  UPDATE tenants SET
    config = jsonb_set(
      v_current,
      p_path,
      COALESCE(v_current #> p_path, '{}') || p_value,
      true  -- create path if missing
    ),
    updated_at = now()
  WHERE id = p_tenant_id;
END;
$$;

GRANT EXECUTE ON FUNCTION deep_merge_config TO authenticated;
```

---

## Settings Action Pattern

```typescript
// packages/settings/src/actions/update-identity.ts
'use server';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { createServerAction } from '@repo/auth/server-action-wrapper';
import { db } from '@repo/db';

const IdentitySchema = z.object({
  siteName: z.string().min(2).max(80),
  tagline: z.string().max(160).optional(),
  industry: z.enum(['hvac', 'plumbing', 'electrical', 'dental', 'general' /* ... */]),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
});

export const updateIdentitySettings = createServerAction(
  IdentitySchema,
  async (input, { tenantId }) => {
    await db.rpc('deep_merge_config', {
      p_tenant_id: tenantId,
      p_path: '{identity}',
      p_value: input,
    });

    // Bust marketing site cache (changes visible within ~60s due to CDN TTL)
    revalidateTag(`tenant:${tenantId}`);
    revalidateTag(`tenant:${tenantId}:sitemap`);

    return { success: true };
  }
);
```

---

## Settings Section Inventory

| Section        | Config Path                  | `revalidateTag` Targets                 | Notes                                              |
| -------------- | ---------------------------- | --------------------------------------- | -------------------------------------------------- |
| Identity       | `{identity}`                 | `tenant:id`, `tenant:id:sitemap`        | Affects `<title>`, JSON-LD business name           |
| Contact        | `{identity,contact}`         | `tenant:id`                             | Phone number change reflects in CTA buttons        |
| Address        | `{identity,address}`         | `tenant:id`                             | Affects `PostalAddress` in JSON-LD                 |
| Business Hours | `{identity,hours}`           | `tenant:id`                             | Affects `OpeningHoursSpecification` in JSON-LD     |
| Service Areas  | `{identity,serviceAreas}`    | `tenant:id:sitemap`, removed area slugs | Must also call `invalidateTenantServiceAreas()`    |
| Services       | `{identity,services}`        | `tenant:id`, `tenant:id:sitemap`        | Individual service pages re-render on next request |
| Integrations   | `{identity}` (GA/GTM/Pixel)  | `tenant:id`                             | Applied to `<ThirdPartyScripts>` on next render    |
| Notifications  | `notification_config` column | None (not cached)                       | Affects email/SMS alert behavior only              |
| Branding       | `{theme,colors}`             | `tenant:id`                             | Triggers CSS variable update on marketing site     |
| White-label    | `{whiteLabel}`               | `tenant:id`                             | Enterprise only — portal re-renders immediately    |

---

## Server Action Wrapper (Auth Guard)

```typescript
// packages/auth/src/server-action-wrapper.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@repo/db';
import type { ZodSchema } from 'zod';

type ActionContext = { tenantId: string; userId: string; role: string };

export function createServerAction<T>(
  schema: ZodSchema<T>,
  handler: (input: T, ctx: ActionContext) => Promise<{ success: boolean; data?: unknown }>
) {
  return async (input: unknown) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten() };
    }

    // Resolve tenant from Clerk JWT custom claims
    const { data: membership } = await db
      .from('tenant_members')
      .select('tenant_id, role')
      .eq('user_id', userId)
      .single();

    if (!membership) throw new Error('No tenant membership found');

    return handler(parsed.data, {
      tenantId: membership.tenant_id,
      userId,
      role: membership.role,
    });
  };
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Next.js Server Actions & Mutations — https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Zod Documentation — https://zod.dev
- PostgreSQL JSONB Functions — https://www.postgresql.org/docs/current/functions-json.html


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]
