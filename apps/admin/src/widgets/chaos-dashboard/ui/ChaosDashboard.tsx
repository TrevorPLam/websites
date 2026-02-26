/**
 * @file apps/admin/src/widgets/chaos-dashboard/ui/ChaosDashboard.tsx
 * @summary Chaos testing dashboard for real-time metrics and experiment results
 * @see TASKS1.md TASK-005.4 Chaos Engineering Implementation
 *
 * Purpose: Production-ready dashboard for monitoring chaos engineering experiments.
 * Displays real-time chaos metrics, system resilience scores, and experiment results.
 *
 * Exports / Entry: ChaosDashboard component
 * Used by: Admin dashboard pages, SRE team monitoring, system health tracking
 *
 * Security Features:
 * - Tenant-isolated chaos metrics
 * - Role-based access control for chaos operations
 * - Audit logging for all chaos experiments
 * - Real-time safety monitoring
 *
 * Dependencies:
 * - React 19 with Server Components
 * - @repo/ui for design system components
 * - Recharts for data visualization
 * - WebSocket for real-time updates
 *
 * Status: @production-ready
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import { Progress } from '@repo/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Chaos experiment metrics interface
 */
interface ChaosMetrics {
  experimentId: string;
  experimentName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  resilienceScore: number;
  failureTypes: string[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  systemImpact: {
    availability: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  tenantImpact: {
    affectedTenants: number;
    totalTenants: number;
    isolationViolations: number;
  };
}

/**
 * System resilience metrics interface
 */
interface SystemResilience {
  overallScore: number;
  availability: number;
  faultTolerance: number;
  recoveryTime: number;
  dataConsistency: number;
  securityCompliance: number;
  lastUpdated: Date;
}

/**
 * Chaos experiment configuration interface
 */
interface ChaosExperiment {
  id: string;
  name: string;
  description: string;
  failureTypes: string[];
  probability: number;
  duration: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  schedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    nextRun: Date;
  };
}

/**
 * Chaos Dashboard Component
 */
export function ChaosDashboard() {
  const [metrics, setMetrics] = useState<ChaosMetrics[]>([]);
  const [resilience, setResilience] = useState<SystemResilience | null>(null);
  const [experiments, setExperiments] = useState<ChaosExperiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch chaos metrics from API
   */
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/chaos/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch chaos metrics');
      }
      const data = await response.json();
      setMetrics(data.metrics || []);
      setResilience(data.resilience || null);
      setExperiments(data.experiments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Start chaos experiment
   */
  const startExperiment = async (experimentId: string) => {
    try {
      const response = await fetch(`/api/admin/chaos/experiments/${experimentId}/start`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to start experiment');
      }
      
      await fetchMetrics(); // Refresh metrics
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start experiment');
    }
  };

  /**
   * Stop chaos experiment
   */
  const stopExperiment = async (experimentId: string) => {
    try {
      const response = await fetch(`/api/admin/chaos/experiments/${experimentId}/stop`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to stop experiment');
      }
      
      await fetchMetrics(); // Refresh metrics
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop experiment');
    }
  };

  /**
   * Initialize dashboard and set up real-time updates
   */
  useEffect(() => {
    fetchMetrics();

    // Set up WebSocket for real-time updates
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chaos_metrics_update') {
          setMetrics(prev => {
            const updatedMetrics = [...prev];
            const index = updatedMetrics.findIndex(m => m.experimentId === data.experimentId);
            if (index >= 0) {
              updatedMetrics[index] = { ...updatedMetrics[index], ...data.metrics };
            } else {
              updatedMetrics.push(data.metrics);
            }
            return updatedMetrics;
          });
        } else if (data.type === 'resilience_update') {
          setResilience(data.resilience);
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [fetchMetrics]);

  /**
   * Get status badge color
   */
  const getStatusBadgeColor = (status: ChaosMetrics['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  /**
   * Get severity badge color
   */
  const getSeverityBadgeColor = (severity: ChaosExperiment['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Format duration for display
   */
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading chaos metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chaos Engineering Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system resilience and chaos experiment results
          </p>
        </div>
        <Button onClick={fetchMetrics} variant="outline">
          Refresh
        </Button>
      </div>

      {/* System Resilience Overview */}
      {resilience && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Resilience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resilience.overallScore.toFixed(1)}%</div>
              <Progress value={resilience.overallScore} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resilience.availability.toFixed(2)}%</div>
              <Progress value={resilience.availability} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fault Tolerance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resilience.faultTolerance.toFixed(1)}%</div>
              <Progress value={resilience.faultTolerance} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recovery Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(resilience.recoveryTime)}</div>
              <p className="text-xs text-muted-foreground">Average recovery</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Data Consistency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resilience.dataConsistency.toFixed(1)}%</div>
              <Progress value={resilience.dataConsistency} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Security Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resilience.securityCompliance.toFixed(1)}%</div>
              <Progress value={resilience.securityCompliance} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="experiments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="resilience">Resilience Trends</TabsTrigger>
        </TabsList>

        {/* Experiments Tab */}
        <TabsContent value="experiments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Active Experiments */}
            <Card>
              <CardHeader>
                <CardTitle>Active Experiments</CardTitle>
                <CardDescription>Currently running chaos experiments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {experiments.filter(exp => exp.isActive).map(experiment => (
                  <div key={experiment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{experiment.name}</h4>
                      <p className="text-sm text-muted-foreground">{experiment.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getSeverityBadgeColor(experiment.severity)}>
                          {experiment.severity}
                        </Badge>
                        <Badge variant="outline">{experiment.failureTypes.length} failure types</Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => stopExperiment(experiment.id)}
                    >
                      Stop
                    </Button>
                  </div>
                ))}
                {experiments.filter(exp => exp.isActive).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active experiments</p>
                )}
              </CardContent>
            </Card>

