/**
 * Alerting System for Multi-Tenant SaaS Platform
 *
 * Integrates with Sentry, Tinybird, and performance monitoring
 * Provides configurable alerting rules and notification channels
 */

'use client';

export interface Alert {
  id: string;
  type: 'error' | 'performance' | 'security' | 'business' | 'infrastructure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  tenantId?: string;
  metadata: Record<string, unknown>;
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  type: Alert['type'];
  severity: Alert['severity'];
  condition: string; // SQL-like condition for evaluation
  threshold: number;
  timeWindow: number; // minutes
  enabled: boolean;
  channels: AlertChannel[];
  cooldown: number; // minutes between alerts
  lastAlert?: number;
}

export interface AlertChannel {
  id: string;
  type: 'email' | 'slack' | 'webhook' | 'sentry';
  name: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

export interface AlertSubscription {
  id: string;
  userId: string;
  tenantId?: string;
  ruleIds: string[];
  channels: string[];
  minSeverity: Alert['severity'];
  enabled: boolean;
}

/**
 * Default alerting rules for the platform
 */
export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'high-error-rate',
    name: 'High Error Rate',
    type: 'error',
    severity: 'critical',
    condition: 'error_rate > 0.05', // 5% error rate
    threshold: 0.05,
    timeWindow: 15, // 15 minutes
    enabled: true,
    channels: ['email', 'slack'],
    cooldown: 30, // 30 minutes between alerts
  },
  {
    id: 'slow-api-response',
    name: 'Slow API Response Time',
    type: 'performance',
    severity: 'high',
    condition: 'avg_response_time > 2000', // 2 seconds
    threshold: 2000,
    timeWindow: 10,
    enabled: true,
    channels: ['email'],
    cooldown: 60,
  },
  {
    id: 'poor-core-web-vitals',
    name: 'Poor Core Web Vitals',
    type: 'performance',
    severity: 'medium',
    condition: 'lcp_p75 > 4000 OR inp_p75 > 500', // 4s LCP or 500ms INP
    threshold: 4000,
    timeWindow: 30,
    enabled: true,
    channels: ['email'],
    cooldown: 120,
  },
  {
    id: 'security-violation',
    name: 'Security Violation',
    type: 'security',
    severity: 'critical',
    condition: 'security_events > 0',
    threshold: 1,
    timeWindow: 5,
    enabled: true,
    channels: ['email', 'slack', 'webhook'],
    cooldown: 15,
  },
  {
    id: 'low-lead-conversion',
    name: 'Low Lead Conversion Rate',
    type: 'business',
    severity: 'medium',
    condition: 'conversion_rate < 0.02', // 2% conversion rate
    threshold: 0.02,
    timeWindow: 60, // 1 hour
    enabled: true,
    channels: ['email'],
    cooldown: 240, // 4 hours
  },
  {
    id: 'database-connection-exhaustion',
    name: 'Database Connection Exhaustion',
    type: 'infrastructure',
    severity: 'critical',
    condition: 'connection_pool_usage > 0.9', // 90% usage
    threshold: 0.9,
    timeWindow: 5,
    enabled: true,
    channels: ['email', 'slack', 'webhook'],
    cooldown: 10,
  },
];

/**
 * Alert manager class
 */
export class AlertManager {
  private rules: Map<string, AlertRule> = new Map();
  private channels: Map<string, AlertChannel> = new Map();
  private subscriptions: Map<string, AlertSubscription> = new Map();
  private alertHistory: Map<string, number> = new Map(); // Last alert time per rule

  constructor() {
    // Initialize default rules
    DEFAULT_ALERT_RULES.forEach((rule) => {
      this.rules.set(rule.id, rule);
    });

    // Initialize default channels
    this.initializeDefaultChannels();
  }

