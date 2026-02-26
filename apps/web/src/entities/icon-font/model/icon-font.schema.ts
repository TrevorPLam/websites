/**
 * @file apps/web/src/entities/icon-font/model/icon-font.schema.ts
 * @summary icon-font entity schema definition.
 * @description Zod schema for icon-font data validation.
 */

import { z } from 'zod'

export const Icon-fontSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Icon-font = z.infer<typeof Icon-fontSchema>

export const createIcon-font = (data: Partial<Icon-font>): Icon-font => {
  return Icon-fontSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}