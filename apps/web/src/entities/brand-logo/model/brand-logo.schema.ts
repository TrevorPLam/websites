/**
 * @file apps/web/src/entities/brand-logo/model/brand-logo.schema.ts
 * @summary brand-logo entity schema definition.
 * @description Zod schema for brand-logo data validation.
 */

import { z } from 'zod'

export const BrandLogoSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type BrandLogo = z.infer<typeof BrandLogoSchema>

export const createBrandLogo = (data: Partial<BrandLogo>): BrandLogo => {
  return BrandLogoSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}
