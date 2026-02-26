/**
 * Backup Manager Component
 * 
 * Comprehensive backup and recovery system with scheduling,
 * automated backups, and restore capabilities.
 * 
 * @feature Backup & Recovery
 * @layer features/backup/ui
 * @priority low
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'tenants' | 'users' | 'analytics';
  size: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  location: 'local' | 's3' | 'gcs';
  downloadUrl?: string;
  metadata: Record<string, any>;
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'full' | 'tenants' | 'users' | 'analytics';
  frequency: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  nextRun: Date;
  lastRun?: Date;
  retention: number;
  location: 'local' | 's3' | 'gcs';
}

interface BackupManagerProps {
  onCreateBackup?: (type: string) => void;
  onRestore?: (file: File) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BackupManager({
  onCreateBackup,
  onRestore,
  onDownload,
  onDelete,
}: BackupManagerProps) {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'backups' | 'schedules' | 'restore'>('backups');
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);

  useEffect(() => {
    // Mock data
    const mockBackups: Backup[] = [
      {
        id: '1',
        name: 'Daily Full Backup',
        type: 'full',
        size: '2.1GB',
        status: 'completed',
        createdAt: new Date(Date.now() - 3600000),
        completedAt: new Date(Date.now() - 3000000),
        location: 's3',
        downloadUrl: '/api/backup/download/1',
        metadata: { version: '2.1.0', compressed: true },
      },
      {
        id: '2',
        name: 'Weekly Tenant Backup',
        type: 'tenants',
        size: '450MB',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000),
        completedAt: new Date(Date.now() - 82800000),
        location: 's3',
        downloadUrl: '/api/backup/download/2',
        metadata: { tenantCount: 123, compressed: true },
      },
      {
        id: '3',
        name: 'Manual User Backup',
        type: 'users',
        size: '125MB',
        status: 'running',
        createdAt: new Date(Date.now() - 1800000),
        location: 'local',
        metadata: { userCount: 456, initiatedBy: 'admin' },
      },
      {
        id: '4',
        name: 'Monthly Analytics Backup',
        type: 'analytics',
        size: '890MB',
        status: 'failed',
        createdAt: new Date(Date.now() - 2592000000),
        location: 's3',
        metadata: { error: 'Storage quota exceeded', retryCount: 3 },
      },
    ];

    const mockSchedules: BackupSchedule[] = [
      {
        id: '1',
        name: 'Daily Full Backup',
        type: 'full',
        frequency: 'daily',
        enabled: true,
        nextRun: new Date(Date.now() + 3600000),
        lastRun: new Date(Date.now() - 3600000),
        retention: 30,
        location: 's3',
      },
      {
        id: '2',
        name: 'Weekly Tenant Backup',
        type: 'tenants',
        frequency: 'weekly',
        enabled: true,
        nextRun: new Date(Date.now() + 604800000),
        lastRun: new Date(Date.now() - 604800000),
        retention: 90,
        location: 's3',
      },
      {
        id: '3',
        name: 'Monthly Analytics Backup',
        type: 'analytics',
        frequency: 'monthly',
        enabled: false,
        nextRun: new Date(Date.now() + 2592000000),
        lastRun: new Date(Date.now() - 2592000000),
        retention: 365,
        location: 'gcs',
      },
    ];

    setTimeout(() => {
      setBackups(mockBackups);
      setSchedules(mockSchedules);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-purple-100 text-purple-800';
      case 'tenants':
        return 'bg-blue-100 text-blue-800';
      case 'users':
        return 'bg-green-100 text-green-800';
      case 'analytics':
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
    }).format(date);
  };

  const handleCreateBackup = async (type: string) => {
    setCreatingBackup(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onCreateBackup) {
        onCreateBackup(type);
      }
      
      // Add new backup to list
      const newBackup: Backup = {
        id: Date.now().toString(),
        name: `Manual ${type} Backup`,
        type: type as any,
        size: 'Calculating...',
        status: 'running',
        createdAt: new Date(),
        location: 's3',
        metadata: { initiatedBy: 'admin' },
      };
      
      setBackups(prev => [newBackup, ...prev]);
    } catch (error) {
      console.error('Backup creation failed:', error);
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) return;

    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (onRestore) {
        onRestore(restoreFile);
      }
      
      alert('Restore completed successfully');
      setRestoreFile(null);
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Restore failed. Please check the file format and try again.');
    }
  };

  const handleDownload = (backup: Backup) => {
    if (onDownload) {
      onDownload(backup.id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      setBackups(prev => prev.filter(b => b.id !== id));
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev =>
      prev.map(schedule =>
        schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Backup & Recovery</h2>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleCreateBackup('full')}
            loading={creatingBackup}
          >
            {creatingBackup ? 'Creating...' : 'Create Backup'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('backups')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'backups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📦 Backups
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⏰ Schedules
            </button>
            <button
              onClick={() => setActiveTab('restore')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'restore'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔄 Restore
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'backups' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleCreateBackup('full')}
                  loading={creatingBackup}
                >
                  Full Backup
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreateBackup('tenants')}
                  loading={creatingBackup}
                >
                  Tenant Backup
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreateBackup('users')}
                  loading={creatingBackup}
                >
                  User Backup
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreateBackup('analytics')}
                  loading={creatingBackup}
                >
                  Analytics Backup
                </Button>
              </div>

              {/* Backups List */}
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : backups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📦</div>
                  <p>No backups found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{backup.name}</h4>
                            <Badge className={getTypeColor(backup.type)}>
                              {backup.type}
                            </Badge>
                            <Badge className={getStatusColor(backup.status)}>
                              {backup.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Size: {backup.size}</span>
                            <span>Location: {backup.location}</span>
                            <span>Created: {formatTimestamp(backup.createdAt)}</span>
                            {backup.completedAt && (
                              <span>Completed: {formatTimestamp(backup.completedAt)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {backup.status === 'completed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(backup)}
                              >
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(backup.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                          {backup.status === 'running' && (
                            <LoadingSpinner size="sm" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">⏰</div>
                  <p>No backup schedules found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                            <Badge className={getTypeColor(schedule.type)}>
                              {schedule.type}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-800">
                              {schedule.frequency}
                            </Badge>
                            <Badge className={schedule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {schedule.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Next Run: {formatTimestamp(schedule.nextRun)}</span>
                            {schedule.lastRun && (
                              <span>Last Run: {formatTimestamp(schedule.lastRun)}</span>
                            )}
                            <span>Retention: {schedule.retention} days</span>
                            <span>Location: {schedule.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSchedule(schedule.id)}
                          >
                            {schedule.enabled ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'restore' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">📁</div>
                <div className="text-lg text-gray-600 mb-4">
                  {restoreFile ? restoreFile.name : 'Select a backup file to restore'}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Supported formats: .backup, .zip, .tar.gz
                </div>
                <input
                  type="file"
                  accept=".backup,.zip,.tar.gz"
                  onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="restore-file"
                />
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('restore-file')?.click()}
                  >
                    Select File
                  </Button>
                  {restoreFile && (
                    <Button
                      variant="primary"
                      onClick={handleRestore}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>

              {/* Restore Information */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="text-yellow-400">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Restore Warning</h3>
                    <div className="text-sm text-yellow-700 mt-1">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Restoring a backup will overwrite current data</li>
                        <li>Ensure you have a current backup before restoring</li>
                        <li>Test restores in a staging environment first</li>
                        <li>System will be unavailable during restore process</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
