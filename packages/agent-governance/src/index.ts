/**
 * @file packages/agent-governance/src/index.ts
 * @summary Enterprise governance framework with policy as code enforcement.
 * @description Security agents, policy engines, blast radius control, and audit trails for 2026 standards.
 * @security Policy enforcement with zero-trust architecture and comprehensive audit logging.
 * @requirements 2026-agentic-coding, governance, security, policy-as-code
 */
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Policy Schema
export const PolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  environment: z.enum(['development', 'staging', 'production']),
  rules: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['allow', 'deny', 'require_approval', 'limit', 'audit']),
      target: z.string(), // agent, tool, action, data
      condition: z.any(), // JSON schema for condition evaluation
      action: z.string(),
      priority: z.number().min(1).max(10),
      enabled: z.boolean().default(true),
      metadata: z.record(z.any()).optional(),
    })
  ),
  compliance: z.array(z.string()).optional(), // GDPR, HIPAA, SOC2, etc.
  lastUpdated: z.date(),
  author: z.string(),
});

export type Policy = z.infer<typeof PolicySchema>;

// Audit Event Schema
export const AuditEventSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  agentId: z.string(),
  action: z.string(),
  resource: z.string(),
  outcome: z.enum(['success', 'failure', 'blocked', 'escalated']),
  policyId: z.string().optional(),
  reason: z.string().optional(),
  metadata: z.record(z.any()),
  riskScore: z.number().min(0).max(10).default(1),
  complianceTags: z.array(z.string()).optional(),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

// Blast Radius Assessment
export interface BlastRadiusAssessment {
  criticality: 'low' | 'medium' | 'high' | 'critical';
  affectedSystems: string[];
  dataAccess: string[];
  externalConnections: boolean;
  rollbackPlan: string;
  escalationRequired: boolean;
  estimatedImpact: {
    users: number;
    systems: number;
    dataVolume: string;
    downtime: number; // minutes
  };
}

// Policy Engine
/**
 * Core policy enforcement engine with real-time evaluation and audit logging.
 *
 * Evaluates agent actions against governance policies, enforces security rules,
 * and maintains comprehensive audit trails for compliance requirements.
 */
export class PolicyEngine {
  private policies: Map<string, Policy> = new Map();
  private auditLog: AuditEvent[] = [];
  private complianceFrameworks: Set<string> = new Set();

  constructor() {
    this.loadDefaultPolicies();
  }

  private loadDefaultPolicies(): void {
    // Production Security Policies
    const productionPolicies: Policy[] = [
      {
        id: 'prod-tool-access',
        name: 'Production Tool Access Control',
        description: 'Controls which tools agents can access in production',
        version: '1.0.0',
        environment: 'production',
        rules: [
          {
            id: 'allow-safe-tools',
            type: 'allow',
            target: 'tool',
            condition: { category: ['web-search', 'file-read', 'database-query'] },
            action: 'execute',
            priority: 8,
            enabled: true,
          },
          {
            id: 'require-approval-write',
            type: 'require_approval',
            target: 'tool',
            condition: { category: ['file-write', 'database-write', 'deploy'] },
            action: 'execute',
            priority: 10,
            enabled: true,
          },
          {
            id: 'block-restricted-tools',
            type: 'deny',
            target: 'tool',
            condition: { category: ['system-command', 'network-request'] },
            action: 'execute',
            priority: 9,
            enabled: true,
          },
        ],
        compliance: ['GDPR', 'SOC2'],
        lastUpdated: new Date(),
        author: 'system',
      },
      {
        id: 'prod-data-access',
        name: 'Production Data Access Control',
        description: 'Controls data access patterns in production',
        version: '1.0.0',
        environment: 'production',
        rules: [
          {
            id: 'limit-data-volume',
            type: 'limit',
            target: 'data',
            condition: { operation: 'export', size: 'max' },
            action: '100MB',
            priority: 7,
            enabled: true,
          },
          {
            id: 'audit-sensitive-data',
            type: 'audit',
            target: 'data',
            condition: { sensitivity: ['pii', 'phi', 'financial'] },
            action: 'access',
            priority: 9,
            enabled: true,
          },
        ],
        compliance: ['GDPR', 'HIPAA'],
        lastUpdated: new Date(),
        author: 'system',
      },
    ];

    // Development Policies (more permissive)
    const developmentPolicies: Policy[] = [
      {
        id: 'dev-tool-access',
        name: 'Development Tool Access',
        description: 'Permissive tool access for development',
        version: '1.0.0',
        environment: 'development',
        rules: [
          {
            id: 'allow-most-tools',
            type: 'allow',
            target: 'tool',
            condition: { category: ['*'] },
            action: 'execute',
            priority: 5,
            enabled: true,
          },
          {
            id: 'audit-risky-operations',
            type: 'audit',
            target: 'tool',
            condition: { category: ['system-command', 'network-request'] },
            action: 'execute',
            priority: 6,
            enabled: true,
          },
        ],
        compliance: [],
        lastUpdated: new Date(),
        author: 'system',
      },
    ];

    productionPolicies.forEach((policy) => this.policies.set(policy.id, policy));
    developmentPolicies.forEach((policy) => this.policies.set(policy.id, policy));
  }