  private initializeDefaultChannels(): void {
    // Email channel
    this.channels.set('email', {
      id: 'email',
      type: 'email',
      name: 'Email Notifications',
      config: {
        smtp: process.env.SMTP_CONFIG,
        from: process.env.ALERT_EMAIL_FROM,
        templates: {
          error: 'error-alert-template',
          performance: 'performance-alert-template',
          security: 'security-alert-template',
          business: 'business-alert-template',
          infrastructure: 'infrastructure-alert-template',
        },
      },
      enabled: true,
    });

    // Slack channel
    this.channels.set('slack', {
      id: 'slack',
      type: 'slack',
      name: 'Slack Notifications',
      config: {
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: process.env.SLACK_ALERT_CHANNEL || '#alerts',
        username: 'Platform Alerts',
        icon_emoji: ':warning:',
      },
      enabled: !!process.env.SLACK_WEBHOOK_URL,
    });

    // Webhook channel
    this.channels.set('webhook', {
      id: 'webhook',
      type: 'webhook',
      name: 'Webhook Notifications',
      config: {
        url: process.env.ALERT_WEBHOOK_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ALERT_WEBHOOK_TOKEN}`,
        },
      },
      enabled: !!process.env.ALERT_WEBHOOK_URL,
    });

    // Sentry channel (for critical alerts)
    this.channels.set('sentry', {
      id: 'sentry',
      type: 'sentry',
      name: 'Sentry Alerts',
      config: {
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      },
      enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  }

  /**
   * Evaluate alert rules against metrics
   */
  async evaluateRules(metrics: {
    errorRate?: number;
    avgResponseTime?: number;
    lcpP75?: number;
    inpP75?: number;
    securityEvents?: number;
    conversionRate?: number;
    connectionPoolUsage?: number;
    tenantId?: string;
  }): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const now = Date.now();

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      // Check cooldown
      const lastAlert = this.alertHistory.get(rule.id);
      if (lastAlert && now - lastAlert < rule.cooldown * 60 * 1000) {
        continue;
      }

      // Evaluate condition
      if (this.evaluateCondition(rule.condition, metrics)) {
        const alert = this.createAlert(rule, metrics);
        alerts.push(alert);

        // Update last alert time
        this.alertHistory.set(rule.id, now);

        // Send notifications
        await this.sendNotifications(alert, rule.channels);
      }
    }

    return alerts;
  }

  /**
   * Evaluate condition string against metrics
   */
  private evaluateCondition(condition: string, metrics: Record<string, unknown>): boolean {
    try {
      // Simple condition evaluator (in production, use a proper expression parser)
      if (condition.includes('error_rate >')) {
        const threshold = parseFloat(condition.split(' > ')[1]);
        return (metrics.errorRate || 0) > threshold;
      }

      if (condition.includes('avg_response_time >')) {
        const threshold = parseFloat(condition.split(' > ')[1]);
        return (metrics.avgResponseTime || 0) > threshold;
      }

      if (condition.includes('lcp_p75 >')) {
        const threshold = parseFloat(condition.split(' > ')[1]);
        return (metrics.lcpP75 || 0) > threshold;
      }

      if (condition.includes('inp_p75 >')) {
        const threshold = parseFloat(condition.split(' > ')[1]);
        return (metrics.inpP75 || 0) > threshold;
      }

      if (condition.includes('security_events >')) {
        const threshold = parseFloat(condition.split(' > ')[1]);
        return (metrics.securityEvents || 0) > threshold;
      }

      if (condition.includes('conversion_rate <')) {
        const threshold = parseFloat(condition.split(' < ')[1]);
        return (metrics.conversionRate || 1) < threshold;
      }

      if (condition.includes('connection_pool_usage >')) {
        const threshold = parseFloat(condition.split(' > ')[1]);
        return (metrics.connectionPoolUsage || 0) > threshold;
      }

      return false;
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  /**
   * Create alert from rule and metrics
   */
  private createAlert(rule: AlertRule, metrics: Record<string, unknown>): Alert {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: rule.type,
      severity: rule.severity,
      title: rule.name,
      description: this.generateAlertDescription(rule, metrics),
      tenantId: metrics.tenantId as string,
      metadata: {
        ruleId: rule.id,
        ruleName: rule.name,
        threshold: rule.threshold,
        actualValue: this.getActualValue(rule, metrics),
        timeWindow: rule.timeWindow,
        ...metrics,
      },
      timestamp: Date.now(),
      resolved: false,
    };
  }

  /**
   * Generate human-readable alert description
   */
  private generateAlertDescription(rule: AlertRule, metrics: Record<string, unknown>): string {
    const actualValue = this.getActualValue(rule, metrics);

    switch (rule.type) {
      case 'error':
        return `Error rate of ${((actualValue as number) * 100).toFixed(2)}% exceeds threshold of ${(rule.threshold * 100).toFixed(2)}% over the last ${rule.timeWindow} minutes.`;

      case 'performance':
        if (rule.condition.includes('response_time')) {
          return `Average API response time of ${(actualValue as number).toFixed(0)}ms exceeds threshold of ${rule.threshold}ms over the last ${rule.timeWindow} minutes.`;
        }
        return `Performance metrics exceed thresholds: LCP P75: ${metrics.lcpP75 || 'N/A'}ms, INP P75: ${metrics.inpP75 || 'N/A'}ms`;

      case 'security':
        return `${actualValue} security events detected in the last ${rule.timeWindow} minutes, exceeding threshold of ${rule.threshold}.`;

      case 'business':
        return `Lead conversion rate of ${((actualValue as number) * 100).toFixed(2)}% is below threshold of ${(rule.threshold * 100).toFixed(2)}% over the last ${rule.timeWindow} minutes.`;

      case 'infrastructure':
        return `Database connection pool usage at ${((actualValue as number) * 100).toFixed(1)}% exceeds threshold of ${(rule.threshold * 100).toFixed(1)}%.`;

      default:
        return `Alert triggered: ${rule.name}`;
    }
  }

  /**
   * Get actual value from metrics for the rule
   */
  private getActualValue(rule: AlertRule, metrics: Record<string, unknown>): number {
    if (rule.condition.includes('error_rate')) return (metrics.errorRate as number) || 0;
    if (rule.condition.includes('avg_response_time'))
      return (metrics.avgResponseTime as number) || 0;
    if (rule.condition.includes('lcp_p75')) return (metrics.lcpP75 as number) || 0;
    if (rule.condition.includes('inp_p75')) return (metrics.inpP75 as number) || 0;
    if (rule.condition.includes('security_events')) return (metrics.securityEvents as number) || 0;
    if (rule.condition.includes('conversion_rate')) return (metrics.conversionRate as number) || 0;
    if (rule.condition.includes('connection_pool_usage'))
      return (metrics.connectionPoolUsage as number) || 0;
    return 0;
  }

  /**
   * Send notifications through configured channels
   */
  private async sendNotifications(alert: Alert, channelIds: string[]): Promise<void> {
    const notifications = channelIds
      .map((id) => this.channels.get(id))
      .filter((channel) => channel && channel.enabled);

    await Promise.allSettled(notifications.map((channel) => this.sendToChannel(alert, channel!)));
  }

  /**
   * Send alert to specific channel
   */
  private async sendToChannel(alert: Alert, channel: AlertChannel): Promise<void> {
    try {
      switch (channel.type) {
        case 'email':
          await this.sendEmailAlert(alert, channel);
          break;
        case 'slack':
          await this.sendSlackAlert(alert, channel);
          break;
        case 'webhook':
          await this.sendWebhookAlert(alert, channel);
          break;
        case 'sentry':
          await this.sendSentryAlert(alert, channel);
          break;
      }
    } catch (error) {
      console.error(`Failed to send alert to ${channel.type}:`, error);
    }
  }

  /**
   * Send email alert
   */
  private async sendEmailAlert(alert: Alert, channel: AlertChannel): Promise<void> {
    // Implementation would use the email service
    console.log('Email alert sent:', alert.title);
  }

  /**
   * Send Slack alert
   */
  private async sendSlackAlert(alert: Alert, channel: AlertChannel): Promise<void> {
    const config = channel.config as Record<string, string>;
    const payload = {
      channel: config.channel,
      username: config.username,
      icon_emoji: config.icon_emoji,
      text: `🚨 ${alert.title}`,
      attachments: [
        {
          color: this.getSeverityColor(alert.severity),
          fields: [
            {
              title: 'Severity',
              value: alert.severity.toUpperCase(),
              short: true,
            },
            {
              title: 'Type',
              value: alert.type,
              short: true,
            },
            {
              title: 'Description',
              value: alert.description,
              short: false,
            },
            {
              title: 'Tenant ID',
              value: alert.tenantId || 'N/A',
              short: true,
            },
          ],
          timestamp: Math.floor(alert.timestamp / 1000),
        },
      ],
    };

    const response = await fetch(config.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`);
    }
  }

