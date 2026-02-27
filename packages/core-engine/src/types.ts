import { z } from 'zod';

// Core page builder types
export const PageDataSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  components: z.array(z.any()),
  metadata: z.record(z.any()).optional(),
  tenantId: z.string().uuid(),
  publishedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type PageData = z.infer<typeof PageDataSchema>;

export const ComponentDataSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any()),
  children: z.array(z.any()).optional(),
});

export type ComponentData = z.infer<typeof ComponentDataSchema>;

export const PuckConfigSchema = z.object({
  root: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
  components: z.record(z.any()),
  theme: z.object({
    colors: z.record(z.string()),
    fonts: z.record(z.string()),
    spacing: z.record(z.string()),
  }),
});

export type PuckConfig = z.infer<typeof PuckConfigSchema>;

export const ComponentRegistrySchema = z.record(z.object({
  component: z.any(),
  render: z.function(),
  category: z.string().optional(),
  icon: z.string().optional(),
}));

export type ComponentRegistry = z.infer<typeof ComponentRegistrySchema>;
