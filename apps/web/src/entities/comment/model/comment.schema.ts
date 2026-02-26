/**
 * @file apps/web/src/entities/comment/model/comment.schema.ts
 * @summary comment entity schema definition.
 * @description Zod schema for comment data validation.
 */

import { z } from 'zod'

export const CommentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Comment = z.infer<typeof CommentSchema>

export const createComment = (data: Partial<Comment>): Comment => {
  return CommentSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}