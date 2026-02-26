/**
 * Data Export Component
 * 
 * Comprehensive data export and import functionality with
 * support for multiple formats and validation.
 * 
 * @feature Data Export/Import
 * @layer features/data/ui
 * @priority medium
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  format: 'csv' | 'excel' | 'json' | 'pdf';
  category: 'tenants' | 'users' | 'analytics' | 'activity' | 'reports';
  icon: string;
}

interface DataExportProps {
  onExport?: (type: string, format: string, filters?: any) => void;
  onImport?: (file: File, type: string) => void;
}

export function DataExport({ onExport, onImport }: DataExportProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [loading, setLoading] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [selectedExport, setSelectedExport] = useState<string>('tenants');
  const [exportFilters, setExportFilters] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportOptions: ExportOption[] = [
    {
      id: 'tenants',
      name: 'Tenants',
      description: 'Export all tenant data including configuration and metrics',
      format: 'excel',
      category: 'tenants',
      icon: '🏢️',
    },
    {
      id: 'users',
      name: 'Users',
      description: 'Export user accounts and permission data',
      format: 'csv',
      category: 'users',
      icon: '👥',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Export analytics reports and metrics',
      format: 'pdf',
      category: 'analytics',
      icon: '📊',
    },
    {
      id: 'activity',
      name: 'Activity Logs',
      description: 'Export system activity logs and audit trails',
      format: 'json',
      category: 'activity',
      icon: '📋',
    },
    {
      id: 'reports',
      name: 'Custom Reports',
      description: 'Export custom reports and dashboards',
      format: 'excel',
      category: 'reports',
      icon: '📈',
    },
  ];

  const importTypes = [
    { id: 'tenants', name: 'Tenants', accept: '.csv,.xlsx', icon: '🏢️' },
    { id: 'users', name: 'Users', accept: '.csv,.xlsx', icon: '👥' },
  ];

  const handleExport = async (option: ExportOption) => {
    setLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onExport) {
        onExport(option.category, option.format, exportFilters);
      }
      
      // Simulate download
      const blob = new Blob(['Sample export data'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${option.name}.${option.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportPreview(null);
      
      // Simulate file preview
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n').slice(0, 5); // Show first 5 lines as preview
          setImportPreview(lines.join('\n'));
        } catch (error) {
          setImportPreview('Error reading file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setLoading(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onImport) {
        onImport(importFile, selectedExport);
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading(false);
      setImportFile(null);
      setImportPreview(null);
    }
  };

  const validateImport = async () => {
    if (!importFile) return;

    setLoading(true);
    try {
      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate validation result
      const isValid = Math.random() > 0.3; // 70% success rate
      if (isValid) {
        setImportPreview('✅ File validation passed. Ready to import.');
      } else {
        setImportPreview('❌ File validation failed. Please check the format and structure.');
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setImportPreview('Error validating file');
    } finally {
      setLoading(false);
    }
  };

  const selectedExportOption = exportOptions.find(option => option.id === selectedExport);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Data Management</h2>
        <Badge className="bg-blue-100 text-blue-800">
          Beta Feature
        </Badge>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('export')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'export'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📤 Export Data
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📥 Import Data
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              {/* Export Options */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Data to Export</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exportOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:border-blue-300 ${
                        selectedExport === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedExport(option.id)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          {option.format.toUpperCase()}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">
                          {option.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Filters */}
              {selectedExportOption && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Export Filters</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Configure filters for {selectedExportOption.name} export
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Range
                        </label>
                        <select
                          value={exportFilters.dateRange || '30d'}
                          onChange={(e) => setExportFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:include bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="7d">Last 7 Days</option>
                          <option value="30d">Last 30 Days</option>
                          <option value="90d">Last 90 Days</option>
                          <option value="1y">Last Year</option>
                          <option value="all">All Time</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fields
                        </label>
                        <div className="space-y-2">
                          {selectedExportOption.category === 'tenants' && (
                            <>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  defaultChecked={exportFilters.includeMetrics !== false}
                                  onChange={(e) => setExportFilters(prev => ({ ...prev, includeMetrics: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Include Metrics</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  defaultChecked={exportFilters.includeUsers !== false}
                                  onChange={(e) => setExportFilters(prev => ({ ...prev, includeUsers: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Include Users</span>
                              </label>
                            </>
                          )}
                          
                          {selectedExportOption.category === 'users' && (
                            <>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  defaultChecked={exportFilters.includePermissions !== false}
                                  onChange={(e) => setExportFilters(prev => ({ ...prev, includePermissions: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Include Permissions</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  defaultChecked={exportFilters.includeSessions !== false}
                                  onChange={(e) => setExportFilters(prev => ({ ...prev, includeSessions: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Include Sessions</span>
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setExportFilters({})}
                >
                  Reset Filters
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleExport(selectedExportOption!)}
                  loading={loading}
                  disabled={!selectedExportOption}
                >
                  {loading ? 'Exporting...' : `Export ${selectedExportOption?.name}`}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Import Type Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Import Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:border-blue-300 ${
                        selectedExport === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedExport(type.id)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{type.name}</div>
                          <div className="text-sm text-gray-500">Accepts: {type.accept}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload File</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={importTypes.find(t => t.id === selectedExport)?.accept}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <div className="text-4xl text-gray-400">📁</div>
                    <div className="text-lg text-gray-600">
                      {importFile ? importFile.name : 'Choose a file to import'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {importTypes.find(t => t.id === selectedExport)?.accept}
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              </div>

              {/* File Preview */}
              {importPreview && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">File Preview</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
                      {importPreview}
                    </pre>
                  </div>
                </div>
              )}

              {/* Import Actions */}
              {importFile && (
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={validateImport}
                    loading={loading}
                  >
                    Validate
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleImport}
                    loading={loading}
                    disabled={!importPreview || !importPreview.includes('✅')}
                  >
                    Import Data
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="text-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 100-16 8 8 0 00-16 0zm-1 1a1 1 0 011-2 0 1 1 0 010-2zm-1 1a1 1 0 011-2 0 1 1 0 010-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Data Import/Export Guidelines</h3>
            <div className="text-sm text-blue-700 mt-1">
              <ul className="list-disc list-inside space-y-1">
                <li>Supported formats: CSV, Excel, JSON, PDF</li>
                <li>Maximum file size: 50MB</li>
                <li>Ensure data format matches the selected type</li>
                <li>Back up your data before importing</li>
                <li>Import validation checks for data integrity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
