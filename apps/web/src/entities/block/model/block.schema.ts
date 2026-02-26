/**
 * @file apps/web/src/entities/block/model/block.schema.ts
 * @summary block entity schema definition.
 * @description Zod schema for block data validation.
 */

import { z } from 'zod'

export const BlockSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Block = z.infer<typeof BlockSchema>

export const createBlock = (data: Partial<Block>): Block => {
  return BlockSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}