            {/* Available Experiments */}
            <Card>
              <CardHeader>
                <CardTitle>Available Experiments</CardTitle>
                <CardDescription>Start new chaos experiments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {experiments.filter(exp => !exp.isActive).map(experiment => (
                  <div key={experiment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{experiment.name}</h4>
                      <p className="text-sm text-muted-foreground">{experiment.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getSeverityBadgeColor(experiment.severity)}>
                          {experiment.severity}
                        </Badge>
                        <Badge variant="outline">{experiment.failureTypes.join(', ')}</Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => startExperiment(experiment.id)}
                    >
                      Start
                    </Button>
                  </div>
                ))}
                {experiments.filter(exp => !exp.isActive).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No available experiments</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Experiment Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Experiment Results</CardTitle>
                <CardDescription>Latest chaos experiment outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.slice(0, 5).map(metric => (
                    <div key={metric.experimentId} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{metric.experimentName}</h4>
                        <Badge className={getStatusBadgeColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Resilience Score:</span>
                          <span className="ml-1 font-medium">{metric.resilienceScore.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-1 font-medium">
                            {metric.duration ? formatDuration(metric.duration) : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tests:</span>
                          <span className="ml-1 font-medium">
                            {metric.passedTests}/{metric.totalTests}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Impact:</span>
                          <span className="ml-1 font-medium">
                            {metric.systemImpact.availability.toFixed(1)}% availability
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {metrics.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No experiment results available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Impact Chart */}
            <Card>
              <CardHeader>
                <CardTitle>System Impact Analysis</CardTitle>
                <CardDescription>System performance during chaos experiments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.map(metric => ({
                    name: metric.experimentName,
                    availability: metric.systemImpact.availability,
                    responseTime: metric.systemImpact.responseTime,
                    errorRate: metric.systemImpact.errorRate,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="availability" stroke="#2563eb" name="Availability %" />
                    <Line type="monotone" dataKey="responseTime" stroke="#dc2626" name="Response Time (ms)" />
                    <Line type="monotone" dataKey="errorRate" stroke="#f59e0b" name="Error Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resilience Trends Tab */}
        <TabsContent value="resilience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Resilience Score Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Resilience Score Trends</CardTitle>
                <CardDescription>System resilience over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.map(metric => ({
                    name: new Date(metric.startTime).toLocaleDateString(),
                    score: metric.resilienceScore,
                    availability: metric.systemImpact.availability,
                    faultTolerance: (metric.passedTests / metric.totalTests) * 100,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="score" stackId="1" stroke="#2563eb" fill="#2563eb" name="Resilience Score" />
                    <Area type="monotone" dataKey="availability" stackId="1" stroke="#16a34a" fill="#16a34a" name="Availability" />
                    <Area type="monotone" dataKey="faultTolerance" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Fault Tolerance" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tenant Impact Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Tenant Impact Analysis</CardTitle>
                <CardDescription>Multi-tenant isolation during chaos experiments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.map(metric => ({
                        name: metric.experimentName,
                        affectedTenants: metric.tenantImpact.affectedTenants,
                        totalTenants: metric.tenantImpact.totalTenants,
                        isolationViolations: metric.tenantImpact.isolationViolations,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, affectedTenants, totalTenants }) => 
                        `${name}: ${affectedTenants}/${totalTenants}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="affectedTenants"
                    >
                      {metrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#2563eb', '#16a34a', '#f59e0b', '#dc2626'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Isolation violations: {metrics.reduce((sum, m) => sum + m.tenantImpact.isolationViolations, 0)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
