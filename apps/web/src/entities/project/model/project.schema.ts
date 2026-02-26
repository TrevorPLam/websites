/**
 * @file apps/web/src/entities/project/model/project.schema.ts
 * @summary project entity schema definition.
 * @description Zod schema for project data validation.
 */

import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Project = z.infer<typeof ProjectSchema>

export const createProject = (data: Partial<Project>): Project => {
  return ProjectSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}