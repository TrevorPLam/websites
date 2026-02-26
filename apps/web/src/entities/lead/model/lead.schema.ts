/**
 * @file apps/web/src/entities/lead/model/lead.schema.ts
 * @summary Comprehensive lead entity schema definition with 2026 standards.
 * @description Complete Zod schema for lead data validation with multi-tenant support.
 * @security All lead operations require tenant_id validation
 * @compliance GDPR/CCPA ready with data minimization principles
 * @requirements TASK-006, GDPR-data-minimization, multi-tenant-security
 */

import { z } from 'zod';

// Lead status enum with business logic constraints
export const LeadStatusSchema = z.enum(['captured', 'qualified', 'converted'], {
  description: 'Lead status in the sales pipeline',
});

// Lead source enum for attribution tracking
export const LeadSourceSchema = z.enum(
  ['website', 'referral', 'direct', 'social', 'email', 'paid', 'organic', 'other'],
  {
    description: 'Source where the lead originated',
  }
);

// Phone number validation with international format support
export const PhoneNumberSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional()
  .describe('Phone number in E.164 format');

// URL validation for landing pages and referrers
export const URLSchema = z.string().url('Invalid URL format').max(2048, 'URL too long').optional();

// Comprehensive lead schema with all business fields
export const LeadSchema = z.object({
  // Primary identifiers
  id: z.string().uuid('Invalid lead ID format').describe('Unique lead identifier'),
  tenantId: z
    .string()
    .uuid('Invalid tenant ID format')
    .describe('Tenant identifier for multi-tenant isolation'),

  // Contact information
  email: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .describe('Primary email address'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .describe('Full name of the lead'),
  phone: PhoneNumberSchema.describe('Phone number in E.164 format'),
  company: z
    .string()
    .max(100, 'Company name too long')
    .optional()
    .describe('Company or organization name'),

  // Lead management
  status: LeadStatusSchema.default('captured').describe('Current status in sales pipeline'),
  score: z.number().int().min(0).max(100).optional().describe('Lead quality score (0-100)'),
  assigneeUserId: z.string().uuid().optional().describe('ID of assigned user'),

  // Attribution and tracking
  source: LeadSourceSchema.default('website').describe('Lead acquisition source'),
  medium: z.string().max(50, 'Medium too long').optional().describe('Marketing medium'),
  campaign: z.string().max(100, 'Campaign name too long').optional().describe('Marketing campaign'),
  content: z
    .string()
    .max(100, 'Content too long')
    .optional()
    .describe('Marketing content identifier'),
  term: z.string().max(100, 'Search term too long').optional().describe('Search term or keyword'),

  // Session and behavioral data
  sessionId: z.string().max(255, 'Session ID too long').optional().describe('Session identifier'),
  landingPage: URLSchema.describe('First page visited by lead'),
  referrer: URLSchema.optional().describe('Referring page'),

  // Geographic and device data
  ipAddress: z.string().ip('Invalid IP address').optional().describe('IP address for geo-location'),
  userAgent: z.string().max(500, 'User agent too long').optional().describe('Browser user agent'),
  deviceType: z.enum(['desktop', 'mobile', 'tablet', 'unknown']).optional().describe('Device type'),
  browser: z.string().max(50, 'Browser name too long').optional().describe('Browser name'),

  // Custom fields and messaging
  message: z.string().max(2000, 'Message too long').optional().describe('Custom message or notes'),
  customFields: z.record(z.unknown()).optional().describe('Additional custom fields'),

  // Timestamps
  createdAt: z.date().describe('Lead creation timestamp'),
  updatedAt: z.date().describe('Last update timestamp'),
  convertedAt: z.date().optional().describe('Lead conversion timestamp'),

  // Privacy and compliance
  consent: z
    .object({
      marketing: z.boolean().default(false).describe('Consent for marketing communications'),
      processing: z.boolean().default(true).describe('Consent for data processing'),
      timestamp: z.date().optional().describe('Consent timestamp'),
    })
    .optional()
    .describe('GDPR/CCPA consent data'),
});

// Lead creation schema (subset of full schema for creation)
export const CreateLeadSchema = LeadSchema.pick({
  email: true,
  name: true,
  phone: true,
  company: true,
  source: true,
  medium: true,
  campaign: true,
  content: true,
  term: true,
  sessionId: true,
  landingPage: true,
  referrer: true,
  message: true,
  customFields: true,
  consent: true,
}).extend({
  tenantId: z
    .string()
    .uuid('Invalid tenant ID format')
    .describe('Tenant identifier for multi-tenant isolation'),
});

// Lead update schema (partial updates allowed)
export const UpdateLeadSchema = LeadSchema.pick({
  name: true,
  phone: true,
  company: true,
  status: true,
  score: true,
  assigneeUserId: true,
  message: true,
  customFields: true,
  consent: true,
  convertedAt: true,
}).partial();

// Lead search/filter schema
export const LeadSearchSchema = z.object({
  tenantId: z
    .string()
    .uuid('Invalid tenant ID format')
    .describe('Tenant identifier for multi-tenant isolation'),
  status: LeadStatusSchema.optional().describe('Filter by lead status'),
  source: LeadSourceSchema.optional().describe('Filter by lead source'),
  assigneeUserId: z.string().uuid().optional().describe('Filter by assigned user'),
  dateFrom: z.date().optional().describe('Filter leads created after this date'),
  dateTo: z.date().optional().describe('Filter leads created before this date'),
  search: z
    .string()
    .max(100, 'Search term too long')
    .optional()
    .describe('Search in name, email, company'),
  limit: z.number().int().min(1).max(100).default(20).describe('Number of results to return'),
  offset: z.number().int().min(0).default(0).describe('Number of results to skip'),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'name', 'email', 'score'])
    .default('createdAt')
    .describe('Sort field'),
  sortOrder: z.enum(['asc', 'desc']).default('desc').describe('Sort order'),
});

