/**
 * @file apps/web/src/entities/product/model/product.schema.ts
 * @summary product entity schema definition.
 * @description Zod schema for product data validation.
 */

import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Product = z.infer<typeof ProductSchema>

export const createProduct = (data: Partial<Product>): Product => {
  return ProductSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}