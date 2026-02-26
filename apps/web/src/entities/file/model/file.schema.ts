/**
 * @file apps/web/src/entities/file/model/file.schema.ts
 * @summary file entity schema definition.
 * @description Zod schema for file data validation.
 */

import { z } from 'zod'

export const FileSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type File = z.infer<typeof FileSchema>

export const createFile = (data: Partial<File>): File => {
  return FileSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}