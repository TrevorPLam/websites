'use server';

import { z } from 'zod';

import { createServerAction } from '@repo/auth/server-action-wrapper';
import {
  addCustomDomainForTenant,
  removeCustomDomainForTenant,
  verifyAndActivateDomain,
} from '@repo/multi-tenant/vercel-domains';

const DomainInputSchema = z.object({
  domain: z
    .string()
    .min(3)
    .transform((value) => value.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')),
});

export const addDomainAction = createServerAction(DomainInputSchema, async ({ domain }, ctx) => {
  const result = await addCustomDomainForTenant(ctx.tenantId, domain);
  return result;
});

export const verifyDomainAction = createServerAction(DomainInputSchema, async ({ domain }, ctx) => {
  return verifyAndActivateDomain(ctx.tenantId, domain);
});

export const removeDomainAction = createServerAction(z.object({}), async (_, ctx) => {
  await removeCustomDomainForTenant(ctx.tenantId);
  return { removed: true };
});
