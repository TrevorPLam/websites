/**
 * @file packages/testing-chaos/src/index.ts
 * @summary Chaos engineering testing utilities barrel export
 * @see TASKS1.md TASK-005 Chaos Engineering Implementation
 *
 * Purpose: Central export point for all chaos engineering utilities.
 * Provides database failure simulation, external service chaos testing, and resilience validation.
 *
 * Exports / Entry: DatabaseFailureSimulator, ConnectionFailureTypes, RecoveryStrategies, FailureScenarios
 * Used by: Chaos testing suites, E2E tests, resilience validation frameworks
 *
 * Security Features:
 * - Isolated failure simulation environments
 * - Configurable failure probability and patterns
 * - Multi-tenant isolation testing capabilities
 * - Comprehensive metrics and monitoring
 *
 * Dependencies:
 * - @supabase/supabase-js for database client mocking
 * - @playwright/test for E2E chaos testing
 * - zod for schema validation
 *
 * Status: @production-ready
 */

// Core database failure simulation
export {
  DatabaseFailureSimulator,
  databaseFailureSimulator,
  createDatabaseFailureSimulator,
  ConnectionFailureTypes,
  RecoveryStrategies,
  FailureScenarios,
  type DatabaseFailureConfig,
  type FailureMetrics,
} from './database-failure';

// Re-export for convenience
export type {
  ConnectionState,
} from './database-failure';

// Package version and metadata
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@repo/testing-chaos';
