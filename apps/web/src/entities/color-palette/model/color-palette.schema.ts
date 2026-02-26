/**
 * @file apps/web/src/entities/color-palette/model/color-palette.schema.ts
 * @summary color-palette entity schema definition.
 * @description Zod schema for color-palette data validation.
 */

import { z } from 'zod'

export const ColorPaletteSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type ColorPalette = z.infer<typeof ColorPaletteSchema>

export const createColorPalette = (data: Partial<ColorPalette>): ColorPalette => {
  return ColorPaletteSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}
