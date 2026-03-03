#!/usr/bin/env node
/**
 * @file mcp/servers/src/marketing-analytics.ts
 * @summary MCP server: marketing-analytics.
 * @description Provides marketing analytics tools backed by Tinybird / GA4 APIs.
 *   Wraps the `fetch` primitive to expose structured analytics queries to AI agents.
 * @security Reads TINYBIRD_API_KEY / GA4_API_KEY from environment only; never logs token values.
 * @requirements TODO.md 4-B, MCP-standards
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const TINYBIRD_BASE = process.env.TINYBIRD_BASE_URL ?? 'https://api.tinybird.co/v0';
const TINYBIRD_TOKEN = process.env.TINYBIRD_API_KEY ?? '';
const GA4_PROPERTY = process.env.GA4_PROPERTY_ID ?? '';
const GA4_TOKEN = process.env.GA4_API_KEY ?? '';

/** Thin authenticated fetch helper. */
async function apiFetch(url: string, token: string, options: RequestInit = {}): Promise<unknown> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export class MarketingAnalyticsServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'marketing-analytics',
      version: '1.0.0',
    });
    this.registerTools();
  }

  private registerTools(): void {
    // ── query_analytics ─────────────────────────────────────────────────────
    this.server.tool(
      'query_analytics',
      'Query marketing analytics events from the Tinybird data platform.',
      {
        pipe: z.string().describe('Tinybird pipe name to query (e.g. platform_events)'),
        params: z.record(z.string()).optional().describe('Query parameters passed to the pipe'),
      },
      async ({ pipe, params = {} }) => {
        if (!TINYBIRD_TOKEN) {
          return { content: [{ type: 'text', text: 'TINYBIRD_API_KEY is not configured.' }] };
        }
        const qs = new URLSearchParams(params).toString();
        const url = `${TINYBIRD_BASE}/pipes/${encodeURIComponent(pipe)}.json${qs ? `?${qs}` : ''}`;
        const data = await apiFetch(url, TINYBIRD_TOKEN);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
    );

    // ── get_campaign_metrics ─────────────────────────────────────────────────
    this.server.tool(
      'get_campaign_metrics',
      'Retrieve campaign performance metrics (impressions, clicks, conversions) for a date range.',
      {
        campaignId: z.string().describe('Campaign identifier'),
        startDate: z.string().describe('Start date in YYYY-MM-DD format'),
        endDate: z.string().describe('End date in YYYY-MM-DD format'),
      },
      async ({ campaignId, startDate, endDate }) => {
        if (!TINYBIRD_TOKEN) {
          return { content: [{ type: 'text', text: 'TINYBIRD_API_KEY is not configured.' }] };
        }
        const url = `${TINYBIRD_BASE}/pipes/campaign_metrics.json?campaign_id=${encodeURIComponent(campaignId)}&start=${startDate}&end=${endDate}`;
        const data = await apiFetch(url, TINYBIRD_TOKEN);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
    );

    // ── track_event ──────────────────────────────────────────────────────────
    this.server.tool(
      'track_event',
      'Ingest a single analytics event into the Tinybird platform_events datasource.',
      {
        tenantId: z.string().uuid().describe('Tenant UUID (required for multi-tenant isolation)'),
        eventName: z.string().describe('Event name (e.g. page_view, form_submit)'),
        properties: z.record(z.unknown()).optional().describe('Arbitrary event properties'),
      },
      async ({ tenantId, eventName, properties = {} }) => {
        if (!TINYBIRD_TOKEN) {
          return { content: [{ type: 'text', text: 'TINYBIRD_API_KEY is not configured.' }] };
        }
        const event = {
          tenant_id: tenantId,
          event_name: eventName,
          timestamp: new Date().toISOString(),
          ...properties,
        };
        const url = `${TINYBIRD_BASE}/events?name=platform_events`;
        await apiFetch(url, TINYBIRD_TOKEN, {
          method: 'POST',
          body: JSON.stringify(event),
          headers: { 'Content-Type': 'application/ndjson' },
        });
        return { content: [{ type: 'text', text: `Event '${eventName}' tracked for tenant ${tenantId}.` }] };
      }
    );

    // ── get_dashboard_data ───────────────────────────────────────────────────
    this.server.tool(
      'get_dashboard_data',
      'Fetch aggregated dashboard data (sessions, conversions, revenue) for a tenant.',
      {
        tenantId: z.string().uuid().describe('Tenant UUID'),
        period: z
          .enum(['today', 'last-7-days', 'last-30-days', 'last-90-days'])
          .default('last-30-days')
          .describe('Aggregation period'),
      },
      async ({ tenantId, period }) => {
        if (GA4_TOKEN && GA4_PROPERTY) {
          // Prefer GA4 when available.
          // `customEvent:tenant_id` is GA4's standard format for custom event parameters
          // (prefix `customEvent:` + parameter name). See GA4 Data API docs.
          const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY}:runReport`;
          const body = JSON.stringify({
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'sessions' }, { name: 'conversions' }],
            dimensionFilter: {
              filter: { fieldName: 'customEvent:tenant_id', stringFilter: { value: tenantId } },
            },
          });
          const data = await apiFetch(url, GA4_TOKEN, { method: 'POST', body });
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        if (TINYBIRD_TOKEN) {
          const url = `${TINYBIRD_BASE}/pipes/dashboard_summary.json?tenant_id=${encodeURIComponent(tenantId)}&period=${period}`;
          const data = await apiFetch(url, TINYBIRD_TOKEN);
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        return {
          content: [
            {
              type: 'text',
              text: 'No analytics backend configured. Set TINYBIRD_API_KEY or GA4_API_KEY + GA4_PROPERTY_ID.',
            },
          ],
        };
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Marketing Analytics MCP Server running on stdio');
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const srv = new MarketingAnalyticsServer();

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));

  srv.run().catch(console.error);
}
