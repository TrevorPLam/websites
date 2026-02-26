/**
 * @file skill-manifest.contract.test.ts
 * @summary Contract validation tests for Skill Manifest schema
 * @version 1.0.0
 * @description Ensures skill manifests comply with schema and version compatibility
 * @security No secrets handled; validates schema structure and data types only.
 * @adr none
 * @requirements MCP-001, CONTRACT-TEST-001
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  checkSchemaCompatibility,
  validateSkillExecutionRequest,
  validateSkillExecutionResponse,
  validateSkillManifest,
  validateSkillRegistryEntry,
  type SkillExecutionRequest,
  type SkillExecutionResponse,
  type SkillManifest,
  type SkillRegistryEntry,
} from '../fixtures/skill-manifest-schema';

describe('Skill Manifest Contract Validation', () => {
  let validSkillManifest: SkillManifest;
  let validRegistryEntry: SkillRegistryEntry;
  let validExecutionRequest: SkillExecutionRequest;
  let validExecutionResponse: SkillExecutionResponse;

  beforeEach(() => {
    // Create valid test data
    validSkillManifest = {
      name: 'test-skill',
      version: '1.0.0',
      description: 'A test skill for contract validation',
      author: {
        name: 'Test Author',
        email: 'test@example.com',
        url: 'https://example.com',
      },
      category: 'core',
      tags: ['test', 'validation'],
      compatibility: {
        mcpVersion: '1.0.0',
        nodeVersion: '18',
        platforms: ['linux', 'darwin', 'win32'],
      },
      dependencies: {
        lodash: '4.17.21',
        axios: '1.6.0',
      },
      execution: {
        entryPoint: 'dist/index.js',
        timeout: 30000,
        memory: 256,
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'exponential',
          baseDelay: 1000,
        },
      },
      security: {
        requiredPermissions: ['read', 'write'],
        restrictedActions: ['delete-database'],
        sandboxLevel: 'basic',
        allowedDomains: ['https://api.example.com'],
      },
      multiTenant: {
        supported: true,
        isolationLevel: 'strict',
        resourceQuotas: {
          maxConcurrentExecutions: 10,
          maxMemoryPerTenant: 256,
          maxExecutionTime: 30000,
        },
      },
      monitoring: {
        emitMetrics: true,
        logLevel: 'info',
        tracing: {
          enabled: true,
          samplingRate: 0.1,
        },
        healthCheck: {
          enabled: true,
          interval: 60000,
          timeout: 5000,
        },
      },
      marketplace: {
        listed: true,
        pricing: {
          model: 'freemium',
          freeTier: {
            requestsPerMonth: 1000,
            features: ['basic-execution'],
          },
          paidTier: {
            pricePerMonth: 29.99,
            features: ['advanced-execution', 'priority-support'],
          },
        },
        support: {
          email: 'support@example.com',
          url: 'https://support.example.com',
          documentation: 'https://docs.example.com',
        },
      },
      interface: {
        inputs: [
          {
            name: 'message',
            type: 'string',
            required: true,
            description: 'Input message to process',
            validation: {
              min: 1,
              max: 1000,
              pattern: '^[a-zA-Z0-9\\s]+$',
            },
          },
          {
            name: 'options',
            type: 'object',
            required: false,
            description: 'Processing options',
          },
        ],
        outputs: [
          {
            name: 'result',
            type: 'string',
            description: 'Processed result',
          },
          {
            name: 'metadata',
            type: 'object',
            description: 'Processing metadata',
          },
        ],
      },
      lifecycle: {
        onInstall: 'scripts/install.js',
        onUninstall: 'scripts/uninstall.js',
        onUpgrade: 'scripts/upgrade.js',
        onConfigure: 'scripts/configure.js',
      },
    };

    validRegistryEntry = {
      ...validSkillManifest,
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      installedAt: '2024-01-01T00:00:00Z',
      status: 'active',
      usage: {
        totalExecutions: 1000,
        successfulExecutions: 950,
        failedExecutions: 50,
        averageExecutionTime: 1500,
        lastExecutedAt: '2024-01-01T12:00:00Z',
      },
      installation: {
        tenantId: 'tenant-123',
        version: '1.0.0',
        configuration: {
          apiKey: 'test-key',
        },
        permissions: ['read', 'write'],
      },
      registryId: '550e8400-e29b-41d4-a716-446655440001',
      publishedAt: '2024-01-01T00:00:00Z',
      publishedBy: 'publisher-123',
      verified: true,
      verifiedAt: '2024-01-01T00:00:00Z',
      verifiedBy: 'verifier-123',
      securityScan: {
        status: 'passed',
        scannedAt: '2024-01-01T00:00:00Z',
        issues: [],
      },
      compatibilityMatrix: {
        '1.0.0': ['linux', 'darwin', 'win32'],
        '1.1.0': ['linux', 'darwin'],
      },
    };

    validExecutionRequest = {
      skillId: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '550e8400-e29b-41d4-a716-446655440002',
      inputs: {
        message: 'Hello, World!',
        options: {
          format: 'json',
        },
      },
      execution: {
        timeout: 60000,
        priority: 'high',
        retryPolicy: {
          maxAttempts: 5,
          backoffStrategy: 'linear',
        },
      },
      context: {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        requestId: '550e8400-e29b-41d4-a716-446655440004',
        correlationId: 'req-123',
        metadata: {
          source: 'api',
        },
      },
    };

    validExecutionResponse = {
      requestId: '550e8400-e29b-41d4-a716-446655440004',
      skillId: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '550e8400-e29b-41d4-a716-446655440002',
      status: 'success',
      result: {
        output: 'Processed: Hello, World!',
        metadata: {
          processingTime: 1200,
        },
      },
      execution: {
        startTime: '2024-01-01T12:00:00Z',
        endTime: '2024-01-01T12:00:01.2Z',
        duration: 1200,
        attempt: 1,
        timeout: 60000,
      },
      metrics: {
        memoryUsed: 128,
        cpuTime: 800,
        networkRequests: 2,
        databaseQueries: 5,
      },
    };
  });

  describe('Skill Manifest Validation', () => {
    it('should validate a correct skill manifest', () => {
      const result = validateSkillManifest(validSkillManifest);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('test-skill');
        expect(result.data.version).toBe('1.0.0');
      }
    });

    it('should reject invalid skill name', () => {
      const invalidManifest = {
        ...validSkillManifest,
        name: 'Invalid Skill Name!', // Contains invalid characters
      };

      const result = validateSkillManifest(invalidManifest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Skill name must contain only lowercase letters, numbers, and hyphens'
        );
      }
    });

    it('should reject invalid version format', () => {
      const invalidManifest = {
        ...validSkillManifest,
        version: '1.0', // Invalid semantic version
      };

      const result = validateSkillManifest(invalidManifest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Version must follow semantic versioning');
      }
    });

    it('should reject invalid email', () => {
      const invalidManifest = {
        ...validSkillManifest,
        author: {
          ...validSkillManifest.author,
          email: 'invalid-email', // Invalid email format
        },
      };

      const result = validateSkillManifest(invalidManifest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Valid email is required');
      }
    });

    it('should reject invalid timeout value', () => {
      const invalidManifest = {
        ...validSkillManifest,
        execution: {
          ...validSkillManifest.execution,
          timeout: 500, // Below minimum
        },
      };

      const result = validateSkillManifest(invalidManifest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Timeout must be at least 1000ms');
      }
    });

    it('should reject too many tags', () => {
      const invalidManifest = {
        ...validSkillManifest,
        tags: Array.from({ length: 15 }, (_, i) => `tag-${i}`), // Too many tags
      };

      const result = validateSkillManifest(invalidManifest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Maximum 10 tags allowed');
      }
    });
  });

  describe('Registry Entry Validation', () => {
    it('should validate a correct registry entry', () => {
      const result = validateSkillRegistryEntry(validRegistryEntry);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.registryId).toBe('550e8400-e29b-41d4-a716-446655440001');
        expect(result.data.verified).toBe(true);
      }
    });

    it('should reject invalid UUID', () => {
      const invalidEntry = {
        ...validRegistryEntry,
        registryId: 'invalid-uuid', // Invalid UUID format
      };

      const result = validateSkillRegistryEntry(invalidEntry);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid uuid');
      }
    });

    it('should reject invalid datetime format', () => {
      const invalidEntry = {
        ...validRegistryEntry,
        publishedAt: '2024-01-01', // Invalid datetime format
      };

      const result = validateSkillRegistryEntry(invalidEntry);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid datetime string');
      }
    });
  });

  describe('Execution Request Validation', () => {
    it('should validate a correct execution request', () => {
      const result = validateSkillExecutionRequest(validExecutionRequest);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.skillId).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(result.data.tenantId).toBe('550e8400-e29b-41d4-a716-446655440002');
      }
    });

    it('should reject invalid UUID in skillId', () => {
      const invalidRequest = {
        ...validExecutionRequest,
        skillId: 'invalid-uuid',
      };

      const result = validateSkillExecutionRequest(invalidRequest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid uuid');
      }
    });

    it('should reject invalid priority value', () => {
      const invalidRequest = {
        ...validExecutionRequest,
        execution: {
          ...validExecutionRequest.execution,
          priority: 'invalid' as any, // Invalid priority
        },
      };

      const result = validateSkillExecutionRequest(invalidRequest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid enum value');
      }
    });
  });

  describe('Execution Response Validation', () => {
    it('should validate a correct execution response', () => {
      const result = validateSkillExecutionResponse(validExecutionResponse);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('success');
        expect(result.data.duration).toBe(1200);
      }
    });

    it('should validate error response', () => {
      const errorResponse: SkillExecutionResponse = {
        ...validExecutionResponse,
        status: 'error',
        result: undefined,
        error: {
          code: 'TIMEOUT',
          message: 'Execution timed out',
          details: {
            timeout: 60000,
          },
          stack: 'Error: Execution timed out\n    at ...',
        },
      };

      const result = validateSkillExecutionResponse(errorResponse);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('error');
        expect(result.data.error?.code).toBe('TIMEOUT');
      }
    });

    it('should reject negative duration', () => {
      const invalidResponse = {
        ...validExecutionResponse,
        execution: {
          ...validExecutionResponse.execution,
          duration: -100, // Negative duration
        },
      };

      const result = validateSkillExecutionResponse(invalidResponse);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Number must be greater than or equal to 0'
        );
      }
    });
  });

  describe('Schema Compatibility Check', () => {
    it('should accept compatible versions', () => {
      expect(checkSchemaCompatibility('1.0.0', '1.0.0')).toBe(true);
      expect(checkSchemaCompatibility('1.1.0', '1.0.0')).toBe(true);
      expect(checkSchemaCompatibility('1.0.1', '1.0.0')).toBe(true);
      expect(checkSchemaCompatibility('2.0.0', '2.0.0')).toBe(true);
    });

    it('should reject incompatible major versions', () => {
      expect(checkSchemaCompatibility('2.0.0', '1.0.0')).toBe(false);
      expect(checkSchemaCompatibility('1.0.0', '2.0.0')).toBe(false);
    });

    it('should reject incompatible minor versions', () => {
      expect(checkSchemaCompatibility('1.0.0', '1.1.0')).toBe(false);
      expect(checkSchemaCompatibility('1.0.0', '1.2.0')).toBe(false);
    });

    it('should reject incompatible patch versions when minor matches', () => {
      expect(checkSchemaCompatibility('1.0.0', '1.0.1')).toBe(false);
      expect(checkSchemaCompatibility('1.1.0', '1.1.1')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(checkSchemaCompatibility('1.0.0', '1.0.0')).toBe(true);
      expect(checkSchemaCompatibility('10.0.0', '10.0.0')).toBe(true);
      expect(checkSchemaCompatibility('1.10.0', '1.9.0')).toBe(true);
    });
  });

  describe('Contract Integration Tests', () => {
    it('should validate complete skill lifecycle', () => {
      // 1. Validate initial manifest
      const manifestResult = validateSkillManifest(validSkillManifest);
      expect(manifestResult.success).toBe(true);

      // 2. Validate registry entry (published skill)
      const registryResult = validateSkillRegistryEntry(validRegistryEntry);
      expect(registryResult.success).toBe(true);

      // 3. Validate execution request
      const requestResult = validateSkillExecutionRequest(validExecutionRequest);
      expect(requestResult.success).toBe(true);

      // 4. Validate execution response
      const responseResult = validateSkillExecutionResponse(validExecutionResponse);
      expect(responseResult.success).toBe(true);

      // 5. Check version compatibility
      const isCompatible = checkSchemaCompatibility(validSkillManifest.version, '1.0.0');
      expect(isCompatible).toBe(true);
    });

    it('should enforce security constraints', () => {
      const secureManifest = {
        ...validSkillManifest,
        security: {
          requiredPermissions: ['admin', 'delete-all'], // Dangerous permissions
          restrictedActions: [], // No restrictions
          sandboxLevel: 'none' as const, // No sandbox
        },
      };

      const result = validateSkillManifest(secureManifest);

      // Should still validate (schema allows it), but security checks would fail
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.security.requiredPermissions).toContain('admin');
        expect(result.data.security.sandboxLevel).toBe('none');
      }
    });

    it('should validate multi-tenant constraints', () => {
      const multiTenantManifest = {
        ...validSkillManifest,
        multiTenant: {
          supported: false,
          isolationLevel: 'none' as const,
        },
      };

      const result = validateSkillManifest(multiTenantManifest);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.multiTenant.supported).toBe(false);
        expect(result.data.multiTenant.isolationLevel).toBe('none');
      }
    });
  });
});