  /**
   * Send webhook alert
   */
  private async sendWebhookAlert(alert: Alert, channel: AlertChannel): Promise<void> {
    const config = channel.config as { url: string; headers: Record<string, string> };

    const response = await fetch(config.url, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(alert),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  }

  /**
   * Send Sentry alert
   */
  private async sendSentryAlert(alert: Alert, channel: AlertChannel): Promise<void> {
    if (typeof window === 'undefined') return;

    const Sentry = await import('@sentry/nextjs');

    Sentry.captureMessage(alert.title, {
      level: this.getSentrySeverity(alert.severity),
      extra: {
        alertType: alert.type,
        alertSeverity: alert.severity,
        description: alert.description,
        tenantId: alert.tenantId,
        metadata: alert.metadata,
      },
      tags: {
        alert_id: alert.id,
        tenant_id: alert.tenantId || 'unknown',
      },
    });
  }

  /**
   * Get color for Slack based on severity
   */
  private getSeverityColor(severity: Alert['severity']): string {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'good';
      case 'low':
        return '#36a64f';
      default:
        return 'good';
    }
  }

  /**
   * Get Sentry severity level
   */
  private getSentrySeverity(
    severity: Alert['severity']
  ): 'fatal' | 'error' | 'warning' | 'info' | 'debug' {
    switch (severity) {
      case 'critical':
        return 'fatal';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  }

  /**
   * Add custom alert rule
   */
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove alert rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Get all rules
   */
  getRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    // This would typically query a database or cache
    // For now, return empty array
    return [];
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string, resolvedBy: string): void {
    // Implementation would update alert in database
    console.log(`Alert ${alertId} resolved by ${resolvedBy}`);
  }
}

// Singleton instance
export const alertManager = new AlertManager();

/**
 * Hook for using alert manager
 */
export function useAlertManager() {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);

  useEffect(() => {
    // Load initial data
    setRules(alertManager.getRules());
    setActiveAlerts(alertManager.getActiveAlerts());
  }, []);

  const evaluateRules = useCallback(async (metrics: Record<string, unknown>) => {
    const alerts = await alertManager.evaluateRules(metrics);
    setActiveAlerts((prev) => [...prev, ...alerts]);
    return alerts;
  }, []);

  const resolveAlert = useCallback((alertId: string, resolvedBy: string) => {
    alertManager.resolveAlert(alertId, resolvedBy);
    setActiveAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  return {
    activeAlerts,
    rules,
    evaluateRules,
    resolveAlert,
    addRule: alertManager.addRule.bind(alertManager),
    removeRule: alertManager.removeRule.bind(alertManager),
  };
}
