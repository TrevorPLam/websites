/**
 * @file apps/admin/src/components/VisualAnalytics.tsx
 * @summary Visual regression analytics dashboard component with real-time metrics and trend analysis.
 * @description Displays visual testing health scores, component coverage, accessibility metrics, and historical trends.
 * @security None - displays analytics data only
 * @adr none
 * @requirements VISUAL-007, analytics-dashboard, trend-visualization
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Badge } from '@repo/ui';

interface VisualMetrics {
  healthScore: number;
  passRate: number;
  totalTests: number;
  components: Record<string, ComponentMetrics>;
  accessibility: AccessibilityMetrics;
  trends: TrendData[];
}

interface ComponentMetrics {
  total: number;
  passed: number;
  passRate: string;
  healthScore: number;
}

interface AccessibilityMetrics {
  total: number;
  passed: number;
  passRate: string;
  coverage: string;
}

interface TrendData {
  timestamp: string;
  healthScore: number;
  passRate: number;
  totalTests: number;
}

export default function VisualAnalytics() {
  const [metrics, setMetrics] = useState<VisualMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVisualMetrics();
  }, []);

  const loadVisualMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would fetch from an API endpoint
      // For now, we'll simulate with sample data
      const response = await fetch('/api/visual-analytics');
      
      if (!response.ok) {
        throw new Error('Failed to load visual analytics');
      }
      
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error loading visual metrics:', err);
      setError('Could not load visual analytics data');
      
      // Load sample data for demonstration
      setMetrics(generateSampleMetrics());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleMetrics = (): VisualMetrics => ({
    healthScore: 95,
    passRate: 98.5,
    totalTests: 42,
    components: {
      button: { total: 11, passed: 11, passRate: '100', healthScore: 100 },
      card: { total: 4, passed: 4, passRate: '100', healthScore: 100 },
      input: { total: 8, passed: 8, passRate: '100', healthScore: 100 },
    },
    accessibility: {
      total: 12,
      passed: 12,
      passRate: '100',
      coverage: 'complete',
    },
    trends: generateSampleTrends(),
  });

  const generateSampleTrends = (): TrendData[] => {
    const trends: TrendData[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      trends.push({
        timestamp: date.toISOString(),
        healthScore: 90 + Math.random() * 10,
        passRate: 95 + Math.random() * 5,
        totalTests: 35 + Math.floor(Math.random() * 15),
      });
    }
    
    return trends;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBadge = (score: number) => {
    if (score >= 95) return { variant: 'default' as const, text: 'Excellent' };
    if (score >= 85) return { variant: 'secondary' as const, text: 'Good' };
    return { variant: 'destructive' as const, text: 'Needs Attention' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={loadVisualMetrics}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const healthBadge = getHealthScoreBadge(metrics.healthScore);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visual Analytics</h1>
          <p className="text-gray-600 mt-1">
            Monitor visual regression testing health and trends
          </p>
        </div>
        <button
          onClick={loadVisualMetrics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className={`text-3xl font-bold ${getHealthScoreColor(metrics.healthScore)}`}>
                {metrics.healthScore}
              </span>
              <Badge variant={healthBadge.variant}>{healthBadge.text}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall visual quality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {metrics.passRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.totalTests} tests total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {Object.keys(metrics.components).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Components tested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {metrics.accessibility.passRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.accessibility.coverage} coverage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Component Details */}
      <Card>
        <CardHeader>
          <CardTitle>Component Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.components).map(([name, component]) => (
              <div key={name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium capitalize">{name}</h3>
                    <p className="text-sm text-gray-600">
                      {component.passed}/{component.total} tests passing
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`font-bold ${getHealthScoreColor(component.healthScore)}`}>
                      {component.healthScore}
                    </div>
                    <div className="text-sm text-gray-600">{component.passRate}%</div>
                  </div>
                  <div className="w-16 h-16">
                    <div className="relative w-full h-full">
                      <svg className="transform -rotate-90 w-16 h-16">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${(parseFloat(component.passRate) / 100) * 176} 176`}
                          className={getHealthScoreColor(component.healthScore)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium">{component.passRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Trend Chart</div>
              <div className="text-sm">
                Health Score: {metrics.healthScore}/100
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Chart visualization would be implemented with Recharts or similar
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Details */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.accessibility.total}
              </div>
              <div className="text-sm text-gray-600">Accessibility Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.accessibility.passed}
              </div>
              <div className="text-sm text-gray-600">Tests Passed</div>
            </div>
            <div className="text-center">
              <Badge variant={metrics.accessibility.coverage === 'complete' ? 'default' : 'secondary'}>
                {metrics.accessibility.coverage}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Coverage Level</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
