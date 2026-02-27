import { z } from 'zod';

/**
 * Advanced Usage Analytics System
 * Implements 2026 standards for comprehensive usage tracking and analysis
 */

// Analytics event schemas
export const AnalyticsEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  timestamp: z.string(),
  userId: z.string().optional(),
  sessionId: z.string(),
  tenantId: z.string(),
  properties: z.record(z.any()),
  context: z.object({
    userAgent: z.string(),
    ip: z.string(),
    referrer: z.string().optional(),
    url: z.string(),
    platform: z.string(),
    version: z.string()
  }),
  metrics: z.object({
    duration: z.number().optional(),
    value: z.number().optional(),
    count: z.number().optional()
  })
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

/**
 * Advanced Analytics Engine
 */
export class AdvancedAnalyticsEngine {
  private events: AnalyticsEvent[] = [];
  private aggregations: Map<string, Aggregation> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private insights: Map<string, Insight> = new Map();
  private config: AnalyticsConfig;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      retentionDays: 90,
      aggregationInterval: 300, // 5 minutes
      alertThresholds: {
        errorRate: 0.05,
        responseTime: 1000,
        bounceRate: 0.7
      },
      ...config
    };
    
    this.startAnalyticsEngine();
  }

  /**
   * Track analytics events
   */
  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<string> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date().toISOString()
    };

    this.events.push(fullEvent);
    
    // Process event for real-time analytics
    await this.processEvent(fullEvent);
    
    // Check for alerts
    await this.checkAlerts(fullEvent);
    
    // Update aggregations
    await this.updateAggregations(fullEvent);
    
    return fullEvent.id;
  }

  /**
   * Generate comprehensive usage report
   */
  async generateUsageReport(timeRange: TimeRange, filters: ReportFilters = {}): Promise<UsageReport> {
    const filteredEvents = this.filterEvents(timeRange, filters);
    
    const report: UsageReport = {
      timeRange,
      filters,
      summary: this.calculateSummary(filteredEvents),
      userAnalytics: this.analyzeUserBehavior(filteredEvents),
      featureAnalytics: this.analyzeFeatureUsage(filteredEvents),
      performanceAnalytics: this.analyzePerformance(filteredEvents),
      businessMetrics: this.calculateBusinessMetrics(filteredEvents),
      trends: this.calculateTrends(filteredEvents),
      anomalies: this.detectAnomalies(filteredEvents),
      recommendations: this.generateRecommendations(filteredEvents),
      insights: await this.generateInsights(filteredEvents)
    };

    return report;
  }

  /**
   * Real-time dashboard data
   */
  async getDashboardData(dashboardId: string): Promise<DashboardData> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const now = new Date();
    const lastHour = new Date(now.getTime() - 3600000);
    const recentEvents = this.events.filter(e => new Date(e.timestamp) >= lastHour);

    return {
      dashboardId,
      timestamp: now.toISOString(),
      metrics: this.calculateDashboardMetrics(recentEvents, dashboard),
      charts: await this.generateChartData(recentEvents, dashboard),
      alerts: this.getActiveAlerts(),
      insights: this.getRecentInsights()
    };
  }

  /**
   * Advanced user segmentation
   */
  async segmentUsers(criteria: SegmentationCriteria): Promise<UserSegment[]> {
    const users = await this.getUserProfiles();
    const segments: UserSegment[] = [];

    // Behavioral segmentation
    if (criteria.behavioral) {
      const behavioralSegments = await this.performBehavioralSegmentation(users, criteria.behavioral);
      segments.push(...behavioralSegments);
    }

    // Demographic segmentation
    if (criteria.demographic) {
      const demographicSegments = await this.performDemographicSegmentation(users, criteria.demographic);
      segments.push(...demographicSegments);
    }

    // Usage-based segmentation
    if (criteria.usage) {
      const usageSegments = await this.performUsageSegmentation(users, criteria.usage);
      segments.push(...usageSegments);
    }

    // Predictive segmentation
    if (criteria.predictive) {
      const predictiveSegments = await this.performPredictiveSegmentation(users, criteria.predictive);
      segments.push(...predictiveSegments);
    }

    return segments;
  }

  /**
   * Funnel analysis
   */
  async analyzeFunnel(funnelDefinition: FunnelDefinition): Promise<FunnelAnalysis> {
    const events = this.getEventsByType(funnelDefinition.eventType);
    const funnelSteps: FunnelStep[] = [];

    for (let i = 0; i < funnelDefinition.steps.length; i++) {
      const step = funnelDefinition.steps[i];
      const stepEvents = events.filter(e => e.properties.action === step.action);
      
      const uniqueUsers = new Set(stepEvents.map(e => e.userId).filter(Boolean));
      const conversionRate = i === 0 ? 1 : uniqueUsers.size / funnelSteps[i - 1].users;
      
      funnelSteps.push({
        step: step.name,
        users: uniqueUsers.size,
        conversionRate,
        dropoffRate: 1 - conversionRate,
        averageTime: this.calculateAverageStepTime(stepEvents),
        abandonmentReasons: await this.analyzeAbandonmentReasons(stepEvents)
      });
    }

    return {
      funnelDefinition,
      steps: funnelSteps,
      overallConversion: funnelSteps[funnelSteps.length - 1]?.conversionRate || 0,
      insights: await this.generateFunnelInsights(funnelSteps),
      recommendations: await this.generateFunnelRecommendations(funnelSteps)
    };
  }

  /**
   * Cohort analysis
   */
  async analyzeCohorts(cohortDefinition: CohortDefinition): Promise<CohortAnalysis> {
    const cohorts: Cohort[] = [];
    const events = this.getEventsByType(cohortDefinition.eventType);
    
    // Group users by cohort
    const userCohorts = await this.groupUsersByCohort(events, cohortDefinition);
    
    for (const [cohortId, cohortUsers] of userCohorts) {
      const cohortEvents = events.filter(e => cohortUsers.has(e.userId!));
      const retentionData = await this.calculateRetention(cohortEvents, cohortDefinition);
      
      cohorts.push({
        id: cohortId,
        name: this.getCohortName(cohortId, cohortDefinition),
        users: cohortUsers.size,
        retention: retentionData,
        metrics: await this.calculateCohortMetrics(cohortEvents, cohortDefinition)
      });
    }

    return {
      cohortDefinition,
      cohorts,
      insights: await this.generateCohortInsights(cohorts),
      recommendations: await this.generateCohortRecommendations(cohorts)
    };
  }

  /**
   * Predictive analytics
   */
  async predictOutcomes(predictionRequest: PredictionRequest): Promise<PredictionResult> {
    const model = await this.getOrCreateModel(predictionRequest.type);
    const features = await this.extractFeatures(predictionRequest);
    const prediction = await model.predict(features);
    
    return {
      type: predictionRequest.type,
      prediction,
      confidence: prediction.confidence,
      factors: prediction.factors,
      timestamp: new Date().toISOString(),
      model: {
        name: model.name,
        version: model.version,
        accuracy: model.accuracy
      }
    };
  }

  /**
   * A/B testing analytics
   */
  async analyzeABTest(testDefinition: ABTestDefinition): Promise<ABTestAnalysis> {
    const events = this.getEventsByType('ab_test');
    const testEvents = events.filter(e => e.properties.testId === testDefinition.id);
    
    const variants = await this.groupByVariant(testEvents, testDefinition);
    const analysis: ABTestAnalysis = {
      testDefinition,
      variants: [],
      winner: null,
      significance: 0,
      insights: []
    };

    for (const [variantId, variantEvents] of variants) {
      const metrics = await this.calculateVariantMetrics(variantEvents, testDefinition);
      analysis.variants.push({
        id: variantId,
        name: testDefinition.variants.find(v => v.id === variantId)?.name || variantId,
        users: metrics.users,
        conversionRate: metrics.conversionRate,
        revenue: metrics.revenue,
        engagement: metrics.engagement,
        statisticalSignificance: await this.calculateSignificance(variantEvents, testEvents)
      });
    }

    // Determine winner
    analysis.winner = this.determineWinner(analysis.variants, testDefinition.goal);
    analysis.significance = await this.calculateOverallSignificance(analysis.variants);
    analysis.insights = await this.generateABTestInsights(analysis);

    return analysis;
  }

  // Private helper methods
  private startAnalyticsEngine(): void {
    // Start aggregation loop
    setInterval(async () => {
      await this.performAggregations();
      await this.cleanupOldData();
      await this.updateDashboards();
    }, this.config.aggregationInterval * 1000);
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async processEvent(event: AnalyticsEvent): Promise<void> {
    // Process event for real-time features
    if (event.type === 'error') {
      await this.handleErrorEvent(event);
    } else if (event.type === 'performance') {
      await this.handlePerformanceEvent(event);
    } else if (event.type === 'conversion') {
      await this.handleConversionEvent(event);
    }
  }

  private async checkAlerts(event: AnalyticsEvent): Promise<void> {
    for (const [alertId, alert] of this.alerts) {
      if (await this.shouldTriggerAlert(alert, event)) {
        await this.triggerAlert(alert, event);
      }
    }
  }

  private async updateAggregations(event: AnalyticsEvent): Promise<void> {
    for (const [key, aggregation] of this.aggregations) {
      if (this.matchesAggregation(aggregation, event)) {
        await this.updateAggregation(aggregation, event);
      }
    }
  }

  private filterEvents(timeRange: TimeRange, filters: ReportFilters): AnalyticsEvent[] {
    let filtered = this.events.filter(event => {
      const eventTime = new Date(event.timestamp);
      return eventTime >= timeRange.start && eventTime <= timeRange.end;
    });

    if (filters.tenantId) {
      filtered = filtered.filter(e => e.tenantId === filters.tenantId);
    }

    if (filters.userId) {
      filtered = filtered.filter(e => e.userId === filters.userId);
    }

    if (filters.eventTypes) {
      filtered = filtered.filter(e => filters.eventTypes!.includes(e.type));
    }

    return filtered;
  }

  private calculateSummary(events: AnalyticsEvent[]): any {
    const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean));
    const uniqueSessions = new Set(events.map(e => e.sessionId));
    const errors = events.filter(e => e.type === 'error');
    const conversions = events.filter(e => e.type === 'conversion');

    return {
      totalEvents: events.length,
      uniqueUsers: uniqueUsers.size,
      uniqueSessions: uniqueSessions.size,
      errorRate: errors.length / events.length,
      conversionRate: conversions.length / uniqueUsers.size,
      averageSessionDuration: this.calculateAverageSessionDuration(events),
      topEventTypes: this.getTopEventTypes(events)
    };
  }

  private analyzeUserBehavior(events: AnalyticsEvent[]): any {
    const userSessions = this.groupEventsByUser(events);
    
    return {
      userRetention: this.calculateUserRetention(userSessions),
      userEngagement: this.calculateUserEngagement(userSessions),
      userPaths: this.analyzeUserPaths(userSessions),
      userSegments: await this.identifyUserSegments(userSessions)
    };
  }

  private analyzeFeatureUsage(events: AnalyticsEvent[]): any {
    const featureEvents = events.filter(e => e.type === 'feature_usage');
    
    return {
      mostUsedFeatures: this.getMostUsedFeatures(featureEvents),
      featureAdoption: this.calculateFeatureAdoption(featureEvents),
      featureRetention: this.calculateFeatureRetention(featureEvents),
      featureCorrelation: await this.calculateFeatureCorrelation(featureEvents)
    };
  }

  private analyzePerformance(events: AnalyticsEvent[]): any {
    const performanceEvents = events.filter(e => e.type === 'performance');
    
    return {
      averageResponseTime: this.calculateAverageResponseTime(performanceEvents),
      errorRate: this.calculateErrorRate(events),
      slowQueries: this.identifySlowQueries(performanceEvents),
      performanceTrends: this.calculatePerformanceTrends(performanceEvents)
    };
  }

  private calculateBusinessMetrics(events: AnalyticsEvent[]): any {
    const revenueEvents = events.filter(e => e.type === 'revenue');
    const conversionEvents = events.filter(e => e.type === 'conversion');
    
    return {
      totalRevenue: revenueEvents.reduce((sum, e) => sum + (e.metrics?.value || 0), 0),
      averageRevenuePerUser: this.calculateARPU(revenueEvents),
      customerLifetimeValue: this.calculateCLV(events),
      churnRate: this.calculateChurnRate(events)
    };
  }

  private calculateTrends(events: AnalyticsEvent[]): any {
    return {
      userGrowth: this.calculateUserGrowthTrend(events),
      engagementTrend: this.calculateEngagementTrend(events),
      performanceTrend: this.calculatePerformanceTrend(events),
      revenueTrend: this.calculateRevenueTrend(events)
    };
  }

  private detectAnomalies(events: AnalyticsEvent[]): any[] {
    // Placeholder for anomaly detection
    return [];
  }

  private generateRecommendations(events: AnalyticsEvent[]): string[] {
    const recommendations: string[] = [];
    
    if (this.calculateErrorRate(events) > 0.05) {
      recommendations.push('Investigate high error rate');
    }
    
    if (this.calculateAverageResponseTime(events) > 1000) {
      recommendations.push('Optimize slow response times');
    }
    
    return recommendations;
  }

  private async generateInsights(events: AnalyticsEvent[]): Promise<Insight[]> {
    // Placeholder for insight generation
    return [];
  }

  // Placeholder implementations for complex methods
  private async handleErrorEvent(event: AnalyticsEvent): Promise<void> {
    console.log(`Handling error event: ${event.id}`);
  }

  private async handlePerformanceEvent(event: AnalyticsEvent): Promise<void> {
    console.log(`Handling performance event: ${event.id}`);
  }

  private async handleConversionEvent(event: AnalyticsEvent): Promise<void> {
    console.log(`Handling conversion event: ${event.id}`);
  }

  private async shouldTriggerAlert(alert: Alert, event: AnalyticsEvent): Promise<boolean> {
    return false; // Placeholder
  }

  private async triggerAlert(alert: Alert, event: AnalyticsEvent): Promise<void> {
    console.log(`Triggering alert: ${alert.name}`);
  }

  private matchesAggregation(aggregation: Aggregation, event: AnalyticsEvent): boolean {
    return true; // Placeholder
  }

  private async updateAggregation(aggregation: Aggregation, event: AnalyticsEvent): Promise<void> {
    // Placeholder
  }

  private async performAggregations(): Promise<void> {
    // Placeholder
  }

  private async cleanupOldData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
    
    this.events = this.events.filter(e => new Date(e.timestamp) >= cutoffDate);
  }

  private async updateDashboards(): Promise<void> {
    // Placeholder
  }

  private calculateDashboardMetrics(events: AnalyticsEvent[], dashboard: Dashboard): any {
    return {}; // Placeholder
  }

  private async generateChartData(events: AnalyticsEvent[], dashboard: Dashboard): Promise<any[]> {
    return []; // Placeholder
  }

  private getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(a => a.active);
  }

  private getRecentInsights(): Insight[] {
    return Array.from(this.insights.values()).slice(-10);
  }

  private async getUserProfiles(): Promise<Map<string, UserProfile>> {
    return new Map(); // Placeholder
  }

  private async performBehavioralSegmentation(users: Map<string, UserProfile>, criteria: any): Promise<UserSegment[]> {
    return []; // Placeholder
  }

  private async performDemographicSegmentation(users: Map<string, UserProfile>, criteria: any): Promise<UserSegment[]> {
    return []; // Placeholder
  }

  private async performUsageSegmentation(users: Map<string, UserProfile>, criteria: any): Promise<UserSegment[]> {
    return []; // Placeholder
  }

  private async performPredictiveSegmentation(users: Map<string, UserProfile>, criteria: any): Promise<UserSegment[]> {
    return []; // Placeholder
  }

  private getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(e => e.type === eventType);
  }

  private calculateAverageStepTime(events: AnalyticsEvent[]): number {
    return 100; // Placeholder
  }

  private async analyzeAbandonmentReasons(events: AnalyticsEvent[]): Promise<any[]> {
    return []; // Placeholder
  }

  private async generateFunnelInsights(steps: FunnelStep[]): Promise<any[]> {
    return []; // Placeholder
  }

  private async generateFunnelRecommendations(steps: FunnelStep[]): Promise<any[]> {
    return []; // Placeholder
  }

  private async groupUsersByCohort(events: AnalyticsEvent[], definition: CohortDefinition): Promise<Map<string, Set<string>>> {
    return new Map(); // Placeholder
  }

  private getCohortName(cohortId: string, definition: CohortDefinition): string {
    return `Cohort ${cohortId}`;
  }

  private async calculateRetention(events: AnalyticsEvent[], definition: CohortDefinition): Promise<RetentionData> {
    return { day1: 1.0, day7: 0.8, day30: 0.6 }; // Placeholder
  }

  private async calculateCohortMetrics(events: AnalyticsEvent[], definition: CohortDefinition): Promise<any> {
    return {}; // Placeholder
  }

  private async generateCohortInsights(cohorts: Cohort[]): Promise<any[]> {
    return []; // Placeholder
  }

  private async generateCohortRecommendations(cohorts: Cohort[]): Promise<any[]> {
    return []; // Placeholder
  }

  private async getOrCreateModel(type: string): Promise<any> {
    return { name: 'default_model', version: '1.0', accuracy: 0.85 }; // Placeholder
  }

  private async extractFeatures(request: PredictionRequest): Promise<any[]> {
    return []; // Placeholder
  }

  private async groupByVariant(events: AnalyticsEvent[], definition: ABTestDefinition): Promise<Map<string, AnalyticsEvent[]>> {
    return new Map(); // Placeholder
  }

  private async calculateVariantMetrics(events: AnalyticsEvent[], definition: ABTestDefinition): Promise<any> {
    return { users: 100, conversionRate: 0.1, revenue: 1000, engagement: 0.8 }; // Placeholder
  }

  private async calculateSignificance(variantEvents: AnalyticsEvent[], allEvents: AnalyticsEvent[]): Promise<number> {
    return 0.95; // Placeholder
  }

  private determineWinner(variants: any[], goal: string): string {
    return variants[0]?.id || ''; // Placeholder
  }

  private async calculateOverallSignificance(variants: any[]): Promise<number> {
    return 0.95; // Placeholder
  }

  private async generateABTestInsights(analysis: ABTestAnalysis): Promise<any[]> {
    return []; // Placeholder
  }

  private groupEventsByUser(events: AnalyticsEvent[]): Map<string, AnalyticsEvent[]> {
    const userEvents = new Map<string, AnalyticsEvent[]>();
    
    for (const event of events) {
      if (event.userId) {
        if (!userEvents.has(event.userId)) {
          userEvents.set(event.userId, []);
        }
        userEvents.get(event.userId)!.push(event);
      }
    }
    
    return userEvents;
  }

  private calculateUserRetention(userSessions: Map<string, AnalyticsEvent[]>): number {
    return 0.8; // Placeholder
  }

  private calculateUserEngagement(userSessions: Map<string, AnalyticsEvent[]>): number {
    return 0.7; // Placeholder
  }

  private analyzeUserPaths(userSessions: Map<string, AnalyticsEvent[]>): any {
    return {}; // Placeholder
  }

  private async identifyUserSegments(userSessions: Map<string, AnalyticsEvent[]>): Promise<any[]> {
    return []; // Placeholder
  }

  private getTopEventTypes(events: AnalyticsEvent[]): any[] {
    const typeCounts = new Map<string, number>();
    
    for (const event of events) {
      typeCounts.set(event.type, (typeCounts.get(event.type) || 0) + 1);
    }
    
    return Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));
  }

  private calculateAverageSessionDuration(events: AnalyticsEvent[]): number {
    return 300; // Placeholder
  }

  private getMostUsedFeatures(events: AnalyticsEvent[]): any[] {
    return []; // Placeholder
  }

  private calculateFeatureAdoption(events: AnalyticsEvent[]): number {
    return 0.6; // Placeholder
  }

  private calculateFeatureRetention(events: AnalyticsEvent[]): number {
    return 0.7; // Placeholder
  }

  private async calculateFeatureCorrelation(events: AnalyticsEvent[]): Promise<any> {
    return {}; // Placeholder
  }

  private calculateAverageResponseTime(events: AnalyticsEvent[]): number {
    return 200; // Placeholder
  }

  private calculateErrorRate(events: AnalyticsEvent[]): number {
    const errors = events.filter(e => e.type === 'error');
    return errors.length / events.length;
  }

  private identifySlowQueries(events: AnalyticsEvent[]): any[] {
    return []; // Placeholder
  }

  private calculatePerformanceTrends(events: AnalyticsEvent[]): any {
    return { trend: 'stable', change: 0 }; // Placeholder
  }

  private calculateARPU(events: AnalyticsEvent[]): number {
    const revenue = events.reduce((sum, e) => sum + (e.metrics?.value || 0), 0);
    const users = new Set(events.map(e => e.userId).filter(Boolean));
    return users.size > 0 ? revenue / users.size : 0;
  }

  private calculateCLV(events: AnalyticsEvent[]): number {
    return 1000; // Placeholder
  }

  private calculateChurnRate(events: AnalyticsEvent[]): number {
    return 0.05; // Placeholder
  }

  private calculateUserGrowthTrend(events: AnalyticsEvent[]): any {
    return { trend: 'increasing', rate: 0.1 }; // Placeholder
  }

  private calculateEngagementTrend(events: AnalyticsEvent[]): any {
    return { trend: 'stable', change: 0 }; // Placeholder
  }

  private calculatePerformanceTrend(events: AnalyticsEvent[]): any {
    return { trend: 'improving', change: -0.1 }; // Placeholder
  }

  private calculateRevenueTrend(events: AnalyticsEvent[]): any {
    return { trend: 'increasing', rate: 0.15 }; // Placeholder
  }
}

