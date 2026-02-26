/**
 * @file apps/web/src/entities/color-palette/model/color-palette.schema.ts
 * @summary color-palette entity schema definition.
 * @description Zod schema for color-palette data validation.
 */

import { z } from 'zod'

export const Color-paletteSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Color-palette = z.infer<typeof Color-paletteSchema>

export const createColor-palette = (data: Partial<Color-palette>): Color-palette => {
  return Color-paletteSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}