/**
 * @file apps/web/src/entities/log/model/log.schema.ts
 * @summary log entity schema definition.
 * @description Zod schema for log data validation.
 */

import { z } from 'zod'

export const LogSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Log = z.infer<typeof LogSchema>

export const createLog = (data: Partial<Log>): Log => {
  return LogSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}