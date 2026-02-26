/**
 * @file apps/web/src/entities/category/model/category.schema.ts
 * @summary category entity schema definition.
 * @description Zod schema for category data validation.
 */

import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Category = z.infer<typeof CategorySchema>

export const createCategory = (data: Partial<Category>): Category => {
  return CategorySchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}