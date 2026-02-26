/**
 * @file skill-manifest-schema.ts
 * @summary Skill Manifest schema definition using Zod
 * @version 1.0.0
 * @description Defines the contract for skill manifests in the MCP ecosystem
 * @security No secrets handled; schema validation and type definitions only.
 * @adr none
 * @requirements MCP-001, SCHEMA-001
 */

import { z } from 'zod';

/**
 * Base skill manifest schema
 */
export const SkillManifestSchema = z.object({
  // Basic metadata
  name: z
    .string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Skill name must contain only lowercase letters, numbers, and hyphens'),

  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (x.y.z)'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),

  author: z.object({
    name: z.string().min(1, 'Author name is required'),
    email: z.string().email('Valid email is required'),
    url: z.string().url('Valid URL is required').optional(),
  }),

  // Skill classification
  category: z.enum([
    'core',
    'integration',
    'domain',
    'utility',
    'security',
    'monitoring',
    'deployment',
  ]),

  tags: z
    .array(z.string().min(1).max(50))
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed'),

  // Compatibility and requirements
  compatibility: z.object({
    mcpVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'MCP version must follow semantic versioning'),

    nodeVersion: z.string().regex(/^\d+\.\d+$/, 'Node version must be in format x.y'),

    platforms: z
      .array(z.enum(['linux', 'darwin', 'win32']))
      .min(1, 'At least one platform is required'),
  }),

  // Dependencies
  dependencies: z
    .record(z.string().regex(/^\d+\.\d+\.\d+$/))
    .optional()
    .default({}),

  // Skill execution configuration
  execution: z.object({
    entryPoint: z.string().min(1, 'Entry point is required'),

    timeout: z
      .number()
      .int('Timeout must be an integer')
      .min(1000, 'Timeout must be at least 1000ms')
      .max(300000, 'Timeout must not exceed 5 minutes'),

    memory: z
      .number()
      .int('Memory must be an integer')
      .min(64, 'Memory must be at least 64MB')
      .max(2048, 'Memory must not exceed 2GB'),

    retryPolicy: z
      .object({
        maxAttempts: z.number().int().min(0).max(10).default(3),
        backoffStrategy: z.enum(['linear', 'exponential']).default('exponential'),
        baseDelay: z.number().int().min(100).max(10000).default(1000),
      })
      .optional(),
  }),

  // Security configuration
  security: z.object({
    requiredPermissions: z
      .array(z.string())
      .min(0, 'Permissions array cannot be negative')
      .max(20, 'Maximum 20 permissions allowed'),

    restrictedActions: z
      .array(z.string())
      .min(0, 'Restricted actions array cannot be negative')
      .max(50, 'Maximum 50 restricted actions allowed'),

    sandboxLevel: z.enum(['none', 'basic', 'strict', 'isolated']).default('basic'),

    allowedDomains: z
      .array(z.string().url())
      .min(0, 'Allowed domains array cannot be negative')
      .max(100, 'Maximum 100 allowed domains')
      .optional(),
  }),

  // Multi-tenant configuration
  multiTenant: z.object({
    supported: z.boolean().default(false),

    isolationLevel: z.enum(['none', 'logical', 'strict', 'isolated']).default('none'),

    resourceQuotas: z
      .object({
        maxConcurrentExecutions: z.number().int().min(1).max(1000).default(10),
        maxMemoryPerTenant: z.number().int().min(64).max(1024).default(256),
        maxExecutionTime: z.number().int().min(1000).max(300000).default(30000),
      })
      .optional(),
  }),

  // Monitoring and observability
  monitoring: z.object({
    emitMetrics: z.boolean().default(true),

    logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

    tracing: z
      .object({
        enabled: z.boolean().default(true),
        samplingRate: z.number().min(0).max(1).default(0.1),
      })
      .optional(),

    healthCheck: z
      .object({
        enabled: z.boolean().default(true),
        interval: z.number().int().min(10000).max(300000).default(60000),
        timeout: z.number().int().min(1000).max(10000).default(5000),
      })
      .optional(),
  }),

  // Marketplace configuration
  marketplace: z.object({
    listed: z.boolean().default(false),

    pricing: z
      .object({
        model: z.enum(['free', 'freemium', 'paid', 'usage-based']),

        freeTier: z
          .object({
            requestsPerMonth: z.number().int().min(0).optional(),
            features: z.array(z.string()).optional(),
          })
          .optional(),

        paidTier: z
          .object({
            pricePerMonth: z.number().min(0).optional(),
            pricePerRequest: z.number().min(0).optional(),
            features: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),

    support: z
      .object({
        email: z.string().email().optional(),
        url: z.string().url().optional(),
        documentation: z.string().url().optional(),
      })
      .optional(),
  }),

  // Skill inputs and outputs
  interface: z.object({
    inputs: z
      .array(
        z.object({
          name: z.string().min(1).max(50),
          type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
          required: z.boolean().default(false),
          description: z.string().min(1).max(200),
          validation: z
            .object({
              min: z.number().optional(),
              max: z.number().optional(),
              pattern: z.string().optional(),
              enum: z.array(z.any()).optional(),
            })
            .optional(),
        })
      )
      .optional(),

    outputs: z
      .array(
        z.object({
          name: z.string().min(1).max(50),
          type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
          description: z.string().min(1).max(200),
        })
      )
      .optional(),
  }),

  // Skill lifecycle hooks
  lifecycle: z
    .object({
      onInstall: z.string().optional(),
      onUninstall: z.string().optional(),
      onUpgrade: z.string().optional(),
      onConfigure: z.string().optional(),
    })
    .optional(),
});

/**
 * Skill manifest with computed fields
 */
export const SkillManifestWithMetadataSchema = SkillManifestSchema.extend({
  // Computed fields
  id: z.string().optional(), // Generated by registry
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  installedAt: z.string().datetime().optional(),

  // Runtime status
  status: z
    .enum(['draft', 'published', 'installed', 'active', 'inactive', 'error', 'deprecated'])
    .optional(),

  // Usage statistics
  usage: z
    .object({
      totalExecutions: z.number().int().min(0).default(0),
      successfulExecutions: z.number().int().min(0).default(0),
      failedExecutions: z.number().int().min(0).default(0),
      averageExecutionTime: z.number().min(0).default(0),
      lastExecutedAt: z.string().datetime().optional(),
    })
    .optional(),

  // Installation details
  installation: z
    .object({
      tenantId: z.string().optional(),
      version: z.string().optional(),
      configuration: z.record(z.any()).optional(),
      permissions: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Skill registry entry
 */
export const SkillRegistryEntrySchema = SkillManifestWithMetadataSchema.extend({
  // Registry-specific fields
  registryId: z.string().uuid(),

  // Publication details
  publishedAt: z.string().datetime(),
  publishedBy: z.string(),

  // Verification status
  verified: z.boolean().default(false),
  verifiedAt: z.string().datetime().optional(),
  verifiedBy: z.string().optional(),

  // Security scan results
  securityScan: z
    .object({
      status: z.enum(['pending', 'passed', 'failed', 'warning']),
      scannedAt: z.string().datetime(),
      issues: z.array(
        z.object({
          severity: z.enum(['low', 'medium', 'high', 'critical']),
          type: z.string(),
          description: z.string(),
          recommendation: z.string().optional(),
        })
      ),
    })
    .optional(),

  // Compatibility matrix
  compatibilityMatrix: z.record(z.array(z.string())).optional(),
});

/**
 * Skill execution request
 */
export const SkillExecutionRequestSchema = z.object({
  skillId: z.string().uuid(),
  tenantId: z.string().uuid(),

  inputs: z.record(z.any()).optional(),

  execution: z
    .object({
      timeout: z.number().int().min(1000).max(300000).optional(),
      priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
      retryPolicy: z
        .object({
          maxAttempts: z.number().int().min(0).max(10).default(3),
          backoffStrategy: z.enum(['linear', 'exponential']).default('exponential'),
        })
        .optional(),
    })
    .optional(),

  context: z
    .object({
      userId: z.string().uuid().optional(),
      requestId: z.string().uuid().optional(),
      correlationId: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    })
    .optional(),
});

/**
 * Skill execution response
 */
export const SkillExecutionResponseSchema = z.object({
  requestId: z.string().uuid(),
  skillId: z.string().uuid(),
  tenantId: z.string().uuid(),

  status: z.enum(['success', 'error', 'timeout', 'cancelled']),

  result: z.any().optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.any().optional(),
      stack: z.string().optional(),
    })
    .optional(),

  execution: z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    duration: z.number().int().min(0),
    attempt: z.number().int().min(1),
    timeout: z.number().int().optional(),
  }),

  metrics: z
    .object({
      memoryUsed: z.number().int().min(0),
      cpuTime: z.number().min(0),
      networkRequests: z.number().int().min(0),
      databaseQueries: z.number().int().min(0),
    })
    .optional(),
});

/**
 * Type exports
 */
export type SkillManifest = z.infer<typeof SkillManifestSchema>;
export type SkillManifestWithMetadata = z.infer<typeof SkillManifestWithMetadataSchema>;
export type SkillRegistryEntry = z.infer<typeof SkillRegistryEntrySchema>;
export type SkillExecutionRequest = z.infer<typeof SkillExecutionRequestSchema>;
export type SkillExecutionResponse = z.infer<typeof SkillExecutionResponseSchema>;

/**
 * Validation helpers
 */
export const validateSkillManifest = (data: unknown) => {
  return SkillManifestSchema.safeParse(data);
};

export const validateSkillRegistryEntry = (data: unknown) => {
  return SkillRegistryEntrySchema.safeParse(data);
};

export const validateSkillExecutionRequest = (data: unknown) => {
  return SkillExecutionRequestSchema.safeParse(data);
};

export const validateSkillExecutionResponse = (data: unknown) => {
  return SkillExecutionResponseSchema.safeParse(data);
};

/**
 * Schema version compatibility check
 */
export const checkSchemaCompatibility = (
  manifestVersion: string,
  requiredVersion: string
): boolean => {
  const parseVersion = (version: string) => {
    const [major, minor, patch] = version.split('.').map(Number);
    return { major, minor, patch };
  };

  const manifest = parseVersion(manifestVersion);
  const required = parseVersion(requiredVersion);

  // Major version must match
  if (manifest.major !== required.major) {
    return false;
  }

  // Minor version must be >= required
  if (manifest.minor < required.minor) {
    return false;
  }

  // If minor version matches, patch must be >= required
  if (manifest.minor === required.minor && manifest.patch < required.patch) {
    return false;
  }

  return true;
};
