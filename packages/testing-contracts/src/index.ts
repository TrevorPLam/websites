/**
 * @file packages/testing-contracts/src/index.ts
 * @summary API contract testing framework with Pact-based architecture for external service integrations.
 * @security Test-only framework; no runtime secrets exposed. Uses Pact for consumer-driven contract testing.
 * @requirements TASK-002-1: Create contract testing framework foundation
 */

import { Pact } from '@pact-foundation/pact';
import { z } from 'zod';

// Core contract testing types and schemas
export const ContractConfigSchema = z.object({
  consumer: z.string(),
  provider: z.string(),
  port: z.number().default(1234),
  host: z.string().default('localhost'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  timeout: z.number().default(5000),
});

export type ContractConfig = z.infer<typeof ContractConfigSchema>;

export const ContractRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  path: z.string(),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
  query: z.record(z.string()).optional(),
});

export type ContractRequest = z.infer<typeof ContractRequestSchema>;

export const ContractResponseSchema = z.object({
  status: z.number(),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
});

export type ContractResponse = z.infer<typeof ContractResponseSchema>;

export const ContractInteractionSchema = z.object({
  description: z.string(),
  request: ContractRequestSchema,
  response: ContractResponseSchema,
});

export type ContractInteraction = z.infer<typeof ContractInteractionSchema>;

/**
 * Base Contract Testing Framework Class
 * Provides foundation for consumer-driven contract testing with Pact
 */
export class ContractTestingFramework {
  private pact: Pact;
  private config: ContractConfig;

  constructor(config: ContractConfig) {
    this.config = ContractConfigSchema.parse(config);
    this.pact = new Pact({
      consumer: this.config.consumer,
      provider: this.config.provider,
      port: this.config.port,
      host: this.config.host,
      log: this.config.logLevel,
      spec: 2,
    });
  }

  /**
   * Setup contract testing environment
   */
  async setup(): Promise<void> {
    await this.pact.setup();
  }

  /**
   * Teardown contract testing environment
   */
  async teardown(): Promise<void> {
    await this.pact.finalize();
  }

  /**
   * Add interaction to contract
   */
  addInteraction(interaction: ContractInteraction): void {
    const validatedInteraction = ContractInteractionSchema.parse(interaction);

    this.pact.addInteraction({
      state: validatedInteraction.description,
      uponReceiving: validatedInteraction.description,
      withRequest: {
        method: validatedInteraction.request.method,
        path: validatedInteraction.request.path,
        headers: validatedInteraction.request.headers,
        body: validatedInteraction.request.body,
        query: validatedInteraction.request.query,
      },
      willRespondWith: {
        status: validatedInteraction.response.status,
        headers: validatedInteraction.response.headers,
        body: validatedInteraction.response.body,
      },
    });
  }

  /**
   * Execute contract test
   */
  async execute(): Promise<void> {
    await this.pact.verify();
  }

  /**
   * Write contract to file
   */
  async writeContract(): Promise<void> {
    await this.pact.writePact();
  }

  /**
   * Get Pact instance for advanced usage
   */
  getPactInstance(): Pact {
    return this.pact;
  }

  /**
   * Validate contract configuration
   */
  validateConfig(): boolean {
    try {
      ContractConfigSchema.parse(this.config);
      return true;
    } catch (error) {
      console.error('Contract configuration validation failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create contract testing framework
 */
export function createContractTestingFramework(config: ContractConfig): ContractTestingFramework {
  return new ContractTestingFramework(config);
}

/**
 * Validation functions
 */
export function validateContractConfig(config: unknown): ContractConfig {
  return ContractConfigSchema.parse(config);
}

/**
 * Validates contract interaction data against schema
 * @param interaction - Raw interaction data to validate
 * @returns Validated contract interaction
 */
export function validateContractInteraction(interaction: unknown): ContractInteraction {
  return ContractInteractionSchema.parse(interaction);
}

/**
 * Utility functions for contract testing
 */
export const ContractTestingUtils = {
  /**
   * Generate mock response for common patterns
   */
  generateMockResponse(status: number, data?: any): ContractResponse {
    return {
      status,
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  },

  /**
   * Generate standard error response
   */
  generateErrorResponse(error: string, status: number = 500): ContractResponse {
    return {
      status,
      body: {
        error: error,
        timestamp: new Date().toISOString(),
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  },

  /**
   * Generate success response
   */
  generateSuccessResponse(data: any, status: number = 200): ContractResponse {
    return {
      status,
      body: {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  },
};

// Export types and schemas for external use
export {
  ContractConfigSchema,
  ContractInteractionSchema,
  ContractRequestSchema,
  ContractResponseSchema,
};
export type { ContractConfig, ContractInteraction, ContractRequest, ContractResponse };
