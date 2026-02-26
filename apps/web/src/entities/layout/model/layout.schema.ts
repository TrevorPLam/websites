/**
 * @file apps/web/src/entities/layout/model/layout.schema.ts
 * @summary layout entity schema definition.
 * @description Zod schema for layout data validation.
 */

import { z } from 'zod'

export const LayoutSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Layout = z.infer<typeof LayoutSchema>

export const createLayout = (data: Partial<Layout>): Layout => {
  return LayoutSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}