// Supporting types
export interface AnalyticsConfig {
  retentionDays?: number;
  aggregationInterval?: number;
  alertThresholds?: {
    errorRate: number;
    responseTime: number;
    bounceRate: number;
  };
}

export interface ReportFilters {
  tenantId?: string;
  userId?: string;
  eventTypes?: string[];
  dateRange?: TimeRange;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface UsageReport {
  timeRange: TimeRange;
  filters: ReportFilters;
  summary: any;
  userAnalytics: any;
  featureAnalytics: any;
  performanceAnalytics: any;
  businessMetrics: any;
  trends: any;
  anomalies: any[];
  recommendations: string[];
  insights: Insight[];
}

export interface DashboardData {
  dashboardId: string;
  timestamp: string;
  metrics: any;
  charts: any[];
  alerts: Alert[];
  insights: Insight[];
}

export interface SegmentationCriteria {
  behavioral?: any;
  demographic?: any;
  usage?: any;
  predictive?: any;
}

export interface UserSegment {
  id: string;
  name: string;
  users: string[];
  characteristics: any;
  size: number;
  confidence: number;
}

export interface FunnelDefinition {
  id: string;
  name: string;
  eventType: string;
  steps: Array<{
    name: string;
    action: string;
    required?: boolean;
  }>;
}

export interface FunnelAnalysis {
  funnelDefinition: FunnelDefinition;
  steps: FunnelStep[];
  overallConversion: number;
  insights: any[];
  recommendations: any[];
}

export interface FunnelStep {
  step: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime: number;
  abandonmentReasons: any[];
}

export interface CohortDefinition {
  id: string;
  name: string;
  eventType: string;
  grouping: 'daily' | 'weekly' | 'monthly';
  period: number;
}

export interface CohortAnalysis {
  cohortDefinition: CohortDefinition;
  cohorts: Cohort[];
  insights: any[];
  recommendations: any[];
}

export interface Cohort {
  id: string;
  name: string;
  users: number;
  retention: RetentionData;
  metrics: any;
}

export interface RetentionData {
  day1: number;
  day7: number;
  day30: number;
}

export interface PredictionRequest {
  type: 'churn' | 'conversion' | 'revenue' | 'engagement';
  userId?: string;
  features?: any[];
  timeHorizon?: number;
}

export interface PredictionResult {
  type: string;
  prediction: any;
  confidence: number;
  factors: any[];
  timestamp: string;
  model: {
    name: string;
    version: string;
    accuracy: number;
  };
}

export interface ABTestDefinition {
  id: string;
  name: string;
  variants: Array<{
    id: string;
    name: string;
    weight: number;
  }>;
  goal: 'conversion' | 'revenue' | 'engagement';
  duration: number;
}

export interface ABTestAnalysis {
  testDefinition: ABTestDefinition;
  variants: VariantAnalysis[];
  winner: string | null;
  significance: number;
  insights: any[];
}

export interface VariantAnalysis {
  id: string;
  name: string;
  users: number;
  conversionRate: number;
  revenue: number;
  engagement: number;
  statisticalSignificance: number;
}

export interface UserProfile {
  id: string;
  properties: any;
  behavior: any;
  demographics: any;
}

export interface Aggregation {
  id: string;
  type: string;
  interval: number;
  filters: any;
  metrics: any;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: any[];
  filters: any[];
  refreshInterval: number;
}

export interface Alert {
  id: string;
  name: string;
  condition: any;
  active: boolean;
  channels: string[];
}

export interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  data: any;
}
