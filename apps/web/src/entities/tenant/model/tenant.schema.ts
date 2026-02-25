/**
 * @file apps/web/src/entities/tenant/model/tenant.schema.ts
 * @summary Tenant entity schema definition.
 * @description Zod schema for tenant data validation.
 */

import { z } from 'zod'

export const TenantSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(3).max(63),
  name: z.string().min(1).max(100),
  plan: z.enum(['free', 'pro', 'enterprise']),
  status: z.enum(['active', 'suspended', 'deleted']),
  customDomain: z.string().url().optional(),
  features: z.array(z.string()),
  billingStatus: z.enum(['current', 'past_due', 'canceled']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Tenant = z.infer<typeof TenantSchema>

export const createTenant = (data: Partial<Tenant>): Tenant => {
  return TenantSchema.parse({
    id: crypto.randomUUID(),
    slug: '',
    name: '',
    plan: 'free',
    status: 'active',
    features: [],
    billingStatus: 'current',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}
