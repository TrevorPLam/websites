/**
 * @file apps/web/src/entities/image/model/image.schema.ts
 * @summary image entity schema definition.
 * @description Zod schema for image data validation.
 */

import { z } from 'zod'

export const ImageSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Image = z.infer<typeof ImageSchema>

export const createImage = (data: Partial<Image>): Image => {
  return ImageSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}