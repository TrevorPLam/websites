/**
 * @file test-server-factory.ts
 * @summary Factory for creating test MCP server instances
 * @security Test-only factory; no production deployments
 */

import { MultiTenantOrchestrator } from '../../src/multi-tenant-orchestrator';
import { EnterpriseRegistry } from '../../src/enterprise-registry';
import { EnterpriseSecurityGateway } from '../../src/enterprise-security-gateway';
import { ObservabilityMonitor } from '../../src/observability-monitor';
import { SecureDeploymentManager } from '../../src/secure-deployment-manager';
import { EnterpriseMCPMarketplace } from '../../src/enterprise-mcp-marketplace';
import { createMockTestEnvironment } from '../fixtures/mock-external-integrations';

/**
 * Test server configuration
 */
export interface TestServerConfig {
  tenantId: string;
  userId: string;
  permissions: string[];
  isolationLevel: 'none' | 'logical' | 'strict' | 'isolated';
  enableSecurity: boolean;
  enableMonitoring: boolean;
  enableMarketplace: boolean;
}

/**
 * Default test configuration
 */
export const defaultTestConfig: TestServerConfig = {
  tenantId: 'test-tenant-123',
  userId: 'test-user-456',
  permissions: ['skill:execute', 'skill:deploy', 'tenant:read', 'tenant:write'],
  isolationLevel: 'strict',
  enableSecurity: true,
  enableMonitoring: true,
  enableMarketplace: true,
};

/**
 * Factory for creating test server instances
 */
export class TestServerFactory {
  private mockEnv = createMockTestEnvironment();
  
  /**
   * Create a test Multi-Tenant Orchestrator
   */
  createOrchestrator(config: Partial<TestServerConfig> = {}): MultiTenantOrchestrator {
    const finalConfig = { ...defaultTestConfig, ...config };
    
    return new MultiTenantOrchestrator({
      tenantId: finalConfig.tenantId,
      isolationLevel: finalConfig.isolationLevel,
      database: this.mockEnv.database,
      redis: this.mockEnv.redis,
      logger: this.mockEnv.logger,
      metrics: this.mockEnv.metrics,
      tracer: this.mockEnv.tracer,
    });
  }
  
  /**
   * Create a test Enterprise Registry
   */
  createRegistry(config: Partial<TestServerConfig> = {}): EnterpriseRegistry {
    const finalConfig = { ...defaultTestConfig, ...config };
    
    return new EnterpriseRegistry({
      database: this.mockEnv.database,
      redis: this.mockEnv.redis,
      logger: this.mockEnv.logger,
      metrics: this.mockEnv.metrics,
      tracer: this.mockEnv.tracer,
      enableSecurity: finalConfig.enableSecurity,
    });
  }
  
  /**
   * Create a test Enterprise Security Gateway
   */
  createSecurityGateway(config: Partial<TestServerConfig> = {}): EnterpriseSecurityGateway {
    const finalConfig = { ...defaultTestConfig, ...config };
    
    return new EnterpriseSecurityGateway({
      tenantId: finalConfig.tenantId,
      auth: this.mockEnv.auth,
      redis: this.mockEnv.redis,
      logger: this.mockEnv.logger,
      metrics: this.mockEnv.metrics,
      tracer: this.mockEnv.tracer,
      enableZeroTrust: true,
    });
  }
  
  /**
   * Create a test Observability Monitor
   */
  createObservabilityMonitor(config: Partial<TestServerConfig> = {}): ObservabilityMonitor {
    const finalConfig = { ...defaultTestConfig, ...config };
    
    return new ObservabilityMonitor({
      tenantId: finalConfig.tenantId,
      metrics: this.mockEnv.metrics,
      tracer: this.mockEnv.tracer,
      logger: this.mockEnv.logger,
      enableTracing: finalConfig.enableMonitoring,
      samplingRate: 0.1,
    });
  }
  
