/**
 * @file admin/src/entities/system/model/system.schema.ts
 * @summary system entity definitions and schemas.
 * @description Core data structures and validation for system management.
 * @security none
 * @requirements none
 */
import { z } from 'zod';

export const SystemMetricsSchema = z.object({
  id: z.string().uuid(),
  metricType: z.enum(['cpu', 'memory', 'disk', 'bandwidth', 'requests']),
  value: z.number(),
  unit: z.string(),
  timestamp: z.date(),
  source: z.string(),
  metadata: z.record(z.any()).optional(),
});

export type SystemMetrics = z.infer<typeof SystemMetricsSchema>;

export const SystemAlertSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['error', 'warning', 'info', 'critical']),
  title: z.string(),
  message: z.string(),
  source: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['active', 'resolved', 'acknowledged']),
  createdAt: z.date(),
  resolvedAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export type SystemAlert = z.infer<typeof SystemAlertSchema>;

export const SystemHealthSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  checks: z.array(z.object({
    name: z.string(),
    status: z.enum(['pass', 'fail', 'warn']),
    message: z.string().optional(),
    lastChecked: z.date(),
  })),
  overallScore: z.number().min(0).max(100),
  lastUpdated: z.date(),
});

export type SystemHealth = z.infer<typeof SystemHealthSchema>;
