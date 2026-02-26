/**
 * @file apps/admin/src/widgets/chaos-dashboard/index.ts
 * @summary Chaos dashboard widget barrel export
 * @see TASKS1.md TASK-005.4 Chaos Engineering Implementation
 *
 * Purpose: Central export point for chaos dashboard components.
 * Provides dashboard UI, hooks, and utilities for chaos engineering monitoring.
 *
 * Exports / Entry: ChaosDashboard, useChaosMetrics, useChaosExperiments
 * Used by: Admin dashboard pages, SRE team interfaces, system monitoring
 *
 * Security Features:
 * - Role-based access control integration
 * - Tenant-isolated metrics display
 * - Real-time WebSocket connections
 * - Comprehensive audit logging
 *
 * Dependencies:
 * - React 19 with Server Components
 * - @repo/ui for design system components
 * - Recharts for data visualization
 * - WebSocket for real-time updates
 *
 * Status: @production-ready
 */

// UI Components
export { ChaosDashboard } from './ui/ChaosDashboard';

// Types
export type {
  ChaosMetrics,
  SystemResilience,
  ChaosExperiment,
} from './ui/ChaosDashboard';

// Package metadata
export const CHAOS_DASHBOARD_VERSION = '1.0.0';
