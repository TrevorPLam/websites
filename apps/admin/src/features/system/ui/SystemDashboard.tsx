/**
 * @file admin/src/features/system/ui/SystemDashboard.tsx
 * @summary system feature implementation for admin interface.
 * @description Provides system management functionality with proper error handling and user feedback.
 * @security none
 * @requirements none
 */
'use client';

import React, { useState, useEffect } from 'react';
import { SystemMetrics, SystemAlert, SystemHealth } from '../model/system.model';
import { MetricsChart } from './MetricsChart';
import { AlertsPanel } from './AlertsPanel';
import { HealthStatus } from './HealthStatus';
import { Button } from '@/shared/ui/Button';

interface SystemDashboardProps {
  metrics: SystemMetrics[];
  alerts: SystemAlert[];
  health: SystemHealth | null;
  loading: boolean;
  error: string | null;
  selectedTimeRange: '1h' | '24h' | '7d' | '30d';
  onTimeRangeChange: (range: '1h' | '24h' | '7d' | '30d') => void;
  onRefresh: () => void;
  onAlertAcknowledge: (id: string) => void;
  onAlertResolve: (id: string) => void;
}

export function SystemDashboard({
  metrics,
  alerts,
  health,
  loading,
  error,
  selectedTimeRange,
  onTimeRangeChange,
  onRefresh,
  onAlertAcknowledge,
  onAlertResolve,
}: SystemDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('cpu');

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  const metricTypes = [
    { value: 'cpu', label: 'CPU Usage', color: '#3b82f6' },
    { value: 'memory', label: 'Memory Usage', color: '#10b981' },
    { value: 'disk', label: 'Disk Usage', color: '#f59e0b' },
    { value: 'bandwidth', label: 'Bandwidth', color: '#8b5cf6' },
    { value: 'requests', label: 'Requests', color: '#ef4444' },
  ];

  const getMetricsByType = (type: string) => {
    return metrics.filter(metric => metric.metricType === type);
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => alert.status === 'active');
  };

  const getCriticalAlerts = () => {
    return alerts.filter(alert => 
      alert.status === 'active' && alert.severity === 'critical'
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading system data</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900">System Monitoring</h2>
          {getCriticalAlerts().length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600">
                {getCriticalAlerts().length} critical alert{getCriticalAlerts().length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Time Range:</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => onTimeRangeChange(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {health && (
        <HealthStatus health={health} />
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metricTypes.map(type => (
          <div key={type.value} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{type.label}</h3>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: type.color }}
              ></div>
            </div>
            <MetricsChart
              metrics={getMetricsByType(type.value)}
              color={type.color}
              unit={type.value === 'requests' ? 'req/s' : '%'}
              loading={loading}
            />
          </div>
        ))}
      </div>

      {/* Alerts Panel */}
      <AlertsPanel
        alerts={getActiveAlerts()}
        onAcknowledge={onAlertAcknowledge}
        onResolve={onAlertResolve}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">
            {getActiveAlerts().length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Active Alerts</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">
            {getCriticalAlerts().length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Critical Alerts</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {health?.overallScore || 0}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Health Score</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {metrics.length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Data Points</div>
        </div>
      </div>
    </div>
  );
}
