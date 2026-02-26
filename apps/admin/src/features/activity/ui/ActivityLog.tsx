/**
 * Activity Log Component
 * 
 * Comprehensive activity log and audit trail viewer with
 * filtering, search, and export capabilities.
 * 
 * @feature Activity Logs
 * @layer features/activity/ui
 * @priority medium
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'user' | 'tenant' | 'system' | 'security' | 'api';
}

interface ActivityLogProps {
  onExport?: (format: 'csv' | 'json') => void;
}

export function ActivityLog({ onExport }: ActivityLogProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    severity: 'all',
    dateRange: '7d',
    search: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Mock data loading
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 3600000),
        userId: '1',
        userName: 'Admin User',
        action: 'Created Tenant',
        resource: 'Tenant',
        resourceId: 'tenant-123',
        details: { name: 'Acme Corp', plan: 'pro' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        severity: 'medium',
        category: 'tenant',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 7200000),
        userId: '2',
        userName: 'Tenant Admin',
        action: 'Updated User',
        resource: 'User',
        resourceId: 'user-456',
        details: { field: 'role', oldValue: 'viewer', newValue: 'admin' },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        severity: 'low',
        category: 'user',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 10800000),
        userId: '1',
        userName: 'Admin User',
        action: 'System Backup',
        resource: 'System',
        resourceId: 'backup-789',
        details: { type: 'full', size: '2.5GB', location: 's3' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        severity: 'low',
        category: 'system',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 14400000),
        userId: 'unknown',
        userName: 'System',
        action: 'Failed Login Attempt',
        resource: 'Auth',
        resourceId: 'auth-000',
        details: { reason: 'invalid_credentials', email: 'admin@example.com' },
        ipAddress: '10.0.0.1',
        userAgent: 'curl/7.68.0',
        severity: 'high',
        category: 'security',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 18000000),
        userId: '3',
        userName: 'API User',
        action: 'API Call',
        resource: 'API',
        resourceId: 'api-111',
        details: { endpoint: '/api/tenants', method: 'GET', status: 200 },
        ipAddress: '203.0.113.45',
        userAgent: 'axios/1.0.0',
        severity: 'low',
        category: 'api',
      },
    ];

    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
      setTotalPages(1);
    }, 1000);
  }, []);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'system':
        return 'bg-purple-100 text-purple-800';
      case 'tenant':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      case 'api':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const filteredLogs = logs.filter(log => {
    if (filters.category !== 'all' && log.category !== filters.category) return false;
    if (filters.severity !== 'all' && log.severity !== filters.severity) return false;
    if (filters.search && !(
      log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.resource.toLowerCase().includes(filters.search.toLowerCase())
    )) return false;
    return true;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (onExport) {
      onExport(format);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Activity Log</h2>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('json')}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search activities..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="user">User</option>
            <option value="tenant">Tenant</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="api">API</option>
          </select>

          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-gray-500">ID: {log.userId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{log.resource}</div>
                        <div className="text-gray-500">{log.resourceId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getCategoryColor(log.category)}>
                        {log.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredLogs.length}</span> of{' '}
                <span className="font-medium">{logs.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
