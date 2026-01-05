'use server'

import { z } from 'zod'
import { createHash } from 'crypto'
import { headers } from 'next/headers'
import { logError, logWarn, logInfo } from './logger'
import { escapeHtml, sanitizeEmailSubject, textToHtmlParagraphs } from './sanitize'
import { validatedEnv } from './env'

// Contact form schema with enhanced validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(254),
  company: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  marketingSpend: z.string().max(50).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  hearAboutUs: z.string().max(100).optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 3
const RATE_LIMIT_WINDOW = '1 h' // 1 hour

// Distributed rate limiting with Upstash Redis (production)
// Falls back to in-memory rate limiting if Upstash is not configured
type RateLimiter = {
  limit: (identifier: string) => Promise<{ success: boolean }>
}
let rateLimiter: RateLimiter | null | false = null
const rateLimitMap = new Map<string, { count: number; resetAt: number }>() // Fallback

const IP_HASH_SALT = 'contact_form_ip'

function hashIdentifier(value: string): string {
  return createHash('sha256').update(`${IP_HASH_SALT}:${value}`).digest('hex')
}

function getClientIp(): string {
  const requestHeaders = headers()
  const forwardedFor =
    requestHeaders.get('x-forwarded-for') ||
    requestHeaders.get('x-vercel-forwarded-for') ||
    requestHeaders.get('x-real-ip') ||
    requestHeaders.get('cf-connecting-ip')

  if (!forwardedFor) {
    return 'unknown'
  }

  return forwardedFor.split(',')[0]?.trim() || 'unknown'
}

// Initialize rate limiter
async function getRateLimiter() {
  if (rateLimiter !== null) {
    return rateLimiter
  }

  // Check if Upstash credentials are configured
  if (validatedEnv.UPSTASH_REDIS_REST_URL && validatedEnv.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: validatedEnv.UPSTASH_REDIS_REST_URL,
        token: validatedEnv.UPSTASH_REDIS_REST_TOKEN,
      })

      rateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW),
        analytics: true,
        prefix: 'contact_form',
      })

      logInfo('Initialized distributed rate limiting with Upstash Redis')
      return rateLimiter
    } catch (error) {
      logError('Failed to initialize Upstash rate limiter, falling back to in-memory', error)
    }
  } else {
    logWarn(
      'Upstash Redis not configured, using in-memory rate limiting (not suitable for production)'
    )
  }

  // Return null to indicate fallback to in-memory
  rateLimiter = false // Sentinel value to prevent re-initialization attempts
  return null
}

// In-memory rate limiting fallback
function checkRateLimitInMemory(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(identifier)

  // Clean up expired entries
  if (limit && now > limit.resetAt) {
    rateLimitMap.delete(identifier)
  }

  const existing = rateLimitMap.get(identifier)

  if (!existing) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + 60 * 60 * 1000 }) // 1 hour
    return true
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  existing.count++
  return true
}

// Unified rate limiting check
async function checkRateLimit(email: string, clientIp: string): Promise<boolean> {
  const limiter = await getRateLimiter()
  const emailIdentifier = `email:${email}`
  const ipIdentifier = `ip:${hashIdentifier(clientIp)}`

  if (limiter) {
    // Use Upstash distributed rate limiting
    const emailLimit = await limiter.limit(emailIdentifier)
    if (!emailLimit.success) {
      return false
    }

    const ipLimit = await limiter.limit(ipIdentifier)
    return ipLimit.success
  } else {
    // Fall back to in-memory rate limiting
    const emailAllowed = checkRateLimitInMemory(emailIdentifier)
    if (!emailAllowed) {
      return false
    }

    return checkRateLimitInMemory(ipIdentifier)
  }
}

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate the data
    const validatedData = contactFormSchema.parse(data)
    const clientIp = getClientIp()
    const hashedIp = hashIdentifier(clientIp)

    // Rate limiting check
    const rateLimitPassed = await checkRateLimit(validatedData.email, clientIp)
    if (!rateLimitPassed) {
      logWarn('Rate limit exceeded for contact form', { email: validatedData.email, ip: hashedIp })
      return {
        success: false,
        message: 'Too many submissions. Please try again later.',
      }
    }

    // Send email via Resend API
    if (validatedEnv.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(validatedEnv.RESEND_API_KEY)

      // Sanitize all inputs to prevent XSS and injection
      const safeName = escapeHtml(validatedData.name)
      const safeEmail = escapeHtml(validatedData.email)
      const safeCompany = validatedData.company ? escapeHtml(validatedData.company) : null
      const safePhone = validatedData.phone ? escapeHtml(validatedData.phone) : null
      const safeMarketingSpend = validatedData.marketingSpend
        ? escapeHtml(validatedData.marketingSpend)
        : null
      const safeHearAboutUs = validatedData.hearAboutUs
        ? escapeHtml(validatedData.hearAboutUs)
        : null
      const safeMessage = textToHtmlParagraphs(validatedData.message)

      // Sanitize subject to prevent email header injection
      const safeSubject = sanitizeEmailSubject(
        `New Contact Form Submission from ${validatedData.name}`
      )

      await resend.emails.send({
        from: 'onboarding@resend.dev', // Use Resend's test domain or your verified domain
        to: validatedEnv.CONTACT_EMAIL,
        subject: safeSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
              .field { margin: 15px 0; }
              .field strong { color: #555; }
              .message { background: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>New Contact Form Submission</h2>
              <div class="field"><strong>Name:</strong> ${safeName}</div>
              <div class="field"><strong>Email:</strong> ${safeEmail}</div>
              ${safeCompany ? `<div class="field"><strong>Company:</strong> ${safeCompany}</div>` : ''}
              ${safePhone ? `<div class="field"><strong>Phone:</strong> ${safePhone}</div>` : ''}
              ${safeMarketingSpend ? `<div class="field"><strong>Marketing Spend:</strong> ${safeMarketingSpend}</div>` : ''}
              ${safeHearAboutUs ? `<div class="field"><strong>How they heard about us:</strong> ${safeHearAboutUs}</div>` : ''}
              <div class="message">
                <strong>Message:</strong>
                ${safeMessage}
              </div>
            </div>
          </body>
          </html>
        `,
      })

      logInfo('Contact form submitted successfully', { email: validatedData.email })
    } else {
      logWarn('RESEND_API_KEY not set - email not sent in development mode')
    }

    return { success: true, message: "Thank you for your message! We'll be in touch soon." }
  } catch (error) {
    logError('Contact form submission error', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please check your form inputs and try again.',
        errors: error.issues,
      }
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again or email us directly.',
    }
  }
}
