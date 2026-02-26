/**
 * @file apps/web/src/entities/content/model/content.schema.ts
 * @summary content entity schema definition.
 * @description Zod schema for content data validation.
 */

import { z } from 'zod'

export const ContentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Content = z.infer<typeof ContentSchema>

export const createContent = (data: Partial<Content>): Content => {
  return ContentSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}