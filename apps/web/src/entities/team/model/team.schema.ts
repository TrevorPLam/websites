/**
 * @file apps/web/src/entities/team/model/team.schema.ts
 * @summary team entity schema definition.
 * @description Zod schema for team data validation.
 */

import { z } from 'zod'

export const TeamSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Team = z.infer<typeof TeamSchema>

export const createTeam = (data: Partial<Team>): Team => {
  return TeamSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}