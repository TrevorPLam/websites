/**
 * @file apps/web/src/features/lead-capture/api/lead-capture-server-actions.ts
 * @summary Lead capture Server Actions with comprehensive security and validation.
 * @description Server Actions for lead management with multi-tenant isolation and audit logging.
 * @security All actions use secureAction wrapper with tenant context validation
 * @compliance GDPR/CCPA compliant with consent tracking and audit trails
 * @requirements TASK-006, server-actions, multi-tenant-security
 */

'use server';

import { z } from 'zod';
import { secureAction, type ActionContext, type Result } from '@repo/infrastructure/security';
import {
  CreateLeadSchema,
  LeadSearchSchema,
  type CreateLeadData,
  type LeadSearchParams,
} from '@/entities/lead/model/lead.schema';
import {
  sanitizeAndValidateLeadData,
  extractAndValidateUTMParameters,
  formatPhoneNumber,
  type ExtendedLeadData,
} from '../lib/lead-capture-validation';

// Type for our custom lead creation input
type CreateLeadInput = {
  tenantId: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  source?: 'website' | 'referral' | 'direct' | 'social' | 'email' | 'paid' | 'organic' | 'other';
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  sessionId?: string;
  landingPage: string;
  referrer?: string;
  message?: string;
  customFields?: Record<string, unknown>;
  consent?: {
    marketing?: boolean;
    processing?: boolean;
    timestamp?: Date;
  };
  userAgent?: string;
  ipAddress?: string;
};

// Lead creation input schema for Server Action validation
const CreateLeadInputSchema = z.object({
  // Required fields
  tenantId: z.string().uuid(),
  email: z.string().email().max(254),
  name: z.string().min(1).max(100),

  // Optional fields
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  company: z.string().max(100).optional(),
  source: z
    .enum(['website', 'referral', 'direct', 'social', 'email', 'paid', 'organic', 'other'])
    .default('website'),
  medium: z.string().max(50).optional(),
  campaign: z.string().max(100).optional(),
  content: z.string().max(100).optional(),
  term: z.string().max(100).optional(),
  sessionId: z.string().max(255).optional(),
  landingPage: z.string().url().max(2048),
  referrer: z.string().url().max(2048).optional(),
  message: z.string().max(2000).optional(),
  customFields: z.record(z.unknown()).optional(),
  consent: z
    .object({
      marketing: z.boolean().default(false),
      processing: z.boolean().default(true),
      timestamp: z.date().optional(),
    })
    .optional(),

  // Server-side fields
  userAgent: z.string().max(500).optional(),
  ipAddress: z.string().ip().optional(),
});

// Lead update input schema
const UpdateLeadInputSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  company: z.string().max(100).optional(),
  status: z.enum(['captured', 'qualified', 'converted']).optional(),
  score: z.number().int().min(0).max(100).optional(),
  assigneeUserId: z.string().uuid().optional(),
  message: z.string().max(2000).optional(),
  customFields: z.record(z.unknown()).optional(),
  consent: z
    .object({
      marketing: z.boolean().optional(),
      processing: z.boolean().optional(),
      timestamp: z.date().optional(),
    })
    .optional(),
  convertedAt: z.date().optional(),
});

