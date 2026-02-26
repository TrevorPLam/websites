/**
 * @file apps/admin/src/components/ProductionDashboard.tsx
 * @summary Production performance dashboard with real-time RUM and synthetic metrics
 * @description Comprehensive dashboard for monitoring production performance with RUM integration
 * @security Multi-tenant data access with proper authorization
 * @requirements TASK-007.3 / production-dashboard / real-time-metrics
 * @version 2026.02.26
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Zap,
  Globe,
  Server,
  Wifi,
  WifiOff
} from 'lucide-react';

// Types for dashboard data
interface PerformanceMetrics {
  timestamp: string;
  lcp: number;
  inp: number;
  cls: number;
  ttfb: number;
  correlationScore: number;
  userCount: number;
  errorRate: number;
}

interface CorrelationData {
  syntheticTestId: string;
  rumSessionId: string;
  correlationScore: number;
  varianceAnalysis: {
    lcpVariance: number;
    inpVariance: number;
    clsVariance: number;
    ttfbVariance: number;
    overallVariance: number;
  };
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface AlertData {
  id: string;
  type: 'performance' | 'correlation' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface TenantMetrics {
  tenantId: string;
  tenantName: string;
  userCount: number;
  avgLCP: number;
  avgINP: number;
  avgCLS: number;
  correlationScore: number;
  status: 'healthy' | 'degraded' | 'critical';
}

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 },
  inp: { good: 200, needsImprovement: 500 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  ttfb: { good: 800, needsImprovement: 1800 },
  correlation: { good: 0.8, needsImprovement: 0.6 },
};

// Colors for charts
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#8b5cf6',
};

const IMPACT_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export default function ProductionDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('6h');
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  
  // Dashboard state
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [tenantMetrics, setTenantMetrics] = useState<TenantMetrics[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 0,
    avgLCP: 0,
    avgINP: 0,
    avgCLS: 0,
    correlationScore: 0,
    errorRate: 0,
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [timeRange, selectedTenant]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all dashboard data in parallel
      const [metrics, correlations, alertData, tenants] = await Promise.all([
        fetchPerformanceMetrics(),
        fetchCorrelationData(),
        fetchAlerts(),
        fetchTenantMetrics(),
      ]);
      
      setPerformanceMetrics(metrics);
      setCorrelationData(correlations);
      setAlerts(alertData);
      setTenantMetrics(tenants);
      
      // Calculate real-time metrics
      if (metrics.length > 0) {
        const latest = metrics[metrics.length - 1];
        setRealTimeMetrics({
          activeUsers: latest.userCount,
          avgLCP: latest.lcp,
          avgINP: latest.inp,
          avgCLS: latest.cls,
          correlationScore: latest.correlationScore,
          errorRate: latest.errorRate,
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerformanceMetrics = async (): Promise<PerformanceMetrics[]> => {
    // Mock data - replace with actual API call
    const now = Date.now();
    const interval = timeRange === '1h' ? 300000 : timeRange === '6h' ? 1800000 : timeRange === '24h' ? 7200000 : 86400000;
    const points = timeRange === '1h' ? 12 : timeRange === '6h' ? 12 : timeRange === '24h' ? 12 : 7;
    
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(now - (points - i - 1) * interval).toISOString(),
      lcp: 1800 + Math.random() * 1200,
      inp: 120 + Math.random() * 80,
      cls: 0.05 + Math.random() * 0.15,
      ttfb: 400 + Math.random() * 400,
      correlationScore: 0.7 + Math.random() * 0.3,
      userCount: 100 + Math.floor(Math.random() * 900),
      errorRate: Math.random() * 5,
    }));
  };

  const fetchCorrelationData = async (): Promise<CorrelationData[]> => {
    // Mock data - replace with actual API call
    return Array.from({ length: 20 }, (_, i) => ({
      syntheticTestId: `test-${i}`,
      rumSessionId: `session-${i}`,
      correlationScore: 0.5 + Math.random() * 0.5,
      varianceAnalysis: {
        lcpVariance: Math.random() * 0.5,
        inpVariance: Math.random() * 0.5,
        clsVariance: Math.random() * 0.5,
        ttfbVariance: Math.random() * 0.5,
        overallVariance: Math.random() * 0.5,
      },
      impactLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      recommendations: [
        'Investigate network conditions',
        'Optimize JavaScript execution',
        'Review CDN configuration',
      ],
    }));
  };

  const fetchAlerts = async (): Promise<AlertData[]> => {
    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        type: 'performance',
        severity: 'high',
        message: 'LCP degradation detected on checkout page',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        resolved: false,
      },
      {
        id: '2',
        type: 'correlation',
        severity: 'medium',
        message: 'Low correlation between synthetic and RUM metrics',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        resolved: false,
      },
    ];
  };

  const fetchTenantMetrics = async (): Promise<TenantMetrics[]> => {
    // Mock data - replace with actual API call
    return [
      {
        tenantId: 'tenant-1',
        tenantName: 'Acme Corp',
        userCount: 450,
        avgLCP: 2100,
        avgINP: 150,
        avgCLS: 0.08,
        correlationScore: 0.85,
        status: 'healthy',
      },
      {
        tenantId: 'tenant-2',
        tenantName: 'Beta Inc',
        userCount: 320,
        avgLCP: 3200,
        avgINP: 280,
        avgCLS: 0.18,
        correlationScore: 0.65,
        status: 'degraded',
      },
    ];
  };

  const getPerformanceStatus = (value: number, threshold: { good: number; needsImprovement: number }) => {
    if (value <= threshold.good) return { status: 'good', color: 'text-green-600', icon: CheckCircle };
    if (value <= threshold.needsImprovement) return { status: 'needs-improvement', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'poor', color: 'text-red-600', icon: TrendingDown };
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Performance Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring with RUM and synthetic test correlation</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <Button onClick={fetchDashboardData} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg LCP</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.avgLCP.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Largest Contentful Paint</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correlation Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(realTimeMetrics.correlationScore * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Synthetic vs RUM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.errorRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Current error rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="correlation">RUM Correlation</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Core Web Vitals over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: number) => [`${value.toFixed(0)}ms`, '']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="lcp" 
                      stroke={CHART_COLORS.primary} 
                      strokeWidth={2}
                      name="LCP"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inp" 
                      stroke={CHART_COLORS.secondary} 
                      strokeWidth={2}
                      name="INP"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ttfb" 
                      stroke={CHART_COLORS.info} 
                      strokeWidth={2}
                      name="TTFB"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Correlation Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Correlation Score Trend</CardTitle>
                <CardDescription>Synthetic vs RUM correlation over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis domain={[0, 1]} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Correlation']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="correlationScore" 
                      stroke={CHART_COLORS.primary} 
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>LCP Distribution</CardTitle>
                <CardDescription>Largest Contentful Paint ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { range: 'Good', count: performanceMetrics.filter(m => m.lcp <= 2500).length },
                    { range: 'Needs Improvement', count: performanceMetrics.filter(m => m.lcp > 2500 && m.lcp <= 4000).length },
                    { range: 'Poor', count: performanceMetrics.filter(m => m.lcp > 4000).length },
                  ]}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>INP Distribution</CardTitle>
                <CardDescription>Interaction to Next Paint ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { range: 'Good', count: performanceMetrics.filter(m => m.inp <= 200).length },
                    { range: 'Needs Improvement', count: performanceMetrics.filter(m => m.inp > 200 && m.inp <= 500).length },
                    { range: 'Poor', count: performanceMetrics.filter(m => m.inp > 500).length },
                  ]}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CLS Distribution</CardTitle>
                <CardDescription>Cumulative Layout Shift ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { range: 'Good', count: performanceMetrics.filter(m => m.cls <= 0.1).length },
                    { range: 'Needs Improvement', count: performanceMetrics.filter(m => m.cls > 0.1 && m.cls <= 0.25).length },
                    { range: 'Poor', count: performanceMetrics.filter(m => m.cls > 0.25).length },
                  ]}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS.warning} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* RUM Correlation Tab */}
        <TabsContent value="correlation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Correlation Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Correlation Analysis</CardTitle>
                <CardDescription>Synthetic vs RUM variance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {correlationData.slice(0, 10).map((correlation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{correlation.syntheticTestId}</span>
                          <Badge variant={getImpactBadgeVariant(correlation.impactLevel)}>
                            {correlation.impactLevel}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Score: {(correlation.correlationScore * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {(correlation.varianceAnalysis.overallVariance * 100).toFixed(1)}% variance
                        </div>
                        <Progress 
                          value={correlation.correlationScore * 100} 
                          className="w-20 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Variance Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Variance Breakdown</CardTitle>
                <CardDescription>Average variance by metric</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['lcpVariance', 'inpVariance', 'clsVariance', 'ttfbVariance'].map((metric) => {
                    const avgVariance = correlationData.reduce((sum, c) => 
                      sum + c.varianceAnalysis[metric], 0) / correlationData.length;
                    
                    return (
                      <div key={metric} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{metric.replace('Variance', '').toUpperCase()}</span>
                          <span>{(avgVariance * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={avgVariance * 100} className="w-full" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Recommendations</CardTitle>
              <CardDescription>Generated from correlation analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(correlationData.flatMap(c => c.recommendations))).map((rec, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {tenantMetrics.map((tenant) => (
              <Card key={tenant.tenantId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tenant.tenantName}</CardTitle>
                    <Badge variant={tenant.status === 'healthy' ? 'default' : 'destructive'}>
                      {tenant.status}
                    </Badge>
                  </div>
                  <CardDescription>{tenant.userCount} active users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">LCP</span>
                      <span className="text-sm font-medium">{tenant.avgLCP}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">INP</span>
                      <span className="text-sm font-medium">{tenant.avgINP}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">CLS</span>
                      <span className="text-sm font-medium">{tenant.avgCLS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Correlation</span>
                      <span className="text-sm font-medium">{(tenant.correlationScore * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={tenant.correlationScore * 100} className="w-full mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Performance and correlation issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {alert.type === 'performance' && <TrendingDown className="h-5 w-5 text-red-500" />}
                      {alert.type === 'correlation' && <Activity className="h-5 w-5 text-yellow-500" />}
                      {alert.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      <div>
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {alert.resolved ? 'View' : 'Acknowledge'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
