/**
 * @file apps/web/src/entities/metadata/model/metadata.schema.ts
 * @summary metadata entity schema definition.
 * @description Zod schema for metadata data validation.
 */

import { z } from 'zod'

export const MetadataSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Metadata = z.infer<typeof MetadataSchema>

export const createMetadata = (data: Partial<Metadata>): Metadata => {
  return MetadataSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}