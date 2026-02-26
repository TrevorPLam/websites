/**
 * @file apps/admin/src/components/ExecutiveDashboard.tsx
 * @summary Executive dashboard with stakeholder metrics, KPIs, and business insights
 * @description High-level executive dashboard displaying quality metrics, performance indicators, and business KPIs for stakeholder reporting
 * @security Multi-tenant data access with proper authorization and tenant isolation
 * @requirements TASK-009.4 / executive-dashboard / stakeholder-metrics / quality-tracking
 * @version 2026.02.26
 */

'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui';
import { format } from 'date-fns';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Download,
  RefreshCw,
  Rocket,
  Shield,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Types for executive dashboard data
interface ExecutiveMetrics {
  period: {
    type: string;
    startDate: string;
    endDate: string;
    days: number;
  };
  quality: {
    coverage: {
      lines: number;
      branches: number;
      functions: number;
      statements: number;
      trend: string;
      grade: string;
    };
    passRate: {
      overall: number;
      unit: number;
      integration: number;
      e2e: number;
      trend: string;
      grade: string;
    };
    reliability: {
      flakyRate: number;
      stability: number;
      trend: string;
      grade: string;
    };
    technicalDebt: {
      score: number;
      issues: number;
      trend: string;
      grade: string;
    };
  };
  performance: {
    coreWebVitals: {
      lcp: { current: number; target: number; grade: string };
      inp: { current: number; target: number; grade: string };
      cls: { current: number; target: number; grade: string };
    };
    bundleSize: {
      javascript: { current: number; target: number; grade: string };
      css: { current: number; target: number; grade: string };
      total: { current: number; target: number; grade: string };
    };
    buildTime: {
      average: number;
      target: number;
      trend: string;
      grade: string;
    };
  };
  operations: {
    deployments: {
      total: number;
      successful: number;
      failed: number;
      successRate: number;
      rollbackRate: number;
    };
    reliability: {
      uptime: number;
      errorRate: number;
      incidents: number;
      mttr: number;
    };
    security: {
      critical: number;
      high: number;
      medium: number;
      low: number;
      trend: string;
    };
  };
  business: {
    customers: {
      active: number;
      new: number;
      churn: number;
      satisfaction: number;
    };
    revenue: {
      mrr: number;
      arr: number;
      growth: number;
      trend: string;
    };
    usage: {
      pageViews: number;
      sessions: number;
      engagement: number;
      conversion: number;
    };
  };
  team: {
    productivity: {
      velocity: number;
      throughput: number;
      cycleTime: number;
      efficiency: number;
    };
    satisfaction: {
      overall: number;
      workLifeBalance: number;
      tools: number;
      processes: number;
    };
  };
}

interface TrendData {
  period: string;
  quality: number;
  performance: number;
  reliability: number;
  productivity: number;
}

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#8b5cf6',
  gray: '#6b7280',
  chart: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
};

