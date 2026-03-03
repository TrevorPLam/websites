#!/usr/bin/env node
/**
 * @file mcp/servers/src/seo-tools.ts
 * @summary MCP server: seo-tools.
 * @description SEO auditing and analysis tools backed by configurable SEO APIs.
 *   Wraps the `fetch` primitive with structured SEO-specific operations for AI agents.
 * @security API keys read from environment only; no keys are logged or returned in tool output.
 * @requirements TODO.md 4-B, MCP-standards
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const SEO_API_BASE = process.env.SEO_API_BASE_URL ?? 'https://api.example.com/seo';
const SEO_API_KEY = process.env.SEO_API_KEY ?? '';
const GSC_TOKEN = process.env.GOOGLE_SEARCH_CONSOLE_TOKEN ?? '';

/** Authenticated fetch wrapper. */
async function apiFetch(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<unknown> {
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

export class SeoToolsServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'seo-tools',
      version: '1.0.0',
    });
    this.registerTools();
  }

  private registerTools(): void {
    // ── audit_site_seo ────────────────────────────────────────────────────────
    this.server.tool(
      'audit_site_seo',
      'Run a comprehensive technical SEO audit for a site URL and return a structured report.',
      {
        siteUrl: z.string().url().describe('Public URL of the site to audit'),
        depth: z
          .enum(['shallow', 'full'])
          .default('shallow')
          .describe('Audit depth: shallow = meta/headers only; full = crawl + content analysis'),
      },
      async ({ siteUrl, depth }) => {
        if (!SEO_API_KEY) {
          return {
            content: [
              {
                type: 'text',
                text: 'SEO_API_KEY is not configured. Set it in your environment to enable SEO audits.',
              },
            ],
          };
        }
        const url = `${SEO_API_BASE}/audit?site=${encodeURIComponent(siteUrl)}&depth=${depth}`;
        const data = await apiFetch(url, SEO_API_KEY);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
    );

    // ── check_meta_tags ───────────────────────────────────────────────────────
    this.server.tool(
      'check_meta_tags',
      'Fetch a page and validate its meta tags (title, description, OG, canonical).',
      {
        pageUrl: z.string().url().describe('URL of the page to inspect'),
      },
      async ({ pageUrl }) => {
        // Fetch the page HTML directly (no API key required)
        const res = await fetch(pageUrl, {
          headers: { 'User-Agent': 'SEO-Tools-MCP/1.0 (meta-tag-checker)' },
        });
        if (!res.ok) {
          return {
            content: [{ type: 'text', text: `Failed to fetch ${pageUrl}: HTTP ${res.status}` }],
          };
        }
        const html = await res.text();

        // Extract relevant tags via simple regex (no DOM parser dependency)
        const extract = (re: RegExp): string => re.exec(html)?.[1]?.trim() ?? '';

        const title = extract(/<title>([^<]*)<\/title>/i);
        const description = extract(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
          || extract(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
        const ogTitle = extract(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
        const ogDescription = extract(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
        const canonical = extract(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);

        const report = {
          url: pageUrl,
          title: title || null,
          titleLength: title.length,
          description: description || null,
          descriptionLength: description.length,
          ogTitle: ogTitle || null,
          ogDescription: ogDescription || null,
          canonical: canonical || null,
          issues: [] as string[],
        };

        if (!title) report.issues.push('Missing <title> tag');
        if (title.length > 60) report.issues.push(`Title too long (${title.length} chars; recommend ≤60)`);
        if (!description) report.issues.push('Missing meta description');
        if (description.length > 160)
          report.issues.push(`Meta description too long (${description.length} chars; recommend ≤160)`);
        if (!canonical) report.issues.push('Missing canonical link');

        return { content: [{ type: 'text', text: JSON.stringify(report, null, 2) }] };
      }
    );

    // ── get_search_rankings ───────────────────────────────────────────────────
    this.server.tool(
      'get_search_rankings',
      'Retrieve keyword search rankings from Google Search Console for a site.',
      {
        siteUrl: z.string().url().describe('Site URL as registered in Google Search Console'),
        query: z.string().optional().describe('Filter by specific keyword query (optional)'),
        startDate: z.string().describe('Start date in YYYY-MM-DD format'),
        endDate: z.string().describe('End date in YYYY-MM-DD format'),
      },
      async ({ siteUrl, query, startDate, endDate }) => {
        if (!GSC_TOKEN) {
          return {
            content: [
              {
                type: 'text',
                text: 'GOOGLE_SEARCH_CONSOLE_TOKEN is not configured.',
              },
            ],
          };
        }

        const body: Record<string, unknown> = {
          startDate,
          endDate,
          dimensions: ['query', 'page'],
          rowLimit: 100,
        };
        if (query) {
          body.dimensionFilterGroups = [
            { filters: [{ dimension: 'query', operator: 'contains', expression: query }] },
          ];
        }

        const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
        const data = await apiFetch(url, GSC_TOKEN, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
    );

    // ── generate_sitemap ──────────────────────────────────────────────────────
    this.server.tool(
      'generate_sitemap',
      'Request sitemap generation or retrieval for a site via the configured SEO API.',
      {
        siteUrl: z.string().url().describe('Public site URL'),
        includeImages: z.boolean().optional().default(false).describe('Include image sitemap entries'),
      },
      async ({ siteUrl, includeImages }) => {
        if (!SEO_API_KEY) {
          return {
            content: [
              {
                type: 'text',
                text: 'SEO_API_KEY is not configured. Set it to enable sitemap generation.',
              },
            ],
          };
        }
        const url = `${SEO_API_BASE}/sitemap?site=${encodeURIComponent(siteUrl)}&include_images=${includeImages}`;
        const data = await apiFetch(url, SEO_API_KEY);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SEO Tools MCP Server running on stdio');
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const srv = new SeoToolsServer();

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));

  srv.run().catch(console.error);
}
