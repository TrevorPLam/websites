/**
 * @file apps/web/src/entities/task/model/task.schema.ts
 * @summary task entity schema definition.
 * @description Zod schema for task data validation.
 */

import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Task = z.infer<typeof TaskSchema>

export const createTask = (data: Partial<Task>): Task => {
  return TaskSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}