/**
 * Settings Page Component
 * 
 * Comprehensive settings management for the admin application.
 * Includes theme, notifications, security, and system configuration.
 * 
 * @feature Settings Management
 * @layer pages
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/widgets/admin-header';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { AdminFooter } from '@/widgets/admin-footer';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface Settings {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    dateFormat: string;
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    slackWebhook: string;
    alertThresholds: {
      cpu: number;
      memory: number;
      disk: number;
      errorRate: number;
    };
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowedIps: string[];
  };
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number;
    location: 'local' | 's3' | 'gcs';
  };
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'Marketing Platform Admin',
      siteUrl: 'https://admin.example.com',
      adminEmail: 'admin@example.com',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
    },
    theme: {
      mode: 'dark',
      primaryColor: '#3b82f6',
      accentColor: '#10b981',
      logoUrl: '',
      faviconUrl: '',
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      slackWebhook: '',
      alertThresholds: {
        cpu: 80,
        memory: 85,
        disk: 90,
        errorRate: 5,
      },
    },
    security: {
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: true,
      allowedIps: [],
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      retention: 30,
      location: 's3',
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'backup', label: 'Backup', icon: '💾' },
  ];

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset to default values
      setSettings({
        general: {
          siteName: 'Marketing Platform Admin',
          siteUrl: 'https://admin.example.com',
          adminEmail: 'admin@example.com',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
        },
        theme: {
          mode: 'dark',
          primaryColor: '#3b82f6',
          accentColor: '#10b981',
          logoUrl: '',
          faviconUrl: '',
        },
        notifications: {
          emailAlerts: true,
          smsAlerts: false,
          slackWebhook: '',
          alertThresholds: {
            cpu: 80,
            memory: 85,
            disk: 90,
            errorRate: 5,
          },
        },
        security: {
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireTwoFactor: true,
          allowedIps: [],
        },
        backup: {
          enabled: true,
          frequency: 'daily',
          retention: 30,
          location: 's3',
        },
      });
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, siteName: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site URL
          </label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, siteUrl: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={settings.general.adminEmail}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, adminEmail: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, timezone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderThemeSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme Mode
          </label>
          <select
            value={settings.theme.mode}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              theme: { ...prev.theme, mode: e.target.value as any }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <input
            type="color"
            value={settings.theme.primaryColor}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              theme: { ...prev.theme, primaryColor: e.target.value }
            }))}
            className="w-full h-10 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color
          </label>
          <input
            type="color"
            value={settings.theme.accentColor}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              theme: { ...prev.theme, accentColor: e.target.value }
            }))}
            className="w-full h-10 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Email Alerts</div>
            <div className="text-sm text-gray-500">Receive email notifications for system events</div>
          </div>
          <button
            onClick={() => setSettings(prev => ({
              ...prev,
              notifications: { ...prev.notifications, emailAlerts: !prev.notifications.emailAlerts }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications.emailAlerts ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">SMS Alerts</div>
            <div className="text-sm text-gray-500">Receive SMS notifications for critical alerts</div>
          </div>
          <button
            onClick={() => setSettings(prev => ({
              ...prev,
              notifications: { ...prev.notifications, smsAlerts: !prev.notifications.smsAlerts }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications.smsAlerts ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications.smsAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slack Webhook URL
          </label>
          <input
            type="url"
            value={settings.notifications.slackWebhook}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              notifications: { ...prev.notifications, slackWebhook: e.target.value }
            }))}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Alert Thresholds</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CPU (%)</label>
            <input
              type="number"
              value={settings.notifications.alertThresholds.cpu}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  alertThresholds: {
                    ...prev.notifications.alertThresholds,
                    cpu: parseInt(e.target.value)
                  }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Memory (%)</label>
            <input
              type="number"
              value={settings.notifications.alertThresholds.memory}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  alertThresholds: {
                    ...prev.notifications.alertThresholds,
                    memory: parseInt(e.target.value)
                  }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disk (%)</label>
            <input
              type="number"
              value={settings.notifications.alertThresholds.disk}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  alertThresholds: {
                    ...prev.notifications.alertThresholds,
                    disk: parseInt(e.target.value)
                  }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Error Rate (%)</label>
            <input
              type="number"
              value={settings.notifications.alertThresholds.errorRate}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  alertThresholds: {
                    ...prev.notifications.alertThresholds,
                    errorRate: parseInt(e.target.value)
                  }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (seconds)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Min Length
          </label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-900">Require Two-Factor Authentication</div>
          <div className="text-sm text-gray-500">Enforce 2FA for all admin users</div>
        </div>
        <button
          onClick={() => setSettings(prev => ({
            ...prev,
            security: { ...prev.security, requireTwoFactor: !prev.security.requireTwoFactor }
          }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.security.requireTwoFactor ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.security.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-900">Enable Automatic Backups</div>
          <div className="text-sm text-gray-500">Automatically backup system data</div>
        </div>
        <button
          onClick={() => setSettings(prev => ({
            ...prev,
            backup: { ...prev.backup, enabled: !prev.backup.enabled }
          }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.backup.enabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.backup.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <select
            value={settings.backup.frequency}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              backup: { ...prev.backup, frequency: e.target.value as any }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retention (days)
          </label>
          <input
            type="number"
            value={settings.backup.retention}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              backup: { ...prev.backup, retention: parseInt(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Storage Location
          </label>
          <select
            value={settings.backup.location}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              backup: { ...prev.backup, location: e.target.value as any }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="local">Local</option>
            <option value="s3">AWS S3</option>
            <option value="gcs">Google Cloud Storage</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'theme':
        return renderThemeSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader
            title="Settings"
            subtitle="Configure system settings and preferences"
          />
          <main className="flex-1 p-6">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset to Defaults
                  </Button>
                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      loading={saving}
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