const GRADE_COLORS = {
  A: COLORS.success,
  B: COLORS.warning,
  C: COLORS.danger,
  D: COLORS.danger,
};

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly'>(
    'monthly'
  );
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock data generation for demonstration
  const generateMockData = () => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 1);

    const trendData: TrendData[] = [];
    for (let i = 12; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);

      trendData.push({
        period: format(date, 'yyyy-MM'),
        quality: 75 + Math.random() * 20,
        performance: 80 + Math.random() * 15,
        reliability: 85 + Math.random() * 12,
        productivity: 70 + Math.random() * 25,
      });
    }

    const executiveMetrics: ExecutiveMetrics = {
      period: {
        type: selectedPeriod,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        days: 30,
      },
      quality: {
        coverage: {
          lines: 82.5,
          branches: 78.3,
          functions: 85.1,
          statements: 84.2,
          trend: '+2.1%',
          grade: 'B',
        },
        passRate: {
          overall: 94.2,
          unit: 96.8,
          integration: 91.5,
          e2e: 89.3,
          trend: '+1.8%',
          grade: 'A',
        },
        reliability: {
          flakyRate: 2.3,
          stability: 97.7,
          trend: '-0.5%',
          grade: 'A',
        },
        technicalDebt: {
          score: 7.2,
          issues: 23,
          trend: '-0.3',
          grade: 'B',
        },
      },
      performance: {
        coreWebVitals: {
          lcp: { current: 2.1, target: 2.5, grade: 'A' },
          inp: { current: 180, target: 200, grade: 'A' },
          cls: { current: 0.08, target: 0.1, grade: 'A' },
        },
        bundleSize: {
          javascript: { current: 245, target: 250, grade: 'A' },
          css: { current: 45, target: 50, grade: 'A' },
          total: { current: 290, target: 300, grade: 'A' },
        },
        buildTime: {
          average: 180,
          target: 240,
          trend: '-15s',
          grade: 'A',
        },
      },
      operations: {
        deployments: {
          total: 12,
          successful: 11,
          failed: 1,
          successRate: 91.7,
          rollbackRate: 8.3,
        },
        reliability: {
          uptime: 99.8,
          errorRate: 0.2,
          incidents: 2,
          mttr: 45,
        },
        security: {
          critical: 0,
          high: 1,
          medium: 3,
          low: 7,
          trend: 'stable',
        },
      },
      business: {
        customers: {
          active: 892,
          new: 47,
          churn: 2.1,
          satisfaction: 4.6,
        },
        revenue: {
          mrr: 44500,
          arr: 534000,
          growth: 12.3,
          trend: '+2.1%',
        },
        usage: {
          pageViews: 1240000,
          sessions: 89000,
          engagement: 4.2,
          conversion: 3.8,
        },
      },
      team: {
        productivity: {
          velocity: 26.3,
          throughput: 52.1,
          cycleTime: 2.8,
          efficiency: 87.5,
        },
        satisfaction: {
          overall: 4.2,
          workLifeBalance: 4.1,
          tools: 4.3,
          processes: 4.0,
        },
      },
    };

    return { metrics: executiveMetrics, trends: trendData };
  };

  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const data = generateMockData();

        setMetrics(data.metrics);
        setTrends(data.trends);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load executive metrics');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (autoRefresh) {
      const interval = setInterval(loadData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedPeriod]);

  const getGradeColor = (grade: string) => {
    return GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || COLORS.gray;
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend.startsWith('-')) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-lg text-gray-600">Loading executive dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  // Calculate overall grade
  const calculateOverallGrade = () => {
    const grades = [
      metrics.quality.coverage.grade,
      metrics.quality.passRate.grade,
      metrics.quality.reliability.grade,
      metrics.performance.coreWebVitals.lcp.grade,
    ];

    const gradeValues = { A: 4, B: 3, C: 2, D: 1 };
    const average =
      grades.reduce(
        (sum, grade) => sum + (gradeValues[grade as keyof typeof gradeValues] || 1),
        0
      ) / grades.length;

    if (average >= 3.5) return 'A';
    if (average >= 2.5) return 'B';
    if (average >= 1.5) return 'C';
    return 'D';
  };

  const overallGrade = calculateOverallGrade();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600">Stakeholder metrics and business insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) =>
              setSelectedPeriod(e.target.value as 'weekly' | 'monthly' | 'quarterly')
            }
            title="Select reporting period"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="weekly">Last Week</option>
            <option value="monthly">Last Month</option>
            <option value="quarterly">Last Quarter</option>
          </select>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Grade */}
      <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Overall Performance</CardTitle>
              <CardDescription>Executive summary for {selectedPeriod} period</CardDescription>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getGradeColor(overallGrade)}`}>
                {overallGrade}
              </div>
              <div className="text-sm text-gray-600">Overall Grade</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.quality.coverage.lines}%
              </div>
              <div className="text-sm text-gray-600">Test Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.quality.passRate.overall}%
              </div>
              <div className="text-sm text-gray-600">Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.operations.reliability.uptime}%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.business.customers.satisfaction}/5
              </div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.business.customers.active)}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>{metrics.business.customers.new} new this period</span>
            </div>
            <Progress value={(metrics.business.customers.active / 1000) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.business.revenue.mrr)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics.business.revenue.trend)}
              <span>{metrics.business.revenue.growth}% growth</span>
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.team.productivity.velocity}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-blue-500" />
              <span>Story points per sprint</span>
            </div>
            <Progress value={(metrics.team.productivity.velocity / 30) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Reliability</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.operations.reliability.uptime}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>{metrics.operations.reliability.incidents} incidents</span>
            </div>
            <Progress value={metrics.operations.reliability.uptime} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="quality" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quality">Quality & Performance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="business">Business Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Test coverage and reliability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Test Coverage</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-bold ${getGradeColor(metrics.quality.coverage.grade)}`}
                      >
                        {metrics.quality.coverage.lines}%
                      </span>
                      <Badge
                        style={{ backgroundColor: getGradeColor(metrics.quality.coverage.grade) }}
                      >
                        {metrics.quality.coverage.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metrics.quality.coverage.lines} />

                  <div className="flex items-center justify-between">
                    <span>Pass Rate</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-bold ${getGradeColor(metrics.quality.passRate.grade)}`}
                      >
                        {metrics.quality.passRate.overall}%
                      </span>
                      <Badge
                        style={{ backgroundColor: getGradeColor(metrics.quality.passRate.grade) }}
                      >
                        {metrics.quality.passRate.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metrics.quality.passRate.overall} />

                  <div className="flex items-center justify-between">
                    <span>Reliability</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-bold ${getGradeColor(metrics.quality.reliability.grade)}`}
                      >
                        {metrics.quality.reliability.stability}%
                      </span>
                      <Badge
                        style={{
                          backgroundColor: getGradeColor(metrics.quality.reliability.grade),
                        }}
                      >
                        {metrics.quality.reliability.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metrics.quality.reliability.stability} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals</CardTitle>
                <CardDescription>Performance metrics and user experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>LCP (Largest Contentful Paint)</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        {metrics.performance.coreWebVitals.lcp.current}s
                      </span>
                      <Badge
                        style={{
                          backgroundColor: getGradeColor(
                            metrics.performance.coreWebVitals.lcp.grade
                          ),
                        }}
                      >
                        {metrics.performance.coreWebVitals.lcp.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={
                      (metrics.performance.coreWebVitals.lcp.current /
                        metrics.performance.coreWebVitals.lcp.target) *
                      100
                    }
                  />

                  <div className="flex items-center justify-between">
                    <span>INP (Interaction to Next Paint)</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        {metrics.performance.coreWebVitals.inp.current}ms
                      </span>
                      <Badge
                        style={{
                          backgroundColor: getGradeColor(
                            metrics.performance.coreWebVitals.inp.grade
                          ),
                        }}
                      >
                        {metrics.performance.coreWebVitals.inp.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={
                      (metrics.performance.coreWebVitals.inp.current /
                        metrics.performance.coreWebVitals.inp.target) *
                      100
                    }
                  />

                  <div className="flex items-center justify-between">
                    <span>CLS (Cumulative Layout Shift)</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        {metrics.performance.coreWebVitals.cls.current}
                      </span>
                      <Badge
                        style={{
                          backgroundColor: getGradeColor(
                            metrics.performance.coreWebVitals.cls.grade
                          ),
                        }}
                      >
                        {metrics.performance.coreWebVitals.cls.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={
                      (metrics.performance.coreWebVitals.cls.current /
                        metrics.performance.coreWebVitals.cls.target) *
                      100
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Metrics</CardTitle>
                <CardDescription>Release frequency and success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Success Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        {metrics.operations.deployments.successRate}%
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <Progress value={metrics.operations.deployments.successRate} />

                  <div className="flex items-center justify-between">
                    <span>Total Deployments</span>
                    <span className="font-bold">{metrics.operations.deployments.total}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Failed Deployments</span>
                    <span className="font-bold text-red-600">
                      {metrics.operations.deployments.failed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>MTTR (Mean Time to Recovery)</span>
                    <span className="font-bold">{metrics.operations.reliability.mttr} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Overview</CardTitle>
                <CardDescription>Security vulnerabilities and posture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Critical</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{metrics.operations.security.critical}</span>
                      {metrics.operations.security.critical === 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>High Priority</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{metrics.operations.security.high}</span>
                      {metrics.operations.security.high > 0 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Medium Priority</span>
                    <span className="font-bold">{metrics.operations.security.medium}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Low Priority</span>
                    <span className="font-bold">{metrics.operations.security.low}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
                <CardDescription>Customer growth and satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Customers</span>
                    <span className="font-bold">
                      {formatNumber(metrics.business.customers.active)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>New Customers</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{metrics.business.customers.new}</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Churn Rate</span>
                    <span className="font-bold">{metrics.business.customers.churn}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        {metrics.business.customers.satisfaction}/5.0
                      </span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>Financial performance and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Monthly Recurring Revenue</span>
                    <span className="font-bold">
                      {formatCurrency(metrics.business.revenue.mrr)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Annual Recurring Revenue</span>
                    <span className="font-bold">
                      {formatCurrency(metrics.business.revenue.arr)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Growth Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{metrics.business.revenue.growth}%</span>
                      {getTrendIcon(metrics.business.revenue.trend)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-bold">{metrics.business.usage.conversion}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Historical trends across key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quality" stroke={COLORS.primary} name="Quality" />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke={COLORS.success}
                    name="Performance"
                  />
                  <Line
                    type="monotone"
                    dataKey="reliability"
                    stroke={COLORS.warning}
                    name="Reliability"
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke={COLORS.info}
                    name="Productivity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
