/**
 * @file apps/web/src/entities/review/model/review.schema.ts
 * @summary review entity schema definition.
 * @description Zod schema for review data validation.
 */

import { z } from 'zod'

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Review = z.infer<typeof ReviewSchema>

export const createReview = (data: Partial<Review>): Review => {
  return ReviewSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}