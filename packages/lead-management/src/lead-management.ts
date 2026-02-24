/**
 * Lead Management System
 * Session attribution, lead scoring, and phone click tracking
 */

import { z } from 'zod';

// Lead data schemas
export const LeadDataSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  sessionId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  source: z.enum(['website', 'referral', 'direct', 'social', 'email', 'paid']),
  campaign: z.string().optional(),
  medium: z.string().optional(),
  content: z.string().optional(),
  landingPage: z.string().url(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LeadData = z.infer<typeof LeadDataSchema>;

// Session attribution schema
export const SessionAttributionSchema = z.object({
  sessionId: z.string(),
  tenantId: z.string().uuid(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  referrer: z.string().optional(),
  landingPage: z.string().url(),
  entryTime: z.date(),
  lastActivity: z.date(),
  pageViews: z.number().default(0),
  timeOnSite: z.number().default(0), // in seconds
  deviceType: z.enum(['desktop', 'mobile', 'tablet']).optional(),
  browser: z.string().optional(),
  location: z
    .object({
      country: z.string().optional(),
      region: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),
});

export type SessionAttribution = z.infer<typeof SessionAttributionSchema>;

// Lead scoring schema
export const LeadScoringConfigSchema = z.object({
  tenantId: z.string().uuid(),
  rules: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      condition: z.object({
        field: z.enum(['source', 'medium', 'campaign', 'pageViews', 'timeOnSite', 'deviceType']),
        operator: z.enum(['equals', 'contains', 'greaterThan', 'lessThan']),
        value: z.union([z.string(), z.number()]),
      }),
      points: z.number(),
      active: z.boolean().default(true),
    })
  ),
  thresholds: z.object({
    hot: z.number().default(80),
    warm: z.number().default(50),
    cold: z.number().default(0),
  }),
});

export type LeadScoringConfig = z.infer<typeof LeadScoringConfigSchema>;

/**
 * Session Attribution Store
 */
export class SessionAttributionStore {
  private sessions = new Map<string, SessionAttribution>();

  createSession(
    data: Omit<SessionAttribution, 'entryTime' | 'lastActivity' | 'pageViews' | 'timeOnSite'>
  ): SessionAttribution {
    const now = new Date();
    const session: SessionAttribution = {
      ...data,
      entryTime: now,
      lastActivity: now,
      pageViews: 1,
      timeOnSite: 0,
    };

    this.sessions.set(session.sessionId, session);
    return session;
  }

  updateSession(
    sessionId: string,
    updates: Partial<SessionAttribution>
  ): SessionAttribution | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  getSession(sessionId: string): SessionAttribution | null {
    return this.sessions.get(sessionId) || null;
  }

  incrementPageViews(sessionId: string): number {
    const session = this.sessions.get(sessionId);
    if (!session) return 0;

    session.pageViews += 1;
    session.lastActivity = new Date();
    return session.pageViews;
  }

  updateTimeOnSite(sessionId: string): number {
    const session = this.sessions.get(sessionId);
    if (!session) return 0;

    const now = new Date();
    session.timeOnSite = Math.floor((now.getTime() - session.entryTime.getTime()) / 1000);
    session.lastActivity = now;
    return session.timeOnSite;
  }

  // Clean up old sessions (older than 24 hours)
  cleanup(): number {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    let cleaned = 0;
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < cutoff) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

/**
 * Lead Scoring Engine
 */
export class LeadScoringEngine {
  private configs = new Map<string, LeadScoringConfig>();

  setConfig(config: LeadScoringConfig): void {
    this.configs.set(config.tenantId, config);
  }

  calculateScore(lead: LeadData, session: SessionAttribution): number {
    const config = this.configs.get(lead.tenantId);
    if (!config) return 0;

    let score = 0;

    for (const rule of config.rules.filter((r) => r.active)) {
      if (this.evaluateCondition(rule.condition, lead, session)) {
        score += rule.points;
      }
    }

    return Math.max(0, score);
  }

  getScoreCategory(score: number, tenantId: string): 'hot' | 'warm' | 'cold' {
    const config = this.configs.get(tenantId);
    if (!config) return 'cold';

    if (score >= config.thresholds.hot) return 'hot';
    if (score >= config.thresholds.warm) return 'warm';
    return 'cold';
  }

  private evaluateCondition(
    condition: LeadScoringConfig['rules'][0]['condition'],
    lead: LeadData,
    session: SessionAttribution
  ): boolean {
    const { field, operator, value } = condition;
    let fieldValue: string | number;

    switch (field) {
      case 'source':
        fieldValue = lead.source;
        break;
      case 'medium':
        fieldValue = lead.medium || '';
        break;
      case 'campaign':
        fieldValue = lead.campaign || '';
        break;
      case 'pageViews':
        fieldValue = session.pageViews;
        break;
      case 'timeOnSite':
        fieldValue = session.timeOnSite;
        break;
      case 'deviceType':
        fieldValue = session.deviceType || '';
        break;
      default:
        return false;
    }

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(value as string);
      case 'greaterThan':
        return fieldValue > value;
      case 'lessThan':
        return fieldValue < value;
      default:
        return false;
    }
  }
}

/**
 * Phone Click Tracker
 */
export interface PhoneClickEvent {
  id: string;
  tenantId: string;
  sessionId: string;
  phoneNumber: string;
  page: string;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
}

export class PhoneClickTracker {
  private clicks: PhoneClickEvent[] = [];

  trackClick(data: Omit<PhoneClickEvent, 'id' | 'timestamp'>): PhoneClickEvent {
    const click: PhoneClickEvent = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    this.clicks.push(click);
    return click;
  }

  getClicksBySession(sessionId: string): PhoneClickEvent[] {
    return this.clicks.filter((click) => click.sessionId === sessionId);
  }

  getClicksByTenant(tenantId: string): PhoneClickEvent[] {
    return this.clicks.filter((click) => click.tenantId === tenantId);
  }

  getClicksByPhoneNumber(tenantId: string, phoneNumber: string): PhoneClickEvent[] {
    return this.clicks.filter(
      (click) => click.tenantId === tenantId && click.phoneNumber === phoneNumber
    );
  }

  // Clean up old clicks (older than 30 days)
  cleanup(): number {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    const initialLength = this.clicks.length;
    this.clicks = this.clicks.filter((click) => click.timestamp >= cutoff);

    return initialLength - this.clicks.length;
  }
}

// Utility functions
export function extractUTMParameters(url: string): Record<string, string | undefined> {
  const urlObj = new URL(url);
  const params: Record<string, string | undefined> = {};

  params.utmSource = urlObj.searchParams.get('utm_source') || undefined;
  params.utmMedium = urlObj.searchParams.get('utm_medium') || undefined;
  params.utmCampaign = urlObj.searchParams.get('utm_campaign') || undefined;
  params.utmContent = urlObj.searchParams.get('utm_content') || undefined;
  params.utmTerm = urlObj.searchParams.get('utm_term') || undefined;

  return params;
}

export function detectDeviceType(userAgent?: string): 'desktop' | 'mobile' | 'tablet' {
  if (!userAgent) return 'desktop';

  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const tablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);

  if (tablet) return 'tablet';
  if (mobile) return 'mobile';
  return 'desktop';
}

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Validation functions
export function validateLeadData(data: unknown): LeadData {
  return LeadDataSchema.parse(data);
}

export function validateSessionAttribution(data: unknown): SessionAttribution {
  return SessionAttributionSchema.parse(data);
}

export function validateLeadScoringConfig(data: unknown): LeadScoringConfig {
  return LeadScoringConfigSchema.parse(data);
}
