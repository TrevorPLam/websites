/**
 * Notification Center Component
 * 
 * Real-time notification center with toast notifications,
 * alert management, and notification preferences.
 * 
 * @feature Notification System
 * @layer features/notifications/ui
 * @priority medium
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'critical';
  category: 'system' | 'tenant' | 'user' | 'security' | 'backup' | 'analytics';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata: Record<string, any>;
}

interface NotificationCenterProps {
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onSettings?: () => void;
}

export function NotificationCenter({
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onSettings,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    // Mock notification data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'System Update Available',
        message: 'A new system update is ready for installation.',
        type: 'info',
        category: 'system',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        actionUrl: '/settings',
        actionText: 'View Details',
        metadata: { version: '2.1.0', size: '125MB' },
      },
      {
        id: '2',
        title: 'High CPU Usage Alert',
        message: 'Server CPU usage has exceeded 85% for 5 minutes.',
        type: 'warning',
        category: 'system',
        timestamp: new Date(Date.now() - 600000),
        read: false,
        actionUrl: '/system',
        actionText: 'View Metrics',
        metadata: { server: 'web-01', cpu: '87%', threshold: '80%' },
      },
      {
        id: '3',
        title: 'Tenant Created',
        message: 'New tenant "Acme Corp" has been successfully created.',
        type: 'success',
        category: 'tenant',
        timestamp: new Date(Date.now() - 900000),
        read: false,
        actionUrl: '/tenants/acme-corp',
        actionText: 'View Tenant',
        metadata: { tenantId: 'tenant-123', plan: 'pro' },
      },
      {
        id: '4',
        title: 'Security Alert',
        message: 'Multiple failed login attempts detected from IP 10.0.0.1.',
        type: 'critical',
        category: 'security',
        timestamp: new Date(Date.now() - 1200000),
        read: false,
        actionUrl: '/security',
        actionText: 'Review Logs',
        metadata: { ip: '10.0.0.1', attempts: 5, lastAttempt: new Date() },
      },
      {
        id: '5',
        title: 'Backup Completed',
        message: 'Daily backup completed successfully.',
        type: 'success',
        category: 'backup',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        actionUrl: '/backup',
        actionText: 'Download',
        metadata: { size: '2.1GB', location: 's3://backups/' },
      },
      {
        id: '6',
        title: 'Analytics Report Ready',
        message: 'Monthly analytics report is ready for download.',
        type: 'info',
        category: 'analytics',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        actionUrl: '/analytics/reports/monthly',
        actionText: 'Download',
        metadata: { month: '2024-02', format: 'pdf', size: '1.5MB' },
      },
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'critical':
        return '🚨';
      default:
        return '📢';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system':
        return 'bg-purple-100 text-purple-800';
      case 'tenant':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'backup':
        return 'bg-orange-100 text-orange-800';
      case 'analytics':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'critical' && notification.type !== 'critical') return false;
    if (category !== 'all' && notification.category !== category) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const handleAction = (notification: Notification) => {
    if (notification.actionUrl) {
      // In a real app, this would navigate to the action URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md max-h-screen overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
            >
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications([])}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-2 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'unread'
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'critical'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Critical
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-2 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                category === 'all'
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            {['system', 'tenant', 'user', 'security', 'backup', 'analytics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                  category === cat
                    ? 'bg-gray-100 text-gray-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="sm" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔔</div>
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 rounded-lg cursor-pointer ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleAction(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="text-xl">{getTypeIcon(notification.type)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                    <Badge className={getCategoryColor(notification.category)}>
                      {notification.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>

                  {notification.actionUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(notification)}
                    >
                      {notification.actionText}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{filteredNotifications.length} notifications</span>
            <span>•</span>
            <span>{unreadCount} unread</span>
            {criticalCount > 0 && (
              <>
                <span>•</span>
                <span className="text-red-600">{criticalCount} critical</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
