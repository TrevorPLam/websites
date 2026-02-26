/**
 * @file admin/src/pages/SystemPage.tsx
 * @summary SystemPage page component.
 * @description Main page component for SystemPage functionality.
 * @security none
 * @requirements none
 */
'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/widgets/admin-header';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { AdminFooter } from '@/widgets/admin-footer';
import { SystemDashboard } from '@/features/system/ui/SystemDashboard';
import { SystemMetrics, SystemAlert, SystemHealth } from '@/features/system/model/system.model';

export function SystemPage() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Mock data for demonstration
  useEffect(() => {
    const generateMockMetrics = (): SystemMetrics[] => {
      const now = new Date();
      const metrics: SystemMetrics[] = [];
      
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - i * 3600000);
        
        metrics.push(
          {
            id: `cpu-${i}`,
            metricType: 'cpu',
            value: 30 + Math.random() * 40,
            unit: '%',
            timestamp,
            source: 'server-1',
          },
          {
            id: `memory-${i}`,
            metricType: 'memory',
            value: 40 + Math.random() * 30,
            unit: '%',
            timestamp,
            source: 'server-1',
          },
          {
            id: `disk-${i}`,
            metricType: 'disk',
            value: 20 + Math.random() * 20,
            unit: '%',
            timestamp,
            source: 'server-1',
          },
          {
            id: `bandwidth-${i}`,
            metricType: 'bandwidth',
            value: 100 + Math.random() * 500,
            unit: 'Mbps',
            timestamp,
            source: 'server-1',
          },
          {
            id: `requests-${i}`,
            metricType: 'requests',
            value: 50 + Math.random() * 150,
            unit: 'req/s',
            timestamp,
            source: 'server-1',
          }
        );
      }
      
      return metrics.reverse();
    };

    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'High CPU Usage',
        message: 'CPU usage has exceeded 80% for more than 5 minutes',
        source: 'server-1',
        severity: 'medium',
        status: 'active',
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        id: '2',
        type: 'error',
        title: 'Database Connection Failed',
        message: 'Unable to connect to primary database server',
        source: 'database-1',
        severity: 'critical',
        status: 'active',
        createdAt: new Date(Date.now() - 900000),
      },
      {
        id: '3',
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled for tonight at 2:00 AM',
        source: 'system',
        severity: 'low',
        status: 'active',
        createdAt: new Date(Date.now() - 3600000),
      },
    ];

    const mockHealth: SystemHealth = {
      status: 'degraded',
      checks: [
        {
          name: 'Database',
          status: 'fail',
          message: 'Connection timeout',
          lastChecked: new Date(),
        },
        {
          name: 'API Server',
          status: 'pass',
          lastChecked: new Date(),
        },
        {
          name: 'Cache',
          status: 'pass',
          lastChecked: new Date(),
        },
        {
          name: 'Storage',
          status: 'warn',
          message: 'Disk space at 85%',
          lastChecked: new Date(),
        },
        {
          name: 'Network',
          status: 'pass',
          lastChecked: new Date(),
        },
      ],
      overallScore: 72,
      lastUpdated: new Date(),
    };

    // Simulate loading
    setTimeout(() => {
      setMetrics(generateMockMetrics());
      setAlerts(mockAlerts);
      setHealth(mockHealth);
      setLoading(false);
    }, 1000);
  }, [selectedTimeRange]);

  const handleTimeRangeChange = (range: '1h' | '24h' | '7d' | '30d') => {
    setSelectedTimeRange(range);
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleAlertAcknowledge = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? { ...alert, status: 'acknowledged' as const } : alert
      ));
    } catch (err) {
      setError('Failed to acknowledge alert');
    }
  };

  const handleAlertResolve = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? { ...alert, status: 'resolved' as const, resolvedAt: new Date() } : alert
      ));
    } catch (err) {
      setError('Failed to resolve alert');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader
            title="System Monitoring"
            subtitle="Real-time system metrics and health monitoring"
          />
          <main className="flex-1 p-6">
            <SystemDashboard
              metrics={metrics}
              alerts={alerts}
              health={health}
              loading={loading}
              error={error}
              selectedTimeRange={selectedTimeRange}
              onTimeRangeChange={handleTimeRangeChange}
              onRefresh={handleRefresh}
              onAlertAcknowledge={handleAlertAcknowledge}
              onAlertResolve={handleAlertResolve}
            />
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
