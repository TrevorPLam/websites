/**
 * @file apps/web/src/entities/tag/model/tag.schema.ts
 * @summary tag entity schema definition.
 * @description Zod schema for tag data validation.
 */

import { z } from 'zod'

export const TagSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Tag = z.infer<typeof TagSchema>

export const createTag = (data: Partial<Tag>): Tag => {
  return TagSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}