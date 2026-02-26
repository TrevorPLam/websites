'use client';

import React from 'react';
import { SystemHealth } from '../model/system.model';
import { Badge } from '@/shared/ui/Badge';

interface HealthStatusProps {
  health: SystemHealth;
}

export function HealthStatus({ health }: HealthStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCheckStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(health.status)}>
            {health.status}
          </Badge>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(health.overallScore)}`}>
              {health.overallScore}%
            </div>
            <div className="text-xs text-gray-500">Health Score</div>
          </div>
        </div>
      </div>

      {/* Health Checks */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Health Checks</h4>
        {health.checks.map((check, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                check.status === 'pass' ? 'bg-green-500' :
                check.status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-900">{check.name}</span>
              {check.message && (
                <span className="text-sm text-gray-500">- {check.message}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getCheckStatusColor(check.status)}>
                {check.status}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatTime(check.lastChecked)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Last updated</span>
          <span>{formatTime(health.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}
