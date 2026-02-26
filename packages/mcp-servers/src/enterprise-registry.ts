#!/usr/bin/env node

/**
 * @file packages/mcp-servers/src/enterprise-registry.ts
 * @summary Enterprise MCP Registry and Discovery Service
 * @description Centralized registry for MCP servers, tools, and services with enterprise discovery capabilities
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import crypto from 'crypto';

// Registry Types
interface MCPServer {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  owner: string;
  repository: string;
  documentation: string;
  license: string;
  status: 'active' | 'inactive' | 'deprecated' | 'beta';
  capabilities: ServerCapability[];
  dependencies: string[];
  compatibility: CompatibilityInfo;
  metrics: ServerMetrics;
  security: SecurityInfo;
  compliance: ComplianceInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface ServerCapability {
  type: 'tool' | 'resource' | 'prompt';
  name: string;
  description: string;
  schema: any;
  examples: string[];
  parameters: ParameterInfo[];
}

interface ParameterInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
}

interface CompatibilityInfo {
  mcpVersion: string;
  platforms: string[];
  languages: string[];
  frameworks: string[];
  dependencies: string[];
}

interface ServerMetrics {
  downloads: number;
  stars: number;
  forks: number;
  issues: number;
  lastRelease: Date;
  maintenance: 'active' | 'minimal' | 'none';
}

interface SecurityInfo {
  vulnerabilities: SecurityVulnerability[];
  scanDate: Date;
  securityScore: number;
  recommendations: string[];
}

interface SecurityVulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fixedIn?: string;
  cve?: string;
}

interface ComplianceInfo {
  frameworks: string[];
  certifications: string[];
  auditDate: Date;
  status: 'compliant' | 'non-compliant' | 'pending';
}

interface RegistryQuery {
  category?: string;
  tags?: string[];
  owner?: string;
  status?: string;
  compatibility?: string[];
  security?: {
    minScore?: number;
    maxVulnerabilities?: number;
  };
  compliance?: string[];
  sortBy?: 'name' | 'downloads' | 'stars' | 'updated';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

interface DiscoveryService {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'hybrid';
  endpoint: string;
  authentication: AuthenticationConfig;
  syncSchedule: string;
  lastSync: Date;
  status: 'active' | 'inactive' | 'error';
  metrics: ServiceMetrics;
}

interface AuthenticationConfig {
  type: 'none' | 'api-key' | 'oauth' | 'certificate';
  credentials?: Record<string, string>;
}

interface ServiceMetrics {
  totalServers: number;
  syncTime: number;
  errorRate: number;
  lastSync: Date;
}

export class EnterpriseRegistry {
  private server: McpServer;
  private mcpServers: Map<string, MCPServer> = new Map();
  private discoveryServices: Map<string, DiscoveryService> = new Map();
  private categories: Map<string, Category> = new Map();
  private usageAnalytics: Map<string, UsageAnalytics> = new Map();

  constructor() {
    this.server = new McpServer({
      name: 'enterprise-registry',
      version: '1.0.0',
    });

    this.initializeCategories();
    this.initializeDiscoveryServices();
    this.setupRegistryTools();
  }

  private initializeCategories() {
    const defaultCategories: Category[] = [
      {
        id: 'analytics',
        name: 'Analytics & Data',
        description: 'Servers for data analysis, visualization, and reporting',
        icon: '📊',
        count: 0,
      },
      {
        id: 'automation',
        name: 'Automation & Workflow',
        description: 'Servers for task automation and workflow management',
        icon: '⚙️',
        count: 0,
      },
      {
        id: 'communication',
        name: 'Communication & Collaboration',
        description: 'Servers for messaging, email, and collaboration tools',
        icon: '💬',
        count: 0,
      },
      {
        id: 'database',
        name: 'Database & Storage',
        description: 'Servers for database operations and storage management',
        icon: '🗄️',
        count: 0,
      },
      {
        id: 'development',
        name: 'Development & Testing',
        description: 'Servers for software development and testing',
        icon: '🛠️',
        count: 0,
      },
      {
        id: 'security',
        name: 'Security & Compliance',
        description: 'Servers for security monitoring and compliance',
        icon: '🔒',
        count: 0,
      },
      {
        id: 'monitoring',
        name: 'Monitoring & Observability',
        description: 'Servers for system monitoring and observability',
        icon: '📈',
        count: 0,
      },
      {
        id: 'ai-ml',
        name: 'AI & Machine Learning',
        description: 'Servers for AI and machine learning operations',
        icon: '🤖',
        count: 0,
      },
    ];

    defaultCategories.forEach(category => this.categories.set(category.id, category));
  }

  private initializeDiscoveryServices() {
    const defaultServices: DiscoveryService[] = [
      {
        id: 'github-mcp',
        name: 'GitHub MCP Registry',
        type: 'external',
        endpoint: 'https://api.github.com/search/repositories',
        authentication: {
          type: 'api-key',
          credentials: { token: '${GITHUB_TOKEN}' },
        },
        syncSchedule: '0 */6 * * *', // Every 6 hours
        lastSync: new Date(),
        status: 'active',
        metrics: {
          totalServers: 0,
          syncTime: 0,
          errorRate: 0,
          lastSync: new Date(),
        },
      },
      {
        id: 'internal-registry',
        name: 'Internal MCP Registry',
        type: 'internal',
        endpoint: 'https://registry.company.com/api/mcp',
        authentication: {
          type: 'oauth',
          credentials: { client_id: '${CLIENT_ID}', client_secret: '${CLIENT_SECRET}' },
        },
        syncSchedule: '0 */2 * * *', // Every 2 hours
        lastSync: new Date(),
        status: 'active',
        metrics: {
          totalServers: 0,
          syncTime: 0,
          errorRate: 0,
          lastSync: new Date(),
        },
      },
    ];

    defaultServices.forEach(service => this.discoveryServices.set(service.id, service));
  }

  private setupRegistryTools() {
    // Server registration
    this.server.tool(
      'register-mcp-server',
      'Register a new MCP server in the enterprise registry',
      {
        server: z.object({
          name: z.string(),
          description: z.string(),
          version: z.string(),
          category: z.string(),
          tags: z.array(z.string()),
          owner: z.string(),
          repository: z.string(),
          documentation: z.string(),
          license: z.string(),
          capabilities: z.array(z.object({
            type: z.enum(['tool', 'resource', 'prompt']),
            name: z.string(),
            description: z.string(),
            schema: z.any(),
            examples: z.array(z.string()),
            parameters: z.array(z.object({
              name: z.string(),
              type: z.string(),
              required: z.boolean(),
              description: z.string(),
              defaultValue: z.any().optional(),
            })),
          })),
          compatibility: z.object({
            mcpVersion: z.string(),
            platforms: z.array(z.string()),
            languages: z.array(z.string()),
            frameworks: z.array(z.string()),
            dependencies: z.array(z.string()),
          }),
        }).describe('MCP server information'),
      },
      async ({ server }) => {
        const serverId = crypto.randomUUID();
        
        const mcpServer: MCPServer = {
          id: serverId,
          ...server,
          status: 'active',
          metrics: {
            downloads: 0,
            stars: 0,
            forks: 0,
            issues: 0,
            lastRelease: new Date(),
            maintenance: 'active',
          },
          security: {
            vulnerabilities: [],
            scanDate: new Date(),
            securityScore: 100,
            recommendations: [],
          },
          compliance: {
            frameworks: [],
            certifications: [],
            auditDate: new Date(),
            status: 'pending',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        this.mcpServers.set(serverId, mcpServer);

        // Update category count
        const category = this.categories.get(server.category);
        if (category) {
          category.count++;
        }

        return {
          content: [{
            type: 'text',
            text: `MCP server registered: ${serverId}\nName: ${server.name}\nCategory: ${server.category}\nStatus: active`,
          }],
        };
      },
    );

    // Server discovery
    this.server.tool(
      'discover-mcp-servers',
      'Discover MCP servers based on criteria',
      {
        query: z.object({
          category: z.string().optional(),
          tags: z.array(z.string()).optional(),
          owner: z.string().optional(),
          status: z.string().optional(),
          compatibility: z.array(z.string()).optional(),
          security: z.object({
            minScore: z.number().optional(),
            maxVulnerabilities: z.number().optional(),
          }).optional(),
          compliance: z.array(z.string()).optional(),
          sortBy: z.enum(['name', 'downloads', 'stars', 'updated']).default('name'),
          sortOrder: z.enum(['asc', 'desc']).default('asc'),
          limit: z.number().default(20),
          offset: z.number().default(0),
        }).describe('Discovery query parameters'),
      },
      async ({ query }) => {
        const results = await this.searchServers(query);
        
        return {
          content: [{
            type: 'text',
            text: this.formatDiscoveryResults(results, query),
          }],
        };
      },
    );

    // Server details
    this.server.tool(
      'get-server-details',
      'Get detailed information about a specific MCP server',
      {
        serverId: z.string().describe('Server ID'),
        includeMetrics: z.boolean().default(true).describe('Include usage metrics'),
        includeSecurity: z.boolean().default(true).describe('Include security information'),
        includeCompliance: z.boolean().default(true).describe('Include compliance information'),
      },
      async ({ serverId, includeMetrics, includeSecurity, includeCompliance }) => {
        const server = this.mcpServers.get(serverId);
        if (!server) {
          return {
            content: [{ type: 'text', text: 'Server not found' }],
          };
        }

        const details = this.formatServerDetails(server, includeMetrics, includeSecurity, includeCompliance);

        return {
          content: [{ type: 'text', text: details }],
        };
      },
    );

    // Category management
    this.server.tool(
      'manage-categories',
      'Manage server categories',
      {
        action: z.enum(['list', 'create', 'update', 'delete']).describe('Category management action'),
        categoryId: z.string().optional().describe('Category ID for update/delete actions'),
        categoryData: z.object({
          name: z.string(),
          description: z.string(),
          icon: z.string(),
        }).optional().describe('Category data for create/update actions'),
      },
      async ({ action, categoryId, categoryData }) => {
        switch (action) {
          case 'list':
            const categories = Array.from(this.categories.values());
            const summary = categories.map(cat => 
              `${cat.icon} ${cat.name} (${cat.id}): ${cat.description} - ${cat.count} servers`
            ).join('\n');

            return {
              content: [{ type: 'text', text: `Categories (${categories.length}):\n\n${summary}` }],
            };

          case 'create':
            if (!categoryData) {
              return {
                content: [{ type: 'text', text: 'Category data required for create action' }],
              };
            }

            const newCategory: Category = {
              id: crypto.randomUUID(),
              ...categoryData,
              count: 0,
            };

            this.categories.set(newCategory.id, newCategory);

            return {
              content: [{ type: 'text', text: `Category created: ${newCategory.id} - ${newCategory.name}` }],
            };

          case 'update':
            if (!categoryId || !categoryData) {
              return {
                content: [{ type: 'text', text: 'Category ID and data required for update action' }],
              };
            }

            const existingCategory = this.categories.get(categoryId);
            if (!existingCategory) {
              return {
                content: [{ type: 'text', text: 'Category not found' }],
              };
            }

            Object.assign(existingCategory, categoryData);

            return {
              content: [{ type: 'text', text: `Category updated: ${categoryId}` }],
            };

          case 'delete':
            if (!categoryId) {
              return {
                content: [{ type: 'text', text: 'Category ID required for delete action' }],
              };
            }

            const deleted = this.categories.delete(categoryId);
            return {
              content: [{ type: 'text', text: deleted ? `Category deleted: ${categoryId}` : 'Category not found' }],
            };

          default:
            return {
              content: [{ type: 'text', text: 'Invalid action' }],
            };
        }
      },
    );

    // Discovery service management
    this.server.tool(
      'manage-discovery-services',
      'Manage external discovery services',
      {
        action: z.enum(['list', 'create', 'update', 'delete', 'sync']).describe('Service management action'),
        serviceId: z.string().optional().describe('Service ID for update/delete/sync actions'),
        serviceData: z.object({
          name: z.string(),
          type: z.enum(['internal', 'external', 'hybrid']),
          endpoint: z.string(),
          authentication: z.object({
            type: z.enum(['none', 'api-key', 'oauth', 'certificate']),
            credentials: z.record(z.string()).optional(),
          }),
          syncSchedule: z.string(),
        }).optional().describe('Service data for create/update actions'),
      },
      async ({ action, serviceId, serviceData }) => {
        switch (action) {
          case 'list':
            const services = Array.from(this.discoveryServices.values());
            const summary = services.map(service => 
              `${service.name} (${service.id}) - ${service.type} - ${service.status} - Last sync: ${service.lastSync.toISOString()}`
            ).join('\n');

            return {
              content: [{ type: 'text', text: `Discovery Services (${services.length}):\n\n${summary}` }],
            };

          case 'create':
            if (!serviceData) {
              return {
                content: [{ type: 'text', text: 'Service data required for create action' }],
              };
            }

            const newService: DiscoveryService = {
              id: crypto.randomUUID(),
              ...serviceData,
              lastSync: new Date(),
              status: 'active',
              metrics: {
                totalServers: 0,
                syncTime: 0,
                errorRate: 0,
                lastSync: new Date(),
              },
            };

            this.discoveryServices.set(newService.id, newService);

            return {
              content: [{ type: 'text', text: `Discovery service created: ${newService.id} - ${newService.name}` }],
            };

          case 'sync':
            if (!serviceId) {
              return {
                content: [{ type: 'text', text: 'Service ID required for sync action' }],
              };
            }

            const service = this.discoveryServices.get(serviceId);
            if (!service) {
              return {
                content: [{ type: 'text', text: 'Service not found' }],
              };
            }

            const syncResult = await this.syncDiscoveryService(service);

            return {
              content: [{
                type: 'text',
                text: `Discovery service synced: ${serviceId}\nServers discovered: ${syncResult.serversDiscovered}\nSync time: ${syncResult.syncTime}ms`,
              }],
            };

          default:
            return {
              content: [{ type: 'text', text: 'Invalid action' }],
            };
        }
      },
    );

    // Usage analytics
    this.server.tool(
      'get-usage-analytics',
      'Get usage analytics for MCP servers',
      {
        timeRange: z.string().default('last-30-days').describe('Time range for analytics'),
        serverId: z.string().optional().describe('Specific server ID'),
        groupBy: z.enum(['category', 'owner', 'status']).default('category').describe('Grouping dimension'),
        metrics: z.array(z.enum(['downloads', 'stars', 'forks', 'issues'])).default(['downloads', 'stars']).describe('Metrics to include'),
      },
      async ({ timeRange, serverId, groupBy, metrics }) => {
        const analytics = await this.generateUsageAnalytics(timeRange, serverId, groupBy, metrics);

        return {
          content: [{ type: 'text', text: this.formatAnalyticsReport(analytics) }],
        };
      },
    );

    // Registry statistics
    this.server.tool(
      'get-registry-statistics',
      'Get comprehensive registry statistics',
      {
        includeDetails: z.boolean().default(false).describe('Include detailed breakdowns'),
      },
      async ({ includeDetails }) => {
        const stats = this.generateRegistryStatistics(includeDetails);

        return {
          content: [{ type: 'text', text: this.formatStatisticsReport(stats) }],
        };
      },
    );
  }

  private async searchServers(query: RegistryQuery): Promise<{ servers: MCPServer[]; total: number; hasMore: boolean }> {
    let servers = Array.from(this.mcpServers.values());

    // Apply filters
    if (query.category) {
      servers = servers.filter(s => s.category === query.category);
    }

    if (query.tags && query.tags.length > 0) {
      servers = servers.filter(s => query.tags!.some(tag => s.tags.includes(tag)));
    }

    if (query.owner) {
      servers = servers.filter(s => s.owner === query.owner);
    }

    if (query.status) {
      servers = servers.filter(s => s.status === query.status);
    }

    if (query.compatibility && query.compatibility.length > 0) {
      servers = servers.filter(s => 
        query.compatibility!.some(comp => s.compatibility.platforms.includes(comp))
      );
    }

    if (query.security) {
      if (query.security.minScore) {
        servers = servers.filter(s => s.security.securityScore >= query.security!.minScore!);
      }
      if (query.security.maxVulnerabilities) {
        servers = servers.filter(s => s.security.vulnerabilities.length <= query.security!.maxVulnerabilities!);
      }
    }

    if (query.compliance && query.compliance.length > 0) {
      servers = servers.filter(s => 
        query.compliance!.some(comp => s.compliance.frameworks.includes(comp))
      );
    }

    // Sort
    servers.sort((a, b) => {
      let comparison = 0;
      
      switch (query.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'downloads':
          comparison = b.metrics.downloads - a.metrics.downloads;
          break;
        case 'stars':
          comparison = b.metrics.stars - a.metrics.stars;
          break;
        case 'updated':
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
          break;
      }

      return query.sortOrder === 'desc' ? -comparison : comparison;
    });

    const total = servers.length;
    const offset = query.offset || 0;
    const limit = query.limit || 20;
    const paginatedServers = servers.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      servers: paginatedServers,
      total,
      hasMore,
    };
  }

  private formatDiscoveryResults(results: { servers: MCPServer[]; total: number; hasMore: boolean }, query: RegistryQuery): string {
    const summary = [
      `Discovery Results: ${results.servers.length} of ${results.total} servers`,
      `Sort: ${query.sortBy} ${query.sortOrder}`,
      `Page: ${Math.floor((query.offset || 0) / (query.limit || 20)) + 1}`,
      '',
      'Servers:',
      ...results.servers.map(server => [
        `${server.name} (${server.id})`,
        `  Category: ${server.category}`,
        `  Owner: ${server.owner}`,
        `  Version: ${server.version}`,
        `  Status: ${server.status}`,
        `  Downloads: ${server.metrics.downloads}`,
        `  Stars: ${server.metrics.stars}`,
        `  Tags: ${server.tags.join(', ')}`,
        `  Description: ${server.description}`,
        '',
      ]).flat(),
    ];

    if (results.hasMore) {
      summary.push('... more results available');
    }

    return summary.join('\n');
  }

  private formatServerDetails(server: MCPServer, includeMetrics: boolean, includeSecurity: boolean, includeCompliance: boolean): string {
    const details = [
      `Server Details: ${server.name}`,
      `ID: ${server.id}`,
      `Version: ${server.version}`,
      `Category: ${server.category}`,
      `Owner: ${server.owner}`,
      `Status: ${server.status}`,
      `License: ${server.license}`,
      `Repository: ${server.repository}`,
      `Documentation: ${server.documentation}`,
      `Created: ${server.createdAt.toISOString()}`,
      `Updated: ${server.updatedAt.toISOString()}`,
      '',
      'Description:',
      server.description,
      '',
      'Tags:',
      ...server.tags.map(tag => `  - ${tag}`),
      '',
      'Capabilities:',
      ...server.capabilities.map(cap => [
        `${cap.type.toUpperCase()}: ${cap.name}`,
        `  Description: ${cap.description}`,
        `  Parameters: ${cap.parameters.length}`,
        `  Examples: ${cap.examples.length}`,
        '',
      ]).flat(),
      '',
      'Compatibility:',
      `  MCP Version: ${server.compatibility.mcpVersion}`,
      `  Platforms: ${server.compatibility.platforms.join(', ')}`,
      `  Languages: ${server.compatibility.languages.join(', ')}`,
      `  Frameworks: ${server.compatibility.frameworks.join(', ')}`,
      '',
      'Dependencies:',
      ...server.dependencies.map(dep => `  - ${dep}`),
    ];

    if (includeMetrics) {
      details.push(
        '',
        'Metrics:',
        `  Downloads: ${server.metrics.downloads}`,
        `  Stars: ${server.metrics.stars}`,
        `  Forks: ${server.metrics.forks}`,
        `  Issues: ${server.metrics.issues}`,
        `  Last Release: ${server.metrics.lastRelease.toISOString()}`,
        `  Maintenance: ${server.metrics.maintenance}`,
      );
    }

    if (includeSecurity) {
      details.push(
        '',
        'Security:',
        `  Security Score: ${server.security.securityScore}/100`,
        `  Scan Date: ${server.security.scanDate.toISOString()}`,
        `  Vulnerabilities: ${server.security.vulnerabilities.length}`,
        ...server.security.vulnerabilities.map(vuln => [
          `  ${vuln.severity.toUpperCase()}: ${vuln.description}`,
          `    CVE: ${vuln.cve || 'N/A'}`,
          `    Fixed In: ${vuln.fixedIn || 'N/A'}`,
        ]).flat(),
        '',
        'Recommendations:',
        ...server.security.recommendations.map(rec => `  - ${rec}`),
      );
    }

    if (includeCompliance) {
      details.push(
        '',
        'Compliance:',
        `  Status: ${server.compliance.status.toUpperCase()}`,
        `  Audit Date: ${server.compliance.auditDate.toISOString()}`,
        `  Frameworks: ${server.compliance.frameworks.join(', ')}`,
        `  Certifications: ${server.compliance.certifications.join(', ')}`,
      );
    }

    return details.join('\n');
  }

  private async syncDiscoveryService(service: DiscoveryService): Promise<{ serversDiscovered: number; syncTime: number }> {
    const startTime = Date.now();
    let serversDiscovered = 0;

    try {
      // Simulate synchronization
      if (service.type === 'external') {
        // Simulate external API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        serversDiscovered = Math.floor(Math.random() * 50) + 10;
      }

      service.lastSync = new Date();
      service.metrics.totalServers = serversDiscovered;
      service.metrics.syncTime = Date.now() - startTime;
      service.metrics.errorRate = 0;
      service.metrics.lastSync = new Date();

    } catch (error) {
      service.metrics.errorRate = 1;
      service.status = 'error';
    }

    return {
      serversDiscovered,
      syncTime: Date.now() - startTime,
    };
  }

  private async generateUsageAnalytics(timeRange: string, serverId?: string, groupBy: string = 'category', metrics: string[] = ['downloads', 'stars']): Promise<any> {
    // Simulate analytics generation
    const servers = serverId ? 
      [this.mcpServers.get(serverId)].filter(Boolean) as MCPServer[] :
      Array.from(this.mcpServers.values());

    const grouped = servers.reduce((acc, server) => {
      const key = groupBy === 'category' ? server.category : 
                 groupBy === 'owner' ? server.owner : 
                 server.status;
      
      if (!acc[key]) {
        acc[key] = { count: 0, downloads: 0, stars: 0, forks: 0, issues: 0 };
      }
      
      acc[key].count++;
      acc[key].downloads += server.metrics.downloads;
      acc[key].stars += server.metrics.stars;
      acc[key].forks += server.metrics.forks;
      acc[key].issues += server.metrics.issues;
      
      return acc;
    }, {} as any);

    return {
      timeRange,
      groupBy,
      metrics,
      data: grouped,
      total: servers.length,
    };
  }

  private formatAnalyticsReport(analytics: any): string {
    const report = [
      `Usage Analytics Report`,
      `Time Range: ${analytics.timeRange}`,
      `Grouped By: ${analytics.groupBy}`,
      `Total Servers: ${analytics.total}`,
      '',
      'Analytics:',
      ...Object.entries(analytics.data).map(([key, data]: [string, any]) => [
        `${key}:`,
        `  Count: ${data.count}`,
        `  Downloads: ${data.downloads}`,
        `  Stars: ${data.stars}`,
        `  Forks: ${data.forks}`,
        `  Issues: ${data.issues}`,
        '',
      ]).flat(),
    ];

    return report.join('\n');
  }

  private generateRegistryStatistics(includeDetails: boolean): any {
    const servers = Array.from(this.mcpServers.values());
    const categories = Array.from(this.categories.values());
    const services = Array.from(this.discoveryServices.values());

    const stats = {
      overview: {
        totalServers: servers.length,
        totalCategories: categories.length,
        totalServices: services.length,
        activeServers: servers.filter(s => s.status === 'active').length,
        deprecatedServers: servers.filter(s => s.status === 'deprecated').length,
      },
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        count: cat.count,
        percentage: servers.length > 0 ? (cat.count / servers.length * 100).toFixed(1) : '0',
      })),
      security: {
        averageScore: servers.reduce((sum, s) => sum + s.security.securityScore, 0) / servers.length,
        totalVulnerabilities: servers.reduce((sum, s) => sum + s.security.vulnerabilities.length, 0),
        criticalVulnerabilities: servers.reduce((sum, s) => 
          sum + s.security.vulnerabilities.filter(v => v.severity === 'critical').length, 0),
      },
      metrics: {
        totalDownloads: servers.reduce((sum, s) => sum + s.metrics.downloads, 0),
        totalStars: servers.reduce((sum, s) => sum + s.metrics.stars, 0),
        totalForks: servers.reduce((sum, s) => sum + s.metrics.forks, 0),
        totalIssues: servers.reduce((sum, s) => sum + s.metrics.issues, 0),
      },
    };

    if (includeDetails) {
      // Add detailed breakdowns
      stats.topServers = servers
        .sort((a, b) => b.metrics.downloads - a.metrics.downloads)
        .slice(0, 10)
        .map(s => ({ name: s.name, downloads: s.metrics.downloads, stars: s.metrics.stars }));

      stats.recentActivity = servers
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 10)
        .map(s => ({ name: s.name, updated: s.updatedAt.toISOString(), status: s.status }));
    }

    return stats;
  }

  private formatStatisticsReport(stats: any): string {
    const report = [
      'Registry Statistics Report',
      '',
      'Overview:',
      `  Total Servers: ${stats.overview.totalServers}`,
      `  Total Categories: ${stats.overview.totalCategories}`,
      `  Total Services: ${stats.overview.totalServices}`,
      `  Active Servers: ${stats.overview.activeServers}`,
      `  Deprecated Servers: ${stats.overview.deprecatedServers}`,
      '',
      'Categories:',
      ...stats.categories.map((cat: any) => 
        `  ${cat.name}: ${cat.count} servers (${cat.percentage}%)`
      ),
      '',
      'Security:',
      `  Average Security Score: ${stats.security.averageScore.toFixed(1)}/100`,
      `  Total Vulnerabilities: ${stats.security.totalVulnerabilities}`,
      `  Critical Vulnerabilities: ${stats.security.criticalVulnerabilities}`,
      '',
      'Metrics:',
      `  Total Downloads: ${stats.metrics.totalDownloads.toLocaleString()}`,
      `  Total Stars: ${stats.metrics.totalStars.toLocaleString()}`,
      `  Total Forks: ${stats.metrics.totalForks.toLocaleString()}`,
      `  Total Issues: ${stats.metrics.totalIssues.toLocaleString()}`,
    ];

    if (stats.topServers) {
      report.push(
        '',
        'Top Servers by Downloads:',
        ...stats.topServers.map((server: any, index: number) => 
          `  ${index + 1}. ${server.name}: ${server.downloads.toLocaleString()} downloads, ${server.stars.toLocaleString()} stars`
        )
      );
    }

    if (stats.recentActivity) {
      report.push(
        '',
        'Recent Activity:',
        ...stats.recentActivity.map((activity: any) => 
          `  ${activity.name} - ${activity.status} - ${activity.updated}`
        )
      );
    }

    return report.join('\n');
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Enterprise Registry MCP Server running on stdio');
  }
}

// Supporting Types
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

interface UsageAnalytics {
  serverId: string;
  timeRange: string;
  downloads: number;
  stars: number;
  forks: number;
  issues: number;
  lastUpdated: Date;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const registry = new EnterpriseRegistry();
  registry.run().catch(console.error);
}
