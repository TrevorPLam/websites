/**
 * @file packages/testing-chaos/src/database-failure.ts
 * @summary Database connection failure simulation and recovery testing utilities
 * @see TASKS1.md TASK-005.2 Chaos Engineering Implementation
 *
 * Purpose: Production-ready database failure simulation for chaos engineering.
 * Provides realistic database failure scenarios and recovery pattern testing.
 *
 * Exports / Entry: DatabaseFailureSimulator, ConnectionFailureTypes, RecoveryStrategies
 * Used by: Chaos testing suites, resilience validation, system recovery testing
 *
 * Security Features:
 * - Isolated failure simulation (no production impact)
 * - Configurable failure probability and patterns
 * - Automatic recovery and cleanup mechanisms
 * - Multi-tenant failure isolation testing
 *
 * Dependencies:
 * - @supabase/supabase-js for database client mocking
 * - Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
 *
 * Status: @production-ready
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Types of database connection failures to simulate
 */
export enum ConnectionFailureTypes {
  CONNECTION_TIMEOUT = 'connection_timeout',
  CONNECTION_POOL_EXHAUSTED = 'connection_pool_exhausted',
  NETWORK_PARTITION = 'network_partition',
  DATABASE_OVERLOAD = 'database_overload',
  AUTHENTICATION_FAILURE = 'authentication_failure',
  QUERY_TIMEOUT = 'query_timeout',
  DEADLOCK_DETECTED = 'deadlock_detected',
  DISK_FULL = 'disk_full',
  MEMORY_EXHAUSTED = 'memory_exhausted',
  REPLICATION_LAG = 'replication_lag',
}

/**
 * Recovery strategy patterns
 */
export enum RecoveryStrategies {
  EXPONENTIAL_BACKOFF = 'exponential_backoff',
  LINEAR_BACKOFF = 'linear_backoff',
  CIRCUIT_BREAKER = 'circuit_breaker',
  FAILOVER = 'failover',
  GRACEFUL_DEGRADATION = 'graceful_degradation',
  RETRY_WITH_JITTER = 'retry_with_jitter',
}

/**
 * Configuration for database failure simulation
 */
export interface DatabaseFailureConfig {
  failureType: ConnectionFailureTypes;
  probability: number; // 0.0 to 1.0
  duration?: number; // Duration in milliseconds
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recoveryStrategy?: RecoveryStrategies;
  maxRetries?: number;
  retryDelay?: number;
  tenantIsolation?: boolean; // Test multi-tenant isolation
}

/**
 * Database failure simulation metrics
 */
export interface FailureMetrics {
  totalAttempts: number;
  successfulConnections: number;
  failedConnections: number;
  averageRecoveryTime: number;
  failureType: ConnectionFailureTypes;
  recoveryStrategy: RecoveryStrategies;
  tenantIsolationViolations: number;
}

/**
 * Database connection state for simulation
 */
export interface ConnectionState {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
  tenantId?: string;
  queryCount: number;
}

/**
 * Database Failure Simulator Class
 *
 * Provides comprehensive database failure simulation for chaos engineering.
 * Tests system resilience under various database failure scenarios.
 */
export class DatabaseFailureSimulator {
  private activeFailures = new Map<ConnectionFailureTypes, DatabaseFailureConfig>();
  private connectionStates = new Map<string, ConnectionState>();
  private metrics = new Map<ConnectionFailureTypes, FailureMetrics>();
  private circuitBreakerStates = new Map<
    string,
    { isOpen: boolean; openedAt: Date; failures: number }
  >();

