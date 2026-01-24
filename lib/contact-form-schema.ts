import { z } from 'zod'
import { FORM_VALIDATION } from './constants'

// Contact form schema with enhanced validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(FORM_VALIDATION.NAME_MIN_LENGTH, 'Name must be at least 2 characters')
    .max(FORM_VALIDATION.NAME_MAX_LENGTH),
  email: z.string().email('Invalid email address').max(FORM_VALIDATION.EMAIL_MAX_LENGTH),
  company: z.string().max(FORM_VALIDATION.COMPANY_MAX_LENGTH).optional(),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .max(FORM_VALIDATION.PHONE_MAX_LENGTH)
    .optional(),
  marketingSpend: z.string().max(FORM_VALIDATION.MARKETING_SPEND_MAX_LENGTH).optional(),
  // Honeypot trap: bots that fill this get blocked upstream in submitContactForm
  website: z.string().max(0, 'Honeypot must be empty').optional(),
  message: z
    .string()
    .min(FORM_VALIDATION.MESSAGE_MIN_LENGTH, 'Message must be at least 10 characters')
    .max(FORM_VALIDATION.MESSAGE_MAX_LENGTH),
  hearAboutUs: z.string().max(FORM_VALIDATION.HEAR_ABOUT_US_MAX_LENGTH).optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
