/**
 * @file apps/web/src/entities/brand-logo/model/brand-logo.schema.ts
 * @summary brand-logo entity schema definition.
 * @description Zod schema for brand-logo data validation.
 */

import { z } from 'zod'

export const Brand-logoSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Brand-logo = z.infer<typeof Brand-logoSchema>

export const createBrand-logo = (data: Partial<Brand-logo>): Brand-logo => {
  return Brand-logoSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}