  constructor(
    private readonly supabaseUrl: string = process.env.SUPABASE_URL!,
    private readonly supabaseKey: string = process.env.SUPABASE_ANON_KEY!
  ) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured');
    }
  }

  /**
   * Inject a specific database failure scenario
   */
  injectFailure(config: DatabaseFailureConfig): void {
    this.activeFailures.set(config.failureType, config);

    // Initialize metrics for this failure type
    if (!this.metrics.has(config.failureType)) {
      this.metrics.set(config.failureType, {
        totalAttempts: 0,
        successfulConnections: 0,
        failedConnections: 0,
        averageRecoveryTime: 0,
        failureType: config.failureType,
        recoveryStrategy: config.recoveryStrategy || RecoveryStrategies.EXPONENTIAL_BACKOFF,
        tenantIsolationViolations: 0,
      });
    }
  }

  /**
   * Clear all active failure simulations
   */
  clearFailures(): void {
    this.activeFailures.clear();
    this.connectionStates.clear();
    this.circuitBreakerStates.clear();
  }

  /**
   * Check if a specific failure should be injected
   */
  shouldInjectFailure(failureType: ConnectionFailureTypes): boolean {
    const config = this.activeFailures.get(failureType);
    return config ? Math.random() < config.probability : false;
  }

  /**
   * Get configuration for a specific failure type
   */
  getFailureConfig(failureType: ConnectionFailureTypes): DatabaseFailureConfig | undefined {
    return this.activeFailures.get(failureType);
  }

  /**
   * Simulate database connection with potential failures
   */
  async simulateConnection(tenantId?: string): Promise<SupabaseClient> {
    const connectionId = `conn-${Date.now()}-${Math.random()}`;

    // Record connection state
    this.connectionStates.set(connectionId, {
      id: connectionId,
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
      tenantId,
      queryCount: 0,
    });

    try {
      // Check for active failures
      for (const [failureType, config] of this.activeFailures) {
        if (this.shouldInjectFailure(failureType)) {
          await this.simulateSpecificFailure(failureType, config, connectionId, tenantId);
        }
      }

      // Create actual database connection
      const client = createClient(this.supabaseUrl, this.supabaseKey);

      // Update metrics
      this.updateMetrics(ConnectionFailureTypes.CONNECTION_TIMEOUT, true);

      return client;
    } catch (error) {
      this.updateMetrics(ConnectionFailureTypes.CONNECTION_TIMEOUT, false);
      throw error;
    }
  }

  /**
   * Simulate specific database failure types
   */
  private async simulateSpecificFailure(
    failureType: ConnectionFailureTypes,
    config: DatabaseFailureConfig,
    connectionId: string,
    tenantId?: string
  ): Promise<void> {
    const metrics = this.metrics.get(failureType)!;
    metrics.totalAttempts++;

    switch (failureType) {
      case ConnectionFailureTypes.CONNECTION_TIMEOUT:
        await this.simulateConnectionTimeout(config, connectionId);
        break;

      case ConnectionFailureTypes.CONNECTION_POOL_EXHAUSTED:
        await this.simulatePoolExhaustion(config, connectionId);
        break;

      case ConnectionFailureTypes.NETWORK_PARTITION:
        await this.simulateNetworkPartition(config, connectionId);
        break;

      case ConnectionFailureTypes.DATABASE_OVERLOAD:
        await this.simulateDatabaseOverload(config, connectionId);
        break;

      case ConnectionFailureTypes.AUTHENTICATION_FAILURE:
        await this.simulateAuthenticationFailure(config, connectionId);
        break;

      case ConnectionFailureTypes.QUERY_TIMEOUT:
        await this.simulateQueryTimeout(config, connectionId);
        break;

      case ConnectionFailureTypes.DEADLOCK_DETECTED:
        await this.simulateDeadlock(config, connectionId);
        break;

      case ConnectionFailureTypes.DISK_FULL:
        await this.simulateDiskFull(config, connectionId);
        break;

      case ConnectionFailureTypes.MEMORY_EXHAUSTED:
        await this.simulateMemoryExhausted(config, connectionId);
        break;

      case ConnectionFailureTypes.REPLICATION_LAG:
        await this.simulateReplicationLag(config, connectionId, tenantId);
        break;

      default:
        throw new Error(`Unknown failure type: ${failureType}`);
    }
  }

  /**
   * Simulate connection timeout
   */
  private async simulateConnectionTimeout(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    const timeout = config.duration || 30000;
    await new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), timeout);
    });
  }

  /**
   * Simulate connection pool exhaustion
   */
  private async simulatePoolExhaustion(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    throw new Error('Connection pool exhausted - maximum connections reached');
  }

  /**
   * Simulate network partition
   */
  private async simulateNetworkPartition(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    throw new Error('Network partition - database unreachable');
  }

  /**
   * Simulate database overload
   */
  private async simulateDatabaseOverload(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    // Simulate high load with delayed response
    const delay = config.duration || 10000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Randomly fail based on severity
    if (config.severity === 'critical' || (config.severity === 'high' && Math.random() < 0.7)) {
      throw new Error('Database overload - service unavailable');
    }
  }

  /**
   * Simulate authentication failure
   */
  private async simulateAuthenticationFailure(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    throw new Error('Authentication failed - invalid credentials');
  }

  /**
   * Simulate query timeout
   */
  private async simulateQueryTimeout(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    const timeout = config.duration || 30000;
    await new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), timeout);
    });
  }

  /**
   * Simulate deadlock detection
   */
  private async simulateDeadlock(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    throw new Error('Deadlock detected - transaction rolled back');
  }

  /**
   * Simulate disk full condition
   */
  private async simulateDiskFull(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    throw new Error('Disk full - cannot write to database');
  }

  /**
   * Simulate memory exhaustion
   */
  private async simulateMemoryExhausted(
    config: DatabaseFailureConfig,
    connectionId: string
  ): Promise<void> {
    throw new Error('Memory exhausted - database out of memory');
  }

  /**
   * Simulate replication lag (multi-tenant specific)
   */
  private async simulateReplicationLag(
    config: DatabaseFailureConfig,
    connectionId: string,
    tenantId?: string
  ): Promise<void> {
    if (config.tenantIsolation && tenantId) {
      // Test tenant isolation during replication lag
      const lag = config.duration || 5000;
      await new Promise((resolve) => setTimeout(resolve, lag));

      // Check for tenant isolation violations
      if (Math.random() < 0.1) {
        // 10% chance of isolation violation
        const metrics = this.metrics.get(ConnectionFailureTypes.REPLICATION_LAG)!;
        metrics.tenantIsolationViolations++;
        throw new Error(
          `Tenant isolation violation during replication lag for tenant: ${tenantId}`
        );
      }
    }
  }

  /**
   * Execute operation with retry logic and recovery strategy
   */
  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    failureType: ConnectionFailureTypes,
    tenantId?: string
  ): Promise<T> {
    const config = this.getFailureConfig(failureType);
    if (!config) {
      return operation();
    }

    const maxRetries = config.maxRetries || 3;
    const baseDelay = config.retryDelay || 1000;
    const strategy = config.recoveryStrategy || RecoveryStrategies.EXPONENTIAL_BACKOFF;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();

        // Update success metrics
        this.updateMetrics(failureType, true);
        return result;
      } catch (error) {
        if (attempt === maxRetries) {
          this.updateMetrics(failureType, false);
          throw error;
        }

        // Apply recovery strategy
        const delay = this.calculateRetryDelay(strategy, attempt, baseDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Calculate retry delay based on recovery strategy
   */
  private calculateRetryDelay(
    strategy: RecoveryStrategies,
    attempt: number,
    baseDelay: number
  ): number {
    switch (strategy) {
      case RecoveryStrategies.EXPONENTIAL_BACKOFF:
        return baseDelay * Math.pow(2, attempt - 1);

      case RecoveryStrategies.LINEAR_BACKOFF:
        return baseDelay * attempt;

      case RecoveryStrategies.RETRY_WITH_JITTER:
        const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 1000; // Add up to 1 second jitter
        return exponentialDelay + jitter;

      case RecoveryStrategies.CIRCUIT_BREAKER:
        // Circuit breaker logic handled separately
        return baseDelay;

      case RecoveryStrategies.GRACEFUL_DEGRADATION:
        // Longer delays for graceful degradation
        return baseDelay * attempt * 2;

      default:
        return baseDelay;
    }
  }

  /**
   * Update failure metrics
   */
  private updateMetrics(failureType: ConnectionFailureTypes, success: boolean): void {
    const metrics = this.metrics.get(failureType);
    if (!metrics) return;

    if (success) {
      metrics.successfulConnections++;
    } else {
      metrics.failedConnections++;
    }
  }

  /**
   * Get comprehensive failure metrics
   */
  getMetrics(): Map<ConnectionFailureTypes, FailureMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Get metrics for specific failure type
   */
  getFailureMetrics(failureType: ConnectionFailureTypes): FailureMetrics | undefined {
    return this.metrics.get(failureType);
  }

  /**
   * Test tenant isolation during failures
   */
  async testTenantIsolation(tenantIds: string[]): Promise<{
    isolationViolations: number;
    totalTests: number;
    violationDetails: Array<{ tenantId: string; failureType: string; timestamp: Date }>;
  }> {
    const violationDetails: Array<{ tenantId: string; failureType: string; timestamp: Date }> = [];
    let totalTests = 0;
    let isolationViolations = 0;

    for (const tenantId of tenantIds) {
      for (const failureType of Object.values(ConnectionFailureTypes)) {
        totalTests++;

        try {
          // Inject failure for specific tenant
          this.injectFailure({
            failureType,
            probability: 1.0,
            tenantIsolation: true,
            recoveryStrategy: RecoveryStrategies.EXPONENTIAL_BACKOFF,
          });

          // Test connection with tenant context
          await this.simulateConnection(tenantId);
        } catch (error) {
          // Check if error indicates isolation violation
          if (error instanceof Error && error.message.includes('isolation violation')) {
            isolationViolations++;
            violationDetails.push({
              tenantId,
              failureType,
              timestamp: new Date(),
            });
          }
        }
      }
    }

    return {
      isolationViolations,
      totalTests,
      violationDetails,
    };
  }

  /**
   * Reset all metrics and connection states
   */
  reset(): void {
    this.metrics.clear();
    this.connectionStates.clear();
    this.circuitBreakerStates.clear();
  }

  /**
   * Get connection pool health status
   */
  getConnectionPoolHealth(): {
    activeConnections: number;
    totalConnections: number;
    averageQueriesPerConnection: number;
    oldestConnection: Date | null;
  } {
    const connections = Array.from(this.connectionStates.values());
    const activeConnections = connections.filter((c) => c.isActive).length;
    const totalConnections = connections.length;
    const averageQueriesPerConnection =
      connections.length > 0
        ? connections.reduce((sum, c) => sum + c.queryCount, 0) / connections.length
        : 0;
    const oldestConnection =
      connections.length > 0
        ? new Date(Math.min(...connections.map((c) => c.createdAt.getTime())))
        : null;

    return {
      activeConnections,
      totalConnections,
      averageQueriesPerConnection,
      oldestConnection,
    };
  }
}

/**
 * Default database failure simulator instance
 */
export const databaseFailureSimulator = new DatabaseFailureSimulator();

/**
 * Convenience function to create a failure simulator with custom configuration
 */
export function createDatabaseFailureSimulator(
  supabaseUrl?: string,
  supabaseKey?: string
): DatabaseFailureSimulator {
  return new DatabaseFailureSimulator(supabaseUrl, supabaseKey);
}

/**
 * Pre-configured failure scenarios for common testing
 */
export const FailureScenarios = {
  // Mild failures for routine testing
  mild: [
    { failureType: ConnectionFailureTypes.CONNECTION_TIMEOUT, probability: 0.1, duration: 5000 },
    { failureType: ConnectionFailureTypes.QUERY_TIMEOUT, probability: 0.05, duration: 10000 },
  ],

  // Moderate failures for stress testing
  moderate: [
    { failureType: ConnectionFailureTypes.CONNECTION_POOL_EXHAUSTED, probability: 0.3 },
    { failureType: ConnectionFailureTypes.DATABASE_OVERLOAD, probability: 0.2, duration: 5000 },
    { failureType: ConnectionFailureTypes.NETWORK_PARTITION, probability: 0.1, duration: 2000 },
  ],

  // Severe failures for resilience testing
  severe: [
    { failureType: ConnectionFailureTypes.DISK_FULL, probability: 0.5 },
    { failureType: ConnectionFailureTypes.MEMORY_EXHAUSTED, probability: 0.3 },
    { failureType: ConnectionFailureTypes.DEADLOCK_DETECTED, probability: 0.4 },
    { failureType: ConnectionFailureTypes.AUTHENTICATION_FAILURE, probability: 0.2 },
  ],

  // Multi-tenant specific failures
  multiTenant: [
    {
      failureType: ConnectionFailureTypes.REPLICATION_LAG,
      probability: 0.3,
      duration: 5000,
      tenantIsolation: true,
      recoveryStrategy: RecoveryStrategies.FAILOVER,
    },
  ],
} as const;