// Type exports
export type Lead = z.infer<typeof LeadSchema>;
export type CreateLeadData = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadData = z.infer<typeof UpdateLeadSchema>;
export type LeadSearchParams = z.infer<typeof LeadSearchSchema>;
export type LeadStatus = z.infer<typeof LeadStatusSchema>;
export type LeadSource = z.infer<typeof LeadSourceSchema>;

// Validation functions with proper error handling
/**
 * Validates raw data against Lead schema
 * @param data - Raw data to validate
 * @returns Validated Lead object
 * @throws ValidationError if data is invalid
 */
export const validateLead = (data: unknown): Lead => {
  try {
    return LeadSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedError = new Error(
        `Lead validation failed: ${error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      );
      formattedError.name = 'LeadValidationError';
      throw formattedError;
    }
    throw error;
  }
};

/**
 * Validates raw data against CreateLead schema
 * @param data - Raw data to validate
 * @returns Validated CreateLeadData object
 * @throws ValidationError if data is invalid
 */
export const validateCreateLead = (data: unknown): CreateLeadData => {
  try {
    return CreateLeadSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedError = new Error(
        `Create lead validation failed: ${error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      );
      formattedError.name = 'CreateLeadValidationError';
      throw formattedError;
    }
    throw error;
  }
};

/**
 * Validates raw data against UpdateLead schema
 * @param data - Raw data to validate
 * @returns Validated UpdateLeadData object
 * @throws ValidationError if data is invalid
 */
export const validateUpdateLead = (data: unknown): UpdateLeadData => {
  try {
    return UpdateLeadSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedError = new Error(
        `Update lead validation failed: ${error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      );
      formattedError.name = 'UpdateLeadValidationError';
      throw formattedError;
    }
    throw error;
  }
};

/**
 * Validates raw data against LeadSearch schema
 * @param data - Raw data to validate
 * @returns Validated LeadSearchParams object
 * @throws ValidationError if data is invalid
 */
export const validateLeadSearch = (data: unknown): LeadSearchParams => {
  try {
    return LeadSearchSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedError = new Error(
        `Lead search validation failed: ${error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      );
      formattedError.name = 'LeadSearchValidationError';
      throw formattedError;
    }
    throw error;
  }
};

// Factory function for creating new leads
/**
 * Creates a new Lead instance from validated data
 * @param data - Validated lead creation data
 * @returns New Lead instance with generated ID and timestamps
 */
export const createLead = (data: CreateLeadData): Lead => {
  const now = new Date();
  return LeadSchema.parse({
    id: crypto.randomUUID(),
    status: 'captured',
    createdAt: now,
    updatedAt: now,
    ...data,
  });
};

// Helper function to check if lead can be converted
/**
 * Checks if a lead can be converted to customer
 * @param lead - Lead instance to check
 * @returns True if lead can be converted
 */
export const canConvertLead = (lead: Lead): boolean => {
  return lead.status === 'qualified';
};

// Helper function to check if lead can be qualified
/**
 * Checks if a lead can be qualified
 * @param lead - Lead instance to check
 * @returns True if lead can be qualified
 */
export const canQualifyLead = (lead: Lead): boolean => {
  return lead.status === 'captured';
};
