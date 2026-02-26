/**
 * @file apps/web/src/entities/session/model/session.schema.ts
 * @summary session entity schema definition.
 * @description Zod schema for session data validation.
 */

import { z } from 'zod'

export const SessionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Session = z.infer<typeof SessionSchema>

export const createSession = (data: Partial<Session>): Session => {
  return SessionSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}