import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Governance and Security Types
export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: 'access_control' | 'data_protection' | 'audit' | 'compliance';
  rules: SecurityRule[];
  enforcement: 'strict' | 'warn' | 'log';
  priority: number;
  enabled: boolean;
}

export interface SecurityRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_approval' | 'log' | 'encrypt';
  parameters: Record<string, any>;
  exceptions: string[];
}

export interface GovernanceFramework {
  name: string;
  version: string;
  policies: SecurityPolicy[];
  standards: ComplianceStandard[];
  riskAssessment: RiskAssessment;
  auditTrail: AuditEntry[];
}

export interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  requirements: ComplianceRequirement[];
  status: 'compliant' | 'non_compliant' | 'pending';
  lastAssessed: Date;
}

export interface ComplianceRequirement {
  id: string;
  description: string;
  category: 'security' | 'privacy' | 'access' | 'audit';
  mandatory: boolean;
  controls: string[];
}

export interface RiskAssessment {
  id: string;
  risks: Risk[];
  overallScore: number;
  lastUpdated: Date;
  mitigation: MitigationPlan[];
}

export interface Risk {
  id: string;
  category: 'security' | 'privacy' | 'operational' | 'compliance';
  description: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  score: number; // likelihood * impact
  mitigation: string;
  status: 'open' | 'mitigated' | 'accepted';
}

