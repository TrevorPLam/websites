/**
 * @file apps/web/src/entities/audit/model/audit.schema.ts
 * @summary audit entity schema definition.
 * @description Zod schema for audit data validation.
 */

import { z } from 'zod'

export const AuditSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Audit = z.infer<typeof AuditSchema>

export const createAudit = (data: Partial<Audit>): Audit => {
  return AuditSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}