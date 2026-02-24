import { renderToBuffer } from '@react-pdf/renderer';
import { z } from 'zod';

import { WeeklyReportDocument, type WeeklyReportProps } from '@repo/reports';

export const ReportGenerationPayloadSchema = z.object({
  tenantId: z.string().min(1),
});

export type ReportGenerationPayload = z.infer<typeof ReportGenerationPayloadSchema>;

export interface TenantReportConfig {
  businessName: string;
  logoUrl?: string;
  primaryColor: string;
  ownerEmail: string;
  weeklyReportEnabled: boolean;
}

export interface LeadRow {
  name: string;
  email: string;
  score: number;
  source?: string;
  createdAt: string;
}

export interface BookingRow {
  status: string;
}

export interface ReportDataGateway {
  getTenantConfig(tenantId: string): Promise<TenantReportConfig | null>;
  getWeeklyLeads(tenantId: string, fromIso: string): Promise<LeadRow[]>;
  getPriorWeekLeadsCount(tenantId: string, fromIso: string, toIso: string): Promise<number>;
  getWeeklyBookings(tenantId: string, fromIso: string): Promise<BookingRow[]>;
}

export interface ReportStorageGateway {
  uploadPdf(path: string, content: Buffer): Promise<void>;
  createSignedUrl(path: string, expiresInSeconds: number): Promise<string | null>;
}

export interface ReportEmailGateway {
  sendWeeklyReportEmail(input: {
    tenantId: string;
    to: string;
    reportPeriod: string;
    totalLeads: number;
    qualifiedLeads: number;
    totalBookings: number;
    priorWeekLeads: number;
    downloadUrl: string;
    businessName: string;
  }): Promise<void>;
}

const formatPeriod = (startIso: string, end: Date): string => {
  const start = new Date(startIso);

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )}`;
};

const getDayLabels = (): Array<{ day: string; dateString: string }> => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      day: labels[date.getDay()] ?? 'N/A',
      dateString: date.toDateString(),
    };
  });
};

export async function generateWeeklyReportForTenant(
  payload: ReportGenerationPayload,
  deps: {
    data: ReportDataGateway;
    storage: ReportStorageGateway;
    email: ReportEmailGateway;
    now?: Date;
  }
): Promise<'skipped' | 'sent'> {
  const validated = ReportGenerationPayloadSchema.parse(payload);
  const now = deps.now ?? new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const tenant = await deps.data.getTenantConfig(validated.tenantId);
  if (!tenant?.weeklyReportEnabled || !tenant.ownerEmail) {
    return 'skipped';
  }

  const [leads, priorWeekLeads, bookings] = await Promise.all([
    deps.data.getWeeklyLeads(validated.tenantId, weekAgo),
    deps.data.getPriorWeekLeadsCount(validated.tenantId, twoWeeksAgo, weekAgo),
    deps.data.getWeeklyBookings(validated.tenantId, weekAgo),
  ]);

  const qualified = leads.filter((lead) => lead.score >= 70);
  const warm = leads.filter((lead) => lead.score >= 40 && lead.score < 70);
  const cold = leads.filter((lead) => lead.score < 40);
  const avgScore =
    leads.length > 0
      ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)
      : 0;

  const sourceCounts: Record<string, number> = {};
  leads.forEach((lead) => {
    const source = lead.source ?? 'unknown';
    sourceCounts[source] = (sourceCounts[source] ?? 0) + 1;
  });

  const sourceBreakdown: WeeklyReportProps['sourceBreakdown'] = Object.entries(sourceCounts)
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / Math.max(1, leads.length)) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const dailyLabels = getDayLabels();
  const weeklyTrend: WeeklyReportProps['weeklyTrend'] = dailyLabels.map((label) => ({
    day: label.day,
    count: leads.filter((lead) => new Date(lead.createdAt).toDateString() === label.dateString)
      .length,
  }));

  const reportPeriod = formatPeriod(weekAgo, now);

  const pdfBuffer = await renderToBuffer(
    WeeklyReportDocument({
      businessName: tenant.businessName,
      logoUrl: tenant.logoUrl,
      primaryColor: tenant.primaryColor,
      reportPeriod: reportPeriod,
      stats: {
        totalLeads: leads.length,
        qualifiedLeads: qualified.length,
        warmLeads: warm.length,
        coldLeads: cold.length,
        totalBookings: bookings.length,
        completedBookings: bookings.filter((booking) => booking.status === 'completed').length,
        newThisWeek: leads.length,
        avgScore,
      },
      topLeads: leads.slice(0, 8).map((lead) => ({
        name: lead.name,
        email: lead.email,
        score: lead.score,
        source: lead.source ?? 'unknown',
        date: lead.createdAt,
      })),
      sourceBreakdown: sourceBreakdown,
      weeklyTrend: weeklyTrend,
    })
  );

  const fileName = `reports/${validated.tenantId}/weekly-${now.toISOString().split('T')[0]}.pdf`;
  await deps.storage.uploadPdf(fileName, pdfBuffer);

  const downloadUrl = await deps.storage.createSignedUrl(fileName, 7 * 24 * 60 * 60);
  if (!downloadUrl) {
    return 'skipped';
  }

  await deps.email.sendWeeklyReportEmail({
    tenantId: validated.tenantId,
    to: tenant.ownerEmail,
    reportPeriod,
    totalLeads: leads.length,
    qualifiedLeads: qualified.length,
    totalBookings: bookings.length,
    priorWeekLeads,
    downloadUrl,
    businessName: tenant.businessName,
  });

  return 'sent';
}
