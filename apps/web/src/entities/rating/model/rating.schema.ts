/**
 * @file apps/web/src/entities/rating/model/rating.schema.ts
 * @summary rating entity schema definition.
 * @description Zod schema for rating data validation.
 */

import { z } from 'zod'

export const RatingSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Rating = z.infer<typeof RatingSchema>

export const createRating = (data: Partial<Rating>): Rating => {
  return RatingSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}