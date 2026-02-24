import { get } from '@vercel/edge-config';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export interface ABVariant {
  id: string;
  weight: number;
  description?: string;
}

export interface ABExperiment {
  id: string;
  name: string;
  tenantId: string | 'global';
  path: string;
  variants: ABVariant[];
  status: 'active' | 'paused' | 'concluded';
  startedAt: string;
  concludedAt?: string;
  winnerVariantId?: string;
}

type ABConversionType = 'lead_submitted' | 'phone_clicked' | 'booking_created';

const redis = Redis.fromEnv();
const COOKIE_NAME = 'ab_assignments';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function applyABTests(
  request: NextRequest,
  response: NextResponse,
  tenantId: string
): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  let experiments: ABExperiment[] = [];
  try {
    const allExperiments = await get<ABExperiment[]>('abExperiments');
    experiments = (allExperiments ?? []).filter(
      (experiment) =>
        experiment.status === 'active' &&
        (experiment.tenantId === 'global' || experiment.tenantId === tenantId) &&
        pathMatchesPattern(pathname, experiment.path)
    );
  } catch {
    return response;
  }

  if (experiments.length === 0) {
    return response;
  }

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  let assignments = decodeAssignmentsCookie(cookieValue);
  let assignmentsChanged = false;

  for (const experiment of experiments) {
    if (assignments[experiment.id]) {
      continue;
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0';
    const variantId = assignVariant(ip, experiment.id, experiment.variants);

    assignments[experiment.id] = variantId;
    assignmentsChanged = true;

    redis.hincrby(`ab:${experiment.id}:assignments`, variantId, 1).catch(() => undefined);
  }

  if (assignmentsChanged) {
    response.cookies.set(COOKIE_NAME, encodeAssignmentsCookie(assignments), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  }

  response.headers.set('X-AB-Assignments', JSON.stringify(assignments));
  return response;
}

function decodeAssignmentsCookie(cookieValue?: string): Record<string, string> {
  if (!cookieValue) {
    return {};
  }

  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          ([experimentId, variantId]) =>
            typeof experimentId === 'string' && typeof variantId === 'string'
        )
        .map(([experimentId, variantId]) => [experimentId, String(variantId)])
    );
  } catch {
    return {};
  }
}

function encodeAssignmentsCookie(assignments: Record<string, string>): string {
  return Buffer.from(JSON.stringify(assignments), 'utf8').toString('base64');
}

export function assignVariant(ip: string, experimentId: string, variants: ABVariant[]): string {
  if (variants.length === 0) {
    return 'control';
  }

  const seed = `${ip}:${experimentId}`;
  let hash = 5381;

  for (const character of seed) {
    hash = (hash * 33) ^ character.charCodeAt(0);
  }

  const bucket = Math.abs(hash) % 100;

  let cumulativeWeight = 0;
  for (const variant of variants) {
    cumulativeWeight += variant.weight;
    if (bucket < cumulativeWeight) {
      return variant.id;
    }
  }

  return variants[0]?.id ?? 'control';
}

export function pathMatchesPattern(pathname: string, pattern: string): boolean {
  if (pattern === '*') {
    return true;
  }

  if (pattern === pathname) {
    return true;
  }

  if (pattern.endsWith('*')) {
    return pathname.startsWith(pattern.slice(0, -1));
  }

  return false;
}

export async function getABVariant(experimentId: string): Promise<string | null> {
  const headerStore = await headers();
  const assignmentsHeader = headerStore.get('X-AB-Assignments');

  if (!assignmentsHeader) {
    return null;
  }

  try {
    const assignments = JSON.parse(assignmentsHeader) as Record<string, unknown>;
    const variantId = assignments[experimentId];

    return typeof variantId === 'string' ? variantId : null;
  } catch {
    return null;
  }
}

export async function trackABConversion(
  experimentId: string,
  variantId: string,
  conversionType: ABConversionType
): Promise<void> {
  await redis.hincrby(`ab:${experimentId}:conversions:${conversionType}`, variantId, 1);
}

export interface ABExperimentResult {
  variantId: string;
  assigned: number;
  leads: number;
  phoneClicks: number;
  leadConversionRate: number;
  phoneConversionRate: number;
}

export async function getExperimentResults(experimentId: string): Promise<ABExperimentResult[]> {
  const [assignments, leadConversions, phoneConversions] = await Promise.all([
    redis.hgetall<Record<string, number>>(`ab:${experimentId}:assignments`),
    redis.hgetall<Record<string, number>>(`ab:${experimentId}:conversions:lead_submitted`),
    redis.hgetall<Record<string, number>>(`ab:${experimentId}:conversions:phone_clicked`),
  ]);

  const variants = Object.keys(assignments ?? {});

  return variants.map((variantId) => {
    const assigned = Number(assignments?.[variantId] ?? 0);
    const leads = Number(leadConversions?.[variantId] ?? 0);
    const phoneClicks = Number(phoneConversions?.[variantId] ?? 0);

    return {
      variantId,
      assigned,
      leads,
      phoneClicks,
      leadConversionRate: assigned > 0 ? (leads / assigned) * 100 : 0,
      phoneConversionRate: assigned > 0 ? (phoneClicks / assigned) * 100 : 0,
    };
  });
}