  addPolicy(policy: Policy): void {
    const validated = PolicySchema.parse(policy);
    this.policies.set(validated.id, validated);
  }

  removePolicy(policyId: string): void {
    this.policies.delete(policyId);
  }

  evaluateAction(
    agentId: string,
    action: string,
    resource: string,
    context: Record<string, any>,
    environment: string = 'production'
  ): {
    allowed: boolean;
    blocked: boolean;
    requiresApproval: boolean;
    policies: string[];
    riskScore: number;
    reason: string;
  } {
    const applicablePolicies = Array.from(this.policies.values()).filter(
      (policy) => policy.environment === environment && policy.enabled
    );

    let allowed = true;
    let blocked = false;
    let requiresApproval = false;
    const appliedPolicies: string[] = [];
    let totalRiskScore = 0;
    const reasons: string[] = [];

    for (const policy of applicablePolicies) {
      for (const rule of policy.rules) {
        if (this.evaluateCondition(rule.condition, context)) {
          appliedPolicies.push(`${policy.id}:${rule.id}`);

          switch (rule.type) {
            case 'allow':
              // Allow rules don't change the default
              break;
            case 'deny':
              blocked = true;
              allowed = false;
              reasons.push(`Blocked by policy: ${policy.name} - ${rule.id}`);
              totalRiskScore += rule.priority;
              break;
            case 'require_approval':
              requiresApproval = true;
              reasons.push(`Approval required by policy: ${policy.name} - ${rule.id}`);
              totalRiskScore += rule.priority * 0.5;
              break;
            case 'limit':
              // Check if action exceeds limits
              if (this.exceedsLimit(rule.action, context)) {
                blocked = true;
                allowed = false;
                reasons.push(`Limit exceeded: ${rule.action}`);
                totalRiskScore += rule.priority;
              }
              break;
            case 'audit':
              // Audit rules don't block but increase risk score
              totalRiskScore += rule.priority * 0.3;
              break;
          }
        }
      }
    }

    // Log evaluation
    this.logAuditEvent({
      agentId,
      action,
      resource,
      outcome: blocked ? 'blocked' : requiresApproval ? 'escalated' : 'success',
      policyId: appliedPolicies.join(','),
      reason: reasons.join('; '),
      metadata: { context, environment, appliedPolicies },
      riskScore: Math.min(totalRiskScore, 10),
    });

    return {
      allowed: allowed && !blocked,
      blocked,
      requiresApproval,
      policies: appliedPolicies,
      riskScore: Math.min(totalRiskScore, 10),
      reason: reasons.join('; '),
    };
  }

