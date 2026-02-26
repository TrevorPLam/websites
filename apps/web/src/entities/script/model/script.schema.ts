/**
 * @file apps/web/src/entities/script/model/script.schema.ts
 * @summary script entity schema definition.
 * @description Zod schema for script data validation.
 */

import { z } from 'zod'

export const ScriptSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Script = z.infer<typeof ScriptSchema>

export const createScript = (data: Partial<Script>): Script => {
  return ScriptSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}