  /**
   * Create a test Secure Deployment Manager
   */
  createDeploymentManager(config: Partial<TestServerConfig> = {}): SecureDeploymentManager {
    const finalConfig = { ...defaultTestConfig, ...config };
    
    return new SecureDeploymentManager({
      tenantId: finalConfig.tenantId,
      aws: this.mockEnv.aws,
      database: this.mockEnv.database,
      logger: this.mockEnv.logger,
      metrics: this.mockEnv.metrics,
      tracer: this.mockEnv.tracer,
      enableSecurity: finalConfig.enableSecurity,
    });
  }
  
  /**
   * Create a test Enterprise MCP Marketplace
   */
  createMarketplace(config: Partial<TestServerConfig> = {}): EnterpriseMCPMarketplace {
    const finalConfig = { ...defaultTestConfig, ...config };
    
    return new EnterpriseMCPMarketplace({
      database: this.mockEnv.database,
      registry: this.createRegistry(config),
      deploymentManager: this.createDeploymentManager(config),
      logger: this.mockEnv.logger,
      metrics: this.mockEnv.metrics,
      tracer: this.mockEnv.tracer,
      enableMarketplace: finalConfig.enableMarketplace,
    });
  }
  
  /**
   * Create a complete test server stack
   */
  createTestStack(config: Partial<TestServerConfig> = {}) {
    const finalConfig = { ...defaultTestConfig, ...config };
    
    return {
      orchestrator: this.createOrchestrator(finalConfig),
      registry: this.createRegistry(finalConfig),
      securityGateway: this.createSecurityGateway(finalConfig),
      observabilityMonitor: this.createObservabilityMonitor(finalConfig),
      deploymentManager: this.createDeploymentManager(finalConfig),
      marketplace: this.createMarketplace(finalConfig),
      mockEnv: this.mockEnv,
    };
  }
  
  /**
   * Get mock environment for direct access
   */
  getMockEnvironment() {
    return this.mockEnv;
  }
  
  /**
   * Reset all mocks
   */
  resetMocks() {
    // Reset all mock implementations
    Object.values(this.mockEnv).forEach(mock => {
      if (mock && typeof mock === 'object' && 'clear' in mock) {
        (mock as any).clear();
      }
    });
  }
}

/**
 * Singleton instance
 */
export const testServerFactory = new TestServerFactory();

/**
 * Helper function to create test tenant
 */
export const createTestTenant = (id: string, overrides: Partial<any> = {}) => {
  return {
    id,
    name: `Test Tenant ${id}`,
    domain: `${id}.test.com`,
    plan: 'professional',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      isolationLevel: 'strict',
      enableSecurity: true,
      enableMonitoring: true,
    },
    ...overrides,
  };
};

/**
 * Helper function to create test skill
 */
export const createTestSkill = (name: string, overrides: Partial<any> = {}) => {
  return {
    name,
    version: '1.0.0',
    description: `Test skill ${name}`,
    author: {
      name: 'Test Author',
      email: 'test@example.com',
    },
    category: 'core',
    tags: ['test'],
    compatibility: {
      mcpVersion: '1.0.0',
      nodeVersion: '18',
      platforms: ['linux', 'darwin', 'win32'],
    },
    execution: {
      entryPoint: 'index.js',
      timeout: 30000,
      memory: 256,
    },
    security: {
      requiredPermissions: ['read', 'write'],
      restrictedActions: [],
      sandboxLevel: 'basic',
    },
    multiTenant: {
      supported: true,
      isolationLevel: 'strict',
    },
    monitoring: {
      emitMetrics: true,
      logLevel: 'info',
      tracing: {
        enabled: true,
        samplingRate: 0.1,
      },
    },
    marketplace: {
      listed: false,
    },
    interface: {
      inputs: [],
      outputs: [],
    },
    ...overrides,
  };
};

/**
 * Helper function to create test execution request
 */
export const createTestExecutionRequest = (overrides: Partial<any> = {}) => {
  return {
    skillId: 'test-skill-id',
    tenantId: defaultTestConfig.tenantId,
    inputs: {},
    execution: {
      timeout: 30000,
      priority: 'normal',
    },
    context: {
      userId: defaultTestConfig.userId,
      requestId: 'test-request-id',
      correlationId: 'test-correlation-id',
    },
    ...overrides,
  };
};