export interface MitigationPlan {
  riskId: string;
  actions: MitigationAction[];
  timeline: string;
  owner: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface MitigationAction {
  id: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure' | 'warning';
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

// Security Policy Engine
export class SecurityPolicyEngine {
  private policies: Map<string, SecurityPolicy> = new Map();
  private auditLogger: AuditLogger;

  constructor() {
    this.auditLogger = new AuditLogger();
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies(): void {
    // Access Control Policy
    this.addPolicy({
      id: 'access-control-001',
      name: 'Multi-Factor Authentication Required',
      description: 'Require MFA for privileged operations',
      type: 'access_control',
      rules: [
        {
          id: 'mfa-privileged',
          condition: 'operation.privileged == true',
          action: 'require_approval',
          parameters: { approvalType: 'mfa' },
          exceptions: ['emergency-access']
        }
      ],
      enforcement: 'strict',
      priority: 10,
      enabled: true
    });

    // Data Protection Policy
    this.addPolicy({
      id: 'data-protection-001',
      name: 'PII Data Encryption',
      description: 'Encrypt all personally identifiable information',
      type: 'data_protection',
      rules: [
        {
          id: 'pii-encryption',
          condition: 'data.type == "pii"',
          action: 'encrypt',
          parameters: { algorithm: 'AES-256' },
          exceptions: []
        }
      ],
      enforcement: 'strict',
      priority: 9,
      enabled: true
    });

    // Audit Policy
    this.addPolicy({
      id: 'audit-001',
      name: 'Comprehensive Logging',
      description: 'Log all security-relevant events',
      type: 'audit',
      rules: [
        {
          id: 'security-events',
          condition: 'event.security_relevant == true',
          action: 'log',
          parameters: { level: 'detailed' },
          exceptions: []
        }
      ],
      enforcement: 'log',
      priority: 8,
      enabled: true
    });
  }

  addPolicy(policy: SecurityPolicy): void {
    this.policies.set(policy.id, policy);
  }

  removePolicy(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  async evaluateRequest(request: SecurityRequest): Promise<SecurityDecision> {
    const applicablePolicies = Array.from(this.policies.values())
      .filter(policy => policy.enabled)
      .filter(policy => this.isPolicyApplicable(policy, request));

    const decisions: PolicyDecision[] = [];

    for (const policy of applicablePolicies) {
      for (const rule of policy.rules) {
        const decision = await this.evaluateRule(rule, request, policy);
        decisions.push(decision);
      }
    }

    return this.consolidateDecisions(decisions, request);
  }

  private isPolicyApplicable(policy: SecurityPolicy, request: SecurityRequest): boolean {
    // Simple applicability check - can be enhanced
    return true;
  }

  private async evaluateRule(rule: SecurityRule, request: SecurityRequest, policy: SecurityPolicy): Promise<PolicyDecision> {
    const conditionMet = this.evaluateCondition(rule.condition, request);
    
    const decision: PolicyDecision = {
      policyId: policy.id,
      ruleId: rule.id,
      action: conditionMet ? rule.action : 'allow',
      reason: conditionMet ? `Rule triggered: ${rule.condition}` : 'Rule not triggered',
      parameters: rule.parameters,
      enforcement: policy.enforcement
    };

    // Log the decision
    await this.auditLogger.log({
      id: this.generateId(),
      timestamp: new Date(),
      userId: request.userId,
      action: `policy_evaluation_${rule.id}`,
      resource: request.resource,
      outcome: conditionMet ? 'warning' : 'success',
      details: { decision, policy: policy.name },
      ipAddress: request.ipAddress,
      userAgent: request.userAgent
    });

    return decision;
  }

  private evaluateCondition(condition: string, request: SecurityRequest): boolean {
    // Simple condition evaluation - in production, use proper expression parser
    try {
      // This is a simplified version - real implementation would be more sophisticated
      if (condition.includes('operation.privileged')) {
        return request.operation?.privileged || false;
      }
      if (condition.includes('data.type')) {
        return request.data?.type === 'pii';
      }
      if (condition.includes('event.security_relevant')) {
        return request.event?.securityRelevant || false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private consolidateDecisions(decisions: PolicyDecision[], request: SecurityRequest): SecurityDecision {
    const denyDecisions = decisions.filter(d => d.action === 'deny');
    const requireApprovalDecisions = decisions.filter(d => d.action === 'require_approval');
    const logDecisions = decisions.filter(d => d.action === 'log');

    if (denyDecisions.length > 0) {
      return {
        allowed: false,
        action: 'deny',
        reason: `Denied by policies: ${denyDecisions.map(d => d.policyId).join(', ')}`,
        requirements: [],
        auditRequired: true
      };
    }

    if (requireApprovalDecisions.length > 0) {
      return {
        allowed: false,
        action: 'require_approval',
        reason: `Approval required: ${requireApprovalDecisions.map(d => d.policyId).join(', ')}`,
        requirements: requireApprovalDecisions.map(d => d.parameters),
        auditRequired: true
      };
    }

    return {
      allowed: true,
      action: 'allow',
      reason: 'Request approved',
      requirements: [],
      auditRequired: logDecisions.length > 0
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Access Control System
export class AccessControlSystem {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private userRoles: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles(): void {
    // Admin role
    this.roles.set('admin', {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access',
      permissions: ['*'],
      priority: 100
    });

    // Developer role
    this.roles.set('developer', {
      id: 'developer',
      name: 'Developer',
      description: 'Development and deployment access',
      permissions: ['code.read', 'code.write', 'deploy.execute', 'config.read'],
      priority: 50
    });

    // Analyst role
    this.roles.set('analyst', {
      id: 'analyst',
      name: 'Analyst',
      description: 'Read-only access for analysis',
      permissions: ['data.read', 'reports.read', 'metrics.read'],
      priority: 25
    });

    // Viewer role
    this.roles.set('viewer', {
      id: 'viewer',
      name: 'Viewer',
      description: 'Basic read access',
      permissions: ['dashboard.read', 'reports.read'],
      priority: 10
    });
  }

  assignRole(userId: string, roleId: string): void {
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, []);
    }
    this.userRoles.get(userId)!.push(roleId);
  }

  removeRole(userId: string, roleId: string): void {
    const roles = this.userRoles.get(userId);
    if (roles) {
      const index = roles.indexOf(roleId);
      if (index > -1) {
        roles.splice(index, 1);
      }
    }
  }

  hasPermission(userId: string, permission: string): boolean {
    const userRoleIds = this.userRoles.get(userId) || [];
    
    for (const roleId of userRoleIds) {
      const role = this.roles.get(roleId);
      if (role) {
        if (role.permissions.includes('*') || role.permissions.includes(permission)) {
          return true;
        }
      }
    }
    
    return false;
  }

  getUserPermissions(userId: string): string[] {
    const userRoleIds = this.userRoles.get(userId) || [];
    const permissions = new Set<string>();
    
    for (const roleId of userRoleIds) {
      const role = this.roles.get(roleId);
      if (role) {
        role.permissions.forEach(perm => permissions.add(perm));
      }
    }
    
    return Array.from(permissions);
  }
}

// Audit Logger
export class AuditLogger {
  private entries: AuditEntry[] = [];

  async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      ...entry
    };

    this.entries.push(auditEntry);

    // In production, this would write to a secure audit store
    console.log('AUDIT:', JSON.stringify(auditEntry, null, 2));
  }

  async query(query: AuditQuery): Promise<AuditEntry[]> {
    return this.entries.filter(entry => {
      if (query.userId && entry.userId !== query.userId) return false;
      if (query.action && !entry.action.includes(query.action)) return false;
      if (query.resource && !entry.resource.includes(query.resource)) return false;
      if (query.outcome && entry.outcome !== query.outcome) return false;
      if (query.startDate && entry.timestamp < query.startDate) return false;
      if (query.endDate && entry.timestamp > query.endDate) return false;
      return true;
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Risk Management System
export class RiskManagementSystem {
  private risks: Map<string, Risk> = new Map();
  private mitigations: Map<string, MitigationPlan> = new Map();

  constructor() {
    this.initializeDefaultRisks();
  }

  private initializeDefaultRisks(): void {
    // Data breach risk
    this.addRisk({
      id: 'risk-001',
      category: 'security',
      description: 'Unauthorized access to sensitive data',
      likelihood: 3,
      impact: 5,
      score: 15,
      mitigation: 'Implement encryption and access controls',
      status: 'open'
    });

    // AI model bias risk
    this.addRisk({
      id: 'risk-002',
      category: 'compliance',
      description: 'AI model producing biased outputs',
      likelihood: 4,
      impact: 3,
      score: 12,
      mitigation: 'Regular bias testing and model validation',
      status: 'open'
    });

    // Operational disruption risk
    this.addRisk({
      id: 'risk-003',
      category: 'operational',
      description: 'System downtime affecting operations',
      likelihood: 2,
      impact: 4,
      score: 8,
      mitigation: 'Implement redundancy and monitoring',
      status: 'mitigated'
    });
  }

  addRisk(risk: Omit<Risk, 'score'>): void {
    const fullRisk: Risk = {
      ...risk,
      score: risk.likelihood * risk.impact
    };
    this.risks.set(risk.id, fullRisk);
  }

  updateRisk(riskId: string, updates: Partial<Risk>): boolean {
    const risk = this.risks.get(riskId);
    if (!risk) return false;

    const updatedRisk = { ...risk, ...updates };
    if (updates.likelihood !== undefined || updates.impact !== undefined) {
      updatedRisk.score = updatedRisk.likelihood * updatedRisk.impact;
    }
    
    this.risks.set(riskId, updatedRisk);
    return true;
  }

  createMitigationPlan(riskId: string, plan: Omit<MitigationPlan, 'riskId'>): void {
    this.mitigations.set(riskId, { ...plan, riskId });
  }

  getRiskAssessment(): RiskAssessment {
    const risks = Array.from(this.risks.values());
    const overallScore = risks.reduce((sum, risk) => sum + risk.score, 0) / risks.length;

    return {
      id: 'assessment-001',
      risks,
      overallScore,
      lastUpdated: new Date(),
      mitigation: Array.from(this.mitigations.values())
    };
  }

  getHighRiskRisks(threshold: number = 10): Risk[] {
    return Array.from(this.risks.values()).filter(risk => risk.score >= threshold);
  }
}

// Compliance Manager
export class ComplianceManager {
  private standards: Map<string, ComplianceStandard> = new Map();

  constructor() {
    this.initializeStandards();
  }

  private initializeStandards(): void {
    // GDPR Standard
    this.addStandard({
      id: 'gdpr',
      name: 'General Data Protection Regulation',
      description: 'EU data protection regulation',
      requirements: [
        {
          id: 'gdpr-001',
          description: 'Lawful basis for processing',
          category: 'privacy',
          mandatory: true,
          controls: ['consent-management', 'data-processing-agreement']
        },
        {
          id: 'gdpr-002',
          description: 'Data subject rights',
          category: 'privacy',
          mandatory: true,
          controls: ['access-request', 'deletion-request', 'portability']
        }
      ],
      status: 'pending',
      lastAssessed: new Date()
    });

    // SOC 2 Standard
    this.addStandard({
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'Service Organization Control 2',
      requirements: [
        {
          id: 'soc2-001',
          description: 'Security controls',
          category: 'security',
          mandatory: true,
          controls: ['access-control', 'encryption', 'monitoring']
        },
        {
          id: 'soc2-002',
          description: 'Availability controls',
          category: 'security',
          mandatory: true,
          controls: ['redundancy', 'backup', 'disaster-recovery']
        }
      ],
      status: 'pending',
      lastAssessed: new Date()
    });
  }

  addStandard(standard: Omit<ComplianceStandard, 'lastAssessed'>): void {
    const fullStandard: ComplianceStandard = {
      ...standard,
      lastAssessed: new Date()
    };
    this.standards.set(standard.id, fullStandard);
  }

  assessCompliance(standardId: string): ComplianceAssessment {
    const standard = this.standards.get(standardId);
    if (!standard) {
      throw new Error(`Standard ${standardId} not found`);
    }

    const results = standard.requirements.map(req => ({
      requirement: req.id,
      compliant: Math.random() > 0.3, // Simulated assessment
      gaps: [],
      evidence: []
    }));

    const compliantCount = results.filter(r => r.compliant).length;
    const overallCompliance = compliantCount / results.length;

    return {
      standardId,
      overallCompliance,
      requirementResults: results,
      assessedAt: new Date(),
      nextAssessmentDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    };
  }

  getComplianceReport(): ComplianceReport {
    const standards = Array.from(this.standards.values());
    const assessments = standards.map(s => this.assessCompliance(s.id));

    return {
      overallCompliance: assessments.reduce((sum, a) => sum + a.overallCompliance, 0) / assessments.length,
      standardAssessments: assessments,
      generatedAt: new Date(),
      recommendations: this.generateRecommendations(assessments)
    };
  }

  private generateRecommendations(assessments: ComplianceAssessment[]): string[] {
    const recommendations: string[] = [];
    
    assessments.forEach(assessment => {
      if (assessment.overallCompliance < 0.8) {
        recommendations.push(`Improve compliance for ${assessment.standardId}`);
      }
    });

    return recommendations;
  }
}

// Supporting Types
export interface SecurityRequest {
  userId: string;
  operation?: {
    type: string;
    privileged: boolean;
  };
  data?: {
    type: string;
    sensitivity: string;
  };
  event?: {
    securityRelevant: boolean;
  };
  resource: string;
  ipAddress: string;
  userAgent: string;
}

export interface SecurityDecision {
  allowed: boolean;
  action: 'allow' | 'deny' | 'require_approval';
  reason: string;
  requirements: Record<string, any>[];
  auditRequired: boolean;
}

export interface PolicyDecision {
  policyId: string;
  ruleId: string;
  action: string;
  reason: string;
  parameters: Record<string, any>;
  enforcement: 'strict' | 'warn' | 'log';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  priority: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface AuditQuery {
  userId?: string;
  action?: string;
  resource?: string;
  outcome?: 'success' | 'failure' | 'warning';
  startDate?: Date;
  endDate?: Date;
}

export interface ComplianceAssessment {
  standardId: string;
  overallCompliance: number;
  requirementResults: {
    requirement: string;
    compliant: boolean;
    gaps: string[];
    evidence: string[];
  }[];
  assessedAt: Date;
  nextAssessmentDue: Date;
}

export interface ComplianceReport {
  overallCompliance: number;
  standardAssessments: ComplianceAssessment[];
  generatedAt: Date;
  recommendations: string[];
}

// Main Governance Framework
export class EnterpriseGovernanceFramework {
  private policyEngine: SecurityPolicyEngine;
  private accessControl: AccessControlSystem;
  private auditLogger: AuditLogger;
  private riskManagement: RiskManagementSystem;
  private complianceManager: ComplianceManager;

  constructor() {
    this.policyEngine = new SecurityPolicyEngine();
    this.accessControl = new AccessControlSystem();
    this.auditLogger = new AuditLogger();
    this.riskManagement = new RiskManagementSystem();
    this.complianceManager = new ComplianceManager();
  }

  async authorizeRequest(request: SecurityRequest): Promise<SecurityDecision> {
    // Check access control first
    const hasPermission = this.accessControl.hasPermission(request.userId, 'access.request');
    if (!hasPermission) {
      return {
        allowed: false,
        action: 'deny',
        reason: 'Insufficient permissions',
        requirements: [],
        auditRequired: true
      };
    }

    // Evaluate security policies
    return await this.policyEngine.evaluateRequest(request);
  }

  getGovernanceReport(): GovernanceReport {
    const riskAssessment = this.riskManagement.getRiskAssessment();
    const complianceReport = this.complianceManager.getComplianceReport();
    const highRisks = this.riskManagement.getHighRiskRisks();

    return {
      riskAssessment,
      complianceReport,
      highRisks,
      generatedAt: new Date(),
      status: this.calculateOverallStatus(riskAssessment.overallScore, complianceReport.overallCompliance)
    };
  }

  private calculateOverallStatus(riskScore: number, complianceScore: number): 'healthy' | 'warning' | 'critical' {
    if (riskScore > 12 || complianceScore < 0.7) return 'critical';
    if (riskScore > 8 || complianceScore < 0.85) return 'warning';
    return 'healthy';
  }
}

export interface GovernanceReport {
  riskAssessment: RiskAssessment;
  complianceReport: ComplianceReport;
  highRisks: Risk[];
  generatedAt: Date;
  status: 'healthy' | 'warning' | 'critical';
}

// Export main classes
export { 
  EnterpriseGovernanceFramework, 
  SecurityPolicyEngine, 
  AccessControlSystem, 
  AuditLogger, 
  RiskManagementSystem, 
  ComplianceManager 
};
