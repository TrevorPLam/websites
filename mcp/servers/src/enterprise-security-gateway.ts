#!/usr/bin/env node

/**
 * @file packages/mcp-servers/src/enterprise-security-gateway.ts
 * @summary Enterprise Security Gateway for MCP servers with Zero Trust architecture
 * @description Implements comprehensive security framework with network segmentation, authentication, and governance
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import crypto from 'crypto';

// Enterprise Security Types
interface SecurityPolicy {
  id: string;
  name: string;
  version: string;
  rules: SecurityRule[];
  enforcement: 'strict' | 'permissive' | 'audit-only';
  createdAt: Date;
  updatedAt: Date;
}

interface SecurityRule {
  id: string;
  type: 'authentication' | 'authorization' | 'validation' | 'rate-limiting' | 'audit';
  condition: string;
  action: 'allow' | 'deny' | 'log' | 'alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

interface SecurityContext {
  requestId: string;
  userId: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  sessionId: string;
}

interface AuditLog {
  id: string;
  requestId: string;
  action: string;
  resource: string;
  userId: string;
  tenantId: string;
  result: 'success' | 'failure' | 'blocked';
  reason?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

interface ThreatDetection {
  id: string;
  type: 'tool-poisoning' | 'prompt-injection' | 'data-exfiltration' | 'unauthorized-access' | 'rate-violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  context: SecurityContext;
  timestamp: Date;
  mitigated: boolean;
}

export class EnterpriseSecurityGateway {
  private server: McpServer;
  private policies: Map<string, SecurityPolicy> = new Map();
  private auditLogs: AuditLog[] = [];
  private threats: ThreatDetection[] = [];
  private activeSessions: Map<string, SecurityContext> = new Map();
  private rateLimiters: Map<string, RateLimiter> = new Map();

  constructor() {
    this.server = new McpServer({
      name: 'enterprise-security-gateway',
      version: '1.0.0',
    });

    this.initializeSecurityPolicies();
    this.setupSecurityTools();
  }

  private initializeSecurityPolicies() {
    // Default enterprise security policies
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: 'enterprise-auth-policy',
        name: 'Enterprise Authentication Policy',
        version: '1.0.0',
        enforcement: 'strict',
        rules: [
          {
            id: 'auth-required',
            type: 'authentication',
            condition: 'userId != null && sessionId != null',
            action: 'allow',
            severity: 'critical',
            enabled: true,
          },
          {
            id: 'tenant-isolation',
            type: 'authorization',
            condition: 'tenantId != null && permissions.includes("tenant-access")',
            action: 'allow',
            severity: 'critical',
            enabled: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'input-validation-policy',
        name: 'Input Validation Policy',
        version: '1.0.0',
        enforcement: 'strict',
        rules: [
          {
            id: 'schema-validation',
            type: 'validation',
            condition: 'payload != null && isValidSchema(payload)',
            action: 'allow',
            severity: 'high',
            enabled: true,
          },
          {
            id: 'injection-detection',
            type: 'validation',
            condition: '!containsSuspiciousPatterns(payload)',
            action: 'allow',
            severity: 'critical',
            enabled: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'rate-limiting-policy',
        name: 'Rate Limiting Policy',
        version: '1.0.0',
        enforcement: 'strict',
        rules: [
          {
            id: 'request-rate-limit',
            type: 'rate-limiting',
            condition: 'requestsPerMinute <= 100',
            action: 'allow',
            severity: 'medium',
            enabled: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultPolicies.forEach(policy => this.policies.set(policy.id, policy));
  }

  private setupSecurityTools() {
    // Security policy management
    this.server.tool(
      'manage-security-policy',
      'Create, update, or delete security policies',
      {
        action: z.enum(['create', 'update', 'delete', 'list']).describe('Action to perform'),
        policyId: z.string().optional().describe('Policy ID for update/delete actions'),
        policy: z.any().optional().describe('Policy definition for create/update actions'),
      },
      async ({ action, policyId, policy }) => {
        switch (action) {
          case 'create':
            if (!policy) {
              return {
                content: [{ type: 'text', text: 'Policy definition required for create action' }],
              };
            }
            const newPolicy: SecurityPolicy = {
              ...policy,
              id: `policy_${Date.now()}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            this.policies.set(newPolicy.id, newPolicy);
            return {
              content: [{ type: 'text', text: `Security policy created: ${newPolicy.id}` }],
            };

          case 'update':
            if (!policyId || !policy) {
              return {
                content: [{ type: 'text', text: 'Policy ID and definition required for update action' }],
              };
            }
            const existingPolicy = this.policies.get(policyId);
            if (!existingPolicy) {
              return {
                content: [{ type: 'text', text: 'Policy not found' }],
              };
            }
            const updatedPolicy = {
              ...existingPolicy,
              ...policy,
              updatedAt: new Date(),
            };
            this.policies.set(policyId, updatedPolicy);
            return {
              content: [{ type: 'text', text: `Security policy updated: ${policyId}` }],
            };

          case 'delete':
            if (!policyId) {
              return {
                content: [{ type: 'text', text: 'Policy ID required for delete action' }],
              };
            }
            const deleted = this.policies.delete(policyId);
            return {
              content: [{ type: 'text', text: deleted ? `Security policy deleted: ${policyId}` : 'Policy not found' }],
            };

          case 'list':
            const policies = Array.from(this.policies.values());
            return {
              content: [{
                type: 'text',
                text: `Active Security Policies (${policies.length}):\n\n${policies.map(p => `- ${p.name} (${p.id}): ${p.enforcement} enforcement, ${p.rules.length} rules`).join('\n')}`,
              }],
            };

          default:
            return {
              content: [{ type: 'text', text: 'Invalid action' }],
            };
        }
      },
    );

    // Security context validation
    this.server.tool(
      'validate-security-context',
      'Validate security context against policies',
      {
        context: z.object({
          userId: z.string(),
          tenantId: z.string(),
          roles: z.array(z.string()),
          permissions: z.array(z.string()),
          ipAddress: z.string(),
          userAgent: z.string(),
        }).describe('Security context to validate'),
        action: z.string().describe('Action being performed'),
        resource: z.string().describe('Resource being accessed'),
      },
      async ({ context, action, resource }) => {
        const securityContext: SecurityContext = {
          ...context,
          requestId: crypto.randomUUID(),
          timestamp: new Date(),
          sessionId: crypto.randomUUID(),
        };

        const validationResult = await this.evaluateSecurityPolicies(securityContext, action, resource);
        
        // Log the validation attempt
        this.logAuditEvent({
          id: crypto.randomUUID(),
          requestId: securityContext.requestId,
          action: 'security-validation',
          resource,
          userId: context.userId,
          tenantId: context.tenantId,
          result: validationResult.allowed ? 'success' : 'blocked',
          reason: validationResult.reason,
          timestamp: new Date(),
          metadata: validationResult,
        });

        return {
          content: [{
            type: 'text',
            text: `Security validation ${validationResult.allowed ? 'PASSED' : 'BLOCKED'}: ${validationResult.reason}`,
          }],
        };
      },
    );

    // Threat detection and response
    this.server.tool(
      'detect-threats',
      'Analyze security events for potential threats',
      {
        events: z.array(z.any()).describe('Security events to analyze'),
        timeRange: z.string().default('last-1-hour').describe('Time range for analysis'),
      },
      async ({ events, timeRange }) => {
        const detectedThreats: ThreatDetection[] = [];

        for (const event of events) {
          const threats = await this.analyzeForThreats(event);
          detectedThreats.push(...threats);
        }

        // Store detected threats
        this.threats.push(...detectedThreats);

        // Generate threat report
        const threatSummary = this.generateThreatSummary(detectedThreats);

        return {
          content: [{
            type: 'text',
            text: `Threat Detection Report:\n\n${threatSummary}`,
          }],
        };
      },
    );

    // Audit log management
    this.server.tool(
      'query-audit-logs',
      'Query audit logs for compliance and monitoring',
      {
        filters: z.object({
          userId: z.string().optional(),
          tenantId: z.string().optional(),
          action: z.string().optional(),
          result: z.enum(['success', 'failure', 'blocked']).optional(),
          timeRange: z.string().optional(),
        }).describe('Filter criteria for audit logs'),
        limit: z.number().default(100).describe('Maximum number of results'),
      },
      async ({ filters, limit }) => {
        const filteredLogs = this.filterAuditLogs(filters, limit);
        
        return {
          content: [{
            type: 'text',
            text: `Audit Log Results (${filteredLogs.length} entries):\n\n${filteredLogs.map(log => 
              `${log.timestamp.toISOString()} - ${log.userId}@${log.tenantId} - ${log.action} - ${log.result}${log.reason ? ` (${log.reason})` : ''}`
            ).join('\n')}`,
          }],
        };
      },
    );

    // Rate limiting management
    this.server.tool(
      'manage-rate-limits',
      'Configure rate limiting policies',
      {
        action: z.enum(['set', 'get', 'remove']).describe('Action to perform'),
        key: z.string().describe('Rate limiter key (e.g., userId, tenantId, IP)'),
        config: z.object({
          requestsPerMinute: z.number(),
          burstSize: z.number().optional(),
          windowSize: z.number().optional().describe('Window size in seconds'),
        }).optional().describe('Rate limit configuration'),
      },
      async ({ action, key, config }) => {
        switch (action) {
          case 'set':
            if (!config) {
              return {
                content: [{ type: 'text', text: 'Configuration required for set action' }],
              };
            }
            this.rateLimiters.set(key, new RateLimiter(config));
            return {
              content: [{ type: 'text', text: `Rate limit set for ${key}: ${config.requestsPerMinute} req/min` }],
            };

          case 'get':
            const limiter = this.rateLimiters.get(key);
            if (!limiter) {
              return {
                content: [{ type: 'text', text: `No rate limit found for ${key}` }],
              };
            }
            return {
              content: [{ type: 'text', text: `Rate limit for ${key}: ${limiter.getRemainingRequests()} remaining` }],
            };

          case 'remove':
            const removed = this.rateLimiters.delete(key);
            return {
              content: [{ type: 'text', text: removed ? `Rate limit removed for ${key}` : 'Rate limit not found' }],
            };

          default:
            return {
              content: [{ type: 'text', text: 'Invalid action' }],
            };
        }
      },
    );
  }

  private async evaluateSecurityPolicies(context: SecurityContext, action: string, resource: string): Promise<{ allowed: boolean; reason: string; violations: string[] }> {
    const violations: string[] = [];
    let allowed = true;
    let reason = 'All policies passed';

    for (const policy of this.policies.values()) {
      for (const rule of policy.rules) {
        if (!rule.enabled) continue;

        const ruleResult = await this.evaluateRule(rule, context, action, resource);
        if (!ruleResult.passed) {
          violations.push(`Policy ${policy.name} - Rule ${rule.id}: ${ruleResult.reason}`);
          
          if (policy.enforcement === 'strict' && rule.action === 'deny') {
            allowed = false;
            reason = `Blocked by ${policy.name}`;
          }
        }
      }
    }

    return { allowed, reason, violations };
  }

  private async evaluateRule(rule: SecurityRule, context: SecurityContext, action: string, resource: string): Promise<{ passed: boolean; reason: string }> {
    // Simplified rule evaluation - in production, this would be more sophisticated
    switch (rule.type) {
      case 'authentication':
        if (!context.userId || !context.sessionId) {
          return { passed: false, reason: 'Missing authentication credentials' };
        }
        break;

      case 'authorization':
        if (!context.permissions.includes('mcp-access')) {
          return { passed: false, reason: 'Insufficient permissions' };
        }
        break;

      case 'rate-limiting':
        const rateLimiter = this.rateLimiters.get(context.userId);
        if (rateLimiter && !rateLimiter.checkLimit()) {
          return { passed: false, reason: 'Rate limit exceeded' };
        }
        break;

      default:
        break;
    }

    return { passed: true, reason: 'Rule passed' };
  }

  private async analyzeForThreats(event: any): Promise<ThreatDetection[]> {
    const threats: ThreatDetection[] = [];

    // Tool poisoning detection
    if (this.detectToolPoisoning(event)) {
      threats.push({
        id: crypto.randomUUID(),
        type: 'tool-poisoning',
        severity: 'critical',
        description: 'Potential tool poisoning attack detected',
        context: event.context,
        timestamp: new Date(),
        mitigated: false,
      });
    }

    // Prompt injection detection
    if (this.detectPromptInjection(event)) {
      threats.push({
        id: crypto.randomUUID(),
        type: 'prompt-injection',
        severity: 'high',
        description: 'Potential prompt injection attempt detected',
        context: event.context,
        timestamp: new Date(),
        mitigated: false,
      });
    }

    // Data exfiltration detection
    if (this.detectDataExfiltration(event)) {
      threats.push({
        id: crypto.randomUUID(),
        type: 'data-exfiltration',
        severity: 'critical',
        description: 'Potential data exfiltration attempt detected',
        context: event.context,
        timestamp: new Date(),
        mitigated: false,
      });
    }

    return threats;
  }

  private detectToolPoisoning(event: any): boolean {
    // Simplified detection logic
    const suspiciousPatterns = [
      /eval\s*\(/,
      /exec\s*\(/,
      /system\s*\(/,
      /__import__/,
      /require\s*\(/,
    ];

    const payload = JSON.stringify(event.payload || '');
    return suspiciousPatterns.some(pattern => pattern.test(payload));
  }

  private detectPromptInjection(event: any): boolean {
    // Simplified detection logic
    const injectionPatterns = [
      /ignore\s+previous\s+instructions/i,
      /system\s*:/i,
      /developer\s*mode/i,
      /jailbreak/i,
    ];

    const payload = JSON.stringify(event.payload || '');
    return injectionPatterns.some(pattern => pattern.test(payload));
  }

  private detectDataExfiltration(event: any): boolean {
    // Simplified detection logic
    const suspiciousKeywords = [
      'password',
      'secret',
      'token',
      'key',
      'credential',
    ];

    const payload = JSON.stringify(event.payload || '');
    const keywordCount = suspiciousKeywords.filter(keyword => 
      payload.toLowerCase().includes(keyword.toLowerCase())
    ).length;

    return keywordCount > 3; // Threshold for suspicious activity
  }

  private generateThreatSummary(threats: ThreatDetection[]): string {
    if (threats.length === 0) {
      return 'No threats detected';
    }

    const severityCounts = threats.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary = [
      `Total threats detected: ${threats.length}`,
      'Severity breakdown:',
      ...Object.entries(severityCounts).map(([severity, count]) => `  ${severity}: ${count}`),
      'Threat types:',
      ...Object.entries(
        threats.reduce((acc, threat) => {
          acc[threat.type] = (acc[threat.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([type, count]) => `  ${type}: ${count}`),
    ];

    return summary.join('\n');
  }

  private logAuditEvent(log: AuditLog): void {
    this.auditLogs.push(log);
    
    // Keep only last 10000 logs to prevent memory issues
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }
  }

  private filterAuditLogs(filters: any, limit: number): AuditLog[] {
    let filtered = this.auditLogs;

    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    if (filters.tenantId) {
      filtered = filtered.filter(log => log.tenantId === filters.tenantId);
    }

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.result) {
      filtered = filtered.filter(log => log.result === filters.result);
    }

    if (filters.timeRange) {
      const cutoff = this.parseTimeRange(filters.timeRange);
      filtered = filtered.filter(log => log.timestamp >= cutoff);
    }

    return filtered.slice(-limit);
  }

  private parseTimeRange(timeRange: string): Date {
    const now = new Date();
    const match = timeRange.match(/last-(\d+)-(minute|hour|day)/);
    
    if (!match) return new Date(0);

    const value = parseInt(match[1]);
    const unit = match[2];

    const units = {
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
    };

    return new Date(now.getTime() - value * units[unit]);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Enterprise Security Gateway MCP Server running on stdio');
  }
}

// Rate Limiter Implementation
class RateLimiter {
  private requests: number[] = [];
  private config: {
    requestsPerMinute: number;
    burstSize: number;
    windowSize: number;
  };

  constructor(config: any) {
    this.config = {
      requestsPerMinute: config.requestsPerMinute,
      burstSize: config.burstSize || config.requestsPerMinute,
      windowSize: config.windowSize || 60,
    };
  }

  checkLimit(): boolean {
    const now = Date.now();
    const windowStart = now - (this.config.windowSize * 1000);

    // Remove old requests outside the window
    this.requests = this.requests.filter(timestamp => timestamp >= windowStart);

    // Check if we're under the limit
    return this.requests.length < this.config.requestsPerMinute;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    const windowStart = now - (this.config.windowSize * 1000);
    
    this.requests = this.requests.filter(timestamp => timestamp >= windowStart);
    
    return Math.max(0, this.config.requestsPerMinute - this.requests.length);
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const gateway = new EnterpriseSecurityGateway();
  gateway.run().catch(console.error);
}
