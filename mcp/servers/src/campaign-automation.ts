#!/usr/bin/env node
/**
 * @file mcp/servers/src/campaign-automation.ts
 * @summary MCP server: campaign-automation.
 * @description Marketing campaign lifecycle management via configurable campaign platform APIs.
 *   Wraps the `fetch` primitive to provide structured campaign CRUD and scheduling for AI agents.
 * @security API keys read from environment only; campaign data stored in-memory for the server lifetime.
 * @requirements TODO.md 4-B, MCP-standards
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import crypto from 'crypto';

const CAMPAIGN_API_BASE = process.env.CAMPAIGN_API_BASE_URL ?? 'https://api.example.com/campaigns';
const CAMPAIGN_API_KEY = process.env.CAMPAIGN_API_KEY ?? '';

/** Authenticated fetch wrapper. */
async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<unknown> {
  if (!CAMPAIGN_API_KEY) {
    throw new Error('CAMPAIGN_API_KEY is not configured.');
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${CAMPAIGN_API_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// In-memory store for when the API is not configured (dev/test mode).
// ⚠ NOTE: Data is intentionally non-persistent and will be lost on server restart.
//   Configure CAMPAIGN_API_KEY + CAMPAIGN_API_BASE_URL to use a real backend.
interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  channel: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  budget?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const localStore = new Map<string, Campaign>();

export class CampaignAutomationServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'campaign-automation',
      version: '1.0.0',
    });
    this.registerTools();
  }

  private registerTools(): void {
    // ── create_campaign ───────────────────────────────────────────────────────
    this.server.tool(
      'create_campaign',
      'Create a new marketing campaign. Returns the created campaign object.',
      {
        tenantId: z.string().uuid().describe('Tenant UUID'),
        name: z.string().describe('Campaign name'),
        channel: z
          .enum(['email', 'social', 'search', 'display', 'sms', 'push'])
          .describe('Marketing channel'),
        budget: z.number().positive().optional().describe('Campaign budget in USD'),
        startDate: z.string().optional().describe('Start date in YYYY-MM-DD format'),
        endDate: z.string().optional().describe('End date in YYYY-MM-DD format'),
        metadata: z.record(z.unknown()).optional().describe('Additional campaign properties'),
      },
      async ({ tenantId, name, channel, budget, startDate, endDate, metadata = {} }) => {
        if (CAMPAIGN_API_KEY) {
          const data = await apiFetch(`${CAMPAIGN_API_BASE}`, {
            method: 'POST',
            body: JSON.stringify({ tenantId, name, channel, budget, startDate, endDate, metadata }),
          });
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        // Fallback: in-memory store
        const campaign: Campaign = {
          id: crypto.randomUUID(),
          tenantId,
          name,
          channel,
          status: 'draft',
          startDate,
          endDate,
          budget,
          metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStore.set(campaign.id, campaign);
        return { content: [{ type: 'text', text: JSON.stringify(campaign, null, 2) }] };
      }
    );

    // ── get_campaign_status ───────────────────────────────────────────────────
    this.server.tool(
      'get_campaign_status',
      'Retrieve the current status and metadata for a campaign.',
      {
        campaignId: z.string().describe('Campaign identifier'),
      },
      async ({ campaignId }) => {
        if (CAMPAIGN_API_KEY) {
          const data = await apiFetch(`${CAMPAIGN_API_BASE}/${encodeURIComponent(campaignId)}`);
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        const campaign = localStore.get(campaignId);
        if (!campaign) {
          return { content: [{ type: 'text', text: `Campaign '${campaignId}' not found.` }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(campaign, null, 2) }] };
      }
    );

    // ── update_campaign ───────────────────────────────────────────────────────
    this.server.tool(
      'update_campaign',
      'Update campaign settings (name, budget, dates, metadata).',
      {
        campaignId: z.string().describe('Campaign identifier'),
        updates: z
          .object({
            name: z.string().optional(),
            budget: z.number().positive().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            metadata: z.record(z.unknown()).optional(),
          })
          .describe('Fields to update'),
      },
      async ({ campaignId, updates }) => {
        if (CAMPAIGN_API_KEY) {
          const data = await apiFetch(`${CAMPAIGN_API_BASE}/${encodeURIComponent(campaignId)}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
          });
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        const campaign = localStore.get(campaignId);
        if (!campaign) {
          return { content: [{ type: 'text', text: `Campaign '${campaignId}' not found.` }] };
        }
        Object.assign(campaign, updates, { updatedAt: new Date().toISOString() });
        localStore.set(campaignId, campaign);
        return { content: [{ type: 'text', text: JSON.stringify(campaign, null, 2) }] };
      }
    );

    // ── pause_campaign ────────────────────────────────────────────────────────
    this.server.tool(
      'pause_campaign',
      'Pause an active campaign immediately.',
      {
        campaignId: z.string().describe('Campaign identifier'),
        reason: z.string().optional().describe('Optional reason for pausing'),
      },
      async ({ campaignId, reason }) => {
        if (CAMPAIGN_API_KEY) {
          const data = await apiFetch(`${CAMPAIGN_API_BASE}/${encodeURIComponent(campaignId)}/pause`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
          });
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        const campaign = localStore.get(campaignId);
        if (!campaign) {
          return { content: [{ type: 'text', text: `Campaign '${campaignId}' not found.` }] };
        }
        campaign.status = 'paused';
        campaign.updatedAt = new Date().toISOString();
        return {
          content: [
            {
              type: 'text',
              text: `Campaign '${campaign.name}' paused.${reason ? ` Reason: ${reason}` : ''}`,
            },
          ],
        };
      }
    );

    // ── schedule_campaign ─────────────────────────────────────────────────────
    this.server.tool(
      'schedule_campaign',
      'Schedule a draft campaign to start at a specific date and time.',
      {
        campaignId: z.string().describe('Campaign identifier'),
        startDate: z.string().describe('Scheduled start date in YYYY-MM-DD format'),
        startTime: z.string().optional().default('09:00').describe('Scheduled start time in HH:MM format (UTC)'),
      },
      async ({ campaignId, startDate, startTime }) => {
        if (CAMPAIGN_API_KEY) {
          const data = await apiFetch(`${CAMPAIGN_API_BASE}/${encodeURIComponent(campaignId)}/schedule`, {
            method: 'POST',
            body: JSON.stringify({ startDate, startTime }),
          });
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        const campaign = localStore.get(campaignId);
        if (!campaign) {
          return { content: [{ type: 'text', text: `Campaign '${campaignId}' not found.` }] };
        }
        campaign.status = 'scheduled';
        campaign.startDate = startDate;
        campaign.updatedAt = new Date().toISOString();
        return {
          content: [
            {
              type: 'text',
              text: `Campaign '${campaign.name}' scheduled for ${startDate} at ${startTime} UTC.`,
            },
          ],
        };
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Campaign Automation MCP Server running on stdio');
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const srv = new CampaignAutomationServer();

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));

  srv.run().catch(console.error);
}
