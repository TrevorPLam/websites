import { z } from 'zod'

// Contact form schema with enhanced validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(254),
  company: z.string().max(200).optional(),
  phone: z.string().trim().min(1, 'Phone number is required').max(50).optional(),
  marketingSpend: z.string().max(50).optional(),
  // Honeypot trap: bots that fill this get blocked upstream in submitContactForm
  website: z.string().max(0, 'Honeypot must be empty').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  hearAboutUs: z.string().max(100).optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
