/**
 * @file packages/testing-contracts/src/types.ts
 * @summary Type definitions and interfaces for contract testing framework.
 * @security Test-only types; no runtime secrets exposed.
 * @requirements TASK-002-1: Create contract testing framework foundation
 */

import { z } from 'zod';

// Service provider types for external integrations
export enum ServiceProvider {
  STRIPE = 'stripe',
  SUPABASE = 'supabase',
  RESEND = 'resend',
  CONVERTKIT = 'convertkit',
  CRISP = 'crisp',
}

export const ServiceProviderSchema = z.nativeEnum(ServiceProvider);

// Contract testing states
export enum ContractState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

export const ContractStateSchema = z.nativeEnum(ContractState);

// Contract metadata
export const ContractMetadataSchema = z.object({
  version: z.string().default('1.0.0'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  provider: ServiceProviderSchema,
  environment: z.enum(['development', 'staging', 'production']),
  tags: z.array(z.string()).optional(),
});

export type ContractMetadata = z.infer<typeof ContractMetadataSchema>;

// Contract verification result
export const ContractVerificationResultSchema = z.object({
  success: z.boolean(),
  errors: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  duration: z.number(),
  verifiedAt: z.string().datetime(),
});

export type ContractVerificationResult = z.infer<typeof ContractVerificationResultSchema>;

// Contract publishing options
export const ContractPublishingOptionsSchema = z.object({
  brokerUrl: z.string().url(),
  username: z.string(),
  password: z.string(),
  tags: z.array(z.string()).optional(),
});

export type ContractPublishingOptions = z.infer<typeof ContractPublishingOptionsSchema>;

// Contract testing configuration
export const ContractTestingConfigSchema = z.object({
  provider: ServiceProviderSchema,
  baseUrl: z.string().url(),
  timeout: z.number().default(5000),
  retries: z.number().default(3),
  headers: z.record(z.string()).optional(),
  authentication: z
    .object({
      type: z.enum(['bearer', 'basic', 'api-key']),
      token: z.string().optional(),
      username: z.string().optional(),
      password: z.string().optional(),
    })
    .optional(),
});

export type ContractTestingConfig = z.infer<typeof ContractTestingConfigSchema>;