  private evaluateCondition(condition: any, context: Record<string, any>): boolean {
    // Simple condition evaluation - in production, use a proper JSON schema evaluator
    if (condition.category && Array.isArray(condition.category)) {
      return condition.category.includes('*') || condition.category.includes(context.category);
    }
    if (condition.operation && condition.operation === context.operation) {
      return true;
    }
    if (condition.sensitivity && Array.isArray(condition.sensitivity)) {
      return condition.sensitivity.some((s) => context.sensitivity?.includes(s));
    }
    return true;
  }

  private exceedsLimit(limit: string, context: Record<string, any>): boolean {
    // Simple limit checking
    if (limit === '100MB' && context.size) {
      return this.parseSize(context.size) > 100 * 1024 * 1024;
    }
    return false;
  }

  private parseSize(sizeStr: string): number {
    // Parse size strings like "10MB", "1GB"
    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(KB|MB|GB|TB)$/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
      case 'KB':
        return value * 1024;
      case 'MB':
        return value * 1024 * 1024;
      case 'GB':
        return value * 1024 * 1024 * 1024;
      case 'TB':
        return value * 1024 * 1024 * 1024 * 1024;
      default:
        return 0;
    }
  }

  private logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(),
    };

    this.auditLog.push(auditEvent);

    // Keep audit log size manageable
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-5000);
    }
  }

  getAuditLog(limit: number = 100, agentId?: string): AuditEvent[] {
    let events = this.auditLog;

    if (agentId) {
      events = events.filter((event) => event.agentId === agentId);
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }

  getComplianceReport(): {
    framework: string;
    totalEvents: number;
    violations: number;
    lastUpdated: Date;
    details: Record<string, any>;
  } {
    const reports: Record<string, any> = {};

    for (const framework of this.complianceFrameworks) {
      const frameworkEvents = this.auditLog.filter((event) =>
        event.complianceTags?.includes(framework)
      );

      reports[framework] = {
        totalEvents: frameworkEvents.length,
        violations: frameworkEvents.filter((event) => event.outcome === 'blocked').length,
        lastViolation: frameworkEvents
          .filter((event) => event.outcome === 'blocked')
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]?.timestamp,
        avgRiskScore:
          frameworkEvents.length > 0
            ? frameworkEvents.reduce((sum, event) => sum + event.riskScore, 0) /
              frameworkEvents.length
            : 0,
      };
    }

    return {
      framework: Array.from(this.complianceFrameworks).join(', '),
      totalEvents: this.auditLog.length,
      violations: this.auditLog.filter((event) => event.outcome === 'blocked').length,
      lastUpdated: new Date(),
      details: reports,
    };
  }
}

// Security Agent
/**
 * Monitors agent behavior for security violations and anomalous patterns.
 *
 * Detects tool poisoning, prompt injection attempts, data exfiltration,
 * and other security threats in real-time.
 */
export class SecurityAgent {
  private auditLog: AuditEvent[] = [];
  private threatPatterns: Map<string, any> = new Map();
  private alertThresholds: Map<string, number> = new Map();

  constructor() {
    this.initializeThreatPatterns();
    this.initializeAlertThresholds();
  }

  private initializeThreatPatterns(): void {
    // Tool poisoning patterns
    this.threatPatterns.set('tool-poisoning', {
      indicators: ['malicious_payload', 'suspicious_commands', 'encoded_instructions'],
      riskScore: 8,
      response: 'block',
    });

    // Prompt injection patterns
    this.threatPatterns.set('prompt-injection', {
      indicators: ['ignore_instructions', 'system_prompt_override', 'role_play_admin'],
      riskScore: 7,
      response: 'block',
    });

    // Data exfiltration patterns
    this.threatPatterns.set('data-exfiltration', {
      indicators: ['large_data_transfer', 'sensitive_data_access', 'unauthorized_export'],
      riskScore: 9,
      response: 'block',
    });

    // Anomalous behavior patterns
    this.threatPatterns.set('anomalous-behavior', {
      indicators: ['rapid_tool_switching', 'repeated_failures', 'unusual_time_patterns'],
      riskScore: 5,
      response: 'monitor',
    });
  }

