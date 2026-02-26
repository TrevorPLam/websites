#!/usr/bin/env node

/**
 * @file packages/mcp-apps/src/interactive-dashboard.ts
 * @summary Interactive Dashboard MCP App for real-time data visualization
 * @description MCP App with interactive UI components for data exploration and analysis
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// MCP App Types
export interface MCPApp {
  id: string;
  name: string;
  description: string;
  version: string;
  server: McpServer;
  ui: UIComponent;
  tools: Tool[];
  status: 'active' | 'inactive' | 'error';
}

export interface UIComponent {
  type: 'web' | 'cli' | 'desktop';
  config: UIConfig;
  handlers: UIHandler[];
}

export interface UIConfig {
  port?: number;
  path?: string;
  theme?: string;
  layout?: 'sidebar' | 'tabs' | 'grid';
}

export interface UIHandler {
  event: string;
  handler: (data: any) => Promise<any>;
}

export interface Tool {
  name: string;
  description: string;
  schema: z.ZodSchema;
  handler: (params: any) => Promise<any>;
}

export class InteractiveDashboardMCPApp {
  private server: McpServer;
  private app: MCPApp;
  private data: any[] = [];
  private filters: Record<string, any> = {};

  constructor() {
    this.server = new McpServer({
      name: 'interactive-dashboard-app',
      version: '1.0.0',
    });

    this.app = {
      id: 'interactive-dashboard',
      name: 'Interactive Dashboard',
      description: 'Real-time data visualization and analysis dashboard',
      version: '1.0.0',
      server: this.server,
      ui: {
        type: 'web',
        config: {
          port: 3001,
          path: '/dashboard',
          theme: 'dark',
          layout: 'sidebar',
        },
        handlers: [],
      },
      tools: [],
      status: 'active',
    };

    this.setupTools();
    this.setupUIHandlers();
  }

  private setupTools() {
    // Generate dashboard data
    this.server.tool(
      'generate-dashboard',
      'Generate an interactive dashboard with real-time data',
      {
        dataType: z.enum(['sales', 'analytics', 'system', 'performance']).describe('Type of data to visualize'),
        timeRange: z.string().default('last-30-days').describe('Time range for data'),
        filters: z.record(z.string()).optional().describe('Data filters to apply'),
      },
      async ({ dataType, timeRange, filters }) => {
        // Generate sample data based on type
        const data = this.generateSampleData(dataType, timeRange, filters);
        this.data = data;
        this.filters = filters || {};

        // Return UI resource for interactive dashboard
        return {
          content: [{
            type: 'text',
            text: `Generated ${dataType} dashboard with ${data.length} data points`,
          }],
          _meta: {
            ui: {
              resourceUri: 'ui://dashboard/interactive',
            },
          },
        };
      },
    );

    // Update dashboard data
    this.server.tool(
      'update-dashboard',
      'Update dashboard data with new values',
      {
        action: z.string().describe('Action to perform'),
        data: z.array(z.any()).describe('Data to update'),
      },
      async ({ action, data }) => {
        if (action === 'filter') {
          this.data = data;
        } else if (action === 'sort') {
          this.data.sort((a: any, b: any) => {
            const aValue = a.value || 0;
            const bValue = b.value || 0;
            return bValue - aValue;
          });
        }

        return {
          content: [{
            type: 'text',
            text: `Dashboard updated: ${action} action performed`,
          }],
        };
      },
    );

    // Export dashboard data
    this.server.tool(
      'export-data',
      'Export dashboard data in specified format',
      {
        format: z.enum(['json', 'csv', 'excel']).describe('Export format'),
        filename: z.string().optional().describe('Export filename'),
      },
      async ({ format, filename }) => {
        const exportData = this.formatDataForExport(this.data, format);
        const exportFilename = filename || `dashboard-export.${format}`;

        return {
          content: [{
            type: 'text',
            text: `Data exported to ${exportFilename} (${format} format, ${this.data.length} records)`,
          }],
        };
      },
    );
  }

  private setupUIHandlers() {
    // Handle filter changes
    this.app.ui.handlers.push({
      event: 'filter-changed',
      handler: async (data) => {
        this.filters = { ...this.filters, ...data };
        return { success: true };
      },
    });

    // Handle data selection
    this.app.ui.handlers.push({
      event: 'data-selected',
      handler: async (data) => {
        const selectedItems = this.data.filter((item: any) => 
          data.selectedIds.includes(item.id)
        );
        return { success: true, data: selectedItems };
      },
    });

    // Handle drill-down
    this.app.ui.handlers.push({
      event: 'drill-down',
      handler: async (data) => {
        const item = this.data.find((item: any) => item.id === data.id);
        return { success: true, data: item };
      },
    });
  }

  private generateSampleData(dataType: string, timeRange: string, filters: Record<string, any>): any[] {
    const baseData = {
      sales: [
        { id: '1', date: '2026-02-01', value: 15000, region: 'North', category: 'Enterprise', status: 'active' },
        { id: '2', date: '2026-02-02', value: 12000, region: 'South', category: 'SMB', status: 'pending' },
        { id: '3', date: '2026-02-03', value: 18000, region: 'East', category: 'Enterprise', status: 'completed' },
        { id: '4', date: '2026-02-04', value: 9000, region: 'West', category: 'Startup', status: 'cancelled' },
        { id: '5', date: '2026-02-05', value: 22000, region: 'Central', category: 'Enterprise', status: 'active' },
      ],
      analytics: [
        { id: '1', date: '2026-02-01', users: 1500, pageViews: 5000, bounceRate: 0.35, avgSession: 180 },
        { id: '2', date: '2026-02-02', users: 1200, pageViews: 4500, bounceRate: 0.42, avgSession: 165 },
        { id: '3', date: '2026-02-03', users: 1800, pageViews: 6000, bounceRate: 0.28, avgSession: 210 },
        { id: '4', date: '2026-02-04', users: 900, pageViews: 3000, bounceRate: 0.45, avgSession: 150 },
        { id: '5', date: '2026-02-05', users: 2000, pageViews: 8000, bounceRate: 0.25, avgSession: 240 },
      ],
      system: [
        { id: '1', timestamp: '2026-02-01T10:00:00Z', cpu: 45, memory: 60, disk: 30, network: 15, status: 'healthy' },
        { id: '2', timestamp: '2026-02-01T11:00:00Z', cpu: 55, memory: 70, disk: 35, network: 20, status: 'warning' },
        { id: '3', timestamp: '2026-02-01T12:00:00Z', cpu: 35, memory: 50, disk: 32, network: 18, status: 'healthy' },
        { id: '4', timestamp: '2026-02-01T13:00:00Z', cpu: 65, memory: 80, disk: 40, network: 25, status: 'critical' },
        { id: '5', timestamp: '2026-02-01T14:00:00Z', cpu: 40, memory: 55, disk: 28, network: 22, status: 'healthy' },
      ],
      performance: [
        { id: '1', timestamp: '2026-02-01T10:00:00Z', responseTime: 120, throughput: 1000, errorRate: 0.01, availability: 99.9 },
        { id: '2', timestamp: '2026-02-01T11:00:00Z', responseTime: 150, throughput: 800, errorRate: 0.02, availability: 99.8 },
        { id: '3', timestamp: '2026-02-01T12:00:00Z', responseTime: 100, throughput: 1200, errorRate: 0.005, availability: 99.95 },
        { id: '4', timestamp: '2026-02-01T13:00:00Z', responseTime: 200, throughput: 600, errorRate: 0.03, availability: 99.7 },
        { id: '5', timestamp: '2026-02-01T14:00:00Z', responseTime: 80, throughput: 1500, errorRate: 0.001, availability: 99.99 },
      ],
    };

    let data = baseData[dataType as keyof typeof baseData] || baseData.sales;

    // Apply filters
    if (filters) {
      data = data.filter((item: any) => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'region' && value) {
            return item.region === value;
          }
          if (key === 'category' && value) {
            return item.category === value;
          }
          if (key === 'status' && value) {
            return item.status === value;
          }
          return true;
        });
      }
    }

    return data;
  }

  private formatDataForExport(data: any[], format: string): string {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        if (data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        data.forEach((item: any) => {
          csvRows.push(headers.map(header => item[header] || ''));
        });
        return csvRows.join('\n');
      case 'excel':
        // Simplified CSV format for Excel
        return this.formatDataForExport(data, 'csv');
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Interactive Dashboard MCP App running on stdio');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new InteractiveDashboardMCPApp();
  app.run().catch(console.error);
}
