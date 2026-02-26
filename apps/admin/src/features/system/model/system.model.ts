import { SystemMetrics, SystemAlert, SystemHealth } from '@/entities/system';

export interface SystemMonitoringState {
  metrics: SystemMetrics[];
  alerts: SystemAlert[];
  health: SystemHealth | null;
  loading: boolean;
  error: string | null;
  selectedTimeRange: '1h' | '24h' | '7d' | '30d';
  selectedMetricType: string;
}

export interface SystemMonitoringActions {
  fetchMetrics: (timeRange: string, metricType?: string) => Promise<void>;
  fetchAlerts: (status?: string) => Promise<void>;
  fetchHealth: () => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  createAlert: (alert: Omit<SystemAlert, 'id' | 'createdAt'>) => Promise<SystemAlert>;
  setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void;
  setMetricType: (type: string) => void;
}

export interface MetricChart {
  type: 'line' | 'bar' | 'area';
  title: string;
  unit: string;
  data: Array<{
    timestamp: Date;
    value: number;
    label?: string;
  }>;
  color?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metricType: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notificationChannels: string[];
}

// Re-export entity types for convenience
export type { SystemMetrics, SystemAlert, SystemHealth } from '@/entities/system';