// Lead search input schema with proper defaults
const SearchLeadsInputSchema = z.object({
  tenantId: z.string().uuid(),
  status: z.enum(['captured', 'qualified', 'converted']).optional(),
  source: z
    .enum(['website', 'referral', 'direct', 'social', 'email', 'paid', 'organic', 'other'])
    .optional(),
  assigneeUserId: z.string().uuid().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().max(100).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'email', 'score']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Server Action to create a new lead with comprehensive validation and security
 * @param rawInput - Unvalidated lead data from client
 * @returns Result with created lead data or error information
 */
export async function createLeadAction(rawInput: unknown): Promise<Result<any>> {
  return secureAction(
    rawInput,
    CreateLeadInputSchema,
    async (ctx: ActionContext, input: CreateLeadInput) => {
      // Extract and validate UTM parameters from landing page
      const utmParams = extractAndValidateUTMParameters(input.landingPage);

      // Format phone number if provided
      const formattedPhone = input.phone ? formatPhoneNumber(input.phone) : undefined;

      // Create lead data with all required fields
      const leadData = {
        ...input,
        ...utmParams,
        phone: formattedPhone,
        tenantId: ctx.tenantId, // Ensure tenant context from secureAction
        sessionId: input.sessionId || ctx.correlationId,
      };

      // TODO(TASK-001): Replace with actual database implementation
      // For now, return the validated data as if it was saved
      const createdLead = {
        id: crypto.randomUUID(),
        ...leadData,
        status: 'captured' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return createdLead;
    },
    {
      actionName: 'createLead',
      requireAuth: false, // Allow anonymous lead capture
      logLevel: 'info',
    }
  );
}

/**
 * Server Action to update an existing lead
 * @param rawInput - Unvalidated update data from client
 * @returns Result with updated lead data or error information
 */
export async function updateLeadAction(rawInput: unknown): Promise<Result<any>> {
  return secureAction(
    rawInput,
    UpdateLeadInputSchema,
    async (ctx: ActionContext, input: z.infer<typeof UpdateLeadInputSchema>) => {
      // TODO(DB-001): Replace with actual database update
      // For now, return the updated data as if it was saved
      const updatedLead = {
        ...input,
        updatedAt: new Date(),
      };

      return updatedLead;
    },
    {
      actionName: 'updateLead',
      requireAuth: true, // Require authentication for updates
      logLevel: 'warn',
    }
  );
}

/**
 * Server Action to search and filter leads with pagination
 * @param rawInput - Unvalidated search parameters from client
 * @returns Result with paginated lead list or error information
 */
export async function searchLeadsAction(rawInput: unknown): Promise<Result<any>> {
  return secureAction(
    rawInput,
    SearchLeadsInputSchema,
    async (ctx: ActionContext, input: z.infer<typeof SearchLeadsInputSchema>) => {
      // Ensure tenant context from secureAction
      const searchParams = {
        ...input,
        tenantId: ctx.tenantId,
      };

      // TODO(TASK-002): Replace with actual database search
      // For now, return mock data
      const mockLeads = [
        {
          id: crypto.randomUUID(),
          tenantId: searchParams.tenantId,
          email: 'john@example.com',
          name: 'John Doe',
          status: 'captured' as const,
          source: 'website' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          tenantId: searchParams.tenantId,
          email: 'jane@example.com',
          name: 'Jane Smith',
          status: 'qualified' as const,
          source: 'referral' as const,
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          updatedAt: new Date(),
        },
      ];

      // Apply filters (mock implementation)
      let filteredLeads = mockLeads;

      if (searchParams.status) {
        filteredLeads = filteredLeads.filter((lead) => lead.status === searchParams.status);
      }

      if (searchParams.source) {
        filteredLeads = filteredLeads.filter((lead) => lead.source === searchParams.source);
      }

      // Apply pagination
      const startIndex = searchParams.offset;
      const endIndex = startIndex + searchParams.limit;
      const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

      return {
        leads: paginatedLeads,
        total: filteredLeads.length,
        limit: searchParams.limit,
        offset: searchParams.offset,
      };
    },
    {
      actionName: 'searchLeads',
      requireAuth: true, // Require authentication for searching
      logLevel: 'info',
    }
  );
}

/**
 * Server Action to qualify a lead (change status to 'qualified')
 * @param rawInput - Lead ID and qualification score
 * @returns Result with updated lead or error information
 */
export async function qualifyLeadAction(rawInput: unknown): Promise<Result<any>> {
  const QualifyLeadSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    score: z.number().int().min(0).max(100).optional(),
  });

  return secureAction(
    rawInput,
    QualifyLeadSchema,
    async (ctx: ActionContext, input: z.infer<typeof QualifyLeadSchema>) => {
      // Ensure tenant context from secureAction
      if (input.tenantId !== ctx.tenantId) {
        throw new Error('Tenant context mismatch');
      }

      // TODO(DB-001): Replace with actual database update
      const qualifiedLead = {
        id: input.id,
        tenantId: ctx.tenantId,
        status: 'qualified' as const,
        score: input.score || 50,
        updatedAt: new Date(),
      };

      return qualifiedLead;
    },
    {
      actionName: 'qualifyLead',
      requireAuth: true, // Require authentication for qualifying
      logLevel: 'warn',
    }
  );
}

/**
 * Server Action to convert a lead (change status to 'converted')
 * @param rawInput - Lead ID and conversion data
 * @returns Result with updated lead or error information
 */
export async function convertLeadAction(rawInput: unknown): Promise<Result<any>> {
  const ConvertLeadSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    convertedAt: z.date().optional(),
  });

  return secureAction(
    rawInput,
    ConvertLeadSchema,
    async (ctx: ActionContext, input: z.infer<typeof ConvertLeadSchema>) => {
      // Ensure tenant context from secureAction
      if (input.tenantId !== ctx.tenantId) {
        throw new Error('Tenant context mismatch');
      }

      // TODO(DB-001): Replace with actual database update
      const convertedLead = {
        id: input.id,
        tenantId: ctx.tenantId,
        status: 'converted' as const,
        convertedAt: input.convertedAt || new Date(),
        updatedAt: new Date(),
      };

      return convertedLead;
    },
    {
      actionName: 'convertLead',
      requireAuth: true, // Require authentication for conversion
      logLevel: 'warn',
    }
  );
}

/**
 * Server Action to assign a lead to a user
 * @param rawInput - Lead ID and assignee user ID
 * @returns Result with updated lead or error information
 */
export async function assignLeadAction(rawInput: unknown): Promise<Result<any>> {
  const AssignLeadSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    assigneeUserId: z.string().uuid(),
  });

  return secureAction(
    rawInput,
    AssignLeadSchema,
    async (ctx: ActionContext, input: z.infer<typeof AssignLeadSchema>) => {
      // Ensure tenant context from secureAction
      if (input.tenantId !== ctx.tenantId) {
        throw new Error('Tenant context mismatch');
      }

      // TODO(DB-001): Replace with actual database update
      const assignedLead = {
        id: input.id,
        tenantId: ctx.tenantId,
        assigneeUserId: input.assigneeUserId,
        updatedAt: new Date(),
      };

      return assignedLead;
    },
    {
      actionName: 'assignLead',
      requireAuth: true, // Require authentication for assignment
      logLevel: 'warn',
    }
  );
}

/**
 * Server Action to get a single lead by ID
 * @param rawInput - Lead ID and tenant ID
 * @returns Result with lead data or error information
 */
export async function getLeadAction(rawInput: unknown): Promise<Result<any>> {
  const GetLeadSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
  });

  return secureAction(
    rawInput,
    GetLeadSchema,
    async (ctx: ActionContext, input: z.infer<typeof GetLeadSchema>) => {
      // Ensure tenant context from secureAction
      if (input.tenantId !== ctx.tenantId) {
        throw new Error('Tenant context mismatch');
      }

      // TODO(DB-001): Replace with actual database retrieval
      // For now, return mock data
      const lead = {
        id: input.id,
        tenantId: ctx.tenantId,
        email: 'example@example.com',
        name: 'Example Lead',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return lead;
    },
    {
      actionName: 'getLead',
      requireAuth: true, // Require authentication for reading
      logLevel: 'info',
    }
  );
}
