/**
 * @file apps/web/src/entities/video/model/video.schema.ts
 * @summary video entity schema definition.
 * @description Zod schema for video data validation.
 */

import { z } from 'zod'

export const VideoSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Video = z.infer<typeof VideoSchema>

export const createVideo = (data: Partial<Video>): Video => {
  return VideoSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}