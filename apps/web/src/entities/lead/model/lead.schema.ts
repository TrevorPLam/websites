/**
 * @file apps/web/src/entities/lead/model/lead.schema.ts
 * @summary lead entity schema definition.
 * @description Zod schema for lead data validation.
 */

import { z } from 'zod'

export const LeadSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number').optional(),
  company: z.string().min(1, 'Company name is required').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').optional(),
  tenantId: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).default('new'),
  source: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Lead = z.infer<typeof LeadSchema>

export const createLead = (data: Partial<Lead>): Lead => {
  return LeadSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}