  private initializeAlertThresholds(): void {
    this.alertThresholds.set('critical', 8);
    this.alertThresholds.set('high', 6);
    this.alertThresholds.set('medium', 4);
    this.alertThresholds.set('low', 2);
  }

  analyzeAgentAction(
    agentId: string,
    action: string,
    context: Record<string, any>
  ): {
    riskScore: number;
    threats: string[];
    recommendation: string;
    requiresIntervention: boolean;
  } {
    let totalRiskScore = 0;
    const detectedThreats: string[] = [];

    // Analyze for threat patterns
    for (const [threatType, pattern] of this.threatPatterns) {
      const matches = this.detectThreatPattern(pattern.indicators, context);
      if (matches.length > 0) {
        detectedThreats.push(threatType);
        totalRiskScore += pattern.riskScore;
      }
    }

    // Check for rapid tool switching
    const toolSwitchingScore = this.analyzeToolSwitching(agentId, context);
    totalRiskScore += toolSwitchingScore;

    // Check for repeated failures
    const failureScore = this.analyzeFailures(agentId, context);
    totalRiskScore += failureScore;

    const requiresIntervention = totalRiskScore >= this.alertThresholds.get('critical')!;
    const recommendation = this.getRecommendation(totalRiskScore, detectedThreats);

    return {
      riskScore: Math.min(totalRiskScore, 10),
      threats: detectedThreats,
      recommendation,
      requiresIntervention,
    };
  }

  private detectThreatPattern(indicators: string[], context: Record<string, any>): string[] {
    const detected: string[] = [];

    for (const indicator of indicators) {
      if (this.contextContains(context, indicator)) {
        detected.push(indicator);
      }
    }

    return detected;
  }

  private contextContains(context: Record<string, any>, searchTerm: string): boolean {
    const contextStr = JSON.stringify(context).toLowerCase();
    return contextStr.includes(searchTerm.toLowerCase());
  }

  private analyzeToolSwitching(agentId: string, context: Record<string, any>): number {
    // In a real implementation, track tool usage patterns over time
    // For now, return a moderate risk score if multiple tools are used rapidly
    return context.toolCount > 5 ? 3 : 0;
  }

  private analyzeFailures(agentId: string, context: Record<string, any>): number {
    // In a real implementation, track failure patterns
    // For now, return a risk score based on recent failures
    return context.recentFailures > 3 ? 4 : 0;
  }

  private getRecommendation(riskScore: number, threats: string[]): string {
    if (riskScore >= 8) {
      return 'CRITICAL: Immediate intervention required. Block agent action and escalate to security team.';
    } else if (riskScore >= 6) {
      return 'HIGH: Review agent action and consider intervention. Monitor closely.';
    } else if (riskScore >= 4) {
      return 'MEDIUM: Log for review and continue monitoring.';
    } else {
      return 'LOW: Normal operation, continue monitoring.';
    }
  }

  logSecurityEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const securityEvent: AuditEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(),
      complianceTags: ['security'],
    };

    this.auditLog.push(securityEvent);
  }

  getSecurityReport(): {
    totalEvents: number;
    criticalEvents: number;
    topThreats: Record<string, number>;
    recommendations: string[];
  } {
    const criticalEvents = this.auditLog.filter((event) => event.riskScore >= 8);
    const threatCounts: Record<string, number> = {};

    for (const event of this.auditLog) {
      const threats = event.metadata?.threats || [];
      for (const threat of threats) {
        threatCounts[threat] = (threatCounts[threat] || 0) + 1;
      }
    }

    const topThreats = Object.entries(threatCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .reduce(
        (obj, [threat, count]) => {
          obj[threat] = count;
          return obj;
        },
        {} as Record<string, number>
      );

    return {
      totalEvents: this.auditLog.length,
      criticalEvents: criticalEvents.length,
      topThreats,
      recommendations: [
        'Implement regular security audits',
        'Enhance agent training on security protocols',
        'Review and update threat detection patterns',
        'Establish clear escalation procedures',
      ],
    };
  }
}

