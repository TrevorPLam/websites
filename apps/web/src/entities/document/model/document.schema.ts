/**
 * @file apps/web/src/entities/document/model/document.schema.ts
 * @summary document entity schema definition.
 * @description Zod schema for document data validation.
 */

import { z } from 'zod'

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Document = z.infer<typeof DocumentSchema>

export const createDocument = (data: Partial<Document>): Document => {
  return DocumentSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}