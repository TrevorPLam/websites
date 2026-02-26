/**
 * @file packages/monitoring/src/index.ts
 * @summary Real User Monitoring (RUM) integration package exports
 * @description Comprehensive RUM integration with synthetic test correlation
 * @security Multi-tenant data isolation with GDPR compliance
 * @requirements TASK-007 / rum-integration-package
 * @version 2026.02.26
 */

// Core RUM integration
export { RUMIntegrationService, rumIntegrationService } from './rum-integration';
export type { RUMMetrics, SyntheticTestResult, CorrelationResult, PerformanceBaseline } from './rum-integration';

// Client-side RUM tracking
export { trackRUMMetrics, useRUMTracking } from './client';
export type { RUMTrackerConfig, RUMTrackerOptions } from './client';

// Correlation analysis utilities
export { CorrelationAnalyzer } from './correlation-analyzer';
export type { CorrelationConfig, VarianceAnalysis } from './correlation-analyzer';

// Performance baseline management
export { PerformanceBaselineManager } from './baseline-manager';
export type { BaselineConfig, BaselineMetrics } from './baseline-manager';

// Issue detection and alerting
export { IssueDetector, IssueClassifier } from './issue-detector';
export type { Issue, IssueSeverity, IssueType } from './issue-detector';

// Re-export commonly used types and utilities
export * from '@repo/analytics/src/performance-monitoring';
