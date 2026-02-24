import { Redis } from '@upstash/redis';
import type { SiteConfig } from '@repo/config-schema';
import type { AttributionData } from '@repo/analytics/session-attribution';

const redis = Redis.fromEnv();

// ============================================================================
// SCORING MODEL (0–100)
// Designed to mimic intent signals used by enterprise marketing automation
// without requiring a third-party service
// ============================================================================

export type ScoringInput = {
  tenantId: string;
  // Behavioral signals
  sessionPageViews: number;
  sessionDurationSeconds: number;
  hasPhoneClick: boolean;
  hasBookingClick: boolean;
  hasLiveChat: boolean;
  isRepeatVisitor: boolean;
  // Attribution signals
  attribution: {
    firstTouch: AttributionData | null;
    lastTouch: AttributionData | null;
  };
  // Demographic/firmographic signals (from form data)
  hasPhone: boolean;
  messageLength: number; // Characters — longer = higher intent
  // Time signals
  submittedAt: Date;
};

// Source value map (calibrated from industry benchmarks)
const SOURCE_SCORES: Record<string, number> = {
  // Paid intent-rich sources = highest score
  'google-ads': 20,
  google: 20,
  cpc: 20,
  ppc: 20,

  // Social paid
  'facebook-ads': 15,
  'instagram-ads': 15,
  'linkedin-ads': 18,

  // Organic (moderate intent — user found you naturally)
  organic: 10,
  seo: 10,

  // Referral (trusted recommendation)
  referral: 12,

  // Email (warm — existing relationship)
  email: 14,

  // Direct (returning, knows the brand)
  direct: 8,

  // Social organic (lower intent)
  social: 5,
  facebook: 5,
  instagram: 5,

  // Default (unknown source)
  default: 5,
};

export function scoreLeadSync(input: ScoringInput): number {
  let score = 0;

  // ── Behavioral signals ──────────────────────────────────────────────────
  // Each page view beyond 1 adds points (shows research intent)
  score += Math.min(input.sessionPageViews * 3, 15);

  // Session duration (2+ minutes = engaged visitor)
  if (input.sessionDurationSeconds >= 120) score += 5;
  if (input.sessionDurationSeconds >= 300) score += 5;
  if (input.sessionDurationSeconds >= 600) score += 5;

  // High-intent actions
  if (input.hasPhoneClick) score += 20; // Called = highest intent
  if (input.hasBookingClick) score += 15; // Booked = very high intent
  if (input.hasLiveChat) score += 10; // Chatted = engaged

  // Return visitor (knows the brand)
  if (input.isRepeatVisitor) score += 5;

  // ── Attribution signals ──────────────────────────────────────────────────
  const lastTouchSource = input.attribution.lastTouch?.utmSource?.toLowerCase() ?? 'default';
  const lastTouchMedium = input.attribution.lastTouch?.utmMedium?.toLowerCase() ?? '';

  // Source value
  const sourceScore =
    SOURCE_SCORES[lastTouchSource] ?? SOURCE_SCORES[lastTouchMedium] ?? SOURCE_SCORES.default;
  score += sourceScore;

  // Campaign-level boost (branded campaign = higher intent)
  const campaign = input.attribution.lastTouch?.utmCampaign?.toLowerCase() ?? '';
  if (campaign.includes('brand') || campaign.includes('emergency') || campaign.includes('urgent')) {
    score += 5;
  }

  // ── Form quality signals ──────────────────────────────────────────────────
  // Phone number provided = willing to be called
  if (input.hasPhone) score += 10;

  // Message length proxy for intent (50+ chars = serious inquiry)
  if (input.messageLength >= 50) score += 5;
  if (input.messageLength >= 150) score += 5;
  if (input.messageLength >= 300) score += 5;

  // ── Time-of-day signal ──────────────────────────────────────────────────
  // Business hours submission = more likely to be a genuine business inquiry
  const hour = input.submittedAt.getHours();
  const isBusinessHours = hour >= 8 && hour < 18;
  if (isBusinessHours) score += 3;

  // Cap at 100
  return Math.min(Math.round(score), 100);
}

// Async version: fetches behavioral data from Redis session store
export async function scoreLead(params: {
  tenantId: string;
  sessionId: string;
  attribution: ScoringInput['attribution'];
  hasPhone: boolean;
  messageLength: number;
}): Promise<number> {
  const sessionKey = `session:${params.sessionId}`;

  // Read behavioral data accumulated by client-side tracking
  const sessionData = await redis.hgetall<{
    pageViews: string;
    durationSeconds: string;
    hasPhoneClick: string;
    hasBookingClick: string;
    hasLiveChat: string;
    isRepeatVisitor: string;
  }>(sessionKey);

  return scoreLeadSync({
    tenantId: params.tenantId,
    sessionPageViews: Number(sessionData?.pageViews ?? 1),
    sessionDurationSeconds: Number(sessionData?.durationSeconds ?? 0),
    hasPhoneClick: sessionData?.hasPhoneClick === 'true',
    hasBookingClick: sessionData?.hasBookingClick === 'true',
    hasLiveChat: sessionData?.hasLiveChat === 'true',
    isRepeatVisitor: sessionData?.isRepeatVisitor === 'true',
    attribution: params.attribution,
    hasPhone: params.hasPhone,
    messageLength: params.messageLength,
    submittedAt: new Date(),
  });
}

// ============================================================================
// ROUTING LOGIC
// ============================================================================

export type LeadTier = 'qualified' | 'warm' | 'cold';

export function classifyLead(score: number): LeadTier {
  if (score >= 70) return 'qualified';
  if (score >= 40) return 'warm';
  return 'cold';
}
