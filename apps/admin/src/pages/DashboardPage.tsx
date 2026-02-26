/**
 * DashboardPage Component
 *
 * Main admin dashboard with overview statistics and quick actions.
 * Follows 2026 accessibility standards and responsive design.
 *
 * @feature Admin Dashboard
 * @layer pages
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React from 'react';
import { AdminHeader } from '@/widgets/admin-header';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { AdminFooter } from '@/widgets/admin-footer';

interface DashboardPageProps {
  children?: React.ReactNode;
}

export function DashboardPage({ children }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <AdminHeader
            title="Dashboard"
            subtitle="Overview of your multi-tenant platform"
          />

          {/* Page Content */}
          <main className="flex-1 p-6">
            {children || (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Welcome to the Admin Dashboard
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Monitor and manage your multi-tenant marketing platform from this central dashboard.
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">1,234</div>
                      <div className="text-sm text-blue-600 mt-1">Total Tenants</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">892</div>
                      <div className="text-sm text-green-600 mt-1">Active Users</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">45.6K</div>
                      <div className="text-sm text-purple-600 mt-1">Total Leads</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">99.9%</div>
                      <div className="text-sm text-orange-600 mt-1">Uptime</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            New tenant registered
                          </div>
                          <div className="text-sm text-gray-500">
                            Acme Corp - 2 minutes ago
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            System update completed
                          </div>
                          <div className="text-sm text-gray-500">
                            Version 2.1.0 deployed - 1 hour ago
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            High usage alert
                          </div>
                          <div className="text-sm text-gray-500">
                            Tenant approaching limits - 3 hours ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="font-medium text-gray-900">Create Tenant</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Add a new tenant to the platform
                      </div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="font-medium text-gray-900">View Analytics</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Monitor platform performance
                      </div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="font-medium text-gray-900">System Settings</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Configure platform settings
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
