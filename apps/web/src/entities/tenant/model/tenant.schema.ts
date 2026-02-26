/**
 * @file apps/web/src/entities/tenant/model/tenant.schema.ts
 * @summary tenant entity schema definition.
 * @description Zod schema for tenant data validation.
 */

import { z } from 'zod'

export const TenantSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Tenant = z.infer<typeof TenantSchema>

export const createTenant = (data: Partial<Tenant>): Tenant => {
  return TenantSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}