// Blast Radius Controller
/**
 * Manages blast radius assessment and containment for agent actions.
 *
 * Evaluates potential impact of agent actions and implements
 * containment strategies when necessary.
 */
export class BlastRadiusController {
  private containmentStrategies: Map<string, any> = new Map();

  constructor() {
    this.initializeContainmentStrategies();
  }

  private initializeContainmentStrategies(): void {
    this.containmentStrategies.set('data-modification', {
      isolation: 'sandbox',
      rollback: 'automatic',
      notification: 'immediate',
      quarantine: true,
    });

    this.containmentStrategies.set('system-change', {
      isolation: 'isolated_environment',
      rollback: 'manual_approval',
      notification: 'escalation',
      quarantine: true,
    });

    this.containmentStrategies.set('external-communication', {
      isolation: 'monitored',
      rollback: 'not_applicable',
      notification: 'logged',
      quarantine: false,
    });
  }

  assessBlastRadius(
    action: string,
    context: Record<string, any>,
    environment: string
  ): BlastRadiusAssessment {
    const criticality = this.assessCriticality(action, context, environment);
    const affectedSystems = this.identifyAffectedSystems(action, context);
    const dataAccess = this.assessDataAccess(action, context);
    const externalConnections = this.hasExternalConnections(action, context);

    return {
      criticality,
      affectedSystems,
      dataAccess,
      externalConnections,
      rollbackPlan: this.generateRollbackPlan(action, criticality),
      escalationRequired: criticality === 'critical' || criticality === 'high',
      estimatedImpact: this.estimateImpact(affectedSystems, dataAccess),
    };
  }

  private assessCriticality(
    action: string,
    context: Record<string, any>,
    environment: string
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (environment === 'production') {
      if (action.includes('delete') || action.includes('deploy') || action.includes('modify')) {
        return 'critical';
      }
      if (action.includes('access') || action.includes('export')) {
        return 'high';
      }
      return 'medium';
    }
    return 'low';
  }

  private identifyAffectedSystems(action: string, context: Record<string, any>): string[] {
    // In a real implementation, analyze the action to determine affected systems
    const systems = ['database', 'file_system', 'api_gateway', 'auth_service'];
    return systems.filter((system) => action.includes(system) || context.targetSystem === system);
  }

  private assessDataAccess(action: string, context: Record<string, any>): string[] {
    const dataTypes = ['user_data', 'system_config', 'logs', 'temp_files'];
    return dataTypes.filter(
      (dataType) => action.includes(dataType) || context.dataType === dataType
    );
  }

  private hasExternalConnections(action: string, context: Record<string, any>): boolean {
    return (
      action.includes('api_call') || action.includes('web_request') || context.external === true
    );
  }

  private generateRollbackPlan(action: string, criticality: string): string {
    switch (criticality) {
      case 'critical':
        return `Immediate rollback required for action: ${action}. All changes will be reverted and systems will be restored to previous state.`;
      case 'high':
        return `Manual rollback planned for action: ${action}. Changes will be reviewed before rollback.`;
      case 'medium':
        return `Rollback available for action: ${action}. Changes can be reverted if needed.`;
      default:
        return `No rollback needed for action: ${action}.`;
    }
  }

  private estimateImpact(
    affectedSystems: string[],
    dataAccess: string[]
  ): {
    users: number;
    systems: number;
    dataVolume: string;
    downtime: number;
  } {
    return {
      users: affectedSystems.length > 0 ? 1000 : 0,
      systems: affectedSystems.length,
      dataVolume: dataAccess.length > 0 ? 'Unknown' : 'Minimal',
      downtime: affectedSystems.length > 2 ? 30 : 5,
    };
  }
}

// Export main classes
export { PolicyEngine, SecurityAgent, BlastRadiusController };
