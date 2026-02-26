'use client';

import React from 'react';
import { SystemAlert } from '../model/system.model';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface AlertsPanelProps {
  alerts: SystemAlert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export function AlertsPanel({
  alerts,
  onAcknowledge,
  onResolve,
}: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2">No active alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Active Alerts ({alerts.length})
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alerts.forEach(alert => onAcknowledge(alert.id))}
          >
            Acknowledge All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alerts.forEach(alert => onResolve(alert.id))}
          >
            Resolve All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <Badge className={getTypeColor(alert.type)}>
                    {alert.type}
                  </Badge>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-3">{alert.message}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Source: {alert.source}</span>
                  <span>•</span>
                  <span>{formatTime(alert.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  Acknowledge
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResolve(alert.id)}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
