/**
 * @file apps/web/src/entities/element/model/element.schema.ts
 * @summary element entity schema definition.
 * @description Zod schema for element data validation.
 */

import { z } from 'zod'

export const ElementSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Element = z.infer<typeof ElementSchema>

export const createElement = (data: Partial<Element>): Element => {
  return ElementSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}