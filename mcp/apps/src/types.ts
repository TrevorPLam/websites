/**
 * @file packages/mcp-apps/src/types.ts
 * @summary Common types for MCP applications
 * @description Shared type definitions for MCP apps and UI components
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
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

export interface DashboardConfig {
  refreshInterval?: number;
  maxDataPoints?: number;
  theme?: 'light' | 'dark' | 'auto';
  layout?: 'grid' | 'list' | 'cards';
}

export interface DataPoint {
  timestamp: Date;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  data: DataPoint[];
  title?: string;
  description?: string;
}
