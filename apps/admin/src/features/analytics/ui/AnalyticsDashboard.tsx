/**
 * Analytics Dashboard Component
 * 
 * Advanced analytics dashboard with comprehensive reporting,
 * data visualization, and export capabilities.
 * 
 * @feature Advanced Analytics
 * @layer features/analytics/ui
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface AnalyticsData {
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  pageViews: number;
  uniqueVisitors: number;
  topPages: Array<{ url: string; views: number; bounceRate: number }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
  conversionFunnel: Array<{ step: string; count: number; rate: number }>;
}

interface AnalyticsDashboardProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
  onExport: (format: 'csv' | 'pdf' | 'excel') => void;
}

export function AnalyticsDashboard({
  timeRange,
  onTimeRangeChange,
  onExport,
}: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  useEffect(() => {
    // Mock data loading
    const mockData: AnalyticsData = {
      totalRevenue: 125000,
      activeUsers: 892,
      conversionRate: 3.2,
      avgSessionDuration: 245,
      bounceRate: 42.1,
      pageViews: 45678,
      uniqueVisitors: 12345,
      topPages: [
        { url: '/landing', views: 1234, bounceRate: 35.2 },
        { url: '/pricing', views: 987, bounceRate: 28.1 },
        { url: '/about', views: 765, bounceRate: 45.6 },
        { url: '/contact', views: 543, bounceRate: 52.3 },
      ],
      trafficSources: [
        { source: 'Organic Search', visitors: 4567, percentage: 37.0 },
        { source: 'Direct', visitors: 3234, percentage: 26.2 },
        { source: 'Social Media', visitors: 2345, percentage: 19.0 },
        { source: 'Referral', visitors: 1234, percentage: 10.0 },
        { source: 'Paid Ads', visitors: 965, percentage: 7.8 },
      ],
      conversionFunnel: [
        { step: 'Visitors', count: 12345, rate: 100 },
        { step: 'Leads', count: 876, rate: 7.1 },
        { step: 'Qualified', count: 432, rate: 49.3 },
        { step: 'Opportunities', count: 234, rate: 54.2 },
        { step: 'Customers', count: 89, rate: 38.0 },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1500);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('pdf')}
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('excel')}
            >
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Revenue</span>
            <Badge className="bg-green-100 text-green-800">+12.5%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(data.totalRevenue)}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Active Users</span>
            <Badge className="bg-blue-100 text-blue-800">+8.2%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.activeUsers.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Conversion Rate</span>
            <Badge className="bg-purple-100 text-purple-800">+2.1%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPercentage(data.conversionRate)}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Avg Session</span>
            <Badge className="bg-orange-100 text-orange-800">-5.3%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatDuration(data.avgSessionDuration)}
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {data.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {source.visitors.toLocaleString()}
                  </span>
                  <Badge className="bg-gray-100 text-gray-800">
                    {formatPercentage(source.percentage)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {data.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{page.url}</div>
                  <div className="text-sm text-gray-500">{page.views.toLocaleString()} views</div>
                </div>
                <Badge className={page.bounceRate > 40 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  Bounce: {formatPercentage(page.bounceRate)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="flex items-center justify-between">
          {data.conversionFunnel.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="text-lg font-bold text-gray-900">{step.count.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{step.step}</div>
              <div className="text-sm font-medium text-blue-600">{formatPercentage(step.rate)}</div>
              {index < data.conversionFunnel.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gray-300 -translate-x-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Page Views</h4>
          <div className="text-2xl font-bold text-gray-900">
            {data.pageViews.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Unique Visitors</h4>
          <div className="text-2xl font-bold text-gray-900">
            {data.uniqueVisitors.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Bounce Rate</h4>
          <div className="text-2xl font-bold text-gray-900">
            {formatPercentage(data.bounceRate)}
          </div>
        </div>
      </div>
    </div>
  );
}
